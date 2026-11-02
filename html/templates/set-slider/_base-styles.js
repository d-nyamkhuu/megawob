/* set-slider/_base-styles: the reference styles, kept byte-identical. */
(function () {
  'use strict';
  env.template('set-slider/_base-styles', () => ({
    classic: `
      .slc-card {
        position: absolute; padding: 30px 40px 42px; border: 1px solid var(--line); border-radius: 12px;
        background: color-mix(in srgb, var(--panel) 55%, var(--bg)); box-shadow: 0 1px 3px rgba(0,0,0,.06);
      }
      .slc-card.vertical { padding: 26px 70px 26px 50px; }
      .slc-card.tight { padding: 22px 30px 34px; }
      .slc-grid { display: grid; grid-template-columns: auto auto auto; column-gap: 24px; row-gap: 58px; align-items: center; }
      .slc-row { display: flex; align-items: flex-start; gap: 112px; }
      .slc-v { display: flex; flex-direction: column; align-items: center; gap: 14px; }
      .slc-label { min-width: 96px; font-weight: 600; text-align: right; white-space: nowrap; }
      .slc-v .slc-label { min-width: 0; text-align: center; }
      .slc-readout {
        width: 128px; white-space: nowrap; overflow: hidden; padding: 4px 10px; border: 1px solid var(--line);
        border-radius: 6px; background: var(--panel); font-variant-numeric: tabular-nums; text-align: center;
      }
      .slc-body { position: relative; }
      .slc-hit { position: relative; touch-action: none; outline: none; }
      .slc-hit:focus-visible, .slc-hit.focused { box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 45%, transparent); border-radius: 8px; }
      .slc-rail, .slc-fill { position: absolute; border-radius: 99px; }
      .slc-rail { background: var(--line); }
      .slc-fill { background: var(--accent); }
      .slc-thumb {
        position: absolute; border: 2px solid var(--accent); border-radius: 50%; background: var(--panel);
        box-shadow: 0 1px 3px rgba(0,0,0,.3);
      }
      .slc-thumb.active { box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 25%, transparent), 0 1px 3px rgba(0,0,0,.3); }
      .slc-h .slc-rail, .slc-h .slc-fill { top: 50%; transform: translateY(-50%); }
      .slc-v .slc-rail, .slc-v .slc-fill { left: 50%; transform: translateX(-50%); }
      .slc-ticks { position: absolute; color: var(--muted); font-size: 12px; font-variant-numeric: tabular-nums; pointer-events: none; }
      .slc-tick { position: absolute; white-space: nowrap; }
      .slc-tick::before { content: ""; position: absolute; background: var(--muted); }
      .slc-h .slc-ticks { left: 0; right: 0; top: 100%; height: 28px; }
      .slc-h .slc-tick { top: 8px; transform: translateX(-50%); }
      .slc-h .slc-tick::before { left: 50%; top: -7px; width: 1px; height: 5px; }
      .slc-v .slc-ticks { top: 0; bottom: 0; left: 100%; width: 60px; }
      .slc-v .slc-tick { left: 12px; transform: translateY(-50%); }
      .slc-v .slc-tick::before { top: 50%; left: -10px; width: 5px; height: 1px; }
      .slc-stop { font-weight: 600; color: var(--fg); }
      .slc-card.dense { padding: 18px 24px 30px; border-radius: 4px; font-size: 12px; box-shadow: none; }
      .slc-card.dense .slc-grid { column-gap: 14px; }
      .slc-card.dense .slc-label { min-width: 80px; font-weight: 500; }
      .slc-card.dense .slc-readout { width: 128px; padding: 1px 6px; border-radius: 2px; font-size: 12px; }
      .slc-card.dense .slc-thumb { border-width: 1px; box-shadow: none; }
      .slc-card.dense .slc-rail, .slc-card.dense .slc-fill { border-radius: 0; }
      .slc-card.touch { border-radius: 22px; font-size: 17px; }
      .slc-card.touch .slc-label { font-weight: 700; }
      .slc-card.touch .slc-readout { padding: 8px 12px; border-radius: 14px; font-size: 17px; }
      .slc-card.touch .slc-thumb { border-width: 3px; box-shadow: 0 2px 8px rgba(0,0,0,.3); }
      .slc-card.touch .slc-ticks { font-size: 13px; }
      .slc-native { -webkit-appearance: none; appearance: none; display: block; margin: 0; padding: 0; background: transparent; outline: none; }
      .slc-native::-webkit-slider-runnable-track { height: var(--rail); border-radius: 99px;
        background: linear-gradient(to right, var(--accent) 0 var(--pct), var(--line) var(--pct) 100%); }
      .slc-native::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: var(--thumb); height: var(--thumb);
        margin-top: calc((var(--rail) - var(--thumb)) / 2); border-radius: 50%; background: var(--accent); border: 2px solid var(--panel);
        box-shadow: 0 1px 3px rgba(0,0,0,.35); }
      .slc-native:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 30%, transparent); }
      .slc-presets { margin: -6px 0 34px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); font-size: 13px; }
      .slc-presets table { border-collapse: collapse; width: 100%; }
      .slc-presets th, .slc-presets td { padding: 5px 12px; text-align: left; white-space: nowrap; font-variant-numeric: tabular-nums; }
      .slc-presets th { color: var(--muted); font-weight: 600; font-size: 12px; border-bottom: 1px solid var(--line); }
      .slc-presets td:first-child { font-weight: 650; }
      .slc-presets caption { text-align: left; padding: 8px 12px 2px; font-weight: 700; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }

      .slr-card { position: absolute; padding: 22px 30px 26px; border: 1px solid var(--line); border-radius: 12px;
        background: var(--panel); box-shadow: 0 1px 3px rgba(0,0,0,.06); }
      .slr-title { font-size: 18px; font-weight: 700; }
      .slr-item { margin: 2px 0 14px; color: var(--muted); }
      .slr-row { display: flex; align-items: center; gap: 18px; padding: 8px 0; }
      .slr-label { min-width: 120px; font-weight: 600; }
      .slr-stars { display: flex; touch-action: none; cursor: pointer; user-select: none; }
      .slr-star { position: relative; flex: none; }
      .slr-star svg { position: absolute; inset: 0; width: 100%; height: 100%; }
      .slr-star .bg path { fill: var(--line); }
      .slr-star .fg { overflow: hidden; position: absolute; left: 0; top: 0; bottom: 0; width: 0; }
      .slr-star .fg svg { position: absolute; left: 0; top: 0; height: 100%; }
      .slr-star .fg path { fill: #f5a623; }
      .slr-value { min-width: 70px; color: var(--muted); font-variant-numeric: tabular-nums; }
      .slm-player { position: absolute; overflow: hidden; border-radius: 10px; background: #0d0f13; color: #e9edf3; box-shadow: 0 10px 28px rgba(0,0,0,.28);
        font: 13px/1.3 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
      .slm-video { position: relative; display: flex; align-items: center; justify-content: center; }
      .slm-title { position: absolute; left: 16px; top: 12px; right: 16px; font-size: 15px; font-weight: 650; text-shadow: 0 1px 3px rgba(0,0,0,.6); }
      .slm-big { width: 0; height: 0; border-left: 34px solid rgba(255,255,255,.85); border-top: 21px solid transparent; border-bottom: 21px solid transparent; margin-left: 8px; }
      .slm-bar { padding: 6px 14px 10px; background: linear-gradient(#16191f, #0d0f13); }
      .slm-seek .slc-rail, .slm-vol .slc-rail { background: rgba(255,255,255,.22); }
      .slm-icon { color: #cfd6df; display: flex; }
      .slm-seek .slc-buf { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,.38); border-radius: 99px; }
      .slm-seek .slc-thumb, .slm-vol .slc-thumb { border-color: #fff; background: var(--accent); }
      .slm-row { display: flex; align-items: center; gap: 14px; margin-top: 2px; }
      .slm-btn { width: 30px; height: 30px; border-radius: 50%; border: 0; background: rgba(255,255,255,.12); color: #fff; font-size: 13px; }
      .slm-time { font-variant-numeric: tabular-nums; color: #cfd6df; white-space: nowrap; }
      .slm-spacer { flex: 1; }
      .slm-volpct { width: 40px; text-align: right; font-variant-numeric: tabular-nums; color: #cfd6df; }
      .slm-tog { flex: none; width: 34px; height: 30px; display: flex; align-items: center; justify-content: center; padding: 0;
        border: 0; border-radius: 6px; background: transparent; color: #e9edf3; cursor: pointer; position: relative; }
      .slm-tog:hover { background: rgba(255,255,255,.12); }
      .slm-cc { font: 700 11px/1 system-ui, sans-serif; padding: 3px 4px; border: 1.6px solid currentColor; border-radius: 3px; }
      .slm-tog.on .slm-cc { background: #e9edf3; color: #0d0f13; }
      .slm-tog.on::after { content: ""; position: absolute; left: 7px; right: 7px; bottom: 1px; height: 3px; border-radius: 2px; background: var(--accent); }
      .slm-tog[data-role="mute"].on::after { display: none; }
      .slm-gear::before { content: "⚙"; font-size: 17px; }
      .slm-full::before { content: ""; width: 14px; height: 11px; border: 2px solid currentColor; border-radius: 2px; }
      .slm-caption { position: absolute; left: 50%; bottom: 14px; transform: translateX(-50%); max-width: 86%; padding: 3px 10px;
        background: rgba(8,8,8,.75); color: #fff; font-size: 15px; border-radius: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .slm-vol .muted .slc-fill, .slm-vol.muted .slc-fill { opacity: .35; }

      .slx-mixer { position: absolute; display: flex; gap: 6px; padding: 14px 14px 12px; border-radius: 10px; border: 1px solid var(--line);
        background: color-mix(in srgb, var(--panel) 80%, var(--bg)); box-shadow: 0 2px 10px rgba(0,0,0,.08); }
      .slx-strip { width: 64px; flex: none; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 8px 6px; border-radius: 8px; background: color-mix(in srgb, var(--bg) 60%, var(--panel)); }
      .slx-name { font-size: 12px; font-weight: 700; white-space: nowrap; max-width: 78px; overflow: hidden; text-overflow: ellipsis; }
      .slx-val { width: 60px; text-align: center; overflow: hidden; font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; white-space: nowrap; }
      .slx-body { display: flex; gap: 6px; align-items: stretch; }
      .slx-meter { width: 5px; border-radius: 3px; background: linear-gradient(to top, #2f9e44 0 60%, #f2c200 60% 82%, #e03131 82%); opacity: .35; }
      .slx-fader .slc-thumb { border-radius: 4px; }

      .sls-card { position: absolute; border: 1px solid var(--line); border-radius: 10px; background: var(--panel);
        box-shadow: 0 2px 12px rgba(0,0,0,.08); overflow: visible; }
      .sls-card.ios { border-radius: 14px; }
      .sls-card.win { border-radius: 4px; box-shadow: none; }
      .sls-head { padding: 16px 24px 10px; border-bottom: 1px solid var(--line); }
      .sls-title { font-size: 18px; font-weight: 700; }
      .sls-card.win .sls-title { font-weight: 600; font-size: 20px; }
      .sls-sub { margin-top: 2px; font-size: 12px; color: var(--muted); }
      .sls-row { display: grid; grid-template-columns: 1fr auto; align-items: center; min-height: 56px; border-bottom: 1px solid var(--line); }
      .sls-row:last-child { border-bottom: 0; }
      .sls-row.stacked { display: block; padding-top: 10px !important; padding-bottom: 12px !important; }
      .sls-row:has(.slc-ticks) { padding-bottom: 26px !important; }
      .sls-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; }
      .sls-label { font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .sls-labelcell { min-width: 0; padding: 8px 0; }
      .sls-desc { font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 520px; }
      .sls-value { text-align: right; white-space: nowrap; color: var(--muted); font-variant-numeric: tabular-nums; }
      .sls-switch { width: 44px; height: 24px; border-radius: 99px; border: 0; padding: 0; background: var(--line); position: relative; cursor: pointer; }
      .sls-switch::after { content: ""; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.3); }
      .sls-switch.on { background: var(--accent); }
      .sls-switch.on::after { left: 23px; }
      .sls-card.win .sls-switch { width: 40px; height: 20px; }
      .sls-card.win .sls-switch::after { width: 12px; height: 12px; top: 4px; left: 4px; }
      .sls-card.win .sls-switch.on::after { left: 24px; }
      .sls-select { padding: 4px 8px; border: 1px solid var(--line); border-radius: 6px; background: var(--bg); color: var(--fg); font: inherit; }
      .sls-card.ios .slc-thumb { border: 0; background: #fff; box-shadow: 0 1px 5px rgba(0,0,0,.35); }
      .sls-card.material .slc-thumb { border: 0; background: var(--accent); box-shadow: none; }
      .sls-card.win .slc-thumb { border: 0; border-radius: 4px; background: var(--accent); box-shadow: 0 0 0 1px var(--panel); }
      .sls-card.win .slc-rail, .sls-card.win .slc-fill { border-radius: 0; }
      `,
    arc: `
      .sla-card {
        position: absolute; padding: 18px 26px; border: 1px solid var(--line); border-radius: 18px;
        background: color-mix(in srgb, var(--panel) 70%, var(--bg)); box-shadow: 0 2px 10px rgba(0,0,0,.07);
      }
      .sla-svg { display: block; overflow: visible; touch-action: none; }
      .sla-svg text { pointer-events: none; fill: var(--fg); font: 600 11px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
      .sla-svg .sla-name { font-size: 12px; letter-spacing: .14em; text-transform: uppercase; }
      .sla-svg .sla-end { fill: var(--muted); font-variant-numeric: tabular-nums; }
      .sla-svg .sla-tick { fill: var(--muted); font-weight: 500; font-size: 10px; font-variant-numeric: tabular-nums; }
      .sla-svg .sla-hub { font-size: 14px; font-variant-numeric: tabular-nums; }
      .sla-svg .sla-hub .val { fill: var(--muted); font-weight: 500; }
      .sla-track { cursor: pointer; outline: none; }
      .sla-track.focused { filter: drop-shadow(0 0 3px color-mix(in srgb, var(--accent) 70%, transparent)); }
      .sla-thumb { cursor: grab; }
      .sla-thumb.on { filter: drop-shadow(0 0 4px rgba(0,0,0,.45)); }
      .sla-row { display: flex; align-items: flex-start; gap: 64px; }
      .sla-col { display: flex; flex-direction: column; align-items: center; gap: 8px; }
      .sla-label { font-weight: 700; letter-spacing: .04em; }
      .sla-readout {
        min-width: 96px; padding: 3px 10px; border-radius: 99px; background: var(--panel); border: 1px solid var(--line);
        text-align: center; font-variant-numeric: tabular-nums; white-space: nowrap;
      }
      `,
    nouislider: `
      .nu-card { position: absolute; padding: 28px 36px 40px; border: 1px solid var(--line); border-radius: 10px;
        background: color-mix(in srgb, var(--panel) 60%, var(--bg)); box-shadow: 0 1px 3px rgba(0,0,0,.06); }
      .nu-card.vertical { padding: 46px 70px 28px 50px; }
      .nu-grid { display: grid; grid-template-columns: auto auto auto; column-gap: 24px; row-gap: 60px; align-items: center; }
      .nu-grid.no-readout { grid-template-columns: auto auto; }
      .nu-row { display: flex; align-items: flex-start; gap: 90px; }
      .nu-col { display: flex; flex-direction: column; align-items: center; gap: 26px; }
      .nu-label { min-width: 96px; font-weight: 600; text-align: right; white-space: nowrap; }
      .nu-col .nu-label { min-width: 0; text-align: center; }
      .nu-readout { width: 128px; padding: 4px 10px; border: 1px solid var(--line); border-radius: 6px; background: var(--panel);
        font-variant-numeric: tabular-nums; text-align: center; white-space: nowrap; overflow: hidden; }
      .nu-wrap { position: relative; }
      .nu-wrap .noUi-target { margin: 0; }

      .noUi-target, .noUi-target * { -webkit-touch-callout: none; -webkit-tap-highlight-color: rgba(0,0,0,0); user-select: none; touch-action: none; box-sizing: border-box; }
      .noUi-target { position: relative; }
      .noUi-base, .noUi-connects { width: 100%; height: 100%; position: relative; z-index: 1; }
      .noUi-connects { overflow: hidden; z-index: 0; }
      .noUi-connect, .noUi-origin { will-change: transform; position: absolute; z-index: 1; top: 0; right: 0; height: 100%; width: 100%;
        transform-origin: 0 0; transform-style: flat; }
      .noUi-vertical .noUi-origin { top: -100%; width: 0; }
      .noUi-horizontal .noUi-origin { height: 0; }
      .noUi-handle { position: absolute; backface-visibility: hidden; outline: none; }
      .noUi-touch-area { height: 100%; width: 100%; }
      .noUi-state-tap .noUi-connect, .noUi-state-tap .noUi-origin { transition: none; }
      .noUi-state-drag * { cursor: inherit !important; }
      .noUi-horizontal { height: var(--nu-rail); }
      .noUi-vertical { width: var(--nu-rail); }
      .noUi-horizontal .noUi-handle { width: var(--nu-hw); height: var(--nu-hh); right: calc(var(--nu-hw) / -2); top: calc((var(--nu-rail) - var(--nu-hh)) / 2); }
      .noUi-vertical .noUi-handle { width: var(--nu-hh); height: var(--nu-hw); right: calc((var(--nu-rail) - var(--nu-hh)) / 2); bottom: calc(var(--nu-hw) / -2); }
      .noUi-target { background: var(--line); border-radius: 99px; }
      .noUi-connects { border-radius: 99px; }
      .noUi-connect { background: var(--accent); }
      .noUi-handle { border: 2px solid var(--accent); border-radius: 50%; background: var(--panel); cursor: pointer; }
      .noUi-active, .noUi-handle:focus-visible { box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 35%, transparent); }
      .nu-bevel .noUi-target { border-radius: 4px; border: 1px solid var(--line); background: var(--panel); box-shadow: inset 0 1px 2px rgba(0,0,0,.15); }
      .nu-bevel .noUi-connects { border-radius: 3px; }
      .nu-bevel .noUi-handle { border: 1px solid var(--line); border-radius: 4px; background: linear-gradient(var(--panel), color-mix(in srgb, var(--panel) 80%, var(--line)));
        box-shadow: 0 1px 3px rgba(0,0,0,.3); }
      .nu-bevel .noUi-handle::before { content: ""; position: absolute; left: 50%; top: 22%; bottom: 22%; width: 2px; margin-left: -1px; background: var(--line); }
      .nu-bevel.nu-v .noUi-handle::before { left: 22%; right: 22%; top: 50%; bottom: auto; width: auto; height: 2px; margin: -1px 0 0; }
      .nu-pill .noUi-target { border-radius: 99px; background: color-mix(in srgb, var(--accent) 18%, var(--panel)); }
      .nu-pill .noUi-handle { border: 0; border-radius: 99px; background: var(--accent); box-shadow: 0 1px 4px rgba(0,0,0,.35); }
      .nu-dense .noUi-target { border-radius: 0; }
      .nu-dense .noUi-handle { border-width: 1px; border-radius: 2px; box-shadow: none; background: var(--accent); }
      .noUi-pips { position: absolute; color: var(--muted); font-size: 12px; box-sizing: border-box; }
      .noUi-pips * { box-sizing: border-box; }
      .noUi-value { position: absolute; white-space: nowrap; text-align: center; }
      .noUi-marker { position: absolute; background: var(--line); }
      .noUi-pips-horizontal { padding: 8px 0; height: 60px; top: 100%; left: 0; width: 100%; }
      .noUi-value-horizontal { transform: translate(-50%, 50%); margin-top: 8px; }
      .noUi-marker-horizontal.noUi-marker { margin-left: -1px; width: 2px; height: 6px; }
      .noUi-marker-horizontal.noUi-marker-large { height: 10px; }
      .noUi-pips-vertical { padding: 0 8px; height: 100%; top: 0; left: 100%; }
      .noUi-value-vertical { transform: translate(0, -50%); padding-left: 16px; }
      .noUi-marker-vertical.noUi-marker { width: 6px; height: 2px; margin-top: -1px; }
      .noUi-marker-vertical.noUi-marker-large { width: 10px; }
      .noUi-tooltip { display: block; position: absolute; border: 1px solid var(--line); border-radius: 4px; background: var(--panel); color: var(--fg);
        padding: 3px 7px; font-size: 13px; font-variant-numeric: tabular-nums; text-align: center; white-space: nowrap; pointer-events: none; }
      .noUi-horizontal .noUi-tooltip { transform: translate(-50%, 0); left: 50%; bottom: 125%; }
      .noUi-vertical .noUi-tooltip { transform: translate(0, -50%); top: 50%; right: 125%; }
      `,
  }));
})();
