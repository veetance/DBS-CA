# ARTIFICE OPTIMIZATION PROTOCOL (AOP-v1)

> **Objective:** To standardize the integration of Generative Art sketches into the Veetance Design Ecosystem, ensuring maximum performance, visual consistency, and brand alignment.

---

## 1. PERFORMANCE CORE

### Resolution Lock
**Constraint:** Browser canvases must NOT use `windowWidth` / `windowHeight`.
**Protocol:** Hardcode internal resolution to `createCanvas(1920, 1080)`.
**Why:**
- Prevents exponential pixel count growth on 4K/5K screens.
- Ensures consistent "density" of art across all devices.
- CSS handles the stretching to fullscreen (`width: 100%; height: 100%; object-fit: cover;`).

### Pixel Density Override
**Constraint:** High-DPI (Retina) rendering is forbidden for background art.
**Protocol:** Inject `pixelDensity(1)` in `setup()`.
**Why:**
- Instantly boosts framerate by 300-400% on Apple/High-End Windows devices.
- Removes the 4x pixel rendering load that provides negligible visual benefit for abstract motion.

### Frame Rate Cap
**Constraint:** Background art must not hog GPU cycles.
**Protocol:** Set `frameRate(30)` in `setup()`.
**Why:**
- Halves the GPU workload compared to default 60fps.
- Provides a "cinematic" motion quality suitable for ambient backgrounds.

### Shadow Exorcism
**Constraint:** Native browser filters are banned.
**Protocol:** **DELETE** all instances of `drawingContext.shadowBlur` and `shadowColor`.
**Why:**
- Gaussian blur filters are the single most expensive operation in 2D canvas rendering.
- Removing them eliminates 90% of scroll lag.

---

## 2. AESTHETIC & BRAND ALIGNMENT

### The Fake Glow (Optical Illusion)
**Objective:** Maintain "Cyber/Neon" look without `shadowBlur`.
**Protocol:** Render geometry in two passes (optional, based on CPU budget):
1.  **Pass 1 (The Aura):** Stroke Weight: `x6`, Opacity: `15%`.
2.  **Pass 2 (The Core):** Stroke Weight: `x1`, Opacity: `80-100%`.
**Why:**
- Simulates light scattering purely through geometry.
- Extremely efficient compared to pixel shaders.

### Thematic Color Synchronization
**Objective:** Unified Brand Identity.
**Protocol:**
- **Hue:** Locked to **229** (Veetance Deep Purple).
- **Saturation:** ~80.
- **Brightness:** ~90-100.
**Implementation:** Inject these as parameters in the JSON if missing.

### Opacity Control
**Objective:** Ensure text legibility.
**Protocol:**
- Hardcode opacity (alpha 0-100) in the `stroke()` function.
- **Target:** 60-80 for standard lines, 30-40 for ambient fills.

---

## 3. GEOMETRIC EFFICIENCY

### Vertex Decimation
**Objective:** Balance Organic Fluidity vs. Poly Count.
**Protocol:**
- Tune the `loop step` (e.g., `x += 4`).
- **Low Poly:** Step 20
- **Balanced:** Step 8-10
- **High Fidelity:** Step 4
**Why:** Allows precise control over the "cost" of the drawing.

### Infinite Horizon (Over-Draw)
**Objective:** Prevent visual "glitches" at edges.
**Protocol:** Extend rendering loops beyond canvas bounds (e.g., `y < height + 300`).
**Why:** Ensures that when waves/noise shift geometry, no black voids appear at the screen edges.

---

## IMPLEMENTATION TEMPLATE (JS)

```javascript
function setup() {
    createCanvas(1920, 1080); // 1. Resolution Lock
    pixelDensity(1);          // 2. Density Override
    frameRate(30);            // 3. FPS Cap
    colorMode(HSB, 360, 100, 100, 100);
}

function draw() {
    background(0);
    noFill();
    
    // 4. Manual Glow (Pass 1 - Aura)
    // stroke(p.hue, p.saturation, p.brightness, 15);
    // strokeWeight(p.lineThickness * 6);
    // ... draw loop ...

    // 5. Core Geometry (Pass 2 - Sharp)
    stroke(p.hue, p.saturation, p.brightness, 60); // Opacity Control
    strokeWeight(p.lineThickness);
    
    // 6. Infinite Horizon & Vertex Decimation
    for (let y = p.lineSpacing; y < height + 300; y += p.lineSpacing) {
        beginShape();
        for (let x = -10; x <= width + 10; x += 4) { // Step 4
            // ... algorithm ...
        }
        endShape();
    }
}
```
