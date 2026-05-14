        const modeButtons = Array.from(document.querySelectorAll(".mode-button"));
        const langButtons = Array.from(document.querySelectorAll(".lang-button"));
        const queryDocumentEl = document.getElementById("query-document");
        const heroQueryPreviewEl = document.getElementById("hero-query-preview");
        const queryDocListEl = document.getElementById("query-doc-list");
        const querySessionListEl = document.getElementById("query-session-list");
        const clearSessionButtonEl = document.getElementById("clear-session-button");
        const statusChipEl = document.getElementById("status-chip");
        const activeDocChipEl = document.getElementById("active-doc-chip");
        const activeLanguageChipEl = document.getElementById("active-language-chip");
        const queryVariablesEl = document.getElementById("query-variables");
        const queryResponseShapeEl = document.getElementById("query-response-shape");
        const queryExplanationEl = document.getElementById("query-explanation");
        const lensSummaryEl = document.getElementById("lens-summary");
        const compassCopyEl = document.getElementById("compass-copy");
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
        const constellationZoomOutEl = document.getElementById("constellation-zoom-out");
        const constellationZoomInEl = document.getElementById("constellation-zoom-in");
        const constellationZoomResetEl = document.getElementById("constellation-zoom-reset");
        const constellationZoomReadoutEl = document.getElementById("constellation-zoom-readout");
        const chronologyLoadMoreEl = document.getElementById("chronology-load-more");
        const collectionStatusEl = document.getElementById("collection-status");
        const timelineTrackEl = document.querySelector(".timeline-track");
        const timelineWindowEl = document.querySelector(".timeline-window");
        const timelineLabelsEl = document.querySelector(".timeline-labels");
        const timelineCaptionEl = document.getElementById("timeline-caption");
        const timelineInsightsEl = document.getElementById("timeline-insights");
        const shellEl = document.getElementById("app-shell");
        const compassPoleButtons = Array.from(document.querySelectorAll(".compass-pole[data-lens]"));
        const lensPresetButtons = Array.from(document.querySelectorAll(".preset-button[data-preset]"));

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
            stateSnapshot: null,
            querySession: [],
            requestPhase: "idle",
            queryNarrative: "Awaiting first live GraphQL request.",
            temporalInsights: [],
            temporalFocus: null,
            nextSessionId: 1,
            activeCompassLens: "movement",
            activeLensPreset: "",
            shellFilter: null,
            shellFilterEnabled: false,
            constellationZoom: 1,
            constellationPanX: 0,
            constellationPanY: 0,
            replayingSessionId: 0
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

        const heroActionContent = {
            observatory: {
                fr: [
                    {
                        title: "Lire la constellation",
                        copy: "Commencez par cliquer un mouvement, un artiste ou une oeuvre au centre. Interpretez cette vue comme le champ semantique principal : les noeuds montrent les entites visibles et les liens montrent les relations actives."
                    },
                    {
                        title: "Passer au Theatre GraphQL",
                        copy: "Utilisez ce mode quand vous voulez comprendre la requete en direct. Lisez la colonne Query Mirror comme une trace d'execution : document, variables, forme de reponse, puis mise a jour du graphe."
                    },
                    {
                        title: "Passer a Temporal River",
                        copy: "Utilisez ce mode pour interpreter le graphe par periodes, successions et influences. La rail temporelle montre la fenetre active et la constellation met en avant les entites qui appartiennent a cette tranche."
                    }
                ],
                en: [
                    {
                        title: "Read the Constellation",
                        copy: "Start by clicking a movement, artist, or work in the center. Read this view as the main semantic field: nodes are the visible entities and links are the active relationships."
                    },
                    {
                        title: "Switch to Query Theater",
                        copy: "Use this mode when you want to understand the live query. Read the Query Mirror as an execution trace: document, variables, response shape, then graph update."
                    },
                    {
                        title: "Switch to Temporal River",
                        copy: "Use this mode to interpret the graph through periods, succession, and influence. The temporal rail shows the active window and the constellation highlights the entities that belong to that slice."
                    }
                ]
            },
            "query-theater": {
                fr: [
                    {
                        title: "Choisir une entite",
                        copy: "Cliquez une entite dans la constellation pour declencher une requete. Le centre reste la scene principale, mais l'attention se deplace vers le document GraphQL active."
                    },
                    {
                        title: "Lire la trace de requete",
                        copy: "Interpretez les panneaux de gauche comme une trace pedagogique : Session Flow montre l'ordre des appels, Variables montre l'entree, et Response Shape montre la structure retournee."
                    },
                    {
                        title: "Interpreter la mise a jour",
                        copy: "Comparez le document actif avec les nouveaux noeuds et liens. Si le graphe change, cela signifie que la requete a ouvert une nouvelle branche semantique dans l'observatoire."
                    }
                ],
                en: [
                    {
                        title: "Choose an Entity",
                        copy: "Click an entity in the constellation to trigger a query. The center stays the main stage, but attention shifts to the active GraphQL document."
                    },
                    {
                        title: "Read the Query Trace",
                        copy: "Interpret the left panels as a teaching trace: Session Flow shows call order, Variables shows the input, and Response Shape shows the returned structure."
                    },
                    {
                        title: "Interpret the Update",
                        copy: "Compare the active document with the new nodes and links. When the graph changes, the query has opened a new semantic branch in the observatory."
                    }
                ]
            },
            "temporal-river": {
                fr: [
                    {
                        title: "Fixer une periode",
                        copy: "Selectionnez un mouvement, un artiste ou une oeuvre datee pour etablir une fenetre temporelle. La rail inferieure devient le repere principal pour lire la scene."
                    },
                    {
                        title: "Lire le flux",
                        copy: "Interpretez Temporal Focus, Active Entities et Flow comme un resume chronologique. Ils montrent la plage active, les entites contemporaines et les successions ou influences visibles."
                    },
                    {
                        title: "Comparer centre et temps",
                        copy: "Les noeuds lumineux appartiennent a la fenetre active, les noeuds attenues restent hors plage. Lisez donc la constellation comme une carte temporelle plutot que comme un simple graphe general."
                    }
                ],
                en: [
                    {
                        title: "Set a Time Window",
                        copy: "Select a movement, artist, or dated work to establish a time window. The lower rail becomes the main reference for reading the scene."
                    },
                    {
                        title: "Read the Flow",
                        copy: "Interpret Temporal Focus, Active Entities, and Flow as a chronological summary. They show the active range, overlapping entities, and visible succession or influence paths."
                    },
                    {
                        title: "Compare Center and Time",
                        copy: "Bright nodes belong to the active window, while muted nodes sit outside it. Read the constellation as a temporal map rather than only a general graph."
                    }
                ]
            },
            "polyglot-studio": {
                fr: [
                    {
                        title: "Comparer les langues",
                        copy: "Basculez entre FR et EN pour voir comment les memes entites changent de surface linguistique sans changer d'identite Wikidata."
                    },
                    {
                        title: "Lire les etiquettes",
                        copy: "Interpretez les cartes polyglottes comme plusieurs lectures de la meme source. La variation de libelle n'indique pas une nouvelle entite, mais une nouvelle surface de lecture."
                    },
                    {
                        title: "Relier langue et source",
                        copy: "Gardez un oeil sur le document GraphQL actif pendant que la langue change. Cela montre que la couche multilingue et la couche de requete travaillent ensemble."
                    }
                ],
                en: [
                    {
                        title: "Compare Languages",
                        copy: "Switch between FR and EN to see how the same entities change linguistic surface without changing Wikidata identity."
                    },
                    {
                        title: "Read the Labels",
                        copy: "Interpret the polyglot cards as multiple readings of the same source. A label change does not mean a new entity, only a new reading surface."
                    },
                    {
                        title: "Relate Language and Source",
                        copy: "Keep an eye on the active GraphQL document while the language changes. This shows the multilingual layer and the query layer working together."
                    }
                ]
            }
        };

        const compassLensContent = {
            movement: {
                fr: {
                    title: "Mouvement",
                    summary: "Vue ancree dans les mouvements, successions et branches artistiques.",
                    copy: "Le compas met les mouvements au premier plan: privilegiez les noeuds de mouvement et les lignes de succession pour lire l'evolution des courants."
                },
                en: {
                    title: "Movement",
                    summary: "Movement-anchored view for succession, schools, and artistic branches.",
                    copy: "The compass brings movements forward: prioritize movement nodes and succession lines to read the evolution of styles."
                }
            },
            artist: {
                fr: {
                    title: "Artiste",
                    summary: "Vue centree sur les createurs, influences et trajectoires d'oeuvres.",
                    copy: "Mettez l'accent sur les artistes pour suivre qui cree, qui influence, et comment les branches d'oeuvres se deploient."
                },
                en: {
                    title: "Artist",
                    summary: "Creator-centered view for influence and artwork trajectories.",
                    copy: "Emphasize artists to follow who creates, who influences, and how artwork branches unfold."
                }
            },
            work: {
                fr: {
                    title: "Oeuvre",
                    summary: "Vue concentree sur les oeuvres, sujets, materiaux et lieux d'exposition.",
                    copy: "Cette lentille fait remonter les oeuvres et leurs attaches concretes: sujets, materiaux, musees et relations de creation."
                },
                en: {
                    title: "Work",
                    summary: "Work-focused view for subjects, materials, and display locations.",
                    copy: "This lens brings works and their concrete attachments forward: subjects, materials, museums, and creation links."
                }
            },
            place: {
                fr: {
                    title: "Lieu",
                    summary: "Vue pour les musees, lieux d'exposition et ancrages geographiques.",
                    copy: "Utilisez cette lentille pour lire ou les oeuvres se situent et ou les branches du graphe rencontrent les lieux."
                },
                en: {
                    title: "Place",
                    summary: "Place-oriented view for museums, display contexts, and geography.",
                    copy: "Use this lens to read where works are situated and where graph branches meet places."
                }
            },
            time: {
                fr: {
                    title: "Temps",
                    summary: "Vue privilegiee pour les entites datees, chevauchements et periodes.",
                    copy: "La lentille temporelle fait ressortir les noeuds dates pour prefigurer la lecture de Temporal River meme en mode observatoire."
                },
                en: {
                    title: "Time",
                    summary: "Time-weighted view for dated entities, overlap, and period reading.",
                    copy: "The time lens highlights dated nodes so the observatory already hints at Temporal River style reading."
                }
            },
            influence: {
                fr: {
                    title: "Influence",
                    summary: "Vue pour les chaines d'influence, de succession et de transmission.",
                    copy: "Choisissez cette lentille pour privilegier les liens d'influence et les successions entre mouvements et artistes."
                },
                en: {
                    title: "Influence",
                    summary: "Influence-first view for lineage, succession, and transmission.",
                    copy: "Choose this lens to foreground influence links and succession between movements and artists."
                }
            }
        };

        const lensPresetContent = {
            lineage: {
                fr: {
                    summary: "Preset actif: Lineage. Mouvements, influences et successions deviennent la lecture principale.",
                    copy: "Lineage rassemble les trajectoires de mouvements et d'influence pour raconter comment une branche en precede ou en nourrit une autre."
                },
                en: {
                    summary: "Active preset: Lineage. Movements, influence, and succession become the main reading.",
                    copy: "Lineage gathers movement and influence trajectories to show how one branch precedes or feeds another."
                }
            },
            geography: {
                fr: {
                    summary: "Preset actif: Geography. Musees, lieux et diffusion reorientent la lecture.",
                    copy: "Geography fait remonter les lieux et collections pour lire la circulation des oeuvres et les ancrages du graphe."
                },
                en: {
                    summary: "Active preset: Geography. Museums, places, and diffusion reframe the reading.",
                    copy: "Geography surfaces places and collections to read circulation and spatial anchors across the graph."
                }
            },
            materials: {
                fr: {
                    summary: "Preset actif: Materials. Oeuvres, sujets et materiaux structurent la scene.",
                    copy: "Materials privilegie les ramifications concretes des oeuvres: ce qu'elles representent, de quoi elles sont faites et ou elles sont vues."
                },
                en: {
                    summary: "Active preset: Materials. Works, subjects, and materials structure the scene.",
                    copy: "Materials favors the concrete branches of works: what they depict, what they are made of, and where they are seen."
                }
            },
            "cross-language": {
                fr: {
                    summary: "Preset actif: Cross-Language. Les etiquettes multilingues deviennent un outil de comparaison.",
                    copy: "Cross-Language ne filtre pas severement le graphe: il vous invite surtout a comparer les surfaces FR et EN pour les memes entites."
                },
                en: {
                    summary: "Active preset: Cross-Language. Multilingual labels become the comparison surface.",
                    copy: "Cross-Language does not aggressively filter the graph: it mainly invites you to compare FR and EN surfaces for the same entities."
                }
            }
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
            if (documentName.includes("subject")) {
                return "Subject";
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
            return record.subjectLabel || record.museumLabel || record.movementLabel || record.artistLabel || record.artworkLabel || record.countryLabel || record.label || "";
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

        function trimText(value, maxLength = 140) {
            const text = String(value || "").replace(/\s+/g, " ").trim();
            if (!text) {
                return "";
            }
            return text.length > maxLength ? text.slice(0, maxLength - 1) + "…" : text;
        }

        function summariseVariables(variables) {
            const entries = Object.entries(variables || {}).filter(([, value]) => value !== "" && value != null);
            if (!entries.length) {
                return "No variables";
            }
            return entries.slice(0, 3).map(([key, value]) => key + ": " + value).join(" · ");
        }

        function narrativeForDocument(documentName, variables) {
            const selectedId = findSelectedEntityId(variables);
            const target = selectedId || "current selection";
            const narratives = {
                "movement_details.graphql": "Movement details for " + target + " keep start/end dates and succession visible in the observatory.",
                "movement_evolution.graphql": "Movement evolution for " + target + " traces follows, followed by, and broader lineage.",
                "artists_by_movement.graphql": "Artists linked to " + target + " expand the constellation from movement into people and dated careers.",
                "artist_details.graphql": "Artist details for " + target + " bring lifespan and movement membership into the visible field.",
                "artist_influences.graphql": "Artist influence flow for " + target + " turns inspiration into readable graph and river edges.",
                "artworks_by_artist.graphql": "Works by " + target + " translate an artist selection into a creation timeline.",
                "artwork_details.graphql": "Artwork details for " + target + " keep creation date, museum, and subjects visible with the active query.",
                "artworks_by_museum.graphql": "Museum expansion for " + target + " shows holdings as a live GraphQL collection.",
                "artworks_by_subject.graphql": "Subject expansion for " + target + " reveals artworks that share a semantic theme.",
                "movements_catalog.graphql": "Movement catalog retrieval provides the broad temporal field for timeline and river views.",
                "entity_label.graphql": "Multilingual labels for " + target + " keep the same Wikidata entity readable across French and English surfaces."
            };
            return narratives[documentName] || ("Live GraphQL request through " + documentName + " for " + target + ".");
        }

        function beginQuerySession(documentName, variables) {
            const entry = {
                id: runtimeState.nextSessionId++,
                documentName,
                variables: { ...(variables || {}) },
                status: "loading",
                summary: summariseVariables(variables),
                narrative: narrativeForDocument(documentName, variables)
            };

            runtimeState.requestPhase = "loading";
            runtimeState.queryNarrative = entry.narrative;
            runtimeState.querySession = [entry, ...runtimeState.querySession].slice(0, 8);
            return entry.id;
        }

        function completeQuerySession(sessionId, options = {}) {
            const { data, error, statusText } = options;
            const primary = extractPrimaryEntity(data || {});
            runtimeState.querySession = runtimeState.querySession.map((entry) => {
                if (entry.id !== sessionId) {
                    return entry;
                }

                const summary = error
                    ? trimText(error, 160)
                    : primary
                        ? trimText(describeResponse(data) + " · " + (primary.label || primary.id || "Live entity"))
                        : trimText(statusText || "Live GraphQL response");

                return {
                    ...entry,
                    status: error ? "error" : "success",
                    summary,
                    narrative: error ? ("GraphQL request failed in " + entry.documentName + ": " + trimText(error, 120)) : entry.narrative
                };
            });

            runtimeState.requestPhase = error ? "error" : "success";
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

        function renderHeroActions(languageCode, mode) {
            const cards = heroActionContent[mode] || heroActionContent.observatory;
            const localizedCards = cards[languageCode] || cards.en || cards.fr || [];
            const targets = [
                { titleId: "entry-movements-title", copyId: "entry-movements-copy" },
                { titleId: "entry-artists-title", copyId: "entry-artists-copy" },
                { titleId: "entry-themes-title", copyId: "entry-themes-copy" }
            ];

            targets.forEach((target, index) => {
                const titleEl = document.getElementById(target.titleId);
                const copyEl = document.getElementById(target.copyId);
                const card = localizedCards[index] || localizedCards[localizedCards.length - 1];
                if (!titleEl || !copyEl || !card) {
                    return;
                }
                titleEl.textContent = card.title;
                copyEl.textContent = card.copy;
            });
        }

        function renderQuerySession() {
            if (!querySessionListEl) {
                return;
            }

            const entries = runtimeState.querySession || [];
            if (!entries.length) {
                querySessionListEl.innerHTML = '<div class="session-entry"><strong>Bootstrapping</strong><small>Awaiting first live GraphQL request.</small></div>';
                return;
            }

            querySessionListEl.innerHTML = "";
            entries.forEach((entry, index) => {
                const wrapper = document.createElement("button");
                wrapper.type = "button";
                wrapper.className = "session-entry" + (index === 0 ? " is-live" : "") + (entry.status === "error" ? " is-error" : "") + (entry.id === runtimeState.replayingSessionId ? " is-replaying" : "");
                wrapper.title = runtimeState.currentLanguage === "fr" ? "Cliquer pour rejouer cette requete" : "Click to replay this query";

                const title = document.createElement("strong");
                title.textContent = entry.documentName;

                const meta = document.createElement("small");
                meta.textContent = entry.summary || summariseVariables(entry.variables);

                const detail = document.createElement("small");
                detail.textContent = entry.narrative;

                wrapper.appendChild(title);
                wrapper.appendChild(meta);
                wrapper.appendChild(detail);
                wrapper.addEventListener("click", async () => {
                    await replayQuerySession(entry);
                });
                querySessionListEl.appendChild(wrapper);
            });
        }

        function resetRuntimePresentationState() {
            runtimeState.knownDocs = [];
            runtimeState.currentDocument = "movement_details.graphql";
            runtimeState.currentVariables = {
                id: "Q40415",
                languageCode: runtimeState.currentLanguage || "fr"
            };
            runtimeState.currentMode = "observatory";
            runtimeState.responseShape = "{\n  item: {\n    id,\n    label,\n    statements(...)\n  }\n}";
            runtimeState.lastStatus = "Session cleared";
            runtimeState.lastError = "";
            runtimeState.lastRequestedEntityId = "";
            runtimeState.querySession = [];
            runtimeState.requestPhase = "idle";
            runtimeState.queryNarrative = "Session cleared. Restoring the default Impressionism opening scene.";
            runtimeState.temporalInsights = [];
            runtimeState.temporalFocus = null;
            runtimeState.activeLensPreset = "";
            runtimeState.activeCompassLens = "movement";
            runtimeState.shellFilterEnabled = false;
            runtimeState.multilingualEntityLabels = {};
            runtimeState.constellationZoom = 1;
            runtimeState.constellationPanX = 0;
            runtimeState.constellationPanY = 0;
            buildShellFilter();
            setActiveButton(modeButtons, modeButtons.find((button) => button.dataset.mode === "observatory"));
            renderConstellationZoomControls();
        }

        async function clearSessionHistory() {
            resetRuntimePresentationState();
            if (window.history && typeof window.history.replaceState === "function") {
                window.history.replaceState({}, "", window.location.pathname);
            }

            try {
                if (typeof initialiser_application === "function") {
                    await initialiser_application();
                } else if (window.ui && window.ui.etat && typeof window.ui.etat.charger_mouvement === "function") {
                    await window.ui.etat.charger_mouvement("Q40415");
                }

                syncShellFromSnapshot(readRuntimeSnapshot());
                renderConstellation();
                renderRuntimeState();
                await refreshMultilingualEntityLabels();
                if (typeof window.renderDetailPanel === "function") {
                    window.renderDetailPanel();
                }
            } catch (error) {
                runtimeState.lastError = "Session reset warning: " + error.message;
                renderRuntimeState();
            }
        }

        async function replayQuerySession(entry) {
            if (!entry || !entry.documentName) {
                return;
            }

            runtimeState.replayingSessionId = entry.id || 0;
            renderRuntimeState();

            const variables = entry.variables || {};
            const selectedId = findSelectedEntityId(variables);
            const documentName = entry.documentName;

            try {
                if (documentName === "movement_details.graphql" || documentName === "movement_evolution.graphql" || documentName === "artists_by_movement.graphql") {
                    if (selectedId) {
                        await invokeRuntimeAction("charger_mouvement", window.ui.etat.charger_mouvement.bind(window.ui.etat), [selectedId]);
                        return;
                    }
                }

                if (documentName === "artist_details.graphql" || documentName === "artist_influences.graphql" || documentName === "artworks_by_artist.graphql") {
                    if (selectedId) {
                        await invokeRuntimeAction("charger_artiste", window.ui.etat.charger_artiste.bind(window.ui.etat), [selectedId]);
                        return;
                    }
                }

                if (documentName === "artwork_details.graphql" && selectedId) {
                    await invokeRuntimeAction("charger_oeuvre", window.ui.etat.charger_oeuvre.bind(window.ui.etat), [selectedId]);
                    return;
                }

                if (documentName === "artworks_by_museum.graphql") {
                    const museumId = variables.museumId || selectedId;
                    if (museumId) {
                        await invokeRuntimeAction("charger_musee", window.ui.etat.charger_musee.bind(window.ui.etat), [museumId]);
                        return;
                    }
                }

                if (documentName === "artworks_by_subject.graphql") {
                    const subjectId = variables.subjectId || selectedId;
                    if (subjectId) {
                        await invokeRuntimeAction("charger_sujet", window.ui.etat.charger_sujet.bind(window.ui.etat), [subjectId]);
                        return;
                    }
                }

                if (documentName === "movements_catalog.graphql") {
                    const start = currentSnapshot().plage_temporelle_debut || 1400;
                    const end = currentSnapshot().plage_temporelle_fin || 2000;
                    await window.ui.etat.charger_chronologie(start, end);
                    syncShellFromSnapshot(readRuntimeSnapshot());
                    renderConstellation();
                    renderRuntimeState();
                    return;
                }

                await executeGraphQLDocument(documentName, variables);
                renderRuntimeState();
            } catch (error) {
                runtimeState.lastError = "Session replay warning: " + error.message;
                renderRuntimeState();
            } finally {
                runtimeState.replayingSessionId = 0;
                renderRuntimeState();
            }
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

            if (clearSessionButtonEl) {
                clearSessionButtonEl.textContent = languageCode === "fr" ? "Effacer la session" : "Clear Session";
            }

            const compassLabels = {
                fr: { movement: "Mouvement", artist: "Artiste", work: "Oeuvre", place: "Lieu", time: "Temps", influence: "Influence" },
                en: { movement: "Movement", artist: "Artist", work: "Work", place: "Place", time: "Time", influence: "Influence" }
            };
            compassPoleButtons.forEach((button) => {
                const labels = compassLabels[languageCode] || compassLabels.en;
                button.textContent = labels[button.dataset.lens] || button.textContent;
            });

            const presetLabels = {
                fr: {
                    lineage: ["Lignee", "mouvement vers successeur"],
                    geography: ["Geographie", "pays, musees et diffusion"],
                    materials: ["Materiaux", "oeuvres, sujets et matieres"],
                    "cross-language": ["Interlangue", "etiquettes multilingues"]
                },
                en: {
                    lineage: ["Lineage", "movement to successor"],
                    geography: ["Geography", "country, museums, and diffusion"],
                    materials: ["Materials", "works, subjects, and mediums"],
                    "cross-language": ["Cross-Language", "multilingual labels"]
                }
            };
            lensPresetButtons.forEach((button) => {
                const labels = presetLabels[languageCode] || presetLabels.en;
                const text = labels[button.dataset.preset];
                if (!text) {
                    return;
                }
                const title = button.querySelector("span");
                const detail = button.querySelector("small");
                if (title) {
                    title.textContent = text[0];
                }
                if (detail) {
                    detail.textContent = text[1];
                }
            });

            const sourceSnippetByLanguage = {
                fr: "asynchrone déf charger_mouvement(id):\n    attendre ui.etat.charger_mouvement(id)",
                en: "async def load_movement(id):\n    await ui.state.load_movement(id)"
            };
            const sourceSnippetEl = document.getElementById("polyglot-source-snippet");
            if (sourceSnippetEl) {
                sourceSnippetEl.textContent = sourceSnippetByLanguage[languageCode] || sourceSnippetByLanguage.en;
            }

            renderHeroActions(languageCode, runtimeState.currentMode);
        }

        function updatePolyglotStudioVisibility() {
            const isPolyglotMode = runtimeState.currentMode === "polyglot-studio";
            polyglotStudioPanelEl.classList.toggle("is-visible", isPolyglotMode);

            // Show/hide visualizations based on mode
            const constellationEl = document.querySelector(".constellation");
            const polyglotVizEl = document.getElementById("polyglot-studio-visualization");

            if (constellationEl) {
                constellationEl.style.display = isPolyglotMode ? "none" : "block";
            }

            if (polyglotVizEl) {
                polyglotVizEl.classList.toggle("is-active", isPolyglotMode);

                // Initialize polyglot studio visualization when entering mode
                if (isPolyglotMode && runtimeState.selectedEntity && runtimeState.selectedEntity.id) {
                    initializePolyglotStudioVisualization(runtimeState.selectedEntity.id);
                }
            }
        }

        async function initializePolyglotStudioVisualization(entityId) {
            try {
                const container = document.getElementById("polyglot-studio-visualization");
                if (!container) return;

                const snapshot = currentSnapshot();
                const selectedEntity = snapshot.entite_selectionnee || {};
                const labels = snapshot.entite_selectionnee?.labels_multilingues || {};
                const currentLang = runtimeState.currentLanguage || "fr";
                const displaySideBySide = snapshot.afficher_surfaces_paralleles !== false;

                // Render polyglot studio HTML directly
                let html = "<div class='polyglot-studio-container' role='main' aria-label='Polyglot Studio - Language Explorer'>";

                // Header
                html += "<div class='polyglot-header' role='banner'>";
                html += "<div class='polyglot-title-section'>";
                html += "<h2>Polyglot Studio</h2>";
                html += "<span class='polyglot-hint'>Explore language variations • Ctrl+L to toggle • Ctrl+V for view</span>";
                html += "</div>";
                html += "<div class='polyglot-controls' role='toolbar' aria-label='Language and view controls'>";
                html += "<button class='language-toggle " + (currentLang === "fr" ? "is-active" : "") + "' data-lang='fr' title='French surface (Ctrl+L)' aria-pressed='" + (currentLang === "fr" ? "true" : "false") + "'>Francais</button>";
                html += "<button class='language-toggle " + (currentLang === "en" ? "is-active" : "") + "' data-lang='en' title='English surface (Ctrl+L)' aria-pressed='" + (currentLang === "en" ? "true" : "false") + "'>English</button>";
                html += "<button class='view-toggle' id='polyglot-toggle-view' title='Toggle between side-by-side and tab view (Ctrl+V)' aria-label='View mode toggle'>Changer vue</button>";
                html += "</div>";
                html += "</div>";

                if (displaySideBySide) {
                    // Side-by-side view
                    html += "<div class='polyglot-surfaces'>";
                    html += renderPolyglotSurface(selectedEntity, labels, "fr", entityId);
                    html += renderPolyglotSurface(selectedEntity, labels, "en", entityId);
                    html += "</div>";
                } else {
                    // Tabbed view
                    html += "<div class='polyglot-surface-active'>";
                    html += renderPolyglotSurface(selectedEntity, labels, currentLang, entityId);
                    html += "</div>";
                }

                html += "</div>";
                container.innerHTML = html;

                // Attach event listeners
                attachPolyglotEventListeners(entityId, container);
            } catch (error) {
                console.error("Error initializing polyglot studio visualization:", error);
            }
        }

        function extractLabel(field) {
            if (!field) return null;
            if (typeof field === "string") return field;
            if (field.value && typeof field.value === "string") return field.value;
            if (field.label && typeof field.label === "string") return field.label;
            return null;
        }

        function renderPolyglotSurface(selectedEntity, labels, lang, entityId) {
            const entity = selectedEntity.donnees || selectedEntity || {};
            const entityType = selectedEntity.type || "Entity";

            const langLabels = labels[lang] || {};
            let label = typeof langLabels === "string" ? langLabels : langLabels.label;

            if (!label) {
                if (entityType.toLowerCase().includes("mouvement")) {
                    label = extractLabel(entity.movementLabel) || entity.label || "Movement";
                } else if (entityType.toLowerCase().includes("artist") || entityType.toLowerCase().includes("artiste")) {
                    label = extractLabel(entity.artistLabel) || entity.label || "Artist";
                } else if (entityType.toLowerCase().includes("work") || entityType.toLowerCase().includes("oeuvre")) {
                    label = extractLabel(entity.artworkLabel) || entity.label || "Work";
                } else if (entityType.toLowerCase().includes("museum") || entityType.toLowerCase().includes("musee") || entityType.toLowerCase().includes("gallery") || entityType.toLowerCase().includes("galerie")) {
                    label = extractLabel(entity.museumLabel) || entity.label || "Museum";
                } else {
                    label = entity.label || "Entity";
                }
            }

            let html = "<div class='polyglot-surface surface-" + lang + "' lang='" + lang + "' role='region' aria-label='" + lang.toUpperCase() + " surface'>";

            html += "<div class='entity-header'>";
            html += "<div style='flex: 1'>";
            html += "<h3 class='entity-label'>" + String(label || "Unknown").substring(0, 100) + "</h3>";
            html += "</div>";
            html += "<div style='display: flex; gap: 8px; align-items: center'>";
            html += "<span class='entity-type-badge'>" + (lang === "fr" ? translateEntityType(entityType, "fr") : translateEntityType(entityType, "en")) + "</span>";
            html += "<span class='entity-id' title='Wikidata ID'>" + entityId + "</span>";
            html += "</div>";
            html += "</div>";

            html += "<div class='entity-properties'>";

            const typeStr = String(entityType).toLowerCase();

            if (typeStr.includes("mouvement") || typeStr.includes("movement")) {
                html += renderMovementProperties(entity, lang);
            } else if (typeStr.includes("artiste") || typeStr.includes("artist")) {
                html += renderArtistProperties(entity, lang);
            } else if (typeStr.includes("work") || typeStr.includes("oeuvre")) {
                html += renderArtworkProperties(entity, lang);
            } else if (typeStr.includes("museum") || typeStr.includes("musee") || typeStr.includes("gallery") || typeStr.includes("galerie")) {
                html += renderMuseumProperties(entity, lang);
            }

            html += "</div>";
            html += "</div>";

            return html;
        }

        function translateEntityType(type, lang) {
            const typeStr = String(type).toLowerCase();
            if (lang === "fr") {
                if (typeStr.includes("mouvement")) return "Mouvement";
                if (typeStr.includes("artist") || typeStr.includes("artiste")) return "Artiste";
                if (typeStr.includes("work") || typeStr.includes("oeuvre")) return "Oeuvre";
                if (typeStr.includes("museum") || typeStr.includes("musee") || typeStr.includes("gallery") || typeStr.includes("galerie")) return "Musee";
            }
            if (typeStr.includes("mouvement")) return "Movement";
            if (typeStr.includes("artist") || typeStr.includes("artiste")) return "Artist";
            if (typeStr.includes("work") || typeStr.includes("oeuvre")) return "Artwork";
            if (typeStr.includes("museum") || typeStr.includes("musee") || typeStr.includes("gallery") || typeStr.includes("galerie")) return "Museum";
            return type;
        }

        function relatedValues(entity, fieldName, labelFieldName) {
            const values = [];
            const direct = entity[fieldName];
            const directList = Array.isArray(direct) ? direct : (direct ? [direct] : []);

            directList.forEach((entry) => {
                const value = extractValue(entry);
                if (value && !String(value).startsWith("http://www.wikidata.org/entity/")) {
                    values.push(value);
                } else if (entry && typeof entry === "object") {
                    const nested = entry.value || entry;
                    if (nested && typeof nested.label === "string") {
                        values.push(nested.label);
                    }
                }
            });

            const label = extractValue(entity[labelFieldName]);
            if (label) {
                values.push(label);
            }

            return Array.from(new Set(values.filter(Boolean)));
        }

        function renderMovementProperties(entity, lang) {
            let html = "";
            const startLabel = lang === "fr" ? "Période" : "Period";
            const countriesLabel = lang === "fr" ? "Pays d'origine" : "Countries";
            const precLabel = lang === "fr" ? "Mouvements précurseurs" : "Preceding movements";
            const succLabel = lang === "fr" ? "Mouvements successeurs" : "Succeeding movements";

            html += "<div class='property-section'>";
            html += "<div class='section-title'>" + (lang === "fr" ? "Informations principales" : "Primary information") + "</div>";

            const debut = extractValue(entity.startTime);
            const fin = extractValue(entity.endTime);

            if (debut || fin) {
                const period = (debut || "?") + " - " + (fin || "?");
                html += "<div class='property-group'>";
                html += "<span class='property-label'>" + startLabel + "</span>";
                html += "<span class='property-value'>" + period + "</span>";
                html += "</div>";
            }

            const countryLabels = relatedValues(entity, "country", "countryLabel").join(", ");
            if (countryLabels) {
                html += "<div class='property-group'>";
                html += "<span class='property-label'>" + countriesLabel + "</span>";
                html += "<span class='property-value'>" + countryLabels + "</span>";
                html += "</div>";
            }

            html += "</div>";

            let precMovements = entity.follows || [];
            let succMovements = entity.followedBy || [];

            if (!Array.isArray(precMovements)) {
                precMovements = precMovements ? [precMovements] : [];
            }
            if (!Array.isArray(succMovements)) {
                succMovements = succMovements ? [succMovements] : [];
            }

            if (precMovements.length > 0 || succMovements.length > 0) {
                html += "<div class='property-section'>";
                html += "<div class='section-title'>" + (lang === "fr" ? "Contexte historique" : "Historical context") + "</div>";

                const precLabels = relatedValues(entity, "follows", "followsLabel").join(", ");
                if (precLabels) {
                    html += "<div class='property-group'>";
                    html += "<span class='property-label'>" + precLabel + "</span>";
                    html += "<span class='property-value'>" + precLabels + "</span>";
                    html += "</div>";
                }

                const succLabels = relatedValues(entity, "followedBy", "followedByLabel").join(", ");
                if (succLabels) {
                    html += "<div class='property-group'>";
                    html += "<span class='property-label'>" + succLabel + "</span>";
                    html += "<span class='property-value'>" + succLabels + "</span>";
                    html += "</div>";
                }

                html += "</div>";
            }

            return html;
        }

        function renderArtistProperties(entity, lang) {
            let html = "";
            const datesLabel = lang === "fr" ? "Dates de vie" : "Lifespan";
            const birthplaceLabel = lang === "fr" ? "Lieu de naissance" : "Birthplace";
            const deathplaceLabel = lang === "fr" ? "Lieu de décès" : "Deathplace";
            const movementsLabel = lang === "fr" ? "Mouvements artistiques" : "Artistic movements";

            html += "<div class='property-section'>";
            html += "<div class='section-title'>" + (lang === "fr" ? "Biographie" : "Biography") + "</div>";

            const birthDate = extractValue(entity.birthDate);
            const deathDate = extractValue(entity.deathDate);

            if (birthDate || deathDate) {
                const lifespan = (birthDate || "?") + " - " + (deathDate || "?");
                html += "<div class='property-group'>";
                html += "<span class='property-label'>" + datesLabel + "</span>";
                html += "<span class='property-value'>" + lifespan + "</span>";
                html += "</div>";
            }

            const birthplaceVal = relatedValues(entity, "birthplace", "birthplaceLabel").join(", ");
            if (birthplaceVal) {
                html += "<div class='property-group'>";
                html += "<span class='property-label'>" + birthplaceLabel + "</span>";
                html += "<span class='property-value'>" + birthplaceVal + "</span>";
                html += "</div>";
            }

            const deathplaceVal = relatedValues(entity, "deathplace", "deathplaceLabel").join(", ");
            if (deathplaceVal) {
                html += "<div class='property-group'>";
                html += "<span class='property-label'>" + deathplaceLabel + "</span>";
                html += "<span class='property-value'>" + deathplaceVal + "</span>";
                html += "</div>";
            }

            html += "</div>";

            let movements = entity.movement || [];
            if (!Array.isArray(movements)) {
                movements = movements ? [movements] : [];
            }

            if (movements.length > 0) {
                html += "<div class='property-section'>";
                html += "<div class='section-title'>" + (lang === "fr" ? "Affiliations artistiques" : "Artistic affiliations") + "</div>";

                const movementLabels = relatedValues(entity, "movement", "movementLabel").join(", ");
                if (movementLabels) {
                    html += "<div class='property-group'>";
                    html += "<span class='property-label'>" + movementsLabel + "</span>";
                    html += "<span class='property-value'>" + movementLabels + "</span>";
                    html += "</div>";
                }

                html += "</div>";
            }

            return html;
        }

        function extractValue(field) {
            if (!field) return "";
            if (typeof field === "string") return field;
            if (typeof field === "object") {
                if (typeof field.value === "string") return field.value;
                if (typeof field.label === "string") return field.label;
                if (typeof field.content === "string") return field.content;
                if (typeof field.time === "string") return field.time;
            }
            return "";
        }

        function renderArtworkProperties(entity, lang) {
            let html = "";
            const creatorLabel = lang === "fr" ? "Créateur" : "Creator";
            const dateLabel = lang === "fr" ? "Date de création" : "Date created";
            const museumLabel = lang === "fr" ? "Localisation" : "Location";
            const materialLabel = lang === "fr" ? "Matériaux" : "Materials";
            const depictsLabel = lang === "fr" ? "Sujets représentés" : "Subjects depicted";

            html += "<div class='property-section'>";
            html += "<div class='section-title'>" + (lang === "fr" ? "Informations principales" : "Primary information") + "</div>";

            // Creator
            const creatorVal = relatedValues(entity, "creator", "creatorLabel").join(", ");
            if (creatorVal) {
                html += "<div class='property-group'>";
                html += "<span class='property-label'>" + creatorLabel + "</span>";
                html += "<span class='property-value'>" + creatorVal + "</span>";
                html += "</div>";
            }

            // Date
            const dateVal = extractValue(entity.inceptionDate || entity.creationDate);
            if (dateVal) {
                let year = String(dateVal);
                // Handle ISO format like "+1503-00-00T00:00:00Z" or "-500-00-00T00:00:00Z"
                year = year.replace(/^[+-]/, "").substring(0, 4);
                html += "<div class='property-group'>";
                html += "<span class='property-label'>" + dateLabel + "</span>";
                html += "<span class='property-value'>" + year + "</span>";
                html += "</div>";
            }

            // Museum
            const museumVal = relatedValues(entity, "museum", "museumLabel").join(", ");
            if (museumVal) {
                html += "<div class='property-group'>";
                html += "<span class='property-label'>" + museumLabel + "</span>";
                html += "<span class='property-value'>" + museumVal + "</span>";
                html += "</div>";
            }

            html += "</div>";

            // Materials and subjects
            let materials = entity.material || [];
            let depicts = entity.depicts || entity.subject || [];

            if (!Array.isArray(materials)) materials = materials ? [materials] : [];
            if (!Array.isArray(depicts)) depicts = depicts ? [depicts] : [];

            if (materials.length > 0 || depicts.length > 0) {
                html += "<div class='property-section'>";
                html += "<div class='section-title'>" + (lang === "fr" ? "Caractéristiques physiques" : "Physical characteristics") + "</div>";

                if (materials.length > 0) {
                    const materialLabels = relatedValues(entity, "material", "materialLabel").join(", ");
                    if (materialLabels) {
                        html += "<div class='property-group'>";
                        html += "<span class='property-label'>" + materialLabel + "</span>";
                        html += "<span class='property-value'>" + materialLabels + "</span>";
                        html += "</div>";
                    }
                }

                if (depicts.length > 0) {
                    const depictLabels = relatedValues(entity, entity.depicts ? "depicts" : "subject", entity.depictsLabel ? "depictsLabel" : "subjectLabel").join(", ");
                    if (depictLabels) {
                        html += "<div class='property-group'>";
                        html += "<span class='property-label'>" + depictsLabel + "</span>";
                        html += "<span class='property-value'>" + depictLabels + "</span>";
                        html += "</div>";
                    }
                }

                html += "</div>";
            }

            return html;
        }

        function renderMuseumProperties(entity, lang) {
            let html = "";
            const countryLabel = lang === "fr" ? "Pays" : "Country";
            const locationLabel = lang === "fr" ? "Lieu" : "Location";
            const inceptionLabel = lang === "fr" ? "Fondation" : "Founded";
            const collectionLabel = lang === "fr" ? "Oeuvres chargees" : "Loaded works";
            const websiteLabel = lang === "fr" ? "Site web" : "Website";

            html += "<div class='property-section'>";
            html += "<div class='section-title'>" + (lang === "fr" ? "Informations principales" : "Primary information") + "</div>";

            const inception = extractValue(entity.inceptionDate || entity.foundedDate);
            if (inception) {
                html += "<div class='property-group'>";
                html += "<span class='property-label'>" + inceptionLabel + "</span>";
                html += "<span class='property-value'>" + String(inception).replace(/^[+-]/, "").substring(0, 10) + "</span>";
                html += "</div>";
            }

            const countries = relatedValues(entity, "country", "countryLabel").join(", ");
            if (countries) {
                html += "<div class='property-group'>";
                html += "<span class='property-label'>" + countryLabel + "</span>";
                html += "<span class='property-value'>" + countries + "</span>";
                html += "</div>";
            }

            const locations = relatedValues(entity, "location", "locationLabel").join(", ");
            if (locations) {
                html += "<div class='property-group'>";
                html += "<span class='property-label'>" + locationLabel + "</span>";
                html += "<span class='property-value'>" + locations + "</span>";
                html += "</div>";
            }

            const website = extractValue(entity.officialWebsite || entity.website);
            if (website) {
                html += "<div class='property-group'>";
                html += "<span class='property-label'>" + websiteLabel + "</span>";
                html += "<span class='property-value'>" + website + "</span>";
                html += "</div>";
            }

            const artworkCount = entity.artworkCount || entity.collectionCount;
            if (artworkCount) {
                html += "<div class='property-group'>";
                html += "<span class='property-label'>" + collectionLabel + "</span>";
                html += "<span class='property-value'>" + artworkCount + "</span>";
                html += "</div>";
            }

            html += "</div>";
            return html;
        }

        function attachPolyglotEventListeners(entityId, container) {
            const langButtons = container.querySelectorAll(".language-toggle");
            const viewToggle = container.querySelector("#polyglot-toggle-view");
            const entityLinks = container.querySelectorAll(".entity-link");

            langButtons.forEach((btn) => {
                btn.addEventListener("click", async () => {
                    const lang = btn.dataset.lang;
                    if (window.ui && window.ui.etat && typeof window.ui.etat.basculer_langue === "function") {
                        await window.ui.etat.basculer_langue(lang);
                    }
                    runtimeState.currentLanguage = lang;
                    initializePolyglotStudioVisualization(entityId);
                });
            });

            if (viewToggle) {
                viewToggle.addEventListener("click", async () => {
                    if (window.ui && window.ui.etat && typeof window.ui.etat.basculer_affichage_surfaces === "function") {
                        window.ui.etat.basculer_affichage_surfaces();
                    }
                    initializePolyglotStudioVisualization(entityId);
                });
            }

            entityLinks.forEach((link) => {
                link.addEventListener("click", async (e) => {
                    e.preventDefault();
                    const linkedEntityId = link.dataset.entityId;
                    const linkedEntityType = link.dataset.entityType || "unknown";
                    if (linkedEntityId && window.selectEntity) {
                        await window.selectEntity(linkedEntityId, linkedEntityType);
                        initializePolyglotStudioVisualization(linkedEntityId);
                    }
                });
            });
        }

        function setShellMode(mode) {
            if (document.body) {
                document.body.dataset.mode = mode;
            }
            if (shellEl) {
                shellEl.dataset.mode = mode;
            }
        }

        function selectedLensConfig(languageCode) {
            const activePreset = runtimeState.activeLensPreset;
            if (activePreset && lensPresetContent[activePreset]) {
                return lensPresetContent[activePreset][languageCode] || lensPresetContent[activePreset].en;
            }
            const activeLens = runtimeState.activeCompassLens || "movement";
            return (compassLensContent[activeLens] && (compassLensContent[activeLens][languageCode] || compassLensContent[activeLens].en)) || null;
        }

        function relationMatchesLensType(relationType, lens) {
            const type = String(relationType || "");
            const groups = {
                movement: ["contains_artist", "follows", "followed_by", "contains_movement"],
                artist: ["contains_artist", "created", "influenced", "influenced_by"],
                work: ["created", "depicts", "made_of", "displayed_at", "houses_work", "subject_of"],
                place: ["displayed_at", "houses_work"],
                time: ["follows", "followed_by", "influenced", "influenced_by", "created"],
                influence: ["follows", "followed_by", "influenced", "influenced_by", "contains_movement"]
            };
            return (groups[lens] || []).includes(type);
        }

        function nodeMatchesLensType(node, lens) {
            const type = String((node && node.type) || "").toLowerCase();
            const record = (node && node.donnees) || {};
            if (lens === "movement") {
                return type.includes("movement") || type.includes("mouvement");
            }
            if (lens === "artist") {
                return type.includes("artist") || type.includes("artiste");
            }
            if (lens === "work") {
                return type.includes("work") || type.includes("oeuvre") || type.includes("subject") || type.includes("material");
            }
            if (lens === "place") {
                return type.includes("museum") || type.includes("musee") || Boolean(record.countryLabel);
            }
            if (lens === "time") {
                return Boolean(fieldDate(record, ["startTime", "endTime", "birthDate", "deathDate", "inceptionDate", "creationDate"]));
            }
            if (lens === "influence") {
                return type.includes("movement") || type.includes("mouvement") || type.includes("artist") || type.includes("artiste");
            }
            return true;
        }

        function getEffectiveLensKey() {
            const preset = runtimeState.activeLensPreset;
            if (preset === "lineage") {
                return "influence";
            }
            if (preset === "geography") {
                return "place";
            }
            if (preset === "materials") {
                return "work";
            }
            if (preset === "cross-language") {
                return "";
            }
            if (!runtimeState.shellFilterEnabled) {
                return "";
            }
            return runtimeState.activeCompassLens || "movement";
        }

        function buildShellFilter() {
            const preset = runtimeState.activeLensPreset || "";
            const effectiveLens = getEffectiveLensKey();
            runtimeState.shellFilter = {
                lens: runtimeState.activeCompassLens || "",
                preset,
                effectiveLens
            };
        }

        function nodeMatchesShellFilter(node, snapshot) {
            const filter = runtimeState.shellFilter;
            if (!filter || (!filter.effectiveLens && !filter.preset)) {
                return true;
            }

            if (filter.preset === "cross-language") {
                return true;
            }

            if (node && node.id && node.id === ((snapshot || {}).entite_selectionnee_id || "")) {
                return true;
            }

            return nodeMatchesLensType(node, filter.effectiveLens);
        }

        function relationMatchesShellFilter(relation, visibleNodeIds) {
            const filter = runtimeState.shellFilter;
            if (!filter || (!filter.effectiveLens && !filter.preset)) {
                return true;
            }
            if (filter.preset === "cross-language") {
                return true;
            }
            if (!visibleNodeIds.has(relation.source) || !visibleNodeIds.has(relation.target)) {
                return false;
            }
            return relationMatchesLensType(relation.type, filter.effectiveLens);
        }

        function getLegendLabels(selectedType, lens) {
            const lang = runtimeState.currentLanguage || "en";
            const isFr = lang === "fr";
            const labels = {
                influence: {
                    top: isFr ? "Succession" : "Succession",
                    bottom: isFr ? "Artistes / Oeuvres" : "Artists / Works",
                    left: isFr ? "Influencé par" : "Influenced by",
                    right: isFr ? "A influencé" : "Influenced"
                },
                time: {
                    top: isFr ? "Antérieurs" : "Earlier",
                    bottom: "",
                    left: isFr ? "Prédécesseurs" : "Predecessors",
                    right: isFr ? "Successeurs" : "Successors"
                },
                artist: {
                    top: isFr ? "Mouvements" : "Movements",
                    bottom: isFr ? "Oeuvres" : "Works",
                    left: isFr ? "Influences reçues" : "Influenced by",
                    right: isFr ? "Influences données" : "Influenced"
                },
                place: {
                    top: isFr ? "Musées / Lieux" : "Museums / Places",
                    bottom: "",
                    left: "",
                    right: ""
                },
                work: {
                    top: isFr ? "Exposé à" : "Exhibited at",
                    bottom: "",
                    left: isFr ? "Sujets représentés" : "Subjects depicted",
                    right: isFr ? "Matériaux" : "Materials"
                }
            };
            if (labels[lens]) return labels[lens];
            // Default by entity type
            if (selectedType.includes("movement") || selectedType.includes("mouvement")) {
                return {
                    top: isFr ? "Mouvements successeurs" : "Successor movements",
                    bottom: isFr ? "Artistes" : "Artists",
                    left: isFr ? "Prédécesseurs" : "Predecessors",
                    right: ""
                };
            }
            if (selectedType.includes("artist") || selectedType.includes("artiste")) {
                return {
                    top: isFr ? "Mouvements" : "Movements",
                    bottom: isFr ? "Oeuvres créées" : "Created works",
                    left: isFr ? "Influencé par" : "Influenced by",
                    right: isFr ? "A influencé" : "Influenced"
                };
            }
            if (selectedType.includes("work") || selectedType.includes("oeuvre")) {
                return { top: isFr ? "Musée" : "Museum", bottom: "", left: isFr ? "Sujets" : "Subjects", right: isFr ? "Matériaux" : "Materials" };
            }
            return { top: "", bottom: "", left: "", right: "" };
        }

        function renderConstellationLegend() {
            const legendEl = document.getElementById("constellation-legend");
            if (!legendEl) return;
            const selectedType = String((runtimeState.selectedEntity && runtimeState.selectedEntity.type) || "").toLowerCase();
            const lens = runtimeState.activeCompassLens || "movement";
            const labels = getLegendLabels(selectedType, lens);
            const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text || ""; };
            set("legend-top", labels.top);
            set("legend-bottom", labels.bottom);
            set("legend-left", labels.left);
            set("legend-right", labels.right);
        }

        function countNodesForLens(lens) {
            const snapshot = currentSnapshot();
            const nodes = (((snapshot.graphe || {}).noeuds) || []);
            if (!nodes.length) return 0;
            return nodes.filter((node) => nodeMatchesLensType(node, lens)).length;
        }

        function updateCompassCore() {
            const coreEl = document.querySelector(".compass-core");
            if (!coreEl) return;
            const activeLens = runtimeState.activeCompassLens || "movement";
            const entity = runtimeState.selectedEntity;

            const labelEl = coreEl.querySelector(".compass-core-label");
            if (labelEl) {
                const lensDisplay = activeLens.charAt(0).toUpperCase() + activeLens.slice(1);
                labelEl.textContent = lensDisplay;
            }

            let entityEl = coreEl.querySelector(".compass-core-entity");
            const name = entity && entity.name;
            const isPlaceholder = !name || name === "Impressionism" || name === "Awaiting response";
            if (!isPlaceholder) {
                if (!entityEl) {
                    entityEl = document.createElement("span");
                    entityEl.className = "compass-core-entity";
                    coreEl.appendChild(entityEl);
                }
                const firstWord = name.split(" ")[0];
                entityEl.textContent = firstWord.length > 10 ? firstWord.slice(0, 9) + "…" : firstWord;
                entityEl.title = name;
            } else if (entityEl) {
                entityEl.remove();
            }
        }

        function renderLensControls() {
            const hasPreset = Boolean(runtimeState.activeLensPreset);
            compassPoleButtons.forEach((button) => {
                const isActive = !hasPreset && button.dataset.lens === runtimeState.activeCompassLens;
                button.classList.toggle("is-active", isActive);
                button.classList.toggle("is-muted", hasPreset);
                button.classList.toggle("is-primary", isActive);
                const lens = button.dataset.lens;
                const count = countNodesForLens(lens);
                if (count > 0) {
                    button.dataset.count = count;
                } else {
                    delete button.dataset.count;
                }
            });
            lensPresetButtons.forEach((button) => {
                const isActive = button.dataset.preset === runtimeState.activeLensPreset;
                button.classList.toggle("is-active", isActive);
                button.classList.toggle("is-muted", !isActive && hasPreset);
            });
            updateCompassCore();
        }

        function updateLensNarrative() {
            const languageCode = runtimeState.currentLanguage || "en";
            const config = selectedLensConfig(languageCode);
            if (config) {
                lensSummaryEl.textContent = config.summary;
                if (compassCopyEl) {
                    compassCopyEl.textContent = config.copy;
                }
            }
        }

        async function applyShellLens(lens, preset = "", enableFilter = true) {
            runtimeState.activeCompassLens = lens || runtimeState.activeCompassLens || "movement";
            runtimeState.activeLensPreset = preset;
            runtimeState.shellFilterEnabled = enableFilter;
            buildShellFilter();
            renderLensControls();
            updateLensNarrative();
            const config = selectedLensConfig(runtimeState.currentLanguage || "en");
            if (config) {
                queryExplanationEl.textContent = config.copy;
            }
            renderConstellation();
            renderRuntimeState();
        }

        function currentSnapshot() {
            return runtimeState.stateSnapshot || browserAdapterSnapshot();
        }

        function currentEntityRecord() {
            const snapshot = currentSnapshot();
            const selectedEntity = snapshot.entite_selectionnee || {};
            const selectedId = selectedEntity.id || snapshot.entite_selectionnee_id || runtimeState.selectedEntity.id || "";
            const records = [];

            if (selectedEntity.donnees && typeof selectedEntity.donnees === "object") {
                records.push(selectedEntity.donnees);
            }

            if (selectedId && browserAdapterState.cache_entites[selectedId]) {
                records.push(browserAdapterState.cache_entites[selectedId]);
            }

            const graphNodes = (((snapshot.graphe || {}).noeuds) || []);
            const graphNode = graphNodes.find((node) => node.id === selectedId);
            if (graphNode && graphNode.donnees && typeof graphNode.donnees === "object") {
                records.push(graphNode.donnees);
            }

            return records.find((record) => record && Object.keys(record).length) || {};
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
            const activeEntity = currentEntityRecord();
            let metaText = describeEntityMeta(runtimeState.selectedEntity.type, activeEntity) || runtimeState.selectedEntity.meta || runtimeState.selectedEntity.id || "Live GraphQL";
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
            const snapshot = currentSnapshot();
            const trailItems = [
                { label: "Document", value: runtimeState.currentDocument },
                { label: runtimeState.selectedEntity.type || "Entity", value: runtimeState.selectedEntity.name || runtimeState.selectedEntity.id || "Awaiting response" },
                { label: "Language", value: runtimeState.currentMode === "polyglot-studio" ? (snapshot.mode_langue_actif || "fr").toUpperCase() : runtimeState.currentLanguage },
                { label: "Result", value: runtimeState.selectedEntity.meta || "Live GraphQL" }
            ];

            // Add polyglot studio view mode indicator
            if (runtimeState.currentMode === "polyglot-studio" && snapshot.afficher_surfaces_paralleles !== undefined) {
                const viewMode = snapshot.afficher_surfaces_paralleles ? "Side-by-side" : "Tabs";
                trailItems.push({ label: "View", value: viewMode });
            }

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
            } else {
                queryExplanationEl.textContent = runtimeState.queryNarrative;
            }
            applyInterfaceLanguage(runtimeState.currentLanguage);
            updatePolyglotStudioVisibility();
            setShellMode(runtimeState.currentMode);
            renderLensControls();
            updateLensNarrative();
            renderQueryDocList();
            renderQuerySession();
            renderSelectedEntity();
            renderTrail();
            renderTimeline();
            renderChronologyPaginationButton();
        }

        function renderChronologyPaginationButton() {
            if (!chronologyLoadMoreEl) {
                return;
            }
            const collectionKind = activeCollectionKind();
            const paginationKind = collectionKindHasMore(collectionKind) ? collectionKind : "";
            const hasMore = paginationKind !== "";
            chronologyLoadMoreEl.style.display = hasMore ? "inline-flex" : "none";
            chronologyLoadMoreEl.disabled = !hasMore || browserAdapterState.affichage_chargement;
            renderCollectionStatus(collectionKind);
            if (paginationKind === "movementArtists") {
                chronologyLoadMoreEl.textContent = runtimeState.currentLanguage === "fr" ? "Charger plus d'artistes" : "Load more artists";
                chronologyLoadMoreEl.setAttribute("aria-label", chronologyLoadMoreEl.textContent);
            } else if (paginationKind === "artistWorks") {
                chronologyLoadMoreEl.textContent = runtimeState.currentLanguage === "fr" ? "Charger plus d'oeuvres" : "Load more works";
                chronologyLoadMoreEl.setAttribute("aria-label", chronologyLoadMoreEl.textContent);
            } else if (paginationKind === "museumWorks") {
                chronologyLoadMoreEl.textContent = runtimeState.currentLanguage === "fr" ? "Charger plus d'oeuvres" : "Load more works";
                chronologyLoadMoreEl.setAttribute("aria-label", chronologyLoadMoreEl.textContent);
            } else {
                chronologyLoadMoreEl.textContent = runtimeState.currentLanguage === "fr" ? "Charger plus de mouvements" : "Load more movements";
                chronologyLoadMoreEl.setAttribute("aria-label", chronologyLoadMoreEl.textContent);
            }
        }

        function renderCollectionStatus(collectionKind) {
            if (!collectionStatusEl) {
                return;
            }

            const status = collectionStatus(collectionKind);
            collectionStatusEl.style.display = status ? "block" : "none";
            collectionStatusEl.textContent = status;
        }

        function renderConstellationZoomControls() {
            const zoom = runtimeState.constellationZoom || 1;
            const panX = runtimeState.constellationPanX || 0;
            const panY = runtimeState.constellationPanY || 0;
            const transform = "translate(" + panX + "px, " + panY + "px) scale(" + zoom + ")";
            if (constellationLinksEl) {
                constellationLinksEl.style.transform = transform;
            }
            if (constellationNodesEl) {
                constellationNodesEl.style.transform = transform;
                constellationNodesEl.classList.toggle("is-zoomed", zoom >= 1.3);
            }
            if (constellationZoomReadoutEl) {
                constellationZoomReadoutEl.textContent = Math.round(zoom * 100) + "%";
            }
            if (constellationZoomOutEl) {
                constellationZoomOutEl.disabled = zoom <= 0.3;
            }
            if (constellationZoomInEl) {
                constellationZoomInEl.disabled = zoom >= 2.5;
            }
            const constellationEl = document.querySelector(".constellation");
            if (constellationEl) {
                constellationEl.classList.add("can-pan");
            }
            renderConstellationMinimap();
        }

        function renderConstellationMinimap() {
            const canvas = document.getElementById("constellation-minimap");
            if (!canvas) return;
            const zoom = runtimeState.constellationZoom || 1;
            const isVisible = zoom > 1.05;
            canvas.classList.toggle("is-visible", isVisible);
            if (!isVisible) return;

            const ctx = canvas.getContext("2d");
            const W = canvas.width;
            const H = canvas.height;
            ctx.clearRect(0, 0, W, H);

            const positions = runtimeState.lastConstellationPositions;
            const nodes = getRenderableNodes();
            const snapshot = currentSnapshot();
            const selectedId = snapshot.entite_selectionnee_id;

            if (positions && nodes.length) {
                nodes.forEach((node) => {
                    const pos = positions.get(node.id);
                    if (!pos) return;
                    const cx = pos.x / 100 * W;
                    const cy = pos.y / 100 * H;
                    const isSelected = node.id === selectedId;
                    const ntype = String(node.type || "").toLowerCase();
                    let color;
                    if (isSelected) {
                        color = "rgba(214,164,88,0.95)";
                    } else if (ntype.includes("movement") || ntype.includes("mouvement")) {
                        color = "rgba(214,164,88,0.55)";
                    } else if (ntype.includes("artist") || ntype.includes("artiste")) {
                        color = "rgba(77,182,172,0.55)";
                    } else {
                        color = "rgba(238,161,200,0.55)";
                    }
                    ctx.beginPath();
                    ctx.arc(cx, cy, isSelected ? 3 : 1.8, 0, Math.PI * 2);
                    ctx.fillStyle = color;
                    ctx.fill();
                });
            }

            // Viewport rectangle: solve for visible % range given pan and zoom
            const constellationEl = document.querySelector(".constellation");
            if (constellationEl) {
                const cRect = constellationEl.getBoundingClientRect();
                const panX = runtimeState.constellationPanX || 0;
                const panY = runtimeState.constellationPanY || 0;
                const panXPct = panX / cRect.width * 100;
                const panYPct = panY / cRect.height * 100;
                const xMin = Math.max(0, 50 + (-50 - panXPct) / zoom);
                const xMax = Math.min(100, 50 + (50 - panXPct) / zoom);
                const yMin = Math.max(0, 50 + (-50 - panYPct) / zoom);
                const yMax = Math.min(100, 50 + (50 - panYPct) / zoom);
                ctx.strokeStyle = "rgba(139,233,253,0.6)";
                ctx.lineWidth = 1;
                ctx.strokeRect(xMin / 100 * W, yMin / 100 * H, (xMax - xMin) / 100 * W, (yMax - yMin) / 100 * H);
            }
        }

        function setConstellationZoom(nextZoom) {
            runtimeState.constellationZoom = clamp(nextZoom, 0.3, 2.5);
            renderConstellationZoomControls();
        }

        function activeCollectionKind() {
            if (browserAdapterState.mode_visualisation === "chronologie") {
                return "chronology";
            }

            const type = String(browserAdapterState.entite_selectionnee_type || "").toLowerCase();
            const selectedEntityId = browserAdapterState.entite_selectionnee_id || "";
            const isMovementSelection = type.includes("movement") || type.includes("mouvement");
            if (
                isMovementSelection &&
                selectedEntityId &&
                browserAdapterState.expandedMovementId === selectedEntityId &&
                browserAdapterState.movementArtistsSourceId === selectedEntityId
            ) {
                return "movementArtists";
            }

            const isArtistSelection = type.includes("artist") || type.includes("artiste");
            if (
                isArtistSelection &&
                selectedEntityId &&
                browserAdapterState.expandedArtistId === selectedEntityId &&
                browserAdapterState.artistWorksSourceId === selectedEntityId
            ) {
                return "artistWorks";
            }

            const isMuseumSelection = type.includes("museum") || type.includes("musee");
            if (
                isMuseumSelection &&
                selectedEntityId &&
                browserAdapterState.expandedMuseumId === selectedEntityId &&
                browserAdapterState.museumWorksSourceId === selectedEntityId
            ) {
                return "museumWorks";
            }

            return "";
        }

        function collectionKindHasMore(collectionKind) {
            if (collectionKind === "chronology") {
                return browserAdapterState.chronologyHasNextPage;
            }
            if (collectionKind === "movementArtists") {
                return browserAdapterState.movementArtistsHasNextPage;
            }
            if (collectionKind === "artistWorks") {
                return browserAdapterState.artistWorksHasNextPage;
            }
            if (collectionKind === "museumWorks") {
                return browserAdapterState.museumWorksHasNextPage;
            }
            return false;
        }

        function collectionStatus(collectionKind) {
            if (!collectionKind) {
                return "";
            }

            const hasMore = collectionKindHasMore(collectionKind);
            if (collectionKind === "chronology") {
                const loaded = countNodesByType("movement");
                return collectionStatusText("Movement catalog", loaded, hasMore);
            }
            if (collectionKind === "movementArtists") {
                const loaded = relatedTargets(browserAdapterState.movementArtistsSourceId, "contains_artist").length;
                return collectionStatusText("Artists linked to movement", loaded, hasMore);
            }
            if (collectionKind === "artistWorks") {
                const loaded = relatedTargets(browserAdapterState.artistWorksSourceId, "created").length;
                return collectionStatusText("Works by artist", loaded, hasMore);
            }
            if (collectionKind === "museumWorks") {
                const loaded = relatedTargets(browserAdapterState.museumWorksSourceId, "houses_work").length;
                return collectionStatusText("Collection holdings", loaded, hasMore);
            }
            return "";
        }

        function collectionStatusText(label, loaded, hasMore) {
            const suffix = hasMore ? "more available" : "complete page set";
            return label + " · " + loaded + " loaded · " + suffix;
        }

        function countNodesByType(typeName) {
            const target = String(typeName || "").toLowerCase();
            const nodes = Array.from(browserAdapterState.graphe.noeuds.values());
            return nodes.filter((node) => String(node.type || "").toLowerCase().includes(target)).length;
        }

        function activePaginationKind() {
            const collectionKind = activeCollectionKind();
            return collectionKindHasMore(collectionKind) ? collectionKind : "";
        }

        async function fetchChronologyPage(afterCursor) {
            const data = await executeGraphQLDocument("movements_catalog.graphql", {
                languageCode: runtimeState.currentLanguage,
                first: browserAdapterState.chronologyPageSize,
                after: afterCursor || null
            });

            const searchItems = (data.searchItems || {});
            const edges = searchItems.edges || [];
            const pageInfo = searchItems.pageInfo || {};
            browserAdapterState.chronologyCursor = pageInfo.endCursor || null;
            browserAdapterState.chronologyHasNextPage = !!pageInfo.hasNextPage;

            edges.forEach((edge) => {
                const node = edge && edge.node ? edge.node : {};
                if (node.id) {
                    addGraphNode(node.id, "movement", node.movementLabel || node.label || node.id, node);
                }
            });

            return data;
        }

        async function fetchArtistWorksPage(artistId, afterCursor) {
            const data = await executeGraphQLDocument("artworks_by_artist.graphql", {
                artistId: artistId,
                languageCode: runtimeState.currentLanguage,
                first: browserAdapterState.artistWorksPageSize,
                after: afterCursor || null
            });

            const searchItems = (data.searchItems || {});
            const edges = searchItems.edges || [];
            const pageInfo = searchItems.pageInfo || {};
            browserAdapterState.artistWorksCursor = pageInfo.endCursor || null;
            browserAdapterState.artistWorksHasNextPage = !!pageInfo.hasNextPage;
            browserAdapterState.artistWorksSourceId = artistId;

            edges.forEach((edge) => {
                const node = edge && edge.node ? edge.node : {};
                if (node.id) {
                    browserAdapterState.cache_entites[node.id] = node;
                    addGraphNode(node.id, "work", node.artworkLabel || node.label || node.id, node);
                    addGraphRelation(artistId, node.id, "created");
                }
            });

            return data;
        }

        async function fetchMuseumWorksPage(museumId, afterCursor) {
            const data = await executeGraphQLDocument("artworks_by_museum.graphql", {
                museumId: museumId,
                languageCode: runtimeState.currentLanguage,
                first: browserAdapterState.museumWorksPageSize,
                after: afterCursor || null
            });

            const searchItems = (data.searchItems || {});
            const edges = searchItems.edges || [];
            const pageInfo = searchItems.pageInfo || {};
            browserAdapterState.museumWorksCursor = pageInfo.endCursor || null;
            browserAdapterState.museumWorksHasNextPage = !!pageInfo.hasNextPage;
            browserAdapterState.museumWorksSourceId = museumId;

            edges.forEach((edge) => {
                const node = edge && edge.node ? edge.node : {};
                if (node.id) {
                    browserAdapterState.cache_entites[node.id] = {
                        ...node
                    };
                    addGraphNode(node.id, "work", node.artworkLabel || node.label || node.id, node);
                    addGraphRelation(museumId, node.id, "houses_work");
                }
            });

            const museumRecord = browserAdapterState.cache_entites[museumId] || {};
            browserAdapterState.cache_entites[museumId] = {
                ...museumRecord,
                artworkCount: relatedTargets(museumId, "houses_work").length
            };

            return data;
        }

        async function fetchMovementArtistsPage(movementId, afterCursor) {
            const data = await executeGraphQLDocument("artists_by_movement.graphql", {
                movementId: movementId,
                languageCode: runtimeState.currentLanguage,
                first: browserAdapterState.movementArtistsPageSize,
                after: afterCursor || null
            });

            const searchItems = (data.searchItems || {});
            const edges = searchItems.edges || [];
            const pageInfo = searchItems.pageInfo || {};
            browserAdapterState.movementArtistsCursor = pageInfo.endCursor || null;
            browserAdapterState.movementArtistsHasNextPage = !!pageInfo.hasNextPage;
            browserAdapterState.movementArtistsSourceId = movementId;

            const artistRecords = normaliseArtistsByMovement(edges);
            artistRecords.forEach((artist) => {
                const artistId = entityIdFromUri(fieldValue(artist, "artist"));
                if (artistId) {
                    browserAdapterState.cache_entites[artistId] = artist;
                    addGraphNode(artistId, "artist", fieldValue(artist, "artistLabel"), artist);
                    addGraphRelation(movementId, artistId, "contains_artist");
                }
            });

            return data;
        }

        function inferDisplayLabel(record, fallback) {
            if (!record || typeof record !== "object") {
                return fallback || "Unknown";
            }
            return record.subjectLabel || record.museumLabel || record.movementLabel || record.artistLabel || record.artworkLabel || record.label || fallback || "Unknown";
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

        function unwrapDateValue(candidate) {
            if (!candidate) {
                return "";
            }
            if (typeof candidate === "string") {
                return candidate;
            }
            if (Array.isArray(candidate)) {
                for (const entry of candidate) {
                    const value = unwrapDateValue(entry);
                    if (value) {
                        return value;
                    }
                }
                return "";
            }
            if (typeof candidate === "object") {
                if (typeof candidate.time === "string") {
                    return candidate.time;
                }
                if ("value" in candidate) {
                    return unwrapDateValue(candidate.value);
                }
                if (typeof candidate.content === "string") {
                    return candidate.content;
                }
            }
            return "";
        }

        function fieldDate(record, keys) {
            if (!record || typeof record !== "object") {
                return "";
            }
            for (const key of keys) {
                const value = unwrapDateValue(record[key]);
                if (value) {
                    return value;
                }
            }
            return "";
        }

        function extractYear(dateValue) {
            if (!dateValue) {
                return null;
            }
            const match = String(dateValue).match(/([+-]?\d{1,6})/);
            if (!match) {
                return null;
            }
            const year = Number.parseInt(match[1], 10);
            return Number.isFinite(year) ? year : null;
        }

        function formatTimelineYear(year) {
            if (!Number.isFinite(year)) {
                return "";
            }
            return year < 0 ? (Math.abs(year) + " BCE") : String(year);
        }

        function clamp(number, min, max) {
            return Math.min(Math.max(number, min), max);
        }

        function buildTimelineModel(entityType, entity) {
            const type = String(entityType || "").toLowerCase();
            let startDate = "";
            let endDate = "";
            let pointDate = "";
            let label = "Timeline unavailable";

            if (type.includes("movement") || type.includes("mouvement")) {
                startDate = fieldDate(entity, ["startTime", "startDate", "inceptionDate"]);
                endDate = fieldDate(entity, ["endTime", "endDate", "dissolvedDate"]);
                label = startDate || endDate ? "Movement period" : "Movement dates unavailable";
            } else if (type.includes("artist") || type.includes("artiste")) {
                startDate = fieldDate(entity, ["birthDate", "birthTime"]);
                endDate = fieldDate(entity, ["deathDate", "deathTime"]);
                label = startDate || endDate ? "Artist lifespan" : "Artist dates unavailable";
            } else if (type.includes("work") || type.includes("oeuvre")) {
                pointDate = fieldDate(entity, ["inceptionDate", "creationDate"]);
                label = pointDate ? "Work creation date" : "Work date unavailable";
            }

            const startYear = extractYear(startDate);
            const endYear = extractYear(endDate);
            const pointYear = extractYear(pointDate);

            if (Number.isFinite(startYear) || Number.isFinite(endYear)) {
                const resolvedStart = Number.isFinite(startYear) ? startYear : endYear;
                const resolvedEnd = Number.isFinite(endYear) ? endYear : startYear;
                const span = Math.max(20, Math.abs(resolvedEnd - resolvedStart));
                const padding = Math.max(10, Math.round(span * 0.2));
                return {
                    rangeStart: resolvedStart - padding,
                    rangeEnd: resolvedEnd + padding,
                    windowStart: resolvedStart,
                    windowEnd: resolvedEnd,
                    label,
                    caption: formatTimelineYear(resolvedStart) + " - " + formatTimelineYear(resolvedEnd)
                };
            }

            if (Number.isFinite(pointYear)) {
                return {
                    rangeStart: pointYear - 20,
                    rangeEnd: pointYear + 20,
                    windowStart: pointYear,
                    windowEnd: pointYear,
                    label,
                    caption: formatTimelineYear(pointYear)
                };
            }

            return {
                rangeStart: 1400,
                rangeEnd: 2000,
                windowStart: 1540,
                windowEnd: 1760,
                label,
                caption: "No dated field found"
            };
        }

        function temporalEventFromRecord(node) {
            const record = (node && node.donnees) || {};
            const type = String((node && node.type) || "").toLowerCase();
            const label = (node && node.etiquette) || inferDisplayLabel(record, node && node.id);
            let start = null;
            let end = null;

            if (type.includes("movement")) {
                start = extractYear(fieldDate(record, ["startTime", "startDate", "inceptionDate"]));
                end = extractYear(fieldDate(record, ["endTime", "endDate", "dissolvedDate"]));
            } else if (type.includes("artist")) {
                start = extractYear(fieldDate(record, ["birthDate", "birthTime"]));
                end = extractYear(fieldDate(record, ["deathDate", "deathTime"]));
            } else if (type.includes("work")) {
                start = extractYear(fieldDate(record, ["inceptionDate", "creationDate"]));
                end = start;
            }

            if (!Number.isFinite(start) && !Number.isFinite(end)) {
                return null;
            }

            return {
                id: node.id,
                type: node.type,
                label,
                start: Number.isFinite(start) ? start : end,
                end: Number.isFinite(end) ? end : start
            };
        }

        function relationNarrative(relation, snapshot) {
            const nodes = (((snapshot || {}).graphe || {}).noeuds) || [];
            const source = nodes.find((node) => node.id === relation.source);
            const target = nodes.find((node) => node.id === relation.target);
            const sourceLabel = source ? source.etiquette : relation.source;
            const targetLabel = target ? target.etiquette : relation.target;
            const relationLabels = {
                follows: "follows",
                followed_by: "followed by",
                influenced_by: "influenced by",
                influenced: "influenced",
                created: "created",
                contains_artist: "contains artist"
            };
            return sourceLabel + " " + (relationLabels[relation.type] || relation.type.replace(/_/g, " ")) + " " + targetLabel;
        }

        function deriveTemporalInsights(snapshot) {
            const nodes = (((snapshot || {}).graphe || {}).noeuds) || [];
            const relations = (((snapshot || {}).graphe || {}).relations) || [];
            const events = nodes.map(temporalEventFromRecord).filter(Boolean).sort((left, right) => (left.start || 0) - (right.start || 0));
            const selectedId = (snapshot || {}).entite_selectionnee_id || runtimeState.selectedEntity.id;
            const focusEvent = events.find((event) => event.id === selectedId) || events[0] || null;
            const focus = focusEvent || {
                start: 1400,
                end: 2000,
                label: "Temporal field",
                type: "Entity"
            };
            const activeEvents = events.filter((event) => event.start <= focus.end && event.end >= focus.start);
            const activeIds = new Set(activeEvents.map((event) => event.id));
            const succession = relations
                .filter((relation) => relation.type === "follows" || relation.type === "followed_by" || relation.type === "influenced_by" || relation.type === "influenced")
                .slice(0, 4)
                .map((relation) => relationNarrative(relation, snapshot));

            const insights = [];
            insights.push({
                label: "Temporal Focus",
                value: focus.label + " - " + formatTimelineYear(focus.start) + (focus.end !== focus.start ? " - " + formatTimelineYear(focus.end) : "")
            });
            insights.push({
                label: "Active Entities",
                value: activeEvents.length ? activeEvents.length + " entities overlap the active window" : "No dated entities overlap the active window"
            });
            if (succession.length) {
                insights.push({
                    label: "Flow",
                    value: succession.join(" | ")
                });
            } else if (events.length > 1) {
                const first = events[0];
                const last = events[Math.min(events.length - 1, 2)];
                insights.push({
                    label: "Flow",
                    value: first.label + " to " + last.label + " keeps chronology visible even before richer influence edges load."
                });
            }

            runtimeState.temporalInsights = insights;
            runtimeState.temporalFocus = {
                start: focus.start,
                end: focus.end,
                activeIds
            };
        }

        function renderTemporalInsights() {
            if (!timelineInsightsEl) {
                return;
            }

            const insights = runtimeState.temporalInsights || [];
            if (!insights.length) {
                timelineInsightsEl.innerHTML = '<div class="preset"><span>Temporal Focus</span><small>Awaiting dated selection</small></div>';
                return;
            }

            timelineInsightsEl.innerHTML = "";
            insights.forEach((item) => {
                const wrapper = document.createElement("div");
                wrapper.className = "preset";

                const title = document.createElement("span");
                title.textContent = item.label;

                const detail = document.createElement("small");
                detail.textContent = item.value;

                wrapper.appendChild(title);
                wrapper.appendChild(detail);
                timelineInsightsEl.appendChild(wrapper);
            });
        }

        function renderTimeline() {
            if (!timelineTrackEl || !timelineWindowEl || !timelineLabelsEl) {
                return;
            }

            const activeEntity = currentEntityRecord();
            const selectedType = runtimeState.selectedEntity.type || "Entity";
            const model = buildTimelineModel(selectedType, activeEntity);
            const totalRange = Math.max(1, model.rangeEnd - model.rangeStart);
            const left = clamp(((model.windowStart - model.rangeStart) / totalRange) * 100, 0, 100);
            const right = clamp(((model.windowEnd - model.rangeStart) / totalRange) * 100, 0, 100);
            const width = Math.max(2, right - left);

            timelineWindowEl.style.left = left + "%";
            timelineWindowEl.style.width = width + "%";
            timelineTrackEl.setAttribute("aria-label", model.label);
            timelineTrackEl.title = model.label;
            if (timelineCaptionEl) {
                timelineCaptionEl.textContent = model.label + ": " + model.caption;
            }

            const midOne = Math.round(model.rangeStart + totalRange / 3);
            const midTwo = Math.round(model.rangeStart + (totalRange * 2) / 3);
            timelineLabelsEl.innerHTML = [
                formatTimelineYear(model.rangeStart),
                formatTimelineYear(midOne),
                formatTimelineYear(midTwo),
                formatTimelineYear(model.rangeEnd)
            ].map((value) => "<span>" + value + "</span>").join("");

            deriveTemporalInsights(currentSnapshot());
            renderTemporalInsights();
            if (runtimeState.currentMode === "temporal-river") {
                renderConstellation();
            }
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
            const sessionId = beginQuerySession(documentName, variables);
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
                completeQuerySession(sessionId, {
                    error: message,
                    statusText: runtimeState.lastStatus
                });
                renderRuntimeState();
                throw new Error(message);
            }
            runtimeState.lastError = "";
            completeQuerySession(sessionId, {
                data: body.data || {},
                statusText: runtimeState.lastStatus
            });
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
            const follows = firstStatementItem(item.follows);
            const followedBy = firstStatementItem(item.followedBy);
            const country = firstStatementItem(item.country);
            return {
                id: item.id || "",
                movementLabel: item.movementLabel || "",
                startTime: { value: (((item.startTime || [])[0] || {}).value || {}).time || "" },
                endTime: { value: (((item.endTime || [])[0] || {}).value || {}).time || "" },
                country: country ? [{ value: country }] : [],
                countryLabel: country ? country.label : "",
                follows: follows ? [{ value: follows }] : [],
                followsLabel: follows ? follows.label : "",
                followedBy: followedBy ? [{ value: followedBy }] : [],
                followedByLabel: followedBy ? followedBy.label : ""
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

        function normaliseArtistDetails(item) {
            const birthplace = statementItems(item.birthplace);
            const deathplace = statementItems(item.deathplace);
            const movement = statementItems(item.movement);
            return {
                id: item.id || "",
                artistLabel: item.artistLabel || "",
                birthDate: { value: (((item.birthDate || [])[0] || {}).value || {}).time || "" },
                deathDate: { value: (((item.deathDate || [])[0] || {}).value || {}).time || "" },
                birthplace: birthplace.map((value) => ({ value })),
                birthplaceLabel: birthplace.map((value) => value.label).filter(Boolean).join(", "),
                deathplace: deathplace.map((value) => ({ value })),
                deathplaceLabel: deathplace.map((value) => value.label).filter(Boolean).join(", "),
                movement: movement.map((value) => ({ value })),
                movementLabel: movement.map((value) => value.label).filter(Boolean).join(", ")
            };
        }

        function normaliseArtworkDetails(item) {
            const creator = statementItems(item.creator);
            const museum = statementItems(item.museum);
            const depicts = statementItems(item.depicts);
            const material = statementItems(item.material);
            return {
                id: item.id || "",
                artworkLabel: item.artworkLabel || "",
                creator: creator.map((value) => ({ value })),
                creatorLabel: creator.map((value) => value.label).filter(Boolean).join(", "),
                inceptionDate: { value: (((item.inceptionDate || [])[0] || {}).value || {}).time || "" },
                museum: museum.map((value) => ({ value })),
                museumLabel: museum.map((value) => value.label).filter(Boolean).join(", "),
                depicts: depicts.map((value) => ({ value })),
                depictsLabel: depicts.map((value) => value.label).filter(Boolean).join(", "),
                material: material.map((value) => ({ value })),
                materialLabel: material.map((value) => value.label).filter(Boolean).join(", "),
                image: { value: (((item.image || [])[0] || {}).value || {}).content || "" }
            };
        }

        function normaliseMuseumDetails(item) {
            const country = statementItems(item.country);
            const location = statementItems(item.location);
            return {
                id: item.id || "",
                museumLabel: item.museumLabel || item.label || "",
                inceptionDate: { value: (((item.inceptionDate || [])[0] || {}).value || {}).time || "" },
                country: country.map((value) => ({ value })),
                countryLabel: country.map((value) => value.label).filter(Boolean).join(", "),
                location: location.map((value) => ({ value })),
                locationLabel: location.map((value) => value.label).filter(Boolean).join(", "),
                officialWebsite: { value: (((item.officialWebsite || [])[0] || {}).value || {}).content || "" }
            };
        }

        function normaliseArtistInfluenceDetails(item) {
            return {
                influencedBy: statementItems(item.influencedBy),
                influenced: statementItems(item.influenced)
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
            expandedMuseumId: "",
            expandedSubjectId: "",
            focusedArtworkId: "",
            cache_entites: {},
            chronologyPageSize: 28,
            chronologyCursor: null,
            chronologyHasNextPage: false,
            movementArtistsPageSize: 28,
            movementArtistsCursor: null,
            movementArtistsHasNextPage: false,
            movementArtistsSourceId: "",
            artistWorksPageSize: 24,
            artistWorksCursor: null,
            artistWorksHasNextPage: false,
            artistWorksSourceId: "",
            museumWorksPageSize: 24,
            museumWorksCursor: null,
            museumWorksHasNextPage: false,
            museumWorksSourceId: "",
            graphe: {
                noeuds: new Map(),
                relations: []
            }
        };

        if (chronologyLoadMoreEl) {
            chronologyLoadMoreEl.addEventListener("click", async () => {
                const paginationKind = activePaginationKind();
                if (!paginationKind || browserAdapterState.affichage_chargement) {
                    return;
                }
                browserAdapterState.affichage_chargement = true;
                renderChronologyPaginationButton();
                try {
                    if (paginationKind === "movementArtists") {
                        await window.ui.etat.charger_mouvement_artistes_page_suivante();
                    } else if (paginationKind === "artistWorks") {
                        await window.ui.etat.charger_artiste_oeuvres_page_suivante();
                    } else if (paginationKind === "museumWorks") {
                        await window.ui.etat.charger_musee_oeuvres_page_suivante();
                    } else {
                        await window.ui.etat.charger_chronologie_page_suivante();
                    }
                } catch (error) {
                    runtimeState.lastError = "Pagination warning: " + error.message;
                    renderRuntimeState();
                } finally {
                    browserAdapterState.affichage_chargement = false;
                    applyAdapterStateToShell();
                }
            });
        }

        if (constellationZoomOutEl) {
            constellationZoomOutEl.addEventListener("click", () => {
                setConstellationZoom((runtimeState.constellationZoom || 1) - 0.2);
            });
        }

        if (constellationZoomInEl) {
            constellationZoomInEl.addEventListener("click", () => {
                setConstellationZoom((runtimeState.constellationZoom || 1) + 0.2);
            });
        }

        if (constellationZoomResetEl) {
            constellationZoomResetEl.addEventListener("click", () => {
                runtimeState.constellationPanX = 0;
                runtimeState.constellationPanY = 0;
                setConstellationZoom(1);
            });
        }

        // Scroll-to-zoom and drag-to-pan for the constellation
        (function () {
            const constellationEl = document.querySelector(".constellation");
            if (!constellationEl) {
                return;
            }

            constellationEl.addEventListener("wheel", (e) => {
                e.preventDefault();
                const step = 0.15;
                const delta = e.deltaY > 0 ? -step : step;
                setConstellationZoom((runtimeState.constellationZoom || 1) + delta);
            }, { passive: false });

            let isPanning = false;
            let panStart = { x: 0, y: 0, panX: 0, panY: 0 };

            constellationEl.addEventListener("pointerdown", (e) => {
                if (e.target.closest(".node") || e.target.closest(".constellation-controls")) {
                    return;
                }
                isPanning = true;
                panStart = {
                    x: e.clientX,
                    y: e.clientY,
                    panX: runtimeState.constellationPanX || 0,
                    panY: runtimeState.constellationPanY || 0
                };
                constellationEl.setPointerCapture(e.pointerId);
                constellationEl.classList.add("is-panning");
                e.preventDefault();
            });

            constellationEl.addEventListener("pointermove", (e) => {
                if (!isPanning) {
                    return;
                }
                const rect = constellationEl.getBoundingClientRect();
                const maxPan = Math.max(rect.width, rect.height) * 0.6;
                runtimeState.constellationPanX = Math.max(-maxPan, Math.min(maxPan, panStart.panX + (e.clientX - panStart.x)));
                runtimeState.constellationPanY = Math.max(-maxPan, Math.min(maxPan, panStart.panY + (e.clientY - panStart.y)));
                renderConstellationZoomControls();
            });

            constellationEl.addEventListener("pointerup", () => {
                if (isPanning) {
                    isPanning = false;
                    constellationEl.classList.remove("is-panning");
                }
            });

            constellationEl.addEventListener("pointercancel", () => {
                if (isPanning) {
                    isPanning = false;
                    constellationEl.classList.remove("is-panning");
                }
            });
        }());

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

        function resetGraphState() {
            browserAdapterState.graphe.noeuds.clear();
            browserAdapterState.graphe.relations = [];
            browserAdapterState.cache_entites = {};
            browserAdapterState.expandedMovementId = "";
            browserAdapterState.expandedArtistId = "";
            browserAdapterState.expandedArtworkId = "";
            browserAdapterState.expandedMuseumId = "";
            browserAdapterState.expandedSubjectId = "";
            browserAdapterState.focusedArtworkId = "";
            browserAdapterState.entite_selectionnee_id = "";
            browserAdapterState.entite_selectionnee_type = "";
            browserAdapterState.movementArtistsCursor = null;
            browserAdapterState.movementArtistsHasNextPage = false;
            browserAdapterState.movementArtistsSourceId = "";
            browserAdapterState.artistWorksCursor = null;
            browserAdapterState.artistWorksHasNextPage = false;
            browserAdapterState.artistWorksSourceId = "";
            browserAdapterState.museumWorksCursor = null;
            browserAdapterState.museumWorksHasNextPage = false;
            browserAdapterState.museumWorksSourceId = "";
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
            if (browserAdapterState.artistWorksSourceId === artistId) {
                browserAdapterState.artistWorksCursor = null;
                browserAdapterState.artistWorksHasNextPage = false;
                browserAdapterState.artistWorksSourceId = "";
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

        function collapseMuseumExpansion(museumId) {
            const workIds = relatedTargets(museumId, "houses_work");
            workIds.forEach((workId) => {
                if (browserAdapterState.expandedArtworkId === workId) {
                    collapseArtworkExpansion(workId);
                }
            });
            removeGraphNodes(workIds);
            if (browserAdapterState.expandedMuseumId === museumId) {
                browserAdapterState.expandedMuseumId = "";
            }
            if (browserAdapterState.museumWorksSourceId === museumId) {
                browserAdapterState.museumWorksCursor = null;
                browserAdapterState.museumWorksHasNextPage = false;
                browserAdapterState.museumWorksSourceId = "";
            }
            browserAdapterState.focusedArtworkId = "";
        }

        function collapseSubjectExpansion(subjectId) {
            const workIds = relatedTargets(subjectId, "subject_of");
            workIds.forEach((workId) => {
                if (browserAdapterState.expandedArtworkId === workId) {
                    collapseArtworkExpansion(workId);
                }
            });
            removeGraphNodes(workIds);
            if (browserAdapterState.expandedSubjectId === subjectId) {
                browserAdapterState.expandedSubjectId = "";
            }
            browserAdapterState.focusedArtworkId = "";
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
                musee_etendu_id: browserAdapterState.expandedMuseumId,
                sujet_etendu_id: browserAdapterState.expandedSubjectId,
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
            if (normalised.includes("museum") || normalised.includes("musee") || normalised.includes("gallery") || normalised.includes("galerie")) {
                return "musee";
            }
            if (normalised.includes("subject") || normalised.includes("sujet")) {
                return "sujet";
            }
            return normalised;
        }

        function describeEntityMeta(type, entity) {
            const normalised = String(type || "").toLowerCase();
            if (!entity || typeof entity !== "object") {
                return "";
            }

            if (normalised.includes("work") || normalised.includes("oeuvre")) {
                const inception = fieldDate(entity, ["inceptionDate", "creationDate"]);
                return inception ? ("Inception: " + inception.slice(0, 10)) : "Artwork detail loaded";
            }

            if (normalised.includes("museum") || normalised.includes("musee") || normalised.includes("gallery") || normalised.includes("galerie")) {
                const count = Number(entity.artworkCount || entity.collectionCount || 0);
                return count ? (count + " collection works loaded") : "Museum collection loaded";
            }

            if (normalised.includes("subject") || normalised.includes("sujet")) {
                const count = Number(entity.artworkCount || 0);
                return count ? (count + " related works loaded") : "Subject cluster loaded";
            }

            if (normalised.includes("artist") || normalised.includes("artiste")) {
                const birth = fieldDate(entity, ["birthDate", "birthTime"]);
                const death = fieldDate(entity, ["deathDate", "deathTime"]);
                if (birth || death) {
                    return (birth ? birth.slice(0, 10) : "?") + " - " + (death ? death.slice(0, 10) : "?");
                }
                return "Artist detail loaded";
            }

            if (normalised.includes("movement") || normalised.includes("mouvement")) {
                const start = fieldDate(entity, ["startTime", "startDate", "inceptionDate"]);
                const end = fieldDate(entity, ["endTime", "endDate", "dissolvedDate"]);
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
            if (normalised.includes("museum") || normalised.includes("musee") || normalised.includes("gallery") || normalised.includes("galerie")) {
                return "node--artist";
            }
            if (normalised.includes("subject") || normalised.includes("sujet")) {
                return "node--movement";
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
            if (normalised.includes("museum") || normalised.includes("musee") || normalised.includes("gallery") || normalised.includes("galerie")) {
                return invokeRuntimeAction("charger_musee", window.ui.etat.charger_musee.bind(window.ui.etat), [node.id]);
            }
            if (normalised.includes("subject") || normalised.includes("sujet")) {
                return invokeRuntimeAction("charger_sujet", window.ui.etat.charger_sujet.bind(window.ui.etat), [node.id]);
            }
            return invokeRuntimeAction("charger_oeuvre", window.ui.etat.charger_oeuvre.bind(window.ui.etat), [node.id]);
        }

        function getRenderableNodes() {
            const snapshot = currentSnapshot();
            const allNodes = (((snapshot.graphe || {}).noeuds) || []).slice();
            let nodes = allNodes;
            if (snapshot.oeuvre_focus_id) {
                nodes = allNodes.filter((node) => {
                    const type = String(node.type || "").toLowerCase();
                    if (type.includes("work") || type.includes("oeuvre")) {
                        return node.id === snapshot.oeuvre_focus_id;
                    }
                    return true;
                });
            }
            const filtered = nodes.filter((node) => nodeMatchesShellFilter(node, snapshot));
            return filtered.length ? filtered : nodes;
        }

        function computeConstellationLayout() {
            const nodes = getRenderableNodes();
            const positions = new Map();

            if (!nodes.length) {
                return positions;
            }

            const snapshot = currentSnapshot();
            const selectedId = snapshot.entite_selectionnee_id;
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

            const relationByTarget = new Map();
            const relationBySource = new Map();
            (((snapshot.graphe || {}).relations) || []).forEach((relation) => {
                if (relation.source === selectedNode.id) {
                    relationByTarget.set(relation.target, relation.type);
                }
                if (relation.target === selectedNode.id) {
                    relationBySource.set(relation.source, relation.type);
                }
            });

            const sectors = semanticLayoutSectors(selectedNode, remaining, relationByTarget, relationBySource);
            Object.values(sectors).forEach((sector) => {
                placeNodesInSector(positions, sector.nodes, sector.start, sector.end, sector.radii || [23, 34, 43, 49]);
            });
            return positions;
        }

        function semanticLayoutSectors(selectedNode, nodes, relationByTarget, relationBySource) {
            const selectedType = String((selectedNode && selectedNode.type) || "").toLowerCase();
            const activeLens = runtimeState.activeCompassLens || "movement";

            const sectors = {
                primary: { start: -150, end: 150, nodes: [], radii: [22, 32, 41, 47] },
                left: { start: 145, end: 215, nodes: [], radii: [24, 35, 44] },
                right: { start: -35, end: 35, nodes: [], radii: [24, 35, 44] },
                top: { start: -130, end: -50, nodes: [], radii: [24, 35, 44] },
                bottom: { start: 55, end: 125, nodes: [], radii: [24, 34, 42, 47] }
            };

            // Widen artist arc for movement entities
            if (selectedType.includes("movement") || selectedType.includes("mouvement")) {
                sectors.bottom.start = 18;
                sectors.bottom.end = 162;
                sectors.bottom.radii = [22, 31, 40, 46];
                sectors.primary.end = 14;
            }

            // For artist-type selected nodes: sibling artists from the same movement have
            // no direct relation and fall into primary, which spans -150°→150° and includes
            // the bottom sector (55°→125°) where works live, causing them to cover works.
            // Fix: trim primary to end at 50° (5° gap before works), route the parent
            // movement to top, and pack sibling artists into a dedicated upper-right zone.
            if (selectedType.includes("artist") || selectedType.includes("artiste")) {
                sectors.primary.end = 50;
                sectors.siblings = { start: -50, end: 28, nodes: [], radii: [38, 44, 48] };
            }

            // Work context: route creator to bottom, dedicate upper-left to sibling works,
            // trim primary so it never reaches the creator zone or sibling zone.
            if (selectedType.includes("work") || selectedType.includes("oeuvre")) {
                sectors.primary.start = -115;
                sectors.primary.end = 42;
                sectors.siblings = { start: -175, end: -135, nodes: [], radii: [34, 42, 48] };
            }

            // Lens-driven sector overrides: map relation types to compass directions
            const lensSectorRules = {
                influence: {
                    influenced_by: "left",
                    influenced: "right",
                    follows: "top",
                    followed_by: "top",
                    contains_movement: "top",
                    contains_artist: "bottom"
                },
                artist: {
                    contains_artist: "primary",
                    created: "bottom",
                    influenced_by: "left",
                    influenced: "right",
                    follows: "top",
                    followed_by: "top"
                },
                place: {
                    displayed_at: "top",
                    houses_work: "top",
                    contains_artist: "primary"
                },
                time: {
                    follows: "left",
                    followed_by: "right",
                    influenced_by: "left",
                    influenced: "right",
                    contains_movement: "top"
                },
                work: {
                    depicts: "left",
                    made_of: "right",
                    displayed_at: "top",
                    houses_work: "top",
                    created: "primary"
                }
            };

            const activeLensRules = (activeLens !== "movement") ? (lensSectorRules[activeLens] || null) : null;

            // Widen sectors for influence/time lenses to emphasize left/right directionality
            if (activeLens === "influence" || activeLens === "time") {
                sectors.left.start = 130;
                sectors.left.end = 230;
                sectors.left.radii = [22, 33, 43, 48];
                sectors.right.start = -50;
                sectors.right.end = 50;
                sectors.right.radii = [22, 33, 43, 48];
                sectors.primary.start = -120;
                sectors.primary.end = 120;
            }

            nodes.forEach((node) => {
                const relation = relationByTarget.get(node.id) || relationBySource.get(node.id) || "";

                // Apply active lens sector override first
                if (activeLensRules && relation && activeLensRules[relation]) {
                    sectors[activeLensRules[relation]].nodes.push(node);
                    return;
                }

                // Entity-type default routing
                if (selectedType.includes("artist") || selectedType.includes("artiste")) {
                    if (relation === "influenced_by") {
                        sectors.left.nodes.push(node);
                    } else if (relation === "influenced") {
                        sectors.right.nodes.push(node);
                    } else if (relation === "created") {
                        sectors.bottom.nodes.push(node);
                    } else if (relation === "contains_artist") {
                        // Parent movement(s) — place at top as context anchor
                        sectors.top.nodes.push(node);
                    } else {
                        // Sibling artists (same movement, no direct relation) go to the
                        // far upper-right cluster so they never cover the artist's works
                        const nodeType = String(node.type || "").toLowerCase();
                        if ((nodeType.includes("artist") || nodeType.includes("artiste")) && sectors.siblings) {
                            sectors.siblings.nodes.push(node);
                        } else {
                            sectors.primary.nodes.push(node);
                        }
                    }
                } else if (selectedType.includes("movement") || selectedType.includes("mouvement")) {
                    if (relation === "follows" || relation === "followed_by" || relation === "contains_movement") {
                        sectors.top.nodes.push(node);
                    } else if (relation === "contains_artist") {
                        sectors.bottom.nodes.push(node);
                    } else {
                        sectors.primary.nodes.push(node);
                    }
                } else if (selectedType.includes("museum") || selectedType.includes("musee")) {
                    if (relation === "houses_work") {
                        sectors.primary.nodes.push(node);
                    } else {
                        sectors.top.nodes.push(node);
                    }
                } else if (selectedType.includes("work") || selectedType.includes("oeuvre")) {
                    if (relation === "displayed_at") {
                        sectors.top.nodes.push(node);
                    } else if (relation === "depicts") {
                        sectors.left.nodes.push(node);
                    } else if (relation === "made_of") {
                        sectors.right.nodes.push(node);
                    } else if (relation === "created") {
                        sectors.bottom.nodes.push(node);  // Artist who created this work, anchored below
                    } else {
                        const nodeType = String(node.type || "").toLowerCase();
                        if ((nodeType.includes("work") || nodeType.includes("oeuvre")) && sectors.siblings) {
                            sectors.siblings.nodes.push(node);  // Sibling works, far upper-left
                        } else {
                            sectors.primary.nodes.push(node);
                        }
                    }
                } else {
                    sectors.primary.nodes.push(node);
                }
            });

            return sectors;
        }

        function placeNodesInSector(positions, nodes, startDegrees, endDegrees, radii) {
            if (!nodes || !nodes.length) {
                return;
            }

            const capacityPerRing = Math.max(5, Math.ceil((endDegrees - startDegrees) / 13));
            nodes.forEach((node, index) => {
                const ringIndex = Math.min(radii.length - 1, Math.floor(index / capacityPerRing));
                const slot = index % capacityPerRing;
                const nodesInRing = Math.min(capacityPerRing, nodes.length - ringIndex * capacityPerRing);
                const fraction = nodesInRing <= 1 ? 0.5 : slot / (nodesInRing - 1);
                const angleDegrees = startDegrees + (endDegrees - startDegrees) * fraction;
                const angle = angleDegrees * Math.PI / 180;
                const nodeClass = constellationClassForType(node.type);
                const typeNudge = nodeClass === "node--movement" ? 3 : (nodeClass === "node--work" ? -2 : 0);
                const ring = Math.min(49, (radii[ringIndex] || radii[radii.length - 1]) + typeNudge + Math.floor(index / (capacityPerRing * radii.length)) * 4);
                const jitter = ((index % 2 === 0 ? 1 : -1) * 0.6) + ((index % 5) - 2) * 0.14;
                const x = 50 + Math.cos(angle) * ring + Math.sin(angle) * (ring * 0.03) * jitter;
                const y = 50 + Math.sin(angle) * ring * 0.78 + Math.cos(angle) * (ring * 0.03) * jitter;
                positions.set(node.id, {
                    x: Math.max(7, Math.min(93, x)),
                    y: Math.max(9, Math.min(91, y))
                });
            });
        }

        function renderConstellation() {
            const snapshot = currentSnapshot();
            const nodes = getRenderableNodes();
            const temporalFocus = runtimeState.currentMode === "temporal-river" ? runtimeState.temporalFocus : null;

            // Capture pre-render node positions for FLIP animation
            const oldNodeRects = new Map();
            constellationNodesEl.querySelectorAll(".node[data-node-id]").forEach((el) => {
                const rect = el.getBoundingClientRect();
                oldNodeRects.set(el.dataset.nodeId, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
            });

            constellationNodesEl.innerHTML = "";
            // Clear only link lines, preserve SVG <defs> (markers)
            constellationLinksEl.querySelectorAll("line.link").forEach((el) => el.remove());
            const isDense = nodes.length > 32;
            constellationNodesEl.classList.toggle("is-dense", isDense);
            constellationLinksEl.classList.toggle("is-dense", isDense);

            if (!nodes.length) {
                const empty = document.createElement("div");
                empty.className = "constellation-empty";
                empty.textContent = "Awaiting live graph state from Multilingual and Wikidata GraphQL.";
                constellationNodesEl.appendChild(empty);
                renderConstellationZoomControls();
                return;
            }

            const positions = computeConstellationLayout();
            runtimeState.lastConstellationPositions = positions;
            const selectedId = snapshot.entite_selectionnee_id;
            const seenRelations = new Set();
            const visibleNodeIds = new Set(nodes.map((node) => node.id));

            const nodeDegree = new Map();
            (((snapshot.graphe || {}).relations) || []).forEach((rel) => {
                if (visibleNodeIds.has(rel.source)) nodeDegree.set(rel.source, (nodeDegree.get(rel.source) || 0) + 1);
                if (visibleNodeIds.has(rel.target)) nodeDegree.set(rel.target, (nodeDegree.get(rel.target) || 0) + 1);
            });

            function updateHoverState(activeNodeId) {
                const nodeEls = constellationNodesEl.querySelectorAll(".node");
                const linkEls = constellationLinksEl.querySelectorAll(".link");
                const connectedIds = new Set();

                linkEls.forEach((linkEl) => {
                    const sourceId = linkEl.dataset.source;
                    const targetId = linkEl.dataset.target;
                    if (sourceId === activeNodeId || targetId === activeNodeId) {
                        linkEl.classList.add("is-connected");
                        connectedIds.add(sourceId);
                        connectedIds.add(targetId);
                    } else {
                        linkEl.classList.remove("is-connected");
                    }
                });

                nodeEls.forEach((nodeEl2) => {
                    const id = nodeEl2.dataset.nodeId;
                    if (id === activeNodeId) {
                        nodeEl2.classList.add("is-hovered");
                        nodeEl2.classList.remove("is-connected");
                    } else if (connectedIds.has(id)) {
                        nodeEl2.classList.add("is-connected");
                        nodeEl2.classList.remove("is-hovered");
                    } else {
                        nodeEl2.classList.remove("is-connected", "is-hovered");
                    }
                });
            }

            function resetHoverState() {
                constellationLinksEl.querySelectorAll(".link").forEach((linkEl) => {
                    linkEl.classList.remove("is-connected");
                });
                constellationNodesEl.querySelectorAll(".node").forEach((nodeEl2) => {
                    nodeEl2.classList.remove("is-connected", "is-hovered");
                });
            }

            ((((snapshot.graphe || {}).relations) || [])).forEach((relation) => {
                const key = [relation.source, relation.target, relation.type].join("|");
                if (seenRelations.has(key)) {
                    return;
                }
                seenRelations.add(key);

                if (!relationMatchesShellFilter(relation, visibleNodeIds)) {
                    return;
                }

                const source = positions.get(relation.source);
                const target = positions.get(relation.target);
                if (!source || !target) {
                    return;
                }

                const isMutedTemporally = temporalFocus && (!temporalFocus.activeIds.has(relation.source) || !temporalFocus.activeIds.has(relation.target));
                const link = document.createElementNS("http://www.w3.org/2000/svg", "line");
                link.setAttribute("class", "link" + (isMutedTemporally ? " is-muted-temporal" : ""));
                link.dataset.source = relation.source;
                link.dataset.target = relation.target;
                link.setAttribute("x1", source.x);
                link.setAttribute("y1", source.y);
                link.setAttribute("x2", target.x);
                link.setAttribute("y2", target.y);
                const successionRelations = ["follows", "followed_by"];
                const directedRelations = ["follows", "followed_by", "influenced", "influenced_by", "created"];
                if (directedRelations.includes(relation.type)) {
                    const markerId = successionRelations.includes(relation.type) ? "arrow-succession" : "arrow-directed";
                    link.setAttribute("marker-end", "url(#" + markerId + ")");
                }
                constellationLinksEl.appendChild(link);
            });

            // Nodes with a direct relation to the selected entity get is-context-detail
            // so their labels stay readable in dense mode without requiring hover/zoom.
            const directRelationIds = new Set();
            (((snapshot.graphe || {}).relations) || []).forEach((rel) => {
                if (rel.source === selectedId && visibleNodeIds.has(rel.target)) directRelationIds.add(rel.target);
                if (rel.target === selectedId && visibleNodeIds.has(rel.source)) directRelationIds.add(rel.source);
            });

            nodes.forEach((node) => {
                const position = positions.get(node.id) || { x: 50, y: 50 };
                const isTemporalFocus = temporalFocus && temporalFocus.activeIds.has(node.id);
                const isMutedTemporally = temporalFocus && !temporalFocus.activeIds.has(node.id);
                const isFilterFocus = nodeMatchesShellFilter(node, snapshot);
                const isContextDetail = directRelationIds.has(node.id);
                const nodeEl = document.createElement("button");
                nodeEl.type = "button";
                nodeEl.dataset.nodeId = node.id;
                nodeEl.className = "node " + constellationClassForType(node.type) + (node.id === selectedId ? " is-selected" : "") + (isContextDetail ? " is-context-detail" : "") + (snapshot.affichage_chargement && node.id === runtimeState.lastRequestedEntityId ? " is-loading" : "") + (isTemporalFocus ? " is-temporal-focus" : "") + (isMutedTemporally ? " is-muted-temporal" : "") + (runtimeState.shellFilter && runtimeState.shellFilter.effectiveLens && isFilterFocus ? " is-filter-focus" : "");
                nodeEl.style.left = position.x + "%";
                nodeEl.style.top = position.y + "%";
                const degree = nodeDegree.get(node.id) || 0;
                const nodeScale = (1 + Math.min(degree, 8) * 0.05).toFixed(2);
                nodeEl.style.setProperty("--node-scale", nodeScale);
                nodeEl.setAttribute("aria-label", (node.etiquette || node.id) + " (" + node.type + ")");

                const label = document.createElement("span");
                label.className = "node-label";
                label.textContent = node.etiquette || node.id;
                nodeEl.appendChild(label);

                nodeEl.addEventListener("mouseenter", () => updateHoverState(node.id));
                nodeEl.addEventListener("focus", () => updateHoverState(node.id));
                nodeEl.addEventListener("mouseleave", resetHoverState);
                nodeEl.addEventListener("blur", resetHoverState);

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

            // Apply FLIP animation: nodes that existed before glide to their new positions
            if (oldNodeRects.size > 0) {
                constellationNodesEl.querySelectorAll(".node[data-node-id]").forEach((el) => {
                    const old = oldNodeRects.get(el.dataset.nodeId);
                    if (!old) return;
                    const newRect = el.getBoundingClientRect();
                    const dx = old.x - (newRect.left + newRect.width / 2);
                    const dy = old.y - (newRect.top + newRect.height / 2);
                    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) return;
                    el.style.animation = "none";
                    el.style.transition = "none";
                    el.style.transform = "translate(calc(-50% + " + dx + "px), calc(-50% + " + dy + "px))";
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            el.style.transition = "transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)";
                            el.style.transform = "";
                            el.addEventListener("transitionend", () => {
                                el.style.animation = "";
                                el.style.transition = "";
                            }, { once: true });
                        });
                    });
                });
            }

            renderConstellationZoomControls();
            renderLensControls();
            renderConstellationLegend();
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
            updateCompassCore();
        }

        function applyAdapterStateToShell() {
            syncShellFromSnapshot(browserAdapterSnapshot());
            renderConstellation();
            renderChronologyPaginationButton();
            renderRuntimeState();
            refreshMultilingualEntityLabels();
            if (typeof window.renderDetailPanel === "function") {
                window.renderDetailPanel();
            }
        }

        window.ui = window.ui || {};
        window.ui.etat = {
            amorcer_entite(entityId, entityType, label) {
                if (!entityId) {
                    return;
                }

                const normalisedType = normaliseDetailEntityType(entityType);
                const seededLabel = label || entityId;
                let record = {
                    id: entityId,
                    label: seededLabel
                };

                if (normalisedType === "mouvement") {
                    record.movementLabel = seededLabel;
                } else if (normalisedType === "artiste") {
                    record.artistLabel = seededLabel;
                } else if (normalisedType === "oeuvre") {
                    record.artworkLabel = seededLabel;
                } else if (normalisedType === "musee") {
                    record.museumLabel = seededLabel;
                } else if (normalisedType === "sujet") {
                    record.subjectLabel = seededLabel;
                }

                browserAdapterState.cache_entites[entityId] = {
                    ...(browserAdapterState.cache_entites[entityId] || {}),
                    ...record
                };
            },

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
                resetGraphState();

                // Clear the graph visualization
                const graphContainer = document.querySelector("svg");
                if (graphContainer) {
                    graphContainer.innerHTML = "";
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
                const evolution = await executeGraphQLDocument("movement_evolution.graphql", {
                    id: mouvementId,
                    languageCode: runtimeState.currentLanguage
                });

                const movement = normaliseMovementDetails(details.item || {});
                browserAdapterState.cache_entites[mouvementId] = movement;
                addGraphNode(mouvementId, "movement", movement.movementLabel, movement);

                const evolutionItem = evolution.item || {};
                const previousMovement = firstStatementItem(evolutionItem.follows);
                const nextMovement = firstStatementItem(evolutionItem.followedBy);
                const parentMovement = firstStatementItem(evolutionItem.partOf);

                if (previousMovement) {
                    browserAdapterState.cache_entites[previousMovement.id] = {
                        ...(browserAdapterState.cache_entites[previousMovement.id] || {}),
                        id: previousMovement.id,
                        movementLabel: previousMovement.label
                    };
                    addGraphNode(previousMovement.id, "movement", previousMovement.label, browserAdapterState.cache_entites[previousMovement.id]);
                    addGraphRelation(mouvementId, previousMovement.id, "follows");
                }

                if (nextMovement) {
                    browserAdapterState.cache_entites[nextMovement.id] = {
                        ...(browserAdapterState.cache_entites[nextMovement.id] || {}),
                        id: nextMovement.id,
                        movementLabel: nextMovement.label
                    };
                    addGraphNode(nextMovement.id, "movement", nextMovement.label, browserAdapterState.cache_entites[nextMovement.id]);
                    addGraphRelation(mouvementId, nextMovement.id, "followed_by");
                }

                if (parentMovement) {
                    browserAdapterState.cache_entites[parentMovement.id] = {
                        ...(browserAdapterState.cache_entites[parentMovement.id] || {}),
                        id: parentMovement.id,
                        movementLabel: parentMovement.label
                    };
                    addGraphNode(parentMovement.id, "movement", parentMovement.label, browserAdapterState.cache_entites[parentMovement.id]);
                    addGraphRelation(parentMovement.id, mouvementId, "contains_movement");
                }

                browserAdapterState.movementArtistsCursor = null;
                browserAdapterState.movementArtistsHasNextPage = false;
                browserAdapterState.movementArtistsSourceId = mouvementId;
                await fetchMovementArtistsPage(mouvementId, browserAdapterState.movementArtistsCursor);

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
                const influences = await executeGraphQLDocument("artist_influences.graphql", {
                    id: artisteId,
                    languageCode: runtimeState.currentLanguage
                });

                const artist = normaliseArtistDetails(details.item || {});
                browserAdapterState.cache_entites[artisteId] = artist;
                addGraphNode(artisteId, "artist", artist.artistLabel || artist.label || artisteId, artist);

                const influenceGraph = normaliseArtistInfluenceDetails(influences.item || {});
                influenceGraph.influencedBy.slice(0, 6).forEach((influencer) => {
                    browserAdapterState.cache_entites[influencer.id] = {
                        ...(browserAdapterState.cache_entites[influencer.id] || {}),
                        id: influencer.id,
                        artistLabel: influencer.label
                    };
                    addGraphNode(influencer.id, "artist", influencer.label, browserAdapterState.cache_entites[influencer.id]);
                    addGraphRelation(artisteId, influencer.id, "influenced_by");
                });

                influenceGraph.influenced.slice(0, 6).forEach((influencedArtist) => {
                    browserAdapterState.cache_entites[influencedArtist.id] = {
                        ...(browserAdapterState.cache_entites[influencedArtist.id] || {}),
                        id: influencedArtist.id,
                        artistLabel: influencedArtist.label
                    };
                    addGraphNode(influencedArtist.id, "artist", influencedArtist.label, browserAdapterState.cache_entites[influencedArtist.id]);
                    addGraphRelation(artisteId, influencedArtist.id, "influenced");
                });

                browserAdapterState.artistWorksCursor = null;
                browserAdapterState.artistWorksHasNextPage = false;
                browserAdapterState.artistWorksSourceId = artisteId;
                await fetchArtistWorksPage(artisteId, browserAdapterState.artistWorksCursor);

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

            async charger_musee(museeId) {
                runtimeState.lastRequestedEntityId = museeId;
                if (browserAdapterState.expandedMuseumId === museeId && browserAdapterState.entite_selectionnee_id === museeId) {
                    collapseMuseumExpansion(museeId);
                    browserAdapterState.entite_selectionnee_id = museeId;
                    browserAdapterState.entite_selectionnee_type = "Museum";
                    applyAdapterStateToShell();
                    return browserAdapterState.cache_entites[museeId] || {};
                }

                if (browserAdapterState.expandedMuseumId && browserAdapterState.expandedMuseumId !== museeId) {
                    collapseMuseumExpansion(browserAdapterState.expandedMuseumId);
                }

                browserAdapterState.affichage_chargement = true;
                browserAdapterState.message_erreur = "";
                browserAdapterState.entite_selectionnee_id = museeId;
                browserAdapterState.entite_selectionnee_type = "Museum";

                const museumRecord = browserAdapterState.cache_entites[museeId] || {};
                let museumDetails = {};
                try {
                    const details = await executeGraphQLDocument("museum_details.graphql", {
                        id: museeId,
                        languageCode: runtimeState.currentLanguage
                    });
                    museumDetails = normaliseMuseumDetails(details.item || {});
                } catch (error) {
                    runtimeState.lastError = "Museum detail warning: " + error.message;
                }

                let museumLabel = fieldValue(museumDetails, "museumLabel") || fieldValue(museumRecord, "museumLabel") || fieldValue(museumRecord, "label");
                if (!museumLabel) {
                    museumLabel = await fetchEntityLabelInLanguage(museeId, runtimeState.currentLanguage);
                }
                museumLabel = museumLabel || museeId;
                browserAdapterState.cache_entites[museeId] = {
                    ...museumRecord,
                    ...museumDetails,
                    id: museeId,
                    museumLabel: museumLabel
                };
                addGraphNode(museeId, "museum", museumLabel, browserAdapterState.cache_entites[museeId]);

                browserAdapterState.museumWorksCursor = null;
                browserAdapterState.museumWorksHasNextPage = false;
                browserAdapterState.museumWorksSourceId = museeId;
                await fetchMuseumWorksPage(museeId, browserAdapterState.museumWorksCursor);

                browserAdapterState.expandedMuseumId = museeId;
                browserAdapterState.affichage_chargement = false;
                applyAdapterStateToShell();
                return browserAdapterState.cache_entites[museeId];
            },

            async charger_sujet(sujetId) {
                runtimeState.lastRequestedEntityId = sujetId;
                if (browserAdapterState.expandedSubjectId === sujetId && browserAdapterState.entite_selectionnee_id === sujetId) {
                    collapseSubjectExpansion(sujetId);
                    browserAdapterState.entite_selectionnee_id = sujetId;
                    browserAdapterState.entite_selectionnee_type = "Subject";
                    applyAdapterStateToShell();
                    return browserAdapterState.cache_entites[sujetId] || {};
                }

                if (browserAdapterState.expandedSubjectId && browserAdapterState.expandedSubjectId !== sujetId) {
                    collapseSubjectExpansion(browserAdapterState.expandedSubjectId);
                }

                browserAdapterState.affichage_chargement = true;
                browserAdapterState.message_erreur = "";
                browserAdapterState.entite_selectionnee_id = sujetId;
                browserAdapterState.entite_selectionnee_type = "Subject";

                const subjectRecord = browserAdapterState.cache_entites[sujetId] || {};
                const subjectLabel = fieldValue(subjectRecord, "subjectLabel") || fieldValue(subjectRecord, "label") || runtimeState.selectedEntity.name || sujetId;
                browserAdapterState.cache_entites[sujetId] = {
                    ...subjectRecord,
                    id: sujetId,
                    subjectLabel: subjectLabel
                };
                addGraphNode(sujetId, "subject", subjectLabel, browserAdapterState.cache_entites[sujetId]);

                const artworks = await executeGraphQLDocument("artworks_by_subject.graphql", {
                    subjectId: sujetId,
                    languageCode: runtimeState.currentLanguage
                });

                const edges = ((artworks.searchItems || {}).edges) || [];
                edges.slice(0, 24).forEach((edge) => {
                    const node = edge && edge.node ? edge.node : {};
                    if (node.id) {
                        browserAdapterState.cache_entites[node.id] = {
                            ...node
                        };
                        addGraphNode(node.id, "work", node.artworkLabel || node.label || node.id, node);
                        addGraphRelation(sujetId, node.id, "subject_of");
                    }
                });

                browserAdapterState.cache_entites[sujetId].artworkCount = edges.length;
                browserAdapterState.expandedSubjectId = sujetId;
                browserAdapterState.affichage_chargement = false;
                applyAdapterStateToShell();
                return browserAdapterState.cache_entites[sujetId];
            },

            async charger_chronologie(debut, fin) {
                runtimeState.lastRequestedEntityId = "chronology";
                browserAdapterState.affichage_chargement = true;
                browserAdapterState.plage_temporelle_debut = debut;
                browserAdapterState.plage_temporelle_fin = fin;
                browserAdapterState.mode_visualisation = "chronologie";
                browserAdapterState.chronologyCursor = null;
                browserAdapterState.chronologyHasNextPage = false;

                const data = await fetchChronologyPage(browserAdapterState.chronologyCursor);

                browserAdapterState.affichage_chargement = false;
                applyAdapterStateToShell();
                return data;
            },

            async charger_chronologie_page_suivante() {
                if (!browserAdapterState.chronologyHasNextPage) {
                    return null;
                }
                runtimeState.lastRequestedEntityId = "chronology";
                browserAdapterState.affichage_chargement = true;

                const data = await fetchChronologyPage(browserAdapterState.chronologyCursor);

                browserAdapterState.affichage_chargement = false;
                applyAdapterStateToShell();
                return data;
            },

            async charger_mouvement_artistes_page_suivante() {
                const mouvementId = browserAdapterState.movementArtistsSourceId || browserAdapterState.expandedMovementId || browserAdapterState.entite_selectionnee_id;
                if (!mouvementId || !browserAdapterState.movementArtistsHasNextPage) {
                    return null;
                }
                runtimeState.lastRequestedEntityId = mouvementId;
                browserAdapterState.affichage_chargement = true;

                const data = await fetchMovementArtistsPage(mouvementId, browserAdapterState.movementArtistsCursor);

                browserAdapterState.affichage_chargement = false;
                applyAdapterStateToShell();
                return data;
            },

            async charger_artiste_oeuvres_page_suivante() {
                const artisteId = browserAdapterState.artistWorksSourceId || browserAdapterState.expandedArtistId || browserAdapterState.entite_selectionnee_id;
                if (!artisteId || !browserAdapterState.artistWorksHasNextPage) {
                    return null;
                }
                runtimeState.lastRequestedEntityId = artisteId;
                browserAdapterState.affichage_chargement = true;

                const data = await fetchArtistWorksPage(artisteId, browserAdapterState.artistWorksCursor);

                browserAdapterState.affichage_chargement = false;
                applyAdapterStateToShell();
                return data;
            },

            async charger_musee_oeuvres_page_suivante() {
                const museeId = browserAdapterState.museumWorksSourceId || browserAdapterState.expandedMuseumId || browserAdapterState.entite_selectionnee_id;
                if (!museeId || !browserAdapterState.museumWorksHasNextPage) {
                    return null;
                }
                runtimeState.lastRequestedEntityId = museeId;
                browserAdapterState.affichage_chargement = true;

                const data = await fetchMuseumWorksPage(museeId, browserAdapterState.museumWorksCursor);

                browserAdapterState.affichage_chargement = false;
                applyAdapterStateToShell();
                return data;
            },

            async basculer_visualisation(mode) {
                if (mode === "chronologie" || mode === "riviere") {
                    await this.charger_chronologie(browserAdapterState.plage_temporelle_debut, browserAdapterState.plage_temporelle_fin);
                }
                browserAdapterState.mode_visualisation = mode;
                applyAdapterStateToShell();
                return mode;
            },

            obtenir_entite_selectionnee() {
                return browserAdapterSnapshot().entite_selectionnee;
            },

            obtenir_instantane_etat() {
                return browserAdapterSnapshot();
            },

            reinitialiser_graphe() {
                resetGraphState();
                applyAdapterStateToShell();
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
            runtimeState.queryNarrative = narrativeForDocument(runtimeState.currentDocument, runtimeState.currentVariables);
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
                runtimeState.queryNarrative = narrativeForDocument(runtimeState.currentDocument, runtimeState.currentVariables) + " Response: " + describeResponse(data) + ".";
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
                "artist_details.graphql",
                "artist_influences.graphql",
                "artworks_by_artist.graphql",
                "artwork_details.graphql",
                "museum_details.graphql",
                "movement_evolution.graphql",
                "movements_catalog.graphql",
                "entity_label.graphql"
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
            if (polyglotPreviewEl) {
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
            }

            renderRuntimeState();
        }

        // Map HTML button modes to multilingual visualization modes
        const modeMapping = {
            "observatory": "graphe",
            "query-theater": "graphe",
            "polyglot-studio": "polyglot-studio",
            "temporal-river": "riviere"
        };

        modeButtons.forEach((button) => {
            button.addEventListener("click", async () => {
                const htmlMode = button.dataset.mode;
                const multilingualMode = modeMapping[htmlMode] || htmlMode;

                setActiveButton(modeButtons, button);
                runtimeState.currentMode = htmlMode;

                const config = modeSummaries[htmlMode];
                if (config) {
                    queryExplanationEl.textContent = config.explanation;
                    lensSummaryEl.textContent = config.lens;
                }

                try {
                    if (typeof window.ui.etat.basculer_visualisation === "function") {
                        await window.ui.etat.basculer_visualisation(multilingualMode);
                    }
                } catch (error) {
                    runtimeState.lastError = "Visualization switch warning: " + error.message;
                }

                renderRuntimeState();
            });
        });

        langButtons.forEach((button) => {
            button.addEventListener("click", async () => {
                const language = button.dataset.language;
                try {
                    setActiveButton(langButtons, button);
                    if (runtimeState.currentMode === "polyglot-studio" && typeof window.basculer_langue === "function") {
                        await window.basculer_langue(language);
                    } else {
                        updateLanguageSurface(language);
                    }
                } catch (error) {
                    runtimeState.lastError = `Language switch failed: ${error.message}`;
                    renderRuntimeState();
                }
            });
        });

        compassPoleButtons.forEach((button) => {
            button.addEventListener("click", async () => {
                const lens = button.dataset.lens || "movement";
                await applyShellLens(lens, "", true);
            });
        });

        lensPresetButtons.forEach((button) => {
            button.addEventListener("click", async () => {
                const preset = button.dataset.preset || "";
                if (runtimeState.activeLensPreset === preset) {
                    await applyShellLens(runtimeState.activeCompassLens || "movement", "", false);
                    return;
                }
                await applyShellLens(runtimeState.activeCompassLens || "movement", preset, true);
            });
        });

        if (clearSessionButtonEl) {
            clearSessionButtonEl.addEventListener("click", async () => {
                await clearSessionHistory();
            });
        }

        buildShellFilter();
        loadQueryInventory();
        updateLanguageSurface("fr");
