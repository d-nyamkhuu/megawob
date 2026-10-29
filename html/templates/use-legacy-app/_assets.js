/* use-legacy-app/_assets: shared SVG paths and structural CSS; no page state or DOM work. */
(function () {
  'use strict';
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
  const frameCSS = (D) => `
  .lg { position:relative; flex:none; display:flex; flex-direction:column; overflow:hidden;
    border:1px solid var(--line); background:var(--bg); color:var(--fg); font:${D.fontSize}px/1.35 Arial,sans-serif;
    box-shadow:${D.shadow}; --lg-face:color-mix(in srgb,var(--panel) 45%,var(--line)); }
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
  .lg-host { background:${D.hostBackground}; }
  .lg-host .lg-title { background:var(--lg-face); color:var(--fg); }
`;
  const detailCSS = (D) => `  .lg-terminal { position:relative; flex:1; min-height:0; margin:8px; color:${D.hostText}; background:${D.hostBackground};
    font-family:${D.monoFont}; line-height:1.2; user-select:text; -webkit-user-select:text; }
  .lg-screen { position:absolute; inset:0; }
  .lg-line { position:absolute; white-space:pre; line-height:1.2; max-width:100%; }
  .lg-bright { color:${D.hostBright}; }
  .lg-cyan { color:${D.hostCyan}; }
  .lg-term-input { position:absolute; font:inherit; line-height:1.2; height:1.2em; padding:0; margin:0;
    color:${D.hostInputText}; background:${D.hostInputBackground}; border:0; border-bottom:1px solid ${D.hostText}; border-radius:0; outline:0;
    text-transform:uppercase; caret-color:${D.hostCaret}; }
  .lg-term-input:focus { background:${D.hostFocus}; }
  .lg-term-input::selection { background:${D.hostSelection}; color:${D.hostBackground}; }
  .lg-term-help { position:absolute; z-index:10; inset:12% 8%; padding:2em; border:1px solid ${D.hostText}; background:${D.hostBackground}; white-space:pre-wrap; }
  .lg-host .lg-status { font-size:10px; color:var(--muted); }
  .lg-host .lg-status>span+span { border:0; }
  .lg { font-family:${D.font}; }
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
  .lg-tree { width:${D.treeWidth}px; font-size:11px; padding:0 3px 5px; }
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
  .lg table { font-family:${D.font}; font-size:11px; }
  .lg th,.lg td { height:19px; padding:1px 5px; }
  .lg tbody tr:nth-child(even):not(.on) { background:color-mix(in srgb,var(--line) 22%,var(--panel)); }
  .lg tbody tr:not(.on):hover { background:color-mix(in srgb,var(--accent) 12%,var(--panel)); }
  .lg-table-num { font-family:${D.monoFont}; text-align:right; }
  .lg-record-count { flex:none; display:flex; align-items:center; gap:8px; color:var(--muted); font-size:10px; padding:1px 4px; border-bottom:1px solid var(--line); }
  .lg-record-count span:last-child { margin-left:auto; }
  .lg-row { min-height:24px; gap:7px; }
  .lg-row>label { width:${D.labelWidth}px; font-size:11px; }
  .lg-input { height:${D.inputHeight}px; font-size:11px; width:${D.inputWidth}px; }
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
  .lg-log { overflow:auto; scrollbar-width:thin; font:10px/1.45 ${D.monoFont}; padding:2px 7px; }
  .lg-log div { white-space:nowrap; }
  .lg-actions { padding:4px 7px; }
  .lg-status { min-height:22px; font-size:10px; }
  .lg-session-tabs { display:flex; flex:none; align-items:end; min-height:23px; padding-left:7px; background:var(--lg-face); border-bottom:1px solid var(--line); }
  .lg-session-tabs span { padding:3px 12px; font:10px ${D.font}; border:1px solid var(--line); border-bottom:0; color:var(--muted); }
  .lg-session-tabs .on { background:var(--panel); color:var(--fg); font-weight:bold; }
  .lg-host .lg-tools { min-height:26px; }
  .lg-host .lg-menu { height:21px; }
  .lg-host .lg-btn { min-height:20px; }
  .lg-host .lg-title { background:var(--lg-face); }
  .lg-host .lg-status { margin-top:auto; min-height:22px; }
  .lg-host .lg-menu,.lg-host .lg-tools { color:var(--fg); }
  .lg-oia { font-variant-numeric:tabular-nums; }
  .lg-win { font-family:${D.font}; }
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
  const CSS = (D) => frameCSS(D) + detailCSS(D);
  env.template('use-legacy-app/_assets', () => ({ ICONS, CSS }));
})();
