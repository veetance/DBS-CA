/* ---------- CONTACT BUTTON EFFECTS ---------- */
export const activateButtonEffects = () => {
    // Target Contact, Social, AND Navigation Paddles
    const btns = document.querySelectorAll('.btn-contact, .social-button, .deck-control');

    btns.forEach(btn => {
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

        btn.addEventListener('click', (e) => {
            // Ripple Effect
            if (glow) {
                const ripple = glow.cloneNode(true);
                ripple.className = 'contact-glow rippling'; // Ensure classes match
                btn.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }

            // Scroll to Contact Section (Only for main button if needed, or check href)
            // If it's the main contact button, scroll. If it's social (<a> tag), let it bubble/default.
            if (btn.classList.contains('btn-contact')) {
                // UPDATE: Target ID changed to contact-footer
                const contactSection = document.getElementById('contact-footer');
                if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
};

/* ---------- SKILL CHIP GLOW EFFECT ---------- */
export const initChipGlow = () => {
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

export const initScrollRevealSystem = () => {
    // 1. Auto-Detect Targets for Standard Reveal (Slide Up)
    const standardTargets = document.querySelectorAll(
        '.section-title, .subsection-title, .prof-header, .job-label, .resume-section-header'
    );

    standardTargets.forEach(el => {
        el.classList.add('reveal-standard');
    });

    // 2. Observer Logic
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // One-shot trigger
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '0px 0px -50px 0px' // Offset slightly so it triggers when requested
    });

    // 3. Observe All
    document.querySelectorAll('.reveal-standard').forEach(el => observer.observe(el));
};

export const initParallax = () => {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const artificeContainer = document.getElementById('artifice-container');

        if (artificeContainer) {
            // Move container down as we scroll down, effectively slowing its upward movement
            // Rate 0.5 = Half speed
            artificeContainer.style.transform = `translate3d(0, ${scrolled * 0.5}px, 0)`;
        }
    });
};
