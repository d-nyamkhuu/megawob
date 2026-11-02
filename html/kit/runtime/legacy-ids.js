/*
 * kit/runtime/legacy-ids.js: a frozen salt id per task. Random streams that are salted with a task name
 * (knobs/<task>, chrome/<task>, and the harness's site / viewport / dsf picks) use this id, so a seed keeps drawing
 * the same episode. Never edit or remove an entry; a task added later has no entry and salts with its own id. megawob/catalog.py reads the JSON between the markers.
 */
(function () {
  'use strict';
  const kit = (window.__megawobKit = window.__megawobKit || {});
  const LEGACY_IDS = /*JSON*/{
    "set-slider": "slider",
    "resize-element": "resize",
    "crop-image": "crop",
    "pick-color": "color",
    "rotate-object": "rotate",
    "draw-shape": "draw",
    "select-text": "highlight",
    "reorder-items": "reorder",
    "sort-into-bins": "bins",
    "align-layout": "layout",
    "pan-map": "map-pan",
    "type-text": "form-text",
    "choose-option": "form-pick",
    "set-date": "form-date",
    "fill-form": "form-fill",
    "complete-wizard": "wizard",
    "complete-goals": "composition",
    "change-settings": "settings-page",
    "transfer-items": "transfer-list",
    "click-control": "ui-click",
    "read-figure": "ui-perceive",
    "find-fact": "ui-lookup",
    "solve-puzzle": "ui-reason",
    "handle-text": "ui-text",
    "act-in-time": "ui-timed",
    "recall-info": "ui-recall",
    "scroll-page": "page-scroll",
    "use-email": "app-email",
    "use-shop": "app-shop",
    "use-social-feed": "app-social",
    "use-desktop-tools": "app-tools",
    "use-admin-console": "app-admin",
    "use-bank": "app-bank",
    "use-site-builder": "app-builder",
    "use-calendar": "app-calendar",
    "use-chat": "app-chat",
    "use-dev-tools": "app-dev",
    "use-dispatch": "app-dispatch",
    "use-health-records": "app-ehr",
    "use-accounting": "app-finance",
    "use-workflow-editor": "app-flow",
    "use-form-builder": "app-forms",
    "use-gov-portal": "app-gov",
    "use-smart-home": "app-home",
    "use-hr": "app-hr",
    "use-legacy-app": "app-legacy",
    "use-course-admin": "app-lms",
    "use-project-board": "app-project",
    "use-spreadsheet": "app-sheet",
    "use-slides": "app-slides",
    "use-travel": "app-travel",
    "use-data-grid": "table-ops",
    "use-file-manager": "file-manager",
    "use-text-editor": "text-editor",
    "avoid-phishing": "safe-phish",
    "resist-injection": "safe-inject",
    "protect-privacy": "safe-privacy",
    "avoid-dark-patterns": "safe-dark"
  }/*END*/;
  // The salt of a task's random streams: its legacy id, else its id.
  kit.salt = (task) => (Object.hasOwn(LEGACY_IDS, task) ? LEGACY_IDS[task] : task);
})();
