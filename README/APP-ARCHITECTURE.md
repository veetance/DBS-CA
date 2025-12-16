# Digital Blacksmith Portfolio - Site Map & Structure

## 1. High-Level Overview
Type: Single Page Application (SPA) / One-Page Scroll
Theme: Cyber-Industrial, Dark Mode, High Contrast ("MOMA" Aesthetic)
Core Features: Custom State Store, Modular Architecture, Generative Hero FX.

## 2. Navigation Structure (Anchors)
The application flows vertically through the following sections:

1.  **Home / Hero Section** (`#hero`)
    *   **Interactive Background**: p5.js generative "Molten Lattice" (Integrated).
    *   **Branding**: "DIGITAL BLACKSMITH" (Mega Typography).
    *   **Hero FX**: Cascading Text Reveal + Dim-to-Outline Animation ("Art & Design").
    *   **Nav**: Two-Slab Morphing Navigation (Brand / Controls).

2.  **Work / Portfolio** (`#works`)
    *   **Header**: "PORTFOLIO".
    *   **Grid Layout**: Strict 3-Col Grid (Sharp Edges).
    *   **Content**: Driven by `assets/works.json`.
    *   **Sub-Points**: Role Labels in Blue Theme.

3.  **Resume** (`#resume`)
    *   **Layout**: Split view / Sticky Header.
    *   **Theme**: `job-application-card` aesthetic.
    *   **Assets**: Defined in `assets/resume.json` (Consumed by Store).

4.  **Contact** (`#contact`)
    *   **Layout**: Split Grid.
    *   **Buttons**: Glow/Ripple Interaction Model.

## 3. Technical Components Map

### UI Components
*   **Virtual Scrollbar**: Custom JS-driven scrollbar with Glow Ball tracking and Translucent Thumb.
*   **Navigation**:
    *   **Slab System**: Two independent slabs that collapse into a single bar on scroll.
    *   **Logo**: "D B S" with Star Glyph, expands on interaction.
*   **Buttons**: `.btn-contact`, `.social-button` with Mouse Glow & Ripple.

### Visual Assets
*   **Fonts**:
    *   Display: 'Zen Dots' (Techno/Industrial)
    *   Body: 'Hubot Sans' (Robotic/Clean)

## 4. File Structure (Implemented Architecture)
```text
root/
├── index.html        (Layout Shell)
├── css/
│   ├── main.css      (Import Hub)
│   ├── app-theme.css (Variables: Colors, Fonts)
│   └── modules/
│       ├── base.css
│       ├── hero.css
│       ├── nav.css
│       ├── works.css
│       ├── components.css
│       ├── scrollbar.css
│       └── utilities.css
├── js/
│   ├── main.js       (Entry Point)
│   ├── core/
│   │   └── artifice-controller.js (Init Logic)
│   ├── state/
│   │   └── store.js  (Redux-Lite Engine)
│   └── ui/
│       ├── hero-fx.js
│       ├── navigation.js
│       ├── works-grid.js
│       ├── interactions.js
│       └── virtual-scrollbar.js
└── assets/           (JSON Data & Images)
```

## 5. Design System & Theming
*   **Color Palette**:
    *   **Background**: `var(--bg-black)` / `var(--bg-deepblack)`
    *   **Text (Primary)**: `var(--text-white)` (#e0e6ff - Pop-Offwhite)
    *   **Text (Secondary)**: `var(--text-gray)` (#888888)
    *   **Brand Pop**: `var(--brand-pop)` (#667fe4 - Blue/Purple)
    *   **Glows**: Radial Gradients using Brand Pop.

## 6. Interaction Mechanics
### Hero Text ("Art & Design")
*   **Cascade**: Individual characters reveal (`0.8s` duration) with stagger.
*   **Phase Shift**: After `1.2s`, characters transition to **0.05px Outline** (Solid fill fades to transparent).

### Navigation
*   **Auto-Collapse**: Triggers at `4.2s` (Aligned with Hero sequence).
*   **Scroll Logic**: Collapses on scroll > 50px.

### Virtual Scrollbar
*   **State**: Fixed `8px` width.
*   **Thumb**: `50%` Translucent Blue. No Border.
*   **Hover**: Blue Border (`2px`).
*   **Active**: Solid Brand-Pop (`#667fe4`) fill.
*   **Glow**: Track Glow follows mouse Y-position.
