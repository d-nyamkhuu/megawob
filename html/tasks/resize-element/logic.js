/*
 * resize-element: drag a handle, grip, border or divider until an element has a target size.
 * Drag a resize handle, a native textarea grip, a table column border or a split-pane divider until
 * something has a target size. MiniWoB counterpart: resize-textarea. Port of legacy/resize.html, plus
 * relative goals, native textarea, table column and split-pane scenarios.
 *
 * Scenarios
 *   numeric   a window-like panel; the target is given as text ("W × H px", or one dimension). The panel
 *             shows a live size readout in ~70% of episodes, otherwise a px ruler along its fixed edges
 *   ghost     the target is drawn as a dashed outline anchored at the panel's fixed corner
 *   relative  "as wide as the Toolbar" (a reference element drawn on the page at the target size), "twice as
 *             tall as it is now" / "half as wide" (from the start size), or "make it square" (|w - h|)
 *   textarea  a native <textarea> resized with the browser's own grip (CSS resize both / vertical /
 *             horizontal): numeric target (a size caption under the box), a dashed outline, or MiniWoB's
 *             "make it at least N px taller/wider"
 *   column    a data table; drag the right border of one header cell: "make Name 220 px wide" (a column
 *             width bar under the table in ~70% of episodes, otherwise a ruler), or "as wide as Email"
 *   split     two panes with a draggable divider (vertical or horizontal): "make Files 240 px wide",
 *             "split them evenly", "give the preview two thirds of the space"
 *   aspect    aspect-locked resize of a window-like panel: "scale it to 150% keeping its proportions" (off
 *             starts; the factor is relative to the start size) or "make it 480 px wide without changing its
 *             proportions" (the other side follows the start ratio). Every start keeps the start ratio, so the
 *             goal is always reachable with the lock. The widget offers an aspect-lock toggle in the panel
 *             (model.lock) and Shift held at the press locks one drag; with an edge grip ('e', 's', ...) only a
 *             locked drag changes both sides, so the lock is needed; with a corner grip it is a convenience.
 *
 * Panel scenarios (numeric, ghost, relative, textarea, aspect)
 *   spec  { scenario, title, tau, min: { w, h }, max: { w, h }, target: { w, h }, axes ('both' | 'w' | 'h'),
 *           grip (the handle the plan drags: 'se' 'sw' 'ne' 'nw' 'e' 'w' 's' 'n'), anchor (the fixed point:
 *           the opposite corner, or 'nw'/'ne'/'sw' for edge grips), readout (bool), goal: { kind:
 *           'abs' | 'ref' | 'factor' | 'square' | 'grow' | 'scale' | 'fit', ref?: { name, dim, size }, factor?,
 *           start?, amount?, dim? (fit: the side the instruction names) } }
 *           textarea: grip 'se' (native), axes from the CSS resize mode.
 *           aspect: goal.start (the start size; its ratio is the one to keep), axes 'both'
 *   model { w, h, focus, lock? }   the element's own size in px; focus: the grip has keyboard focus (unscored);
 *           lock (aspect only, unscored): the panel's aspect-lock toggle is on
 *   error Chebyshev over the scored axes: max(|w - target.w|, |h - target.h|); square: |w - h|;
 *         grow: max(0, needed - size) on the scored axis (needed = start + amount)
 *   max fits the smallest stage (about 800 x 470 px once sidebar, side panel and footer take their share);
 *   widgets clamp at the stage, never below the target.
 * Column scenario
 *   spec  { columns: [{ name, kind, w }], rows: [[cell, ...]], col, target (px) | null, ref (column index for
 *           'equal') , goal: { kind: 'abs' | 'equal' }, min, max, readout, tau }
 *   model { cols: [w, ...], focus }   error |cols[col] - target| (equal: |cols[col] - cols[ref]|)
 * Split scenario
 *   spec  { orient ('v': side-by-side panes | 'h': stacked), total (container px along the split), cross,
 *           div (divider px), panes: [a, b], min (pane px), target (first pane px), goal: { kind: 'abs' |
 *           'ratio', num?, den? }, readout, tau, kstep }
 *   model { pos, focus }   first pane size in px; error |pos - target|
 *
 * plan targets
 *   { handle }                  where that handle is now (panel at model size)
 *   { handle, size: { w, h } }  where that handle would be if the panel had that size
 *   { col }, { col, width }     the right border of header cell col now / at that width
 *   { divider }, { divider: true, pos }   the divider now / at that first-pane size
 *   { lock: true }              the aspect-lock toggle (aspect: clicked first when model.lock is off)
 *   Keyboard episodes (spec.keyRoute): { click: { handle: grip } | { divider: true } } focuses it, then { key }:
 *   arrows move the focused grip / divider by kstep px (Shift: 10 x kstep); Home / End (divider only).
 *   Every widget exposes spec.grip (widgets declare traits.grips; sample() picks from them).
 *   A locked drag of an edge grip lands on the target because the other side follows the ratio (the task's
 *   lockedSize(spec, model, size) is the size a locked drag towards `size` produces).
 *   Kit gap: plan steps cannot hold a modifier during a drag ({ drag, modifiers } does not exist), so the
 *   oracle uses the lock toggle; Shift-drag works for agents (keyboard_down('Shift') + drag) and is logged as
 *   a modifier, not keyboard input.
 *
 * Levels (opts.level): spec.level 'easy' | 'medium' (absent at normal, which is the task as it always was).
 * The tolerance is spec.tau, widened x2.5 (easy) / x1.6 (medium) after the scenario is sampled (the instruction's
 * "(±N px)" shows it), tolerance() asks for an 'off' start beyond 2 tau, and an easy 'off' start is pulled 40% of
 * the way to the target (panel, textarea, aspect: the scored axes; column, split: the scored size), so the drag is
 * shorter. Targets, scenarios and ranges are unchanged (the sizes are the widget's and the stage's).
 *
 * Widget traits (opts.traits): grips (the handles the widget offers), lock (aspect toggle), geometry (panel episodes
 * with an absolute target, i.e. numeric and ghost: sampled proportions, see applyGeometry: spec.startSize is
 * the off start, target and max follow the given ranges, e.g. a portrait start with a larger target on both
 * axes; max is raised to hold them and may exceed the usual stage budget, so a site picks ranges that fit
 * its stage).
 *
 * Start modes: off; partial (one dimension already right, or part-way); wrong (width and height swapped,
 * the wrong dimension or the neighbouring column resized, the mirrored divider position); solved.
 * Keyboard: ~25% of panel / split episodes allow keys; the oracle uses them (nudge episodes start close).
 * opts.route: 'keyboard' forces keys + the keyboard route in numeric / ghost / relative / split, 'pointer'
 * forces pointer only; ignored by textarea, column and aspect (no keyboard route).
 * Out of range (opts.ood): tighter tolerances (2 px), 6-7 table columns, factor 3 / one third, split ratios
 * 1/5 and 4/5, larger textarea growth.
 *
 * Round 2 hooks (optional, pure; see the html/kit/env.js header)
 *   facts(model, spec)       what the page shows when solved: panel scenarios "Panel" (its title) and, when the page has a size
 *                            readout and the goal text does not already give the whole size, "Panel size" ("W × H px", aliases
 *                            "WxH", "W×H"; label paraphrases go in labels); column "Columns" (count) and "Resized column"; split "Panes", "Layout" and, with
 *                            readouts, the two pane sizes.
 *   silent(next, prev, spec, rng)   the size just set did not stick: it ends 8-20 px off on a scored axis (rounded or clamped
 *                            away from the target; aspect: both sides, ratio kept); column and split likewise; null when
 *                            every copy is still within tau.
 *   retarget(spec, model, rng)   same panel, a new goal: numeric / ghost / textarea a new target size; relative a new reference size
 *                            and name (ref), a new factor (factor); grow a new amount; aspect a new scale or width / height
 *                            at the start ratio; column 'abs' a new width; split a new pane size or fraction. null for 'square',
 *                            column 'equal' and judge episodes. Widgets show goal-specific things (ghost outline, reference
 *                            element) from spec at render, so the kit's re-render is all they need.
 *   parts(model, spec)       preempt=cancel: the panel's width and height (named "<title> width" / "<title> height"; value the side) and its
 *                            title (never changes), each column (its name; its width), or both panes (their names; their sizes) and
 *                            the Layout (never changes).
 *   judgeModes ambiguous, impossible (spec.judge = { mode, message, templates, vars, cands?, others?, what? }; the page starts solved):
 *     impossible  a size past what the workspace can hold (panel scenarios, textarea: a width; column: a width; split: a pane size);
 *                 status impossible, what: the size ("N px", "N")
 *     ambiguous   panel scenarios and textarea: a single number with no axis ("make the panel 300 px"); the reply asks with two
 *                 options, width and height; column / split: two columns / panes with the same name (twins: cands the name
 *                 twice; columns: others are the other column names)
 *
 * Helpers (widget API, env.taskDef.helpers):
 *   keyApply(spec, model, key, shift) -> model: one keyboard nudge.
 *   rulerStep: spacing between ruler marks, in px.
 * Self-tests live in selftest.js (loaded only by the checker and node tests).
 * Instruction wording lives in instructions.js, loaded through files.
 * Deviations from MiniWoB: resize-textarea only asks for "wider/taller"; here the grow goal has an amount
 * and other goals are exact sizes with a tolerance.
 */
