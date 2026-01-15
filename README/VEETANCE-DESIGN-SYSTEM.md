# Veetance Design System 🎨
## "Forging the Future Aesthetic"

A modular UI component library featuring advanced interaction patterns and physical protocols.

---

## 📦 Component Library (JS Modules)

The system is now fully modularized under `js/ui/`:

### 1. Slab Navigation (`navigation.js`)
- **Interaction**: Slab 1 (Brand) and Slab 2 (Controls).
- **Physics**: Auto-collapses to a single bar on scroll. Logo uses a "Delayed Dim" logic (2s persistence) to maintain focus.

### 2. Works Grid (`works-grid.js`)
- **Mechanism**: State-driven pagination.
- **Physics**: **Directional Inertia** (items slide LTR or RTL based on page direction).
- **Sensors**: Proximity-based reveal for navigation paddles.

### 3. Interactive Profile Component v4.5 (`profile-3d.js`)
- **Core**: Three.js WebGL Engine.
- **Capabilities**: Real-time property modification, environment mapping, and transform rig (W/E/R keys).
- **Model**: "Sentinel Unit" with shader-based eye pulsing.

### 4. Modal Viewport (`modal.js`)
- **UI**: High-contrast overlay for project details.
- **Interactions**: Paddle navigation between work items within the modal context.

### 5. Kinetic Carousel (`tools-carousel.js`)
- **Behavior**: Perpetual auto-drift.
- **Physics**: "Drag and Yeet" velocity calculation with Kinetic Hover tracking.

---

## 🎯 Visual Components (CSS Modules)

### 1. Mouse-Following Glow (`interactions.js`)
- **Usage**: `.glow-container` and `.glow-item`.
- **Implementation**: Radial gradient that tracks mouse position, revealed only by child elements (`mix-blend-mode: color-dodge` equivalent logic).

### 2. Skill Chips
- **Aesthetic**: Translucent pill-shaped tags.
- **Reveal**: Individual chips use `--mouse-x/y` variables to generate localized "Spotlight" highlights.

### 3. Scanner Scrollbar (`virtual-scrollbar.js`)
- **Track**: Fixed ultra-thin guide.
- **Thumb**: 50% opacity Brand-Pop.
- **Glow Ball**: A light source that tracks the mouse Y-position to illuminate the scroll progress.

---

## 🎨 Global Tokens (`app-theme.css`)
```css
:root {
    --bg-black: #050508;
    --brand-pop: #667fe4;      /* Deep Neon Blue */
    --text-white: #e0e6ff;     /* Luminous Frost */
    --text-gray: #888888;
    
    --font-display: 'Zen Dots', sans-serif;
    --font-body: 'Hubot Sans', sans-serif;
}
```

*Built in the realm of Deus* 🦾
