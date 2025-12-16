/* -------------------------------------------------
   Digital Blacksmith Studios – Core Application Logic
   main.js (Refactored Module)
   ------------------------------------------------- */

import { initSlabNav, initDBSLogoDelay, startLogoIntroSequence, initScrollSpy, initSmoothScroll } from './ui/navigation.js';
import { renderContent, setupGlobalFilter } from './ui/works-grid.js';
import { initHeroTextReveal } from './ui/hero-fx.js';
import { activateButtonEffects, initChipGlow, initScrollRevealSystem, initParallax } from './ui/interactions.js';
import { initVirtualScrollbar } from './ui/virtual-scrollbar.js';
import { initArtificeController } from './core/artifice-controller.js';

(() => {
    // 1. Initialize Content
    renderContent();
    setupGlobalFilter();

    // 2. Initialize Navigation
    initSlabNav();
    initScrollSpy();
    initSmoothScroll();

    // 3. Initialize Interactions
    initChipGlow();
    initParallax();
    activateButtonEffects();
    initScrollRevealSystem();
    initVirtualScrollbar();

    // 4. Logo Sequence & Artifice
    // Note: DBS Logo Delay needs to wait for intro
    setTimeout(initDBSLogoDelay, 2200);
    startLogoIntroSequence();

    initArtificeController();

    // 5. Trigger Text Animation
    setTimeout(initHeroTextReveal, 100);

    // Force scroll to top on load
    window.addEventListener('load', () => {
        window.scrollTo(0, 0);
    });

})();
