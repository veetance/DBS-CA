import { store, ACTIONS } from '../state/store.js';
import { loadInitialDataEffect, openExternalLinkEffect } from '../core/effects.js';
import { selectPaginatedWorks, selectFormattedPageNumber, selectHasMultiplePages } from '../state/selectors.js';

// --- RENDERING LOGIC ---

/**
 * Helper: Pure Rendering of the Works Grid
 */
export const renderWorksGrid = (data, direction = null) => {
    const worksTarget = document.getElementById('works-grid-target');
    if (!worksTarget) return;

    // Force a "clean slate" for animations by removing items immediately
    worksTarget.innerHTML = '';

    if (!data || data.length === 0) {
        console.warn('[WORKS-GRID] No data provided to render grid.');
        return;
    }

    data.forEach((work, index) => {
        let delay = 0;
        let inertiaX = 0;
        let sweepClass = 'sweep-ltr';
        let enterClass = '';

        if (direction === 'next') {
            delay = index * 0.1;
            inertiaX = 100 + (index * 20);
            sweepClass = 'sweep-rtl';
            enterClass = 'enter-right';
        } else if (direction === 'prev') {
            delay = (data.length - 1 - index) * 0.1;
            inertiaX = -100 - ((data.length - 1 - index) * 20);
            sweepClass = 'sweep-ltr';
            enterClass = 'enter-left';
        } else {
            const centerIndex = 1;
            const distance = Math.abs(index - centerIndex);
            delay = distance * 0.25;
            inertiaX = 0;
            enterClass = 'initial-reveal';
        }

        const article = document.createElement('article');
        article.className = `work-item ${enterClass}`;
        article.dataset.id = work.id;
        article.style.setProperty('--reveal-delay', `${delay.toFixed(2)}s`);
        article.style.setProperty('--inertia-x', `${inertiaX}px`);
        article.style.transitionDelay = `${delay.toFixed(2)}s`;

        article.onclick = (e) => {
            e.preventDefault();
            store.dispatch({ type: ACTIONS.OPEN_MODAL, payload: work.id });
        };

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

        // KINETIC ACTIVATION:
        if (direction) {
            // Force Layout to ensure enterClass transform is registered
            void article.offsetWidth;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    article.classList.add('is-visible');
                    // Attach to observer for future tracking
                    worksObserver.observe(article);
                });
            });
        } else {
            // Standard Intersection Trigger for first load
            worksObserver.observe(article);

            // Fallback: If for some reason the observer misses it, reveal after a delay
            setTimeout(() => {
                if (!article.classList.contains('is-visible')) {
                    article.classList.add('is-visible');
                }
            }, 1500 + (index * 200));
        }
    });

    // Re-bind Sensors after Grid Render
    requestAnimationFrame(() => {
        initProximitySensors();
    });
};

/**
 * Helper: Render Resume Data with High-Fidelity Bento Cards
 */
const renderResume = (resumeData) => {
    const eduTarget = document.getElementById('resume-education-target');
    if (eduTarget) {
        eduTarget.innerHTML = resumeData.education.map(edu => `
            <div class="resume-card reveal-item">
                <div class="resume-header-row">
                    <div class="resume-institution">${edu.institution}</div>
                    <span class="resume-date">${edu.date}</span>
                </div>
                <div class="resume-role">${edu.degree}</div>
                <p class="resume-description" style="margin-top:10.5px; font-size:0.85rem; color:var(--text-gray); line-height:1.5;">${edu.description}</p>
            </div>
        `).join('');
    }

    const expTarget = document.getElementById('resume-experience-target');
    if (expTarget) {
        expTarget.innerHTML = resumeData.experience.map(exp => `
            <div class="resume-card reveal-item">
                <div class="resume-header-row">
                    <div class="resume-institution">${exp.company}</div>
                    <span class="resume-date">${exp.date}</span>
                </div>
                <div class="resume-role">${exp.role}</div>
                <ul class="resume-bullets">
                    ${exp.bullets.map(b => `<li>${b}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }

    // Observe new bento items
    initialAboutObserver();
};

const initialAboutObserver = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Stagger children
                const items = entry.target.querySelectorAll('.reveal-item');
                items.forEach((item, i) => {
                    item.style.transitionDelay = `${i * 0.12}s`;
                    item.classList.add('is-visible');
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.resume-section-group, .proficiency-container, .bento-tile').forEach(el => observer.observe(el));
};

export { initialAboutObserver as observeAboutSection };

/**
 * Helper: Project State to UI via Selectors
 */
const updateUIFromState = (state) => {
    const paginatedWorks = selectPaginatedWorks(state);
    const pageString = selectFormattedPageNumber(state);
    const direction = state.pagination.lastDirection;
    const hasMultiple = selectHasMultiplePages(state);

    // Update DOM with Directional Inertia
    renderWorksGrid(paginatedWorks, direction);

    const display = document.getElementById('pagination-display');
    if (display) {
        display.innerText = pageString;
        // Hide display if not multiple pages
        display.parentElement.style.opacity = hasMultiple ? '1' : '0';
    }

    // Hide/Show Paddles
    const paddles = document.querySelectorAll('.deck-control');
    paddles.forEach(p => {
        p.style.display = hasMultiple ? '' : 'none';
        p.style.pointerEvents = hasMultiple ? 'auto' : 'none';
    });
};

// --- CORE ORCHESTRATION ---

export const renderContent = async () => {
    try {
        await loadInitialDataEffect();
        syncDensityToViewport(); // Initial Density Sync
        setupPaginationControls();
    } catch (error) {
        console.error('[WORKS-GRID] Content Initialization Failed:', error);
    }
};

/**
 * Monitors Viewport and Dispatches Layout Density
 */
const syncDensityToViewport = () => {
    const isMobile = window.innerWidth <= 768;
    const currentDensity = store.getState().pagination.itemsPerPage;
    const targetDensity = isMobile ? 99 : 3; // 99 ensures all works are shown on mobile

    if (currentDensity !== targetDensity) {
        store.dispatch({ type: ACTIONS.SET_ITEMS_PER_PAGE, payload: targetDensity });
    }
};

// Bind to Window Resize
window.addEventListener('resize', syncDensityToViewport);

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

    const updateBtn = (item, btnSelector) => {
        const btn = document.querySelector(btnSelector);
        if (!btn) return;

        // Offset-based calculation to ignore transform interference
        const itemMidpoint = item.offsetTop + (item.offsetHeight / 2);
        btn.style.top = `${itemMidpoint}px`;
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
                }, 2000); // 2s Persistence: Matches Logo Delay Pattern
            };

            // Bind to Sensor
            sensor.addEventListener('mouseenter', handleEnter);
            sensor.addEventListener('mouseleave', handleLeave);

            // Bind to Button (So it stays open when interacted with)
            btn.addEventListener('mouseenter', handleEnter);
            btn.addEventListener('mouseleave', handleLeave);

            // Click Logic: Direct State Dispatch
            sensor.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const actionType = type === 'prev' ? ACTIONS.PREV_PAGE : ACTIONS.NEXT_PAGE;
                store.dispatch({ type: actionType });
            });
        }
    };

    injectSensor(firstItem, 'prev', '.deck-control.prev');
    injectSensor(lastItem, 'next', '.deck-control.next');
};
