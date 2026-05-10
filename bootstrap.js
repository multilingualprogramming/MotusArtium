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
            if (normalised.includes("museum") || normalised.includes("musee") || normalised.includes("gallery") || normalised.includes("galerie")) {
                return "musee";
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
                        : type === "musee"
                            ? (readDetailValue(donnees.museumLabel || donnees.label) || entity.id)
                        : type === "sujet"
                            ? (readDetailValue(donnees.subjectLabel || donnees.label) || entity.id)
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
            } else if (type === "musee") {
                const count = readDetailValue(donnees.artworkCount);
                if (count) {
                    metaRows.push(`<p class="detail-row">Oeuvres chargees: ${escapeHtml(count)}</p>`);
                }
            } else if (type === "sujet") {
                const count = readDetailValue(donnees.artworkCount);
                if (count) {
                    metaRows.push(`<p class="detail-row">Oeuvres liees: ${escapeHtml(count)}</p>`);
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

        (async () => {
            if (typeof initialiser_application === "function") {
                try {
                    async function loadInitialEntity(entityId, frenchType) {
                        if (window.ui && window.ui.etat) {
                            window.ui.etat.entite_selectionnee_id = entityId;
                            window.ui.etat.entite_selectionnee_type = frenchType;
                        }

                        if (frenchType === "mouvement") {
                            if (typeof charger_mouvement === "function") {
                                await charger_mouvement(entityId);
                                return true;
                            }
                            if (window.ui && window.ui.etat && typeof window.ui.etat.charger_mouvement === "function") {
                                await window.ui.etat.charger_mouvement(entityId);
                                return true;
                            }
                        } else if (frenchType === "artiste") {
                            if (typeof charger_artiste === "function") {
                                await charger_artiste(entityId);
                                return true;
                            }
                            if (window.ui && window.ui.etat && typeof window.ui.etat.charger_artiste === "function") {
                                await window.ui.etat.charger_artiste(entityId);
                                return true;
                            }
                        } else if (frenchType === "oeuvre") {
                            if (typeof charger_oeuvre === "function") {
                                await charger_oeuvre(entityId);
                                return true;
                            }
                            if (window.ui && window.ui.etat && typeof window.ui.etat.charger_oeuvre === "function") {
                                await window.ui.etat.charger_oeuvre(entityId);
                                return true;
                            }
                        } else if (frenchType === "musee") {
                            if (typeof charger_musee === "function") {
                                await charger_musee(entityId);
                                return true;
                            }
                            if (window.ui && window.ui.etat && typeof window.ui.etat.charger_musee === "function") {
                                await window.ui.etat.charger_musee(entityId);
                                return true;
                            }
                        } else if (frenchType === "sujet") {
                            if (typeof charger_sujet === "function") {
                                await charger_sujet(entityId);
                                return true;
                            }
                            if (window.ui && window.ui.etat && typeof window.ui.etat.charger_sujet === "function") {
                                await window.ui.etat.charger_sujet(entityId);
                                return true;
                            }
                        }

                        return false;
                    }

                    // Check for entity in URL parameters
                    const urlParams = new URLSearchParams(window.location.search);
                    const entityId = urlParams.get("entity");
                    const entityType = urlParams.get("type");

                    if (entityId && entityType) {
                        // Load the specific entity based on URL parameters
                        // Handle both English and French type names
                        const frenchType = (entityType === "mouvement" || entityType === "movement") ? "mouvement" :
                                          (entityType === "artiste" || entityType === "artist") ? "artiste" :
                                          (entityType === "oeuvre" || entityType === "artwork") ? "oeuvre" :
                                          (entityType === "musee" || entityType === "museum" || entityType === "gallery") ? "musee" :
                                          (entityType === "sujet" || entityType === "subject") ? "sujet" : null;

                        if (frenchType) {
                            const loaded = await loadInitialEntity(entityId, frenchType);
                            if (!loaded) {
                                await initialiser_application();
                            }
                        } else {
                            // Default to initialiser_application if type doesn't match
                            await initialiser_application();
                        }
                    } else {
                        await initialiser_application();
                        // Set default selected entity for Impressionism
                        if (window.ui && window.ui.etat) {
                            window.ui.etat.entite_selectionnee_id = "Q40415";
                            window.ui.etat.entite_selectionnee_type = "mouvement";
                        }
                    }

                    // Make detail panel visible for initial entity
                    if (typeof ouvrir_panneau_detail === "function") {
                        try {
                            await ouvrir_panneau_detail();
                        } catch (e) {
                            console.error("Error opening detail panel:", e);
                        }
                    } else {
                        console.warn("ouvrir_panneau_detail not found");
                    }

                    syncShellFromSnapshot(readRuntimeSnapshot());
                    renderConstellation();
                    renderRuntimeState();
                    await refreshMultilingualEntityLabels();
                    window.renderDetailPanel();

                    wireupSearchBar();
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

            if (!searchInput) {
                console.warn("Search input not found");
                return;
            }

            // Debounce search requests
            let searchTimeout;

            function inferSearchResultType(item) {
                const description = String(item.description || "").toLowerCase();

                if (description.includes("museum") || description.includes("gallery") || description.includes("art museum") || description.includes("art gallery")) {
                    return "museum";
                }

                if (description.includes("painter") || description.includes("artist") || description.includes("sculptor")) {
                    return "artist";
                }

                if (description.includes("art movement") || description.includes("movement") || description.includes("style")) {
                    return "movement";
                }

                if (description.includes("painting") || description.includes("artwork") || description.includes("work of art") || description.includes("portrait")) {
                    return "artwork";
                }

                return "subject";
            }

            function rankSearchResultType(type) {
                if (type === "museum") {
                    return 0;
                }
                if (type === "artist") {
                    return 1;
                }
                if (type === "artwork") {
                    return 2;
                }
                if (type === "movement") {
                    return 3;
                }
                if (type === "subject") {
                    return 4;
                }
                return 5;
            }

            function inferTypeFromClaims(claimIds, fallbackType) {
                const ids = new Set(claimIds || []);
                if (ids.has("Q33506") || ids.has("Q207694") || ids.has("Q11635")) {
                    return "museum";
                }
                if (ids.has("Q5")) {
                    return "artist";
                }
                if (ids.has("Q968159")) {
                    return "movement";
                }
                if (ids.has("Q3305213") || ids.has("Q838948")) {
                    return "artwork";
                }
                if (ids.has("Q82550") || ids.has("Q157957") || ids.has("Q1790144")) {
                    return "subject";
                }
                return fallbackType;
            }

            async function resolveSearchResultType(entityId, fallbackType) {
                try {
                    const response = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${encodeURIComponent(entityId)}&props=claims&format=json&origin=*`);
                    const body = await response.json();
                    const entity = ((body.entities || {})[entityId]) || {};
                    const claims = entity.claims || {};
                    const claimIds = [];

                    ["P31", "P279"].forEach((propertyId) => {
                        (claims[propertyId] || []).forEach((claim) => {
                            const id = (((claim || {}).mainsnak || {}).datavalue || {}).value?.id;
                            if (id) {
                                claimIds.push(id);
                            }
                        });
                    });

                    return inferTypeFromClaims(claimIds, fallbackType);
                } catch (error) {
                    console.warn("Could not resolve entity claims for", entityId, error);
                    return fallbackType;
                }
            }

            async function searchEntities(query) {
                const response = await fetch(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(query)}&language=en&format=json&origin=*`);
                const body = await response.json();
                if (body.error) {
                    throw new Error(body.error.info || "Search failed");
                }
                return (body.search || [])
                    .map((item) => ({
                        id: item.id,
                        label: item.label,
                        description: item.description || "",
                        entityType: inferSearchResultType(item)
                    }))
                    .filter((item) => item.id)
                    .sort((left, right) => {
                        const rankDifference = rankSearchResultType(left.entityType) - rankSearchResultType(right.entityType);
                        if (rankDifference !== 0) {
                            return rankDifference;
                        }
                        return String(left.label || "").localeCompare(String(right.label || ""));
                    });
            }

            async function loadSearchSelection(entityId, entityType, displayLabel) {
                const canonicalType = entityType === "artwork"
                    ? "oeuvre"
                    : (entityType === "artist"
                        ? "artiste"
                        : (entityType === "museum"
                            ? "musee"
                            : (entityType === "subject" ? "sujet" : "mouvement")));

                if (window.history && typeof window.history.replaceState === "function") {
                    window.history.replaceState({}, "", `?entity=${encodeURIComponent(entityId)}&type=${encodeURIComponent(entityType)}`);
                }

                if (window.ui && window.ui.etat && typeof window.ui.etat.reinitialiser_graphe === "function") {
                    window.ui.etat.reinitialiser_graphe();
                }

                if (window.ui && window.ui.etat) {
                    if (typeof window.ui.etat.amorcer_entite === "function") {
                        window.ui.etat.amorcer_entite(entityId, canonicalType, displayLabel);
                    }
                    window.ui.etat.entite_selectionnee_id = entityId;
                    window.ui.etat.entite_selectionnee_type = canonicalType;
                }

                if (entityType === "artist") {
                    if (typeof charger_artiste === "function") {
                        await charger_artiste(entityId);
                        return;
                    }
                    if (window.ui && window.ui.etat && typeof window.ui.etat.charger_artiste === "function") {
                        await window.ui.etat.charger_artiste(entityId);
                        return;
                    }
                }

                if (entityType === "artwork") {
                    if (typeof charger_oeuvre === "function") {
                        await charger_oeuvre(entityId);
                        return;
                    }
                    if (window.ui && window.ui.etat && typeof window.ui.etat.charger_oeuvre === "function") {
                        await window.ui.etat.charger_oeuvre(entityId);
                        return;
                    }
                }

                if (entityType === "museum") {
                    if (typeof charger_musee === "function") {
                        await charger_musee(entityId);
                        return;
                    }
                    if (window.ui && window.ui.etat && typeof window.ui.etat.charger_musee === "function") {
                        await window.ui.etat.charger_musee(entityId);
                        return;
                    }
                }

                if (entityType === "subject") {
                    if (typeof charger_sujet === "function") {
                        await charger_sujet(entityId);
                        return;
                    }
                    if (window.ui && window.ui.etat && typeof window.ui.etat.charger_sujet === "function") {
                        await window.ui.etat.charger_sujet(entityId);
                        return;
                    }
                }

                if (typeof charger_mouvement === "function") {
                    await charger_mouvement(entityId);
                    return;
                }
                if (window.ui && window.ui.etat && typeof window.ui.etat.charger_mouvement === "function") {
                    await window.ui.etat.charger_mouvement(entityId);
                }
            }

            function positionDropdown() {
                const rect = searchInput.getBoundingClientRect();
                searchDropdown.style.top = (rect.bottom + 8) + "px";
                searchDropdown.style.left = rect.left + "px";
                searchDropdown.style.width = rect.width + "px";
            }

            searchInput.addEventListener("input", (e) => {
                const query = e.target.value.trim();

                clearTimeout(searchTimeout);

                if (query.length < 2) {
                    searchDropdown.classList.remove("is-active");
                    searchDropdown.innerHTML = '';
                    return;
                }

                searchDropdown.innerHTML = '<div style="padding: 12px; color: var(--text-muted);">Searching...</div>';
                positionDropdown();
                searchDropdown.classList.add("is-active");

                // Debounce the actual search
                searchTimeout = setTimeout(() => {
                    searchEntities(query)
                        .then(results => {
                            if (results.length > 0) {
                                const markup = results.slice(0, 8).map(item => {
                                    const entityType = item.entityType || "movement";
                                    return `<div class="search-result-item" data-entity-id="${item.id}" data-entity-type="${entityType}">
                                        <strong>${item.label || item.id}</strong>
                                        <small>${item.description || entityType}</small>
                                    </div>`
                                }).join('');
                                searchDropdown.innerHTML = markup;

                                // Add click handlers to results
                                searchDropdown.querySelectorAll(".search-result-item").forEach((item) => {
                                    item.addEventListener("click", async function() {
                                        const entityId = this.getAttribute("data-entity-id");
                                        const hintedType = this.getAttribute("data-entity-type") || "movement";
                                        const label = this.querySelector("strong").textContent;
                                        const entityType = await resolveSearchResultType(entityId, hintedType);
                                        searchInput.value = label;
                                        searchDropdown.classList.remove("is-active");
                                        try {
                                            searchDropdown.innerHTML = '<div style="padding: 12px; color: var(--text-muted);">Loading selection...</div>';
                                        await loadSearchSelection(entityId, entityType, label);
                                        } catch (error) {
                                            console.error("Selection loading error:", error);
                                            searchDropdown.classList.add("is-active");
                                            searchDropdown.innerHTML = '<div style="padding: 12px; color: var(--accent-coral);">Selection error</div>';
                                        }
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

            if (detailContainer && detailRoot) {
                window.renderDetailPanel();
                return;
            }

            if (false && detailContainer && detailRoot && typeof rendre_panneau_detail === "function") {
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

                                }
                            }
                        }

                        renderCount++;

                        if (html && typeof html === "string" && html.length > 0) {
                            detailRoot.innerHTML = html;
                            detailContainer.classList.add("is-active");
                        } else {
                            detailContainer.classList.remove("is-active");
                        }
                    } catch (e) {
                        console.error("Error rendering detail panel:", e);
                    }
                }, 300);
            } else {
                console.error("Detail panel containers not found or rendre_panneau_detail not available!");
            }
        }
