        const modeButtons = Array.from(document.querySelectorAll(".mode-button"));
        const langButtons = Array.from(document.querySelectorAll(".lang-button"));
        const queryDocumentEl = document.getElementById("query-document");
        const heroQueryPreviewEl = document.getElementById("hero-query-preview");
        const queryDocListEl = document.getElementById("query-doc-list");
        const statusChipEl = document.getElementById("status-chip");
        const activeDocChipEl = document.getElementById("active-doc-chip");
        const activeLanguageChipEl = document.getElementById("active-language-chip");
        const queryVariablesEl = document.getElementById("query-variables");
        const queryResponseShapeEl = document.getElementById("query-response-shape");
        const queryExplanationEl = document.getElementById("query-explanation");
        const lensSummaryEl = document.getElementById("lens-summary");
        const polyglotPreviewEl = document.getElementById("polyglot-preview");
        const polyglotStudioPanelEl = document.getElementById("polyglot-studio-panel");
        const polyglotEntitySurfaceEl = document.getElementById("polyglot-card-2-copy");
        const stageTrailTextEl = document.getElementById("stage-trail-text");
        const explorationTrailEl = document.getElementById("exploration-trail");
        const selectedEntityNameEl = document.getElementById("selected-entity-name");
        const selectedEntityTypeEl = document.getElementById("selected-entity-type");
        const selectedEntityMetaEl = document.getElementById("selected-entity-meta");
        const selectedEntityActionEl = document.getElementById("selected-entity-action");
        const constellationNodesEl = document.getElementById("constellation-nodes");
        const constellationLinksEl = document.getElementById("constellation-links");
        const translatableElements = {
            "brand-eyebrow": {
                fr: "Multilingual x Wikidata GraphQL",
                en: "Multilingual x Wikidata GraphQL"
            },
            "brand-title": {
                fr: "MotusArtium",
                en: "MotusArtium"
            },
            "brand-subtitle": {
                fr: "Observatoire polyglotte de requetes pour suivre mouvements, artistes, oeuvres, lieux et influences dans l'histoire de l'art.",
                en: "Polyglot query observatory for tracing movements, artists, works, places, and influence across art history."
            },
            "hero-eyebrow": {
                fr: "Manifeste",
                en: "Manifest"
            },
            "hero-title": {
                fr: "Parcourez l'histoire de l'art a travers des surfaces de requete en direct et des semantiques multilingues.",
                en: "Navigate art history through live query surfaces and multilingual semantics."
            },
            "hero-description": {
                fr: "MotusArtium se conçoit comme un instrument culturel plutot qu'un tableau de bord : un espace ou les documents GraphQL, les relations semantiques et l'exploration linguistique restent visibles ensemble.",
                en: "MotusArtium is designed as a cultural instrument rather than a dashboard: a place where GraphQL documents, semantic relationships, and language-aware exploration are visible at the same time."
            },
            "entry-movements-title": {
                fr: "Commencer par les mouvements",
                en: "Start with Movements"
            },
            "entry-movements-copy": {
                fr: "Entrez par les ecoles, ruptures et successions pour voir l'histoire de l'art se reorganiser comme une constellation vivante.",
                en: "Enter through schools, ruptures, and successions to watch art history reorganize itself as a living constellation."
            },
            "entry-artists-title": {
                fr: "Commencer par les artistes",
                en: "Start with Artists"
            },
            "entry-artists-copy": {
                fr: "Suivez la creation par les personnes, l'influence, le lieu de naissance et l'oeuvre tout en gardant la trajectoire GraphQL visible.",
                en: "Trace creation through people, influence, birthplace, and oeuvre while the active GraphQL path remains visible."
            },
            "entry-themes-title": {
                fr: "Commencer par les themes",
                en: "Start with Themes"
            },
            "entry-themes-copy": {
                fr: "Abordez l'atlas par materiau, sujet, musee ou lieu et laissez l'interface reformuler la lentille narrative.",
                en: "Approach the atlas by material, subject, museum, or place and let the interface reshape the narrative lens."
            },
            "app-root-hint": {
                fr: "<strong>Montage Multilingual :</strong> ce panneau accueille les fragments d'interface Multilingual integres progressivement dans l'Observatory.",
                en: "<strong>Multilingual mount:</strong> this panel is reserved for embedded Multilingual UI fragments and diagnostics as we progressively connect more of the original runtime into the Observatory shell."
            },
            "polyglot-card-1-title": {
                fr: "Surface d'interface",
                en: "Interface Surface"
            },
            "polyglot-card-1-copy": {
                fr: "La coque change invites, libelles et interpretation avec la langue active.",
                en: "The shell changes prompts, labels, and interpretation text with the active language."
            },
            "polyglot-card-2-title": {
                fr: "Surface d'entite",
                en: "Entity Surface"
            },
            "polyglot-card-2-copy": {
                fr: "Les entites selectionnees peuvent etre lues selon plusieurs surfaces linguistiques tout en gardant la meme identite Wikidata.",
                en: "Selected entities can be read through different language surfaces while keeping the same Wikidata identity."
            },
            "polyglot-card-3-title": {
                fr: "Lentille source",
                en: "Source Lens"
            }
        };

        const runtimeState = {
            knownDocs: [],
            currentDocument: "movement_details.graphql",
            currentVariables: {
                id: "Q40415",
                languageCode: "fr"
            },
            currentLanguage: "fr",
            currentMode: "observatory",
            selectedEntity: {
                id: "Q40415",
                type: "Movement",
                name: "Impressionism",
                meta: "Awaiting live GraphQL response"
            },
            responseShape: "{\n  item: {\n    id,\n    label,\n    statements(...)\n  }\n}",
            lastStatus: "Bootstrapping",
            lastError: "",
            lastRequestedEntityId: "",
            multilingualEntityLabels: {},
            stateSnapshot: null
        };

        const modeSummaries = {
            observatory: {
                explanation: "Observatory mode keeps the semantic field central while the Query Mirror remains continuously visible.",
                lens: "Influence-aware, movement-centered, French surface"
            },
            "query-theater": {
                explanation: "Query Theater makes the GraphQL document itself a primary storytelling surface for demos and teaching.",
                lens: "Query-visible, document-forward, demonstrative surface"
            },
            "polyglot-studio": {
                explanation: "Polyglot Studio foregrounds language variation, multilingual labels, and source-aware semantic surfaces.",
                lens: "Language-contrasting, label-sensitive, multilingual surface"
            },
            "temporal-river": {
                explanation: "Temporal River will privilege chronology, succession, and influence flow while reusing the same GraphQL backbone.",
                lens: "Time-weighted, succession-focused, river narrative surface"
            }
        };

        const languageSurfaces = {
            fr: [
                { code: "FR", text: "Rechercher un mouvement, un artiste, une oeuvre..." },
                { code: "EN", text: "Trace a movement, artist, work, or place..." }
            ],
            en: [
                { code: "EN", text: "Trace a movement, artist, work, or place..." },
                { code: "FR", text: "Explorer un courant, un createur, une oeuvre..." }
            ]
        };

        function setActiveButton(buttons, selected) {
            buttons.forEach((button) => {
                button.classList.toggle("is-active", button === selected);
            });
        }

        function ensureKnownDocument(documentName) {
            if (!documentName) {
                return;
            }
            if (!runtimeState.knownDocs.includes(documentName)) {
                runtimeState.knownDocs.push(documentName);
            }
        }

        function inferEntityTypeFromDocument(documentName) {
            if (!documentName) {
                return "Entity";
            }
            if (documentName.includes("movement")) {
                return "Movement";
            }
            if (documentName.includes("artist")) {
                return "Artist";
            }
            if (documentName.includes("artwork")) {
                return "Work";
            }
            if (documentName.includes("museum")) {
                return "Museum";
            }
            return "Entity";
        }

        function findSelectedEntityId(variables) {
            if (!variables) {
                return "";
            }
            return variables.id || variables.movementId || variables.artistId || variables.subjectId || variables.museumId || "";
        }

        function inferLabelFromRecord(record) {
            if (!record || typeof record !== "object") {
                return "";
            }
            return record.movementLabel || record.artistLabel || record.artworkLabel || record.countryLabel || record.label || "";
        }

        function inferIdFromRecord(record) {
            if (!record || typeof record !== "object") {
                return "";
            }
            return record.id || "";
        }

        function buildShapeTree(value, depth = 0) {
            const indent = "  ".repeat(depth);

            if (value == null) {
                return indent + "null";
            }
            if (typeof value === "string") {
                return indent + "string";
            }
            if (typeof value === "number") {
                return indent + "number";
            }
            if (typeof value === "boolean") {
                return indent + "boolean";
            }
            if (Array.isArray(value)) {
                if (!value.length) {
                    return indent + "[]";
                }
                if (depth >= 3) {
                    return indent + "[...]";
                }
                return indent + "[\n" + buildShapeTree(value[0], depth + 1) + "\n" + indent + "]";
            }
            if (typeof value === "object") {
                const keys = Object.keys(value);
                if (!keys.length) {
                    return indent + "{}";
                }
                if (depth >= 3) {
                    return indent + "{...}";
                }
                return indent + "{\n" + keys.slice(0, 8).map((key) => indent + "  " + key + ": " + buildShapeTree(value[key], depth + 1).trimStart()).join("\n") + "\n" + indent + "}";
            }
            return indent + String(value);
        }

        function extractPrimaryEntity(data) {
            if (!data || typeof data !== "object") {
                return null;
            }

            if (data.item && typeof data.item === "object") {
                return {
                    id: inferIdFromRecord(data.item),
                    label: inferLabelFromRecord(data.item),
                    source: "item",
                    count: 1
                };
            }

            if (Array.isArray(data.itemsById) && data.itemsById.length) {
                const first = data.itemsById[0];
                return {
                    id: inferIdFromRecord(first),
                    label: inferLabelFromRecord(first),
                    source: "itemsById",
                    count: data.itemsById.length
                };
            }

            if (data.searchItems && Array.isArray(data.searchItems.edges)) {
                const edges = data.searchItems.edges;
                const firstNode = edges[0] && edges[0].node ? edges[0].node : {};
                return {
                    id: inferIdFromRecord(firstNode),
                    label: inferLabelFromRecord(firstNode),
                    source: "searchItems",
                    count: edges.length
                };
            }

            const rootKeys = Object.keys(data);
            for (const key of rootKeys) {
                const candidate = data[key];
                if (Array.isArray(candidate) && candidate.length && typeof candidate[0] === "object") {
                    return {
                        id: inferIdFromRecord(candidate[0]),
                        label: inferLabelFromRecord(candidate[0]),
                        source: key,
                        count: candidate.length
                    };
                }
            }

            return null;
        }

        function describeResponse(data) {
            const primary = extractPrimaryEntity(data);
            if (primary && primary.source === "searchItems") {
                return primary.count + " linked results from searchItems";
            }
            if (primary && primary.source === "itemsById") {
                return primary.count + " entities loaded with itemsById";
            }
            if (primary && primary.source === "item") {
                return "Single entity resolved via item(...)";
            }
            return "Live GraphQL response";
        }

        function renderQueryDocList() {
            queryDocListEl.innerHTML = "";
            runtimeState.knownDocs.forEach((doc) => {
                const badge = document.createElement("span");
                badge.className = "chip" + (doc === runtimeState.currentDocument ? " is-live" : "");
                badge.textContent = doc;
                queryDocListEl.appendChild(badge);
            });
            statusChipEl.textContent = "GraphQL Live - " + runtimeState.knownDocs.length + " docs - " + runtimeState.lastStatus;
            activeDocChipEl.textContent = runtimeState.currentDocument;
        }

        function applyInterfaceLanguage(languageCode) {
            Object.entries(translatableElements).forEach(([id, values]) => {
                const element = document.getElementById(id);
                if (!element) {
                    return;
                }
                const value = values[languageCode] || values.en || values.fr;
                if (id === "app-root-hint") {
                    element.innerHTML = value;
                } else {
                    element.textContent = value;
                }
            });

            const modeLabels = {
                fr: {
                    observatory: "Observatoire",
                    "query-theater": "Theatre GraphQL",
                    "polyglot-studio": "Studio Polyglotte",
                    "temporal-river": "Riviere Temporelle"
                },
                en: {
                    observatory: "Observatory",
                    "query-theater": "Query Theater",
                    "polyglot-studio": "Polyglot Studio",
                    "temporal-river": "Temporal River"
                }
            };

            modeButtons.forEach((button) => {
                const labels = modeLabels[languageCode] || modeLabels.en;
                button.textContent = labels[button.dataset.mode] || button.textContent;
            });

            const sourceSnippetByLanguage = {
                fr: "asynchrone déf charger_mouvement(id):\n    attendre ui.etat.charger_mouvement(id)",
                en: "async def load_movement(id):\n    await ui.state.load_movement(id)"
            };
            const sourceSnippetEl = document.getElementById("polyglot-source-snippet");
            if (sourceSnippetEl) {
                sourceSnippetEl.textContent = sourceSnippetByLanguage[languageCode] || sourceSnippetByLanguage.en;
            }
        }

        function updatePolyglotStudioVisibility() {
            polyglotStudioPanelEl.classList.toggle("is-visible", runtimeState.currentMode === "polyglot-studio");
        }

        function currentSnapshot() {
            return runtimeState.stateSnapshot || browserAdapterSnapshot();
        }

        async function refreshMultilingualEntityLabels() {
            const snapshot = currentSnapshot();
            const selectedEntity = snapshot.entite_selectionnee || {};
            const entityId = selectedEntity.id || runtimeState.selectedEntity.id || "";
            if (!entityId) {
                runtimeState.multilingualEntityLabels = {};
                return;
            }

            const existingLabels = selectedEntity.labels_multilingues || {};
            if (existingLabels.fr || existingLabels.en) {
                runtimeState.multilingualEntityLabels = existingLabels;
                const summary = Object.entries(existingLabels)
                    .filter(([, label]) => label)
                    .map(([languageCode, label]) => languageCode.toUpperCase() + ": " + label)
                    .join(" | ");

                if (summary) {
                    polyglotEntitySurfaceEl.textContent = summary;
                }
                return;
            }

            const languages = ["fr", "en"];
            const labels = {};

            for (const languageCode of languages) {
                try {
                    labels[languageCode] = await fetchEntityLabelInLanguage(entityId, languageCode);
                } catch (error) {
                    labels[languageCode] = "";
                }
            }

            runtimeState.multilingualEntityLabels = labels;

            const summary = languages
                .filter((languageCode) => labels[languageCode])
                .map((languageCode) => languageCode.toUpperCase() + ": " + labels[languageCode])
                .join(" | ");

            if (summary) {
                polyglotEntitySurfaceEl.textContent = summary;
            }
        }

        function renderSelectedEntity() {
            const snapshot = currentSnapshot();
            const activeEntity = ((snapshot.entite_selectionnee || {}).donnees) || {};
            let metaText = runtimeState.selectedEntity.meta || runtimeState.selectedEntity.id || "Live GraphQL";
            const selectedType = String(runtimeState.selectedEntity.type || "").toLowerCase();
            if (selectedType.includes("work")) {
                const inception = fieldValue(activeEntity, "inceptionDate");
                if (inception) {
                    metaText = "Inception: " + inception.slice(0, 10);
                } else {
                    metaText = "Artwork detail loaded";
                }
            }
            selectedEntityNameEl.textContent = runtimeState.selectedEntity.name || runtimeState.selectedEntity.id || "Awaiting selection";
            selectedEntityTypeEl.textContent = runtimeState.selectedEntity.type || "Entity";
            selectedEntityMetaEl.textContent = metaText;
            selectedEntityActionEl.textContent = runtimeState.currentDocument || "Show Query";

            const labels = runtimeState.multilingualEntityLabels || {};
            const alternates = Object.entries(labels)
                .filter(([code, label]) => code !== runtimeState.currentLanguage && label)
                .map(([code, label]) => code.toUpperCase() + ": " + label);

            if (alternates.length) {
                selectedEntityMetaEl.textContent = metaText + " | " + alternates.join(" | ");
            }
        }

        function renderTrail() {
            const trailItems = [
                { label: "Document", value: runtimeState.currentDocument },
                { label: runtimeState.selectedEntity.type || "Entity", value: runtimeState.selectedEntity.name || runtimeState.selectedEntity.id || "Awaiting response" },
                { label: "Language", value: runtimeState.currentLanguage },
                { label: "Result", value: runtimeState.selectedEntity.meta || "Live GraphQL" }
            ];

            explorationTrailEl.innerHTML = "";
            trailItems.forEach((item) => {
                const wrapper = document.createElement("div");
                wrapper.className = "preset";

                const left = document.createElement("span");
                left.textContent = item.label;

                const right = document.createElement("small");
                right.textContent = item.value;

                wrapper.appendChild(left);
                wrapper.appendChild(right);
                explorationTrailEl.appendChild(wrapper);
            });

            stageTrailTextEl.textContent = "Live trail: " + trailItems.map((item) => item.label + " -> " + item.value).join(" | ");
        }

        function renderRuntimeState() {
            const snapshot = currentSnapshot();
            queryVariablesEl.textContent = JSON.stringify(runtimeState.currentVariables, null, 2);
            queryResponseShapeEl.textContent = runtimeState.responseShape;
            activeLanguageChipEl.textContent = runtimeState.currentLanguage;
            if (runtimeState.lastError) {
                queryExplanationEl.textContent = runtimeState.lastError;
            } else if (snapshot.affichage_chargement) {
                queryExplanationEl.textContent = "Loading live GraphQL data for " + (runtimeState.lastRequestedEntityId || runtimeState.selectedEntity.id || "selection") + ".";
            }
            applyInterfaceLanguage(runtimeState.currentLanguage);
            updatePolyglotStudioVisibility();
            renderQueryDocList();
            renderSelectedEntity();
            renderTrail();
        }

        function inferDisplayLabel(record, fallback) {
            if (!record || typeof record !== "object") {
                return fallback || "Unknown";
            }
            return record.movementLabel || record.artistLabel || record.artworkLabel || record.label || fallback || "Unknown";
        }

        function fieldValue(record, key) {
            if (!record || typeof record !== "object") {
                return "";
            }
            const candidate = record[key];
            if (candidate && typeof candidate === "object" && "value" in candidate) {
                return candidate.value || "";
            }
            return candidate || "";
        }

        function entityIdFromUri(uri) {
            if (!uri || typeof uri !== "string") {
                return "";
            }
            const marker = "/entity/";
            const index = uri.lastIndexOf(marker);
            return index >= 0 ? uri.slice(index + marker.length) : uri;
        }

        async function executeGraphQLDocument(documentName, variables) {
            const query = await fetch("graphql/" + documentName).then((response) => response.text());
            const response = await fetch("https://www.wikidata.org/w/api.php?action=wbgraphql&format=json&origin=*", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query,
                    variables
                })
            });
            runtimeState.lastStatus = "HTTP " + response.status + " for " + documentName;
            const body = await response.json();
            if (body.errors && body.errors.length) {
                const message = body.errors[0].message || "GraphQL error";
                runtimeState.lastError = "GraphQL error in " + documentName + ": " + message;
                runtimeState.responseShape = JSON.stringify(body, null, 2);
                renderRuntimeState();
                throw new Error(message);
            }
            runtimeState.lastError = "";
            return body.data || {};
        }

        async function fetchEntityLabelInLanguage(entityId, languageCode) {
            if (!entityId) {
                return "";
            }
            const data = await executeGraphQLDocument("entity_label.graphql", {
                id: entityId,
                languageCode
            });
            const item = data.item || {};
            return item.label || "";
        }

        function normaliseMovementDetails(item) {
            return {
                id: item.id || "",
                movementLabel: item.movementLabel || "",
                startTime: { value: (((item.startTime || [])[0] || {}).value || {}).time || "" },
                endTime: { value: (((item.endTime || [])[0] || {}).value || {}).time || "" }
            };
        }

        function normaliseArtistsByMovement(edges) {
            return (edges || []).map((edge) => {
                const node = edge && edge.node ? edge.node : {};
                return {
                    artist: { value: node.id ? "http://www.wikidata.org/entity/" + node.id : "" },
                    artistLabel: { value: node.artistLabel || "" },
                    birthDate: { value: (((node.birthDate || [])[0] || {}).value || {}).time || "" },
                    deathDate: { value: (((node.deathDate || [])[0] || {}).value || {}).time || "" }
                };
            });
        }

        function normaliseArtworkDetails(item) {
            return {
                id: item.id || "",
                artworkLabel: item.artworkLabel || "",
                inceptionDate: { value: (((item.inceptionDate || [])[0] || {}).value || {}).time || "" }
            };
        }

        const browserAdapterState = {
            entite_selectionnee_id: "",
            entite_selectionnee_type: "",
            panneau_detail_visible: true,
            mode_visualisation: "observatory",
            affichage_chargement: false,
            message_erreur: "",
            plage_temporelle_debut: 1400,
            plage_temporelle_fin: 2000,
            expandedMovementId: "",
            expandedArtistId: "",
            expandedArtworkId: "",
            focusedArtworkId: "",
            cache_entites: {},
            graphe: {
                noeuds: new Map(),
                relations: []
            }
        };

        function addGraphNode(id, type, label, data) {
            if (!id) {
                return;
            }
            browserAdapterState.graphe.noeuds.set(id, {
                id,
                type,
                etiquette: label,
                donnees: data || {}
            });
        }

        function addGraphRelation(source, target, type) {
            if (!source || !target) {
                return;
            }
            const exists = browserAdapterState.graphe.relations.some((relation) => {
                return relation.source === source && relation.target === target && relation.type === type;
            });
            if (exists) {
                return;
            }
            browserAdapterState.graphe.relations.push({
                source,
                target,
                type
            });
        }

        function removeGraphNodes(nodeIds) {
            const ids = new Set((nodeIds || []).filter(Boolean));
            if (!ids.size) {
                return;
            }

            ids.forEach((id) => {
                browserAdapterState.graphe.noeuds.delete(id);
                delete browserAdapterState.cache_entites[id];
            });

            browserAdapterState.graphe.relations = browserAdapterState.graphe.relations.filter((relation) => {
                return !ids.has(relation.source) && !ids.has(relation.target);
            });
        }

        function relatedTargets(sourceId, relationType) {
            return browserAdapterState.graphe.relations
                .filter((relation) => relation.source === sourceId && relation.type === relationType)
                .map((relation) => relation.target);
        }

        function collapseArtistExpansion(artistId) {
            const workIds = relatedTargets(artistId, "created");
            if (browserAdapterState.expandedArtworkId) {
                collapseArtworkExpansion(browserAdapterState.expandedArtworkId);
            }
            removeGraphNodes(workIds);
            if (browserAdapterState.expandedArtistId === artistId) {
                browserAdapterState.expandedArtistId = "";
            }
            browserAdapterState.focusedArtworkId = "";
        }

        function focusArtworkWithinArtist(artistId, artworkId) {
            const siblingWorkIds = relatedTargets(artistId, "created").filter((id) => id !== artworkId);
            removeGraphNodes(siblingWorkIds);
        }

        function collapseArtworkExpansion(artworkId) {
            const museumIds = relatedTargets(artworkId, "displayed_at");
            const subjectIds = relatedTargets(artworkId, "depicts");
            const materialIds = relatedTargets(artworkId, "made_of");
            removeGraphNodes([...museumIds, ...subjectIds, ...materialIds]);
            if (browserAdapterState.expandedArtworkId === artworkId) {
                browserAdapterState.expandedArtworkId = "";
            }
        }

        function collapseMovementExpansion(movementId) {
            const artistIds = relatedTargets(movementId, "contains_artist");
            artistIds.forEach((artistId) => {
                if (browserAdapterState.expandedArtistId === artistId) {
                    collapseArtistExpansion(artistId);
                }
            });
            removeGraphNodes(artistIds);
            if (browserAdapterState.expandedMovementId === movementId) {
                browserAdapterState.expandedMovementId = "";
            }
        }

        function browserAdapterSnapshot() {
            const selectedId = browserAdapterState.entite_selectionnee_id;
            const selectedType = normaliseDetailEntityType(browserAdapterState.entite_selectionnee_type);
            return {
                entite_selectionnee_id: selectedId,
                entite_selectionnee_type: selectedType,
                panneau_detail_visible: browserAdapterState.panneau_detail_visible,
                mode_visualisation: browserAdapterState.mode_visualisation,
                affichage_chargement: browserAdapterState.affichage_chargement,
                message_erreur: browserAdapterState.message_erreur,
                plage_temporelle_debut: browserAdapterState.plage_temporelle_debut,
                plage_temporelle_fin: browserAdapterState.plage_temporelle_fin,
                mouvement_etendu_id: browserAdapterState.expandedMovementId,
                artiste_etendu_id: browserAdapterState.expandedArtistId,
                oeuvre_etendue_id: browserAdapterState.expandedArtworkId,
                oeuvre_focus_id: browserAdapterState.focusedArtworkId,
                entite_selectionnee: {
                    id: selectedId,
                    type: selectedType,
                    donnees: browserAdapterState.cache_entites[selectedId] || {},
                    labels_multilingues: runtimeState.multilingualEntityLabels || {}
                },
                graphe: {
                    noeuds: Array.from(browserAdapterState.graphe.noeuds.values()).map((node) => ({
                        id: node.id,
                        type: node.type,
                        etiquette: node.etiquette,
                        donnees: node.donnees || {}
                    })),
                    relations: browserAdapterState.graphe.relations.map((relation) => ({
                        source: relation.source,
                        target: relation.target,
                        type: relation.type,
                        poids: 1
                    })),
                    stats: {
                        total_noeuds: browserAdapterState.graphe.noeuds.size,
                        total_relations: browserAdapterState.graphe.relations.length
                    }
                }
            };
        }

        function normaliseDetailEntityType(type) {
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
            return normalised;
        }

        function describeEntityMeta(type, entity) {
            const normalised = String(type || "").toLowerCase();
            if (!entity || typeof entity !== "object") {
                return "";
            }

            if (normalised.includes("work") || normalised.includes("oeuvre")) {
                const inception = fieldValue(entity, "inceptionDate");
                return inception ? ("Inception: " + inception.slice(0, 10)) : "Artwork detail loaded";
            }

            if (normalised.includes("artist") || normalised.includes("artiste")) {
                const birth = fieldValue(entity, "birthDate");
                const death = fieldValue(entity, "deathDate");
                if (birth || death) {
                    return (birth ? birth.slice(0, 10) : "?") + " - " + (death ? death.slice(0, 10) : "?");
                }
                return "Artist detail loaded";
            }

            if (normalised.includes("movement") || normalised.includes("mouvement")) {
                const start = fieldValue(entity, "startTime");
                const end = fieldValue(entity, "endTime");
                if (start || end) {
                    return (start ? start.slice(0, 10) : "?") + " - " + (end ? end.slice(0, 10) : "?");
                }
                return "Movement detail loaded";
            }

            return "";
        }

        function firstStatementItem(statements) {
            const first = (statements || [])[0] || {};
            const value = first.value || {};
            if (!value.id) {
                return null;
            }
            return {
                id: value.id,
                label: value.label || value.content || value.id
            };
        }

        function statementItems(statements) {
            return (statements || []).map((entry) => entry.value || {}).filter((value) => value.id).map((value) => {
                return {
                    id: value.id,
                    label: value.label || value.content || value.id
                };
            });
        }

        function constellationClassForType(type) {
            const normalised = String(type || "").toLowerCase();
            if (normalised.includes("movement") || normalised.includes("mouvement")) {
                return "node--movement";
            }
            if (normalised.includes("artist") || normalised.includes("artiste")) {
                return "node--artist";
            }
            return "node--work";
        }

        function getRuntimeExport(functionName) {
            if (typeof window[functionName] === "function") {
                return window[functionName];
            }
            return null;
        }

        function readRuntimeSnapshot() {
            const runtimeReader = getRuntimeExport("obtenir_etat_courant");
            if (runtimeReader) {
                const snapshot = runtimeReader();
                if (snapshot) {
                    return snapshot;
                }
            }

            if (window.ui && window.ui.etat && typeof window.ui.etat.obtenir_instantane_etat === "function") {
                return window.ui.etat.obtenir_instantane_etat();
            }

            return browserAdapterSnapshot();
        }

        async function invokeRuntimeAction(functionName, fallbackInvoker, args = []) {
            const runtimeAction = getRuntimeExport(functionName);
            if (runtimeAction) {
                await runtimeAction(...args);
            } else if (typeof fallbackInvoker === "function") {
                await fallbackInvoker(...args);
            }

            syncShellFromSnapshot(readRuntimeSnapshot());
            renderConstellation();
            renderRuntimeState();
            await refreshMultilingualEntityLabels();
            if (typeof window.renderDetailPanel === "function") {
                window.renderDetailPanel();
            }
        }

        function loadEntityByNode(node) {
            const normalised = String(node.type || "").toLowerCase();
            if (normalised.includes("movement") || normalised.includes("mouvement")) {
                return invokeRuntimeAction("charger_mouvement", window.ui.etat.charger_mouvement.bind(window.ui.etat), [node.id]);
            }
            if (normalised.includes("artist") || normalised.includes("artiste")) {
                return invokeRuntimeAction("charger_artiste", window.ui.etat.charger_artiste.bind(window.ui.etat), [node.id]);
            }
            return invokeRuntimeAction("charger_oeuvre", window.ui.etat.charger_oeuvre.bind(window.ui.etat), [node.id]);
        }

        function getRenderableNodes() {
            const snapshot = currentSnapshot();
            const allNodes = (((snapshot.graphe || {}).noeuds) || []).slice();
            if (snapshot.oeuvre_focus_id) {
                return allNodes.filter((node) => {
                    const type = String(node.type || "").toLowerCase();
                    if (type.includes("work") || type.includes("oeuvre")) {
                        return node.id === snapshot.oeuvre_focus_id;
                    }
                    return true;
                });
            }
            return allNodes;
        }

        function computeConstellationLayout() {
            const nodes = getRenderableNodes();
            const positions = new Map();

            if (!nodes.length) {
                return positions;
            }

            const selectedId = currentSnapshot().entite_selectionnee_id;
            const selectedNode = nodes.find((node) => node.id === selectedId) || nodes[0];
            positions.set(selectedNode.id, { x: 50, y: 50 });

            const remaining = nodes.filter((node) => node.id !== selectedNode.id);
            remaining.sort((left, right) => {
                const leftType = String(left.type || "");
                const rightType = String(right.type || "");
                if (leftType === rightType) {
                    return String(left.etiquette || left.id).localeCompare(String(right.etiquette || right.id));
                }
                return leftType.localeCompare(rightType);
            });

            remaining.forEach((node, index) => {
                const total = Math.max(remaining.length, 1);
                const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
                const nodeClass = constellationClassForType(node.type);
                const ring = nodeClass === "node--movement" ? 30 : (nodeClass === "node--artist" ? 24 : 18);
                const x = 50 + Math.cos(angle) * ring;
                const y = 50 + Math.sin(angle) * (ring * 0.78);
                positions.set(node.id, {
                    x: Math.max(12, Math.min(88, x)),
                    y: Math.max(14, Math.min(84, y))
                });
            });

            return positions;
        }

        function renderConstellation() {
            const snapshot = currentSnapshot();
            const nodes = getRenderableNodes();
            constellationNodesEl.innerHTML = "";
            constellationLinksEl.innerHTML = "";

            if (!nodes.length) {
                const empty = document.createElement("div");
                empty.className = "constellation-empty";
                empty.textContent = "Awaiting live graph state from Multilingual and Wikidata GraphQL.";
                constellationNodesEl.appendChild(empty);
                return;
            }

            const positions = computeConstellationLayout();
            const selectedId = snapshot.entite_selectionnee_id;
            const seenRelations = new Set();
            const visibleNodeIds = new Set(nodes.map((node) => node.id));

            ((((snapshot.graphe || {}).relations) || [])).forEach((relation) => {
                const key = [relation.source, relation.target, relation.type].join("|");
                if (seenRelations.has(key)) {
                    return;
                }
                seenRelations.add(key);

                if (!visibleNodeIds.has(relation.source) || !visibleNodeIds.has(relation.target)) {
                    return;
                }

                const source = positions.get(relation.source);
                const target = positions.get(relation.target);
                if (!source || !target) {
                    return;
                }

                const dx = target.x - source.x;
                const dy = target.y - source.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                const link = document.createElement("div");
                link.className = "link";
                link.style.left = source.x + "%";
                link.style.top = source.y + "%";
                link.style.width = length + "%";
                link.style.transform = "rotate(" + angle + "deg)";
                constellationLinksEl.appendChild(link);
            });

            nodes.forEach((node) => {
                const position = positions.get(node.id) || { x: 50, y: 50 };
                const nodeEl = document.createElement("button");
                nodeEl.type = "button";
                nodeEl.className = "node " + constellationClassForType(node.type) + (node.id === selectedId ? " is-selected" : "") + (snapshot.affichage_chargement && node.id === runtimeState.lastRequestedEntityId ? " is-loading" : "");
                nodeEl.style.left = position.x + "%";
                nodeEl.style.top = position.y + "%";
                nodeEl.setAttribute("aria-label", (node.etiquette || node.id) + " (" + node.type + ")");

                const label = document.createElement("span");
                label.className = "node-label";
                label.textContent = node.etiquette || node.id;
                nodeEl.appendChild(label);

                nodeEl.addEventListener("click", async () => {
                    try {
                        await loadEntityByNode(node);
                    } catch (error) {
                        runtimeState.lastError = "Constellation selection warning: " + error.message;
                        renderRuntimeState();
                    }
                });

                constellationNodesEl.appendChild(nodeEl);
            });
        }

        function syncShellFromSnapshot(snapshot) {
            runtimeState.stateSnapshot = snapshot || browserAdapterSnapshot();
            const selectedEntity = runtimeState.stateSnapshot.entite_selectionnee || {};
            const selectedRecord = selectedEntity.donnees || {};
            const graphStats = ((runtimeState.stateSnapshot.graphe || {}).stats) || {};
            const derivedType = selectedEntity.type || inferEntityTypeFromDocument(runtimeState.currentDocument);
            const derivedName = inferDisplayLabel(selectedRecord, selectedEntity.id || runtimeState.stateSnapshot.entite_selectionnee_id);
            const fallbackMeta = (graphStats.total_noeuds || 0) + " nodes · " + (graphStats.total_relations || 0) + " relations";

            runtimeState.multilingualEntityLabels = selectedEntity.labels_multilingues || runtimeState.multilingualEntityLabels || {};
            runtimeState.selectedEntity = {
                id: selectedEntity.id || runtimeState.stateSnapshot.entite_selectionnee_id || "",
                type: derivedType || "Entity",
                name: derivedName || selectedEntity.id || "Awaiting response",
                meta: describeEntityMeta(derivedType, selectedRecord) || fallbackMeta
            };
        }

        function applyAdapterStateToShell() {
            syncShellFromSnapshot(browserAdapterSnapshot());
            renderConstellation();
            renderRuntimeState();
            refreshMultilingualEntityLabels();
            if (typeof window.renderDetailPanel === "function") {
                window.renderDetailPanel();
            }
        }

        window.ui = window.ui || {};
        window.ui.etat = {
            async charger_mouvement(mouvementId) {
                runtimeState.lastRequestedEntityId = mouvementId;
                if (browserAdapterState.expandedMovementId === mouvementId && browserAdapterState.entite_selectionnee_id === mouvementId) {
                    collapseMovementExpansion(mouvementId);
                    browserAdapterState.focusedArtworkId = "";
                    browserAdapterState.entite_selectionnee_id = mouvementId;
                    browserAdapterState.entite_selectionnee_type = "Movement";
                    applyAdapterStateToShell();
                    return browserAdapterState.cache_entites[mouvementId] || {};
                }

                if (browserAdapterState.expandedArtistId) {
                    collapseArtistExpansion(browserAdapterState.expandedArtistId);
                }

                // Clear the graph and cache for fresh start
                console.log("Clearing old graph data");
                browserAdapterState.graphe_noeuds = {};
                browserAdapterState.graphe_relations = [];
                browserAdapterState.cache_entites = {};
                browserAdapterState.expandedMovementId = "";
                browserAdapterState.expandedArtistId = "";
                browserAdapterState.focusedArtworkId = "";

                // Clear the graph visualization
                const graphContainer = document.querySelector("svg");
                if (graphContainer) {
                    graphContainer.innerHTML = "";
                    console.log("Cleared SVG graph");
                }

                renderConstellation();
                renderRuntimeState();

                browserAdapterState.affichage_chargement = true;
                browserAdapterState.message_erreur = "";
                browserAdapterState.entite_selectionnee_id = mouvementId;
                browserAdapterState.entite_selectionnee_type = "Movement";

                const details = await executeGraphQLDocument("movement_details.graphql", {
                    id: mouvementId,
                    languageCode: runtimeState.currentLanguage
                });
                const artists = await executeGraphQLDocument("artists_by_movement.graphql", {
                    movementId: mouvementId,
                    languageCode: runtimeState.currentLanguage
                });

                const movement = normaliseMovementDetails(details.item || {});
                browserAdapterState.cache_entites[mouvementId] = movement;
                addGraphNode(mouvementId, "movement", movement.movementLabel, movement);

                const artistRecords = normaliseArtistsByMovement((artists.searchItems || {}).edges || []);
                artistRecords.forEach((artist) => {
                    const artistId = entityIdFromUri(fieldValue(artist, "artist"));
                    if (artistId) {
                        browserAdapterState.cache_entites[artistId] = artist;
                        addGraphNode(artistId, "artist", fieldValue(artist, "artistLabel"), artist);
                        addGraphRelation(mouvementId, artistId, "contains_artist");
                    }
                });

                browserAdapterState.expandedMovementId = mouvementId;
                browserAdapterState.focusedArtworkId = "";
                browserAdapterState.affichage_chargement = false;
                applyAdapterStateToShell();
                return movement;
            },

            async charger_artiste(artisteId) {
                runtimeState.lastRequestedEntityId = artisteId;
                if (browserAdapterState.expandedArtistId === artisteId && browserAdapterState.entite_selectionnee_id === artisteId) {
                    collapseArtistExpansion(artisteId);
                    browserAdapterState.focusedArtworkId = "";
                    browserAdapterState.entite_selectionnee_id = artisteId;
                    browserAdapterState.entite_selectionnee_type = "Artist";
                    applyAdapterStateToShell();
                    return browserAdapterState.cache_entites[artisteId] || {};
                }

                if (browserAdapterState.expandedArtistId && browserAdapterState.expandedArtistId !== artisteId) {
                    collapseArtistExpansion(browserAdapterState.expandedArtistId);
                }

                browserAdapterState.affichage_chargement = true;
                browserAdapterState.message_erreur = "";
                browserAdapterState.entite_selectionnee_id = artisteId;
                browserAdapterState.entite_selectionnee_type = "Artist";

                const details = await executeGraphQLDocument("artist_details.graphql", {
                    id: artisteId,
                    languageCode: runtimeState.currentLanguage
                });
                const artworks = await executeGraphQLDocument("artworks_by_artist.graphql", {
                    artistId: artisteId,
                    languageCode: runtimeState.currentLanguage
                });

                const artist = details.item || {};
                browserAdapterState.cache_entites[artisteId] = artist;
                addGraphNode(artisteId, "artist", artist.artistLabel || artist.label || artisteId, artist);

                (((artworks.searchItems || {}).edges) || []).forEach((edge) => {
                    const node = edge && edge.node ? edge.node : {};
                    if (node.id) {
                        browserAdapterState.cache_entites[node.id] = node;
                        addGraphNode(node.id, "work", node.artworkLabel || node.label || node.id, node);
                        addGraphRelation(artisteId, node.id, "created");
                    }
                });

                browserAdapterState.expandedArtistId = artisteId;
                browserAdapterState.focusedArtworkId = "";
                browserAdapterState.affichage_chargement = false;
                applyAdapterStateToShell();
                return artist;
            },

            async charger_oeuvre(oeuvreId) {
                runtimeState.lastRequestedEntityId = oeuvreId;
                browserAdapterState.affichage_chargement = true;
                browserAdapterState.message_erreur = "";
                browserAdapterState.entite_selectionnee_id = oeuvreId;
                browserAdapterState.entite_selectionnee_type = "Work";

                if (browserAdapterState.expandedArtistId) {
                    focusArtworkWithinArtist(browserAdapterState.expandedArtistId, oeuvreId);
                }
                if (browserAdapterState.expandedArtworkId && browserAdapterState.expandedArtworkId !== oeuvreId) {
                    collapseArtworkExpansion(browserAdapterState.expandedArtworkId);
                }

                const details = await executeGraphQLDocument("artwork_details.graphql", {
                    id: oeuvreId,
                    languageCode: runtimeState.currentLanguage
                });
                const artwork = normaliseArtworkDetails(details.item || {});
                browserAdapterState.cache_entites[oeuvreId] = artwork;
                addGraphNode(oeuvreId, "work", artwork.artworkLabel, artwork);

                const museum = firstStatementItem((details.item || {}).museum);
                if (museum) {
                    browserAdapterState.cache_entites[museum.id] = {
                        label: museum.label
                    };
                    addGraphNode(museum.id, "museum", museum.label, { label: museum.label });
                    addGraphRelation(oeuvreId, museum.id, "displayed_at");
                }

                const subjects = statementItems((details.item || {}).depicts);
                subjects.slice(0, 6).forEach((subject) => {
                    browserAdapterState.cache_entites[subject.id] = {
                        label: subject.label
                    };
                    addGraphNode(subject.id, "subject", subject.label, { label: subject.label });
                    addGraphRelation(oeuvreId, subject.id, "depicts");
                });

                const materials = statementItems((details.item || {}).material);
                materials.slice(0, 4).forEach((material) => {
                    browserAdapterState.cache_entites[material.id] = {
                        label: material.label
                    };
                    addGraphNode(material.id, "material", material.label, { label: material.label });
                    addGraphRelation(oeuvreId, material.id, "made_of");
                });

                browserAdapterState.expandedArtworkId = oeuvreId;
                browserAdapterState.focusedArtworkId = oeuvreId;
                browserAdapterState.affichage_chargement = false;
                applyAdapterStateToShell();
                return artwork;
            },

            async charger_chronologie(debut, fin) {
                runtimeState.lastRequestedEntityId = "chronology";
                browserAdapterState.affichage_chargement = true;
                browserAdapterState.plage_temporelle_debut = debut;
                browserAdapterState.plage_temporelle_fin = fin;
                browserAdapterState.mode_visualisation = "chronology";

                const data = await executeGraphQLDocument("movements_catalog.graphql", {
                    languageCode: runtimeState.currentLanguage
                });
                const edges = ((data.searchItems || {}).edges) || [];
                edges.forEach((edge) => {
                    const node = edge && edge.node ? edge.node : {};
                    if (node.id) {
                        addGraphNode(node.id, "movement", node.movementLabel || node.label || node.id, node);
                    }
                });

                browserAdapterState.affichage_chargement = false;
                applyAdapterStateToShell();
                return data;
            },

            async basculer_visualisation(mode) {
                browserAdapterState.mode_visualisation = mode;
                applyAdapterStateToShell();
                return mode;
            },

            obtenir_entite_selectionnee() {
                return browserAdapterSnapshot().entite_selectionnee;
            },

            obtenir_instantane_etat() {
                return browserAdapterSnapshot();
            }
        };

        function recordDocumentActivity(documentName, documentText) {
            runtimeState.currentDocument = documentName;
            ensureKnownDocument(documentName);
            if (documentText) {
                const trimmed = documentText.trim();
                queryDocumentEl.textContent = trimmed;
                heroQueryPreviewEl.textContent = trimmed.split("\n").slice(0, 8).join("\n");
            }
            renderRuntimeState();
        }

        function recordGraphQLRequest(payload) {
            runtimeState.currentVariables = payload.variables || {};
            runtimeState.currentLanguage = runtimeState.currentVariables.languageCode || runtimeState.currentLanguage;
            const selectedId = findSelectedEntityId(runtimeState.currentVariables);
            runtimeState.selectedEntity = {
                id: selectedId,
                type: inferEntityTypeFromDocument(runtimeState.currentDocument),
                name: selectedId || "Awaiting response",
                meta: selectedId ? "Pending GraphQL response" : "Live GraphQL request"
            };
            renderRuntimeState();
        }

        function recordGraphQLResponse(data) {
            runtimeState.responseShape = buildShapeTree(data);
            const primary = extractPrimaryEntity(data);
            if (primary) {
                if (primary.label) {
                    runtimeState.selectedEntity.name = primary.label;
                }
                if (primary.id) {
                    runtimeState.selectedEntity.id = primary.id;
                }
                runtimeState.selectedEntity.type = inferEntityTypeFromDocument(runtimeState.currentDocument);
                runtimeState.selectedEntity.meta = describeResponse(data);
            } else if (runtimeState.selectedEntity.id) {
                runtimeState.selectedEntity.meta = runtimeState.selectedEntity.id + " via " + runtimeState.currentDocument;
            }
            renderRuntimeState();
        }

        const originalFetch = window.fetch.bind(window);
        window.fetch = async function(resource, options) {
            const target = typeof resource === "string" ? resource : (resource && resource.url) || "";
            const response = await originalFetch(resource, options);

            try {
                if (target.includes("graphql/") && target.endsWith(".graphql")) {
                    const documentName = target.split("/").pop();
                    const text = await response.clone().text();
                    recordDocumentActivity(documentName, text);
                } else if (target.includes("action=wbgraphql")) {
                    let payload = {};
                    if (options && typeof options.body === "string") {
                        payload = JSON.parse(options.body);
                    }
                    recordGraphQLRequest(payload);

                    const body = await response.clone().json();
                    recordGraphQLResponse(body.data || {});
                }
            } catch (error) {
                runtimeState.lastError = "Runtime bridge warning: " + error.message;
                renderRuntimeState();
            }

            return response;
        };

        async function loadQueryPreview(documentName) {
            try {
                const response = await originalFetch("graphql/" + documentName);
                if (!response.ok) {
                    throw new Error("Could not load " + documentName);
                }

                const text = await response.text();
                const trimmed = text.trim();
                queryDocumentEl.textContent = trimmed;
                heroQueryPreviewEl.textContent = trimmed.split("\n").slice(0, 8).join("\n");
                activeDocChipEl.textContent = documentName;
            } catch (error) {
                const fallback = "Unable to load GraphQL preview. The deployed app must ship the graphql/ directory alongside bundle.js.";
                queryDocumentEl.textContent = fallback;
                heroQueryPreviewEl.textContent = fallback;
            }
        }

        async function loadQueryInventory() {
            const docs = [
                "movement_details.graphql",
                "artists_by_movement.graphql",
                "artwork_details.graphql"
            ];

            runtimeState.knownDocs = docs.slice();
            renderQueryDocList();
            await loadQueryPreview(docs[0]);
        }

        function updateLanguageSurface(languageCode) {
            runtimeState.currentLanguage = languageCode;
            activeLanguageChipEl.textContent = languageCode;
            runtimeState.currentVariables = {
                ...runtimeState.currentVariables,
                languageCode: languageCode
            };

            const lines = languageSurfaces[languageCode] || languageSurfaces.fr;
            polyglotPreviewEl.innerHTML = "";
            lines.forEach((line) => {
                const wrapper = document.createElement("div");
                wrapper.className = "polyglot-line";

                const left = document.createElement("span");
                left.textContent = line.code;

                const right = document.createElement("code");
                right.textContent = line.text;

                wrapper.appendChild(left);
                wrapper.appendChild(right);
                polyglotPreviewEl.appendChild(wrapper);
            });

            renderRuntimeState();
        }

        // Map HTML button modes to multilingual visualization modes
        const modeMapping = {
            "observatory": "graphe",
            "query-theater": "chronologie",
            "polyglot-studio": "galaxie",
            "temporal-river": "riviere"
        };

        modeButtons.forEach((button) => {
            button.addEventListener("click", async () => {
                const htmlMode = button.dataset.mode;
                const multilingualMode = modeMapping[htmlMode] || htmlMode;

                console.log(`Mode button clicked: ${htmlMode} -> ${multilingualMode}`);
                setActiveButton(modeButtons, button);
                runtimeState.currentMode = htmlMode;

                const config = modeSummaries[htmlMode];
                if (config) {
                    queryExplanationEl.textContent = config.explanation;
                    lensSummaryEl.textContent = config.lens;
                }

                try {
                    if (typeof window.ui.etat.basculer_visualisation === "function") {
                        console.log(`Calling basculer_visualisation with mode: ${multilingualMode}`);
                        await window.ui.etat.basculer_visualisation(multilingualMode);
                        console.log("basculer_visualisation completed");
                    } else {
                        console.warn("basculer_visualisation not found");
                    }
                } catch (error) {
                    console.error("Error switching visualization mode:", error);
                }

                renderRuntimeState();
            });
        });

        langButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const language = button.dataset.language;
                console.log(`Language button clicked: ${language}`);
                try {
                    setActiveButton(langButtons, button);
                    updateLanguageSurface(language);
                    console.log(`Language switched to: ${language}`);
                } catch (error) {
                    console.error(`Error switching language to ${language}:`, error);
                    runtimeState.lastError = `Language switch failed: ${error.message}`;
                    renderRuntimeState();
                }
            });
        });

        loadQueryInventory();
        updateLanguageSurface("fr");

        // Log available buttons for debugging
        console.log("=== Top Bar Buttons ===");
        console.log("Mode buttons:", modeButtons.length, modeButtons.map(b => b.dataset.mode));
        console.log("Language buttons:", langButtons.length, langButtons.map(b => b.dataset.language));
        console.log("Mode mappings:", modeMapping);

        // Test function for button functionality - call from console: testButtons()
        window.testButtons = function() {
            console.log("\n=== Button Functionality Test ===\n");

            // Test mode buttons
            console.log("Testing mode buttons:");
            modeButtons.forEach((button, index) => {
                const mode = button.dataset.mode;
                const multilingualMode = modeMapping[mode];
                const isActive = button.classList.contains("is-active");
                console.log(`  [${index}] ${mode} -> ${multilingualMode} (active: ${isActive})`);
            });

            // Test language buttons
            console.log("\nTesting language buttons:");
            langButtons.forEach((button, index) => {
                const lang = button.dataset.language;
                const isActive = button.classList.contains("is-active");
                console.log(`  [${index}] ${lang} (active: ${isActive})`);
            });

            // Test search input
            const searchInput = document.getElementById("search-input");
            console.log("\nSearch input status:");
            console.log(`  Found: ${!!searchInput}`);
            console.log(`  Visible: ${searchInput && searchInput.offsetParent !== null}`);
            console.log(`  Focused: ${document.activeElement === searchInput}`);

            // Test detail panel
            const detailPanel = document.getElementById("detail-panel-container");
            console.log("\nDetail panel status:");
            console.log(`  Found: ${!!detailPanel}`);
            console.log(`  Active class: ${detailPanel && detailPanel.classList.contains("is-active")}`);

            console.log("\n=== Button Test Complete ===\n");
            console.log("To test a specific button, click it in the UI or call:");
            console.log("  modeButtons[0].click()  // Click first mode button");
            console.log("  langButtons[1].click()  // Click second language button");
        };

        // Test detail panel rendering
        window.testDetailPanel = function() {
            console.log("\n=== Detail Panel Test ===\n");

            const detailPanel = document.getElementById("detail-panel-container");
            const detailRoot = document.getElementById("__ml_detail_root");

            console.log("Detail panel container:", detailPanel);
            console.log("Detail root:", detailRoot);
            console.log("Detail panel visible class:", detailPanel?.classList.contains("is-active"));
            console.log("Detail root HTML length:", detailRoot?.innerHTML.length || 0);

            // Check state
            if (window.ui && window.ui.etat) {
                console.log("UI state exists");
                console.log("panneau_detail_visible:", window.ui.etat.panneau_detail_visible);
                console.log("entite_selectionnee_id:", window.ui.etat.entite_selectionnee_id);
                console.log("entite_selectionnee_type:", window.ui.etat.entite_selectionnee_type);
            }

            if (typeof rendre_panneau_detail === "function") {
                try {
                    const html = rendre_panneau_detail();
                    console.log("rendre_panneau_detail() returned HTML length:", html?.length || 0);
                    console.log("HTML preview:", html?.substring(0, 200) || "empty");
                } catch (e) {
                    console.error("Error calling rendre_panneau_detail:", e);
                }
            } else {
                console.warn("rendre_panneau_detail function not found");
            }

            if (typeof obtenir_entite_selectionnee === "function") {
                try {
                    const entite = obtenir_entite_selectionnee();
                    console.log("obtenir_entite_selectionnee() returned:", entite);
                } catch (e) {
                    console.error("Error getting selected entity:", e);
                }
            } else {
                console.warn("obtenir_entite_selectionnee function not found");
            }

            console.log("\n=== Detail Panel Test Complete ===\n");
        };

        console.log("Test functions available: testButtons(), testDetailPanel()");
