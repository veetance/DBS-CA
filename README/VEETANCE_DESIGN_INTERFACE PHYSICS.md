# VEETANCE DESIGN SYSTEM - INTERFACE PHYSICS

## 1. TYPOGRAPHY PHYSICS (REVEAL PROTOCOLS)
The system employs two distinct kinetic behaviors for text materialization, enforcing a hierarchy of "Information" vs. "Art".

### Variation A: The Standard Chunk (Kinetic Slide)
Used for structural headers, preambles, and navigational elements.
- **Physics:** Block-level reveal.
- **Motion:** Vertical Slide (`translateY: 30px` -> `0px`).
- **Opacity:** Linear fade (`0` -> `1`).
- **Filter:** None (Crisp edge).
- **Target:** "FORGING THE", "DIGITAL FUTURE OF", "PORTFOLIO", Section Headers.
- **Class:** `.reveal-standard` (CSS Animation: `revealChunk`).

### Variation B: The Quantum Flux (Character Cascade)
Reserved for high-value subjects and emotive statements.
- **Physics:** Character-level split.
- **Motion:** Staggered entry (`30ms` delay per char).
- **Opacity:** Compound fade.
- **Filter:** Blur Transition (`blur(12px)` -> `clear`).
- **Target:** "ART & DESIGN", Special Emphasis Text.
- **Class:** `.reveal-fx-blur` (CSS Animation: `revealChar`).

---

## 2. NAVIGATIONAL PHYSICS (GHOST SCROLLBAR)
To mitigate visual noise, the browser's default scrollbar is suppressed.

### Behavior Profile
- **State:** `fixed`, right-aligned (`8px` inset).
- **Visibility:** 
  - **Rest:** `opacity: 0` (Invisible).
  - **Active:** `opacity: 1` (Fades in when `window.scrollY > 10`).
- **Responsive Geometry:**
  - **Desktop:** Starts at `80px` from top.
  - **Mobile:** Starts at `130px` from top (clears stacked nav).
- **Interaction:**
  - **Thumb:** Draggable (Standard).
  - **Track:** Click-to-Jump (Teleportation).

---

## 3. COLOR SYSTEM (THE VEETANCE SPECTRUM)
- **Brand Pop:** `#667fe4` (Neon Blue-Purple).
- **Background:** `#050508` (Deep Empty Void).
- **Text Primary:** `#e0e6ff` (Luminous Frost).
- **Text Secondary:** `#b4bce0` (Steel Lavender).

---

## 4. HERO SEQUENCE TIMELINE (ACCELERATED)
The load sequence is compressed for rapid engagement.
- **T=0.0s:** Void State.
- **T=0.2s:** **Chunk 1**: "FORGING THE" (Slide Up).
- **T=0.5s:** **Chunk 2**: "DIGITAL FUTURE OF" (Slide Up).
- **T=1.0s:** **Flux**: "ART & DESIGN" (Blur Cascade).
- **T=1.8s:** **Footer**: Taglines & Arrow (Fade In, 0.8s duration).
- **T=3.0s:** **Brand**: DBS Logo Expansion.

---

## 5. GRID PHYSICS (THE RADIANT REVEAL)
The portfolio grid follows a "Crystallization" pattern, moving from latent state to high-definition visibility.

### Behavior Profile
- **Stagger Pattern:** Geometric Ripple (Radial).
- **Origin Point:** Center Item (Index 1 of row).
- **Delay Logic:** `Math.abs(index - center) * 0.15s`.
- **Motion:** 
  - **Start:** `translateY(30px)`, `scale(0.97)`, `rotateX(2deg)`, `blur(4px)`.
  - **End:** `translateY(0)`, `scale(1)`, `rotateX(0)`, `blur(0)`.
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (Quart Out).
- **Optimization (Mobile):** 
  - Blur removed.
  - Transform simplified to `translateY(20px)`.
  - Layer promotion via `will-change`.

---

## 6. PADDLE PHYSICS (CENTER-LOCK PROTOCOL)
To ensure navigational controls remain ergonomically accessible and visually balanced, the system employs a "Center-Lock" alignment protocol for side paddles.

### The Geometric Alignment Fault (Legacy)
Previously, paddles were calculated using viewport-relative coordinates (`getBoundingClientRect`). This caused "positional drift" during the **Radiant Reveal** animation, as the paddles would anchor to the card's temporary position while it was still sliding into the viewport.

### The Fix: Static Layout Synchronization
-   **Mechanism**: Switch from viewport-relative to layout-relative coordinates.
-   **Calculation**: `top = offsetTop + (offsetHeight / 2)`.
-   **Benefit**: This locks the paddle to the card's final resting place from T=0, ignoring all active transforms, blurs, or inertia-based kinetics.
-   **CSS Baseline**: Paddles are initialized at `top: 50%` with a `translateY(-50%)` corrective transform to guarantee mathematical centering on any container size.

### Interaction Profile
-   **Trigger**: Proximity Sensors on the lateral edges of the media viewport.
-   **Feedback**: Radial glow materialize + scale transition (`1.05x`).
-   **Constraint**: Paddles must follow the geometric center of the **active row**, adapting dynamically to viewport resizing.
