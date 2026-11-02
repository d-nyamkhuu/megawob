/*
 * use-project-board/workspace: delivery workspace shared by all six use-project-board scenarios.
 * Timeline: gantt-move, gantt-resize, dependency, milestone. Board: swimlane, wip.
 * design: {} reproduces each corresponding design-use-project-board-<scenario>-01 pilot exactly.
 * Scenario presets: none; the task spec selects the timeline or board and its controls.
 * Structural CSS uses the site's --bg/--panel/--fg/--muted/--line/--accent colors.
 * Parts are installed by the _shell, _controls, _timeline, _timeline-view, _board and _view libraries.
 * Each page gets its own factory state; no DOM is created before render.
 *
 * Tokens (defaults):
 *   brand ('Rowhaven'), workspaceLabel ('Project workspace'): sidebar brand and root aria label.
 *   icons (ICONS below): complete SVG-inner-markup table, viewBox 0 0 24 24.
 *   backlogTitles (BACKLOG below): content-split pool for 14 related records.
 *   statuses (['In progress', 'Planned', 'At risk', 'Complete']): cyclic display statuses.
 *   stateColors ({'In progress':'#4b83c5', Planned:'#8a85b1', 'At risk':'#c27d3c', Complete:'#419b78'}): status colors.
 *   relatedColors (['#8497aa', '#8e9f88', '#a295b0']): cyclic related-work colors.
 *   inset (10), radius (8): workspace inset and corner radius, px.
 *   font ('12px/1.35 system-ui,sans-serif'): workspace CSS font shorthand.
 *   sidebarWidth (158), compactSidebarWidth (130): navigation widths, px.
 *   compactAt (1000): stage width below which the compact class is added.
 *   axisHeight (68), rowHeight (48), phaseHeight (26): timeline geometry, px, shared with CSS.
 *   metaMin (204), metaMax (268), metaRatio (.36): clamp timeline metadata width, px / body fraction.
 *   boardHeadHeight (39), laneTitleHeight (26): board header/lane title heights, px, shared with CSS.
 *   laneMin (80), cardMin (46), cardMax (78), cardInset (34): fitted lane/card geometry, px.
 *   cardGap (7): vertical card spacing and leading/trailing cell padding, px.
 *
 * Parts are (base, S) => replacement; all calls use P. Arguments/returns/defaults:
 *   icon(parent, name) -> svg: draw D.icons[name].
 *   button(parent, label, name, cls = '') -> button: optional icon and label.
 *   avatar(parent, owner, color) -> span: initials and --task tint.
 *   frame(ctx) -> root: create the compact-or-wide workspace; render uses the returned node.
 *   sidebar(): create S.els.sidebar/nav and brand before sampling display content.
 *   content(): sample related records and today, derive active records (preserve every draw).
 *   statusOf(i) -> string: cyclic status; stateColor(state) -> CSS color: status color lookup.
 *   navItem(label, name, count, current = false) -> button: navigation item opening a drawer.
 *   navigation(): populate nav groups and sidebar profile.
 *   heading(): create S.els.main, project heading, notifications/details buttons.
 *   tabs(): draw Overview/Board/Timeline/Activity; inactive tabs open drawers.
 *   toolbar(): create S.els.tools, find/filter/group/reset/today/zoom controls.
 *   viewMeta(): avatars, record counts, team access, S.els.policies button.
 *   body(): create S.els.body/hint/foot and scenario-specific normal hint.
 *   say(text): warning, or normal hint when text is empty; no model mutation.
 *   currentViewReset() -> bool: filter/group/drawer/menu requires reset.
 *   resetView(): restore default filter/group and close panels, refresh and mirror.
 *   showMenu(title, options, select): toggle option panel; selection refreshes and mirrors.
 *   controls(): bind toolbar and header events to menus, drawers, and reset.
 *   drawer(kind, it?): draw project/policy/activity/item details with close control.
 *   detailField(parent, label, value) -> row: labeled drawer field.
 *   update(action) -> bool: apply task action, warn on rejection, paint/reanchor on success.
 *   timelineFrame(): create timeline/axis/phases/edge layer; install S.scene geometry/maps.
 *   timelineRow(it, index) -> row: metadata, owner/status/date; register scene.nodes/datesText.
 *   scheduleBar(it, row) -> {bar, milestone}: create grid/bar/caption; register bars/captions.
 *   resizeGrip(it, bar, milestone) -> el|null: duration handle, dependency cursor.
 *   port(it, bar, side) -> span: dependency port; register scene.ports[it.id][side].
 *   timelineAt(id, side, m = ctx.model) -> [x,y]: committed schedule endpoint in wrap pixels.
 *   timeline(): build rows/bars/ports, bind schedule/dependency drags and today reset.
 *   ghost(it) -> el: detached-from-layout drag preview under the workspace.
 *   timelineCalendar(): compute scene.dayW/shownDays; paint calendar/today/grid widths.
 *   timelineMirror(): mirror committed row/edge visibility and reset state into model.view.
 *   timelinePaint(m): place bars, update captions/dates, compute edge hit points, call P.edge.
 *   edge(e, a, b, mid, x, y): draw dependency path and removable badge at committed hit point.
 *   timelineRefresh(): calendar/filter/group/phase/row layout, then P.paint.
 *   timelineLocate(t) -> [x,y]: read committed timeline geometry; never alter DOM.
 *   boardFrame(): create board/column headers, fitted lane/card sizes, S.scene maps.
 *   columnHeading(heads, label) -> {h, value}: status heading and count node.
 *   lane(label, l) -> row: fitted lane title and P.cell for each column.
 *   cell(row, col, c, label, l) -> cell: status pane, content/empty state and scroll mirror;
 *     register scene.cells/contents/empty under column:lane.
 *   card(it) -> el: scored task card; register scene.cards[it.id].
 *   backlog(): related-work section/grid and P.backlogCard for each related record.
 *   backlogCard(it, i) -> el: related task opening details; register scene.backlogCards[it.id].
 *   board(): build lanes/cards/backlog; bind card drags and sprint scroll reset.
 *   boardMirror(): mirror cell scroll and committed card geometry into model.view.
 *   boardPaint(m): counters/WIP, grouping, cell membership, card placement and empty states.
 *   boardRefresh(): filter/reorder related backlog, then P.paint.
 *   boardLocate(t) -> [x,y]: card or cell center, read-only.
 *   footer(m): current sprint and task facts.
 *   paint(m): P.paintScene, P.footer, P.mirror.
 *   paintScene(m), mirror(), refreshView(), locateScene(t): dispatch to timeline/board parts;
 *     locateScene returns a viewport point; the other dispatchers return nothing.
 *   locate(t) -> [x,y]: reset control, wheel pane, or P.locateScene; read-only.
 *   item(ctx, el, it): after a timeline bar or scored board card is bound (default: nothing).
 *   rendered(ctx): after the first align-layout/model mirror (default: nothing).
 * S.ctx/spec/els/scene/active/related/todayDay/filter/grouping/zoom/D/P read live page state.
 * S.scene (settable) holds timeline or board geometry/node maps. S.els exposes writable shell nodes.
 * S.filter/grouping/zoom are settable for replacement view controls; structural parts must retain
 * their documented node maps so the interaction, mirror, paint and locate parts keep working.
 * Keep all rng draws in order: content samples titles, then each owner's name, points/start/duration,
 * then todayDay, on ctx.rng.fork('workspace'). Extra decoration draws use a separate fork.
 */
