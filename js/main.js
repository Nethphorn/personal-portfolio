import { initClock, initTaskbar } from './modules/taskbar_manager.js';
import { initDesktop } from './modules/desktop_manager.js';
import { initVideoBackground } from './modules/wallpaper_manager.js';

document.addEventListener('DOMContentLoaded', () => {
    // Run initializations with error handling
    [initClock, initDesktop, initTaskbar, initVideoBackground].forEach(fn => {
        try { fn(); } catch(e) { console.error("Init Error:", e); }
    });
    
    // Ensure boot screen is removed even if there was an error
    setTimeout(() => {
        const boot = document.getElementById('boot-screen');
        if (boot) {
            boot.style.opacity = '0';
            setTimeout(() => boot.remove(), 1000);
        }
    }, 1500);

    // Dynamic import for Risa
    import('./I.R.I.S/iris_manager.js')
        .then(m => m?.initRisa?.())
        .catch(e => console.error("Risa failed to load:", e));
});
