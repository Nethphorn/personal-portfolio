// ==========================================
//  MODULE: DESKTOP
//  Handles rendering desktop icons and drag/drop.
// ==========================================

import { fileSystem, apps } from './config.js';
import { t } from './i18n.js';
import { openWindow } from './windows.js';
import { renderFileExplorer, resetExplorerPath } from './apps.js';
import { audioManager } from './audio.js';

let dragIcon = null;

// ==========================================
//  EVENT LISTENERS
// ==========================================
// Global Click Listener for Sound
document.addEventListener('click', () => {
    // Initialize audio context on first user interaction if needed
    if (!audioManager.initialized) {
        audioManager.init();
    }
    audioManager.playClick();
});

// ==========================================
//  FUNCTION: initDesktop
//  Initializes the desktop by rendering icons.
// ==========================================
export function initDesktop() {
    const desktopContainer = document.getElementById('desktop-icons');
    desktopContainer.innerHTML = ''; 

    const desktopItems = fileSystem.root;

    desktopItems.forEach((item, index) => {
        const el = document.createElement('div');
        el.className = 'desktop-icon';
        el.style.position = 'absolute';
        el.style.top = `${20 + (index * 110)}px`;
        el.style.left = '20px';

        el.innerHTML = `
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated; margin-bottom: 5px;">
                <path d="M22 6H12L10 4H2V20H22V6Z" fill="#F8D775" stroke="#000" stroke-width="2" shape-rendering="crispEdges"/>
                <path d="M2 6H22V20H2V6Z" fill="#F8D775"/>
                <path d="M12 6L10 4H2V6H12Z" fill="#FFE59A"/>
                <!-- Pixel art detail/highlight -->
                <rect x="3" y="7" width="18" height="1" fill="#FFE59A"/>
                <rect x="2" y="6" width="1" height="14" fill="#000"/>
                <rect x="21" y="6" width="1" height="14" fill="#000"/>
                <rect x="2" y="20" width="20" height="1" fill="#000"/>
            </svg>
            <span>${t(item.nameKey)}</span>
        `;

        el.ondblclick = () => openFileExplorerAt(item);
        el.onmousedown = (e) => startIconDrag(e, el);

        desktopContainer.appendChild(el);
    });

    setupWelcomeText();
}

// ==========================================
//  FUNCTION: setupWelcomeText
//  Handles animating welcome text.
// ==========================================
function setupWelcomeText() {
    const ids = ['welcome-text-en', 'welcome-text-jp'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const text = el.innerText;
            if (el.querySelector('span')) return;
            
            // Split by spaces to handle word wrapping
            const words = text.split(' ');
            
            el.innerHTML = words.map(word => {
                const letters = word.split('').map(char => `<span>${char}</span>`).join('');
                
                return `<span class="word-span" style="display: inline-block; white-space: nowrap;">${letters}</span>`;
            }).join(' ');
        }
    });
}

// ==========================================
//  FUNCTION: openFileExplorerAt
//  Opens the file explorer at a specific folder.
// ==========================================
function openFileExplorerAt(folderItem) {
    const app = apps.find(a => a.id === 'file-explorer');
    openWindow(app);
    
    // We need to tell the explorer to navigate. 
    // Since we split the code, we can export a helper from apps.js to reset path
    resetExplorerPath(folderItem, folderItem.children);
    
    const contentDiv = document.getElementById(`content-file-explorer`);
    if (contentDiv) {
        renderFileExplorer(contentDiv, folderItem.children);
    }
}

// ==========================================
//  FUNCTION: startIconDrag
//  Handles dragging icons.
// ==========================================
function startIconDrag(e, el) {
    if (e.target.tagName === 'I' || e.target.tagName === 'SPAN') {
        // pass
    }
    dragIcon = el;
    const rect = el.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    function onMouseMove(ev) {
        el.style.left = `${ev.clientX - offsetX}px`;
        el.style.top = `${ev.clientY - offsetY}px`;
    }

    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        dragIcon = null;
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}
