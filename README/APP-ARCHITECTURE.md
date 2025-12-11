# Digital Blacksmith Portfolio - Site Map & Structure

## 1. High-Level Overview
Type: Single Page Application (SPA) / One-Page Scroll
Theme: Cyber-Industrial, Dark Mode, High Contrast ("MOMA" Aesthetic)
Core Features: Generative Art Background, Client-Side Edit Mode, Sticky Navigation.

## 2. Navigation Structure (Anchors)
The application flows vertically through the following sections:

1.  **Home / Hero Section** (`#home`)
    *   **Interactive Background**: p5.js generative "Molten Lattice".
    *   **Branding**: "DIGITAL BLACKSMITH" (Mega Typography).
    *   **Tagline**: "Sculpting the digital future..." + "Bridging human/artificial efforts".
    *   **Controls**: Edit Mode Trigger (Hidden Icon), Sticky Text Nav.

2.  **Work / Portfolio** (`#works`)
    *   **Header**: "SELECTED WORKS" [2018 — 2025].
    *   **Grid Layout**: Strict 3-Col Grid (Sharp Edges).
    *   **Content**: 
        *   Coat of Arms Gen AI (Generative Art)
        *   Legacy UI/UX (Interface Design)
        *   Gate Of Golgotha (Game UI)
        *   Veras AI (Brand/Web)
        *   RIVOS Brand ID (Identity)
        *   Academic Motion (Animation)
    *   **Interaction**: Hover lift, Click to Open Link / Edit Image.

3.  **Resume** (`#resume`)
    *   **Layout**: Split view / Sticky Header.
    *   **Experience**:
        *   Floating Axe Studios (Generative Concept Artist, Graphic Designer)
        *   Veras AI (Graphic Designer & Web Developer)
    *   **Technical Proficiency**:
        *   Generative AI, ComfyUI, Flux.
        *   Adobe Suite, Figma, 3ds Max.

4.  **Contact** (`#contact`)
    *   **Layout**: Minimalist Contact Grid.
    *   **Contact Details**: Email, LinkedIn, Instagram.
    *   **Footer**: Copyright.

## 3. Technical Components Map

### UI Components
*   **Navbar**: Fixed, `mix-blend-mode: difference`, Small text links.
*   **Edit Mode**: Global state toggle.
    *   Hot-swap images/videos on click.

### Visual Assets
*   **Fonts**: 
    *   Display: 'Syne' (Weights: 400, 700, 800)
    *   Body: 'Inter' (Weights: 300, 400, 600)

## 4. File Structure (Target Architecture)
```text
root/
├── index.html        (Contains all sections)
├── style.css         (Design System)
├── main.js           (Logic Layer)
└── assets/           (Images/Videos)
```

## 5. Design System & Theming
*   **Color Palette**:
    *   **Background**: `var(--bg-black)` (Deep Void Black)
    *   **Text (Primary)**: `var(--text-white)`
    *   **Text (Secondary)**: `var(--text-gray)`
    *   **Brand Pop**: `var(--brand-pop)` (Purple/Violet Accent) - Used for hovers, active states, and focal points.
*   **Typography**:
    *   **Display**: 'Syne' (Broad, bold headers)
    *   **Body**: 'Inter' (Clean, legible data)

## 6. Interaction Mechanics
### The "Digital Contact" Button
A specialized interaction model for high-priority calls to action (e.g., Contact Button).
*   **Mechanism**:
    *   **Masking**: `overflow: hidden` on parent container clips internal elements.
    *   **Glow**: A 300px radial gradient (`.contact-glow`) tracks mouse position via JS.
    *   **Clamping**: Geometry (`min-width: 140px`) is locked to prevent layout jitter during bold/hover state changes.
    *   **Ripple**: On click, the glow is cloned and expanded (`transform: scale(4)`) to simulate a fluid impact.

### Generative Background
*   **Engine**: p5.js (`artifice.js`)
*   **Behavior**:
    *   Scrolls at 0.5x speed (Parallax) relative to content.
    *   Fades to black via CSS mask at the bottom of the Hero section to ensure text readability in the content sections.
