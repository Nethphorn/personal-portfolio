// ==========================================
//  MAIN ENTRY POINT
//  This file starts the entire OS simulation.
// ==========================================

import { initClock, initTaskbar } from './modules/taskbar_manager.js';
import { initDesktop } from './modules/desktop_manager.js';
import { initVideoBackground } from './modules/wallpaper_manager.js';

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initDesktop();
    initTaskbar();
    removeBootScreen();
    initVideoBackground();

    // Load Risa separately so it doesn't block the OS if it fails or takes time
    import('./R.I.S.A/risa_manager.js')
        .then(m => m.initRisa())
        .catch(e => console.error("Risa failed to load:", e));
});

function removeBootScreen() {
    setTimeout(() => {
        const bootScreen = document.getElementById('boot-screen');
        bootScreen.style.opacity = '0';
        setTimeout(() => bootScreen.remove(), 1000);
    }, 1500);
}
