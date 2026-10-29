// crop-image/_base-assets: byte-identical reference CSS and editor placement.
// The base template keeps the CSS and placeIn override units; placement preserves each widget's DOM read order.
(function () {
  'use strict';

  const BOX_CSS = `
      .cr-wrap { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 14px; }
      .cr-frame { position: relative; flex: none; box-shadow: 0 4px 18px rgba(0,0,0,.18); border-radius: 2px; touch-action: none; }
      .cr-frame canvas { display: block; }
      .cr-dim { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
      .cr-hole { position: absolute; box-shadow: 0 0 0 4000px rgba(0,0,0,.5); }
      .cr-frame.empty .cr-hole { box-shadow: none; }
      .cr-target {
        position: absolute; pointer-events: none; box-sizing: border-box;
        border: 2px dashed #fff; outline: 1px solid rgba(0,0,0,.55); outline-offset: 0;
        box-shadow: inset 0 0 0 1px rgba(0,0,0,.55);
      }
      .cr-box { position: absolute; outline: 1px solid rgba(255,255,255,.95); box-shadow: 0 0 0 1px rgba(0,0,0,.35); cursor: move; touch-action: none; }
      .cr-box:focus { outline: 2px solid var(--accent); }
      .cr-grid { position: absolute; inset: 0; pointer-events: none; }
      .cr-grid::before, .cr-grid::after { content: ""; position: absolute; border: 0 dashed rgba(255,255,255,.55); }
      .cr-grid::before { left: 33.33%; right: 33.33%; top: 0; bottom: 0; border-left-width: 1px; border-right-width: 1px; }
      .cr-grid::after { top: 33.33%; bottom: 33.33%; left: 0; right: 0; border-top-width: 1px; border-bottom-width: 1px; }
      .cr-handle {
        position: absolute; width: 12px; height: 12px; margin: -6px 0 0 -6px;
        background: var(--accent); border: 1.5px solid #fff; border-radius: 2px;
        box-shadow: 0 1px 3px rgba(0,0,0,.35);
      }
      .cr-handle[data-role="handle-nw"], .cr-handle[data-role="handle-se"] { cursor: nwse-resize; }
      .cr-handle[data-role="handle-ne"], .cr-handle[data-role="handle-sw"] { cursor: nesw-resize; }
      .cr-handle[data-role="handle-n"], .cr-handle[data-role="handle-s"] { cursor: ns-resize; }
      .cr-handle[data-role="handle-e"], .cr-handle[data-role="handle-w"] { cursor: ew-resize; }
      .cr-locked .cr-handle[data-role="handle-n"], .cr-locked .cr-handle[data-role="handle-s"],
      .cr-locked .cr-handle[data-role="handle-e"], .cr-locked .cr-handle[data-role="handle-w"] { display: none; }
      .cr-row { display: flex; gap: 12px; align-items: flex-start; }
      .cr-view { position: relative; overflow: hidden; flex: none; box-shadow: 0 4px 18px rgba(0,0,0,.18); border-radius: 2px; }
      .cr-view .cr-frame { box-shadow: none; }
      .cr-side { display: flex; flex-direction: column; gap: 4px; flex: none; }
      .cr-nav { position: relative; border: 1px solid var(--line); border-radius: 3px; cursor: crosshair; touch-action: none; overflow: hidden; }
      .cr-nav canvas { display: block; opacity: .85; }
      .cr-navwin { position: absolute; box-sizing: border-box; border: 2px solid var(--accent); background: color-mix(in srgb, var(--accent) 18%, transparent); pointer-events: none; }
      .cr-navcap { font-size: 12px; color: var(--muted); }
      .cr-readout { color: var(--muted); font-size: 14px; font-variant-numeric: tabular-nums; }
      .cr-tools { display: flex; align-items: center; gap: 6px; flex-wrap: nowrap; }
      .cr-chip { padding: 4px 9px; border-radius: 6px; border: 1px solid var(--line); background: var(--panel); color: var(--fg); font-size: 13px; cursor: pointer; }
      .cr-chip.on { background: var(--accent); border-color: var(--accent); color: #fff; }
      .cr-sep { width: 14px; }
      .cr-apply { padding: 5px 12px; border-radius: 6px; border: 1px solid color-mix(in srgb, var(--accent) 60%, var(--line)); background: color-mix(in srgb, var(--accent) 12%, var(--panel)); color: var(--fg); font-weight: 650; font-size: 13px; cursor: pointer; }
      .cr-badge { font-size: 12px; color: #2f9e44; font-weight: 650; min-width: 64px; }
      `;

  function placeEditor(ctx, el, rng, pad = 8) {
        const SW = ctx.size.width;
        const SH = ctx.size.height;
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const freeX = Math.max(0, SW - w - 2 * pad);
        const freeY = Math.max(0, SH - h - 2 * pad);
        const c01 = (f) => Math.min(1, Math.max(0, f));
        const fx = c01(rng.pick([0, 0.5, 0.5, 1]) + rng.float(-0.15, 0.15));
        const fy = c01(rng.pick([0, 0.5, 0.5, 1]) + rng.float(-0.15, 0.15));
        const st = ctx.stage.getBoundingClientRect();
        const fixed = [...document.querySelectorAll('[data-role="submit"]')]
          .filter((b) => getComputedStyle(b).position === 'fixed').map((b) => b.getBoundingClientRect());
        const hits = (x, y) => fixed.some((r) => st.left + x < r.right + 6 && st.left + x + w > r.left - 6 && st.top + y < r.bottom + 6 && st.top + y + h > r.top - 6);
        let [x, y] = [pad + fx * freeX, pad + fy * freeY];
        for (const [ax, ay] of [[fx, fy], [fx, 0], [0, fy], [0, 0], [1, 0], [0, 1], [0.5, 0]]) {
          if (!hits(pad + ax * freeX, pad + ay * freeY)) {
            [x, y] = [pad + ax * freeX, pad + ay * freeY];
            break;
          }
        }
        el.style.left = Math.round(x) + 'px';
        el.style.top = Math.round(y) + 'px';
      }

  const CORNERS_CSS = `
      .cc-editor {
        position: absolute; display: flex; gap: 0; border-radius: 10px; overflow: hidden;
        background: #18191c; color: #d7dae0;
        box-shadow: 0 12px 34px rgba(0,0,0,.35);
        font: 13px/1.4 system-ui, sans-serif;
      }
      .cc-canvas { padding: 18px; background: #101113; display: flex; align-items: center; justify-content: center; }
      .cc-frame { position: relative; flex: none; border: 1px solid #000; }
      .cc-frame svg { display: block; }
      .cc-wash { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
      .cc-hole { position: absolute; box-shadow: 0 0 0 4000px rgba(236,238,242,.58); }
      .cc-target { position: absolute; pointer-events: none; border: 2px dashed #ffb000; box-shadow: 0 0 0 1px rgba(0,0,0,.6); }
      .cc-box { position: absolute; border: 2px solid #fff; cursor: grab; box-shadow: 0 0 0 1px rgba(0,0,0,.45); outline: none; }
      .cc-box:focus { border-color: #3d8bfd; }
      .cc-box svg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
      .cc-knob {
        position: absolute; width: 18px; height: 18px; margin: -9px 0 0 -9px; border-radius: 50%;
        background: #fff; border: 3px solid #3d8bfd; box-shadow: 0 1px 4px rgba(0,0,0,.5);
      }
      .cc-knob.nw, .cc-knob.se { cursor: nwse-resize; }
      .cc-knob.ne, .cc-knob.sw { cursor: nesw-resize; }
      .cc-side { width: 170px; padding: 16px 14px; display: flex; flex-direction: column; gap: 10px; background: #1f2125; }
      .cc-side h4 { margin: 0 0 2px; font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: #8b919c; }
      .cc-presets { display: flex; flex-wrap: wrap; gap: 6px; }
      .cc-presets span { padding: 3px 8px; border-radius: 12px; background: #2c2f35; color: #aab0ba; font-size: 12px; cursor: pointer; }
      .cc-presets span.on { background: #3d8bfd; color: #fff; }
      .cc-field { display: flex; justify-content: space-between; padding: 5px 8px; border-radius: 5px; background: #2a2d33; font-variant-numeric: tabular-nums; }
      .cc-field em { font-style: normal; color: #8b919c; }
      .cc-apply { margin-top: 4px; padding: 7px 10px; border: 0; border-radius: 6px; background: #3d8bfd; color: #fff; font-weight: 650; cursor: pointer; }
      .cc-state { font-size: 12px; color: #69db7c; min-height: 16px; }
      `;

  const CROPPER_CSS = `
      .cp-wrap { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 12px; }
      .cp-host { position: relative; flex: none; box-shadow: 0 4px 18px rgba(0,0,0,.2); background: #222; }
      .cp-host img { display: block; max-width: 100%; }
      .cp-host .cropper-container, .cp-host .cropper-container * { transition: none !important; animation: none !important; }
      .cp-host .cropper-modal { opacity: .55; }
      .cp-host .cropper-point { width: 8px; height: 8px; opacity: 1; background-color: #fff; border: 1.5px solid #39f; box-sizing: border-box; border-radius: 50%; }
      .cp-host .cropper-point.point-e { right: -4px; margin-top: -4px; }
      .cp-host .cropper-point.point-n { top: -4px; margin-left: -4px; }
      .cp-host .cropper-point.point-w { left: -4px; margin-top: -4px; }
      .cp-host .cropper-point.point-s { bottom: -4px; margin-left: -4px; }
      .cp-host .cropper-point.point-ne { top: -4px; right: -4px; }
      .cp-host .cropper-point.point-nw { top: -4px; left: -4px; }
      .cp-host .cropper-point.point-sw { bottom: -4px; left: -4px; }
      .cp-host .cropper-point.point-se { bottom: -4px; right: -4px; width: 8px; height: 8px; opacity: 1; }
      .cp-host .cropper-point.point-se::before { display: none; }
      .cp-target { position: absolute; z-index: 10; pointer-events: none; box-sizing: border-box; border: 2px dashed #ffd43b; box-shadow: 0 0 0 1px rgba(0,0,0,.6); }
      .cp-tools { display: flex; align-items: center; gap: 6px; flex-wrap: nowrap; }
      .cp-chip { padding: 4px 9px; border-radius: 6px; border: 1px solid var(--line); background: var(--panel); color: var(--fg); font-size: 13px; cursor: pointer; }
      .cp-chip.on { background: var(--accent); border-color: var(--accent); color: #fff; }
      .cp-sep { width: 14px; }
      .cp-apply { padding: 5px 12px; border-radius: 6px; border: 1px solid color-mix(in srgb, var(--accent) 60%, var(--line)); background: color-mix(in srgb, var(--accent) 12%, var(--panel)); color: var(--fg); font-weight: 650; font-size: 13px; cursor: pointer; }
      .cp-badge { font-size: 12px; color: #2f9e44; font-weight: 650; min-width: 64px; }
      .cp-readout { color: var(--muted); font-size: 14px; font-variant-numeric: tabular-nums; }
      `;

  function placeCropper(ctx, el, rng, pad = 8) {
        const SW = ctx.size.width;
        const SH = ctx.size.height;
        const freeX = Math.max(0, SW - el.offsetWidth - 2 * pad);
        const freeY = Math.max(0, SH - el.offsetHeight - 2 * pad);
        const c01 = (f) => Math.min(1, Math.max(0, f));
        const fx = c01(rng.pick([0, 0.5, 0.5, 1]) + rng.float(-0.15, 0.15));
        const fy = c01(rng.pick([0, 0.5, 0.5, 1]) + rng.float(-0.15, 0.15));
        const st = ctx.stage.getBoundingClientRect();
        const fixed = [...document.querySelectorAll('[data-role="submit"]')]
          .filter((b) => getComputedStyle(b).position === 'fixed').map((b) => b.getBoundingClientRect());
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const hits = (x, y) => fixed.some((r) => st.left + x < r.right + 6 && st.left + x + w > r.left - 6 && st.top + y < r.bottom + 6 && st.top + y + h > r.top - 6);
        let [x, y] = [pad + fx * freeX, pad + fy * freeY];
        for (const [ax, ay] of [[fx, fy], [fx, 0], [0, fy], [0, 0], [1, 0], [0, 1], [0.5, 0]]) {
          if (!hits(pad + ax * freeX, pad + ay * freeY)) {
            [x, y] = [pad + ax * freeX, pad + ay * freeY];
            break;
          }
        }
        el.style.left = Math.round(x) + 'px';
        el.style.top = Math.round(y) + 'px';
      }

  function ensureStyle(id, css) {
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = css;
    document.head.append(s);
  }

  env.template('crop-image/_base-assets', () => ({ BOX_CSS, CORNERS_CSS, CROPPER_CSS, placeEditor, placeCropper, ensureStyle }));
})();
