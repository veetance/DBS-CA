/**
 * Veetance State Engine (VSE)
 * A custom Vanilla JS Store implementing the Flux pattern.
 */

const createStore = (reducer, initialState) => {
    let state = initialState;
    const listeners = new Set();

    const getState = () => state;

    const dispatch = (action) => {
        state = reducer(state, action);
        listeners.forEach(listener => listener());
        // Debug Logger
        console.log(`[VSE] Action: ${action.type}`, state);
    };

    const subscribe = (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };

    return { getState, dispatch, subscribe };
};

// --- INITIAL STATE ---
const initialState = {
    view: 'hero',          // Current Active Dimension
    works: [],             // Portfolio Data
    filter: 'all',         // Current Filter
    ui: {
        navCollapsed: false,
        heroDimmed: false,
        logoState: 'expanded', // 'expanded', 'contracted', 'dimmed'
        logoTimers: {}         // Holding timeout IDs
    }
};

// --- ACTIONS ---
export const ACTIONS = {
    SET_WORKS: 'SET_WORKS',
    SET_FILTER: 'SET_FILTER',
    NAV_COLLAPSE: 'NAV_COLLAPSE',
    NAV_EXPAND: 'NAV_EXPAND',
    LOGO_UPDATE: 'LOGO_UPDATE',
};

// --- REDUCER ---
const rootReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_WORKS:
            return { ...state, works: action.payload };

        case ACTIONS.SET_FILTER:
            return { ...state, filter: action.payload };

        case ACTIONS.NAV_COLLAPSE:
            return {
                ...state,
                ui: { ...state.ui, navCollapsed: true }
            };

        case ACTIONS.NAV_EXPAND:
            return {
                ...state,
                ui: { ...state.ui, navCollapsed: false }
            };

        case ACTIONS.LOGO_UPDATE:
            return {
                ...state,
                ui: {
                    ...state.ui,
                    logoState: action.payload.status || state.ui.logoState,
                    logoTimers: { ...state.ui.logoTimers, ...action.payload.timers }
                }
            };

        default:
            return state;
    }
};

// --- EXPORT STORE INSTANCE ---
export const store = createStore(rootReducer, initialState);
