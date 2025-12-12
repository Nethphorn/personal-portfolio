// ==========================================
//  PORTFOLIO OS - CORE LOGIC
// ==========================================

// 1. LOCALIZATION (i18n)
// ------------------------------------------
let currentLang = 'en';

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
            lang: '日本語' // Button text to switch TO
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
            lang: 'English' // Button text to switch TO
        },
        intro: {
            greeting: "こんにちは！開発者です。",
            help: "'help' と入力してコマンドを表示。"
        }
    }
};

function t(keyPath) {
    const keys = keyPath.split('.');
    let value = translations[currentLang];
    for (const key of keys) {
        value = value[key];
    }
    return value;
}

// 2. CONFIGURATION & DATA
// ------------------------------------------

// Application Definitions
const apps = [
    { id: 'file-explorer', icon: 'fa-regular fa-folder-open', titleKey: 'apps.explorer' },
    { id: 'browser', icon: 'fa-brands fa-chrome', titleKey: 'apps.browser' },
    { id: 'terminal', icon: 'fa-solid fa-terminal', titleKey: 'apps.terminal' },
    { id: 'contact', icon: 'fa-solid fa-address-card', titleKey: 'apps.contact' },
    { id: 'photos', icon: 'fa-solid fa-images', titleKey: 'apps.photos' },
    // Hidden / Utility Apps
    { id: 'project-viewer', icon: 'fa-solid fa-code', titleKey: 'apps.projects' },
    { id: 'image-viewer', icon: 'fa-solid fa-image', titleKey: 'apps.photos' }
];

// File System Data
const fileSystem = {
    root: [
        { 
            type: 'folder', 
            nameKey: 'desktop.projects', 
            icon: 'folder-code',
            children: [
                { 
                    type: 'file', 
                    name: 'Portfolio Website', 
                    icon: 'project', 
                    data: {
                        description: 'A personal OS-style portfolio.',
                        link: '#',
                        img: 'https://via.placeholder.com/300'
                    }
                },
                { 
                    type: 'file', 
                    name: 'AI Gesture App', 
                    icon: 'project', 
                    data: {
                        description: 'Control robots with hand gestures.',
                        link: '#',
                        img: 'https://via.placeholder.com/300'
                    }
                }
            ]
        },
        { 
            type: 'folder', 
            nameKey: 'desktop.resume', 
            icon: 'folder-user',
            children: [
                { type: 'file', name: 'Resume_EN.pdf', icon: 'pdf' },
                { type: 'file', name: 'Resume_JP.pdf', icon: 'pdf' }
            ]
        },
        { 
            type: 'folder', 
            nameKey: 'desktop.pictures', 
            icon: 'folder-img',
            children: [
                { type: 'file', name: 'Me.jpg', icon: 'image', content: 'path/to/me.jpg' },
                { type: 'file', name: 'Travel.png', icon: 'image', content: 'path/to/travel.png' }
            ]
        }
    ]
};

// State
let openWindows = [];
let zIndexCounter = 100;
let explorerPath = [];
let currentFolder = fileSystem.root;

// 3. INITIALIZATION
// ------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initDesktop();
    initTaskbar();
    removeBootScreen();
});

function removeBootScreen() {
    setTimeout(() => {
        const bootScreen = document.getElementById('boot-screen');
        bootScreen.style.opacity = '0';
        setTimeout(() => bootScreen.remove(), 1000);
    }, 1500);
}

// 4. DESKTOP LOGIC (Draggable Icons)
// ------------------------------------------
function initDesktop() {
    const desktopContainer = document.getElementById('desktop-icons');
    desktopContainer.innerHTML = ''; // Clear existing

    // Only render specific root folders as requested
    const desktopItems = fileSystem.root;

    desktopItems.forEach((item, index) => {
        const el = document.createElement('div');
        el.className = 'desktop-icon';
        // Position them initially in a column
        el.style.position = 'absolute';
        el.style.top = `${20 + (index * 110)}px`; // Increased spacing for text wrapping
        el.style.left = '20px';

        el.innerHTML = `
            <i class="fa-solid fa-folder" style="color: #f8d775;"></i>
            <span>${t(item.nameKey)}</span>
        `;

        // Open on Double Click
        el.ondblclick = () => openFileExplorerAt(item);

        // Drag Support
        el.onmousedown = (e) => startIconDrag(e, el);

        desktopContainer.appendChild(el);
    });
}

