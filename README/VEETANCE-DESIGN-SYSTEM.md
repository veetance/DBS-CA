# Veetance Design System 🎨

A premium, futuristic UI component library featuring advanced interaction patterns and visual effects.

**Version:** 1.0  
**Author:** Divine Okonkwo (Veetance Design)  
**License:** MIT

---

## 📦 What's Included

```
veetance-design-system/
├── css/
│   └── veetancedesign-style.css    # Component styles
├── js/
│   └── veetancedesign.js           # Interaction logic
└── README.md                       # This file
```

---

## 🚀 Quick Start

### 1. Installation

Include the CSS and JavaScript files in your HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Your CSS variables/theme -->
    <link rel="stylesheet" href="your-theme.css">
    
    <!-- Veetance Design System -->
    <link rel="stylesheet" href="css/veetancedesign-style.css">
</head>
<body>
    <!-- Your content -->
    
    <!-- Veetance Design System JS -->
    <script src="js/veetancedesign.js"></script>
    <script>
        // Initialize all effects
        document.addEventListener('DOMContentLoaded', () => {
            VeetanceDesign.initAll({
                glow: { 
                    containerSelector: '.chip-group', 
                    itemSelector: '.skill-chip' 
                },
                smoothScroll: true,
                scrollSpy: true
            });
        });
    </script>
</body>
</html>
```

### 2. Required CSS Variables

Define these variables in your theme CSS:

```css
:root {
    /* Colors */
    --bg-black: #0a0a0a;
    --text-white: #ffffff;
    --text-gray: #888888;
    --brand-pop: #ad8bff;          /* Main accent */
    --brand-pop50: #ae8bff79;      /* 50% transparent */
    --brand-pop60: #7b63b452;      /* 60% transparent */
    
    /* Typography */
    --font-body: 'Inter', sans-serif;
    --font-display: 'Space Grotesk', sans-serif;
}
```

---

## 🎯 Components

### 1. Mouse-Following Glow Effect

Creates a unified glow that follows the mouse cursor, revealed only through child elements.

#### Usage:

```html
<div class="chip-group glow-container">
    <span class="skill-chip glow-item">JavaScript</span>
    <span class="skill-chip glow-item">React</span>
    <span class="skill-chip glow-item">CSS</span>
</div>

<script>
    VeetanceDesign.initGlowEffect('.chip-group', '.skill-chip');
</script>
```

#### Customization:

```javascript
VeetanceDesign.initGlowEffect('.my-container', '.my-item', {
    glowSize: 250,
    glowColor: 'rgba(255, 100, 200, 0.5)',
    glowRadius: 120
});
```

---

### 2. Skill Chips (Interactive Tags)

Pill-shaped chips with hover effects and mouse-following glow.

#### Usage:

```html
<div class="chip-group glow-container">
    <span class="skill-chip glow-item">Adobe Photoshop</span>
    <span class="skill-chip glow-item">Figma</span>
    <span class="skill-chip glow-item">Blender</span>
</div>
```

#### Variants:

```html
<!-- Small chips -->
<span class="skill-chip skill-chip-sm glow-item">Small</span>

<!-- Large chips -->
<span class="skill-chip skill-chip-lg glow-item">Large</span>

<!-- Solid background -->
<span class="skill-chip skill-chip-solid glow-item">Solid</span>
```

---

### 3. Navigation Components

Modern navigation with smooth transitions and active state indicators.

#### Usage:

```html
<ul class="nav-links">
    <li><a href="#home" class="nav-link active">HOME</a></li>
    <li><a href="#work" class="nav-link">WORK</a></li>
    <li><a href="#contact" class="nav-link">CONTACT</a></li>
</ul>

<script>
    // Enable smooth scroll
    VeetanceDesign.initSmoothScroll();
    
    // Enable scroll spy (auto-highlight active section)
    VeetanceDesign.initScrollSpy('section', '.nav-link');
</script>
```

---

### 4. Tool Cards (Marquee Display)

Square cards for displaying tools/technologies in an infinite scrolling marquee.

#### Usage:

```html
<div class="tools-marquee-container">
    <div class="tools-track">
        <!-- Original Set -->
        <div class="tool-card">
            <div class="tool-icon">🎨</div>
            <span>Figma</span>
        </div>
        <div class="tool-card">
            <div class="tool-icon">✨</div>
            <span>Photoshop</span>
        </div>
        
        <!-- Duplicate Set for Loop -->
        <div class="tool-card">
            <div class="tool-icon">🎨</div>
            <span>Figma</span>
        </div>
        <div class="tool-card">
            <div class="tool-icon">✨</div>
            <span>Photoshop</span>
        </div>
    </div>
</div>
```

**Note:** Duplicate your cards for seamless infinite loop.

---

### 5. Utility Classes

#### Glass Morphism

```html
<div class="glass">
    Glass effect with blur
</div>
```

#### Premium Button

```html
<button class="btn-premium">
    Contact Me
