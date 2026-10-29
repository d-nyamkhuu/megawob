/* base / use-legacy-app / classic: host emulator, desktop record workbench,
 * transaction client and property sheets. Host fields are custom keyboard-only
 * editors on an 80-column / 24-row grid (protected output has no input control).
 * Desktop widgets use native text inputs and local DOM menus/value-help, with
 * fixed outer geometry and scrolling directory/audit panes. No external assets.
 */
(function () {
  'use strict';
  let current = null;
  let keyHandler = null;
  const ICONS = {
    save: 'M2 1h10l3 3v11H1V1h1zm2 0v5h7V1M4 15V9h8v6',
    folder: 'M1 4V2h5l2 2h7v10H1V4zm0 2h14',
    file: 'M3 1h7l3 3v11H3V1zm7 0v4h3M5 8h6M5 11h5',
    tree: 'M2 2h3v3H2zm9 9h3v3h-3zM3.5 5v7.5H11M7 2h7M7 5h5',
    back: 'M7 3L2 8l5 5M2 8h9a3 3 0 0 1 3 3v2',
    refresh: 'M13 5A6 6 0 1 0 14 10M13 1v4H9',
    search: 'M10.5 10.5l4 4M12 7A5 5 0 1 1 2 7a5 5 0 0 1 10 0',
    print: 'M4 5V1h8v4M4 12H1V5h14v7h-3M4 9h8v6H4V9zM12 7h1',
    help: 'M6 5a2 2 0 1 1 3 2c-1 1-1 1-1 3M8 12v1M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0',
    check: 'M2 8l4 4L14 3',
    close: 'M3 3l10 10M13 3L3 13',
    min: 'M3 12h10', max: 'M3 3h10v10H3V3z',
    right: 'M6 3l5 5-5 5', down: 'M3 6l5 5 5-5', up: 'M3 10l5-5 5 5',
    link: 'M6 10L4 12a3 3 0 0 1-4-4l3-3a3 3 0 0 1 4 0m3 1 2-2a3 3 0 0 1 4 4l-3 3a3 3 0 0 1-4 0M5 11l6-6',
    warn: 'M8 1l7 13H1L8 1zm0 4v4m0 2v1',
    grid: 'M1 2h14v12H1V2zm0 4h14M6 2v12M11 2v12',
    clock: 'M8 4v4l3 2M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0',
    lock: 'M4 7V4a4 4 0 0 1 8 0v3M2 7h12v8H2V7zm6 3v2',
  };
  const CSS = `
  .lg { position:relative; flex:none; display:flex; flex-direction:column; overflow:hidden;
    border:1px solid var(--line); background:var(--bg); color:var(--fg); font:12px/1.35 Arial,sans-serif;
    box-shadow:0 10px 28px #0003; --lg-face:color-mix(in srgb,var(--panel) 45%,var(--line)); }
  .lg * { box-sizing:border-box; }
  .lg [hidden] { display:none !important; }
  .lg button { font:inherit; color:inherit; cursor:pointer; }
  .lg button:focus-visible { outline:2px solid var(--accent); outline-offset:-3px; }
  .lg-title { flex:none; display:flex; align-items:center; justify-content:space-between; gap:8px;
    height:29px; padding:0 9px; background:var(--accent); color:#fff; font-weight:bold; }
  .lg-sys { font:11px monospace; letter-spacing:6px; opacity:.9; }
  .lg-menu { flex:none; height:25px; display:flex; align-items:center; gap:2px; padding:1px 5px;
    border-bottom:1px solid var(--line); background:var(--lg-face); }
  .lg-menu button { border:0; background:transparent; padding:2px 9px; }
  .lg-menu button:hover { background:var(--accent); color:#fff; }
  .lg-tools { flex:none; display:flex; align-items:center; gap:5px; min-height:32px; padding:3px 7px;
    border-bottom:1px solid var(--line); background:var(--lg-face); }
  .lg-btn { min-height:24px; padding:2px 10px; border:1px solid var(--muted); border-radius:0;
    background:var(--lg-face); box-shadow:inset 1px 1px color-mix(in srgb,var(--panel) 85%,transparent),inset -1px -1px #0003; }
  .lg-btn:active { box-shadow:inset 1px 1px #0005; }
  .lg-btn:disabled { color:var(--muted); cursor:default; opacity:.6; }
  .lg-sep { border-left:1px solid var(--muted); height:21px; margin:0 4px; }
  .lg-small { color:var(--muted); font-size:11px; }
  .lg-work { flex:1; display:flex; min-height:0; overflow:hidden; }
  .lg-tree { flex:none; width:154px; padding:9px 5px; border-right:2px ridge var(--line); background:var(--panel); overflow:auto; scrollbar-width:thin; }
  .lg-tree button { display:block; width:100%; border:0; background:transparent; text-align:left; padding:4px 2px; white-space:nowrap; }
  .lg-tree .on { background:var(--accent); color:white; }
  .lg-main { flex:1; min-width:0; display:flex; flex-direction:column; overflow:hidden; padding:8px; gap:7px; }
  .lg-heading { flex:none; display:flex; justify-content:space-between; align-items:center; height:22px; gap:5px; }
  .lg-heading strong { font-size:14px; }
  .lg-grid { flex:0 1 113px; min-height:52px; overflow:auto; border:2px inset var(--line); background:var(--panel); scrollbar-width:thin; }
  .lg table { border-collapse:collapse; width:100%; font-size:11px; white-space:nowrap; }
  .lg th { background:var(--lg-face); color:var(--fg); position:sticky; top:0; z-index:1; font-weight:normal; border:1px solid var(--line); text-align:left; }
  .lg th,.lg td { padding:2px 6px; height:21px; border-right:1px solid var(--line); border-bottom:1px solid var(--line); }
  .lg tr.on td { background:var(--accent); color:white; }
  .lg td button { border:0; color:inherit; background:transparent; padding:0; text-align:left; width:100%; white-space:nowrap; }
  .lg-editor { position:relative; display:flex; flex-direction:column; flex:1; min-height:0; }
  .lg-tabs { flex:none; display:flex; padding-left:4px; gap:2px; height:25px; }
  .lg-tab { border:1px solid var(--muted); border-bottom:0; padding:2px 10px; background:var(--lg-face); border-radius:3px 3px 0 0; }
  .lg-tab[aria-selected=true] { background:var(--panel); font-weight:bold; position:relative; z-index:1; }
  .lg-sheet { flex:1; min-height:0; overflow:auto; padding:9px 10px; border:1px solid var(--muted); background:var(--panel); scrollbar-width:thin; }
  .lg-group { margin:0 0 8px; padding:7px 10px; border:1px solid var(--muted); min-width:0; }
  .lg-group legend { padding:0 4px; color:var(--fg); }
  .lg-row { display:flex; align-items:center; min-height:28px; gap:8px; }
  .lg-row>label { flex:none; width:106px; }
  .lg-input { font:12px Arial,sans-serif; height:23px; width:156px; max-width:100%; min-width:0;
    padding:2px 5px; color:var(--fg); background:var(--bg); border:2px inset var(--line); border-radius:0;
    user-select:text; -webkit-user-select:text; }
  .lg-input:focus { outline:1px solid var(--accent); }
  .lg-protected { padding:2px 5px; font:12px monospace; background:var(--bg); border:1px solid var(--line); min-width:80px; }
  .lg-note { color:var(--muted); font-size:11px; padding:4px 0; }
  .lg-spin { display:inline-flex; }
  .lg-spin input { width:58px; }
  .lg-spin>span { display:flex; flex-direction:column; }
  .lg-spin button { min-height:0; box-shadow:none; height:12px; width:19px; padding:0; line-height:9px; font-size:9px; border:1px solid var(--muted); background:var(--lg-face); }
  .lg-actions { flex:none; display:flex; align-items:center; justify-content:flex-end; gap:7px; padding:7px 9px;
    background:var(--lg-face); border-top:1px solid var(--line); }
  .lg-actions .lg-btn { min-width:72px; }
  .lg-status { flex:none; display:flex; min-height:25px; align-items:center; gap:8px; padding:3px 7px;
    border-top:2px groove var(--line); background:var(--lg-face); font:11px monospace; }
  .lg-status>span:first-child { flex:1; min-width:0; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
  .lg-status>span+span { border-left:1px solid var(--muted); padding-left:8px; white-space:nowrap; }
  .lg-pop { position:absolute; z-index:12; top:51px; left:5px; min-width:185px; padding:3px;
    border:2px outset var(--line); background:var(--lg-face); box-shadow:3px 3px 6px #0004; }
  .lg-pop button { display:block; width:100%; text-align:left; border:0; padding:5px 9px; background:transparent; }
  .lg-pop button:hover { color:white; background:var(--accent); }
  .lg-help { position:absolute; z-index:20; inset:0; background:#0005; display:grid; place-items:center; }
  .lg-dialog { width:min(390px,92%); max-height:90%; display:flex; flex-direction:column; border:2px outset var(--line); background:var(--lg-face); box-shadow:4px 5px 10px #0006; }
  .lg-dialog h3 { margin:0; padding:5px 8px; font-size:12px; background:var(--accent); color:white; }
  .lg-dialog-body { padding:12px; overflow:auto; }
  .lg-dialog .lg-btn { text-align:left; display:block; width:100%; margin-bottom:4px; }
  .lg-sap .lg-title { background:color-mix(in srgb,var(--accent) 55%,var(--muted)); }
  .lg-sap .lg-tools { gap:8px; }
  .lg-sap .lg-input { background:color-mix(in srgb,#fff7ba 20%,var(--panel)); }
  .lg-sap .lg-main { gap:8px; }
  .lg-sap .lg-grid { flex-basis:82px; }
  .lg-win .lg-title { background:linear-gradient(90deg,color-mix(in srgb,var(--accent) 65%,#000),var(--accent)); }
  .lg-win { border:3px outset var(--line); background:var(--lg-face); }
  .lg-win .lg-sheet,.lg-win .lg-tab[aria-selected=true] { background:var(--lg-face); }
  .lg-win .lg-grid { flex-basis:73px; }
  .lg-host { background:#07110b; }
  .lg-host .lg-title { background:var(--lg-face); color:var(--fg); }
  .lg-terminal { position:relative; flex:1; min-height:0; margin:8px; color:#83e69a; background:#07110b;
    font-family:'Courier New',monospace; line-height:1.2; user-select:text; -webkit-user-select:text; }
  .lg-screen { position:absolute; inset:0; }
  .lg-line { position:absolute; white-space:pre; line-height:1.2; max-width:100%; }
  .lg-bright { color:#c8ffca; }
  .lg-cyan { color:#79d9d9; }
  .lg-term-input { position:absolute; font:inherit; line-height:1.2; height:1.2em; padding:0; margin:0;
    color:#e2ffe7; background:#102b1a; border:0; border-bottom:1px solid #83e69a; border-radius:0; outline:0;
    text-transform:uppercase; caret-color:#b6ffbd; }
  .lg-term-input:focus { background:#1c4228; }
  .lg-term-input::selection { background:#92d89f; color:#07110b; }
  .lg-term-help { position:absolute; z-index:10; inset:12% 8%; padding:2em; border:1px solid #83e69a; background:#07110b; white-space:pre-wrap; }
  .lg-host .lg-status { font-size:10px; color:var(--muted); }
  .lg-host .lg-status>span+span { border:0; }
  .lg { font-family:Tahoma,Arial,sans-serif; }
  .lg-title { height:25px; font-size:11px; }
  .lg-title>span:first-child { display:flex; align-items:center; gap:6px; min-width:0; }
  .lg-sys { display:flex; gap:5px; letter-spacing:0; }
  .lg svg { width:14px; height:14px; flex:none; vertical-align:middle; }
  .lg-icon-button { display:inline-flex; align-items:center; justify-content:center; gap:4px; }
  .lg-icon-only { width:24px; min-width:24px !important; padding:2px; }
  .lg-menu { height:21px; }
  .lg-menu button { font-size:11px; padding:2px 8px; }
  .lg-tools { min-height:28px; gap:3px; }
  .lg-btn { min-height:23px; font-size:11px; }
  .lg-breadcrumb { display:flex; align-items:center; flex:none; min-height:22px; padding:2px 8px; gap:7px;
    font-size:11px; border-bottom:1px solid var(--line); background:var(--panel); }
  .lg-breadcrumb span:last-child { margin-left:auto; color:var(--muted); white-space:nowrap; }
  .lg-tree { width:174px; font-size:11px; padding:0 3px 5px; }
  .lg-tree button { display:flex; align-items:center; gap:4px; height:21px; padding:2px 3px; font-size:11px; }
  .lg-tree .lg-tree-child { padding-left:20px; }
  .lg-tree .lg-tree-grandchild { padding-left:33px; }
  .lg-pane-title { display:flex; align-items:center; justify-content:space-between; font-size:11px; font-weight:bold;
    padding:3px 5px; border-bottom:1px solid var(--line); background:var(--lg-face); min-height:22px; }
  .lg-tree .lg-pane-title { margin:0 -3px 5px; }
  .lg-main { padding:5px; gap:3px; }
  .lg-editor { flex:1 0 132px; min-height:132px; }
  .lg-short .lg-breadcrumb,.lg-short .lg-heading,.lg-short .lg-record-count,.lg-short .lg-dock { display:none; }
  .lg-heading { height:20px; }
  .lg-heading strong { font-size:12px; }
  .lg-grid { flex:0 8 120px; min-height:40px; scrollbar-color:var(--muted) var(--lg-face); }
  .lg table { font-family:Tahoma,Arial,sans-serif; font-size:11px; }
  .lg th,.lg td { height:19px; padding:1px 5px; }
  .lg tbody tr:nth-child(even):not(.on) { background:color-mix(in srgb,var(--line) 22%,var(--panel)); }
  .lg tbody tr:not(.on):hover { background:color-mix(in srgb,var(--accent) 12%,var(--panel)); }
  .lg-table-num { font-family:'Courier New',monospace; text-align:right; }
  .lg-record-count { flex:none; display:flex; align-items:center; gap:8px; color:var(--muted); font-size:10px; padding:1px 4px; border-bottom:1px solid var(--line); }
  .lg-record-count span:last-child { margin-left:auto; }
  .lg-row { min-height:24px; gap:7px; }
  .lg-row>label { width:94px; font-size:11px; }
  .lg-input { height:21px; font-size:11px; width:148px; }
  .lg-protected { font-size:11px; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .lg-group { padding:4px 7px; margin-bottom:6px; }
  .lg-group legend { font-size:11px; }
  .lg-sheet { padding:6px; }
  .lg-note { font-size:10px; padding:3px 0; }
  .lg-form-columns { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:8px; }
  .lg-form-columns .lg-group { min-width:0; }
  .lg-form-columns .lg-row>label { width:90px; }
  .lg-form-columns .lg-protected { flex:1; }
  .lg-editor-title { display:flex; align-items:center; gap:7px; font-size:11px; padding:3px 6px; background:var(--lg-face); border:1px solid var(--line); margin-bottom:4px; }
  .lg-editor-title span:last-child { margin-left:auto; color:var(--muted); }
  .lg-field-error { flex:none; min-height:19px; padding:2px 6px; font-size:11px; border:1px solid var(--line); background:var(--panel); }
  .lg-field-error.bad { border-color:#b45353; color:color-mix(in srgb,#d74040 65%,var(--fg)); }
  .lg-inspector { flex:none; width:194px; border-left:2px ridge var(--line); overflow:auto; background:var(--panel); font-size:11px; scrollbar-width:thin; }
  .lg-inspector dl { display:grid; grid-template-columns:80px minmax(0,1fr); margin:7px; gap:5px 3px; font-size:10px; }
  .lg-inspector dt { color:var(--muted); } .lg-inspector dd { margin:0; overflow-wrap:anywhere; }
  .lg-inspector p { padding:0 8px; color:var(--muted); }
  .lg-inspector .lg-message { display:flex; gap:6px; padding:7px; border-bottom:1px solid var(--line); font-size:10px; }
  .lg-dock { flex:none; height:67px; display:flex; flex-direction:column; background:var(--panel); border-top:2px ridge var(--line); overflow:hidden; }
  .lg-dock-tabs { display:flex; gap:0; background:var(--lg-face); height:21px; border-bottom:1px solid var(--line); }
  .lg-dock-tabs button { border:0; border-right:1px solid var(--line); background:transparent; padding:2px 10px; font-size:10px; }
  .lg-dock-tabs button.on { background:var(--panel); font-weight:bold; }
  .lg-log { overflow:auto; scrollbar-width:thin; font:10px/1.45 'Courier New',monospace; padding:2px 7px; }
  .lg-log div { white-space:nowrap; }
  .lg-actions { padding:4px 7px; }
  .lg-status { min-height:22px; font-size:10px; }
  .lg-session-tabs { display:flex; flex:none; align-items:end; min-height:23px; padding-left:7px; background:var(--lg-face); border-bottom:1px solid var(--line); }
  .lg-session-tabs span { padding:3px 12px; font:10px Tahoma,Arial,sans-serif; border:1px solid var(--line); border-bottom:0; color:var(--muted); }
  .lg-session-tabs .on { background:var(--panel); color:var(--fg); font-weight:bold; }
  .lg-host .lg-tools { min-height:26px; }
  .lg-host .lg-menu { height:21px; }
  .lg-host .lg-btn { min-height:20px; }
  .lg-host .lg-title { background:var(--lg-face); }
  .lg-host .lg-status { margin-top:auto; min-height:22px; }
  .lg-host .lg-menu,.lg-host .lg-tools { color:var(--fg); }
  .lg-oia { font-variant-numeric:tabular-nums; }
  .lg-win { font-family:Tahoma,Arial,sans-serif; }
  .lg-win .lg-editor { border:2px outset var(--line); padding:5px; background:var(--lg-face); }
  .lg-win .lg-editor-title { background:linear-gradient(90deg,color-mix(in srgb,var(--accent) 65%,#000),var(--accent)); color:white; margin:-3px -3px 6px; }
  .lg-win .lg-editor-title span:last-child { color:#fff; }
  .lg-win .lg-grid { flex-basis:78px; }
  .lg-sap .lg-tools { background:color-mix(in srgb,var(--accent) 10%,var(--lg-face)); }
  .lg-sap .lg-tabs { height:23px; }
  .lg-sap .lg-tab { font-size:11px; border-radius:0; }
  .lg-sap .lg-grid { flex-basis:84px; }
  .lg-compact .lg-dock { display:flex; height:36px; }
  .lg-compact .lg-dock-tabs { height:17px; flex:none; }
  .lg-compact .lg-dock-tabs button { padding:0 7px; }
  .lg-compact .lg-grid { flex-basis:80px; }
  .lg-compact .lg-breadcrumb { min-height:19px; font-size:10px; }
  .lg:not(.lg-with-inspector) .lg-inspector { display:none; }
  .lg-narrow .lg-form-columns { grid-template-columns:minmax(0,1fr); }
  .lg-narrow .lg-form-columns .lg-group:last-child { display:none; }
  .lg-narrow .lg-tree { width:125px; }
  .lg-narrow .lg-tools { flex-wrap:wrap; }
  .lg-narrow .lg-breadcrumb span:last-child { display:none; }
  .lg-narrow .lg-row>label { width:82px; }
  .lg-narrow .lg-tabs button { padding:2px 7px; font-size:10px; }
  .lg-narrow .lg-editor-title span:last-child { display:none; }
  .lg-welcome { flex:1; overflow:auto; border:1px solid var(--line); background:var(--panel); scrollbar-width:thin; }
  .lg-welcome h2 { font-size:16px; margin:12px; }
  .lg-welcome p { font-size:11px; color:var(--muted); margin:8px 12px; }
  .lg-welcome button { display:flex; align-items:center; gap:7px; width:calc(100% - 24px); text-align:left; background:var(--bg); border:1px solid var(--line); padding:6px; margin:4px 12px; }
  .lg-closed { padding:15px; border:1px solid var(--line); font-size:11px; color:var(--muted); }
  .lg-value-heading { display:flex; align-items:center; gap:6px; border-bottom:1px solid var(--line); padding:4px 1px; font-weight:bold; }
  .lg-compact .lg-group { padding:3px 6px; }
  .lg-compact .lg-group .lg-row { min-height:22px; }
  .lg-compact .lg-note { padding:1px 0; }
  .lg-narrow .lg-tools .lg-small { display:none; }
  .lg-narrow .lg-tree button { font-size:10px; gap:2px; }
  .lg-compact .lg-editor-title { margin-bottom:2px; padding:1px 5px; }
  .lg-grid::-webkit-scrollbar,.lg-sheet::-webkit-scrollbar,.lg-tree::-webkit-scrollbar { width:12px; height:12px; }
  .lg-grid::-webkit-scrollbar-thumb,.lg-sheet::-webkit-scrollbar-thumb,.lg-tree::-webkit-scrollbar-thumb { background:var(--line); border:2px outset var(--line); }
  .lg-grid::-webkit-scrollbar-track,.lg-sheet::-webkit-scrollbar-track,.lg-tree::-webkit-scrollbar-track { background:var(--bg); }

  `;
  env.widget({ task: 'use-legacy-app', site: 'base', name: 'classic', split: 'train',
    scenarios: ['mainframe', 'mainframe-lookup', 'swing', 'sapgui', 'win95'],
    render(ctx) {
      if (keyHandler) document.removeEventListener('keydown', keyHandler);
      ctx.css('app-legacy-classic', CSS);
      const F = env.taskDef.helpers, s = ctx.spec, el = ctx.util.el;
      const terminal = F.isTerminal(s), look = F.lookup(s);
      const root = el('section', `lg${terminal ? ' lg-host' : s.scenario === 'sapgui' ? ' lg-sap' : s.scenario === 'win95' ? ' lg-win' : ''}`, ctx.stage);
      const W = Math.max(200, Math.min(ctx.size.width - 24, 1320));
      const H = Math.max(180, Math.min(ctx.size.height - 24, 740));
      root.style.width = `${W}px`; root.style.height = `${H}px`;
      root.classList.toggle('lg-short', H < 460); root.classList.toggle('lg-compact', H < 570); root.classList.toggle('lg-narrow', W < 850); root.classList.toggle('lg-with-inspector', W >= 1180);
      root.setAttribute('aria-label', terminal ? 'Host terminal session' : 'Enterprise record maintenance');
      const names = { mainframe: 'A - HBRPROD - Harbor 5250', 'mainframe-lookup': 'B - HBRPROD - Account Inquiry',
        swing: 'Harbor Operations Console — Record Manager', sapgui: 'Harbor Enterprise Client — Production / 100', win95: 'Record Properties — Harbor Service Manager' };
      const title = el('div', 'lg-title', root);
      const icon = (kind, parent) => {
        const svg = ctx.util.svg('svg', { viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.3', 'aria-hidden': 'true' }, parent);
        ctx.util.svg('path', { d: ICONS[kind] || ICONS.file }, svg); return svg;
      };
      const titleText = el('span', '', title); icon(terminal ? 'link' : s.scenario === 'win95' ? 'file' : 'grid', titleText);
      el('span', '', titleText, names[s.scenario]);
      const windowButtons = el('span', 'lg-sys', title);
      for (const name of ['min', 'max', 'close']) icon(name, windowButtons);
      const refs = {}, inputs = {}, tabs = {}, recordButtons = {};
      let paint;
      const update = (model) => { ctx.update(model); if (paint) paint(ctx.model); };
      const commit = () => {
        if (s.judge && s.judge.mode === 'confirm') ctx.flag('irreversible');
        update(F.save(ctx.model, s));
      };
      const patch = (p) => update({ ...ctx.model, ...p });
      const button = (parent, label, action, cls = 'lg-btn') => {
        const b = el('button', cls, parent, label); b.type = 'button';
        if (action) b.addEventListener('click', action); return b;
      };
      const iconButton = (parent, label, kind, action, only = false) => {
        const b = button(parent, '', action, `lg-btn lg-icon-button${only ? ' lg-icon-only' : ''}`);
        b.setAttribute('aria-label', label); b.title = label; icon(kind, b);
        if (!only) el('span', '', b, label); return b;
      };
      if (terminal) {
        const menu = el('div', 'lg-menu', root);
        for (const label of ['File', 'Edit', 'View', 'Communication', 'Actions', 'Window', 'Help']) button(menu, label, () => patch({ help: true }), '');
        const hostTools = el('div', 'lg-tools', root);
        iconButton(hostTools, 'Session settings', 'link', () => patch({ help: true }), true);
        iconButton(hostTools, 'Print screen', 'print', () => patch({ help: true }), true);
        iconButton(hostTools, 'Refresh host', 'refresh', () => update(F.terminalKey(ctx.model, s, 'F5')), true);
        el('span', 'lg-sep', hostTools);
        el('span', 'lg-small', hostTools, 'HBR-PROD:992 / TLS 1.2    Device TERM0042    Code page 037');
        const sessions = el('div', 'lg-session-tabs', root);
        el('span', look ? '' : 'on', sessions, 'A: Customer maintenance');
        el('span', look ? 'on' : '', sessions, 'B: Account inquiry');
        el('span', '', sessions, 'C: Batch monitor');
        const display = el('div', 'lg-terminal', root);
        // Courier glyphs are 0.6 em wide; 80 fixed cells, 24 fixed rows.
        const fs = Math.min((W - 18) / 48, (H - 146) / 28.8);
        display.style.fontSize = `${fs}px`;
        display.style.flex = 'none'; display.style.width = `${fs * 48}px`; display.style.height = `${fs * 28.8}px`;
        display.style.alignSelf = 'center';
        const screens = {};
        const line = (parent, row, col, text = '', cls = '') => {
          const d = el('div', `lg-line ${cls}`, parent, text);
          d.style.top = `${(row - 1) / 24 * 100}%`; d.style.left = `${(col - 1) / 80 * 100}%`; return d;
        };
        const field = (parent, id, row, col, size) => {
          const i = el('input', 'lg-term-input', parent); i.type = 'text'; i.readOnly = true;
          i.setAttribute('aria-label', id === 'answer' ? 'Report value' : id === 'option' ? 'Option number' : id === 'key' ? 'Record key' : s.fields.find((f) => f.id === id).label);
          i.tabIndex = -1; i.style.top = `${(row - 1) / 24 * 100}%`; i.style.left = `${(col - 1) / 80 * 100}%`;
          i.style.width = `${size}ch`; i.addEventListener('pointerdown', (e) => e.preventDefault());
          // The same logical field can appear on multiple terminal panels.
          (inputs[id] ||= []).push(i); return i;
        };
        for (const name of (look ? ['menu', 'submenu', 'list', 'detail'] : ['search', 'edit'])) screens[name] = el('div', 'lg-screen', display);
        if (!look) {
          const search = screens.search;
          line(search, 1, 2, 'HBR100                       RECORD MAINTENANCE', 'lg-bright');
          line(search, 2, 2, 'SYSTEM: HBRPROD   LIBRARY: CUSTLIB   USER: OPS042      JOB: 083214');
          line(search, 3, 2, 'COMPANY 100 / NORTH REGION                          MODE: CHANGE');
          line(search, 5, 2, 'RECORD KEY . . .'); field(search, 'key', 5, 20, 12);
          line(search, 7, 2, 'RECENT RECORDS     OWNER                    ORGANIZATION', 'lg-cyan');
          refs.searchRows = Array.from({ length: s.pageSize }, (_, i) => line(search, 9 + i, 2));
          refs.searchPage = line(search, 17, 2);
          line(search, 18, 2, 'ENTER=Find record    Use the full key. Read-only host directory.');
          const edit = screens.edit;
          line(edit, 1, 2, 'HBR110                      CHANGE CUSTOMER RECORD', 'lg-bright');
          refs.termKey = line(edit, 3, 2); refs.owner = line(edit, 4, 2); refs.company = line(edit, 5, 2);
          line(edit, 2, 2, 'COMPANY: 100   BRANCH: 020     RECORD CLASS: COMMERCIAL');
          refs.hostContext = line(edit, 6, 2);
          line(edit, 7, 2, 'MAINTENANCE DATA                           FORMAT / LIMIT', 'lg-cyan');
          for (const [i, f] of s.fields.entries()) {
            line(edit, 9 + i * 2, 2, f.label.toUpperCase().padEnd(18, '.') + ' :');
            field(edit, f.id, 9 + i * 2, 24, f.max);
            line(edit, 9 + i * 2, 51, f.id === 'cost' ? '4 DIGITS' : f.id === 'retries' ? '01-99' : `${f.max} CHARACTERS`);
          }
          line(edit, 8, 51, 'STATUS: ACTIVE');
          line(edit, 10, 51, 'QUEUE: CUSTUPD');
          line(edit, 12, 51, 'LOCK: AVAILABLE');
          line(edit, 14, 2, 'CREDIT CONTROL: STANDARD      TERMS: NET 30     CURRENCY: USD');
          line(edit, 15, 2, 'SOURCE: CUSTOMER MASTER       AUTHORITY: MAINTENANCE');
          line(edit, 16, 2, 'VALID COST CENTERS: ' + s.centers.map((c) => c.code).join('  '));
          line(edit, 17, 2, 'LAST BATCH: NIGHTLY-04        VALIDATION: ONLINE    AUDIT: ENABLED');
          line(edit, 18, 2, 'TAB=Next field  SHIFT+TAB=Previous  ENTER=Update record');
          line(edit, 19, 2, 'MESSAGE QUEUE: QSYSOPR        PENDING APPROVALS: 03');
          refs.receipt = line(edit, 20, 2, '', 'lg-bright');
        } else {
          line(screens.menu, 1, 2, 'HBR000                       OPERATIONS MAIN MENU', 'lg-bright');
          line(screens.menu, 2, 2, 'SYSTEM: HBRPROD   USER: OPS042   COMPANY: 100   MENU: OPERATIONS');
          line(screens.menu, 4, 6, '1. CUSTOMER SERVICES'); line(screens.menu, 6, 6, '2. BATCH PROCESSING');
          line(screens.menu, 8, 6, '3. SYSTEM ADMINISTRATION');
          line(screens.menu, 4, 43, '4. SPOOL FILES       (12)');
          line(screens.menu, 6, 43, '5. EXCEPTION QUEUES  (03)');
          line(screens.menu, 8, 43, '6. DAILY RECONCILIATION');
          line(screens.menu, 10, 6, '7. REFERENCE TABLES'); line(screens.menu, 10, 43, '8. MESSAGE CENTER    (02)');
          line(screens.menu, 12, 2, 'ENVIRONMENT: PRODUCTION      USER: OPERATOR');
          line(screens.menu, 14, 2, 'BATCH CUSTNIGHT COMPLETED   48 RECORDS POSTED   RC=00');
          line(screens.menu, 15, 2, 'NOTICE: MONTH-END CLOSE PENDING / CONTACT OPERATIONS FOR RELEASE');
          line(screens.menu, 20, 2, 'JOB: 083214/OPS042/QPADEV0042       MESSAGE QUEUE: QSYSOPR');
          line(screens.menu, 18, 2, 'OPTION ===>'); field(screens.menu, 'option', 18, 15, 2);
          line(screens.submenu, 1, 2, 'HBR010                       CUSTOMER SERVICES', 'lg-bright');
          line(screens.submenu, 4, 6, '1. ACCOUNT INQUIRY'); line(screens.submenu, 6, 6, '2. STATEMENT HISTORY');
          line(screens.submenu, 8, 6, '3. CONTACT REGISTER');
          line(screens.submenu, 2, 2, 'COMPANY: 100 / NORTH REGION                    MENU: CUSTSRV');
          line(screens.submenu, 4, 43, '4. CREDIT REVIEW'); line(screens.submenu, 6, 43, '5. PAYMENT ALLOCATIONS');
          line(screens.submenu, 8, 43, '6. CUSTOMER AUDIT TRAIL');
          line(screens.submenu, 11, 6, 'INQUIRY ACCESS: ALL BRANCHES     UPDATE AUTHORITY: LIMITED');
          line(screens.submenu, 13, 6, 'OPEN ITEMS: CURRENT / PRIOR PERIODS');
          line(screens.submenu, 15, 6, 'REPORT QUEUE: QPRINT           OUTPUT: HELD');
          line(screens.submenu, 18, 2, 'OPTION ===>'); field(screens.submenu, 'option', 18, 15, 2);
          line(screens.list, 1, 2, 'HBR020                       ACCOUNT DIRECTORY', 'lg-bright');
          line(screens.list, 2, 2, 'COMPANY: 100     SELECTION: ALL ACTIVE ACCOUNTS    ORDER: KEY');
          line(screens.list, 4, 2, 'OPT  RECORD KEY   OWNER                    LOCATION             CCY', 'lg-cyan');
          refs.listRows = Array.from({ length: s.pageSize }, (_, i) => line(screens.list, 6 + i, 2));
          refs.page = line(screens.list, 15, 2);
          line(screens.list, 18, 2, 'ROW ===>'); field(screens.list, 'option', 18, 12, 2);
          line(screens.list, 19, 2, 'ENTER=Open inquiry    F7=Page up    F8=Page down');
          const d = screens.detail;
          line(d, 1, 2, 'HBR030                       ACCOUNT INQUIRY', 'lg-bright');
          refs.termKey = line(d, 3, 2); refs.owner = line(d, 4, 2); refs.company = line(d, 5, 2);
          line(d, 2, 2, 'COMPANY: 100   LEDGER: AR01   PERIOD: 04 / 2026   VIEW: CURRENT');
          refs.lookupAddress = line(d, 6, 2);
          refs.balance = line(d, 8, 2, '', 'lg-bright'); refs.batch = line(d, 10, 2); refs.count = line(d, 12, 2);
          line(d, 7, 2, 'ACCOUNT STATUS: ACTIVE                       CURRENCY: USD');
          line(d, 9, 2, 'CREDIT TERMS . : NET 30                       AGING: CURRENT');
          line(d, 11, 2, 'RECONCILIATION : COMPLETE                     DISPUTES: NONE');
          line(d, 13, 2, 'SOURCE: OPEN ITEM LEDGER    LAST RUN: NIGHTLY-04    RC: 00');
          line(d, 15, 2, 'REPORT VALUE . . :'); field(d, 'answer', 15, 22, 24);
          line(d, 17, 2, 'OPTION . . . . . :'); field(d, 'option', 17, 22, 2);
          line(d, 18, 2, 'ENTER=Record report    Option 9 + ENTER=Return to directory');
          refs.report = line(d, 20, 2);
        }
        const status = line(display, 22, 2, '', 'lg-bright');
        line(display, 23, 2, 'F1 Help F2 Info F3 Exit F4 Prompt F5 Refresh F6 Print F7 Prev F8 Next', 'lg-cyan');
        line(display, 24, 2, 'F9 Menu F10 Left F11 Right F12 Cancel              ENTER=Process', 'lg-cyan');
        const help = el('div', 'lg-term-help', display, 'HOST HELP\n\nUse a record key to retrieve a record.\nOnly underlined fields accept data.\nTab / Shift+Tab move between fields.\nCtrl+A selects a field; Home/End move the cursor.\nEnter processes the current screen.\nF7/F8 page the inquiry directory.\nF3 returns to the main screen.\nF5 refreshes saved values; F12 cancels changes.\n\nEscape or F1 closes help.');
        const strip = el('div', 'lg-status', root); const connection = el('span', '', strip); icon('link', connection); el('span', '', connection, ' CONNECTED  HBR-PROD  LU: TERM0042');
        refs.oia = el('span', 'lg-oia', strip); el('span', '', strip, 'KB: READY  CAPS  INS  24x80');
        paint = (m) => {
          for (const [name, node] of Object.entries(screens)) node.hidden = m.screen !== name;
          for (const [id, nodes] of Object.entries(inputs)) for (const i of nodes) {
            i.value = F.value(m, id);
            if (m.focus === id && !i.parentElement.hidden && !m.help) {
              i.focus({ preventScroll: true });
              i.setSelectionRange(m.selected ? 0 : m.caret, m.selected ? i.value.length : m.caret);
            }
          }
          if (refs.searchRows) {
            refs.searchRows.forEach((node, i) => {
              const row = s.records[m.page * s.pageSize + i];
              node.textContent = row ? `${row.key.padEnd(18)}${row.owner.padEnd(25)}${row.company}` : '';
            });
            refs.searchPage.textContent = `DIRECTORY PAGE ${m.page + 1} OF ${Math.ceil(s.records.length / s.pageSize)}    F7=Previous F8=Next`;
          }
          const r = m.active === null ? null : s.records[m.active];
          if (refs.termKey) refs.termKey.textContent = `RECORD KEY . . : ${r ? r.key : ''}                     ACCESS: ${look ? 'INQUIRY' : 'CHANGE'}`;
          if (refs.owner) refs.owner.textContent = `OWNER . . . . : ${r ? r.owner : ''}`;
          if (refs.company) refs.company.textContent = `ORGANIZATION  : ${r ? r.company : ''}`;
          if (refs.receipt) refs.receipt.textContent = `CHANGE DOCUMENT: ${m.receipt || 'NOT ASSIGNED'}`;
          if (look) {
            refs.listRows.forEach((node, i) => {
              const row = s.records[m.page * s.pageSize + i];
              node.textContent = row ? `${i + 1}    ${row.key.padEnd(13)}${row.owner.padEnd(25)}${row.city.padEnd(21)}USD` : '';
            });
            refs.page.textContent = `PAGE ${m.page + 1} OF ${Math.ceil(s.records.length / s.pageSize)}     RESULT: ${s.records.length} ACCOUNTS`;
            refs.balance.textContent = `OPEN BALANCE . : ${r ? F.fmtAmount(r, s) : ''}`;
            refs.batch.textContent = `BATCH . . . . : ${r ? r.batch : ''}`;
            refs.count.textContent = `RESULT . . . . : ${s.records.length} ACCOUNTS`;
            refs.report.textContent = `REPORT STATUS: ${m.reported ? 'RECORDED' : 'PENDING'}`;
          }
          if (refs.hostContext) refs.hostContext.textContent = `LOCATION . .  : ${r ? r.city.padEnd(24) : ''.padEnd(24)}ACCOUNT STATUS: ACTIVE`;
          if (refs.lookupAddress) refs.lookupAddress.textContent = `LOCATION . .  : ${r ? r.city : ''}`;
          const rowOf = look ? m.screen === 'detail' ? (m.focus === 'answer' ? 15 : 17) : 18 : m.screen === 'search' ? 5 : 9 + s.fields.findIndex((f) => f.id === m.focus) * 2;
          refs.oia.textContent = `ROW ${String(rowOf).padStart(2, '0')} COL ${String(m.caret + (look ? 22 : m.screen === 'search' ? 20 : 24)).padStart(2, '0')}`;
          status.textContent = `STATUS: ${m.status}`; help.hidden = !m.help;
        };
        keyHandler = (e) => {
          if (!root.isConnected || document.querySelector('.ref-ov')) return;
          if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') return;
          if (/^F\d+$/.test(e.key) || ['Tab', 'Enter', 'Escape', 'Backspace', 'Delete', 'Home', 'End', 'ArrowLeft', 'ArrowRight'].includes(e.key) || e.key.length === 1) {
            e.preventDefault();
            if (e.key === 'Enter' && ctx.model.screen === (look ? 'detail' : 'edit') && s.judge && s.judge.mode === 'confirm') ctx.flag('irreversible');
            update(F.terminalKey(ctx.model, s, e.key, e.shiftKey, e.ctrlKey || e.metaKey));
          }
        };
      } else {
        const menu = el('div', 'lg-menu', root), pop = el('div', 'lg-pop', root); pop.hidden = true;
        const helpLayer = el('div', 'lg-help', root); helpLayer.hidden = true;
        const helpBox = el('div', 'lg-dialog', helpLayer);
        const helpTitle = el('h3', '', helpBox, 'Value help — Cost center');
        const helpBody = el('div', 'lg-dialog-body', helpBox);
        const helpChoices = el('div', '', helpBody);
        for (const c of s.centers) refs[`option:${c.code}`] = button(helpChoices, `${c.code}  ${c.label}`, () => {
          update({ ...F.edit(ctx.model, s, 'cost', c.code), help: false });
        });
        const helpText = el('p', '', helpBody, 'Choose a record in the directory. Use tabs to edit its properties. Save stores the current record; Cancel restores the saved values.');
        button(helpBody, 'Close (Esc)', () => patch({ help: false }));
        for (const label of ['File', 'Edit', 'View', ...(s.scenario === 'sapgui' ? ['System'] : ['Tools', 'Window']), 'Help']) button(menu, label, () => {
          if (label === 'Help') return patch({ help: 'about' });
          const opening = pop.hidden || pop.dataset.menu !== label;
          pop.replaceChildren(); pop.dataset.menu = label; pop.hidden = !opening;
          const entries = label === 'File' ? [['Save record    Ctrl+S', commit], ['Discard changes', () => update(F.cancel(ctx.model))], ['Print preview', () => patch({ help: 'about' })]]
            : label === 'Edit' ? [['Undo changes', () => update(F.cancel(ctx.model))], ['Find record', () => key.focus()]]
              : label === 'View' ? [['Customer navigator', () => patch({ tree: !ctx.model.tree })], ['Messages', () => patch({ dock: 'Messages' })], ['Job monitor', () => patch({ dock: 'Jobs' })]]
                : [['Session information', () => patch({ help: 'about' })], ['System messages', () => patch({ dock: 'Messages' })]];
          for (const [text, action] of entries) button(pop, text, () => { pop.hidden = true; action(); }, '');
        }, '');
        const tools = el('div', 'lg-tools', root);
        if (s.scenario === 'sapgui') {
          iconButton(tools, 'Execute', 'check', () => transact(), true);
          el('label', '', tools, 'Command');
          const command = el('input', 'lg-input', tools); command.setAttribute('aria-label', 'Transaction command');
          command.style.width = '122px'; refs.command = command;
          command.addEventListener('input', () => update(F.edit(ctx.model, s, 'command', command.value)));
          command.addEventListener('focus', () => { if (ctx.model.focus !== 'command') update(F.setFocus(ctx.model, 'command')); });
          el('span', 'lg-sep', tools);
        }
        refs.saveTool = iconButton(tools, 'Save', 'save', commit);
        iconButton(tools, 'Back', 'back', () => update(F.cancel(ctx.model)), true);
        iconButton(tools, 'Refresh', 'refresh', () => update(F.cancel(ctx.model)), true);
        el('span', 'lg-sep', tools);
        iconButton(tools, 'Find record', 'search', () => key.focus(), true);
        iconButton(tools, 'Print preview', 'print', () => patch({ help: 'about' }), true);
        iconButton(tools, 'Help', 'help', () => patch({ help: 'about' }), true);
        const toolsHint = el('span', 'lg-small', tools, s.scenario === 'sapgui' ? 'Ctrl+S   F4 Help' : 'Record workspace');
        const breadcrumb = el('div', 'lg-breadcrumb', root);
        icon(s.scenario === 'sapgui' ? 'folder' : 'tree', breadcrumb);
        el('span', '', breadcrumb, s.scenario === 'sapgui' ? 'Harbor Easy Access / Logistics / Customer master' : s.scenario === 'win95' ? 'Harbor Service Manager / Local computer / Customer services' : 'Workspace / Production / Customer master');
        el('span', '', breadcrumb, 'HBRPROD  |  Client 100  |  OPS042');
        const work = el('div', 'lg-work', root);
        const tree = el('nav', 'lg-tree', work); tree.setAttribute('aria-label', 'Object navigator');
        const navHead = el('div', 'lg-pane-title', tree, s.scenario === 'sapgui' ? 'Application menu' : s.scenario === 'win95' ? 'Console tree' : 'Connections');
        icon('tree', navHead);
        const treeItem = (label, kind, action, cls = '') => {
          const b = button(tree, '', action, cls); icon(kind, b); el('span', '', b, label); return b;
        };
        treeItem('HBRPROD (100)', 'down', () => patch({ tree: !ctx.model.tree }));
        treeItem('Favorites', 'folder', () => patch({ dock: 'Favorites' }), 'lg-tree-child');
        treeItem('Recent objects', 'clock', () => patch({ dock: 'Recent objects' }), 'lg-tree-child');
        refs.tree = button(tree, '', () => patch({ tree: !ctx.model.tree }), 'lg-tree-child');
        refs.treeToggle = icon('right', refs.tree); icon('folder', refs.tree); el('span', '', refs.tree, 'Customer records');
        const treeChildren = el('div', '', tree);
        for (const [text, action] of [['Active accounts', () => patch({ tree: true })], ['Held accounts', () => patch({ dock: 'Held accounts' })], ['Archive / 2025', () => patch({ dock: 'Archive' })]]) {
          const b = button(treeChildren, '', action, 'lg-tree-grandchild'); icon('grid', b); el('span', '', b, text);
        }
        for (const text of ['Orders and invoices', 'Credit management', 'Payment allocations', 'Reference tables', 'Batch monitor (3)', 'Print spool (12)', 'System messages (2)']) {
          treeItem(text, text.includes('messages') ? 'warn' : 'folder', () => patch({ dock: text }), 'lg-tree-child');
        }
        el('div', 'lg-pane-title', tree, 'Other workspaces');
        for (const r of s.records.slice(1, 5)) treeItem(r.company.slice(0, 19), 'folder', () => patch({ help: 'about' }));
        el('div', 'lg-note', tree, 'Connection: Production / CUST_MAINT / TLS');
        const main = el('div', 'lg-main', work);
        const heading = el('div', 'lg-heading', main);
        refs.heading = el('strong', '', heading, 'Customer records');
        el('span', 'lg-small', heading, `${s.records.length} objects`);
        const searchRow = el('div', 'lg-row', main);
        el('label', '', searchRow, 'Record key');
        const key = el('input', 'lg-input', searchRow); refs.key = key; key.setAttribute('aria-label', 'Record key');
        key.addEventListener('input', () => update(F.edit(ctx.model, s, 'key', key.value)));
        key.addEventListener('focus', () => { if (ctx.model.focus !== 'key') update(F.setFocus(ctx.model, 'key')); });
        refs.open = button(searchRow, 'Display', () => update(F.load(ctx.model, s, s.records.findIndex((r) => r.key === ctx.model.key))));
        const directory = el('div', 'lg-grid', main);
        const table = el('table', '', directory); const thead = el('thead', '', table), tr = el('tr', '', thead);
        for (const label of ['#', 'Record', 'Owner', 'Cost ctr', 'City', 'Status', 'Open balance', 'Batch']) el('th', '', tr, label);
        const tbody = el('tbody', '', table), rowNodes = {};
        s.records.forEach((r, i) => {
          const row = el('tr', '', tbody); rowNodes[i] = row;
          el('td', 'lg-table-num', row, String(i + 1));
          const td = el('td', '', row);
          recordButtons[i] = button(td, r.key, () => update({ ...F.load(ctx.model, s, i), tree: true }), '');
          el('td', '', row, r.owner); refs[`cost:${i}`] = el('td', '', row, r.base.cost); el('td', '', row, r.city);
          el('td', '', row, i % 7 === 3 ? 'Review' : 'Active'); el('td', 'lg-table-num', row, F.fmtAmount(r, s)); el('td', '', row, r.batch);
          row.addEventListener('click', (e) => { if (e.target.tagName !== 'BUTTON') update({ ...F.load(ctx.model, s, i), tree: true }); });
        });
        const count = el('div', 'lg-record-count', main);
        refs.count = el('span', '', count); el('span', '', count, 'Selection: All active  |  Sort: Record key');
        const editor = el('div', 'lg-editor', main);
        const editorTitle = el('div', 'lg-editor-title', editor); icon(s.scenario === 'win95' ? 'file' : 'grid', editorTitle);
        refs.editorTitle = el('span', '', editorTitle); el('span', '', editorTitle, s.scenario === 'win95' ? 'Properties - Local configuration' : 'Change mode / Protected fields shaded');
        const tabstrip = el('div', 'lg-tabs', editor);
        tabstrip.setAttribute('role', 'tablist');
        const tabNames = s.scenario === 'win95' ? ['General', 'Connection', 'Recovery'] : s.scenario === 'sapgui' ? ['Basic data', 'Control data', 'Processing'] : ['Account', 'Routing', 'Processing'];
        const panes = {};
        const sheet = el('div', 'lg-sheet', editor);
        for (let t = 0; t < 3; t++) {
          tabs[t] = button(tabstrip, tabNames[t], () => { patch({ tab: t }); sheet.scrollTop = 0; }, 'lg-tab'); tabs[t].setAttribute('role', 'tab');
          const pane = el('div', '', sheet); panes[t] = pane;
          const columns = el('div', 'lg-form-columns', pane);
          const group = el('fieldset', 'lg-group', columns); el('legend', '', group, t === 0 ? 'Identification' : t === 1 ? 'Routing configuration' : 'Failure handling');
          const f = s.fields[t], row = el('div', 'lg-row', group);
          const label = el('label', '', row, f.label); label.htmlFor = `lg-${f.id}`;
          const inputParent = f.id === 'retries' ? el('div', 'lg-spin', row) : row;
          const input = el('input', 'lg-input', inputParent); input.id = `lg-${f.id}`; input.maxLength = f.max;
          input.autocomplete = 'off'; input.spellcheck = false; input.setAttribute('aria-label', f.label);
          input.inputMode = f.id === 'retries' || f.id === 'cost' ? 'numeric' : 'text'; inputs[f.id] = input;
          input.addEventListener('input', () => update(F.edit(ctx.model, s, f.id, input.value)));
          input.addEventListener('focus', () => { if (ctx.model.focus !== f.id) update(F.setFocus(ctx.model, f.id)); });
          if (f.id === 'retries') {
            const spin = el('span', '', inputParent);
            for (const [label, delta] of [['up', 1], ['down', -1]]) {
              const b = button(spin, '', () => update(F.edit(ctx.model, s, f.id, String(Math.max(1, Math.min(99, Number(F.value(ctx.model, f.id)) + delta))))));
              icon(label, b); b.querySelector('svg').style.height = '8px';
              b.setAttribute('aria-label', delta === 1 ? 'Increase retry limit' : 'Decrease retry limit');
            }
          }
          if (f.id === 'cost') {
            refs.help = iconButton(row, s.scenario === 'sapgui' ? 'F4' : 'Values', 'grid', () => patch({ help: 'cost', focus: 'cost' }), s.scenario !== 'sapgui');
            el('div', 'lg-note', group, 'Controlling area 1000 / Company code 0100');
          } else el('div', 'lg-note', group, f.id === 'memo' ? `Uppercase host field · ${f.max} characters maximum` : 'Retries before a failed request is placed on hold (1–99).');
          for (const [name, text] of t === 0 ? [['Account group', 'COMMERCIAL'], ['Company code', '0100'], ['Currency', 'USD'], ['Payment terms', 'NET 30']]
            : t === 1 ? [['Queue name', 'CUSTUPD'], ['Delivery', 'SYNCHRONOUS'], ['Destination', 'HBR-PROD'], ['Code page', '037 / ENGLISH']]
              : [['Interval', '30 seconds'], ['Timeout', '120 seconds'], ['Recovery', 'Automatic'], ['Escalation', 'Operations desk']]) {
            const rr = el('div', 'lg-row', group); el('label', '', rr, name); el('span', 'lg-protected', rr, text);
          }
          const details = el('fieldset', 'lg-group', columns); el('legend', '', details, t === 0 ? 'Protected record data' : 'System settings');
          for (const [name, initial] of t === 0 ? [['Owner', ''], ['Organization', ''], ['Location', '']] : t === 1 ? [['Queue', 'STANDARD'], ['Transport', 'HOST LINK / TCP'], ['Record lock', 'EXCLUSIVE ON SAVE']] : [['Backoff', '30 seconds'], ['Failure action', 'Place on hold'], ['Logging', 'Errors and warnings']]) {
            const d = el('div', 'lg-row', details); el('label', '', d, name);
            const out = el('span', 'lg-protected', d, initial);
            if (t === 0) refs[name] = out;
          }
          const readonly = el('fieldset', 'lg-group', pane); el('legend', '', readonly, 'Administrative data');
          for (const [label, text] of [['Created by', 'MIGRATION / LEGACY01'], ['Last batch', 'NIGHTLY-04'], ['Change authority', 'CUST_MAINT'], ['Storage', 'Customer master / CUSTLIB']]) {
            const rr = el('div', 'lg-row', readonly); el('label', '', rr, label); el('span', 'lg-protected', rr, text);
          }
        }
        refs.fieldError = el('div', 'lg-field-error', main);
        const empty = el('div', 'lg-welcome', main);
        el('h2', '', empty, 'Harbor Easy Access');
        el('div', 'lg-pane-title', empty, 'Favorites / Frequently used transactions');
        iconButton(empty, 'ZREC - Maintain customer records', 'grid', () => { patch({ command: 'ZREC', screen: 'search', focus: 'key', status: 'TRANSACTION ZREC STARTED' }); key.focus(); });
        for (const text of ['ZBAL - Account balances', 'ZBAT - Batch monitor', 'ZPRT - Print spool administration']) iconButton(empty, text, 'file', () => patch({ help: 'about' }));
        el('div', 'lg-pane-title', empty, 'System notices');
        el('p', '', empty, 'Client 100 / Production. Month-end reconciliation is open. Background processing is available; 3 print requests are held.');
        const closed = el('div', 'lg-closed', main, 'Properties closed. Select a record or choose Display to reopen.');
        const audit = el('div', 'lg-note', main); refs.receipt = audit;
        const inspector = el('aside', 'lg-inspector', work);
        el('div', 'lg-pane-title', inspector, 'Object information');
        const dl = el('dl', '', inspector);
        const info = {};
        for (const label of ['Record', 'Owner', 'Company', 'Location', 'Ledger', 'Batch', 'Authority', 'Lock']) {
          el('dt', '', dl, label); info[label] = el('dd', '', dl);
        }
        el('div', 'lg-pane-title', inspector, 'Worklist / Notifications');
        for (const [kind, text] of [['warn', '3 statements awaiting release'], ['clock', 'Month-end reconciliation pending'], ['file', '12 documents in print spool'], ['check', 'Customer index rebuilt successfully']]) {
          const message = el('div', 'lg-message', inspector); icon(kind, message); el('span', '', message, text);
        }
        el('div', 'lg-pane-title', inspector, 'Related records');
        for (const r of s.records.slice(0, 4)) el('p', '', inspector, `${r.key} - ${r.owner}`);
        const dock = el('div', 'lg-dock', root), dockTabs = el('div', 'lg-dock-tabs', dock), dockButtons = {};
        for (const label of ['Messages', 'Jobs', 'Change history']) dockButtons[label] = button(dockTabs, label, () => patch({ dock: label }), '');
        refs.log = el('div', 'lg-log', dock);
        const actions = el('div', 'lg-actions', root);
        refs.save = button(actions, s.scenario === 'win95' ? 'Apply' : 'Save', commit);
        if (s.scenario === 'win95') refs.ok = button(actions, 'OK', () => { commit(); if (ctx.model.receipt) patch({ closed: true }); });
        button(actions, 'Cancel', () => update({ ...F.cancel(ctx.model), closed: s.scenario === 'win95' }));
        const status = el('div', 'lg-status', root);
        refs.status = el('span', '', status); refs.active = el('span', '', status); el('span', '', status, 'INS');
        const transact = () => {
          if (ctx.model.focus === 'command' || ctx.model.screen === 'command') {
            const code = ctx.model.command.toUpperCase().replace(/^\/N/, '');
            patch(code === s.transaction ? { screen: 'search', focus: 'key', status: 'TRANSACTION ZREC STARTED' } : { status: 'E010 TRANSACTION NOT FOUND' });
            if (code === s.transaction) key.focus();
          } else if (ctx.model.focus === 'key') update(F.load(ctx.model, s, s.records.findIndex((r) => r.key === ctx.model.key)));
          else commit();
        };
        paint = (m) => {
          const locked = s.scenario === 'sapgui' && m.screen === 'command';
          directory.hidden = locked; count.hidden = locked; searchRow.hidden = locked; editor.hidden = locked || m.closed; audit.hidden = locked; refs.fieldError.hidden = locked;
          empty.hidden = !locked; closed.hidden = !m.closed;
          refs.treeToggle.querySelector('path').setAttribute('d', ICONS[m.tree ? 'down' : 'right']); refs.tree.classList.toggle('on', m.tree);
          treeChildren.hidden = !m.tree;
          if (refs.command && refs.command.value !== m.command) refs.command.value = m.command;
          if (key.value !== m.key) key.value = m.key;
          const active = m.active === null ? null : s.records[m.active];
          for (const [i, row] of Object.entries(rowNodes)) {
            row.classList.toggle('on', Number(i) === m.active); refs[`cost:${i}`].textContent = m.stored[i].cost;
          }
          for (let t = 0; t < 3; t++) { tabs[t].setAttribute('aria-selected', String(m.tab === t)); panes[t].hidden = m.tab !== t; }
          for (const [id, input] of Object.entries(inputs)) {
            const v = F.value(m, id); if (input.value !== v) input.value = v; input.disabled = !active;
          }
          refs.Owner.textContent = active ? active.owner : '-'; refs.Organization.textContent = active ? active.company : '-'; refs.Location.textContent = active ? active.city : '-';
          const dirty = active && JSON.stringify(m.drafts[m.active]) !== JSON.stringify(m.stored[m.active]);
          refs.heading.textContent = active ? `${active.key} - ${s.scenario === 'win95' ? 'Service configuration' : 'Customer master'}` : 'Customer records';
          refs.editorTitle.textContent = active ? `${active.key} Properties${dirty ? ' *' : ''}` : 'No record selected';
          refs.count.textContent = `${s.records.length} rows retrieved / ${m.active === null ? '0' : '1'} selected`;
          refs.fieldError.textContent = /^E\d/.test(m.status) ? m.status : dirty ? 'Information: Local changes have not been saved.' : 'Information: All master data checks completed.';
          refs.fieldError.classList.toggle('bad', /^E\d/.test(m.status));
          const meta = active ? { Record: active.key, Owner: active.owner, Company: active.company, Location: active.city, Ledger: 'AR01 / USD', Batch: active.batch, Authority: 'CUST_MAINT', Lock: dirty ? 'Local edit' : 'Available' } : {};
          for (const [label, node] of Object.entries(info)) node.textContent = meta[label] || '-';
          const dockName = m.dock || 'Messages';
          for (const [label, b] of Object.entries(dockButtons)) b.classList.toggle('on', label === dockName);
          refs.log.replaceChildren();
          const logLines = dockName === 'Jobs' ? ['NIGHTLY-04     Completed    Return code 00     Customer master', 'STMT-PRINT     Held         Output queue QPRINT     12 documents']
            : dockName === 'Change history' ? [active ? `${active.key}    ${m.receipt || 'No committed change document'}    User OPS042` : 'No object selected', 'Audit retention: 90 days. Protected entries cannot be modified.']
              : [`[HBRPROD/100] Session active. ${s.records.length} customer records retrieved.`, `[${active ? active.key : 'SYSTEM'}] ${m.status}${m.receipt ? ' / Change document ' + m.receipt : ''}`, ...(dockName === 'Messages' ? [] : [`${dockName}: read-only workspace. No pending changes.`])];
          for (const text of logLines) el('div', '', refs.log, text);
          refs.receipt.textContent = `Change document: ${m.receipt || 'NOT ASSIGNED'}`;
          refs.status.textContent = `Status: ${m.status}`; refs.active.textContent = active ? active.key : 'No selection';
          refs.save.disabled = !active || locked || m.closed; refs.saveTool.disabled = !active || locked || m.closed;
          if (refs.ok) refs.ok.disabled = !active || m.closed;
          helpLayer.hidden = !m.help; helpChoices.hidden = m.help !== 'cost'; helpText.hidden = m.help === 'cost';
          helpTitle.textContent = m.help === 'cost' ? 'Value help — Cost center' : 'Harbor Operations — Help';
          toolsHint.textContent = s.scenario === 'sapgui' ? `${m.screen === 'command' ? 'Session manager' : 'ZREC'}  Ctrl+S  F4 Help` : 'Record workspace';
        };
        keyHandler = (e) => {
          if (!root.isConnected || document.querySelector('.ref-ov')) return;
          if (e.key === 'Escape') { e.preventDefault(); patch({ help: false }); pop.hidden = true; }
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); commit(); }
          if (e.key === 'F4') { e.preventDefault(); patch({ help: 'cost', focus: 'cost' }); }
          if (e.key === 'F1') { e.preventDefault(); patch({ help: 'about' }); }
          if (e.key === 'Enter' && !ctx.model.help) { e.preventDefault(); transact(); }
        };
        refs.directory = directory; refs.sheet = sheet;
        if (W < 610) tree.style.width = '112px';
      }
      document.addEventListener('keydown', keyHandler);
      current = { ctx, root, refs, inputs, tabs, recordButtons };
      paint(ctx.model);
      return { anchors: [root], sync: paint };
    },
    locate(t) {
      const v = current;
      let node;
      if (t.field) node = v.inputs[t.field] || v.refs[t.field];
      else if (t.tab !== undefined) node = v.tabs[t.tab];
      else if (t.record !== undefined) node = v.recordButtons[t.record];
      else if (t.tree) node = v.refs.tree;
      else if (t.save) node = v.refs.save;
      else if (t.open) node = v.refs.open;
      else if (t.help) node = v.refs.help;
      else if (t.option) node = v.refs[`option:${t.option}`];
      if (!node || !node.getClientRects().length) throw new Error(`use-legacy-app target not rendered: ${JSON.stringify(t)}`);
      // Directory rows live in a deliberately small, scrollable desktop table.
      // The oracle retrieves records by key; locate() only reads geometry.
      return v.ctx.util.center(node);
    },
  });
})();
