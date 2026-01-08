// Apps Rendering Module
import { t } from './language_manager.js';
import { fileSystem } from './system_config.js';
import { openWindow } from './window_manager.js'; // Circular? Check runtime.
import { apps } from './system_config.js';

let explorerPath = [];
let currentFolder = fileSystem.root;

// ==========================================
//  FUNCTION: loadAppContent
//  Loads the content of an app into a container.
// ==========================================
export function loadAppContent(app, container, extraData) {
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
        case 'photos':
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
export function renderFileExplorer(container, items) {
    container.innerHTML = '';
    
    // Navbar
    const nav = document.createElement('div');
    nav.className = 'explorer-nav';


    const backBtn = document.createElement('button');
    backBtn.className = 'nav-btn';
    backBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
    backBtn.disabled = explorerPath.length === 0;
    
    backBtn.onclick = () => {
        if (explorerPath.length > 0) {
            const prevState = explorerPath.pop();
            currentFolder = prevState.items;
            renderFileExplorer(container, currentFolder);
        }
    };
    nav.appendChild(backBtn);

    const pathLabel = document.createElement('span');
    pathLabel.innerText = '/ ' + explorerPath.map(p => p.name).join(' / ');
    nav.appendChild(pathLabel);

    container.appendChild(nav);

    // Grid
    const grid = document.createElement('div');
    grid.className = 'file-grid';
    
    items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'file-item';
        
        let icon = 'fa-file';
        if (item.type === 'folder') icon = 'fa-folder';
        if (item.icon === 'project') icon = 'fa-laptop-code';
        if (item.icon === 'pdf') icon = 'fa-file-pdf';
        if (item.icon === 'image') icon = 'fa-image';

        const name = item.nameKey ? t(item.nameKey) : item.name;

        if (item.type === 'folder') {
             el.innerHTML = `
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated; margin-bottom: 5px;">
                    <path d="M22 6H12L10 4H2V20H22V6Z" fill="#F8D775" stroke="#000" stroke-width="2" shape-rendering="crispEdges"/>
                    <path d="M2 6H22V20H2V6Z" fill="#F8D775" stroke="#000" stroke-width="2"/>
                    <path d="M12 6L10 4H2V6H12Z" fill="#FFE59A"/>
                    <rect x="3" y="7" width="18" height="1" fill="#FFE59A"/>
                    <rect x="2" y="6" width="1" height="14" fill="#000"/>
                    <rect x="21" y="6" width="1" height="14" fill="#000"/>
                    <rect x="2" y="20" width="20" height="1" fill="#000"/>
                </svg>
                <span>${name}</span>
            `;
        } else {
            // Check for specific app types to render pixel icons
            let pixelIcon = '';
            // Define pixel art SVGs for file types
            const projectIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M2 4H22V16H2V4Z" fill="#58a6ff" stroke="black"/><path d="M4 16V18H20V16" fill="black"/><rect x="8" y="18" width="8" height="2" fill="black"/></svg>`;
            const pdfIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 2H20V22H4V2Z" fill="#ff5555" stroke="black"/><path d="M8 6H16" stroke="white" stroke-width="2"/><path d="M8 10H16" stroke="white" stroke-width="2"/><path d="M8 14H16" stroke="white" stroke-width="2"/></svg>`;
            const imgIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M2 2H22V22H2V2Z" fill="#ffffff" stroke="black"/><circle cx="8" cy="8" r="3" fill="#ffcc00"/><path d="M2 16L8 10L14 16L18 12L22 16V22H2V16Z" fill="#44aa44"/></svg>`;

            if (item.icon === 'project') pixelIcon = projectIcon;
            if (item.icon === 'pdf') pixelIcon = pdfIcon;
            if (item.icon === 'image') pixelIcon = imgIcon;

            if (pixelIcon) {
                el.innerHTML = `${pixelIcon}<span>${name}</span>`;
            } else {
                 el.innerHTML = `<i class="fa-solid ${icon}" style="font-size: 24px;"></i><span>${name}</span>`;
            }
        }
        
        el.onclick = () => {
            if (item.type === 'folder') {
                explorerPath.push({ name: name, items: items });
                currentFolder = item.children;
                renderFileExplorer(container, currentFolder);
            } else if (item.icon === 'project') {
                openWindow(apps.find(a => a.id === 'project-viewer'), item.data);
            }
        };
        grid.appendChild(el);
    });
    container.appendChild(grid);
}

export function resetExplorerPath(newItem, newItems) {
    explorerPath = [{ name: newItem.name, items: fileSystem.root }];
    currentFolder = newItems;
}

// --- TERMINAL ---
// EDIT HERE: Change the text response for commands
function renderTerminal(container) {
    container.style.background = '#0d1117';
    container.style.color = '#58a6ff';
    container.style.fontFamily = 'monospace';
    container.style.padding = '20px';
    container.style.overflowY = 'auto';

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
            
            // --- COMMAND LOGIC ---
            if (cmd === 'help') {
                output.innerHTML += `<p>Available commands: help, clear, about</p>`;
            } else if (cmd === 'clear') {
                output.innerHTML = '';
            } else if (cmd === 'about') {
                // CHANGE ME: Update your 'about' info here
                output.innerHTML += `<p>I am a passionate developer building cool things.</p>`;
            } else {
                output.innerHTML += `<p>Command not found: ${cmd}</p>`;
            }
            
            input.value = '';
            container.scrollTop = container.scrollHeight;
        }
    });
}

// --- CONTACT ---
// EDIT HERE: Update your email and social links
function renderContact(container) {
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:20px;">
            <h2>Contact Me</h2>
            <div style="display:flex; gap:20px; font-size:2rem;">
                <!-- Update or add links below -->
                <a href="https://github.com/SterbenIsDed" target="_blank" style="color:white;"><i class="fa-brands fa-github"></i></a>
                <a href="https://linkedin.com/in/SterbenIsDed" target="_blank" style="color:white;"><i class="fa-brands fa-linkedin"></i></a>
                <a href="mailto:nethphorn.tb@gmail.com" style="color:white;"><i class="fa-solid fa-envelope"></i></a>
            </div>
            <p>nethphorn.tb@gmail.com</p>
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
            <div style="display:flex; gap:10px;">
                <a href="${data.link}" target="_blank" style="padding:10px; flex:1; background:var(--accent-color); color:white; text-align:center; border-radius:4px; text-decoration:none;">Open in New Tab</a>
                <button id="btn-open-frame-${data.name}" style="padding:10px; flex:1; background:#333; color:white; border:none; border-radius:4px; cursor:pointer;">Open in Window</button>
            </div>
        </div>
    `;
    
    // Attach listener to new button
    setTimeout(() => {
        const btn = document.getElementById(`btn-open-frame-${data.name}`);
        if(btn) {
            btn.onclick = () => {
                container.innerHTML = `<iframe src="${data.link}" style="width:100%; height:100%; border:none;"></iframe>`;
            };
        }
    }, 0);
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
