/**
 * Veetance Functional Utilities
 * Tools for pure functional state management.
 */

/**
 * createSelector
 * Simple memoization helper for selectors.
 * Only re-calculates if the input dependencies (slices of state) change by reference.
 */
export const createSelector = (dependencies, transform) => {
    let lastArgs = [];
    let lastResult = null;

    return (state) => {
        const currentArgs = dependencies.map(dep => dep(state));

        // Shallow equality check for dependencies
        const hasChanged = currentArgs.length !== lastArgs.length ||
            currentArgs.some((arg, i) => arg !== lastArgs[i]);

        if (hasChanged) {
            lastArgs = currentArgs;
            lastResult = transform(...currentArgs);
        }

        return lastResult;
    };
};

// --- BASE SELECTORS (Simple Identity Slices) ---
const getWorks = state => state.works;
const getCurrentPage = state => state.pagination.currentPage;
const getItemsPerPage = state => state.pagination.itemsPerPage;

// --- MEMOIZED SELECTORS (Derived Data) ---

/**
 * Select the slice of works for the current page.
 * Memoized: Only re-calculates if works, currentPage, or itemsPerPage change.
 */
export const selectPaginatedWorks = createSelector(
    [getWorks, getCurrentPage, getItemsPerPage],
    (works, currentPage, itemsPerPage) => {
        if (!works || works.length === 0) return [];
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return works.slice(start, end);
    }
);

/**
 * Select the formatted page number (with leading zero).
 * Memoized: Only re-calculates if currentPage change.
 */
export const selectFormattedPageNumber = createSelector(
    [getCurrentPage],
    (currentPage) => {
        return currentPage < 10 ? `0${currentPage}` : currentPage.toString();
    }
);

/**
 * Select the total number of pages.
 */
export const selectTotalPages = createSelector(
    [getWorks, getItemsPerPage],
    (works, itemsPerPage) => {
        return Math.ceil(works.length / itemsPerPage);
    }
);

/**
 * Selector to check if pagination is needed.
 */
export const selectHasMultiplePages = createSelector(
    [selectTotalPages],
    (totalPages) => totalPages > 1
);
