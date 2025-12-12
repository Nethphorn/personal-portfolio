// ==========================================
//  MODULE: WINDOWS
//  Handles opening, closing, minimizing, and dragging windows.
// ==========================================

import { t } from './i18n.js';
import { loadAppContent } from './apps.js';
import { updateTaskbarActive } from './taskbar.js';

let zIndexCounter = 100;
let currentWindowDrag = null;
let winDragOffset = {x:0, y:0};

export function toggleWindow(app) {
    const win = document.getElementById(`window-${app.id}`);
    if (win) {
        if (win.classList.contains('minimized')) {
            win.classList.remove('minimized');
            bringToFront(win);
        } else {
            win.classList.add('minimized');
            updateTaskbarActive(app.id, false);
        }
    } else {
        openWindow(app);
    }
}

export function openWindow(app, extraData = null) {
    const existing = document.getElementById(`window-${app.id}`);
    if (existing) {
        existing.classList.remove('minimized');
        bringToFront(existing);
        if (extraData) loadAppContent(app, document.getElementById(`content-${app.id}`), extraData);
        return;
    }

    const win = document.createElement('div');
    win.className = 'window';
    win.id = `window-${app.id}`;
    win.style.zIndex = ++zIndexCounter;
    
    // Default pos
    win.style.top = '15%';
    win.style.left = '20%';
    win.style.width = '60%';
    win.style.height = '60%';

    win.innerHTML = `
        <div class="window-header">
            <div class="window-title"><i class="${app.icon}"></i> ${t(app.titleKey)}</div>
            <div class="window-controls">
                <button class="control-btn min-btn" id="btn-min-${app.id}"></button>
                <button class="control-btn max-btn" id="btn-max-${app.id}"></button>
                <button class="control-btn close-btn" id="btn-close-${app.id}"></button>
            </div>
        </div>
        <div class="window-content" id="content-${app.id}"></div>
    `;

    document.getElementById('windows-container').appendChild(win);
    
    // Event Listeners (Instead of onclick inline for modules)
    win.querySelector(`#btn-min-${app.id}`).onclick = () => minimizeWindow(app.id);
    win.querySelector(`#btn-max-${app.id}`).onclick = () => maximizeWindow(app.id);
    win.querySelector(`#btn-close-${app.id}`).onclick = () => closeWindow(app.id);
    win.querySelector('.window-header').onmousedown = (e) => startWindowDrag(e, win.id);

    loadAppContent(app, document.getElementById(`content-${app.id}`), extraData);
    
    updateTaskbarActive(app.id, true);
    win.onmousedown = () => bringToFront(win);
}

export function closeWindow(id) {
    const win = document.getElementById(`window-${id}`);
    if (win) win.remove();
    updateTaskbarActive(id, false);
}

export function minimizeWindow(id) {
    document.getElementById(`window-${id}`)?.classList.add('minimized');
    updateTaskbarActive(id, false);
}

export function maximizeWindow(id) {
    const win = document.getElementById(`window-${id}`);
    if (!win) return;
    if (win.style.width === '100%') {
        win.style.width = '60%';
        win.style.height = '60%';
        win.style.top = '15%';
        win.style.left = '20%';
    } else {
        win.style.width = '100%';
        win.style.height = 'calc(100% - 48px)'; 
        win.style.top = '0';
        win.style.left = '0';
    }
}

export function bringToFront(win) {
    win.style.zIndex = ++zIndexCounter;
    updateTaskbarActive(win.id.replace('window-', ''), true);
}

function startWindowDrag(e, id) {
    if (e.target.closest('button')) return;
    currentWindowDrag = document.getElementById(id);
    bringToFront(currentWindowDrag);
    const rect = currentWindowDrag.getBoundingClientRect();
    winDragOffset.x = e.clientX - rect.left;
    winDragOffset.y = e.clientY - rect.top;
    
    document.addEventListener('mousemove', onWindowMove);
    document.addEventListener('mouseup', onWindowUp);
}

function onWindowMove(e) {
    if (!currentWindowDrag) return;
    currentWindowDrag.style.left = `${e.clientX - winDragOffset.x}px`;
    currentWindowDrag.style.top = `${e.clientY - winDragOffset.y}px`;
    currentWindowDrag.style.transform = 'none';
}

function onWindowUp() {
    currentWindowDrag = null;
    document.removeEventListener('mousemove', onWindowMove);
    document.removeEventListener('mouseup', onWindowUp);
}
