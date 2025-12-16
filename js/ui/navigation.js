import { store, ACTIONS } from '../state/store.js';

export const initSlabNav = () => {
    const nav = document.getElementById('global-nav');
    if (!nav) return;

    // Initial check
    if (window.scrollY > 50) {
        store.dispatch({ type: ACTIONS.NAV_COLLAPSE });
    }

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        // Check current store state to avoid duplicate dispatches (optimization)
        const isCollapsed = store.getState().ui.navCollapsed;

        if (currentScroll > 50 && !isCollapsed) {
            nav.classList.add('nav-collapsed');
            store.dispatch({ type: ACTIONS.NAV_COLLAPSE });
        } else if (currentScroll <= 50 && isCollapsed) {
            nav.classList.remove('nav-collapsed');
            store.dispatch({ type: ACTIONS.NAV_EXPAND });
        }
    });
};

export const initDBSLogoDelay = () => {
    const navLogo = document.querySelector('.nav-logo');
    if (!navLogo) return;

    navLogo.addEventListener('mouseenter', () => {
        const state = store.getState();
        const timers = state.ui.logoTimers || {};

        // Clear Collapse Timer
        if (timers.collapse) clearTimeout(timers.collapse);

        // Immediate Effect: Remove dim
        navLogo.classList.remove('dimmed');

        // Clear Expand Timer
        if (timers.expand) clearTimeout(timers.expand);

        // Set New Expand Timer
        const expandTimer = setTimeout(() => {
            navLogo.classList.add('open');
            // Clean up timer mapping in store
            store.dispatch({ type: ACTIONS.LOGO_UPDATE, payload: { status: 'expanded', timers: { expand: null } } });
        }, 500 / 3);

        // Update Store
        store.dispatch({ type: ACTIONS.LOGO_UPDATE, payload: { timers: { expand: expandTimer, collapse: null } } });
    });

    navLogo.addEventListener('mouseleave', () => {
        // Delay collapse by 2 seconds
        const collapseTimer = setTimeout(() => {
            navLogo.classList.remove('open');
            store.dispatch({ type: ACTIONS.LOGO_UPDATE, payload: { status: 'contracting' } });

            // After contraction (0.8s), dim it
            setTimeout(() => {
                navLogo.classList.add('dimmed');
                store.dispatch({ type: ACTIONS.LOGO_UPDATE, payload: { status: 'dimmed' } });
            }, 800);

        }, 2000);

        store.dispatch({ type: ACTIONS.LOGO_UPDATE, payload: { timers: { collapse: collapseTimer } } });
    });
};

export const startLogoIntroSequence = () => {
    // Logo starts EXPANDED via HTML class (.open)
    setTimeout(() => {
        const logo = document.querySelector('.nav-logo');
        if (logo) {
            logo.classList.remove('open');
            // Dim after contraction completes (0.8s)
            setTimeout(() => {
                logo.classList.add('dimmed');
                // AUTO-COLLAPSE LAYOUT (Mobile: Two Slab -> One Bar)
                const nav = document.getElementById('global-nav');
                if (nav) nav.classList.add('nav-collapsed');

                // Sync State
                store.dispatch({ type: ACTIONS.NAV_COLLAPSE });
                store.dispatch({ type: ACTIONS.LOGO_UPDATE, payload: { status: 'dimmed' } });

            }, 800);
        }
    }, 5000);
};

export const initScrollSpy = () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -60% 0px', // Active when element is in middle of viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active from all
                navLinks.forEach(link => link.classList.remove('active'));

                // Add active to target
                const id = entry.target.id;
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
};

export const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
};
