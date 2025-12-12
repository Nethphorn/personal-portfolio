// Apps Rendering Module
import { t } from './i18n.js';
import { fileSystem } from './config.js';
import { openWindow } from './windows.js'; // Circular? Check runtime.
import { apps } from './config.js';

let explorerPath = [];
let currentFolder = fileSystem.root;

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

        el.innerHTML = `<i class="fa-solid ${icon}"></i><span>${name}</span>`;
        
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
                <a href="https://github.com/YOUR_USERNAME" target="_blank" style="color:white;"><i class="fa-brands fa-github"></i></a>
                <a href="https://linkedin.com/in/YOUR_USERNAME" target="_blank" style="color:white;"><i class="fa-brands fa-linkedin"></i></a>
                <a href="mailto:email@example.com" style="color:white;"><i class="fa-solid fa-envelope"></i></a>
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
