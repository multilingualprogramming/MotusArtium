#!/usr/bin/env node
/**
 * Verify that bundle.js exposes the expected module namespaces and functions
 * after being evaluated with a minimal window/document mock.
 *
 * Run: node tests/bundle_exports.js [path/to/bundle.js]
 */

"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const bundlePath = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.resolve(__dirname, "../bundle.js");

if (!fs.existsSync(bundlePath)) {
    console.error(`bundle.js not found at: ${bundlePath}`);
    process.exit(1);
}

// In a browser, `window` is the global object — so `window.semantique = x`
// also creates a bare `semantique` global. Replicate this with vm.createContext:
// the sandbox IS the window, and we set sandbox.window = sandbox.
const sandbox = {
    // Pre-seed namespaces the bundle expects on the global / window
    ui: {},
    semantique: {},
    // DOM stubs
    document: {
        getElementById: () => null,
        querySelector: () => null,
        querySelectorAll: () => [],
        createElement: () => ({
            style: {},
            classList: { add: () => {}, remove: () => {}, toggle: () => {} },
            setAttribute: () => {},
            appendChild: () => {},
        }),
        createElementNS: () => ({
            setAttribute: () => {},
            appendChild: () => {},
        }),
    },
    // Browser globals
    fetch: () => Promise.resolve({ json: () => Promise.resolve({}) }),
    encodeURIComponent,
    console,
    setTimeout: () => {},
    clearTimeout: () => {},
    Promise,
};
// window === the sandbox itself so bare names and window.X resolve the same
sandbox.window = sandbox;

vm.createContext(sandbox);

try {
    const code = fs.readFileSync(bundlePath, "utf8");
    vm.runInContext(code, sandbox);
} catch (err) {
    console.error("bundle.js eval failed:", err.message);
    process.exit(1);
}

// After eval, window.X === sandbox.X — use sandbox for checks below.
const window = sandbox;

// ─── Checks ──────────────────────────────────────────────────────────────────

let failures = 0;

function check(label, condition) {
    if (condition) {
        console.log(`  [PASS] ${label}`);
    } else {
        console.error(`  [FAIL] ${label}`);
        failures++;
    }
}

function checkFn(obj, path) {
    const parts = path.split(".");
    let cur = obj;
    for (const p of parts) {
        if (cur == null || typeof cur !== "object") { cur = undefined; break; }
        cur = cur[p];
    }
    const ok = typeof cur === "function";
    check(`${path} is a function`, ok);
}

function checkExists(obj, path) {
    const parts = path.split(".");
    let cur = obj;
    for (const p of parts) {
        if (cur == null || typeof cur !== "object") { cur = undefined; break; }
        cur = cur[p];
    }
    check(`${path} exists`, cur != null);
}

console.log("\nBundle export checks:");

// Core etat functions
console.log("\n  [ui.etat]");
checkFn(window, "ui.etat.charger_mouvement");
checkFn(window, "ui.etat.charger_artiste");
checkFn(window, "ui.etat.charger_oeuvre");
checkFn(window, "ui.etat.basculer_visualisation");
checkFn(window, "ui.etat.basculer_comparaison");
checkFn(window, "ui.etat.charger_donnees_comparaison");
checkFn(window, "ui.etat.effacer_comparaison");
checkFn(window, "ui.etat.obtenir_entite_selectionnee");

// Récit module
console.log("\n  [ui.composants.recit]");
checkExists(window, "ui.composants.recit");
checkFn(window, "ui.composants.recit.rendre_recit");

// Comparison panel module
console.log("\n  [ui.composants.panneau_comparaison]");
checkExists(window, "ui.composants.panneau_comparaison");
checkFn(window, "ui.composants.panneau_comparaison.rendre_panneau_comparaison");

// Semantics intersections module
console.log("\n  [semantique.intersections]");
checkExists(window, "semantique.intersections");
checkFn(window, "semantique.intersections.calculer_intersection_artistes");
checkFn(window, "semantique.intersections.calculer_artistes_uniques");
checkFn(window, "semantique.intersections.obtenir_etiquette_artiste");
checkFn(window, "semantique.intersections.obtenir_statistiques");

// Detail panel module
console.log("\n  [ui.composants.panneau_detail]");
checkExists(window, "ui.composants.panneau_detail");
checkFn(window, "ui.composants.panneau_detail.rendre_panneau_detail");

console.log();

if (failures > 0) {
    console.error(`${failures} check(s) failed.`);
    process.exit(1);
} else {
    console.log(`All bundle export checks passed (${bundlePath})`);
}
