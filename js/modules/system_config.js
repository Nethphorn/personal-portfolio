// Configuration Data

export const config = {
    audio: {
        volume: 0.3,
        muted: false
    }
};

export const apps = [
    { id: 'file-explorer', icon: 'fa-regular fa-folder-open', titleKey: 'apps.explorer' },
    { id: 'browser', icon: 'fa-brands fa-chrome', titleKey: 'apps.browser' },
    { id: 'terminal', icon: 'fa-solid fa-terminal', titleKey: 'apps.terminal' },
    { id: 'contact', icon: 'fa-solid fa-address-card', titleKey: 'apps.contact' },
    { id: 'photos', icon: 'fa-solid fa-images', titleKey: 'apps.photos' },
    // Hidden / Utility Apps
    { id: 'project-viewer', icon: 'fa-solid fa-code', titleKey: 'apps.projects' },
    { id: 'image-viewer', icon: 'fa-solid fa-image', titleKey: 'apps.photos' }
];

export const fileSystem = {
    root: [
        // ==========================================
        //  FOLDER: PROJECTS
        //  Add your projects here. Copy/Paste the block below to add a new one.
        // ==========================================
        { 
            type: 'folder', 
            nameKey: 'desktop.projects', 
            icon: 'folder-code',
            children: [
                // --- Copy Below This Line to Add New Project ---
                { 
                    type: 'file', 
                    name: 'Japanese Quiz Game', 
                    icon: 'project', 
                    data: {
                        description: 'A Japanese quiz game. A collaborative project with my friend. The project use TypeScript, Svelte, and Turso.',
                        repo: 'https://github.com/pich-reamrachna/quiz-game',
                        demo: 'https://quiz-game-flame-alpha.vercel.app/',
                        img: 'https://via.placeholder.com/300'
                    }
                },
                { 
                    type: 'file', 
                    name: 'Game app', 
                    icon: 'project', 
                    data: {
                        description: 'A space shooter game. This project is a practice project for game development using Godot.',
                        repo: 'https://github.com/Nethphorn/space-shooter-game',
                        demo: 'https://nethphorn.github.io/space-shooter-game/',
                        img: 'https://via.placeholder.com/300'
                    }
                },
                { 
                    type: 'file', 
                    name: 'Pokedex Mobile', 
                    icon: 'project', 
                    data: {
                        description: 'A mobile-first Pokedex application. This project is a practice project. The project use React native, Expo, and Pokemon API.',
                        repo: 'https://github.com/Nethphorn/pokedex-mobile',
                        demo: 'https://pokedex-mobile-s8gt.vercel.app/',
                        img: 'https://via.placeholder.com/300'
                    }
                },
                { 
                    type: 'file', 
                    name: 'Social Media App', 
                    icon: 'project', 
                    data: {
                        description: 'A social media application. This project is a practice project. The project use Svelte, TypeScript, and better-auth.',
                        repo: 'https://github.com/pich-reamrachna/social-media',
                        demo: 'https://social-media-one-virid.vercel.app/',
                        img: 'https://via.placeholder.com/300'
                    }
                },
                // --- Copy Above This Line ---
            ]
        },

        // ==========================================
        //  FOLDER: RESUME
        //  Change the file names below to match your real resume files.
        // ==========================================
        { 
            type: 'folder', 
            nameKey: 'desktop.resume', 
            icon: 'folder-user',
            children: [
                { type: 'file', name: 'Resume_EN.pdf', icon: 'pdf', data: { path: 'img/resume/Nethphorn Tepbrathna.cv.pdf' } },
                { type: 'file', name: 'Resume_JP.pdf', icon: 'pdf', data: { path: 'img/resume/Nethphorn Tepbrathna.cv.pdf' } }
            ]
        },

        // ==========================================
        //  FOLDER: PICTURES
        //  Add image files here.
        // ==========================================
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