function openFileExplorerAt(folderItem) {
    // Open explorer app
    const app = apps.find(a => a.id === 'file-explorer');
    openWindow(app);
    
    // Navigate to specific folder
    // We reset path first
    explorerPath = [{ name: t(folderItem.nameKey), items: fileSystem.root }]; 
    currentFolder = folderItem.children;
    
    // Find the DOM window and render
    const contentDiv = document.getElementById(`content-file-explorer`);
    if (contentDiv) {
        renderFileExplorer(contentDiv, currentFolder);
    }
}

// User-land Dragging
let dragIcon = null;
function startIconDrag(e, el) {
    if (e.target.tagName === 'I' || e.target.tagName === 'SPAN') {
        // Allow clicking the icon internals without dragging immediately if we wanted selection
        // But for now, dragging the whole container
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

// 5. TASKBAR LOGIC
// ------------------------------------------
function initTaskbar() {
    const container = document.getElementById('taskbar-apps');
    container.innerHTML = '';
    
    // Pinned Apps: Explorer, Photos, Contact, Terminal, Chrome
    const pinnedIds = ['file-explorer', 'photos', 'contact', 'terminal', 'browser'];

    pinnedIds.forEach(id => {
        const app = apps.find(a => a.id === id);
        if (app) {
            const btn = document.createElement('div');
            btn.className = 'taskbar-app';
            btn.id = `taskbar-btn-${app.id}`;
            btn.innerHTML = `<i class="${app.icon}"></i>`;
            btn.onclick = () => toggleWindow(app);
            container.appendChild(btn);
        }
    });

    // Language Toggle in System Tray (Clock area)
    // We need to inject this into the clock-container or similar
    // Check if lang button exists, if not create it
    let langBtn = document.getElementById('lang-toggle');
    if (!langBtn) {
        langBtn = document.createElement('button');
        langBtn.id = 'lang-toggle';
        langBtn.className = 'lang-btn';
        langBtn.onclick = toggleLanguage;
        // Search for a good place to put it. 
        // The HTML structure has #taskbar > #start-btn, #taskbar-apps, #clock
        // We can look for #clock and insert before it.
        const clock = document.getElementById('clock');
        if (clock) {
            clock.parentNode.insertBefore(langBtn, clock);
        }
    }
    updateLanguageButton();
}

function initClock() {
    const clock = document.getElementById('clock');
    setInterval(() => {
        clock.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, 1000);
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ja' : 'en';
    updateLanguageButton();
    updateUIStrings();
}

function updateLanguageButton() {
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = t('controls.lang');
}

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
        renderFileExplorer(explorerContent, currentFolder);
    }
}

// 6. WINDOW SYSTEM
// ------------------------------------------

function toggleWindow(app) {
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

function openWindow(app, extraData = null) {
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
    
    // Center-ish default position
    win.style.top = '15%';
    win.style.left = '20%';
    win.style.width = '60%';
    win.style.height = '60%';

    win.innerHTML = `
        <div class="window-header" onmousedown="startWindowDrag(event, '${win.id}')">
            <div class="window-title"><i class="${app.icon}"></i> ${t(app.titleKey)}</div>
            <div class="window-controls">
                <button class="control-btn min-btn" onclick="minimizeWindow('${app.id}')"></button>
                <button class="control-btn max-btn" onclick="maximizeWindow('${app.id}')"></button>
                <button class="control-btn close-btn" onclick="closeWindow('${app.id}')"></button>
            </div>
        </div>
        <div class="window-content" id="content-${app.id}"></div>
    `;

    document.getElementById('windows-container').appendChild(win);
    loadAppContent(app, document.getElementById(`content-${app.id}`), extraData);
    
    updateTaskbarActive(app.id, true);
    win.onmousedown = () => bringToFront(win);
}

function closeWindow(id) {
    const win = document.getElementById(`window-${id}`);
    if (win) win.remove();
    updateTaskbarActive(id, false);
}

function minimizeWindow(id) {
    document.getElementById(`window-${id}`)?.classList.add('minimized');
    updateTaskbarActive(id, false);
}

function maximizeWindow(id) {
    const win = document.getElementById(`window-${id}`);
    if (!win) return;
    if (win.style.width === '100%') {
        win.style.width = '60%';
        win.style.height = '60%';
        win.style.top = '15%';
        win.style.left = '20%';
    } else {
        win.style.width = '100%';
        win.style.height = 'calc(100% - 48px)'; // minus taskbar
        win.style.top = '0';
        win.style.left = '0';
    }
}

function bringToFront(win) {
    win.style.zIndex = ++zIndexCounter;
    updateTaskbarActive(win.id.replace('window-', ''), true);
}

function updateTaskbarActive(id, active) {
    document.querySelectorAll('.taskbar-app').forEach(el => el.classList.remove('active'));
    if (active) document.getElementById(`taskbar-btn-${id}`)?.classList.add('active');
}

// Window Dragging
let currentWindowDrag = null;
let winDragOffset = {x:0, y:0};

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

// 7. APP CONTENT RENDERING
// ------------------------------------------
function loadAppContent(app, container, extraData) {
    container.innerHTML = '';
    
    switch(app.id) {
        case 'file-explorer':
            renderFileExplorer(container, currentFolder);
            break;
        case 'terminal':
            renderTerminal(container);
            break;
        case 'contact':
            renderContact(container);
            break;
        case 'photos': // Opens generic explorer for photos? Or a gallery? User said "Photo App"
            // Let's make it a simple gallery of the "Root/Pictures" folder
            const pics = fileSystem.root.find(f => f.nameKey === 'desktop.pictures').children;
            renderGallery(container, pics);
            break;
        case 'project-viewer':
            renderProjectViewer(container, extraData);
            break;
        case 'browser':
            container.innerHTML = '<iframe src="https://www.google.com/webhp?igu=1" style="width:100%; height:100%; border:none;"></iframe>';
            break;
        default:
            container.innerHTML = '<div style="padding:20px;">App Content</div>';
    }
}

// --- FILE EXPLORER ---
function renderFileExplorer(container, items) {
    container.innerHTML = '';
    
    // Navbar
    const nav = document.createElement('div');
    nav.className = 'explorer-nav'; // We'll need css for this
    nav.style.padding = '10px';
    nav.style.borderBottom = '1px solid var(--glass-border)';
    nav.style.display = 'flex';
    nav.style.alignItems = 'center';

    const backBtn = document.createElement('button');
    backBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
    backBtn.style.color = 'white';
    backBtn.style.background = 'transparent';
    backBtn.style.border = 'none';
    backBtn.style.cursor = 'pointer';
    backBtn.style.marginRight = '10px';
    // Disable if at root? No, we use explorerPath
    backBtn.disabled = explorerPath.length === 0;
    backBtn.style.opacity = explorerPath.length === 0 ? 0.3 : 1;
    
    backBtn.onclick = () => {
        if (explorerPath.length > 0) {
            const prevState = explorerPath.pop();
            currentFolder = prevState.items;
            renderFileExplorer(container, currentFolder);
        }
    };
    nav.appendChild(backBtn);

    const pathLabel = document.createElement('span');
    // Simple breadcrumb text
    pathLabel.innerText = '/ ' + explorerPath.map(p => p.name).join(' / ');
    nav.appendChild(pathLabel);

    container.appendChild(nav);

    // Grid
    const grid = document.createElement('div');
    grid.className = 'file-grid'; // Existing CSS class
    
    items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'file-item';
        
        // Icon logic
        let icon = 'fa-file';
        if (item.type === 'folder') icon = 'fa-folder';
        if (item.icon === 'project') icon = 'fa-laptop-code';
        if (item.icon === 'pdf') icon = 'fa-file-pdf';
        if (item.icon === 'image') icon = 'fa-image';

        // Name Logic (some have keys, some have direct names)
        const name = item.nameKey ? t(item.nameKey) : item.name;

        el.innerHTML = `<i class="fa-solid ${icon}"></i><span>${name}</span>`;
        
        el.onclick = () => {
            if (item.type === 'folder') {
                explorerPath.push({ name: name, items: items });
                currentFolder = item.children;
                renderFileExplorer(container, currentFolder);
            } else if (item.icon === 'project') {
                openWindow(apps.find(a => a.id === 'project-viewer'), item.data);
            } else {
                // Other files non-clickable as requested
            }
        };
        grid.appendChild(el);
    });
    container.appendChild(grid);
}

