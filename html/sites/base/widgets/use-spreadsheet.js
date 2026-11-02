/*
 * base / use-spreadsheet: classic is a DOM spreadsheet; canvas draws the entire viewport (column/row
 * headers, every cell, grid lines, selection, fill handle and scrollbar) on ONE canvas with custom
 * coordinate hit testing. Neither canvas cells nor canvas headers have DOM counterparts. Both use the
 * same geometry for painting, hit testing and locate(), and the same task transitions/evaluator.
 * Formula bar and header popovers / formatting dialog are DOM in both. Wheel scrolling, keyboard
 * navigation, Shift selection, drag selection, formula entry, relative autofill, column-border resize,
 * table sorting/filtering, conditional formatting and Undo all work through visible controls.
 * Rich ribbon, sheet navigation, workspace/project list, activity notes and populated Forecast/Notes
 * are shared across scenarios. Header row stays frozen during wheel/scrollbar navigation. Icon artwork
 * is inline SVG; the canvas reuses those SVG paths through Path2D, without per-cell DOM or image loads.
 * Only the fixed workbook frame is an anchor. No timers, observers or external assets.
 */
(function () {
  'use strict';
  const CSS = `
  .as-book { position:absolute; inset:10px; min-width:0; display:flex; flex-direction:column; overflow:hidden;
    border:1px solid var(--line); border-radius:8px; background:var(--panel); color:var(--fg); font:12px/1.3 Arial,sans-serif;
    box-shadow:0 4px 20px #00000012; --sheet-accent:var(--accent); }
  .as-book.as-canvas { inset:7px; border-radius:3px; --sheet-accent:#20856a; }
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
  .as-input { width:100%; min-width:0; background:var(--panel); border:1px solid var(--line); color:var(--fg); padding:6px 8px; font:12px Arial,sans-serif; user-select:text; }
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
  .as-book { font-family:Arial,sans-serif; border-radius:5px; }
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
  .as-grid { min-width:0; font-size:11px; font-variant-numeric:tabular-nums; }
  .as-cell { padding:0 5px; } .as-cell.tablehead { border-bottom:2px solid var(--muted); }
  .as-cell .as-icon { width:10px; height:10px; margin-left:auto; } .as-cell .as-pill { border-radius:3px; padding:1px 5px; font-size:10px; }
  .as-error { color:#d14848; } .as-error::after { content:''; position:absolute; right:1px; top:1px; border-top:5px solid #d14848; border-left:5px solid transparent; }
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
  const colors = { red: ['#fce3e3', '#852828'], green: ['#daf1e2', '#195a36'], blue: ['#dfebff', '#214d8c'] };
  function makeWidget(name) {
    let locate;
    return {
      task: 'use-spreadsheet', site: 'base', name, split: 'train', scenarios: ['fillhandle', 'range', 'formula', 'sort', 'filter', 'condfmt'],
      render(ctx) {
        const F = env.taskDef, U = ctx.util, s = ctx.spec, isCanvas = name === 'canvas';
        ctx.css('app-sheet', CSS);
        const book = U.el('div', `as-book${isCanvas ? ' as-canvas' : ''}`, ctx.stage);
        book.classList.toggle('as-short', ctx.size.height < 430);
        book.classList.toggle('as-roomy', ctx.size.width >= 1180);
        book.classList.toggle('as-wide', ctx.size.width >= 1380);
        book.classList.toggle('as-compact', ctx.size.width < 800);
        const controls = {}, optionEls = {}, opEls = {}, colorEls = {};
        const icon = (parent, key, size = 16) => {
          const svg = U.svg('svg', { viewBox: '0 0 20 20', width: size, height: size, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true', class: 'as-icon' }, parent);
          U.svg('path', { d: ICONS[key] || ICONS.sheet }, svg); return svg;
        };
        const button = (p, text, key, fn, cls = '', glyph) => {
          const e = U.el('button', 'as-btn ' + cls, p, text); e.type = 'button'; e.addEventListener('click', fn);
          if (key) controls[key] = e;
          if (glyph) { const v = icon(e, glyph); e.insertBefore(v, e.firstChild); }
          if (!text) { e.setAttribute('aria-label', key || glyph); e.title = key || glyph; }
          return e;
        };
        const info = (title, text) => {
          popover.replaceChildren(); U.el('strong', '', popover, title); U.el('p', '', popover, text);
          button(popover, 'Close', null, () => { popover.hidden = true; }); popover.hidden = false;
        };
        const title = U.el('div', 'as-title', book);
        icon(U.el('div', 'as-logo', title), 'sheet');
        const heading = U.el('div', 'as-heading', title);
        U.el('b', '', heading, isCanvas ? s.title.replace('Operations', 'Planning workbook') : s.title);
        U.el('small', '', heading, isCanvas ? 'Workspace / Finance / Shared workbooks' : 'Team drive  /  Workbooks  /  Monthly operations');
        icon(U.el('span', 'as-saved', title, 'Saved to workspace'), 'check');
        button(title, '', 'Comments', () => info('Comments (3)', `${s.cells[2][1]}: Please check the revised quantities before the month-end review.`), '', 'comment');
        button(title, '', 'Notifications', () => info('Notifications', `${s.cells[3][1]} shared the Budget workbook. The vendor review has 2 new comments.`), '', 'bell');
        button(title, 'Share', null, () => info('People with access', `${s.cells[1][1]} and ${s.cells[2][1]} can edit. Workspace members can view.`), 'as-share', 'users');
        U.el('span', 'as-avatar', title, String(s.cells[1][1]).slice(0, 1));
        const nav = U.el('div', 'as-nav', book);
        for (const t of isCanvas ? ['File', 'Edit', 'View', 'Insert', 'Format', 'Data', 'Tools', 'Extensions', 'Help'] : ['Home', 'Insert', 'Page layout', 'Formulas', 'Data', 'Review', 'View', 'Help']) U.el('span', '', nav, t);
        const tools = U.el('div', 'as-tools', book);
        const group = (label, cls = '') => { const g = U.el('div', 'as-group ' + cls, tools), r = U.el('div', 'as-toolrow', g), r2 = U.el('div', 'as-toolrow', g); U.el('small', '', g, label); return [r, r2]; };
        const [edits, edits2] = group('Clipboard');
        const undo = button(edits, '', 'undo', () => {
          const m = ctx.model; if (!m.history.length) return;
          const n = U.clone(m), old = n.history.pop(); Object.assign(n, old); update(n);
        }, '', 'undo'); undo.title = 'Undo (Ctrl+Z)';
        button(edits, '', 'Version history', () => info('Version history', 'Current version: Operations review. Previous version: Vendor quantities updated.'), '', 'clock');
        button(edits2, 'Paste', null, () => info('Clipboard', 'Use the formula bar to enter a value or formula. Existing cells remain editable.'), '', 'sheet');
        const style = (key, value) => update({ ...ctx.model, sheetStyle: { ...(ctx.model.sheetStyle || {}), [key]: value } });
        const pick = (parent, text, fn, cls = '') => { const e = button(parent, text, null, fn, 'as-pick ' + cls); icon(e, 'down', 11); return e; };
        const [fonts, fontStyles] = group('Font', 'as-fontgroup');
        const fontPick = pick(fonts, 'Arial', () => style('font', ctx.model.sheetStyle?.font === 'Georgia' ? 'Arial' : 'Georgia'));
        pick(fonts, '10', () => style('large', !ctx.model.sheetStyle?.large));
        for (const [label, key] of [['B', 'bold'], ['I', 'italic'], ['U', 'underline']]) { const b = button(fontStyles, label, null, () => style(key, !ctx.model.sheetStyle?.[key])); b.title = key; }
        button(fontStyles, '', 'Borders', () => style('borders', !ctx.model.sheetStyle?.borders), '', 'border');
        const [align, merge] = group('Alignment', 'as-optional');
        button(align, '', 'Align left', () => style('align', 'left'), '', 'align');
        button(align, '', 'Wrap text', () => info('Wrap text', 'Row heights are fixed for this imported orders table.'), '', 'list');
        const mergeButton = button(merge, 'Merge', null, () => {}, '', 'merge'); mergeButton.disabled = true; mergeButton.title = 'Cells in an orders table cannot be merged';
        const [numbers, decimals] = group('Number');
        const numberPick = pick(numbers, 'Number', () => style('format', ctx.model.sheetStyle?.format === 'general' ? 'number' : 'general'));
        button(decimals, '$', null, () => style('currency', !ctx.model.sheetStyle?.currency));
        button(decimals, '%', null, () => style('percent', !ctx.model.sheetStyle?.percent));
        button(decimals, '.00', null, () => style('decimals', !ctx.model.sheetStyle?.decimals));
        const [formats, dataTools] = group('Styles & data', 'as-formatgroup');
        const conditional = button(formats, 'Conditional format', 'condfmt', () => {
          const m = U.clone(ctx.model); m.dialog = true; m.menu = null;
          m.draft = m.rule ? { ...U.clone(m.rule), range: F.helpers.rangeName(m.rule.range), threshold: String(m.rule.threshold) } : { range: F.helpers.rangeName(m.selection), op: '>', threshold: '', color: 'red' };
          update(m);
        }, '', 'paint'); icon(conditional, 'down', 11);
        button(dataTools, 'Clear filter', 'clearFilter', () => commit(F.helpers.transition(ctx.model, s, 'clearFilter')), '', 'filter');
        button(dataTools, 'Functions', null, () => info('Functions', 'SUM(range)  /  AVERAGE(range)  /  MIN(range)  /  MAX(range)  /  COUNT(range). Start a formula with = in the formula bar.'), '', 'fx');
        const [tableTools, viewTools] = group('Table tools', 'as-ribbonextra');
        button(tableTools, 'Format as table', null, () => style('borders', !ctx.model.sheetStyle?.borders), '', 'grid');
        button(viewTools, 'Freeze row 1', null, () => info('Freeze panes', 'Row 1 is frozen. Table headings stay visible while you work with the records below.'), '', 'freeze');
        const [findTools, reviewTools] = group('Editing', 'as-ribbonextra');
        button(findTools, 'Find & select', null, () => info('Find in workbook', 'Use the name box to go to a cell address or select a range in the current sheet.'), '', 'search');
        button(reviewTools, 'Sort & filter', null, () => update({ ...ctx.model, menu: { col: ctx.model.selection[1] } }), '', 'filter');
        const fbar = U.el('div', 'as-fbar', book);
        const nameBox = U.el('input', 'as-name', fbar); nameBox.setAttribute('aria-label', 'Name box');
        const sheetCell = (p, m = ctx.model) => [m.sort && p[0] > 0 && p[0] <= s.n ? m.order.indexOf(p[0]) + 1 : p[0], p[1]];
        const sourceCell = (p) => [ctx.model.sort && p[0] > 0 && p[0] <= s.n ? ctx.model.order[p[0] - 1] : p[0], p[1]];
        const formulaSource = (value) => ctx.model.sort && value.startsWith('=') ? F.helpers.translate(value, ctx.model.selection[0] - sheetCell(ctx.model.selection.slice(0, 2))[0], 0) : value;
        nameBox.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const a = F.helpers.parseRange(nameBox.value); if (a && a[2] < ctx.model.cells.length && a[3] < 8) update({ ...ctx.model, selection: [...sourceCell(a.slice(0, 2)), ...sourceCell(a.slice(2))] }); grid.focus(); } });
        button(fbar, '', 'commit', () => { if (ctx.model.editing) commit(F.helpers.transition(ctx.model, s, 'formula', formulaSource(formula.value))); }, '', 'check');
        icon(U.el('span', 'as-fx', fbar), 'fx');
        const formula = U.el('input', 'as-input as-formula', fbar); formula.spellcheck = false; formula.setAttribute('aria-label', 'Formula bar'); controls.formula = formula;
        formula.addEventListener('input', () => update({ ...ctx.model, editing: true, formulaDraft: formula.value }));
        formula.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') { e.preventDefault(); commit(F.helpers.transition(ctx.model, s, 'formula', formulaSource(formula.value))); grid.focus(); }
          if (e.key === 'Escape') { update({ ...ctx.model, editing: false, formulaDraft: '' }); grid.focus(); }
        });
        const context = U.el('div', 'as-context', book); icon(context, 'grid', 12); U.el('strong', '', context, 'Orders register');
        const tableInfo = U.el('span', '', context, `${s.n} records / USD`);
        const frozen = U.el('span', 'as-frozen', context, 'Row 1 frozen'); icon(frozen, 'freeze', 12);
        const workarea = U.el('div', 'as-workarea', book), workspace = U.el('aside', 'as-workspace', workarea);
        U.el('div', 'as-sideheading', workspace, 'Workspace');
        for (const [glyph, label, active] of [['folder', 'Workbooks', true], ['clock', 'Recent', false], ['star', 'Starred', false], ['users', 'Shared with me', false], ['comment', 'Comments', false]]) {
          const item = U.el('div', `as-sideitem${active ? ' active' : ''}`, workspace); icon(item, glyph); U.el('span', '', item, label); item.title = label;
        }
        const projects = U.el('div', 'as-projects', workspace); U.el('div', 'as-sideheading', projects, 'Finance / Planning');
        for (const [label, cls] of [['Operations', 'current'], ['Quarterly budget', ''], ['Vendor review', ''], ['Headcount plan', ''], ['Stock reconciliation', '']]) U.el('p', cls, projects, label);
        U.el('div', 'as-sideheading', projects, 'Shared drives'); U.el('p', '', projects, 'Procurement'); U.el('p', '', projects, 'Month-end close');
        const grid = U.el('div', 'as-grid', workarea); grid.tabIndex = 0; grid.setAttribute('aria-label', isCanvas ? 'Worksheet canvas. Use formula bar to edit selected cell.' : 'Worksheet grid');
        grid.setAttribute('role', isCanvas ? 'img' : 'grid');
        const canvas = isCanvas ? U.el('canvas', '', grid) : null;
        const activity = U.el('aside', 'as-activity', workarea); U.el('h4', '', activity, 'Workbook activity');
        for (const [who, what, when] of [[s.cells[1][1], 'Updated the forecast assumptions to include the next delivery cycle.', '12 min ago'], [s.cells[2][1], 'Added a comment to Vendor review: confirm the payment terms.', '38 min ago'], [s.cells[3][1], 'Shared Quarterly budget with the Finance team.', 'Earlier today']]) {
          const a = U.el('article', '', activity); U.el('strong', '', a, who); U.el('p', '', a, what); U.el('small', '', a, when);
        }
        const bottom = U.el('div', 'as-bottom', book);
        button(bottom, '', 'Sheet list', () => info('Sheets in this workbook', 'Orders, Summary, Budget, Vendors, Lookups and Archive.'), '', 'list');
        for (const label of [s.sheet, 'Summary', 'Budget', 'Vendors', 'Lookups', 'Archive']) {
          const tab = button(bottom, label, null, () => label === s.sheet ? (popover.hidden = true) : info(label + ' worksheet', label === 'Vendors' ? 'Vendor directory / Contract owner / Payment terms / Review date. Shared with the Procurement team.' : `${label} is a reference worksheet in this workbook. The current orders register remains open.`), 'as-tab' + (label === s.sheet ? ' active' : ''));
          tab.setAttribute('role', 'tab'); tab.setAttribute('aria-selected', label === s.sheet ? 'true' : 'false');
        }
        button(bottom, '', 'Add sheet', () => info('New worksheet', 'New worksheets are managed by workspace owners. You can edit the existing orders register.'), '', 'plus');
        const zoom = U.el('span', 'as-saved', bottom); icon(zoom, 'minus', 12); U.el('span', '', zoom, '100%'); icon(zoom, 'plus', 12); zoom.title = 'Workbook zoom';
        const status = U.el('div', 'as-status', book);
        const ready = U.el('span', '', status, 'Ready'), count = U.el('span', '', status), sum = U.el('span', '', status), records = U.el('span', '', status), total = U.el('span', 'as-total', status);
        icon(U.el('span', 'as-statusmark', status, 'Saved'), 'check', 11);
        const popover = U.el('aside', 'as-popover', book); popover.hidden = true;
        const menu = U.el('div', 'as-menu', book); menu.hidden = true;
        const shade = U.el('div', 'as-shade', book); shade.hidden = true;
        const dialog = U.el('div', 'as-dialog', shade); dialog.setAttribute('role', 'dialog'); dialog.setAttribute('aria-label', 'Conditional formatting');
        U.el('h3', '', dialog, 'Conditional formatting'); U.el('p', '', dialog, 'Highlight cells that match a rule.');
        function field(label, key) { const l = U.el('label', '', dialog, label), e = U.el('input', 'as-input', dialog); e.id = `as-${name}-${key}`; l.htmlFor = e.id; controls[key] = e; e.addEventListener('input', () => update({ ...ctx.model, draft: { ...ctx.model.draft, [key]: e.value } })); return e; }
        const rangeField = field('Apply to range', 'range');
        U.el('label', '', dialog, 'Format cells if'); const operators = U.el('div', 'as-choices', dialog);
        for (const [key, label] of [['>', 'Greater than'], ['<', 'Less than'], ['=', 'Equal to']]) opEls[key] = button(operators, label, null, () => update({ ...ctx.model, draft: { ...ctx.model.draft, op: key } }));
        const threshold = field('Value', 'threshold'); threshold.inputMode = 'decimal';
        U.el('label', '', dialog, 'Fill style'); const swatches = U.el('div', 'as-choices', dialog);
        for (const c of ['red', 'green', 'blue']) { colorEls[c] = button(swatches, c[0].toUpperCase() + c.slice(1), null, () => update({ ...ctx.model, draft: { ...ctx.model.draft, color: c } })); colorEls[c].style.background = colors[c][0]; colorEls[c].style.color = colors[c][1]; }
        const preview = U.el('div', 'as-preview', dialog, '123   Preview');
        const actions = U.el('div', 'as-actions', dialog);
        button(actions, 'Cancel', 'cancel', () => update({ ...ctx.model, dialog: false }));
        button(actions, 'Apply rule', 'apply', () => commit(F.helpers.transition(ctx.model, s, 'rule')), 'as-primary');
        let geometry, gesture = null, menuKey = '', suppressClick = false;
        const snapshot = (m) => ({ cells: U.clone(m.cells), order: [...m.order], sort: U.clone(m.sort), filter: U.clone(m.filter), rule: U.clone(m.rule) });
        function update(n) { ctx.update(n); draw(ctx.model); }
        function commit(n) { n.history = [...ctx.model.history.slice(-15), snapshot(ctx.model)]; update(n); }
        function calc() {
          const w = grid.clientWidth, h = grid.clientHeight, gutter = isCanvas ? 39 : 34, head = isCanvas ? 25 : 23, bar = 11;
          const row = Math.max(15, Math.min(isCanvas ? 24 : 22, Math.floor((h - head) / 8)));
          const base = (w - gutter - bar) / 8, weights = isCanvas ? [1.45, 1.25, .65, .9, 1, .9, .95, .9] : [1.55, 1.3, .65, .9, 1, .85, .95, .8];
          const weightSum = weights.reduce((a, b) => a + b, 0), widths = weights.map((x, c) => ctx.model.widths[c] || base * x * 8 / weightSum), xs = [gutter];
          for (const width of widths) xs.push(xs[xs.length - 1] + width);
          const rows = [0, ...F.helpers.visible(ctx.model, s), ...Array.from({ length: ctx.model.cells.length - s.n - 1 }, (_, i) => s.n + 1 + i)];
          return { w, h, gutter, head, bar, row, widths, xs, rows, capacity: Math.max(2, Math.floor((h - head) / row)) };
        }
        function cellBox(p) {
          const g = geometry, index = g.rows.indexOf(p[0]);
          return { x: g.xs[p[1]], y: g.head + (index === 0 ? 0 : index - ctx.model.scrollRow) * g.row, w: g.widths[p[1]], h: g.row };
        }
        function selectionBox() {
          const a = F.helpers.rect(ctx.model.selection), p = cellBox(a.slice(0, 2)), q = cellBox(a.slice(2));
          return { x: p.x, y: p.y, w: q.x + q.w - p.x, h: q.y + q.h - p.y };
        }
        function draw(m) {
          geometry = calc(); const g = geometry;
          if (m.visibleRows !== g.capacity - 1) { ctx.update({ ...m, visibleRows: g.capacity - 1 }); m = ctx.model; }
          const sel = F.helpers.rect(m.selection), stats = F.helpers.selectionStats(m, s);
          nameBox.value = F.helpers.rangeName([...sheetCell(sel.slice(0, 2), m), ...sheetCell(sel.slice(2), m)]);
          const st = m.sheetStyle || {};
          fontPick.firstChild.textContent = st.font || 'Arial';
          numberPick.firstChild.textContent = st.format === 'general' ? 'General' : 'Number';
          tableInfo.textContent = `${F.helpers.visible(m, s).length} of ${s.n} records / USD`;
          let raw = m.cells[m.selection[0]]?.[m.selection[1]] ?? '';
          if (m.sort && String(raw).startsWith('=')) raw = F.helpers.translate(raw, sheetCell(m.selection.slice(0, 2), m)[0] - m.selection[0], 0);
          if (document.activeElement !== formula || !m.editing) formula.value = m.editing ? m.formulaDraft : String(raw);
          ready.textContent = m.editing ? 'Editing' : m.filter ? 'Filter active' : 'Ready';
          count.textContent = `Numeric cells: ${stats.count}`; sum.textContent = `Sum: ${stats.sum}`;
          records.textContent = `Visible records: ${stats.records}`; total.textContent = `Amount total: ${stats.total}`;
          undo.disabled = !m.history.length; controls.clearFilter.disabled = !m.filter;
          if (isCanvas) paintCanvas(m); else paintDOM(m);
          drawMenu(m); shade.hidden = !m.dialog;
          if (m.dialog) {
            if (document.activeElement !== rangeField) rangeField.value = m.draft.range;
            if (document.activeElement !== threshold) threshold.value = m.draft.threshold;
            for (const op in opEls) opEls[op].classList.toggle('on', op === m.draft.op);
            for (const c in colorEls) colorEls[c].classList.toggle('on', c === m.draft.color);
            preview.style.background = colors[m.draft.color][0]; preview.style.color = colors[m.draft.color][1];
            const a = F.helpers.parseRange(m.draft.range); controls.apply.disabled = !a || a[2] >= m.cells.length || a[3] >= 8 || m.draft.threshold.trim() === '' || !Number.isFinite(+m.draft.threshold);
          }
        }
        function visual(m, p) {
          const value = F.helpers.evaluate(m.cells, p), inRule = m.rule && p[0] >= m.rule.range[0] && p[0] <= m.rule.range[2] && p[1] >= m.rule.range[1] && p[1] <= m.rule.range[3] && F.helpers.matches(value, m.rule.op, +m.rule.threshold);
          const st = m.sheetStyle || {};
          let text = F.helpers.display(value);
          if (typeof value === 'number' && st.format !== 'general') {
            const digits = st.decimals ? 3 : [3, 4, 6].includes(p[1]) ? 2 : 0;
            text = (st.percent ? value * 100 : value).toFixed(digits).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (st.percent ? '%' : '');
            if (st.currency && !st.percent) text = '$' + text;
          }
          return { text, numeric: typeof value === 'number', inRule, error: typeof value === 'string' && value.startsWith('#') };
        }
        function pieces(m, emit) {
          const g = geometry;
          emit(0, 0, g.w, g.head, '', 'header');
          for (let c = 0; c < 8; c++) emit(g.xs[c], 0, g.widths[c], g.head, F.helpers.addr([0, c]).replace(/\d/g, ''), 'letter', [0, c]);
          for (let slot = 0; slot < g.capacity + 1; slot++) {
            const index = slot === 0 ? 0 : slot + m.scrollRow;
            const r = g.rows[index]; if (r == null) break;
            const y = g.head + slot * g.row;
            emit(0, y, g.gutter, g.row, String(m.sort && r > 0 && r <= s.n ? m.order.indexOf(r) + 2 : r + 1), 'rowhead');
            for (let c = 0; c < 8; c++) {
              const v = visual(m, [r, c]);
              emit(g.xs[c], y, g.widths[c], g.row, v.text, r === 0 ? 'tablehead' : v.inRule ? 'conditional' : v.error ? 'error' : c === 5 && r <= s.n ? 'status' : v.numeric ? 'number' : 'cell', [r, c]);
            }
          }
        }
        function paintDOM(m) {
          grid.replaceChildren(); const g = geometry;
          const add = (x, y, w, h, text, type, p) => {
            const el = U.el('div', 'as-cell', grid); Object.assign(el.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
            const st = m.sheetStyle || {};
            if (p && p[0] > 0) { el.style.fontFamily = st.font || 'Arial'; el.style.fontWeight = st.bold ? 'bold' : ''; el.style.fontStyle = st.italic ? 'italic' : ''; el.style.textDecoration = st.underline ? 'underline' : ''; if (st.large) el.style.fontSize = '12px'; if (st.borders) el.style.borderColor = 'var(--muted)'; }
            if (type === 'header' || type === 'letter' || type === 'rowhead') { el.style.background = 'color-mix(in srgb,var(--fg) 5%,var(--panel))'; el.style.color = 'var(--muted)'; el.style.justifyContent = 'center'; }
            if (type === 'tablehead') { el.classList.add('tablehead'); el.style.fontWeight = 'bold'; el.style.background = 'color-mix(in srgb,var(--sheet-accent) 9%,var(--panel))'; }
            if (type === 'number') el.style.justifyContent = 'flex-end';
            if (type === 'conditional') { el.style.background = colors[m.rule.color][0]; el.style.color = colors[m.rule.color][1]; el.style.justifyContent = 'flex-end'; }
            const label = U.el('span', type === 'status' ? 'as-pill' : '', el, text);
            if (type === 'status') { const tone = text === 'Paid' ? '#2d8a62' : text === 'Review' ? '#b68429' : '#487ac1'; label.style.background = `color-mix(in srgb,${tone} 14%,var(--panel))`; }
            if (type === 'error') { el.classList.add('as-error'); el.title = 'Formula error: check references in the formula bar'; }
            if (p && type === 'tablehead') icon(el, m.sort?.col === p[1] ? m.sort.dir : m.filter?.col === p[1] ? 'filter' : 'down', 10);
            if (p) { el.setAttribute('role', p[0] === 0 ? 'columnheader' : 'gridcell'); el.setAttribute('aria-label', `${F.helpers.addr(p)} ${text}`); }
          };
          pieces(m, add);
          const b = selectionBox();
          if (b.y + b.h >= g.head + g.row && b.y < g.h) {
            const selection = U.el('div', 'as-selection', grid);
            Object.assign(selection.style, { left: b.x + 'px', top: Math.max(g.head + g.row, b.y) + 'px', width: b.w + 'px', height: Math.min(g.h, b.y + b.h) - Math.max(g.head + g.row, b.y) + 'px' });
            const handle = U.el('div', 'as-handle', grid); Object.assign(handle.style, { left: b.x + b.w - 4 + 'px', top: b.y + b.h - 4 + 'px' });
          }
          const bar = U.el('div', '', grid), thumb = scrollbar(m);
          Object.assign(bar.style, { position: 'absolute', left: g.w - g.bar + 'px', top: thumb.y + 'px', width: '8px', height: thumb.h + 'px', background: 'var(--muted)', borderRadius: '4px', opacity: '.45', pointerEvents: 'none' });
        }
        function scrollbar(m) {
          const g = geometry, track = g.h - g.head - g.row, totalRows = Math.max(1, g.rows.length - 1), h = Math.max(22, track * Math.min(1, (g.capacity - 1) / totalRows));
          return { y: g.head + g.row + (track - h) * m.scrollRow / Math.max(1, totalRows - (g.capacity - 1)), h };
        }
        function paintCanvas(m) {
          const g = geometry, dpr = window.devicePixelRatio || 1;
          canvas.width = Math.round(g.w * dpr); canvas.height = Math.round(g.h * dpr); canvas.style.width = g.w + 'px'; canvas.style.height = g.h + 'px';
          const p = canvas.getContext('2d'), css = getComputedStyle(book), fg = css.getPropertyValue('--fg').trim(), panel = css.getPropertyValue('--panel').trim(), line = css.getPropertyValue('--line').trim(), muted = css.getPropertyValue('--muted').trim(), accent = css.getPropertyValue('--sheet-accent').trim();
          p.scale(dpr, dpr); p.fillStyle = panel; p.fillRect(0, 0, g.w, g.h);
          pieces(m, (x, y, w, h, text, type, pos) => {
            p.save(); p.beginPath(); p.rect(x, y, w, h); p.clip();
            const header = ['header', 'letter', 'rowhead', 'tablehead'].includes(type);
            p.fillStyle = type === 'conditional' ? colors[m.rule.color][0] : panel; p.fillRect(x, y, w, h);
            if (header) { p.globalAlpha = type === 'tablehead' ? .13 : .07; p.fillStyle = type === 'tablehead' ? accent : fg; p.fillRect(x, y, w, h); p.globalAlpha = 1; }
            p.strokeStyle = line; p.lineWidth = 1; p.strokeRect(x + .5, y + .5, w, h);
            const st = m.sheetStyle || {};
            p.font = `${st.italic && !header ? 'italic ' : ''}${type === 'tablehead' || (st.bold && !header) ? 'bold ' : ''}${st.large && !header ? 12 : 11}px ${header ? 'Arial' : st.font || 'Arial'}`; p.textBaseline = 'middle';
            p.fillStyle = type === 'conditional' ? colors[m.rule.color][1] : type === 'error' ? '#d14848' : header && type !== 'tablehead' ? muted : fg;
            p.textAlign = type === 'number' || type === 'conditional' ? 'right' : type === 'letter' || type === 'rowhead' ? 'center' : 'left';
            const tx = p.textAlign === 'right' ? x + w - 8 : p.textAlign === 'center' ? x + w / 2 : x + 7;
            const limit = w - (type === 'tablehead' ? 23 : 12);
            let t = text;
            if (p.measureText(t).width > limit) { while (t.length && p.measureText(t + '...').width > limit) t = t.slice(0, -1); t += '...'; }
            if (type === 'status') { p.save(); p.fillStyle = text === 'Paid' ? '#2d8a62' : text === 'Review' ? '#b68429' : '#487ac1'; p.globalAlpha = .18; p.fillRect(x + 4, y + 3, Math.min(w - 8, p.measureText(t).width + 10), h - 6); p.restore(); }
            p.fillText(t, tx, y + h / 2);
            if (type === 'tablehead') {
              p.save(); p.translate(x + w - 17, y + h / 2 - 6); p.scale(.6, .6); p.strokeStyle = muted; p.lineWidth = 1.7;
              p.stroke(new Path2D(ICONS[m.sort?.col === pos[1] ? m.sort.dir : m.filter?.col === pos[1] ? 'filter' : 'down'])); p.restore();
            }
            if (type === 'error') { p.strokeStyle = '#d14848'; p.lineWidth = 3; p.beginPath(); p.moveTo(x + w - 6, y + 2); p.lineTo(x + w - 2, y + 2); p.lineTo(x + w - 2, y + 6); p.stroke(); }
            if (st.underline && !header) { p.strokeStyle = p.fillStyle; p.beginPath(); p.moveTo(x + 5, y + h - 4); p.lineTo(x + w - 5, y + h - 4); p.stroke(); }
            p.restore();
          });
          p.strokeStyle = muted; p.lineWidth = 2; p.beginPath(); p.moveTo(0, g.head + g.row); p.lineTo(g.w, g.head + g.row); p.stroke();
          const b = selectionBox();
          p.save(); p.beginPath(); p.rect(g.gutter, g.head + g.row, g.w - g.gutter, g.h - g.head - g.row); p.clip();
          p.fillStyle = accent; p.globalAlpha = .09; p.fillRect(b.x, b.y, b.w, b.h); p.globalAlpha = 1;
          p.strokeStyle = accent; p.lineWidth = 2; p.strokeRect(b.x + 1, b.y + 1, b.w - 1, b.h - 1); p.fillStyle = accent; p.fillRect(b.x + b.w - 4, b.y + b.h - 4, 7, 7); p.restore();
          const thumb = scrollbar(m); p.fillStyle = panel; p.fillRect(g.w - 11, 0, 11, g.h); p.globalAlpha = .4; p.fillStyle = muted; p.fillRect(g.w - 8, thumb.y, 5, thumb.h); p.globalAlpha = 1;
        }
        function drawMenu(m) {
          menu.hidden = !m.menu;
          if (!m.menu) { menuKey = ''; return; }
          const key = String(m.menu.col);
          if (menuKey !== key) {
            menuKey = key; menu.replaceChildren(); Object.keys(optionEls).forEach((k) => delete optionEls[k]);
            U.el('small', '', menu, `${F.helpers.addr([0, m.menu.col]).replace(/\d/g, '')} · ${s.cells[0][m.menu.col]}`);
            button(menu, 'Sort ascending', 'asc', () => commit(F.helpers.transition(ctx.model, s, 'sort', 'asc')), '', 'asc');
            button(menu, 'Sort descending', 'desc', () => commit(F.helpers.transition(ctx.model, s, 'sort', 'desc')), '', 'desc');
            U.el('hr', '', menu); U.el('small', '', menu, 'Filter · Show only');
            const values = [...new Set(s.cells.slice(1, s.n + 1).map((r) => String(r[m.menu.col])))];
            for (const value of values.slice(0, 8)) optionEls[value] = button(menu, value, null, () => commit(F.helpers.transition(ctx.model, s, 'filter', value)));
            button(menu, 'Show all records', null, () => commit(F.helpers.transition(ctx.model, s, 'clearFilter')));
          }
          const gr = grid.getBoundingClientRect(), br = book.getBoundingClientRect();
          menu.style.left = Math.max(5, Math.min(book.clientWidth - 220, gr.left - br.left + geometry.xs[m.menu.col])) + 'px';
          menu.style.top = gr.top - br.top + geometry.head + 'px';
        }
        function local(e) { const r = grid.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
        function hit(x, y) {
          const g = geometry;
          let c = g.xs.findIndex((left, i) => i < 8 && x >= left && x < g.xs[i + 1]);
          if (c < 0) c = x < g.gutter ? 0 : 7;
          const slot = Math.max(0, Math.floor((y - g.head) / g.row)), index = slot === 0 ? 0 : slot + ctx.model.scrollRow;
          return [g.rows[Math.min(g.rows.length - 1, index)], c];
        }
        function select(p, shift = false) {
          let m = ctx.model;
          if (m.editing) { commit(F.helpers.transition(m, s, 'formula', formulaSource(formula.value))); m = ctx.model; }
          const anchor = shift ? m.selection.slice(0, 2) : p;
          update({ ...m, selection: [...anchor, ...p], menu: null, editing: false });
        }
        grid.addEventListener('pointerdown', (e) => {
          if (e.button !== 0) return;
          e.preventDefault(); grid.focus(); const [x, y] = local(e), g = geometry, b = selectionBox();
          const colEdge = g.xs.findIndex((edge, i) => i > 0 && i <= 8 && Math.abs(edge - x) < 5);
          if (x > g.w - g.bar) gesture = { kind: 'scroll', start: y, offset: ctx.model.scrollRow };
          else if (y < g.head && colEdge > 0 && colEdge < 8) gesture = { kind: 'resize', col: colEdge - 1, start: x, width: g.widths[colEdge - 1], neighbor: g.widths[colEdge] };
          else if (y < g.head + g.row) { const p = hit(x, y); update({ ...ctx.model, menu: ctx.model.menu?.col === p[1] ? null : { col: p[1] } }); return; }
          else if (Math.abs(x - b.x - b.w) < 8 && Math.abs(y - b.y - b.h) < 8) gesture = { kind: 'fill', seed: U.clone(ctx.model.selection), end: hit(x, y) };
          else { const p = hit(x, y); select(p, e.shiftKey); gesture = { kind: 'select', start: ctx.model.selection.slice(0, 2), end: p }; }
          grid.setPointerCapture(e.pointerId);
        });
        grid.addEventListener('pointermove', (e) => {
          const [x, y] = local(e), g = geometry;
          if (!gesture) { const b = selectionBox(); grid.style.cursor = Math.abs(x - b.x - b.w) < 8 && Math.abs(y - b.y - b.h) < 8 ? 'crosshair' : y < g.head && g.xs.some((edge) => Math.abs(edge - x) < 5) ? 'col-resize' : y < g.head + g.row ? 'pointer' : 'cell'; return; }
          if (gesture.kind === 'resize') {
            const next = Math.max(40, Math.min(gesture.width + gesture.neighbor - 40, gesture.width + x - gesture.start));
            update({ ...ctx.model, widths: { ...ctx.model.widths, [gesture.col]: next, [gesture.col + 1]: gesture.neighbor + gesture.width - next } });
          } else if (gesture.kind === 'scroll') scrollTo(gesture.offset + Math.round((y - gesture.start) * g.rows.length / Math.max(1, g.h - g.head)));
          else {
            if (y > g.h - 5) scrollTo(ctx.model.scrollRow + 1); else if (y < g.head + g.row && ctx.model.scrollRow > 0) scrollTo(ctx.model.scrollRow - 1);
            gesture.end = hit(x, Math.max(g.head + g.row, Math.min(g.h - 2, y)));
            if (gesture.kind === 'select') update({ ...ctx.model, selection: [...gesture.start, ...gesture.end] });
          }
        });
        grid.addEventListener('pointerup', (e) => {
          if (!gesture) return;
          const done = gesture; gesture = null;
          if (grid.hasPointerCapture(e.pointerId)) grid.releasePointerCapture(e.pointerId);
          if (done.kind === 'fill') { const [x, y] = local(e), end = hit(x, y), seed = F.helpers.rect(done.seed);
            const right = Math.abs(end[1] - seed[3]) > Math.abs(end[0] - seed[2]);
            const p = right ? [seed[0], Math.max(seed[3], end[1])] : [Math.max(seed[2], end[0]), seed[1]];
            commit(F.helpers.fill(ctx.model, { ...s, cells: ctx.model.cells }, p));
          }
          suppressClick = true;
        });
        grid.addEventListener('pointercancel', () => { gesture = null; });
        grid.addEventListener('click', (e) => {
          if (suppressClick) { suppressClick = false; return; }
          if (U.clickCount(e) >= 2) { formula.focus(); formula.select(); }
        });
        grid.addEventListener('dblclick', (e) => { const [x, y] = local(e); if (y > geometry.head + geometry.row) { formula.focus(); formula.select(); } });
        grid.addEventListener('contextmenu', (e) => { e.preventDefault(); const [x, y] = local(e); update({ ...ctx.model, menu: { col: hit(x, y)[1] } }); });
        function scrollTo(row) {
          const g = geometry, max = Math.max(0, g.rows.length - g.capacity);
          update({ ...ctx.model, scrollRow: Math.max(0, Math.min(max, row)) });
        }
        grid.addEventListener('wheel', (e) => { e.preventDefault(); scrollTo(ctx.model.scrollRow + Math.sign(e.deltaY) * Math.max(1, Math.round(Math.abs(e.deltaY) / geometry.row))); }, { passive: false });
        grid.addEventListener('keydown', (e) => {
          const m = ctx.model, p = m.selection.slice(2);
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); undo.click(); return; }
          const dirs = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1], Tab: [0, e.shiftKey ? -1 : 1] };
          if (dirs[e.key]) { e.preventDefault(); const d = dirs[e.key]; p[0] = Math.max(1, Math.min(m.cells.length - 1, p[0] + d[0])); p[1] = Math.max(0, Math.min(7, p[1] + d[1])); select(p, e.shiftKey && e.key !== 'Tab');
            const i = geometry.rows.indexOf(p[0]); if (i <= ctx.model.scrollRow) scrollTo(i - 1); else if (i >= ctx.model.scrollRow + geometry.capacity) scrollTo(i - geometry.capacity + 1);
          } else if (e.key === 'Enter' || e.key === 'F2') { e.preventDefault(); formula.focus(); formula.select(); }
          else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); const n = U.clone(m), a = F.helpers.rect(m.selection); for (let r = a[0]; r <= a[2]; r++) for (let c = a[1]; c <= a[3]; c++) n.cells[r][c] = ''; commit(n); }
          else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); formula.focus(); formula.value = e.key; update({ ...m, editing: true, formulaDraft: e.key }); formula.setSelectionRange(1, 1); }
        });
        book.addEventListener('pointerdown', (e) => { if (ctx.model.menu && !menu.contains(e.target) && !grid.contains(e.target)) update({ ...ctx.model, menu: null }); });
        locate = (t) => {
          if (t.control) return U.center(controls[t.control]);
          if (t.option != null) return U.center(optionEls[t.option]);
          if (t.operator) return U.center(opEls[t.operator]);
          if (t.color) return U.center(colorEls[t.color]);
          const g = geometry, r = grid.getBoundingClientRect();
          if (t.pane) return [r.left + g.w / 2, r.top + g.h / 2];
          if (t.header != null) return [r.left + g.xs[t.header] + g.widths[t.header] / 2, r.top + g.head / 2];
          if (t.handle) { const b = selectionBox(); return [r.left + b.x + b.w - 1, r.top + b.y + b.h - 1]; }
          const b = cellBox(t.cell || t.fillEnd);
          return [r.left + b.x + b.w / 2, r.top + b.y + b.h / 2];
        };
        draw(ctx.model);
        return { anchors: [book], sync: () => draw(ctx.model) };
      },
      locate: (t) => locate(t),
    };
  }
  env.widget(makeWidget('classic'));
  env.widget(makeWidget('canvas'));
})();