(function () {
  'use strict';
  const ICONS = {
    project: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M7 8h4m-4 4h10m-10 4h7"/>',
    home: '<path d="M3 10l9-7 9 7v10H3zM9 20v-7h6v7"/>',
    tasks: '<path d="M10 6h10M10 12h10M10 18h10M3 6l2 2 3-4M3 12l2 2 3-4M3 18l2 2 3-4"/>',
    inbox: '<path d="M4 4h16l2 12v4H2v-4zM2 15h6l2 3h4l2-3h6"/>',
    folder: '<path d="M3 6h7l2 3h9v11H3z"/>',
    people: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0112 0v3M17 4a3 3 0 010 6m1 5a5 5 0 014 5"/>',
    chevron: '<path d="M8 4l8 8-8 8"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    plus: '<path d="M12 4v16M4 12h16"/>',
    search: '<circle cx="10" cy="10" r="6"/><path d="M15 15l6 6"/>',
    filter: '<path d="M3 5h18M6 12h12M10 19h4"/>',
    group: '<rect x="3" y="3" width="6" height="6" rx="1"/><path d="M13 4h8m-8 4h5"/><rect x="3" y="15" width="6" height="6" rx="1"/><path d="M13 16h8m-8 4h5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18m-12 4h2m4 0h2"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
    check: '<path d="M4 12l5 5L20 6"/>',
    close: '<path d="M6 6l12 12M6 18L18 6"/>',
    bell: '<path d="M5 17h14l-2-4V8a5 5 0 00-10 0v5zM10 21h4"/>',
    chat: '<path d="M3 3h18v14H9l-6 4zM7 7h10M7 11h7"/>',
    link: '<path d="M10 7l3-3a5 5 0 017 7l-3 3M14 17l-3 3a5 5 0 01-7-7l3-3M8 16l8-8"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
    dots: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    board: '<rect x="3" y="4" width="5" height="16" rx="1"/><rect x="10" y="4" width="5" height="11" rx="1"/><rect x="17" y="4" width="4" height="14" rx="1"/>',
    timeline: '<path d="M3 3v18h18M7 7h8m-4 5h9M6 17h7"/>',
    flag: '<path d="M5 22V3h14l-4 5 4 5H5"/>',
  };
  const BACKLOG = ['Accessibility review', 'API changelog', 'Partner sandbox', 'Incident follow-up',
    'Release archive', 'Vendor review', 'Localization audit', 'Dashboard research', 'Security checklist',
    'Metrics cleanup', 'Knowledge base', 'Webhook delivery', 'Support triage', 'Capacity forecast',
    'Design inventory', 'Documentation links', 'Service ownership', 'Feedback digest', 'Trial follow-up', 'Team onboarding'];
  const CSS = (D) => `
  .pj-app { position:absolute; inset:${D.inset}px; display:flex; min-width:0; min-height:0; border:1px solid var(--line);
    border-radius:${D.radius}px; background:var(--panel); overflow:hidden; font:${D.font}; }
  .pj-app svg.pj-icon { width:16px; height:16px; flex:none; fill:none; stroke:currentColor; stroke-width:1.65; stroke-linecap:round; stroke-linejoin:round; }
  .pj-sidebar { width:${D.sidebarWidth}px; flex:none; background:color-mix(in srgb,var(--bg) 72%,var(--panel)); border-right:1px solid var(--line); display:flex; flex-direction:column; min-height:0; }
  .pj-sidebar-scroll { flex:1; min-height:0; overflow:auto; padding:12px 8px; scrollbar-width:thin; }
  .pj-brand { display:flex; align-items:center; gap:8px; font-weight:750; padding:3px 7px 17px; font-size:14px; }
  .pj-brand-mark { display:grid; place-items:center; width:25px; height:25px; background:var(--accent); color:white; border-radius:7px; }
  .pj-nav { width:100%; display:flex; align-items:center; gap:8px; border:0; border-radius:5px; color:var(--muted); background:transparent; font:inherit; text-align:left; padding:7px 8px; cursor:pointer; }
  .pj-nav:hover { background:color-mix(in srgb,var(--fg) 5%,transparent); color:var(--fg); }
  .pj-nav.active { background:color-mix(in srgb,var(--accent) 12%,transparent); color:var(--accent); font-weight:650; }
  .pj-nav .pj-navtext { flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .pj-count { padding:1px 5px; font-size:10px; border-radius:4px; background:color-mix(in srgb,var(--fg) 8%,transparent); }
  .pj-nav-heading { display:flex; align-items:center; justify-content:space-between; padding:18px 8px 6px; font-size:10px; text-transform:uppercase; letter-spacing:.06em; color:var(--muted); }
  .pj-sidebar-foot { padding:11px; border-top:1px solid var(--line); display:flex; align-items:center; gap:7px; font-size:10px; }
  .pj-main { flex:1; min-width:0; min-height:0; display:flex; flex-direction:column; position:relative; }
  .pj-head { height:61px; flex:none; display:flex; align-items:center; padding:0 15px; gap:10px; }
  .pj-title { font-size:18px; font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-top:2px; }
  .pj-muted { color:var(--muted); font-size:10px; }
  .pj-grow { flex:1; min-width:0; }
  .pj-saved { display:flex; align-items:center; gap:4px; color:var(--muted); font-size:10px; white-space:nowrap; }
  .pj-saved svg { color:#439d7a; }
  .pj-btn { display:inline-flex; align-items:center; justify-content:center; gap:5px; color:var(--fg); background:var(--panel); border:1px solid var(--line); border-radius:5px; font:inherit; padding:5px 8px; cursor:pointer; white-space:nowrap; }
  .pj-btn:hover { background:var(--bg); }
  .pj-btn.on { color:var(--accent); border-color:var(--accent); background:color-mix(in srgb,var(--accent) 8%,var(--panel)); }
  .pj-btn.icon { width:29px; padding:5px; }
  .pj-bell { position:relative; }
  .pj-bell::after { content:''; position:absolute; right:5px; top:4px; width:5px; height:5px; border-radius:50%; background:#d66f54; }
  .pj-tabs { height:31px; display:flex; flex:none; gap:22px; border-bottom:1px solid var(--line); padding:0 15px; }
  .pj-tab { border:0; border-bottom:2px solid transparent; padding:0; display:flex; align-items:center; gap:5px; background:none; color:var(--muted); font:inherit; font-size:11px; cursor:pointer; }
  .pj-tab.active { border-bottom-color:var(--accent); color:var(--accent); font-weight:650; }
  .pj-tools { flex:none; height:65px; padding:7px 12px 5px; border-bottom:1px solid var(--line); display:flex; flex-direction:column; gap:6px; }
  .pj-toolbar { display:flex; align-items:center; gap:6px; min-width:0; }
  .pj-toolbar .pj-btn { font-size:10px; padding:4px 7px; height:27px; }
  .pj-toolbar .pj-icon { width:13px!important; height:13px!important; }
  .pj-view-meta { display:flex; align-items:center; gap:7px; color:var(--muted); font-size:10px; }
  .pj-view-meta .pj-btn { border:0; padding:0; color:var(--muted); height:16px; font-size:10px; }
  .pj-zoom { display:flex; border:1px solid var(--line); border-radius:5px; overflow:hidden; }
  .pj-zoom button { padding:4px 7px; border:0; border-right:1px solid var(--line); color:var(--muted); background:var(--panel); font:inherit; font-size:10px; cursor:pointer; }
  .pj-zoom button:last-child { border-right:0; }
  .pj-zoom button.active { color:var(--fg); background:var(--bg); font-weight:650; }
  .pj-body { flex:1; min-height:0; position:relative; overflow-x:hidden; overflow-y:scroll; overscroll-behavior:contain; scrollbar-width:thin; }
  .pj-timeline { position:relative; width:100%; }
  .pj-axis { position:sticky; top:0; z-index:8; height:${D.axisHeight}px; display:flex; background:var(--panel); border-bottom:1px solid var(--line); }
  .pj-axis-label { flex:none; border-right:1px solid var(--line); padding:11px 10px; display:flex; flex-direction:column; justify-content:space-between; font-size:10px; color:var(--muted); }
  .pj-axis-label strong { color:var(--fg); font-weight:600; }
  .pj-dates { position:relative; flex:1; overflow:hidden; }
  .pj-month { height:24px; font-size:11px; font-weight:650; padding:5px 10px; border-bottom:1px solid var(--line); }
  .pj-week { position:absolute; top:24px; height:20px; border-right:1px solid var(--line); border-bottom:1px solid var(--line); padding:3px 5px; font-size:9px; color:var(--muted); white-space:nowrap; overflow:hidden; }
  .pj-date { position:absolute; top:44px; height:24px; display:flex; align-items:center; justify-content:center; font-size:9px; color:var(--muted); border-right:1px solid var(--line); }
  .pj-date.weekend { background:color-mix(in srgb,var(--fg) 5%,transparent); }
  .pj-date.today { color:var(--accent); font-weight:750; background:color-mix(in srgb,var(--accent) 12%,transparent); }
  .pj-today { position:absolute; top:${D.axisHeight}px; bottom:0; width:1px; background:var(--accent); opacity:.6; pointer-events:none; z-index:3; }
  .pj-phase { position:absolute; height:${D.phaseHeight}px; left:0; right:0; display:flex; align-items:center; gap:7px; padding:0 10px; font-size:10px; font-weight:650; background:var(--bg); border-bottom:1px solid var(--line); color:var(--muted); }
  .pj-phase svg { width:12px!important; height:12px!important; }
  .pj-row { position:absolute; left:0; right:0; height:${D.rowHeight}px; display:flex; border-bottom:1px solid var(--line); }
  .pj-row:hover { background:color-mix(in srgb,var(--fg) 2%,transparent); }
  .pj-meta { flex:none; min-width:0; border-right:1px solid var(--line); padding:5px 9px; display:flex; flex-direction:column; justify-content:center; gap:4px; }
  .pj-task-top { display:flex; align-items:center; gap:7px; min-width:0; }
  .pj-id { color:var(--muted); font-size:8px; width:39px; flex:none; font-variant-numeric:tabular-nums; }
  .pj-name { min-width:0; font-weight:600; font-size:11px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  button.pj-name { border:0; padding:0; color:var(--fg); background:none; cursor:pointer; text-align:left; }
  button.pj-name:hover { text-decoration:underline; }
  .pj-row-bottom { display:flex; gap:5px; align-items:center; white-space:nowrap; font-size:9px; color:var(--muted); min-width:0; }
  .pj-avatar { display:inline-grid; place-items:center; flex:none; width:18px; height:18px; border-radius:50%; font-size:8px; font-weight:650; color:var(--fg); background:color-mix(in srgb,var(--task,var(--accent)) 22%,var(--panel)); }
  .pj-owner { overflow:hidden; text-overflow:ellipsis; max-width:52px; }
  .pj-chip { display:inline-flex; align-items:center; border-radius:4px; padding:2px 5px; font-size:8px; color:color-mix(in srgb,var(--state,#547fbc) 75%,var(--fg)); background:color-mix(in srgb,var(--state,#547fbc) 11%,var(--panel)); white-space:nowrap; }
  .pj-grid { position:relative; flex:1; min-width:0; background:repeating-linear-gradient(to right,transparent 0,transparent calc(var(--day) - 1px),var(--line) calc(var(--day) - 1px),var(--line) var(--day)); }
  .pj-bar { position:absolute; top:50%; height:23px; margin-top:-11px; border-radius:4px; border:1px solid var(--task); color:var(--fg); background:color-mix(in srgb,var(--task) 27%,var(--panel)); display:flex; align-items:center; justify-content:center; cursor:grab; touch-action:none; font-size:9px; }
  .pj-bar-label { padding:0 5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; pointer-events:none; }
  .pj-bar.background { cursor:default; opacity:.65; }
  .pj-resize { position:absolute; top:0; bottom:0; right:-4px; width:12px; cursor:ew-resize; z-index:4; }
  .pj-resize::after { content:''; position:absolute; top:5px; right:5px; width:2px; height:11px; background:var(--task); border-radius:2px; }
  .pj-port { position:absolute; top:50%; width:12px; height:12px; margin-top:-6px; border:2px solid var(--task); border-radius:50%; background:var(--panel); cursor:crosshair; z-index:5; }
  .pj-port.in { left:-8px; } .pj-port.out { right:-8px; }
  .pj-port:hover { background:var(--task); }
  .pj-diamond { position:absolute; top:50%; width:16px; height:16px; margin:-8px 0 0 -8px; transform:rotate(45deg); background:var(--task); border:2px solid var(--panel); border-radius:2px; cursor:ew-resize; z-index:4; }
  .pj-edges { position:absolute; inset:0; width:100%; height:100%; z-index:4; pointer-events:none; overflow:visible; }
  .pj-link { fill:none; stroke:var(--muted); stroke-width:1.5; }
  .pj-rubber { fill:none; stroke:var(--accent); stroke-width:2; stroke-dasharray:4 3; }
  .pj-edge-delete { cursor:pointer; pointer-events:all; }
  .pj-edge-delete circle { fill:var(--panel); stroke:var(--muted); }
  .pj-edge-delete path { fill:none; stroke:var(--muted); stroke-width:1.4; }
  .pj-foot { height:29px; flex:none; display:flex; align-items:center; flex-wrap:nowrap; gap:15px; padding:0 11px; font-size:9px; color:var(--muted); border-top:1px solid var(--line); white-space:nowrap; }
  .pj-foot strong { margin-left:3px; color:var(--fg); font-weight:650; }
  .pj-hint { height:23px; flex:none; display:flex; align-items:center; gap:5px; padding:0 11px; color:var(--muted); font-size:9px; border-top:1px solid var(--line); overflow:hidden; white-space:nowrap; }
  .pj-hint.warn { color:color-mix(in srgb,#d56f50 85%,var(--fg)); }
  .pj-board { position:relative; background:var(--bg); }
  .pj-colheads { position:sticky; top:0; height:${D.boardHeadHeight}px; display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); background:var(--panel); border-bottom:1px solid var(--line); z-index:7; }
  .pj-colhead { padding:0 9px; display:flex; align-items:center; gap:5px; font-weight:650; font-size:11px; border-right:1px solid var(--line); }
  .pj-colhead span { margin-left:auto; font-size:9px; color:var(--muted); font-weight:400; }
  .pj-colhead.over span { color:color-mix(in srgb,#d56f50 85%,var(--fg)); font-weight:700; }
  .pj-lane { position:relative; }
  .pj-lane-title { height:${D.laneTitleHeight}px; padding:0 9px; display:flex; align-items:center; gap:5px; font-size:9px; text-transform:uppercase; letter-spacing:.06em; color:var(--muted); border-bottom:1px solid var(--line); }
  .pj-lane-title svg { width:11px!important; height:11px!important; }
  .pj-cell { position:absolute; top:${D.laneTitleHeight}px; bottom:0; width:33.3333%; overflow-y:auto; overflow-x:hidden; scrollbar-width:thin; overscroll-behavior:contain; border-right:1px solid var(--line); border-bottom:1px solid var(--line); }
  .pj-cell-content { position:relative; min-height:100%; }
  .pj-cell.over { background:color-mix(in srgb,var(--accent) 9%,transparent); outline:2px dashed var(--accent); outline-offset:-3px; }
  .pj-empty { position:absolute; inset:0; display:flex; flex-direction:column; gap:5px; align-items:center; justify-content:center; font-size:10px; color:var(--muted); pointer-events:none; }
  .pj-empty svg { opacity:.5; }
  .pj-card { position:absolute; left:7px; right:7px; padding:7px 8px; display:flex; flex-direction:column; justify-content:space-between; gap:4px; background:var(--panel); border:1px solid var(--line); border-radius:5px; box-shadow:0 1px 2px #0001; cursor:grab; touch-action:none; }
  .pj-card-top { display:flex; align-items:center; gap:5px; font-size:8px; color:var(--muted); }
  .pj-card .pj-name { font-size:11px; pointer-events:none; }
  .pj-card-bottom { display:flex; align-items:center; gap:5px; font-size:9px; color:var(--muted); pointer-events:none; }
  .pj-card-bottom .pj-icon { width:11px!important; height:11px!important; }
  .pj-card.compact .pj-card-top { display:none; }
  .pj-backlog { padding:14px 9px; border-top:1px solid var(--line); background:var(--bg); }
  .pj-backlog h4 { margin:0 0 4px; font-size:12px; }
  .pj-backlog p { margin:0 0 12px; font-size:10px; color:var(--muted); }
  .pj-backlog-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px; }
  .pj-backlog-card { border:1px solid var(--line); border-radius:5px; background:var(--panel); padding:9px; min-height:83px; display:flex; flex-direction:column; gap:6px; }
  .pj-dragging { opacity:.4; }
  .pj-ghost { position:fixed; z-index:55; pointer-events:none; padding:8px 11px; background:var(--panel); color:var(--fg); border:1px solid var(--accent); border-radius:5px; box-shadow:0 5px 18px #0003; font-size:11px; }
  .pj-menu { position:absolute; z-index:20; top:125px; left:12px; width:240px; padding:10px; border:1px solid var(--line); border-radius:6px; background:var(--panel); box-shadow:0 7px 24px #0003; }
  .pj-menu h4 { margin:0 0 8px; font-size:11px; }
  .pj-menu .pj-btn { width:100%; justify-content:flex-start; border:0; }
  .pj-drawer { position:absolute; top:0; bottom:0; right:0; width:min(310px,90%); z-index:21; background:var(--panel); border-left:1px solid var(--line); box-shadow:-6px 0 20px #0002; display:flex; flex-direction:column; }
  .pj-drawer-head { display:flex; align-items:center; gap:8px; padding:13px; border-bottom:1px solid var(--line); font-size:12px; font-weight:650; }
  .pj-drawer-body { padding:15px; overflow:auto; font-size:11px; }
  .pj-drawer-body h3 { font-size:17px; margin:3px 0 15px; }
  .pj-detail-row { display:flex; align-items:center; gap:8px; padding:9px 0; border-bottom:1px solid var(--line); }
  .pj-detail-row .label { width:82px; flex:none; color:var(--muted); }
  .pj-activity { margin-top:16px; padding:11px 0; display:flex; gap:8px; font-size:10px; color:var(--muted); border-top:1px solid var(--line); }
  .pj-compact .pj-sidebar { width:${D.compactSidebarWidth}px; }
  .pj-compact .pj-sidebar-scroll { padding:10px 5px; }
  .pj-compact .pj-head { padding:0 10px; }
  .pj-compact .pj-title { font-size:15px; }
  .pj-compact .pj-saved span { display:none; }
  .pj-compact .pj-tabs { gap:15px; padding:0 10px; }
  .pj-compact .pj-toolbar { gap:4px; }
  .pj-compact .pj-toolbar .pj-btn { padding:4px 5px; }
  .pj-compact .pj-toolbar .pj-find-label { display:none; }
  `;

  const TOKENS = {
    brand: 'Rowhaven',
    workspaceLabel: 'Project workspace',
    icons: ICONS,
    backlogTitles: BACKLOG,
    statuses: ['In progress', 'Planned', 'At risk', 'Complete'],
    stateColors: { 'In progress': '#4b83c5', Planned: '#8a85b1', 'At risk': '#c27d3c', Complete: '#419b78' },
    relatedColors: ['#8497aa', '#8e9f88', '#a295b0'],
    inset: 10,
    radius: 8,
    font: '12px/1.35 system-ui,sans-serif',
    sidebarWidth: 158,
    compactSidebarWidth: 130,
    compactAt: 1000,
    axisHeight: 68,
    rowHeight: 48,
    phaseHeight: 26,
    metaMin: 204,
    metaMax: 268,
    metaRatio: .36,
    boardHeadHeight: 39,
    laneTitleHeight: 26,
    laneMin: 80,
    cardMin: 46,
    cardMax: 78,
    cardInset: 34,
    cardGap: 7,
  };

  env.template('use-project-board/workspace', (design, def) => {
    const W = {};
    W.els = {
      get root() { return W.root; }, set root(el) { W.root = el; },
      get sidebar() { return W.sidebar; }, set sidebar(el) { W.sidebar = el; },
      get nav() { return W.nav; }, set nav(el) { W.nav = el; },
      get main() { return W.main; }, set main(el) { W.main = el; },
      get body() { return W.body; }, set body(el) { W.body = el; },
      get hint() { return W.hint; }, set hint(el) { W.hint = el; },
      get foot() { return W.foot; }, set foot(el) { W.foot = el; },
      get notifications() { return W.notifications; }, set notifications(el) { W.notifications = el; },
      get details() { return W.details; }, set details(el) { W.details = el; },
      get policies() { return W.policies; }, set policies(el) { W.policies = el; },
      get findBtn() { return W.findBtn; }, set findBtn(el) { W.findBtn = el; },
      get filterBtn() { return W.filterBtn; }, set filterBtn(el) { W.filterBtn = el; },
      get groupBtn() { return W.groupBtn; }, set groupBtn(el) { W.groupBtn = el; },
      get clearBtn() { return W.clearBtn; }, set clearBtn(el) { W.clearBtn = el; },
      get today() { return W.today; }, set today(el) { W.today = el; },
      get zoomButtons() { return W.zoomButtons; }, set zoomButtons(el) { W.zoomButtons = el; },
    };
    const BASE = {};
    const S = {
      get ctx() { return W.ctx; },
      get spec() { return W.s; },
      get els() { return W.els; },
      get scene() { return W.scene; }, set scene(value) { W.scene = value; },
      get active() { return W.active; },
      get related() { return W.related; },
      get todayDay() { return W.todayDay; },
      get filter() { return W.filter; }, set filter(value) { W.filter = value; },
      get grouping() { return W.grouping; }, set grouping(value) { W.grouping = value; },
      get zoom() { return W.zoom; }, set zoom(value) { W.zoom = value; },
      get D() { return W.D; },
      get P() { return W.P; },
    };

    env.templateLib('use-project-board/_shell').install(BASE, W);
    env.templateLib('use-project-board/_controls').install(BASE, W);
    env.templateLib('use-project-board/_timeline').install(BASE, W);
    env.templateLib('use-project-board/_timeline-view').install(BASE, W);
    env.templateLib('use-project-board/_board').install(BASE, W);
    env.templateLib('use-project-board/_view').install(BASE, W);

    ({ D: W.D, P: W.P } = env.templateDesign('use-project-board/workspace', design, def, { tokens: TOKENS, base: BASE, state: S }));
    return {
      render(context) {
        W.ctx = context;
        ({ spec: W.s, util: W.u, size: W.size } = W.ctx); W.F = env.taskDef; W.isBoard = W.F.helpers.board(W.s);
        W.rng = W.ctx.rng.fork('workspace'); W.C = env.content; W.cs = { csplit: W.s.csplit };
        delete W.els.tools; W.scene = null; W.menu = null; W.drawer = null;
        W.filter = 'All work'; W.grouping = 'Project section'; W.zoom = 'Day';
        W.ctx.css('app-project-classic', CSS(W.D));
        W.root = W.P.frame(W.ctx); W.P.sidebar(); W.P.content(); W.P.navigation();
        W.P.heading(); W.P.tabs(); W.P.toolbar(); W.P.viewMeta(); W.P.body(); W.P.say(''); W.P.controls();
        Object.assign(W.els, { root: W.root, sidebar: W.sidebar, nav: W.nav, main: W.main, body: W.body, hint: W.hint, foot: W.foot, findBtn: W.findBtn, filterBtn: W.filterBtn, groupBtn: W.groupBtn,
          clearBtn: W.clearBtn, today: W.today, zoomButtons: W.zoomButtons, notifications: W.notifications, details: W.details, policies: W.policies });
        if (W.isBoard) W.P.board(); else W.P.timeline();
        W.body.addEventListener('scroll', () => W.P.mirror());
        W.P.refreshView();
        W.P.rendered(W.ctx);
        return { anchors: [W.root, W.body], sync: (m) => { W.P.paint(m); W.ctx.reanchor(); } };
      },
      locate(t) { return W.P.locate(t); },
    };
  }, { uses: ['use-project-board/_shell', 'use-project-board/_controls', 'use-project-board/_timeline', 'use-project-board/_timeline-view', 'use-project-board/_board', 'use-project-board/_view'] });
})();
