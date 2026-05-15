        // Detail panel rendering delegates to ui.composants.panneau_detail (panneau_detail.multi).
        // The Multilingual sync lowering pass does not emit rendre_panneau_detail into bundle.js,
        // so this bridge is the single definition of window.rendre_panneau_detail.
        window.rendre_panneau_detail = function() {
            try {
                const render = window.ui?.composants?.panneau_detail?.rendre_panneau_detail;
                if (typeof render === "function") {
                    return render() || "";
                }
            } catch (e) {
                console.warn("panneau_detail render error:", e);
            }
            return "";
        };

        window.renderComparisonPanel = function() {
            const container = document.getElementById("comparison-panel-container");
            const root = document.getElementById("__ml_comparison_root");
            if (!container || !root) return;
            try {
                const render = window.ui?.composants?.panneau_comparaison?.rendre_panneau_comparaison;
                const html = typeof render === "function" ? render() || "" : "";
                root.innerHTML = html;
                container.hidden = !html;
            } catch (e) {
                console.warn("comparison panel render error:", e);
            }
        };

        window.renderTrajectoirePanel = function() {
            const container = document.getElementById("trajectoire-panel-container");
            const root = document.getElementById("__ml_trajectoire_root");
            if (!container || !root) return;
            try {
                const render = window.ui?.composants?.trajectoire?.rendre_trajectoire;
                const html = typeof render === "function" ? render() || "" : "";
                root.innerHTML = html;
                container.hidden = !html;
            } catch (e) {
                console.warn("trajectoire panel render error:", e);
            }
            // Refresh detail panel so the Trajectoire button label stays in sync
            window.renderDetailPanel();
        };

        window.renderDetailPanel = function() {
            const detailContainer = document.getElementById("detail-panel-container");
            const detailRoot = document.getElementById("__ml_detail_root");
            const detailVisible = !window.ui || !window.ui.etat || window.ui.etat.panneau_detail_visible !== false;

            if (!detailContainer || !detailRoot) {
                return;
            }

            if (!detailVisible) {
                detailRoot.innerHTML = "";
                detailContainer.classList.remove("is-active");
                return;
            }

            const html = window.rendre_panneau_detail() || "";
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
                    if (typeof applyModeFromUrl === "function") {
                        await applyModeFromUrl();
                    }
                    renderConstellation();
                    renderRuntimeState();
                    await refreshMultilingualEntityLabels();
                    window.renderDetailPanel();
                    window.renderComparisonPanel();
                    window.renderTrajectoirePanel();
                    window.renderStoryTier?.();

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

            async function loadSearchSelection(entityId, entityType, displayLabel) {
                if (window.history && typeof window.history.replaceState === "function") {
                    const params = new URLSearchParams(window.location.search);
                    params.set("entity", entityId);
                    params.set("type", entityType);
                    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
                }
                await charger_selection(entityId, entityType, displayLabel);
            }

            window.loadSearchSelection = loadSearchSelection;


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
                                    const entityType = item.entityType || inferSearchResultType(item);
                                    const trajBtn = (entityType === "artist" || entityType === "artiste")
                                        ? `<button class="trajectoire-btn" data-action="trajectoire" data-traj-id="${item.id}" data-traj-label="${(item.label || item.id).replace(/"/g, '&quot;')}" aria-label="Trajectoire ${item.label || item.id}">+ Trajectoire</button>`
                                        : "";
                                    return `<div class="search-result-item" data-entity-id="${item.id}" data-entity-type="${entityType}">
                                        <strong>${item.label || item.id}</strong>
                                        <small>${item.description || entityType}</small>
                                        <button class="compare-btn" data-action="comparer" data-compare-id="${item.id}" data-compare-type="${entityType}" aria-label="Comparer ${item.label || item.id}">+ Comparer</button>
                                        ${trajBtn}
                                    </div>`
                                }).join('');
                                searchDropdown.innerHTML = markup;

                                // Add click handlers to results
                                searchDropdown.querySelectorAll(".search-result-item").forEach((item) => {
                                    item.addEventListener("click", async function(evt) {
                                        // Intercept trajectoire button clicks
                                        const trajBtn = evt.target.closest("[data-action='trajectoire']");
                                        if (trajBtn) {
                                            evt.stopPropagation();
                                            const trajId = trajBtn.dataset.trajId;
                                            const trajLabel = trajBtn.dataset.trajLabel || trajId;
                                            if (window.ui && window.ui.etat && typeof window.ui.etat.basculer_artiste_trajectoire === "function") {
                                                await window.ui.etat.basculer_artiste_trajectoire(trajId, trajLabel);
                                                window.renderTrajectoirePanel();
                                            }
                                            return;
                                        }

                                        // Intercept compare button clicks before entity load
                                        const compareBtn = evt.target.closest("[data-action='comparer']");
                                        if (compareBtn) {
                                            evt.stopPropagation();
                                            const compareId = compareBtn.dataset.compareId;
                                            const compareTypeRaw = compareBtn.dataset.compareType || "mouvement";
                                            const compareType = (compareTypeRaw === "movement" || compareTypeRaw === "mouvement") ? "mouvement" :
                                                                (compareTypeRaw === "artist" || compareTypeRaw === "artiste") ? "artiste" :
                                                                (compareTypeRaw === "artwork" || compareTypeRaw === "oeuvre") ? "oeuvre" :
                                                                (compareTypeRaw === "museum" || compareTypeRaw === "musee") ? "musee" : compareTypeRaw;
                                            const compareLabel = this.querySelector("strong")?.textContent || compareId;
                                            if (window.ui && window.ui.etat && typeof window.ui.etat.basculer_comparaison === "function") {
                                                window.ui.etat.basculer_comparaison(compareId, compareType, compareLabel);
                                                await window.ui.etat.charger_donnees_comparaison(compareId, compareType);
                                                window.renderComparisonPanel();
                                            }
                                            return;
                                        }
                                        const entityId = this.getAttribute("data-entity-id");
                                        const hintedType = this.getAttribute("data-entity-type") || "movement";
                                        const label = this.querySelector("strong").textContent;
                                        const entityType = await resoudre_type_entite(entityId, hintedType);
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
                window.renderComparisonPanel();
                window.renderTrajectoirePanel();
                return;
            }

        }

