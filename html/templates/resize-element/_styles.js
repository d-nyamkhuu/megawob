/* resize-element/_styles: unchanged structural CSS constants for the panel and base templates. */
(function () {
  'use strict';
  env.template('resize-element/_styles', () => ({
    REFERENCE_CSS: `
      .rz-wrap { position: absolute; display: flex; gap: 12px; align-items: flex-start; }
      .rz-wrap.col { flex-direction: column; }
      .rz-area {
        position: relative; flex: none;
        border: 1px solid var(--line);
        border-radius: 12px;
        background-color: color-mix(in srgb, var(--panel) 45%, var(--bg));
        background-image: radial-gradient(circle, color-mix(in srgb, var(--muted) 35%, transparent) 1px, transparent 1.2px);
        background-size: 20px 20px;
      }
      .rz-box {
        position: absolute;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--panel);
        box-shadow: 0 6px 18px rgba(0, 0, 0, .14), 0 1px 3px rgba(0, 0, 0, .08);
        overflow: hidden;
      }
      .rz-title {
        display: flex; align-items: center; gap: 8px;
        height: 34px; padding: 0 12px;
        background: var(--accent); color: #fff;
        font-weight: 600; white-space: nowrap;
      }
      .rz-dots { display: flex; gap: 5px; flex: none; }
      .rz-dots i { width: 9px; height: 9px; border-radius: 50%; background: rgba(255, 255, 255, .55); }
      .rz-body { padding: 4px 14px; }
      .rz-line { height: 9px; margin-top: 14px; border-radius: 4px; background: var(--line); }
      .rz-lock {
        margin-left: auto; flex: none; display: inline-flex; align-items: center; gap: 5px;
        height: 24px; padding: 0 8px; border-radius: 5px; border: 1px solid rgba(255, 255, 255, .45);
        background: transparent; color: #fff; font: inherit; font-size: 12px; font-weight: 600; cursor: pointer;
      }
      .rz-tools { display: flex; align-items: center; gap: 10px; align-self: stretch; padding: 0 4px; color: var(--muted); font-size: 13px; font-weight: 600; }
      .rz-tools .rz-lock { color: var(--fg); border-color: var(--line); background: var(--panel); height: 28px; }
      .rz-tools .rz-lock[aria-pressed="true"] { background: var(--accent); color: #fff; border-color: var(--accent); }
      .rz-lock svg { width: 14px; height: 14px; }
      .rz-lock[aria-pressed="true"] { background: #fff; color: var(--accent); }
      .rz-readout {
        position: absolute; bottom: 8px; z-index: 1;
        padding: 2px 8px; border-radius: 4px;
        border: 1px solid var(--line); background: var(--bg); color: var(--fg);
        font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap;
      }
      .rz-ghost {
        position: absolute; z-index: 3; pointer-events: none;
        border: 2px dashed var(--fg); border-radius: 8px; opacity: .6;
      }
      .rz-handle {
        position: absolute; z-index: 4; outline: none;
        background: var(--accent); border: 2px solid var(--panel); border-radius: 4px;
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--fg) 25%, transparent);
      }
      .rz-handle.c { width: 16px; height: 16px; margin: -8px 0 0 -8px; }
      .rz-handle.x { width: 10px; height: 34px; margin: -17px 0 0 -5px; cursor: ew-resize; }
      .rz-handle.y { width: 34px; height: 10px; margin: -5px 0 0 -17px; cursor: ns-resize; }
      .rz-handle.nwse { cursor: nwse-resize; } .rz-handle.nesw { cursor: nesw-resize; }
      .rz-handle.active, .rz-handle.focused { box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 35%, transparent); }
      .rz-ruler { position: absolute; pointer-events: none; color: var(--muted); font-size: 10px; font-variant-numeric: tabular-nums; }
      .rz-ruler i { position: absolute; background: var(--muted); }
      .rz-ruler b { position: absolute; font-weight: 500; white-space: nowrap; }
      .rz-ref {
        flex: none; display: flex; align-items: center; justify-content: center; box-sizing: border-box;
        border-radius: 6px; background: color-mix(in srgb, var(--accent) 16%, var(--panel)); border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--line));
        color: var(--fg); font-weight: 650; font-size: 13px; white-space: nowrap; overflow: hidden;
      }

      .rzt-card { position: absolute; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); box-shadow: 0 2px 8px rgba(0,0,0,.06); }
      .rzt-label { position: absolute; left: 18px; top: 14px; font-weight: 650; }
      .rzt-hint { position: absolute; right: 18px; top: 15px; font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
      .rzt-ta { position: absolute; left: 18px; top: 42px; box-sizing: border-box; margin: 0; padding: 8px 10px;
        border: 1px solid color-mix(in srgb, var(--fg) 30%, var(--line)); border-radius: 6px; background: var(--bg); color: var(--fg);
        font: 14px/1.45 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; overflow: hidden; }
      .rzt-ghost { position: absolute; left: 18px; top: 42px; pointer-events: none; border: 2px dashed var(--accent); border-radius: 6px; z-index: 2; }

      .rzc-box { position: absolute; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
      .rzc-title { padding: 10px 14px 4px; font-weight: 700; }
      .rzc-ruler { position: relative; height: 18px; margin: 0 14px; }
      .rzc-table { border-collapse: collapse; table-layout: fixed; margin: 4px 14px 0; font-size: 13px; }
      .rzc-table th, .rzc-table td { padding: 7px 10px; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-bottom: 1px solid var(--line); }
      .rzc-table th { position: relative; overflow: visible; background: color-mix(in srgb, var(--bg) 70%, var(--panel)); font-weight: 650; border-right: 1px solid var(--line); }
      .rzc-table th span { display: block; overflow: hidden; text-overflow: ellipsis; }
      .rzc-grip { position: absolute; top: 0; bottom: 0; right: -5px; width: 9px; z-index: 2; cursor: col-resize; }
      .rzc-grip::after { content: ""; position: absolute; left: 3px; top: 6px; bottom: 6px; width: 3px; border-radius: 2px; background: color-mix(in srgb, var(--muted) 55%, transparent); }
      .rzc-grip.active::after { background: var(--accent); }
      .rzc-bar { position: absolute; left: 14px; right: 14px; bottom: 8px; font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; font-variant-numeric: tabular-nums; }

      .wm-desk { position: absolute; overflow: hidden; border-radius: 10px; border: 1px solid var(--line);
        background: linear-gradient(160deg, color-mix(in srgb, var(--accent) 30%, #1d3557), color-mix(in srgb, var(--accent) 12%, #0b132b)); }
      .wm-icon { position: absolute; width: 64px; display: flex; flex-direction: column; align-items: center; gap: 4px;
        color: #fff; font-size: 11px; text-align: center; text-shadow: 0 1px 2px rgba(0,0,0,.6); }
      .wm-icon i { width: 34px; height: 28px; border-radius: 5px; background: rgba(255,255,255,.85); box-shadow: 0 1px 3px rgba(0,0,0,.4); }
      .wm-icon i.f { border-radius: 3px 9px 3px 3px; background: #ffd166; }
      .wm-task { position: absolute; left: 0; right: 0; bottom: 0; height: 24px; display: flex; align-items: center; gap: 8px;
        padding: 0 8px; background: rgba(10, 12, 20, .78); color: #e9ecef; font-size: 11px; }
      .wm-task b { padding: 2px 10px; border-radius: 3px; background: rgba(255,255,255,.16); font-weight: 600; }
      .wm-task span { margin-left: auto; font-variant-numeric: tabular-nums; }
      .wm-tick { position: absolute; pointer-events: none; color: rgba(255,255,255,.8); font-size: 10px; font-variant-numeric: tabular-nums; }
      .wm-tick i { position: absolute; background: rgba(255,255,255,.7); }
      .wm-tick b { position: absolute; font-weight: 500; white-space: nowrap; }
      .wm-frame { position: absolute; z-index: 2; }
      .wm-win { position: absolute; inset: 0; display: flex; flex-direction: column; overflow: hidden;
        background: var(--panel); color: var(--fg); border: 1px solid color-mix(in srgb, var(--fg) 30%, var(--line));
        box-shadow: 0 12px 32px rgba(0,0,0,.35); }
      .wm-win.mac { border-radius: 10px; }
      .wm-win.win { border-radius: 2px; }
      .wm-bar { flex: none; display: flex; align-items: center; gap: 8px; height: 30px; padding: 0 0 0 10px; white-space: nowrap;
        background: color-mix(in srgb, var(--fg) 8%, var(--panel)); border-bottom: 1px solid var(--line); font-size: 13px; font-weight: 600; }
      .wm-win.mac .wm-bar { justify-content: center; position: relative; padding: 0 10px; }
      .wm-app { width: 14px; height: 14px; border-radius: 3px; background: var(--accent); flex: none; }
      .wm-ttl { overflow: hidden; text-overflow: ellipsis; min-width: 0; }
      .wm-bar .rz-lock, .wm-app, .wm-lights { flex: none; }
      .wm-ctl { margin-left: auto; display: flex; height: 100%; flex: none; }
      .wm-ctl button { width: 40px; height: 100%; border: 0; background: transparent; color: var(--fg); font: 15px/1 system-ui, sans-serif; cursor: default; }
      .wm-lights { position: absolute; left: 10px; top: 9px; display: flex; gap: 7px; }
      .wm-lights button { width: 12px; height: 12px; padding: 0; border-radius: 50%; border: 0; cursor: default; }
      .wm-lights button:nth-child(1) { background: #ff5f57; } .wm-lights button:nth-child(2) { background: #febc2e; } .wm-lights button:nth-child(3) { background: #28c840; }
      .wm-bar .rz-lock { margin-left: 0; color: var(--fg); border-color: var(--line); height: 22px; }
      .wm-win.mac .wm-bar .rz-lock { position: absolute; right: 8px; top: 3px; }
      .wm-bar .rz-lock[aria-pressed="true"] { background: var(--accent); color: #fff; border-color: var(--accent); }
      .wm-menu { flex: none; display: flex; gap: 14px; padding: 3px 10px; font-size: 12px; color: var(--muted); border-bottom: 1px solid var(--line); white-space: nowrap; overflow: hidden; }
      .wm-body { flex: 1; min-height: 0; overflow: hidden; padding: 8px 12px; font-size: 13px; line-height: 1.45; }
      .wm-body h4 { margin: 0 0 4px; font-size: 14px; }
      .wm-body p { margin: 0 0 8px; color: color-mix(in srgb, var(--fg) 80%, var(--muted)); }
      .wm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(78px, 1fr)); gap: 8px; margin-bottom: 8px; }
      .wm-grid div { height: 54px; border-radius: 6px; padding: 4px 6px; box-sizing: border-box; color: #fff; font-size: 11px; font-weight: 600;
        overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
      .wm-status { flex: none; display: flex; gap: 12px; height: 22px; align-items: center; padding: 0 10px; font-size: 11px; color: var(--muted);
        border-top: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 4%, var(--panel)); white-space: nowrap; overflow: hidden; }
      .wm-status .rd { margin-left: auto; color: var(--fg); font-weight: 650; font-variant-numeric: tabular-nums; }
      .wm-h { position: absolute; z-index: 3; opacity: 0; transition: none; background: color-mix(in srgb, var(--accent) 55%, transparent); border-radius: 3px; }
      .wm-frame:hover .wm-h, .wm-h.active { opacity: 1; }
      .wm-h.e, .wm-h.w { top: 12px; bottom: 12px; width: 8px; cursor: ew-resize; }
      .wm-h.n, .wm-h.s { left: 12px; right: 12px; height: 8px; cursor: ns-resize; }
      .wm-h.e { right: -4px; } .wm-h.w { left: -4px; } .wm-h.n { top: -4px; } .wm-h.s { bottom: -4px; }
      .wm-h.c { width: 16px; height: 16px; border-radius: 50%; }
      .wm-h.nw { left: -8px; top: -8px; cursor: nwse-resize; } .wm-h.se { right: -8px; bottom: -8px; cursor: nwse-resize; }
      .wm-h.ne { right: -8px; top: -8px; cursor: nesw-resize; } .wm-h.sw { left: -8px; bottom: -8px; cursor: nesw-resize; }
      .wm-ghost { position: absolute; z-index: 4; pointer-events: none; border: 2px dashed #fff; border-radius: 6px; box-shadow: 0 0 0 1px rgba(0,0,0,.45); }

      .rzs-box { position: absolute; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,.08); }
      .rzs-pane { position: absolute; overflow: hidden; }
      .rzs-head { display: flex; justify-content: space-between; gap: 8px; padding: 7px 10px; font-weight: 650; font-size: 13px;
        background: color-mix(in srgb, var(--bg) 70%, var(--panel)); border-bottom: 1px solid var(--line); white-space: nowrap; }
      .rzs-head em { font-style: normal; color: var(--muted); font-weight: 500; font-variant-numeric: tabular-nums; }
      .rzs-item { padding: 5px 10px; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-bottom: 1px solid color-mix(in srgb, var(--line) 50%, transparent); }
      .rzs-div { position: absolute; z-index: 2; outline: none; background: color-mix(in srgb, var(--muted) 30%, var(--panel)); }
      .rzs-div.v { cursor: col-resize; } .rzs-div.h { cursor: row-resize; }
      .rzs-div::after { content: ""; position: absolute; border-radius: 2px; background: var(--muted); }
      .rzs-div.v::after { left: 50%; top: 50%; width: 2px; height: 28px; margin: -14px 0 0 -1px; }
      .rzs-div.h::after { left: 50%; top: 50%; width: 28px; height: 2px; margin: -1px 0 0 -14px; }
      .rzs-div.active, .rzs-div.focused { background: var(--accent); }
      `,
    DRAWER_CSS: `
      .dw-pane {
        position: absolute; overflow: hidden;
        border-radius: 6px; border: 1px solid #0d0f12;
        background: #23272e;
        background-image: linear-gradient(90deg, #1b1e23 0 44px, transparent 44px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, .28);
        font: 13px/1.5 "DejaVu Sans Mono", "Liberation Mono", Menlo, monospace;
      }
      .dw-code { position: absolute; left: 0; top: 10px; color: #5c6370; white-space: pre; pointer-events: none; }
      .dw-code b { display: inline-block; width: 34px; padding-right: 10px; text-align: right; color: #4b5263; font-weight: 400; }
      .dw-code i { font-style: normal; color: #98c379; }
      .dw-code u { text-decoration: none; color: #c678dd; }
      .dw-label {
        position: absolute; color: #abb2bf; font-size: 11px; letter-spacing: .08em; text-transform: uppercase;
        white-space: nowrap;
      }
      .dw-box {
        position: absolute; overflow: hidden;
        border: 1px solid #8b93a1; border-radius: 2px;
        background: #fdfdf8; color: #2b2b2b;
        box-shadow: inset 1px 1px 2px rgba(0, 0, 0, .18);
        padding: 6px 10px 6px 22px;
        white-space: pre; font-size: 13px; line-height: 19px;
      }
      .dw-box p { margin: 0; }
      .dw-readout {
        position: absolute; right: 4px; top: 4px;
        padding: 1px 6px; border-radius: 3px;
        background: #fff3bf; color: #5c3c00; border: 1px solid #e0c060;
        font-size: 12px; font-variant-numeric: tabular-nums;
      }
      .dw-grip {
        position: absolute; left: 0; bottom: 0; width: 20px; height: 20px; cursor: nesw-resize; outline: none;
        background: #dee2e6 repeating-linear-gradient(45deg, transparent 0 3px, #495057 3px 5px);
        clip-path: polygon(0 0, 100% 100%, 0 100%);
      }
      .dw-grip.active, .dw-grip.focused { background-color: #ffe066; }
      .dw-ghost {
        position: absolute; pointer-events: none; z-index: 2;
        border: 2px dashed #ffd43b; border-radius: 2px;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, .5);
      }
      `,
    INTERACT_CSS: `
      .ri-wrap { position: absolute; display: flex; gap: 12px; align-items: flex-start; }
      .ri-wrap.col { flex-direction: column; }
      .ri-area { position: relative; flex: none; border: 1px solid var(--line); border-radius: 6px;
        background-color: color-mix(in srgb, var(--panel) 40%, var(--bg));
        background-image: linear-gradient(color-mix(in srgb, var(--muted) 14%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--muted) 14%, transparent) 1px, transparent 1px);
        background-size: 25px 25px; }
      .ri-frame { position: absolute; box-sizing: border-box; touch-action: none; }
      .ri-box { position: absolute; inset: 0; border: 1px solid color-mix(in srgb, var(--fg) 25%, var(--line)); border-radius: 4px; background: var(--panel);
        box-shadow: 0 4px 14px rgba(0,0,0,.12); overflow: hidden; }
      .ri-title { display: flex; align-items: center; gap: 8px; height: 30px; padding: 0 12px; background: color-mix(in srgb, var(--accent) 14%, var(--panel));
        border-bottom: 1px solid var(--line); font-weight: 650; white-space: nowrap; color: var(--fg); }
      .ri-title i { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
      .ri-body { padding: 4px 14px; }
      .ri-line { height: 9px; margin-top: 14px; border-radius: 4px; background: var(--line); }
      .ri-readout { position: absolute; bottom: 8px; z-index: 1; padding: 2px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--bg); color: var(--fg);
        font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap; }
      .ri-ghost { position: absolute; z-index: 3; pointer-events: none; border: 2px dashed var(--fg); border-radius: 4px; opacity: .6; }
      .ri-h { position: absolute; z-index: 4; box-sizing: border-box; outline: none; background: var(--accent); border: 2px solid var(--panel); border-radius: 3px; }
      .ri-h.c { width: 14px; height: 14px; margin: -7px 0 0 -7px; }
      .ri-h.x { width: 8px; height: 30px; margin: -15px 0 0 -4px; cursor: ew-resize; }
      .ri-h.y { width: 30px; height: 8px; margin: -4px 0 0 -15px; cursor: ns-resize; }
      .ri-h.nwse { cursor: nwse-resize; } .ri-h.nesw { cursor: nesw-resize; }
      .ri-h.active, .ri-h.focused { box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 35%, transparent); }
      .ri-ruler { position: absolute; pointer-events: none; color: var(--muted); font-size: 10px; font-variant-numeric: tabular-nums; }
      .ri-ruler i { position: absolute; background: var(--muted); }
      .ri-ruler b { position: absolute; font-weight: 500; white-space: nowrap; }
      .ri-ref { flex: none; display: flex; align-items: center; justify-content: center; box-sizing: border-box; border-radius: 4px;
        background: color-mix(in srgb, var(--accent) 16%, var(--panel)); border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--line));
        color: var(--fg); font-weight: 650; font-size: 13px; white-space: nowrap; overflow: hidden; }
      .ri-tools { display: flex; align-items: center; gap: 10px; align-self: stretch; padding: 0 4px; color: var(--muted); font-size: 13px; font-weight: 600; }
      .ri-lock { flex: none; display: inline-flex; align-items: center; gap: 5px; height: 28px; padding: 0 8px; border-radius: 5px; border: 1px solid var(--line);
        background: var(--panel); color: var(--fg); font: inherit; font-size: 12px; font-weight: 600; cursor: pointer; margin-left: auto; }
      .ri-lock[aria-pressed="true"] { background: var(--accent); color: #fff; border-color: var(--accent); }
      .ri-lock svg { width: 14px; height: 14px; }
      `,
    PANEL_CSS: `
  .rz-wrap { position: absolute; display: flex; gap: 12px; align-items: flex-start; }
  .rz-wrap.col { flex-direction: column; }
  .rz-area {
    position: relative; flex: none;
    border: 1px solid var(--line);
    border-radius: 12px;
    background-color: color-mix(in srgb, var(--panel) 45%, var(--bg));
    background-image: radial-gradient(circle, color-mix(in srgb, var(--muted) 35%, transparent) 1px, transparent 1.2px);
    background-size: 20px 20px;
  }
  .rz-box {
    position: absolute;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: var(--panel);
    box-shadow: 0 6px 18px rgba(0, 0, 0, .14), 0 1px 3px rgba(0, 0, 0, .08);
    overflow: hidden;
  }
  .rz-title {
    display: flex; align-items: center; gap: 8px;
    height: 34px; padding: 0 12px;
    background: var(--accent); color: #fff;
    font-weight: 600; white-space: nowrap;
  }
  .rz-dots { display: flex; gap: 5px; flex: none; }
  .rz-dots i { width: 9px; height: 9px; border-radius: 50%; background: rgba(255, 255, 255, .55); }
  .rz-body { padding: 4px 14px; }
  .rz-line { height: 9px; margin-top: 14px; border-radius: 4px; background: var(--line); }
  .rz-readout {
    position: absolute; bottom: 8px; z-index: 1;
    padding: 2px 8px; border-radius: 4px;
    border: 1px solid var(--line); background: var(--bg); color: var(--fg);
    font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap;
  }
  .rz-ghost {
    position: absolute; z-index: 3; pointer-events: none;
    border: 2px dashed var(--fg); border-radius: 8px; opacity: .6;
  }
  .rz-handle {
    position: absolute; z-index: 4; outline: none;
    background: var(--accent); border: 2px solid var(--panel); border-radius: 4px;
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--fg) 25%, transparent);
  }
  .rz-handle.c { width: 16px; height: 16px; margin: -8px 0 0 -8px; }
  .rz-handle.x { width: 10px; height: 34px; margin: -17px 0 0 -5px; cursor: ew-resize; }
  .rz-handle.y { width: 34px; height: 10px; margin: -5px 0 0 -17px; cursor: ns-resize; }
  .rz-handle.nwse { cursor: nwse-resize; } .rz-handle.nesw { cursor: nesw-resize; }
  .rz-handle.active, .rz-handle.focused { box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 35%, transparent); }
  .rz-ruler { position: absolute; pointer-events: none; color: var(--muted); font-size: 10px; font-variant-numeric: tabular-nums; }
  .rz-ruler i { position: absolute; background: var(--muted); }
  .rz-ruler b { position: absolute; font-weight: 500; white-space: nowrap; }
  .rz-ref {
    flex: none; display: flex; align-items: center; justify-content: center; box-sizing: border-box;
    border-radius: 6px; background: color-mix(in srgb, var(--accent) 16%, var(--panel)); border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--line));
    color: var(--fg); font-weight: 650; font-size: 13px; white-space: nowrap; overflow: hidden;
  }

  .rzt-card { position: absolute; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); box-shadow: 0 2px 8px rgba(0,0,0,.06); }
  .rzt-label { position: absolute; left: 18px; top: 14px; font-weight: 650; }
  .rzt-hint { position: absolute; right: 18px; top: 15px; font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
  .rzt-ta { position: absolute; left: 18px; top: 42px; box-sizing: border-box; margin: 0; padding: 8px 10px;
    border: 1px solid color-mix(in srgb, var(--fg) 30%, var(--line)); border-radius: 6px; background: var(--bg); color: var(--fg);
    font: 14px/1.45 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; overflow: hidden; }
  .rzt-ghost { position: absolute; left: 18px; top: 42px; pointer-events: none; border: 2px dashed var(--accent); border-radius: 6px; z-index: 2; }

  .rzc-box { position: absolute; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
  .rzc-title { padding: 10px 14px 4px; font-weight: 700; }
  .rzc-ruler { position: relative; height: 18px; margin: 0 14px; }
  .rzc-table { border-collapse: collapse; table-layout: fixed; margin: 4px 14px 0; font-size: 13px; }
  .rzc-table th, .rzc-table td { padding: 7px 10px; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-bottom: 1px solid var(--line); }
  .rzc-table th { position: relative; overflow: visible; background: color-mix(in srgb, var(--bg) 70%, var(--panel)); font-weight: 650; border-right: 1px solid var(--line); }
  .rzc-table th span { display: block; overflow: hidden; text-overflow: ellipsis; }
  .rzc-grip { position: absolute; top: 0; bottom: 0; right: -5px; width: 9px; z-index: 2; cursor: col-resize; }
  .rzc-grip::after { content: ""; position: absolute; left: 3px; top: 6px; bottom: 6px; width: 3px; border-radius: 2px; background: color-mix(in srgb, var(--muted) 55%, transparent); }
  .rzc-grip.active::after { background: var(--accent); }
  .rzc-bar { position: absolute; left: 14px; right: 14px; bottom: 8px; font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; font-variant-numeric: tabular-nums; }

  .rzs-box { position: absolute; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,.08); }
  .rzs-pane { position: absolute; overflow: hidden; }
  .rzs-head { display: flex; justify-content: space-between; gap: 8px; padding: 7px 10px; font-weight: 650; font-size: 13px;
    background: color-mix(in srgb, var(--bg) 70%, var(--panel)); border-bottom: 1px solid var(--line); white-space: nowrap; }
  .rzs-head em { font-style: normal; color: var(--muted); font-weight: 500; font-variant-numeric: tabular-nums; }
  .rzs-item { padding: 5px 10px; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-bottom: 1px solid color-mix(in srgb, var(--line) 50%, transparent); }
  .rzs-div { position: absolute; z-index: 2; outline: none; background: color-mix(in srgb, var(--muted) 30%, var(--panel)); }
  .rzs-div.v { cursor: col-resize; } .rzs-div.h { cursor: row-resize; }
  .rzs-div::after { content: ""; position: absolute; border-radius: 2px; background: var(--muted); }
  .rzs-div.v::after { left: 50%; top: 50%; width: 2px; height: 28px; margin: -14px 0 0 -1px; }
  .rzs-div.h::after { left: 50%; top: 50%; width: 28px; height: 2px; margin: -1px 0 0 -14px; }
  .rzs-div.active, .rzs-div.focused { background: var(--accent); }
  `,
  }));
})();
