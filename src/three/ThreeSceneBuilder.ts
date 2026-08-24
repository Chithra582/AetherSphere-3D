import * as THREE from 'three';
import { RealmId } from '../types';

// Helper to generate dynamic procedural textures without relying on external images
export function createGlowTexture(color: string = '#ffffff'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.2, color);
  gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.2)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function createGridTexture(mainColor = '#00f0ff', bgColor = '#050714'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = mainColor;
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, 256, 256);

  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
  ctx.beginPath();
  for (let i = 32; i < 256; i += 32) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 256);
    ctx.moveTo(0, i);
    ctx.lineTo(256, i);
  }
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(20, 20);
  return texture;
}

export function createSkyscraperTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#0a0d1a';
  ctx.fillRect(0, 0, 128, 256);

  // Random glowing cyber windows
  for (let y = 10; y < 240; y += 12) {
    for (let x = 8; x < 120; x += 14) {
      const rand = Math.random();
      if (rand > 0.6) {
        ctx.fillStyle = rand > 0.85 ? '#ff0055' : rand > 0.7 ? '#00f0ff' : '#ffe600';
        ctx.fillRect(x, y, 8, 6);
      } else {
        ctx.fillStyle = '#141c2e';
        ctx.fillRect(x, y, 8, 6);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export class ThreeSceneBuilder {
  public static buildRealm(realm: RealmId, scene: THREE.Scene): {
    interactiveMeshes: THREE.Object3D[];
    animatedObjects: Array<{
      obj: THREE.Object3D;
      update: (delta: number, elapsed: number) => void;
    }>;
    particles: THREE.Points;
  } {
    // Clear previous children except lights/ambient
    const toRemove: THREE.Object3D[] = [];
    scene.children.forEach(child => {
      toRemove.push(child);
    });
    toRemove.forEach(c => scene.remove(c));

    const interactiveMeshes: THREE.Object3D[] = [];
    const animatedObjects: Array<{
      obj: THREE.Object3D;
      update: (delta: number, elapsed: number) => void;
    }> = [];

    // Global ambient & directional lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.8);
    dirLight2.position.set(-15, -10, -10);
    scene.add(dirLight2);

    let particles: THREE.Points;

    switch (realm) {
      case 'cyberpunk': {
        // Fog for cyberpunk atmosphere
        scene.fog = new THREE.FogExp2(0x050714, 0.025);

        // Reflective ground grid
        const gridGeo = new THREE.PlaneGeometry(120, 120);
        const gridTex = createGridTexture('#00f0ff', '#03050c');
        const gridMat = new THREE.MeshStandardMaterial({
          map: gridTex,
          roughness: 0.2,
          metalness: 0.8,
          emissive: 0x002b3d,
        });
        const gridMesh = new THREE.Mesh(gridGeo, gridMat);
        gridMesh.rotation.x = -Math.PI / 2;
        gridMesh.position.y = -4;
        scene.add(gridMesh);

        // Center Quantum Mainframe Core
        const coreGroup = new THREE.Group();
        coreGroup.position.set(0, 3.5, 0);

        const coreGeo = new THREE.IcosahedronGeometry(2.2, 1);
        const coreMat = new THREE.MeshStandardMaterial({
          color: 0x00f0ff,
          emissive: 0x0099cc,
          emissiveIntensity: 0.6,
          wireframe: false,
          roughness: 0.1,
          metalness: 0.9,
        });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        coreMesh.userData = { id: 'neo_core', name: 'Quantum Nexus Core' };
        coreGroup.add(coreMesh);
        interactiveMeshes.push(coreMesh);

        // Core wireframe shell
        const wireGeo = new THREE.IcosahedronGeometry(2.8, 1);
        const wireMat = new THREE.MeshBasicMaterial({
          color: 0xff0055,
          wireframe: true,
          transparent: true,
          opacity: 0.6,
        });
        const wireMesh = new THREE.Mesh(wireGeo, wireMat);
        coreGroup.add(wireMesh);

        // Orbiting holo rings
        const ringGeo = new THREE.TorusGeometry(3.6, 0.06, 16, 64);
        const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.8 });
        const ringMesh1 = new THREE.Mesh(ringGeo, ringMat1);
        ringMesh1.rotation.x = Math.PI / 3;
        coreGroup.add(ringMesh1);

        const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xff0055, transparent: true, opacity: 0.8 });
        const ringMesh2 = new THREE.Mesh(ringGeo, ringMat2);
        ringMesh2.rotation.y = Math.PI / 3;
        coreGroup.add(ringMesh2);

        scene.add(coreGroup);

        animatedObjects.push({
          obj: coreGroup,
          update: (delta, elapsed) => {
            coreMesh.rotation.y += delta * 0.5;
            coreMesh.rotation.x += delta * 0.2;
            wireMesh.rotation.y -= delta * 0.4;
            ringMesh1.rotation.z += delta * 0.8;
            ringMesh2.rotation.x += delta * 0.7;
            coreGroup.position.y = 3.5 + Math.sin(elapsed * 1.5) * 0.4;
          },
        });

        // Surrounding Cyber Skyscrapers
        const bldgTex = createSkyscraperTexture();
        const bldgMat = new THREE.MeshStandardMaterial({
          map: bldgTex,
          roughness: 0.3,
          metalness: 0.7,
        });

        for (let i = 0; i < 26; i++) {
          const angle = (i / 26) * Math.PI * 2 + (Math.random() * 0.2);
          const dist = 12 + Math.random() * 22;
          const height = 10 + Math.random() * 28;
          const width = 2.5 + Math.random() * 3.5;
          const depth = 2.5 + Math.random() * 3.5;

          const bldgGeo = new THREE.BoxGeometry(width, height, depth);
          const bldgMesh = new THREE.Mesh(bldgGeo, bldgMat);
          bldgMesh.position.set(
            Math.cos(angle) * dist,
            height / 2 - 4,
            Math.sin(angle) * dist
          );

          if (i === 3) {
            bldgMesh.userData = { id: 'sky_monolith_a', name: 'Aegis Spire Alpha' };
            interactiveMeshes.push(bldgMesh);
          } else if (i === 11) {
            bldgMesh.userData = { id: 'sky_monolith_b', name: 'Kuroshio Data Obelisk' };
            interactiveMeshes.push(bldgMesh);
          }

          scene.add(bldgMesh);

          // Roof beacon antenna
          const beaconGeo = new THREE.CylinderGeometry(0.05, 0.1, 4, 8);
          const beaconMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x00f0ff : 0xff0055 });
          const beacon = new THREE.Mesh(beaconGeo, beaconMat);
          beacon.position.set(bldgMesh.position.x, height - 2, bldgMesh.position.z);
          scene.add(beacon);
        }

        // Flying Cyber Traffic Light Trails
        const vehicleCount = 18;
        const vehiclesGroup = new THREE.Group();
        const vehicleMeshes: Array<{ mesh: THREE.Mesh; speed: number; radius: number; height: number; offset: number }> = [];

        for (let v = 0; v < vehicleCount; v++) {
          const vGeo = new THREE.BoxGeometry(1.2, 0.3, 0.4);
          const vMat = new THREE.MeshBasicMaterial({
            color: v % 2 === 0 ? 0x00f0ff : 0xff0055,
          });
          const vMesh = new THREE.Mesh(vGeo, vMat);
          vehiclesGroup.add(vMesh);
          vehicleMeshes.push({
            mesh: vMesh,
            speed: 0.6 + Math.random() * 0.8,
            radius: 8 + Math.random() * 16,
            height: 1 + Math.random() * 14,
            offset: Math.random() * Math.PI * 2,
          });
        }
        scene.add(vehiclesGroup);

        animatedObjects.push({
          obj: vehiclesGroup,
          update: (delta, elapsed) => {
            vehicleMeshes.forEach(v => {
              const currentAngle = elapsed * v.speed + v.offset;
              v.mesh.position.set(
                Math.cos(currentAngle) * v.radius,
                v.height + Math.sin(currentAngle * 2) * 0.5,
                Math.sin(currentAngle) * v.radius
              );
              v.mesh.rotation.y = -currentAngle - Math.PI / 2;
            });
          },
        });

        // Cyber Particles (rising data stream)
        const pCount = 4500;
        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(pCount * 3);
        const pColors = new Float32Array(pCount * 3);

        const color1 = new THREE.Color(0x00f0ff);
        const color2 = new THREE.Color(0xff0055);

        for (let i = 0; i < pCount; i++) {
          pPos[i * 3] = (Math.random() - 0.5) * 80;
          pPos[i * 3 + 1] = Math.random() * 40 - 4;
          pPos[i * 3 + 2] = (Math.random() - 0.5) * 80;

          const mixed = Math.random() > 0.5 ? color1 : color2;
          pColors[i * 3] = mixed.r;
          pColors[i * 3 + 1] = mixed.g;
          pColors[i * 3 + 2] = mixed.b;
        }

        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

        const pMat = new THREE.PointsMaterial({
          size: 0.16,
          vertexColors: true,
          transparent: true,
          opacity: 0.7,
          blending: THREE.AdditiveBlending,
        });

        particles = new THREE.Points(pGeo, pMat);
        scene.add(particles);

        animatedObjects.push({
          obj: particles,
          update: (delta, elapsed) => {
            const positions = (particles.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
            for (let i = 1; i < positions.length; i += 3) {
              positions[i] += delta * 4.0;
              if (positions[i] > 36) {
                positions[i] = -4;
              }
            }
            particles.geometry.attributes.position.needsUpdate = true;
          },
        });

        break;
      }

      case 'celestial': {
        scene.fog = new THREE.FogExp2(0x0a061c, 0.015);

        // Center Astral Diamond Singularity
        const astralGroup = new THREE.Group();
        astralGroup.position.set(0, 0, 0);

        const prismGeo = new THREE.OctahedronGeometry(2.8, 0);
        const prismMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          transmission: 0.9,
          opacity: 1,
          transparent: true,
          roughness: 0.05,
          ior: 2.4, // Diamond refractive index
          metalness: 0.1,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
        });
        const prismMesh = new THREE.Mesh(prismGeo, prismMat);
        prismMesh.userData = { id: 'astral_prism', name: 'Astral Diamond Singularity' };
        astralGroup.add(prismMesh);
        interactiveMeshes.push(prismMesh);

        // Inner glowing core
        const innerGeo = new THREE.DodecahedronGeometry(1.2, 0);
        const innerMat = new THREE.MeshStandardMaterial({
          color: 0x8b5cf6,
          emissive: 0x38bdf8,
          emissiveIntensity: 1.8,
        });
        const innerMesh = new THREE.Mesh(innerGeo, innerMat);
        astralGroup.add(innerMesh);

        // Concentric Golden Glyphs Rings
        const glyphRings: THREE.Mesh[] = [];
        for (let r = 0; r < 4; r++) {
          const rGeo = new THREE.TorusGeometry(4.2 + r * 1.6, 0.04, 16, 100);
          const rMat = new THREE.MeshStandardMaterial({
            color: 0xfacc15,
            metalness: 0.9,
            roughness: 0.2,
            emissive: 0xca8a04,
            emissiveIntensity: 0.3,
          });
          const rMesh = new THREE.Mesh(rGeo, rMat);
          rMesh.rotation.x = (r * Math.PI) / 4;
          rMesh.rotation.y = (r * Math.PI) / 6;
          astralGroup.add(rMesh);
          glyphRings.push(rMesh);
        }

        scene.add(astralGroup);

        animatedObjects.push({
          obj: astralGroup,
          update: (delta, elapsed) => {
            prismMesh.rotation.y += delta * 0.4;
            prismMesh.rotation.z += delta * 0.2;
            innerMesh.rotation.x -= delta * 0.6;
            innerMesh.rotation.y -= delta * 0.5;
            glyphRings.forEach((r, idx) => {
              r.rotation.z += delta * (0.3 + idx * 0.15) * (idx % 2 === 0 ? 1 : -1);
              r.rotation.x += delta * 0.2 * (idx % 2 === 0 ? -1 : 1);
            });
            astralGroup.position.y = Math.sin(elapsed * 1.2) * 0.6;
          },
        });

        // Floating Levitation Crystal Monoliths
        for (let i = 0; i < 14; i++) {
          const angle = (i / 14) * Math.PI * 2;
          const dist = 10 + (i % 3) * 4;
          const spGroup = new THREE.Group();

          const spGeo = new THREE.ConeGeometry(1.2, 4.5, 6);
          const spMat = new THREE.MeshStandardMaterial({
            color: i % 2 === 0 ? 0x8b5cf6 : 0x38bdf8,
            roughness: 0.1,
            metalness: 0.8,
            emissive: i % 2 === 0 ? 0x4c1d95 : 0x0369a1,
            emissiveIntensity: 0.5,
          });
          const spMesh = new THREE.Mesh(spGeo, spMat);
          spMesh.rotation.x = Math.PI; // upside-down crystal base
          spGroup.add(spMesh);

          spGroup.position.set(
            Math.cos(angle) * dist,
            Math.sin(i * 1.5) * 4,
            Math.sin(angle) * dist
          );

          if (i === 1) {
            spMesh.userData = { id: 'floating_spire_1', name: 'Pinnacle of Lumina' };
            interactiveMeshes.push(spMesh);
          } else if (i === 5) {
            spMesh.userData = { id: 'floating_spire_2', name: 'Pinnacle of Veritas' };
            interactiveMeshes.push(spMesh);
          }

          scene.add(spGroup);

          animatedObjects.push({
            obj: spGroup,
            update: (delta, elapsed) => {
              spGroup.position.y += Math.sin(elapsed * 2 + i) * 0.02;
              spMesh.rotation.y += delta * 0.5;
            },
          });
        }

        // Aurora Wave Ribbons
        const ribbonGeo = new THREE.PlaneGeometry(60, 18, 30, 20);
        const ribbonMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.25,
          wireframe: true,
        });
        const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
        ribbonMesh.position.set(0, 12, -15);
        ribbonMesh.rotation.x = Math.PI / 4;
        scene.add(ribbonMesh);

        animatedObjects.push({
          obj: ribbonMesh,
          update: (delta, elapsed) => {
            const pos = (ribbonGeo.attributes.position as THREE.BufferAttribute).array as Float32Array;
            for (let i = 0; i < pos.length; i += 3) {
              const u = pos[i];
              const v = pos[i + 1];
              pos[i + 2] = Math.sin(u * 0.15 + elapsed * 1.5) * 3 + Math.cos(v * 0.2 + elapsed) * 2;
            }
            ribbonGeo.attributes.position.needsUpdate = true;
          },
        });

        // 5000 Celestial Stars
        const pCount = 5000;
        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(pCount * 3);
        const pColors = new Float32Array(pCount * 3);

        for (let i = 0; i < pCount; i++) {
          const rad = 25 + Math.random() * 60;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          pPos[i * 3] = rad * Math.sin(phi) * Math.cos(theta);
          pPos[i * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
          pPos[i * 3 + 2] = rad * Math.cos(phi);

          const r = 0.6 + Math.random() * 0.4;
          const g = 0.5 + Math.random() * 0.5;
          const b = 0.9 + Math.random() * 0.1;
          pColors[i * 3] = r;
          pColors[i * 3 + 1] = g;
          pColors[i * 3 + 2] = b;
        }

        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

        const pMat = new THREE.PointsMaterial({
          size: 0.22,
          vertexColors: true,
          transparent: true,
          opacity: 0.85,
        });

        particles = new THREE.Points(pGeo, pMat);
        scene.add(particles);

        animatedObjects.push({
          obj: particles,
          update: (delta) => {
            particles.rotation.y += delta * 0.04;
            particles.rotation.x += delta * 0.02;
          },
        });

        break;
      }

      case 'abyss': {
        scene.fog = new THREE.FogExp2(0x021318, 0.03);

        // Giant Translucent Bioluminescent Jellyfish Queen
        const jellyGroup = new THREE.Group();
        jellyGroup.position.set(0, 2, 0);

        // Jelly bell dome
        const bellGeo = new THREE.SphereGeometry(2.8, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
        const bellMat = new THREE.MeshPhysicalMaterial({
          color: 0x10b981,
          emissive: 0x06b6d4,
          emissiveIntensity: 0.7,
          transmission: 0.85,
          opacity: 0.9,
          transparent: true,
          roughness: 0.15,
          ior: 1.33,
        });
        const bellMesh = new THREE.Mesh(bellGeo, bellMat);
        bellMesh.rotation.x = Math.PI; // Opening downwards
        bellMesh.userData = { id: 'queen_jelly', name: 'Aurelia Prime' };
        jellyGroup.add(bellMesh);
        interactiveMeshes.push(bellMesh);

        // Inner glowing bio-core
        const bioCoreGeo = new THREE.SphereGeometry(1.0, 16, 16);
        const bioCoreMat = new THREE.MeshBasicMaterial({ color: 0x6ee7b7 });
        const bioCore = new THREE.Mesh(bioCoreGeo, bioCoreMat);
        bioCore.position.y = -0.6;
        jellyGroup.add(bioCore);

        // Undulating Tentacles
        const tentacleCount = 12;
        const tentacles: Array<{ curve: THREE.CatmullRomCurve3; line: THREE.Line; baseOffset: number }> = [];

        for (let t = 0; t < tentacleCount; t++) {
          const angle = (t / tentacleCount) * Math.PI * 2;
          const radius = 1.8;
          const points = [
            new THREE.Vector3(Math.cos(angle) * radius, -0.2, Math.sin(angle) * radius),
            new THREE.Vector3(Math.cos(angle) * radius * 0.8, -2.5, Math.sin(angle) * radius * 0.8),
            new THREE.Vector3(Math.cos(angle) * radius * 0.5, -5.0, Math.sin(angle) * radius * 0.5),
            new THREE.Vector3(Math.cos(angle) * radius * 0.2, -7.5, Math.sin(angle) * radius * 0.2),
          ];
          const curve = new THREE.CatmullRomCurve3(points);
          const tGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(30));
          const tMat = new THREE.LineBasicMaterial({
            color: t % 2 === 0 ? 0x10b981 : 0x06b6d4,
            transparent: true,
            opacity: 0.75,
            linewidth: 2,
          });
          const line = new THREE.Line(tGeo, tMat);
          jellyGroup.add(line);
          tentacles.push({ curve, line, baseOffset: t });
        }

        scene.add(jellyGroup);

        animatedObjects.push({
          obj: jellyGroup,
          update: (delta, elapsed) => {
            // Pulsing bell swimming motion
            const pulse = (Math.sin(elapsed * 2.5) + 1) * 0.5;
            bellMesh.scale.set(1 + pulse * 0.15, 1 - pulse * 0.2, 1 + pulse * 0.15);
            jellyGroup.position.y = 2 + Math.sin(elapsed * 1.2) * 1.5;

            // Wave tentacles
            tentacles.forEach((tent, idx) => {
              const pts = tent.curve.points;
              const wave = Math.sin(elapsed * 3 + tent.baseOffset);
              pts[1].x += Math.cos(elapsed * 2 + idx) * 0.03;
              pts[2].x += Math.sin(elapsed * 2 + idx) * 0.05;
              pts[3].x += Math.cos(elapsed * 2.5 + idx) * 0.07;
              tent.line.geometry.setFromPoints(tent.curve.getPoints(30));
            });
          },
        });

        // Glowing Coral Spires on Ocean Bed
        const coralFloorGeo = new THREE.PlaneGeometry(100, 100, 40, 40);
        const coralFloorMat = new THREE.MeshStandardMaterial({
          color: 0x032028,
          roughness: 0.8,
          metalness: 0.2,
        });
        const coralFloor = new THREE.Mesh(coralFloorGeo, coralFloorMat);
        coralFloor.rotation.x = -Math.PI / 2;
        coralFloor.position.y = -8;
        scene.add(coralFloor);

        for (let c = 0; c < 16; c++) {
          const angle = (c / 16) * Math.PI * 2;
          const dist = 8 + (c % 4) * 3.5;
          const height = 4 + (c % 5) * 2;

          const spireGeo = new THREE.CylinderGeometry(0.2, 1.2, height, 8);
          const spireMat = new THREE.MeshStandardMaterial({
            color: 0x064e3b,
            emissive: c % 2 === 0 ? 0x06b6d4 : 0x10b981,
            emissiveIntensity: 0.8,
            roughness: 0.3,
          });
          const spireMesh = new THREE.Mesh(spireGeo, spireMat);
          spireMesh.position.set(
            Math.cos(angle) * dist,
            -8 + height / 2,
            Math.sin(angle) * dist
          );

          if (c === 2) {
            spireMesh.userData = { id: 'coral_spire', name: 'Hydrothermal Coral Spire' };
            interactiveMeshes.push(spireMesh);
          }

          scene.add(spireMesh);
        }

        // Bioluminescent Plankton Particles
        const pCount = 4000;
        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(pCount * 3);
        const pColors = new Float32Array(pCount * 3);

        for (let i = 0; i < pCount; i++) {
          pPos[i * 3] = (Math.random() - 0.5) * 60;
          pPos[i * 3 + 1] = Math.random() * 30 - 8;
          pPos[i * 3 + 2] = (Math.random() - 0.5) * 60;

          pColors[i * 3] = 0.05 + Math.random() * 0.2;
          pColors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
          pColors[i * 3 + 2] = 0.7 + Math.random() * 0.3;
        }

        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

        const pMat = new THREE.PointsMaterial({
          size: 0.18,
          vertexColors: true,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
        });

        particles = new THREE.Points(pGeo, pMat);
        scene.add(particles);

        animatedObjects.push({
          obj: particles,
          update: (delta, elapsed) => {
            const pos = (particles.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
            for (let i = 0; i < pos.length; i += 3) {
              pos[i + 1] += Math.sin(elapsed + pos[i]) * 0.015;
              pos[i] += Math.cos(elapsed * 0.5 + pos[i + 2]) * 0.01;
            }
            particles.geometry.attributes.position.needsUpdate = true;
          },
        });

        break;
      }

      case 'kinetic': {
        scene.fog = new THREE.FogExp2(0x0c0712, 0.02);

        // Center 4D Hyper-Torus Knot (Liquid Mercury Chrome)
        const torusGroup = new THREE.Group();
        torusGroup.position.set(0, 0, 0);

        const torusGeo = new THREE.TorusKnotGeometry(2.4, 0.75, 140, 24, 2, 3);
        const torusMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          metalness: 1.0,
          roughness: 0.04,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
          emissive: 0x3b0764,
          emissiveIntensity: 0.2,
        });
        const torusMesh = new THREE.Mesh(torusGeo, torusMat);
        torusMesh.userData = { id: 'hyper_torus', name: '4D Hyper-Torus Knot' };
        torusGroup.add(torusMesh);
        interactiveMeshes.push(torusMesh);

        // Interlocking Fibonacci Golden Rings
        const fibGroup = new THREE.Group();
        const fibRings: THREE.Mesh[] = [];

        for (let f = 0; f < 5; f++) {
          const fGeo = new THREE.TorusGeometry(3.6 + f * 1.1, 0.08, 16, 80);
          const fMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            metalness: 0.95,
            roughness: 0.15,
            emissive: 0xd97706,
            emissiveIntensity: 0.4,
          });
          const fMesh = new THREE.Mesh(fGeo, fMat);
          fMesh.rotation.x = (f * Math.PI) / 5;
          fMesh.rotation.y = (f * Math.PI) / 3;
          fibGroup.add(fMesh);
          fibRings.push(fMesh);
        }
        torusGroup.add(fibGroup);

        scene.add(torusGroup);

        animatedObjects.push({
          obj: torusGroup,
          update: (delta, elapsed) => {
            torusMesh.rotation.x += delta * 0.4;
            torusMesh.rotation.y += delta * 0.6;
            fibRings.forEach((r, idx) => {
              r.rotation.z += delta * (0.5 + idx * 0.2) * (idx % 2 === 0 ? 1 : -1);
              r.rotation.x += delta * 0.3 * (idx % 2 === 0 ? -1 : 1);
            });
            torusGroup.position.y = Math.sin(elapsed * 1.4) * 0.4;
          },
        });

        // Kinetic Pedestal Sculptures
        const sphereGeo = new THREE.IcosahedronGeometry(1.6, 4);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: 0xec4899,
          metalness: 0.9,
          roughness: 0.1,
          emissive: 0xbe185d,
          emissiveIntensity: 0.5,
        });
        const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
        sphereMesh.position.set(-7, 2, -3);
        sphereMesh.userData = { id: 'mercury_sphere', name: 'Mercurial Ripple Orb' };
        scene.add(sphereMesh);
        interactiveMeshes.push(sphereMesh);

        animatedObjects.push({
          obj: sphereMesh,
          update: (delta, elapsed) => {
            sphereMesh.rotation.y += delta * 0.8;
            sphereMesh.position.y = 2 + Math.sin(elapsed * 2.0) * 0.5;
          },
        });

        // Golden Particle Spirals
        const pCount = 3800;
        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(pCount * 3);
        const pColors = new Float32Array(pCount * 3);

        for (let i = 0; i < pCount; i++) {
          const t = i * 0.05;
          const radius = (i / pCount) * 24;
          pPos[i * 3] = Math.cos(t) * radius;
          pPos[i * 3 + 1] = (Math.random() - 0.5) * 16;
          pPos[i * 3 + 2] = Math.sin(t) * radius;

          pColors[i * 3] = 0.95;
          pColors[i * 3 + 1] = 0.6 + Math.random() * 0.3;
          pColors[i * 3 + 2] = 0.1 + Math.random() * 0.4;
        }

        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

        const pMat = new THREE.PointsMaterial({
          size: 0.2,
          vertexColors: true,
          transparent: true,
          opacity: 0.8,
        });

        particles = new THREE.Points(pGeo, pMat);
        scene.add(particles);

        animatedObjects.push({
          obj: particles,
          update: (delta) => {
            particles.rotation.y += delta * 0.15;
          },
        });

        break;
      }

      case 'solaris': {
        scene.fog = new THREE.FogExp2(0x130702, 0.018);

        // Center Blazing Proto-Star
        const starGroup = new THREE.Group();
        starGroup.position.set(0, 0, 0);

        const starGeo = new THREE.SphereGeometry(3.2, 32, 32);
        const starMat = new THREE.MeshBasicMaterial({
          color: 0xffedd5,
        });
        const starMesh = new THREE.Mesh(starGeo, starMat);
        starMesh.userData = { id: 'stellar_sun', name: 'Proto-Star Helios 01' };
        starGroup.add(starMesh);
        interactiveMeshes.push(starMesh);

        // Glowing Star Corona Shell
        const coronaGeo = new THREE.SphereGeometry(3.8, 24, 24);
        const coronaMat = new THREE.MeshBasicMaterial({
          color: 0xf97316,
          transparent: true,
          opacity: 0.65,
          wireframe: true,
        });
        const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
        starGroup.add(coronaMesh);

        // Counter-Rotating Dyson Swarm Collector Rings
        const dysonRings: THREE.Mesh[] = [];
        for (let d = 0; d < 3; d++) {
          const dGeo = new THREE.TorusGeometry(5.8 + d * 2.2, 0.35, 16, 80);
          const dMat = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            emissive: d === 0 ? 0xf97316 : 0xeab308,
            emissiveIntensity: 0.6,
            metalness: 0.85,
            roughness: 0.2,
          });
          const dMesh = new THREE.Mesh(dGeo, dMat);
          dMesh.rotation.x = (d * Math.PI) / 3;
          dMesh.rotation.y = (d * Math.PI) / 4;
          starGroup.add(dMesh);
          dysonRings.push(dMesh);
        }

        scene.add(starGroup);

        animatedObjects.push({
          obj: starGroup,
          update: (delta, elapsed) => {
            starMesh.rotation.y += delta * 0.3;
            coronaMesh.rotation.y -= delta * 0.5;
            coronaMesh.rotation.x += delta * 0.2;
            const pulse = (Math.sin(elapsed * 3) + 1) * 0.5;
            coronaMesh.scale.set(1 + pulse * 0.08, 1 + pulse * 0.08, 1 + pulse * 0.08);

            dysonRings.forEach((r, idx) => {
              r.rotation.z += delta * (0.4 + idx * 0.2) * (idx % 2 === 0 ? 1 : -1);
              r.rotation.y += delta * 0.25 * (idx % 2 === 0 ? -1 : 1);
            });
          },
        });

        // Gravitational Accretion Disk / Solar Prominence Particles
        const pCount = 6000;
        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(pCount * 3);
        const pColors = new Float32Array(pCount * 3);

        const color1 = new THREE.Color(0xf97316);
        const color2 = new THREE.Color(0xfacc15);

        for (let i = 0; i < pCount; i++) {
          const radius = 4.5 + Math.random() * 22;
          const theta = Math.random() * Math.PI * 2;
          pPos[i * 3] = Math.cos(theta) * radius;
          pPos[i * 3 + 1] = (Math.random() - 0.5) * 4 * (1 - (radius / 25)); // Disk compression
          pPos[i * 3 + 2] = Math.sin(theta) * radius;

          const mixed = Math.random() > 0.4 ? color1 : color2;
          pColors[i * 3] = mixed.r;
          pColors[i * 3 + 1] = mixed.g;
          pColors[i * 3 + 2] = mixed.b;
        }

        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

        const pMat = new THREE.PointsMaterial({
          size: 0.2,
          vertexColors: true,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
        });

        particles = new THREE.Points(pGeo, pMat);
        scene.add(particles);

        animatedObjects.push({
          obj: particles,
          update: (delta) => {
            particles.rotation.y += delta * 0.25;
          },
        });

        break;
      }
    }

    return { interactiveMeshes, animatedObjects, particles };
  }
}
