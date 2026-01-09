# Portfolio OS (Web operating System)

**Portfolio OS** is a highly interactive, simulated Operating System built entirely in the browser using **Vanilla JavaScript**, **CSS**, and **Three.js**. It is designed to showcase advanced front-end development skills by treating "web pages" as "applications" within a windowed desktop environment.

![Project Screenshot](https://via.placeholder.com/800x450?text=Portfolio+OS+Screenshot)

## 🌟 Key Features

### 🖥️ Desktop Environment

- **Complete Window System**: Drag, resize, minimize, maximize, and stack windows just like a real OS.
- **Taskbar**: Shows open apps, allows minimizing/restoring, and includes a functional Start Menu and digital clock.
- **Boot Sequence**: Simulate a retro BIOS boot screen that transitions smoothly into the desktop.

### 🤖 I.R.I.S (Intelligent Robotic Interface System)

- **3D Integration**: Features a live 3D avatar rendered directly in the browser using `Three.js`.
- **windowed App**: I.R.I.S runs inside her own window (`iris-app`), demonstrating the ability to embed WebGL contexts into dynamic DOM elements.
- **High Quality**: Uses PBR (Physically Based Rendering) materials, dynamic lighting, and skeletal animation.

### 📂 File System Simulation

- **File Explorer**: Browse virtual directories (Projects, Resume, Pictures).
- **Project Viewer**: Click on project files to open them in dedicated viewer windows.
- **Terminal**: A functional CLI that accepts commands like `help`, `clear`, and `about`.

## 🛠️ Technology Stack

- **Core**: HTML5, CSS3, Vanilla JavaScript (ES6+ Modules)
- **3D Graphics**: Three.js (WebGL)
- **Styling**: Pure CSS Variables (Custom Properties) for theming.
- **No Frameworks**: Built without React, Vue, or Angular to demonstrate core engineering skills.

## 🚀 How to Run

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/yourusername/portfolio-os.git
    cd portfolio-os
    ```

2.  **Start a Local Server**
    Since this project uses ES Modules and 3D assets, it requires a local server (CORS policy).

    - **VS Code**: Right-click `index.html` → "Open with Live Server".
    - **Python**: `python -m http.server 8000`
    - **Node**: `npx serve .`

3.  **Open in Browser**
    Navigate to `http://localhost:8000`.

## 📂 Project Structure

```
Portfolio-OS/
├── assets/             # 3D models, audio files
├── css/                # Stylesheets (modularized)
│   ├── main.css        # Global styles
│   ├── taskbar.css     # Taskbar specific styles
│   └── window.css      # Window system styles
├── img/                # Images and icons
├── js/
│   ├── main.js         # Entry point (Boot sequence)
│   ├── modules/        # Core System Logic
│   │   ├── app_renderer.js   # Content generation for apps
│   │   ├── system_config.js  # App registry & File System data
│   │   ├── window_manager.js # Window Logic (Drag/Resize)
│   │   └── ...
│   └── I.R.I.S/        # 3D Avatar Logic
│       └── iris_app.js # Three.js Scene for Windowed App
├── index.html          # Main HTML structure
└── README.md           # This file
```

## 📝 Configuration

- **Add Projects**: Edit `js/modules/system_config.js` to add new projects to the `fileSystem` object.
- **Change Language**: Edit translations in `js/modules/language_manager.js`.

---

© 2026 Your Name. Built with 💻 and ☕.
