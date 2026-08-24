import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Award,
  Clock,
  Camera,
  CheckCircle2,
  Download,
  Sparkles,
  Layers,
  Code2,
  Flame,
  Globe,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../audio/soundEngine';

interface HackathonSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaptureScreenshot: () => string;
}

export const HackathonSubmissionModal: React.FC<HackathonSubmissionModalProps> = ({
  isOpen,
  onClose,
  onCaptureScreenshot,
}) => {
  const [activeTab, setActiveTab] = useState<'submission' | 'inspiration' | 'tech' | 'rules'>('submission');
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 8,
    hours: 5,
    minutes: 20,
    seconds: 0,
  });

  // Calculate live countdown to 1 Sept 2026 @ 3:30am GMT+5:30
  useEffect(() => {
    const targetDate = new Date('2026-09-01T03:30:00+05:30').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCaptureScreenshot = () => {
    soundEngine.playEnergyPulseSFX();
    const dataUrl = onCaptureScreenshot();
    if (dataUrl) {
      setScreenshots((prev) => {
        const next = [dataUrl, ...prev.slice(0, 5)];
        if (next.length >= 3) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
        return next;
      });
    }
  };

  const handleDownloadImage = (url: string, index: number) => {
    const link = document.createElement('a');
    link.download = `AetherSphere-3D-Hackathon-Screenshot-0${index + 1}.png`;
    link.href = url;
    link.click();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          id="hackathon-submission-modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-950/30 via-slate-900 to-cyan-950/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-bold">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold font-['Syne',sans-serif] text-white">
                    3D Websites Hackathon
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    Official Submission Suite
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Build the most creative and visually stunning 3D website imaginable.
                </p>
              </div>
            </div>

            <button
              id="close-hackathon-modal"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Countdown & Hackathon Banner */}
          <div className="px-6 py-3 bg-slate-950/60 border-b border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Deadline: 1 Sept 2026 @ 3:30am GMT+5:30</span>
            </div>

            {/* Live Countdown Digits */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-white/5">
                <span className="font-bold text-white font-mono">{timeLeft.days}</span>
                <span className="text-slate-400 text-[10px]">d</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-white/5">
                <span className="font-bold text-white font-mono">{timeLeft.hours}</span>
                <span className="text-slate-400 text-[10px]">h</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-white/5">
                <span className="font-bold text-white font-mono">{timeLeft.minutes}</span>
                <span className="text-slate-400 text-[10px]">m</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-white/5">
                <span className="font-bold text-cyan-400 font-mono">{timeLeft.seconds}</span>
                <span className="text-slate-400 text-[10px]">s</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 border-b border-white/10 flex gap-4">
            <button
              onClick={() => setActiveTab('submission')}
              className={`py-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'submission'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Submission Checklist & Screenshots ({screenshots.length}/3)
            </button>
            <button
              onClick={() => setActiveTab('inspiration')}
              className={`py-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'inspiration'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Idea & Inspiration Dossier
            </button>
            <button
              onClick={() => setActiveTab('tech')}
              className={`py-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'tech'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Technologies & Shaders
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`py-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'rules'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Official Guidelines & Judging
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
            {activeTab === 'submission' && (
              <div className="space-y-6">
                {/* Requirements Status Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-800/40 border border-emerald-500/20 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Publicly Accessible Web Experience</h4>
                      <p className="text-[11px] text-slate-400">
                        Interactive 3D WebGL app built with Three.js running at 60+ FPS on any browser.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/40 border border-emerald-500/20 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Project Idea & Creative Lore</h4>
                      <p className="text-[11px] text-slate-400">
                        Comprehensive narrative explaining the 5 procedural dimensions and architectural inspiration.
                      </p>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-xl bg-slate-800/40 border flex items-start gap-3 ${
                    screenshots.length >= 3 ? 'border-emerald-500/20' : 'border-amber-500/20'
                  }`}>
                    {screenshots.length >= 3 ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Camera className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        At least 3 Screenshots ({screenshots.length}/3 Captured)
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Use the 1-Click capture tool below to capture instant high-resolution WebGL shots.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/40 border border-emerald-500/20 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Full Source Code & Toolchain</h4>
                      <p className="text-[11px] text-slate-400">
                        Modern TypeScript, Web Audio API, Three.js shaders, Tailwind CSS, Motion.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Screenshot Capture Studio */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Camera className="w-4 h-4 text-cyan-400" />
                        <span>High-Resolution 3D Screenshot Generator</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Instantly render and capture the active 3D canvas viewport for your hackathon submission.
                      </p>
                    </div>

                    <button
                      id="capture-screenshot-btn"
                      onClick={handleCaptureScreenshot}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Capture Active View</span>
                    </button>
                  </div>

                  {/* Screenshots Gallery */}
                  {screenshots.length === 0 ? (
                    <div className="py-8 text-center border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                      <Camera className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                      <p className="text-xs text-slate-400 font-medium">No screenshots captured yet.</p>
                      <p className="text-[11px] text-slate-500">
                        Click "Capture Active View" while exploring different realms to save high-res submission stills.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {screenshots.map((url, idx) => (
                        <div
                          key={idx}
                          className="group relative rounded-xl overflow-hidden border border-white/15 bg-slate-950 aspect-video shadow-md"
                        >
                          <img
                            src={url}
                            alt={`Capture ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">
                            <span className="text-[10px] font-bold text-white">Shot #{idx + 1}</span>
                            <button
                              onClick={() => handleDownloadImage(url, idx)}
                              className="p-1.5 rounded-lg bg-cyan-500/80 hover:bg-cyan-500 text-white shadow-md transition-all"
                              title="Download PNG"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'inspiration' && (
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <div className="p-4 rounded-xl bg-slate-800/40 border border-white/5 space-y-2">
                  <h3 className="text-sm font-bold text-white font-['Syne',sans-serif] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Project Vision: "AetherSphere — The Infinite Dimensions"</span>
                  </h3>
                  <p>
                    The modern web has historically been constrained to 2D flat rectangles, vertical feeds, and repetitive scroll mechanics.
                    For the <strong>3D Websites Hackathon</strong>, our vision was to obliterate the flat screen and construct an interactive
                    hyper-spatial multiverse that invokes genuine awe and wonder: <em>"Stop scrolling and say: Wow."</em>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-800/30 border border-white/5 space-y-1.5">
                    <h4 className="font-bold text-cyan-300">1. Architectural Duality</h4>
                    <p className="text-slate-400 text-[11px]">
                      Juxtaposing dystopian cybernetic mega-structures with celestial natural sanctuaries and deep ocean bioluminescence.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-800/30 border border-white/5 space-y-1.5">
                    <h4 className="font-bold text-purple-300">2. Non-Euclidean Mathematical Beauty</h4>
                    <p className="text-slate-400 text-[11px]">
                      Morphing 4D hyper-torus knots and golden spiral Fibonacci rings rendered in physical chrome and refractive glass.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-800/30 border border-white/5 space-y-1.5">
                    <h4 className="font-bold text-emerald-300">3. Generative Spatial Sound</h4>
                    <p className="text-slate-400 text-[11px]">
                      Pure Web Audio API procedural synthesis with zero external audio assets, harmonic chords tuned to sacred 432Hz.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-800/30 border border-white/5 space-y-1.5">
                    <h4 className="font-bold text-amber-300">4. Interactive Tactile Feedback</h4>
                    <p className="text-slate-400 text-[11px]">
                      Raycast ray-tracing lets visitors click and pulse energy waves through any cosmic artifact in real-time.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tech' && (
              <div className="space-y-4 text-xs text-slate-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-800/40 border border-white/5 space-y-1">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold">
                      <Code2 className="w-4 h-4" />
                      <span>Three.js & WebGL 2.0</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      ACESFilmic tone mapping, physical glass transmission, custom procedural textures generated on offscreen canvas buffers.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/40 border border-white/5 space-y-1">
                    <div className="flex items-center gap-2 text-purple-400 font-bold">
                      <Layers className="w-4 h-4" />
                      <span>Procedural Shaders & Particles</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Over 25,000 active dynamic particles across 5 realms with additive blending, velocity vectors, and wave deformation.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/40 border border-white/5 space-y-1">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <Sparkles className="w-4 h-4" />
                      <span>Web Audio API Synthesizer</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Sub-bass oscillators, bandpass resonance filters, LFO frequency modulation, and interactive audio feedback.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/40 border border-white/5 space-y-1">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <Globe className="w-4 h-4" />
                      <span>React 19 & Framer Motion</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Ultra-smooth spring layout animations, glassmorphism HUD, and reactive camera interpolation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rules' && (
              <div className="space-y-4 text-xs text-slate-300">
                <div className="p-4 rounded-xl bg-slate-800/40 border border-white/5 space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span>Hackathon Judging Philosophy</span>
                  </h4>
                  <p className="text-slate-400">
                    "Most hackathons focus on solving problems. This one focuses on creating wonder.
                    The judging is based primarily on creativity, aesthetics, and overall experience.
                    Technical complexity is optional. A beautiful and creative project can outperform a highly technical one."
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submission Checklist Compliant</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] pl-2">
                    <li>Publicly accessible web link provided</li>
                    <li>Project description and creative inspiration documented</li>
                    <li>Integrated 3D screenshot generator ready for the 3+ submission images</li>
                    <li>Source code structured in clean modular TypeScript</li>
                    <li>Appropriate for all global audiences</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-slate-950/60 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              AetherSphere 3D • Built for 3D Websites Hackathon
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all"
            >
              Close Dossier
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
