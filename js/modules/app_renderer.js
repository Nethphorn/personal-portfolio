import { t } from './language_manager.js';
import { fileSystem, apps } from './system_config.js';
import { openWindow } from './window_manager.js';

let explorerPath = [];
let currentFolder = fileSystem.root;

export function loadAppContent(app, container, extraData) {
    container.innerHTML = '';
    const appsMap = {
        'file-explorer': () => renderFileExplorer(container, currentFolder),
        'terminal': () => renderTerminal(container),
        'contact': () => container.appendChild(document.getElementById('tpl-contact').content.cloneNode(true)),
        'photos': () => renderGallery(container, fileSystem.root.find(f => f.nameKey === 'desktop.pictures').children),
        'project-viewer': () => renderProjectViewer(container, extraData),
        'resume-viewer': () => renderResumeViewer(container, extraData),
        'browser': () => container.innerHTML = '<iframe src="https://www.google.com/webhp?igu=1" style="width:100%; height:100%; border:none;"></iframe>'
    };
    (appsMap[app.id] || (() => container.innerHTML = '<div>App Content</div>'))();
}

export function renderFileExplorer(container, items) {
    container.innerHTML = `<div class="explorer-nav">
        <button class="nav-btn" ${explorerPath.length === 0 ? 'disabled' : ''} id="explorer-back"><i class="fa-solid fa-arrow-left"></i></button>
        <span>/ ${explorerPath.map(p => p.name).join(' / ')}</span>
    </div><div class="file-grid"></div>`;
    
    const grid = container.querySelector('.file-grid');
    container.querySelector('#explorer-back').onclick = () => {
        if (explorerPath.length > 0) {
            currentFolder = explorerPath.pop().items;
            renderFileExplorer(container, currentFolder);
        }
    };

    items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'file-item';
        const name = item.nameKey ? t(item.nameKey) : item.name;
        const iconId = { folder: 'icon-folder', project: 'icon-project', pdf: 'icon-pdf', image: 'icon-image' }[item.type === 'folder' ? 'folder' : item.icon];

        if (iconId) {
            el.appendChild(document.getElementById(iconId).cloneNode(true));
            el.innerHTML += `<span>${name}</span>`;
        } else {
            el.innerHTML = `<i class="fa-solid fa-file"></i><span>${name}</span>`;
        }
        
        el.onclick = () => {
            if (item.type === 'folder') {
                explorerPath.push({ name, items });
                currentFolder = item.children;
                renderFileExplorer(container, currentFolder);
            } else if (item.icon === 'project') {
                openWindow(apps.find(a => a.id === 'project-viewer'), item.data);
            } else if (item.icon === 'pdf' && item.data?.path) {
                openWindow({ id: 'resume-viewer', icon: 'fa-solid fa-file-pdf', titleKey: 'Resume' }, item.data);
            }
        };
        grid.appendChild(el);
    });
}

export function resetExplorerPath(newItem, newItems) {
    explorerPath = [{ name: newItem.name, items: fileSystem.root }];
    currentFolder = newItems;
}

function renderTerminal(container) {
    container.appendChild(document.getElementById('tpl-terminal').content.cloneNode(true));
    const output = container.querySelector('.term-output');
    output.innerHTML = `<p>> initializing...</p><p>> ${t('intro.greeting')}</p><p>> ${t('intro.help')}</p>`;
    
    const input = container.querySelector('input');
    input.onkeydown = (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim();
            output.innerHTML += `<p>$ ${cmd}</p>`;
            const responses = {
                help: 'Available commands: help, clear, about',
                clear: () => output.innerHTML = '',
                about: 'I am a passionate developer building cool things.'
            };
            const res = responses[cmd] || `Command not found: ${cmd}`;
            if (typeof res === 'function') res(); else output.innerHTML += `<p>${res}</p>`;
            input.value = '';
            container.scrollTop = container.scrollHeight;
        }
    };
}

function renderProjectViewer(container, data) {
    if (!data) return;
    const template = document.getElementById('tpl-project-viewer');
    container.appendChild(template.content.cloneNode(true));

    container.querySelector('.project-img').src = data.img;
    container.querySelector('.project-title').innerText = data.name || 'Project';
    container.querySelector('.project-desc').innerText = data.description;
    
    const repoBtn = container.querySelector('.btn-repo');
    if (data.repo) repoBtn.href = data.repo;
    else repoBtn.style.display = 'none';

    const demoBtn = container.querySelector('.btn-demo');
    if (data.demo) demoBtn.href = data.demo;
    else demoBtn.style.display = 'none';
}

function renderResumeViewer(container, data) {
    if (!data || !data.path) return;
    container.innerHTML = `<iframe src="${data.path}" style="width:100%; height:100%; border:none;"></iframe>`;
}

function renderGallery(container, items) {
    container.classList.add('photo-gallery');
    items.forEach(() => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `<i class="fa-solid fa-image"></i>`;
        container.appendChild(div);
    });
}
