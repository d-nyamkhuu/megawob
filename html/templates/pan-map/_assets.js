/* pan-map/_assets: unchanged city palette, CSS and token defaults (shared template library). */
(function () {
  'use strict';

  const MAP_COLORS = { land: '#ece6d8', water: '#9fcbe8', park: '#bfdcae', street: '#ffffff', road: '#f7d58a', casing: '#c9a75a', transitRoad: '#e9a3a3', transitCasing: '#b55d5d', parkName: '#2f7a35', open: '#16824a', productLand: '#b7c5a4', productWater: '#66a9c9', productPark: '#76a55c', productRoad: '#e1cb91', editorLand: '#a4b594', editorRoad: '#e9d197', editorCasing: '#9a927b', droppedPin: '#c74439' };

  const TOKENS = {
    font: '12px/1.4 system-ui,sans-serif',
    panelWidth: 242,
    narrowPanelWidth: 190,
    mapColors: MAP_COLORS,
    css: `
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
  `,
    productCss: `
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
    `,
    editorCss: `
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
    `,
    icons: {
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
  },
    tierColors: { 1: '#d9480f', 2: '#1971c2', 3: '#6741d9' },
    venueColor: '#c2255c',
    editorPinColor: '#587d71',
    brand: 'Wayline',
    maxWidth: 1260,
    maxHeight: 780,
    widthInset: 20,
    heightInset: 16,
    narrowWidth: 760,
    minMapWidth: 260,
    maxMapWidth: 1000,
    minMapHeight: 180,
    mapHeaderHeight: 33,
    explorerSearch: 'Search this map',
    editorSearch: 'Search places or addresses',
    categories: { all: 'All places', food: 'Food', landmarks: 'Landmarks' },
    editorTitles: { pin: 'Saved location', route: 'Route planner', zone: 'Delivery zones', zoomto: 'Explore the map' },
    editorHints: { pin: 'Personal collection / Synced to this device', route: 'Operations itinerary / Local road survey', zone: 'Courier coverage / Operations team', zoomto: 'Survey view / North up / Local coordinates' },
    editLabels: { pin: 'Drop pin', route: 'Edit route', zone: 'Draw zone', zoomto: 'Explore' },
    attributions: ['Map data: city survey', 'Tiles: open street data', 'Cartography: local GIS office'],
    infoActions: ['Save', 'Share', 'Nearby'],
    roadWidths: [0, 2, 3, 4, 6, 8, 10],
    streetWidths: [0, 0, 1, 1.5, 2.5, 4, 6],
  };

  env.template('pan-map/_assets', () => ({ MAP_COLORS, TOKENS }));
})();
