/* -------------------------------------------------
   Digital Blacksmith Studios – Core Application Logic
   main.js
   Focus: State, Edit Mode, Interactions
   ------------------------------------------------- */

(() => {
    /* ---------- State ---------- */
    const state = {
        editMode: false,
        activeEditable: null,
    };

    /* ---------- Edit Logic (Minimalist) ---------- */
    // Trigger is now the small SVG icon in top right
    const editToggleBtn = document.getElementById('edit-toggle');

    const toggleEditMode = () => {
        state.editMode = !state.editMode;
        document.body.classList.toggle('edit-mode', state.editMode);

        // Visual feedback
        if (state.editMode) {
            editToggleBtn.style.opacity = '1';
            editToggleBtn.style.color = '#fff';
        } else {
            editToggleBtn.style.opacity = '0.3';
            editToggleBtn.style.color = 'inherit';
        }
    };

    if (editToggleBtn) {
        editToggleBtn.addEventListener('click', toggleEditMode);
    }

    // Media Swapper
    document.addEventListener('click', (e) => {
        if (!state.editMode) return;

        const target = e.target.closest('.editable');
        if (!target) return;

        // Don't trigger if user is just selecting text
        if (['H1', 'H2', 'P'].includes(e.target.tagName)) return;

        e.preventDefault();
        e.stopPropagation(); // Stop the link from opening

        state.activeEditable = target;

        // File Handler
        let fileInput = document.getElementById('__dbs-file-input');
        if (!fileInput) {
            fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*,video/*';
            fileInput.id = '__dbs-file-input';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);

            fileInput.addEventListener('change', (ev) => {
                const file = ev.target.files[0];
                if (!file) return;
                const url = URL.createObjectURL(file);

                const img = state.activeEditable.querySelector('img');
                const vid = state.activeEditable.querySelector('video');

                // Swap logic
                if (file.type.startsWith('video')) {
                    // If existing video, swap src
                    if (vid) {
                        vid.src = url;
                    } else {
                        // Remove image, inject video
                        state.activeEditable.querySelector('img')?.remove();
                        const newVid = document.createElement('video');
                        newVid.src = url;
                        newVid.classList.add('work-media'); // Keep CSS class
                        newVid.autoplay = true;
                        newVid.loop = true;
                        newVid.muted = true;
                        newVid.playsInline = true;
                        state.activeEditable.prepend(newVid);
                    }
                } else {
                    if (img) {
                        img.src = url;
                    } else {
                        // Remove video, inject image
                        state.activeEditable.querySelector('video')?.remove();
                        const newImg = document.createElement('img');
                        newImg.src = url;
                        newImg.classList.add('work-media');
                        state.activeEditable.prepend(newImg);
                    }
                }
                fileInput.value = '';
            });
        }
        fileInput.click();
    });

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
            <article class="work-item editable" data-id="${work.id}" onclick="window.open('${work.link}', '_blank')">
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

    // Force scroll to top on load
    window.addEventListener('load', () => {
        window.scrollTo(0, 0);
    });

})();
