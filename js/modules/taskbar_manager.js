import { apps } from './system_config.js';
import { toggleWindow } from './window_manager.js';
import { toggleLanguage, updateLanguageButton } from './language_manager.js';
import { audioManager } from './audio_manager.js';

const SVGS = {
    terminal: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" fill="black" stroke="white" stroke-width="2"/><path d="M6 8L10 12L6 16" stroke="white" stroke-width="2"/><rect x="12" y="14" width="6" height="2" fill="white"/></svg>`,
    browser: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="none" stroke="white" stroke-width="2"/><path d="M2 12H22" stroke="white" stroke-width="2"/><path d="M12 2C14.5 5 16 8.5 16 12C16 15.5 14.5 19 12 22" stroke="white" stroke-width="2"/><path d="M12 2C9.5 5 8 8.5 8 12C8 15.5 9.5 19 12 22" stroke="white" stroke-width="2"/></svg>`,
    contact: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" fill="white" stroke="black" stroke-width="2"/><path d="M2 4L12 14L22 4" stroke="black" stroke-width="2"/><path d="M2 20L8 14" stroke="black" stroke-width="2"/><path d="M22 20L16 14" stroke="black" stroke-width="2"/></svg>`
};

export function initTaskbar() {
    const container = document.getElementById('taskbar-apps');
    container.innerHTML = '';
    
    ['file-explorer', 'photos', 'contact', 'terminal', 'browser'].forEach(id => {
        const app = apps.find(a => a.id === id);
        if (!app) return;

        const btn = document.createElement('div');
        btn.className = 'taskbar-app';
        btn.id = `taskbar-btn-${app.id}`;
        
        const iconId = { 'file-explorer': 'icon-folder', 'photos': 'icon-image' }[app.id];
        const template = iconId ? document.getElementById(iconId) : null;

        if (template) {
            const svg = template.cloneNode(true);
            svg.setAttribute('width', '24');
            svg.setAttribute('height', '24');
            btn.appendChild(svg);
        } else {
            btn.innerHTML = SVGS[app.id] || `<i class="${app.icon}" style="font-size: 20px;"></i>`;
        }

        btn.onclick = () => toggleWindow(app);
        container.appendChild(btn);
    });

    if (!document.getElementById('lang-toggle')) {
        const langBtn = document.createElement('button');
        langBtn.id = 'lang-toggle';
        langBtn.className = 'lang-btn';
        langBtn.onclick = toggleLanguage;
        document.getElementById('clock')?.parentNode.insertBefore(langBtn, document.getElementById('clock'));
    }
    updateLanguageButton();

    const volumeBtn = document.getElementById('volume-btn');
    if (volumeBtn) {
        const pop = document.createElement('div');
        pop.className = 'volume-popup';
        pop.appendChild(document.getElementById('tpl-volume-popup').content.cloneNode(true));
        document.body.appendChild(pop);

        const slider = pop.querySelector('.volume-slider');
        slider.value = audioManager.volume;
        
        const updateIcon = (vol) => {
            const icon = document.getElementById('volume-icon');
            if (!icon) return;
            icon.className = `fa-solid fa-volume-${vol <= 0 ? 'xmark' : vol < 0.5 ? 'low' : 'high'}`;
        };

        updateIcon(audioManager.volume);

        slider.oninput = (e) => {
            audioManager.setVolume(parseFloat(e.target.value));
            updateIcon(e.target.value);
        };

        volumeBtn.onclick = (e) => {
            e.stopPropagation();
            const rect = volumeBtn.getBoundingClientRect();
            pop.style.bottom = '50px'; 
            pop.style.right = (window.innerWidth - rect.right - 17) + 'px';
            pop.classList.toggle('show');
        };

        window.onclick = (e) => {
            if (!pop.contains(e.target) && !volumeBtn.contains(e.target)) pop.classList.remove('show');
        };
    }
}

export function initClock() {
    const clock = document.getElementById('clock');
    setInterval(() => {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const date = now.toISOString().split('T')[0].replace(/-/g, '/');
        clock.innerHTML = `${time}<br>${date}`;
    }, 1000);
}

export function updateTaskbarActive(id, active) {
    document.querySelectorAll('.taskbar-app').forEach(el => el.classList.toggle('active', active && el.id === `taskbar-btn-${id}`));
}
