/*
 * base / pan-map / city: a slippy map in a card. Scenarios marker, center, zoom, pin, route, zone, zoomto (see the task header).
 * Product shell: shared team navigation, saved maps/activity drawers, functional search, layer visibility,
 * place metadata, offline status and SVG icons. Secondary frame is local presentation state only.
 * A7 editor: searchable address directory; click/drag pin, numbered route handles, click-to-close polygon,
 * zoom/centre tools. Compact stages stack a wheel-scrollable directory above the map. All readouts use
 * the task's pure formatting helpers; the page never shows a scorer verdict. Existing scenarios render below.
 *   header   map title and street/transit style toggle; the workspace search filters the place directory.
 *   map      the viewport (at most 1000 x 640 px). An SVG world layer (sea, lake, river, parks, the minor street
 *            grid, named major roads; strokes keep their px width per zoom level) under an HTML label layer
 *            (district names, park names, road names along the road, place pins with labels). Places appear
 *            from their own minZoom on. Pressing anywhere on the map and dragging pans it (4 px threshold,
 *            pointer capture, the content follows the pointer); a press-release on a pin without moving opens
 *            its card, on empty map closes the open card. spec.wheel: the wheel over the map zooms around the
 *            cursor (one level per 100 px of deltaY, up to three).
 *   controls a zoom stack in a seeded corner: + button, one tick per level (clicking a tick jumps there), -
 *            button and a "Level N" readout. The scale bar and attribution sit in a free bottom corner.
 *   card     the selected place's card (name, kind, district, an inert Directions button, a close button) in
 *            a seeded left corner; presses on it never pan the map.
 *   center   a circular reticle (radius spec.tau map units, so it grows with the zoom) and a crosshair at the
 *            centre of the map, drawn above the map and transparent to the pointer.
 * The widget mirrors the viewport size into model.port at render (unscored; the logic's pan and click planning
 * needs it). locate(): { marker } the pin's dot, { zoom } the +/- button, { map: 'center' } the viewport
 * centre, { grab } / { release } centre -/+ half the pan drag (task dragPx), { close } the card's close button.
 * traits: { zoom: 'both' } (buttons always; the wheel when spec.wheel).
 */
