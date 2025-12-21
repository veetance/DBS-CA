/**
 * Veetance Effect Layer
 * Handles all I/O and side-effects (Fetch, LocalStorage, etc.)
 * Separating the "Execution" of side-effects from the "Logic" of the UI.
 */

import { store, ACTIONS } from '../state/store.js';

/**
 * Effect: Load Portfolio Data
 * Fetches works and resume data, then updates the global store.
 */
export const loadInitialDataEffect = async () => {
    try {
        // Parallel fetch for efficiency
        const [worksRes, resumeRes] = await Promise.all([
            fetch('assets/works.json'),
            fetch('assets/resume.json')
        ]);

        const works = await worksRes.json();
        const resume = await resumeRes.json();

        // Dispatching to store - UI will react via subscription
        store.dispatch({ type: ACTIONS.SET_WORKS, payload: works });
        store.dispatch({ type: ACTIONS.SET_RESUME, payload: resume });

        return { works, resume };
    } catch (error) {
        console.error('[VEETANCE EFFECTS] Failed to load data:', error);
        throw error;
    }
};

/**
 * Effect: External Navigation
 * Handles purely external side-effects.
 */
export const openExternalLinkEffect = (url) => {
    window.open(url, '_blank');
};
