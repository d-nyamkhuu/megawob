/* base / use-smart-home/classic: Lumen home console + Stillwave media library. All five scenarios.
 * Uses the reference design tokens in every theme. Rotary controls use env.ui.dial and circular paths;
 * brightness / seeking use env.ui.slider; playlist uses env.ui.sortable. Scene's time picker is DOM,
 * never a native popup. Inner activity / device / queue panes support wheel scrolling.
 * Fixed outer anchors, controlled state in sync(), no timers, network, native media or wall clock.
 * Product detail: household/library navigation, notifications, equipment status, climate history,
 * lighting presets, automation run history, track metadata and a chaptered documentary viewer.
 * All icons and the original media illustration are inline SVG. Secondary controls open local
 * information panels; they never add scored targets or modify the task's goal.
 */
(function () {
  'use strict';
  let view;
  const CSS = `
  .ah-app { position:relative; overflow:hidden; display:flex; flex-direction:column; border:1px solid var(--line);
    border-radius:14px; background:var(--panel); color:var(--fg); box-shadow:0 10px 34px #0000000d; font-size:13px; }
  .ah-app * { box-sizing:border-box; }
  .ah-top { height:52px; flex:none; display:flex; align-items:center; gap:12px; padding:0 20px; border-bottom:1px solid var(--line); }
  .ah-logo { height:29px; width:29px; display:grid; place-items:center; background:var(--accent); color:white; border-radius:9px; font-size:20px; }
  .ah-brand { font-weight:750; font-size:16px; letter-spacing:-.5px; }
  .ah-muted { color:var(--muted); font-size:12px; }
  .ah-grow { flex:1; min-width:0; }
  .ah-pill { padding:4px 9px; border-radius:20px; background:color-mix(in srgb,var(--accent) 10%,var(--panel)); color:var(--accent); font-size:11px; white-space:nowrap; }
  .ah-avatar { width:28px; height:28px; border-radius:50%; display:grid; place-items:center; background:var(--bg); border:1px solid var(--line); font-size:11px; }
  .ah-nav { height:34px; padding:0 20px; display:flex; gap:20px; align-items:center; background:var(--bg); flex:none; border-bottom:1px solid var(--line); color:var(--muted); font-size:11px; }
  .ah-nav .selected { color:var(--accent); font-weight:650; }
  .ah-body { flex:1; min-height:0; display:grid; grid-template-columns:minmax(0,1fr) 210px; }
  .ah-main { min-width:0; min-height:0; padding:17px 22px; display:flex; flex-direction:column; position:relative; }
  .ah-aside { border-left:1px solid var(--line); background:color-mix(in srgb,var(--bg) 65%,var(--panel)); padding:17px; min-width:0; overflow:hidden; }
  .ah-main h2 { font-size:20px; margin:0; font-weight:650; letter-spacing:-.4px; line-height:1.3; }
  .ah-main h3,.ah-aside h3 { font-size:12px; margin:0 0 12px; font-weight:650; }
  .ah-head { display:flex; align-items:center; gap:12px; margin-bottom:12px; flex:none; }
  .ah-eyebrow { color:var(--muted); font-size:10px; text-transform:uppercase; letter-spacing:1.3px; margin-bottom:3px; }
  .ah-fact { display:flex; flex-direction:column; gap:3px; padding:12px 0; border-bottom:1px solid var(--line); }
  .ah-fact span { color:var(--muted); font-size:11px; }
  .ah-fact strong { font-size:15px; font-weight:600; font-variant-numeric:tabular-nums; }
  .ah-notice { margin-top:16px; padding:11px; border:1px solid var(--line); border-radius:8px; font-size:11px; color:var(--muted); line-height:1.55; }
  .ah-ring-area { flex:1; min-height:0; display:flex; align-items:center; justify-content:center; gap:20px; }
  .ah-ring { position:relative; flex:none; border-radius:50%; touch-action:none; cursor:grab; }
  .ah-ring:active { cursor:grabbing; }
  .ah-thermo { background:conic-gradient(from 225deg,var(--accent) 0deg,var(--accent) 270deg,transparent 270deg); box-shadow:inset 0 0 0 1px var(--line); }
  .ah-wheel { background:conic-gradient(#f34b4b,#ffe064,#76d15f,#46d9d9,#4c77ee,#b75fe6,#f34b4b); }
  .ah-ring-inner { position:absolute; inset:16px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px;
    border-radius:50%; background:var(--panel); box-shadow:0 0 0 6px color-mix(in srgb,var(--panel) 65%,transparent); pointer-events:none; }
  .ah-digits { font-size:49px; font-weight:550; letter-spacing:-2px; font-variant-numeric:tabular-nums; }
  .ah-ring-grip { position:absolute; width:18px; height:18px; border-radius:50%; background:var(--panel); border:3px solid var(--fg); transform:translate(-50%,-50%); box-shadow:0 1px 4px #0005; pointer-events:none; }
  .ah-ring-label { position:absolute; bottom:17px; font-size:10px; color:var(--muted); pointer-events:none; }
  .ah-ring-label.low { left:18px; } .ah-ring-label.high { right:18px; }
  .ah-segments { display:flex; gap:5px; align-items:center; justify-content:center; flex:none; padding:10px 0 0; }
  .ah-btn { border:1px solid var(--line); background:var(--panel); color:var(--fg); padding:7px 12px; border-radius:7px; cursor:pointer; font:inherit; font-size:12px; }
  .ah-btn:hover { border-color:var(--accent); }
  .ah-btn.on { background:color-mix(in srgb,var(--accent) 13%,var(--panel)); border-color:var(--accent); color:var(--accent); }
  .ah-btn.primary { color:white; background:var(--accent); border-color:var(--accent); }
  .ah-slider-line { position:relative; height:24px; margin:5px 10px; touch-action:none; cursor:pointer; }
  .ah-rail,.ah-fill { position:absolute; left:0; top:9px; height:6px; border-radius:8px; background:var(--line); pointer-events:none; }
  .ah-rail { width:100%; } .ah-fill { background:var(--accent); }
  .ah-thumb { position:absolute; width:18px; height:18px; border:2px solid var(--accent); background:var(--panel); border-radius:50%; box-shadow:0 1px 3px #0003; }
  .ah-slider-caption { display:flex; justify-content:space-between; font-size:11px; color:var(--muted); }
  .ah-light-controls { flex:none; padding-top:8px; }
  .ah-swatch { width:32px; height:32px; border:1px solid var(--line); border-radius:50%; margin:9px auto; }
  .ah-scene-layout { display:grid; grid-template-columns:minmax(210px,.9fr) minmax(220px,1.1fr); flex:1; gap:20px; min-height:0; }
  .ah-section { border-top:1px solid var(--line); padding-top:12px; }
  .ah-time { display:block; font-size:27px; padding:5px 20px; letter-spacing:1px; margin:6px 0 15px; font-variant-numeric:tabular-nums; }
  .ah-days { display:flex; flex-wrap:wrap; gap:4px; }
  .ah-days .ah-btn { min-width:29px; padding:7px 5px; font-size:10px; }
  .ah-device-pane { overflow:auto; min-height:0; flex:1; position:relative; }
  .ah-device { padding:10px 0; border-bottom:1px solid var(--line); }
  .ah-device-name { font-size:12px; font-weight:550; margin-bottom:7px; }
  .ah-device .ah-btn { padding:4px 8px; font-size:10px; }
  .ah-actions { display:flex; justify-content:space-between; align-items:center; padding-top:10px; margin-top:auto; gap:10px; flex:none; }
  .ah-picker { position:absolute; z-index:6; top:12px; left:20px; width:300px; padding:11px; border:1px solid var(--line); border-radius:10px;
    background:var(--panel); box-shadow:0 8px 24px #0004; }
  .ah-picker[hidden] { display:none; }
  .ah-picker-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:3px; margin:5px 0 8px; }
  .ah-picker .ah-btn { padding:3px; font-size:11px; line-height:17px; }
  .ah-queue-pane { overflow:auto; flex:1; min-height:0; position:relative; }
  .ah-queue { position:relative; width:100%; }
  .ah-track { position:absolute; display:flex; align-items:center; gap:11px; width:100%; padding:4px 9px; border-bottom:1px solid var(--line); background:var(--panel); border-radius:4px; }
  .ah-track.dragging { box-shadow:0 6px 18px #0003; outline:1px solid var(--accent); z-index:3; }
  .ah-grip { color:var(--muted); cursor:grab; padding:5px 3px; touch-action:none; font-size:17px; }
  .ah-cover { width:29px; height:29px; border-radius:4px; flex:none; background:linear-gradient(135deg,var(--art),var(--bg)); display:grid; place-items:center; font-size:13px; }
  .ah-track-title { font-size:12px; font-weight:550; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .ah-track small { font-size:10px; color:var(--muted); }
  .ah-plan { padding:0; list-style:none; counter-reset:tracks; margin:0; }
  .ah-plan li { padding:7px 0; border-bottom:1px solid var(--line); counter-increment:tracks; font-size:11px; }
  .ah-plan li:before { content:counter(tracks,decimal-leading-zero) '  '; color:var(--muted); margin-right:5px; font-size:10px; }
  .ah-player-footer { display:flex; align-items:center; gap:12px; padding:11px 0 0; flex:none; }
  .ah-play { height:31px; width:31px; border-radius:50%; border:0; background:var(--accent); color:white; }
  .ah-video { flex:1; min-height:80px; overflow:hidden; position:relative; border-radius:8px; background:linear-gradient(160deg,#243e44,#777b62); display:flex; align-items:center; justify-content:center; color:#fff; }
  .ah-video-caption { position:absolute; bottom:10px; left:13px; background:#18262bbd; padding:4px 8px; border-radius:4px; font-size:11px; }
  .ah-preview { position:absolute; bottom:26px; padding:8px 13px; background:var(--panel); border:1px solid var(--line); border-radius:6px; color:var(--fg); box-shadow:0 3px 12px #0003; font-size:11px; transform:translateX(-50%); pointer-events:none; white-space:nowrap; z-index:4; }
  .ah-preview[hidden] { display:none; }
  .ah-marker { position:absolute; top:8px; height:8px; width:2px; background:var(--panel); pointer-events:none; }
  .ah-chapter { padding:10px 0; border-bottom:1px solid var(--line); font-size:11px; }
  .ah-chapter.active { color:var(--accent); font-weight:650; }
  .ah-compact .ah-main { padding:12px 16px; } .ah-compact .ah-aside { padding:12px; }
  .ah-compact .ah-fact { padding:9px 0; } .ah-compact .ah-notice { margin-top:10px; padding:8px; }
  .ah-compact .ah-device { padding:7px 0; } .ah-compact .ah-head { margin-bottom:8px; }
  .ah-app { border-radius:10px; font-size:12px; }
  .ah-icon { display:inline-block; flex:none; width:17px; height:17px; vertical-align:middle; }
  .ah-top { height:47px; padding:0 15px; gap:10px; }
  .ah-logo .ah-icon { width:20px; height:20px; }
  .ah-utility { display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:5px 7px; min-height:27px;
    font:inherit; font-size:11px; border:1px solid transparent; border-radius:5px; color:var(--muted); background:transparent; cursor:pointer; }
  .ah-utility:hover { background:var(--bg); border-color:var(--line); color:var(--fg); }
  .ah-search { width:190px; border:1px solid var(--line); background:var(--bg); justify-content:flex-start; }
  .ah-shell { display:flex; flex:1; min-height:0; }
  .ah-sidebar { width:146px; flex:none; display:flex; flex-direction:column; padding:13px 8px; gap:3px;
    background:color-mix(in srgb,var(--bg) 75%,var(--panel)); border-right:1px solid var(--line); min-height:0; overflow:hidden; }
  .ah-sidebar .ah-utility { justify-content:flex-start; text-align:left; width:100%; min-height:29px; }
  .ah-sidebar .current { background:color-mix(in srgb,var(--accent) 12%,var(--panel)); color:var(--accent); font-weight:650; }
  .ah-side-heading { margin:12px 7px 4px; font-size:9px; letter-spacing:1px; color:var(--muted); text-transform:uppercase; }
  .ah-side-row { display:flex; gap:7px; align-items:center; min-height:32px; padding:3px 7px; color:var(--muted); font-size:10px; }
  .ah-side-row span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .ah-side-row b { margin-left:auto; font-size:9px; font-weight:450; }
  .ah-dot { display:inline-block; height:5px; width:5px; border-radius:50%; background:#559a7c; margin-right:5px; flex:none; }
  .ah-dot.warning { background:#b58a40; }
  .ah-hub { margin-top:auto; padding:10px 6px 0; border-top:1px solid var(--line); font-size:10px; line-height:1.7; color:var(--muted); }
  .ah-body { min-width:0; }
  .ah-main { padding:13px 16px; }
  .ah-aside { padding:13px; display:flex; flex-direction:column; gap:0; }
  .ah-nav { height:31px; padding:0 14px; gap:16px; }
  .ah-nav .ah-utility { padding:3px 0; min-height:24px; }
  .ah-head { gap:8px; margin-bottom:9px; }
  .ah-main h2 { font-size:19px; }
  .ah-fact { padding:9px 0; flex:none; }
  .ah-fact strong { font-size:14px; }
  .ah-fact span { font-size:10px; }
  .ah-notice { margin-top:11px; padding:9px; font-size:10px; }
  .ah-statusbar { height:23px; display:flex; align-items:center; gap:8px; padding:0 13px; border-top:1px solid var(--line);
    font-size:9px; color:var(--muted); background:var(--bg); flex:none; }
  .ah-toolbar { display:flex; align-items:center; justify-content:space-between; gap:8px; border-bottom:1px solid var(--line); padding:0 0 7px; margin-bottom:9px; flex:none; }
  .ah-toolbar .ah-muted { font-size:10px; }
  .ah-tab { font-size:10px; padding:4px 7px; }
  .ah-tab.current { color:var(--accent); background:color-mix(in srgb,var(--accent) 10%,var(--panel)); }
  .ah-description { font-size:10px; color:var(--muted); margin:3px 0 0; }
  .ah-info-row { display:flex; justify-content:space-between; gap:10px; padding:6px 0; border-bottom:1px solid var(--line); font-size:10px; color:var(--muted); }
  .ah-info-row strong { color:var(--fg); font-size:10px; font-weight:550; }
  .ah-subhead { margin:12px 0 5px; color:var(--muted); text-transform:uppercase; font-size:9px; letter-spacing:1px; }
  .ah-chart { display:block; width:100%; height:48px; color:var(--accent); margin:5px 0; }
  .ah-chart-labels { display:flex; justify-content:space-between; font-size:9px; color:var(--muted); }
  .ah-detail-card { border:1px solid var(--line); background:var(--bg); border-radius:7px; padding:9px 11px; margin-top:9px; flex:none; }
  .ah-detail-card .ah-info-row:last-child { border:0; }
  .ah-device-summary { display:flex; gap:10px; align-items:center; margin-bottom:8px; }
  .ah-device-summary .ah-icon { width:29px; height:29px; color:var(--accent); }
  .ah-device-summary strong { display:block; font-size:11px; }
  .ah-presets { display:flex; gap:7px; flex-wrap:wrap; margin:7px 0; }
  .ah-preset { flex:1; min-width:44px; font-size:9px; color:var(--muted); cursor:pointer; border:0; background:transparent; padding:0; text-align:center; }
  .ah-preset-swatch { display:block; height:26px; border-radius:5px; margin-bottom:4px; border:1px solid #8884; }
  .ah-scene-layout { grid-template-columns:minmax(165px,.9fr) minmax(185px,1.1fr); gap:13px; }
  .ah-device-name { display:flex; align-items:center; gap:7px; }
  .ah-device-meta { font-size:9px; color:var(--muted); margin:-3px 0 7px 24px; }
  .ah-time { display:flex; align-items:center; gap:14px; font-size:24px; padding:7px 12px; margin-bottom:12px; }
  .ah-time .ah-icon { width:15px; height:15px; }
  .ah-run { padding:8px 0; border-bottom:1px solid var(--line); font-size:10px; line-height:1.6; }
  .ah-run small { color:var(--muted); font-size:9px; }
  .ah-track { gap:7px; padding:3px 5px; }
  .ah-track-artist { display:block; color:var(--muted); font-size:10px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .ah-track-title { font-size:11px; }
  .ah-grip { padding:2px; display:flex; width:18px; justify-content:center; }
  .ah-grip .ah-icon { width:13px; }
  .ah-cover { overflow:hidden; }
  .ah-album { width:22%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:var(--muted); font-size:10px; }
  .ah-queue-head { display:flex; gap:9px; padding:5px 8px 7px; border-bottom:1px solid var(--line); color:var(--muted); font-size:9px; flex:none; }
  .ah-plan { min-height:0; flex:1; }
  .ah-plan li { padding:6px 0; font-size:10px; }
  .ah-queue-total { display:flex; gap:10px; flex:none; border-top:1px solid var(--line); margin-top:7px; }
  .ah-queue-total .ah-fact { border-bottom:0; flex:1; }
  .ah-play { display:inline-flex; align-items:center; justify-content:center; cursor:pointer; flex:none; }
  .ah-player-footer { gap:9px; padding-top:8px; }
  .ah-player-footer .ah-muted { font-size:10px; }
  .ah-progress-mini { width:65px; height:3px; border-radius:3px; background:var(--line); flex:none; }
  .ah-transport { display:flex; align-items:center; gap:4px; }
  .ah-video .ah-room-art { position:absolute; width:100%; height:100%; object-fit:cover; }
  .ah-film-credit { position:absolute; top:12px; left:12px; font-size:9px; letter-spacing:2px; color:#fff; text-shadow:0 1px 3px #000; }
  .ah-preview { padding:4px; border-radius:5px; font-size:10px; }
  .ah-preview-art { width:132px; height:64px; overflow:hidden; border-radius:3px; background:#8e9a8b; }
  .ah-preview-art svg { width:100%; height:100%; }
  .ah-preview-text { padding:4px; }
  .ah-chapter { display:flex; align-items:center; gap:8px; padding:7px 0; font-size:10px; }
  .ah-chapter-thumb { width:36px; height:23px; border-radius:3px; background:linear-gradient(140deg,#70877c,#c2b49d); flex:none; }
  .ah-chapter small { display:block; color:var(--muted); font-size:9px; }
  .ah-related { display:flex; gap:8px; padding:9px 0; border-top:1px solid var(--line); font-size:10px; }
  .ah-related .ah-cover { width:43px; height:29px; background:linear-gradient(120deg,#526d71,#c4a77d); }
  .ah-inspector { position:absolute; right:12px; top:51px; width:285px; max-height:calc(100% - 68px); overflow:auto; z-index:9;
    padding:15px; background:var(--panel); border:1px solid var(--line); border-radius:9px; box-shadow:0 10px 35px #0004; }
  .ah-inspector[hidden] { display:none; }
  .ah-inspector h3 { margin:0; font-size:14px; }
  .ah-inspector .ah-run { padding:12px 0; }
  .ah-compact .ah-sidebar { width:128px; padding:8px 5px; }
  .ah-compact .ah-main { padding:10px 13px; }
  .ah-compact .ah-aside { padding:11px; }
  .ah-compact .ah-fact { padding:7px 0; }
  .ah-compact .ah-notice { margin-top:8px; padding:7px; line-height:1.4; }
  .ah-compact .ah-subhead { margin-top:9px; }
  .ah-compact .ah-extra { display:none; }
  .ah-compact .ah-search { width:148px; }
  .ah-narrow .ah-sidebar { width:43px; }
  .ah-narrow .ah-sidebar .ah-utility { padding:5px; justify-content:center; }
  .ah-narrow .ah-sidebar .ah-side-label,.ah-narrow .ah-side-heading,.ah-narrow .ah-side-row,.ah-narrow .ah-hub { display:none; }
  .ah-narrow .ah-album { display:none; }
  .ah-sidebar .ah-side-label { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .ah-compact .ah-sidebar .ah-utility { min-height:26px; }
  .ah-compact .ah-side-row { min-height:25px; }
  .ah-compact .ah-side-heading { margin-top:8px; }
  .ah-hub { font-size:9px; line-height:1.5; padding-top:6px; flex:none; }
  .ah-scene-layout { grid-template-rows:minmax(0,1fr); }
  .ah-section { min-height:0; overflow:hidden; }
  .ah-compact .ah-section .ah-detail-card { display:none; }
  .ah-actions { position:relative; z-index:1; background:var(--panel); }
  .ah-segments .ah-btn { display:inline-flex; align-items:center; gap:5px; }
  .ah-inline-track { display:flex; align-items:center; gap:7px; }
  .ah-inline-track .ah-track-title { flex:1; min-width:0; }
  .ah-inline-track .ah-track-artist { max-width:40%; font-size:9px; }
  .ah-ring-inner { gap:2px; }
  .ah-ring-inner .ah-muted { font-size:10px; line-height:1.25; white-space:nowrap; }
  .ah-room-context { width:244px; margin-left:50px; border:1px solid var(--line); border-radius:8px; padding:15px; background:var(--bg); }
  .ah-room-context h3 { margin-bottom:5px; }
  .ah-room-context .ah-run { padding:13px 0; }
  .ah-room-context .ah-utility { margin-top:9px; }
  `;
  const F = () => env.taskDef;
  const ICONS = {
    home: 'M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9',
    music: 'M9 18V5l11-2v13M9 9l11-2M9 18c0 2-6 3-6 0s6-3 6 0m11-2c0 2-6 3-6 0s6-3 6 0',
    search: 'M16 16l5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
    bell: 'M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3M10 21h4M12 2v2',
    chevron: 'm8 10 4 4 4-4', close: 'm6 6 12 12M6 18 18 6',
    more: 'M5 11v2m7-2v2m7-2v2', plus: 'M12 4v16M4 12h16',
    settings: 'M9 3h6l1 4 4 1v8l-4 1-1 4H9l-1-4-4-1V8l4-1 1-4M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
    heat: 'M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0',
    cool: 'M12 2v20M3 7l18 10M3 17 21 7M8 4l4 4 4-4M8 20l4-4 4 4',
    bulb: 'M9 19h6m-5 3h4M8 14c-6-7 2-14 7-9 4 4 0 8-1 10v2H9v-2l-1-1',
    clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M12 6v6l4 2',
    device: 'M5 3h14v18H5zM9 18h6', grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    activity: 'M2 12h5l3-8 4 16 3-8h5', list: 'M8 5h14M8 12h14M8 19h14M2 5h1m-1 7h1m-1 7h1',
    play: 'm8 4 13 8-13 8Z', pause: 'M8 4v16M16 4v16', next: 'm5 4 12 8-12 8ZM20 4v16',
    volume: 'M3 9h5l6-5v16l-6-5H3zM18 8c3 2 3 6 0 8',
    repeat: 'M4 8h15l-4-4m4 4-4 4M20 16H5l4 4m-4-4 4-4',
    shuffle: 'M3 5h3l12 14h3m-4-4 4 4-4 4M3 19h3l4-5m4-5 4-4h3m-4-4 4 4-4 4',
    grip: 'M9 4v1m6-1v1M9 11v1m6-1v1M9 18v1m6-1v1',
    heart: 'M12 21 3 12C-3 3 8-1 12 6c4-7 15-3 9 6l-9 9Z',
    video: 'M3 5h14v14H3zM17 10l5-4v12l-5-4',
    screen: 'M3 4h18v14H3zM8 22h8M12 18v4',
    expand: 'M3 9V3h6m6 0h6v6M3 15v6h6m6 0h6v-6',
    check: 'm5 12 5 5L20 7', wifi: 'M2 8c6-5 14-5 20 0M5 12c4-4 10-4 14 0M9 16c2-2 4-2 6 0M12 20h.01',
  };
  function icon(parent, name) {
    const svg = env.util.svg('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.6,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true', class: 'ah-icon' }, parent);
    env.util.svg('path', { d: ICONS[name] || ICONS.device }, svg);
    return svg;
  }
  // Original still frame for the fictional documentary; vector objects rather than font glyphs.
  function roomArt(parent) {
    const svg = env.util.svg('svg', { viewBox: '0 0 720 390', preserveAspectRatio: 'xMidYMid slice', class: 'ah-room-art', 'aria-hidden': 'true' }, parent);
    const add = (tag, attrs) => env.util.svg(tag, attrs, svg);
    add('rect', { width: 720, height: 390, fill: '#a8afa0' });
    add('path', { d: 'M0 300H720V390H0Z', fill: '#84745f' });
    add('path', { d: 'M0 0H172V300H0Z', fill: '#c7c7b4' });
    add('rect', { x: 30, y: 20, width: 230, height: 250, fill: '#3a4b49' });
    add('rect', { x: 40, y: 30, width: 210, height: 230, fill: '#c2d2c4' });
    add('path', { d: 'M40 210 98 103 137 165 192 79 250 191V260H40Z', fill: '#90ab9a' });
    add('path', { d: 'M112 30V260M184 30V260M40 149H250', stroke: '#4b5f57', 'stroke-width': 5, fill: 'none' });
    add('path', { d: 'M15 16H48V275H11ZM242 16h38v259h-34Z', fill: '#d9d0b7', opacity: .88 });
    add('path', { d: 'M38 270 230 275 370 390H102Z', fill: '#d1c1a0', opacity: .28 });
    add('ellipse', { cx: 407, cy: 348, rx: 210, ry: 28, fill: '#b7a48b' });
    add('rect', { x: 302, y: 82, width: 107, height: 90, rx: 2, fill: '#594e40' });
    add('rect', { x: 308, y: 88, width: 95, height: 78, fill: '#e0d2ae' });
    add('path', { d: 'M315 154 344 111 363 133 383 104 399 154Z', fill: '#7a8969' });
    add('rect', { x: 281, y: 220, width: 300, height: 91, rx: 23, fill: '#a9977c' });
    add('rect', { x: 272, y: 258, width: 317, height: 62, rx: 12, fill: '#c1b094' });
    add('rect', { x: 285, y: 228, width: 76, height: 53, rx: 9, fill: '#8b947c', transform: 'rotate(-8 323 254)' });
    add('rect', { x: 483, y: 230, width: 65, height: 53, rx: 8, fill: '#cec4a7', transform: 'rotate(7 514 255)' });
    add('path', { d: 'M290 317v17m278-17v17', stroke: '#453f35', 'stroke-width': 7 });
    add('ellipse', { cx: 403, cy: 334, rx: 78, ry: 17, fill: '#625d4a' });
    add('path', { d: 'M351 342v32m100-32v32', stroke: '#393e32', 'stroke-width': 5 });
    add('rect', { x: 382, y: 319, width: 32, height: 9, fill: '#d8c7a6' });
    add('rect', { x: 388, y: 313, width: 32, height: 6, fill: '#819391' });
    add('path', { d: 'M620 290V141m-1 69-38-37m38 13 36-45m-35 111 43-39', stroke: '#4d6148', 'stroke-width': 5, fill: 'none' });
    [[582, 167, -40], [648, 145, 35], [662, 209, 35], [615, 137, -5]].forEach(([cx, cy, rotation]) =>
      add('ellipse', { cx, cy, rx: 14, ry: 29, fill: '#526e4d', transform: `rotate(${rotation} ${cx} ${cy})` }));
    add('path', { d: 'M597 280h49l-8 49h-33Z', fill: '#9f7d62' });
    add('path', { d: 'M456 208V110m-20 0h40l-6-39h-28Z', stroke: '#645e49', 'stroke-width': 3, fill: '#c9b986' });
    add('rect', { x: 18, y: 318, width: 172, height: 8, fill: '#574e3d' });
    for (let i = 0; i < 7; i++) add('rect', { x: 29 + i * 19, y: 288 - i % 3 * 6, width: 14, height: 29 + i % 3 * 6, fill: ['#62796f', '#b7987a', '#d3c5a6'][i % 3] });
    return svg;
  }
  function render(ctx) {
    ctx.css('app-home-classic', CSS);
    const { util, spec: s, size } = ctx;
    const e = (tag, cls, parent, text) => util.el(tag, cls, parent, text);
    const compact = size.height < 585 || size.width < 900;
    const app = e('div', 'ah-app' + (compact ? ' ah-compact' : '') + (size.width < 930 ? ' ah-narrow' : ''), ctx.stage);
    app.style.width = Math.max(300, size.width - 36) + 'px';
    app.style.height = Math.max(250, size.height - 36) + 'px';
    const media = ['playlist', 'scrub'].includes(s.scenario);
    let inspector;
    const showInfo = (title, lines) => {
      inspector.replaceChildren(); inspector.hidden = false;
      const header = e('div', 'ah-head', inspector); e('h3', 'ah-grow', header, title);
      const close = e('button', 'ah-utility', header); close.type = 'button'; close.setAttribute('aria-label', 'Close panel'); icon(close, 'close');
      close.addEventListener('click', () => { inspector.hidden = true; });
      lines.forEach(([label, detail]) => { const row = e('div', 'ah-run', inspector); e('strong', '', row, label); e('br', '', row); e('small', '', row, detail); });
      ctx.log('panel', { title });
    };
    const utility = (parent, name, label, lines, cls = '') => {
      const b = e('button', 'ah-utility ' + cls, parent); b.type = 'button'; b.setAttribute('aria-label', label); b.title = label;
      if (name) icon(b, name);
      if (label && !cls.includes('icon-only')) e('span', 'ah-side-label', b, label);
      b.addEventListener('click', () => showInfo(label, lines || [['Nothing new', 'Your home hub is up to date.']]));
      return b;
    };
    const top = e('div', 'ah-top', app);
    icon(e('div', 'ah-logo', top), media ? 'music' : 'home');
    e('div', 'ah-brand', top, media ? 'stillwave' : 'lumen');
    e('span', 'ah-muted ah-grow', top, media ? 'Your listening space' : s.home);
    utility(top, 'search', media ? 'Search your library' : 'Find a device', media ? [['Albums', 'Amber Lines / Quiet Rooms'], ['Playlists', 'Slow living, Night shift, Weekend journal'], ['Videos', 'Home stories / 4 episodes']] : [['Rooms', 'Living room, Kitchen, Bedroom, Studio'], ['Devices', '12 connected devices across 4 rooms']], 'ah-search');
    utility(top, 'bell', 'Notifications', media ? [['Library sync paused', 'Listening history is stored on this device.'], ['New in your library', 'Quiet Rooms by Amber Lines is ready.']] : [['Hallway sensor', 'Battery low: 15%. Last reported 2 hours ago.'], ['Hub firmware 3.9', 'An update is available for the home hub.'], ['No critical alerts', 'Your home is operating normally.']], 'icon-only');
    const connection = e('span', 'ah-pill', top); e('i', 'ah-dot', connection); connection.append(media ? 'Local library' : 'Connected');
    e('div', 'ah-avatar', top, s.owner.split(' ').map(w => w[0]).slice(0, 2).join('')).title = s.owner;
    const nav = e('div', 'ah-nav', app);
    const navs = media ? ['Overview', 'Music library', 'Playlists', 'Videos'] : ['Overview', 'Rooms', 'Automations', 'Activity'];
    navs.forEach((name, i) => utility(nav, null, name, [[name, media ? 'Browse your saved collection and recently added media.' : 'Manage the rooms, devices and routines in this home.']], i === (s.scenario === 'scene' ? 2 : media ? s.scenario === 'scrub' ? 3 : 2 : 1) ? 'selected' : ''));
    const shell = e('div', 'ah-shell', app), sidebar = e('aside', 'ah-sidebar', shell);
    e('div', 'ah-side-heading', sidebar, media ? 'Your library' : 'Household');
    (media ? [['home', 'Home'], ['search', 'Browse'], ['heart', 'Liked songs'], ['list', 'Slow living'], ['list', 'Night shift'], ['list', 'Weekend journal'], ['video', 'Home stories']] :
      [['grid', 'Favorites'], ['device', 'All devices'], ['home', s.room], ['clock', 'Automations'], ['activity', 'Activity log']]).forEach(([name, label]) =>
      utility(sidebar, name, label, [[label, media ? 'Saved locally / available offline' : 'Home hub / devices connected'], ['Last updated', 'Today at 08:42']], label === s.room || label === (s.scenario === 'playlist' ? 'Slow living' : s.scenario === 'scrub' ? 'Home stories' : s.scenario === 'scene' ? 'Automations' : '') ? 'current' : ''));
    e('div', 'ah-side-heading', sidebar, media ? 'Recently added' : 'Other rooms');
    (media ? [['Quiet Rooms', 'Album'], ['Blue hour', 'Mix'], ['Sunday notes', 'Playlist']] : [['Kitchen', '3'], ['Bedroom', '4'], ['Studio', '2']]).forEach(([name, count]) => {
      const row = e('div', 'ah-side-row', sidebar); icon(row, media ? 'music' : 'home'); e('span', '', row, name); e('b', '', row, count);
    });
    const hub = e('div', 'ah-hub', sidebar);
    if (media) { icon(hub, 'screen'); e('span', '', hub, ' This computer'); e('div', '', hub, 'Offline listening enabled'); }
    else { e('i', 'ah-dot', hub); e('strong', '', hub, 'Home hub online'); e('div', '', hub, '12 devices / 4 rooms'); const warning = e('div', '', hub); e('i', 'ah-dot warning', warning); warning.append('1 accessory needs attention'); }
    const body = e('div', 'ah-body', shell);
    body.style.gridTemplateColumns = `minmax(0,1fr) ${Math.min(238, Math.max(180, size.width * .20))}px`;
    const main = e('div', 'ah-main', body), aside = e('aside', 'ah-aside', body);
    const head = e('div', 'ah-head', main), titleBox = e('div', 'ah-grow', head);
    e('div', 'ah-eyebrow', titleBox, media ? 'LIBRARY / ' + (s.scenario === 'playlist' ? 'PLAYLIST' : 'HOME STORIES') : 'MY HOME / ' + s.room.toUpperCase());
    e('h2', '', titleBox, s.scenario === 'thermostat' ? 'Climate control' : s.scenario === 'lightcolor' ? 'Ambient light' : s.scenario === 'scene' ? s.sceneName : s.scenario === 'playlist' ? 'Slow living' : s.title);
    e('div', 'ah-description', titleBox, s.scenario === 'thermostat' ? 'Lumen T2 / ' + s.room : s.scenario === 'lightcolor' ? 'Ceiling bulb / Lumen Colour A19' : s.scenario === 'scene' ? 'Time-based routine / Home hub' : s.scenario === 'playlist' ? `By ${s.owner} / Private playlist` : 'Stillwave Films / Home stories / Episode 04');
    utility(head, 'more', 'More options', [['Details', media ? 'Private collection. Available on this computer.' : s.serial + ' / Connected through the home hub.'], ['Help', 'Your changes are stored locally.']], 'icon-only');
    const toolbar = e('div', 'ah-toolbar', main);
    const tabs = e('div', '', toolbar);
    const tabDetails = {
      Temperature: [['Temperature control', 'Manual hold is active until the next scheduled change.']],
      Schedule: [['Comfort / 18:00', 'Every weekday / Home local time'], ['Sleep / 22:30', 'Every day / Energy saving']],
      History: [['Today, 07:00', 'Comfort schedule started'], ['Yesterday, 22:30', 'Sleep schedule started']],
      Colour: [['Colour control', 'Full colour / 0 to 359 degrees'], ['Brightness', 'Dimmable / 0 to 100%']],
      White: [['Warm white', '2700 K / Relaxed evenings'], ['Daylight', '6500 K / Clear, cool light']],
      Effects: [['Candlelight', 'A warm, gently changing glow'], ['Prism', 'A slow cycle through the colour spectrum']],
      Configuration: [['Time-based routine', 'Runs on the selected days, even when your phone is offline.']],
      'Run history': [['Yesterday, 18:30', 'Completed / All devices responded'], ['Mon, 18:30', 'Completed / Home hub']],
      Tracks: [['Slow living', 'Custom order / Private playlist']],
      Recommendations: [['Quiet Rooms', 'Album / Amber Lines'], ['Field Notes', 'Album / Moss Circuit'], ['Open Windows', 'Album / Harbor Assembly']],
      Watch: [['Playback position', 'Saved automatically on this computer.']],
      Details: [['Stillwave Films', 'Home stories / Episode 04'], ['Audio and captions', 'English stereo / English captions available']],
    };
    (s.scenario === 'thermostat' ? ['Temperature', 'Schedule', 'History'] : s.scenario === 'lightcolor' ? ['Colour', 'White', 'Effects'] : s.scenario === 'scene' ? ['Configuration', 'Run history'] : s.scenario === 'playlist' ? ['Tracks', 'Recommendations'] : ['Watch', 'Details']).forEach((name, i) =>
      utility(tabs, null, name, tabDetails[name], 'ah-tab' + (i === 0 ? ' current' : '')));
    utility(toolbar, media ? 'heart' : 'settings', media ? 'Save to library' : 'Device settings', [[media ? 'Saved collection' : 'Device information', media ? 'This item is available offline.' : s.serial + ' / Firmware 3.8 / Strong signal']], 'icon-only');
    const statusbar = e('div', 'ah-statusbar', app); icon(statusbar, media ? 'screen' : 'wifi');
    e('span', 'ah-grow', statusbar, media ? 'This computer / Local playback' : 'Home hub / All changes sync automatically');
    e('span', '', statusbar, media ? 'Library updated today' : 'Last synced just now');
    inspector = e('section', 'ah-inspector', app); inspector.hidden = true;
    const facts = {};
    function fact(label) { const row = e('div', 'ah-fact', aside); e('span', '', row, label); facts[label] = e('strong', '', row); }
    const buttons = {}, controls = {}, paints = [];
    let devicePane, recordDevicePane;
    let fitRing;
    const infoRow = (parent, label, value) => { const row = e('div', 'ah-info-row', parent); e('span', '', row, label); return e('strong', '', row, value); };
    const button = (parent, label, key, action) => {
      const b = e('button', 'ah-btn', parent, label); b.type = 'button'; b.addEventListener('click', action); buttons[key] = b; return b;
    };
    const patch = value => { ctx.patch(value); paint(ctx.model); };
    function paint(m) {
      for (const f of F().facts(m, s)) if (facts[f.label]) facts[f.label].textContent = f.value;
      for (const fn of paints) fn(m);
    }
    function linear(parent, control, max, value, label) {
      const track = e('div', 'ah-slider-line', parent);
      e('div', 'ah-rail', track);
      const fill = e('div', 'ah-fill', track), thumb = e('div', 'ah-thumb', track);
      thumb.setAttribute('aria-label', label);
      const api = env.ui.slider(track, { thumbs: [thumb], min: 0, max, step: 1, value,
        onInput: ([v]) => patch({ [control]: v }), label });
      controls[control] = api;
      paints.push(m => { api.set([m[control]]); fill.style.width = 100 * m[control] / max + '%'; });
      return track;
    }
    function rotary(control, hue) {
      const area = e('div', 'ah-ring-area', main);
      let diameter = hue ? 214 : 244;
      const ring = e('div', 'ah-ring ' + (hue ? 'ah-wheel' : 'ah-thermo'), area);
      ring.style.width = ring.style.height = diameter + 'px';
      ring.setAttribute('role', 'slider'); ring.setAttribute('aria-label', hue ? 'Bulb hue' : 'Thermostat setpoint');
      ring.setAttribute('aria-valuemin', hue ? '0' : String(s.min)); ring.setAttribute('aria-valuemax', hue ? '359' : String(s.max));
      const inner = e('div', 'ah-ring-inner', ring);
      e('span', 'ah-muted', inner, hue ? 'COLOUR' : 'SETPOINT');
      const readout = e('span', 'ah-digits', inner);
      const detail = e('span', 'ah-muted', inner);
      const grip = e('span', 'ah-ring-grip', ring);
      if (size.width > 1150 && size.height > 580) {
        const context = e('section', 'ah-room-context', area);
        e('h3', '', context, hue ? 'Around the room' : 'Climate in other rooms');
        e('div', 'ah-description', context, hue ? 'Connected lights / Live status' : 'Indoor sensors / Updated just now');
        const otherRooms = ['Living room', 'Kitchen', 'Studio', 'Bedroom', 'Sunroom'].filter(name => name !== s.room).slice(0, 3)
          .map((name, i) => [name, ['21°C / Heating', '20°C / Standby', '18°C / Cooling'][i]]);
        (hue ? [['Reading lamp', 'On / Warm white / 40%'], ['Shelf light', 'On / Soft amber / 25%'], ['Desk lamp', 'Unreachable / Last seen yesterday']] : otherRooms).forEach(([title, detail]) => {
          const row = e('div', 'ah-run', context); e('strong', '', row, title); e('br', '', row); e('small', '', row, detail);
        });
        utility(context, hue ? 'clock' : 'activity', hue ? 'Room automations' : 'Energy activity', hue ? [['Evening calm', 'Every day / 18:30'], ['Wind down', 'Every day / 22:00']] : [['Runtime today', 'Heating 1 h 24 min / Cooling 0 min'], ['Weekly average', '1 h 38 min per day']]);
      }
      if (!hue) { e('span', 'ah-ring-label low', ring, s.min + '°'); e('span', 'ah-ring-label high', ring, s.max + '°'); }
      const radius = () => diameter / 2 - 8;
      const api = env.ui.dial(ring, { angle: hue ? ctx.model.hue : F().helpers.dialAngle(s, ctx.model.temp),
        radius, band: [() => diameter / 2 - 31, () => diameter / 2 + 3], start: hue ? 0 : 225, sweep: hue ? 360 : 270,
        min: hue ? 0 : s.min, max: hue ? 360 : s.max, step: 1,
        label: hue ? 'bulb hue' : 'thermostat dial',
        onInput: (angle, value) => patch(hue ? { hue: Math.round(value) % 360 } : { temp: Math.round(value) }) });
      controls[control] = api;
      fitRing = () => {
        diameter = Math.max(100, Math.min(hue ? 214 : 244, area.clientHeight - 8, area.clientWidth - 22));
        ring.style.width = ring.style.height = diameter + 'px';
        readout.style.fontSize = Math.min(49, diameter * .23) + 'px';
        detail.style.display = diameter < 145 ? 'none' : '';
      };
      paints.push(m => {
        const angle = hue ? m.hue : F().helpers.dialAngle(s, m.temp);
        api.set(angle);
        grip.style.left = diameter / 2 + radius() * Math.sin(angle * Math.PI / 180) + 'px';
        grip.style.top = diameter / 2 - radius() * Math.cos(angle * Math.PI / 180) + 'px';
        readout.textContent = hue ? m.hue + '°' : m.temp + '°';
        detail.textContent = hue ? 'Full colour' : m.mode === 'heat' ? 'Heat mode' : 'Cool mode';
        ring.setAttribute('aria-valuenow', String(hue ? m.hue : m.temp));
      });
    }
    if (s.scenario === 'thermostat') {
      const summary = e('div', 'ah-device-summary', aside); icon(summary, 'heat');
      const summaryText = e('div', '', summary); e('strong', '', summaryText, s.room); e('span', 'ah-muted', summaryText, 'Indoor sensor / Connected');
      ['System status', 'Room temperature', 'Humidity'].forEach(fact);
      const note = e('div', 'ah-notice', aside);
      e('strong', '', note, 'Lumen T2 thermostat');
      e('div', '', note, `Supported range ${s.min}–${s.max}°C · 1° increments`);
      e('div', '', note, s.serial + ' · Firmware 3.8');
      e('div', 'ah-subhead', aside, 'Temperature / past 24 hours');
      const chart = util.svg('svg', { viewBox: '0 0 200 48', class: 'ah-chart', 'aria-label': 'Recorded room temperature history' }, aside);
      util.svg('path', { d: 'M0 12H200M0 36H200', stroke: 'var(--line)', 'stroke-width': 1 }, chart);
      util.svg('path', { d: 'M0 32 15 35 30 33 45 38 60 26 75 30 90 18 105 20 120 14 135 22 150 11 165 16 180 20 200 17', stroke: 'currentColor', 'stroke-width': 2, fill: 'none' }, chart);
      const chartLabels = e('div', 'ah-chart-labels', aside); ['00:00', '12:00', 'Now'].forEach(label => e('span', '', chartLabels, label));
      const equipment = e('div', 'ah-extra', aside); e('div', 'ah-subhead', equipment, 'Equipment');
      infoRow(equipment, 'Fan', 'Automatic'); infoRow(equipment, 'Connectivity', 'Strong signal');
      rotary('temperature', false);
      const modes = e('div', 'ah-segments', main);
      ['heat', 'cool'].forEach(mode => { const b = button(modes, mode === 'heat' ? 'Heat' : 'Cool', 'mode:' + mode, () => patch({ mode })); b.prepend(icon(null, mode)); });
      const schedule = e('div', 'ah-detail-card', main);
      const hold = infoRow(schedule, 'Temperature hold', 'Until next scheduled change');
      infoRow(schedule, 'Next schedule', 'Comfort / 18:00');
      paints.push(m => { hold.textContent = F().helpers.operating(m, s) === 'Standby' ? 'At setpoint / monitoring' : 'Until next scheduled change'; });
      paints.push(m => ['heat', 'cool'].forEach(mode => buttons['mode:' + mode].classList.toggle('on', m.mode === mode)));
    } else if (s.scenario === 'lightcolor') {
      const summary = e('div', 'ah-device-summary', aside); icon(summary, 'bulb');
      const text = e('div', '', summary); e('strong', '', text, 'Ceiling bulb'); e('span', 'ah-muted', text, s.room);
      ['Power draw', 'Connection'].forEach(fact);
      const swatch = e('div', 'ah-swatch', aside); swatch.setAttribute('aria-label', 'Current light colour');
      e('div', 'ah-subhead', aside, 'Scene gallery');
      const presets = e('div', 'ah-presets', aside);
      [['Reading', '#e6c694', 42, 85], ['Sunset', '#ce7c73', 8, 55], ['Focus', '#94b3cf', 210, 95]].forEach(([name, color, hue, brightness]) => {
        const b = e('button', 'ah-preset', presets); b.type = 'button'; e('span', 'ah-preset-swatch', b).style.background = color; b.append(name);
        b.addEventListener('click', () => patch({ hue, brightness }));
      });
      e('div', 'ah-notice', aside, `Lumen Colour A19 · ${s.serial}. Hue 0–359° · brightness 0–100%. Changes apply immediately.`);
      const extras = e('div', 'ah-extra', aside); e('div', 'ah-subhead', extras, 'Accessories'); e('div', 'ah-muted', extras, 'No dimmer switch paired');
      rotary('hue', true);
      const section = e('div', 'ah-light-controls', main), line = e('div', 'ah-slider-caption', section);
      const label = e('span', '', line); icon(label, 'heat'); label.append(' Brightness'); const out = e('strong', '', line);
      linear(section, 'brightness', 100, ctx.model.brightness, 'Bulb brightness');
      const lightInfo = e('div', 'ah-detail-card ah-extra', aside); infoRow(lightInfo, 'Power-on behaviour', 'Last used colour');
      paints.push(m => { out.textContent = m.brightness + '%'; swatch.style.background = `hsl(${m.hue} 78% ${12 + m.brightness * .45}%)`; });
    } else if (s.scenario === 'scene') {
      e('h3', '', aside, 'Automation summary');
      ['Schedule status', 'Included devices', 'Devices on'].forEach(fact);
      e('div', 'ah-subhead', aside, 'Recent runs');
      [['Yesterday, 18:30', 'Completed / All devices responded'], ['Mon, 18:30', 'Completed / Home hub']].forEach(([time, text]) => { const row = e('div', 'ah-run', aside); e('strong', '', row, time); e('br', '', row); e('small', '', row, text); });
      e('div', 'ah-notice ah-extra', aside, 'Runs locally on your home hub. Excluded devices keep their current state. Times use the home’s local time zone.');
      const layout = e('div', 'ah-scene-layout', main);
      const timing = e('div', 'ah-section', layout), devices = e('div', 'ah-section', layout);
      devices.style.display = 'flex'; devices.style.flexDirection = 'column'; devices.style.minHeight = '0';
      e('h3', '', timing, 'When');
      const time = button(timing, '', 'time', () => patch({ picker: !ctx.model.picker })); time.classList.add('ah-time');
      e('h3', '', timing, 'Repeat on'); const days = e('div', 'ah-days', timing);
      F().helpers.DAYS.forEach((name, i) => button(days, name, 'day:' + i, () => patch({ days: ctx.model.days.includes(i) ? ctx.model.days.filter(d => d !== i) : [...ctx.model.days, i].sort(), saved: false })));
      const options = e('div', 'ah-detail-card', timing); infoRow(options, 'Time zone', 'Home local time'); infoRow(options, 'When away', 'Run as scheduled');
      e('h3', '', devices, 'Device actions');
      const pane = e('div', 'ah-device-pane', devices);
      devicePane = pane;
      recordDevicePane = () => {
        const r = pane.getBoundingClientRect();
        ctx.patch({ devicePane: { scroll: pane.scrollTop, height: pane.clientHeight,
          rows: [...pane.children].map(row => { const b = row.getBoundingClientRect(); return [b.top - r.top + pane.scrollTop, b.bottom - r.top + pane.scrollTop]; }) } });
      };
      env.ui.scrollPane(pane, { onScroll: recordDevicePane });
      s.devices.forEach((name, i) => {
        const row = e('div', 'ah-device', pane), deviceName = e('div', 'ah-device-name', row); icon(deviceName, name.includes('speaker') ? 'volume' : 'bulb'); deviceName.append(name);
        e('div', 'ah-device-meta', row, s.room + ' / Connected');
        [null, 'on', 'off'].forEach(state => button(row, state === null ? 'Exclude' : state === 'on' ? 'On' : 'Off', `device:${i}:${state}`, () => {
          const states = [...ctx.model.states]; states[i] = state; patch({ states, saved: false });
        }));
      });
      const actions = e('div', 'ah-actions', main);
      const saveState = e('span', 'ah-muted', actions);
      button(actions, 'Save schedule', 'save', () => patch({ saved: true })).classList.add('primary');
      const picker = e('div', 'ah-picker', main); picker.hidden = true;
      e('h3', '', picker, 'Choose a time'); e('span', 'ah-muted', picker, 'Hour');
      const hours = e('div', 'ah-picker-grid', picker);
      for (let h = 0; h < 24; h++) button(hours, String(h).padStart(2, '0'), 'hour:' + h, () => patch({ time: h * 60 + ctx.model.time % 60, saved: false }));
      e('span', 'ah-muted', picker, 'Minute'); const minutes = e('div', 'ah-picker-grid', picker);
      for (let m = 0; m < 60; m += 5) button(minutes, String(m).padStart(2, '0'), 'minute:' + m, () => patch({ time: Math.floor(ctx.model.time / 60) * 60 + m, picker: false, saved: false }));
      button(picker, 'Done', 'closePicker', () => patch({ picker: false }));
      paints.push(m => {
        time.replaceChildren(); icon(time, 'clock'); time.append(F().helpers.timeText(m.time)); icon(time, 'chevron'); picker.hidden = !m.picker;
        saveState.textContent = m.saved ? 'Saved to home hub' : 'Unsaved changes';
        if (m.devicePane) pane.scrollTop = m.devicePane.scroll;
        F().helpers.DAYS.forEach((_, i) => buttons['day:' + i].classList.toggle('on', m.days.includes(i)));
        s.devices.forEach((_, i) => [null, 'on', 'off'].forEach(state => buttons[`device:${i}:${state}`].classList.toggle('on', m.states[i] === state)));
        for (let h = 0; h < 24; h++) buttons['hour:' + h].classList.toggle('on', Math.floor(m.time / 60) === h);
        for (let v = 0; v < 60; v += 5) buttons['minute:' + v].classList.toggle('on', m.time % 60 === v);
      });
    } else if (s.scenario === 'playlist') {
      e('h3', '', aside, 'Listening plan');
      e('div', 'ah-description', aside, 'Shared by ' + s.owner.split(' ')[0] + ' / Custom sequence');
      const plan = e('ol', 'ah-plan', aside);
      s.goal.order.forEach(id => e('li', '', plan, s.tracks.find(t => t.id === id).title));
      const total = e('div', 'ah-queue-total', aside);
      ['Tracks', 'Queue duration'].forEach(label => { fact(label); total.append(facts[label].parentElement); });
      const listHead = e('div', 'ah-queue-head', main); e('span', '', listHead, '#'); e('span', 'ah-grow', listHead, 'Title / Artist'); e('span', 'ah-album', listHead, 'Album'); icon(listHead, 'clock');
      const pane = e('div', 'ah-queue-pane', main), queue = e('div', 'ah-queue', pane);
      const footer = e('div', 'ah-player-footer', main); const play = e('button', 'ah-play', footer); play.type = 'button'; play.setAttribute('aria-label', 'Play preview'); icon(play, 'play');
      play.addEventListener('click', () => showInfo('Playback unavailable', [['Audio preview', 'This local collection contains track information only. Connect a media source to listen.']]));
      e('div', 'ah-muted ah-grow', footer, 'Paused / This computer'); utility(footer, 'shuffle', 'Shuffle', [['Shuffle', 'Off / The playlist uses your custom order.']], 'icon-only'); utility(footer, 'repeat', 'Repeat', [['Repeat', 'Off / Repeat this playlist from playback settings.']], 'icon-only');
      const rowHeight = Math.max(23, Math.min(52, Math.floor(pane.clientHeight / s.tracks.length)));
      queue.style.height = rowHeight * s.tracks.length + 'px';
      const cards = {}, numbers = {}, art = ['#c78469', '#68a29a', '#9d83b6', '#9eab6d', '#7094b0'];
      s.tracks.forEach((t, i) => {
        const row = e('div', 'ah-track', queue); row.style.height = rowHeight + 'px';
        icon(e('span', 'ah-grip', row), 'grip').parentElement.setAttribute('aria-label', 'Reorder ' + t.title);
        numbers[t.id] = e('small', '', row);
        const cover = e('div', 'ah-cover', row); icon(cover, 'music'); cover.style.setProperty('--art', art[i % art.length]);
        if (rowHeight < 35) cover.style.width = cover.style.height = '22px';
        const text = e('div', 'ah-grow', row); e('div', 'ah-track-title', text, t.title);
        if (rowHeight < 36) text.classList.add('ah-inline-track');
        e('span', 'ah-track-artist', text, t.artist);
        e('span', 'ah-album', row, ['Quiet Rooms', 'Field Notes', 'Late Signals', 'Open Windows'][i % 4]);
        e('small', '', row, F().helpers.durationText(t.duration)); cards[t.id] = row;
      });
      const sortable = env.ui.sortable(queue, { order: ctx.model.order, items: cards, handle: '.ah-grip', axis: 'y', bounds: 'center',
        slotRect: i => [0, i * rowHeight, queue.clientWidth, rowHeight], activeClass: 'dragging', label: 'playlist track',
        onChange: order => patch({ order }) });
      controls.queue = sortable;
      env.ui.scrollPane(pane, { onScroll: scroll => { ctx.patch({ scroll }); } });
      paints.push(m => { sortable.set(m.order); pane.scrollTop = m.scroll || 0; m.order.forEach((id, i) => { numbers[id].textContent = String(i + 1).padStart(2, '0'); }); });
    } else {
      e('h3', '', aside, 'Chapters'); const chapterRows = [];
      s.chapters.forEach(c => { const row = e('div', 'ah-chapter', aside); e('div', 'ah-chapter-thumb', row); const text = e('div', '', row); e('span', '', text, c.title); e('small', '', text, F().helpers.durationText(c.time)); chapterRows.push(row); });
      ['Chapter', 'Remaining'].forEach(fact);
      const related = e('div', 'ah-extra', aside); e('div', 'ah-subhead', related, 'Up next');
      ['Objects with a story', 'The listening room'].forEach(title => { const row = e('div', 'ah-related', related); e('div', 'ah-cover', row); const text = e('div', '', row); e('strong', '', text, title); e('div', 'ah-description', text, 'Stillwave Films / 8 min'); });
      const video = e('div', 'ah-video', main);
      roomArt(video); e('div', 'ah-film-credit', video, 'STILLWAVE ORIGINALS');
      const caption = e('div', 'ah-video-caption', video);
      const line = e('div', 'ah-player-footer', main);
      utility(line, 'play', 'Playback', [['Playback paused', 'Position is saved locally so you can resume here later.']], 'icon-only');
      const position = e('strong', '', line); e('span', 'ah-muted ah-grow', line, '/ ' + F().helpers.durationText(s.duration));
      utility(line, 'volume', 'Volume', [['Volume', '80% / System output']], 'icon-only');
      utility(line, 'settings', 'Playback quality', [['Quality', '1080p / Original'], ['Captions', 'English / Off'], ['Speed', '1x / Normal']], 'icon-only');
      utility(line, 'expand', 'Theater mode', [['Theater mode', 'The video is fitted to the current workspace.']], 'icon-only');
      const track = linear(main, 'position', s.duration, ctx.model.position, 'Video position');
      s.chapters.slice(1).forEach(c => { const marker = e('div', 'ah-marker', track); marker.style.left = c.time / s.duration * 100 + '%'; });
      const preview = e('div', 'ah-preview', track); preview.hidden = true;
      roomArt(e('div', 'ah-preview-art', preview)); const previewText = e('div', 'ah-preview-text', preview);
      track.addEventListener('pointermove', event => {
        const r = track.getBoundingClientRect(), fraction = Math.max(0, Math.min(1, (event.clientX - r.left) / r.width));
        patch({ preview: Math.round(fraction * s.duration) });
      });
      track.addEventListener('pointerleave', () => patch({ preview: null }));
      paints.push(m => {
        position.textContent = F().helpers.durationText(Math.round(m.position)); const ch = F().helpers.chapter(m, s); caption.textContent = 'Paused / ' + ch.title;
        chapterRows.forEach((row, i) => row.classList.toggle('active', s.chapters[i] === ch));
        preview.hidden = m.preview === null; previewText.textContent = F().helpers.durationText(m.preview || 0) + ' / ' + F().helpers.chapter({ position: m.preview || 0 }, s).title;
        preview.style.left = Math.max(17, Math.min(83, 100 * (m.preview || 0) / s.duration)) + '%';
      });
    }
    if (fitRing) fitRing();
    if (recordDevicePane) recordDevicePane();
    paint(ctx.model);
    view = { ctx, buttons, controls, main, devicePane };
    return { anchors: [app], sync: paint };
  }
  function locate(t) {
    const { controls, buttons, main, devicePane } = view;
    const center = el => env.util.center(el);
    if (t.control) {
      const api = controls[t.control];
      if (t.control === 'temperature' || t.control === 'hue') return t.current ? api.locateGrip() : api.locate(t.value);
      return t.current ? api.locateThumb(0) : api.locate(t.value, 0);
    }
    if (t.item !== undefined) return controls.queue.locate(t.item);
    if (t.slot !== undefined) return controls.queue.locateSlot(t.slot);
    if (t.mode) return center(buttons['mode:' + t.mode]);
    if (t.timePicker) return center(buttons.time);
    if (t.closePicker) return center(buttons.closePicker);
    if (t.hour !== undefined) return center(buttons['hour:' + t.hour]);
    if (t.minute !== undefined) return center(buttons['minute:' + t.minute]);
    if (t.day !== undefined) return center(buttons['day:' + t.day]);
    if (t.device !== undefined) return center(buttons[`device:${t.device}:${t.state}`]);
    if (t.save) return center(buttons.save);
    if (t.pane) return center(devicePane || main);
    throw new Error('use-smart-home: unknown target ' + JSON.stringify(t));
  }
  env.widget({ task: 'use-smart-home', site: 'base', name: 'classic', split: 'train',
    scenarios: ['thermostat', 'lightcolor', 'scene', 'playlist', 'scrub'], render, locate });
})();
