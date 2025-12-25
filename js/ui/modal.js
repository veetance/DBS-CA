import { store, ACTIONS } from '../state/store.js';

/**
 * Veetance Modal Controller
 * Orchestrates the rendering and state of the work detail viewport.
 */

const modalOverlay = document.getElementById('work-modal');

/**
 * Renderer: Pure Content Injection
 */
const renderModalContent = (work) => {
    if (!work) return '';

    return `
        <div class="modal-container">
            <button class="modal-close" aria-label="Close Viewport">
                <span class="material-icons">close</span>
            </button>
            
            <div class="modal-media-viewport">
                <button class="modal-paddle prev" data-dir="prev" aria-label="Previous work item">
                    <span class="material-icons" aria-hidden="true">chevron_left</span>
                </button>
                <button class="modal-paddle next" data-dir="next" aria-label="Next work item">
                    <span class="material-icons" aria-hidden="true">chevron_right</span>
                </button>

                ${work.type === 'video'
            ? `<video src="${work.link}" autoplay loop muted playsinline></video>`
            : `<img src="assets/placeholder.svg" alt="${work.title}">`
        }
            </div>

            <div class="modal-specs">
                <div class="modal-header-info">
                    <div class="modal-category">${work.category.replace('_', ' ')}</div>
                    <h2 class="modal-title">${work.title}</h2>
                    <div class="modal-role-badge">${work.role}</div>
                    <p class="modal-description">${work.desc}</p>
                </div>

                <div class="modal-footer">
                    <a href="${work.link}" target="_blank" class="btn-modal-action">VISIT LIVE SITE</a>
                    <button class="btn-modal-action secondary btn-close-modal">CLOSE</button>
                </div>
            </div>
        </div>
    `;
};

/**
 * Interaction Setup
 */
const setupModalInteractions = () => {
    const state = store.getState();
    const works = state.works;
    const currentId = state.activeWorkId;
    const currentIndex = works.findIndex(w => w.id === currentId);

    const closeBtns = modalOverlay.querySelectorAll('.modal-close, .btn-close-modal');
    closeBtns.forEach(btn => {
        btn.onclick = () => store.dispatch({ type: ACTIONS.CLOSE_MODAL });
    });

    // Paddle Navigation Logic
    const paddles = modalOverlay.querySelectorAll('.modal-paddle');
    paddles.forEach(paddle => {
        paddle.onclick = (e) => {
            e.stopPropagation();
            const dir = paddle.dataset.dir;
            let nextIndex = dir === 'next' ? currentIndex + 1 : currentIndex - 1;

            if (nextIndex < 0) nextIndex = works.length - 1;
            if (nextIndex >= works.length) nextIndex = 0;

            store.dispatch({ type: ACTIONS.OPEN_MODAL, payload: works[nextIndex].id });
        };
    });

    // Close on backdrop click
    modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) {
            store.dispatch({ type: ACTIONS.CLOSE_MODAL });
        }
    };

    // Close on ESC key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && store.getState().activeWorkId) {
            store.dispatch({ type: ACTIONS.CLOSE_MODAL });
        }
    });
};

/**
 * Reactive Subscription
 */
let lastActiveWorkId = null;

export const initModalSystem = () => {
    store.subscribe(() => {
        const state = store.getState();
        const currentId = state.activeWorkId;

        // Peak Optimization: Only re-render if the active ID actually changed
        if (currentId !== lastActiveWorkId) {
            lastActiveWorkId = currentId;

            if (currentId) {
                const work = state.works.find(w => w.id === currentId);
                modalOverlay.innerHTML = renderModalContent(work);
                modalOverlay.classList.add('is-active');
                document.body.style.overflow = 'hidden'; // Suppress scroll noise
                setupModalInteractions();
            } else {
                modalOverlay.classList.remove('is-active');
                document.body.style.overflow = ''; // Restore scroll

                // Optional: Delay clear to allow fade-out animation
                setTimeout(() => {
                    if (!store.getState().activeWorkId) {
                        modalOverlay.innerHTML = '';
                    }
                }, 400);
            }
        }
    });
};
