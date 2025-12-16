import { store, ACTIONS } from '../state/store.js';

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
        const worksData = await worksRes.json();

        // DISPATCH: Save to Store
        store.dispatch({ type: ACTIONS.SET_WORKS, payload: worksData });

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
            <img src="assets/placeholder.svg" class="work-media" alt="${work.title}">
            <div class="work-info">
                <div>
                    <h2 class="work-title">${work.title}</h2>
                    <p class="work-role">${work.role}</p>
                </div>
            </div>
        </article>
    `).join('');
};

// Global Filter Function
export const setupGlobalFilter = () => {
    // 1. Define Filter Logic
    window.filterWorks = (category) => {
        // Update Buttons UI
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        if (event && event.target) event.target.classList.add('active');

        // DISPATCH: Set Filter
        store.dispatch({ type: ACTIONS.SET_FILTER, payload: category });
    };

    // 2. SUBSCRIBE: Listen for State Changes
    store.subscribe(() => {
        const state = store.getState();
        const works = state.works;
        const filter = state.filter;

        if (filter === 'all') {
            renderWorksGrid(works);
        } else {
            const filtered = works.filter(work => work.category === filter);
            renderWorksGrid(filtered);
        }
    });
};
