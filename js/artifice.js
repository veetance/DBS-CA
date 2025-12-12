/* 
   ARTIFICE ENGINE v2: CORTEX OVERHAUL
   Host-Sandbox System with Synthetic Cortex Logic
   DivinE Okonkwo | Deus Ex Machina
*/

class SyntheticCortex {
    constructor() {
        this.log = (msg) => console.log(`[Cortex] ${msg}`);
    }

    /* 
       analyze(rawContent)
       - Parsing heuristic logic to understand arbitrary code structures.
       - Returns { code, values, defs }
    */
    analyze(rawContent) {
        this.log("Reading file structure...");

        let dna = {
            code: "",
            parameterValues: {},
            parameters: []
        };

        try {
            // Attempt 1: Parse as JSON (Standard .artifice file)
            const parsed = JSON.parse(rawContent);
            if (parsed.code) {
                // Check if it has extracted parameters
                if (!parsed.parameters || parsed.parameters.length === 0) {
                    this.log("JSON detected but missing param definitions. Extracting...");
                    const extracted = this.extractParametersFromCode(parsed.code);
                    dna.code = extracted.code;
                    dna.parameterValues = extracted.values;
                    dna.parameters = extracted.defs;
                } else {
                    dna = parsed;
                    // FIX: Use defaults ONLY if parameterValues is missing
                    if (!dna.parameterValues) {
                        dna.parameterValues = {};
                        parsed.parameters.forEach(param => {
                            dna.parameterValues[param.name] = param.defaultValue;
                        });
                    }
                }
                return dna;
            }
        } catch (e) {
            // Not JSON, assume raw text
        }

        // Attempt 2: Treat as Raw Code
        const extraction = this.extractParametersFromCode(rawContent);
        dna.code = extraction.code;
        dna.parameterValues = extraction.values;
        dna.parameters = extraction.defs;

        return dna;
    }

    extractParametersFromCode(rawCode) {
        let code = rawCode;
        const values = {};
        const defs = [];

        // Regex: Find top-level numeric variables (let x = 10;)
        const varRegex = /^(?:let|var)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(-?\d+(?:\.\d+)?)\s*;?$/gm;

        let match;
        const foundVars = [];

        while ((match = varRegex.exec(rawCode)) !== null) {
            const name = match[1];
            const val = parseFloat(match[2]);
            if (name.length < 3) continue; // Ignore temp vars i, x, y
            foundVars.push({ name, val });
        }

        if (foundVars.length > 0) {
            this.log(`Identified ${foundVars.length} control variables.`);

            // --- DIMENSION 6 HERO OVERRIDE ---
            // Detect if this is the "Archipelago" sketch by unique variable signature or content
            const isDim6 = code.includes("isoAngleX") && code.includes("terrain");

            foundVars.forEach(v => {
                // --- BRAND THEME ENFORCEMENT ---
                // Deep Blue-Purple Theme
                if (v.name.toLowerCase() === 'hue' || v.name === 'h') v.val = 229; // ~#4561cc
                if (v.name.toLowerCase() === 'saturation' || v.name === 'sat' || v.name === 's') v.val = 90;
                if (v.name.toLowerCase() === 'brightness' || v.name === 'bri' || v.name === 'b') v.val = 100;

                values[v.name] = v.val;
                defs.push({
                    name: v.name,
                    min: v.val > 0 ? 0 : v.val * 2,
                    max: v.val > 0 ? v.val * 4 : 0,
                    defaultValue: v.val
                });

                // Rewrite Code: Replace declaration with usage of p.name
                const declRegex = new RegExp(`^(?:let|var)\\s+${v.name}\\s*=\\s*-?\\d+(?:\\.\\d+)?\\s*;?`, 'm');
                code = code.replace(declRegex, `// ${v.name} extracted (Themed) to p.${v.name}`);

                // Safe Replace usage
                const usageRegex = new RegExp(`(?<!\\.)\\b${v.name}\\b(?!\\s*:)`, 'g');
                code = code.replace(usageRegex, `p.${v.name}`);
            });

            // Special Color Injection for Dimension 6 (Hardcoded hue variable in draw loop)
            if (isDim6) {
                this.log("Applying Dimension 6 Brand Matrix.");

                // 1. Force the Base Hue Variable
                // Matches "let baseHue = 210;" or similar
                code = code.replace(/let\s+baseHue\s*=\s*\d+\s*;?/g, `let baseHue = 229;`);

                // 2. Direct Stroke Override (Safety Net)
                // Finds "stroke(baseHue..." and ensures it uses 229 (deep blue-purple)
                code = code.replace(/stroke\s*\(\s*baseHue/g, `stroke(229`);

                // 3. Grid Points Override
                // "stroke(hue % 360..." -> "stroke(229..."
                code = code.replace(/stroke\s*\(\s*hue\s*%\s*360/g, `stroke(229`);
            }
        }

        // Auto-Repair: Inject Setup if missing
        if (!code.includes('function setup') && !code.includes('setup =')) {
            this.log("Injecting default setup environment.");
            code = `function setup() { createCanvas(windowWidth, windowHeight); \n ${code} \n}`;
        }

        // Optimization: Inject Particle Life limit? (Complex, risky for Regex)
        // Instead, we trust the sandbox performance limits or user's code quality for now.

        return { code, values, defs };
    }
}

class ArtificeHost {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.cortex = new SyntheticCortex();
        this.currentParams = { hue: 180, saturation: 80, brightness: 100 };

        // Listen for feedback from Sandbox
        window.addEventListener('message', (e) => this.handleMessage(e));
    }

    async loadSketch(url) {
        if (!this.container) return;

        console.log(`[Artifice] Fetching ${url}...`);
        try {
            const resp = await fetch(url);
            const text = await resp.text();

            // Cortex Analysis
            const dna = this.cortex.analyze(text);

            // Apply Results
            this.currentParams = { ...this.currentParams, ...dna.parameterValues };
            this.injectSandbox(dna.code);

        } catch (e) {
            console.error("[Artifice] Failed to load sketch", e);
        }
    }

    injectSandbox(processedCode) {
        // Clear previous
        this.container.innerHTML = '';

        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.sandbox = 'allow-scripts'; // Secure Mode

        // Construct Sandbox Logic
        const sandboxHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>html, body { margin: 0; overflow: hidden; background: #000; }</style>
                <script>
                    let p = ${JSON.stringify(this.currentParams)};
                    
                    window.addEventListener('message', (event) => {
                        if(event.data.type === 'update') {
                            Object.assign(p, event.data.payload);
                        }
                    });

                    function run() {
                        try {
                            // Inject Code
                            window.eval(${JSON.stringify(processedCode)});
                            
                            // Load p5
                            const s = document.createElement('script');
                            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js';
                            document.head.appendChild(s);
                        } catch(e) {
                            console.error(e);
                        }
                    }
                </script>
            </head>
            <body onload="run()"></body>
            </html>
        `;

        iframe.srcdoc = sandboxHTML;
        this.container.appendChild(iframe);
        this.iframe = iframe;
    }

    handleMessage(event) {
        // Bi-directional sync if sketch updates itself
        if (event.data?.type === 'sketchUpdate') {
            Object.assign(this.currentParams, event.data.payload);
        }
    }
}

// Just expose the class, Main.js will instantiate
window.ArtificeHost = ArtificeHost;
