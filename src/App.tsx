/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { RealmId, CameraMode, WorldSettings, TelemetryData } from './types';
import { REALMS } from './data/realms';
import { soundEngine } from './audio/soundEngine';
import { ThreeCanvas } from './three/ThreeCanvas';
import { NavigationHUD } from './components/NavigationHUD';
import { HackathonSubmissionModal } from './components/HackathonSubmissionModal';
import { CreativeStudioModal } from './components/CreativeStudioModal';
import { InspectModal } from './components/InspectModal';
import { CinematicOverlay } from './components/CinematicOverlay';

export default function App() {
  const [currentRealm, setCurrentRealm] = useState<RealmId>('cyberpunk');
  const [cameraMode, setCameraMode] = useState<CameraMode>('orbit');
  const [activeWaypointIndex, setActiveWaypointIndex] = useState(0);
  const [waypointCaption, setWaypointCaption] = useState('');
  const [isZenMode, setIsZenMode] = useState(false);
  const [isHackathonModalOpen, setIsHackathonModalOpen] = useState(false);
  const [isCreativeStudioOpen, setIsCreativeStudioOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<{ id: string; name: string } | null>(null);

  const [settings, setSettings] = useState<WorldSettings>({
    speed: 1.0,
    bloomIntensity: 1.2,
    wireframe: false,
    particleDensity: 1.0,
    distortion: 0,
    colorGrade: 'vibrant',
    soundEnabled: true,
    soundVolume: 0.35,
    droneSpeed: 15,
    fov: 60,
    autorotate: true,
  });

  const [telemetry, setTelemetry] = useState<TelemetryData>({
    fps: 60,
    frameTime: 16.6,
    geometries: 28,
    triangles: 45000,
    drawCalls: 32,
    textures: 8,
  });

  const screenshotCaptureFnRef = useRef<(() => string) | null>(null);

  // Initialize sound when user interacts or changes realm
  useEffect(() => {
    if (settings.soundEnabled) {
      soundEngine.playRealmAmbiance(currentRealm);
    } else {
      soundEngine.stopAmbient();
    }
  }, [currentRealm, settings.soundEnabled]);

  // Cinematic mode waypoint cycle timer
  useEffect(() => {
    if (cameraMode !== 'cinematic') return;
    const interval = setInterval(() => {
      setActiveWaypointIndex((prev) => (prev + 1) % (REALMS[currentRealm].cinematicWaypoints.length || 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [cameraMode, currentRealm]);

  const handleUpdateSettings = (newSettings: Partial<WorldSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleToggleSound = () => {
    const nextSound = !settings.soundEnabled;
    setSettings((prev) => ({ ...prev, soundEnabled: nextSound }));
    soundEngine.setMuted(!nextSound);
    if (nextSound) {
      soundEngine.playRealmAmbiance(currentRealm);
    } else {
      soundEngine.stopAmbient();
    }
  };

  const handleTakeScreenshot = () => {
    setIsHackathonModalOpen(true);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#05070f] select-none font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 3D WebGL Canvas Layer */}
      <ThreeCanvas
        currentRealm={currentRealm}
        cameraMode={cameraMode}
        settings={settings}
        activeWaypointIndex={activeWaypointIndex}
        onSelectNode={(id, name) => setSelectedNode({ id, name })}
        onUpdateTelemetry={setTelemetry}
        onWaypointCaption={setWaypointCaption}
        onScreenshotCaptureReady={(fn) => {
          screenshotCaptureFnRef.current = fn;
        }}
      />

      {/* Cinematic & Telemetry Overlay HUD */}
      {!isZenMode && (
        <CinematicOverlay
          currentRealm={currentRealm}
          waypointCaption={waypointCaption}
          isCinematic={cameraMode === 'cinematic'}
          telemetry={telemetry}
        />
      )}

      {/* Main Navigation and Controls HUD */}
      <NavigationHUD
        currentRealm={currentRealm}
        cameraMode={cameraMode}
        settings={settings}
        isZenMode={isZenMode}
        onSelectRealm={(realm) => {
          setCurrentRealm(realm);
          setActiveWaypointIndex(0);
        }}
        onChangeCameraMode={setCameraMode}
        onToggleSettings={() => setIsCreativeStudioOpen(true)}
        onOpenHackathonModal={() => setIsHackathonModalOpen(true)}
        onTakeScreenshot={handleTakeScreenshot}
        onToggleZenMode={() => setIsZenMode(!isZenMode)}
        onToggleSound={handleToggleSound}
      />

      {/* Modals & Dialogs */}
      <HackathonSubmissionModal
        isOpen={isHackathonModalOpen}
        onClose={() => setIsHackathonModalOpen(false)}
        onCaptureScreenshot={() => {
          if (screenshotCaptureFnRef.current) {
            return screenshotCaptureFnRef.current();
          }
          return '';
        }}
      />

      <CreativeStudioModal
        isOpen={isCreativeStudioOpen}
        settings={settings}
        onClose={() => setIsCreativeStudioOpen(false)}
        onUpdateSettings={handleUpdateSettings}
      />

      <InspectModal
        nodeId={selectedNode?.id || null}
        nodeName={selectedNode?.name || ''}
        realmId={currentRealm}
        onClose={() => setSelectedNode(null)}
      />
    </main>
  );
}
