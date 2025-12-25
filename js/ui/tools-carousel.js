/**
 * Veetance Kinetic Engine: Tools Carousel
 * Implements high-fidelity "Drag and Yeet" interaction with perpetual drift.
 * Includes Kinetic Hover Tracking to handle elements moving under a stationary cursor.
 */

export const initToolsCarousel = () => {
    const track = document.querySelector('.tools-track');
    const container = document.querySelector('.tools-marquee-container');
    if (!track || !container) return;

    let isDragging = false;
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;
    let xOffset = 0;
    const driftSpeed = -0.8;
    const friction = 0.95;

    // Mouse Tracking for Moving Hover
    let mouseX = -1;
    let mouseY = -1;

    const getLoopWidth = () => track.scrollWidth / 2;

    const applyTransform = () => {
        const loopWidth = getLoopWidth();
        if (loopWidth <= 0) return;

        if (xOffset <= -loopWidth) {
            xOffset += loopWidth;
        } else if (xOffset >= 0) {
            xOffset -= loopWidth;
        }

        track.style.transform = `translateX(${xOffset}px)`;

        // After movement, check for items under the static cursor
        updateMovingHover();
    };

    /**
     * Updates the hover state even if the mouse is stationary.
     * Checks which tool-card is currently underneath the last known mouse position.
     */
    const updateMovingHover = () => {
        if (mouseX < 0 || mouseY < 0 || isDragging) return;

        // Find element at current mouse coordinates
        const hoveredEl = document.elementFromPoint(mouseX, mouseY);
        const card = hoveredEl?.closest('.tool-card');

        // Clear existing manual hovers
        const currentHovers = track.querySelectorAll('.manual-hover');
        currentHovers.forEach(h => {
            if (h !== card) h.classList.remove('manual-hover');
        });

        // Apply new hover
        if (card) {
            card.classList.add('manual-hover');
        }
    };

    const update = () => {
        if (!isDragging) {
            if (Math.abs(velocity) > 0.1) {
                xOffset += velocity * 16;
                velocity *= friction;
            } else {
                xOffset += driftSpeed;
            }
            applyTransform();
        }
        requestAnimationFrame(update);
    };

    const startDrag = (e) => {
        isDragging = true;
        const currentX = (e.pageX || e.touches[0].pageX);
        lastX = currentX;
        lastTime = performance.now();
        track.style.transition = 'none';
        velocity = 0;

        // Clear hovers on drag start
        track.querySelectorAll('.manual-hover').forEach(h => h.classList.remove('manual-hover'));
    };

    const moveDrag = (e) => {
        if (!isDragging) return;
        const currentX = (e.pageX || e.touches[0].pageX);
        const currentTime = performance.now();
        const deltaX = currentX - lastX;
        xOffset += deltaX;
        const timeDiff = currentTime - lastTime;
        if (timeDiff > 0) velocity = deltaX / timeDiff;
        lastX = currentX;
        lastTime = currentTime;
        applyTransform();
    };

    const endDrag = () => {
        isDragging = false;
    };

    // Track Global Mouse Position for Kinetic Hover
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // Native hover will also fire, but our update() loop handles the stationary case
    });

    container.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('mouseup', endDrag);

    container.addEventListener('touchstart', startDrag, { passive: true });
    window.addEventListener('touchmove', moveDrag, { passive: true });
    window.addEventListener('touchend', endDrag);

    requestAnimationFrame(update);
};