(function () {
  'use strict';

  const TITLES = ['Notes', 'Preview', 'Console', 'Inspector', 'Chat', 'Layers', 'Outline', 'Terminal',
    'Comments', 'History', 'Properties', 'Output', 'Assets', 'Timeline', 'Activity', 'Calendar', 'Tasks',
    'Mini map', 'Watch list', 'Debugger', 'Color picker', 'Notifications', 'Clipboard', 'Bookmarks',
    'Scratchpad', 'Weather', 'Stocks', 'Map', 'Team chat', 'Logs', 'Variables', 'Downloads', 'Dashboard', 'Explorer',
    'Settings', 'Shortcuts', 'Queue', 'Inbox', 'Archive', 'Library', 'Gallery', 'Media', 'Recent items', 'System info',
    'Sources', 'Plugins', 'Extensions', 'New project', 'Components', 'Schema', 'Query', 'Reading pane', 'Responses',
    'Events', 'Metrics', 'Code samples', 'Profiler', 'Coverage', 'Build', 'Server', 'Database', 'Storage', 'Sync',
    'Session', 'Workspace', 'Welcome', 'About', 'Help', 'Appearance', 'Devices', 'Editor', 'Network', 'Performance',
    'Memory', 'Breakpoints', 'Call stack', 'Threads', 'Symbols', 'Diagnostics', 'Warnings', 'Errors', 'Find',
    'Replace', 'Snippets', 'Templates', 'Fonts', 'Swatches', 'Brushes', 'Canvas', 'Artboard', 'Effects', 'Filters',
    'Transform', 'Dependencies', 'Modules', 'Integrations', 'Automations', 'Deployments', 'Releases', 'Versions',
    'Branches', 'Changes', 'Commits', 'Contacts', 'Directory', 'People', 'Handbook', 'Glossary', 'Dictionary',
    'Reports', 'Journeys', 'Drafts', 'Sent items', 'Labels', 'Folder tree', 'Tab groups', 'Launcher', 'Toolbox',
    'Tool options', 'Formula bar', 'Cell styles', 'Pivot table', 'Chart editor', 'Field list', 'Filter view',
    'Sort rules', 'Data model', 'Test results', 'Test runner', 'Test cases', 'Data catalog', 'Audio mixer',
    'Track list', 'Playlist', 'Captions', 'Photo roll', 'Image bank', 'Print layout', 'Page setup', 'Style guide',
    'Access keys', 'Usage stats', 'Device list', 'Host status', 'Route table'];
  const REF_NAMES = { w: [
    'Toolbar', 'Banner', 'Search bar', 'Header strip', 'Tab bar', 'Status bar', 'Ribbon', 'Breadcrumb bar', 'Footer',
    'Menubar', 'Address bar', 'Progress bar', 'Meter', 'Color scale', 'Zoom bar', 'Playback bar'
  ],
    h: [
      'Sidebar', 'Navigation rail', 'Dock', 'Tool palette', 'Side menu', 'Filter column', 'Thumbnail strip',
      'Index column', 'Scroll track', 'Tree browser', 'Tab stack', 'Bookmark rail', 'Gutter', 'Page navigator',
      'Chat roster', 'Side ruler'
    ] };
  const FIELD_NAMES = ['Comments', 'Notes', 'Description', 'Message', 'Feedback', 'Address', 'Bio', 'Release notes',
    'Summary', 'Reason for return', 'Special requests', 'Meeting notes', 'Cover letter', 'Bug report',
    'Project overview', 'Daily journal', 'Your thoughts', 'Trip itinerary', 'Work experience', 'Application essay',
    'Event details', 'Problem details', 'What happened', 'Project goals', 'Key takeaways', 'Daily reflection',
    'Product review', 'Book review', 'Recommendations', 'Lesson learned', 'Team update', 'Status update', 'Case study',
    'Project brief', 'Career goals', 'Personal story', 'Event recap', 'Work sample', 'Essay response', 'Other details',
    'Creative brief', 'Design rationale', 'Feature proposal', 'Improvement ideas', 'Next steps', 'Weekly recap',
    'Progress report', 'Field report', 'Reading response', 'Customer story', 'Volunteer profile', 'Incident account',
    'Favorite memory', 'Workshop agenda', 'Artist statement', 'Portfolio intro', 'Podcast outline',
    'Research abstract', 'Class reflection', 'Travel diary', 'Garden log', 'Community update', 'News recap',
    'Build log', 'Welcome message', 'Support request', 'Farewell letter', 'Memoir excerpt', 'Game narrative',
    'Character sketch', 'Craft process', 'Travel story', 'Learning journal', 'Personal motto', 'Family recipe',
    'Room description', 'Pet profile', 'Milestone account', 'Event invitation', 'Question response',
    'Hometown memories', 'Award acceptance', 'Exhibit caption', 'Speech draft', 'Folktale draft', 'Design critique',
    'Trip highlights', 'Object history', 'First impressions'];
  const PANE_PAIRS = { v: [['Files', 'Preview'], ['Editor', 'Preview'], ['Inbox', 'Message'], ['Map', 'Results'], ['Folders', 'Documents'],
    ['Code', 'Output'], ['Outline', 'Document'], ['Contacts', 'Details'], ['Channels', 'Conversation'], ['Queue', 'Player']],
  h: [['Editor', 'Terminal'], ['Query', 'Results'], ['Chart', 'Data'], ['Timeline', 'Properties'], ['Document', 'Comments'],
    ['Source', 'Console'], ['Messages', 'Reply'], ['Canvas', 'Layers']] };
  const COLUMN_KINDS = [
    { name: 'Name', kind: 'name' }, { name: 'Email', kind: 'email' }, { name: 'City', kind: 'city' },
    { name: 'Status', kind: 'status' }, { name: 'Role', kind: 'role' }, { name: 'Amount', kind: 'amount' },
    { name: 'Updated', kind: 'date' }, { name: 'Phone', kind: 'phone' }, { name: 'Company', kind: 'company' },
    { name: 'Product', kind: 'product' }, { name: 'Department', kind: 'dept' }, { name: 'Country', kind: 'country' },
  ];
  const COL_ALIASES = { Name: ['full name', 'name column'], Email: ['e-mail', 'email address'], City: ['town', 'city column'],
    Status: ['state'], Role: ['job title', 'position'], Amount: ['total', 'value'], Updated: ['last updated', 'modified date'],
    Phone: ['phone number', 'telephone'], Company: ['organization', 'employer'], Product: ['item', 'product name'],
    Department: ['team', 'dept'], Country: ['nation', 'country column'] };
  const STATUSES = [
    'Active', 'Pending', 'Paused', 'Archived', 'Invited', 'Overdue', 'Shipped', 'Draft', 'Loaded', 'Complete',
    'Failed', 'Running', 'Queued', 'Expired', 'Matched', 'Locked'
  ];
  const MIN = { w: 60, h: 60 };
  // Fixed point for each grip (the corner or edge opposite the dragged handle).
  const GRIP_ANCHOR = { se: 'nw', e: 'nw', s: 'nw', sw: 'ne', w: 'ne', ne: 'sw', n: 'sw', nw: 'se' };
  const GRIPS = Object.keys(GRIP_ANCHOR);
  const CORNER_FOR = { nw: 'se', ne: 'sw', sw: 'ne', se: 'nw' };
  const WEIGHTS = { numeric: 2, ghost: 1, relative: 2, textarea: 2, column: 2, split: 2, aspect: 2 };

  const chebyshev = (a, b, axes = 'both') => Math.max(axes !== 'h' ? Math.abs(a.w - b.w) : 0, axes !== 'w' ? Math.abs(a.h - b.h) : 0);
  const C = env.content;
  const movesX = (g) => /[ew]/.test(g);
  const movesY = (g) => /[ns]/.test(g);
  // Size change per px of handle movement: +1 when the handle is on the far side from the anchor.
  const gainX = (g) => (g.includes('e') ? 1 : g.includes('w') ? -1 : 0);
  const gainY = (g) => (g.includes('s') ? 1 : g.includes('n') ? -1 : 0);
  const rulerStep = 50;

  const pickScenario = (rng, allowed) => env.util.pickWeighted(rng, allowed, WEIGHTS);

  function gripFor(rng, axes, grips) {
    const ok = grips.filter((g) => (axes === 'both' ? movesX(g) && movesY(g) : axes === 'w' ? movesX(g) : movesY(g)));
    const pool = ok.length ? ok : grips;
    // The classic bottom-right corner stays common.
    return pool.includes('se') && rng.bool(0.35) ? 'se' : rng.pick(pool);
  }

  // ------------------------------------------------------------------ samplers

  function samplePanel(rng, spec, opts) {
    const v = spec.scenario;
    const grips = (opts.traits && opts.traits.grips) || GRIPS;
    spec.title = C.pick(rng, TITLES, spec);
    spec.max = { w: rng.int(520, 680), h: rng.int(280, 380) };
    spec.min = { ...MIN };
    spec.readout = v === 'ghost' ? rng.bool(0.5) : rng.bool(0.7);
    spec.tau = opts.ood ? 2 : spec.readout || v === 'ghost' ? rng.int(3, 8) : rng.int(6, 12);
    const tgt = () => ({ w: rng.int(140, spec.max.w), h: rng.int(100, spec.max.h) });
    spec.target = tgt();
    spec.axes = 'both';
    spec.goal = { kind: 'abs' };
    if (v === 'numeric') spec.axes = rng.pick(['both', 'both', 'both', 'w', 'h']);
    if (v === 'relative') {
      const off = spec.startMode === 'off';
      const kind = C.weighted(rng, [['ref', 3], ['factor', off ? 2.5 : 0], ['square', 1]]);
      spec.goal = { kind };
      spec.readout = rng.bool(0.4);
      if (kind === 'ref') {
        const dim = rng.pick(['w', 'h']);
        spec.axes = dim;
        // Room for the reference element next to the workspace.
        if (dim === 'w') spec.max.h = Math.min(spec.max.h, 300);
        else spec.max.w = Math.min(spec.max.w, 500);
        const size = dim === 'w' ? rng.int(160, spec.max.w - 10) : rng.int(140, spec.max.h - 10);
        spec.goal.ref = { name: C.pick(rng, REF_NAMES[dim], spec), dim, size };
        spec.target = { ...tgt(), [dim]: size };
      } else if (kind === 'factor') {
        const dim = rng.pick(['w', 'h']);
        spec.axes = dim;
        const factors = opts.ood ? [3, 1 / 3] : [2, 0.5, 1.5];
        for (let tries = 0; tries < 40; tries++) {
          const f = rng.pick(factors);
          const lo = Math.ceil(Math.max(spec.min[dim] + 20, 100 / f));
          const hi = Math.floor(Math.min(spec.max[dim], spec.max[dim] / f));
          if (hi - lo < 10) continue;
          const s0 = rng.int(lo, hi);
          const t = Math.round(s0 * f);
          if (Math.abs(t - s0) < 4 * spec.tau + 10) continue;
          const start = { w: rng.int(spec.min.w + 40, spec.max.w), h: rng.int(spec.min.h + 40, spec.max.h) };
          start[dim] = s0;
          spec.goal = { kind: 'factor', dim, factor: f, start };
          spec.target = { ...start, [dim]: t };
          break;
        }
        if (spec.goal.kind !== 'factor') spec.goal = { kind: 'square' };
      }
      if (spec.goal.kind === 'square') spec.axes = 'both';
    }
    spec.grip = gripFor(rng, spec.goal.kind === 'square' ? rng.pick(['w', 'h', 'both']) : spec.axes, grips);
    spec.anchor = GRIP_ANCHOR[spec.grip];
    if (opts.traits && opts.traits.geometry && spec.goal.kind === 'abs') applyGeometry(rng.fork('geometry'), spec, opts.traits.geometry);
  }

  // traits.geometry: sampled sizes for panel episodes with an absolute target (numeric, ghost), drawn from
  // rng.fork('geometry') after everything else, so the rest of the spec is the unforced sample's.
  //   { start: { w: [lo, hi], h: [lo, hi] }, target: { w, h } (same shape), max?: { w, h } (ranges for the
  //     bounds; default: the target plus 30-90 px, never below the unforced bound),
  //     portrait?: true (the start panel is taller than wide), grow?: true (the target is larger than the start
  //     on both axes), gap?: px (the least size difference grow asks for, default 2 tau + 20) }
  // A range may also be a single number. Sets spec.startSize (init starts the panel there), target and max, and
  // the keyboard nudge route is off (it would move the start next to the target).
  function applyGeometry(rng, spec, geo) {
    const draw = (rg, lo) => {
      const [a, b] = Array.isArray(rg) ? rg : [rg, rg];
      return Math.round(Math.max(lo, rng.float(a, b)));
    };
    const gap = geo.gap || 2 * spec.tau + 20;
    let start;
    let target;
    for (let t = 0; t < 60; t++) {
      start = { w: draw(geo.start.w, spec.min.w), h: draw(geo.start.h, spec.min.h) };
      target = { w: draw(geo.target.w, spec.min.w), h: draw(geo.target.h, spec.min.h) };
      if (geo.portrait && start.h < 1.1 * start.w) continue;
      if (geo.grow && (target.w - start.w < gap || target.h - start.h < gap)) continue;
      break;
    }
    if (geo.grow) {
      target.w = Math.max(target.w, start.w + gap);
      target.h = Math.max(target.h, start.h + gap);
    }
    const room = (rg, v) => (rg ? draw(rg, v) : v + rng.int(30, 90));
    spec.max = { w: Math.max(spec.max.w, room(geo.max && geo.max.w, target.w), start.w, target.w), h: Math.max(spec.max.h, room(geo.max && geo.max.h, target.h), start.h, target.h) };
    spec.target = target;
    spec.startSize = start;
  }

  // Aspect-locked goals: a scale factor of the start size (off starts) or one side with the other following
  // the start ratio. Start, target and every size in between stay inside [min, max].
  function sampleAspect(rng, spec, opts) {
    const grips = (opts.traits && opts.traits.grips) || GRIPS;
    spec.title = C.pick(rng, TITLES, spec);
    spec.max = { w: rng.int(520, 680), h: rng.int(280, 380) };
    spec.min = { ...MIN };
    spec.readout = rng.bool(0.6);
    spec.tau = opts.ood ? 3 : spec.readout ? rng.int(3, 6) : rng.int(5, 9);
    spec.axes = 'both';
    spec.lockable = !!(opts.traits && opts.traits.lock);
    const off = spec.startMode === 'off';
    const factors = opts.ood ? [2.5, 0.4, 3] : [1.5, 0.5, 2, 0.75, 1.25];
    let goal = null;
    for (let tries = 0; tries < 60 && !goal; tries++) {
      const scale = off && rng.bool(0.55);
      const ratio = rng.float(0.75, 2.2);
      const f = rng.pick(factors);
      // Start size s0 (ratio w/h) and target s0 * f (scale) or a free size of the same ratio (fit), at least
      // 250 x 130 so window frame (title bar with its title, lock toggle) stays usable.
      const lo = Math.max(250, 130 * ratio);
      const hi = Math.min(spec.max.w - 10, (spec.max.h - 10) * ratio);
      if (hi - lo < 40) continue;
      const w0 = rng.float(lo, hi);
      let w1 = scale ? w0 * f : rng.float(lo, hi);
      if (w1 < lo || w1 > hi || Math.abs(w1 - w0) < 4 * spec.tau + 30) continue;
      const start = { w: Math.round(w0), h: Math.round(w0 / ratio) };
      w1 = Math.round(w1);
      const target = { w: w1, h: Math.round((w1 * start.h) / start.w) };
      if (Math.abs(target.h - start.h) < 2 * spec.tau + 10) continue;
      goal = scale ? { kind: 'scale', factor: f, start } : { kind: 'fit', dim: rng.pick(['w', 'h']), start };
      spec.target = target;
    }
    if (!goal) {
      goal = { kind: 'fit', dim: 'w', start: { w: 250, h: 170 } };
      spec.target = { w: 400, h: Math.round(400 * 170 / 250) };
    }
    spec.goal = goal;
    // Edge grips need the lock (widgets without one get corners); corners are common too.
    const edge = rng.bool(0.5) && spec.lockable;
    const pool = grips.filter((g) => (g.length === 1) === edge);
    spec.grip = pool.length ? rng.pick(pool) : rng.pick(grips);
    spec.anchor = GRIP_ANCHOR[spec.grip];
    // The corner that keeps the same point fixed: the free-drag fallback when the ratio got broken.
    spec.corner = CORNER_FOR[spec.anchor];
  }

  // The size a locked drag of spec.grip towards `want` produces (the primitive's rule: the axis with the larger
  // relative change wins for corners; an edge drives its own axis), rounded and clamped like the widget.
  function lockedSize(spec, model, want, g = spec.grip) {
    const a = model.w / model.h;
    let w;
    if (movesX(g) && movesY(g)) {
      w = Math.abs(want.w / model.w - 1) >= Math.abs(want.h / model.h - 1) ? want.w : want.h * a;
    } else w = movesX(g) ? want.w : want.h * a;
    w = Math.max(Math.max(spec.min.w, spec.min.h * a), Math.min(Math.min(spec.max.w, spec.max.h * a), w));
    return { w: Math.round(w), h: Math.round(w / a) };
  }

  function sampleTextarea(rng, spec, opts) {
    spec.title = C.pick(rng, FIELD_NAMES, spec);
    spec.max = { w: rng.int(460, 620), h: rng.int(240, 320) };
    spec.min = { w: 160, h: 60 };
    spec.axes = rng.pick(['both', 'both', 'w', 'h', 'h']);
    spec.grip = 'se';
    spec.anchor = 'nw';
    const kind = rng.pick(['abs', 'abs', 'grow', 'grow', 'ghost']);
    spec.goal = { kind: kind === 'ghost' ? 'abs' : kind };
    spec.outline = kind === 'ghost';
    spec.readout = kind === 'abs';
    spec.tau = kind === 'grow' ? 2 : opts.ood ? 2 : rng.int(4, 8);
    spec.target = { w: rng.int(spec.min.w + 40, spec.max.w), h: rng.int(spec.min.h + 30, spec.max.h) };
    if (kind === 'grow') {
      const dim = spec.axes === 'both' ? rng.pick(['w', 'h']) : spec.axes;
      const cap = Math.floor((spec.max[dim] - spec.min[dim] - 30) / 10);
      const amount = Math.min(cap, opts.ood ? rng.int(14, 24) : rng.int(4, 12)) * 10;
      const start = { w: rng.int(spec.min.w, spec.max.w - 20), h: rng.int(spec.min.h, spec.max.h - 20) };
      start[dim] = rng.int(spec.min[dim], Math.max(spec.min[dim], spec.max[dim] - amount - 10));
      spec.goal = { kind: 'grow', dim, amount, start };
      spec.target = { ...start, [dim]: start[dim] + amount };
    }
  }

  function cellText(rng, kind, spec) {
    switch (kind) {
      case 'name': return C.personName(rng, {}).full;
      case 'email': return C.emailAddress(rng, C.personName(rng, {}));
      case 'city': return C.pick(rng, C.CITIES, spec).city;
      case 'country': return C.pick(rng, C.COUNTRIES, spec).name;
      case 'status': return rng.pick(STATUSES);
      case 'role': return C.pick(rng, C.JOB_TITLES, spec);
      case 'dept': return C.pick(rng, C.DEPARTMENTS, spec);
      case 'amount': return `$${rng.int(12, 9800).toLocaleString('en-US')}.${String(rng.int(0, 99)).padStart(2, '0')}`;
      case 'date': return `${rng.pick(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])} ${rng.int(1, 28)}, ${rng.int(2021, 2026)}`;
      case 'phone': return C.phone(rng, 'en-US');
      case 'company': return C.pick(rng, C.COMPANIES, spec);
      case 'product': return C.pick(rng, C.PRODUCTS, spec).name;
      default: return '';
    }
  }

  function sampleColumn(rng, spec, opts) {
    const n = opts.ood ? rng.int(6, 7) : rng.int(3, 5);
    const budget = 760;
    const cols = C.sample(rng, COLUMN_KINDS, n, spec).map((c) => ({ ...c, w: 0 }));
    spec.min = 60;
    spec.readout = rng.bool(0.7);
    spec.tau = opts.ood ? 2 : spec.readout ? rng.int(3, 6) : rng.int(6, 10);
    spec.col = rng.int(0, n - 1);
    const base = Math.floor((budget - 40) / n);
    cols.forEach((c) => { c.w = rng.int(Math.max(spec.min + 10, Math.round(base * 0.55)), Math.max(spec.min + 20, Math.round(base * 0.9))); });
    const others = cols.reduce((a, c, i) => a + (i === spec.col ? 0 : c.w), 0);
    spec.max = Math.max(spec.min + 60, Math.min(340, budget - others));
    spec.goal = { kind: rng.bool(0.3) ? 'equal' : 'abs' };
    if (spec.goal.kind === 'equal') {
      const cands = cols.map((c, i) => i).filter((i) => i !== spec.col && cols[i].w >= spec.min + 20 && cols[i].w <= spec.max);
      if (cands.length) spec.ref = rng.pick(cands);
      else spec.goal.kind = 'abs';
    }
    spec.target = spec.goal.kind === 'abs' ? rng.int(spec.min + 30, spec.max) : null;
    spec.columns = cols;
    spec.budget = budget;
    const nrows = opts.ood ? rng.int(7, 9) : rng.int(4, 7);
    spec.rows = Array.from({ length: nrows }, () => cols.map((c) => cellText(rng, c.kind, spec)));
  }

  function sampleSplit(rng, spec, opts) {
    spec.orient = rng.bool(0.6) ? 'v' : 'h';
    spec.total = spec.orient === 'v' ? rng.int(520, 720) : rng.int(300, 400);
    spec.cross = spec.orient === 'v' ? rng.int(260, 360) : rng.int(480, 680);
    spec.div = rng.int(6, 10);
    spec.min = 60;
    spec.panes = C.pick(rng, PANE_PAIRS[spec.orient], spec).slice();
    const span = spec.total - spec.div;
    const kind = rng.pick(['abs', 'abs', 'ratio', 'ratio']);
    spec.readout = kind === 'abs' ? rng.bool(0.7) : rng.bool(0.3);
    spec.tau = opts.ood ? 3 : kind === 'ratio' ? Math.max(6, Math.round(span * 0.02)) : spec.readout ? rng.int(4, 7) : rng.int(7, 10);
    if (kind === 'ratio') {
      const opts2 = opts.ood ? [[1, 5], [4, 5]] : [[1, 2], [1, 2], [1, 3], [2, 3], [1, 4], [3, 4]];
      let [num, den] = rng.pick(opts2);
      // Small fractions of a short split would fall under the pane minimum.
      if ((span * num) / den < spec.min + 10 || span - (span * num) / den < spec.min + 10) [num, den] = [1, 3];
      spec.goal = { kind: 'ratio', num, den, of: rng.int(0, 1) };
      // "of" = which pane the fraction names; the first pane's size follows.
      const first = spec.goal.of === 0 ? (span * num) / den : span - (span * num) / den;
      spec.target = Math.round(first);
    } else {
      spec.goal = { kind: 'abs', of: rng.int(0, 1) };
      spec.target = rng.int(spec.min + 30, span - spec.min - 30);
    }
    spec.kstep = Math.max(4, 2 * spec.tau);
  }

  // ------------------------------------------------------------------ keyboard model (widgets use it too)

  // One key on the focused grip (panel scenarios) or divider (split): returns the new model.
  function keyApply(spec, model, key, shift) {
    const k = (spec.kstep || 4) * (shift ? 10 : 1);
    if (spec.scenario === 'split') {
      const span = spec.total - spec.div;
      let pos = model.pos;
      if (key === 'Home') pos = spec.min;
      else if (key === 'End') pos = span - spec.min;
      else if (key === 'ArrowRight' || key === 'ArrowDown') pos += k;
      else if (key === 'ArrowLeft' || key === 'ArrowUp') pos -= k;
      else return model;
      return { ...model, pos: Math.max(spec.min, Math.min(span - spec.min, pos)) };
    }
    const g = spec.grip;
    const d = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] }[key];
    if (!d) return model;
    const w = model.w + d[0] * k * gainX(g);
    const h = model.h + d[1] * k * gainY(g);
    return {
      ...model,
      w: Math.max(spec.min.w, Math.min(spec.max.w, w)),
      h: Math.max(spec.min.h, Math.min(spec.max.h, h)),
    };
  }

  // Next key towards the target (greedy per axis: Shift steps while far, single steps near); null if a key
  // would not improve the error.
  function nextKey(spec, model, err) {
    const k = spec.kstep;
    const tries = [];
    if (spec.scenario === 'split') {
      const d = spec.target - model.pos;
      const dir = d > 0 ? 'ArrowRight' : 'ArrowLeft';
      const key = spec.orient === 'h' ? (d > 0 ? 'ArrowDown' : 'ArrowUp') : dir;
      tries.push([key, Math.abs(d) >= 6 * k], [key, false]);
    } else {
      const want = goalSize(spec, model);
      const g = spec.grip;
      const dw = want.w - model.w;
      const dh = want.h - model.h;
      const axis = Math.abs(dw) * (movesX(g) ? 1 : 0) >= Math.abs(dh) * (movesY(g) ? 1 : 0) ? 'w' : 'h';
      const d = axis === 'w' ? dw : dh;
      const key = axis === 'w' ? ((d > 0) === (gainX(g) > 0) ? 'ArrowRight' : 'ArrowLeft') : ((d > 0) === (gainY(g) > 0) ? 'ArrowDown' : 'ArrowUp');
      tries.push([key, Math.abs(d) >= 6 * k], [key, false]);
    }
    const e0 = err(model);
    for (const [key, shift] of tries) {
      const m = keyApply(spec, model, key, shift);
      if (err(m) < e0 - 1e-9) return { key: shift ? `Shift+${key}` : key };
    }
    return null;
  }

  // Aspect starts all keep the start ratio: off = the start size (lock off), partial = part of the way there
  // (lock on), wrong = scaled the other way (lock on or off).
  function initAspect(spec, rng, mode) {
    const s0 = spec.goal.start;
    const t = spec.target;
    const a = s0.w / s0.h;
    const lo = Math.max(spec.min.w, spec.min.h * a);
    const hi = Math.min(spec.max.w, spec.max.h * a);
    const at = (w) => {
      w = Math.round(Math.max(lo, Math.min(hi, w)));
      return { w, h: Math.round(w / a) };
    };
    if (mode === 'partial') return { ...at(s0.w + (t.w - s0.w) * rng.float(0.35, 0.65)), focus: false, lock: true };
    if (mode === 'wrong') {
      let w = (s0.w * s0.w) / t.w;
      // Scaled the wrong way; when that hits a bound, overshoot past the target instead.
      if (w < lo + 20 || w > hi - 20) w = t.w + (t.w - s0.w) * 0.6;
      return { ...at(w), focus: false, lock: rng.bool(0.5) };
    }
    return { ...s0, focus: false, lock: false };
  }

  function planAspect(model, spec) {
    const t = spec.target;
    const tau = spec.tau;
    if (spec.lockable && chebyshev(lockedSize(spec, model, t), t) <= tau - 1) {
      if (!model.lock) return { click: { lock: true } };
      return { drag: [{ handle: spec.grip }, { handle: spec.grip, size: t }] };
    }
    // The ratio no longer matches (or there is no lock): unlock and drag the corner freely.
    if (spec.lockable && model.lock) return { click: { lock: true } };
    return { drag: [{ handle: spec.corner }, { handle: spec.corner, size: t }] };
  }

  // The size the plan aims for (scored axes from the target, others kept).
  function goalSize(spec, model) {
    if (spec.goal.kind === 'square') {
      const s = Math.max(spec.min.w, spec.min.h, Math.min(spec.max.w, spec.max.h,
        movesX(spec.grip) && movesY(spec.grip) ? Math.round((model.w + model.h) / 2) : movesX(spec.grip) ? model.h : model.w));
      return { w: movesX(spec.grip) ? s : model.w, h: movesY(spec.grip) ? s : model.h };
    }
    const t = spec.target;
    return { w: spec.axes !== 'h' ? t.w : model.w, h: spec.axes !== 'w' ? t.h : model.h };
  }

  function panelError(model, spec) {
    const g = spec.goal;
    if (g.kind === 'square') return Math.abs(model.w - model.h);
    if (g.kind === 'grow') return Math.max(0, spec.target[g.dim] - model[g.dim]);
    return chebyshev(model, spec.target, spec.axes);
  }

  // ------------------------------------------------------------------ round 2: judge modes, facts, silent, retarget

  function judgeOf(jr, spec, mode) {
    const v = spec.scenario;
    const I = env.instruct;
    if (v === 'column') {
      const c = spec.columns[spec.col];
      if (mode === 'impossible') {
        const n = spec.budget + 10 * jr.int(10, 30);
        return { mode, what: [`${n} px`, String(n)], message: `I can't do that: the table is only ${spec.budget} px wide, so a ${n} px column does not fit.`,
          templates: [
            'Make the {c} column {n} px wide.', 'Resize the {c} column to {n} px.', 'Set the width of {c} to {n} px.',
            'Give column {c} a {n} px width.', 'Column {c} is to be {n} px wide.'
          ], vars: { c: `“${c.name}”`, n } };
      }
      const j = jr.pick(spec.columns.map((_, i) => i).filter((i) => i !== spec.col));
      spec.columns[j].name = c.name;
      return { mode, cands: [[c.name], [c.name]], others: [...new Set(spec.columns.map((x) => x.name).filter((x) => x !== c.name))].map((x) => [x]),
        message: `Which “${c.name}” column do you mean? There are two.`,
        templates: ['Make the {c} column {n} px wide.', 'Resize the {c} column to {n} px.'], vars: { c: `“${c.name}”`, n: 10 * jr.int(10, 25) } };
    }
    if (v === 'split') {
      const span = spec.total - spec.div;
      const dim = spec.orient === 'v' ? 'wide' : 'tall';
      if (mode === 'impossible') {
        const n = span + 10 * jr.int(10, 30);
        return { mode, what: [`${n} px`, String(n)], message: `I can't do that: the split is only ${span} px ${dim}, so a ${n} px pane does not fit.`,
          templates: ['Make the {p} pane {n} px {d}.', 'Resize {p} to {n} px.'], vars: { p: spec.panes[0], n, d: dim } };
      }
      spec.panes[1] = spec.panes[0];
      return { mode, cands: [[spec.panes[0]], [spec.panes[0]]], message: `Which ${spec.panes[0]} pane do you mean? There are two.`,
        templates: ['Make the {p} pane {n} px {d}.', 'Resize {p} to {n} px.'], vars: { p: spec.panes[0], n: 10 * jr.int(10, 25), d: dim } };
    }
    const box = v === 'textarea' ? jr.pick([
      'text box', 'textarea', 'field', 'editor', 'text pad'
    ]) : jr.pick(['panel', 'window', 'box']);
    const p = `“${spec.title}” ${box}`;
    if (mode === 'impossible') {
      const n = spec.max.w + 10 * jr.int(20, 60);
      return { mode, what: [`${n} px`, String(n)], message: `I can't do that: the workspace is only ${spec.max.w} px wide, so a ${n} px width is not possible.`,
        templates: [
          'Make the {p} {n} px wide.', 'Resize the {p} to a width of {n} px.', 'Set the {p}\'s width to {n} px.',
          'Give the {p} a {n} px width.', 'Use a {n} px width for the {p}.', 'The {p} needs a width of {n} px.'
        ], vars: { p, n } };
    }
    return { mode, cands: [['width', 'wide'], ['height', 'tall', 'high']], message: 'Should that be the width or the height?',
      templates: [
        'Make the {p} {n} px.', 'Resize the {p} to {n} px.', 'Set the size of the {p} to {n} px.',
        'I need the {p} at {n} px.', 'The {p} should measure {n} px.', 'Use {n} px for this {p}.'
      ], vars: { p, n: 10 * jr.int(20, 40) } };
  }

  function judgeInstruction(spec, rng) {
    const I = env.instruct;
    const j = spec.judge;
    const core = I.ucFirst(I.phrase(rng, j.templates, j.vars, spec.isplit));
    return I.say(rng, core, { isplit: spec.isplit, terse: I.fill(j.templates[0], j.vars) });
  }

  function factsOf(model, spec) {
    if (spec.judge) return [];
    const v = spec.scenario;
    if (v === 'column') {
      return [
        { label: 'Columns', value: String(spec.columns.length), labels: ['Column count', 'Number of columns'] },
        { label: 'Resized column', value: spec.columns[spec.col].name, labels: ['Column', 'Changed column'] },
      ];
    }
    if (v === 'split') {
      const [a, b] = spec.panes;
      const out = [
        { label: 'Panes', value: `${a} and ${b}`, aliases: [`${a} / ${b}`, `${a}, ${b}`, `${b} and ${a}`] },
        { label: 'Layout', value: spec.orient === 'v' ? 'Side by side' : 'Stacked', aliases: spec.orient === 'v' ? ['Vertical divider', 'Left and right'] : ['Horizontal divider', 'Top and bottom'] },
      ];
      if (spec.readout) {
        const span = spec.total - spec.div;
        out.push({ label: `${a} pane size`, value: `${model.pos} px`, aliases: [String(model.pos)] },
          { label: `${b} pane size`, value: `${span - model.pos} px`, aliases: [String(span - model.pos)] });
      }
      return out;
    }
    const out = [{ label: 'Panel', value: spec.title, labels: ['Title', 'Panel title', 'Window'] }];
    const full = v === 'numeric' && spec.axes === 'both' && spec.goal.kind === 'abs';
    if (spec.readout && !full) {
      out.push({ label: 'Panel size', value: `${model.w} × ${model.h} px`, aliases: [`${model.w}x${model.h}`, `${model.w}×${model.h}`, `${model.w} x ${model.h}`, `${model.w} × ${model.h}`, `${model.w} by ${model.h}`] });
    }
    return out;
  }

  // The size just set did not stick: it ends 8-20 px off on a scored axis.
  function silentOf(next, prev, spec, rng) {
    if (spec.judge) return null;
    const tau = spec.tau;
    const err = (m) => task.error(m, spec);
    const off = tau + rng.int(8, 20);
    const sign = rng.bool() ? 1 : -1;
    const v = spec.scenario;
    const cands = [];
    for (const sg of [sign, -sign]) {
      if (v === 'split') {
        const span = spec.total - spec.div;
        cands.push({ ...next, pos: Math.max(spec.min, Math.min(span - spec.min, next.pos + sg * off)) });
      } else if (v === 'column') {
        const cols = next.cols.slice();
        cols[spec.col] = Math.max(spec.min, Math.min(spec.max, cols[spec.col] + sg * off));
        cands.push({ ...next, cols });
      } else if (v === 'aspect') {
        const a = next.w / next.h;
        const w = Math.max(Math.max(spec.min.w, spec.min.h * a), Math.min(Math.min(spec.max.w, spec.max.h * a), next.w + sg * off));
        cands.push({ ...next, w: Math.round(w), h: Math.round(w / a) });
      } else {
        const dims = spec.goal.kind === 'square' ? ['w'] : spec.goal.kind === 'grow' ? [spec.goal.dim] : spec.axes === 'both' ? ['w', 'h'] : [spec.axes];
        const d = dims[rng.int(0, dims.length - 1)];
        cands.push({ ...next, [d]: Math.max(spec.min[d], Math.min(spec.max[d], next[d] + sg * off)) });
      }
    }
    return cands.find((c) => err(c) > tau) || null;
  }

  // Same panel, a new goal: see the header.
  function retargetOf(spec, model, rng) {
    if (spec.judge) return null;
    const v = spec.scenario;
    const out = [];
    const cloneSpec = () => env.util.clone(spec);
    const tau = spec.tau;
    const far = (a, b) => Math.abs(a - b) > 2 * tau + 20;
    if (v === 'split') {
      const span = spec.total - spec.div;
      for (let k = 0; k < 10; k++) {
        const ns = cloneSpec();
        if (spec.goal.kind === 'ratio') {
          const [num, den] = rng.pick(spec.ood ? [[1, 5], [4, 5]] : [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]]);
          if ((span * num) / den < spec.min + 10 || span - (span * num) / den < spec.min + 10) continue;
          ns.goal = { kind: 'ratio', num, den, of: rng.int(0, 1) };
          ns.target = Math.round(ns.goal.of === 0 ? (span * num) / den : span - (span * num) / den);
        } else {
          ns.goal = { kind: 'abs', of: rng.int(0, 1) };
          ns.target = rng.int(spec.min + 30, span - spec.min - 30);
        }
        out.push(ns);
      }
    } else if (v === 'column') {
      if (spec.goal.kind !== 'abs') return null;
      for (let k = 0; k < 8; k++) out.push({ ...cloneSpec(), target: rng.int(spec.min + 30, spec.max) });
    } else if (v === 'aspect') {
      const s0 = spec.goal.start;
      const a = s0.w / s0.h;
      const lo = Math.max(250, 130 * a);
      const hi = Math.min(spec.max.w - 10, (spec.max.h - 10) * a);
      for (let k = 0; k < 12 && hi - lo >= 40; k++) {
        const ns = cloneSpec();
        let w1;
        if (spec.goal.kind === 'scale') {
          const f = rng.pick([1.5, 0.5, 2, 0.75, 1.25].filter((x) => x !== spec.goal.factor));
          w1 = s0.w * f;
          ns.goal.factor = f;
        } else {
          w1 = rng.float(lo, hi);
          ns.goal.dim = rng.pick(['w', 'h']);
        }
        if (w1 < lo || w1 > hi) continue;
        w1 = Math.round(w1);
        ns.target = { w: w1, h: Math.round((w1 * s0.h) / s0.w) };
        out.push(ns);
      }
    } else {
      const g = spec.goal;
      if (g.kind === 'square') return null;
      for (let k = 0; k < 10; k++) {
        const ns = cloneSpec();
        if (g.kind === 'grow') {
          const cap = Math.floor((spec.max[g.dim] - spec.min[g.dim] - 30) / 10);
          const amount = Math.min(cap, rng.int(4, 12)) * 10;
          if (amount === g.amount || g.start[g.dim] + amount > spec.max[g.dim]) continue;
          ns.goal.amount = amount;
          ns.target = { ...g.start, [g.dim]: g.start[g.dim] + amount };
        } else if (g.kind === 'ref') {
          const size = g.ref.dim === 'w' ? rng.int(160, spec.max.w - 10) : rng.int(140, spec.max.h - 10);
          ns.goal.ref = { name: g.ref.name, dim: g.ref.dim, size };
          ns.target = { ...spec.target, [g.ref.dim]: size };
        } else if (g.kind === 'factor') {
          const f = rng.pick([2, 0.5, 1.5].filter((x) => x !== g.factor));
          const t = Math.round(g.start[g.dim] * f);
          if (t < spec.min[g.dim] || t > spec.max[g.dim]) continue;
          ns.goal.factor = f;
          ns.target = { ...g.start, [g.dim]: t };
        } else {
          const t = { w: rng.int(140, spec.max.w), h: rng.int(100, spec.max.h) };
          ns.target = v === 'textarea' ? { w: rng.int(spec.min.w + 40, spec.max.w), h: rng.int(spec.min.h + 30, spec.max.h) } : t;
        }
        out.push(ns);
      }
    }
    const ok = out.filter((ns) => {
      const e = task.error(model, ns);
      return Number.isFinite(e) && e > tau && (v === 'split' ? far(ns.target, model.pos) : true);
    });
    return ok.length ? rng.pick(ok) : null;
  }

  function init0(spec, rng) {
    const mode = spec.startMode;
    if (spec.scenario === 'split') {
      const span = spec.total - spec.div;
      let pos = rng.int(spec.min, span - spec.min);
      if (spec.keyRoute && mode === 'off') pos = spec.target + (rng.bool(0.5) ? 1 : -1) * rng.int(2, 5) * spec.kstep;
      if (mode === 'partial') pos = Math.round(pos + (spec.target - pos) * rng.float(0.4, 0.7));
      if (mode === 'wrong') pos = span - spec.target;
      return { pos: Math.max(spec.min, Math.min(span - spec.min, pos)), focus: false };
    }
    if (spec.scenario === 'column') {
      const cols = spec.columns.map((c) => c.w);
      const t = spec.goal.kind === 'equal' ? cols[spec.ref] : spec.target;
      if (mode === 'partial') cols[spec.col] = Math.round(cols[spec.col] + (t - cols[spec.col]) * rng.float(0.4, 0.7));
      if (mode === 'wrong') {
        // The neighbouring column got the width meant for this one (when that keeps the table in its
        // budget), else this column was dragged the wrong way.
        const nb = spec.col + (spec.col + 1 < cols.length && (spec.col === 0 || rng.bool(0.5)) ? 1 : -1);
        if (nb !== spec.ref && t <= cols[nb] && t >= spec.min) cols[nb] = t;
        else cols[spec.col] = Math.max(spec.min, Math.min(spec.max, cols[spec.col] - (t - cols[spec.col])));
      }
      return { cols, focus: false };
    }
    if (spec.scenario === 'aspect') return initAspect(spec, rng, mode);
    // Panel scenarios.
    const g = spec.goal;
    let m = spec.startSize ? { ...spec.startSize } : { w: rng.int(spec.min.w + 40, spec.max.w), h: rng.int(spec.min.h + 40, spec.max.h) };
    if ((g.kind === 'factor' || g.kind === 'grow') && g.start) m = { ...g.start };
    const t = spec.target;
    // Square goals with an edge grip: the fixed dimension must be reachable by the moving one.
    if (g.kind === 'square' && !movesX(spec.grip)) m.w = Math.min(m.w, spec.max.h - 10);
    if (g.kind === 'square' && !movesY(spec.grip)) m.h = Math.min(m.h, spec.max.w - 10);
    if (spec.keyRoute && mode === 'off' && g.kind !== 'square') {
      // Nudge episode: start a few key steps away on the scored axes.
      const near = (v, lo, hi) => Math.max(lo, Math.min(hi, v + (rng.bool(0.5) ? 1 : -1) * rng.int(2, 5) * spec.kstep));
      m = { w: spec.axes !== 'h' ? near(t.w, spec.min.w, spec.max.w) : m.w, h: spec.axes !== 'w' ? near(t.h, spec.min.h, spec.max.h) : m.h };
    }
    if (mode === 'partial' && g.kind !== 'square' && g.kind !== 'grow') {
      if (spec.axes === 'both') {
        if (rng.bool(0.5)) m.w = t.w;
        else m.h = t.h;
      } else {
        const d = spec.axes;
        m[d] = Math.round(m[d] + (t[d] - m[d]) * rng.float(0.4, 0.7));
      }
    } else if (mode === 'partial' && g.kind === 'grow') {
      m[g.dim] = g.start[g.dim] + Math.round(g.amount * rng.float(0.3, 0.6));
    } else if (mode === 'wrong') {
      if (g.kind === 'grow') {
        const other = g.dim === 'w' ? 'h' : 'w';
        m[other] = Math.min(spec.max[other], m[other] + g.amount);
      } else if (spec.axes === 'both' && g.kind !== 'square') {
        // Width and height swapped.
        m = { w: Math.max(spec.min.w, Math.min(spec.max.w, t.h)), h: Math.max(spec.min.h, Math.min(spec.max.h, t.w)) };
      } else if (spec.axes !== 'both') {
        // The other dimension was changed to the target value instead.
        const d = spec.axes;
        const o = d === 'w' ? 'h' : 'w';
        m[o] = Math.max(spec.min[o], Math.min(spec.max[o], t[d]));
      }
    }
    return { ...m, focus: false };
  }

  const task = {
    name: 'resize-element',
    files: ['instructions.js'],
    lib: { chebyshev, COL_ALIASES, judgeInstruction, GRIP_ANCHOR, lockedSize },
    scenarios: ['numeric', 'ghost', 'relative', 'textarea', 'column', 'split', 'aspect'],
    startModes: ['off', 'partial', 'wrong', 'solved'],
    judgeModes: ['ambiguous', 'impossible'],
    helpers: { rulerStep, keyApply },


    inputs(spec) {
      return spec && spec.keys ? ['pointer', 'keyboard'] : ['pointer'];
    },

    sample(rng, opts) {
      const scenario = opts.scenario || pickScenario(rng, opts.scenarios && opts.scenarios.length ? opts.scenarios : task.scenarios);
      const spec = { scenario, isplit: opts.isplit || 'train', csplit: opts.csplit || 'train', startMode: opts.startMode || 'off',
        ood: !!opts.ood, keys: false, keyRoute: false };
      if (scenario === 'column') sampleColumn(rng, spec, opts);
      else if (scenario === 'split') sampleSplit(rng, spec, opts);
      else if (scenario === 'textarea') sampleTextarea(rng, spec, opts);
      else if (scenario === 'aspect') sampleAspect(rng, spec, opts);
      else samplePanel(rng, spec, opts);
      if (scenario !== 'column' && scenario !== 'textarea' && scenario !== 'aspect') {
        // opts.route forces the input route; the draws stay the same so seeds keep their content.
        const keys = rng.bool(0.25);
        spec.keys = opts.route === 'keyboard' ? true : opts.route === 'pointer' ? false : keys;
        if (scenario !== 'split') spec.kstep = Math.max(2, Math.min(10, 2 * spec.tau));
        const keyRoute = keys && rng.bool(0.7);
        spec.keyRoute = spec.keys && (opts.route === 'keyboard' || keyRoute);
        if (spec.startSize) spec.keyRoute = false;
      }
      if (opts.level === 'easy' || opts.level === 'medium') {
        spec.level = opts.level;
        spec.tau = Math.round(spec.tau * (opts.level === 'easy' ? 2.5 : 1.6));
        if (scenario !== 'column' && scenario !== 'textarea' && scenario !== 'aspect' && scenario !== 'split') spec.kstep = Math.max(2, Math.min(10, 2 * spec.tau));
      }
      if (this.judgeModes.includes(opts.judge)) {
        const j = judgeOf(rng.fork('judge'), spec, opts.judge);
        if (j) spec.judge = j;
      }
      return spec;
    },

    init(spec, rng) {
      // ambiguous / impossible: nothing to change, the page starts solved
      if (spec.judge) return task.solve(spec, task.init({ ...spec, judge: undefined }, rng));
      const m0 = init0(spec, rng);
      if (spec.level !== 'easy' || spec.startMode !== 'off') return m0;
      // Easy 'off' start: pulled 40% of the way to the target on the scored axes.
      const pull = (a, t) => Math.round(a + (t - a) * 0.4);
      if (spec.scenario === 'split') return { ...m0, pos: pull(m0.pos, spec.target) };
      if (spec.scenario === 'column') {
        const cols = m0.cols.slice();
        if (spec.goal.kind !== 'equal') cols[spec.col] = pull(cols[spec.col], spec.target);
        else cols[spec.col] = pull(cols[spec.col], cols[spec.ref]);
        return { ...m0, cols };
      }
      const g = spec.goal;
      if (g.kind === 'square' || g.kind === 'grow') return m0;
      const t = spec.target;
      const m = { ...m0 };
      if (spec.axes !== 'h') m.w = pull(m.w, t.w);
      if (spec.axes !== 'w') m.h = pull(m.h, t.h);
      return m;
    },


    error(model, spec) {
      if (spec.scenario === 'split') return Math.abs(model.pos - spec.target);
      if (spec.scenario === 'column') {
        const t = spec.goal.kind === 'equal' ? model.cols[spec.ref] : spec.target;
        return Math.abs(model.cols[spec.col] - t);
      }
      return panelError(model, spec);
    },

    tolerance(spec) {
      if (spec.level) return { tau: spec.tau, minInitialError: 2 * spec.tau };
      return { tau: spec.tau };
    },

    instruction(spec, rng) {
      return task.lib.instruction(spec, rng);
    },

    plan(model, spec) {
      const err = (m) => task.error(m, spec);
      const tau = spec.tau;
      if (err(model) <= tau + 1e-9) return null;
      if (spec.scenario === 'split') {
        if (spec.keyRoute) {
          const k = nextKey(spec, model, err);
          if (k) return model.focus ? k : { click: { divider: true } };
        }
        return { drag: [{ divider: true }, { divider: true, pos: spec.target }] };
      }
      if (spec.scenario === 'column') {
        const w = spec.goal.kind === 'equal' ? model.cols[spec.ref] : spec.target;
        return { drag: [{ col: spec.col }, { col: spec.col, width: w }] };
      }
      if (spec.scenario === 'aspect') return planAspect(model, spec);
      if (spec.keyRoute) {
        const k = nextKey(spec, model, err);
        if (k) return model.focus ? k : { click: { handle: spec.grip } };
      }
      // One grip drag lands on the target; the kit re-plans if rounding left it outside tau.
      const want = goalSize(spec, model);
      if (spec.goal.kind === 'grow') want[spec.goal.dim] = Math.min(spec.max[spec.goal.dim], spec.target[spec.goal.dim] + 2);
      return { drag: [{ handle: spec.grip }, { handle: spec.grip, size: want }] };
    },

    facts: factsOf,
    // preempt=cancel: the panel (its size), each column (its width) or both panes (their sizes), by the name on the page
    parts: (model, spec) => {
      if (spec.scenario === 'column') return spec.columns.map((c, i) => ({ name: c.name, value: model.cols[i] }));
      // the page's title / layout stay as they are: they are named parts a stop reply must not list
      if (spec.scenario === 'split') return [{ name: spec.panes[0], value: model.pos }, { name: spec.panes[1], value: spec.total - spec.div - model.pos },
        { name: 'Layout', value: spec.orient }];
      return [{ name: `${spec.title} width`, value: model.w, aliases: ['width'] }, { name: `${spec.title} height`, value: model.h, aliases: ['height'] },
        { name: `${spec.title} title`, value: spec.title }];
    },
    silent: silentOf,
    retarget: retargetOf,

    solve(spec, model) {
      const focus = model ? model.focus : false;
      if (spec.scenario === 'split') return { pos: spec.target, focus };
      if (spec.scenario === 'column') {
        const cols = model ? model.cols.slice() : spec.columns.map((c) => c.w);
        cols[spec.col] = spec.goal.kind === 'equal' ? cols[spec.ref] : spec.target;
        return { cols, focus };
      }
      const m = model ? { ...model } : { ...spec.target };
      if (spec.scenario === 'aspect') return { ...spec.target, focus, lock: !!(model && model.lock) };
      if (spec.goal.kind === 'square') {
        const s = Math.max(spec.min.w, spec.min.h, Math.min(spec.max.w, spec.max.h, m.h || spec.target.h));
        return { w: s, h: s, focus };
      }
      return { ...spec.target, focus };
    },


  };

  env.task(task);
})();
