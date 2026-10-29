/* base / use-project-board / classic: a fictional delivery workspace.
 * Shared project navigation, task details/activity, SVG icons and working view controls.
 * Timeline rows mix the scored work with read-only related work, with sticky calendar
 * bands, a seeded today marker and real inner scrolling. Boards have independently
 * scrolling status cells and a separate next-sprint backlog excluded from current WIP.
 * All display-only data uses the widget's content RNG; scored records and facts come from
 * the task. locate() reads committed geometry, including during split-drag previews. */
(function () {
  'use strict';
  let live;
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
  const CSS = `
  .pj-app { position:absolute; inset:10px; display:flex; min-width:0; min-height:0; border:1px solid var(--line);
    border-radius:8px; background:var(--panel); overflow:hidden; font:12px/1.35 system-ui,sans-serif; }
  .pj-app svg.pj-icon { width:16px; height:16px; flex:none; fill:none; stroke:currentColor; stroke-width:1.65; stroke-linecap:round; stroke-linejoin:round; }
  .pj-sidebar { width:158px; flex:none; background:color-mix(in srgb,var(--bg) 72%,var(--panel)); border-right:1px solid var(--line); display:flex; flex-direction:column; min-height:0; }
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
  .pj-axis { position:sticky; top:0; z-index:8; height:68px; display:flex; background:var(--panel); border-bottom:1px solid var(--line); }
  .pj-axis-label { flex:none; border-right:1px solid var(--line); padding:11px 10px; display:flex; flex-direction:column; justify-content:space-between; font-size:10px; color:var(--muted); }
  .pj-axis-label strong { color:var(--fg); font-weight:600; }
  .pj-dates { position:relative; flex:1; overflow:hidden; }
  .pj-month { height:24px; font-size:11px; font-weight:650; padding:5px 10px; border-bottom:1px solid var(--line); }
  .pj-week { position:absolute; top:24px; height:20px; border-right:1px solid var(--line); border-bottom:1px solid var(--line); padding:3px 5px; font-size:9px; color:var(--muted); white-space:nowrap; overflow:hidden; }
  .pj-date { position:absolute; top:44px; height:24px; display:flex; align-items:center; justify-content:center; font-size:9px; color:var(--muted); border-right:1px solid var(--line); }
  .pj-date.weekend { background:color-mix(in srgb,var(--fg) 5%,transparent); }
  .pj-date.today { color:var(--accent); font-weight:750; background:color-mix(in srgb,var(--accent) 12%,transparent); }
  .pj-today { position:absolute; top:68px; bottom:0; width:1px; background:var(--accent); opacity:.6; pointer-events:none; z-index:3; }
  .pj-phase { position:absolute; height:26px; left:0; right:0; display:flex; align-items:center; gap:7px; padding:0 10px; font-size:10px; font-weight:650; background:var(--bg); border-bottom:1px solid var(--line); color:var(--muted); }
  .pj-phase svg { width:12px!important; height:12px!important; }
  .pj-row { position:absolute; left:0; right:0; height:48px; display:flex; border-bottom:1px solid var(--line); }
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
  .pj-colheads { position:sticky; top:0; height:39px; display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); background:var(--panel); border-bottom:1px solid var(--line); z-index:7; }
  .pj-colhead { padding:0 9px; display:flex; align-items:center; gap:5px; font-weight:650; font-size:11px; border-right:1px solid var(--line); }
  .pj-colhead span { margin-left:auto; font-size:9px; color:var(--muted); font-weight:400; }
  .pj-colhead.over span { color:color-mix(in srgb,#d56f50 85%,var(--fg)); font-weight:700; }
  .pj-lane { position:relative; }
  .pj-lane-title { height:26px; padding:0 9px; display:flex; align-items:center; gap:5px; font-size:9px; text-transform:uppercase; letter-spacing:.06em; color:var(--muted); border-bottom:1px solid var(--line); }
  .pj-lane-title svg { width:11px!important; height:11px!important; }
  .pj-cell { position:absolute; top:26px; bottom:0; width:33.3333%; overflow-y:auto; overflow-x:hidden; scrollbar-width:thin; overscroll-behavior:contain; border-right:1px solid var(--line); border-bottom:1px solid var(--line); }
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
  .pj-compact .pj-sidebar { width:130px; }
  .pj-compact .pj-sidebar-scroll { padding:10px 5px; }
  .pj-compact .pj-head { padding:0 10px; }
  .pj-compact .pj-title { font-size:15px; }
  .pj-compact .pj-saved span { display:none; }
  .pj-compact .pj-tabs { gap:15px; padding:0 10px; }
  .pj-compact .pj-toolbar { gap:4px; }
  .pj-compact .pj-toolbar .pj-btn { padding:4px 5px; }
  .pj-compact .pj-toolbar .pj-find-label { display:none; }
  `;

  env.widget({
    task: 'use-project-board', site: 'base', name: 'classic', split: 'train',
    scenarios: ['gantt-move', 'gantt-resize', 'dependency', 'swimlane', 'wip', 'milestone'],
    render(ctx) {
      const { spec: s, util: u, size } = ctx, F = env.taskDef, isBoard = F.helpers.board(s);
      const rng = ctx.rng.fork('workspace'), C = env.content, cs = { csplit: s.csplit };
      ctx.css('app-project-classic', CSS);
      const root = u.el('section', `pj-app${size.width < 1000 ? ' pj-compact' : ''}`, ctx.stage);
      root.setAttribute('aria-label', 'Project workspace');
      function icon(parent, name) {
        const svg = u.svg('svg', { class: 'pj-icon', viewBox: '0 0 24 24', 'aria-hidden': 'true' }, parent);
        svg.innerHTML = ICONS[name]; return svg;
      }
      function button(parent, label, name, cls = '') {
        const b = u.el('button', `pj-btn ${cls}`, parent); b.type = 'button';
        if (name) icon(b, name); if (label) u.el('span', '', b, label);
        return b;
      }
      function avatar(parent, owner, color) {
        const el = u.el('span', 'pj-avatar', parent, owner.split(' ').map((p) => p[0]).slice(0, 2).join(''));
        el.style.setProperty('--task', color || 'var(--accent)'); el.title = owner; return el;
      }
      const sidebar = u.el('nav', 'pj-sidebar', root); sidebar.setAttribute('aria-label', 'Workspace navigation');
      const nav = u.el('div', 'pj-sidebar-scroll', sidebar);
      const brand = u.el('div', 'pj-brand', nav); icon(u.el('span', 'pj-brand-mark', brand), 'project'); u.el('span', '', brand, 'Rowhaven');
      let openDrawer, menu = null, drawer = null;
      let filter = 'All work', grouping = 'Project section', zoom = 'Day';
      let mirror = () => {}, paintScene = () => {}, locateScene = () => null, refreshView = () => {};
      const statusOf = (i) => ['In progress', 'Planned', 'At risk', 'Complete'][i % 4];
      const stateColor = (state) => ({ 'In progress': '#4b83c5', Planned: '#8a85b1', 'At risk': '#c27d3c', Complete: '#419b78' }[state]);
      const extraTitles = C.sample(rng, BACKLOG, 14, cs);
      const related = Array.from({ length: 14 }, (_, i) => ({ id: `background-${i}`,
        title: extraTitles[i % extraTitles.length] + (i >= extraTitles.length ? ` ${i + 1}` : ''),
        owner: C.personName(rng, cs).full, color: ['#8497aa', '#8e9f88', '#a295b0'][i % 3], points: rng.pick([1, 2, 3, 5]),
        start: rng.int(1, s.days - 4), duration: rng.int(2, 4), state: statusOf(i + 1), related: true }));
      const active = s.items.map((it, i) => ({ ...it, state: statusOf(i), related: false, number: 101 + i }));
      const all = [...active, ...related];
      const todayDay = rng.int(5, Math.min(s.days, 16));
      function navItem(label, name, count, current = false) {
        const b = u.el('button', `pj-nav${current ? ' active' : ''}`, nav); b.type = 'button';
        icon(b, name); u.el('span', 'pj-navtext', b, label); if (count) u.el('span', 'pj-count', b, String(count));
        b.onclick = () => openDrawer(label); return b;
      }
      navItem('Home', 'home'); navItem('My work', 'tasks', 12); navItem('Inbox', 'inbox', 3);
      const favorites = u.el('div', 'pj-nav-heading', nav, 'Projects'); icon(favorites, 'plus');
      navItem(s.project, 'project', null, true);
      for (const name of ['Cedar customer hub', 'Spring service audit', 'Atlas knowledge base']) navItem(name, 'project');
      u.el('div', 'pj-nav-heading', nav, 'Teams');
      navItem('Delivery team', 'people', 8); navItem('Product', 'people'); navItem('Platform', 'people');
      u.el('div', 'pj-nav-heading', nav, 'Workspace'); navItem('Project portfolio', 'folder'); navItem('Archived work', 'folder', 4);
      const profile = u.el('div', 'pj-sidebar-foot', sidebar); avatar(profile, s.items[0].owner); const profileText = u.el('div', '', profile);
      u.el('div', '', profileText, s.items[0].owner.split(' ')[0]); u.el('div', 'pj-muted', profileText, 'Delivery workspace');
      const main = u.el('div', 'pj-main', root);
      const head = u.el('div', 'pj-head', main), heading = u.el('div', 'pj-grow', head);
      u.el('div', 'pj-muted', heading, 'Workspace / Projects / Delivery team'); u.el('div', 'pj-title', heading, s.project);
      const saved = u.el('div', 'pj-saved', head); icon(saved, 'check'); u.el('span', '', saved, 'Saved');
      const notifications = button(head, '', 'bell', 'icon pj-bell'); notifications.setAttribute('aria-label', 'Notifications, 3 unread');
      const details = button(head, '', 'info', 'icon'); details.setAttribute('aria-label', 'Project details');
      const tabs = u.el('div', 'pj-tabs', main);
      for (const [label, glyph] of [['Overview', 'project'], ['Board', 'board'], ['Timeline', 'timeline'], ['Activity', 'clock']]) {
        const current = label === (isBoard ? 'Board' : 'Timeline');
        const b = u.el('button', `pj-tab${current ? ' active' : ''}`, tabs); b.type = 'button'; icon(b, glyph); u.el('span', '', b, label);
        if (current) b.setAttribute('aria-current', 'page'); else b.onclick = () => openDrawer(label);
      }
      const tools = u.el('div', 'pj-tools', main), toolbar = u.el('div', 'pj-toolbar', tools);
      const findBtn = button(toolbar, '', 'search'); findBtn.setAttribute('aria-label', 'Find work'); u.el('span', 'pj-find-label', findBtn, 'Find');
      const filterBtn = button(toolbar, 'Filter', 'filter'), groupBtn = button(toolbar, isBoard ? 'Team' : 'Section', 'group');
      const clearBtn = button(toolbar, 'Reset view', 'close'); clearBtn.style.display = 'none';
      u.el('span', 'pj-grow', toolbar);
      const today = button(toolbar, isBoard ? 'Sprint 12' : 'Today', 'calendar');
      const zoomButtons = {};
      if (!isBoard) {
        const z = u.el('div', 'pj-zoom', toolbar);
        for (const label of ['Day', 'Week', 'Month']) {
          const b = u.el('button', label === zoom ? 'active' : '', z, label); b.type = 'button'; zoomButtons[label] = b;
          b.onclick = () => { zoom = label; Object.entries(zoomButtons).forEach(([k, el]) => el.classList.toggle('active', k === zoom)); refreshView(); };
        }
      }
      const viewMeta = u.el('div', 'pj-view-meta', tools);
      avatar(viewMeta, active[0].owner); avatar(viewMeta, active[1].owner, active[1].color);
      u.el('span', 'pj-grow', viewMeta, `${s.items.length} current items / ${related.length} related / Team access`);
      const policies = button(viewMeta, 'Policies', 'info');
      const body = u.el('div', 'pj-body', main); body.setAttribute('aria-label', isBoard ? 'Project board' : 'Project timeline');
      const hint = u.el('div', 'pj-hint', main), foot = u.el('div', 'pj-foot', main);
      const normalHint = isBoard ? (s.scenario === 'wip' ? 'Current sprint WIP: In progress limited to 2. Next-sprint backlog is excluded.' : 'Current sprint / Product and Platform / Next-sprint backlog below')
        : `Calendar days / Today: ${s.month} ${todayDay} / Finish-to-start dependencies / Related work included`;
      function say(text) { hint.replaceChildren(); icon(hint, text ? 'flag' : 'info'); u.el('span', '', hint, text || normalHint); hint.classList.toggle('warn', !!text); }
      say('');
      const currentViewReset = () => filter !== 'All work' || grouping !== 'Project section' || !!drawer || !!menu;
      function resetView() {
        filter = 'All work'; grouping = 'Project section';
        if (drawer) { drawer.remove(); drawer = null; }
        if (menu) { menu.remove(); menu = null; }
        filterBtn.classList.remove('on'); groupBtn.classList.remove('on');
        filterBtn.querySelector('span').textContent = 'Filter'; groupBtn.querySelector('span').textContent = isBoard ? 'Team' : 'Section';
        clearBtn.style.display = 'none'; refreshView(); mirror();
      }
      clearBtn.onclick = resetView;
      function showMenu(title, options, select) {
        if (menu) { menu.remove(); menu = null; clearBtn.style.display = currentViewReset() ? '' : 'none'; mirror(); return; }
        menu = u.el('div', 'pj-menu', main); u.el('h4', '', menu, title);
        clearBtn.style.display = '';
        for (const option of options) button(menu, option, 'check').onclick = () => {
          select(option); menu.remove(); menu = null; clearBtn.style.display = currentViewReset() ? '' : 'none'; refreshView(); mirror();
        };
        mirror();
      }
      filterBtn.onclick = () => showMenu('Filter work', ['All work', 'Open work', 'Completed work'], (v) => {
        filter = v; filterBtn.classList.toggle('on', v !== 'All work'); filterBtn.querySelector('span').textContent = v === 'All work' ? 'Filter' : v;
      });
      groupBtn.onclick = () => showMenu('Group work by', ['Project section', 'Assignee'], (v) => {
        grouping = v; groupBtn.classList.toggle('on', v !== 'Project section'); groupBtn.querySelector('span').textContent = v === 'Project section' ? (isBoard ? 'Team' : 'Section') : 'Assignee';
      });
      findBtn.onclick = () => showMenu('Quick find', ['Current sprint', 'Related projects', 'Open work'], (v) => {
        if (v === 'Open work') filter = v;
        else openDrawer(v);
      });
      openDrawer = (kind, it) => {
        if (drawer) drawer.remove();
        drawer = u.el('aside', 'pj-drawer', main); drawer.setAttribute('aria-label', kind);
        const dh = u.el('div', 'pj-drawer-head', drawer); u.el('span', 'pj-grow', dh, kind);
        const close = button(dh, '', 'close', 'icon'); close.setAttribute('aria-label', 'Close details');
        close.onclick = () => { drawer.remove(); drawer = null; clearBtn.style.display = currentViewReset() ? '' : 'none'; mirror(); };
        const db = u.el('div', 'pj-drawer-body', drawer);
        const field = (label, value) => { const r = u.el('div', 'pj-detail-row', db); u.el('span', 'label', r, label); u.el('span', '', r, value); };
        if (it) {
          u.el('div', 'pj-muted', db, `DLV-${it.number || 301 + related.indexOf(it)} / ${it.related ? 'Related work' : 'Current sprint'}`);
          u.el('h3', '', db, it.title); field('Assignee', it.owner);
          field('Status', isBoard && !it.related ? s.columns[ctx.model.cards[it.id].column] : it.state);
          if (isBoard && !it.related) field('Team', s.lanes[ctx.model.cards[it.id].lane]);
          field('Effort', `${it.points} pts`);
          if (!isBoard) { const b = it.related ? it : ctx.model.bars[it.id]; field('Start date', F.helpers.date(s, b.start)); field('Duration', `${b.duration} days`); }
          field('Project', s.project); field('Priority', 'Medium');
        } else if (kind === 'Policies') {
          u.el('h3', '', db, 'Project policies'); field('Calendar', 'Calendar days'); field('Dependency', 'Finish-to-start'); field('Current WIP', 'In progress: maximum 2');
          u.el('p', '', db, 'A predecessor must finish before its successor begins. Next-sprint backlog items are outside current WIP limits.');
        } else {
          u.el('h3', '', db, kind === 'Project details' ? s.project : kind);
          field('Owner', s.items[0].owner); field('Health', 'On track'); field('Visibility', 'Delivery team');
          for (const [i, text] of ['updated the release checklist', 'added a note to the weekly plan', 'shared a project status update'].entries()) {
            const a = u.el('div', 'pj-activity', db); avatar(a, active[i].owner, active[i].color);
            u.el('span', '', a, `${active[i].owner} ${text}. ${i + 1}h ago`);
          }
        }
        clearBtn.style.display = ''; mirror();
      };
      notifications.onclick = () => openDrawer('Inbox: 3 unread'); details.onclick = () => openDrawer('Project details'); policies.onclick = () => openDrawer('Policies');
      const update = (action) => {
        const result = F.helpers.apply(ctx.model, s, action);
        if (result.reason) { say(result.reason); ctx.log('project-blocked', { reason: result.reason }); return false; }
        ctx.update(result.model); say(''); paint(ctx.model); ctx.reanchor(); return true;
      };
      if (!isBoard) {
        const AXIS = 68, ROW = 48, PHASE = 26;
        const wrap = u.el('div', 'pj-timeline', body);
        const metaW = Math.max(204, Math.min(268, body.clientWidth * .36));
        let dayW, shownDays;
        const positions = {}, nodes = {}, bars = {}, datesText = {}, ports = {}, captions = {};
        const axis = u.el('div', 'pj-axis', wrap), axisLabel = u.el('div', 'pj-axis-label', axis);
        axisLabel.style.width = `${metaW}px`;
        u.el('strong', '', axisLabel, s.scenario === 'milestone' ? 'Milestone plan' : 'Work item / Assignee');
        u.el('span', '', axisLabel, 'Status / Start / Duration');
        const dates = u.el('div', 'pj-dates', axis);
        const todayLine = u.el('div', 'pj-today', wrap);
        const phase = u.el('div', 'pj-phase', wrap); icon(phase, 'down'); u.el('span', '', phase, 'Current release / Delivery plan');
        const nextPhase = u.el('div', 'pj-phase', wrap); icon(nextPhase, 'down'); u.el('span', '', nextPhase, 'Operations / Upcoming work');
        const lineLayer = u.svg('svg', { class: 'pj-edges' }, wrap), edgesG = u.svg('g', {}, lineLayer);
        const rubber = u.svg('path', { class: 'pj-rubber' }, lineLayer);
        let edgePoints = {};
        const at = (id, side, m = ctx.model) => {
          const b = m.bars[id];
          return [metaW + (b.start - 1 + (s.scenario === 'milestone' ? .5 : side === 'out' ? b.duration : 0)) * dayW, positions[id] + ROW / 2];
        };
        for (const [index, it] of all.entries()) {
          const row = u.el('div', 'pj-row', wrap); nodes[it.id] = row;
          const meta = u.el('div', 'pj-meta', row); meta.style.width = `${metaW}px`;
          const title = u.el('div', 'pj-task-top', meta); u.el('span', 'pj-id', title, `DLV-${it.number || 301 + index - active.length}`);
          const name = u.el('button', 'pj-name', title, it.title); name.type = 'button'; name.onclick = () => openDrawer('Work item details', it);
          const sub = u.el('div', 'pj-row-bottom', meta); avatar(sub, it.owner, it.color); u.el('span', 'pj-owner', sub, it.owner.split(' ')[0]);
          const chip = u.el('span', 'pj-chip', sub, it.state); chip.style.setProperty('--state', stateColor(it.state));
          datesText[it.id] = u.el('span', '', sub);
          const grid = u.el('div', 'pj-grid', row);
          const milestone = !it.related && s.scenario === 'milestone';
          const bar = u.el('div', milestone ? 'pj-diamond' : `pj-bar${it.related ? ' background' : ''}`, grid);
          bar.style.setProperty('--task', it.color); bars[it.id] = bar;
          if (!milestone) captions[it.id] = u.el('span', 'pj-bar-label', bar);
          if (it.related) { bar.onclick = () => openDrawer('Work item details', it); continue; }
          bar.setAttribute('role', 'button'); bar.setAttribute('aria-label', `${it.title}: ${milestone ? 'milestone date' : 'start date'}`);
          const grip = milestone || s.scenario === 'dependency' ? null : u.el('div', 'pj-resize', bar);
          if (grip) grip.setAttribute('aria-label', `${it.title}: duration`);
          if (s.scenario === 'dependency') bar.style.cursor = 'default';
          ports[it.id] = {};
          if (s.scenario === 'dependency') for (const side of ['in', 'out']) {
            const port = u.el('span', `pj-port ${side}`, bar); ports[it.id][side] = port;
            port.setAttribute('aria-label', `${it.title}: ${side === 'out' ? 'finish' : 'start'} port`);
            if (side === 'out') env.ui.track(port, {
              start(p, e) { e.stopPropagation(); rubber.setAttribute('d', ''); },
              move(p) { const r = wrap.getBoundingClientRect(), a = at(it.id, 'out'); rubber.setAttribute('d', `M${a} L${p.x - r.left},${p.y - r.top}`); },
              end(p) {
                rubber.setAttribute('d', '');
                const dest = active.find(({ id }) => { const r = ports[id].in.getBoundingClientRect(); return Math.hypot(p.x - r.left - r.width / 2, p.y - r.top - r.height / 2) < 18; });
                if (dest) update({ add: [it.id, dest.id] });
              },
            }, `dependency-${it.id}`);
          }
          let before, ghost;
          const gesture = (resize) => ({
            start(p, e) {
              if (e.target.closest('.pj-port')) return false;
              e.stopPropagation(); before = { ...ctx.model.bars[it.id] };
              ghost = u.el('div', 'pj-ghost', root, it.title); ghost.style.left = `${p.x + 12}px`; ghost.style.top = `${p.y + 12}px`;
            },
            move(p) {
              const delta = Math.round(p.dx / dayW);
              const value = resize ? env.util.clamp(before.duration + delta, 1, s.days + 1 - before.start)
                : env.util.clamp(before.start + delta, 1, s.days + 1 - Math.max(1, before.duration));
              if (resize) bar.style.width = `${value * dayW}px`; else bar.style.left = `${(value - 1 + (milestone ? .5 : 0)) * dayW}px`;
              ghost.textContent = `${it.title} / ${resize ? `${value} days` : F.helpers.date(s, value)}`;
              ghost.style.left = `${p.x + 12}px`; ghost.style.top = `${p.y + 12}px`;
            },
            end(p) {
              ghost.remove(); const delta = Math.round(p.dx / dayW);
              update(resize ? { bar: it.id, duration: env.util.clamp(before.duration + delta, 1, s.days + 1 - before.start) }
                : { bar: it.id, start: env.util.clamp(before.start + delta, 1, s.days + 1 - Math.max(1, before.duration)) });
              paint(ctx.model);
            },
          });
          if (s.scenario !== 'dependency') env.ui.track(bar, gesture(false), `schedule-${it.id}`);
          if (grip) env.ui.track(grip, gesture(true), `duration-${it.id}`);
        }
        function calendar() {
          shownDays = zoom === 'Day' ? s.days : zoom === 'Week' ? 28 : s.month === 'June' ? 30 : 31;
          dayW = (body.clientWidth - metaW) / shownDays;
          dates.replaceChildren(); u.el('div', 'pj-month', dates, `${s.month} / ${zoom === 'Day' ? 'Daily schedule' : zoom === 'Week' ? 'Weekly overview' : 'Month overview'}`);
          for (let d = 1; d <= shownDays; d += 7) {
            const el = u.el('div', 'pj-week', dates, `Week ${Math.floor((d - 1) / 7) + 1} / ${s.month.slice(0, 3)} ${d}-${Math.min(d + 6, shownDays)}`);
            el.style.left = `${(d - 1) * dayW}px`; el.style.width = `${Math.min(7, shownDays - d + 1) * dayW}px`;
          }
          for (let d = 1; d <= shownDays; d++) {
            const el = u.el('div', `pj-date${d % 7 === 0 || d % 7 === 6 ? ' weekend' : ''}${d === todayDay ? ' today' : ''}`, dates, String(d));
            el.style.left = `${(d - 1) * dayW}px`; el.style.width = `${dayW}px`; el.title = `${s.month} ${d}${d === todayDay ? ' / Today' : ''}`;
          }
          todayLine.style.left = `${metaW + (todayDay - .5) * dayW}px`;
          Object.values(nodes).forEach((row) => row.lastElementChild.style.setProperty('--day', `${dayW}px`));
        }
        mirror = () => {
          const rows = {};
          active.forEach(({ id }) => { rows[id] = [positions[id] + ROW / 2 - 12, positions[id] + ROW / 2 + 12]; });
          for (const [k, a] of Object.entries(edgePoints)) rows[`edge:${k}`] = [a[1] - 10, a[1] + 10];
          const view = { top: body.scrollTop + AXIS + 10, bottom: body.scrollTop + body.clientHeight - 10, rows, reset: currentViewReset() };
          if (JSON.stringify(ctx.model.view) !== JSON.stringify(view)) ctx.update({ ...ctx.model, view });
        };
        paintScene = (m) => {
          for (const it of all) {
            const b = it.related ? it : m.bars[it.id], milestone = !it.related && s.scenario === 'milestone';
            bars[it.id].style.left = `${(b.start - 1 + (milestone ? .5 : 0)) * dayW}px`;
            if (!milestone) bars[it.id].style.width = `${b.duration * dayW}px`;
            if (captions[it.id]) captions[it.id].textContent = b.duration * dayW > 130 ? `${it.title} / ${b.duration}d` : `${b.duration}d`;
            bars[it.id].title = `${it.title}: ${F.helpers.date(s, b.start)} / ${b.duration} days`;
            datesText[it.id].textContent = `${s.month.slice(0, 3)} ${b.start}${b.duration ? ` / ${b.duration}d` : ''}`;
          }
          edgesG.replaceChildren(); edgePoints = {};
          for (const e of m.edges) {
            const a = at(e[0], 'out', m), b = at(e[1], 'in', m), mid = Math.min(body.clientWidth - 8, a[0] + 12);
            if (nodes[e[0]].style.display === 'none' || nodes[e[1]].style.display === 'none') continue;
            u.svg('path', { class: 'pj-link', d: `M${a} H${mid} V${b[1]} H${b[0]} m-5,-4 l5,4 -5,4` }, edgesG);
            const x = mid, y = (a[1] + b[1]) / 2; edgePoints[e.join('>')] = [x, y];
            if (s.scenario === 'dependency') {
              const del = u.svg('g', { class: 'pj-edge-delete', 'aria-label': `Remove dependency ${e.join(' to ')}` }, edgesG);
              u.svg('circle', { cx: x, cy: y, r: 8 }, del); u.svg('path', { d: `M${x - 3},${y - 3} l6,6 m-6,0 l6,-6` }, del);
              del.addEventListener('click', () => update({ remove: e }));
            }
          }
        };
        refreshView = () => {
          calendar();
          let y = AXIS; phase.style.top = `${y}px`; y += PHASE;
          const sequence = [related[0], related[1]];
          active.forEach((it, i) => sequence.push(it, related[i + 2]));
          const rest = related.slice(active.length + 2);
          let ordered = [...sequence, ...rest];
          if (grouping === 'Assignee') ordered = ordered.sort((a, b) => a.owner.localeCompare(b.owner, 'en'));
          let second = false;
          for (const it of ordered) {
            const show = filter === 'All work' || (filter === 'Completed work' ? it.state === 'Complete' : it.state !== 'Complete');
            nodes[it.id].style.display = show ? '' : 'none';
            if (!show) continue;
            if (!second && rest.includes(it)) { nextPhase.style.top = `${y}px`; y += PHASE; second = true; }
            positions[it.id] = y; nodes[it.id].style.top = `${y}px`; y += ROW;
          }
          nextPhase.style.display = second ? '' : 'none'; wrap.style.height = `${y + 10}px`;
          paint(ctx.model);
        };
        locateScene = (t) => {
          const r = wrap.getBoundingClientRect();
          if (t.port) return u.center(ports[t.port][t.side]);
          if (t.edge) { const a = edgePoints[t.edge.join('>')]; return [r.left + a[0], r.top + a[1]]; }
          if (t.end) { const b = ctx.model.bars[t.end], a = at(t.end, 'out'); return [r.left + a[0] - 2 + ((t.duration ?? b.duration) - b.duration) * dayW, r.top + a[1]]; }
          const b = ctx.model.bars[t.bar], a = at(t.bar, 'in');
          return [r.left + a[0] + (s.scenario === 'milestone' ? 0 : b.duration * dayW / 2) + ((t.date ?? b.start) - b.start) * dayW, r.top + a[1]];
        };
        today.onclick = () => { body.scrollTop = 0; zoom = 'Day'; Object.entries(zoomButtons).forEach(([k, b]) => b.classList.toggle('active', k === zoom)); refreshView(); };
      } else {
        const wrap = u.el('div', 'pj-board', body), heads = u.el('div', 'pj-colheads', wrap), counters = [];
        s.columns.forEach((label) => { const h = u.el('div', 'pj-colhead', heads, label); counters.push({ h, value: u.el('span', '', h) }); });
        const laneH = Math.max(80, (body.clientHeight - 39) / s.lanes.length), cardH = Math.max(46, Math.min(78, laneH - 34));
        const cells = {}, contents = {}, cards = {}, empty = {}, cardOffsets = {};
        s.lanes.forEach((label, l) => {
          const row = u.el('div', 'pj-lane', wrap); row.style.height = `${laneH}px`;
          const title = u.el('div', 'pj-lane-title', row); icon(title, 'down'); u.el('span', '', title, `${label} / Current sprint`);
          s.columns.forEach((col, c) => {
            const k = `${c}:${l}`, cell = u.el('div', 'pj-cell', row); cell.style.left = `${c * 100 / 3}%`;
            cell.setAttribute('aria-label', `${col} / ${label}`); cells[k] = cell;
            contents[k] = u.el('div', 'pj-cell-content', cell); empty[k] = u.el('div', 'pj-empty', contents[k]);
            icon(empty[k], 'tasks'); u.el('span', '', empty[k], 'No work in this status');
            cell.addEventListener('scroll', () => mirror());
          });
        });
        for (const it of active) {
          const card = u.el('div', `pj-card${cardH < 65 ? ' compact' : ''}`, wrap); card.style.height = `${cardH}px`; card.style.setProperty('--task', it.color);
          card.setAttribute('role', 'button'); card.setAttribute('aria-label', it.title);
          const top = u.el('div', 'pj-card-top', card); u.el('span', 'pj-grow', top, `DLV-${it.number}`);
          const tag = u.el('span', 'pj-chip', top, it.number % 2 ? 'Delivery' : 'Platform'); tag.style.setProperty('--state', it.color);
          u.el('div', 'pj-name', card, it.title);
          const bottom = u.el('div', 'pj-card-bottom', card); avatar(bottom, it.owner, it.color); u.el('span', 'pj-grow pj-owner', bottom, it.owner.split(' ')[0]);
          icon(bottom, 'chat'); u.el('span', '', bottom, String(it.number % 4)); u.el('span', '', bottom, `${it.points} pts`);
          card.title = `${it.title} / ${it.owner} / ${it.points} pts`; cards[it.id] = card;
          let ghost;
          const hit = (p) => Object.entries(cells).find(([, cell]) => { const r = cell.getBoundingClientRect(); return p.x >= r.left && p.x <= r.right && p.y >= r.top && p.y <= r.bottom; });
          env.ui.track(card, {
            start(p) { card.classList.add('pj-dragging'); ghost = u.el('div', 'pj-ghost', root, it.title); ghost.style.left = `${p.x + 12}px`; ghost.style.top = `${p.y + 12}px`; },
            move(p) {
              ghost.style.left = `${p.x + 12}px`; ghost.style.top = `${p.y + 12}px`;
              const h = hit(p); Object.entries(cells).forEach(([k, cell]) => cell.classList.toggle('over', !!h && h[0] === k));
            },
            end(p) {
              ghost.remove(); card.classList.remove('pj-dragging'); Object.values(cells).forEach((cell) => cell.classList.remove('over'));
              const h = hit(p); if (h) { const [column, lane] = h[0].split(':').map(Number); update({ card: it.id, column, lane }); }
            },
          }, `board-${it.id}`);
        }
        const backlog = u.el('section', 'pj-backlog', wrap); u.el('h4', '', backlog, 'Next sprint / Related project backlog');
        u.el('p', '', backlog, 'Uncommitted work across the delivery workspace. Outside current sprint WIP limits.');
        const backlogGrid = u.el('div', 'pj-backlog-grid', backlog), backlogCards = {};
        related.forEach((it, i) => {
          const card = u.el('div', 'pj-backlog-card', backlogGrid); backlogCards[it.id] = card;
          u.el('div', 'pj-muted', card, `REQ-${301 + i} / ${i % 2 ? 'Cedar customer hub' : 'Service audit'}`);
          const b = u.el('button', 'pj-name', card, it.title); b.type = 'button'; b.onclick = () => openDrawer('Work item details', it);
          const sub = u.el('div', 'pj-card-bottom', card); avatar(sub, it.owner, it.color); u.el('span', 'pj-grow', sub, it.state); u.el('span', '', sub, `${it.points} pts`);
        });
        mirror = () => {
          const v = {};
          for (const { id } of active) {
            const c = ctx.model.cards[id], cell = cells[`${c.column}:${c.lane}`];
            v[id] = { center: cardOffsets[id] + cardH / 2, scroll: cell.scrollTop, height: cell.clientHeight, cell: [c.column, c.lane] };
          }
          const view = { scroll: body.scrollTop, cards: v, reset: currentViewReset() };
          if (JSON.stringify(ctx.model.view) !== JSON.stringify(view)) ctx.update({ ...ctx.model, view });
        };
        paintScene = (m) => {
          const counts = F.helpers.counts(m, s);
          counters.forEach(({ h, value }, c) => { value.textContent = s.scenario === 'wip' || s.judge ? `${counts[c]} / ${s.limits[c]} WIP` : String(counts[c]); h.classList.toggle('over', s.scenario === 'wip' && counts[c] > s.limits[c]); });
          for (const k of Object.keys(cells)) {
            const [column, lane] = k.split(':').map(Number);
            const members = active.filter(({ id }) => m.cards[id].column === column && m.cards[id].lane === lane);
            const group = members.filter(() => filter === 'All work' || (filter === 'Completed work' ? column === 2 : column !== 2));
            if (grouping === 'Assignee') group.sort((a, b) => a.owner.localeCompare(b.owner, 'en'));
            members.forEach((it) => { cards[it.id].style.display = group.includes(it) ? '' : 'none'; });
            contents[k].style.height = `${Math.max(cells[k].clientHeight, group.length * (cardH + 7) + 7)}px`;
            empty[k].style.display = group.length ? 'none' : '';
            group.forEach((it, i) => {
              if (cards[it.id].parentElement !== contents[k]) contents[k].append(cards[it.id]);
              const top = 7 + i * (cardH + 7); cards[it.id].style.top = `${top}px`; cardOffsets[it.id] = top;
            });
          }
        };
        refreshView = () => {
          for (const it of related) backlogCards[it.id].style.display = filter === 'All work' || (filter === 'Completed work' ? it.state === 'Complete' : it.state !== 'Complete') ? '' : 'none';
          if (grouping === 'Assignee') [...related].sort((a, b) => a.owner.localeCompare(b.owner, 'en')).forEach((it) => backlogGrid.append(backlogCards[it.id]));
          else related.forEach((it) => backlogGrid.append(backlogCards[it.id]));
          paint(ctx.model);
        };
        locateScene = (t) => t.card ? u.center(cards[t.card]) : u.center(cells[t.cell.join(':')]);
        today.onclick = () => { body.scrollTop = 0; mirror(); };
      }
      function paint(m) {
        paintScene(m); foot.replaceChildren();
        u.el('span', '', foot, 'Current sprint');
        for (const fact of F.facts(m, s)) { const el = u.el('span', '', foot, `${fact.label}:`); u.el('strong', '', el, fact.value); }
        mirror();
      }
      body.addEventListener('scroll', () => mirror());
      refreshView();
      // The sticky calendar/column heading routes wheel input to the outer pane,
      // rather than a nested board cell or the native scrollbar gutter.
      live = { locate: (t) => t.resetView ? u.center(clearBtn) : t.pane ? [body.getBoundingClientRect().right - 25, body.getBoundingClientRect().top + 20] : locateScene(t) };
      return { anchors: [root, body], sync: (m) => { paint(m); ctx.reanchor(); } };
    },
    locate(t) { return live.locate(t); },
  });
})();
