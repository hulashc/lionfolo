// ═══════════════════════════════════════════════════════════════════
// project-core.js — Single source of truth for all project pages
// To add a new project: add one line to PROJECTS array below only
// ═══════════════════════════════════════════════════════════════════

// ── MASTER PROJECTS REGISTRY ─────────────────────────────────────
// FORMAT: [id, "YYYYMMDD", "Author", "Display Name", "/url/", "Search Keywords"]
var PROJECTS = [
    [1, "20260214", "Hulash Chand", "Celestian Labs", "/projects/celestian-labs/", "Celestian Labs Agentic Artificial Intelligence"],
    [2, "20251113", "Hulash Chand", "System Design Architecture", "/projects/system-design-architecture/", "System Design Architecture"],
    [3, "20251113", "Hulash Chand", "Bird Song Mathematical Model", "/projects/birdsong-mathematical-model/", "Bird Song Mathematical Model"],
    [4, "20241121", "Hulash Chand", "Leet Journey", "/projects/leetjourney-obsidian-notes/", "Leet Journey Obsidian Notes"],
    [5, "20251121", "Hulash Chand", "Bhagavad Gita Telugu", "/projects/bhagavad-gita-telugu/", "Bhagavad Gita Telugu"]
];

// ── SCRIPT LOADER (jQuery 3.7.1 → bez → easing → app engine) ─────
// Loads dependencies in strict order before initialising the project
(function () {
    var scripts = [
        "/wp-includes/js/jquery/jquery.minf43b.js",
        "/jquery.bez.mind4d0.js",
        "/jquery.easing.1.3d4d0.js",
        "/app.min8a54.js"
    ];

    function loadNext(i) {
        if (i >= scripts.length) {
            // All scripts loaded — expose projects array and apply colour
            window.projects = PROJECTS;
            var c = window.PROJECT_COLOR || '#ffffff';
            document.querySelector(':root').style.setProperty('--background', c);
            document.querySelector(':root').style.setProperty('--mono', c);
            return;
        }
        var s = document.createElement('script');
        s.src = scripts[i];
        s.onload = function () {
            loadNext(i + 1);
        };
        document.head.appendChild(s);
    }

    loadNext(0);
})();