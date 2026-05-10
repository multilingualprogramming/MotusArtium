        // Provide UI rendering functions with proper HTML generation
        if (typeof rendre_panneau_detail !== "function") {
            window.rendre_panneau_detail = function() {
                if (!window.ui || !window.ui.etat) return "";

                const entite = window.ui.etat.entite_selectionnee || {};
                if (!entite.id) return "";

                const type = entite.type || "inconnu";
                const donnees = entite.donnees || {};
                let html = '<div class="detail-section">';

                // Get appropriate label based on type
                let label = entite.id;
                if (type === "mouvement") {
                    label = donnees.movementLabel?.value || entite.id;
                } else if (type === "artiste") {
                    label = donnees.artistLabel?.value || entite.id;
                } else if (type === "oeuvre") {
                    label = donnees.artworkLabel?.value || entite.id;
                }

                html += '<h3>' + label + '</h3>';
                html += '<p><strong>Type:</strong> ' + type + '</p>';
                html += '<p><strong>ID:</strong> ' + entite.id + '</p>';

                // Add type-specific details
                if (type === "mouvement") {
                    const debut = donnees.startTime?.value;
                    const fin = donnees.endTime?.value;
                    if (debut || fin) {
                        html += '<p><strong>Période:</strong> ' + (debut || '?') + ' - ' + (fin || '?') + '</p>';
                    }
                } else if (type === "artiste") {
                    const naissance = donnees.birthTime?.value;
                    const deces = donnees.deathTime?.value;
                    if (naissance || deces) {
                        html += '<p><strong>Dates:</strong> ' + (naissance || '?') + ' - ' + (deces || '?') + '</p>';
                    }
                }

                html += '</div>';
                return html;
            };
        }

        if (typeof rendre_barre_recherche !== "function") {
            window.rendre_barre_recherche = function() {
                return '<input type="text" placeholder="Rechercher..." id="search-input" class="search-input">';
            };
        }

        function normaliseDetailType(type) {
            const normalised = String(type || "").toLowerCase();
            if (normalised.includes("movement") || normalised.includes("mouvement")) {
                return "mouvement";
            }
            if (normalised.includes("artist") || normalised.includes("artiste")) {
                return "artiste";
            }
            if (normalised.includes("work") || normalised.includes("oeuvre")) {
                return "oeuvre";
            }
            return normalised || "inconnu";
        }

        function escapeHtml(value) {
            return String(value || "")
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;")
                .replaceAll("'", "&#39;");
        }

        function readSelectedEntity() {
            const snapshot = typeof readRuntimeSnapshot === "function" ? readRuntimeSnapshot() : null;
            const entity = snapshot?.entite_selectionnee || {};
            return {
                id: entity.id || snapshot?.entite_selectionnee_id || "",
                type: normaliseDetailType(entity.type || snapshot?.entite_selectionnee_type),
                donnees: entity.donnees || {}
            };
        }

        function readDetailValue(value) {
            if (value == null) {
                return "";
            }
            if (typeof value === "string") {
                return value;
            }
            if (typeof value === "object") {
                if (typeof value.value === "string") {
                    return value.value;
                }
                if (typeof value.label === "string") {
                    return value.label;
                }
                if (typeof value.content === "string") {
                    return value.content;
                }
                if (typeof value.time === "string") {
                    return value.time;
                }
            }
            return "";
        }

        function buildDetailPanelFallback(entity) {
            if (!entity.id) {
                return "";
            }

            const type = normaliseDetailType(entity.type);
            const donnees = entity.donnees || {};
            const label = type === "mouvement"
                ? (readDetailValue(donnees.movementLabel) || entity.id)
                : type === "artiste"
                    ? (readDetailValue(donnees.artistLabel) || entity.id)
                    : type === "oeuvre"
                        ? (readDetailValue(donnees.artworkLabel) || entity.id)
                        : entity.id;
            const metaRows = [];

            if (type === "mouvement") {
                const debut = readDetailValue(donnees.startTime);
                const fin = readDetailValue(donnees.endTime);
                const pays = readDetailValue(donnees.country);
                if (debut || fin) {
                    metaRows.push(`<p class="detail-row">${escapeHtml([debut && "Debut: " + debut, fin && "Fin: " + fin].filter(Boolean).join(" | "))}</p>`);
                }
                if (pays) {
                    metaRows.push(`<p class="detail-row">Pays: ${escapeHtml(pays)}</p>`);
                }
            } else if (type === "artiste") {
                const naissance = readDetailValue(donnees.birthTime || donnees.birthDate);
                const deces = readDetailValue(donnees.deathTime || donnees.deathDate);
                const lieuNaissance = readDetailValue(donnees.birthPlace);
                if (naissance || deces) {
                    metaRows.push(`<p class="detail-row">${escapeHtml([naissance && "Ne: " + naissance, deces && "Decede: " + deces].filter(Boolean).join(" | "))}</p>`);
                }
                if (lieuNaissance) {
                    metaRows.push(`<p class="detail-row">Lieu de naissance: ${escapeHtml(lieuNaissance)}</p>`);
                }
            } else if (type === "oeuvre") {
                const createur = readDetailValue(donnees.creator);
                const date = readDetailValue(donnees.creationDate || donnees.inceptionDate);
                const musee = readDetailValue(donnees.museum);
                if (createur) {
                    metaRows.push(`<p class="detail-row">Createur: ${escapeHtml(createur)}</p>`);
                }
                if (date) {
                    metaRows.push(`<p class="detail-row">Date: ${escapeHtml(date)}</p>`);
                }
                if (musee) {
                    metaRows.push(`<p class="detail-row">Musee: ${escapeHtml(musee)}</p>`);
                }
            }

            return `<section class="detail-section detail-section--spotlight">
                <p class="detail-kicker">${escapeHtml(type)}</p>
                <h3>${escapeHtml(label)}</h3>
                <p class="detail-row detail-row--id">${escapeHtml(entity.id)}</p>
                ${metaRows.join("")}
            </section>`;
        }

        const runtimeDetailRenderer = typeof window.rendre_panneau_detail === "function" &&
            !String(window.rendre_panneau_detail).includes("<strong>ID:</strong>")
            ? window.rendre_panneau_detail.bind(window)
            : null;

        if (!runtimeDetailRenderer) {
            window.rendre_panneau_detail = function() {
                return buildDetailPanelFallback(readSelectedEntity());
            };
        }

        window.renderDetailPanel = function() {
            const detailContainer = document.getElementById("detail-panel-container");
            const detailRoot = document.getElementById("__ml_detail_root");

            if (!detailContainer || !detailRoot) {
                return;
            }

            let html = "";
            if (runtimeDetailRenderer) {
                try {
                    html = runtimeDetailRenderer() || "";
                } catch (error) {
                    console.warn("Error in runtime detail renderer:", error);
                }
            }
            if (!html) {
                html = buildDetailPanelFallback(readSelectedEntity());
            }
            if (html) {
                detailRoot.innerHTML = html;
                detailContainer.classList.add("is-active");
            } else {
                detailRoot.innerHTML = "";
                detailContainer.classList.remove("is-active");
            }
        };

        console.log("=== Page script started ===");
        console.log("bundle.js loaded, checking functions...");
        console.log("typeof initialiser_application:", typeof initialiser_application);
        console.log("typeof lancer_recherche:", typeof lancer_recherche);

        (async () => {
            console.log("Starting async initialization");
            if (typeof initialiser_application === "function") {
                try {
                    // Check for entity in URL parameters
                    const urlParams = new URLSearchParams(window.location.search);
                    const entityId = urlParams.get("entity");
                    const entityType = urlParams.get("type");

                    console.log("URL entity check:");
                    console.log("  entityId:", entityId);
                    console.log("  entityType:", entityType);
                    console.log("  window.ui exists:", !!window.ui);

                    if (entityId && entityType) {
                        console.log(`Loading entity from URL: ${entityId} (${entityType})`);
                        // Load the specific entity based on URL parameters
                        // Handle both English and French type names
                        const frenchType = (entityType === "mouvement" || entityType === "movement") ? "mouvement" :
                                          (entityType === "artiste" || entityType === "artist") ? "artiste" :
                                          (entityType === "oeuvre" || entityType === "artwork") ? "oeuvre" : null;

                        if (frenchType && typeof charger_mouvement === "function") {
                            // Set selected entity in state BEFORE loading
                            if (window.ui && window.ui.etat) {
                                window.ui.etat.entite_selectionnee_id = entityId;
                                window.ui.etat.entite_selectionnee_type = frenchType;
                                console.log("Set selected entity:", entityId, frenchType);
                            }

                            if (frenchType === "mouvement") {
                                console.log("Loading movement:", entityId);
                                await charger_mouvement(entityId);
                            } else if (frenchType === "artiste" && typeof charger_artiste === "function") {
                                console.log("Loading artist:", entityId);
                                await charger_artiste(entityId);
                            } else if (frenchType === "oeuvre" && typeof charger_oeuvre === "function") {
                                console.log("Loading artwork:", entityId);
                                await charger_oeuvre(entityId);
                            }
                        } else {
                            // Default to initialiser_application if type doesn't match
                            console.log("Entity type not recognized:", entityType, "using default initialization");
                            await initialiser_application();
                        }
                    } else {
                        console.log("Calling initialiser_application");
                        await initialiser_application();
                        // Set default selected entity for Impressionism
                        if (window.ui && window.ui.etat) {
                            window.ui.etat.entite_selectionnee_id = "Q40415";
                            window.ui.etat.entite_selectionnee_type = "mouvement";
                            console.log("Set default selected entity: Q40415 (mouvement)");
                        }
                    }
                    console.log("initialiser_application completed");
                    console.log("typeof ouvrir_panneau_detail:", typeof ouvrir_panneau_detail);

                    // Make detail panel visible for initial entity
                    if (typeof ouvrir_panneau_detail === "function") {
                        try {
                            const result = await ouvrir_panneau_detail();
                            console.log("Detail panel opened for initial entity, result:", result);
                        } catch (e) {
                            console.error("Error opening detail panel:", e);
                        }
                    } else {
                        console.warn("ouvrir_panneau_detail not found, trying manual state update");
                        // Fallback: manually check if we can trigger detail panel visibility
                        if (window.ui && window.ui.etat) {
                            console.log("Manually updating detail panel state");
                        }
                    }

                    syncShellFromSnapshot(readRuntimeSnapshot());
                    renderConstellation();
                    renderRuntimeState();
                    await refreshMultilingualEntityLabels();
                    window.renderDetailPanel();

                    // Wire up search functionality
                    console.log("Calling wireupSearchBar");
                    wireupSearchBar();
                    console.log("wireupSearchBar completed");
                } catch (error) {
                    console.error("Bootstrap error:", error);
                    runtimeState.lastError = "Bootstrap warning: " + error.message;
                    renderRuntimeState();
                }
            } else {
                console.error("initialiser_application not found!");
            }
        })();

        // Search bar interaction wiring - simplified for inline search
        function wireupSearchBar() {
            const searchInput = document.getElementById("search-input");
            const searchDropdown = document.getElementById("search-results-dropdown");

            console.log("wireupSearchBar: searchInput=", searchInput, "dropdown=", searchDropdown);

            if (!searchInput) {
                console.warn("Search input not found");
                return;
            }

            // Debounce search requests
            let searchTimeout;

            function positionDropdown() {
                const rect = searchInput.getBoundingClientRect();
                searchDropdown.style.top = (rect.bottom + 8) + "px";
                searchDropdown.style.left = rect.left + "px";
                searchDropdown.style.width = rect.width + "px";
            }

            searchInput.addEventListener("input", (e) => {
                const query = e.target.value.trim();
                console.log("Search input changed:", query);

                clearTimeout(searchTimeout);

                if (query.length < 2) {
                    searchDropdown.classList.remove("is-active");
                    searchDropdown.innerHTML = '';
                    return;
                }

                console.log("Searching for:", query);
                searchDropdown.innerHTML = '<div style="padding: 12px; color: var(--text-muted);">Searching...</div>';
                positionDropdown();
                searchDropdown.classList.add("is-active");

                // Debounce the actual search
                searchTimeout = setTimeout(() => {
                    fetch(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(query)}&language=en&format=json&origin=*`)
                        .then(r => r.json())
                        .then(data => {
                            console.log("Search results:", data);
                            if (data.search && data.search.length > 0) {
                                const results = data.search.slice(0, 8).map(item =>
                                    `<div class="search-result-item" data-entity-id="${item.id}">
                                        <strong>${item.label}</strong>
                                        <small>${item.description || ''}</small>
                                    </div>`
                                ).join('');
                                searchDropdown.innerHTML = results;

                                // Add click handlers to results
                                searchDropdown.querySelectorAll(".search-result-item").forEach((item) => {
                                    item.addEventListener("click", function() {
                                        const entityId = this.getAttribute("data-entity-id");
                                        const label = this.querySelector("strong").textContent;
                                        console.log("Clicked result:", entityId, label);
                                        window.location.href = `?entity=${entityId}&type=movement`;
                                    });
                                });
                            } else {
                                searchDropdown.innerHTML = '<div style="padding: 12px; color: var(--text-muted);">No results found</div>';
                            }
                        })
                        .catch(err => {
                            console.error("Search error:", err);
                            searchDropdown.innerHTML = '<div style="padding: 12px; color: var(--accent-coral);">Search error</div>';
                        });
                }, 300);
            });

            // Ctrl+K to focus search
            document.addEventListener("keydown", (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                    e.preventDefault();
                    console.log("Ctrl+K pressed - focusing search input");
                    searchInput.focus();
                }
            });

            // Escape to clear search
            searchInput.addEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                    searchInput.value = '';
                    searchDropdown.classList.remove("is-active");
                    searchDropdown.innerHTML = '';
                }
            });

            // Close dropdown when clicking outside
            document.addEventListener("click", (e) => {
                if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
                    searchDropdown.classList.remove("is-active");
                }
            });

            // Show dropdown when clicking in input (to re-show previous results)
            searchInput.addEventListener("focus", () => {
                if (searchInput.value.length >= 2) {
                    positionDropdown();
                    searchDropdown.classList.add("is-active");
                }
            });

            // Keep dropdown visible when hovering over results
            searchDropdown.addEventListener("mouseenter", () => {
                if (searchDropdown.innerHTML.trim()) {
                    searchDropdown.classList.add("is-active");
                }
            });

            // Reposition dropdown on window resize/scroll
            window.addEventListener("resize", () => {
                if (searchDropdown.classList.contains("is-active")) {
                    positionDropdown();
                }
            });

            window.addEventListener("scroll", () => {
                if (searchDropdown.classList.contains("is-active")) {
                    positionDropdown();
                }
            }, true);

            // Watch for detail panel changes and re-render
            const detailContainer = document.getElementById("detail-panel-container");
            const detailRoot = document.getElementById("__ml_detail_root");

            console.log("Detail panel setup:");
            console.log("  detailContainer:", detailContainer);
            console.log("  detailRoot:", detailRoot);
            console.log("  rendre_panneau_detail:", typeof rendre_panneau_detail);

            if (detailContainer && detailRoot) {
                window.renderDetailPanel();
                return;
            }

            if (false && detailContainer && detailRoot && typeof rendre_panneau_detail === "function") {
                console.log("Setting up detail panel rendering watcher");

                let renderCount = 0;
                setInterval(() => {
                    try {
                        // Ensure UI state is accessible
                        if (window.ui && window.ui.etat) {
                            // Set visibility to true to show panel
                            window.ui.etat.panneau_detail_visible = true;

                            // If no entity selected, try to use the default
                            if (!window.ui.etat.entite_selectionnee_id) {
                                window.ui.etat.entite_selectionnee_id = "Q40415";
                                window.ui.etat.entite_selectionnee_type = "mouvement";
                            }
                        }

                        // Render the detail panel HTML
                        let html = "";

                        // Try multilingual function first
                        if (typeof rendre_panneau_detail === "function") {
                            try {
                                html = rendre_panneau_detail();
                            } catch (e) {
                                console.warn("Error in rendre_panneau_detail:", e);
                            }
                        }

                        // Fallback: render directly if multilingual didn't work
                        if (!html || html.length === 0) {
                            if (window.ui && window.ui.etat) {
                                const entityId = window.ui.etat.entite_selectionnee_id;
                                const entityType = window.ui.etat.entite_selectionnee_type;

                                if (entityId && entityType) {
                                    html = `<div class="detail-section">
                                        <h3>${entityId}</h3>
                                        <p class="detail-row">Type: ${entityType}</p>
                                        <p class="detail-row" style="color: var(--text-muted); font-size: 0.85rem; margin-top: 12px;">Loading detailed information...</p>
                                    </div>`;

                                    if (renderCount === 0) {
                                        console.log("Using fallback detail panel, html length:", html.length);
                                    }
                                }
                            }
                        }

                        renderCount++;

                        if (html && typeof html === "string" && html.length > 0) {
                            detailRoot.innerHTML = html;
                            detailContainer.classList.add("is-active");
                            if (renderCount === 1) {
                                console.log("✓ Detail panel HTML set successfully!");
                            }
                        } else {
                            detailContainer.classList.remove("is-active");
                            if (renderCount === 1) {
                                console.log("✗ Detail panel still empty after fallback");
                                console.log("  detailRoot element:", detailRoot?.tagName);
                                console.log("  Can set innerHTML:", detailRoot && typeof detailRoot.innerHTML !== 'undefined');
                            }
                        }
                    } catch (e) {
                        console.error("Error rendering detail panel:", e);
                    }
                }, 300);
            } else {
                console.error("Detail panel containers not found or rendre_panneau_detail not available!");
            }
        }
