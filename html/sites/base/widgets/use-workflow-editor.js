/* base / use-workflow-editor / classic: Relayboard, a full workflow editor with a searchable component palette,
 * 10 px ports, curved selectable edges, destination reconnection, node drag, empty-canvas pan, context
 * menus and a saved node inspector. All geometry is world px; only the fixed editor shell is an anchor.
 * Zoom, viewport dimensions and routed-edge hit points are mirrored into unscored model.view. locate() only reads DOM / model geometry.
 */
(function () {
  'use strict';
  let live;
  const CSS = `
  .af-app { position:absolute; inset:10px; display:flex; flex-direction:column; min-width:0; overflow:hidden;
    border:1px solid var(--line); border-radius:10px; background:var(--panel); box-shadow:0 10px 36px #0000000d; font-size:12px; }
  .af-app button,.af-app input { font:inherit; color:var(--fg); }
  .af-top { display:flex; align-items:center; gap:10px; height:52px; flex:none; padding:8px 14px; border-bottom:1px solid var(--line); }
  .af-logo { display:grid; place-items:center; width:28px; height:28px; background:var(--accent); color:white; border-radius:8px; font-size:19px; }
  .af-title { flex:1; min-width:0; }.af-title strong { display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .af-sub,.af-muted { color:var(--muted); font-size:10px; }.af-badge { padding:3px 7px; border-radius:4px; background:var(--bg); color:var(--muted); }
  .af-btn { border:1px solid var(--line); border-radius:5px; background:var(--panel); padding:5px 9px; cursor:pointer; }
  .af-btn:hover { border-color:var(--accent); }.af-btn:disabled { opacity:.4; cursor:default; }.af-primary { background:var(--accent); color:white!important; border-color:var(--accent); }
  .af-toolbar { height:36px; flex:none; display:flex; align-items:center; gap:6px; padding:4px 10px; border-bottom:1px solid var(--line); }
  .af-tabs { color:var(--accent); font-weight:650; margin-right:auto; }.af-toolbar .af-btn { padding:3px 8px; }
  .af-body { flex:1; min-height:0; display:flex; position:relative; }.af-palette { flex:0 0 134px; width:134px; padding:12px 9px; border-right:1px solid var(--line); display:flex; flex-direction:column; min-height:0; }
  .af-palette h3 { margin:0 0 8px; font-size:12px; }.af-search { width:100%; min-width:0; border:1px solid var(--line); border-radius:5px; padding:6px; background:var(--bg); }
  .af-list { overflow:auto; min-height:0; padding:8px 0; flex:1; touch-action:pan-y; }.af-category { color:var(--muted); text-transform:uppercase; font-size:9px; letter-spacing:.08em; margin:8px 0; }
  .af-component { display:flex; align-items:center; gap:7px; padding:5px; margin:3px 0; border:1px solid var(--line); border-radius:5px; cursor:grab; font-size:11px; background:var(--panel); }
  .af-component[hidden] { display:none; }
  .af-symbol { display:grid; place-items:center; flex:none; width:22px; height:22px; border-radius:5px; color:var(--accent); background:color-mix(in srgb,var(--accent) 10%,var(--panel)); font-weight:700; }
  .af-canvas { flex:1; min-width:0; position:relative; overflow:hidden; touch-action:none; cursor:grab; background-color:var(--bg);
    background-image:radial-gradient(var(--line) 1px, transparent 1px); background-size:18px 18px; }
  .af-svg { position:absolute; inset:0; width:100%; height:100%; overflow:visible; }.af-edge { fill:none; stroke:var(--muted); stroke-width:2; cursor:pointer; }
  .af-hit { fill:none; stroke:transparent; stroke-width:14; pointer-events:stroke; cursor:pointer; }.af-wire.on .af-edge { stroke:var(--accent); stroke-width:3; }
  .af-end { fill:var(--panel); stroke:var(--accent); stroke-width:2; cursor:crosshair; }.af-preview { fill:none; stroke:var(--accent); stroke-width:2; stroke-dasharray:5 4; pointer-events:none; }
  .af-node { position:absolute; width:148px; height:76px; background:var(--panel); border:1px solid var(--line); border-radius:8px; box-shadow:0 3px 7px #00000012; cursor:grab; }
  .af-node.on { border-color:var(--accent); box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 14%,transparent); }
  .af-nodehead { padding:10px 10px 6px; display:flex; align-items:center; gap:7px; font-size:11px; font-weight:650; }.af-nodehead span:last-child { overflow:hidden; overflow-wrap:anywhere; white-space:normal; line-height:14px; max-height:28px; }
  .af-nodefoot { padding:0 11px; font-size:10px; color:var(--muted); display:flex; justify-content:space-between; }.af-port { position:absolute; width:10px; height:10px; border:2px solid var(--accent); border-radius:50%; background:var(--panel); top:32px; cursor:crosshair; z-index:3; padding:0; }
  .af-port.in { left:-5px; }.af-port.out { right:-5px; }.af-port:hover { background:var(--accent); box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 20%,transparent); }
  .af-hint { position:absolute; bottom:10px; left:12px; color:var(--muted); font-size:10px; pointer-events:none; padding:3px 5px; background:var(--bg); border-radius:4px; }
  .af-footer { min-height:30px; flex:none; padding:6px 12px; display:flex; flex-wrap:wrap; align-items:center; gap:14px; border-top:1px solid var(--line); color:var(--muted); font-size:10px; }
  .af-footer .af-status { margin-left:auto; }.af-panel { position:absolute; right:0; top:0; bottom:0; z-index:8; width:min(292px,100%); background:var(--panel); border-left:1px solid var(--line); box-shadow:-8px 0 24px #0000000a; display:flex; flex-direction:column; }
  .af-panel[hidden],.af-menu[hidden] { display:none; }.af-panelhead { display:flex; gap:8px; align-items:center; padding:12px; border-bottom:1px solid var(--line); }.af-panelhead strong { flex:1; }
  .af-fields { overflow:auto; padding:14px; min-height:0; flex:1; }.af-field { display:block; margin-bottom:14px; font-size:11px; }.af-field input { display:block; margin-top:5px; width:100%; border:1px solid var(--line); border-radius:5px; background:var(--bg); padding:8px; user-select:text; }
  .af-panelbottom { padding:12px; border-top:1px solid var(--line); }.af-menu { position:absolute; z-index:12; width:172px; padding:5px; background:var(--panel); border:1px solid var(--line); border-radius:6px; box-shadow:0 8px 24px #0002; }
  .af-menu button { display:block; width:100%; padding:8px; text-align:left; border:0; background:transparent; cursor:pointer; }.af-menu button:hover { background:var(--bg); }.af-danger { color:#d44d60!important; }

  .af-app { border-radius:7px; font-family:Arial,system-ui,sans-serif; }
  .af-app svg.af-icon { width:16px; height:16px; flex:none; vertical-align:middle; }
  .af-top { height:53px; gap:8px; }.af-sub { display:block; margin-top:4px; font-size:10px; }
  .af-top .af-btn { display:flex; align-items:center; gap:5px; white-space:nowrap; }
  .af-btn { display:inline-flex; align-items:center; justify-content:center; gap:5px; }
  .af-toolbar { height:36px; }.af-tab { border:0; background:none; padding:6px; color:var(--muted); font:inherit; cursor:pointer; }
  .af-tab.active { color:var(--accent); border-bottom:2px solid var(--accent); font-weight:700; }
  .af-workspace { display:flex; flex-direction:column; flex:1; min-width:0; min-height:0; }
  .af-palette { flex-basis:159px; width:159px; padding:0; background:color-mix(in srgb,var(--bg) 60%,var(--panel)); }
  .af-worknav { padding:8px; border-bottom:1px solid var(--line); }.af-worknav strong { display:block; padding:4px 5px; font-size:11px; }
  .af-navitem { display:flex; align-items:center; gap:7px; padding:5px 6px; color:var(--muted); font-size:10px; border-radius:4px; cursor:pointer; }
  .af-navitem.active { background:color-mix(in srgb,var(--accent) 10%,var(--panel)); color:var(--accent); }.af-navitem small { margin-left:auto; }
  .af-palette h3 { margin:9px 10px 6px; }.af-search { width:calc(100% - 20px); margin:0 10px; }.af-list { padding:0 9px; }
  .af-palette > .af-muted { margin:6px 10px; }.af-component { padding:5px; margin:4px 0; font-size:10px; }
  .af-symbol { width:23px; height:23px; }.af-symbol svg { width:14px!important; height:14px!important; }
  .af-canvas { flex:1; min-height:100px; }.af-world { position:absolute; top:0; left:0; transform-origin:0 0; }
  .af-port.in { left:-6px; }.af-port.out { right:-6px; }.af-node { border-radius:6px; }
  .af-nodehead { padding:9px 8px 5px; font-size:12px; }.af-nodefoot { padding:0 9px; }.af-nodefoot svg { width:12px!important; height:12px!important; }
  .af-reference { position:absolute; opacity:.82; }.af-reference .af-node { border-style:dashed; box-shadow:none; cursor:default; }
  .af-reference .disabled { opacity:.52; }.af-port-static { position:absolute; width:9px; height:9px; border:2px solid var(--muted); border-radius:50%; top:33px; background:var(--panel); }
  .af-port-static.in { left:-5px; }.af-port-static.out { right:-5px; }
  .af-sticky { position:absolute; left:38px; top:266px; width:164px; min-height:62px; padding:9px; border:1px solid color-mix(in srgb,#c49a32 45%,var(--line)); border-radius:3px;
    background:color-mix(in srgb,#d6b14e 15%,var(--panel)); color:var(--fg); font-size:10px; line-height:1.45; }
  .af-sticky strong { display:block; margin-bottom:3px; }.af-refcap { position:absolute; top:259px; left:260px; width:260px; white-space:nowrap; font-size:10px; color:var(--muted); }
  .af-overview { width:210px; flex:none; border-left:1px solid var(--line); display:flex; flex-direction:column; background:var(--panel); }
  .af-overviewhead { padding:11px; border-bottom:1px solid var(--line); font-size:11px; font-weight:700; }
  .af-overviewbody { padding:10px 12px; overflow:auto; min-height:0; font-size:10px; flex:1; }
  .af-property { margin:12px 0; color:var(--muted); }.af-property b { display:block; margin-top:4px; color:var(--fg); font-weight:500; overflow-wrap:anywhere; }
  .af-json { padding:9px; background:var(--bg); border:1px solid var(--line); border-radius:4px; font:10px/1.65 monospace; white-space:pre-wrap; color:var(--muted); }
  .af-activity { margin-top:13px; padding-top:10px; border-top:1px solid var(--line); }.af-activity p { margin:9px 0; color:var(--muted); }
  .af-executions { height:113px; flex:none; border-top:1px solid var(--line); display:flex; min-width:0; background:var(--panel); }
  .af-runs { flex:1; min-width:0; display:flex; flex-direction:column; }.af-runhead { display:flex; align-items:center; gap:7px; padding:7px 10px; font-size:10px; border-bottom:1px solid var(--line); }
  .af-runhead span { margin-left:auto; color:var(--muted); }.af-runlist { overflow:auto; flex:1; }.af-runrow { display:grid; grid-template-columns:63px 1fr 63px 52px; gap:6px; padding:5px 10px; border-bottom:1px solid color-mix(in srgb,var(--line) 50%,transparent); font-size:10px; color:var(--muted); cursor:pointer; }
  .af-good { color:#38966b; }.af-bad { color:#ce6470; }.af-runrow:hover { background:var(--bg); }
  .af-map { width:148px; flex:none; padding:7px; border-left:1px solid var(--line); }.af-maplabel { display:flex; justify-content:space-between; color:var(--muted); font-size:9px; margin-bottom:5px; }
  .af-minimap { width:132px; height:72px; background:var(--bg); border:1px solid var(--line); cursor:crosshair; }.af-mapedge { stroke:var(--muted); stroke-width:1; fill:none; }
  .af-panel { width:256px; }.af-fields { padding:10px 13px; }.af-field { margin-bottom:11px; }.af-panelhead { padding:9px 12px; }.af-panelbottom { padding:9px 12px; }
  .af-footer { font-size:9px; min-height:26px; gap:10px; padding:5px 10px; }.af-footer .af-status { display:flex; align-items:center; gap:4px; }
  .af-popover { position:absolute; top:51px; right:10px; width:262px; z-index:20; background:var(--panel); border:1px solid var(--line); border-radius:6px; box-shadow:0 10px 30px #0003; padding:13px; font-size:11px; }
  .af-popover[hidden] { display:none; }.af-popover p { margin:10px 0; color:var(--muted); line-height:1.5; }.af-popover button { margin-top:6px; }
  .af-compact .af-overview { display:none; }.af-compact .af-executions { height:96px; }.af-compact .af-map { width:125px; }.af-compact .af-minimap { width:109px; height:58px; }
  .af-tight .af-top .af-optional { display:none; }.af-tight .af-palette { flex-basis:145px; width:145px; }.af-tight .af-toolbar .af-muted { display:none; }
  `;
  const ICONS = ['bolt', 'filter', 'code', 'send', 'record', 'clock'];
  const PATHS = {
    bolt:'M13 2 5 12h6l-1 10 9-13h-6z', filter:'M3 4h18l-7 8v7l-4 2v-9z',
    code:'m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18', send:'m3 3 18 9-18 9 4-9zm4 9h14',
    record:'M4 4h16v16H4zM4 9h16M9 9v11', clock:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18m0 4v5l4 2',
    grid:'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z',
    bell:'M5 17h14l-2-3V9a5 5 0 0 0-10 0v5zm5 3h4',
    more:'M5 11h1v1H5zm6 0h1v1h-1zm6 0h1v1h-1z',
    undo:'m8 4-5 5 5 5M3 9h11a6 6 0 0 1 0 12', close:'m5 5 14 14M19 5 5 19',
    plus:'M12 5v14M5 12h14', minus:'M5 12h14', fit:'M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5',
    play:'m7 4 14 8-14 8z', check:'m4 12 5 5L20 6', chevron:'m9 5 7 7-7 7',
    folder:'M3 6h7l2 3h9v11H3z', branch:'M6 3v12a4 4 0 0 0 4 4h7M6 8h9a3 3 0 0 0 3-3V3',
    lock:'M5 10h14v11H5zM8 10V6a4 4 0 0 1 8 0v4', history:'M3 10a9 9 0 1 1 2 8M3 4v6h6m3-4v6l4 2',
    trash:'M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7',
  };
  env.widget({ task: 'use-workflow-editor', site: 'base', name: 'classic', split: 'train',
    scenarios: ['connect', 'place', 'reroute', 'remove', 'configure'],
    render(ctx) {
      const { util, spec: s } = ctx, F = env.taskDef;
      ctx.css('app-flow-classic', CSS);
      const app = util.el('section', 'af-app', ctx.stage);
      app.style.width = Math.max(0, ctx.size.width - 20) + 'px';
      app.style.height = Math.max(0, ctx.size.height - 20) + 'px';
      app.setAttribute('aria-label', 'Relayboard workflow editor');
      const el = (tag, cls, parent, text) => util.el(tag, cls, parent, text);
      const button = (parent, text, fn, cls = '') => {
        const b = el('button', `af-btn ${cls}`, parent, text); b.type = 'button'; b.addEventListener('click', fn); return b;
      };
      const icon = (parent, name) => {
        const svg = util.svg('svg', { class: 'af-icon', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':1.7, 'stroke-linecap':'round', 'stroke-linejoin':'round', 'aria-hidden':'true' }, parent);
        util.svg('path', { d: PATHS[name] || PATHS.grid }, svg); return svg;
      };
      const iconButton = (parent, label, name, fn, cls = '') => {
        const b = button(parent, '', fn, cls); icon(b, name); b.setAttribute('aria-label', label); b.title = label; return b;
      };
      app.classList.toggle('af-compact', ctx.size.width < 1000);
      app.classList.toggle('af-tight', ctx.size.width < 850);
      let zoom = 0.85;
      const top = el('div', 'af-top', app);
      icon(el('div', 'af-logo', top), 'branch');
      const title = el('div', 'af-title', top);
      el('strong', '', title, s.title); el('span', 'af-sub', title, `Relayboard / Workflows · Owner: ${s.owner}`);
      el('span', 'af-badge', top, 'Draft');
      const versions = button(top, 'v12', () => showPopover('Version history', ['Draft · Unpublished changes', 'v12 · Published by ' + s.owner, 'v11 · Added retry handling', 'v10 · Updated customer mapping']), 'af-optional'); icon(versions, 'history');
      iconButton(top, 'Notifications: 3 unread', 'bell', () => showPopover('Notifications · 3 unread', ['Workspace invitation accepted', 'Mail connection expires in 7 days', 'Production v12 published successfully']));
      button(top, 'Publish', () => showPopover('Publish workflow', ['Your changes are saved as a draft.', 'Production publishing is restricted to workspace administrators. Request a review before release.']), 'af-primary');
      const bar = el('div', 'af-toolbar', app);
      const tabs = el('div', 'af-tabs', bar);
      const editorTab=button(tabs, 'Editor', () => { executions.style.height=''; editorTab.classList.add('active'); runsTab.classList.remove('active'); paint(ctx.model); }, 'af-tab active');
      const runsTab=button(tabs, 'Runs', () => { executions.style.height='180px'; runsTab.classList.add('active'); editorTab.classList.remove('active'); runList.scrollTop=0; paint(ctx.model); }, 'af-tab');
      iconButton(bar, 'Zoom out', 'minus', () => setZoom(zoom - .1));
      const zoomLabel = el('span', 'af-muted', bar, '85%');
      iconButton(bar, 'Zoom in', 'plus', () => setZoom(zoom + .1));
      iconButton(bar, 'Reset view', 'fit', () => { zoom=.85; commit({ ...ctx.model, pan:[0,0] }); });
      const undo = button(bar, 'Undo', () => {
        const m = ctx.model, history = m.history.slice(), prev = history.pop();
        if (prev) commit({ ...m, ...prev, history, selected: null, panel: null, menu: null });
      });
      icon(undo, 'undo');
      const del = iconButton(bar, 'Delete selected', 'trash', removeSelected);
      const test = button(bar, 'Test', () => showPopover('Test run queued', ['Waiting for a sample webhook request.', 'The published workflow is unaffected by a test run.']), 'af-primary'); icon(test, 'play');
      const body = el('div', 'af-body', app);
      const palette = el('aside', 'af-palette', body);
      const nav = el('div', 'af-worknav', palette);
      el('strong', '', nav, 'Operations workspace');
      for (const [name, count, glyph] of [['Workflows','24','branch'], ['Credentials','8','lock'], ['Execution log','248','history']]) {
        const row = el('div', 'af-navitem' + (name==='Workflows'?' active':''), nav); icon(row,glyph); el('span','',row,name); el('small','',row,count);
        row.addEventListener('click', () => showPopover(name, name==='Workflows' ? ['Customer intake · Current', 'Invoice reminders · Published', 'Partner handoff · Draft', 'Support triage · Published'] : ['Production workspace', 'Access is managed by your workspace administrator.']));
      }
      for(const project of ['Finance operations','Customer care']) { const row=el('div','af-navitem',nav); icon(row,'folder'); el('span','',row,project); row.addEventListener('click',()=>showPopover(project,['Invoice follow-up · Published','Partner handoff · Draft','Daily reconciliation · Published'])); }
      el('h3', '', palette, 'Add a step');
      const search = el('input', 'af-search', palette); search.placeholder = 'Find a step...'; search.setAttribute('aria-label', 'Find a step');
      const list = el('div', 'af-list', palette); el('div', 'af-category', list, 'Core components');
      const paletteEls = {};
      for (const [i, type] of F.helpers.TYPES.entries()) {
        const tile = el('div', 'af-component', list); tile.setAttribute('role', 'button'); tile.setAttribute('aria-label', `Drag ${type} to canvas`);
        icon(el('span', 'af-symbol', tile), ICONS[i]); el('span', '', tile, type); paletteEls[type] = tile;
        env.ui.track(tile, {
          start(p, e) { e.stopPropagation(); tile.style.opacity = '.55'; },
          end(p) {
            tile.style.opacity = '';
            const r = canvas.getBoundingClientRect();
            if (p.x < r.left + 8 || p.x > r.right - 8 || p.y < r.top + 8 || p.y > r.bottom - 8) return;
            const m = ctx.model, id = m.nodes.some((n) => n.id === 'added') ? `extra${m.nodes.length}` : 'added';
            const node = { id, label: type, type, x: Math.round((p.x - r.left) / zoom - m.pan[0]), y: Math.round((p.y - r.top) / zoom - m.pan[1]) };
            mutate({ ...m, nodes: [...m.nodes, node], settings: { ...m.settings, [id]: { destination: '', operation: 'Create', retries: '0', timeout: '30' } }, selected: { node: id } });
            ctx.log('node-add', { id, type });
          },
        }, 'flow-palette');
      }
      search.addEventListener('input', () => { for (const [type, tile] of Object.entries(paletteEls)) tile.hidden = !type.toLowerCase().includes(search.value.toLowerCase()); });
      el('div', 'af-muted', palette, 'Drag a component onto the canvas.');
      const workspace = el('div', 'af-workspace', body);
      const canvas = el('div', 'af-canvas', workspace); canvas.setAttribute('aria-label', 'Workflow canvas');
      const world = el('div', 'af-world', canvas);
      const svg = util.svg('svg', { class: 'af-svg' }, world);
      const defs = util.svg('defs', {}, svg);
      const arrow = util.svg('marker', { id: 'af-arrow', viewBox: '0 0 10 10', refX: 13, refY: 5, markerWidth: 5, markerHeight: 5, orient: 'auto' }, defs);
      util.svg('path', { d: 'M0 1 L9 5 L0 9 Z', fill: 'var(--muted)' }, arrow);
      const wires = util.svg('g', {}, svg);
      const rubber = util.svg('path', { class: 'af-preview', visibility: 'hidden' }, svg);
      const nodeLayer = el('div', '', world);
      el('div', 'af-hint', canvas, 'Drag empty canvas to pan · Drag ports to connect');
      const references = el('div','af-reference',world);
      const note=el('div','af-sticky',references); el('strong','',note,'Operations note');
      el('span','',note,'Check mappings before publishing.');
      el('div','af-refcap',references,'Reference branch / read-only');
      const referenceNodes = [{x:260,y:282,label:'Manual review',type:'Filter'}, {x:480,y:282,label:'Audit log',type:'Create record'}, {x:480,y:406,label:'Legacy export',type:'Disabled'}];
      for(const n of referenceNodes) {
        const card=el('div','af-node' + (n.type==='Disabled'?' disabled':''),references); card.style.left=n.x+'px'; card.style.top=n.y+'px';
        const h=el('div','af-nodehead',card); icon(el('span','af-symbol',h), n.type==='Filter'?'filter':'record'); el('span','',h,n.label);
        el('div','af-nodefoot',card,n.type); el('span','af-port-static in',card); el('span','af-port-static out',card);
        card.addEventListener('click', () => showPopover(n.label,['Read-only reference step',n.type==='Disabled'?'Disabled in this draft. No executions are scheduled.':'Maintained by the operations workspace.']));
      }
      const executions=el('section','af-executions',workspace);
      const runs=el('div','af-runs',executions), runHead=el('div','af-runhead',runs);
      icon(runHead,'history'); el('strong','',runHead,'Recent executions'); el('span','',runHead,'Last 24 hours');
      const runList=el('div','af-runlist',runs);
      for(const [id,status,ago,duration] of [['#4829','Succeeded','2 min ago','1.24 s'],['#4828','Succeeded','8 min ago','0.91 s'],['#4827','Error','14 min ago','3.02 s'],['#4826','Succeeded','21 min ago','1.18 s'],['#4825','Stopped','36 min ago','0.42 s'],['#4824','Succeeded','1 hr ago','1.06 s']]) {
        const row=el('div','af-runrow',runList); el('span','',row,id); el('span',status==='Error'?'af-bad':'af-good',row,status); el('span','',row,ago); el('span','',row,duration);
        row.addEventListener('click',()=>showPopover('Execution '+id,[status+' · '+duration,'Source: production v12',status==='Error'?'Mail service: connection expired. Reconnect the account to retry.':'Processed 1 item. No retries needed.']));
      }
      const mapBox=el('div','af-map',executions), mapLabel=el('div','af-maplabel',mapBox); el('span','',mapLabel,'Canvas overview'); el('span','',mapLabel,'Live');
      const minimap=util.svg('svg',{class:'af-minimap',viewBox:'0 0 132 72','aria-label':'Workflow minimap'},mapBox);
      const overview=el('aside','af-overview',body); el('div','af-overviewhead',overview,'Step inspector');
      const overviewBody=el('div','af-overviewbody',overview);
      const overviewTitle=el('strong','',overviewBody), overviewProperties=el('div','',overviewBody);
      button(overviewBody,'Edit parameters',()=>openPanel(ctx.model.selected?.node || ctx.model.nodes[0]?.id));
      const sampleCap=el('div','af-category',overviewBody,'Last execution output');
      el('div','af-json',overviewBody,'{\n  "event": "order.created",\n  "items": 1,\n  "source": "production"\n}');
      const activity=el('div','af-activity',overviewBody); el('strong','',activity,'Activity');
      el('p','',activity,s.owner+' edited this draft'); el('p','',activity,'Version 12 published · 2 days ago'); el('p','',activity,'Mail connection needs review');
      const panel = el('aside', 'af-panel', body); panel.hidden = true;
      const ph = el('div', 'af-panelhead', panel), panelTitle = el('strong', '', ph);
      const close = button(ph, '', () => commit({ ...ctx.model, panel: null }), ''); close.setAttribute('aria-label', 'Close node settings'); icon(close, 'close');
      const fields = el('div', 'af-fields', panel), fieldEls = {};
      el('div', 'af-category', fields, 'Parameters');
      for (const f of s.fields) {
        const label = el('label', 'af-field', fields, f.label);
        const input = el('input', '', label); input.type = f.kind; input.setAttribute('aria-label', f.label);
        if (f.kind === 'number') { input.min = '0'; input.step = '1'; }
        input.addEventListener('input', () => ctx.update({ ...ctx.model, draft: { ...ctx.model.draft, [f.key]: input.value } }));
        fieldEls[f.key] = input;
      }
      el('p', 'af-muted', fields, 'Values are applied to this step only. Connections and other steps are preserved.');
      const pb = el('div', 'af-panelbottom', panel);
      const save = button(pb, 'Apply node settings', () => {
        const m = ctx.model;
        if (m.panel) mutate({ ...m, settings: { ...m.settings, [m.panel]: { ...m.draft } } });
      }, 'af-primary');
      const menu = el('div', 'af-menu', body); menu.hidden = true; menu.setAttribute('role', 'menu');
      button(menu, 'Open settings', () => openPanel(ctx.model.menu));
      const menuDelete = button(menu, 'Delete node', () => removeNode(ctx.model.menu), 'af-danger');
      const footer = el('div', 'af-footer', app);
      const nodeCount = el('span', '', footer), edgeCount = el('span', '', footer), configCount = el('span', '', footer);
      const savedStatus=el('span', 'af-status', footer); icon(savedStatus,'check'); el('span','',savedStatus,'All changes saved / Workflow status: Draft');
      const popover=el('div','af-popover',app); popover.hidden=true;
      function showPopover(title, lines) { popover.replaceChildren(); el('strong','',popover,title); for(const line of lines) el('p','',popover,line); button(popover,'Close',()=>{popover.hidden=true;}); popover.hidden=false; }
      function setZoom(value) { zoom=Math.max(.6,Math.min(1.4,Math.round(value*100)/100)); paint(ctx.model); }
      let nodes = {}, ports = {}, edgeEls = {}, panelId = null, moved = false;
      const point = (n, kind) => { const p = F.helpers.port(n, kind); return [p[0] + ctx.model.pan[0], p[1] + ctx.model.pan[1]]; };
      const curve = (a, b) => {
        const k = Math.max(38, Math.min(90, Math.abs(b[0] - a[0]) / 2));
        return `M${a[0]},${a[1]} C${a[0] + k},${a[1]} ${b[0] - k},${b[1]} ${b[0]},${b[1]}`;
      };
      function commit(m) { ctx.update(m); paint(ctx.model); }
      function mutate(m) {
        const p = ctx.model;
        const history = [...p.history.slice(-23), { nodes: env.util.clone(p.nodes), edges: env.util.clone(p.edges), settings: env.util.clone(p.settings) }];
        commit({ ...m, history });
      }
      function openPanel(id) {
        if (!id) return;
        commit({ ...ctx.model, panel: id, menu: null, selected: { node: id }, draft: { ...ctx.model.settings[id] } });
      }
      function removeNode(id) {
        if (!id) return;
        const m = ctx.model, settings = { ...m.settings }; delete settings[id];
        mutate({ ...m, nodes: m.nodes.filter((n) => n.id !== id), edges: m.edges.filter((e) => !e.includes(id)), settings, selected: null, menu: null, panel: null });
      }
      function removeSelected() {
        const m = ctx.model;
        if (m.selected?.node) removeNode(m.selected.node);
        else if (m.selected?.edge) mutate({ ...m, edges: m.edges.filter((e) => F.helpers.edgeKey(e) !== F.helpers.edgeKey(m.selected.edge)), selected: null });
      }
      function portGesture(target, id, kind, edgeRef = null) {
        let from, old;
        env.ui.track(target, {
          start(p, e) {
            e.stopPropagation(); old = null;
            if (kind === 'out') from = id;
            else {
              const incoming = ctx.model.edges.filter((e) => e[1] === id);
              old = edgeRef || incoming.find((e) => ctx.model.selected?.edge && F.helpers.edgeKey(e) === F.helpers.edgeKey(ctx.model.selected.edge)) || incoming[0];
              if (!old) return false; from = old[0];
            }
            rubber.setAttribute('visibility', 'visible');
          },
          move(p) {
            const n = ctx.model.nodes.find((n) => n.id === from), r = canvas.getBoundingClientRect();
            rubber.setAttribute('d', curve(point(n, 'out'), [(p.x - r.left)/zoom, (p.y - r.top)/zoom]));
          },
          end(p) {
            rubber.setAttribute('visibility', 'hidden');
            const hit = document.elementsFromPoint(p.x, p.y).find((el) => el.dataset?.flowPort === 'in');
            if (!hit || hit.dataset.node === from) return;
            const edge = [from, hit.dataset.node], m = ctx.model;
            const next = old ? m.edges.filter((e) => F.helpers.edgeKey(e) !== F.helpers.edgeKey(old)) : m.edges.slice();
            if (!next.some((e) => F.helpers.edgeKey(e) === F.helpers.edgeKey(edge))) next.push(edge);
            mutate({ ...m, edges: next, selected: { edge } }); ctx.log(old ? 'edge-reroute' : 'edge-add', { edge });
          },
        }, 'flow-port');
      }
      function buildNode(n) {
        const card = el('div', 'af-node', nodeLayer); card.setAttribute('aria-label', n.label); card.dataset.node = n.id;
        const head = el('div', 'af-nodehead', card); icon(el('span', 'af-symbol', head), ICONS[F.helpers.TYPES.indexOf(n.type)] || 'code'); el('span', '', head, n.label);
        const foot = el('div', 'af-nodefoot', card); el('span', '', foot, n.type); icon(foot,'more');
        nodes[n.id] = card;
        for (const kind of ['in', 'out']) {
          const dot = el('button', `af-port ${kind}`, card); dot.type = 'button'; dot.title = `${n.label} · ${kind === 'out' ? 'Output' : 'Input'}`;
          dot.setAttribute('aria-label', dot.title); dot.dataset.flowPort = kind; dot.dataset.node = n.id;
          ports[`${n.id}:${kind}`] = dot; portGesture(dot, n.id, kind);
        }
        let start;
        env.ui.track(card, {
          start(p, e) { if (e.target.closest('.af-port')) return false; e.stopPropagation(); start = { ...ctx.model.nodes.find((v) => v.id === n.id) }; moved = false; },
          move(p) {
            if (Math.hypot(p.dx, p.dy) < 4 && !moved) return;
            moved = true;
            commit({ ...ctx.model, nodes: ctx.model.nodes.map((v) => v.id === n.id ? { ...v, x: Math.round(start.x + p.dx/zoom), y: Math.round(start.y + p.dy/zoom) } : v) });
          }, end() {},
        }, 'flow-node');
        card.addEventListener('click', (e) => { if (!e.target.closest('.af-port') && !moved) openPanel(n.id); });
        card.addEventListener('contextmenu', (e) => {
          e.preventDefault(); e.stopPropagation();
          const r = body.getBoundingClientRect();
          menu.style.left = Math.min(Math.max(0, e.clientX - r.left), body.clientWidth - 180) + 'px';
          menu.style.top = Math.min(Math.max(0, e.clientY - r.top), body.clientHeight - 92) + 'px';
          commit({ ...ctx.model, menu: n.id, selected: { node: n.id }, panel: null });
        });
      }
      function paint(m) {
        const rect=canvas.getBoundingClientRect(); world.style.width=(rect.width/zoom)+'px'; world.style.height=(rect.height/zoom)+'px';
        world.style.transform=`scale(${zoom})`; references.style.transform=`translate(${m.pan[0]}px,${m.pan[1]}px)`;
        zoomLabel.textContent=Math.round(zoom*100)+'%';
        for (const [id, card] of Object.entries(nodes)) if (!m.nodes.some((n) => n.id === id)) { card.remove(); delete nodes[id]; }
        for (const n of m.nodes) {
          if (!nodes[n.id]) buildNode(n);
          const card = nodes[n.id]; card.style.left = `${n.x + m.pan[0]}px`; card.style.top = `${n.y + m.pan[1]}px`;
          card.classList.toggle('on', m.selected?.node === n.id);
        }
        canvas.style.backgroundPosition = `${m.pan[0]*zoom}px ${m.pan[1]*zoom}px`; canvas.style.backgroundSize=`${18*zoom}px ${18*zoom}px`;
        wires.replaceChildren(); edgeEls = {};
        for (const edge of m.edges) {
          const a = m.nodes.find((n) => n.id === edge[0]), b = m.nodes.find((n) => n.id === edge[1]);
          if (!a || !b) continue;
          const start = point(a, 'out'), end = point(b, 'in'), selected = m.selected?.edge && F.helpers.edgeKey(m.selected.edge) === F.helpers.edgeKey(edge);
          const group = util.svg('g', { class: `af-wire${selected ? ' on' : ''}` }, wires);
          const backward = end[0] <= start[0];
          const lane=Math.min(a.y,b.y)+m.pan[1]-26;
          const d=backward ? `M${start[0]},${start[1]} C${start[0]+26},${start[1]} ${start[0]+26},${lane} ${start[0]+26},${lane} L${end[0]-26},${lane} C${end[0]-26},${lane} ${end[0]-26},${end[1]} ${end[0]},${end[1]}` : curve(start,end);
          util.svg('path', { class: 'af-edge', d, 'marker-end': 'url(#af-arrow)' }, group);
          const hit = util.svg('path', { class: 'af-hit', d }, group);
          hit.addEventListener('click', (e) => { e.stopPropagation(); commit({ ...ctx.model, selected: { edge }, panel: null, menu: null }); });
          if (selected) {
            const handle = util.svg('circle', { class: 'af-end', cx: end[0] - 11, cy: end[1], r: 5 }, group);
            portGesture(handle, edge[1], 'in', edge);
          }
          const mid=hit.getPointAtLength(hit.getTotalLength()/2);
          edgeEls[F.helpers.edgeKey(edge)] = { mid: [mid.x,mid.y] };
        }
        for(const [from,to] of [[0,1],[0,2]]) {
          const a=referenceNodes[from],b=referenceNodes[to];
          util.svg('path',{d:curve([a.x+148+m.pan[0],a.y+38+m.pan[1]],[b.x+m.pan[0],b.y+38+m.pan[1]]),class:'af-edge','stroke-dasharray':'4 4','marker-end':'url(#af-arrow)'},wires);
        }
        minimap.replaceChildren();
        const all=[...m.nodes,...referenceNodes], maxX=Math.max(...all.map(n=>n.x+160),1000), maxY=Math.max(420,...all.map(n=>n.y+90)), k=Math.min(124/maxX,64/maxY);
        for(const edge of m.edges) { const a=m.nodes.find(n=>n.id===edge[0]),b=m.nodes.find(n=>n.id===edge[1]); if(a&&b) util.svg('path',{d:`M${4+(a.x+148)*k},${4+(a.y+38)*k} L${4+b.x*k},${4+(b.y+38)*k}`,class:'af-mapedge'},minimap); }
        for(const n of all) util.svg('rect',{x:4+n.x*k,y:4+n.y*k,width:148*k,height:76*k,rx:1,fill:n.type==='Disabled'?'var(--line)':'var(--accent)',opacity:'.65'},minimap);
        util.svg('rect',{x:4-m.pan[0]*k,y:4-m.pan[1]*k,width:rect.width/zoom*k,height:rect.height/zoom*k,fill:'none',stroke:'var(--accent)','stroke-width':1},minimap);
        const selected=m.nodes.find(n=>n.id===m.selected?.node)||m.nodes[0];
        overviewTitle.textContent=selected?.label||'No step selected'; overviewProperties.replaceChildren();
        if(selected) for(const [key,value] of [['Component',selected.type],['Destination',m.settings[selected.id]?.destination||'Not configured'],['Operation',m.settings[selected.id]?.operation||'Create']]) {
          const prop=el('div','af-property',overviewProperties,key); el('b','',prop,value);
        }
        panel.hidden = !m.panel;
        if (m.panel) {
          panelTitle.textContent = m.nodes.find((n) => n.id === m.panel)?.label || 'Node settings';
          for (const f of s.fields) if (panelId !== m.panel || document.activeElement !== fieldEls[f.key]) fieldEls[f.key].value = m.draft[f.key] || '';
        }
        panelId = m.panel; menu.hidden = !m.menu; del.disabled = !m.selected; undo.disabled = !m.history.length;
        nodeCount.textContent = `Nodes: ${m.nodes.length}`; edgeCount.textContent = `Connections: ${m.edges.length}`;
        configCount.textContent = `Configured nodes: ${F.helpers.configuredCount(m)}`;
        measure();
      }
      function measure() {
        const r = canvas.getBoundingClientRect(), pr = list.getBoundingClientRect(), fr = fields.getBoundingClientRect();
        const paletteTop = {}, fieldTop = {};
        const visible = (items, rect, positions) => Object.entries(items).filter(([key, item]) => {
          const q = item.getBoundingClientRect(); positions[key] = q.top - rect.top;
          return q.height > 0 && q.top >= rect.top && q.bottom <= rect.bottom;
        }).map(([key]) => key);
        ctx.update({ ...ctx.model, view: { w: r.width/zoom, h: r.height/zoom, zoom, edgePoints:Object.fromEntries(Object.entries(edgeEls).map(([key,v])=>[key,[v.mid[0]-ctx.model.pan[0],v.mid[1]-ctx.model.pan[1]]])), palette: visible(paletteEls, pr, paletteTop), paletteTop,
          fields: visible(fieldEls, fr, fieldTop), fieldTop } });
      }
      list.addEventListener('scroll', measure); fields.addEventListener('scroll', measure);
      let startPan;
      env.ui.track(canvas, {
        start(p, e) {
          if (e.target.closest('.af-node') || e.target.closest('.af-wire') || e.target.closest('.af-sticky')) return false;
          startPan = ctx.model.pan.slice(); return true;
        },
        move(p) { commit({ ...ctx.model, pan: [Math.round(startPan[0] + p.dx/zoom), Math.round(startPan[1] + p.dy/zoom)], menu: null }); },
        end(p) { if (Math.hypot(p.dx, p.dy) < 3) commit({ ...ctx.model, selected: null, panel: null, menu: null }); },
      }, 'flow-canvas-pan');
      app.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); removeSelected(); }
        if (e.key === 'Escape') commit({ ...ctx.model, panel: null, menu: null });
      });
      minimap.addEventListener('click',e=>{
        const r=minimap.getBoundingClientRect(), all=[...ctx.model.nodes,...referenceNodes];
        const k=Math.min(124/Math.max(...all.map(n=>n.x+160),1000),64/Math.max(420,...all.map(n=>n.y+90)));
        const x=((e.clientX-r.left)/r.width*132-4)/k,y=((e.clientY-r.top)/r.height*72-4)/k;
        commit({...ctx.model,pan:[Math.round(canvas.clientWidth/zoom/2-x),Math.round(canvas.clientHeight/zoom/2-y)]});
      });
      const r = canvas.getBoundingClientRect();
      ctx.update({ ...ctx.model, view: { w: r.width, h: r.height } });
      paint(ctx.model);
      live = { ctx, canvas, list, fields, nodes, ports, paletteEls, fieldEls, controls: { delete: del, menuDelete, save, close, undo }, getEdges: () => edgeEls };
      return { anchors: [app], sync: paint };
    },
    locate(t) {
      const L = live, m = L.ctx.model, r = L.canvas.getBoundingClientRect(), z=m.view.zoom||1;
      if (t.port) return env.util.center(L.ports[`${t.port[0]}:${t.port[1]}`]);
      if (t.edgeEnd) return env.util.center(L.ports[`${t.edgeEnd[1]}:in`]);
      if (t.node) {
        const n = m.nodes.find((n) => n.id === t.node); return [r.left + (n.x + m.pan[0] + 74)*z, r.top + (n.y + m.pan[1] + 22)*z];
      }
      if (t.world) return [r.left + (t.world[0] + m.pan[0])*z, r.top + (t.world[1] + m.pan[1])*z];
      if (t.pane) return env.util.center(t.pane === 'palette' ? L.list : L.fields);
      if (t.palette) return env.util.center(L.paletteEls[t.palette]);
      if (t.field) return env.util.center(L.fieldEls[t.field]);
      if (t.control) return env.util.center(L.controls[t.control]);
      if (t.edge) { const p = L.getEdges()[env.taskDef.helpers.edgeKey(t.edge)].mid; return [r.left + p[0]*z, r.top + p[1]*z]; }
      if (t.pan) {
        // Read-only search for an empty patch where the entire pan drag stays inside the canvas.
        const sx = (t.sx || 0)*z, sy = (t.sy || 0)*z;
        const loX = 16 + Math.max(0, -sx), hiX = r.width - 16 - Math.max(0, sx);
        const loY = 16 + Math.max(0, -sy), hiY = r.height - 16 - Math.max(0, sy);
        for (const fy of [.8, .2, .5, .95, .05]) for (const fx of [.5, .2, .8, .05, .95]) {
          const x = r.left + loX + (hiX - loX) * fx, y = r.top + loY + (hiY - loY) * fy;
          const hit = document.elementFromPoint(x, y);
          if (hit && L.canvas.contains(hit) && !hit.closest('.af-node') && !hit.closest('.af-wire') && !hit.closest('.af-sticky')) return [x + (t.dx || 0)*z, y + (t.dy || 0)*z];
        }
        throw new Error('use-workflow-editor: no empty canvas patch for panning');
      }
      throw new Error(`use-workflow-editor: unknown target ${JSON.stringify(t)}`);
    },
  });
})();
