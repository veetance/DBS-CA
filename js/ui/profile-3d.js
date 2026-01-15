import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

/**
 * Interactive Profile Rig v4.5 - SIDE-MODAL Edition
 * Engineered by DEUS for MrVee.
 */

export const initProfile3D = () => {
    const container = document.getElementById('profile-3d-viewport');
    const aboutSection = document.getElementById('about');
    if (!container || !aboutSection) return;

    // LAZY-LOAD: Defer Three.js initialization until About section enters viewport
    let hasInitialized = false;
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasInitialized) {
                hasInitialized = true;
                lazyObserver.disconnect();
                console.log("DBS_CA: Sentinel Rig observer triggered.");
                initThreeScene();
            }
        });
    }, { threshold: 0.05, rootMargin: '200px 0px' });

    lazyObserver.observe(aboutSection);

    function initThreeScene() {
        try {
            console.log("DBS_CA: Initializing Interactive Profile Rig...");
            RectAreaLightUniformsLib.init();

            // --- SCENE & CORE ---
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.set(0, 0, 5);

            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.2;
            container.appendChild(renderer.domElement);

            // --- CONTROLS ---
            const orbit = new OrbitControls(camera, renderer.domElement);
            orbit.enableDamping = true;
            orbit.dampingFactor = 0.05;
            orbit.enabled = false;

            const transform = new TransformControls(camera, renderer.domElement);
            scene.add(transform);

            transform.addEventListener('dragging-changed', (event) => {
                orbit.enabled = !event.value;
            });

            // --- STATE & REGISTRY ---
            let sceneLights = [];
            let selectedObject = null;
            let sentinelModel = null;
            let eyes = [];
            let isRigMode = false;

            // --- UI ELEMENTS ---
            const ui = {
                gear: document.getElementById('sentinel-rig-trigger'),
                modal: document.getElementById('sentinel-forge-modal'),
                close: document.getElementById('close-forge-trigger'),
                objList: document.getElementById('forge-object-list'),
                propStack: document.getElementById('property-inputs'),
                nameDisp: document.getElementById('selected-obj-name'),
                typeDisp: document.getElementById('selected-obj-type'),
                typeSelector: document.getElementById('forge-type-selector'),
                modeTrans: document.getElementById('mode-translate'),
                modeRot: document.getElementById('mode-rotate'),
                modeScale: document.getElementById('mode-scale'),
                addBtn: document.getElementById('add-light-btn'),
                delBtn: document.getElementById('del-light-btn')
            };

            // --- ENVIRONMENT MAPPING ---
            const envLoader = new THREE.TextureLoader();
            envLoader.load('assets/GLB/HDRI/sky_linekotsi_09.png', (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                texture.colorSpace = THREE.SRGBColorSpace;
                scene.environment = texture;
            });

            // --- INITIAL STAGE: 3-POINT LIGHTING ---
            const initStageLights = () => {
                const key = new THREE.DirectionalLight(0x667fe4, 1.2);
                key.position.set(5, 5, 5);
                key.userData = { id: 'key', name: 'KEY_LIGHT', type: 'directional' };
                scene.add(key);
                sceneLights.push(key);

                const fill = new THREE.DirectionalLight(0xffffff, 0.6);
                fill.position.set(-5, -5, 2);
                fill.userData = { id: 'fill', name: 'FILL_LIGHT', type: 'directional' };
                scene.add(fill);
                sceneLights.push(fill);

                const rim = new THREE.SpotLight(0x667fe4, 40);
                rim.position.set(-5, 0, 5);
                rim.angle = 0.8;
                rim.penumbra = 0.8;
                rim.userData = { id: 'rim', name: 'RIM_LIGHT', type: 'spot' };
                scene.add(rim);
                sceneLights.push(rim);
                if (rim.target) scene.add(rim.target);
            };

            const createLight = (type) => {
                let light;
                const color = 0x667fe4;
                const id = `light_${Date.now()}`;
                const name = `${type.toUpperCase()}_${sceneLights.length + 1}`;

                switch (type) {
                    case 'point': light = new THREE.PointLight(color, 10); break;
                    case 'ellipse':
                        light = new THREE.SpotLight(color, 50);
                        light.angle = 0.5;
                        light.penumbra = 1;
                        break;
                    case 'rect': light = new THREE.RectAreaLight(color, 15, 2, 1); break;
                    case 'dome': light = new THREE.HemisphereLight(color, 0x000000, 1); break;
                }

                light.position.set(0, 2, 2);
                light.userData = { id, name, type };
                scene.add(light);
                if (light.target) scene.add(light.target);

                sceneLights.push(light);
                syncObjectList();
                selectObject(light);
            };

            const toggleRigMode = (force) => {
                isRigMode = force !== undefined ? force : !isRigMode;
                if (ui.modal) ui.modal.classList.toggle('is-active', isRigMode);

                // HIDE OTHER ELEMENTS IN CONTAINER (Focused Rig Mode)
                const targets = aboutSection.querySelectorAll('.resume-section-group, .identity-data-fields, .card-footer-barcode, .identity-header-right');
                targets.forEach(el => el.classList.toggle('is-hidden', isRigMode));

                orbit.enabled = isRigMode;
                if (!isRigMode) {
                    transform.detach();
                    selectedObject = null;
                } else {
                    selectObject(sentinelModel);
                    syncObjectList();
                }
            };

            if (ui.gear) ui.gear.onclick = () => toggleRigMode(true);
            if (ui.close) ui.close.onclick = () => toggleRigMode(false);

            const selectObject = (obj) => {
                if (!obj) return;
                selectedObject = obj;
                if (isRigMode) transform.attach(obj);
                if (ui.nameDisp) ui.nameDisp.textContent = obj.userData?.name || 'SENTINEL_UNIT';
                if (ui.typeDisp) ui.typeDisp.textContent = `PROPERTIES // ${obj.userData?.id === 'sentinel' ? 'SHADER' : 'LIGHT'}`;
                syncObjectList();
                renderProperties(obj);
            };

            const syncObjectList = () => {
                if (!ui.objList) return;
                ui.objList.innerHTML = `<div class="list-item ${selectedObject === sentinelModel ? 'active' : ''}" data-id="sentinel">SENTINEL_UNIT</div>`;
                sceneLights.forEach(light => {
                    const item = document.createElement('div');
                    item.className = 'list-item' + (selectedObject === light ? ' active' : '');
                    item.textContent = light.userData.name;
                    item.dataset.id = light.userData.id;
                    item.onclick = () => selectObject(light);
                    ui.objList.appendChild(item);
                });
                const sentinelItem = ui.objList.querySelector('[data-id="sentinel"]');
                if (sentinelItem) sentinelItem.onclick = () => selectObject(sentinelModel);
            };

            const renderProperties = (obj) => {
                if (!ui.propStack) return;
                ui.propStack.innerHTML = '';
                if (obj === sentinelModel) {
                    sentinelModel.traverse(child => {
                        if (child.isMesh && child.material && !eyes.includes(child)) {
                            addSlider('METALNESS', child.material.metalness, 0, 1, (v) => child.material.metalness = v);
                            addSlider('ROUGHNESS', child.material.roughness, 0, 1, (v) => child.material.roughness = v);
                            addSlider('ENV_MAP', child.material.envMapIntensity, 0, 5, (v) => child.material.envMapIntensity = v);
                            addSlider('EXPOSURE', renderer.toneMappingExposure, 0, 3, (v) => renderer.toneMappingExposure = v);
                        }
                    });
                } else if (obj.isLight) {
                    addSlider('INTENSITY', obj.intensity, 0, 100, (v) => obj.intensity = v);
                    if (obj.isSpotLight) {
                        addSlider('ANGLE', obj.angle, 0, Math.PI / 2, (v) => obj.angle = v);
                        addSlider('PENUMBRA', obj.penumbra, 0, 1, (v) => obj.penumbra = v);
                    }
                    if (obj.isRectAreaLight) {
                        addSlider('WIDTH', obj.width, 0, 10, (v) => obj.width = v);
                        addSlider('HEIGHT', obj.height, 0, 10, (v) => obj.height = v);
                    }
                }
            };

            const addSlider = (label, value, min, max, onChange) => {
                const group = document.createElement('div');
                group.className = 'forge-prop-group';
                group.innerHTML = `<label>${label}</label><input type="range" min="${min}" max="${max}" step="${max > 5 ? 1 : 0.05}" value="${value}"><span class="val-display">${value.toFixed(1)}</span>`;
                const input = group.querySelector('input');
                const disp = group.querySelector('.val-display');
                input.oninput = (e) => {
                    const val = parseFloat(e.target.value);
                    onChange(val);
                    disp.textContent = val.toFixed(1);
                };
                ui.propStack.appendChild(group);
            };

            const loader = new GLTFLoader();
            loader.load('assets/GLB/HELMET_02.glb', (gltf) => {
                console.log("DBS_CA: Sentinel model file loaded.");
                const mesh = gltf.scene;
                const box = new THREE.Box3().setFromObject(mesh);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                const scale = 2.4 / Math.max(size.x, size.y, size.z);
                mesh.scale.set(scale, scale, scale);
                mesh.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

                sentinelModel = new THREE.Group();
                sentinelModel.userData = { id: 'sentinel', name: 'SENTINEL_UNIT' };
                sentinelModel.add(mesh);

                mesh.traverse((child) => {
                    if (child.isMesh) {
                        const name = child.name.toLowerCase();
                        if (name.includes('eye') || name.includes('visor')) {
                            eyes.push(child);
                            child.material = new THREE.MeshBasicMaterial({ color: 0x667fe4, transparent: true, opacity: 0.9 });
                        } else if (child.material) {
                            child.material.metalness = 1.0;
                            child.material.roughness = 0.3;
                            child.material.envMapIntensity = 2.2;
                            child.material.color.setHex(0xcccccc);
                        }
                    }
                });
                scene.add(sentinelModel);
            }, undefined, (err) => {
                console.error("DBS_CA: Sentinel Loader Error.", err);
            });

            const syncModeBtns = () => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.id.includes(transform.mode)));
            };

            if (ui.modeTrans) ui.modeTrans.onclick = () => { transform.setMode('translate'); syncModeBtns(); };
            if (ui.modeRot) ui.modeRot.onclick = () => { transform.setMode('rotate'); syncModeBtns(); };
            if (ui.modeScale) ui.modeScale.onclick = () => { transform.setMode('scale'); syncModeBtns(); };
            if (ui.addBtn) ui.addBtn.onclick = () => ui.typeSelector && ui.typeSelector.classList.toggle('hidden');
            if (ui.delBtn) ui.delBtn.onclick = () => {
                if (selectedObject && selectedObject !== sentinelModel) {
                    scene.remove(selectedObject);
                    sceneLights = sceneLights.filter(l => l !== selectedObject);
                    transform.detach();
                    selectObject(sentinelModel);
                }
            };

            if (ui.typeSelector) {
                ui.typeSelector.querySelectorAll('button').forEach(btn => {
                    btn.onclick = () => { createLight(btn.dataset.type); ui.typeSelector.classList.add('hidden'); };
                });
            }

            window.addEventListener('keydown', (e) => {
                if (!isRigMode) return;
                switch (e.key.toLowerCase()) {
                    case 'w': transform.setMode('translate'); break;
                    case 'e': transform.setMode('rotate'); break;
                    case 'r': transform.setMode('scale'); break;
                }
                syncModeBtns();
            });

            initStageLights();

            // Animation Loop
            let targetX = 0, targetY = 0;
            let baseY = 0.4;
            const baseTiltX = 0.15;
            const aboutZone = document.getElementById('about');

            if (aboutZone) {
                aboutZone.addEventListener('mousemove', (e) => {
                    if (isRigMode) return;
                    const rect = container.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
                    const y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;
                    targetY = Math.max(-0.4, Math.min(0.4, x * 0.6));
                    targetX = Math.max(-0.2, Math.min(0.2, -y * 0.3));
                });
                aboutZone.addEventListener('mouseleave', () => {
                    if (isRigMode) return;
                    targetX = 0; targetY = 0;
                });
            }

            const animate = () => {
                requestAnimationFrame(animate);
                if (isRigMode) {
                    orbit.update();
                } else if (sentinelModel) {
                    sentinelModel.rotation.y += (targetY - sentinelModel.rotation.y) * 0.08;
                    sentinelModel.rotation.x += ((targetX + baseTiltX) - sentinelModel.rotation.x) * 0.08;
                    const bob = Math.sin(Date.now() * 0.0015) * 0.08;
                    sentinelModel.position.y = baseY + bob;
                }
                if (eyes.length > 0) {
                    const pulse = 0.4 + Math.sin(Date.now() * 0.003) * 0.6;
                    eyes.forEach(eye => eye.material.opacity = pulse);
                }
                renderer.render(scene, camera);
            };
            animate();

            window.addEventListener('resize', () => {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            });

        } catch (error) {
            console.error("DBS_CA: Interactive Profile Rig Initialization Failure.", error);
        }
    }
};
