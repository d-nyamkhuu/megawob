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

1. One widget per task covering every scenario.
   - Declare `traits` where the task defines them (`pick-color.controls`, `click-control.menuOpen`).
2. At least 8 tasks with a second widget that differs in mechanics, not just CSS. Vary things like:
   - handle-only or whole-item drag
   - snap or free
   - live reflow or ghost
   - readout or none
   - custom or native widget
   - vendored library or primitives

**B. Frame and end control**

3. Three or more end-control placements and labels, sampled per episode.
   - Placements: header button, footer button, text link, icon button, a bottom bar on a mobile-style site.
   - In finish by message (`ctx.finish`) there is no end control.
4. Instruction display sampled among header, side panel, toast and hidden.
5. The site frame includes filler elements, sampled per episode: nav bar, sidebar, breadcrumb, footer, ad slot or
   promo card, user avatar, search box. All are decorative, and all are clickable but inert.
6. One decoy control per page. Its label collides with the end control, but it only sets a model flag (never
   `ctx.submit()`).
   - Give decoys neutral DOM names: no class, id, `data-*` name or `data-role` value that says decoy, collide or
     collision (the site/base frame uses `ref-xtra`).
   - Otherwise a DOM/axtree agent skips them for free (`megawob.lint` rule `decoy-marker`, an error).

**C. Layout and scale**

7. Stage alignment sampled (centered, left, right, top).
   - The center of the target widget's bounding box is spread over at least 60% of the stage in both axes across
     seeds. The checker can measure this from `locate()`.
8. Hit-target sizes that span the site's era:
   - thumbs and handles 8-28 px, buttons 20-44 px tall
   - at least one dense widget with targets of 16 px or less (required on a dense enterprise-style site)
   - touch sizes on a mobile-style site
9. Font sizes 11-18 px and at least two font families per site.
   - Dark-mode or high-contrast scenario on at least 25% of episodes, where the era allows it.
10. Pass at every training viewport (1024x640, 1280x720, 1366x768, 1440x900, 1536x864) and at device scale 1.5 and 2
    (`--dsf 1 1.5 2`).

**D. Widget implementations**

11. Native `<input type=checkbox|radio|range>` and a native `<textarea>` resize grip used in at least 2 widgets, and
    a custom equivalent in at least 2 others.
12. Native HTML5 drag-and-drop in at least 1 drag widget (`sort-into-bins`, `reorder-items` or a tree).
13. One widget built on a vendored library from `html/sites/base/vendor/` ([THIRD_PARTY.md](../THIRD_PARTY.md)),
    deterministic under the reseeded `Math.random`.
14. Scroll containers:
    - native overflow scrollbars (thin/overlay) in at least 2 widgets
    - custom scrollbars in at least 1 widget
    - at least 2 widgets with page-level scroll and a target below the fold

**E. States and dynamics**

15. Hover-reveal controls in at least 2 widgets (row actions, resize handles, card buttons).
16. Disabled and loading states in at least 2 widgets, such as:
    - a submit disabled until valid
    - a skeleton that resolves on the task clock (`act-in-time` delay pattern)
    - a disabled look-alike decoy
17. Tooltips on icon-only buttons in at least 1 widget, opening after a kit-clock delay.
18. One popup per site: a toast or cookie banner at a seeded beat, dismissible, overlapping part of the stage.

**F. Content and text**

19. No lorem ipsum: use the shared realistic banks. Sample brand, product and person names from banks of at least 50
    items.
20. Label drift: page labels use the task's aliases (synonyms, casing, abbreviations) in at least 30% of episodes
    where the task exposes `labelAliases`.
21. Locale:
    - dates, numbers and times rendered in at least 2 locale formats
    - at least 1 widget per site with non-English frame labels (nav, submit) while the instruction stays English

**G. Process rules**

22. Follow [the rules every page follows](../AGENTS.md#rules-every-page-must-follow). Widget-specific `ctx.flag()`
    rules are documented in the widget header.
23. List in the pull request the helpers the site had to write locally and the traits it needs, so they can move into
    the kit.
