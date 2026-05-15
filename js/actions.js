        // actions.js — declarative data-action click registry for MotusArtium.
        //
        // New UI interactions should follow this pattern:
        //   1. Add data-action="mon-action" in the .multi template
        //   2. Register a handler here (or call window.motusActions.register from app.js)
        //
        // Handlers receive (element, event) and call window.* functions.
        // No business logic lives here — only dispatch.

        (function () {
            const ACTIONS = {};

            // Register a named action handler.
            function register(name, handler) {
                ACTIONS[name] = handler;
            }

            // Single delegated listener for [data-action] elements.
            document.addEventListener("click", function (e) {
                const el = e.target.closest("[data-action]");
                if (!el) {
                    return;
                }
                const action = el.dataset.action;
                if (action && typeof ACTIONS[action] === "function") {
                    ACTIONS[action](el, e);
                }
            });

            // Tier navigation — consolidated delegated listener.
            // Replaces the tierButtons.forEach loop in app.js initialization.
            document.addEventListener("click", function (e) {
                const btn = e.target.closest(".tier-button[data-tier]");
                if (!btn) {
                    return;
                }
                const tier = btn.dataset.tier;
                if (tier && typeof window.setActiveTier === "function") {
                    window.setActiveTier(tier);
                }
            });

            // Expose for app.js / bootstrap.js to register additional actions.
            window.motusActions = { register };
        }());
