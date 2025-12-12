/* -------------------------------------------------
   Digital Blacksmith Studios – Core Application Logic
   main.js
   Focus: State & Interactions
   ------------------------------------------------- */

(() => {
    /* ---------- State ---------- */
    const state = {
        logoCollapseTimeout: null,
        logoExpandTimeout: null
    };

    /* ---------- DBS Logo Expansion Delay ---------- */
    const initDBSLogoDelay = () => {
        const navLogo = document.querySelector('.nav-logo');
        if (!navLogo) return;

        navLogo.addEventListener('mouseenter', () => {
            // Clear any pending collapse timeout
            if (state.logoCollapseTimeout) {
                clearTimeout(state.logoCollapseTimeout);
                state.logoCollapseTimeout = null;
            }

            // Immediately brighten (remove dimmed)
            navLogo.classList.remove('dimmed');

            // Hold brightness for 0.5s, THEN expand
            if (state.logoExpandTimeout) {
                clearTimeout(state.logoExpandTimeout);
            }
            state.logoExpandTimeout = setTimeout(() => {
                navLogo.classList.add('open');
                state.logoExpandTimeout = null;
            }, 500 / 3); // 1 second pause at full brightness before expansion
        });

        navLogo.addEventListener('mouseleave', () => {
            // Delay collapse by 4 seconds
            state.logoCollapseTimeout = setTimeout(() => {
                // Remove open (starts contraction while still bright)
                navLogo.classList.remove('open');

                // After contraction animation completes (0.8s), then dim
                setTimeout(() => {
                    navLogo.classList.add('dimmed');
                }, 800); // Match contraction animation duration

                state.logoCollapseTimeout = null;
            }, 2000); // 2 second delay
        });
    };



    /* ---------- Content Rendering (Resume & Works) ---------- */
    const renderContent = async () => {
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

            // Store in global state for filtering
            state.works = worksData;

            // Initial Render
            renderWorksGrid(worksData);

        } catch (error) {
            console.error('Error loading content:', error);
        }
    };

    // Helper: Render Works Grid
    const renderWorksGrid = (data) => {
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
    window.filterWorks = (category) => {
        // Update Buttons
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        if (event && event.target) event.target.classList.add('active');

        // Filter Data
        if (category === 'all') {
            renderWorksGrid(state.works);
        } else {
            const filtered = state.works.filter(work => work.category === category);
            renderWorksGrid(filtered);
        }
    };

    // Initialize Content
    renderContent();

    /* ---------- Logo Intro Sequence ---------- */
    setTimeout(() => {
        const logo = document.querySelector('.nav-logo');
        if (logo) {
            logo.classList.add('open');

            // Hold for 2 seconds then close
            setTimeout(() => {
                logo.classList.remove('open');
            }, 2000);
        }
    }, 500); // Slight delay after load

    /* ---------- ARTIFICE ENGINE v2 INITIALIZATION & CURATION ---------- */
    // Initialize the Host
    const artificeHost = new window.ArtificeHost('artifice-container');

    // Curation State
    let availableFiles = [];
    let rejectedFiles = [];
    let currentFile = "";

    // UI Elements
    const filenameDisplay = document.getElementById('artifice-filename');
    const rejectCounter = document.getElementById('reject-counter');
    const btnKeep = document.getElementById('btn-keep');
    const btnKill = document.getElementById('btn-kill');
    const btnNext = document.getElementById('btn-next'); // Hidden in new UI but logic remains
    const btnExport = document.getElementById('btn-export');

    const updateReadout = (msg) => {
        if (filenameDisplay) {
            if (msg) {
                filenameDisplay.textContent = msg;
                filenameDisplay.style.color = '#00ff66';
            } else {
                // Show only the file name, not full path
                const name = currentFile.split('/').pop();
                filenameDisplay.textContent = name;
                filenameDisplay.style.color = '#666';
            }
        }
    };

    const loadRandomSketch = async () => {
        if (availableFiles.length > 0) {
            // Random Selection
            const randomIndex = Math.floor(Math.random() * availableFiles.length);
            currentFile = availableFiles[randomIndex];

            // Remove from pool immediately (Exhaustive Logic)
            availableFiles.splice(randomIndex, 1);

            console.log(`[Main] igniting: ${currentFile} (${availableFiles.length} remaining)`);
            updateReadout();

            // Load it
            await artificeHost.loadSketch(currentFile);
        } else {
            // No more files
            console.log("[Main] Curation Complete.");
            updateReadout("ALL FILES REVIEWED");
            if (btnKeep) btnKeep.disabled = true;
            if (btnKill) btnKill.disabled = true;
            artificeHost.container.innerHTML = ''; // Clear canvas
        }
    };

    // Load Index and Ignite
    const igniteArtifice = async () => {
        try {
            // --- HERO MODE: DIMENSION 6 LOCK ---
            console.log("[Main] HERO PROTOCOL ENGAGED: Dimension 6");
            const heroFile = 'assets/ARTIFICE-BANK/HERO-ARTIFICE/dimension_6_synthesized_archipelago.artifice';

            // Set single file availability
            availableFiles = [heroFile];
            currentFile = heroFile;

            updateReadout();
            await artificeHost.loadSketch(heroFile);

            /* 
            // OLD RANDOM LOGIC (Disabled for Hero Work)
            const resp = await fetch('assets/artifice_index.json');
            availableFiles = await resp.json();
            if (availableFiles && availableFiles.length > 0) {
                loadRandomSketch();
            } 
            */

        } catch (e) {
            console.error("[Main] Failed to ignite Artifice Engine:", e);
        }
    };

    /* --- Curation Actions --- */

    const triggerNext = () => {
        loadRandomSketch();
    };

    if (btnKeep) {
        btnKeep.addEventListener('click', triggerNext);
    }

    if (btnKill) {
        btnKill.addEventListener('click', () => {
            if (currentFile && !rejectedFiles.includes(currentFile)) {
                rejectedFiles.push(currentFile);
                if (rejectCounter) {
                    const span = rejectCounter.querySelector('span');
                    if (span) span.textContent = `${rejectedFiles.length} FLAGGED`;
                    rejectCounter.style.display = 'flex'; // Show the pill
                }
            }
            triggerNext();
        });
    }

    if (btnNext) { // This button is now effectively replaced by triggerNext for both Keep/Kill
        btnNext.addEventListener('click', triggerNext);
    }

    if (btnExport) {
        btnExport.addEventListener('click', () => {
            if (rejectedFiles.length === 0) {
                alert("No files flagged for deletion.");
                return;
            }
            const data = JSON.stringify(rejectedFiles, null, 2);
            navigator.clipboard.writeText(data).then(() => {
                alert(`COPIED ${rejectedFiles.length} FILES TO CLIPBOARD.\nPaste this list to the Agent for deletion.`);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }

    igniteArtifice();

    /* ---------- PARALLAX EFFECT ---------- */
    // Gives the Artifice Canvas a "slower scroll" feel relative to content
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const artificeContainer = document.getElementById('artifice-container');

        if (artificeContainer) {
            // Move container down as we scroll down, effectively slowing its upward movement
            // Rate 0.5 = Half speed
            artificeContainer.style.transform = `translate3d(0, ${scrolled * 0.5}px, 0)`;
        }
    });

    /* ---------- CONTACT BUTTON EFFECTS ---------- */
    const activateButtonEffects = () => {
        const btn = document.querySelector('.btn-contact');
        if (!btn) return;

        let glow = null;

        btn.addEventListener('mouseenter', () => {
            if (!glow) {
                glow = document.createElement('span');
                glow.className = 'contact-glow';
                btn.appendChild(glow);
            }
        });

        btn.addEventListener('mousemove', (e) => {
            if (glow) {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                requestAnimationFrame(() => {
                    glow.style.left = `${x}px`;
                    glow.style.top = `${y}px`;
                });
            }
        });

        btn.addEventListener('mouseleave', () => {
            if (glow) {
                glow.remove();
                glow = null;
            }
        });

        btn.addEventListener('click', () => {
            // Ripple Effect
            if (glow) {
                const ripple = glow.cloneNode(true);
                ripple.classList.add('rippling');
                btn.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }

            // Scroll to Contact Section
            const contactSection = document.getElementById('contact');
            if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
        });
    };

    // Initialize Button Effects
    activateButtonEffects();

    /* ---------- NAV SCROLL SPY & SMOOTH SCROLL ---------- */
    const initScrollSpy = () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px', // Active when element is in middle of viewport
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

    const initSmoothScroll = () => {
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

    /* ---------- SKILL CHIP GLOW EFFECT ---------- */
    const initChipGlow = () => {
        const chipGroups = document.querySelectorAll('.chip-group');

        chipGroups.forEach(group => {
            // Create single glow element for this chip-group
            const glow = document.createElement('div');
            glow.className = 'chip-glow';
            group.appendChild(glow);

            group.addEventListener('mousemove', (e) => {
                const rect = group.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Move the glow
                requestAnimationFrame(() => {
                    glow.style.left = `${x}px`;
                    glow.style.top = `${y}px`;
                });

                // Update CSS variables for each chip to reveal the glow
                const chips = group.querySelectorAll('.skill-chip');
                chips.forEach(chip => {
                    const chipRect = chip.getBoundingClientRect();
                    const chipX = e.clientX - chipRect.left;
                    const chipY = e.clientY - chipRect.top;

                    // Convert to percentage
                    const percentX = (chipX / chipRect.width) * 100;
                    const percentY = (chipY / chipRect.height) * 100;

                    chip.style.setProperty('--mouse-x', `${percentX}%`);
                    chip.style.setProperty('--mouse-y', `${percentY}%`);
                });
            });

            group.addEventListener('mouseleave', () => {
                glow.style.opacity = '0';
            });

            group.addEventListener('mouseenter', () => {
                glow.style.opacity = '1';
            });
        });
    };

    /* ---------- SLAB NAV SCROLL LOGIC ---------- */
    const initSlabNav = () => {
        const nav = document.getElementById('global-nav');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;

            // If scrolled down more than 50px, collapse the brand slab
            if (currentScroll > 50) {
                nav.classList.add('nav-collapsed');
            } else {
                nav.classList.remove('nav-collapsed');
            }

            lastScroll = currentScroll;
        });
    };

    // Initialize Navigation Logic
    initSlabNav();
    initScrollSpy();
    initSmoothScroll();
    initChipGlow();
    initDBSLogoDelay();

    // Force scroll to top on load
    window.addEventListener('load', () => {
        window.scrollTo(0, 0);
    });

})();
