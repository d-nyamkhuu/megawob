/*
 * use-workflow-editor/editor: Relayboard workflow editor, shared by configure, connect, place, remove and reroute.
 * With design: {}, defaults reproduce these pilots exactly (no scenario presets):
 *   configure: design-use-workflow-editor-configure-01; connect: design-use-workflow-editor-connect-01;
 *   place: design-use-workflow-editor-place-01; remove: design-use-workflow-editor-remove-01; reroute: design-use-workflow-editor-reroute-01.
 * No rng draws in the base widget. Extra decoration randomness must use ctx.rng.fork(label).
 * All state is per factory; S.ctx/spec/model and S.els read the current episode, S.D/P the resolved design.
 * S.els shell properties are writable for replacement panels; S.zoom is writable for replacement zoom controls.
 * Node geometry is fixed by task.port (148 x 76 world px); only the editor shell is an anchor.
 * Tokens (defaults):
 *   brand = 'Relayboard': editor brand and accessible name.
 *   workspaceTitle = 'Operations workspace': navigation heading.
 *   paletteTitle = 'Add a step': palette heading.
 *   searchPlaceholder = 'Find a step...': palette search placeholder.
 *   categoryLabel = 'Core components': component category heading.
 *   paletteHint = 'Drag a component onto the canvas.': palette drag instruction.
 *   canvasHint = 'Drag empty canvas to pan · Drag ports to connect': canvas gesture instruction.
 *   noteTitle = 'Operations note': sticky-note heading.
 *   noteText = 'Check mappings before publishing.': sticky-note text.
 *   referenceTitle = 'Reference branch / read-only': read-only branch caption.
 *   executionsTitle = 'Recent executions': execution list heading.
 *   inspectorTitle = 'Step inspector': overview heading.
 *   savedText = 'All changes saved / Workflow status: Draft': footer status.
 *   fontFamily = 'Arial,system-ui,sans-serif': editor font stack.
 *   frameInset = 10: stage inset in px.
 *   frameRadius = 7: editor corner radius in px.
 *   paletteWidth = 159: palette width in px.
 *   tightPaletteWidth = 145: palette width below tightWidth, in px.
 *   overviewWidth = 210: overview width in px.
 *   panelWidth = 256: settings panel width in px.
 *   compactWidth = 1000: stage-width breakpoint hiding overview.
 *   tightWidth = 850: stage-width breakpoint narrowing palette.
 *   initialZoom = .85: initial/reset world scale.
 *   gridSize = 18: canvas dot spacing in world px.
 *   dangerColor = '#d44d60': delete action color.
 *   successColor = '#38966b': successful execution color.
 *   errorColor = '#ce6470': failed execution color.
 *   noteBorderColor = '#c49a32': sticky-note border tint.
 *   noteColor = '#d6b14e': sticky-note background tint.
 *   icons = ICONS: component icon names in task.TYPES order (ICONS).
 *   paths = PATHS: SVG path table (PATHS below; fallback grid).
 *   extraCSS = '': additional CSS appended after structural CSS.
 * Parts (calls go through P; overrides are (base, S) => replacement):
 *   styles(ctx) -> CSS: structural stylesheet with token values and optional extraCSS.
 *   el(tag, cls, parent, text) -> element: util.el.
 *   button(parent, text, fn, cls = '') -> button: label and click handler.
 *   icon(parent, name) -> SVG: path from D.paths, falling back to grid.
 *   iconButton(parent, label, name, fn, cls = '') -> button: accessible icon control.
 *   frame(ctx) -> app: fixed editor shell, responsive classes and initial zoom.
 *   top(ctx): brand/title, history, notifications and publish controls.
 *   toolbar(ctx): tabs, zoom, undo, delete and test controls; calls P.body.
 *   body(ctx, app) -> element: flex row containing palette, workspace and overview.
 *   palette(ctx): coordinate paletteFrame, component builders, gestures and search filtering.
 *   paletteFrame(ctx): palette panel, navigation, search and component list shell.
 *   navigation(ctx, palette): workspace links and their detail handlers.
 *   navigationRow(ctx, nav, name, glyph, count, active = false) -> row: icon, label and optional count.
 *   bindComponent(ctx, tile, type): attach component drag-to-canvas behavior.
 *   component(ctx, list, type, i) -> tile: component icon and label, without drag handlers.
 *   canvas(ctx): workspace, world, wire SVG, preview, node layer and gesture hint.
 *   references(ctx): read-only branch, sticky note and reference cards.
 *   referenceNode(ctx, references, n) -> card: read-only node and static ports.
 *   executions(ctx): recent runs and minimap shell.
 *   runRow(ctx, runList, id, status, ago, duration) -> row: execution cells.
 *   overview(ctx): step inspector, sample JSON and activity.
 *   property(ctx, parent, key, value) -> row: selected-step property.
 *   inspector(ctx): editable settings panel; attaches field/save/close handlers.
 *   field(ctx, fields, f) -> input: labelled text/number control, without input handler.
 *   menu(ctx): settings/delete context menu.
 *   footer(ctx): counts and saved status.
 *   popover(ctx): hidden contextual detail shell.
 *   showPopover(title, lines): detail content and close button.
 *   node(ctx, nodeLayer, n) -> card: node heading and footer, without behavior or ports.
 *   port(ctx, card, n, kind) -> button: 10px accessible port, without gesture handler.
 *   wire(ctx, edge, a, b, start, end, selected) -> hit path: routed edge, selection and reconnection handle.
 *   edges(m): redraw live/reference wires and cache measured edge midpoints.
 *   minimap(m, rect): redraw minimap nodes, edges and viewport.
 *   point(n, kind) -> [x,y]: task port plus model pan.
 *   curve(a, b) -> path string: cubic edge route.
 *   setZoom(value): clamp zoom to .6..1.4 and repaint.
 *   commit(m): update model and repaint.
 *   mutate(m): save undo history and commit model.
 *   openPanel(id): select node and open its settings draft.
 *   removeNode(id): remove node, edges and settings with undo.
 *   removeSelected(): delete selected node or edge.
 *   portGesture(target, id, kind, edgeRef = null): attach connect/reroute gestures.
 *   buildNode(n): build node/ports through P, attach drag/settings/context-menu behavior.
 *   paint(m): sync world, nodes, panels, controls and counts; call P.edges/minimap/measure.
 *   measure(): mirror viewport, visible rows/fields and edge hit points to unscored model.view.
 *   bind(ctx): attach scroll, pan, keyboard and minimap interactions.
 *   finish(ctx) -> {anchors, sync}: initialize view, paint, expose oracle state and call P.rendered.
 *   locate(target) -> [x,y]: read-only model/DOM target lookup; throw for unknown targets.
 *   nodeDecorated(ctx, card, n): decoration hook after node gestures (noop).
 *   componentDecorated(ctx, tile, type, i): decoration hook after palette gestures (noop).
 *   painted(ctx, m): decoration hook after paint and measurement (noop).
 *   rendered(ctx): decoration hook after initial paint/oracle state (noop).
 */
