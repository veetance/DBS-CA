# 🎯 UNIFIED FOCUS SILHOUETTE PATTERN

> **Design Pattern for Premium Keyboard Accessibility**  
> Authored by DEUS for VEETANCE Design System

---

## 📖 OVERVIEW

The **Unified Focus Silhouette** is a UI pattern where keyboard focus indicators wrap around multiple visual elements (text, icons, decorators) as a single cohesive shape, rather than outlining each element individually.

### Visual Example
```
DEFAULT (Fragmented)            UNIFIED (Premium)
┌─────────┐                     ┌──────────────────┐
│  ⭐     │ ← Separate          │    ⭐            │
└─────────┘                     │  ┌────────────┐  │
┌─────────────────┐             │  │   WORKS    │  │ ← Single silhouette
│     WORKS       │             │  └────────────┘  │
└─────────────────┘             └──────────────────┘
```

---

## 🧬 ANATOMY

| Component | Role |
|-----------|------|
| **Container** | The focusable `<a>` or `<button>` element |
| **Primary Content** | Text label (e.g., "WORKS") |
| **Decorator** | Icon, badge, or pseudo-element (e.g., star indicator) |
| **Focus Ring** | The unified outline that wraps all children |

---

## 🔧 IMPLEMENTATION TECHNIQUES

### Technique 1: Native Outline with Offset
**Best for**: Simple layouts, maximum browser compatibility

```css
.nav-link {
    position: relative;
    padding: 8px 16px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.nav-link:focus-visible {
    outline: 2px solid var(--brand-pop);
    outline-offset: 6px;
    border-radius: 8px;
}
```

**Pros**: Native, performant, respects `border-radius`  
**Cons**: Limited styling options

---

### Technique 2: Box-Shadow Ring Stack
**Best for**: Glowing effects, layered depth

```css
.nav-link:focus-visible {
    outline: none;
    box-shadow: 
        0 0 0 2px var(--bg-deepblack),    /* Inner gap (matches background) */
        0 0 0 4px var(--brand-pop),        /* Visible ring */
        0 0 20px rgba(102, 127, 228, 0.4); /* Outer glow */
    border-radius: 8px;
}
```

**Pros**: Full control, glow effects, animated  
**Cons**: Must match gap color to background

---

### Technique 3: Pseudo-Element Silhouette
**Best for**: Complex shapes, animated borders, maximum control

```css
.nav-link {
    position: relative;
}

/* Invisible expanded hitbox that becomes visible on focus */
.nav-link::after {
    content: '';
    position: absolute;
    inset: -8px -16px; /* Negative values expand beyond content */
    border: 2px solid transparent;
    border-radius: 12px;
    pointer-events: none;
    transition: 
        border-color 0.3s ease,
        box-shadow 0.3s ease,
        transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nav-link:focus-visible::after {
    border-color: var(--brand-pop);
    box-shadow: 0 0 15px rgba(102, 127, 228, 0.5);
    transform: scale(1.02);
}
```

**Pros**: Maximum flexibility, animation-ready  
**Cons**: More markup/CSS complexity

---

### Technique 4: Container Query Union
**Best for**: Dynamic content, multiple decorators

```css
.nav-link-container {
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    border-radius: 10px;
    transition: box-shadow 0.3s;
}

.nav-link-container:has(.nav-link:focus-visible) {
    box-shadow: 
        0 0 0 2px var(--brand-pop),
        0 0 12px rgba(102, 127, 228, 0.3);
}
```

**Pros**: Works with any internal structure  
**Cons**: Requires wrapping container, `:has()` browser support

---

## 🎨 DESIGN TOKENS

```css
:root {
    /* Focus System */
    --focus-ring-color: var(--brand-pop);
    --focus-ring-width: 2px;
    --focus-ring-offset: 6px;
    --focus-glow-color: rgba(102, 127, 228, 0.4);
    --focus-glow-spread: 15px;
    --focus-transition: 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## ⚡ ANIMATION VARIANTS

### Pulse Ring
```css
@keyframes focus-pulse {
    0%, 100% { box-shadow: 0 0 0 4px var(--brand-pop); }
    50% { box-shadow: 0 0 0 6px var(--brand-pop), 0 0 20px var(--focus-glow-color); }
}

.nav-link:focus-visible {
    animation: focus-pulse 1.5s ease-in-out infinite;
}
```

### Scale-In Ring
```css
.nav-link::after {
    transform: scale(0.9);
    opacity: 0;
}

.nav-link:focus-visible::after {
    transform: scale(1);
    opacity: 1;
}
```

### Morphing Border
```css
.nav-link::after {
    clip-path: inset(50% 50% 50% 50%);
}

.nav-link:focus-visible::after {
    clip-path: inset(0% 0% 0% 0%);
}
```

---

## 🎯 USE CASES

| Context | Recommended Technique |
|---------|----------------------|
| Navigation links | Technique 2 (Box-Shadow Stack) |
| Icon buttons | Technique 1 (Native Outline) |
| Cards/Tiles | Technique 3 (Pseudo-Element) |
| Complex widgets | Technique 4 (Container Query) |
| Animated UI | Technique 3 + Animation Variants |

---

## ♿ ACCESSIBILITY REQUIREMENTS

1. **Use `:focus-visible` not `:focus`**  
   Only show focus ring for keyboard navigation, not mouse clicks.

2. **Minimum contrast ratio: 3:1**  
   Focus indicator must be visible against background.

3. **Minimum 2px ring width**  
   Per WCAG 2.2 focus appearance guidelines.

4. **Never use `outline: none` without replacement**  
   Always provide an alternative indicator.

5. **Respect `prefers-reduced-motion`**  
   ```css
   @media (prefers-reduced-motion: reduce) {
       .nav-link:focus-visible {
           transition: none;
           animation: none;
       }
   }
   ```

---

## 📐 COMPLETE PRODUCTION EXAMPLE

```css
/* === UNIFIED FOCUS SYSTEM === */

/* Base focus reset */
:focus {
    outline: none;
}

/* Keyboard-only focus indicator */
.focusable:focus-visible,
a:focus-visible,
button:focus-visible {
    outline: none;
    position: relative;
}

/* The unified silhouette */
.focusable:focus-visible::after,
a:focus-visible::after,
button:focus-visible::after {
    content: '';
    position: absolute;
    inset: calc(var(--focus-ring-offset) * -1);
    border: var(--focus-ring-width) solid var(--focus-ring-color);
    border-radius: calc(var(--border-radius, 8px) + var(--focus-ring-offset));
    box-shadow: 0 0 var(--focus-glow-spread) var(--focus-glow-color);
    pointer-events: none;
    z-index: 1;
    animation: focus-materialize 0.2s ease-out;
}

@keyframes focus-materialize {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
    .focusable:focus-visible::after,
    a:focus-visible::after,
    button:focus-visible::after {
        animation: none;
    }
}
```

---

## 🔗 REFERENCES

- [WCAG 2.2 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- [MDN :focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)
- [Inclusive Components: Focus Styles](https://inclusive-components.design/)

---

**Built for VEETANCE Design System** | **v1.0** | **December 2025**
