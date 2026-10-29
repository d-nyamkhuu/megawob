# Checklist for a new era-wide site

What a new full site must vary so that it adds real diversity. A full site (for example a late-1990s portal or a
dense enterprise app) has a widget for every task plus its own frame.

- It writes only under `html/sites/<site>/` and treats `html/kit/` and `html/tasks/` as read-only.
- It is done when `python -m megawob.check --site <site>` passes at every training viewport and its row of
  `python -m megawob.check --matrix` is full.
- Single-widget `design-*` sites skip the coverage items (A).
- The rules every page follows are in [AGENTS.md](../AGENTS.md#rules-every-page-must-follow); the steps are in
  [CONTRIBUTING.md](../CONTRIBUTING.md#add-a-site).

**A. Coverage**
1. One widget per task covering every scenario; `traits` declared where the task defines them (`pick-color.controls`, `click-control.menuOpen`).
2. At least 8 tasks with a second widget that differs in mechanics (not just CSS): handle-only vs whole-item drag, snap vs free, live reflow vs ghost, readout vs none, custom vs native widget, vendored library vs primitives.

**B. Frame and end control**
3. Three or more end-control placements and labels sampled per episode (header button, footer button, text link, icon button, a bottom bar on a mobile-style site). No end control in finish by message (`ctx.finish`).
4. Instruction display sampled among header / side panel / toast / hidden.
5. Site frame includes filler elements sampled per episode: nav bar, sidebar, breadcrumb, footer, ad slot or promo card, user avatar, search box (all decorative, all clickable-but-inert).
6. One decoy control per page whose label collides with the end control but only sets a model flag (never `ctx.submit()`).
   Give decoys neutral DOM names: no class, id, `data-*` name or `data-role` value that says decoy, collide or
   collision (the site/base frame uses `ref-xtra`), or a DOM/axtree agent skips them for free
   (`megawob.lint` rule `decoy-marker`, an error).

**C. Layout and scale**
7. Stage alignment sampled (centered, left, right, top), with the target widget's bounding box center spread over ≥60% of the stage in both axes across seeds (checker can measure this from `locate()`).
8. Hit-target sizes spanning the site's era: thumbs/handles 8-28 px, buttons 20-44 px tall; at least one dense widget with ≤16 px targets (required on a dense enterprise-style site), touch sizes on a mobile-style site.
9. Font sizes 11-18 px and at least two font families per site; dark-mode or high-contrast scenario on ≥25% of episodes where the era allows it.
10. Pass at every training viewport (1024x640, 1280x720, 1366x768, 1440x900, 1536x864) and at device scale 1.5 and 2 (`--dsf 1 1.5 2`).

**D. Widget implementations**
11. Native `<input type=checkbox|radio|range>` and a native `<textarea>` resize grip used in ≥2 widgets; a custom equivalent in ≥2 others.
12. Native HTML5 drag-and-drop in ≥1 drag widget (`sort-into-bins`, `reorder-items` or a tree).
13. One widget built on a vendored library from `html/sites/base/vendor/` ([THIRD_PARTY.md](../THIRD_PARTY.md)), deterministic under the reseeded `Math.random`.
14. Scroll containers: native overflow scrollbars (thin/overlay) in ≥2 widgets and custom scrollbars in ≥1; ≥2 widgets with page-level scroll and a target below the fold.

**E. States and dynamics**
15. Hover-reveal controls in ≥2 widgets (row actions, resize handles, card buttons).
16. Disabled and loading states in ≥2 widgets: a submit disabled until valid, a skeleton that resolves on the task clock (`act-in-time` delay pattern), a disabled look-alike decoy.
17. Tooltips on icon-only buttons in ≥1 widget, opening after a kit-clock delay.
18. One popup per site: toast or cookie banner at a seeded beat, dismissible, overlapping part of the stage.

**F. Content and text**
19. No lorem ipsum: use the shared realistic banks; brand/product/person names sampled from ≥50-item banks.
20. Label drift: page labels use the task's aliases (synonyms, casing, abbreviations) in ≥30% of episodes where the task exposes `labelAliases`.
21. Locale: dates, numbers and times rendered in ≥2 locale formats; ≥1 widget per site with non-English frame labels (nav, submit) while the instruction stays English.

**G. Process rules**
22. Follows [the rules every page follows](../AGENTS.md#rules-every-page-must-follow); widget-specific `ctx.flag()` rules are documented in the widget header.
23. Helpers the site had to write locally, and traits it needs, are listed in the pull request so they can move into the kit.


