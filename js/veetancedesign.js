/* 
   ============================================
   VEETANCE DESIGN SYSTEM - JavaScript Library
   Premium UI Interaction Patterns
   Author: Divine Okonkwo (Veetance Design)
   ============================================
   
   Companion JavaScript for veetancedesign-style.css
   
   TABLE OF CONTENTS:
   1. Mouse-Following Glow Effect
   2. Smooth Scroll & Navigation
   3. Scroll Spy (Active Section Detection)
*/

const VeetanceDesign = {

    /**
     * ============================================
     * 1. MOUSE-FOLLOWING GLOW EFFECT
     * ============================================
     * 
     * Creates an interactive glow that follows the mouse cursor
     * across a container, revealed only through child elements.
     * 
     * @param {string} containerSelector - CSS selector for glow containers
     * @param {string} itemSelector - CSS selector for items that reveal glow
     * @param {Object} options - Configuration options
     * 
     * USAGE:
     * VeetanceDesign.initGlowEffect('.chip-group', '.skill-chip', {
     *     glowSize: 200,
     *     glowColor: 'rgba(173, 139, 255, 0.4)'
     * });
     * 
     * HTML STRUCTURE:
     * <div class="chip-group glow-container">
     *     <span class="skill-chip glow-item">Item</span>
     * </div>
     */
    initGlowEffect(containerSelector, itemSelector, options = {}) {
        const defaults = {
            glowSize: 200,
            glowColor: 'rgba(173, 139, 255, 0.4)',
            glowRadius: 100,
            fadeTransition: 0.3,
            glowClassName: 'chip-glow'
        };

        const config = { ...defaults, ...options };
        const containers = document.querySelectorAll(containerSelector);

        containers.forEach(container => {
            // Create single glow element for this container
            const glow = document.createElement('div');
            glow.className = config.glowClassName;
            container.appendChild(glow);

            // Track mouse movement across container
            container.addEventListener('mousemove', (e) => {
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Move the glow element
                requestAnimationFrame(() => {
                    glow.style.left = `${x}px`;
                    glow.style.top = `${y}px`;
                });

                // Update CSS variables for each item to reveal the glow
                const items = container.querySelectorAll(itemSelector);
                items.forEach(item => {
                    const itemRect = item.getBoundingClientRect();
                    const itemX = e.clientX - itemRect.left;
                    const itemY = e.clientY - itemRect.top;

                    // Convert to percentage for CSS
                    const percentX = (itemX / itemRect.width) * 100;
                    const percentY = (itemY / itemRect.height) * 100;

                    item.style.setProperty('--mouse-x', `${percentX}%`);
                    item.style.setProperty('--mouse-y', `${percentY}%`);
                });
            });

            // Show glow on enter
            container.addEventListener('mouseenter', () => {
                glow.style.opacity = '1';
            });

            // Hide glow on leave
            container.addEventListener('mouseleave', () => {
                glow.style.opacity = '0';
            });
        });

        console.log(`[Veetance] Initialized glow effect on ${containers.length} container(s)`);
    },


    /**
     * ============================================
     * 2. SMOOTH SCROLL & NAVIGATION
     * ============================================
     * 
     * Enables smooth scrolling for anchor links.
     * 
     * @param {string} linkSelector - CSS selector for navigation links
     * 
     * USAGE:
     * VeetanceDesign.initSmoothScroll('a[href^="#"]');
     */
    initSmoothScroll(linkSelector = 'a[href^="#"]') {
        document.querySelectorAll(linkSelector).forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        console.log('[Veetance] Initialized smooth scroll');
    },


    /**
     * ============================================
     * 3. SCROLL SPY (Active Section Detection)
     * ============================================
     * 
     * Highlights navigation links based on visible section.
     * Uses Intersection Observer for performance.
     * 
     * @param {string} sectionSelector - CSS selector for sections
     * @param {string} navLinkSelector - CSS selector for nav links
     * @param {Object} options - Configuration options
     * 
     * USAGE:
     * VeetanceDesign.initScrollSpy('section', '.nav-link', {
     *     rootMargin: '-50% 0px -50% 0px'
     * });
     */
    initScrollSpy(sectionSelector = 'section', navLinkSelector = '.nav-link', options = {}) {
        const defaults = {
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0,
            activeClass: 'active'
        };

        const config = { ...defaults, ...options };
        const sections = document.querySelectorAll(sectionSelector);
        const navLinks = document.querySelectorAll(navLinkSelector);

        const observerOptions = {
            root: null,
            rootMargin: config.rootMargin,
            threshold: config.threshold
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Remove active from all links
                    navLinks.forEach(link => link.classList.remove(config.activeClass));

                    // Add active to target link
                    const id = entry.target.id;
                    const activeLink = document.querySelector(`${navLinkSelector}[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add(config.activeClass);
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));

        console.log(`[Veetance] Initialized scroll spy on ${sections.length} section(s)`);
    },


    /**
     * ============================================
     * UTILITY: Initialize All Effects
     * ============================================
     * 
     * Convenience method to initialize all Veetance Design effects.
     * 
     * @param {Object} config - Configuration for all effects
     * 
     * USAGE:
     * VeetanceDesign.initAll({
     *     glow: { containerSelector: '.chip-group', itemSelector: '.skill-chip' },
     *     smoothScroll: true,
     *     scrollSpy: { sectionSelector: 'section', navLinkSelector: '.nav-link' }
     * });
     */
    initAll(config = {}) {
        console.log('[Veetance] Initializing all effects...');

        if (config.glow) {
            this.initGlowEffect(
                config.glow.containerSelector || '.glow-container',
                config.glow.itemSelector || '.glow-item',
                config.glow.options
            );
        }

        if (config.smoothScroll) {
            const selector = typeof config.smoothScroll === 'string'
                ? config.smoothScroll
                : 'a[href^="#"]';
            this.initSmoothScroll(selector);
        }

        if (config.scrollSpy) {
            this.initScrollSpy(
                config.scrollSpy.sectionSelector,
                config.scrollSpy.navLinkSelector,
                config.scrollSpy.options
            );
        }

        console.log('[Veetance] All effects initialized!');
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VeetanceDesign;
}

// Make globally available
window.VeetanceDesign = VeetanceDesign;


/* ============================================
   QUICK START GUIDE
   ============================================
   
   1. Include veetancedesign-style.css in your HTML:
      <link rel="stylesheet" href="veetancedesign-style.css">
   
   2. Include this JavaScript file:
      <script src="veetancedesign.js"></script>
   
   3. Initialize effects when DOM is ready:
      
      document.addEventListener('DOMContentLoaded', () => {
          VeetanceDesign.initAll({
              glow: { 
                  containerSelector: '.chip-group', 
                  itemSelector: '.skill-chip' 
              },
              smoothScroll: true,
              scrollSpy: { 
                  sectionSelector: 'section', 
                  navLinkSelector: '.nav-link' 
              }
          });
      });
   
   OR initialize individually:
   
      VeetanceDesign.initGlowEffect('.chip-group', '.skill-chip');
      VeetanceDesign.initSmoothScroll();
      VeetanceDesign.initScrollSpy();
   
   ============================================
   Built with ❤️ by Veetance Design
   https://veetancedesign.com
   ============================================
*/
