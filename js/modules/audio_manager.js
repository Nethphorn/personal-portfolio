import { config } from './system_config.js';

class AudioManager {
    constructor() {
        const savedVol = localStorage.getItem('os_volume');
        this.volume = (savedVol !== null && !isNaN(parseFloat(savedVol))) ? parseFloat(savedVol) : config.audio.volume;
        
        const savedMute = localStorage.getItem('os_muted');
        this.isMuted = savedMute !== null ? JSON.parse(savedMute) : config.audio.muted;
        
        this.initialized = false;
        this.clickSound = null;
        this.bgMusic = null;
    }

    init() {
        if (this.initialized) return;
        
        // Ensure relative paths from the root where index.html is located
        this.clickSound = new Audio('audio/mixkit-cool-interface-click-tone-2568.wav');
        this.bgMusic = new Audio('audio/cozy-lofi-beat-sunset-stars-253833.mp3');
        this.bgMusic.loop = true;
        
        this.setVolume(this.volume);
        [this.clickSound, this.bgMusic].forEach(a => a.load());
        
        this.initialized = true;
        if (!this.isMuted) this.playMusic();
        console.log("Audio system initialized with volume:", this.volume);
    }

    playClick() {
        if (!this.clickSound) return;
        // Reset and play is often more reliable than cloning for simple sounds
        this.clickSound.currentTime = 0;
        this.clickSound.volume = this.volume;
        this.clickSound.play().catch(e => console.warn("Click sound failed:", e));
    }

    playMusic() {
        if (!this.isMuted && this.bgMusic) {
            this.bgMusic.play().catch(e => console.warn('Music playback failed:', e));
        }
    }

    stopMusic() {
        this.bgMusic?.pause();
    }
    
    setVolume(val) {
        this.volume = Math.max(0, Math.min(1, parseFloat(val) || 0));
        localStorage.setItem('os_volume', this.volume);
        if (this.bgMusic) this.bgMusic.volume = this.volume;
        if (this.clickSound) this.clickSound.volume = this.volume;
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('os_muted', this.isMuted);
        this.isMuted ? this.stopMusic() : this.playMusic();
        return this.isMuted;
    }
}

export const audioManager = new AudioManager();
