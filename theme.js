/**
 * Theme Management System
 * Handles switching between dark and light color modes
 * Respects system preferences and saves user choices
 */

(function() {
    const THEME_KEY = 'motusartium-theme';
    const SYSTEM_THEME = 'system';
    const DARK_THEME = 'dark';
    const LIGHT_THEME = 'light';

    /**
     * Get the current theme preference from localStorage or system
     */
    function getThemePreference() {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored) {
            return stored;
        }
        return SYSTEM_THEME;
    }

    /**
     * Determine which theme to apply
     */
    function getActiveTheme() {
        const preference = getThemePreference();

        if (preference === SYSTEM_THEME) {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                return LIGHT_THEME;
            }
            return DARK_THEME;
        }

        return preference;
    }

    /**
     * Apply theme to document
     */
    function applyTheme(theme) {
        const html = document.documentElement;

        // Remove both theme classes first
        html.classList.remove('theme-dark', 'theme-light');

        // Add the appropriate theme class
        if (theme === LIGHT_THEME) {
            html.classList.add('theme-light');
            html.setAttribute('data-theme', 'light');
        } else {
            html.classList.add('theme-dark');
            html.setAttribute('data-theme', 'dark');
        }

        // Update toggle button aria-label
        const toggleButton = document.getElementById('theme-toggle');
        if (toggleButton) {
            if (theme === LIGHT_THEME) {
                toggleButton.setAttribute('aria-label', 'Switch to dark mode');
                toggleButton.title = 'Switch to dark mode';
            } else {
                toggleButton.setAttribute('aria-label', 'Switch to light mode');
                toggleButton.title = 'Switch to light mode';
            }
        }
    }

    /**
     * Cycle through theme options: system → dark → light → system
     */
    function cycleTheme() {
        const current = getThemePreference();
        let next = SYSTEM_THEME;

        if (current === SYSTEM_THEME) {
            next = DARK_THEME;
        } else if (current === DARK_THEME) {
            next = LIGHT_THEME;
        } else if (current === LIGHT_THEME) {
            next = SYSTEM_THEME;
        }

        localStorage.setItem(THEME_KEY, next);
        applyTheme(getActiveTheme());

        // Announce theme change for accessibility
        announceThemeChange(next);
    }

    /**
     * Announce theme change to screen readers
     */
    function announceThemeChange(theme) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';

        const themeNames = {
            'dark': 'Dark mode activated',
            'light': 'Light mode activated',
            'system': 'System theme activated'
        };

        announcement.textContent = themeNames[theme] || 'Theme changed';
        document.body.appendChild(announcement);

        setTimeout(() => announcement.remove(), 2000);
    }

    /**
     * Initialize theme system
     */
    function init() {
        // Apply theme on page load
        applyTheme(getActiveTheme());

        // Setup theme toggle button
        const toggleButton = document.getElementById('theme-toggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', cycleTheme);
            // Add keyboard support (Space and Enter)
            toggleButton.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    cycleTheme();
                }
            });
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            // Modern syntax with addEventListener
            if (darkModeQuery.addEventListener) {
                darkModeQuery.addEventListener('change', (e) => {
                    if (getThemePreference() === SYSTEM_THEME) {
                        applyTheme(getActiveTheme());
                    }
                });
            } else {
                // Fallback for older browsers
                darkModeQuery.addListener((e) => {
                    if (getThemePreference() === SYSTEM_THEME) {
                        applyTheme(getActiveTheme());
                    }
                });
            }
        }
    }

    // Initialize as soon as possible
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose for external use
    window.MotusTheme = {
        setTheme: function(theme) {
            if ([DARK_THEME, LIGHT_THEME, SYSTEM_THEME].includes(theme)) {
                localStorage.setItem(THEME_KEY, theme);
                applyTheme(getActiveTheme());
            }
        },
        getTheme: getThemePreference,
        getActiveTheme: getActiveTheme,
        cycleTheme: cycleTheme
    };

    // Log for debugging
    console.log('MotusTheme initialized. Current theme:', getThemePreference());
})();
