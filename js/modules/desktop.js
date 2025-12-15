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
            <i class="fa-solid fa-folder" style="color: #f8d775;"></i>
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
