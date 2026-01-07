import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let scene, camera, renderer, mixer, clock;
let model;

export function initRisa() {
    const taskbar = document.getElementById('taskbar');
    if (!taskbar) return;

    // Create container for Risa
    const container = document.createElement('div');
    container.id = 'risa-container';
    container.style.position = 'fixed';
    container.style.bottom = '-290px'; 
    container.style.right = '100px'; 
    container.style.width = '600px';     
    container.style.height = '600px';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    // 1. Scene Setup
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    
    // RENDERER UPGRADE: High Performance Mode
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setPixelRatio(window.devicePixelRatio || 2); 
    renderer.setSize(600, 600); 
    renderer.outputColorSpace = THREE.SRGBColorSpace; 
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8; // *** ADJUST GLOBAL BRIGHTNESS HERE *** (Lower = Darker)
    container.appendChild(renderer.domElement);

    // 2. Camera Setup (Moved Back to prevent clipping)
    camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
    camera.position.set(0, 0, 12); // Z=12 (Further away to see everything)
    camera.lookAt(0, 0, 0);

    // 3. Lighting (*** ADJUST LIGHT LEVELS HERE ***)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); 
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(2, 5, 10); 
    scene.add(dirLight);

    // 4. Loading
    const loader = new GLTFLoader();
    const rawPath = 'assets/3D_model/(final) risa.glb';
    const encodedPath = 'assets/3D_model/' + encodeURIComponent('(final) risa.glb');
    
    const tryLoad = (path, isFallback = false) => {
        loader.load(
            path,
            (gltf) => {
                model = gltf.scene;
                
                const wrapper = new THREE.Group();
                scene.add(wrapper);
                wrapper.add(model);

                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                
                model.position.x = -center.x;
                model.position.y = -center.y;
                model.position.z = -center.z;
                
                // Manual Nudge to the Right (Fixes left-side clipping)
                wrapper.position.x = 0.5; 
                
                wrapper.rotation.y = 0; 

                // Scale Logic
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 3.5 / maxDim; // Your setting
                wrapper.scale.set(scale, scale, scale);

                // 6. QUALITY UPGRADES
                const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

                model.traverse((child) => {
                    if (child.isMesh && child.material) {
                        // TEXTURE QUALITY
                        if (child.material.map) {
                            child.material.map.colorSpace = THREE.SRGBColorSpace;
                            child.material.map.anisotropy = maxAnisotropy; 
                            child.material.map.minFilter = THREE.LinearMipmapLinearFilter;
                            child.material.map.magFilter = THREE.LinearFilter;
                        }
                        
                        if (child.material.isMeshStandardMaterial) {
                            child.material.roughness = 1.0;
                            child.material.metalness = 0.0;
                            child.material.emissive.setHex(0x000000); 
                        }

                        if (child.material.transparent || child.material.opacity < 1.0) {
                            child.material.transparent = true;
                            child.material.alphaTest = 0.5;
                            child.material.depthWrite = true;
                        }
                        
                        child.material.side = THREE.DoubleSide;
                    }
                });
                
                mixer = new THREE.AnimationMixer(model);
                if (gltf.animations.length > 0) {
                    mixer.clipAction(gltf.animations[0]).play();
                }

                animate();
            },
            undefined,
            (error) => {
                console.warn("Risa Load Error:", error);
                if (!isFallback) tryLoad(rawPath, true);
            }
        );
    };

    tryLoad(encodedPath);
}

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    renderer.render(scene, camera);
}
