// ==========================================
//  MODULE: AUDIO MANAGER
//  Handles sound effects and music.
// ==========================================

import { config } from './system_config.js';

class AudioManager {
    constructor() {
        this.clickSound = null;
        this.bgMusic = null;
        
        // Load settings from localStorage
        const savedVolume = localStorage.getItem('os_volume');
        const savedMuted = localStorage.getItem('os_muted');

        this.volume = savedVolume ? parseFloat(savedVolume) : config.audio.volume;
        this.isMuted = savedMuted ? JSON.parse(savedMuted) : config.audio.muted;
        
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        // Preload 'click' sound
        // User customized path:
        this.clickSound = new Audio('audio/mixkit-cool-interface-click-tone-2568.wav');
        this.clickSound.volume = this.volume;
        
        // Setup Background Music
        this.bgMusic = new Audio('audio/cozy-lofi-beat-sunset-stars-253833.mp3');
        this.bgMusic.loop = true;
        this.bgMusic.volume = this.volume; 

        // Load assets
        this.clickSound.load();
        this.bgMusic.load();
        
        this.initialized = true;
        console.log('Audio Manager Initialized');

        if (!this.isMuted) {
             this.playMusic();
        }
    }

    playClick() {
        if (!this.clickSound) return;

        const sound = this.clickSound.cloneNode();
        sound.volume = this.volume;
        
        sound.play().catch(() => {});
    }

    playMusic() {
        if (this.isMuted || !this.bgMusic) return;
        this.bgMusic.play().catch(e => console.warn('Music autoplay prevented:', e));
    }

    stopMusic() {
        if (this.bgMusic) {
            this.bgMusic.pause();
        }
    }
    
    setVolume(val) {
        this.volume = Math.max(0, Math.min(1, val));
        localStorage.setItem('os_volume', this.volume);
        
        if (this.bgMusic) this.bgMusic.volume = this.volume;
        if (this.clickSound) this.clickSound.volume = this.volume;
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('os_muted', this.isMuted);
        
        if (this.isMuted) {
            this.stopMusic();
        } else {
            if (this.initialized) this.playMusic();
        }

        return this.isMuted;
    }
}

export const audioManager = new AudioManager();
