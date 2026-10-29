/*
 * use-smart-home/classic: shared Lumen home console and Stillwave library. Scenarios: thermostat, lightcolor,
 * scene, playlist, scrub. The shell, information panels, facts, sliders and rotary controls are shared;
 * each scenario has its own render part and smaller panel/row parts. No scenario presets.
 * Part registration lives in _parts.js; the factory composes them in their original order.
 * With design: {} reproduces design-use-smart-home-thermostat-01, design-use-smart-home-lightcolor-01,
 * design-use-smart-home-scene-01, design-use-smart-home-playlist-01 and design-use-smart-home-scrub-01 respectively.
 * Tokens (defaults):
 *   css (CSS): structural ah-* stylesheet; colors inherit --panel/line/accent/muted/fg/bg from the site.
 *   icons (ICONS): whole icon path table (24x24); palette ({}): CSS variable names -> values on the app.
 *   fontFamily, fontSize (null): optional app font overrides; null keeps the site's font and CSS sizing.
 *   frameInset (36), minWidth (300), minHeight (250): app dimensions in px from the stage.
 *   compactHeight (585), compactWidth (900), narrowWidth (930): stage breakpoints in px.
 *   asideMin (180), asideMax (238), asideFraction (.20): aside width clamp, relative to stage width.
 *   hueDiameter (214), temperatureDiameter (244), readoutSize (49): dial/readout size caps in px.
 *   rowMin (23), rowMax (52): playlist row height bounds in px.
 *   homeBrand ('lumen'), mediaBrand ('stillwave'), mediaTagline ('Your listening space'): shell labels.
 *   artColors (['#c78469','#68a29a','#9d83b6','#9eab6d','#7094b0']): track cover palette.
 *   albums (['Quiet Rooms','Field Notes','Late Signals','Open Windows']): decorative album labels.
 *   lightingPresets ([['Reading','#e6c694',42,85],['Sunset','#ce7c73',8,55],['Focus','#94b3cf',210,95]]):
 *     preset label, swatch color, hue and brightness; these are ordinary bulb controls.
 * Parts: overrides are (base, S) => replacement; all calls dispatch through P. Every part's first
 * argument R is the episode's render state (ctx, s (spec), size, util, e, media, app, main, aside,
 * inspector, facts, buttons, controls, paints, devicePane, recordDevicePane, fitRing as built).
 * S.ctx/spec/els read the live episode, S.D/P read resolved tokens/parts. Keep R in event closures so
 * late events retain the original ctx. Draw extra decoration randomness from R.ctx.rng.fork(label).
 * The base widget makes no rng draws; defaults introduce none. Parts and return values:
 *   icon(R, parent, name) -> SVG: draw the named path (device fallback).
 *   roomArt(R, parent) -> SVG: original documentary still illustration.
 *   frame(R) -> app: fit the console to ctx.size, compact/narrow classes.
 *   showInfo(R, title, lines) -> void: populate and open the local information panel.
 *   utility(R, parent, name, label, lines, cls = '') -> button: optional icon/label, opens P.showInfo.
 *   top(R) -> void: brand, search, notifications, connection and owner.
 *   navigation(R) -> void: household/library navigation.
 *   shell(R) -> el: shell containing the sidebar and body.
 *   sidebar(R, shell) -> void: navigation, recent items and hub status.
 *   body(R, shell) -> {main, aside}: responsive content columns.
 *   heading(R) -> void: eyebrow, title, description and details control.
 *   toolbar(R) -> void: scenario tabs and settings/save control.
 *   statusbar(R) -> void: connection and sync status.
 *   inspector(R) -> el: initially hidden information panel.
 *   fact(R, label) -> void: register a labeled live fact in the aside.
 *   infoRow(R, parent, label, value) -> strong: draw a label/value row.
 *   button(R, parent, label, key, action) -> button: register an action under its oracle key.
 *   patch(R, value) -> void: update the model and repaint immediately.
 *   paint(R, m) -> void: refresh task facts and controlled widget painters.
 *   slider(R, parent, label) -> {track, fill, thumb}: build a linear slider and accessible thumb.
 *   linear(R, parent, control, max, value, label) -> track: bind slider behavior, model updates and controlled painting.
 *   ring(R, area, hue, diameter) -> {ring, readout, detail, grip}: rotary control face.
 *   roomContext(R, area, hue) -> void: show other rooms/lights on roomy stages.
 *   rotary(R, control, hue) -> void: bind dial, register fitRing and controlled painting.
 *   thermostatAside(R) -> void: device summary, facts, history chart and equipment.
 *   renderThermostat(R) -> void: dial, mode buttons, hold card and their painters.
 *   preset(R, parent, preset) -> button: colored lighting preset, applies hue and brightness.
 *   lightcolorAside(R) -> swatch: bulb facts, presets and accessories.
 *   renderLightcolor(R) -> void: hue dial, brightness slider and color painters.
 *   sceneAside(R) -> void: automation facts, recent runs and notice.
 *   sceneLayout(R) -> {timing, devices}: timing and device columns.
 *   sceneTiming(R, timing) -> button: time trigger, repeat days and options.
 *   deviceRow(R, pane, name, i) -> row: device identity and exclude/on/off actions.
 *   sceneDevices(R, devices) -> pane: scrollable devices and recorded row geometry.
 *   sceneActions(R) -> span: save button and live save status.
 *   scenePicker(R) -> picker: DOM hour/minute choices and Done button.
 *   renderScene(R) -> void: compose automation panels and synchronize controls.
 *   playlistAside(R) -> void: requested listening order and queue totals.
 *   queueHeading(R) -> void: queue column headings.
 *   playlistFooter(R) -> void: preview, shuffle and repeat controls.
 *   trackRow(R, queue, t, i, rowHeight) -> {row, number}: handle, artwork, title, artist, album and duration.
 *   renderPlaylist(R) -> void: queue layout, sortable binding, scrolling and numbering.
 *   chapterRow(R, c) -> row: chapter thumbnail, title and time.
 *   scrubAside(R) -> rows: chapters, live facts and related films.
 *   video(R) -> caption: video still, credit and live chapter caption.
 *   transport(R) -> strong: playback position and transport utilities.
 *   preview(R, track) -> {preview, previewText}: hidden scrub preview with still.
 *   renderScrub(R) -> void: seek slider, markers, hover updates and chapter painters.
 *   locate(R, t) -> [x,y]: map oracle targets through registered controls/buttons.
 *   rendered(R) -> void: decoration hook after initial fitting and painting (noop).
 */
