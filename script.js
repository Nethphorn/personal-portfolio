// Configuration for "Apps"
// This array defines all the applications available in our OS.
// Adding a new app here automatically makes it appear on the desktop.
const apps = [
    {
        id: 'file-explorer',
        title: 'File Explorer',
        icon: 'fa-regular fa-folder-open',
        component: 'FileExplorer'
    },
    {
        id: 'browser',
        title: 'Chrome',
        icon: 'fa-brands fa-chrome',
        component: 'Browser'
    },
    {
        id: 'vscode',
        title: 'VS Code',
        icon: 'fa-solid fa-code',
        component: 'VSCode'
    },
    {
        id: 'settings',
        title: 'Settings',
        icon: 'fa-solid fa-gear',
        component: 'Settings'
    }
];

// Mock File System
// A simple object structure to represent folders and files.
// The File Explorer app uses this to render content.
const fileSystem = {
    root: [
        { type: 'folder', name: 'Projects', children: [
            { type: 'folder', name: 'Websites', children: [
                { type: 'file', name: 'portfolio.html', icon: 'code' },
                { type: 'file', name: 'ecommerce-shop.js', icon: 'code' }
            ]},
            { type: 'folder', name: 'Mobile Apps', children: [
                { type: 'file', name: 'flutter-app.dart', icon: 'code' }
            ]}
        ]},
        { type: 'folder', name: 'Documents', children: [
            { type: 'file', name: 'resume.pdf', icon: 'file' },
            { type: 'file', name: 'ideas.txt', icon: 'file' }
        ]},
        { type: 'folder', name: 'Photos', children: [
            { type: 'file', name: 'vacation.png', icon: 'image' },
            { type: 'file', name: 'profile.jpg', icon: 'image' }
        ]}
    ]
};

// State Management
let openWindows = [];
let zIndexCounter = 100; // Used to bring focused windows to the front

// Initialization
// Runs when the HTML document is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initDesktop();
    initTaskbar();
    
    // Simulate boot time
    // remove the boot screen after 2 seconds
    setTimeout(() => {
        const bootScreen = document.getElementById('boot-screen');
        bootScreen.style.opacity = '0';
        setTimeout(() => {
            bootScreen.remove();
        }, 1000);
    }, 2000);
});

