/**
 * Virtual Scrollbar Logic
 * Replaces default browser scrollbar with a custom overlay
 */
export const initVirtualScrollbar = () => {
    const scrollbar = document.getElementById('virtual-scrollbar');
    if (!scrollbar) return;

    const thumb = scrollbar.querySelector('.scrollbar-thumb');
    const glowBall = scrollbar.querySelector('.scrollbar-glow-ball');

    if (!thumb) return;

    let isDragging = false;
    let startY, startScrollTop;

    // 1. Update Thumb Height & Position
    const updateScrollbar = () => {
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        // recalculate track height dynamically because potential footer collision changes it
        // We need to know the footer element
        const footer = document.getElementById('contact-footer');
        let footerVisibleHeight = 0;

        if (footer) {
            const footerRect = footer.getBoundingClientRect();
            if (footerRect.top < winHeight) {
                // Footer is entering the viewport
                // The visible amount is Window Height - Footer Top
                footerVisibleHeight = Math.max(0, winHeight - footerRect.top);
            }
        }

        // Adjust scrollbar container height or bottom
        // Logic: The scrollbar is fixed. We can set its 'bottom' style.
        // Default bottom gap is say 8px or var(--scrollbar-gap).
        // New bottom = gap + footerVisibleHeight
        const gap = 8; // hardcoded gap match css var roughly

        // Check breakpoint for correct nav height variable
        const isDesktop = winHeight > 0 && window.innerWidth >= 1028;
        const navVar = isDesktop ? 'var(--nav-height-desktop)' : 'var(--nav-height-mobile)';

        scrollbar.style.height = `calc(100vh - (${navVar} + var(--scrollbar-gap) + ${Math.ceil(footerVisibleHeight + gap)}px))`;

        // Refined Logic (CSS handling top, JS handling height collision)
        // HEIGHT = 100vh - TOP - BOTTOM_OFFSET
        // We need to inject the footer offset into the height calculation.

        // Let's use setProperty for cleaner CSS integration if possible, 
        // but modifying style.height directly is robust here.

        const trackHeight = scrollbar.clientHeight; // Actual height of the track after resize
        const scrollTop = window.scrollY;

        // Calculate Thumb Height
        // Ratio of visible window to total content, scaled to track height
        const thumbHeight = Math.max((winHeight / docHeight) * trackHeight, 50);
        thumb.style.height = `${thumbHeight}px`;

        // VISIBILITY LOGIC: Show when scrolled down
        if (scrollTop > 10) {
            scrollbar.classList.add('scrolling');
        } else {
            scrollbar.classList.remove('scrolling');
        }

        // Calculate Position
        // Max scrollable area for window: docHeight - winHeight
        // Max scrollable area for thumb: trackHeight - thumbHeight
        const scrollRange = docHeight - winHeight;
        if (scrollRange <= 0) return; // Prevent divide by zero if content fits screen

        const scrollRatio = scrollTop / scrollRange;
        const thumbTop = scrollRatio * (trackHeight - thumbHeight);

        thumb.style.transform = `translateY(${thumbTop}px)`;
    };

    // 2. Drag Logic
    thumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        startY = e.clientY;
        startScrollTop = window.scrollY;
        document.body.style.userSelect = 'none'; // Prevent text selection
        // thumb.style.background handled by CSS :active
        e.stopPropagation(); // Prevent bubbling to track click
    });

    // 3. Track Click Logic (Jump to position)
    scrollbar.addEventListener('mousedown', (e) => {
        // If we clicked the thumb, do nothing (handled above via stopPropagation)
        if (e.target === thumb) return;

        const rect = scrollbar.getBoundingClientRect();
        const clickY = e.clientY - rect.top;
        const trackHeight = scrollbar.clientHeight;
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;

        // Ratio of click position in track
        const ratio = clickY / trackHeight;

        // Calculate target scroll position
        const targetScroll = ratio * (docHeight - winHeight);

        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
    });

    // 4. Global Drag Tracking (Must remain on document)
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            const deltaY = e.clientY - startY;
            const docHeight = document.documentElement.scrollHeight;
            const winHeight = window.innerHeight;
            const trackHeight = scrollbar.clientHeight;

            const thumbHeight = parseFloat(thumb.style.height) || 50;

            // Convert pixel movement of thumb to pixel movement of scroll
            // Ratio: (docHeight - winHeight) / (trackHeight - thumbHeight)
            const scrollableRatio = (docHeight - winHeight) / (trackHeight - thumbHeight);

            window.scrollTo(0, startScrollTop + (deltaY * scrollableRatio));
        }
    });

    // 5. Optimized Glow Tracking (Scoped to Scrollbar)
    // Only fires when mouse is actually over the scrollbar area
    scrollbar.addEventListener('mousemove', (e) => {
        if (glowBall) {
            const rect = scrollbar.getBoundingClientRect();
            const y = e.clientY - rect.top; // Relative Y to container

            requestAnimationFrame(() => {
                glowBall.style.top = `${y}px`;
            });
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = '';
        thumb.style.background = ''; // Revert to CSS hover/default
    });

    // Loop Update
    window.addEventListener('scroll', updateScrollbar);
    window.addEventListener('resize', updateScrollbar);

    // Initial Call
    updateScrollbar();
};