(function () {
  'use strict';
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

  const TOKENS = {
    brand: 'Relayboard',
    workspaceTitle: 'Operations workspace',
    paletteTitle: 'Add a step',
    searchPlaceholder: 'Find a step...',
    categoryLabel: 'Core components',
    paletteHint: 'Drag a component onto the canvas.',
    canvasHint: 'Drag empty canvas to pan · Drag ports to connect',
    noteTitle: 'Operations note',
    noteText: 'Check mappings before publishing.',
    referenceTitle: 'Reference branch / read-only',
    executionsTitle: 'Recent executions',
    inspectorTitle: 'Step inspector',
    savedText: 'All changes saved / Workflow status: Draft',
    fontFamily: 'Arial,system-ui,sans-serif',
    frameInset: 10,
    frameRadius: 7,
    paletteWidth: 159,
    tightPaletteWidth: 145,
    overviewWidth: 210,
    panelWidth: 256,
    compactWidth: 1000,
    tightWidth: 850,
    initialZoom: .85,
    gridSize: 18,
    dangerColor: '#d44d60',
    successColor: '#38966b',
    errorColor: '#ce6470',
    noteBorderColor: '#c49a32',
    noteColor: '#d6b14e',
    icons: ICONS,
    paths: PATHS,
    extraCSS: '',
  };

  // Each installer adds parts in their original order; state belongs to one template instance.
  function installStyles(BASE, state) {
    BASE.styles = (ctx) => `
  .af-app { position:absolute; inset:${state.D.frameInset}px; display:flex; flex-direction:column; min-width:0; overflow:hidden;
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
    background-image:radial-gradient(var(--line) 1px, transparent 1px); background-size:${state.D.gridSize}px ${state.D.gridSize}px; }
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
  .af-menu button { display:block; width:100%; padding:8px; text-align:left; border:0; background:transparent; cursor:pointer; }.af-menu button:hover { background:var(--bg); }.af-danger { color:${state.D.dangerColor}!important; }

  .af-app { border-radius:${state.D.frameRadius}px; font-family:${state.D.fontFamily}; }
  .af-app svg.af-icon { width:16px; height:16px; flex:none; vertical-align:middle; }
  .af-top { height:53px; gap:8px; }.af-sub { display:block; margin-top:4px; font-size:10px; }
  .af-top .af-btn { display:flex; align-items:center; gap:5px; white-space:nowrap; }
  .af-btn { display:inline-flex; align-items:center; justify-content:center; gap:5px; }
  .af-toolbar { height:36px; }.af-tab { border:0; background:none; padding:6px; color:var(--muted); font:inherit; cursor:pointer; }
  .af-tab.active { color:var(--accent); border-bottom:2px solid var(--accent); font-weight:700; }
  .af-workspace { display:flex; flex-direction:column; flex:1; min-width:0; min-height:0; }
  .af-palette { flex-basis:${state.D.paletteWidth}px; width:${state.D.paletteWidth}px; padding:0; background:color-mix(in srgb,var(--bg) 60%,var(--panel)); }
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
  .af-sticky { position:absolute; left:38px; top:266px; width:164px; min-height:62px; padding:9px; border:1px solid color-mix(in srgb,${state.D.noteBorderColor} 45%,var(--line)); border-radius:3px;
    background:color-mix(in srgb,${state.D.noteColor} 15%,var(--panel)); color:var(--fg); font-size:10px; line-height:1.45; }
  .af-sticky strong { display:block; margin-bottom:3px; }.af-refcap { position:absolute; top:259px; left:260px; width:260px; white-space:nowrap; font-size:10px; color:var(--muted); }
  .af-overview { width:${state.D.overviewWidth}px; flex:none; border-left:1px solid var(--line); display:flex; flex-direction:column; background:var(--panel); }
  .af-overviewhead { padding:11px; border-bottom:1px solid var(--line); font-size:11px; font-weight:700; }
  .af-overviewbody { padding:10px 12px; overflow:auto; min-height:0; font-size:10px; flex:1; }
  .af-property { margin:12px 0; color:var(--muted); }.af-property b { display:block; margin-top:4px; color:var(--fg); font-weight:500; overflow-wrap:anywhere; }
  .af-json { padding:9px; background:var(--bg); border:1px solid var(--line); border-radius:4px; font:10px/1.65 monospace; white-space:pre-wrap; color:var(--muted); }
  .af-activity { margin-top:13px; padding-top:10px; border-top:1px solid var(--line); }.af-activity p { margin:9px 0; color:var(--muted); }
  .af-executions { height:113px; flex:none; border-top:1px solid var(--line); display:flex; min-width:0; background:var(--panel); }
  .af-runs { flex:1; min-width:0; display:flex; flex-direction:column; }.af-runhead { display:flex; align-items:center; gap:7px; padding:7px 10px; font-size:10px; border-bottom:1px solid var(--line); }
  .af-runhead span { margin-left:auto; color:var(--muted); }.af-runlist { overflow:auto; flex:1; }.af-runrow { display:grid; grid-template-columns:63px 1fr 63px 52px; gap:6px; padding:5px 10px; border-bottom:1px solid color-mix(in srgb,var(--line) 50%,transparent); font-size:10px; color:var(--muted); cursor:pointer; }
  .af-good { color:${state.D.successColor}; }.af-bad { color:${state.D.errorColor}; }.af-runrow:hover { background:var(--bg); }
  .af-map { width:148px; flex:none; padding:7px; border-left:1px solid var(--line); }.af-maplabel { display:flex; justify-content:space-between; color:var(--muted); font-size:9px; margin-bottom:5px; }
  .af-minimap { width:132px; height:72px; background:var(--bg); border:1px solid var(--line); cursor:crosshair; }.af-mapedge { stroke:var(--muted); stroke-width:1; fill:none; }
  .af-panel { width:${state.D.panelWidth}px; }.af-fields { padding:10px 13px; }.af-field { margin-bottom:11px; }.af-panelhead { padding:9px 12px; }.af-panelbottom { padding:9px 12px; }
  .af-footer { font-size:9px; min-height:26px; gap:10px; padding:5px 10px; }.af-footer .af-status { display:flex; align-items:center; gap:4px; }
  .af-popover { position:absolute; top:51px; right:10px; width:262px; z-index:20; background:var(--panel); border:1px solid var(--line); border-radius:6px; box-shadow:0 10px 30px #0003; padding:13px; font-size:11px; }
  .af-popover[hidden] { display:none; }.af-popover p { margin:10px 0; color:var(--muted); line-height:1.5; }.af-popover button { margin-top:6px; }
  .af-compact .af-overview { display:none; }.af-compact .af-executions { height:96px; }.af-compact .af-map { width:125px; }.af-compact .af-minimap { width:109px; height:58px; }
  .af-tight .af-top .af-optional { display:none; }.af-tight .af-palette { flex-basis:${state.D.tightPaletteWidth}px; width:${state.D.tightPaletteWidth}px; }.af-tight .af-toolbar .af-muted { display:none; }
  ` + state.D.extraCSS;
    BASE.body = (ctx, app) => state.P.el('div', 'af-body', app);
    BASE.nodeDecorated = () => {};
    BASE.componentDecorated = () => {};
    BASE.painted = () => {};
    BASE.rendered = () => {};
  }

  function installInteractions(BASE, state) {
    BASE.el = (tag, cls, parent, text) => state.util.el(tag, cls, parent, text);

    BASE.button = (parent, text, fn, cls = '') => {
      const b = state.P.el('button', `af-btn ${cls}`, parent, text); b.type = 'button'; b.addEventListener('click', fn); return b;
    };

    BASE.icon = (parent, name) => {
      const svg = state.util.svg('svg', { class: 'af-icon', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':1.7, 'stroke-linecap':'round', 'stroke-linejoin':'round', 'aria-hidden':'true' }, parent);
      state.util.svg('path', { d: state.D.paths[name] || state.D.paths.grid }, svg); return svg;
    };

    BASE.iconButton = (parent, label, name, fn, cls = '') => {
      const b = state.P.button(parent, '', fn, cls); state.P.icon(b, name); b.setAttribute('aria-label', label); b.title = label; return b;
    };

    BASE.showPopover = (title, lines) => { state.popover.replaceChildren(); state.P.el('strong','',state.popover,title); for(const line of lines) state.P.el('p','',state.popover,line); state.P.button(state.popover,'Close',()=>{state.popover.hidden=true;}); state.popover.hidden=false; };

    BASE.setZoom = (value) => { state.zoom=Math.max(.6,Math.min(1.4,Math.round(value*100)/100)); state.P.paint(state.ctx.model); };

    BASE.commit = (m) => { state.ctx.update(m); state.P.paint(state.ctx.model); };

    BASE.mutate = (m) => {
      const p = state.ctx.model;
      const history = [...p.history.slice(-23), { nodes: env.util.clone(p.nodes), edges: env.util.clone(p.edges), settings: env.util.clone(p.settings) }];
      state.P.commit({ ...m, history });
    };

    BASE.openPanel = (id) => {
      if (!id) return;
      state.P.commit({ ...state.ctx.model, panel: id, menu: null, selected: { node: id }, draft: { ...state.ctx.model.settings[id] } });
    };

    BASE.removeNode = (id) => {
      if (!id) return;
      const m = state.ctx.model, settings = { ...m.settings }; delete settings[id];
      state.P.mutate({ ...m, nodes: m.nodes.filter((n) => n.id !== id), edges: m.edges.filter((e) => !e.includes(id)), settings, selected: null, menu: null, panel: null });
    };

    BASE.removeSelected = () => {
      const m = state.ctx.model;
      if (m.selected?.node) state.P.removeNode(m.selected.node);
      else if (m.selected?.edge) state.P.mutate({ ...m, edges: m.edges.filter((e) => state.F.helpers.edgeKey(e) !== state.F.helpers.edgeKey(m.selected.edge)), selected: null });
    };

    BASE.portGesture = (target, id, kind, edgeRef = null) => {
      let from, old;
      env.ui.track(target, {
        start(p, e) {
          e.stopPropagation(); old = null;
          if (kind === 'out') from = id;
          else {
            const incoming = state.ctx.model.edges.filter((e) => e[1] === id);
            old = edgeRef || incoming.find((e) => state.ctx.model.selected?.edge && state.F.helpers.edgeKey(e) === state.F.helpers.edgeKey(state.ctx.model.selected.edge)) || incoming[0];
            if (!old) return false; from = old[0];
          }
          state.rubber.setAttribute('visibility', 'visible');
        },
        move(p) {
          const n = state.ctx.model.nodes.find((n) => n.id === from), r = state.canvas.getBoundingClientRect();
          state.rubber.setAttribute('d', state.P.curve(state.P.point(n, 'out'), [(p.x - r.left)/state.zoom, (p.y - r.top)/state.zoom]));
        },
        end(p) {
          state.rubber.setAttribute('visibility', 'hidden');
          const hit = document.elementsFromPoint(p.x, p.y).find((el) => el.dataset?.flowPort === 'in');
          if (!hit || hit.dataset.node === from) return;
          const edge = [from, hit.dataset.node], m = state.ctx.model;
          const next = old ? m.edges.filter((e) => state.F.helpers.edgeKey(e) !== state.F.helpers.edgeKey(old)) : m.edges.slice();
          if (!next.some((e) => state.F.helpers.edgeKey(e) === state.F.helpers.edgeKey(edge))) next.push(edge);
          state.P.mutate({ ...m, edges: next, selected: { edge } }); state.ctx.log(old ? 'edge-reroute' : 'edge-add', { edge });
        },
      }, 'flow-port');
    };

    BASE.buildNode = (n) => {
      const card = state.P.node(state.ctx, state.nodeLayer, n);
      state.nodes[n.id] = card;
      for (const kind of ['in', 'out']) {
        const dot = state.P.port(state.ctx, card, n, kind);
        state.ports[`${n.id}:${kind}`] = dot; state.P.portGesture(dot, n.id, kind);
      }
      let start;
      env.ui.track(card, {
        start(p, e) { if (e.target.closest('.af-port')) return false; e.stopPropagation(); start = { ...state.ctx.model.nodes.find((v) => v.id === n.id) }; state.moved = false; },
        move(p) {
          if (Math.hypot(p.dx, p.dy) < 4 && !state.moved) return;
          state.moved = true;
          state.P.commit({ ...state.ctx.model, nodes: state.ctx.model.nodes.map((v) => v.id === n.id ? { ...v, x: Math.round(start.x + p.dx/state.zoom), y: Math.round(start.y + p.dy/state.zoom) } : v) });
        }, end() {},
      }, 'flow-node');
      card.addEventListener('click', (e) => { if (!e.target.closest('.af-port') && !state.moved) state.P.openPanel(n.id); });
      card.addEventListener('contextmenu', (e) => {
        e.preventDefault(); e.stopPropagation();
        const r = state.body.getBoundingClientRect();
        state.menu.style.left = Math.min(Math.max(0, e.clientX - r.left), state.body.clientWidth - 180) + 'px';
        state.menu.style.top = Math.min(Math.max(0, e.clientY - r.top), state.body.clientHeight - 92) + 'px';
        state.P.commit({ ...state.ctx.model, menu: n.id, selected: { node: n.id }, panel: null });
      });
      state.P.nodeDecorated(state.ctx, card, n);
    };
  }

  function installGraph(BASE, state) {
    BASE.paint = (m) => {
      const rect=state.canvas.getBoundingClientRect(); state.world.style.width=(rect.width/state.zoom)+'px'; state.world.style.height=(rect.height/state.zoom)+'px';
      state.world.style.transform=`scale(${state.zoom})`; state.references.style.transform=`translate(${m.pan[0]}px,${m.pan[1]}px)`;
      state.zoomLabel.textContent=Math.round(state.zoom*100)+'%';
      for (const [id, card] of Object.entries(state.nodes)) if (!m.nodes.some((n) => n.id === id)) { card.remove(); delete state.nodes[id]; }
      for (const n of m.nodes) {
        if (!state.nodes[n.id]) state.P.buildNode(n);
        const card = state.nodes[n.id]; card.style.left = `${n.x + m.pan[0]}px`; card.style.top = `${n.y + m.pan[1]}px`;
        card.classList.toggle('on', m.selected?.node === n.id);
      }
      state.canvas.style.backgroundPosition = `${m.pan[0]*state.zoom}px ${m.pan[1]*state.zoom}px`; state.canvas.style.backgroundSize=`${state.D.gridSize*state.zoom}px ${state.D.gridSize*state.zoom}px`;
      state.P.edges(m);
      state.P.minimap(m, rect);
      const selected=m.nodes.find(n=>n.id===m.selected?.node)||m.nodes[0];
      state.overviewTitle.textContent=selected?.label||'No step selected'; state.overviewProperties.replaceChildren();
      if(selected) for(const [key,value] of [['Component',selected.type],['Destination',m.settings[selected.id]?.destination||'Not configured'],['Operation',m.settings[selected.id]?.operation||'Create']]) {
        state.P.property(state.ctx, state.overviewProperties, key, value);
      }
      state.panel.hidden = !m.panel;
      if (m.panel) {
        state.panelTitle.textContent = m.nodes.find((n) => n.id === m.panel)?.label || 'Node settings';
        for (const f of state.s.fields) if (state.panelId !== m.panel || document.activeElement !== state.fieldEls[f.key]) state.fieldEls[f.key].value = m.draft[f.key] || '';
      }
      state.panelId = m.panel; state.menu.hidden = !m.menu; state.del.disabled = !m.selected; state.undo.disabled = !m.history.length;
      state.nodeCount.textContent = `Nodes: ${m.nodes.length}`; state.edgeCount.textContent = `Connections: ${m.edges.length}`;
      state.configCount.textContent = `Configured nodes: ${state.F.helpers.configuredCount(m)}`;
      state.P.measure();
      state.P.painted(state.ctx, m);
    };

    BASE.measure = () => {
      const r = state.canvas.getBoundingClientRect(), pr = state.list.getBoundingClientRect(), fr = state.fields.getBoundingClientRect();
      const paletteTop = {}, fieldTop = {};
      const visible = (items, rect, positions) => Object.entries(items).filter(([key, item]) => {
        const q = item.getBoundingClientRect(); positions[key] = q.top - rect.top;
        return q.height > 0 && q.top >= rect.top && q.bottom <= rect.bottom;
      }).map(([key]) => key);
      state.ctx.update({ ...state.ctx.model, view: { w: r.width/state.zoom, h: r.height/state.zoom, zoom: state.zoom, edgePoints:Object.fromEntries(Object.entries(state.edgeEls).map(([key,v])=>[key,[v.mid[0]-state.ctx.model.pan[0],v.mid[1]-state.ctx.model.pan[1]]])), palette: visible(state.paletteEls, pr, paletteTop), paletteTop,
        fields: visible(state.fieldEls, fr, fieldTop), fieldTop } });
    };

    BASE.point = (n, kind) => { const p = state.F.helpers.port(n, kind); return [p[0] + state.ctx.model.pan[0], p[1] + state.ctx.model.pan[1]]; };

    BASE.curve = (a, b) => {
      const k = Math.max(38, Math.min(90, Math.abs(b[0] - a[0]) / 2));
      return `M${a[0]},${a[1]} C${a[0] + k},${a[1]} ${b[0] - k},${b[1]} ${b[0]},${b[1]}`;
    };

    BASE.component = (ctx, list, type, i) => {
      const tile = state.P.el('div', 'af-component', list); tile.setAttribute('role', 'button'); tile.setAttribute('aria-label', `Drag ${type} to canvas`);
      state.P.icon(state.P.el('span', 'af-symbol', tile), state.D.icons[i]); state.P.el('span', '', tile, type);

      return tile;
    };

    BASE.referenceNode = (ctx, references, n) => {
      const card=state.P.el('div','af-node' + (n.type==='Disabled'?' disabled':''),references); card.style.left=n.x+'px'; card.style.top=n.y+'px';
      const h=state.P.el('div','af-nodehead',card); state.P.icon(state.P.el('span','af-symbol',h), n.type==='Filter'?'filter':'record'); state.P.el('span','',h,n.label);
      state.P.el('div','af-nodefoot',card,n.type); state.P.el('span','af-port-static in',card); state.P.el('span','af-port-static out',card);

      return card;
    };

    BASE.runRow = (ctx, runList, id, status, ago, duration) => {
      const row=state.P.el('div','af-runrow',runList); state.P.el('span','',row,id); state.P.el('span',status==='Error'?'af-bad':'af-good',row,status); state.P.el('span','',row,ago); state.P.el('span','',row,duration);

      return row;
    };

    BASE.field = (ctx, fields, f) => {
      const label = state.P.el('label', 'af-field', fields, f.label);
      const input = state.P.el('input', '', label); input.type = f.kind; input.setAttribute('aria-label', f.label);
      if (f.kind === 'number') { input.min = '0'; input.step = '1'; }

      return input;
    };

    BASE.node = (ctx, nodeLayer, n) => {
      const card = state.P.el('div', 'af-node', nodeLayer); card.setAttribute('aria-label', n.label); card.dataset.node = n.id;
      const head = state.P.el('div', 'af-nodehead', card); state.P.icon(state.P.el('span', 'af-symbol', head), state.D.icons[state.F.helpers.TYPES.indexOf(n.type)] || 'code'); state.P.el('span', '', head, n.label);
      const foot = state.P.el('div', 'af-nodefoot', card); state.P.el('span', '', foot, n.type); state.P.icon(foot,'more');
      return card;
    };

    BASE.port = (ctx, card, n, kind) => {
      const dot = state.P.el('button', `af-port ${kind}`, card); dot.type = 'button'; dot.title = `${n.label} · ${kind === 'out' ? 'Output' : 'Input'}`;
      dot.setAttribute('aria-label', dot.title); dot.dataset.flowPort = kind; dot.dataset.node = n.id;
      return dot;
    };

    BASE.property = (ctx, parent, key, value) => {
      const prop=state.P.el('div','af-property',parent,key); state.P.el('b','',prop,value); return prop;
    };

    BASE.edges = (m) => {
      state.wires.replaceChildren(); state.edgeEls = {};
      for (const edge of m.edges) {
        const a = m.nodes.find((n) => n.id === edge[0]), b = m.nodes.find((n) => n.id === edge[1]);
        if (!a || !b) continue;
        const start = state.P.point(a, 'out'), end = state.P.point(b, 'in'), selected = m.selected?.edge && state.F.helpers.edgeKey(m.selected.edge) === state.F.helpers.edgeKey(edge);
        const hit = state.P.wire(state.ctx, edge, a, b, start, end, selected);
        const mid=hit.getPointAtLength(hit.getTotalLength()/2);
        state.edgeEls[state.F.helpers.edgeKey(edge)] = { mid: [mid.x,mid.y] };
      }
      for(const [from,to] of [[0,1],[0,2]]) {
        const a=state.referenceNodes[from],b=state.referenceNodes[to];
        state.util.svg('path',{d:state.P.curve([a.x+148+m.pan[0],a.y+38+m.pan[1]],[b.x+m.pan[0],b.y+38+m.pan[1]]),class:'af-edge','stroke-dasharray':'4 4','marker-end':'url(#af-arrow)'},state.wires);
      }
    };

    BASE.minimap = (m, rect) => {
      state.minimap.replaceChildren();
      const all=[...m.nodes,...state.referenceNodes], maxX=Math.max(...all.map(n=>n.x+160),1000), maxY=Math.max(420,...all.map(n=>n.y+90)), k=Math.min(124/maxX,64/maxY);
      for(const edge of m.edges) { const a=m.nodes.find(n=>n.id===edge[0]),b=m.nodes.find(n=>n.id===edge[1]); if(a&&b) state.util.svg('path',{d:`M${4+(a.x+148)*k},${4+(a.y+38)*k} L${4+b.x*k},${4+(b.y+38)*k}`,class:'af-mapedge'},state.minimap); }
      for(const n of all) state.util.svg('rect',{x:4+n.x*k,y:4+n.y*k,width:148*k,height:76*k,rx:1,fill:n.type==='Disabled'?'var(--line)':'var(--accent)',opacity:'.65'},state.minimap);
      state.util.svg('rect',{x:4-m.pan[0]*k,y:4-m.pan[1]*k,width:rect.width/state.zoom*k,height:rect.height/state.zoom*k,fill:'none',stroke:'var(--accent)','stroke-width':1},state.minimap);
    };

    BASE.wire = (ctx, edge, a, b, start, end, selected) => {
      const group = state.util.svg('g', { class: `af-wire${selected ? ' on' : ''}` }, state.wires);
      const backward = end[0] <= start[0];
      const lane=Math.min(a.y,b.y)+ctx.model.pan[1]-26;
      const d=backward ? `M${start[0]},${start[1]} C${start[0]+26},${start[1]} ${start[0]+26},${lane} ${start[0]+26},${lane} L${end[0]-26},${lane} C${end[0]-26},${lane} ${end[0]-26},${end[1]} ${end[0]},${end[1]}` : state.P.curve(start,end);
      state.util.svg('path', { class: 'af-edge', d, 'marker-end': 'url(#af-arrow)' }, group);
      const hit = state.util.svg('path', { class: 'af-hit', d }, group);
      hit.addEventListener('click', (e) => { e.stopPropagation(); state.P.commit({ ...ctx.model, selected: { edge }, panel: null, menu: null }); });
      if (selected) {
        const handle = state.util.svg('circle', { class: 'af-end', cx: end[0] - 11, cy: end[1], r: 5 }, group);
        state.P.portGesture(handle, edge[1], 'in', edge);
      }
      return hit;
    };
  }

  function installShell(BASE, state) {
    BASE.frame = (ctx) => {
      ctx.css('app-flow-classic', state.P.styles(ctx));
      state.app = state.P.el('section', 'af-app', ctx.stage);
      state.app.style.width = Math.max(0, ctx.size.width - 2 * state.D.frameInset) + 'px';
      state.app.style.height = Math.max(0, ctx.size.height - 2 * state.D.frameInset) + 'px';
      state.app.setAttribute('aria-label', `${state.D.brand} workflow editor`);

      state.app.classList.toggle('af-compact', ctx.size.width < state.D.compactWidth);
      state.app.classList.toggle('af-tight', ctx.size.width < state.D.tightWidth);
      state.zoom = state.D.initialZoom;
      return state.app;
    };

    BASE.top = (ctx) => {
      const top = state.P.el('div', 'af-top', state.app);
      state.P.icon(state.P.el('div', 'af-logo', top), 'branch');
      const title = state.P.el('div', 'af-title', top);
      state.P.el('strong', '', title, state.s.title); state.P.el('span', 'af-sub', title, `${state.D.brand} / Workflows · Owner: ${state.s.owner}`);
      state.P.el('span', 'af-badge', top, 'Draft');
      const versions = state.P.button(top, 'v12', () => state.P.showPopover('Version history', ['Draft · Unpublished changes', 'v12 · Published by ' + state.s.owner, 'v11 · Added retry handling', 'v10 · Updated customer mapping']), 'af-optional'); state.P.icon(versions, 'history');
      state.P.iconButton(top, 'Notifications: 3 unread', 'bell', () => state.P.showPopover('Notifications · 3 unread', ['Workspace invitation accepted', 'Mail connection expires in 7 days', 'Production v12 published successfully']));
      state.P.button(top, 'Publish', () => state.P.showPopover('Publish workflow', ['Your changes are saved as a draft.', 'Production publishing is restricted to workspace administrators. Request a review before release.']), 'af-primary');
    };

    BASE.toolbar = (ctx) => {
      state.bar = state.P.el('div', 'af-toolbar', state.app);
      const tabs = state.P.el('div', 'af-tabs', state.bar);
      const editorTab=state.P.button(tabs, 'Editor', () => { state.executions.style.height=''; editorTab.classList.add('active'); runsTab.classList.remove('active'); state.P.paint(ctx.model); }, 'af-tab active');
      const runsTab=state.P.button(tabs, 'Runs', () => { state.executions.style.height='180px'; runsTab.classList.add('active'); editorTab.classList.remove('active'); state.runList.scrollTop=0; state.P.paint(ctx.model); }, 'af-tab');
      state.P.iconButton(state.bar, 'Zoom out', 'minus', () => state.P.setZoom(state.zoom - .1));
      state.zoomLabel = state.P.el('span', 'af-muted', state.bar, Math.round(state.D.initialZoom * 100) + '%');
      state.P.iconButton(state.bar, 'Zoom in', 'plus', () => state.P.setZoom(state.zoom + .1));
      state.P.iconButton(state.bar, 'Reset view', 'fit', () => { state.zoom=state.D.initialZoom; state.P.commit({ ...ctx.model, pan:[0,0] }); });
      state.undo = state.P.button(state.bar, 'Undo', () => {
        const m = ctx.model, history = m.history.slice(), prev = history.pop();
        if (prev) state.P.commit({ ...m, ...prev, history, selected: null, panel: null, menu: null });
      });
      state.P.icon(state.undo, 'undo');
      state.del = state.P.iconButton(state.bar, 'Delete selected', 'trash', () => state.P.removeSelected());
      const test = state.P.button(state.bar, 'Test', () => state.P.showPopover('Test run queued', ['Waiting for a sample webhook request.', 'The published workflow is unaffected by a test run.']), 'af-primary'); state.P.icon(test, 'play');
      state.body = state.P.body(ctx, state.app);
    };

    BASE.palette = (ctx) => {
      state.P.paletteFrame(ctx);
      state.paletteEls = {};
      for (const [i, type] of state.F.helpers.TYPES.entries()) {
        const tile = state.P.component(ctx, state.list, type, i); state.paletteEls[type] = tile;
        state.P.bindComponent(ctx, tile, type);
        state.P.componentDecorated(ctx, tile, type, i);
      }
      state.search.addEventListener('input', () => { for (const [type, tile] of Object.entries(state.paletteEls)) tile.hidden = !type.toLowerCase().includes(state.search.value.toLowerCase()); });
      state.P.el('div', 'af-muted', state.palette, state.D.paletteHint);
    };

    BASE.paletteFrame = (ctx) => {
      state.palette = state.P.el('aside', 'af-palette', state.body);
      state.P.navigation(ctx, state.palette);
      state.P.el('h3', '', state.palette, state.D.paletteTitle);
      state.search = state.P.el('input', 'af-search', state.palette); state.search.placeholder = state.D.searchPlaceholder; state.search.setAttribute('aria-label', 'Find a step');
      state.list = state.P.el('div', 'af-list', state.palette); state.P.el('div', 'af-category', state.list, state.D.categoryLabel);
    };

    BASE.navigation = (ctx, palette) => {
      const nav = state.P.el('div', 'af-worknav', palette);
      state.P.el('strong', '', nav, state.D.workspaceTitle);
      for (const [name, count, glyph] of [['Workflows','24','branch'], ['Credentials','8','lock'], ['Execution log','248','history']]) {
        const row = state.P.navigationRow(ctx, nav, name, glyph, count, name === 'Workflows');
        row.addEventListener('click', () => state.P.showPopover(name, name==='Workflows' ? ['Customer intake · Current', 'Invoice reminders · Published', 'Partner handoff · Draft', 'Support triage · Published'] : ['Production workspace', 'Access is managed by your workspace administrator.']));
      }
      for(const project of ['Finance operations','Customer care']) { const row=state.P.navigationRow(ctx, nav, project, 'folder'); row.addEventListener('click',()=>state.P.showPopover(project,['Invoice follow-up · Published','Partner handoff · Draft','Daily reconciliation · Published'])); }
    };

    BASE.navigationRow = (ctx, nav, name, glyph, count, active = false) => {
      const row = state.P.el('div', 'af-navitem' + (active ? ' active' : ''), nav);
      state.P.icon(row, glyph); state.P.el('span', '', row, name);
      if (count !== undefined) state.P.el('small', '', row, count);
      return row;
    };

    BASE.bindComponent = (ctx, tile, type) => {
      env.ui.track(tile, {
        start(p, e) { e.stopPropagation(); tile.style.opacity = '.55'; },
        end(p) {
          tile.style.opacity = '';
          const r = state.canvas.getBoundingClientRect();
          if (p.x < r.left + 8 || p.x > r.right - 8 || p.y < r.top + 8 || p.y > r.bottom - 8) return;
          const m = ctx.model, id = m.nodes.some((n) => n.id === 'added') ? `extra${m.nodes.length}` : 'added';
          const node = { id, label: type, type, x: Math.round((p.x - r.left) / state.zoom - m.pan[0]), y: Math.round((p.y - r.top) / state.zoom - m.pan[1]) };
          state.P.mutate({ ...m, nodes: [...m.nodes, node], settings: { ...m.settings, [id]: { destination: '', operation: 'Create', retries: '0', timeout: '30' } }, selected: { node: id } });
          ctx.log('node-add', { id, type });
        },
      }, 'flow-palette');
    };
  }

  function installPanels(BASE, state) {
    BASE.canvas = (ctx) => {
      state.workspace = state.P.el('div', 'af-workspace', state.body);
      state.canvas = state.P.el('div', 'af-canvas', state.workspace); state.canvas.setAttribute('aria-label', 'Workflow canvas');
      state.world = state.P.el('div', 'af-world', state.canvas);
      state.svg = state.util.svg('svg', { class: 'af-svg' }, state.world);
      const defs = state.util.svg('defs', {}, state.svg);
      const arrow = state.util.svg('marker', { id: 'af-arrow', viewBox: '0 0 10 10', refX: 13, refY: 5, markerWidth: 5, markerHeight: 5, orient: 'auto' }, defs);
      state.util.svg('path', { d: 'M0 1 L9 5 L0 9 Z', fill: 'var(--muted)' }, arrow);
      state.wires = state.util.svg('g', {}, state.svg);
      state.rubber = state.util.svg('path', { class: 'af-preview', visibility: 'hidden' }, state.svg);
      state.nodeLayer = state.P.el('div', '', state.world);
      state.P.el('div', 'af-hint', state.canvas, state.D.canvasHint);
    };

    BASE.references = (ctx) => {
      state.references = state.P.el('div','af-reference',state.world);
      const note=state.P.el('div','af-sticky',state.references); state.P.el('strong','',note,state.D.noteTitle);
      state.P.el('span','',note,state.D.noteText);
      state.P.el('div','af-refcap',state.references,state.D.referenceTitle);
      state.referenceNodes = [{x:260,y:282,label:'Manual review',type:'Filter'}, {x:480,y:282,label:'Audit log',type:'Create record'}, {x:480,y:406,label:'Legacy export',type:'Disabled'}];
      for(const n of state.referenceNodes) {
        const card = state.P.referenceNode(ctx, state.references, n);
        card.addEventListener('click', () => state.P.showPopover(n.label,['Read-only reference step',n.type==='Disabled'?'Disabled in this draft. No executions are scheduled.':'Maintained by the operations workspace.']));
      }
    };

    BASE.executions = (ctx) => {
      state.executions=state.P.el('section','af-executions',state.workspace);
      const runs=state.P.el('div','af-runs',state.executions), runHead=state.P.el('div','af-runhead',runs);
      state.P.icon(runHead,'history'); state.P.el('strong','',runHead,state.D.executionsTitle); state.P.el('span','',runHead,'Last 24 hours');
      state.runList=state.P.el('div','af-runlist',runs);
      for(const [id,status,ago,duration] of [['#4829','Succeeded','2 min ago','1.24 s'],['#4828','Succeeded','8 min ago','0.91 s'],['#4827','Error','14 min ago','3.02 s'],['#4826','Succeeded','21 min ago','1.18 s'],['#4825','Stopped','36 min ago','0.42 s'],['#4824','Succeeded','1 hr ago','1.06 s']]) {
        const row = state.P.runRow(ctx, state.runList, id, status, ago, duration);
        row.addEventListener('click',()=>state.P.showPopover('Execution '+id,[status+' · '+duration,'Source: production v12',status==='Error'?'Mail service: connection expired. Reconnect the account to retry.':'Processed 1 item. No retries needed.']));
      }
      const mapBox=state.P.el('div','af-map',state.executions), mapLabel=state.P.el('div','af-maplabel',mapBox); state.P.el('span','',mapLabel,'Canvas overview'); state.P.el('span','',mapLabel,'Live');
      state.minimap=state.util.svg('svg',{class:'af-minimap',viewBox:'0 0 132 72','aria-label':'Workflow minimap'},mapBox);
    };

    BASE.overview = (ctx) => {
      const overview=state.P.el('aside','af-overview',state.body); state.P.el('div','af-overviewhead',overview,state.D.inspectorTitle);
      const overviewBody=state.P.el('div','af-overviewbody',overview);
      state.overviewTitle=state.P.el('strong','',overviewBody), state.overviewProperties=state.P.el('div','',overviewBody);
      state.P.button(overviewBody,'Edit parameters',()=>state.P.openPanel(ctx.model.selected?.node || ctx.model.nodes[0]?.id));
      const sampleCap=state.P.el('div','af-category',overviewBody,'Last execution output');
      state.P.el('div','af-json',overviewBody,'{\n  "event": "order.created",\n  "items": 1,\n  "source": "production"\n}');
      const activity=state.P.el('div','af-activity',overviewBody); state.P.el('strong','',activity,'Activity');
      state.P.el('p','',activity,state.s.owner+' edited this draft'); state.P.el('p','',activity,'Version 12 published · 2 days ago'); state.P.el('p','',activity,'Mail connection needs review');
    };

    BASE.inspector = (ctx) => {
      state.panel = state.P.el('aside', 'af-panel', state.body); state.panel.hidden = true;
      const ph = state.P.el('div', 'af-panelhead', state.panel); state.panelTitle = state.P.el('strong', '', ph);
      state.close = state.P.button(ph, '', () => state.P.commit({ ...ctx.model, panel: null }), ''); state.close.setAttribute('aria-label', 'Close node settings'); state.P.icon(state.close, 'close');
      state.fields = state.P.el('div', 'af-fields', state.panel), state.fieldEls = {};
      state.P.el('div', 'af-category', state.fields, 'Parameters');
      for (const f of state.s.fields) {
        const input = state.P.field(ctx, state.fields, f);
        input.addEventListener('input', () => ctx.update({ ...ctx.model, draft: { ...ctx.model.draft, [f.key]: input.value } }));
        state.fieldEls[f.key] = input;
      }
      state.P.el('p', 'af-muted', state.fields, 'Values are applied to this step only. Connections and other steps are preserved.');
      const pb = state.P.el('div', 'af-panelbottom', state.panel);
      state.save = state.P.button(pb, 'Apply node settings', () => {
        const m = ctx.model;
        if (m.panel) state.P.mutate({ ...m, settings: { ...m.settings, [m.panel]: { ...m.draft } } });
      }, 'af-primary');
    };

    BASE.menu = (ctx) => {
      state.menu = state.P.el('div', 'af-menu', state.body); state.menu.hidden = true; state.menu.setAttribute('role', 'menu');
      state.P.button(state.menu, 'Open settings', () => state.P.openPanel(ctx.model.menu));
      state.menuDelete = state.P.button(state.menu, 'Delete node', () => state.P.removeNode(ctx.model.menu), 'af-danger');
    };

    BASE.footer = (ctx) => {
      const footer = state.P.el('div', 'af-footer', state.app);
      state.nodeCount = state.P.el('span', '', footer), state.edgeCount = state.P.el('span', '', footer), state.configCount = state.P.el('span', '', footer);
      const savedStatus=state.P.el('span', 'af-status', footer); state.P.icon(savedStatus,'check'); state.P.el('span','',savedStatus,state.D.savedText);
    };

    BASE.popover = (ctx) => {
      state.popover=state.P.el('div','af-popover',state.app); state.popover.hidden=true;

    };
  }

  function installLifecycle(BASE, state) {
    BASE.bind = (ctx) => {
      state.list.addEventListener('scroll', () => state.P.measure()); state.fields.addEventListener('scroll', () => state.P.measure());
      let startPan;
      env.ui.track(state.canvas, {
        start(p, e) {
          if (e.target.closest('.af-node') || e.target.closest('.af-wire') || e.target.closest('.af-sticky')) return false;
          startPan = ctx.model.pan.slice(); return true;
        },
        move(p) { state.P.commit({ ...ctx.model, pan: [Math.round(startPan[0] + p.dx/state.zoom), Math.round(startPan[1] + p.dy/state.zoom)], menu: null }); },
        end(p) { if (Math.hypot(p.dx, p.dy) < 3) state.P.commit({ ...ctx.model, selected: null, panel: null, menu: null }); },
      }, 'flow-canvas-pan');
      state.app.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); state.P.removeSelected(); }
        if (e.key === 'Escape') state.P.commit({ ...ctx.model, panel: null, menu: null });
      });
      state.minimap.addEventListener('click',e=>{
        const r=state.minimap.getBoundingClientRect(), all=[...ctx.model.nodes,...state.referenceNodes];
        const k=Math.min(124/Math.max(...all.map(n=>n.x+160),1000),64/Math.max(420,...all.map(n=>n.y+90)));
        const x=((e.clientX-r.left)/r.width*132-4)/k,y=((e.clientY-r.top)/r.height*72-4)/k;
        state.P.commit({...ctx.model,pan:[Math.round(state.canvas.clientWidth/state.zoom/2-x),Math.round(state.canvas.clientHeight/state.zoom/2-y)]});
      });
    };

    BASE.finish = (ctx) => {
      const r = state.canvas.getBoundingClientRect();
      ctx.update({ ...ctx.model, view: { w: r.width, h: r.height } });
      state.P.paint(ctx.model);
      state.live = { ctx, canvas: state.canvas, list: state.list, fields: state.fields, nodes: state.nodes, ports: state.ports, paletteEls: state.paletteEls, fieldEls: state.fieldEls, controls: { delete: state.del, menuDelete: state.menuDelete, save: state.save, close: state.close, undo: state.undo }, getEdges: () => state.edgeEls };
      state.P.rendered(ctx);
      return { anchors: [state.app], sync: (m) => state.P.paint(m) };
    };

    BASE.locate = (t) => {
      const L = state.live, m = L.ctx.model, r = L.canvas.getBoundingClientRect(), z=m.view.zoom||1;
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
    };
  }

  env.template('use-workflow-editor/editor', (design, def) => {
    const state = {};
    const BASE = {};
    const els = {
      get app() { return state.app; }, set app(value) { state.app = value; },
      get bar() { return state.bar; }, set bar(value) { state.bar = value; },
      get zoomLabel() { return state.zoomLabel; }, set zoomLabel(value) { state.zoomLabel = value; },
      get undo() { return state.undo; }, set undo(value) { state.undo = value; },
      get del() { return state.del; }, set del(value) { state.del = value; },
      get body() { return state.body; }, set body(value) { state.body = value; },
      get palette() { return state.palette; }, set palette(value) { state.palette = value; },
      get search() { return state.search; }, set search(value) { state.search = value; },
      get list() { return state.list; }, set list(value) { state.list = value; },
      get paletteEls() { return state.paletteEls; }, set paletteEls(value) { state.paletteEls = value; },
      get workspace() { return state.workspace; }, set workspace(value) { state.workspace = value; },
      get canvas() { return state.canvas; }, set canvas(value) { state.canvas = value; },
      get world() { return state.world; }, set world(value) { state.world = value; },
      get svg() { return state.svg; }, set svg(value) { state.svg = value; },
      get wires() { return state.wires; }, set wires(value) { state.wires = value; },
      get rubber() { return state.rubber; }, set rubber(value) { state.rubber = value; },
      get nodeLayer() { return state.nodeLayer; }, set nodeLayer(value) { state.nodeLayer = value; },
      get references() { return state.references; }, set references(value) { state.references = value; },
      get referenceNodes() { return state.referenceNodes; }, set referenceNodes(value) { state.referenceNodes = value; },
      get executions() { return state.executions; }, set executions(value) { state.executions = value; },
      get runList() { return state.runList; }, set runList(value) { state.runList = value; },
      get minimap() { return state.minimap; }, set minimap(value) { state.minimap = value; },
      get overviewTitle() { return state.overviewTitle; }, set overviewTitle(value) { state.overviewTitle = value; },
      get overviewProperties() { return state.overviewProperties; }, set overviewProperties(value) { state.overviewProperties = value; },
      get panel() { return state.panel; }, set panel(value) { state.panel = value; },
      get panelTitle() { return state.panelTitle; }, set panelTitle(value) { state.panelTitle = value; },
      get close() { return state.close; }, set close(value) { state.close = value; },
      get fields() { return state.fields; }, set fields(value) { state.fields = value; },
      get fieldEls() { return state.fieldEls; }, set fieldEls(value) { state.fieldEls = value; },
      get save() { return state.save; }, set save(value) { state.save = value; },
      get menu() { return state.menu; }, set menu(value) { state.menu = value; },
      get menuDelete() { return state.menuDelete; }, set menuDelete(value) { state.menuDelete = value; },
      get nodeCount() { return state.nodeCount; }, set nodeCount(value) { state.nodeCount = value; },
      get edgeCount() { return state.edgeCount; }, set edgeCount(value) { state.edgeCount = value; },
      get configCount() { return state.configCount; }, set configCount(value) { state.configCount = value; },
      get popover() { return state.popover; }, set popover(value) { state.popover = value; },
      get nodes() { return state.nodes; },
      get ports() { return state.ports; },
      get edgeEls() { return state.edgeEls; },
    };
    const S = {
      get ctx() { return state.ctx; }, get spec() { return state.s; }, get model() { return state.ctx?.model; },
      get D() { return state.D; }, get P() { return state.P; },
      get zoom() { return state.zoom; }, set zoom(value) { state.zoom = value; },
      els,
    };

    installStyles(BASE, state);
    installInteractions(BASE, state);
    installGraph(BASE, state);
    installShell(BASE, state);
    installPanels(BASE, state);
    installLifecycle(BASE, state);

    ({ D: state.D, P: state.P } = env.templateDesign('use-workflow-editor/editor', design, def, { tokens: TOKENS, base: BASE, state: S }));
    return {
      render(current) {
        state.ctx = current; state.util = state.ctx.util; state.s = state.ctx.spec; state.F = env.taskDef;
        state.nodes = {}; state.ports = {}; state.edgeEls = {}; state.panelId = null; state.moved = false;
        state.app = state.P.frame(state.ctx);
        state.P.top(state.ctx);
        state.P.toolbar(state.ctx);
        state.P.palette(state.ctx);
        state.P.canvas(state.ctx);
        state.P.references(state.ctx);
        state.P.executions(state.ctx);
        state.P.overview(state.ctx);
        state.P.inspector(state.ctx);
        state.P.menu(state.ctx);
        state.P.footer(state.ctx);
        state.P.popover(state.ctx);
        state.P.bind(state.ctx);
        return state.P.finish(state.ctx);
      },
      locate(t) { return state.P.locate(t); },
    };
  });
})();
