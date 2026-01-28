import { fileSystem, apps } from './system_config.js';
import { t } from './language_manager.js';
import { openWindow } from './window_manager.js';
import { renderFileExplorer, resetExplorerPath } from './app_renderer.js';
import { audioManager } from './audio_manager.js';

document.addEventListener('click', () => {
    if (!audioManager.initialized) audioManager.init();
    audioManager.playClick();
});

export function initDesktop() {
    const container = document.getElementById('desktop-icons');
    container.innerHTML = ''; 

    fileSystem.root.forEach((item, i) => {
        const el = document.createElement('div');
        el.className = 'desktop-icon';
        Object.assign(el.style, { position: 'absolute', top: `${20 + (i * 110)}px`, left: '20px' });

        el.innerHTML = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" style="image-rendering: pixelated; margin-bottom: 5px;">
            <path d="M22 6H12L10 4H2V20H22V6Z" fill="#F8D775" stroke="#000" stroke-width="2"/>
            <path d="M2 6H22V20H2V6Z" fill="#F8D775"/><path d="M12 6L10 4H2V6H12Z" fill="#FFE59A"/>
            <rect x="3" y="7" width="18" height="1" fill="#FFE59A"/><rect x="2" y="6" width="1" height="14" fill="#000"/>
            <rect x="21" y="6" width="1" height="14" fill="#000"/><rect x="2" y="20" width="20" height="1" fill="#000"/>
        </svg><span>${t(item.nameKey)}</span>`;

        el.ondblclick = () => {
            openWindow(apps.find(a => a.id === 'file-explorer'));
            resetExplorerPath(item, item.children);
            const content = document.getElementById(`content-file-explorer`);
            if (content) renderFileExplorer(content, item.children);
        };
        el.onmousedown = (e) => startDrag(e, el);
        container.appendChild(el);
    });

    ['welcome-text-en', 'welcome-text-jp'].forEach(id => {
        const el = document.getElementById(id);
        if (!el || el.querySelector('span')) return;
        const text = el.innerText.trim();
        const segments = id.includes('jp') ? ["こんにちは、", "ネットポアン", "テップラタンナー", "です！"] : text.split(' ');
        el.innerHTML = segments.map((s, i) => {
            const letters = s.split('').map(c => `<span>${c}</span>`).join('');
            return `<span class="word-span" style="display: inline-block; white-space: nowrap;">${letters}</span>${id.includes('jp') && i === 1 ? '&nbsp;' : ''}`;
        }).join(id.includes('jp') ? '' : ' ');
    });
}

function startDrag(e, el) {
    const rect = el.getBoundingClientRect();
    const offset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const move = (ev) => Object.assign(el.style, { left: `${ev.clientX - offset.x}px`, top: `${ev.clientY - offset.y}px` });
    const up = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
}
