import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Zap, Shield, Activity, Radio } from 'lucide-react';
import { RealmId } from '../types';
import { REALMS } from '../data/realms';
import { soundEngine } from '../audio/soundEngine';

interface InspectModalProps {
  nodeId: string | null;
  nodeName: string;
  realmId: RealmId;
  onClose: () => void;
}

export const InspectModal: React.FC<InspectModalProps> = ({
  nodeId,
  nodeName,
  realmId,
  onClose,
}) => {
  if (!nodeId) return null;

  const currentRealmData = REALMS[realmId];
  const matchedHighlight = currentRealmData.highlightObjects.find((h) => h.id === nodeId);

  const title = matchedHighlight ? matchedHighlight.name : nodeName || 'Cosmic Singularity Node';
  const description = matchedHighlight
    ? matchedHighlight.description
    : 'A hyper-dimensional mathematical structure resonating with localized quantum fields.';
  const type = matchedHighlight ? matchedHighlight.type : 'Quantum Geometric Node';

  const handleResonate = () => {
    soundEngine.playEnergyPulseSFX();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          id="inspect-node-modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]"
        >
          {/* Header */}
          <div
            className="p-5 border-b border-white/10 flex items-center justify-between"
            style={{
              background: `linear-gradient(to right, ${currentRealmData.themeColor}22, #0f172a, ${currentRealmData.accentColor}22)`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg"
                style={{
                  backgroundColor: `${currentRealmData.themeColor}20`,
                  borderColor: `${currentRealmData.themeColor}50`,
                  color: currentRealmData.themeColor,
                }}
              >
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {type}
                </span>
                <h3 className="text-base font-bold font-['Syne',sans-serif] text-white">
                  {title}
                </h3>
              </div>
            </div>

            <button
              id="close-inspect-modal"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Details Body */}
          <div className="p-5 space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">{description}</p>

            {/* Matrix Metrics */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="text-[10px] text-slate-500">Domain</div>
                  <div className="text-xs font-semibold text-slate-200">{currentRealmData.name}</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-[10px] text-slate-500">Resonance</div>
                  <div className="text-xs font-semibold text-emerald-300">432.0 Hz Harmonic</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center gap-2.5">
                <Radio className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-[10px] text-slate-500">Quantum State</div>
                  <div className="text-xs font-semibold text-purple-300">Entangled / Active</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-[10px] text-slate-500">Energy Flux</div>
                  <div className="text-xs font-semibold text-amber-300">98.4% Efficiency</div>
                </div>
              </div>
            </div>

            {/* Interactive Pulse Action */}
            <button
              id="pulse-energy-btn"
              onClick={handleResonate}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Trigger Harmonic Resonance Wave</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
