/* read-figure/_styles: shared template implementation; design parts stay on the calling template. */
(function () {
  'use strict';
  const referenceCSS = `
      .up-panel { position: absolute; left: 0; top: 0; display: flex; flex-direction: column; background: var(--panel);
        border: 1px solid var(--line); border-radius: var(--up-r, 12px); overflow: hidden; transform-origin: 0 0;
        box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 10px 28px rgba(0,0,0,.07); }
      .up-head { flex: none; display: flex; align-items: center; gap: 10px; height: 50px; padding: 0 18px;
        border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
      .up-badge { width: 26px; height: 26px; border-radius: 7px; display: grid; place-items: center;
        background: color-mix(in srgb, var(--accent) 15%, var(--panel)); color: var(--accent); }
      .up-badge svg { width: 16px; height: 16px; }
      .up-title { font-weight: 700; font-size: 15px; white-space: nowrap; }
      .up-meta { margin-left: auto; font-size: 12.5px; color: var(--muted); white-space: nowrap; }
      .up-body { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 20px 24px; }
      .up-row { display: flex; align-items: center; gap: 18px; }
      .up-hint { font-size: 13px; color: var(--muted); text-align: center; }
      .up-label { font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
      .up-result { flex: none; display: flex; align-items: center; gap: 12px; height: 44px; padding: 0 18px; border-top: 1px solid var(--line);
        background: color-mix(in srgb, var(--accent) 7%, var(--panel)); font-size: 13.5px; }
      .up-result button:disabled { opacity: .45; cursor: default; }
      .up-result.bad { background: color-mix(in srgb, #e03131 9%, var(--panel)); }
      .up-result-text { display: grid; }
      .up-result-text > span { grid-area: 1 / 1; }
      .up-result-size { visibility: hidden; }
      .up-result button { margin-left: auto; height: 30px; padding: 0 14px; border-radius: 6px; font: inherit; font-weight: 650; cursor: pointer;
        border: 1px solid color-mix(in srgb, var(--fg) 25%, var(--line)); background: var(--panel); color: var(--fg); }

      .up-swatches { display: grid; }
      .up-sw { cursor: pointer; border: 1px solid color-mix(in srgb, var(--fg) 30%, transparent); box-shadow: inset 0 0 0 1px rgba(255,255,255,.18); }
      .up-sw:hover { transform: translateY(-1px); box-shadow: 0 3px 8px rgba(0,0,0,.15); }
      .up-sw[data-clicked] { outline: 3px solid var(--accent); outline-offset: 3px; }
      .up-sample { display: flex; flex-direction: column; align-items: center; gap: 8px; padding-right: 22px; border-right: 1px solid var(--line); }
      .up-sample div { border: 1px solid color-mix(in srgb, var(--fg) 30%, transparent); }

      .up-tiles { display: grid; }
      .up-tile { position: relative; cursor: pointer; border-radius: 6px; border: 1px solid rgba(0,0,0,.15); }
      .up-tile .ck { position: absolute; right: 5px; top: 5px; width: 20px; height: 20px; border-radius: 50%; display: none;
        background: #fff; color: #1d2330; box-shadow: 0 1px 3px rgba(0,0,0,.35); align-items: center; justify-content: center; }
      .up-tile .ck svg { width: 13px; height: 13px; }
      .up-tile[aria-checked="true"] { outline: 3px solid var(--fg); outline-offset: 2px; }
      .up-tile[aria-checked="true"] .ck { display: flex; }

      .up-board { display: block; border: 1px solid var(--line); border-radius: 8px; background: #fbfaf7; }
      .up-board .gl { stroke: #e7e4dc; stroke-width: 1; }
      .up-item { cursor: pointer; }
      .up-item .hit { fill: transparent; }
      .up-item:hover .hit { fill: rgba(0,0,0,.05); }
      .up-item[data-clicked] .hit { fill: rgba(0,0,0,.08); stroke: #555; stroke-dasharray: 4 3; }
      .up-glyph { font-weight: 700; text-anchor: middle; dominant-baseline: central; pointer-events: none;
        font-family: "DejaVu Sans", Verdana, system-ui, sans-serif; }
      .up-sym { text-anchor: middle; dominant-baseline: central; pointer-events: none; font-weight: 400;
        font-family: "DejaVu Sans", sans-serif; font-variant-emoji: text; }
      .up-emoji { text-anchor: middle; dominant-baseline: central; pointer-events: none; font-weight: 400;
        font-family: "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif; font-variant-emoji: emoji; }
      .up-low .up-emoji, .up-emoji.low { opacity: .5; }
      .up-board.up-low .gl { stroke: #cfcac0; }
      .up-sclist.up-low { background: var(--up-lowboard); color: #5f5c56; }
      .up-sclist.up-low .up-scrow { border-bottom-color: #ccc7bd; }
      .up-sclist.up-low .up-scrow:nth-child(even) { background: color-mix(in srgb, #000 3%, var(--up-lowboard)); }
      .up-sclist.up-low .up-scrow .meta { color: #77736c; }
      .up-fig { pointer-events: none; }

      .up-opts { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
      .up-opt { min-width: 64px; height: 38px; padding: 0 16px; border-radius: 7px; font: inherit; font-size: 15px; font-weight: 600; cursor: pointer;
        border: 1px solid color-mix(in srgb, var(--fg) 20%, var(--line)); color: var(--fg); background: color-mix(in srgb, var(--fg) 4%, var(--panel)); }
      .up-opt:hover { background: color-mix(in srgb, var(--fg) 9%, var(--panel)); }
      .up-opt[data-clicked] { background: var(--accent); border-color: var(--accent); color: #fff; }
      .up-field { display: flex; align-items: center; gap: 10px; }
      .up-input { width: 120px; height: 40px; padding: 0 12px; border-radius: 7px; font: inherit; font-size: 18px; font-weight: 600;
        border: 1px solid color-mix(in srgb, var(--fg) 25%, var(--line)); background: var(--panel); color: var(--fg); outline: none;
        user-select: text; -webkit-user-select: text; caret-color: var(--accent); }
      .up-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent); }

      .up-cards { display: flex; }
      .up-card { position: relative; cursor: pointer; border-radius: 10px; border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line));
        background: #fff; color: #1d2330; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,.10); font-weight: 700; }
      .up-card .corner { position: absolute; left: 8px; top: 6px; font-size: 13px; }
      .up-card .corner.br { left: auto; top: auto; right: 8px; bottom: 6px; transform: rotate(180deg); }
      .up-card.down { background: repeating-linear-gradient(45deg, var(--accent) 0 7px, color-mix(in srgb, var(--accent) 70%, #fff) 7px 14px);
        border: 5px solid #fff; outline: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); }
      .up-card.down > * { display: none; }
      .up-card.sel { box-shadow: 0 0 0 3px var(--panel), 0 0 0 6px var(--accent); }

      .up-plane { display: block; overflow: visible; }
      .up-plane .ax { stroke: var(--fg); stroke-width: 1.6; }
      .up-plane .gl { stroke: color-mix(in srgb, var(--fg) 10%, transparent); stroke-width: 1; }
      .up-plane .tk { fill: var(--muted); font-size: 13px; text-anchor: middle; dominant-baseline: central; pointer-events: none; }
      .up-plane .axn { fill: var(--fg); font-size: 15px; font-style: italic; font-weight: 600; text-anchor: middle; dominant-baseline: central; pointer-events: none; }
      .up-dot { cursor: pointer; }
      .up-dot .hit { fill: transparent; }
      .up-dot .pt { fill: var(--up-dot, #1c63d6); stroke: color-mix(in srgb, var(--fg) 70%, transparent); stroke-width: 1; pointer-events: none; }
      .up-dot:hover .pt { r: 8px; }
      .up-dot[data-clicked] .pt { fill: var(--accent); r: 8px; }

      .up-group { display: grid; gap: 5px; padding: 12px; border: 1.5px dashed color-mix(in srgb, var(--fg) 28%, var(--line)); border-radius: 9px; }
      .up-block { border-radius: 3px; background: var(--up-block, #1c63d6); box-shadow: inset 0 -2px 0 rgba(0,0,0,.2); }
      .up-op { font-size: 30px; font-weight: 700; color: var(--muted); }

      .up-field2d { position: relative; border: 1px solid var(--line); border-radius: 10px;
        background: color-mix(in srgb, var(--fg) 2.5%, var(--panel)); }
      .up-num { position: absolute; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 8px;
        font-size: 19px; font-weight: 700; color: var(--fg); background: var(--panel); border: 1.5px solid color-mix(in srgb, var(--fg) 35%, var(--line));
        box-shadow: 0 1px 3px rgba(0,0,0,.1); }
      .up-num:hover { border-color: var(--accent); }
      .up-num.masked { background: color-mix(in srgb, var(--fg) 12%, var(--panel)); }
      .up-num.gone { visibility: hidden; }
      .up-num.bad { border-color: #e03131; background: color-mix(in srgb, #e03131 14%, var(--panel)); }

      .up-cbgrid { display: grid; gap: 8px; padding: 14px; border: 1px solid var(--line); border-radius: 9px; }
      .up-cbgrid input { width: 24px; height: 24px; margin: 0; accent-color: var(--accent); cursor: pointer; }
      .up-example { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 14px 16px; border-radius: 9px;
        background: color-mix(in srgb, var(--fg) 4%, var(--panel)); border: 1px solid var(--line); }
      .up-exgrid { display: grid; gap: 4px; }
      .up-exgrid i { width: 14px; height: 14px; border-radius: 3px; border: 1.5px solid color-mix(in srgb, var(--fg) 40%, var(--line)); }
      .up-exgrid i.on { background: var(--fg); border-color: var(--fg); }

      .up-sc { display: flex; gap: 6px; align-items: stretch; }
      .up-sclist { overflow-y: auto; scrollbar-width: none; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); }
      .up-sclist::-webkit-scrollbar { display: none; }
      .up-scrow { display: flex; align-items: center; gap: 10px; padding: 0 12px; border-bottom: 1px solid color-mix(in srgb, var(--line) 70%, transparent);
        font-size: 13.5px; white-space: nowrap; }
      .up-scrow:nth-child(even) { background: color-mix(in srgb, var(--fg) 2.5%, var(--panel)); }
      .up-scrow svg { flex: none; }
      .up-scrow .lbl { overflow: hidden; text-overflow: ellipsis; flex: 1; }
      .up-scrow .meta { color: var(--muted); font-size: 12px; }
      .up-sctrack { position: relative; width: 12px; border-radius: 6px; background: color-mix(in srgb, var(--fg) 7%, var(--panel)); }
      .up-scthumb { position: absolute; left: 2px; right: 2px; border-radius: 4px; background: color-mix(in srgb, var(--fg) 35%, var(--panel)); cursor: grab; }
      `;
  const shadesCSS = `
  .up-panel { position: absolute; left: 0; top: 0; display: flex; flex-direction: column; background: var(--panel);
    border: 1px solid var(--line); border-radius: var(--up-r, 12px); overflow: hidden; transform-origin: 0 0;
    box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 10px 28px rgba(0,0,0,.07); }
  .up-head { flex: none; display: flex; align-items: center; gap: 10px; height: 50px; padding: 0 18px;
    border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
  .up-badge { width: 26px; height: 26px; border-radius: 7px; display: grid; place-items: center;
    background: color-mix(in srgb, var(--accent) 15%, var(--panel)); color: var(--accent); }
  .up-badge svg { width: 16px; height: 16px; }
  .up-title { font-weight: 700; font-size: 15px; white-space: nowrap; }
  .up-meta { margin-left: auto; font-size: 12.5px; color: var(--muted); white-space: nowrap; }
  .up-body { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 20px 24px; }
  .up-row { display: flex; align-items: center; gap: 18px; }
  .up-hint { font-size: 13px; color: var(--muted); text-align: center; }
  .up-label { font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
  .up-result { flex: none; display: flex; align-items: center; gap: 12px; height: 44px; padding: 0 18px; border-top: 1px solid var(--line);
    background: color-mix(in srgb, var(--accent) 7%, var(--panel)); font-size: 13.5px; }
  .up-result button:disabled { opacity: .45; cursor: default; }
  .up-result.bad { background: color-mix(in srgb, #e03131 9%, var(--panel)); }
  .up-result-text { display: grid; }
  .up-result-text > span { grid-area: 1 / 1; }
  .up-result-size { visibility: hidden; }
  .up-result button { margin-left: auto; height: 30px; padding: 0 14px; border-radius: 6px; font: inherit; font-weight: 650; cursor: pointer;
    border: 1px solid color-mix(in srgb, var(--fg) 25%, var(--line)); background: var(--panel); color: var(--fg); }

  .up-swatches { display: grid; }
  .up-sw { cursor: pointer; border: 1px solid color-mix(in srgb, var(--fg) 30%, transparent); box-shadow: inset 0 0 0 1px rgba(255,255,255,.18); }
  .up-sw:hover { transform: translateY(-1px); box-shadow: 0 3px 8px rgba(0,0,0,.15); }
  .up-sw[data-clicked] { outline: 3px solid var(--accent); outline-offset: 3px; }
  .up-sample { display: flex; flex-direction: column; align-items: center; gap: 8px; padding-right: 22px; border-right: 1px solid var(--line); }
  .up-sample div { border: 1px solid color-mix(in srgb, var(--fg) 30%, transparent); }

  .up-tiles { display: grid; }
  .up-tile { position: relative; cursor: pointer; border-radius: 6px; border: 1px solid rgba(0,0,0,.15); }
  .up-tile .ck { position: absolute; right: 5px; top: 5px; width: 20px; height: 20px; border-radius: 50%; display: none;
    background: #fff; color: #1d2330; box-shadow: 0 1px 3px rgba(0,0,0,.35); align-items: center; justify-content: center; }
  .up-tile .ck svg { width: 13px; height: 13px; }
  .up-tile[aria-checked="true"] { outline: 3px solid var(--fg); outline-offset: 2px; }
  .up-tile[aria-checked="true"] .ck { display: flex; }

  .up-board { display: block; border: 1px solid var(--line); border-radius: 8px; background: #fbfaf7; }
  .up-board .gl { stroke: #e7e4dc; stroke-width: 1; }
  .up-item { cursor: pointer; }
  .up-item .hit { fill: transparent; }
  .up-item:hover .hit { fill: rgba(0,0,0,.05); }
  .up-item[data-clicked] .hit { fill: rgba(0,0,0,.08); stroke: #555; stroke-dasharray: 4 3; }
  .up-glyph { font-weight: 700; text-anchor: middle; dominant-baseline: central; pointer-events: none;
    font-family: "DejaVu Sans", Verdana, system-ui, sans-serif; }
  .up-fig { pointer-events: none; }

  .up-opts { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
  .up-opt { min-width: 64px; height: 38px; padding: 0 16px; border-radius: 7px; font: inherit; font-size: 15px; font-weight: 600; cursor: pointer;
    border: 1px solid color-mix(in srgb, var(--fg) 20%, var(--line)); color: var(--fg); background: color-mix(in srgb, var(--fg) 4%, var(--panel)); }
  .up-opt:hover { background: color-mix(in srgb, var(--fg) 9%, var(--panel)); }
  .up-opt[data-clicked] { background: var(--accent); border-color: var(--accent); color: #fff; }
  .up-field { display: flex; align-items: center; gap: 10px; }
  .up-input { width: 120px; height: 40px; padding: 0 12px; border-radius: 7px; font: inherit; font-size: 18px; font-weight: 600;
    border: 1px solid color-mix(in srgb, var(--fg) 25%, var(--line)); background: var(--panel); color: var(--fg); outline: none;
    user-select: text; -webkit-user-select: text; caret-color: var(--accent); }
  .up-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent); }

  .up-cards { display: flex; }
  .up-card { position: relative; cursor: pointer; border-radius: 10px; border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line));
    background: #fff; color: #1d2330; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 6px rgba(0,0,0,.10); font-weight: 700; }
  .up-card .corner { position: absolute; left: 8px; top: 6px; font-size: 13px; }
  .up-card .corner.br { left: auto; top: auto; right: 8px; bottom: 6px; transform: rotate(180deg); }
  .up-card.down { background: repeating-linear-gradient(45deg, var(--accent) 0 7px, color-mix(in srgb, var(--accent) 70%, #fff) 7px 14px);
    border: 5px solid #fff; outline: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); }
  .up-card.down > * { display: none; }
  .up-card.sel { box-shadow: 0 0 0 3px var(--panel), 0 0 0 6px var(--accent); }

  .up-plane { display: block; overflow: visible; }
  .up-plane .ax { stroke: var(--fg); stroke-width: 1.6; }
  .up-plane .gl { stroke: color-mix(in srgb, var(--fg) 10%, transparent); stroke-width: 1; }
  .up-plane .tk { fill: var(--muted); font-size: 13px; text-anchor: middle; dominant-baseline: central; pointer-events: none; }
  .up-plane .axn { fill: var(--fg); font-size: 15px; font-style: italic; font-weight: 600; text-anchor: middle; dominant-baseline: central; pointer-events: none; }
  .up-dot { cursor: pointer; }
  .up-dot .hit { fill: transparent; }
  .up-dot .pt { fill: var(--up-dot, #1c63d6); stroke: color-mix(in srgb, var(--fg) 70%, transparent); stroke-width: 1; pointer-events: none; }
  .up-dot:hover .pt { r: 8px; }
  .up-dot[data-clicked] .pt { fill: var(--accent); r: 8px; }

  .up-group { display: grid; gap: 5px; padding: 12px; border: 1.5px dashed color-mix(in srgb, var(--fg) 28%, var(--line)); border-radius: 9px; }
  .up-block { border-radius: 3px; background: var(--up-block, #1c63d6); box-shadow: inset 0 -2px 0 rgba(0,0,0,.2); }
  .up-op { font-size: 30px; font-weight: 700; color: var(--muted); }

  .up-field2d { position: relative; border: 1px solid var(--line); border-radius: 10px;
    background: color-mix(in srgb, var(--fg) 2.5%, var(--panel)); }
  .up-num { position: absolute; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 8px;
    font-size: 19px; font-weight: 700; color: var(--fg); background: var(--panel); border: 1.5px solid color-mix(in srgb, var(--fg) 35%, var(--line));
    box-shadow: 0 1px 3px rgba(0,0,0,.1); }
  .up-num:hover { border-color: var(--accent); }
  .up-num.masked { background: color-mix(in srgb, var(--fg) 12%, var(--panel)); }
  .up-num.gone { visibility: hidden; }
  .up-num.bad { border-color: #e03131; background: color-mix(in srgb, #e03131 14%, var(--panel)); }

  .up-cbgrid { display: grid; gap: 8px; padding: 14px; border: 1px solid var(--line); border-radius: 9px; }
  .up-cbgrid input { width: 24px; height: 24px; margin: 0; accent-color: var(--accent); cursor: pointer; }
  .up-example { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 14px 16px; border-radius: 9px;
    background: color-mix(in srgb, var(--fg) 4%, var(--panel)); border: 1px solid var(--line); }
  .up-exgrid { display: grid; gap: 4px; }
  .up-exgrid i { width: 14px; height: 14px; border-radius: 3px; border: 1.5px solid color-mix(in srgb, var(--fg) 40%, var(--line)); }
  .up-exgrid i.on { background: var(--fg); border-color: var(--fg); }

  .up-sc { display: flex; gap: 6px; align-items: stretch; }
  .up-sclist { overflow-y: auto; scrollbar-width: none; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); }
  .up-sclist::-webkit-scrollbar { display: none; }
  .up-scrow { display: flex; align-items: center; gap: 10px; padding: 0 12px; border-bottom: 1px solid color-mix(in srgb, var(--line) 70%, transparent);
    font-size: 13.5px; white-space: nowrap; }
  .up-scrow:nth-child(even) { background: color-mix(in srgb, var(--fg) 2.5%, var(--panel)); }
  .up-scrow svg { flex: none; }
  .up-scrow .lbl { overflow: hidden; text-overflow: ellipsis; flex: 1; }
  .up-scrow .meta { color: var(--muted); font-size: 12px; }
  .up-sctrack { position: relative; width: 12px; border-radius: 6px; background: color-mix(in srgb, var(--fg) 7%, var(--panel)); }
  .up-scthumb { position: absolute; left: 2px; right: 2px; border-radius: 4px; background: color-mix(in srgb, var(--fg) 35%, var(--panel)); cursor: grab; }
  `;
  env.template('read-figure/_styles', () => ({ referenceCSS, shadesCSS }));
})();