</button>
```

#### Section Divider

```html
<div class="section-divider"></div>
```

#### Text Glow

```html
<h1 class="text-glow-purple">Glowing Text</h1>
```

---

## ⚙️ JavaScript API

### VeetanceDesign.initGlowEffect()

```javascript
VeetanceDesign.initGlowEffect(containerSelector, itemSelector, options);
```

**Parameters:**
- `containerSelector` (string): CSS selector for glow containers
- `itemSelector` (string): CSS selector for items that reveal glow
- `options` (object): Configuration options

**Options:**
```javascript
{
    glowSize: 200,           // Glow diameter in pixels
    glowColor: 'rgba(...)',  // Glow color
    glowRadius: 100,         // Glow reveal radius
    fadeTransition: 0.3,     // Fade transition duration
    glowClassName: 'chip-glow' // Glow element class name
}
```

---

### VeetanceDesign.initSmoothScroll()

```javascript
VeetanceDesign.initSmoothScroll(linkSelector);
```

**Parameters:**
- `linkSelector` (string): CSS selector for anchor links (default: `'a[href^="#"]'`)

---

### VeetanceDesign.initScrollSpy()

```javascript
VeetanceDesign.initScrollSpy(sectionSelector, navLinkSelector, options);
```

**Parameters:**
- `sectionSelector` (string): CSS selector for sections
- `navLinkSelector` (string): CSS selector for nav links
- `options` (object): Configuration options

**Options:**
```javascript
{
    rootMargin: '-50% 0px -50% 0px', // Intersection observer margin
    threshold: 0,                     // Intersection threshold
    activeClass: 'active'             // Class added to active link
}
```

---

### VeetanceDesign.initAll()

Initialize all effects at once:

```javascript
VeetanceDesign.initAll({
    glow: { 
        containerSelector: '.chip-group', 
        itemSelector: '.skill-chip',
        options: { glowSize: 250 }
    },
    smoothScroll: true,
    scrollSpy: { 
        sectionSelector: 'section', 
        navLinkSelector: '.nav-link' 
    }
});
```

---

## 🎨 Customization

All components use CSS custom properties for easy theming:

```css
.skill-chip {
    --chip-border: var(--brand-pop60);
    --chip-text: var(--text-gray);
    --chip-hover-border: var(--brand-pop);
}
```

Override these in your own CSS:

```css
.my-custom-chips .skill-chip {
    --chip-border: #ff0000;
    --chip-hover-border: #00ff00;
}
```

---

## 📱 Responsive Design

All components are mobile-friendly with breakpoint at `768px`.

Mobile adjustments:
- Smaller chip sizes
- Reduced spacing
- Condensed navigation
- Scaled tool cards

---

## 🔥 Examples

### Complete Skill Section

```html
<section id="skills">
    <h2 class="text-glow-purple">TECHNICAL PROFICIENCY</h2>
    
    <div class="chip-group glow-container">
        <span class="skill-chip glow-item">Generative AI</span>
        <span class="skill-chip glow-item">ComfyUI</span>
        <span class="skill-chip glow-item">Stable Diffusion</span>
        <span class="skill-chip glow-item">Prompt Engineering</span>
    </div>
</section>

<script>
    VeetanceDesign.initGlowEffect('.chip-group', '.skill-chip');
</script>
```

---

## 🐛 Troubleshooting

### Glow effect not working?

1. Ensure JavaScript is initialized after DOM loads
2. Check that CSS variables are defined
3. Verify container has `.glow-container` class
4. Verify items have `.glow-item` class

### Navigation not highlighting?

1. Ensure sections have `id` attributes
2. Check that nav links have matching `href="#id"` attributes
3. Verify Scroll Spy is initialized

---

## 📄 License

MIT License - Free to use in personal and commercial projects.

---

## 💬 Support

Created by **Divine Okonkwo (Veetance Design)**  
Portfolio: [veetancedesign.com](https://veetancedesign.com)  
Email: divineokos@hotmail.com

---

### 6. Virtual Scrollbar (Scanner UI)
A custom, JavaScript-driven overlay scrollbar designed for deep immersion.

#### Behavior:
1.  **Scanner Light:** A radial gradient (`.scrollbar-glow-ball`) tracks the mouse Y-position relative to the track, illuminating the thumb.
2.  **Thumb Logic:**
    *   **Default:** Translucent (50% Opacity) Blue (`var(--brand-pop50)`). No Border.
    *   **Hover:** Thumb Border becomes **Solid Blue** (`var(--brand-pop)`). Fill remains translucent.
    *   **Active (Click):** Thumb becomes **Solid Blue** (`var(--brand-pop)`). Opacity 100%. No expansion.
3.  **Track:** Faint static track line.
4.  **Layout Logic:**
    *   **Position:** Fixed, pushed down by `var(--nav-height-mobile/desktop)`.
    *   **Height:** Calculated dynamically (`100vh - nav_height - padding`) to ensure it never overlaps the header or footer area, adapting to responsive changes.

#### Implementation:
*   **CSS:** `css/modules/scrollbar.css`
*   **JS:** `js/ui/virtual-scrollbar.js`

---

### 7. Works Grid (State-Driven)
A reactive grid system that derives its content and pagination from a pure functional state engine.

#### Behavior:
1.  **Pure Selection:** Uses memoized selectors (`selectPaginatedWorks`) to derive the visible data slice.
2.  **Reactive Rendering:** Subscribes to the Store. DOM updates are gated by reference checks (`!==`), ensuring zero redundant repaints.
3.  **Crystallization Reveal:** Staggered entrance using the "Radiant Reveal" physics protocol.

#### Usage:
```html
<div class="works-grid" id="works-grid-target">
    <!-- Items are injected via store subscription -->
</div>
```

#### State Pattern:
```javascript
// Example Selector Usage
const paginatedWorks = selectPaginatedWorks(state);
renderGrid(paginatedWorks);
```

---

**Built with ❤️ in the realm of Deus** 🚀

