/* sort-into-bins/_styles: constant reference CSS, kept byte-identical for each renderer's CSS design hook. */
(function () {
  'use strict';
  env.template('sort-into-bins/_styles', () => ({
    board: `
      .bx-board {
        position: relative; flex: none; border-radius: 14px; background-color: var(--panel); overflow: hidden;
        box-shadow: 0 0 0 1px var(--line), 0 2px 6px rgba(0,0,0,.06); touch-action: none;
      }
      .bx-board.dots {
        background-image: radial-gradient(circle, color-mix(in srgb, var(--muted) 35%, transparent) 1.1px, transparent 1.6px);
      }
      .bx-box {
        position: absolute; z-index: 1; overflow: hidden; box-sizing: border-box;
        border: 2px dashed color-mix(in srgb, var(--accent) 55%, var(--line));
        background: color-mix(in srgb, var(--accent) 6%, var(--panel));
        transition: background-color .08s, border-color .08s;
      }
      .bx-box.solid { border-style: solid; }
      .bx-box.over { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 16%, var(--panel)); }
      .bx-label {
        display: flex; align-items: center; gap: 8px; padding: 0 12px; white-space: nowrap;
        font-size: 14px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--muted);
        border-bottom: 1px solid color-mix(in srgb, var(--accent) 25%, var(--line));
        background: color-mix(in srgb, var(--accent) 10%, var(--panel));
      }
      .bx-swatch { flex: none; width: 12px; height: 12px; border-radius: 3px; box-shadow: 0 0 0 1px rgba(0,0,0,.25); }
      .bx-item { position: absolute; z-index: 2; cursor: grab; touch-action: none; filter: drop-shadow(0 1px 1.5px rgba(0,0,0,.28)); }
      .bx-item svg { display: block; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
      .bx-item.dragging { z-index: 1000 !important; cursor: grabbing; filter: drop-shadow(0 7px 10px rgba(0,0,0,.32)); }

      .bx-pane { position: relative; overflow: hidden; flex: none; border-radius: 14px; box-shadow: 0 0 0 1px var(--line), 0 2px 6px rgba(0,0,0,.06); }
      .bx-pane .bx-board { box-shadow: none; border-radius: 0; margin: 0 !important; }
      .bx-sbar { position: absolute; right: 0; top: 0; bottom: 0; width: 14px; z-index: 5; background: color-mix(in srgb, var(--line) 60%, var(--panel)); }
      .bx-sthumb { position: absolute; left: 2px; right: 2px; border-radius: 5px; cursor: grab; touch-action: none;
        background: color-mix(in srgb, var(--muted) 70%, var(--panel)); }
      .bx-sthumb:hover, .bx-sthumb.on { background: var(--accent); }
      .bx-item.nat.dragging { opacity: .35; }
      .bx-board.reveal .bx-box { border-color: color-mix(in srgb, var(--accent) 22%, transparent); background: transparent; }
      .bx-board.reveal .bx-box.over { border-style: solid; border-color: var(--accent); background: color-mix(in srgb, var(--accent) 16%, var(--panel)); }
      .bx-board.reveal .bx-label { background: transparent; border-bottom-color: transparent; opacity: .55; }
      .bx-board.reveal .bx-box.over .bx-label { opacity: 1; background: color-mix(in srgb, var(--accent) 10%, var(--panel)); }

      .bx-desk { background: linear-gradient(160deg, color-mix(in srgb, var(--accent) 22%, var(--panel)), color-mix(in srgb, var(--accent) 6%, var(--bg))); }
      .bx-folder { position: absolute; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 2px;
        border-radius: 8px; cursor: pointer; box-sizing: border-box; padding-top: 4px; }
      .bx-folder svg { width: 72%; height: auto; pointer-events: none; }
      .bx-folder span { font-size: 12px; font-weight: 600; text-align: center; line-height: 1.15; color: var(--fg);
        max-width: 100%; overflow: hidden; overflow-wrap: anywhere; padding: 0 2px; pointer-events: none;
        display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
      .bx-folder.over, .bx-folder.open { background: color-mix(in srgb, var(--accent) 22%, transparent); outline: 2px solid var(--accent); }
      .bx-folder .bx-count { position: absolute; top: 2px; right: 6px; min-width: 18px; height: 18px; border-radius: 9px; padding: 0 5px;
        background: var(--accent); color: #fff; font-size: 11px; font-weight: 700; display: grid; place-items: center; box-sizing: border-box; }
      .bx-file { position: absolute; z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 2px; cursor: grab;
        touch-action: none; border-radius: 6px; box-sizing: border-box; padding-top: 3px; }
      .bx-file:hover { background: color-mix(in srgb, var(--accent) 12%, transparent); }
      .bx-file svg { width: 60%; height: auto; pointer-events: none; }
      .bx-file span { font-size: 11px; line-height: 1.15; text-align: center; color: var(--fg); overflow-wrap: anywhere; pointer-events: none;
        display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; max-width: 100%; padding: 0 2px; }
      .bx-file.dragging { z-index: 1000 !important; cursor: grabbing; background: color-mix(in srgb, var(--accent) 18%, transparent); }
      .bx-win { position: absolute; z-index: 2; background: var(--panel); border: 1px solid var(--line); border-radius: 8px;
        box-shadow: 0 10px 28px rgba(0,0,0,.25); box-sizing: border-box; }
      .bx-win-head { display: flex; align-items: center; justify-content: space-between; padding: 0 10px; font-size: 13px; font-weight: 700;
        border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--line) 35%, var(--panel)); border-radius: 8px 8px 0 0; box-sizing: border-box; }
      .bx-win-x { width: 24px; height: 24px; border: 0; border-radius: 4px; background: transparent; color: var(--fg); font-size: 15px; cursor: pointer; }
      .bx-win-x:hover { background: color-mix(in srgb, #e03131 25%, transparent); }
      .bx-win-empty { position: absolute; left: 0; right: 0; top: 50%; text-align: center; font-size: 12px; color: var(--muted); }

      .bx-pal { position: absolute; z-index: 1; border-radius: 10px; box-sizing: border-box; border: 1px solid var(--line);
        background: color-mix(in srgb, var(--line) 30%, var(--panel)); }
      .bx-pal h4 { margin: 6px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); text-align: center; }
      .bx-tpl { position: absolute; z-index: 2; cursor: copy; touch-action: none; }
      .bx-tpl svg { display: block; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
      .bx-frame { position: absolute; z-index: 1; box-sizing: border-box; border: 2px dashed var(--accent); border-radius: 6px;
        background: color-mix(in srgb, var(--accent) 5%, transparent); }
      .bx-frame span { position: absolute; left: 6px; top: -20px; font-size: 11px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--accent); }
      .bx-ghost { position: absolute; z-index: 1001; pointer-events: none; opacity: .85; }
      .bx-ghost svg { width: 100%; height: 100%; overflow: visible; }
      `,
    lanes: `
      .ln-root { display: flex; align-items: stretch; flex: none; }
      .ln-lane { flex: none; display: flex; flex-direction: column; box-sizing: border-box; border: 1px solid var(--line); border-radius: 10px;
        background: color-mix(in srgb, var(--panel) 60%, var(--bg)); transition: background-color .08s, border-color .08s; }
      .ln-lane.target { border-color: color-mix(in srgb, var(--accent) 45%, var(--line)); }
      .ln-lane.over { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 14%, var(--panel)); }
      .ln-head { flex: none; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 0 12px;
        font-size: 13px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: var(--muted);
        border-bottom: 1px solid var(--line); white-space: nowrap; overflow: hidden; }
      .ln-head small { font-size: 11px; opacity: .8; }
      .ln-sw { display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-right: 6px; box-shadow: 0 0 0 1px rgba(0,0,0,.25); }
      .ln-body { flex: 1; display: flex; flex-wrap: wrap; align-content: flex-start; gap: 8px; padding: 10px; box-sizing: border-box; }
      .ln-card { position: relative; flex: none; box-sizing: border-box; display: grid; place-items: center; cursor: grab; touch-action: none;
        border: 1px solid var(--line); border-radius: 8px; background: var(--panel); box-shadow: 0 1px 2px rgba(0,0,0,.1); }
      .ln-card svg { width: 62%; height: 62%; pointer-events: none; overflow: visible; }
      .ln-card.drag { z-index: 50; cursor: grabbing; box-shadow: 0 8px 18px rgba(0,0,0,.28); }
      `,
    libraries: `
      .bi-board { position: relative; flex: none; border-radius: 4px; background-color: color-mix(in srgb, var(--accent) 4%, var(--panel)); overflow: hidden;
        box-shadow: 0 0 0 1px var(--line); touch-action: none;
        background-image: linear-gradient(color-mix(in srgb, var(--accent) 12%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--accent) 12%, transparent) 1px, transparent 1px); }
      .bi-box { position: absolute; z-index: 1; overflow: hidden; box-sizing: border-box; border: 2px solid color-mix(in srgb, var(--accent) 60%, var(--line));
        background: color-mix(in srgb, var(--accent) 7%, var(--panel)); transition: background-color .08s; }
      .bi-box.drop-active { border-style: dashed; }
      .bi-box.drop-target { background: color-mix(in srgb, var(--accent) 22%, var(--panel)); border-color: var(--accent); }
      .bi-label { display: flex; align-items: center; gap: 8px; padding: 0 12px; white-space: nowrap; font-size: 13px; font-weight: 700; letter-spacing: .05em;
        text-transform: uppercase; color: var(--muted); border-bottom: 1px solid color-mix(in srgb, var(--accent) 30%, var(--line));
        background: color-mix(in srgb, var(--accent) 12%, var(--panel)); }
      .bi-swatch { flex: none; width: 12px; height: 12px; border-radius: 3px; box-shadow: 0 0 0 1px rgba(0,0,0,.25); }
      .bi-item { position: absolute; z-index: 2; cursor: grab; touch-action: none; filter: drop-shadow(0 1px 1.5px rgba(0,0,0,.28)); }
      .bi-item svg { display: block; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
      .bi-item.dragging { cursor: grabbing; filter: drop-shadow(0 7px 10px rgba(0,0,0,.32)); }

      .gl-root { display: flex; align-items: stretch; flex: none; }
      .gl-lane { flex: none; display: flex; flex-direction: column; box-sizing: border-box; border: 1px solid var(--line); border-radius: 12px;
        background: color-mix(in srgb, var(--panel) 55%, var(--bg)); overflow: hidden; }
      .gl-lane.target { border-color: color-mix(in srgb, var(--accent) 45%, var(--line)); }
      .gl-head { flex: none; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 0 12px; font-size: 13px; font-weight: 700;
        letter-spacing: .04em; text-transform: uppercase; color: var(--muted); border-bottom: 1px solid var(--line); white-space: nowrap; overflow: hidden; }
      .gl-head small { font-size: 11px; opacity: .8; }
      .gl-sw { display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-right: 6px; box-shadow: 0 0 0 1px rgba(0,0,0,.25); }
      .gl-body { flex: 1; display: flex; flex-wrap: wrap; align-content: flex-start; gap: 8px; padding: 10px; box-sizing: border-box; }
      .gl-card { position: relative; flex: none; box-sizing: border-box; display: grid; place-items: center; cursor: grab;
        border: 1px solid var(--line); border-radius: 8px; background: var(--panel); box-shadow: 0 1px 2px rgba(0,0,0,.1); }
      .gl-card svg { width: 62%; height: 62%; pointer-events: none; overflow: visible; }
      .gl-card.gu-transit { opacity: .4; outline: 2px dashed var(--accent); outline-offset: -2px; }
      .gl-lane.over { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 12%, var(--panel)); }
      .gu-mirror { position: fixed !important; margin: 0 !important; z-index: 9999 !important; opacity: .85; pointer-events: none; box-shadow: 0 8px 18px rgba(0,0,0,.3); }
      .gu-hide { left: -9999px !important; }
      .gu-unselectable { -webkit-user-select: none !important; user-select: none !important; }
      `
  }));
})();
