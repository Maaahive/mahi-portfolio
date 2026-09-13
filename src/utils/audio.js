// Web Audio API Synthesizer - Tactile Sci-Fi Audio Engine
class SoundEngine {
  constructor() {
    this.ctx = null;
    // Default to enabled if user hasn't explicitly muted, or keep saved preference
    const saved = localStorage.getItem("sound_enabled");
    this.enabled = saved === "true";
    this.lastHoverTime = 0;

    // Listen globally on window for user interactions to unlock AudioContext
    if (typeof window !== "undefined") {
      const unlock = () => {
        this.init();
      };
      window.addEventListener("click", unlock, { once: true });
      window.addEventListener("keydown", unlock, { once: true });

      // Global click sound delegation
      window.addEventListener("click", (e) => {
        if (!this.enabled) return;
        const target = e.target;
        if (target && target.closest("a, button, [role='button'], .project-card, .filter-chip, .clickable, input, textarea")) {
          this.playClick();
        }
      });

      let isScrolling = false;
      let scrollTimer = null;
      window.addEventListener("scroll", () => {
        isScrolling = true;
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          isScrolling = false;
        }, 90);
      }, { passive: true });

      // Global hover sound delegation (throttled to max once per 140ms and paused during active scrolling)
      window.addEventListener("mouseover", (e) => {
        if (!this.enabled || isScrolling) return;
        const now = Date.now();
        if (now - this.lastHoverTime < 140) return;

        const target = e.target;
        if (target && target.closest("a, button, [role='button'], .project-card, .filter-chip")) {
          this.lastHoverTime = now;
          this.playHover();
        }
      }, { passive: true });
    }
  }

  init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    } catch (_) {}
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem("sound_enabled", this.enabled ? "true" : "false");
    this.init();
    if (this.enabled) {
      this.playSuccess();
    }
    return this.enabled;
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (_) {}
  }

  playHover() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.linearRampToValueAtTime(540, now + 0.045);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch (_) {}
  }

  playSuccess() {
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.16);
      });
    } catch (_) {}
  }

  playGlitch() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      for (let i = 0; i < 4; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220 + Math.random() * 700, now + i * 0.03);

        gain.gain.setValueAtTime(0.12, now + i * 0.03);
        gain.gain.linearRampToValueAtTime(0.001, now + i * 0.03 + 0.035);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.03);
        osc.stop(now + i * 0.03 + 0.035);
      }
    } catch (_) {}
  }
}

export const sound = new SoundEngine();
