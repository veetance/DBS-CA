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
    resume: null,          // Professional Resume Data
    filter: 'all',         // Current Filter
    activeWorkId: null,    // ID of the actively selected work modal
    pagination: {
        currentPage: 1,
        itemsPerPage: 3,
        lastDirection: null // 'next', 'prev', or null
    },
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
    SET_RESUME: 'SET_RESUME',
    SET_FILTER: 'SET_FILTER',
    NAV_COLLAPSE: 'NAV_COLLAPSE',
    NAV_EXPAND: 'NAV_EXPAND',
    LOGO_UPDATE: 'LOGO_UPDATE',
    NEXT_PAGE: 'NEXT_PAGE',
    PREV_PAGE: 'PREV_PAGE',
    SET_PAGE: 'SET_PAGE',
    SET_LAST_DIRECTION: 'SET_LAST_DIRECTION',
    OPEN_MODAL: 'OPEN_MODAL',
    CLOSE_MODAL: 'CLOSE_MODAL'
};

// --- REDUCER ---
const rootReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_WORKS:
            return { ...state, works: action.payload };

        case ACTIONS.SET_RESUME:
            return { ...state, resume: action.payload };

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

        case ACTIONS.NEXT_PAGE: {
            const totalPages = Math.ceil(state.works.length / state.pagination.itemsPerPage);
            let next = state.pagination.currentPage + 1;
            if (next > totalPages) next = 1;
            return {
                ...state,
                pagination: { ...state.pagination, currentPage: next, lastDirection: 'next' }
            };
        }

        case ACTIONS.PREV_PAGE: {
            const totalPages = Math.ceil(state.works.length / state.pagination.itemsPerPage);
            let prev = state.pagination.currentPage - 1;
            if (prev < 1) prev = totalPages;
            return {
                ...state,
                pagination: { ...state.pagination, currentPage: prev, lastDirection: 'prev' }
            };
        }

        case ACTIONS.SET_PAGE:
            return {
                ...state,
                pagination: { ...state.pagination, currentPage: action.payload, lastDirection: null }
            };

        case ACTIONS.SET_LAST_DIRECTION:
            return {
                ...state,
                pagination: { ...state.pagination, lastDirection: action.payload }
            };

        case ACTIONS.OPEN_MODAL:
            return { ...state, activeWorkId: action.payload };

        case ACTIONS.CLOSE_MODAL:
            return { ...state, activeWorkId: null };

        default:
            return state;
    }
};

// --- EXPORT STORE INSTANCE ---
export const store = createStore(rootReducer, initialState);

