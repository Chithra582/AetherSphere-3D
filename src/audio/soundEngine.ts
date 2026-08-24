/**
 * Procedural Web Audio Synthesizer for AetherSphere 3D
 * Generates continuous realm-specific spatial drones, harmonic chords, and interactive SFX.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isInitialized = false;
  private isMuted = false;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  // Active synthesizer nodes for generative ambient soundscapes
  private activeOscillators: OscillatorNode[] = [];
  private activeGains: GainNode[] = [];
  private activeFilters: BiquadFilterNode[] = [];
  private lfoNode: OscillatorNode | null = null;
  private currentRealm: string = '';

  public init() {
    if (this.isInitialized) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.isInitialized = true;
    } catch {
      // Audio context might require explicit user interaction
    }
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    if (!this.masterGain || !this.ctx) return;
    const clamped = Math.max(0, Math.min(1, val));
    this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : clamped, this.ctx.currentTime, 0.05);
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!this.masterGain || !this.ctx) return;
    this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.4, this.ctx.currentTime, 0.05);
  }

  public stopAmbient() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.activeGains.forEach(g => {
      try {
        g.gain.setTargetAtTime(0.0001, now, 0.3);
      } catch {}
    });

    setTimeout(() => {
      this.activeOscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {}
      });
      this.activeOscillators = [];
      this.activeGains = [];
      this.activeFilters = [];
      if (this.lfoNode) {
        try {
          this.lfoNode.stop();
          this.lfoNode.disconnect();
        } catch {}
        this.lfoNode = null;
      }
    }, 400);
  }

  public playRealmAmbiance(realm: string) {
    this.init();
    this.resume();
    if (!this.ctx || !this.ambientGain || this.isMuted) return;

    this.stopAmbient();
    this.currentRealm = realm;

    const now = this.ctx.currentTime;

    // Frequencies tailored for each theme
    let freqs: number[] = [110, 164.81, 220, 329.63]; // Default
    let type: OscillatorType = 'sine';
    let filterFreq = 600;

    switch (realm) {
      case 'cyberpunk':
        // Synthwave / Cyber dystopian minor 9th chord with saw & square harmonics
        freqs = [65.41, 130.81, 155.56, 196.0, 293.66]; // C2, C3, Eb3, G3, D4
        type = 'sawtooth';
        filterFreq = 800;
        break;
      case 'celestial':
        // Ethereal crystalline Lydian harmonics with lush sine waves
        freqs = [110.0, 220.0, 277.18, 329.63, 440.0, 659.25]; // A2, A3, C#4, E4, A4, E5
        type = 'sine';
        filterFreq = 1400;
        break;
      case 'abyss':
        // Sub-ocean deep resonant drones with underwater low-pass modulation
        freqs = [43.65, 87.31, 130.81, 174.61]; // F1, F2, C3, F3
        type = 'triangle';
        filterFreq = 350;
        break;
      case 'kinetic':
        // Glassy algorithmic pentatonic frequencies with bell resonance
        freqs = [146.83, 220.0, 293.66, 369.99, 440.0, 587.33]; // D3, A3, D4, F#4, A4, D5
        type = 'sine';
        filterFreq = 1800;
        break;
      case 'solaris':
        // Warm plasma sub-harmonics and pulsating magnetic drone
        freqs = [55.0, 110.0, 164.81, 246.94, 329.63]; // A1, A2, E3, B3, E4
        type = 'sawtooth';
        filterFreq = 500;
        break;
    }

    // Master low-pass filter with gentle LFO modulation for fluid dynamic breathing
    const mainFilter = this.ctx.createBiquadFilter();
    mainFilter.type = 'lowpass';
    mainFilter.frequency.setValueAtTime(filterFreq, now);
    mainFilter.Q.setValueAtTime(2, now);
    mainFilter.connect(this.ambientGain);

    // LFO for filter sweep
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.12, now); // slow breathing
    lfoGain.gain.setValueAtTime(filterFreq * 0.35, now);
    lfo.connect(lfoGain);
    lfoGain.connect(mainFilter.frequency);
    lfo.start();
    this.lfoNode = lfo;

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq + (Math.random() * 0.8 - 0.4), now); // slight detune for lush thickness

      // Staggered volume based on register
      const targetGain = (0.12 / Math.sqrt(idx + 1)) * (type === 'sawtooth' ? 0.35 : 0.8);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.setTargetAtTime(targetGain, now + 0.1, 1.2);

      osc.connect(gain);
      gain.connect(mainFilter);
      osc.start(now);

      this.activeOscillators.push(osc);
      this.activeGains.push(gain);
    });
  }

  // Interactive UI Sound Effects
  public playClickSFX() {
    this.init();
    this.resume();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  public playEnergyPulseSFX() {
    this.init();
    this.resume();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + 0.3);
    filter.Q.setValueAtTime(5, now);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  public playRealmWarpSFX() {
    this.init();
    this.resume();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(550, now + 0.4);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.8);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.82);
  }
}

export const soundEngine = new SoundEngine();
