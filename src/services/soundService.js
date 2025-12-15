// Sound Service - plays sound effects for the app
class SoundService {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        // Create audio elements - using simple web tones
        // We'll use the Web Audio API for simple sounds
        this.audioContext = null;
        this.initialized = true;
    }

    getAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.audioContext;
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }

    // Play a simple beep sound
    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.enabled) return;

        try {
            const ctx = this.getAudioContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;
            gainNode.gain.value = volume;

            // Fade out
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + duration);
        } catch (e) {
            console.log('Sound not available:', e);
        }
    }

    // Play correct answer sound - happy ascending tone
    playCorrect() {
        if (!this.enabled) return;

        // Play two ascending tones
        this.playTone(523.25, 0.1, 'sine', 0.2); // C5
        setTimeout(() => this.playTone(659.25, 0.15, 'sine', 0.2), 100); // E5
        setTimeout(() => this.playTone(783.99, 0.2, 'sine', 0.25), 200); // G5
    }

    // Play wrong answer sound - descending tone
    playWrong() {
        if (!this.enabled) return;

        // Play two descending tones
        this.playTone(349.23, 0.15, 'triangle', 0.2); // F4
        setTimeout(() => this.playTone(293.66, 0.2, 'triangle', 0.15), 150); // D4
    }

    // Play level up / win sound - triumphant
    playLevelUp() {
        if (!this.enabled) return;

        // Ascending triumphant melody
        this.playTone(523.25, 0.1, 'sine', 0.2); // C5
        setTimeout(() => this.playTone(659.25, 0.1, 'sine', 0.2), 100); // E5
        setTimeout(() => this.playTone(783.99, 0.1, 'sine', 0.2), 200); // G5
        setTimeout(() => this.playTone(1046.50, 0.3, 'sine', 0.3), 300); // C6
    }

    // Play click/tap sound
    playClick() {
        if (!this.enabled) return;
        this.playTone(800, 0.05, 'sine', 0.1);
    }

    // Play XP gain sound
    playXP() {
        if (!this.enabled) return;
        this.playTone(880, 0.08, 'sine', 0.15); // A5
        setTimeout(() => this.playTone(1108.73, 0.1, 'sine', 0.15), 80); // C#6
    }

    // Play streak sound
    playStreak() {
        if (!this.enabled) return;
        this.playTone(659.25, 0.1, 'sine', 0.2); // E5
        setTimeout(() => this.playTone(880, 0.15, 'sine', 0.25), 100); // A5
    }

    // Play ready sound - simple notification
    playReady() {
        if (!this.enabled) return;
        this.playTone(659.25, 0.1, 'sine', 0.25); // E5
        setTimeout(() => this.playTone(783.99, 0.15, 'sine', 0.25), 100); // G5
    }

    // Play battle start sound - epic fanfare
    playBattleStart() {
        if (!this.enabled) return;
        this.playTone(392, 0.1, 'sine', 0.3); // G4
        setTimeout(() => this.playTone(523.25, 0.1, 'sine', 0.3), 100); // C5
        setTimeout(() => this.playTone(659.25, 0.1, 'sine', 0.3), 200); // E5
        setTimeout(() => this.playTone(783.99, 0.25, 'sine', 0.35), 300); // G5
    }
}

// Singleton instance
const soundService = new SoundService();
soundService.init();

export default soundService;
