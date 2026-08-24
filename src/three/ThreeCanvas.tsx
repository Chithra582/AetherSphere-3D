import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RealmId, CameraMode, WorldSettings, TelemetryData } from '../types';
import { REALMS } from '../data/realms';
import { ThreeSceneBuilder } from './ThreeSceneBuilder';
import { soundEngine } from '../audio/soundEngine';

interface ThreeCanvasProps {
  currentRealm: RealmId;
  cameraMode: CameraMode;
  settings: WorldSettings;
  activeWaypointIndex: number;
  onSelectNode: (nodeId: string, name: string) => void;
  onUpdateTelemetry: (data: TelemetryData) => void;
  onWaypointCaption?: (caption: string) => void;
  onScreenshotCaptureReady?: (captureFn: () => string) => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  currentRealm,
  cameraMode,
  settings,
  activeWaypointIndex,
  onSelectNode,
  onUpdateTelemetry,
  onWaypointCaption,
  onScreenshotCaptureReady,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Interaction refs
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const sphericalRef = useRef({ radius: 22, phi: Math.PI / 3, theta: 0 });
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0, 0));
  const mouseNormalizedRef = useRef(new THREE.Vector2(0, 0));
  const raycasterRef = useRef(new THREE.Raycaster());
  const interactiveMeshesRef = useRef<THREE.Object3D[]>([]);
  const animatedObjectsRef = useRef<Array<{ obj: THREE.Object3D; update: (d: number, e: number) => void }>>([]);
  const hoveredMeshRef = useRef<THREE.Object3D | null>(null);

  // First-person keys
  const keysPressedRef = useRef<Record<string, boolean>>({});

  // Particle bursts on click
  const burstParticlesRef = useRef<Array<{ mesh: THREE.Points; life: number; maxLife: number; velocities: Float32Array }>>([]);

  // Telemetry frames
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  // Setup renderer and scene
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    const realmData = REALMS[currentRealm];
    camera.position.set(...realmData.cameraInitPos);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true, // Crucial for instant screenshot captures!
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Provide screenshot capture callback
    if (onScreenshotCaptureReady) {
      onScreenshotCaptureReady(() => {
        if (!rendererRef.current) return '';
        return rendererRef.current.domElement.toDataURL('image/png');
      });
    }

    // Build initial realm
    const { interactiveMeshes, animatedObjects } = ThreeSceneBuilder.buildRealm(currentRealm, scene);
    interactiveMeshesRef.current = interactiveMeshes;
    animatedObjectsRef.current = animatedObjects;

    // Initialize spherical coords based on camera position
    const camPos = camera.position;
    const dist = camPos.distanceTo(cameraTargetRef.current);
    sphericalRef.current.radius = dist;
    sphericalRef.current.phi = Math.acos(camPos.y / dist);
    sphericalRef.current.theta = Math.atan2(camPos.x, camPos.z);

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(containerRef.current);

    // Keyboard handlers for First-Person
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressedRef.current[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.code] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1) * (settings.speed || 1);
      const elapsed = clock.getElapsedTime() * (settings.speed || 1);

      // 1. Update animated objects in realm
      animatedObjectsRef.current.forEach((item) => {
        item.update(delta, elapsed);
      });

      // 2. Update burst particles
      for (let i = burstParticlesRef.current.length - 1; i >= 0; i--) {
        const burst = burstParticlesRef.current[i];
        burst.life += delta;
        const positions = (burst.mesh.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
        for (let p = 0; p < positions.length; p += 3) {
          positions[p] += burst.velocities[p] * delta;
          positions[p + 1] += burst.velocities[p + 1] * delta;
          positions[p + 2] += burst.velocities[p + 2] * delta;
        }
        burst.mesh.geometry.attributes.position.needsUpdate = true;
        (burst.mesh.material as THREE.PointsMaterial).opacity = 1 - (burst.life / burst.maxLife);

        if (burst.life >= burst.maxLife) {
          scene.remove(burst.mesh);
          burst.mesh.geometry.dispose();
          (burst.mesh.material as THREE.Material).dispose();
          burstParticlesRef.current.splice(i, 1);
        }
      }

      // 3. Camera Modes Update
      if (cameraRef.current) {
        if (cameraMode === 'cinematic') {
          // Spline smooth interpolation through waypoints
          const waypoints = REALMS[currentRealm].cinematicWaypoints;
          const currentWp = waypoints[activeWaypointIndex % waypoints.length];
          if (currentWp) {
            const targetPos = new THREE.Vector3(...currentWp.pos);
            const targetLook = new THREE.Vector3(...currentWp.target);
            cameraRef.current.position.lerp(targetPos, delta * 1.5);
            cameraTargetRef.current.lerp(targetLook, delta * 2.0);
            cameraRef.current.lookAt(cameraTargetRef.current);
            if (onWaypointCaption) {
              onWaypointCaption(currentWp.caption);
            }
          }
        } else if (cameraMode === 'firstperson') {
          // WASD drone explorer controls
          const speed = (settings.droneSpeed || 15) * delta;
          const forward = new THREE.Vector3();
          cameraRef.current.getWorldDirection(forward);
          const right = new THREE.Vector3().crossVectors(forward, cameraRef.current.up).normalize();

          if (keysPressedRef.current['KeyW'] || keysPressedRef.current['ArrowUp']) {
            cameraRef.current.position.addScaledVector(forward, speed);
          }
          if (keysPressedRef.current['KeyS'] || keysPressedRef.current['ArrowDown']) {
            cameraRef.current.position.addScaledVector(forward, -speed);
          }
          if (keysPressedRef.current['KeyA'] || keysPressedRef.current['ArrowLeft']) {
            cameraRef.current.position.addScaledVector(right, -speed);
          }
          if (keysPressedRef.current['KeyD'] || keysPressedRef.current['ArrowRight']) {
            cameraRef.current.position.addScaledVector(right, speed);
          }
          if (keysPressedRef.current['Space'] || keysPressedRef.current['KeyE']) {
            cameraRef.current.position.y += speed * 0.8;
          }
          if (keysPressedRef.current['ShiftLeft'] || keysPressedRef.current['KeyQ']) {
            cameraRef.current.position.y -= speed * 0.8;
          }
        } else if (cameraMode === 'gyro') {
          // Parallax tilt based on mouse
          const radius = sphericalRef.current.radius;
          const targetX = Math.sin(sphericalRef.current.theta + mouseNormalizedRef.current.x * 0.4) * Math.sin(sphericalRef.current.phi) * radius;
          const targetY = Math.cos(sphericalRef.current.phi - mouseNormalizedRef.current.y * 0.3) * radius;
          const targetZ = Math.cos(sphericalRef.current.theta + mouseNormalizedRef.current.x * 0.4) * Math.sin(sphericalRef.current.phi) * radius;

          cameraRef.current.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), delta * 3.0);
          cameraRef.current.lookAt(cameraTargetRef.current);
        } else {
          // Standard Orbit Mode with auto-rotation if enabled
          if (settings.autorotate && !isDraggingRef.current) {
            sphericalRef.current.theta += delta * 0.25;
          }

          const radius = sphericalRef.current.radius;
          const phi = sphericalRef.current.phi;
          const theta = sphericalRef.current.theta;

          const posX = radius * Math.sin(phi) * Math.sin(theta);
          const posY = radius * Math.cos(phi);
          const posZ = radius * Math.sin(phi) * Math.cos(theta);

          cameraRef.current.position.lerp(new THREE.Vector3(posX, posY, posZ), delta * 6.0);
          cameraRef.current.lookAt(cameraTargetRef.current);
        }
      }

      // 4. Raycasting on hover
      if (cameraRef.current && interactiveMeshesRef.current.length > 0) {
        raycasterRef.current.setFromCamera(mouseNormalizedRef.current, cameraRef.current);
        const intersects = raycasterRef.current.intersectObjects(interactiveMeshesRef.current, true);

        if (intersects.length > 0) {
          const hit = intersects[0].object;
          if (hoveredMeshRef.current !== hit) {
            hoveredMeshRef.current = hit;
            document.body.style.cursor = 'pointer';
          }
        } else {
          if (hoveredMeshRef.current) {
            hoveredMeshRef.current = null;
            document.body.style.cursor = 'default';
          }
        }
      }

      // Render scene
      renderer.render(scene, camera);

      // FPS & Telemetry
      frameCountRef.current++;
      const now = performance.now();
      if (now - lastTimeRef.current >= 500) {
        const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
        const frameTime = (now - lastTimeRef.current) / frameCountRef.current;
        onUpdateTelemetry({
          fps,
          frameTime: Number(frameTime.toFixed(1)),
          geometries: renderer.info.memory.geometries,
          triangles: renderer.info.render.triangles,
          drawCalls: renderer.info.render.calls,
          textures: renderer.info.memory.textures,
        });
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      renderer.dispose();
    };
  }, [currentRealm]);

  // Handle realm change
  useEffect(() => {
    if (!sceneRef.current || !cameraRef.current) return;
    const { interactiveMeshes, animatedObjects } = ThreeSceneBuilder.buildRealm(currentRealm, sceneRef.current);
    interactiveMeshesRef.current = interactiveMeshes;
    animatedObjectsRef.current = animatedObjects;

    // Reset camera position smoothly
    const realmData = REALMS[currentRealm];
    cameraRef.current.position.set(...realmData.cameraInitPos);
    cameraTargetRef.current.set(...realmData.cameraTarget);

    const dist = cameraRef.current.position.distanceTo(cameraTargetRef.current);
    sphericalRef.current.radius = dist;
    sphericalRef.current.phi = Math.PI / 3;
    sphericalRef.current.theta = 0;
  }, [currentRealm]);

  // Wireframe toggle
  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material;
        if (Array.isArray(mat)) {
          mat.forEach((m) => ((m as THREE.MeshStandardMaterial).wireframe = settings.wireframe));
        } else if (mat) {
          (mat as THREE.MeshStandardMaterial).wireframe = settings.wireframe;
        }
      }
    });
  }, [settings.wireframe]);

  // Helper to spawn interactive particle bursts
  const triggerParticleBurst = (pos: THREE.Vector3, colorHex = 0x00f0ff) => {
    if (!sceneRef.current) return;
    const pCount = 120;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const velocities = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = pos.x;
      pPos[i * 3 + 1] = pos.y;
      pPos[i * 3 + 2] = pos.z;

      const speed = 4 + Math.random() * 8;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random());
      const sinPhi = Math.sin(phi);

      velocities[i * 3] = speed * r * sinPhi * Math.cos(theta);
      velocities[i * 3 + 1] = speed * r * sinPhi * Math.sin(theta);
      velocities[i * 3 + 2] = speed * r * Math.cos(phi);
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.28,
      color: colorHex,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
    });

    const mesh = new THREE.Points(pGeo, pMat);
    sceneRef.current.add(mesh);

    burstParticlesRef.current.push({
      mesh,
      life: 0,
      maxLife: 1.2,
      velocities,
    });
  };

  // Mouse & Touch interaction handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseNormalizedRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseNormalizedRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };

    if (cameraMode === 'firstperson' && cameraRef.current) {
      cameraRef.current.rotation.y -= deltaX * 0.003;
      cameraRef.current.rotation.x -= deltaY * 0.003;
    } else {
      // Orbit drag
      sphericalRef.current.theta -= deltaX * 0.006;
      sphericalRef.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, sphericalRef.current.phi - deltaY * 0.006));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;

    // Raycast on click
    if (cameraRef.current && interactiveMeshesRef.current.length > 0) {
      raycasterRef.current.setFromCamera(mouseNormalizedRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(interactiveMeshesRef.current, true);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const obj = hit.object;
        const id = obj.userData?.id || 'node_' + Math.floor(Math.random() * 1000);
        const name = obj.userData?.name || 'Cosmic Artifact';

        soundEngine.playEnergyPulseSFX();
        triggerParticleBurst(hit.point, currentRealm === 'cyberpunk' ? 0x00f0ff : currentRealm === 'celestial' ? 0xa855f7 : currentRealm === 'abyss' ? 0x10b981 : 0xf59e0b);
        onSelectNode(id, name);
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    sphericalRef.current.radius = Math.max(5, Math.min(60, sphericalRef.current.radius + e.deltaY * 0.02));
  };

  return (
    <div
      id="three-viewport-container"
      ref={containerRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing touch-none select-none overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
    />
  );
};
