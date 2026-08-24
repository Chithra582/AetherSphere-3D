import React from 'react';
import { motion } from 'motion/react';
import {
  Compass,
  Video,
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
  Maximize,
  Minimize,
  Camera,
  Eye,
  Crosshair,
  Award,
} from 'lucide-react';
import { RealmId, CameraMode, WorldSettings } from '../types';
import { REALMS } from '../data/realms';
import { soundEngine } from '../audio/soundEngine';

interface NavigationHUDProps {
  currentRealm: RealmId;
  cameraMode: CameraMode;
  settings: WorldSettings;
  isZenMode: boolean;
  onSelectRealm: (realm: RealmId) => void;
  onChangeCameraMode: (mode: CameraMode) => void;
  onToggleSettings: () => void;
  onOpenHackathonModal: () => void;
  onTakeScreenshot: () => void;
  onToggleZenMode: () => void;
  onToggleSound: () => void;
}

export const NavigationHUD: React.FC<NavigationHUDProps> = ({
  currentRealm,
  cameraMode,
  settings,
  isZenMode,
  onSelectRealm,
  onChangeCameraMode,
  onToggleSettings,
  onOpenHackathonModal,
  onTakeScreenshot,
  onToggleZenMode,
  onToggleSound,
}) => {
  const realmsList = Object.values(REALMS);

  if (isZenMode) {
    return (
      <div className="absolute top-6 right-6 z-50">
        <motion.button
          id="exit-zen-mode-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleZenMode}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800/90 shadow-2xl transition-all"
        >
          <Minimize className="w-4 h-4 text-cyan-400" />
          <span>Exit Zen View</span>
        </motion.button>
      </div>
    );
  }

  return (
    <>
      {/* Top Header Bar */}
      <header className="absolute top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between pointer-events-none">
        {/* Brand & Hackathon Tag */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-wider uppercase font-['Syne',sans-serif] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                AetherSphere 3D
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
                3D Hackathon
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              The Infinite Dimensional Web Canvas
            </p>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Hackathon Submission Showcase Button */}
          <motion.button
            id="hackathon-submission-button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              soundEngine.playClickSFX();
              onOpenHackathonModal();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-400/40 text-amber-300 text-xs font-semibold shadow-lg shadow-amber-500/10 backdrop-blur-md transition-all"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Hackathon Dossier</span>
          </motion.button>

          {/* Quick Screenshot Button */}
          <motion.button
            id="quick-screenshot-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              soundEngine.playClickSFX();
              onTakeScreenshot();
            }}
            title="Take High-Res 3D Screenshot"
            className="p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/90 border border-white/10 text-slate-300 hover:text-white backdrop-blur-md shadow-lg transition-all"
          >
            <Camera className="w-4 h-4 text-cyan-400" />
          </motion.button>

          {/* Audio Synthesizer Toggle */}
          <motion.button
            id="audio-synth-toggle-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              soundEngine.playClickSFX();
              onToggleSound();
            }}
            title={settings.soundEnabled ? 'Mute Generative Sound' : 'Play Generative Sound'}
            className="p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/90 border border-white/10 text-slate-300 hover:text-white backdrop-blur-md shadow-lg transition-all"
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </motion.button>

          {/* 3D Shader Tweaker Studio */}
          <motion.button
            id="creative-studio-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              soundEngine.playClickSFX();
              onToggleSettings();
            }}
            title="3D Shader & Physics Controller"
            className="p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/90 border border-white/10 text-slate-300 hover:text-white backdrop-blur-md shadow-lg transition-all"
          >
            <Sliders className="w-4 h-4 text-indigo-400" />
          </motion.button>

          {/* Zen View Mode */}
          <motion.button
            id="zen-view-mode-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              soundEngine.playClickSFX();
              onToggleZenMode();
            }}
            title="Cinema / Zen Immersion Mode"
            className="p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/90 border border-white/10 text-slate-300 hover:text-white backdrop-blur-md shadow-lg transition-all"
          >
            <Maximize className="w-4 h-4 text-slate-300" />
          </motion.button>
        </div>
      </header>

      {/* Floating Bottom Center Realm Switcher & Camera Mode Bar */}
      <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none">
        {/* Realm Switcher Glass Capsule */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-2xl pointer-events-auto overflow-x-auto max-w-full">
          {realmsList.map((realm) => {
            const isActive = realm.id === currentRealm;
            return (
              <motion.button
                key={realm.id}
                id={`realm-button-${realm.id}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  soundEngine.playRealmWarpSFX();
                  onSelectRealm(realm.id);
                }}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-white/10 shadow-md border border-white/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {/* Glowing Realm Indicator Dot */}
                <span
                  className="w-2 h-2 rounded-full transition-transform"
                  style={{
                    backgroundColor: realm.themeColor,
                    boxShadow: isActive ? `0 0 10px ${realm.themeColor}` : 'none',
                    transform: isActive ? 'scale(1.3)' : 'scale(1)',
                  }}
                />
                <span>{realm.name}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Camera Modes Capsule */}
        <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-2xl pointer-events-auto">
          {/* Orbit Mode */}
          <button
            id="camera-mode-orbit"
            onClick={() => {
              soundEngine.playClickSFX();
              onChangeCameraMode('orbit');
            }}
            title="360° Orbit Drag Mode"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              cameraMode === 'orbit'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Orbit</span>
          </button>

          {/* Cinematic Tour */}
          <button
            id="camera-mode-cinematic"
            onClick={() => {
              soundEngine.playClickSFX();
              onChangeCameraMode('cinematic');
            }}
            title="Cinematic Director Flight Tour"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              cameraMode === 'cinematic'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cinematic</span>
          </button>

          {/* First-Person Drone */}
          <button
            id="camera-mode-firstperson"
            onClick={() => {
              soundEngine.playClickSFX();
              onChangeCameraMode('firstperson');
            }}
            title="First-Person WASD Drone Flight"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              cameraMode === 'firstperson'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Drone (WASD)</span>
          </button>

          {/* Parallax Tilt */}
          <button
            id="camera-mode-gyro"
            onClick={() => {
              soundEngine.playClickSFX();
              onChangeCameraMode('gyro');
            }}
            title="Parallax Reactive Tilt"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              cameraMode === 'gyro'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Parallax</span>
          </button>
        </div>
      </footer>
    </>
  );
};
