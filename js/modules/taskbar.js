// ==========================================
//  MODULE: TASKBAR
//  Handles the bottom bar, start button, and clock.
// ==========================================

import { apps } from './config.js';
import { toggleWindow } from './windows.js';
import { toggleLanguage, updateLanguageButton } from './i18n.js';
import { audioManager } from './audio.js';

export function initTaskbar() {
    const container = document.getElementById('taskbar-apps');
    container.innerHTML = '';
    
    // CHANGE THIS: Add 'id's here to pin more apps to the taskbar
    const pinnedIds = ['file-explorer', 'photos', 'contact', 'terminal', 'browser'];

    pinnedIds.forEach(id => {
        const app = apps.find(a => a.id === id);
        if (app) {
            const btn = document.createElement('div');
            btn.className = 'taskbar-app';
            btn.id = `taskbar-btn-${app.id}`;
            btn.innerHTML = `<i class="${app.icon}"></i>`;
            btn.onclick = () => toggleWindow(app);
            container.appendChild(btn);
        }
    });

    // Language Toggle
    let langBtn = document.getElementById('lang-toggle');
    if (!langBtn) {
        langBtn = document.createElement('button');
        langBtn.id = 'lang-toggle';
        langBtn.className = 'lang-btn';
        langBtn.onclick = toggleLanguage;
        
        const clock = document.getElementById('clock');
        if (clock) {
            clock.parentNode.insertBefore(langBtn, clock);
        }
    }
    updateLanguageButton();

    // Volume Toggle
    const volumeBtn = document.getElementById('volume-btn');
    if (volumeBtn) {
        volumeBtn.onclick = () => {
            const isMuted = audioManager.toggleMute();
            const icon = document.getElementById('volume-icon');
            if (icon) {
                icon.className = isMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
            }
        };
    }
}

export function initClock() {
    const clock = document.getElementById('clock');
    setInterval(() => {
        clock.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, 1000);
}

export function updateTaskbarActive(id, active) {
    document.querySelectorAll('.taskbar-app').forEach(el => el.classList.remove('active'));
    if (active) document.getElementById(`taskbar-btn-${id}`)?.classList.add('active');
}
