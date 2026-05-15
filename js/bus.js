        // bus.js — central pub/sub event bus for MotusArtium.
        //
        // All cross-module communication goes through here.
        // Modules call bus.emit("event:name", payload) to broadcast,
        // and bus.on("event:name", handler) to subscribe.
        //
        // Usage:
        //   bus.on("entity:selected", ({ id, type }) => renderDetail(id));
        //   bus.emit("entity:selected", { id: "Q762", type: "artiste" });
        //   bus.off("entity:selected", handler);  // unsubscribe

        window.bus = (function () {
            const _listeners = {};

            function on(event, handler) {
                if (!_listeners[event]) {
                    _listeners[event] = [];
                }
                _listeners[event].push(handler);
            }

            function off(event, handler) {
                if (!_listeners[event]) {
                    return;
                }
                _listeners[event] = _listeners[event].filter((h) => h !== handler);
            }

            function emit(event, payload) {
                (_listeners[event] || []).forEach((handler) => {
                    try {
                        handler(payload);
                    } catch (error) {
                        console.warn("[bus] handler error on " + event + ":", error);
                    }
                });
            }

            return { on, off, emit };
        }());
