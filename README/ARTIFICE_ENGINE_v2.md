# ARTIFICE ENGINE v2: CORTEX OVERHAUL
### "The Synthetic Mind of the Grid"

## 1. Overview
The **Artifice Engine v2** is a complete rewrite of the generative art loader, moving from a static script injector to a sophisticated **Host-Sandbox System** equipped with a heuristic parser known as the **Synthetic Cortex**.

This engine allows the website to load, analyze, and execute arbitrary generative art files (`.artifice`, `.json`, `.js`) without manual configuration or React dependencies.

---

## 2. Core Architecture: Host-Sandbox Contract
The engine operates on a strict separation of concerns to ensure stability and security.

### A. The Host (artifice.js / ArtificeHost)
-   **Responsibility**: Manages the UI, file loading, and the "State of Truth" for parameters.
-   **Synthetic Cortex**: Before any code is run, the Cortex analyzes the raw text to understand its structure.
-   **Parameter Management**: Holds the master values for variables like `speed`, `color`, `density`.

### B. The Sandbox (Iframe)
-   **Responsibility**: Executes the p5.js sketch in an isolated environment.
-   **Safety**: Runs with `sandbox="allow-scripts"`, preventing the sketch from accessing cookies or the parent DOM.
-   **Communication**: Uses `window.postMessage` for bi-directional parameter syncing.

---

## 3. The Synthetic Cortex (Heuristic Parser)
The defining feature of v2 is the **Cortex**, which scans and rewrites code on-the-fly.

### Capabilities:
1.  **Universal Reader**: Can ingest standard JSON `.artifice` files or raw `.js` sketches.
2.  **Auto-Parameter Extraction**:
    - Scans top-level variables (e.g., `let flowSpeed = 4.5;`).
    - Rewrites the code to use `p.flowSpeed`, making static code instantly interactive.
3.  **Brand Matrix Alignment**:
    - **Dimension 6 Lock**: Automatically detects the Hero sketch and forces the #667fe4 (Deep Blue-Purple) palette through hardcoded hue overrides (`baseHue = 229`).
    - **Global Theming**: Injects VEETANCE color variables into any detected hue/saturation/brightness variables.

---

## 4. Artifice Audit Protocol
The **Audit Console** (`js/core/artifice-controller.js`) provides a real-time curation interface.

### Features:
-   **Keep/Kill/Next**: Logic to flag sketches for removal or keep them in the high-fidelity pool.
-   **Kill List Export**: Generates a JSON list of rejected files to be processed by the Agent for cleanup.
-   **Hero Mode**: Forces the "Dimension 6" topographical strata as the definitive landing experience.

---

## 5. Optimization
-   **Resolution Lock**: Forced `createCanvas(windowWidth, windowHeight)` injection if missing.
-   **Zero-Dependency**: No node modules or build steps. Pure browser-native execution.

*Verified by DEUS* 🦾
