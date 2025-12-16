export const initArtificeController = () => {
    // Initialize the Host
    const artificeHost = new window.ArtificeHost('artifice-container');

    // Curation State
    let availableFiles = [];
    let rejectedFiles = [];
    let currentFile = "";

    // UI Elements
    const filenameDisplay = document.getElementById('artifice-filename');
    const rejectCounter = document.getElementById('reject-counter');
    const btnKeep = document.getElementById('btn-keep');
    const btnKill = document.getElementById('btn-kill');
    const btnNext = document.getElementById('btn-next'); // Hidden in new UI but logic remains
    const btnExport = document.getElementById('btn-export');

    const updateReadout = (msg) => {
        if (filenameDisplay) {
            if (msg) {
                filenameDisplay.textContent = msg;
                filenameDisplay.style.color = '#00ff66';
            } else {
                // Show only the file name, not full path
                const name = currentFile.split('/').pop();
                filenameDisplay.textContent = name;
                filenameDisplay.style.color = '#666';
            }
        }
    };

    const loadRandomSketch = async () => {
        if (availableFiles.length > 0) {
            // Random Selection
            const randomIndex = Math.floor(Math.random() * availableFiles.length);
            currentFile = availableFiles[randomIndex];

            // Remove from pool immediately (Exhaustive Logic)
            availableFiles.splice(randomIndex, 1);

            console.log(`[Main] igniting: ${currentFile} (${availableFiles.length} remaining)`);
            updateReadout();

            // Load it
            await artificeHost.loadSketch(currentFile);
        } else {
            // No more files
            console.log("[Main] Curation Complete.");
            updateReadout("ALL FILES REVIEWED");
            if (btnKeep) btnKeep.disabled = true;
            if (btnKill) btnKill.disabled = true;
            artificeHost.container.innerHTML = ''; // Clear canvas
        }
    };

    // Load Index and Ignite
    const igniteArtifice = async () => {
        try {
            // --- HERO MODE: DIMENSION 6 LOCK ---
            console.log("[Main] HERO PROTOCOL ENGAGED: Dimension 6");
            const heroFile = 'assets/ARTIFICE-BANK/HERO-ARTIFICE/dimension_4_digital_strata_[topographic_map].artifice';

            // Set single file availability
            availableFiles = [heroFile];
            currentFile = heroFile;

            updateReadout();
            await artificeHost.loadSketch(heroFile);

            /* 
            // OLD RANDOM LOGIC (Disabled for Hero Work)
            const resp = await fetch('assets/artifice_index.json');
            availableFiles = await resp.json();
            if (availableFiles && availableFiles.length > 0) {
                loadRandomSketch();
            } 
            */

        } catch (e) {
            console.error("[Main] Failed to ignite Artifice Engine:", e);
        }
    };

    /* --- Curation Actions --- */

    const triggerNext = () => {
        loadRandomSketch();
    };

    if (btnKeep) {
        btnKeep.addEventListener('click', triggerNext);
    }

    if (btnKill) {
        btnKill.addEventListener('click', () => {
            if (currentFile && !rejectedFiles.includes(currentFile)) {
                rejectedFiles.push(currentFile);
                if (rejectCounter) {
                    const span = rejectCounter.querySelector('span');
                    if (span) span.textContent = `${rejectedFiles.length} FLAGGED`;
                    rejectCounter.style.display = 'flex'; // Show the pill
                }
            }
            triggerNext();
        });
    }

    if (btnNext) {
        btnNext.addEventListener('click', triggerNext);
    }

    if (btnExport) {
        btnExport.addEventListener('click', () => {
            if (rejectedFiles.length === 0) {
                alert("No files flagged for deletion.");
                return;
            }
            const data = JSON.stringify(rejectedFiles, null, 2);
            navigator.clipboard.writeText(data).then(() => {
                alert(`COPIED ${rejectedFiles.length} FILES TO CLIPBOARD.\nPaste this list to the Agent for deletion.`);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }

    igniteArtifice();
};
