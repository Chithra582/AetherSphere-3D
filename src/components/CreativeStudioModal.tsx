import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sliders,
  Play,
  RotateCw,
  Grid,
  Volume2,
  VolumeX,
  Gauge,
  Sparkles,
  Zap,
} from 'lucide-react';
import { WorldSettings } from '../types';
import { soundEngine } from '../audio/soundEngine';

interface CreativeStudioModalProps {
  isOpen: boolean;
  settings: WorldSettings;
  onClose: () => void;
  onUpdateSettings: (newSettings: Partial<WorldSettings>) => void;
}

export const CreativeStudioModal: React.FC<CreativeStudioModalProps> = ({
  isOpen,
  settings,
  onClose,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          id="creative-studio-modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]"
        >
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-indigo-950/40 via-slate-900 to-cyan-950/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold font-['Syne',sans-serif] text-white">
                  3D Engine & Shader Studio
                </h2>
                <p className="text-xs text-slate-400">
                  Real-time WebGL physics, shaders, and simulation parameters
                </p>
              </div>
            </div>
            <button
              id="close-studio-modal"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Controls List */}
          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Simulation Speed */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Simulation Speed</span>
                </span>
                <span className="font-mono text-cyan-400">{settings.speed.toFixed(1)}x</span>
              </div>
              <input
                id="speed-slider"
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={settings.speed}
                onChange={(e) => onUpdateSettings({ speed: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Drone Flight Speed */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Drone Camera Velocity (WASD)</span>
                </span>
                <span className="font-mono text-emerald-400">{settings.droneSpeed} m/s</span>
              </div>
              <input
                id="drone-speed-slider"
                type="range"
                min="5"
                max="35"
                step="1"
                value={settings.droneSpeed}
                onChange={(e) => onUpdateSettings({ droneSpeed: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            {/* Generative Sound Volume */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                  )}
                  <span>Generative Synth Volume</span>
                </span>
                <span className="font-mono text-purple-400">
                  {settings.soundEnabled ? `${Math.round(settings.soundVolume * 100)}%` : 'Muted'}
                </span>
              </div>
              <input
                id="sound-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                disabled={!settings.soundEnabled}
                value={settings.soundVolume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateSettings({ soundVolume: val });
                  soundEngine.setVolume(val);
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400 disabled:opacity-40"
              />
            </div>

            {/* Quick Toggle Chips */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {/* Wireframe Toggle */}
              <button
                id="toggle-wireframe-button"
                onClick={() => {
                  soundEngine.playClickSFX();
                  onUpdateSettings({ wireframe: !settings.wireframe });
                }}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                  settings.wireframe
                    ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-800/40 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Grid className="w-4 h-4" />
                  <span>Wireframe Mesh</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10">
                  {settings.wireframe ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Auto-Rotation Toggle */}
              <button
                id="toggle-autorotate-button"
                onClick={() => {
                  soundEngine.playClickSFX();
                  onUpdateSettings({ autorotate: !settings.autorotate });
                }}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                  settings.autorotate
                    ? 'bg-purple-500/20 border-purple-400/50 text-purple-300 shadow-md shadow-purple-500/10'
                    : 'bg-slate-800/40 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <RotateCw className="w-4 h-4" />
                  <span>Orbit Autorotation</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10">
                  {settings.autorotate ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>

            {/* Quick Presets Info */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-400 shrink-0" />
              <p className="text-[11px] text-slate-400">
                Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">W A S D</kbd> in Drone mode to fly freely through the 3D space, or click any artifact to inspect its lore.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-slate-950/60 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md"
            >
              Apply & Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
