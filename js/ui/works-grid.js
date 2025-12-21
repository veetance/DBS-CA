import { store, ACTIONS } from '../state/store.js';
import { loadInitialDataEffect, openExternalLinkEffect } from '../core/effects.js';
import { selectPaginatedWorks, selectFormattedPageNumber } from '../state/selectors.js';

// --- RENDERING LOGIC ---

/**
 * Helper: Pure Rendering of the Works Grid
 */
export const renderWorksGrid = (data, direction = null) => {
    const worksTarget = document.getElementById('works-grid-target');
    if (!worksTarget) return;

    // Force a "clean slate" for animations by removing items immediately
    worksTarget.innerHTML = '';

    data.forEach((work, index) => {
        let delay = 0;
        let inertiaX = 0;
        let sweepClass = 'sweep-ltr';
        let enterClass = '';

        if (direction === 'next') {
            // DIRECTION: RIGHT (Next)
            // VISUAL: Items enter from LEFT, moving RIGHT.
            // UTMOST: Rightmost item (Index 2) is "pulled" first.

            // Delay: Rightmost moves first (0s), Leftmost last.
            delay = (data.length - 1 - index) * 0.12;

            // Inertia: Rightmost pulled "harder" (comes from further left?) or just leads?
            // "Breaks boundary" -> Start further left (-150px)
            const pullFactor = (index === data.length - 1) ? 1.5 : 1;
            inertiaX = (-100 + (index * 40)) * pullFactor;

            sweepClass = 'sweep-ltr'; // Light follows move (Left -> Right)
            enterClass = 'enter-left'; // Start at -100% (Left)

        } else if (direction === 'prev') {
            // DIRECTION: LEFT (Prev)
            // VISUAL: Items enter from RIGHT, moving LEFT.
            // UTMOST: Leftmost item (Index 0) is "pulled" first.

            // Delay: Leftmost moves first (0s), Rightmost last.
            delay = index * 0.12;

            // Inertia: Leftmost pulled "harder" (comes from further right)
            const pullFactor = (index === 0) ? 1.5 : 1;
            inertiaX = (100 - ((data.length - 1 - index) * 40)) * pullFactor;

            sweepClass = 'sweep-rtl'; // Light follows move (Right -> Left)
            enterClass = 'enter-right'; // Start at 100% (Right)

        } else {
            // Default Radiant Reveal (Initial Load)
            const centerIndex = 1;
            const distance = Math.abs(index - centerIndex);
            delay = distance * 0.25;
            inertiaX = 0;
            enterClass = 'initial-reveal'; // Trigger for CSS Override
        }

        const article = document.createElement('article');
        article.className = `work-item ${enterClass}`;
        article.dataset.id = work.id;
        article.style.setProperty('--reveal-delay', `${delay.toFixed(2)}s`);
        article.style.setProperty('--inertia-x', `${inertiaX}px`);
        article.style.transitionDelay = `${delay.toFixed(2)}s`;
        article.onclick = () => store.dispatch({ type: ACTIONS.OPEN_MODAL, payload: work.id });

        article.innerHTML = `
            <div class="media-wrapper ${sweepClass}">
                <img src="assets/placeholder.svg" class="work-media" alt="${work.title}">
                <div class="work-info">
                    <div>
                        <h2 class="work-title">${work.title}</h2>
                        <p class="work-role">${work.role}</p>
                    </div>
                </div>
            </div>
        `;

        worksTarget.appendChild(article);

        // KINETIC FORK:
        // 1. Pagination (Swipes): Force immediate playback via RAF to bypass observer delay.
        // 2. Initial Load (Cascade): Rely on IntersectionObserver to trigger when visible.
        if (direction) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    article.classList.remove('enter-right', 'enter-left');
                    article.classList.add('is-visible');
                });
            });
        }

        worksObserver.observe(article);
    });

    // Re-bind Sensors after Grid Render (Persist across pagination)
    requestAnimationFrame(() => {
        initProximitySensors();
    });
};

