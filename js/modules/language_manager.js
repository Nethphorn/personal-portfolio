import { initDesktop } from './desktop_manager.js';
import { apps } from './system_config.js';

export let currentLang = 'en';

const translations = {
    en: {
        apps: { explorer: 'File Explorer', browser: 'Chrome', terminal: 'Terminal', contact: 'Contact', photos: 'Photos', projects: 'Projects', resume: 'Resume', settings: 'Settings' },
        desktop: { projects: 'Projects', resume: 'Resume', pictures: 'Pictures' },
        controls: { back: 'Back', lang: '日本語' },
        intro: { greeting: "Hello! I am a developer.", help: "Type 'help' for commands." }
    },
    ja: {
        apps: { explorer: 'エクスプローラー', browser: 'クローム', terminal: 'ターミナル', contact: '連絡先', photos: '写真', projects: 'プロジェクト', resume: '履歴書', settings: '設定' },
        desktop: { projects: 'プロジェクト', resume: '履歴書', pictures: '写真' },
        controls: { back: '戻る', lang: 'English' },
        intro: { greeting: "こんにちは！開発者です。", help: "'help' と入力してコマンドを表示。" }
    }
};

export function t(keyPath) {
    return keyPath.split('.').reduce((obj, key) => obj?.[key], translations[currentLang]);
}

export function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ja' : 'en';
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = t('controls.lang');
    
    initDesktop();
    document.querySelectorAll('.window').forEach(win => {
        const app = apps.find(a => a.id === win.id.replace('window-', ''));
        if (app) win.querySelector('.window-title').innerHTML = `<i class="${app.icon}"></i> ${t(app.titleKey)}`;
    });
    
    const isEn = currentLang === 'en';
    document.getElementById('welcome-text-en').style.display = isEn ? 'block' : 'none';
    document.getElementById('welcome-text-jp').style.display = isEn ? 'none' : 'block';
}

export function updateLanguageButton() {
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = t('controls.lang');
}
