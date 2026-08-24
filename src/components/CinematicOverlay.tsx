import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RealmId, TelemetryData } from '../types';
import { REALMS } from '../data/realms';

interface CinematicOverlayProps {
  currentRealm: RealmId;
  waypointCaption?: string;
  isCinematic: boolean;
  telemetry: TelemetryData;
}

export const CinematicOverlay: React.FC<CinematicOverlayProps> = ({
  currentRealm,
  waypointCaption,
  isCinematic,
  telemetry,
}) => {
  const currentRealmData = REALMS[currentRealm];

  return (
    <>
      {/* Top Left Telemetry Counter */}
      <div className="absolute top-16 left-6 z-30 pointer-events-none hidden md:flex items-center gap-3 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-bold">{telemetry.fps}</span>
          <span className="text-slate-500">FPS</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/5">
          <span className="text-slate-300 font-semibold">{telemetry.triangles.toLocaleString()}</span>
          <span className="text-slate-500">Polys</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/5">
          <span className="text-slate-300 font-semibold">{telemetry.drawCalls}</span>
          <span className="text-slate-500">Calls</span>
        </div>
      </div>

      {/* Cinematic Director Mode Waypoint Subtitle Banner */}
      <AnimatePresence>
        {isCinematic && waypointCaption && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center"
          >
            <div className="px-5 py-2 rounded-full bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-2xl text-xs font-semibold tracking-wide text-cyan-200">
              <span className="text-slate-400 uppercase text-[10px] tracking-widest mr-2 font-mono">
                CAMERA VANTAGE:
              </span>
              <span>{waypointCaption}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Realm Subtitle Pill at Left Middle (Desktop) */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none hidden lg:block max-w-xs space-y-1.5">
        <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/10 border border-white/15 text-slate-300 backdrop-blur-md">
          {currentRealmData.subtitle}
        </div>
        <h2 className="text-xl font-bold font-['Syne',sans-serif] text-white tracking-tight leading-tight">
          {currentRealmData.name}
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed drop-shadow-md">
          {currentRealmData.tagline}
        </p>
      </div>

      {/* Interactive Controls Helper at Right Middle (Desktop) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none hidden lg:flex flex-col gap-2 text-[10px] font-mono text-slate-400 bg-slate-950/50 backdrop-blur-md p-3 rounded-xl border border-white/5">
        <div className="text-[11px] font-bold text-slate-200 pb-1 border-b border-white/5 font-sans">
          Interaction Guide
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>Orbit / Look:</span>
          <span className="text-cyan-300 font-semibold">Drag / Touch</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>Zoom:</span>
          <span className="text-cyan-300 font-semibold">Scroll Wheel</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>Inspect Artifact:</span>
          <span className="text-cyan-300 font-semibold">Click 3D Mesh</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>Drone Fly:</span>
          <span className="text-cyan-300 font-semibold">W A S D</span>
        </div>
      </div>
    </>
  );
};