/**
 * Helper: Render Resume Data
 */
const renderResume = (resumeData) => {
    const eduTarget = document.getElementById('resume-education-target');
    if (eduTarget) {
        eduTarget.innerHTML = resumeData.education.map(edu => `
            <div class="resume-entry">
                <div class="resume-institution">${edu.institution}</div>
                <div class="resume-role">${edu.degree}</div>
                <div style="font-size:0.8rem; color:#666; margin-bottom:10px;">${edu.date}</div>
                <p style="font-size:0.9rem; color:#888;">${edu.description}</p>
            </div>
        `).join('');
    }

    const expTarget = document.getElementById('resume-experience-target');
    if (expTarget) {
        expTarget.innerHTML = resumeData.experience.map(exp => `
            <div class="resume-entry">
                <span class="resume-date">${exp.date}</span>
                <div class="resume-institution">${exp.company}</div>
                <div class="resume-role">${exp.role}</div>
                <ul class="resume-bullets">
                    ${exp.bullets.map(b => `<li>${b}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }
};

/**
 * Helper: Project State to UI via Selectors
 */
const updateUIFromState = (state) => {
    // Selectors are now memoized. 
    // They will return cached references if nothing relevant changed.
    const paginatedWorks = selectPaginatedWorks(state);
    const pageString = selectFormattedPageNumber(state);
    const direction = state.pagination.lastDirection;

    // Update DOM with Directional Inertia
    renderWorksGrid(paginatedWorks, direction);

    const display = document.getElementById('pagination-display');
    if (display) {
        display.innerText = pageString;
    }
};

// --- CORE ORCHESTRATION ---

export const renderContent = async () => {
    try {
        await loadInitialDataEffect();
        setupPaginationControls();
    } catch (error) {
        console.error('[WORKS-GRID] Content Initialization Failed:', error);
    }
};

// --- INTERACTIVE SYSTEMS ---

let hasHinted = false;

const triggerControlHint = () => {
    const prevBtn = document.querySelector('.deck-control.prev');
    const nextBtn = document.querySelector('.deck-control.next');

    if (prevBtn) prevBtn.classList.add('is-revealed');
    if (nextBtn) nextBtn.classList.add('is-revealed');

    setTimeout(() => {
        const prevSensor = document.querySelector('.paddle-sensor.prev-sensor');
        const prevEngaged = prevBtn?.matches(':hover') || prevSensor?.matches(':hover');
        if (prevBtn && !prevEngaged) prevBtn.classList.remove('is-revealed');

        const nextSensor = document.querySelector('.paddle-sensor.next-sensor');
        const nextEngaged = nextBtn?.matches(':hover') || nextSensor?.matches(':hover');
        if (nextBtn && !nextEngaged) nextBtn.classList.remove('is-revealed');
    }, 2000);
};

const worksObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            worksObserver.unobserve(entry.target);

            if (!hasHinted) {
                hasHinted = true;
                setTimeout(triggerControlHint, 500);
            }
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
});

export const setupPaginationControls = () => {
    const prevBtn = document.querySelector('.deck-control.prev');
    const nextBtn = document.querySelector('.deck-control.next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            store.dispatch({ type: ACTIONS.PREV_PAGE });
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            store.dispatch({ type: ACTIONS.NEXT_PAGE });
        });
    }

    // Trigger Entrance Animation: REMOVED (User wants reveal on proximity only)
    // No auto-reveal.
};

// --- REACTIVE SUBSCRIPTION ---

let lastPaginatedWorks = null;
let lastResume = null;