function initClock() {
    const clock = document.getElementById('clock');
    const updateTime = () => {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    setInterval(updateTime, 1000);
    updateTime();
}

function initDesktop() {
    const desktopContainer = document.getElementById('desktop-icons');
    apps.forEach(app => {
        const el = document.createElement('div');
        el.className = 'desktop-icon';
        el.innerHTML = `
            <i class="${app.icon}" style="color: ${getColor(app.id)}"></i>
            <span>${app.title}</span>
        `;
        el.onclick = () => openWindow(app);
        desktopContainer.appendChild(el);
    });
}

function initTaskbar() {
    const taskbarContainer = document.getElementById('taskbar-apps');
    // Pre-add some apps to taskbar
    apps.slice(0, 3).forEach(app => {
        addToTaskbar(app);
    });
}

function addToTaskbar(app) {
    const container = document.getElementById('taskbar-apps');
    if (document.getElementById(`taskbar-btn-${app.id}`)) return;

    const btn = document.createElement('div');
    btn.className = 'taskbar-app';
    btn.id = `taskbar-btn-${app.id}`;
    btn.innerHTML = `<i class="${app.icon}" style="color: ${getColor(app.id)}"></i>`;
    btn.onclick = () => toggleWindow(app);
    container.appendChild(btn);
}

function getColor(id) {
    switch(id) {
        case 'file-explorer': return '#f8d775';
        case 'browser': return '#4285f4';
        case 'vscode': return '#23a9f2';
        case 'settings': return '#e0e0e0';
        default: return '#fff';
    }
}

/*
    Opens a Window for a specific app.
    1. Checks if already open (if so, focuses it).
    2. Creates the DOM element for the window.
    3. Injects the window header and content.
    4. Appends to the desktop.
*/
function openWindow(app) {
    // Check if already open
    const existingWindow = document.getElementById(`window-${app.id}`);
    if (existingWindow) {
        if (existingWindow.classList.contains('minimized')) {
            existingWindow.classList.remove('minimized');
        }
        bringToFront(existingWindow);
        return;
    }

    // Create Window Element
    const win = document.createElement('div');
    win.className = 'window';
    win.id = `window-${app.id}`;
    win.style.zIndex = ++zIndexCounter;
    
    // Initial position (randomized slightly to avoid stacking perfectly)
    const top = 10 + Math.random() * 10;
    const left = 10 + Math.random() * 10;
    win.style.top = `${top}%`;
    win.style.left = `${left}%`;
    win.style.width = '600px';
    win.style.height = '400px';

    // Window HTML Structure
    win.innerHTML = `
        <div class="window-header" onmousedown="startDrag(event, '${win.id}')">
            <div class="window-title">
                <i class="${app.icon}"></i> ${app.title}
            </div>
            <div class="window-controls">
                <!-- Mac-style window controls -->
                <button class="control-btn min-btn" onclick="minimizeWindow('${app.id}')"></button>
                <button class="control-btn max-btn" onclick="maximizeWindow('${app.id}')"></button>
                <button class="control-btn close-btn" onclick="closeWindow('${app.id}')"></button>
            </div>
        </div>
        <div class="window-content" id="content-${app.id}">
            <!-- Content Injected Here -->
        </div>
    `;

    document.getElementById('windows-container').appendChild(win);
    loadAppContent(app, document.getElementById(`content-${app.id}`));
    addToTaskbar(app);
    updateTaskbarActive(app.id, true);
    
    // Bring to front on click
    win.addEventListener('mousedown', () => bringToFront(win));
}

function toggleWindow(app) {
    const win = document.getElementById(`window-${app.id}`);
    if (!win) {
        openWindow(app);
    } else {
        if (win.classList.contains('minimized')) {
            win.classList.remove('minimized');
            bringToFront(win);
        } else {
            win.classList.add('minimized');
            updateTaskbarActive(app.id, false);
        }
    }
}

function closeWindow(id) {
    const win = document.getElementById(`window-${id}`);
    if (win) {
        win.style.transform = 'scale(0.9)';
        win.style.opacity = '0';
        setTimeout(() => win.remove(), 200);
        updateTaskbarActive(id, false);
        // We keep it on taskbar for now as "pinned"
    }
}

function minimizeWindow(id) {
    const win = document.getElementById(`window-${id}`);
    if (win) {
        win.classList.add('minimized');
        updateTaskbarActive(id, false);
    }
}

function maximizeWindow(id) {
    const win = document.getElementById(`window-${id}`);
    if (win.style.width === '100%') {
        win.style.width = '600px';
        win.style.height = '400px';
        win.style.top = '10%';
        win.style.left = '10%';
    } else {
        win.style.width = '100%';
        win.style.height = 'calc(100% - 48px)';
        win.style.top = '0';
        win.style.left = '0';
    }
}

function bringToFront(win) {
    win.style.zIndex = ++zIndexCounter;
    // Highlight taskbar
    const id = win.id.replace('window-', '');
    updateTaskbarActive(id, true);
}

function updateTaskbarActive(id, isActive) {
    document.querySelectorAll('.taskbar-app').forEach(el => el.classList.remove('active'));
    if (isActive) {
        const btn = document.getElementById(`taskbar-btn-${id}`);
        if (btn) btn.classList.add('active');
    }
}

// Drag functionality
let isDragging = false;
let currentDragWin = null;
let offset = { x: 0, y: 0 };

function startDrag(e, winId) {
    if (e.target.closest('.window-controls')) return; // Don't drag if clicking buttons
    isDragging = true;
    currentDragWin = document.getElementById(winId);
    bringToFront(currentDragWin);
    
    const rect = currentDragWin.getBoundingClientRect();
    offset.x = e.clientX - rect.left;
    offset.y = e.clientY - rect.top;

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
}

function drag(e) {
    if (!isDragging) return;
    currentDragWin.style.left = `${e.clientX - offset.x}px`;
    currentDragWin.style.top = `${e.clientY - offset.y}px`;
    currentDragWin.style.transform = 'none'; // Reset any center transforms
}

function stopDrag() {
    isDragging = false;
    currentDragWin = null;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
}

// Content Loading
function loadAppContent(app, container) {
    if (app.id === 'file-explorer') {
        renderFileExplorer(container, fileSystem.root);
    } else if (app.id === 'browser') {
        container.innerHTML = '<iframe src="https://www.google.com/webhp?igu=1" style="width:100%; height:100%; border:none;"></iframe>';
    } else {
        container.innerHTML = `<div style="padding: 20px; text-align: center;"><h1>${app.title}</h1><p>Welcome to ${app.title}. This is a demo app.</p></div>`;
    }
}

// File Explorer Logic
function renderFileExplorer(container, items) {
    container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'file-grid';
    
    // Add "Back" button if needed (not implemented in this simple version, 
    // but in a real app we'd track current path)

    items.forEach(item => {
        const el = document.createElement('div');
        el.className = `file-item ${item.type}`;
        // Map types to icons or generic
        let iconClass = 'fa-solid fa-file';
        if (item.type === 'folder') iconClass = 'fa-solid fa-folder';
        if (item.icon === 'code') iconClass = 'fa-solid fa-file-code';
        if (item.icon === 'image') iconClass = 'fa-solid fa-file-image';
        
        el.innerHTML = `
            <i class="${iconClass}"></i>
            <span class="file-name">${item.name}</span>
        `;
        
        el.onclick = () => {
            if (item.type === 'folder') {
                renderFileExplorer(container, item.children);
            } else {
                alert(`Opening ${item.name}...`);
            }
        };
        grid.appendChild(el);
    });
    
    container.appendChild(grid);
}
