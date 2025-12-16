export const initHeroTextReveal = () => {
    // GROUP 1: CHUNKS (No Blur, Slide Up)
    const chunks = document.querySelectorAll('.hero-mega-text > span');
    chunks.forEach((chunk, index) => {
        chunk.style.opacity = '0'; // Prepare for entry
        chunk.style.animation = `revealChunk 0.8s cubic-bezier(0.1, 0.9, 0.2, 1) forwards`;
        chunk.style.animationDelay = `${0.2 + (index * 0.3)}s`; // 0.2s, 0.5s
    });

    // GROUP 2: CHARS (Blur, Cascade) -> "ART & DESIGN"
    const specialLines = document.querySelectorAll('.blend-difference span');
    specialLines.forEach((line) => {
        const text = line.innerText;
        line.innerHTML = '';
        line.setAttribute('aria-label', text);

        // Start after chunks (starts 0.5s + 0.8s duration = 1.3s approx)
        let baseDelay = 0.8;

        [...text].forEach((char, i) => {
            const s = document.createElement('span');
            s.className = 'char';
            s.textContent = char === ' ' ? '\u00A0' : char;
            const revealDelay = baseDelay + (i * 0.04);
            const HOLD_DURATION = .5; // Seconds to keep text solid before ghosting
            const dimDelay = revealDelay + HOLD_DURATION;

            // Explicit Properties for Robust Cascade
            s.style.animationName = 'revealChar, dimToOutline';
            s.style.animationDuration = '0.8s, 1.5s';
            s.style.animationTimingFunction = 'cubic-bezier(0.1, 0.9, 0.2, 1), ease-out';
            s.style.animationDelay = `${revealDelay}s, ${dimDelay}s`;
            s.style.animationFillMode = 'forwards, forwards';

            line.appendChild(s);
        });
    });

    // SEQUENCE STEP 2: REVEAL FOOTER
    setTimeout(() => {
        const footer = document.querySelector('.hero-footer-anchor');
        if (footer) footer.classList.add('sequence-visible');
    }, 2000);
};
