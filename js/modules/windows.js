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
    
    // Cascading Offset Logic
    // We start at 15% / 20% and add a bit for each new window
    // Reset if it goes too far down/right
    const baseTop = 15;
    const baseLeft = 20;
    const offsetStep = 5; // %
    let currentOffsetCount = document.querySelectorAll('.window').length; // simple count based approach

    // Better simple cascading:
    // Let's use the number of windows currently open to prevent full overlap
    
    const offset = (currentOffsetCount % 10) * offsetStep; 

    win.style.top = `${baseTop + offset}%`;
    win.style.left = `${baseLeft + offset}%`;
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
        
        <!-- Resize Handles -->
        <div class="resizer n"></div>
        <div class="resizer e"></div>
        <div class="resizer s"></div>
        <div class="resizer w"></div>
        <div class="resizer ne"></div>
        <div class="resizer se"></div>
        <div class="resizer sw"></div>
        <div class="resizer nw"></div>
    `;

    document.getElementById('windows-container').appendChild(win);
    
    // Event Listeners
    win.querySelector(`#btn-min-${app.id}`).onclick = () => minimizeWindow(app.id);
    win.querySelector(`#btn-max-${app.id}`).onclick = () => maximizeWindow(app.id);
    win.querySelector(`#btn-close-${app.id}`).onclick = () => closeWindow(app.id);
    win.querySelector('.window-header').onmousedown = (e) => startWindowDrag(e, win.id);

    // Resizer Listeners
    win.querySelectorAll('.resizer').forEach(resizer => {
        resizer.onmousedown = (e) => startResize(e, win, resizer);
    });

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

// DRAGGING
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

// RESIZING
let currentResizer = null;
let currentResizeWin = null;
let resizeStart = { x: 0, y: 0, w: 0, h: 0, top: 0, left: 0 };
let resizeDir = '';

function startResize(e, win, resizer) {
    e.stopPropagation(); // Prevent drag
    currentResizeWin = win;
    currentResizer = resizer;
    
    // Determine direction from class (e.g., "resizer nw")
    resizeDir = resizer.className.replace('resizer', '').trim();

    const rect = win.getBoundingClientRect();
    resizeStart = {
        x: e.clientX,
        y: e.clientY,
        w: rect.width,
        h: rect.height,
        top: rect.top,
        left: rect.left
    };

    document.addEventListener('mousemove', onResize);
    document.addEventListener('mouseup', stopResize);
}

function onResize(e) {
    if (!currentResizeWin) return;
    
    const dx = e.clientX - resizeStart.x;
    const dy = e.clientY - resizeStart.y;
    
    const minW = 200;
    const minH = 150;

    let newW = resizeStart.w;
    let newH = resizeStart.h;
    let newTop = resizeStart.top;
    let newLeft = resizeStart.left;

    // Handle E / W (Width)
    if (resizeDir.includes('e')) {
        newW = Math.max(minW, resizeStart.w + dx);
    } else if (resizeDir.includes('w')) {
        newW = Math.max(minW, resizeStart.w - dx);
        newLeft = resizeStart.left + (resizeStart.w - newW);
    }

    // Handle S / N (Height)
    if (resizeDir.includes('s')) {
        newH = Math.max(minH, resizeStart.h + dy);
    } else if (resizeDir.includes('n')) {
        newH = Math.max(minH, resizeStart.h - dy);
        newTop = resizeStart.top + (resizeStart.h - newH);
    }

    // Apply
    if (resizeDir.includes('w')) currentResizeWin.style.left = `${newLeft}px`;
    if (resizeDir.includes('n')) currentResizeWin.style.top = `${newTop}px`;
    currentResizeWin.style.width = `${newW}px`;
    currentResizeWin.style.height = `${newH}px`;
}

function stopResize() {
    currentResizeWin = null;
    document.removeEventListener('mousemove', onResize);
    document.removeEventListener('mouseup', stopResize);
}
