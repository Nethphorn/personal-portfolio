# Portfolio OS

An interactive portfolio website that simulates a modern desktop operating system, built with vanilla HTML, CSS, and JavaScript.

![Project Screenshot](https://raw.githubusercontent.com/brath/portfolio-os/main/og-image.jpg)

## Features

- **Window Management**: Drag, drop, minimize, and maximize windows.
- **Taskbar**: Switch between active apps.
- **File System**: Simulated file explorer with navigation.
- **Glassmorphism**: Modern UI transparency effects.
- **Mobile Responsive**: Adapts to phone screens by maximizing apps automatically.

## Deployment Guide

This project is a static site (HTML/CSS/JS only), making it incredibly easy to deploy for free.

### Option 1: Vercel (Recommended)

1.  Push this code to a GitHub repository.
2.  Go to [Vercel](https://vercel.com) and sign up/login.
3.  Click **"Add New Project"** -> **"Project"**.
4.  Import your GitHub repository.
5.  Click **"Deploy"**.
    - _Build Command:_ (Leave empty)
    - _Output Directory:_ (Leave empty)

### Option 2: Netlify

1.  Go to [Netlify](https://netlify.com).
2.  Click **"Add new site"** -> **"Import an existing project"**.
3.  Select GitHub and choose your repository.
4.  Click **"Deploy site"**.

### Option 3: GitHub Pages

1.  In your repository, go to **Settings** > **Pages**.
2.  Under **Build and deployment**, select **Source**: `Deploy from a branch`.
3.  Select branch: `main` (or master).
4.  Click **Save**. Your site will be live at `username.github.io/repo-name`.

## Customization

To add your own apps or files, edit `script.js`:

- `const apps`: Add new applications here.
- `const fileSystem`: Add your own "files" and folders.

## License

MIT License. Feel free to use this for your own portfolio!
