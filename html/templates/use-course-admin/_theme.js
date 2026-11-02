/* use-course-admin/_theme: workspace stylesheet, icon paths and token defaults; no per-episode state. */
(function () {
  'use strict';
  const CSS = `
  .lms { position:absolute; inset:10px; display:flex; flex-direction:column; min-width:0; min-height:0;
    border:1px solid var(--line); border-radius:8px; background:var(--panel); overflow:hidden; font-size:12px; }
  .lms button,.lms input,.lms textarea { font:inherit; color:var(--fg); }
  .lms button { cursor:pointer; }
  .lms button:focus-visible,.lms input:focus,.lms textarea:focus { outline:2px solid var(--accent); outline-offset:1px; }
  .lms-head { height:63px; flex:none; padding:9px 15px; border-bottom:1px solid var(--line); display:flex; justify-content:space-between; align-items:center; gap:8px; }
  .lms-crumb { color:var(--muted); font-size:10px; letter-spacing:.045em; text-transform:uppercase; }
  .lms h2 { font-size:17px; margin:2px 0 0; line-height:1.2; }
  .lms-badge { color:var(--accent); background:color-mix(in srgb,var(--accent) 9%,var(--panel)); border:1px solid color-mix(in srgb,var(--accent) 30%,var(--line)); border-radius:20px; padding:3px 8px; white-space:nowrap; }
  .lms-nav { height:32px; flex:none; display:flex; align-items:stretch; padding:0 12px; border-bottom:1px solid var(--line); gap:18px; color:var(--muted); }
  .lms-nav span { padding:6px 2px; }
  .lms-nav .current { color:var(--accent); border-bottom:2px solid var(--accent); font-weight:650; }
  .lms-tools { min-height:38px; flex:none; padding:5px 12px; display:flex; gap:8px; align-items:center; border-bottom:1px solid var(--line); }
  .lms-tools strong { margin-right:auto; }
  .lms-btn { border:1px solid var(--line); border-radius:4px; padding:5px 9px; background:var(--panel); }
  .lms-btn.primary { background:var(--accent); color:white; border-color:var(--accent); }
  .lms-work { display:flex; flex:1; min-height:0; min-width:0; }
  .lms-main { flex:1; min-width:0; overflow:auto; position:relative; overscroll-behavior:contain; }
  .lms-source { flex:0 0 30%; min-width:145px; max-width:270px; border-left:1px solid var(--line); overflow:auto; background:var(--bg); padding:12px; overscroll-behavior:contain; }
  .lms-source h3 { font-size:12px; margin:0 0 5px; }
  .lms-source p { margin:5px 0; font-size:11px; }
  .lms-source small,.lms-muted { color:var(--muted); }
  .lms-source article { border-bottom:1px solid var(--line); padding:9px 0; }
  .lms-source article:first-of-type { padding-top:3px; }
  .lms-source ol { margin:5px 0; padding-left:18px; font-size:11px; }
  .lms-source .key { color:var(--accent); font-weight:600; }
  .lms-foot { flex:none; min-height:32px; padding:7px 12px; display:flex; gap:12px; align-items:center; border-top:1px solid var(--line); font-size:10px; flex-wrap:wrap; }
  .lms-foot .saved { margin-left:auto; color:var(--muted); }
  .lms-table { width:100%; border-collapse:collapse; table-layout:fixed; }
  .lms-table th { text-align:left; color:var(--muted); font-size:10px; font-weight:600; background:var(--bg); padding:9px 8px; border-bottom:1px solid var(--line); }
  .lms-table td { padding:9px 8px; border-bottom:1px solid var(--line); vertical-align:middle; }
  .lms-table th:first-child { width:34%; }
  .lms-table th:last-child { width:54px; }
  .lms-table .lms-person { font-size:12px; font-weight:600; overflow-wrap:anywhere; }
  .lms-id { display:block; font-size:10px; font-weight:400; color:var(--muted); }
  .lms-mark { width:100%; min-width:0; height:29px; border:1px solid var(--line); border-radius:3px; background:var(--panel); text-align:center; }
  .lms-lock { text-align:center; color:var(--muted); background:var(--bg); border:1px dashed var(--line); padding:5px 1px; border-radius:3px; white-space:nowrap; }
  .lms-source-row { border-bottom:1px solid var(--line); padding:7px 0; }
  .lms-score { display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:3px; font-variant-numeric:tabular-nums; font-size:11px; }
  .lms-score small { display:block; font-size:9px; }
  .lms-question-list { width:83px; flex:none; background:var(--bg); border-right:1px solid var(--line); overflow:auto; padding:8px; }
  .lms-qnav { width:100%; border:1px solid var(--line); background:var(--panel); border-radius:4px; padding:8px 4px; margin-bottom:6px; text-align:left; }
  .lms-qnav.current { border-color:var(--accent); color:var(--accent); }
  .lms-qnav small { display:block; font-size:9px; }
  .lms-editor { padding:12px 14px; }
  .lms-editor label { display:block; margin:9px 0 4px; font-weight:600; }
  .lms-editor textarea { width:100%; height:55px; resize:none; border:1px solid var(--line); border-radius:4px; background:var(--panel); padding:7px; }
  .lms-types { display:flex; gap:5px; margin:5px 0 10px; }
  .lms-types button { flex:1; padding:6px 4px; background:var(--panel); border:1px solid var(--line); border-radius:4px; font-size:10px; }
  .lms-types button.on { border-color:var(--accent); color:var(--accent); background:color-mix(in srgb,var(--accent) 7%,var(--panel)); }
  .lms-opt { display:flex; align-items:center; gap:6px; margin:6px 0; }
  .lms-opt input[type=text] { width:100%; min-width:0; background:var(--panel); border:1px solid var(--line); border-radius:3px; padding:6px; }
  .lms-opt input[type=radio] { margin:0; accent-color:var(--accent); flex:none; }
  .lms-points { width:75px; border:1px solid var(--line); border-radius:3px; background:var(--panel); padding:6px; }
  .lms-empty { padding:35px 18px; text-align:center; color:var(--muted); }
  .lms-empty b { display:block; color:var(--fg); font-size:16px; margin-bottom:6px; }
  .lms-modules { display:flex; height:100%; min-height:0; }
  .lms-unit-col { width:43%; border-right:1px solid var(--line); padding:9px; min-width:0; }
  .lms-lesson-col { flex:1; padding:9px; min-width:0; }
  .lms-col-title { height:29px; margin:0; font-size:11px; color:var(--muted); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .lms-dragrow { display:flex; align-items:center; gap:5px; border:1px solid var(--line); margin-bottom:5px; border-radius:4px; background:var(--panel); min-width:0; }
  .lms-dragrow.current { border-color:var(--accent); background:color-mix(in srgb,var(--accent) 6%,var(--panel)); }
  .lms-dragrow.dragging { z-index:3; box-shadow:0 5px 15px #0003; }
  .lms-grip { touch-action:none; cursor:grab; padding:5px 3px; color:var(--muted); flex:none; user-select:none; }
  .lms-unit-open { background:none; border:0; text-align:left; padding:4px 0; overflow:hidden; font-size:11px!important; flex:1; min-width:0; }
  .lms-dragtext { min-width:0; font-size:11px; line-height:1.2; padding:3px 4px 3px 0; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
  .lms-rubric { width:100%; border-collapse:collapse; table-layout:fixed; }
  .lms-rubric th { background:var(--bg); color:var(--muted); font-size:10px; padding:9px 4px; border-bottom:1px solid var(--line); }
  .lms-rubric th:first-child { width:28%; text-align:left; padding-left:10px; }
  .lms-rubric td { padding:7px 4px; border-bottom:1px solid var(--line); }
  .lms-rubric td:first-child { padding-left:10px; font-size:11px; font-weight:600; }
  .lms-rating { display:flex; width:100%; min-height:46px; align-items:center; justify-content:center; flex-direction:column; background:var(--panel); border:1px solid var(--line); border-radius:4px; }
  .lms-rating small { font-size:9px; color:var(--muted); }
  .lms-rating.on { border-color:var(--accent); color:var(--accent); background:color-mix(in srgb,var(--accent) 10%,var(--panel)); }
  .lms-roster { padding:9px 12px; border-bottom:1px solid var(--line); background:var(--bg); flex:none; }
  .lms-roster b { display:block; margin-bottom:5px; }
  .lms-roster button { margin-right:6px; }
  .lms.compact .lms-head { height:53px; padding:7px 10px; }
  .lms.compact h2 { font-size:14px; }
  .lms.compact .lms-badge { display:none; }
  .lms.compact .lms-source { padding:8px; }
  .lms.compact .lms-question-list { width:63px; padding:5px; }
  .lms.compact .lms-editor { padding:8px; }
  .lms.compact .lms-nav { gap:12px; }
  .lms { flex-direction:row; border-radius:5px; font-size:12px; }
  .lms-surface { flex:1; display:flex; flex-direction:column; min-width:0; min-height:0; }
  .lms-rail { width:148px; flex:none; display:flex; flex-direction:column; min-height:0; overflow:auto; border-right:1px solid var(--line); background:var(--bg); padding:12px 8px; }
  .lms-rail-brand { display:flex; align-items:center; gap:7px; font-size:15px; font-weight:750; padding:1px 5px 15px; }
  .lms-rail-label { font-size:9px; text-transform:uppercase; letter-spacing:.07em; color:var(--muted); padding:8px 7px 5px; }
  .lms-rail button { display:flex; align-items:center; gap:8px; width:100%; text-align:left; border:0; border-radius:4px; background:transparent; padding:7px; color:var(--muted); font-size:11px; }
  .lms-rail button.current { background:color-mix(in srgb,var(--accent) 11%,var(--panel)); color:var(--accent); font-weight:650; }
  .lms-rail button:hover { background:color-mix(in srgb,var(--fg) 5%,var(--panel)); }
  .lms-rail-count { margin-left:auto; font-size:9px; border-radius:8px; padding:0 5px; background:var(--line); color:var(--fg); }
  .lms-rail-bottom { margin-top:auto; padding-top:12px; }
  .lms-rail-course { border-top:1px solid var(--line); padding:8px 6px; font-size:10px; }
  .lms-rail-course b { display:block; font-size:11px; margin-bottom:3px; }
  .lms-icon { width:15px; height:15px; flex:none; display:inline-block; vertical-align:middle; stroke:currentColor; fill:none; stroke-width:1.6; stroke-linecap:round; stroke-linejoin:round; }
  .lms-head { height:59px; }
  .lms-head-actions { display:flex; gap:6px; align-items:center; flex:none; }
  .lms-head .lms-crumb { display:flex; gap:5px; align-items:center; font-size:10px; text-transform:none; letter-spacing:0; }
  .lms-avatar { width:27px; height:27px; display:grid; place-items:center; border-radius:50%; font-weight:650; font-size:10px; background:color-mix(in srgb,var(--accent) 13%,var(--panel)); color:var(--accent); flex:none; }
  .lms-iconbtn { display:inline-flex; align-items:center; justify-content:center; gap:5px; border:1px solid var(--line); border-radius:4px; background:var(--panel); padding:5px 7px; min-height:27px; }
  .lms-nav { height:30px; font-size:11px; gap:15px; }
  .lms-tools { min-height:36px; padding:4px 10px; flex-wrap:wrap; gap:5px; }
  .lms-tools strong { font-size:13px; }
  .lms-tools > .lms-muted { font-size:10px; }
  .lms-btn { display:inline-flex; align-items:center; justify-content:center; gap:5px; white-space:nowrap; }
  .lms-btn:disabled { opacity:.55; cursor:default; }
  .lms-context { display:flex; gap:8px; align-items:center; border-bottom:1px solid var(--line); padding:6px 10px; background:var(--bg); min-height:30px; flex:none; color:var(--muted); font-size:10px; }
  .lms-context b { color:var(--fg); font-weight:600; }
  .lms-context .right { margin-left:auto; }
  .lms-filter { display:inline-flex; align-items:center; gap:5px; padding:3px 7px; border:1px solid var(--line); background:var(--panel); border-radius:3px; font-size:10px; }
  .lms-tag { display:inline-flex; gap:4px; align-items:center; color:var(--muted); background:var(--bg); border:1px solid var(--line); border-radius:3px; font-size:9px; padding:2px 4px; white-space:nowrap; }
  .lms-tag.good { color:color-mix(in srgb,#248353 80%,var(--fg)); }
  .lms-tag.warn { color:color-mix(in srgb,#b67821 80%,var(--fg)); }
  .lms-pane-heading { display:flex; justify-content:space-between; gap:8px; padding:10px 12px; border-bottom:1px solid var(--line); background:var(--panel); }
  .lms-pane-heading b { font-size:13px; }
  .lms-pane-heading small { display:block; margin-top:3px; color:var(--muted); font-size:10px; }
  .lms-source { flex-basis:27%; max-width:265px; min-width:170px; font-size:11px; }
  .lms-source h3 { display:flex; align-items:center; gap:6px; font-size:12px; }
  .lms-source .lms-source-stamp { padding-bottom:8px; border-bottom:1px solid var(--line); margin-bottom:7px; }
  .lms-source .key { display:flex; align-items:flex-start; gap:4px; }
  .lms-source .key .lms-icon { width:12px; height:12px; margin-top:2px; }
  .lms-activity { margin-top:14px; border-top:1px solid var(--line); padding-top:10px; }
  .lms-activity h4 { margin:0 0 4px; font-size:11px; }
  .lms-activity p { border-bottom:1px solid var(--line); padding:5px 0; }
  .lms-foot { font-size:10px; padding:5px 10px; gap:5px; min-height:28px; }
  .lms-foot .saved { display:inline-flex; gap:4px; align-items:center; }
  .lms-table th { position:sticky; top:0; z-index:1; padding:7px 6px; }
  .lms-table td { padding:6px; font-variant-numeric:tabular-nums; }
  .lms-table th:first-child { width:33%; }
  .lms-table .lms-person { font-size:11px; }
  .lms-student { display:flex; align-items:center; gap:7px; }
  .lms-student .lms-avatar { width:24px; height:24px; font-size:9px; }
  .lms-mark { height:29px; }
  .lms-lock { display:flex; justify-content:center; align-items:center; gap:5px; padding:5px 1px; border-style:solid; }
  .lms-lock .lms-icon { width:11px; height:11px; }
  .lms-enrollment { color:var(--muted); font-size:9px; font-weight:400; }
  .lms-concluded td { color:var(--muted); background:color-mix(in srgb,var(--bg) 55%,var(--panel)); }
  .lms-concluded .lms-person { font-weight:400; }
  .lms-status-col { width:74px; }
  .lms-table-caption { text-align:left; font-size:10px; color:var(--muted); padding:8px; background:var(--bg); }
  .lms-qrail { width:109px; flex:none; overflow:auto; border-right:1px solid var(--line); background:var(--bg); }
  .lms-qrail h4 { margin:10px 8px 4px; font-size:10px; color:var(--muted); text-transform:uppercase; }
  .lms-question-list { width:auto; overflow:visible; border:0; padding:6px; }
  .lms-qnav { display:block; width:100%; padding:7px; white-space:normal; overflow:hidden; }
  .lms-qnav small:last-child { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
  .lms-library-item { padding:7px 8px; border-top:1px solid var(--line); font-size:10px; color:var(--muted); }
  .lms-library-item .lms-icon { margin-right:3px; width:12px; height:12px; }
  .lms-library-item b { display:block; color:var(--fg); font-weight:500; margin:4px 0; }
  .lms-richbar { display:flex; align-items:center; gap:3px; padding:4px; border:1px solid var(--line); border-bottom:0; background:var(--bg); border-radius:3px 3px 0 0; }
  .lms-richbar button { border:0; background:transparent; min-width:22px; padding:1px 3px; color:var(--muted); }
  .lms-richbar span { margin-left:auto; font-size:9px; color:var(--muted); }
  .lms-editor textarea { border-radius:0 0 3px 3px; height:66px; }
  .lms-editor { padding:12px; }
  .lms-editor label { font-size:11px; }
  .lms-editor .lms-opt { padding:3px 5px; margin:3px 0; border:1px solid var(--line); background:var(--bg); border-radius:3px; }
  .lms-answer-letter { font-size:10px; color:var(--muted); }
  .lms-form-message { font-size:10px; color:var(--muted); padding:6px 8px; background:var(--bg); border-left:2px solid var(--line); margin:10px 0; }
  .lms-settings { border-top:1px solid var(--line); padding:10px 12px; }
  .lms-settings h4 { margin:0 0 8px; font-size:11px; }
  .lms-setting-row { display:flex; justify-content:space-between; gap:10px; padding:5px 0; font-size:10px; color:var(--muted); border-bottom:1px solid var(--line); }
  .lms-setting-row b { font-weight:500; color:var(--fg); }
  .lms-module-head { height:34px; display:flex; align-items:center; gap:7px; border-bottom:1px solid var(--line); padding:0 10px; font-size:10px; color:var(--muted); }
  .lms-modules { height:calc(100% - 34px); }
  .lms-unit-col { width:44%; padding:8px; }
  .lms-lesson-col { padding:8px; }
  .lms-dragrow { border-radius:3px; gap:4px; }
  .lms-grip { padding:5px 2px; }
  .lms-grip .lms-icon { width:12px; }
  .lms-unit-open { font-size:11px!important; line-height:1.2; }
  .lms-unit-open small { display:block; color:var(--muted); font-size:9px; padding-top:4px; }
  .lms-row-state { color:color-mix(in srgb,#248353 80%,var(--fg)); padding-right:5px; flex:none; }
  .lms-row-state .lms-icon { width:12px; height:12px; }
  .lms-dragtext { flex:1; }
  .lms-dragtext small { display:block; color:var(--muted); font-size:9px; padding-top:3px; }
  .lms-resources { margin-top:18px; border-top:1px solid var(--line); padding-top:10px; }
  .lms-resources h4 { margin:0 0 6px; color:var(--muted); font-size:10px; }
  .lms-resource { display:flex; gap:6px; align-items:center; padding:8px 3px; border-bottom:1px solid var(--line); font-size:10px; }
  .lms-resource small { display:block; color:var(--muted); font-size:9px; padding-top:2px; }
  .lms-rubric-intro { padding:10px 12px; border-bottom:1px solid var(--line); }
  .lms-rubric-intro h3 { margin:0 0 4px; font-size:14px; }
  .lms-rubric-intro p { color:var(--muted); font-size:10px; margin:4px 0; }
  .lms-rubric th { padding:7px 3px; position:sticky; top:0; z-index:1; }
  .lms-rubric td { padding:6px 3px; }
  .lms-rubric td:first-child { font-size:11px; }
  .lms-criterion-desc { font-size:9px; color:var(--muted); font-weight:400; line-height:1.3; margin-top:4px; }
  .lms-rating { min-height:48px; gap:1px; }
  .lms-rating small { font-size:9px; }
  .lms-paper { padding:10px; background:var(--panel); border:1px solid var(--line); margin:8px 0; box-shadow:0 2px 3px #0001; }
  .lms-paper h4 { font-size:11px; margin:0 0 5px; }
  .lms-paper p { line-height:1.55; font-family:Georgia,serif; font-size:11px; }
  .lms-comment { width:100%; min-height:55px; resize:vertical; border:1px solid var(--line); background:var(--panel); color:var(--fg); padding:7px; border-radius:3px; font:inherit; font-size:11px; }
  .lms-pop { position:absolute; top:54px; right:12px; width:240px; max-height:65%; overflow:auto; background:var(--panel); border:1px solid var(--line); box-shadow:0 6px 20px #0003; border-radius:5px; padding:12px; z-index:20; }
  .lms-pop h4 { margin:0 0 8px; }
  .lms-pop p { padding:8px 0; margin:0; border-bottom:1px solid var(--line); font-size:11px; }
  .lms-pop button { margin-top:8px; }
  .lms.slim .lms-rail { width:39px; padding:9px 3px; }
  .lms.slim .lms-rail button { padding:8px; }
  .lms.slim .lms-rail button span,.lms.slim .lms-rail-label,.lms.slim .lms-rail-course,.lms.slim .lms-rail-brand span { display:none; }
  .lms.slim .lms-rail-brand { padding:3px 6px 14px; }
  .lms.slim .lms-head { height:49px; padding:7px 9px; }
  .lms.slim h2 { font-size:13px; }
  .lms.slim .lms-head .lms-badge,.lms.slim .lms-head-actions .lms-avatar { display:none; }
  .lms.slim .lms-qrail { width:70px; }
  .lms.slim .lms-source { min-width:145px; padding:7px; }
  .lms.slim .lms-status-col { display:none; }
  .lms.slim .lms-tools > .lms-muted,.lms.slim .lms-nav .lms-extra-nav { display:none; }
  .lms.slim .lms-context { flex-wrap:wrap; padding:4px 7px; font-size:9px; gap:4px; }
  .lms.slim .lms-context .lms-filter { padding:2px 4px; font-size:9px; }
  .lms.slim .lms-table td { padding:5px; }
  .lms.slim .lms-student .lms-avatar { display:none; }
  .lms.slim .lms-editor { padding:8px; }
  .lms.slim .lms-unit-open small,.lms.slim .lms-dragtext small { display:none; }
  `;
  const PATHS = {
    book: 'M3 4h7l2 2 2-2h7v16h-7l-2 2-2-2H3z M12 6v16',
    home: 'M3 11l9-8 9 8 M5 10v11h5v-7h4v7h5V10',
    users: 'M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M17 4a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-4',
    file: 'M5 3h9l5 5v13H5z M14 3v6h5 M8 13h8 M8 17h6',
    grid: 'M3 3h18v18H3z M3 9h18 M3 15h18 M9 3v18',
    quiz: 'M5 3h14v18H5z M8 7h1 M12 7h4 M8 12h1 M12 12h4 M8 17h1 M12 17h4',
    layers: 'M12 3l10 5-10 5L2 8z M2 12l10 5 10-5 M2 16l10 5 10-5',
    message: 'M3 4h18v13H8l-5 4z M7 8h10 M7 12h7',
    calendar: 'M4 5h16v16H4z M8 2v6 M16 2v6 M4 10h16 M8 14h2 M14 14h2',
    bell: 'M5 17h14l-2-3V9a5 5 0 0 0-10 0v5z M10 21h4',
    chevron: 'M9 5l7 7-7 7', down: 'M6 9l6 6 6-6', plus: 'M12 5v14 M5 12h14',
    check: 'M5 12l4 4L19 6', lock: 'M5 10h14v11H5z M8 10V6a4 4 0 0 1 8 0v4',
    grip: 'M8 5h1 M15 5h1 M8 12h1 M15 12h1 M8 19h1 M15 19h1',
    more: 'M5 12h1 M11 12h1 M17 12h1', filter: 'M3 4h18l-7 8v7l-4 2v-9z',
    download: 'M12 3v12 M7 10l5 5 5-5 M4 17v4h16v-4', upload: 'M12 16V4 M7 9l5-5 5 5 M4 17v4h16v-4',
    settings: 'M4 7h16 M4 17h16 M8 4v6 M16 14v6', search: 'M15 15l6 6 M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14',
    link: 'M10 13l4-4 M8 16l-2 2a4 4 0 0 1-6-6l4-4 M16 8l2-2a4 4 0 0 1 6 6l-4 4',
    image: 'M3 3h18v18H3z M3 17l6-6 4 4 3-3 5 5 M15 7h1',
    clock: 'M12 7v6l4 2 M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20',
  };

  const TOKENS = {
    css: CSS,
    colors: { panel: 'var(--panel)', line: 'var(--line)', accent: 'var(--accent)', muted: 'var(--muted)', fg: 'var(--fg)', bg: 'var(--bg)' },
    font: 'inherit',
    fontSize: 12,
    inset: 10,
    radius: 5,
    railWidth: 148,
    sourceWidth: 27,
    sourceMin: 170,
    sourceMax: 265,
    narrowAt: 920,
    brand: 'Scholar',
    names: { grades: 'Gradebook', quiz: 'Quizzes', modules: 'Modules', rubric: 'Rubrics' },
    icons: PATHS,
    concludedCount: 9,
    rowMax: 73,
    rowMin: 22,
    rowReserve: 81,
    rowGap: 5,
    rowDetailsAt: 40,
    resourcesAt: 440,
    activity: [['Project report received', 'Today, 09:18'], ['Moderation notes updated', 'Yesterday, 16:42'], ['Week 6 announcement published', 'Yesterday, 10:00']],
    quizSettings: [['Assignment group', 'Assessments'], ['Time limit', 'No time limit'], ['Attempts allowed', '1'], ['Shuffle answers', 'Off'], ['Results release', 'After the due date'], ['Availability', 'Not yet scheduled']],
  };

  env.template('use-course-admin/_theme', () => ({ TOKENS }));
})();
