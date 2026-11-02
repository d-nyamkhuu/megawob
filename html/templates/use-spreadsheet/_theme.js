/* use-spreadsheet/_theme: workbook stylesheet, vector icons and token defaults; no page state. */
(function () {
  'use strict';
  const CSS = (D) => `
  .as-book { position:absolute; inset:10px; min-width:0; display:flex; flex-direction:column; overflow:hidden;
    border:1px solid var(--line); border-radius:8px; background:var(--panel); color:var(--fg); font:12px/1.3 ${D.font},sans-serif;
    box-shadow:0 4px 20px #00000012; --sheet-accent:var(--accent); }
  .as-book.as-canvas { inset:7px; border-radius:3px; --sheet-accent:${D.canvasAccent}; }
  .as-title { height:43px; flex:none; display:flex; gap:10px; align-items:center; padding:0 13px; border-bottom:1px solid var(--line); }
  .as-logo { width:28px; height:30px; border-radius:4px; background:var(--sheet-accent); color:white; display:grid; place-items:center; font-size:22px; }
  .as-heading { min-width:0; overflow:hidden; } .as-heading b { display:block; font-size:14px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
  .as-heading small { color:var(--muted); font-size:10px; } .as-saved { margin-left:auto; color:var(--muted); white-space:nowrap; }
  .as-avatar { width:25px; height:25px; border-radius:50%; background:color-mix(in srgb,var(--sheet-accent) 15%,var(--panel)); display:grid; place-items:center; }
  .as-nav { flex:none; height:27px; padding:0 12px; display:flex; align-items:center; gap:16px; border-bottom:1px solid var(--line); color:var(--muted); }
  .as-nav span:first-child { color:var(--sheet-accent); font-weight:bold; border-bottom:2px solid var(--sheet-accent); padding:5px 2px; }
  .as-tools { flex:none; height:35px; padding:0 8px; display:flex; gap:4px; align-items:center; background:color-mix(in srgb,var(--fg) 3%,var(--panel)); border-bottom:1px solid var(--line); overflow:hidden; }
  .as-btn { border:1px solid transparent; background:transparent; color:var(--fg); border-radius:3px; font:inherit; cursor:pointer; padding:5px 7px; white-space:nowrap; }
  .as-btn:hover { border-color:var(--line); background:color-mix(in srgb,var(--sheet-accent) 8%,var(--panel)); }
  .as-btn:focus-visible { outline:2px solid var(--sheet-accent); } .as-btn:disabled { color:var(--muted); opacity:.5; cursor:default; }
  .as-sep { height:20px; border-left:1px solid var(--line); margin:0 4px; } .as-font { padding:4px 9px; border:1px solid var(--line); border-radius:3px; white-space:nowrap; }
  .as-fbar { display:flex; align-items:center; flex:none; height:32px; border-bottom:1px solid var(--line); gap:6px; padding:3px 6px; }
  .as-name { width:105px; flex:none; font:12px monospace; color:var(--fg); padding:4px; background:var(--panel); border:1px solid var(--line); }
  .as-fx { color:var(--muted); font:italic bold 15px Georgia,serif; padding:0 5px; }
  .as-input { width:100%; min-width:0; background:var(--panel); border:1px solid var(--line); color:var(--fg); padding:6px 8px; font:12px ${D.font},sans-serif; user-select:text; }
  .as-formula { flex:1; height:25px; padding:3px 7px; font:12px monospace; border-color:transparent; }
  .as-input:focus { outline:1px solid var(--sheet-accent); border-color:var(--sheet-accent); }
  .as-grid { flex:1; min-height:65px; position:relative; overflow:hidden; outline:none; background:var(--panel); touch-action:none; cursor:cell; }
  .as-grid canvas { display:block; position:absolute; inset:0; } .as-cell { position:absolute; display:flex; align-items:center; padding:0 6px;
    border-right:1px solid var(--line); border-bottom:1px solid var(--line); overflow:hidden; white-space:nowrap; pointer-events:none; }
  .as-cell span { overflow:hidden; text-overflow:ellipsis; } .as-selection { position:absolute; pointer-events:none; border:2px solid var(--sheet-accent); background:color-mix(in srgb,var(--sheet-accent) 7%,transparent); }
  .as-handle { position:absolute; width:7px; height:7px; background:var(--sheet-accent); border:1px solid var(--panel); pointer-events:none; }
  .as-bottom { height:29px; display:flex; align-items:center; gap:8px; padding:0 12px; flex:none; background:color-mix(in srgb,var(--fg) 3%,var(--panel)); border-top:1px solid var(--line); }
  .as-tab { align-self:stretch; padding:6px 14px; background:var(--panel); color:var(--sheet-accent); border-bottom:2px solid var(--sheet-accent); font-weight:bold; }
  .as-status { height:25px; padding:0 9px; flex:none; display:flex; gap:14px; align-items:center; border-top:1px solid var(--line); color:var(--muted); font-size:10px; white-space:nowrap; overflow:hidden; }
  .as-status .as-total { margin-left:auto; } .as-status b { color:var(--fg); font-weight:normal; }
  .as-menu { position:absolute; z-index:15; width:213px; max-height:calc(100% - 45px); overflow:auto; padding:6px; border:1px solid var(--line); border-radius:5px;
    background:var(--panel); box-shadow:0 8px 24px #0003; } .as-menu .as-btn { display:block; text-align:left; width:100%; padding:8px; }
  .as-menu small { display:block; color:var(--muted); padding:7px 8px 3px; } .as-menu hr { border:0; border-top:1px solid var(--line); }
  .as-shade { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:20; background:#0005; }
  .as-shade[hidden],.as-menu[hidden] { display:none; }
  .as-dialog { width:min(370px,calc(100% - 20px)); padding:15px 18px; border:1px solid var(--line); border-radius:8px; background:var(--panel); box-shadow:0 15px 40px #0004; }
  .as-dialog h3 { margin:0 0 4px; font-size:16px; } .as-dialog p { margin:0 0 10px; color:var(--muted); }
  .as-dialog label { display:block; margin:9px 0 4px; font-size:11px; font-weight:bold; }
  .as-choices { display:flex; gap:5px; } .as-choices .as-btn { border:1px solid var(--line); }
  .as-choices .as-btn.on { outline:2px solid var(--sheet-accent); outline-offset:-2px; }
  .as-actions { display:flex; justify-content:flex-end; margin-top:14px; gap:6px; } .as-primary { background:var(--sheet-accent); color:white; padding:7px 16px; }
  .as-preview { font-size:11px; padding:5px 8px; margin-top:9px; border-radius:3px; }
  .as-canvas .as-title { background:color-mix(in srgb,var(--sheet-accent) 9%,var(--panel)); height:49px; }
  .as-canvas .as-nav { height:29px; } .as-canvas .as-tools { height:30px; }
  .as-book.as-short .as-dialog { padding:10px 15px; } .as-short .as-dialog label { margin:6px 0 3px; }
  .as-short .as-dialog p { margin-bottom:5px; } .as-short .as-actions { margin-top:8px; }
  .as-book { font-family:${D.font},sans-serif; border-radius:5px; }
  .as-icon { width:16px; height:16px; flex:none; vertical-align:middle; pointer-events:none; }
  .as-btn { display:inline-flex; align-items:center; justify-content:center; gap:5px; }
  .as-title,.as-canvas .as-title { height:41px; gap:8px; padding:0 10px; }
  .as-logo { width:25px; height:27px; } .as-logo .as-icon { width:19px; height:19px; }
  .as-heading b { font-size:13px; } .as-heading small { font-size:9px; }
  .as-saved { display:inline-flex; align-items:center; gap:5px; font-size:10px; }
  .as-share { background:color-mix(in srgb,var(--sheet-accent) 13%,var(--panel)); color:var(--sheet-accent); font-weight:bold; }
  .as-nav,.as-canvas .as-nav { height:25px; gap:15px; padding:0 10px; font-size:11px; }
  .as-tools,.as-canvas .as-tools { height:64px; gap:0; padding:3px 5px; align-items:stretch; }
  .as-group { display:flex; flex:none; flex-direction:column; gap:3px; padding:0 7px; border-right:1px solid var(--line); }
  .as-group:last-child { border:0; } .as-toolrow { display:flex; align-items:center; gap:3px; height:20px; }
  .as-group small { color:var(--muted); font-size:9px; line-height:10px; text-align:center; margin-top:auto; }
  .as-tools .as-btn { font-size:11px; padding:2px 5px; height:20px; }
  .as-pick { display:inline-flex; align-items:center; justify-content:space-between; gap:9px; border:1px solid var(--line); padding:2px 6px; background:var(--panel); border-radius:2px; white-space:nowrap; height:20px; font-size:11px; }
  .as-pick .as-icon { width:11px; height:11px; } .as-formatgroup { min-width:148px; } .as-fontgroup { min-width:134px; }
  .as-fbar { height:29px; } .as-name { width:88px; font-size:11px; } .as-formula { font-size:11px; }
  .as-context { height:21px; flex:none; display:flex; align-items:center; gap:8px; padding:0 10px; border-bottom:1px solid var(--line); color:var(--muted); font-size:10px; background:color-mix(in srgb,var(--sheet-accent) 4%,var(--panel)); }
  .as-context strong { color:var(--fg); font-weight:600; } .as-context .as-icon { width:12px; height:12px; }
  .as-context .as-frozen { margin-left:auto; display:flex; gap:4px; align-items:center; }
  .as-workarea { flex:1; min-height:65px; min-width:0; display:flex; overflow:hidden; }
  .as-workspace { width:35px; flex:none; overflow:hidden; background:color-mix(in srgb,var(--fg) 2%,var(--panel)); border-right:1px solid var(--line); }
  .as-workspace .as-sideheading,.as-workspace .as-projects { display:none; }
  .as-workspace .as-sideitem { height:35px; display:flex; gap:7px; align-items:center; padding:0 9px; white-space:nowrap; color:var(--muted); font-size:11px; }
  .as-workspace .as-sideitem.active { background:color-mix(in srgb,var(--sheet-accent) 10%,var(--panel)); color:var(--sheet-accent); border-left:2px solid var(--sheet-accent); padding-left:7px; }
  .as-sideitem span { display:none; } .as-sideitem small { margin-left:auto; }
  .as-book.as-roomy .as-workspace { width:137px; }
  .as-roomy .as-workspace .as-sideheading { display:block; font-size:9px; color:var(--muted); padding:12px 10px 7px; text-transform:uppercase; letter-spacing:.05em; }
  .as-roomy .as-workspace .as-projects { display:block; } .as-roomy .as-sideitem span { display:inline; }
  .as-projects p { margin:0; font-size:10px; color:var(--muted); padding:7px 10px; }
  .as-projects p.current { color:var(--fg); font-weight:bold; background:color-mix(in srgb,var(--fg) 4%,var(--panel)); }
  .as-activity { display:none; width:178px; flex:none; overflow:auto; padding:12px 11px; border-left:1px solid var(--line); background:color-mix(in srgb,var(--fg) 1.5%,var(--panel)); }
  .as-book.as-wide .as-activity { display:block; } .as-activity h4 { margin:0 0 12px; font-size:11px; }
  .as-activity article { border-bottom:1px solid var(--line); padding:9px 0; font-size:10px; }
  .as-activity p { margin:4px 0; color:var(--muted); line-height:1.5; } .as-activity small { color:var(--muted); font-size:9px; }
  .as-grid { min-width:0; font-size:${D.cellFontSize}px; font-variant-numeric:tabular-nums; }
  .as-cell { padding:0 5px; } .as-cell.tablehead { border-bottom:2px solid var(--muted); }
  .as-cell .as-icon { width:10px; height:10px; margin-left:auto; } .as-cell .as-pill { border-radius:3px; padding:1px 5px; font-size:10px; }
  .as-error { color:${D.errorColor}; } .as-error::after { content:''; position:absolute; right:1px; top:1px; border-top:5px solid ${D.errorColor}; border-left:5px solid transparent; }
  .as-bottom { height:28px; padding:0 5px; gap:2px; overflow:hidden; }
  .as-bottom .as-btn { padding:3px; } .as-tab { padding:6px 10px; font-size:10px; white-space:nowrap; font-weight:normal; background:transparent; color:var(--muted); border:0; }
  .as-tab.active { background:var(--panel); color:var(--sheet-accent); font-weight:bold; border-bottom:2px solid var(--sheet-accent); }
  .as-bottom .as-saved { padding-left:8px; gap:7px; font-size:9px; }
  .as-status { height:22px; font-size:9px; gap:12px; } .as-status .as-icon { width:11px; height:11px; }
  .as-statusmark { display:flex; gap:4px; align-items:center; color:var(--sheet-accent); }
  .as-menu .as-btn { display:flex; justify-content:flex-start; } .as-menu .as-icon { width:13px; height:13px; }
  .as-ribbonextra { display:flex; } .as-compact .as-ribbonextra { display:none; }
  .as-book.as-compact .as-formatgroup { min-width:0; } .as-compact .as-optional { display:none; }
  .as-book.as-compact .as-group { padding:0 4px; } .as-compact .as-group small { font-size:8px; }
  .as-popover { position:absolute; right:10px; top:40px; z-index:18; width:235px; padding:13px; background:var(--panel); border:1px solid var(--line); border-radius:5px; box-shadow:0 8px 25px #0003; font-size:11px; }
  .as-popover[hidden] { display:none; } .as-popover p { margin:8px 0; color:var(--muted); line-height:1.5; }
  @media(max-width:1100px) { .as-status { gap:7px; font-size:9px; } }
  `;
  // One vector vocabulary: inline SVG in frame/DOM grid, identical paths on the single canvas.
  const ICONS = {
    sheet: 'M3 2h10l4 4v12H3z M13 2v5h4 M6 10h8 M6 13h8 M9 10v6 M6 16h8',
    down: 'M6 8l4 4 4-4', left: 'M12 5l-5 5 5 5', right: 'M8 5l5 5-5 5',
    plus: 'M10 4v12 M4 10h12', minus: 'M4 10h12', check: 'M4 10l4 4 8-8',
    undo: 'M7 4L3 8l4 4 M3 8h9a5 5 0 0 1 0 10', redo: 'M13 4l4 4-4 4 M17 8H8a5 5 0 0 0 0 10',
    grid: 'M3 3h14v14H3z M3 8h14 M3 12h14 M8 3v14 M12 3v14',
    align: 'M3 5h14 M3 9h10 M3 13h14 M3 17h10', merge: 'M2 4h6v12H2 M12 4h6v12h-6 M6 10h8 M8 8l-2 2 2 2 M12 8l2 2-2 2',
    filter: 'M3 4h14l-5 6v6l-4 2v-8z', asc: 'M5 16V4 M2 7l3-3 3 3 M11 5h6 M11 10h4 M11 15h2', desc: 'M5 4v12 M2 13l3 3 3-3 M11 5h2 M11 10h4 M11 15h6',
    bell: 'M5 14V8a5 5 0 0 1 10 0v6l2 2H3z M8 18h4', comment: 'M3 3h14v11H8l-5 4z M6 7h8 M6 10h5',
    users: 'M7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6 M2 18v-2a5 5 0 0 1 10 0v2 M14 5a3 3 0 0 1 0 6 M14 13a4 4 0 0 1 4 4v1',
    clock: 'M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0 M10 5v5l3 2', search: 'M13 8a5 5 0 1 1-10 0 5 5 0 0 1 10 0 M12 12l5 5',
    folder: 'M2 5h6l2 2h8v10H2z', star: 'M10 2l2.5 5 5.5.8-4 4 1 5.6-5-2.6-5 2.6 1-5.6-4-4L7.5 7z',
    list: 'M3 4h2 M8 4h9 M3 10h2 M8 10h9 M3 16h2 M8 16h9', lock: 'M5 9h10v9H5z M7 9V6a3 3 0 0 1 6 0v3',
    freeze: 'M3 3h14v14H3z M3 7h14 M7 3v14', fx: 'M15 3h-4l-3 14H4 M5 8h8 M13 11l5 6 M18 11l-5 6',
    paint: 'M4 3l8 8-6 6-5-5 6-6 M9 14h9 M14 17h4', border: 'M3 3h14v14H3z M3 10h14 M10 3v14',
  };

  const TOKENS = {
    renderer: 'classic',
    font: 'Arial',
    alternateFont: 'Georgia',
    cellFontSize: 11,
    largeFontSize: 12,
    canvasAccent: '#20856a',
    errorColor: '#d14848',
    colors: { red: ['#fce3e3', '#852828'], green: ['#daf1e2', '#195a36'], blue: ['#dfebff', '#214d8c'] },
    statusTones: { Paid: '#2d8a62', Review: '#b68429', other: '#487ac1' },
    icons: ICONS,
    tabs: ['Home', 'Insert', 'Page layout', 'Formulas', 'Data', 'Review', 'View', 'Help'],
    canvasTabs: ['File', 'Edit', 'View', 'Insert', 'Format', 'Data', 'Tools', 'Extensions', 'Help'],
    sheets: ['Summary', 'Budget', 'Vendors', 'Lookups', 'Archive'],
    breadcrumb: 'Team drive  /  Workbooks  /  Monthly operations',
    canvasBreadcrumb: 'Workspace / Finance / Shared workbooks',
    shortHeight: 430,
    roomyWidth: 1180,
    wideWidth: 1380,
    compactWidth: 800,
    gutter: 34,
    canvasGutter: 39,
    headerHeight: 23,
    canvasHeaderHeight: 25,
    rowHeight: 22,
    canvasRowHeight: 24,
    minRowHeight: 15,
    scrollbarWidth: 11,
    columnWeights: [1.55, 1.3, .65, .9, 1, .85, .95, .8],
    canvasColumnWeights: [1.45, 1.25, .65, .9, 1, .9, .95, .9],
  };

  env.template('use-spreadsheet/_theme', () => ({ CSS, TOKENS }));
})();
