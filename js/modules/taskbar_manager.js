// ==========================================
//  MODULE: TASKBAR
//  Handles the bottom bar, start button, and clock.
// ==========================================

import { apps } from './system_config.js';
import { toggleWindow } from './window_manager.js';
import { toggleLanguage, updateLanguageButton } from './language_manager.js';
import { audioManager } from './audio_manager.js';

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
            if (app.id === 'file-explorer') {
                 btn.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated;">
                        <path d="M22 6H12L10 4H2V20H22V6Z" fill="#F8D775" stroke="#000" stroke-width="2" shape-rendering="crispEdges"/>
                        <path d="M2 6H22V20H2V6Z" fill="#F8D775"/>
                        <path d="M12 6L10 4H2V6H12Z" fill="#FFE59A"/>
                        <rect x="3" y="7" width="18" height="1" fill="#FFE59A"/>
                        <rect x="2" y="6" width="1" height="14" fill="#000"/>
                        <rect x="21" y="6" width="1" height="14" fill="#000"/>
                        <rect x="2" y="20" width="20" height="1" fill="#000"/>
                    </svg>
                `;
            } else if (app.id === 'terminal') {
                btn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" fill="black" stroke="white" stroke-width="2"/><path d="M6 8L10 12L6 16" stroke="white" stroke-width="2"/><rect x="12" y="14" width="6" height="2" fill="white"/></svg>`;
            } else if (app.id === 'browser') {
                 btn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="none" stroke="white" stroke-width="2"/><path d="M2 12H22" stroke="white" stroke-width="2"/><path d="M12 2C14.5 5 16 8.5 16 12C16 15.5 14.5 19 12 22" stroke="white" stroke-width="2"/><path d="M12 2C9.5 5 8 8.5 8 12C8 15.5 9.5 19 12 22" stroke="white" stroke-width="2"/></svg>`;
            } else if (app.id === 'contact') {
                 btn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" fill="white" stroke="black" stroke-width="2"/><path d="M2 4L12 14L22 4" stroke="black" stroke-width="2"/><path d="M2 20L8 14" stroke="black" stroke-width="2"/><path d="M22 20L16 14" stroke="black" stroke-width="2"/></svg>`;
            } else if (app.id === 'photos') {
                btn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M2 2H22V22H2V2Z" fill="#ffffff" stroke="black"/><circle cx="8" cy="8" r="3" fill="#ffcc00"/><path d="M2 16L8 10L14 16L18 12L22 16V22H2V16Z" fill="#44aa44"/></svg>`;
            } else {
                btn.innerHTML = `<i class="${app.icon}" style="font-size: 20px;"></i>`;
            }
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
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const date = `${year}/${month}/${day}`;
        clock.innerHTML = `${time}<br>${date}`;
    }, 1000);
}

export function updateTaskbarActive(id, active) {
    document.querySelectorAll('.taskbar-app').forEach(el => el.classList.remove('active'));
    if (active) document.getElementById(`taskbar-btn-${id}`)?.classList.add('active');
}
