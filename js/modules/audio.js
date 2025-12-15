// ==========================================
//  MODULE: AUDIO MANAGER
//  Handles sound effects and music.
// ==========================================

import { config } from './config.js';

class AudioManager {
    constructor() {
        this.clickSound = null;
        this.bgMusic = null;
        this.isMuted = config.audio.muted;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        // Preload 'click' sound
        // User customized path:
        this.clickSound = new Audio('audio/mixkit-cool-interface-click-tone-2568.wav');
        this.clickSound.volume = config.audio.volume;
        
        // Setup Background Music
        this.bgMusic = new Audio('audio/cozy-lofi-beat-sunset-stars-253833.mp3');
        this.bgMusic.loop = true;
        this.bgMusic.volume = config.audio.volume; // Use global volume or scaling factor

        // Load assets
        this.clickSound.load();
        this.bgMusic.load();
        
        this.initialized = true;
        console.log('Audio Manager Initialized');

        // Start Music (Autoplay allowed now as we are inside a user interaction)
        this.playMusic();
    }

    playClick() {
        if (!this.clickSound) return;

        const sound = this.clickSound.cloneNode();
        sound.volume = config.audio.volume;
        
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

    toggleMute() {
        this.isMuted = !this.isMuted;
        config.audio.muted = this.isMuted; 
        
        if (this.isMuted) {
            this.stopMusic();
        } else {
            if (this.initialized) this.playMusic();
        }

        return this.isMuted;
    }
}

export const audioManager = new AudioManager();
