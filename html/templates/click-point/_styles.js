/* click-point/_styles: unchanged default styles of the reference board, CAD view and map. */
(function () {
  'use strict';
  const REFERENCE_CSS = `
      .cp-wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; }
      .cp-board {
        border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: var(--panel);
        box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 6px 20px rgba(0,0,0,.07);
      }
      .cp-board svg { display: block; cursor: crosshair; touch-action: none; }
      .cp-board svg .cp-fig, .cp-board svg .cp-mark { pointer-events: none; }
      .cp-hint { font-size: 13px; color: var(--muted); display: flex; align-items: center; gap: 8px; }
      .cp-hint svg { flex: none; }
      .cp-pos { margin-left: 6px; min-width: 150px; font-variant-numeric: tabular-nums; color: var(--fg); }
      .cp-label { font: 700 16px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; fill: var(--fg);
        paint-order: stroke; stroke: var(--panel); stroke-width: 4px; stroke-linejoin: round; }
      .cp-label.serif { font: italic 700 18px Georgia, "Times New Roman", "Liberation Serif", serif; }
      .cp-tick { font: 12px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; fill: var(--fg); }
      .cp-tick.muted { fill: var(--muted); font-style: italic; }
      .cp-tick.ruler { fill: #222; font-size: 11px; }
      .cp-tick.axis { font-weight: 600; fill: var(--muted); }
      .cp-tick.map { font-weight: 600; fill: #2b3440; paint-order: stroke; stroke: rgba(255,255,255,.75); stroke-width: 3px; }
      .cp-tick.street { font: 600 11px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; fill: #3b4048;
                        paint-order: stroke; stroke: rgba(255,255,255,.85); stroke-width: 3px; }
      .cp-tick.dense { font-size: 10px; fill: var(--muted); }
      .cp-cad { --panel: #11151b; --line: #2b3541; --fg: #d6dee8; --muted: #7d8996; --accent: #ffb000; display: inline-grid;
        grid-template-columns: 22px auto; grid-template-rows: 22px auto auto auto; background: #0b0e12; border: 1px solid #2b3541; border-radius: 6px;
        box-shadow: 0 8px 28px rgba(0,0,0,.35); color: var(--fg); font: 12px ui-monospace, Menlo, Consolas, "DejaVu Sans Mono", monospace; overflow: hidden; }
      .cp-cad .cp-board { border: 0; border-radius: 0; box-shadow: none; }
      .cp-cad .cp-ruler { display: block; background: #161b22; }
      .cp-cad .cp-corner { background: #161b22; border-right: 1px solid #2b3541; border-bottom: 1px solid #2b3541; }
      .cp-cad .cp-ruler text { font: 9px ui-monospace, Menlo, Consolas, monospace; fill: #8b97a4; }
      .cp-cad .cp-status { grid-column: 1 / 3; display: flex; justify-content: space-between; gap: 12px; padding: 4px 10px; background: #161b22;
        border-top: 1px solid #2b3541; color: #9fb0c0; }
      .cp-cad .cp-status b { color: var(--accent); font-weight: 600; }
      .cp-cad .cp-cmd { grid-column: 1 / 3; padding: 4px 10px 5px; background: #0b0e12; border-top: 1px solid #2b3541; color: #cfd8e3; }
      .cp-cad .cp-cmd i { color: var(--accent); font-style: normal; }
      .cp-tiles { display: flex; flex-direction: column; background: #f6f6f3; border: 1px solid #cfd3d8; border-radius: 10px; overflow: hidden;
        box-shadow: 0 1px 2px rgba(0,0,0,.08), 0 8px 24px rgba(0,0,0,.12); color: #28313b; }
      .cp-tiles .cp-board { border: 0; border-radius: 0; box-shadow: none; }
      .cp-tiles .cp-head { display: flex; align-items: center; gap: 10px; height: 40px; padding: 0 10px; background: #fff; border-bottom: 1px solid #dde0e4; font: 600 14px system-ui, sans-serif; }
      .cp-tiles .cp-search { flex: 1; height: 26px; border: 1px solid #d3d7dc; border-radius: 13px; padding: 0 12px; color: #8a949e; font: 13px/24px system-ui, sans-serif; background: #f4f5f7; }
      .cp-tiles .cp-zoom { display: flex; gap: 2px; }
      .cp-tiles .cp-zoom button { width: 26px; height: 26px; border: 1px solid #cfd3d8; border-radius: 6px; background: #fff; color: #28313b; font: 600 16px/1 system-ui, sans-serif; cursor: pointer; }
      .cp-tiles .cp-attrib { align-self: flex-end; padding: 2px 8px; font: 11px system-ui, sans-serif; color: #5d6772; background: rgba(255,255,255,.85); border-top-left-radius: 6px; }
      `;
  env.template('click-point/_styles', () => ({ REFERENCE_CSS }));
})();
