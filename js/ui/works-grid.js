// Pagination State
let currentPage = 1;
const itemsPerPage = 3;
let allWorks = [];

// Helper: Specific Page Render
const renderPage = (page) => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = allWorks.slice(start, end);
    renderWorksGrid(paginatedItems);

    // Update Display
    const display = document.getElementById('pagination-display');
    if (display) display.innerText = `PORTFOLIO PG. ${page}`;
};

export const renderContent = async () => {
    try {
        // 1. Fetch Resume
        const resumeRes = await fetch('assets/resume.json');
        const resumeData = await resumeRes.json();

        // Render Resume (Education)
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

        // Render Resume (Experience)
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

        // 2. Fetch Works
        const worksRes = await fetch('assets/works.json');
        allWorks = await worksRes.json(); // Store locally for pagination

        // Initial Render (Page 1)
        renderPage(1);

        // Initialize Controls
        setupPaginationControls();

        // DISPATCH: Save to Store (Legacy support for store)
        store.dispatch({ type: ACTIONS.SET_WORKS, payload: allWorks });

    } catch (error) {
        console.error('Error loading content:', error);
    }
};

// Helper: Render Works Grid
export const renderWorksGrid = (data) => {
    const worksTarget = document.getElementById('works-grid-target');
    if (!worksTarget) return;

    worksTarget.innerHTML = data.map(work => `
        <article class="work-item" data-id="${work.id}" onclick="window.open('${work.link}', '_blank')">
            <div class="media-wrapper">
                <img src="assets/placeholder.svg" class="work-media" alt="${work.title}">
            </div>
            <div class="work-info">
                <div>
                    <h2 class="work-title">${work.title}</h2>
                    <p class="work-role">${work.role}</p>
                </div>
            </div>
        </article>
    `).join('');
};

// Pagination Controls
export const setupPaginationControls = () => {
    const totalPages = Math.ceil(allWorks.length / itemsPerPage);

    const prevBtn = document.querySelector('.deck-control.prev');
    const nextBtn = document.querySelector('.deck-control.next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentPage--;
            if (currentPage < 1) currentPage = totalPages; // Loop to end
            renderPage(currentPage);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentPage++;
            if (currentPage > totalPages) currentPage = 1; // Loop to start
            renderPage(currentPage);
        });
    }
};

// Global Filter Function (Deprecated but kept for legacy calls if any)
export const setupGlobalFilter = () => {
    // Legacy support or removal if strictly moving to pagination only.
    // Keeping empty or basic support to prevent errors if invoked.
};
