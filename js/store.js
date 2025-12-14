/* -------------------------------------------------
   VEETANCE STATE ENGINE
   js/store.js
   
   Architecture: 
   - Centralized "Truth" for the entire application.
   - Manages Views (Routing) and Data (Portfolio).
   - Pure JavaScript. No Dependencies.
   ------------------------------------------------- */

const initialState = {
    // ROUTING / VIEWPORT STATE
    view: 'hero',          // Options: 'hero', 'works', 'resume', 'contact'
    lastView: null,        // History tracking for transitions

    // PORTFOLIO STATE
    works: [],             // Array of work items
    activeWorkIndex: 0,    // Current slide in the carousel

    // UI STATE
    navCollapsed: false,   // Header state
    editMode: false,       // Future extensibility
    heroDimmed: false      // Effect trigger
};

// ACTIONS
const Actions = {
    NAVIGATE: 'NAVIGATE',
    SET_WORKS: 'SET_WORKS',
    NEXT_WORK: 'NEXT_WORK',
    PREV_WORK: 'PREV_WORK',
    TOGGLE_NAV: 'TOGGLE_NAV',
    SET_EDIT_MODE: 'SET_EDIT_MODE'
};

// THE REDUCER (The Logic Core)
function appReducer(state, action) {
    switch (action.type) {

        case Actions.NAVIGATE:
            if (state.view === action.payload) return state; // No-op
            return {
                ...state,
                lastView: state.view,
                view: action.payload
            };

        case Actions.SET_WORKS:
            return {
                ...state,
                works: action.payload
            };

        case Actions.NEXT_WORK: {
            const nextIndex = (state.activeWorkIndex + 1) % state.works.length;
            return {
                ...state,
                activeWorkIndex: nextIndex
            };
        }

        case Actions.PREV_WORK: {
            // Standard circular decrement
            const prevIndex = (state.activeWorkIndex - 1 + state.works.length) % state.works.length;
            return {
                ...state,
                activeWorkIndex: prevIndex
            };
        }

        case Actions.TOGGLE_NAV:
            return {
                ...state,
                navCollapsed: action.payload
            };

        default:
            return state;
    }
}

// THE STORE ORACLE
class Store {
    constructor(reducer, initialState) {
        this.reducer = reducer;
        this.state = initialState;
        this.listeners = [];
    }

    getState() {
        return this.state;
    }

    dispatch(action) {
        const previousState = this.state;
        this.state = this.reducer(this.state, action);

        // Notify subscribers
        this.listeners.forEach(listener => listener(this.state, previousState, action));
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
}

// Initialize and Export the Singleton
window.AppStore = new Store(appReducer, initialState);
window.AppActions = Actions;

console.log("[VEETANCE] State Engine Online.");