(function () {
  'use strict';
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

  const TOKENS = {
    css: CSS, icons: ICONS, palette: {}, fontFamily: null, fontSize: null,
    frameInset: 36, minWidth: 300, minHeight: 250, compactHeight: 585, compactWidth: 900, narrowWidth: 930,
    asideMin: 180, asideMax: 238, asideFraction: .20,
    hueDiameter: 214, temperatureDiameter: 244, readoutSize: 49, rowMin: 23, rowMax: 52,
    homeBrand: 'lumen', mediaBrand: 'stillwave', mediaTagline: 'Your listening space',
    artColors: ['#c78469', '#68a29a', '#9d83b6', '#9eab6d', '#7094b0'],
    albums: ['Quiet Rooms', 'Field Notes', 'Late Signals', 'Open Windows'],
    lightingPresets: [['Reading', '#e6c694', 42, 85], ['Sunset', '#ce7c73', 8, 55], ['Focus', '#94b3cf', 210, 95]],
  };

  env.template('use-smart-home/classic', (design, def) => {
    let D, P, page;
    const BASE = {};
    const S = { get ctx() { return page && page.ctx; }, get spec() { return page && page.s; },
      get els() { return page; }, get D() { return D; }, get P() { return P; } };

    const parts = env.templateLib('use-smart-home/_parts');
    parts.installArtwork(BASE, S);
    parts.installChrome(BASE, S);
    parts.installControls(BASE, S);
    parts.installClimate(BASE, S);
    parts.installScene(BASE, S);
    parts.installMedia(BASE, S);
    parts.installLocate(BASE, S);

    ({ D, P } = env.templateDesign('use-smart-home/classic', design, def, { tokens: TOKENS, base: BASE, state: S }));
    return {
      render(ctx) {
        ctx.css('app-home-classic', D.css);
        const R = { ctx, s: ctx.spec, size: ctx.size, util: ctx.util,
          e: (tag, cls, parent, text) => ctx.util.el(tag, cls, parent, text),
          media: ['playlist', 'scrub'].includes(ctx.spec.scenario), facts: {}, buttons: {}, controls: {}, paints: [] };
        page = R;
        R.app = P.frame(R);
        P.top(R);
        P.navigation(R);
        const shell = P.shell(R);
        P.sidebar(R, shell);
        Object.assign(R, P.body(R, shell));
        P.heading(R);
        P.toolbar(R);
        P.statusbar(R);
        R.inspector = P.inspector(R);
        if (R.s.scenario === 'thermostat') P.renderThermostat(R);
        else if (R.s.scenario === 'lightcolor') P.renderLightcolor(R);
        else if (R.s.scenario === 'scene') P.renderScene(R);
        else if (R.s.scenario === 'playlist') P.renderPlaylist(R);
        else P.renderScrub(R);
        if (R.fitRing) R.fitRing();
        if (R.recordDevicePane) R.recordDevicePane();
        P.paint(R, ctx.model);
        P.rendered(R);
        return { anchors: [R.app], sync: m => P.paint(R, m) };
      },
      locate(t) { return P.locate(page, t); },
    };
  }, { uses: ['use-smart-home/_parts'] });
})();
