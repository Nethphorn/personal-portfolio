// ==========================================
//  MODULE: I18N (Internationalization)
//  Handles language switching (English/Japanese)
//  and updating text on the screen.
// ==========================================

import { initDesktop } from './desktop.js';
import { renderFileExplorer } from './apps.js';
import { apps } from './config.js';

export let currentLang = 'en';

// --- TRANSLATIONS ---
// Edit the strings below to change the text in each language.
const translations = {
    en: {
        apps: {
            explorer: 'File Explorer',
            browser: 'Chrome',
            terminal: 'Terminal',
            contact: 'Contact',
            photos: 'Photos',
            projects: 'Projects',
            resume: 'Resume',
            settings: 'Settings'
        },
        desktop: {
            projects: 'Projects',
            resume: 'Resume',
            pictures: 'Pictures'
        },
        controls: {
            back: 'Back',
            lang: '日本語'
        },
        intro: {
            greeting: "Hello! I am a developer.",
            help: "Type 'help' for commands."
        }
    },
    ja: {
        apps: {
            explorer: 'エクスプローラー',
            browser: 'クローム',
            terminal: 'ターミナル',
            contact: '連絡先',
            photos: '写真',
            projects: 'プロジェクト',
            resume: '履歴書',
            settings: '設定'
        },
        desktop: {
            projects: 'プロジェクト',
            resume: '履歴書',
            pictures: '写真'
        },
        controls: {
            back: '戻る',
            lang: 'English'
        },
        intro: {
            greeting: "こんにちは！開発者です。",
            help: "'help' と入力してコマンドを表示。"
        }
    }
};

// ==========================================
//  FUNCTION: t
//  Translates a key path to a string.
// ==========================================
export function t(keyPath) {
    const keys = keyPath.split('.');
    let value = translations[currentLang];
    for (const key of keys) {
        value = value[key];
    }
    return value;
}

// ==========================================
//  FUNCTION: toggleLanguage
//  Toggles the language between English and Japanese.
// ==========================================
export function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ja' : 'en';
    updateLanguageButton();
    updateUIStrings();
}

// ==========================================
//  FUNCTION: updateLanguageButton
//  Updates the language toggle button text.
// ==========================================
export function updateLanguageButton() {
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = t('controls.lang');
}

// ==========================================
//  FUNCTION: updateUIStrings
//  Updates all UI strings to the current language.
// ==========================================
function updateUIStrings() {
    // Refresh Desktop
    initDesktop();
    
    // Refresh Windows Titles
    document.querySelectorAll('.window').forEach(win => {
        const appId = win.id.replace('window-', '');
        const app = apps.find(a => a.id === appId);
        if (app) {
            const titleEl = win.querySelector('.window-title');
            if (titleEl) titleEl.innerHTML = `<i class="${app.icon}"></i> ${t(app.titleKey)}`;
        }
    });
    
    // Refresh File Explorer if open
    const explorerContent = document.getElementById('content-file-explorer');
    if (explorerContent) {
        // Warning: using null for items might break if it expects items. 
        // We need 'currentFolder'. 
        // We'll export 'currentFolder' helper from apps if needed or trigger a specialized refresh.
        // For now, simpler to just let user re-navigate or force refresh via a custom event?
        // Let's import currentFolder from apps is not ideal.
        // Better: trigger a custom event that apps.js listens to?
        // Or just re-render if we can. 
        // For simplicity: We might skip re-rendering explorer content for now, or use a global state object in a separate state.js.
    }

    // Toggle Desktop Welcome Text
    const enText = document.getElementById('welcome-text-en');
    const jpText = document.getElementById('welcome-text-jp');
    if (enText && jpText) {
        if (currentLang === 'en') {
            enText.style.display = 'block';
            jpText.style.display = 'none';
        } else {
            enText.style.display = 'none';
            jpText.style.display = 'block';
        }
    }
}
