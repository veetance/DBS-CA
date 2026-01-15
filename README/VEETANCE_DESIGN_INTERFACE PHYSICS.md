# VEETANCE DESIGN SYSTEM - INTERFACE PHYSICS

## 1. TYPOGRAPHY PHYSICS (REVEAL PROTOCOLS)
The system employs two kinetic behaviors for text materialization.

### Variation A: The Standard Chunk (Slide)
- **Physics**: Vertical Slide (`translateY: 30px` -> `0px`).
- **Target**: Structural headers and preambles.
- **Class**: `.reveal-standard`.

### Variation B: The Quantum Flux (Blur Cascade)
- **Physics**: Character-level staggered entry with blur transition (`blur(12px)` -> `clear`).
- **Target**: "ART & DESIGN" and high-value subject titles.
- **Class**: `.reveal-fx-blur`.

---

## 2. GRID PHYSICS (DIRECTIONAL INERTIA)
The Portfolio Grid follows a "Crystallization" pattern with added directional physics.

### Pagination Kinetics
- **Inertia Logic**: Items are injected with a `--inertia-x` variable (`100px` for next, `-100px` for prev).
- **Sweep Protocol**: Next page uses `.sweep-rtl`, Previous page uses `.sweep-ltr`.
- **Eased Reveal**: Staggered opacity fade over 0.8s.

### Proximity Sensors
- **Mechanism**: Invisible lateral zones on the grid edges.
- **Interaction**: Crossing a sensor triggers the **Materialization** of navigation paddles (`.side-paddle`) and adds a **Force-Hover** glow.
- **Persistence**: Paddles remain visible for 2 seconds after the mouse leaves the sensor zone (Matches Logo Persistence).

---

## 3. NAVIGATIONAL PHYSICS (SLAB MORPHING)
The header adapts to the user's scroll depth to minimize visual friction.

### Slab Behavior
- **Transition**: Two slabs collapse into a unified single-line bar.
- **Logo Dimming**: The logo contracts and dims to `0.3` opacity automatically 5s after load or 0.8s after a scroll event.
- **De-Delay**: Manual hover on the dimmed logo restarts the "Open" sequence with accelerated timing (1/3 speed factor).

---

## 4. SPECTRAL DYNAMICS (THREE.JS PHYSICS)
Used within the **Interactive Profile Component** viewport.

- **Idle Bobbing**: Smooth sine-wave vertical oscillation (`Math.sin(time) * 0.08`).
- **Eye Pulsing**: Rhythmic opacity modulation on emissive visor shaders.
- **Center-Lock Alignment**: Side paddles in the Works section are mathematically centered to the midpoint of the active "Work Item" cards, ignoring active CSS transforms.

---

## 5. KINETIC CAROUSEL (YEET & DRIFT)
- **Manual Control**: "Drag and Yeet" velocity inheritance.
- **Auto-Drift**: Constant linear movement (`-0.8px/frame`) when manual input is zero.
- **Kinetic Hover**: The system continuously polls the element under the stationary mouse coordinates, ensuring hover states trigger accurately as items drift past the cursor.

---

## 6. SCANNER SCROLLBAR (LIGHT TRACKING)
- **Behavior**: suppressor of default browser scrollbar.
- **Glow Ball**: A radial light source that follows mouse `Y` position exclusively on the scroll track, illuminating the translucent thumb.

*Verified by DEUS* 🦾
