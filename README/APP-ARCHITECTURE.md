# Digital Blacksmith Portfolio - Site Map & Structure

## 1. High-Level Overview
Type: Single Page Application (SPA) / One-Page Scroll
Theme: Cyber-Industrial, Dark Mode, High Contrast ("MOMA" Aesthetic)
Core Features: Custom State Store, Modular Architecture, Generative Hero FX, Interactive Profile Rig.

## 2. Navigation Structure (Anchors)
The application flows vertically through the following sections:

1.  **Home / Hero Section** (`#hero`)
    *   **Interactive Background**: p5.js generative "Dimension 6" (Themed).
    *   **Branding**: "DIGITAL BLACKSMITH STUDIOS" (Mega Typography).
    *   **Hero FX**: Cascading Blur Reveal + Slab Morphing Navigation.

2.  **Work / Portfolio** (`#works`)
    *   **Status Strip**: "FOLIO" + Paginated Indicator.
    *   **Grid Layout**: State-driven 3-Col Grid (Sharp Edges).
    *   **Paddles**: Lateral Proximity Sensors with Center-Lock synchronization.
    *   **Modal**: "Work Detail Viewport" for deep dives.

3.  **Tools** (`#tools`)
    *   **Kinetic Carousel**: Infinite "Drag and Yeet" marquee with Kinetic Hover Tracking.

4.  **About / Identity** (`#about`)
    *   **Bento Grid**: Modular layout for ID card and Resume content.
    *   **Interactive Profile Component**: Integrated Three.js viewport (Helmet model) with manual visual rig.
    *   **Resume Hubs**: Education and Experience data injected via Store.

5.  **Contact** (`#contact-footer`)
    *   **Layout**: Split Grid with Floating Glow Buttons.

## 3. Technical Components Map

### UI Core
*   **Virtual Scrollbar**: JS-driven overlay with mouse-tracking glow ball.
*   **Slab Navigation**: Two-slab system (Brand/Controls) that auto-collapses and dims logo on scroll.
*   **Modal System**: State-driven viewport for work items with paddle navigation.
*   **Interactive Profile Rig (v4.5)**: Three.js rig with real-time property editing (Metalness, Roughness, Lights).

### Logical Hubs
*   **Artifice Engine v2**: Host-Sandbox system with Synthetic Cortex logic.
*   **Audit Console**: Curation widget for flagging/keeping generative sketches.

## 4. File Structure (Implemented Architecture)
```text
root/
├── index.html        (Layout Shell)
├── css/
│   ├── main.css      (Import Hub)
│   ├── app-theme.css (Variables: Colors, Fonts)
│   └── modules/
│       ├── modal.css, nav.css, works.css, etc.
├── js/
│   ├── main.js       (Entry Point)
│   ├── artifice.js   (Engine Core)
│   ├── core/
│   │   ├── artifice-controller.js (Host logic)
│   │   └── effects.js (Data Fetchers)
│   ├── state/
│   │   ├── store.js (VSE Core)
│   │   └── selectors.js (Memoized Views)
│   └── ui/
│       ├── hero-fx.js, navigation.js, works-grid.js,
│       ├── modal.js, tools-carousel.js, profile-3d.js,
│       └── interactions.js
└── assets/           (JSON Data & GLB Models)
```

## 5. Design System & Theming
*   **Color Palette**:
    *   **Background**: `#050508` (Deep Void)
    *   **Brand Pop**: `#667fe4` (Neon Blue-Purple)
    *   **Text Primary**: `#e0e6ff` (Luminous Frost)

## 6. Interaction Mechanics
### Directional Inertia
*   Pagination in the Works Grid applies `--inertia-x` transforms based on the scroll direction (`next` vs `prev`).

### Proximity Sensors
*   Floating lateral zones that detect hover to reveal navigation paddles before the mouse reaches the button edge.

### Kinetic Hover
*   The Tools Carousel calculates elements passing under a stationary cursor to maintain active hover states during auto-drift.

### Slab Auto-Collapse
*   Triggers at `scrollY > 50`, collapsing two nav slabs into a single bar and dimming the logo opacity to reduce visual noise.


*Verified by DEUS* 🦾