// --- TERMINAL ---
function renderTerminal(container) {
    container.style.background = '#0d1117';
    container.style.color = '#58a6ff';
    container.style.fontFamily = 'monospace';
    container.style.padding = '20px';
    container.style.overflowY = 'auto'; // allow scrolling

    const introText = t('intro.greeting');
    const helpText = t('intro.help');

    container.innerHTML = `
        <div class="term-output">
            <p>> initializing system...</p>
            <p>> user detected.</p>
            <p>> ${introText}</p>
            <p>> ${helpText}</p>
        </div>
        <div class="term-input-line">
            <span>$ </span><input type="text" style="background:transparent; border:none; color:white; outline:none;" autofocus>
        </div>
    `;
    
    const input = container.querySelector('input');
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim();
            const output = container.querySelector('.term-output');
            output.innerHTML += `<p>$ ${cmd}</p>`;
            
            // Simple Command Logic
            if (cmd === 'help') {
                output.innerHTML += `<p>Available commands: help, clear, about, resume</p>`;
            } else if (cmd === 'clear') {
                output.innerHTML = '';
            } else if (cmd === 'about') {
                output.innerHTML += `<p>I am a passionate developer building cool things.</p>`;
            } else if (cmd === 'resume') {
                 output.innerHTML += `<p>Opening resume folder...</p>`;
                 // We could trigger the resume folder open here!
                 const resumeFolder = fileSystem.root.find(f => f.nameKey === 'desktop.resume');
                 if (resumeFolder) openFileExplorerAt(resumeFolder);
            } else {
                output.innerHTML += `<p>Command not found: ${cmd}</p>`;
            }
            
            input.value = '';
            container.scrollTop = container.scrollHeight;
        }
    });
}