(function () {
  'use strict';

  const CSS = `
  .mp-card {
    position: relative; display: flex; flex-direction: column; gap: 8px; padding: 8px;
    border: 1px solid var(--line); border-radius: 12px; background: var(--panel); box-shadow: 0 1px 3px rgba(0,0,0,.08);
  }
  .mp-head { display: flex; align-items: center; gap: 12px; height: 32px; padding: 0 4px; }
  .mp-title { font-weight: 650; white-space: nowrap; }
  .mp-search {
    flex: 1; max-width: 280px; height: 30px; display: flex; align-items: center; gap: 8px; padding: 0 10px;
    border: 1px solid var(--line); border-radius: 16px; color: var(--muted); font-size: 13px; background: var(--bg);
  }
  .mp-search svg { flex: none; }
  .mp-spacer { flex: 1; }
  .mp-toggle { display: flex; border: 1px solid var(--line); border-radius: 7px; overflow: hidden; }
  .mp-toggle button {
    border: 0; padding: 4px 12px; background: var(--panel); color: var(--fg); font: inherit; font-size: 13px; cursor: pointer;
  }
  .mp-toggle button.on { background: color-mix(in srgb, var(--accent) 16%, var(--panel)); color: var(--accent); font-weight: 600; }

  .mp-port {
    position: relative; overflow: hidden; border-radius: 8px; cursor: grab; touch-action: none;
    background: var(--mp-land); outline: 1px solid var(--line);
    --mp-land: color-mix(in srgb, #ece6d8 82%, var(--panel));
    --mp-water: color-mix(in srgb, #9fcbe8 80%, var(--panel));
    --mp-park: color-mix(in srgb, #bfdcae 82%, var(--panel));
    --mp-street: color-mix(in srgb, #ffffff 75%, var(--panel));
    --mp-road: color-mix(in srgb, #f7d58a 85%, var(--panel));
    --mp-casing: color-mix(in srgb, #c9a75a 70%, var(--panel));
    --mp-halo: color-mix(in srgb, var(--panel) 85%, transparent);
  }
  .mp-port.transit { --mp-road: color-mix(in srgb, #e9a3a3 75%, var(--panel)); --mp-casing: color-mix(in srgb, #b55d5d 70%, var(--panel)); }
  .mp-port.dragging { cursor: grabbing; }
  .mp-svg { position: absolute; left: 0; top: 0; }
  .mp-sea, .mp-lake { fill: var(--mp-water); }
  .mp-river { fill: none; stroke: var(--mp-water); stroke-linecap: round; stroke-linejoin: round; }
  .mp-park { fill: var(--mp-park); }
  .mp-streets { fill: none; stroke: var(--mp-street); stroke-linecap: round; }
  .mp-casing { fill: none; stroke: var(--mp-casing); stroke-linecap: round; stroke-linejoin: round; }
  .mp-road { fill: none; stroke: var(--mp-road); stroke-linecap: round; stroke-linejoin: round; }

  .mp-layer { position: absolute; left: 0; top: 0; width: 0; height: 0; }
  .mp-lbl {
    position: absolute; white-space: nowrap; pointer-events: none; transform: translate(-50%, -50%);
    text-shadow: 0 0 3px var(--mp-halo), 0 0 3px var(--mp-halo), 0 0 2px var(--mp-halo);
  }
  .mp-district { font-size: 13px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: color-mix(in srgb, var(--muted) 85%, transparent); }
  .mp-parkname { font-size: 11.5px; font-style: italic; color: color-mix(in srgb, #2f7a35 80%, var(--fg)); }
  .mp-roadname { font-size: 10.5px; color: color-mix(in srgb, var(--fg) 75%, transparent); }
  .mp-pin { position: absolute; display: flex; align-items: center; gap: 4px; height: 20px; margin: -10px 0 0 -10px; cursor: pointer; }
  .mp-dot {
    flex: none; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    background: var(--c); color: #fff; font-size: 10px; font-weight: 700; border: 2px solid #fff; box-sizing: border-box;
    box-shadow: 0 1px 2px rgba(0,0,0,.35);
  }
  .mp-pin.sq .mp-dot { border-radius: 5px; }
  .mp-pin.sel .mp-dot { outline: 3px solid color-mix(in srgb, var(--c) 45%, transparent); transform: scale(1.18); }
  .mp-name {
    max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11.5px; font-weight: 600;
    color: var(--fg); text-shadow: 0 0 3px var(--mp-halo), 0 0 3px var(--mp-halo), 0 0 2px var(--mp-halo);
  }
  .mp-pin.t3 .mp-name { font-weight: 500; font-size: 11px; }

  .mp-reticle { position: absolute; pointer-events: none; border: 2px solid var(--accent); border-radius: 50%;
                box-shadow: 0 0 0 1px var(--mp-halo), inset 0 0 0 1px var(--mp-halo); }
  .mp-cross { position: absolute; pointer-events: none; background: var(--accent); opacity: .8; }

  .mp-ui { position: absolute; cursor: default; }
  .mp-zoom { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 4px; border-radius: 8px;
             background: var(--panel); border: 1px solid var(--line); box-shadow: 0 1px 3px rgba(0,0,0,.15); }
  .mp-zbtn { width: 30px; height: 30px; border: 1px solid var(--line); border-radius: 6px; background: var(--panel); color: var(--fg);
             font: 600 18px/1 system-ui, sans-serif; cursor: pointer; padding: 0; }
  .mp-zbtn:disabled { color: var(--muted); opacity: .5; cursor: default; }
  .mp-tick { width: 18px; height: 7px; border-radius: 3px; background: color-mix(in srgb, var(--muted) 35%, var(--panel)); cursor: pointer; }
  .mp-tick.on { background: var(--accent); }
  .mp-level { font-size: 11px; color: var(--muted); white-space: nowrap; font-variant-numeric: tabular-nums; }
  .mp-scale { display: flex; flex-direction: column; gap: 2px; font-size: 10.5px; color: var(--fg); pointer-events: none;
              text-shadow: 0 0 3px var(--mp-halo); }
  .mp-scalebar { height: 5px; border: 2px solid var(--fg); border-top: 0; }
  .mp-attr { font-size: 10px; color: var(--muted); pointer-events: none; text-shadow: 0 0 3px var(--mp-halo); }
  .mp-info { width: 236px; padding: 10px 12px; border-radius: 10px; background: var(--panel); border: 1px solid var(--line);
             box-shadow: 0 2px 8px rgba(0,0,0,.18); display: flex; flex-direction: column; gap: 3px; }
  .mp-info[hidden] { display: none; }
  .mp-info-name { font-weight: 650; padding-right: 26px; }
  .mp-info-sub { font-size: 12.5px; color: var(--muted); }
  .mp-info-row { display: flex; gap: 8px; margin-top: 6px; }
  .mp-info-row button { border: 1px solid var(--line); border-radius: 6px; background: var(--bg); color: var(--fg); font: inherit;
                        font-size: 12.5px; padding: 3px 10px; cursor: pointer; }
  .mp-close { position: absolute; right: 6px; top: 6px; width: 26px; height: 26px; border: 0; border-radius: 6px;
              background: transparent; color: var(--muted); font: 600 17px/1 system-ui, sans-serif; cursor: pointer; }
  .mp-close:hover { background: var(--bg); }
  `;

  const NS = 'http://www.w3.org/2000/svg';
  const TIER_COLORS = { 1: '#d9480f', 2: '#1971c2', 3: '#6741d9' };
  const VENUE_COLOR = '#c2255c';
  let ctxRef;
  let view;

  function ensureStyle() {
    if (document.getElementById('mp-style')) return;
    const s = document.createElement('style');
    s.id = 'mp-style';
    s.textContent = CSS;
    document.head.append(s);
  }

  const F = () => env.taskDef.helpers;
  const sv = (tag, attrs, parent) => env.util.svg(tag, attrs, parent);
  const pathOf = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join('');

  // Local product frame: navigation and presentation state never enter task scoring.
  const ICONS = {
    map: 'M3 5l6-2 6 2 6-2v16l-6 2-6-2-6 2V5z M9 3v16 M15 5v16',
    search: 'M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M15 15l6 6',
    layers: 'M3 7l9-5 9 5-9 5-9-5z M3 12l9 5 9-5 M3 17l9 5 9-5',
    pin: 'M19 9c0 5-7 12-7 12S5 14 5 9a7 7 0 1 1 14 0z M15 9a3 3 0 1 0-6 0 3 3 0 0 0 6 0',
    route: 'M5 5h9a5 5 0 0 1 0 10H9a4 4 0 0 0-4 4 M5 2v6 M2 5h6 M3 20h4',
    folder: 'M3 7V4h6l3 3h9v13H3V7z',
    bell: 'M6 17V9a6 6 0 1 1 12 0v8l2 2H4l2-2z M10 22h4',
    chevron: 'M8 4l8 8-8 8', close: 'M5 5l14 14 M19 5L5 19',
    plus: 'M12 5v14 M5 12h14', minus: 'M5 12h14',
    check: 'M4 12l5 5L20 6', share: 'M12 16V3 M7 8l5-5 5 5 M5 13v8h14v-8',
    clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2',
    car: 'M4 10l2-6h12l2 6 M3 10h18v8H3v-8z M6 18v3 M18 18v3 M6 13h2 M16 13h2',
    walk: 'M14 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M12 7l-3 6 4 3-2 6 M12 8l4 5h4 M13 16l5 6 M9 13H5',
    bike: 'M5 21a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M19 21a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M5 17l5-9 5 9H5 M9 5h4 M16 5h3l-1 5 1 7',
    polygon: 'M4 5l13-2 4 13-12 5L4 5z M3 3h3v3H3z M16 1h3v3h-3z M19 15h3v3h-3z M7 19h3v3H7z',
    compass: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M16 8l-3 5-5 3 3-5 5-3z',
    star: 'M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z',
    more: 'M5 11h1v1H5z M11 11h1v1h-1z M17 11h1v1h-1z',
    food: 'M4 3v7h6V3 M7 3v18 M19 21V3c-5 4-5 10 0 10',
    building: 'M4 22V3h16v19 M2 22h20 M8 7h2 M14 7h2 M8 11h2 M14 11h2 M9 22v-6h6v6',
    eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M15 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0',
  };
  function icon(parent, name, n = 17) {
    const svg = sv('svg', { width: n, height: n, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
      'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true', class: 'mpp-icon' }, parent);
    sv('path', { d: ICONS[name] || ICONS.pin }, svg);
    return svg;
  }
  function iconButton(parent, name, title, text) {
    const b = env.util.el('button', 'mpp-button', parent);
    icon(b, name); if (text) env.util.el('span', '', b, text);
    b.type = 'button'; b.title = title; b.setAttribute('aria-label', title); return b;
  }
  function kindIcon(p) { return /cafe|bakery|grocer|market/.test(p.kind) ? 'food' : /station/.test(p.kind) ? 'route' : 'building'; }
  function placeMeta(ctx, p) {
    const h = env.util.hash32(p.id + p.name), roads = ctx.spec.world.roads;
    return { rating: (4 + h % 9 / 10).toFixed(1), reviews: 24 + h % 310,
      address: p.address || `${12 + h % 180} ${roads[h % roads.length].name}`,
      hours: /hospital|hotel|station/.test(p.kind) ? 'Open 24 hours' : `Open until ${17 + h % 4}:00` };
  }
  function productStyle(ctx) {
    ctx.css('map-product-polish', `
      .mpe.mp-product { border-radius:9px; box-shadow:0 3px 16px #0000000c; position:relative; font:12px/1.4 system-ui,sans-serif; }
      .mp-product *, .mp-product *:before, .mp-product *:after { box-sizing:border-box; }
      .mp-product svg { flex:none; vertical-align:middle; } .mp-product button { font:inherit; cursor:pointer; color:var(--fg); background:var(--panel); border:1px solid var(--line); border-radius:5px; }
      .mp-product button:hover { background:var(--bg); } .mp-product input { color:var(--fg); background:var(--bg); font:inherit; border:1px solid var(--line); border-radius:5px; }
      .mpp-top { height:45px; flex:none; display:flex; align-items:center; gap:12px; padding:6px 12px; border-bottom:1px solid var(--line); }
      .mpp-brand { display:flex; align-items:center; gap:7px; font-size:16px; font-weight:750; letter-spacing:-.5px; color:var(--accent); white-space:nowrap; }
      .mpp-search { position:relative; display:flex; align-items:center; gap:6px; flex:1; min-width:100px; max-width:355px; }
      .mpp-search input { min-width:0; width:100%; height:31px; padding:6px 9px 6px 30px; outline-color:var(--accent); }
      .mpp-search > svg { position:absolute; left:9px; color:var(--muted); pointer-events:none; }
      .mpp-top-actions { margin-left:auto; display:flex; align-items:center; gap:6px; }
      .mpp-button { display:inline-flex; align-items:center; justify-content:center; gap:6px; min-height:29px; padding:4px 8px; }
      .mpp-avatar { width:26px; height:26px; display:grid; place-items:center; border-radius:50%; background:color-mix(in srgb,var(--accent) 16%,var(--panel)); color:var(--accent); font-size:10px; font-weight:700; }
      .mpp-project { height:34px; flex:none; display:flex; gap:9px; align-items:center; padding:0 12px; border-bottom:1px solid var(--line); background:var(--bg); font-size:11px; color:var(--muted); }
      .mpp-project strong { color:var(--fg); font-weight:650; } .mpp-grow { flex:1; } .mpp-tag { display:inline-flex; align-items:center; gap:4px; padding:2px 5px; border:1px solid var(--line); border-radius:4px; font-size:10px; color:var(--muted); }
      .mpp-work { display:flex; flex:1; min-height:0; } .mpp-rail { width:44px; flex:none; border-right:1px solid var(--line); background:var(--bg); display:flex; flex-direction:column; align-items:center; padding:9px 4px; gap:9px; }
      .mpp-rail button { width:33px; height:35px; padding:5px; border:0; background:transparent; position:relative; }
      .mpp-rail button.active { color:var(--accent); background:color-mix(in srgb,var(--accent) 12%,var(--panel)); }
      .mpp-count { position:absolute; top:1px; right:1px; border-radius:8px; background:var(--accent); color:white; min-width:12px; font-size:8px; }
      .mpp-panel { width:242px; min-height:0; flex:none; display:flex; flex-direction:column; border-right:1px solid var(--line); }
      .mpp-panel .mpe-item { display:flex; gap:8px; border-bottom:1px solid var(--line); } .mpp-panel .mpe-item button { flex:1; min-width:0; border:0; background:none; padding:0; text-align:left; }
      .mpp-panel .mpe-name,.mpp-panel .mpe-address { display:block; overflow-wrap:anywhere; } .mpp-panel .mpe-badge { flex:none; width:20px; height:20px; border-radius:50%; display:grid; place-items:center; color:var(--accent); background:var(--bg); border:1px solid var(--line); font-size:10px; }
      .mpp-panel .mpe-kicker { color:var(--muted); font-size:9px; text-transform:uppercase; letter-spacing:.08em; } .mpp-panel .mpe-section { border-bottom:1px solid var(--line); }
      .mpp-panel .mpe-list { flex:1; min-height:0; overflow:auto; scrollbar-width:thin; scrollbar-color:var(--line) transparent; }
      .mpp-panel .mpe-section { padding:10px 12px; }
      .mpp-panel .mpe-heading { font-size:17px; letter-spacing:-.3px; margin:3px 0; }
      .mpp-panel .mpe-item { padding:9px 11px; align-items:flex-start; }
      .mpp-panel .mpe-name { font-size:12px; font-weight:600; line-height:1.35; } .mpp-panel .mpe-address { font-size:10.5px; line-height:1.45; }
      .mpp-panel .mpe-item.selected { background:color-mix(in srgb,var(--accent) 9%,var(--panel)); }
      .mpp-meta { color:var(--muted); font-size:10px; line-height:1.65; margin-top:3px; } .mpp-open { color:color-mix(in srgb,#16824a 80%,var(--fg)); }
      .mpp-controls { display:flex; gap:5px; flex-wrap:wrap; padding:8px 11px; border-bottom:1px solid var(--line); }
      .mpp-controls button { padding:4px 8px; border-radius:14px; font-size:10.5px; } .mpp-controls button.active { border-color:var(--accent); color:var(--accent); background:color-mix(in srgb,var(--accent) 7%,var(--panel)); }
      .mpp-inspector { padding:9px 11px; background:var(--bg); border-bottom:1px solid var(--line); font-size:11px; }
      .mpp-property { display:flex; justify-content:space-between; gap:8px; margin:3px 0; } .mpp-property span:first-child { color:var(--muted); }
      .mpp-inspector strong { font-size:12px; } .mpp-swatch { width:8px; height:8px; display:inline-block; border-radius:2px; background:var(--accent); margin-right:5px; }
      .mpp-main { position:relative; min-width:0; flex:1; display:flex; flex-direction:column; }
      .mpp-foot { height:23px; flex:none; display:flex; align-items:center; gap:10px; justify-content:space-between; padding:0 11px; border-top:1px solid var(--line); background:var(--panel); color:var(--muted); font-size:10px; }
      .mpp-foot span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .mpp-drawer { position:absolute; top:79px; bottom:23px; left:44px; width:242px; z-index:30; background:var(--panel); border-right:1px solid var(--line); display:flex; flex-direction:column; box-shadow:8px 0 18px #0002; }
      .mpp-drawer[hidden] { display:none; } .mpp-drawer-head { display:flex; align-items:center; justify-content:space-between; padding:10px; border-bottom:1px solid var(--line); font-size:15px; font-weight:650; }
      .mpp-drawer-body { overflow:auto; padding:10px; flex:1; min-height:0; } .mpp-drawer-body label { display:flex; align-items:center; gap:8px; padding:9px 0; border-bottom:1px solid var(--line); }
      .mpp-drawer-body input { accent-color:var(--accent); } .mpp-drawer-body small { display:block; color:var(--muted); font-size:10px; }
      .mpp-drawer-body .mpp-collection { padding:12px 0; border-bottom:1px solid var(--line); } .mpp-collection > strong { font-size:12px; }
      .mpp-note { padding:9px; margin-top:10px; border:1px solid var(--line); border-radius:5px; background:var(--bg); color:var(--muted); font-size:11px; }
      .mp-product .mp-port { --mp-land:color-mix(in srgb,#b7c5a4 20%,var(--panel)); --mp-water:color-mix(in srgb,#66a9c9 45%,var(--panel)); --mp-park:color-mix(in srgb,#76a55c 35%,var(--panel)); --mp-street:color-mix(in srgb,var(--fg) 22%,var(--panel)); --mp-road:color-mix(in srgb,#e1cb91 45%,var(--panel)); --mp-casing:color-mix(in srgb,var(--muted) 40%,var(--panel)); }
      .mpp-minor { font-size:9px; opacity:.8; } .mpp-service { color:var(--muted); font-size:9px; white-space:nowrap; } .mpp-service svg { display:block; margin:auto; }
      .mpp-building { fill:color-mix(in srgb,var(--line) 60%,var(--panel)); stroke:color-mix(in srgb,var(--muted) 25%,var(--panel)); stroke-width:.8; }
      .mp-product .hide-buildings .mpp-building,.mp-product .hide-buildings .mpe-block { display:none; } .mp-product .hide-labels .mp-name { display:none!important; } .mp-product .hide-parks .mp-park { display:none; }
      .mp-product .mp-card { flex:1; min-width:0; padding:0; gap:0; border:0; border-radius:0; box-shadow:none; }
      .mp-product .mp-head { height:33px; flex:none; padding:0 10px; border-bottom:1px solid var(--line); gap:10px; }
      .mp-product .mp-title { font-size:11px; color:var(--muted); } .mp-product .mp-port { border-radius:0; outline:0; }
      .mp-product .mp-info { width:min(260px,calc(100% - 80px)); padding:12px; gap:5px; }
      .mp-product .mp-info-name { font-size:15px; line-height:1.3; } .mp-product .mp-info-sub { font-size:11px; }
      .mp-product .mp-dot svg { width:12px; height:12px; } .mp-product .mp-zoom .mp-zbtn { display:grid; place-items:center; }
      .mp-product .mpe-top { height:45px; } .mp-product .mpe-panel { width:242px; }
      .mp-product .mpe-work { flex-direction:row; } .mp-product .mpe-map { min-height:0; }
      .mp-product .mpe-handle.pin { transform:none; border-radius:50%; } .mp-product .mpe-handle.pin svg { width:17px; height:17px; }
      .mp-product .mpe-handle.pin span { transform:none; }
      .mp-product .mpe-zoom button { display:grid; place-items:center; height:28px; }
      .mp-product .mpe-tools button { display:flex; align-items:center; gap:4px; font-size:10.5px; padding:5px 6px; }
      .mp-product .mpe-readout { font-size:10.5px; box-shadow:0 2px 8px #0002; max-width:calc(100% - 70px); }
      .mp-product.narrow .mpp-panel { width:190px; } .mp-product.narrow .mpp-tag,.mp-product.narrow .mpp-avatar,.mp-product.narrow .mpp-top-actions button span { display:none; }
      .mp-product.narrow .mpp-drawer { width:190px; } .mp-product.narrow .mpp-top { gap:6px; }
      .mp-product .mpe-legend { position:absolute; right:9px; bottom:9px; background:var(--panel); border:1px solid var(--line); border-radius:5px; font-size:9px; padding:5px 7px; pointer-events:none; color:var(--muted); }
    `);
  }
  function productShell(ctx, editor) {
    productStyle(ctx);
    const { util, size, spec } = ctx, r = ctx.rng.fork('product-chrome');
    const width = Math.floor(Math.min(1260, size.width - 20)), height = Math.floor(Math.min(780, size.height - 16));
    const root = util.el('div', `mpe mp-product${width < 760 ? ' narrow' : ''}`, ctx.stage);
    Object.assign(root.style, { width: width + 'px', height: height + 'px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--line)', background: 'var(--panel)' });
    const top = util.el('div', 'mpp-top', root), brand = util.el('div', 'mpp-brand', top);
    icon(brand, 'map', 21); brand.append(document.createTextNode('Wayline'));
    const bar = util.el('div', 'mpp-project', root);
    util.el('span', '', bar, 'Operations'); icon(bar, 'chevron', 11);
    util.el('strong', '', bar, editor ? { pin: 'Field locations', route: 'Delivery planning', zone: 'Service coverage', zoomto: 'City survey' }[spec.scenario] : 'City explorer');
    util.el('span', 'mpp-tag', bar, 'Team workspace'); util.el('span', 'mpp-grow', bar);
    icon(bar, 'check', 12); util.el('span', '', bar, 'Offline copy up to date');
    const work = util.el('div', 'mpp-work', root), rail = util.el('nav', 'mpp-rail', work);
    rail.setAttribute('aria-label', 'Map workspace');
    const panel = util.el('aside', 'mpe-panel mpp-panel', work);
    const foot = util.el('div', 'mpp-foot', root), status = util.el('span', '', foot, 'Local survey / All changes saved');
    const position = util.el('span', '', foot, 'Local grid / North up');
    const drawer = util.el('div', 'mpp-drawer', root); drawer.hidden = true;
    const dh = util.el('div', 'mpp-drawer-head', drawer), title = util.el('span', '', dh);
    const dc = iconButton(dh, 'close', 'Close panel'); dc.addEventListener('click', () => { drawer.hidden = true; });
    const db = util.el('div', 'mpp-drawer-body', drawer);
    let active = null;
    const person = env.content.personName(r.fork('person'), { csplit: spec.csplit });
    function open(kind) {
      if (!drawer.hidden && active === kind) { drawer.hidden = true; return; }
      active = kind; drawer.hidden = false; db.replaceChildren();
      title.textContent = { saved: 'Saved maps', layers: 'Layers & legend', activity: 'Workspace activity', share: 'Share map' }[kind];
      if (kind === 'layers') {
        for (const [label, key] of [['Buildings', 'buildings'], ['Place labels', 'labels'], ['Parks & green space', 'parks']]) {
          const row = util.el('label', '', db), check = util.el('input', '', row); check.type = 'checkbox';
          check.checked = !root.querySelector('.mp-port').classList.contains('hide-' + key);
          util.el('span', '', row, label);
          check.addEventListener('change', () => root.querySelector('.mp-port').classList.toggle('hide-' + key, !check.checked));
        }
        util.el('div', 'mpp-note', db, 'Base map: Local streets\nReference system: Local survey grid');
        for (const text of ['Place / landmark', 'Road network', 'Park / recreation']) { const line = util.el('div', 'mpp-collection', db); icon(line, text.startsWith('Place') ? 'pin' : text.startsWith('Road') ? 'route' : 'map'); line.append(document.createTextNode(' ' + text)); }
      } else if (kind === 'saved') {
        ['Depot catchments', 'Weekend handoff', 'Neighbourhood survey', 'Retail field visits', 'Winter service areas', 'Archive / last quarter'].forEach((name, i) => {
          const row = util.el('div', 'mpp-collection', db); icon(row, 'folder'); util.el('strong', '', row, ' ' + name);
          util.el('small', '', row, `${i % 2 ? 'Private' : 'Operations team'} / ${3 + i * 2} saved places`);
        });
        util.el('div', 'mpp-note', db, 'Shared collections are read-only in this offline workspace.');
      } else if (kind === 'activity') {
        [person.full + ' updated Depot catchments', 'Field survey package is available', '2 service areas are awaiting review', 'Weekend handoff was shared with Operations', 'Offline map downloaded'].forEach((text, i) => {
          const row = util.el('div', 'mpp-collection', db); util.el('strong', '', row, text); util.el('small', '', row, `${i + 1} ${i ? 'hours' : 'hour'} ago / Operations`);
        });
      } else {
        util.el('strong', '', db, 'Only people in Operations can view this map.');
        util.el('p', 'mpp-meta', db, 'Offline changes stay on this device until the workspace reconnects.');
        const b = iconButton(db, 'share', 'Prepare map link', 'Prepare link');
        b.addEventListener('click', () => { const note = db.querySelector('.mpp-note') || util.el('div', 'mpp-note', db); note.textContent = 'Sharing is unavailable offline. Your map remains saved on this device.'; });
      }
    }
    const explorer = iconButton(rail, 'map', 'Explore map'); explorer.classList.add('active'); explorer.addEventListener('click', () => { drawer.hidden = true; });
    for (const [kind, symbol, label] of [['saved', 'folder', 'Saved maps'], ['layers', 'layers', 'Layers and legend'], ['activity', 'bell', 'Workspace activity']]) {
      const b = iconButton(rail, symbol, label); b.addEventListener('click', () => open(kind));
      if (kind === 'activity') util.el('span', 'mpp-count', b, '2');
    }
    util.el('div', 'mpp-grow', rail); iconButton(rail, 'compass', 'North up').addEventListener('click', () => { position.textContent = 'North up / Rotation 0 degrees'; });
    function finishTop() {
      const actions = util.el('div', 'mpp-top-actions', top);
      iconButton(actions, 'folder', 'Saved maps', 'Saved').addEventListener('click', () => open('saved'));
      iconButton(actions, 'share', 'Share map', 'Share').addEventListener('click', () => open('share'));
      const avatar = util.el('div', 'mpp-avatar', actions, person.first[0] + person.last[0]); avatar.title = person.full + ' / Operations';
    }
    return { root, top, work, panel, foot, status, position, finishTop };
  }

  function render(ctx) {
    const { util, rng, size, spec } = ctx;
    const fam = F();
    const chrome = productShell(ctx, false);
    const sb = util.el('div', 'mpp-search', chrome.top); icon(sb, 'search', 15);
    const search = util.el('input', '', sb); search.placeholder = 'Search this map'; search.setAttribute('aria-label', 'Search this map');
    chrome.finishTop();
    const section = util.el('div', 'mpe-section', chrome.panel);
    util.el('div', 'mpe-kicker', section, 'Explore / Local map');
    util.el('div', 'mpe-heading', section, spec.scenario === 'center' ? 'Map view' : 'Places');
    util.el('div', 'mpp-meta', section, `${spec.places.length} places / Local survey collection`);
    const filters = util.el('div', 'mpp-controls', chrome.panel);
    let category = 'All places';
    const list = util.el('div', 'mpe-list', chrome.panel);
    const rowMap = {};
    function directory() {
      list.replaceChildren();
      const query = search.value.trim().toLowerCase();
      const matches = spec.places.filter((p) => (p.name + ' ' + p.district + ' ' + placeMeta(ctx, p).address).toLowerCase().includes(query)
        && (category === 'All places' || (category === 'Food' ? /cafe|market|bakery|grocer/.test(p.kind) : /station|museum|library|university/.test(p.kind))));
      for (const p of matches) {
        const row = util.el('div', 'mpe-item', list); rowMap[p.id] = row;
        const symbol = util.el('div', 'mpe-badge', row); icon(symbol, kindIcon(p), 13);
        const b = util.el('button', '', row), meta = placeMeta(ctx, p);
        util.el('span', 'mpe-name', b, p.name); util.el('span', 'mpe-address', b, p.label || 'Venue');
        util.el('span', 'mpe-address', b, meta.address);
        const rating = util.el('div', 'mpp-meta', b); icon(rating, 'star', 10); rating.append(document.createTextNode(` ${meta.rating} (${meta.reviews}) / `)); util.el('span', 'mpp-open', rating, meta.hours);
        b.addEventListener('click', () => {
          const m = { ...ctx.model, c: [p.x, p.y], z: Math.max(ctx.model.z, p.minZoom), sel: p.id };
          ctx.update(m); paint(ctx.model);
        });
      }
      if (!matches.length) { const e = util.el('div', 'mpp-inspector', list); icon(e, 'search', 24); util.el('p', '', e, 'No places found'); util.el('small', 'mpp-meta', e, 'Try another name or street address in this offline map.'); }
      else util.el('div', 'mpp-note', list, 'End of local results / Map data stored on this device');
    }
    const chips = ['All places', 'Food', 'Landmarks'].map((label) => {
      const b = util.el('button', '', filters, label); b.classList.toggle('active', label === category);
      b.addEventListener('click', () => { category = label; chips.forEach((el) => el.classList.toggle('active', el === b)); directory(); }); return b;
    });
    search.addEventListener('input', directory); directory();
    const card = util.el('div', 'mp-card mpp-main', chrome.work);
    const head = util.el('div', 'mp-head', card);
    util.el('div', 'mp-title', head, spec.scenario === 'center' ? 'View centre / Local survey grid' : 'Explore the area');
    util.el('div', 'mp-spacer', head);
    const toggle = util.el('div', 'mp-toggle', head);
    const layers = [util.el('button', 'on', toggle, 'Map'), util.el('button', '', toggle, 'Transit')];
    const W = Math.max(260, Math.min(1000, card.clientWidth));
    const H = Math.max(180, card.clientHeight - 33);
    const port = util.el('div', 'mp-port', card);
    Object.assign(port.style, { width: W + 'px', height: H + 'px' });
    layers.forEach((b, i) => b.addEventListener('click', () => {
      layers.forEach((x, j) => x.classList.toggle('on', i === j));
      port.classList.toggle('transit', i === 1);
      ctx.log('layer', { layer: b.textContent });
    }));

    if (spec.judge && spec.judge.mode === 'ambiguous') {
      const note = util.el('div', 'mp-ui mp-info', port); note.style.cssText = 'left:10px;top:10px;z-index:3';
      util.el('div', 'mp-info-name', note, 'Map directory');
      spec.places.filter((p) => p.name === spec.judge.name).forEach((p) => util.el('div', 'mp-info-sub', note, `${p.name} · ${p.address}`));
    }

    // World layer (map units, scaled by the group transform).
    const svg = sv('svg', { class: 'mp-svg', width: W, height: H }, port);
    const world = sv('g', {}, svg);
    const wd = spec.world;
    if (wd.sea) sv('path', { class: 'mp-sea', d: pathOf(wd.sea) + 'Z' }, world);
    if (wd.lake) sv('path', { class: 'mp-lake', d: pathOf(wd.lake) + 'Z' }, world);
    for (const p of wd.parks) sv('path', { class: 'mp-park', d: pathOf(p.pts) + 'Z' }, world);
    const streets = sv('path', { class: 'mp-streets', 'vector-effect': 'non-scaling-stroke',
      d: wd.streets.map(([a, b, c, d]) => `M${a} ${b}L${c} ${d}`).join('') }, world);
    if (wd.river) sv('path', { class: 'mp-river', d: pathOf(wd.river.pts), 'stroke-width': wd.river.w }, world);
    const casings = wd.roads.map((r) => sv('path', { class: 'mp-casing', d: pathOf(r.pts), 'vector-effect': 'non-scaling-stroke' }, world));
    const roads = wd.roads.map((r) => sv('path', { class: 'mp-road', d: pathOf(r.pts), 'vector-effect': 'non-scaling-stroke' }, world));

    const minorNames = env.content.sample(rng.fork('minor-street-names'), env.content.STREET_NAMES, 20, { csplit: spec.csplit });
    const buildings = sv('g', { 'pointer-events': 'none' }, world);
    const gr = rng.fork('building-footprints');
    for (const p of spec.places) for (let i = 0; i < 8; i++) {
      const x = p.x + gr.float(-160, 160), y = p.y + gr.float(-140, 140);
      if (wd.sea && fam.inPoly([x, y], wd.sea) || wd.lake && fam.inPoly([x, y], wd.lake)) continue;
      sv('rect', { class: 'mpp-building', x, y, width: gr.int(10, 30), height: gr.int(12, 35), rx: 2 }, buildings);
    }
    // Small building groups along the existing road grid fill the otherwise empty city blocks.
    const grid = wd.grid;
    if (grid) for (let x = grid.ox; x < wd.W; x += grid.g) for (let y = grid.oy; y < wd.H; y += grid.g) {
      if (wd.sea && fam.inPoly([x, y], wd.sea) || wd.lake && fam.inPoly([x, y], wd.lake)
        || wd.parks.some((p) => fam.inPoly([x, y], p.pts))) continue;
      if (wd.river && wd.river.pts.some((p) => Math.hypot(p[0] - x, p[1] - y) < wd.river.w + 80)) continue;
      for (let i = 0; i < 6; i++) sv('rect', { class: 'mpp-building', x: x + 12 + (i % 3) * 25, y: y + 12 + Math.floor(i / 3) * 45, width: gr.int(12, 21), height: gr.int(20, 38), rx: 1 }, buildings);
    }
    world.insertBefore(buildings, streets); // Road casings remain visible over building footprints.
    // Label + pin layer (px at the current zoom; translated on pan, rebuilt on zoom).
    const layer = util.el('div', 'mp-layer', port);

    // Reticle (center scenario).
    let reticle = null;
    if (spec.scenario === 'center') {
      reticle = util.el('div', 'mp-reticle', port);
      const c1 = util.el('div', 'mp-cross', port);
      const c2 = util.el('div', 'mp-cross', port);
      Object.assign(c1.style, { left: W / 2 - 7 + 'px', top: H / 2 - 1 + 'px', width: '14px', height: '2px' });
      Object.assign(c2.style, { left: W / 2 - 1 + 'px', top: H / 2 - 7 + 'px', width: '2px', height: '14px' });
    }

    // Corners: zoom stack, card, scale bar.
    const zc = rng.pick(['tr', 'tr', 'br', 'tl']);
    const ic = zc === 'tl' ? 'bl' : rng.pick(['bl', 'tl']);
    const free = ['br', 'bl', 'tr', 'tl'].filter((c) => c !== zc && c !== ic && c[0] === 'b');
    const sc = free[0] || 'tr';
    const at = (el, corner, m = 10) => {
      el.style[corner[0] === 't' ? 'top' : 'bottom'] = m + 'px';
      el.style[corner[1] === 'l' ? 'left' : 'right'] = m + 'px';
    };
    const zoomBox = util.el('div', 'mp-ui mp-zoom', port);
    at(zoomBox, zc);
    const zin = util.el('button', 'mp-zbtn', zoomBox); icon(zin, 'plus');
    zin.title = 'Zoom in';
    const ticks = [];
    for (let z = spec.zmax; z >= spec.zmin; z--) {
      const t = util.el('div', 'mp-tick', zoomBox);
      t.dataset.z = z;
      t.title = `Level ${z}`;
      ticks.push(t);
    }
    const zout = util.el('button', 'mp-zbtn', zoomBox); icon(zout, 'minus');
    zout.title = 'Zoom out';
    const level = util.el('div', 'mp-level', zoomBox);
    const scaleBox = util.el('div', 'mp-ui mp-scale', port);
    at(scaleBox, sc);
    const scaleTxt = util.el('div', '', scaleBox);
    const scaleBar = util.el('div', 'mp-scalebar', scaleBox);
    const attr = util.el('div', 'mp-ui mp-attr', port, rng.pick(['Map data: city survey', 'Tiles: open street data', 'Cartography: local GIS office']));
    at(attr, sc, 4);
    attr.style[sc[0] === 'b' ? 'bottom' : 'top'] = '40px';
    const info = util.el('div', 'mp-ui mp-info', port);
    at(info, ic);
    info.hidden = true;
    const infoName = util.el('div', 'mp-info-name', info);
    const infoSub = util.el('div', 'mp-info-sub', info);
    const infoRating = util.el('div', 'mp-info-sub', info);
    const infoAddress = util.el('div', 'mp-info-sub', info);
    const infoHours = util.el('div', 'mpp-open mp-info-sub', info);
    const infoRow = util.el('div', 'mp-info-row', info);
    util.el('button', '', infoRow, 'Directions');
    util.el('button', '', infoRow, rng.pick(['Save', 'Share', 'Nearby']));
    const close = util.el('button', 'mp-close', info); icon(close, 'close');
    close.title = 'Close';

    const pinShape = rng.bool(0.35) ? 'sq' : '';
    let builtZ = null;
    let pins = {};

    function buildLayer(z) {
      layer.replaceChildren();
      pins = {};
      const s = fam.scaleOf(z);
      const lbl = (cls, text, x, y, rot) => {
        const e = util.el('div', `mp-lbl ${cls}`, layer, text);
        e.style.left = x * s + 'px';
        e.style.top = y * s + 'px';
        if (rot) e.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
        return e;
      };
      if (z <= 4) for (const d of wd.districts) lbl('mp-district', d.name, d.x, d.y);
      if (z >= 2) {
        for (const p of wd.parks) {
          const cx = p.pts.reduce((a, q) => a + q[0], 0) / p.pts.length;
          const cy = p.pts.reduce((a, q) => a + q[1], 0) / p.pts.length;
          lbl('mp-parkname', p.name, cx, cy + 18 / s);
        }
      }
      if (z >= 3) {
        const gap = 640 / s;
        for (const r of wd.roads) {
          let acc = gap / 2;
          for (let i = 1; i < r.pts.length; i++) {
            const [a, b] = [r.pts[i - 1], r.pts[i]];
            const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
            while (acc < L) {
              const t = acc / L;
              let ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
              if (ang > 90) ang -= 180;
              if (ang <= -90) ang += 180;
              lbl('mp-roadname', r.name, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, Math.round(ang));
              acc += gap;
            }
            acc -= L;
          }
        }
      }
      if (z >= 3) wd.streets.forEach(([x1, y1, x2, y2], i) => {
        if (i % 9 === 0) lbl('mp-roadname mpp-minor', minorNames[i % minorNames.length], (x1 + x2) / 2, (y1 + y2) / 2, x1 === x2 ? -90 : 0);
      });
      // Pins last (above labels), big places last so they paint on top.
      const vis = spec.places.filter((p) => fam.visible(spec, p, z)).sort((a, b) => b.tier - a.tier);
      for (const p of vis) {
        const pin = util.el('div', `mp-pin t${p.tier} ${pinShape}`, layer);
        pin.dataset.id = p.id;
        pin.style.left = p.x * s + 'px';
        pin.style.top = p.y * s + 'px';
        pin.style.setProperty('--c', p.kind === 'venue' ? VENUE_COLOR : TIER_COLORS[p.tier]);
        const dot = util.el('div', 'mp-dot', pin); icon(dot, kindIcon(p), 12);
        util.el('div', 'mp-name', pin, p.name);
        pins[p.id] = { pin, dot };
      }
      // Stroke widths per zoom (non-scaling strokes).
      const roadW = [0, 2, 3, 4, 6, 8, 10][z];
      roads.forEach((e) => e.setAttribute('stroke-width', roadW));
      casings.forEach((e) => e.setAttribute('stroke-width', roadW + 2));
      streets.setAttribute('stroke-width', [0, 0, 1, 1.5, 2.5, 4, 6][z]);
      streets.style.opacity = z <= 1 ? 0 : 1;
      builtZ = z;
    }

    function paint(m) {
      const z = m.z;
      if (z !== builtZ) buildLayer(z);
      const s = fam.scaleOf(z);
      const tx = W / 2 - m.c[0] * s;
      const ty = H / 2 - m.c[1] * s;
      world.setAttribute('transform', `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s})`);
      layer.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
      for (const [id, p] of Object.entries(pins)) p.pin.classList.toggle('sel', id === m.sel);
      ticks.forEach((t) => t.classList.toggle('on', Number(t.dataset.z) === z));
      zin.disabled = z >= spec.zmax;
      zout.disabled = z <= spec.zmin;
      level.textContent = `Level ${z}`;
      if (reticle) {
        const r = Math.max(4, spec.tau * s);
        Object.assign(reticle.style, { left: W / 2 - r + 'px', top: H / 2 - r + 'px', width: 2 * r + 'px', height: 2 * r + 'px' });
      }
      // Scale bar: a round number of metres (1 map unit = 2 m) about 80-120 px long.
      const mPerPx = 2 / s;
      const nice = [10, 20, 50, 100, 200, 250, 500, 1000, 2000, 5000];
      const metres = nice.find((n) => n / mPerPx >= 70) || 5000;
      scaleBar.style.width = Math.round(metres / mPerPx) + 'px';
      scaleTxt.textContent = metres >= 1000 ? `${metres / 1000} km` : `${metres} m`;
      chrome.position.textContent = `Centre ${m.c.map((x) => x.toFixed(0)).join(', ')} / Level ${m.z} / Local grid`;
      Object.entries(rowMap).forEach(([id, el]) => el.classList.toggle('selected', id === m.sel));
      const sel = m.sel && fam.placeById(spec, m.sel);
      info.hidden = !sel;
      if (sel) {
        infoName.textContent = sel.name;
        infoSub.textContent = [sel.label || 'Venue', sel.district].filter(Boolean).join(' / ');
        const meta = placeMeta(ctx, sel); infoRating.textContent = `${meta.rating} / ${meta.reviews} reviews`; infoAddress.textContent = meta.address; infoHours.textContent = meta.hours;
      }
    }

    // Pan / select.
    let drag = null;
    port.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('.mp-ui')) return;
      e.preventDefault();
      port.setPointerCapture(e.pointerId);
      const pin = e.target.closest('.mp-pin');
      drag = { x0: e.clientX, y0: e.clientY, m0: ctx.model, pin: pin ? pin.dataset.id : null, moved: false };
    });
    port.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const d = [e.clientX - drag.x0, e.clientY - drag.y0];
      if (!drag.moved && Math.hypot(d[0], d[1]) < 4) return;
      if (!drag.moved) {
        drag.moved = true;
        port.classList.add('dragging');
        ctx.log('grab', { what: 'map' });
      }
      const m = fam.panPx({ ...drag.m0, sel: ctx.model.sel }, spec, d);
      ctx.update(m);
      paint(m);
    });
    const end = () => {
      if (!drag) return;
      const g = drag;
      drag = null;
      port.classList.remove('dragging');
      if (g.moved) {
        ctx.log('release', { what: 'map' });
        return;
      }
      const m = g.pin ? fam.select(ctx.model, spec, g.pin) : { ...ctx.model, sel: null };
      if (g.pin) ctx.log('select', { place: g.pin });
      if (m !== ctx.model && (m.sel !== ctx.model.sel)) {
        ctx.update(m);
        paint(m);
      }
    };
    port.addEventListener('pointerup', end);
    port.addEventListener('pointercancel', end);
    for (const el of [zoomBox, info]) el.addEventListener('pointerdown', (e) => e.stopPropagation());

    const zoomTo = (z, atPx) => {
      const m = fam.zoomAt(ctx.model, spec, z, atPx);
      if (m === ctx.model) return;
      ctx.log('zoom', { z: m.z });
      ctx.update(m);
      paint(m);
    };
    zin.addEventListener('click', () => zoomTo(ctx.model.z + 1));
    zout.addEventListener('click', () => zoomTo(ctx.model.z - 1));
    ticks.forEach((t) => t.addEventListener('click', () => zoomTo(Number(t.dataset.z))));
    close.addEventListener('click', () => {
      ctx.update({ ...ctx.model, sel: null });
      paint(ctx.model);
    });
    port.addEventListener('wheel', (e) => {
      if (!spec.wheel) return;
      e.preventDefault();
      const k = fam.wheelSteps(e.deltaY);
      if (!k) return;
      const r = port.getBoundingClientRect();
      zoomTo(ctx.model.z + k, [e.clientX - r.left, e.clientY - r.top]);
    }, { passive: false });

    // Mirror the viewport size (unscored) so the logic can plan pans and clicks.
    const pw = port.clientWidth;
    const ph = port.clientHeight;
    const m0 = ctx.model;
    if (!m0.port || m0.port[0] !== pw || m0.port[1] !== ph) ctx.update({ ...m0, port: [pw, ph] });
    paint(ctx.model);

    const portCenter = () => {
      const r = port.getBoundingClientRect();
      return [r.left + port.clientLeft + pw / 2, r.top + port.clientTop + ph / 2];
    };
    view = {
      anchors: [port, zoomBox, head],
      sync: (m) => paint(m),
      locate(t) {
        if (t.marker !== undefined) {
          const p = pins[t.marker];
          return p ? util.center(p.dot) : null;
        }
        if (t.zoom) return util.center(t.zoom === 'in' ? zin : zout);
        if (t.map) return portCenter();
        if (t.close) return util.center(close);
        if (t.grab || t.release) {
          const D = fam.dragPx(ctx.model, spec, t.grab || t.release);
          const c = portCenter();
          const k = t.grab ? -0.5 : 0.5;
          return [c[0] + k * D[0], c[1] + k * D[1]];
        }
        return null;
      },
    };
    return view;
  }

  // The editor shares the legacy map's coordinate contract, with its own product frame and gestures.
  function renderEditor(ctx) {
    const { util, spec: s, size } = ctx, fam = F();
    ctx.css('mp-editor-style', `
      .mpe { border:1px solid var(--line); border-radius:12px; background:var(--panel); overflow:hidden; display:flex; flex-direction:column; color:var(--fg); font-size:12px; }
      .mpe button,.mpe input { font:inherit; color:var(--fg); background:var(--panel); border:1px solid var(--line); border-radius:6px; }
      .mpe button { cursor:pointer; padding:6px 9px; } .mpe button:hover { background:var(--bg); }
      .mpe-top { height:47px; flex:none; display:flex; gap:12px; align-items:center; padding:7px 12px; border-bottom:1px solid var(--line); }
      .mpe-brand { font-size:15px; font-weight:750; white-space:nowrap; color:var(--accent); }
      .mpe-searchbox { flex:1; position:relative; min-width:120px; max-width:350px; }
      .mpe-searchbox input { width:100%; padding:7px 10px; background:var(--bg); outline-color:var(--accent); }
      .mpe-results { position:absolute; top:35px; left:0; right:0; max-height:205px; overflow:auto; z-index:25; background:var(--panel); border:1px solid var(--line); box-shadow:0 8px 24px #0003; border-radius:8px; }
      .mpe-results button { display:block; width:100%; text-align:left; border:0; border-radius:0; padding:9px; }
      .mpe-results small { display:block; color:var(--muted); } .mpe-results[hidden] { display:none; }
      .mpe-work { display:flex; flex:1; min-height:0; } .mpe.compact .mpe-work { flex-direction:column; }
      .mpe-panel { width:214px; flex:none; border-right:1px solid var(--line); display:flex; flex-direction:column; min-height:0; background:var(--panel); }
      .mpe.compact .mpe-panel { width:100%; height:132px; border-right:0; border-bottom:1px solid var(--line); }
      .mpe-section { padding:10px 12px 7px; border-bottom:1px solid var(--line); flex:none; }
      .mpe-kicker { font-size:10px; text-transform:uppercase; letter-spacing:.09em; color:var(--muted); }
      .mpe-heading { font-size:16px; font-weight:700; margin:2px 0 4px; }
      .mpe-help { color:var(--muted); font-size:11px; }
      .mpe-list { min-height:0; flex:1; overflow:auto; overscroll-behavior:contain; }
      .mpe.compact .mpe-section { padding:5px 10px; } .mpe.compact .mpe-heading { display:inline; font-size:13px; margin-right:10px; }
      .mpe.compact .mpe-kicker { display:none; } .mpe.compact .mpe-help { display:inline; }
      .mpe-item { display:flex; gap:8px; padding:9px 11px; border-bottom:1px solid var(--line); line-height:1.3; }
      .mpe-item button { padding:0; border:0; text-align:left; width:100%; background:none; }
      .mpe-name { display:block; font-weight:600; overflow-wrap:anywhere; } .mpe-address { display:block; font-size:10px; margin-top:2px; color:var(--muted); }
      .mpe-badge { width:19px; height:19px; display:inline-grid; place-items:center; flex:none; background:var(--bg); color:var(--accent); border:1px solid var(--line); border-radius:50%; font-size:10px; }
      .mpe-map { flex:1; min-width:0; position:relative; } .mpe-port { border-radius:0; outline:0; width:100%; height:100%; }
      .mpe-port { --mp-land:color-mix(in srgb,#a4b594 20%,var(--panel)); --mp-road:color-mix(in srgb,#e9d197 50%,var(--panel)); --mp-casing:color-mix(in srgb,#9a927b 50%,var(--panel)); }
      .mpe-block { fill:color-mix(in srgb,var(--line) 45%,var(--panel)); stroke:color-mix(in srgb,var(--muted) 30%,var(--panel)); stroke-width:1; }
      .mpe-port .mp-name { position:absolute; left:7px; top:18px; transform:translateX(-50%); white-space:normal; text-align:center; line-height:11px; font-size:10px; max-height:23px; overflow:hidden; } .mpe-port .mp-pin { pointer-events:none; }
      .mpe-port .mp-dot { width:15px; height:15px; font-size:9px; } .mpe-port .mp-pin { height:15px; margin:-7.5px 0 0 -7.5px; }
      .mpe-editlayer { position:absolute; inset:0; pointer-events:none; overflow:hidden; }
      .mpe-path { fill:none; stroke:var(--accent); stroke-width:4; stroke-linejoin:round; stroke-linecap:round; }
      .mpe-polygon { fill:color-mix(in srgb,var(--accent) 18%,transparent); stroke:var(--accent); stroke-width:2; stroke-dasharray:6 3; }
      .mpe-handle { position:absolute; width:23px; height:23px; margin:-11.5px; display:grid; place-items:center; border:2px solid var(--panel); border-radius:50%; background:var(--accent); color:white; font-weight:700; cursor:move; box-shadow:0 1px 4px #0006; pointer-events:auto; }
      .mpe-handle.pin { border-radius:50% 50% 50% 2px; background:#c74439; transform:rotate(-45deg); } .mpe-handle.pin span { transform:rotate(45deg); }
      .mpe-vertex { fill:var(--panel); stroke:var(--accent); stroke-width:2; }
      .mpe-tools { position:absolute; left:10px; top:10px; display:flex; gap:4px; padding:4px; border:1px solid var(--line); border-radius:8px; background:var(--panel); }
      .mpe-tools button { padding:5px 8px; } .mpe-tools button.active { background:var(--accent); color:white; border-color:var(--accent); }
      .mpe-tools button:disabled { opacity:.45; cursor:default; }
      .mpe-zoom { position:absolute; right:10px; top:10px; display:flex; flex-direction:column; gap:3px; background:var(--panel); padding:4px; border:1px solid var(--line); border-radius:7px; text-align:center; }
      .mpe-zoom button { font-size:18px; width:31px; padding:2px; } .mpe-zoom output { color:var(--muted); font-size:10px; }
      .mpe-readout { position:absolute; left:10px; bottom:10px; max-width:calc(100% - 20px); border:1px solid var(--line); border-radius:7px; padding:7px 10px; background:var(--panel); pointer-events:none; font-size:11px; box-shadow:0 1px 4px #0002; }
      .mpe-readout div { overflow-wrap:anywhere; } .mpe-readout b { font-weight:600; }
      .mpe-foot { height:26px; flex:none; display:flex; justify-content:space-between; gap:10px; align-items:center; padding:0 11px; border-top:1px solid var(--line); color:var(--muted); font-size:10px; }
      .mpe-centre { position:absolute; left:50%; top:50%; width:22px; height:22px; border:1px solid var(--accent); border-radius:50%; transform:translate(-50%,-50%); pointer-events:none; }
      .mpe-centre:before,.mpe-centre:after { content:''; position:absolute; background:var(--accent); }
      .mpe-centre:before { width:32px; height:1px; left:-6px; top:10px; } .mpe-centre:after { height:32px; width:1px; top:-6px; left:10px; }
    `);
    const chrome = productShell(ctx, true), { root, top, work, panel } = chrome;
    const sb = util.el('div', 'mpe-searchbox mpp-search', top); icon(sb, 'search', 15);
    const search = util.el('input', '', sb); search.placeholder = 'Search places or addresses'; search.setAttribute('aria-label', 'Search places or addresses');
    const results = util.el('div', 'mpe-results', sb); results.hidden = true;
    chrome.finishTop();
    const section = util.el('div', 'mpe-section', panel);
    util.el('div', 'mpe-kicker', section, 'Workspace / Survey district');
    const titles = { pin: 'Saved location', route: 'Route planner', zone: 'Delivery zones', zoomto: 'Explore the map' };
    util.el('div', 'mpe-heading', section, titles[s.scenario]);
    const hints = { pin: 'Personal collection / Synced to this device', route: 'Operations itinerary / Local road survey', zone: 'Courier coverage / Operations team', zoomto: 'Survey view / North up / Local coordinates' };
    util.el('div', 'mpe-help', section, hints[s.scenario]);
    const controls = util.el('div', 'mpp-controls', panel);
    let travelMode = 'Driving';
    if (s.scenario === 'route') {
      const modes = [['car', 'Driving'], ['walk', 'Walking'], ['bike', 'Cycling']].map(([symbol, label]) => {
        const b = iconButton(controls, symbol, label); b.classList.toggle('active', label === travelMode);
        b.addEventListener('click', () => { travelMode = label; modes.forEach((el) => el.classList.toggle('active', el === b)); paint(ctx.model); }); return b;
      });
      util.el('span', 'mpp-meta', controls, 'Route options / Avoid tolls');
    } else {
      const b = iconButton(controls, s.scenario === 'zone' ? 'polygon' : 'folder', s.scenario === 'zone' ? 'Service area properties' : 'Collection details', s.scenario === 'zone' ? 'Standard service' : 'Field collection');
      b.addEventListener('click', () => { settings.hidden = !settings.hidden; });
    }
    const settings = util.el('div', 'mpp-inspector', panel);
    if (s.scenario === 'zone') {
      util.el('strong', '', settings, 'Primary service area');
      for (const [label, value] of [['Schedule', 'Weekdays 09:00-18:00'], ['Priority', 'Standard delivery'], ['Visibility', 'Operations team']]) { const row = util.el('div', 'mpp-property', settings); util.el('span', '', row, label); util.el('span', '', row, value); }
    }
    const inspectorStatus = util.el('div', 'mpp-meta', settings);
    const list = util.el('div', 'mpe-list', panel);
    const entries = s.scenario === 'route' ? s.stops.map((id) => fam.placeById(s, id)) : s.places;
    const stopLabels = [];
    entries.forEach((p, i) => {
      const row = util.el('div', 'mpe-item', list);
      util.el('span', 'mpe-badge', row, s.scenario === 'route' ? String(i + 1) : String(s.places.indexOf(p) + 1));
      const b = util.el('button', '', row);
      const name = util.el('span', 'mpe-name', b, p.name);
      const address = util.el('span', 'mpe-address', b, p.address);
      if (s.scenario === 'route') stopLabels.push({ name, address });
      else { const meta = placeMeta(ctx, p); const line = util.el('div', 'mpp-meta', b); icon(line, 'star', 10); line.append(document.createTextNode(` ${meta.rating} (${meta.reviews}) / `)); util.el('span', 'mpp-open', line, meta.hours); }
      b.title = 'Show on map';
      b.addEventListener('click', () => commit({ ...ctx.model, c: s.scenario === 'route' ? ctx.model.waypoints[i].slice() : [p.x, p.y], sel: p.id }));
    });
    if (s.scenario === 'route') {
      util.el('div', 'mpe-section mpe-kicker', list, 'Places on this map');
      s.places.forEach((p, i) => {
        const row = util.el('div', 'mpe-item', list);
        util.el('span', 'mpe-badge', row, String(i + 1));
        const b = util.el('button', '', row);
        util.el('span', 'mpe-name', b, p.name); util.el('span', 'mpe-address', b, p.address);
        b.addEventListener('click', () => commit({ ...ctx.model, c: [p.x, p.y] }));
      });
    }
    const map = util.el('div', 'mpe-map', work);
    const port = util.el('div', 'mp-port mpe-port', map);
    const W = port.clientWidth, H = port.clientHeight;
    const svg = sv('svg', { class: 'mp-svg', width: W, height: H }, port);
    const world = sv('g', {}, svg);
    for (const p of s.world.parks) sv('path', { class: 'mp-park', d: pathOf(p.pts) + 'Z' }, world);
    const cx = s.world.W / 2, cy = s.world.H / 2, br = ctx.rng.fork('survey-buildings');
    for (let col = -6; col <= 5; col++) for (let row = -5; row <= 4; row++) {
      for (let b = 0; b < 3; b++) sv('rect', { class: 'mpe-block', x: cx + col * s.spacing[0] + s.spacing[0] / 2 + 13 + b * 40,
        y: cy + row * s.spacing[1] + 36, width: br.int(22, 34), height: br.int(48, 93), rx: 2 }, world);
    }
    const outerStreets = [];
    for (let n = -6; n <= 6; n++) {
      const x = cx + (n + .5) * s.spacing[0], y = cy + n * s.spacing[1];
      outerStreets.push(`M${x} ${cy - 1200}L${x} ${cy + 1200}`);
      if (Math.abs(n) > 1) outerStreets.push(`M${cx - 1600} ${y}L${cx + 1600} ${y}`);
    }
    sv('path', { class: 'mp-streets', d: outerStreets.join(''), 'stroke-width': 8 }, world);
    sv('path', { class: 'mp-streets', d: s.world.streets.map(([x, y, a, b]) => `M${x} ${y}L${a} ${b}`).join(''), 'stroke-width': 8 }, world);
    for (const r of s.world.roads) {
      sv('path', { class: 'mp-casing', d: pathOf(r.pts), 'stroke-width': 18 }, world);
      sv('path', { class: 'mp-road', d: pathOf(r.pts), 'stroke-width': 15 }, world);
    }
    const labels = util.el('div', 'mp-layer', port);
    const pins = s.places.map((p, i) => {
      const pin = util.el('div', 'mp-pin', labels); pin.style.setProperty('--c', '#587d71');
      util.el('div', 'mp-dot', pin, String(i + 1));
      const name = util.el('div', 'mp-name', pin, p.name); name.title = p.name;
      return pin;
    });
    const roadLabels = s.world.roads.map((r) => util.el('div', 'mp-lbl mp-roadname', labels, r.name));
    const overlay = sv('svg', { class: 'mpe-editlayer', width: W, height: H }, port);
    const path = sv('path', { class: s.scenario === 'zone' ? 'mpe-polygon' : 'mpe-path' }, overlay);
    const vertices = sv('g', {}, overlay);
    const handles = s.scenario === 'route' ? ctx.model.waypoints.map((_, i) => {
      const e = util.el('div', 'mpe-handle', port, String(i + 1)); e.dataset.waypoint = i; e.setAttribute('aria-label', `Waypoint ${i + 1}`); return e;
    }) : [];
    const pin = util.el('div', 'mpe-handle pin', port); icon(pin, 'pin', 17); pin.dataset.pin = '1'; pin.setAttribute('aria-label', 'Dropped pin');
    if (s.scenario === 'zoomto') util.el('div', 'mpe-centre', port);
    const tools = util.el('div', 'mpe-tools', port);
    const edit = util.el('button', '', tools, { pin: 'Drop pin', route: 'Edit route', zone: 'Draw zone', zoomto: 'Explore' }[s.scenario]);
    icon(edit, s.scenario === 'zone' ? 'polygon' : s.scenario === 'route' ? 'route' : 'pin', 13);
    const pan = util.el('button', '', tools, 'Pan'); icon(pan, 'map', 13);
    let clear, close;
    if (s.scenario === 'zone') {
      clear = util.el('button', '', tools, 'Clear');
      close = util.el('button', '', tools, 'Close');
      clear.addEventListener('click', () => commit({ ...ctx.model, vertices: [], closed: false }));
      close.addEventListener('click', () => { if (ctx.model.vertices.length >= 3) commit({ ...ctx.model, closed: true }); });
    }
    edit.addEventListener('click', () => commit({ ...ctx.model, tool: 'edit' }));
    pan.addEventListener('click', () => commit({ ...ctx.model, tool: 'pan' }));
    const zb = util.el('div', 'mpe-zoom', port);
    const zin = util.el('button', '', zb); icon(zin, 'plus'); zin.title = 'Zoom in';
    const level = util.el('output', '', zb);
    const zout = util.el('button', '', zb); icon(zout, 'minus'); zout.title = 'Zoom out';
    const readout = util.el('div', 'mpe-readout', port);
    const saved = chrome.status;
    const legend = util.el('div', 'mpe-legend', port); icon(legend, 'compass', 14); util.el('div', '', legend, 'North up');
    let resultButtons = {}, resultKey = null;
    const coord = (p) => fam.toPort(ctx.model, p);
    function paint(m) {
      const sc = fam.scaleOf(m.z), tx = W / 2 - m.c[0] * sc, ty = H / 2 - m.c[1] * sc;
      world.setAttribute('transform', `translate(${tx} ${ty}) scale(${sc})`);
      pins.forEach((el, i) => { const p = s.places[i]; el.style.left = p.x * sc + 'px'; el.style.top = p.y * sc + 'px'; const name = el.querySelector('.mp-name'); name.style.width = Math.min(128, s.spacing[0] * sc - 10) + 'px'; name.style.display = m.z < 2 ? 'none' : 'block'; });
      roadLabels.forEach((el, i) => { el.style.left = (m.c[0] - (W / 2 - 65) / sc) * sc + 'px'; el.style.top = (s.world.roads[i].pts[0][1] - 13 / sc) * sc + 'px'; });
      labels.style.transform = `translate(${tx}px,${ty}px)`;
      handles.forEach((el, i) => { const p = fam.toPort(m, m.waypoints[i]); el.style.left = p[0] + 'px'; el.style.top = p[1] + 'px'; });
      pin.hidden = s.scenario !== 'pin' || !m.pin;
      // The display rule for editor handles is explicit: hidden must beat display:grid.
      pin.style.display = pin.hidden ? 'none' : 'grid';
      if (m.pin) { const p = fam.toPort(m, m.pin); pin.style.left = p[0] + 'px'; pin.style.top = p[1] + 'px'; }
      const pts = s.scenario === 'zone' ? m.vertices : s.scenario === 'route' ? fam.routeGeometry(m, s) : [];
      path.setAttribute('d', pts.length ? pathOf(pts.map((p) => fam.toPort(m, p))) + (m.closed ? 'Z' : '') : '');
      vertices.replaceChildren();
      if (s.scenario === 'zone') pts.forEach((p, i) => { const q = fam.toPort(m, p); sv('circle', { class: 'mpe-vertex', cx: q[0], cy: q[1], r: i === 0 ? 6 : 4 }, vertices); });
      level.textContent = `Level ${m.z}`; zin.disabled = m.z >= s.zmax; zout.disabled = m.z <= s.zmin;
      edit.classList.toggle('active', m.tool === 'edit'); pan.classList.toggle('active', m.tool === 'pan');
      if (close) close.disabled = m.vertices.length < 3 || m.closed;
      stopLabels.forEach((row, i) => {
        const point = m.waypoints[i];
        const place = s.places.slice().sort((a, b) => Math.hypot(a.x - point[0], a.y - point[1]) - Math.hypot(b.x - point[0], b.y - point[1]))[0];
        row.name.textContent = place.name; row.address.textContent = place.address;
      });
      const st = fam.editorStats(m, s);
      inspectorStatus.textContent = s.scenario === 'pin' ? (m.pin ? 'Saved pin / ' + st.address : 'No saved pin yet. This collection is ready for a location.')
        : s.scenario === 'route' ? `${travelMode} / ${Math.max(1, Math.round(parseFloat(st.length) * (travelMode === 'Walking' ? 12 : travelMode === 'Cycling' ? 4 : 3)))} min estimated / ${m.waypoints.length} stops`
        : s.scenario === 'zone' ? `${m.closed ? 'Boundary saved' : 'Draft boundary'} / ${m.vertices.length} vertices / ${st.area}`
        : `Current view / Level ${m.z} / Bearing 0 degrees`;
      chrome.position.textContent = `${st.scale} / Centre ${m.c.map((v) => v.toFixed(0)).join(', ')} / Local grid`;
      const lines = s.scenario === 'pin' ? [['Street address', st.address], ['Nearest place', m.pin ? st.name : 'Not set'], ['Coordinates', m.pin ? st.coordinates : 'Not set']]
        : s.scenario === 'route' ? [['Route length', st.length], ['Stops', String(m.waypoints.length)]]
        : s.scenario === 'zone' ? [['Covered addresses', String(st.covered)], ['Area', st.area], ['Boundary', m.closed ? 'Closed' : 'Draft']]
        : [['Centre coordinates', st.coordinates], ['Map scale', st.scale]];
      readout.replaceChildren();
      for (const [label, value] of lines) { const line = util.el('div', '', readout); util.el('b', '', line, label + ': '); line.append(document.createTextNode(value)); }
      saved.textContent = s.scenario === 'zone' ? (m.closed ? 'Boundary saved locally' : `${m.vertices.length} vertices · Draft boundary`) : 'Changes saved locally';
      if (search.value !== m.query) search.value = m.query;
      results.hidden = !m.searchOpen;
      const key = `${m.searchOpen}|${m.query}`;
      if (key !== resultKey) {
        resultKey = key; results.replaceChildren(); resultButtons = {};
        if (m.searchOpen) {
          const q = m.query.trim().toLowerCase();
          const found = s.places.filter((p) => (p.name + ' ' + p.address).toLowerCase().includes(q));
          if (!found.length) { const row = util.el('div', 'mpe-item', results); icon(row, 'search', 20); const text = util.el('div', '', row, 'No places found'); util.el('small', '', text, 'Try another name or street address in this offline map.'); }
          for (const p of found) {
            const b = util.el('button', '', results, p.name); util.el('small', '', b, p.address); resultButtons[p.id] = b;
            b.addEventListener('click', () => commit({ ...ctx.model, c: [p.x, p.y], sel: p.id, searchOpen: false, searchDone: true }));
          }
        }
      }
    }
    function commit(m) { ctx.update(m); paint(ctx.model); }
    search.addEventListener('input', () => commit({ ...ctx.model, query: search.value, searchOpen: true }));
    search.addEventListener('focus', () => commit({ ...ctx.model, searchOpen: true }));
    search.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') commit({ ...ctx.model, searchOpen: false });
      if (e.key === 'Enter') { const b = Object.values(resultButtons)[0]; if (b) b.click(); }
    });
    const zoom = (z, p) => commit(fam.zoomAt(ctx.model, s, z, p));
    zin.addEventListener('click', () => zoom(ctx.model.z + 1));
    zout.addEventListener('click', () => zoom(ctx.model.z - 1));
    const local = (e) => { const r = port.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    port.addEventListener('wheel', (e) => {
      if (!s.wheel) return;
      e.preventDefault(); zoom(ctx.model.z + fam.wheelSteps(e.deltaY), local(e));
    }, { passive: false });
    port.addEventListener('dblclick', (e) => { if (s.scenario === 'zoomto' && !e.target.closest('button')) zoom(ctx.model.z + 1, local(e)); });
    let drag = null;
    port.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('button') || e.target.closest('.mpe-zoom,.mpe-tools')) return;
      e.preventDefault(); port.setPointerCapture(e.pointerId);
      const handle = ctx.model.tool === 'pan' ? null : e.target.closest('[data-waypoint]'), dropped = ctx.model.tool === 'pan' ? null : e.target.closest('[data-pin]');
      drag = { x: e.clientX, y: e.clientY, start: ctx.model, handle: handle ? Number(handle.dataset.waypoint) : null,
        pin: !!dropped, moved: false };
      if (ctx.model.searchOpen) commit({ ...ctx.model, searchOpen: false });
    });
    port.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) < 4) return;
      drag.moved = true;
      if (drag.handle !== null) {
        const wp = ctx.model.waypoints.slice(); wp[drag.handle] = fam.fromPort(ctx.model, local(e));
        commit({ ...ctx.model, waypoints: wp });
      } else if (drag.pin) commit({ ...ctx.model, pin: fam.fromPort(ctx.model, local(e)) });
      else commit(fam.panPx({ ...ctx.model, c: drag.start.c }, s, [dx, dy]));
    });
    port.addEventListener('pointerup', (e) => {
      if (!drag) return;
      const d = drag; drag = null;
      if (d.moved || ctx.model.tool === 'pan') return;
      const p = fam.fromPort(ctx.model, local(e));
      if (s.scenario === 'pin') commit({ ...ctx.model, pin: p });
      if (s.scenario === 'zone' && !ctx.model.closed) {
        if (ctx.model.vertices.length >= 3 && Math.hypot(...local(e).map((x, i) => x - coord(ctx.model.vertices[0])[i])) < 12) commit({ ...ctx.model, closed: true });
        else commit({ ...ctx.model, vertices: ctx.model.vertices.concat([p]) });
      }
    });
    port.addEventListener('pointercancel', () => { drag = null; });
    commit({ ...ctx.model, port: [W, H] });
    return {
      anchors: [root, port, top], sync: paint,
      locate(t) {
        if (t.search) return util.center(search);
        if (t.suggestion) return resultButtons[t.suggestion] ? util.center(resultButtons[t.suggestion]) : null;
        if (t.tool) return util.center(t.tool === 'pan' ? pan : edit);
        if (t.clear) return util.center(clear);
        if (t.closeZone) return util.center(close);
        if (t.zoom) return util.center(t.zoom === 'in' ? zin : zout);
        if (t.waypoint !== undefined) return util.center(handles[t.waypoint]);
        if (t.pin) return util.center(pin);
        const r = port.getBoundingClientRect(), base = [r.left, r.top];
        if (t.point) return fam.toPort(ctx.model, t.point).map((v, i) => v + base[i]);
        if (t.map) return [r.left + W / 2, r.top + H / 2];
        if (t.grab || t.release) {
          const D = fam.dragPx(ctx.model, s, t.grab || t.release), k = t.grab ? -.5 : .5;
          return [r.left + W / 2 + k * D[0], r.top + H / 2 + k * D[1]];
        }
        return null;
      },
    };
  }

  env.widget({
    task: 'pan-map',
    site: 'base',
    name: 'city',
    split: 'train',
    scenarios: ['marker', 'center', 'zoom', 'pin', 'route', 'zone', 'zoomto'],
    traits: { zoom: 'both' },

    render(ctx) {
      ensureStyle();
      ctxRef = ctx;
      const v = ['pin', 'route', 'zone', 'zoomto'].includes(ctx.spec.scenario) ? renderEditor(ctx) : render(ctx);
      view = v;
      return { anchors: v.anchors, sync: v.sync };
    },

    locate(t) {
      const p = view && view.locate(t);
      if (!p) throw new Error(`pan-map/city cannot locate ${JSON.stringify(t)} (variant ${ctxRef && ctxRef.spec.scenario})`);
      return p;
    },
  });
})();
