import { t } from './language_manager.js';
import { loadAppContent } from './app_renderer.js';
import { updateTaskbarActive } from './taskbar_manager.js';

let zIndex = 100;
let drag = null, offset = { x: 0, y: 0 };

export function toggleWindow(app) {
    const win = document.getElementById(`window-${app.id}`);
    if (win) {
        win.classList.toggle('minimized');
        if (!win.classList.contains('minimized')) bringToFront(win);
        else updateTaskbarActive(app.id, false);
    } else openWindow(app);
}

export function openWindow(app, extraData = null) {
    const existing = document.getElementById(`window-${app.id}`);
    if (existing) {
        existing.classList.remove('minimized');
        bringToFront(existing);
        if (extraData) loadAppContent(app, existing.querySelector('.window-content'), extraData);
        return;
    }

    const win = document.createElement('div');
    win.className = 'window';
    win.id = `window-${app.id}`;
    const count = document.querySelectorAll('.window').length;
    const pos = 15 + (count % 10) * 5;
    Object.assign(win.style, { zIndex: ++zIndex, top: `${pos}%`, left: `${pos + 5}%`, width: '60%', height: '60%' });
    
    win.appendChild(document.getElementById('tpl-window').content.cloneNode(true));
    win.querySelector('.window-title').innerHTML = `<i class="${app.icon}"></i> ${t(app.titleKey)}`;
    const content = win.querySelector('.window-content');
    content.id = `content-${app.id}`;

    document.getElementById('windows-container').appendChild(win);
    
    win.querySelector('.min-btn').onclick = () => { win.classList.add('minimized'); updateTaskbarActive(app.id, false); };
    win.querySelector('.max-btn').onclick = () => maximizeWindow(app.id);
    win.querySelector('.close-btn').onclick = () => { win.remove(); updateTaskbarActive(app.id, false); };
    win.querySelector('.window-header').onmousedown = (e) => startDrag(e, win);
    win.querySelectorAll('.resizer').forEach(r => r.onmousedown = (e) => startResize(e, win, r.className.split(' ')[1]));

    loadAppContent(app, content, extraData);
    updateTaskbarActive(app.id, true);
    win.onmousedown = () => bringToFront(win);
}

export function maximizeWindow(id) {
    const win = document.getElementById(`window-${id}`);
    const isMax = win.style.width === '100%';
    Object.assign(win.style, isMax ? { width: '60%', height: '60%', top: '15%', left: '20%' } : { width: '100%', height: 'calc(100% - 48px)', top: '0', left: '0' });
}

export function bringToFront(win) {
    win.style.zIndex = ++zIndex;
    updateTaskbarActive(win.id.replace('window-', ''), true);
}

function startDrag(e, win) {
    if (e.target.closest('button')) return;
    drag = win;
    bringToFront(win);
    const rect = win.getBoundingClientRect();
    offset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const move = (ev) => { win.style.left = `${ev.clientX - offset.x}px`; win.style.top = `${ev.clientY - offset.y}px`; win.style.transform = 'none'; };
    const up = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
}

function startResize(e, win, dir) {
    e.stopPropagation();
    const rect = win.getBoundingClientRect();
    const start = { x: e.clientX, y: e.clientY, w: rect.width, h: rect.height, t: rect.top, l: rect.left };
    const move = (ev) => {
        const dx = ev.clientX - start.x, dy = ev.clientY - start.y;
        if (dir.includes('e')) win.style.width = `${Math.max(200, start.w + dx)}px`;
        if (dir.includes('w')) { const w = Math.max(200, start.w - dx); win.style.width = `${w}px`; win.style.left = `${start.l + (start.w - w)}px`; }
        if (dir.includes('s')) win.style.height = `${Math.max(150, start.h + dy)}px`;
        if (dir.includes('n')) { const h = Math.max(150, start.h - dy); win.style.height = `${h}px`; win.style.top = `${start.t + (start.h - h)}px`; }
    };
    const up = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
}
