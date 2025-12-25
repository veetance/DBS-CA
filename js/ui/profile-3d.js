/**
 * Veetance 3D Profile IPC - SYNTHETIC HEAD Edition
 * Low-Poly Cubic Face with High-Fidelity Tracking
 * Shell removed for visual clarity as per Lead Agent directive.
 */

export const initProfile3D = () => {
    const container = document.getElementById('profile-3d-viewport');
    if (!container) return;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x667fe4, 3.5);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const sideLight = new THREE.PointLight(0xad8bff, 2);
    sideLight.position.set(-5, 0, 2);
    scene.add(sideLight);

    // --- GEOMETRY (The "Synthetic Unit") ---
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. The Head Cube (Main Chassis)
    const headGeometry = new THREE.BoxGeometry(1.4, 1.4, 1.4);
    const headMaterial = new THREE.MeshPhongMaterial({
        color: 0x0a0a0f,
        emissive: 0x667fe4,
        emissiveIntensity: 0.15,
        shininess: 80,
        transparent: true,
        opacity: 0.95
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    rootGroup.add(head);

    // 2. Low-Poly Eyes (Glowing Visor Style)
    const eyeGroup = new THREE.Group();
    rootGroup.add(eyeGroup);

    const eyeGeometry = new THREE.BoxGeometry(0.35, 0.12, 0.1);
    const eyeMaterial = new THREE.MeshBasicMaterial({
        color: 0x667fe4,
        transparent: true,
        opacity: 0.9
    });

    const eyeLeft = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eyeLeft.position.set(-0.35, 0.2, 0.7);
    eyeGroup.add(eyeLeft);

    const eyeRight = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eyeRight.position.set(0.35, 0.2, 0.7);
    eyeGroup.add(eyeRight);

    // 3. Face Platings (Low Poly detail)
    const plateGeometry = new THREE.BoxGeometry(1.2, 0.05, 0.1);
    const plateMaterial = new THREE.MeshPhongMaterial({ color: 0x1a1a25 });

    // Brow Plate
    const browPlate = new THREE.Mesh(plateGeometry, plateMaterial);
    browPlate.position.set(0, 0.45, 0.7);
    rootGroup.add(browPlate);

    // Jaw Module
    const jawGeometry = new THREE.BoxGeometry(0.8, 0.3, 0.3);
    const jaw = new THREE.Mesh(jawGeometry, plateMaterial);
    jaw.position.set(0, -0.4, 0.6);
    rootGroup.add(jaw);

    // Side Modules (Ears)
    const earGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.4);
    const earLeft = new THREE.Mesh(earGeometry, plateMaterial);
    earLeft.position.set(-0.75, 0, 0);
    rootGroup.add(earLeft);

    const earRight = new THREE.Mesh(earGeometry, plateMaterial);
    earRight.position.set(0.75, 0, 0);
    rootGroup.add(earRight);

    // --- TRACKING LOGIC ---
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (event) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouseY = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

        targetRotationY = mouseX * 0.7;
        targetRotationX = -mouseY * 0.5;
    };

    window.addEventListener('mousemove', onMouseMove);

    // --- ANIMATION LOOP ---
    const animate = () => {
        requestAnimationFrame(animate);

        // Smooth Interpolation
        rootGroup.rotation.y += (targetRotationY - rootGroup.rotation.y) * 0.08;
        rootGroup.rotation.x += (targetRotationX - rootGroup.rotation.x) * 0.08;

        // Eye Pulse
        const pulse = 0.7 + Math.sin(Date.now() * 0.005) * 0.3;
        eyeMaterial.opacity = pulse;

        // Float
        rootGroup.position.y = Math.sin(Date.now() * 0.0015) * 0.08;

        renderer.render(scene, camera);
    };

    const onWindowResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', onWindowResize);
    animate();
};
