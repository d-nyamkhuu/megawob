/* act-in-time/_styles: shared template implementation; parts remain on the calling template. */
(function () {
  'use strict';
  const referenceCSS = `
      .ut-arena { position: absolute; display: flex; flex-direction: column; overflow: hidden;
        background: var(--panel); border: 1px solid var(--line); border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 12px 32px rgba(0,0,0,.06); }
      .ut-bar { flex: none; display: flex; align-items: center; gap: 14px; height: 50px; padding: 0 16px 0 18px;
        border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
      .ut-app { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 15px; }
      .ut-app i { width: 22px; height: 22px; border-radius: 6px; background: var(--accent); display: flex; align-items: center; justify-content: center; }
      .ut-app i svg { width: 14px; height: 14px; }
      .ut-app small { font-weight: 500; color: var(--muted); font-size: 13.5px; }
      .ut-status { margin-left: auto; font-size: 13.5px; color: var(--muted); white-space: nowrap; }
      .ut-status b { color: var(--fg); }
      .ut-clock { display: flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border-radius: 14px;
        border: 1px solid var(--line); background: var(--panel); font: 600 13px/1 ui-monospace, "DejaVu Sans Mono", monospace; }
      .ut-clock svg { width: 14px; height: 14px; color: var(--muted); }
      .ut-body { flex: 1; min-height: 0; position: relative; display: flex; gap: 20px; padding: 20px; }
      .ut-main { flex: 1; min-width: 0; position: relative; display: flex; align-items: center; justify-content: center; }
      .ut-side { flex: none; width: 210px; display: flex; flex-direction: column; gap: 14px; }
      .ut-card { border: 1px solid var(--line); border-radius: 9px; padding: 12px 14px; background: var(--panel); }
      .ut-k { font-size: 11.5px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); font-weight: 600; }
      .ut-v { margin-top: 4px; font-size: 24px; font-weight: 700; font-variant-numeric: tabular-nums; }
      .ut-v small { font-size: 13px; font-weight: 500; color: var(--muted); }
      .ut-meter { margin-top: 8px; height: 8px; border-radius: 4px; background: color-mix(in srgb, var(--fg) 10%, var(--panel)); overflow: hidden; position: relative; }
      .ut-meter i { position: absolute; left: 0; top: 0; bottom: 0; background: var(--accent); }
      .ut-meter u { position: absolute; top: -2px; bottom: -2px; width: 2px; background: var(--fg); opacity: .55; }
      .ut-note { font-size: 13px; color: var(--muted); line-height: 1.45; }
      .ut-pill { display: inline-flex; align-items: center; gap: 6px; padding: 3px 9px; border-radius: 11px; font-size: 12.5px; font-weight: 600;
        background: color-mix(in srgb, var(--fg) 7%, var(--panel)); color: var(--muted); }
      .ut-pill.on { background: color-mix(in srgb, #2f9e44 18%, var(--panel)); color: #2b8a3e; }
      .ut-pill.off { background: color-mix(in srgb, #e03131 14%, var(--panel)); color: #c92a2a; }

      .ut-board { display: block; border-radius: 10px; border: 1px solid var(--line); touch-action: none;
        background: color-mix(in srgb, var(--fg) 2.5%, var(--panel)); }
      .ut-board.chase { cursor: crosshair; }
      .ut-grid line { stroke: color-mix(in srgb, var(--fg) 9%, transparent); }
      .ut-circle { fill: color-mix(in srgb, var(--accent) 28%, transparent); stroke: var(--accent); }
      .ut-dot { fill: var(--accent); }
      .ut-trail { fill: none; stroke: var(--accent); opacity: .45; stroke-dasharray: 4 5; }
      .ut-lane { fill: color-mix(in srgb, var(--fg) 4%, transparent); }
      .ut-lane.alt { fill: transparent; }
      .ut-lanemark { stroke: color-mix(in srgb, var(--fg) 14%, transparent); stroke-dasharray: 6 8; }
      .ut-chev { fill: none; stroke: color-mix(in srgb, var(--fg) 28%, transparent); stroke-linecap: round; stroke-linejoin: round; }
      .ut-item { stroke: rgba(255,255,255,.9); cursor: pointer; }
      .ut-swatch { display: inline-block; width: 16px; height: 16px; border-radius: 4px; vertical-align: -3px; margin-right: 6px; }
      .ut-tally { display: flex; gap: 6px; margin-top: 8px; }
      .ut-tally i { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--line); }
      .ut-tally i.got { border-color: transparent; }

      .ut-dl { position: absolute; width: 440px; padding: 22px 24px 20px; border: 1px solid var(--line); border-radius: 12px; background: var(--panel);
        box-shadow: 0 4px 18px rgba(0,0,0,.07); }
      .ut-dl h3 { margin: 0 0 4px; font-size: 18px; }
      .ut-dl p { margin: 0 0 14px; color: var(--muted); font-size: 14px; }
      .ut-dlstate { display: flex; align-items: center; gap: 10px; height: 34px; margin-bottom: 14px; font-size: 14px; font-weight: 600; }
      .ut-dlstate svg { width: 22px; height: 22px; }
      .ut-spin-track { stroke: color-mix(in srgb, var(--fg) 12%, transparent); }
      .ut-spin-arc { stroke: var(--accent); }
      .ut-row { display: flex; gap: 10px; }
      .ut-btn { height: 38px; padding: 0 18px; border-radius: 7px; font: inherit; font-size: 14.5px; font-weight: 600; cursor: pointer;
        border: 1px solid color-mix(in srgb, var(--fg) 20%, var(--line)); color: var(--fg); background: color-mix(in srgb, var(--fg) 4%, var(--panel)); }
      .ut-btn:hover { background: color-mix(in srgb, var(--fg) 9%, var(--panel)); }
      .ut-btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
      .ut-btn.primary[aria-disabled="true"] { background: color-mix(in srgb, var(--fg) 12%, var(--panel)); border-color: transparent;
        color: color-mix(in srgb, var(--fg) 40%, var(--panel)); cursor: not-allowed; }
      .ut-btn.primary.skeleton, .ut-btn.skeleton { color: transparent; border-color: transparent; cursor: default;
        background: repeating-linear-gradient(110deg, color-mix(in srgb, var(--fg) 8%, var(--panel)) 0 18px, color-mix(in srgb, var(--fg) 12%, var(--panel)) 18px 36px); }
      .ut-btn[data-clicked] { box-shadow: inset 0 2px 5px rgba(0,0,0,.25); }
      .ut-surface { position: relative; border: 1px dashed color-mix(in srgb, var(--fg) 25%, var(--line)); border-radius: 10px;
        background-image: radial-gradient(color-mix(in srgb, var(--fg) 14%, transparent) 1px, transparent 1px); background-size: 16px 16px; }
      .ut-surface .ut-btn { position: absolute; width: 92px; height: 54px; padding: 0; font-size: 15px; }

      .ut-simon { display: block; }
      .ut-pad { cursor: pointer; fill-opacity: .32; stroke: var(--panel); stroke-width: 0.035; }
      .ut-simon[data-phase="input"] .ut-pad { fill-opacity: .62; }
      .ut-simon[data-phase="input"] .ut-pad:hover { fill-opacity: .8; }
      .ut-simon[data-phase="show"] .ut-pad { cursor: default; }
      .ut-pad[data-lit] { fill-opacity: 1 !important; stroke: #fff; stroke-width: 0.04; }
      .ut-hub { fill: var(--fg); }
      .ut-hubt { fill: var(--panel); font-weight: 800; text-anchor: middle; dominant-baseline: central; letter-spacing: .04em; }
      .ut-steps { display: flex; gap: 7px; margin-top: 8px; flex-wrap: wrap; }
      .ut-steps i { width: 14px; height: 14px; border-radius: 50%; background: color-mix(in srgb, var(--fg) 12%, var(--panel)); }
      .ut-steps i.on { background: var(--accent); }

      .ut-chart { display: block; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); }
      .ut-ax { stroke: color-mix(in srgb, var(--fg) 10%, transparent); }
      .ut-axt { fill: var(--muted); font-size: 11.5px; font-family: ui-monospace, "DejaVu Sans Mono", monospace; }
      .ut-line { fill: none; stroke: var(--accent); stroke-width: 2.2; stroke-linejoin: round; }
      .ut-area { fill: color-mix(in srgb, var(--accent) 12%, transparent); }
      .ut-now { stroke: color-mix(in srgb, var(--fg) 30%, transparent); stroke-dasharray: 3 4; }
      .ut-pt { fill: var(--accent); stroke: var(--panel); stroke-width: 2; }
      .ut-buypt { fill: #2f9e44; stroke: var(--panel); stroke-width: 2; }
      .ut-sym { display: inline-block; padding: 2px 8px; border-radius: 5px; font: 700 13px ui-monospace, "DejaVu Sans Mono", monospace;
        background: var(--fg); color: var(--panel); margin-left: 6px; }
      .ut-price { font-size: 34px; font-weight: 800; font-variant-numeric: tabular-nums; margin-top: 2px; }
      .ut-chg { font-size: 13.5px; font-weight: 600; font-variant-numeric: tabular-nums; }
      .ut-chg.up { color: #2b8a3e; }
      .ut-chg.dn { color: #c92a2a; }
      .ut-buy { width: 100%; height: 44px; font-size: 16px; }
      .ut-buy[data-done] { background: color-mix(in srgb, #2f9e44 20%, var(--panel)); border-color: transparent; color: #2b8a3e; cursor: default; }

      .ut-login { position: absolute; width: 340px; padding: 22px 24px; border: 1px solid var(--line); border-radius: 12px; background: var(--panel);
        box-shadow: 0 4px 18px rgba(0,0,0,.07); }
      .ut-login h3 { margin: 0 0 14px; font-size: 19px; }
      .ut-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
      .ut-field label { font-size: 13px; font-weight: 600; color: var(--muted); }
      .ut-input { height: 36px; padding: 0 10px; border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); border-radius: 6px;
        background: var(--panel); color: var(--fg); font: inherit; font-size: 15px; user-select: text; -webkit-user-select: text; }
      .ut-input:focus { outline: 2px solid color-mix(in srgb, var(--accent) 45%, transparent); outline-offset: 0; border-color: var(--accent); }
      .ut-input:disabled { background: color-mix(in srgb, var(--fg) 5%, var(--panel)); color: var(--muted); }
      .ut-login .ut-btn { width: 100%; margin-top: 4px; }
      .ut-signed { margin-top: 12px; padding: 8px 10px; border-radius: 6px; font-size: 13.5px; font-weight: 600;
        background: color-mix(in srgb, #2f9e44 15%, var(--panel)); color: #2b8a3e; }
      .ut-signed[hidden] { display: none; }
      .ut-backdrop { position: absolute; inset: 0; z-index: 10; background: rgba(15, 18, 25, .38); }
      .ut-backdrop[hidden], .ut-dialog[hidden] { display: none; }
      .ut-dialog { position: absolute; z-index: 11; width: 330px; padding: 18px 20px 16px; border-radius: 10px; background: var(--panel);
        border: 1px solid var(--line); box-shadow: 0 18px 50px rgba(0,0,0,.3); }
      .ut-dialog p { margin: 0 0 10px; line-height: 1.5; }
      .ut-dialog .ut-row { justify-content: flex-end; margin-top: 6px; }

      .ut-err { margin: -2px 0 10px; padding: 7px 10px; border-radius: 6px; font-size: 13.5px; font-weight: 600;
        background: color-mix(in srgb, #e03131 13%, var(--panel)); color: #c92a2a; }
      .ut-err[hidden], .ut-cookie[hidden], .ut-left[hidden] { display: none; }
      .ut-link { color: var(--accent); cursor: pointer; font-size: 13px; font-weight: 600; background: none; border: 0; padding: 0; font-family: inherit; }
      .ut-link:hover { text-decoration: underline; }
      .ut-foot { display: flex; justify-content: flex-end; margin-top: 10px; }
      .ut-cookie { position: absolute; left: 0; right: 0; bottom: 0; z-index: 9; display: flex; align-items: center; gap: 14px; padding: 12px 18px;
        background: color-mix(in srgb, var(--fg) 92%, var(--panel)); color: var(--panel); box-shadow: 0 -6px 20px rgba(0,0,0,.18); }
      .ut-cookie p { flex: 1; margin: 0; font-size: 13.5px; line-height: 1.4; }
      .ut-cookie .ut-btn { flex: none; height: 34px; padding: 0 14px; font-size: 13.5px; }
      .ut-cookie .ut-btn.ghost { background: transparent; color: var(--panel); border-color: color-mix(in srgb, var(--panel) 60%, transparent); }
      .ut-left { position: absolute; inset: 0; z-index: 12; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;
        background: var(--panel); }
      .ut-left h3 { margin: 0; font-size: 20px; }
      .ut-left p { margin: 0; color: var(--muted); }

      .ut-col { position: absolute; display: flex; flex-direction: column; gap: 12px; }
      .ut-searchrow { flex: none; display: flex; gap: 10px; }
      .ut-sbox { flex: 1; display: flex; align-items: center; gap: 9px; height: 40px; padding: 0 12px; border-radius: 8px;
        border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); background: var(--panel); font-size: 15px; }
      .ut-sbox svg { width: 17px; height: 17px; color: var(--muted); flex: none; }
      .ut-sbox span { flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
      .ut-searchrow .ut-btn { height: 40px; }
      .ut-res { position: relative; flex: 1; min-height: 0; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
      .ut-reshead { display: flex; align-items: center; justify-content: space-between; height: 32px; padding: 0 12px; font-size: 13px; color: var(--muted);
        border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 2.5%, var(--panel)); }
      .ut-empty { position: absolute; inset: 32px 0 0; display: flex; align-items: center; justify-content: center; gap: 10px; color: var(--muted); font-size: 14px; }
      .ut-empty svg { width: 22px; height: 22px; }
      .ut-row2 { display: flex; align-items: center; gap: 12px; padding: 0 12px; border-bottom: 1px solid var(--line); cursor: pointer; }
      .ut-row2:hover { background: color-mix(in srgb, var(--accent) 7%, var(--panel)); }
      .ut-thumb { flex: none; width: 30px; height: 30px; border-radius: 6px; }
      .ut-rn { flex: 1; min-width: 0; line-height: 1.2; }
      .ut-rn b { display: block; font-weight: 600; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: var(--accent); }
      .ut-rn small { color: var(--muted); font-size: 12px; }
      .ut-rp { flex: none; font-weight: 700; font-variant-numeric: tabular-nums; }
      .ut-skel { height: 12px; border-radius: 6px; background: color-mix(in srgb, var(--fg) 9%, var(--panel)); }
      .ut-detail { position: absolute; inset: 32px 0 0; padding: 16px 18px; background: var(--panel); }
      .ut-detail h3 { margin: 10px 0 6px; font-size: 19px; }
      .ut-detail p { margin: 0 0 10px; color: var(--muted); }
      .ut-detail .ut-price { font-size: 26px; }

      .ut-verify { position: absolute; display: flex; gap: 22px; padding: 20px 22px; border: 1px solid var(--line); border-radius: 12px; background: var(--panel);
        box-shadow: 0 4px 18px rgba(0,0,0,.07); }
      .ut-vl { width: 260px; display: flex; flex-direction: column; gap: 10px; }
      .ut-vl h3 { margin: 0; font-size: 18px; }
      .ut-vl p { margin: 0; color: var(--muted); font-size: 13.5px; line-height: 1.45; }
      .ut-boxes { display: flex; gap: 6px; }
      .ut-boxes i { flex: 1; max-width: 36px; height: 42px; border-radius: 7px; border: 1.5px solid color-mix(in srgb, var(--fg) 22%, var(--line));
        display: flex; align-items: center; justify-content: center; font: 700 20px ui-monospace, "DejaVu Sans Mono", monospace; font-style: normal; }
      .ut-boxes i.cur { border-color: var(--accent); }
      .ut-ok { color: #2b8a3e; font-weight: 700; }
      .ut-pad3 { display: grid; grid-template-columns: repeat(3, 54px); grid-auto-rows: 46px; gap: 7px; }
      .ut-pad3 .ut-btn { height: auto; padding: 0; font-size: 18px; }
      .ut-ctoast { position: absolute; z-index: 14; width: 270px; padding: 12px 14px 14px; border-radius: 10px; background: var(--fg); color: var(--panel);
        box-shadow: 0 10px 28px rgba(0,0,0,.28); }
      .ut-ctoast[hidden] { display: none; }
      .ut-ctoast small { display: block; opacity: .75; font-size: 12px; margin-bottom: 3px; }
      .ut-ctoast b { font: 700 22px ui-monospace, "DejaVu Sans Mono", monospace; letter-spacing: .12em; }
      .ut-life { position: absolute; left: 0; bottom: 0; height: 3px; background: var(--accent); border-radius: 0 0 0 10px; }

      .ut-hold { position: absolute; width: 470px; padding: 18px 20px; border: 1px solid var(--line); border-radius: 12px; background: var(--panel);
        box-shadow: 0 4px 18px rgba(0,0,0,.07); }
      .ut-holdhead { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      .ut-holdhead h3 { margin: 0; font-size: 17px; }
      .ut-timer { flex: none; padding: 4px 10px; border-radius: 13px; font: 700 14px ui-monospace, "DejaVu Sans Mono", monospace;
        background: color-mix(in srgb, var(--accent) 14%, var(--panel)); color: var(--accent); }
      .ut-timer.low { background: color-mix(in srgb, #e03131 16%, var(--panel)); color: #c92a2a; }
      .ut-holdbar { position: relative; height: 4px; margin: 10px 0 12px; border-radius: 2px; background: color-mix(in srgb, var(--fg) 10%, var(--panel)); overflow: hidden; }
      .ut-holdbar i { position: absolute; left: 0; top: 0; bottom: 0; background: var(--accent); }
      .ut-grp { margin-bottom: 12px; }
      .ut-grp .ut-k { margin-bottom: 6px; }
      .ut-chips { display: flex; flex-wrap: wrap; gap: 7px; }
      .ut-chip { height: 32px; padding: 0 13px; border-radius: 16px; border: 1px solid color-mix(in srgb, var(--fg) 20%, var(--line)); background: var(--panel);
        color: var(--fg); font: inherit; font-size: 13.5px; cursor: pointer; }
      .ut-chip.on { background: var(--accent); border-color: var(--accent); color: #fff; font-weight: 600; }
      .ut-done { margin-top: 10px; padding: 9px 12px; border-radius: 7px; display: flex; align-items: center; justify-content: space-between; gap: 10px;
        background: color-mix(in srgb, #2f9e44 14%, var(--panel)); color: #2b8a3e; font-weight: 600; font-size: 13.5px; }
      .ut-done[hidden] { display: none; }

      .ut-car { position: absolute; display: flex; flex-direction: column; gap: 10px; }
      .ut-car h4 { margin: 0; font-size: 15px; }
      .ut-stage2 { position: relative; overflow: hidden; border-radius: 14px; }
      .ut-slide { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; gap: 8px; padding: 0 72px; color: #fff; cursor: pointer; }
      .ut-slide[hidden] { display: none; }
      .ut-slide b { font-size: 24px; line-height: 1.2; text-shadow: 0 1px 2px rgba(0,0,0,.25); }
      .ut-slide span { font-size: 14.5px; opacity: .92; }
      .ut-cta { align-self: flex-start; margin-top: 6px; padding: 7px 16px; border-radius: 17px; background: #fff; color: #1d2330; font-weight: 700; font-size: 13.5px; }
      .ut-arrow { position: absolute; top: 50%; z-index: 2; width: 38px; height: 38px; margin-top: -19px; border-radius: 50%; border: 0; cursor: pointer;
        background: rgba(255,255,255,.88); color: #1d2330; font-size: 22px; line-height: 38px; text-align: center; box-shadow: 0 2px 6px rgba(0,0,0,.2); padding: 0; }
      .ut-arrow.prev { left: 14px; }
      .ut-arrow.next { right: 14px; }
      .ut-prog { position: absolute; left: 0; bottom: 0; height: 4px; background: rgba(255,255,255,.85); z-index: 2; }
      .ut-paused { position: absolute; right: 14px; top: 12px; z-index: 2; padding: 2px 9px; border-radius: 10px; font-size: 12px; font-weight: 700;
        background: rgba(0,0,0,.45); color: #fff; }
      .ut-paused[hidden] { display: none; }
      .ut-dots { display: flex; justify-content: center; gap: 9px; }
      .ut-dot { width: 22px; height: 22px; border-radius: 50%; border: 0; padding: 0; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; }
      .ut-dot::after { content: ''; width: 10px; height: 10px; border-radius: 50%; background: color-mix(in srgb, var(--fg) 22%, var(--panel)); }
      .ut-dot.on::after { background: var(--accent); width: 12px; height: 12px; }
      .ut-tiles { display: flex; gap: 10px; }
      .ut-tile { flex: 1; height: 54px; border-radius: 9px; border: 1px solid var(--line); padding: 8px 10px; font-size: 12.5px; color: var(--muted); overflow: hidden; }
      .ut-page { position: absolute; inset: 0; z-index: 3; display: flex; flex-direction: column; justify-content: center; gap: 10px; padding: 0 30px;
        background: var(--panel); border: 1px solid var(--line); border-radius: 14px; }
      .ut-page[hidden] { display: none; }
      .ut-page h3 { margin: 0; font-size: 21px; }
      .ut-page p { margin: 0; color: var(--muted); }

      .ut-trip { position: absolute; width: 420px; padding: 18px 20px; border: 1px solid var(--line); border-radius: 12px; background: var(--panel);
        box-shadow: 0 4px 18px rgba(0,0,0,.07); }
      .ut-trip h3 { margin: 0 0 12px; font-size: 18px; }
      .ut-ac { position: relative; }
      .ut-ac .ut-input { width: 100%; box-sizing: border-box; height: 40px; padding-right: 36px; }
      .ut-acspin { position: absolute; right: 10px; top: 9px; width: 22px; height: 22px; }
      .ut-acspin[hidden] { display: none; }
      .ut-sug { position: absolute; left: 0; right: 0; top: 44px; z-index: 6; border: 1px solid var(--line); border-radius: 8px; background: var(--panel);
        box-shadow: 0 10px 26px rgba(0,0,0,.15); overflow: hidden; }
      .ut-sug[hidden] { display: none; }
      .ut-sopt { display: flex; align-items: center; justify-content: space-between; gap: 10px; height: 38px; padding: 0 12px; cursor: pointer; font-size: 14.5px; }
      .ut-sopt small { color: var(--muted); }
      .ut-sopt i { font-style: normal; font: 600 12px ui-monospace, "DejaVu Sans Mono", monospace; color: var(--muted); }
      .ut-sopt:hover, .ut-sopt.act { background: color-mix(in srgb, var(--accent) 12%, var(--panel)); }
      .ut-snote { display: flex; align-items: center; gap: 8px; height: 38px; padding: 0 12px; color: var(--muted); font-size: 13.5px; }
      .ut-snote svg { width: 18px; height: 18px; }
      .ut-fake { display: flex; gap: 10px; margin-top: 12px; }
      .ut-fake div { flex: 1; }

      .ut-sinput { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; color: inherit; font: inherit; }
      .ut-sbox .ut-sspin { flex: none; width: 20px; height: 20px; color: inherit; }
      .ut-avatar { flex: none; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
        font-size: 12px; font-weight: 700; color: #fff; }
      .ut-rt { flex: none; font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
      .ut-list.busy { opacity: .42; }
      .ut-busy { display: flex; align-items: center; gap: 6px; }
      .ut-busy svg { width: 16px; height: 16px; }
      .ut-chips2 { display: flex; flex-wrap: wrap; gap: 8px; }
      .ut-chips2 .ut-btn { min-width: 112px; }
      .ut-dlbar { position: relative; height: 4px; margin: 0 0 14px; border-radius: 2px; background: color-mix(in srgb, var(--fg) 10%, var(--panel)); overflow: hidden; }
      .ut-dlbar i { position: absolute; left: 0; top: 0; bottom: 0; background: var(--accent); }
      .ut-dlbar.low i { background: #e03131; }
      .ut-fake span { display: flex; align-items: center; height: 36px; padding: 0 10px; border-radius: 6px; border: 1px solid var(--line); color: var(--muted); font-size: 14px; }
      `;
  const arenaCSS = `
  .ut-arena { position: absolute; display: flex; flex-direction: column; overflow: hidden;
    background: var(--panel); border: 1px solid var(--line); border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 12px 32px rgba(0,0,0,.06); }
  .ut-bar { flex: none; display: flex; align-items: center; gap: 14px; height: 50px; padding: 0 16px 0 18px;
    border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
  .ut-app { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 15px; }
  .ut-app i { width: 22px; height: 22px; border-radius: 6px; background: var(--accent); display: flex; align-items: center; justify-content: center; }
  .ut-app i svg { width: 14px; height: 14px; }
  .ut-app small { font-weight: 500; color: var(--muted); font-size: 13.5px; }
  .ut-status { margin-left: auto; font-size: 13.5px; color: var(--muted); white-space: nowrap; }
  .ut-status b { color: var(--fg); }
  .ut-clock { display: flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border-radius: 14px;
    border: 1px solid var(--line); background: var(--panel); font: 600 13px/1 ui-monospace, "DejaVu Sans Mono", monospace; }
  .ut-clock svg { width: 14px; height: 14px; color: var(--muted); }
  .ut-body { flex: 1; min-height: 0; position: relative; display: flex; gap: 20px; padding: 20px; }
  .ut-main { flex: 1; min-width: 0; position: relative; display: flex; align-items: center; justify-content: center; }
  .ut-side { flex: none; width: 210px; display: flex; flex-direction: column; gap: 14px; }
  .ut-card { border: 1px solid var(--line); border-radius: 9px; padding: 12px 14px; background: var(--panel); }
  .ut-k { font-size: 11.5px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); font-weight: 600; }
  .ut-v { margin-top: 4px; font-size: 24px; font-weight: 700; font-variant-numeric: tabular-nums; }
  .ut-v small { font-size: 13px; font-weight: 500; color: var(--muted); }
  .ut-meter { margin-top: 8px; height: 8px; border-radius: 4px; background: color-mix(in srgb, var(--fg) 10%, var(--panel)); overflow: hidden; position: relative; }
  .ut-meter i { position: absolute; left: 0; top: 0; bottom: 0; background: var(--accent); }
  .ut-meter u { position: absolute; top: -2px; bottom: -2px; width: 2px; background: var(--fg); opacity: .55; }
  .ut-note { font-size: 13px; color: var(--muted); line-height: 1.45; }
  .ut-pill { display: inline-flex; align-items: center; gap: 6px; padding: 3px 9px; border-radius: 11px; font-size: 12.5px; font-weight: 600;
    background: color-mix(in srgb, var(--fg) 7%, var(--panel)); color: var(--muted); }
  .ut-pill.on { background: color-mix(in srgb, #2f9e44 18%, var(--panel)); color: #2b8a3e; }
  .ut-pill.off { background: color-mix(in srgb, #e03131 14%, var(--panel)); color: #c92a2a; }

  .ut-board { display: block; border-radius: 10px; border: 1px solid var(--line); touch-action: none;
    background: color-mix(in srgb, var(--fg) 2.5%, var(--panel)); }
  .ut-board.chase { cursor: crosshair; }
  .ut-grid line { stroke: color-mix(in srgb, var(--fg) 9%, transparent); }
  .ut-circle { fill: color-mix(in srgb, var(--accent) 28%, transparent); stroke: var(--accent); }
  .ut-dot { fill: var(--accent); }
  .ut-trail { fill: none; stroke: var(--accent); opacity: .45; stroke-dasharray: 4 5; }
  .ut-lane { fill: color-mix(in srgb, var(--fg) 4%, transparent); }
  .ut-lane.alt { fill: transparent; }
  .ut-lanemark { stroke: color-mix(in srgb, var(--fg) 14%, transparent); stroke-dasharray: 6 8; }
  .ut-chev { fill: none; stroke: color-mix(in srgb, var(--fg) 28%, transparent); stroke-linecap: round; stroke-linejoin: round; }
  .ut-item { stroke: rgba(255,255,255,.9); cursor: pointer; }
  .ut-swatch { display: inline-block; width: 16px; height: 16px; border-radius: 4px; vertical-align: -3px; margin-right: 6px; }
  .ut-tally { display: flex; gap: 6px; margin-top: 8px; }
  .ut-tally i { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--line); }
  .ut-tally i.got { border-color: transparent; }

  .ut-dl { position: absolute; width: 440px; padding: 22px 24px 20px; border: 1px solid var(--line); border-radius: 12px; background: var(--panel);
    box-shadow: 0 4px 18px rgba(0,0,0,.07); }
  .ut-dl h3 { margin: 0 0 4px; font-size: 18px; }
  .ut-dl p { margin: 0 0 14px; color: var(--muted); font-size: 14px; }
  .ut-dlstate { display: flex; align-items: center; gap: 10px; height: 34px; margin-bottom: 14px; font-size: 14px; font-weight: 600; }
  .ut-dlstate svg { width: 22px; height: 22px; }
  .ut-spin-track { stroke: color-mix(in srgb, var(--fg) 12%, transparent); }
  .ut-spin-arc { stroke: var(--accent); }
  .ut-row { display: flex; gap: 10px; }
  .ut-btn { height: 38px; padding: 0 18px; border-radius: 7px; font: inherit; font-size: 14.5px; font-weight: 600; cursor: pointer;
    border: 1px solid color-mix(in srgb, var(--fg) 20%, var(--line)); color: var(--fg); background: color-mix(in srgb, var(--fg) 4%, var(--panel)); }
  .ut-btn:hover { background: color-mix(in srgb, var(--fg) 9%, var(--panel)); }
  .ut-btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
  .ut-btn.primary[aria-disabled="true"] { background: color-mix(in srgb, var(--fg) 12%, var(--panel)); border-color: transparent;
    color: color-mix(in srgb, var(--fg) 40%, var(--panel)); cursor: not-allowed; }
  .ut-btn.primary.skeleton, .ut-btn.skeleton { color: transparent; border-color: transparent; cursor: default;
    background: repeating-linear-gradient(110deg, color-mix(in srgb, var(--fg) 8%, var(--panel)) 0 18px, color-mix(in srgb, var(--fg) 12%, var(--panel)) 18px 36px); }
  .ut-btn[data-clicked] { box-shadow: inset 0 2px 5px rgba(0,0,0,.25); }
  .ut-surface { position: relative; border: 1px dashed color-mix(in srgb, var(--fg) 25%, var(--line)); border-radius: 10px;
    background-image: radial-gradient(color-mix(in srgb, var(--fg) 14%, transparent) 1px, transparent 1px); background-size: 16px 16px; }
  .ut-surface .ut-btn { position: absolute; width: 92px; height: 54px; padding: 0; font-size: 15px; }

  .ut-simon { display: block; }
  .ut-pad { cursor: pointer; fill-opacity: .32; stroke: var(--panel); stroke-width: 0.035; }
  .ut-simon[data-phase="input"] .ut-pad { fill-opacity: .62; }
  .ut-simon[data-phase="input"] .ut-pad:hover { fill-opacity: .8; }
  .ut-simon[data-phase="show"] .ut-pad { cursor: default; }
  .ut-pad[data-lit] { fill-opacity: 1 !important; stroke: #fff; stroke-width: 0.04; }
  .ut-hub { fill: var(--fg); }
  .ut-hubt { fill: var(--panel); font-weight: 800; text-anchor: middle; dominant-baseline: central; letter-spacing: .04em; }
  .ut-steps { display: flex; gap: 7px; margin-top: 8px; flex-wrap: wrap; }
  .ut-steps i { width: 14px; height: 14px; border-radius: 50%; background: color-mix(in srgb, var(--fg) 12%, var(--panel)); }
  .ut-steps i.on { background: var(--accent); }

  .ut-chart { display: block; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); }
  .ut-ax { stroke: color-mix(in srgb, var(--fg) 10%, transparent); }
  .ut-axt { fill: var(--muted); font-size: 11.5px; font-family: ui-monospace, "DejaVu Sans Mono", monospace; }
  .ut-line { fill: none; stroke: var(--accent); stroke-width: 2.2; stroke-linejoin: round; }
  .ut-area { fill: color-mix(in srgb, var(--accent) 12%, transparent); }
  .ut-now { stroke: color-mix(in srgb, var(--fg) 30%, transparent); stroke-dasharray: 3 4; }
  .ut-pt { fill: var(--accent); stroke: var(--panel); stroke-width: 2; }
  .ut-buypt { fill: #2f9e44; stroke: var(--panel); stroke-width: 2; }
  .ut-sym { display: inline-block; padding: 2px 8px; border-radius: 5px; font: 700 13px ui-monospace, "DejaVu Sans Mono", monospace;
    background: var(--fg); color: var(--panel); margin-left: 6px; }
  .ut-price { font-size: 34px; font-weight: 800; font-variant-numeric: tabular-nums; margin-top: 2px; }
  .ut-chg { font-size: 13.5px; font-weight: 600; font-variant-numeric: tabular-nums; }
  .ut-chg.up { color: #2b8a3e; }
  .ut-chg.dn { color: #c92a2a; }
  .ut-buy { width: 100%; height: 44px; font-size: 16px; }
  .ut-buy[data-done] { background: color-mix(in srgb, #2f9e44 20%, var(--panel)); border-color: transparent; color: #2b8a3e; cursor: default; }

  .ut-login { position: absolute; width: 340px; padding: 22px 24px; border: 1px solid var(--line); border-radius: 12px; background: var(--panel);
    box-shadow: 0 4px 18px rgba(0,0,0,.07); }
  .ut-login h3 { margin: 0 0 14px; font-size: 19px; }
  .ut-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
  .ut-field label { font-size: 13px; font-weight: 600; color: var(--muted); }
  .ut-input { height: 36px; padding: 0 10px; border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); border-radius: 6px;
    background: var(--panel); color: var(--fg); font: inherit; font-size: 15px; user-select: text; -webkit-user-select: text; }
  .ut-input:focus { outline: 2px solid color-mix(in srgb, var(--accent) 45%, transparent); outline-offset: 0; border-color: var(--accent); }
  .ut-input:disabled { background: color-mix(in srgb, var(--fg) 5%, var(--panel)); color: var(--muted); }
  .ut-login .ut-btn { width: 100%; margin-top: 4px; }
  .ut-signed { margin-top: 12px; padding: 8px 10px; border-radius: 6px; font-size: 13.5px; font-weight: 600;
    background: color-mix(in srgb, #2f9e44 15%, var(--panel)); color: #2b8a3e; }
  .ut-signed[hidden] { display: none; }
  .ut-backdrop { position: absolute; inset: 0; z-index: 10; background: rgba(15, 18, 25, .38); }
  .ut-backdrop[hidden], .ut-dialog[hidden] { display: none; }
  .ut-dialog { position: absolute; z-index: 11; width: 330px; padding: 18px 20px 16px; border-radius: 10px; background: var(--panel);
    border: 1px solid var(--line); box-shadow: 0 18px 50px rgba(0,0,0,.3); }
  .ut-dialog p { margin: 0 0 10px; line-height: 1.5; }
  .ut-dialog .ut-row { justify-content: flex-end; margin-top: 6px; }

  .ut-err { margin: -2px 0 10px; padding: 7px 10px; border-radius: 6px; font-size: 13.5px; font-weight: 600;
    background: color-mix(in srgb, #e03131 13%, var(--panel)); color: #c92a2a; }
  .ut-err[hidden], .ut-cookie[hidden], .ut-left[hidden] { display: none; }
  .ut-link { color: var(--accent); cursor: pointer; font-size: 13px; font-weight: 600; background: none; border: 0; padding: 0; font-family: inherit; }
  .ut-link:hover { text-decoration: underline; }
  .ut-foot { display: flex; justify-content: flex-end; margin-top: 10px; }
  .ut-cookie { position: absolute; left: 0; right: 0; bottom: 0; z-index: 9; display: flex; align-items: center; gap: 14px; padding: 12px 18px;
    background: color-mix(in srgb, var(--fg) 92%, var(--panel)); color: var(--panel); box-shadow: 0 -6px 20px rgba(0,0,0,.18); }
  .ut-cookie p { flex: 1; margin: 0; font-size: 13.5px; line-height: 1.4; }
  .ut-cookie .ut-btn { flex: none; height: 34px; padding: 0 14px; font-size: 13.5px; }
  .ut-cookie .ut-btn.ghost { background: transparent; color: var(--panel); border-color: color-mix(in srgb, var(--panel) 60%, transparent); }
  .ut-left { position: absolute; inset: 0; z-index: 12; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;
    background: var(--panel); }
  .ut-left h3 { margin: 0; font-size: 20px; }
  .ut-left p { margin: 0; color: var(--muted); }

  .ut-col { position: absolute; display: flex; flex-direction: column; gap: 12px; }
  .ut-searchrow { flex: none; display: flex; gap: 10px; }
  .ut-sbox { flex: 1; display: flex; align-items: center; gap: 9px; height: 40px; padding: 0 12px; border-radius: 8px;
    border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); background: var(--panel); font-size: 15px; }
  .ut-sbox svg { width: 17px; height: 17px; color: var(--muted); flex: none; }
  .ut-sbox span { flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  .ut-searchrow .ut-btn { height: 40px; }
  .ut-res { position: relative; flex: 1; min-height: 0; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
  .ut-reshead { display: flex; align-items: center; justify-content: space-between; height: 32px; padding: 0 12px; font-size: 13px; color: var(--muted);
    border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 2.5%, var(--panel)); }
  .ut-empty { position: absolute; inset: 32px 0 0; display: flex; align-items: center; justify-content: center; gap: 10px; color: var(--muted); font-size: 14px; }
  .ut-empty svg { width: 22px; height: 22px; }
  .ut-row2 { display: flex; align-items: center; gap: 12px; padding: 0 12px; border-bottom: 1px solid var(--line); cursor: pointer; }
  .ut-row2:hover { background: color-mix(in srgb, var(--accent) 7%, var(--panel)); }
  .ut-thumb { flex: none; width: 30px; height: 30px; border-radius: 6px; }
  .ut-rn { flex: 1; min-width: 0; line-height: 1.2; }
  .ut-rn b { display: block; font-weight: 600; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: var(--accent); }
  .ut-rn small { color: var(--muted); font-size: 12px; }
  .ut-rp { flex: none; font-weight: 700; font-variant-numeric: tabular-nums; }
  .ut-skel { height: 12px; border-radius: 6px; background: color-mix(in srgb, var(--fg) 9%, var(--panel)); }
  .ut-detail { position: absolute; inset: 32px 0 0; padding: 16px 18px; background: var(--panel); }
  .ut-detail h3 { margin: 10px 0 6px; font-size: 19px; }
  .ut-detail p { margin: 0 0 10px; color: var(--muted); }
  .ut-detail .ut-price { font-size: 26px; }

  .ut-verify { position: absolute; display: flex; gap: 22px; padding: 20px 22px; border: 1px solid var(--line); border-radius: 12px; background: var(--panel);
    box-shadow: 0 4px 18px rgba(0,0,0,.07); }
  .ut-vl { width: 260px; display: flex; flex-direction: column; gap: 10px; }
  .ut-vl h3 { margin: 0; font-size: 18px; }
  .ut-vl p { margin: 0; color: var(--muted); font-size: 13.5px; line-height: 1.45; }
  .ut-boxes { display: flex; gap: 6px; }
  .ut-boxes i { flex: 1; max-width: 36px; height: 42px; border-radius: 7px; border: 1.5px solid color-mix(in srgb, var(--fg) 22%, var(--line));
    display: flex; align-items: center; justify-content: center; font: 700 20px ui-monospace, "DejaVu Sans Mono", monospace; font-style: normal; }
  .ut-boxes i.cur { border-color: var(--accent); }
  .ut-ok { color: #2b8a3e; font-weight: 700; }
  .ut-pad3 { display: grid; grid-template-columns: repeat(3, 54px); grid-auto-rows: 46px; gap: 7px; }
  .ut-pad3 .ut-btn { height: auto; padding: 0; font-size: 18px; }
  .ut-ctoast { position: absolute; z-index: 14; width: 270px; padding: 12px 14px 14px; border-radius: 10px; background: var(--fg); color: var(--panel);
    box-shadow: 0 10px 28px rgba(0,0,0,.28); }
  .ut-ctoast[hidden] { display: none; }
  .ut-ctoast small { display: block; opacity: .75; font-size: 12px; margin-bottom: 3px; }
  .ut-ctoast b { font: 700 22px ui-monospace, "DejaVu Sans Mono", monospace; letter-spacing: .12em; }
  .ut-life { position: absolute; left: 0; bottom: 0; height: 3px; background: var(--accent); border-radius: 0 0 0 10px; }

  .ut-hold { position: absolute; width: 470px; padding: 18px 20px; border: 1px solid var(--line); border-radius: 12px; background: var(--panel);
    box-shadow: 0 4px 18px rgba(0,0,0,.07); }
  .ut-holdhead { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .ut-holdhead h3 { margin: 0; font-size: 17px; }
  .ut-timer { flex: none; padding: 4px 10px; border-radius: 13px; font: 700 14px ui-monospace, "DejaVu Sans Mono", monospace;
    background: color-mix(in srgb, var(--accent) 14%, var(--panel)); color: var(--accent); }
  .ut-timer.low { background: color-mix(in srgb, #e03131 16%, var(--panel)); color: #c92a2a; }
  .ut-holdbar { position: relative; height: 4px; margin: 10px 0 12px; border-radius: 2px; background: color-mix(in srgb, var(--fg) 10%, var(--panel)); overflow: hidden; }
  .ut-holdbar i { position: absolute; left: 0; top: 0; bottom: 0; background: var(--accent); }
  .ut-grp { margin-bottom: 12px; }
  .ut-grp .ut-k { margin-bottom: 6px; }
  .ut-chips { display: flex; flex-wrap: wrap; gap: 7px; }
  .ut-chip { height: 32px; padding: 0 13px; border-radius: 16px; border: 1px solid color-mix(in srgb, var(--fg) 20%, var(--line)); background: var(--panel);
    color: var(--fg); font: inherit; font-size: 13.5px; cursor: pointer; }
  .ut-chip.on { background: var(--accent); border-color: var(--accent); color: #fff; font-weight: 600; }
  .ut-done { margin-top: 10px; padding: 9px 12px; border-radius: 7px; display: flex; align-items: center; justify-content: space-between; gap: 10px;
    background: color-mix(in srgb, #2f9e44 14%, var(--panel)); color: #2b8a3e; font-weight: 600; font-size: 13.5px; }
  .ut-done[hidden] { display: none; }

  .ut-car { position: absolute; display: flex; flex-direction: column; gap: 10px; }
  .ut-car h4 { margin: 0; font-size: 15px; }
  .ut-stage2 { position: relative; overflow: hidden; border-radius: 14px; }
  .ut-slide { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; gap: 8px; padding: 0 72px; color: #fff; cursor: pointer; }
  .ut-slide[hidden] { display: none; }
  .ut-slide b { font-size: 24px; line-height: 1.2; text-shadow: 0 1px 2px rgba(0,0,0,.25); }
  .ut-slide span { font-size: 14.5px; opacity: .92; }
  .ut-cta { align-self: flex-start; margin-top: 6px; padding: 7px 16px; border-radius: 17px; background: #fff; color: #1d2330; font-weight: 700; font-size: 13.5px; }
  .ut-arrow { position: absolute; top: 50%; z-index: 2; width: 38px; height: 38px; margin-top: -19px; border-radius: 50%; border: 0; cursor: pointer;
    background: rgba(255,255,255,.88); color: #1d2330; font-size: 22px; line-height: 38px; text-align: center; box-shadow: 0 2px 6px rgba(0,0,0,.2); padding: 0; }
  .ut-arrow.prev { left: 14px; }
  .ut-arrow.next { right: 14px; }
  .ut-prog { position: absolute; left: 0; bottom: 0; height: 4px; background: rgba(255,255,255,.85); z-index: 2; }
  .ut-paused { position: absolute; right: 14px; top: 12px; z-index: 2; padding: 2px 9px; border-radius: 10px; font-size: 12px; font-weight: 700;
    background: rgba(0,0,0,.45); color: #fff; }
  .ut-paused[hidden] { display: none; }
  .ut-dots { display: flex; justify-content: center; gap: 9px; }
  .ut-dot { width: 22px; height: 22px; border-radius: 50%; border: 0; padding: 0; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .ut-dot::after { content: ''; width: 10px; height: 10px; border-radius: 50%; background: color-mix(in srgb, var(--fg) 22%, var(--panel)); }
  .ut-dot.on::after { background: var(--accent); width: 12px; height: 12px; }
  .ut-tiles { display: flex; gap: 10px; }
  .ut-tile { flex: 1; height: 54px; border-radius: 9px; border: 1px solid var(--line); padding: 8px 10px; font-size: 12.5px; color: var(--muted); overflow: hidden; }
  .ut-page { position: absolute; inset: 0; z-index: 3; display: flex; flex-direction: column; justify-content: center; gap: 10px; padding: 0 30px;
    background: var(--panel); border: 1px solid var(--line); border-radius: 14px; }
  .ut-page[hidden] { display: none; }
  .ut-page h3 { margin: 0; font-size: 21px; }
  .ut-page p { margin: 0; color: var(--muted); }

  .ut-trip { position: absolute; width: 420px; padding: 18px 20px; border: 1px solid var(--line); border-radius: 12px; background: var(--panel);
    box-shadow: 0 4px 18px rgba(0,0,0,.07); }
  .ut-trip h3 { margin: 0 0 12px; font-size: 18px; }
  .ut-ac { position: relative; }
  .ut-ac .ut-input { width: 100%; box-sizing: border-box; height: 40px; padding-right: 36px; }
  .ut-acspin { position: absolute; right: 10px; top: 9px; width: 22px; height: 22px; }
  .ut-acspin[hidden] { display: none; }
  .ut-sug { position: absolute; left: 0; right: 0; top: 44px; z-index: 6; border: 1px solid var(--line); border-radius: 8px; background: var(--panel);
    box-shadow: 0 10px 26px rgba(0,0,0,.15); overflow: hidden; }
  .ut-sug[hidden] { display: none; }
  .ut-sopt { display: flex; align-items: center; justify-content: space-between; gap: 10px; height: 38px; padding: 0 12px; cursor: pointer; font-size: 14.5px; }
  .ut-sopt small { color: var(--muted); }
  .ut-sopt i { font-style: normal; font: 600 12px ui-monospace, "DejaVu Sans Mono", monospace; color: var(--muted); }
  .ut-sopt:hover, .ut-sopt.act { background: color-mix(in srgb, var(--accent) 12%, var(--panel)); }
  .ut-snote { display: flex; align-items: center; gap: 8px; height: 38px; padding: 0 12px; color: var(--muted); font-size: 13.5px; }
  .ut-snote svg { width: 18px; height: 18px; }
  .ut-fake { display: flex; gap: 10px; margin-top: 12px; }
  .ut-fake div { flex: 1; }
  .ut-fake span { display: flex; align-items: center; height: 36px; padding: 0 10px; border-radius: 6px; border: 1px solid var(--line); color: var(--muted); font-size: 14px; }
  `;
  env.template('act-in-time/_styles', () => ({ referenceCSS, arenaCSS }));
})();
