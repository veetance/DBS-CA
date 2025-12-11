# ARTIFICE ENGINE v2: CORTEX OVERHAUL
### "The Synthetic Mind of the Grid"

## 1. Overview
The **Artifice Engine v2** is a complete rewrite of the generative art loader, moving from a static script injector to a sophisticated **Host-Sandbox System** equipped with a heuristic parser known as the **Synthetic Cortex**.

This engine allows the website to load, analyze, and execute arbitrary generative art files (`.artifice`, `.json`, `.js`) without manual configuration or React dependencies.

---

## 2. Core Architecture: Host-Sandbox Contract
The engine operates on a strict separation of concerns to ensure stability and security.

### A. The Host (main.js / PORTABLE_PLAYER)
-   **Responsibility**: Manages the UI, file loading, and the "State of Truth" for parameters.
-   **Synthetic Cortex**: Before any code is run, the Cortex analyzes the raw text to understand its structure (see Section 3).
-   **Parameter Management**: Holds the master values for variables like `speed`, `color`, `density`.

### B. The Sandbox (Iframe)
-   **Responsibility**: Executes the p5.js sketch in an isolated environment.
-   **Safety**: Runs with `sandbox="allow-scripts"`, preventing the sketch from accessing cookies or the parent DOM.
-   **Polyfills**: Wraps potentially dangerous functions (`setup`, `draw`) in `try-catch` blocks to prevent the entire site from crashing if a sketch errors out.

### C. The Feedback Loop
Communications happen via `window.postMessage`.
1.  **Host -> Sandbox**: "Here is the new parameter state." (e.g., User moves a slider).
2.  **Sandbox -> Host**: "I have updated a parameter." (e.g., An algorithmic serpent grows, updating its own length).

---

## 3. The Synthetic Cortex (Local AI Layer)
The defining feature of v2 is the **Cortex**, a heuristic logic engine running client-side.

### Capabilities:
1.  **Universal Reader**: Can ingest:
    -   Standard `.game` / `.artifice` JSON files.
    -   Raw `.js` sketches.
    -   Incomplete code snippets.
2.  **Auto-Parameter Extraction**:
    -   Scans raw code for top-level variables (e.g., `let flowSpeed = 4.5;`).
    -   **Extracts** them into a control object.
    -   **Rewrites** the code on-the-fly to replace `flowSpeed` with `p.flowSpeed`, instantly making static code interactive.
    -   **Heuristic Ranges**: Automatically calculates Min/Max slider values based on the initial variable value (e.g., `0` to `4x`).
3.  **Self-Repair**:
    -   Detects if `setup()` or `draw()` are missing.
    -   Injects necessary p5.js boilerplate to ensure the sketch creates a canvas and renders.

---

## 4. Optimization & Performance
-   **Particle Management**: Sketches are optimized to "kill" particles immediately upon leaving the viewport or fading out, preventing memory leaks that cause lag over time.
-   **Zero-Dependency**: The engine is a single HTML/JS structure. No Node_modules, no Build steps required for the player itself.

## 5. Deployment Strategy (Site Integration)
On page load (`main.js`):
1.  **Random Selection**: The engine picks a random file from `ARTIFICE-BANK/01` or `ARTIFICE-BANK/02`.
2.  **Cortex Analysis**: The file is read and "solved" by the Cortex.
3.  **Injection**: The solved DNA is fed into the background canvas.
4.  **Theme Adaptation**: The engine detects the dominant colors of the sketch and subtly adjusts the site's accent colors (optional).

---

*Verified by Deus System Architecture.*
*Status: SYSTEMS ONLINE.*
