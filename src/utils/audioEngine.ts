/**
 * Audio Engine with dual-mode playback:
 * 1. HTML5 Audio Element for genuine audio streams
 * 2. Web Audio API Procedural Synth Fallback so songs can ALWAYS play enjoyable musical tones
 * even if network/CORS restricts external audio streaming in iframe environments.
 */

class AudioEngine {
  private audio: HTMLAudioElement;
  private audioContext: AudioContext | null = null;
  private synthGainNode: GainNode | null = null;
  private synthInterval: number | null = null;
  private isSynthMode: boolean = false;
  private simulatedCurrentTime: number = 0;
  private simulatedDuration: number = 180;
  private simulatedInterval: number | null = null;

  public onTimeUpdate?: (currentTime: number, duration: number) => void;
  public onEnded?: () => void;
  public onStateChange?: (isPlaying: boolean) => void;

  private currentVolume: number = 0.8;
  private isMuted: boolean = false;
  private currentGenre: string = 'Electronic';

  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this.audio.crossOrigin = 'anonymous';

    this.setupListeners();
  }

  private setupListeners() {
    this.audio.addEventListener('timeupdate', () => {
      if (!this.isSynthMode && this.onTimeUpdate) {
        this.onTimeUpdate(this.audio.currentTime, this.audio.duration || 180);
      }
    });

    this.audio.addEventListener('ended', () => {
      if (this.onEnded) this.onEnded();
    });

    this.audio.addEventListener('play', () => {
      if (this.onStateChange) this.onStateChange(true);
    });

    this.audio.addEventListener('pause', () => {
      if (!this.isSynthMode && this.onStateChange) this.onStateChange(false);
    });

    this.audio.addEventListener('error', () => {
      console.warn('HTML5 Audio error, switching seamlessly to procedural audio engine.');
      this.switchToSynthFallback();
    });
  }

  private getAudioContext(): AudioContext | null {
    if (!this.audioContext && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }
    return this.audioContext;
  }

  public loadSong(url: string, durationSec: number, genre: string = 'Electronic') {
    this.stopSynth();
    this.isSynthMode = false;
    this.currentGenre = genre;
    this.simulatedDuration = durationSec;
    this.simulatedCurrentTime = 0;

    this.audio.src = url;
    this.audio.currentTime = 0;
    this.setVolume(this.currentVolume, this.isMuted);
  }

  public async play(): Promise<void> {
    try {
      if (this.isSynthMode) {
        this.startSynth();
        if (this.onStateChange) this.onStateChange(true);
        return;
      }
      
      const promise = this.audio.play();
      if (promise !== undefined) {
        await promise.catch((err) => {
          console.warn('Playback error, engaging audio synth:', err);
          this.switchToSynthFallback();
        });
      }
    } catch {
      this.switchToSynthFallback();
    }
  }

  public pause() {
    if (this.isSynthMode) {
      this.pauseSynth();
    } else {
      this.audio.pause();
    }
    if (this.onStateChange) this.onStateChange(false);
  }

  public seek(seconds: number) {
    if (this.isSynthMode) {
      this.simulatedCurrentTime = Math.max(0, Math.min(seconds, this.simulatedDuration));
      if (this.onTimeUpdate) {
        this.onTimeUpdate(this.simulatedCurrentTime, this.simulatedDuration);
      }
    } else {
      if (isFinite(seconds) && this.audio.duration) {
        this.audio.currentTime = Math.max(0, Math.min(seconds, this.audio.duration));
      }
    }
  }

  public setVolume(volume: number, muted: boolean = false) {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    this.isMuted = muted;
    const effectiveVol = muted ? 0 : this.currentVolume;
    this.audio.volume = effectiveVol;

    if (this.synthGainNode && this.audioContext) {
      this.synthGainNode.gain.setValueAtTime(effectiveVol * 0.15, this.audioContext.currentTime);
    }
  }

  private switchToSynthFallback() {
    this.isSynthMode = true;
    this.audio.pause();
    this.startSynth();
    if (this.onStateChange) this.onStateChange(true);
  }

  private startSynth() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    if (!this.synthGainNode) {
      this.synthGainNode = ctx.createGain();
      this.synthGainNode.connect(ctx.destination);
    }

    const effectiveVol = this.isMuted ? 0 : this.currentVolume;
    this.synthGainNode.gain.setValueAtTime(effectiveVol * 0.18, ctx.currentTime);

    this.stopSynth(); // Clear any running interval

    // Play a gentle chord sequence based on genre
    const scales: Record<string, number[]> = {
      Electronic: [220, 261.63, 329.63, 392.00, 440, 523.25], // Am pentatonic
      Synthwave: [196, 246.94, 293.66, 369.99, 440],          // Bm/G retro
      Jazz: [261.63, 329.63, 392.00, 493.88, 587.33],        // Cmaj9
      'R&B / Soul': [220, 277.18, 329.63, 415.30, 493.88],   // C#m7 / A
      'Indie Folk': [196, 220, 261.63, 293.66, 392],          // G/C folk
      Ambient: [164.81, 220, 261.63, 329.63, 392]            // Low lush pad
    };

    const notes = scales[this.currentGenre] || scales['Electronic'];
    let step = 0;

    const playTone = (freq: number, type: OscillatorType = 'sine', decay: number = 1.2) => {
      if (!ctx || this.isMuted || this.currentVolume === 0) return;
      try {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        noteGain.gain.setValueAtTime(0.001, ctx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + decay);

        osc.connect(noteGain);
        if (this.synthGainNode) {
          noteGain.connect(this.synthGainNode);
        }

        osc.start();
        osc.stop(ctx.currentTime + decay);
      } catch {
        // Silently ignore audio oscillator errors
      }
    };

    // Play initial chord
    playTone(notes[0], 'triangle', 2.0);
    playTone(notes[2], 'sine', 2.5);

    this.synthInterval = window.setInterval(() => {
      step++;
      const note = notes[step % notes.length];
      const bass = notes[0] / 2;

      // Pulse note
      playTone(note, step % 2 === 0 ? 'sine' : 'triangle', 1.4);
      
      // Bass note every 4 steps
      if (step % 4 === 0) {
        playTone(bass, 'triangle', 1.8);
      }
    }, 900);

    // Track timer
    if (this.simulatedInterval) clearInterval(this.simulatedInterval);
    this.simulatedInterval = window.setInterval(() => {
      this.simulatedCurrentTime += 0.5;
      if (this.simulatedCurrentTime >= this.simulatedDuration) {
        this.simulatedCurrentTime = 0;
        if (this.onEnded) this.onEnded();
      } else if (this.onTimeUpdate) {
        this.onTimeUpdate(this.simulatedCurrentTime, this.simulatedDuration);
      }
    }, 500);
  }

  private pauseSynth() {
    this.stopSynth();
  }

  private stopSynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.simulatedInterval) {
      clearInterval(this.simulatedInterval);
      this.simulatedInterval = null;
    }
  }

  public destroy() {
    this.audio.pause();
    this.stopSynth();
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
    }
  }
}

export const audioEngine = new AudioEngine();