// --- CONTACT ---
function renderContact(container) {
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:20px;">
            <h2>Contact Me</h2>
            <div style="display:flex; gap:20px; font-size:2rem;">
                <a href="#" style="color:white;"><i class="fa-brands fa-github"></i></a>
                <a href="#" style="color:white;"><i class="fa-brands fa-linkedin"></i></a>
                <a href="#" style="color:white;"><i class="fa-solid fa-envelope"></i></a>
            </div>
            <p>email@example.com</p>
        </div>
    `;
}

// --- PROJECT VIEWER ---
function renderProjectViewer(container, data) {
    if (!data) return;
    container.innerHTML = `
        <div style="padding:20px; height:100%; display:flex; flex-direction:column;">
            <img src="${data.img}" style="width:100%; height:200px; object-fit:cover; border-radius:8px; margin-bottom:20px;">
            <h2>${data.name || 'Project'}</h2>
            <p style="flex:1; margin-top:10px;">${data.description}</p>
            <a href="${data.link}" target="_blank" style="padding:10px; background:var(--accent-color); color:white; text-align:center; border-radius:4px; text-decoration:none;">View Project</a>
        </div>
    `;
}

// --- PHOTO GALLERY ---
function renderGallery(container, items) {
    container.style.padding = '20px';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(100px, 1fr))';
    container.style.gap = '10px';
    
    items.forEach(item => {
        const div = document.createElement('div');
        div.style.background = 'rgba(255,255,255,0.1)';
        div.style.borderRadius = '8px';
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'center';
        div.style.aspectRatio = '1/1';
        
        div.innerHTML = `<i class="fa-solid fa-image" style="font-size:2rem;"></i>`;
        container.appendChild(div);
    });
}
