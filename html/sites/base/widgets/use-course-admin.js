/*
 * base / use-course-admin/classic: a course administration workspace. Course navigation, contextual tools, autosave
 * status and persistent totals surround the gradebook, quiz editor, module organizer or rubric.
 * Source sheets / question briefs / teaching outlines stay visible beside the working pane.
 * Main and source panes accept wheel input; only the outer frame is a layout anchor. The model mirrors
 * visible editor targets so the task oracle scrolls before locating a control. No locate() mutations.
 * Module and lesson grips use measured env.ui.sortable lists, preserving nested parent membership.
 * Unscored concluded enrollments, course activity, library items and supporting documents add scene
 * density without adding task targets. Icons are inline SVG; all frame follows the reference tokens.
 */
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
  let view;
  env.widget({
    task: 'use-course-admin', site: 'base', name: 'classic', split: 'train',
    scenarios: ['grades', 'quiz', 'modules', 'rubric'],
    render(ctx) {
      const { spec: s, util } = ctx, f = env.taskDef, el = util.el;
      ctx.css('app-lms-classic', CSS);
      const rng = ctx.rng.fork('lms-polish'), cs = { csplit: s.csplit };
      const icon = (parent, name) => {
        const svg = util.svg('svg', { viewBox: '0 0 24 24', class: 'lms-icon', 'aria-hidden': 'true' }, parent);
        util.svg('path', { d: PATHS[name] || PATHS.file }, svg); return svg;
      };
      const initials = name => name.split(' ').map(x => x[0]).slice(0, 2).join('');
      const root = el('section', `lms ${s.scenario}${ctx.size.width < 920 ? ' compact slim' : ''}`, ctx.stage);
      const button = (p, label, action, cls = '') => { const b = el('button', `lms-btn ${cls}`, p, label); b.type = 'button'; if (action) b.addEventListener('click', action); return b; };
      let pop = null;
      function showPanel(title, lines) {
        if (pop) pop.remove();
        ctx.update({ ...ctx.model, workspacePanel: title });
        pop = el('aside', 'lms-pop', root); el('h4', '', pop, title);
        for (const line of lines) el('p', '', pop, line);
        button(pop, 'Close', () => { pop.remove(); pop = null; ctx.update({ ...ctx.model, workspacePanel: null }); });
      }
      const rail = el('aside', 'lms-rail', root), brand = el('div', 'lms-rail-brand', rail);
      icon(brand, 'book'); el('span', '', brand, 'Scholar');
      el('div', 'lms-rail-label', rail, 'Teaching / Autumn');
      const names = { grades: 'Gradebook', quiz: 'Quizzes', modules: 'Modules', rubric: 'Rubrics' };
      const links = [['home', 'Course home', 'home'], ['announcements', 'Announcements', 'bell'], ['modules', 'Modules', 'layers'],
        ['assignments', 'Assignments', 'file'], ['quiz', 'Quizzes', 'quiz'], ['grades', 'Gradebook', 'grid'],
        ['rubric', 'Rubrics', 'grid'], ['discussions', 'Discussions', 'message'], ['people', 'People', 'users'], ['calendar', 'Calendar', 'calendar']];
      for (const [id, label, pict] of links) {
        const b = button(rail, '', () => showPanel(label, id === 'announcements'
          ? ['Week 6: project feedback is available.', 'Library workshop: Wednesday, 14:00.', 'Office hours have moved to Room 204.']
          : ['Current course: ' + s.course, 'Course materials and settings are available to teaching staff.']), id === s.scenario ? 'current' : '');
        b.title = label; icon(b, pict); el('span', '', b, label);
        if (id === 'announcements' || id === 'discussions') el('span', 'lms-rail-count', b, id === 'announcements' ? '3' : '8');
      }
      const railBottom = el('div', 'lms-rail-bottom', rail); el('div', 'lms-rail-label', railBottom, 'Other courses');
      for (const course of ['Research Studio II', 'Portfolio Seminar']) {
        const c = el('div', 'lms-rail-course', railBottom); el('b', '', c, course); el('span', 'lms-muted', c, 'Autumn term / Staff');
      }
      const surface = el('div', 'lms-surface', root);
      const head = el('header', 'lms-head', surface), title = el('div', '', head);
      const crumb = el('div', 'lms-crumb', title); el('span', '', crumb, 'My courses'); icon(crumb, 'chevron'); el('span', '', crumb, 'Autumn / Section A');
      el('h2', '', title, s.course);
      const headActions = el('div', 'lms-head-actions', head); el('span', 'lms-badge', headActions, 'Instructor view');
      const notices = button(headActions, '', () => showPanel('Notifications', ['2 submissions were received in Project report.', 'Grade moderation is due Friday.', 'A student replied to the Week 6 discussion.']), 'lms-iconbtn');
      notices.title = 'Notifications'; icon(notices, 'bell'); el('span', '', notices, '3');
      el('span', 'lms-avatar', headActions, initials(s.instructor)).title = s.instructor;
      const nav = el('nav', 'lms-nav', surface);
      for (const [id, name] of Object.entries(names)) el('span', id === s.scenario ? 'current' : '', nav, name);
      el('span', 'lms-extra-nav', nav, 'Course settings');
      const tools = el('div', 'lms-tools', surface);
      el('strong', '', tools, names[s.scenario]);
      const note = el('span', 'lms-muted', tools);
      const menu = button(tools, 'Actions', () => showPanel(`${names[s.scenario]} actions`, s.scenario === 'grades'
        ? ['Import a grade file (.csv)', 'Export the current gradebook', 'View grade change history', 'Manage grading periods']
        : ['View revision history', 'Manage availability', 'Copy to another course', 'Open course help']), 'lms-iconbtn'); icon(menu, 'down');
      const context = el('div', 'lms-context', surface);
      const scope = button(context, 'Section A', () => showPanel('Course sections', ['Section A / Current workspace', 'Section B / 24 enrollments', 'Concluded enrollments are read-only.']), 'lms-filter'); icon(scope, 'down');
      el('span', '', context, 'Autumn term'); el('span', 'right', context, s.scenario === 'grades' ? 'Grade posting: Manual' : 'Course status: Published');
      let roster = null;
      if (s.judge) {
        roster = el('div', 'lms-roster', surface); el('b', '', roster, 'Course roster / 2 matching students');
        for (const who of s.students.slice(0, 2)) button(roster, `${who.name} · ${who.id}`, () => act({ ...ctx.model, learner: who.id }));
      }
      const work = el('div', 'lms-work', surface);
      let list = null;
      if (s.scenario === 'quiz') {
        const qr = el('aside', 'lms-qrail', work); el('h4', '', qr, 'Questions'); list = el('div', 'lms-question-list', qr);
        el('h4', '', qr, 'Item banks');
        for (const [i, label] of ['Research foundations', 'Evidence review', 'Previous assessments'].entries()) {
          const item = el('div', 'lms-library-item', qr); icon(item, 'quiz'); el('b', '', item, label); el('small', '', item, `${[12, 8, 16][i]} items / Private`);
        }
      }
      const main = el('div', 'lms-main', work), source = el('aside', 'lms-source', work);
      const foot = el('footer', 'lms-foot', surface), summary = el('span', '', foot), status = el('span', 'saved', foot);
      icon(status, 'check'); const statusText = el('span', '', status, 'All changes saved');
      let targets = new Map(), lastEditor = '', editorRefs = {}, unitSort = null, lessonSort = null, activeUnit = null;
      let moduleRows = {}, lessonRows = {}, unitList = null, lessonList = null, lessonTitle = null;
      let drawing = false;
      const remember = (key, node) => { targets.set(key, node); return node; };
      function mirror() {
        if (drawing || s.scenario === 'modules') return;
        const r = main.getBoundingClientRect(), visible = [], keys = [...targets.keys()];
        for (const [key, node] of targets) {
          const b = node.getBoundingClientRect();
          if (b.height > 0 && b.top >= r.top + 1 && b.bottom <= r.bottom - 1) visible.push(key);
        }
        if (JSON.stringify(visible) !== JSON.stringify(ctx.model.visible) || JSON.stringify(keys) !== JSON.stringify(ctx.model.targets))
          ctx.update({ ...ctx.model, visible, targets: keys });
      }
      function act(m) { ctx.update(m); draw(ctx.model); }
      function updateQuestion(field, value) {
        const m = env.util.clone(ctx.model), q = m.questions[m.active];
        if (!q) return;
        q[field] = value; act(m);
      }
      function makeInput(parent, key, value, onInput, cls = '', tag = 'input') {
        const input = el(tag, cls, parent); if (tag === 'input') input.type = 'text';
        input.value = String(value ?? ''); input.setAttribute('aria-label', key);
        remember(key, input); input.addEventListener('input', () => onInput(input.value)); return input;
      }
      function drawSource() {
        const stamp = el('div', 'lms-source-stamp', source);
        el('span', 'lms-tag', stamp, s.scenario === 'rubric' ? 'Attempt 1 / Submitted' : 'Staff reference / Revision 3');
        el('p', 'lms-muted', stamp, s.scenario === 'rubric' ? 'Project report / PDF submission' : `Prepared by ${s.instructor}`);
        if (s.scenario === 'grades') {
          icon(el('h3', '', source, 'Grading sheet'), 'file');
          el('p', 'lms-muted', source, s.components ? 'Add the two rubric components for each score. Locked entries are already final.' : 'Approved marks · points. Locked entries are already final.');
          for (const row of s.students) {
            const r = el('div', 'lms-source-row', source); el('b', '', r, row.name); el('small', 'lms-id', r, row.id);
            for (const a of s.assignments) {
              const k = f.helpers.cellKey(row.id, a.id); if (s.locked[k] !== undefined) continue;
              el('p', '', r, a.title);
              const scores = el('div', 'lms-score', r);
              for (const scheme of ['Recorded', 'Moderated']) {
                const v = el('div', '', scores); el('small', '', v, scheme); el('b', '', v, s.records[k][scheme].join(' + '));
              }
            }
          }
        } else if (s.scenario === 'quiz') {
          icon(el('h3', '', source, 'Question brief'), 'file'); el('p', 'lms-muted', source, 'Approved question content. Correct answers are marked below.');
          s.bank.forEach((q, i) => {
            const a = el('article', '', source); el('small', '', a, `BRIEF ${i + 1} · ${q.type} · ${q.points} pts`); el('p', '', a, q.title);
            const ol = el('ol', '', a); q.options.forEach((o, j) => { const li = el('li', j === q.correct ? 'key' : '', ol, o); if (j === q.correct) icon(li, 'check'); });
          });
        } else if (s.scenario === 'modules') {
          icon(el('h3', '', source, 'Teaching outline'), 'layers'); el('p', 'lms-muted', source, 'Approved lesson sequence / Course design review');
          for (const u of s.units) {
            const a = el('article', '', source); el('b', '', a, u.title); const ol = el('ol', '', a);
            for (const id of s.goalLessons[u.id]) el('li', '', ol, u.lessons.find(l => l.id === id).title);
          }
        } else {
          el('h3', '', source, 'Project assessment');
          el('p', '', source, s.students.find(x => x.id === s.student).name);
          el('small', '', source, `Assessor: ${s.instructor}`);
          const paper = el('div', 'lms-paper', source); icon(paper, 'file'); el('h4', '', paper, 'Project report');
          el('small', 'lms-muted', paper, 'Submission preview / Page 1 of 4');
          el('p', '', paper, 'Our investigation examines how small changes in the study design affect the reliability of the findings.');
          el('p', '', paper, env.content.paragraph(rng.fork('submission'), 2, { ...cs, domain: 'science' }));
          el('p', 'lms-muted', source, 'Assessment guide');
          for (const [i, level] of s.levels.entries()) {
            const a = el('article', '', source); el('b', '', a, `${level} · ${i} × weight`);
            el('p', 'lms-muted', a, ['Evidence is absent or does not address the criterion.', 'Some relevant work; substantial gaps remain.', 'Clear and relevant work meeting the expected standard.', 'Consistent, thoughtful work exceeding the expected standard.'][i]);
          }
        }
        const activity = el('div', 'lms-activity', source); el('h4', '', activity, 'Recent activity');
        for (const [text, when] of [['Project report received', 'Today, 09:18'], ['Moderation notes updated', 'Yesterday, 16:42'], ['Week 6 announcement published', 'Yesterday, 10:00']]) {
          const p = el('p', '', activity, text); el('small', 'lms-id', p, when);
        }
      }
      function buildGrades() {
        note.textContent = 'All students / Points';
        const find = button(context, 'Student name or ID', () => showPanel('Find students', s.students.map(x => `${x.name} / ${x.id}`)), 'lms-filter'); icon(find, 'search');
        const filter = button(context, 'Filters', () => showPanel('Gradebook filters', ['Section: A', 'Enrollment: Active and concluded', 'Assignment group: All assignments', 'Grading period: Autumn term']), 'lms-filter'); icon(filter, 'filter');
        icon(button(tools, 'Export', () => showPanel('Gradebook export', ['Current gradebook / CSV format', 'Includes active and concluded enrollments.', 'Last export: Yesterday, 15:40']), 'lms-iconbtn'), 'download');
        const table = el('table', 'lms-table', main), tr = el('tr', '', el('thead', '', table));
        const caption = el('caption', 'lms-table-caption', table, `${s.students.length} active students / Concluded enrollments shown below / Finalized scores are locked`);
        el('th', '', tr, 'Student'); for (const a of s.assignments) { const h = el('th', '', tr, a.title); el('small', 'lms-id', h, `out of ${a.max}`); }
        el('th', 'lms-status-col', tr, 'Submission'); el('th', '', tr, 'Total');
        const body = el('tbody', '', table);
        for (const [i, row] of s.students.entries()) {
          const tr = el('tr', '', body), who = el('td', 'lms-person', tr), person = el('div', 'lms-student', who);
          el('span', 'lms-avatar', person, initials(row.name));
          const label = el('div', '', person, row.name); el('small', 'lms-id', label, `${row.id} / Section A`);
          for (const a of s.assignments) {
            const td = el('td', '', tr), key = f.helpers.cellKey(row.id, a.id);
            if (s.locked[key] !== undefined) { const lock = el('div', 'lms-lock', td, String(s.locked[key])); icon(lock, 'lock'); lock.title = 'Locked final grade'; }
            else makeInput(td, `cell:${key}`, ctx.model.marks[key], value => act({ ...ctx.model, marks: { ...ctx.model.marks, [key]: value } }), 'lms-mark');
          }
          const submission = el('td', 'lms-status-col', tr); el('span', `lms-tag ${i === 1 ? 'warn' : 'good'}`, submission, i === 1 ? 'Late' : 'Submitted');
          remember(`total:${row.id}`, el('td', '', tr));
        }
        const seen = new Set(s.students.map(x => x.name)), extras = 9;
        for (let i = 0; i < extras; i++) {
          let name = env.content.personName(rng, cs).full;
          if (seen.has(name)) name += ` ${i + 1}`; seen.add(name);
          const tr = el('tr', 'lms-concluded', body), td = el('td', 'lms-person', tr, name);
          el('small', 'lms-id', td, `C${700 + i} / Concluded`);
          let total = 0;
          for (const a of s.assignments) { const value = rng.int(Math.ceil(a.max * .6), a.max); total += value; el('td', '', tr, String(value)); }
          el('td', 'lms-status-col', tr, 'Finalized'); el('td', '', tr, String(total));
        }
        caption.textContent = `${s.students.length + extras} enrollments / ${s.students.length} active / Concluded grades are read-only`;
      }
      function buildQuiz(m) {
        const shape = `${m.active}/${m.questions.length}/${m.questions[m.active]?.type || ''}`;
        list.replaceChildren();
        m.questions.forEach((q, i) => {
          const b = button(list, `Q${i + 1}`, () => act({ ...ctx.model, active: i }), `lms-qnav${i === m.active ? ' current' : ''}`);
          b.title = q.title || 'Untitled question'; el('small', '', b, `${q.points || '0'} pts`);
          el('small', '', b, q.title ? q.title.slice(0, 32) : 'Untitled'); editorRefs[`nav:${i}`] = b;
        });
        if (shape === lastEditor) return;
        lastEditor = shape; main.replaceChildren(); targets = new Map(); editorRefs = {};
        main.scrollTop = 0;
        const banner = el('div', 'lms-pane-heading', main), heading = el('div', '', banner);
        el('b', '', heading, 'Course knowledge check'); el('small', '', heading, 'Graded quiz / Assignment group: Assessments');
        el('span', 'lms-tag warn', banner, 'Draft');
        if (!m.questions.length) {
          const e = el('div', 'lms-empty', main); icon(e, 'quiz'); el('b', '', e, 'This quiz has no questions yet');
          el('span', '', e, 'Questions can be authored here or reused from your private item banks.');
          quizSettings(main); return;
        }
        const q = m.questions[m.active], editor = el('div', 'lms-editor', main);
        el('b', '', editor, `Question ${m.active + 1}`); el('span', 'lms-id', editor, 'Saved draft / Student response required');
        el('label', '', editor, 'Question type');
        const types = el('div', 'lms-types', editor); remember('type', types);
        for (const type of ['Multiple choice', 'True / false']) {
          const b = button(types, type, () => {
            const next = env.util.clone(ctx.model), q = next.questions[next.active]; q.type = type;
            q.options = type === 'True / false' ? ['True', 'False'] : ['', '', '']; q.correct = -1; act(next);
          }); editorRefs[type] = b;
        }
        el('label', '', editor, 'Question text');
        const bar = el('div', 'lms-richbar', editor);
        for (const [label, name] of [['Bold', null], ['Italic', null], ['Insert link', 'link'], ['Insert image', 'image']]) {
          const b = button(bar, name ? '' : label[0], () => showPanel(label, ['Rich content editor', 'Formatting and embedded media are available for course authors.']));
          b.title = label; if (name) icon(b, name); else if (label === 'Bold') b.style.fontWeight = '750'; else b.style.fontStyle = 'italic';
        }
        el('span', '', bar, 'Paragraph');
        makeInput(editor, 'title', q.title, value => updateQuestion('title', value), '', 'textarea');
        el('label', '', editor, 'Options · select the correct answer');
        for (let i = 0; i < q.options.length; i++) {
          const row = el('div', 'lms-opt', editor), radio = el('input', '', row); radio.type = 'radio'; radio.name = 'answer';
          radio.setAttribute('aria-label', `Correct answer ${i + 1}`); remember(`answer:${i}`, radio); radio.addEventListener('change', () => updateQuestion('correct', i));
          el('span', 'lms-answer-letter', row, String.fromCharCode(65 + i));
          const input = makeInput(row, `option:${i}`, q.options[i], value => { const options = ctx.model.questions[ctx.model.active].options.slice(); options[i] = value; updateQuestion('options', options); });
          if (q.type === 'True / false') input.readOnly = true;
        }
        el('label', '', editor, 'Points'); makeInput(editor, 'points', q.points, value => updateQuestion('points', value), 'lms-points');
        editorRefs.validation = el('p', 'lms-form-message', editor);
        quizSettings(main);
      }
      function quizSettings(parent) {
        const settings = el('div', 'lms-settings', parent); el('h4', '', settings, 'Quiz settings');
        for (const [key, value] of [['Assignment group', 'Assessments'], ['Time limit', 'No time limit'], ['Attempts allowed', '1'], ['Shuffle answers', 'Off'], ['Results release', 'After the due date'], ['Availability', 'Not yet scheduled']]) {
          const row = el('div', 'lms-setting-row', settings); el('span', '', row, key); el('b', '', row, value);
        }
      }
      function buildModules() {
        note.textContent = 'Course content / Instructor sequence';
        const mh = el('div', 'lms-module-head', main); icon(mh, 'layers'); el('span', '', mh, 'Student progression');
        el('span', 'lms-tag', mh, 'Sequential requirements');
        const cols = el('div', 'lms-modules', main), left = el('div', 'lms-unit-col', cols), right = el('div', 'lms-lesson-col', cols);
        el('h3', 'lms-col-title', left, 'Course modules'); unitList = el('div', '', left);
        lessonTitle = el('h3', 'lms-col-title', right); lessonList = el('div', '', right);
        const h = Math.min(73, Math.max(22, Math.floor((main.clientHeight - 81) / Math.max(s.units.length, s.units[0].lessons.length)) - 5));
        for (const [i, u] of s.units.entries()) {
          const row = el('div', 'lms-dragrow', unitList); row.style.height = `${h}px`; moduleRows[u.id] = row;
          icon(el('span', 'lms-grip', row), 'grip'); const b = el('button', 'lms-unit-open', row, u.title); b.type = 'button';
          if (h >= 40) el('small', '', b, `${u.lessons.length} items / ${i ? 'Prerequisite set' : 'No prerequisite'}`);
          icon(el('span', 'lms-row-state', row), i === s.units.length - 1 ? 'clock' : 'check');
          b.addEventListener('click', () => act({ ...ctx.model, unit: u.id })); editorRefs[`unit:${u.id}`] = b;
        }
        unitSort = env.ui.sortable(unitList, { order: ctx.model.order, items: moduleRows, handle: '.lms-grip', axis: 'y', activeClass: 'dragging',
          onChange: order => act({ ...ctx.model, order }) });
        if (main.clientHeight > 440) {
          const resources = el('div', 'lms-resources', left); el('h4', '', resources, 'Course resources');
          for (const [name, meta] of [['Course handbook.pdf', 'PDF / 420 KB'], ['Reading list', 'Library collection / 12 sources'], ['Assessment calendar', 'Course information / Updated yesterday']]) {
            const row = el('div', 'lms-resource', resources); icon(row, 'file'); const label = el('div', '', row, name); el('small', '', label, meta);
          }
        }
      }
      function drawLessons(m) {
        if (activeUnit === m.unit) { lessonSort.set(m.lessons[m.unit]); return; }
        if (lessonSort) lessonSort.detach(); activeUnit = m.unit; lessonList.replaceChildren(); lessonRows = {};
        const u = s.units.find(u => u.id === m.unit); lessonTitle.textContent = `Lessons / ${u.title}`;
        const h = Math.min(73, Math.max(22, Math.floor((main.clientHeight - 81) / u.lessons.length) - 5));
        for (const [i, lesson] of u.lessons.entries()) {
          const row = el('div', 'lms-dragrow', lessonList); row.style.height = `${h}px`; lessonRows[lesson.id] = row;
          icon(el('span', 'lms-grip', row), 'grip'); icon(row, i === 2 ? 'quiz' : i === 3 ? 'message' : 'file');
          const label = el('span', 'lms-dragtext', row, lesson.title);
          if (h >= 40) el('small', '', label, `${i === 2 ? 'Assignment / 10 pts' : 'Learning resource'} / ${i === 1 ? 'Complete to continue' : 'Published'}`);
          icon(el('span', 'lms-row-state', row), 'check');
        }
        lessonSort = env.ui.sortable(lessonList, { order: m.lessons[u.id], items: lessonRows, handle: '.lms-grip', axis: 'y', activeClass: 'dragging',
          onChange: order => act({ ...ctx.model, lessons: { ...ctx.model.lessons, [u.id]: order } }) });
      }
      function buildRubric() {
        note.textContent = 'Project report / Assessment';
        const intro = el('div', 'lms-rubric-intro', main); el('h3', '', intro, 'Project report: assessment rubric');
        el('p', '', intro, `${s.students.find(x => x.id === s.student).name} / Section A / Attempt 1`);
        el('p', '', intro, 'Assess evidence, reasoning and communication against the course learning outcomes. Scores are weighted by criterion.');
        const table = el('table', 'lms-rubric', main), tr = el('tr', '', el('thead', '', table));
        el('th', '', tr, 'Criterion'); for (const name of s.levels) el('th', '', tr, name);
        const body = el('tbody', '', table);
        s.criteria.forEach((c, i) => {
          const tr = el('tr', '', body), td = el('td', '', tr, c.title); el('small', 'lms-id', td, `Weight x ${c.weight}`);
          el('div', 'lms-criterion-desc', td, ({ 'Use of evidence': 'Support claims with relevant sources.', 'Clarity of argument': 'Develop a clear, defensible position.',
            Organization: 'Structure ideas in a logical sequence.', 'Original insight': 'Show independent analysis and reflection.', 'Source attribution': 'Credit sources consistently.', 'Visual communication': 'Present information clearly and accessibly.' })[c.title]);
          for (let j = 0; j < s.levels.length; j++) {
            const cell = el('td', '', tr), b = button(cell, `${j * c.weight}`, () => { const ratings = ctx.model.ratings.slice(); ratings[i] = j; act({ ...ctx.model, ratings }); }, 'lms-rating');
            b.setAttribute('aria-label', `${c.title}: ${s.levels[j]}`); el('small', '', b, 'points'); editorRefs[`rating:${i}:${j}`] = b;
            if (j === 0) remember(`rating:${i}`, b);
          }
        });
        const feedback = el('div', 'lms-settings', main); el('h4', '', feedback, 'Overall feedback');
        const comment = el('textarea', 'lms-comment', feedback); comment.placeholder = 'Add a comment for the student...';
        comment.readOnly = true; comment.title = 'Feedback is managed in the submission conversation';
        button(feedback, 'Submission comments', () => showPanel('Submission conversation', ['Student: I revised the comparison section and added the source notes.', 'Instructor: Thank you. The assessment will be released after moderation.']));
      }
      function draw(m) {
        drawing = true;
        if (s.scenario === 'grades') {
          let pending = 0, invalid = 0;
          for (const [key, node] of targets) if (key.startsWith('cell:')) {
            const k = key.slice(5), v = m.marks[k]; if (node.value !== v) node.value = v;
            const a = s.assignments.find(a => k.endsWith(`:${a.id}`));
            const bad = v !== '' && (!Number.isFinite(Number(v)) || Number(v) < 0 || Number(v) > a.max);
            node.setAttribute('aria-invalid', String(bad)); node.title = bad ? `Enter a score from 0 to ${a.max}` : `${a.title} / Points`;
            if (v === '') pending++; if (bad) invalid++;
          }
          note.textContent = invalid ? `${invalid} invalid scores` : pending ? `${pending} awaiting grades` : 'All active grades recorded';
          for (const row of s.students) targets.get(`total:${row.id}`).textContent = String(f.helpers.total(m, s, row.id));
        } else if (s.scenario === 'quiz') {
          buildQuiz(m); const q = m.questions[m.active];
          if (q) {
            for (const key of ['title', 'points']) { const n = targets.get(key); if (n.value !== String(q[key])) n.value = q[key]; }
            q.options.forEach((v, i) => { const n = targets.get(`option:${i}`); if (n.value !== v) n.value = v; targets.get(`answer:${i}`).checked = q.correct === i; });
            for (const type of ['Multiple choice', 'True / false']) editorRefs[type].classList.toggle('on', type === q.type);
            const missing = [!q.title.trim() && 'Question text required', q.options.some(x => !x.trim()) && 'Complete all options', q.correct < 0 && 'Answer key not set',
              (!String(q.points).trim() || !Number.isFinite(Number(q.points)) || Number(q.points) <= 0) && 'Points required'].filter(Boolean);
            editorRefs.validation.textContent = missing.length ? missing.join(' / ') : 'Question complete / Ready for review';
          }
          note.textContent = 'Draft quiz / Not published';
        } else if (s.scenario === 'modules') {
          unitSort.set(m.order); drawLessons(m);
          for (const u of s.units) moduleRows[u.id].classList.toggle('current', m.unit === u.id);
        } else {
          s.criteria.forEach((c, i) => s.levels.forEach((v, j) => { const b = editorRefs[`rating:${i}:${j}`]; b.classList.toggle('on', m.ratings[i] === j); b.setAttribute('aria-pressed', String(m.ratings[i] === j)); }));
        }
        summary.textContent = f.facts(m, s).map(x => `${x.label}: ${x.value}`).join('  ·  ');
        statusText.textContent = m.learner ? `Viewing student ${m.learner}` : 'All changes saved';
        drawing = false; mirror();
      }
      drawSource();
      if (s.scenario === 'grades') buildGrades();
      else if (s.scenario === 'quiz') {
        editorRefs.add = button(tools, 'Add question', () => {
          const m = env.util.clone(ctx.model); m.questions.push(f.helpers.blankQuestion()); m.active = m.questions.length - 1; act(m);
        }, 'primary');
        icon(editorRefs.add, 'plus');
        editorRefs.remove = button(tools, 'Delete question', () => {
          const m = env.util.clone(ctx.model); m.questions.splice(m.active, 1); m.active = Math.max(0, Math.min(m.active, m.questions.length - 1)); act(m);
        });
      } else if (s.scenario === 'modules') buildModules();
      else buildRubric();
      // Keep toolbar references separate from dynamically rebuilt editor controls.
      const add = tools.querySelector('.primary'), remove = [...tools.querySelectorAll('button')].find(b => b.textContent === 'Delete question');
      env.ui.scrollPane(main, { onScroll: mirror }); env.ui.scrollPane(source, {});
      main.addEventListener('scroll', mirror);
      draw(ctx.model);
      view = {
        locate(t) {
          if (t.pane) return util.center(t.pane === 'source' ? source : main);
          if (t.cell) return util.center(targets.get(`cell:${t.cell}`));
          if (t.add) return util.center(add);
          if (t.remove) return util.center(remove);
          if (t.question !== undefined) return util.center(list.children[t.question]);
          if (t.field) return util.center(targets.get(t.field));
          if (t.option !== undefined) return util.center(targets.get(`option:${t.option}`));
          if (t.answer !== undefined) return util.center(targets.get(`answer:${t.answer}`));
          if (t.type) return util.center(editorRefs[t.type]);
          if (t.unit) return util.center(editorRefs[`unit:${t.unit}`]);
          if (t.item && t.slot === undefined) return (t.group === 'modules' ? unitSort : lessonSort).locate(t.item);
          if (t.slot !== undefined) return (t.group === 'modules' ? unitSort : lessonSort).locateSlot(t.slot, undefined, t.item);
          if (t.rating) return util.center(editorRefs[`rating:${t.rating[0]}:${t.rating[1]}`]);
          throw new Error(`use-course-admin cannot locate ${JSON.stringify(t)}`);
        },
      };
      return { anchors: [root], sync: draw };
    },
    locate(t) { return view.locate(t); },
  });
})();