store.subscribe(() => {
    const state = store.getState();
    const currentPaginatedWorks = selectPaginatedWorks(state);
    const currentResume = state.resume;

    // Pulse: Works Grid Update
    if (currentPaginatedWorks !== lastPaginatedWorks || (lastPaginatedWorks === null && currentPaginatedWorks.length > 0)) {
        lastPaginatedWorks = currentPaginatedWorks;
        updateUIFromState(state);
    }

    // Pulse: Resume Update
    if (currentResume !== lastResume && currentResume) {
        lastResume = currentResume;
        renderResume(currentResume);
    }
});

export const setupGlobalFilter = () => { };

/**
 * Syncs the vertical position of the navigation paddles to the midpoint of the sensors (first/last items)
 */
const alignPaddlesToSensors = () => {
    const worksSection = document.getElementById('works');
    const worksContainer = document.getElementById('works-grid-target');
    if (!worksSection || !worksContainer) return;

    const items = worksContainer.querySelectorAll('.work-item');
    if (items.length === 0) return;

    const firstItem = items[0];
    const lastItem = items[items.length - 1];
    const sectionRect = worksSection.getBoundingClientRect();

    const updateBtn = (item, btnSelector) => {
        const btn = document.querySelector(btnSelector);
        if (!btn) return;
        const itemRect = item.getBoundingClientRect();
        const midpoint = (itemRect.top + itemRect.bottom) / 2 - sectionRect.top;
        btn.style.top = `${midpoint}px`;
    };

    updateBtn(firstItem, '.deck-control.prev');
    updateBtn(lastItem, '.deck-control.next');
};

// Bind global resize to keep alignment synced
window.addEventListener('resize', alignPaddlesToSensors);

/**
 * NEW: Proximity Sensor Logic
 * Detects hover on the lateral edge zones (shaded areas) and triggers the paddle hover state.
 */
const initProximitySensors = () => {
    // 1. Target the specific media wrappers (First and Last items)
    const worksContainer = document.getElementById('works-grid-target');
    if (!worksContainer) return;

    // Wait for content (simple check or delay, but usually called after render)
    // We target the FIRST item for the LEFT sensor, the LAST item for the RIGHT sensor.
    const items = worksContainer.querySelectorAll('.work-item');
    if (items.length === 0) return;

    const firstItem = items[0];
    const lastItem = items[items.length - 1];

    // Sync Vertical Midpoint immediately
    alignPaddlesToSensors();

    // Inject Sensor into Work Item (Sibling to Media Wrapper to escape overflow:hidden)
    const injectSensor = (item, type, btnSelector) => {
        // Cleanup old
        const existing = item.querySelector(`.paddle-sensor.${type}-sensor`);
        if (existing) existing.remove();

        const sensor = document.createElement('div');
        sensor.className = `paddle-sensor ${type}-sensor`;

        // Append to ITEM (Not Media Wrapper)
        item.appendChild(sensor);

        // Bind Logic
        const btn = document.querySelector(btnSelector);
        if (btn) {
            let hideTimer = null;

            // Interaction Handler (Shared)
            const handleEnter = () => {
                if (hideTimer) clearTimeout(hideTimer);
                btn.classList.add('is-revealed'); // Materialize (Opacity/Transform)
                btn.classList.add('force-hover'); // Glow
            };

            const handleLeave = () => {
                hideTimer = setTimeout(() => {
                    btn.classList.remove('is-revealed');
                    btn.classList.remove('force-hover');
                }, 100); // 100ms Buffer to allow crossing gap
            };

            // Bind to Sensor
            sensor.addEventListener('mouseenter', handleEnter);
            sensor.addEventListener('mouseleave', handleLeave);

            // Bind to Button (So it stays open when interacted with)
            btn.addEventListener('mouseenter', handleEnter);
            btn.addEventListener('mouseleave', handleLeave);

            // Click Logic
            sensor.addEventListener('click', (e) => {
                e.preventDefault(); // Stop Link
                e.stopPropagation(); // Stop Modal
                btn.click();
            });
        }
    };

    injectSensor(firstItem, 'prev', '.deck-control.prev');
    injectSensor(lastItem, 'next', '.deck-control.next');
};
