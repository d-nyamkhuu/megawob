/* click-control/_base-frame: frame units of the base template.
 * scopeRef is the live reference scope; reference.js retains their design.parts keys and overrides.
 */
(function () {
  'use strict';

  const CSS = `
      .uc-page { position: absolute; top: 14px; bottom: 14px; display: flex; flex-direction: column; overflow: hidden;
        background: var(--panel); border: 1px solid var(--line); border-radius: 10px;
        box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 10px 30px rgba(0,0,0,.05); }
      .uc-nav { flex: none; display: flex; align-items: center; gap: 22px; height: 48px; padding: 0 18px;
        border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
      .uc-brand { display: flex; align-items: center; gap: 9px; font-weight: 700; font-size: 15px; letter-spacing: .01em; white-space: nowrap; }
      .uc-logo { width: 22px; height: 22px; border-radius: 6px; background: var(--accent); }
      .uc-navlinks { display: flex; gap: 18px; font-size: 14px; color: var(--muted); white-space: nowrap; overflow: hidden; }
      .uc-navlinks span.on { color: var(--fg); font-weight: 600; }
      .uc-navright { margin-left: auto; display: flex; align-items: center; gap: 14px; }
      .uc-search { display: flex; align-items: center; gap: 8px; width: 180px; height: 30px; padding: 0 10px; border-radius: 15px;
        border: 1px solid var(--line); color: var(--muted); font-size: 13px; background: var(--panel); }
      .uc-avatar { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
        font-size: 12px; font-weight: 700; color: #fff; background: color-mix(in srgb, var(--accent) 70%, #333); }
      .uc-body { flex: 1; display: flex; min-height: 0; }
      .uc-side { flex: none; width: 170px; padding: 16px 10px; border-right: 1px solid var(--line);
        background: color-mix(in srgb, var(--fg) 2%, var(--panel)); }
      .uc-side div { display: flex; align-items: center; gap: 10px; height: 32px; padding: 0 10px; border-radius: 6px; font-size: 14px; color: var(--muted); }
      .uc-side div i { width: 8px; height: 8px; border-radius: 2px; background: color-mix(in srgb, var(--muted) 55%, transparent); }
      .uc-side div.on { color: var(--fg); font-weight: 600; background: color-mix(in srgb, var(--accent) 10%, transparent); }
      .uc-side div.on i { background: var(--accent); }
      .uc-main { flex: 1; min-width: 0; display: flex; flex-direction: column; padding: 14px 24px 16px; position: relative; }
      .uc-crumb { font-size: 12.5px; color: var(--muted); white-space: nowrap; overflow: hidden; }
      .uc-h1 { margin: 2px 0 10px; font-size: 21px; font-weight: 700; white-space: nowrap; overflow: hidden; }
      .uc-content { flex: 1; min-height: 0; position: relative; display: flex; flex-direction: column; }
      .uc-box { position: relative; max-width: 100%; }

      .uc-card { border: 1px solid var(--line); border-radius: 8px; padding: 14px 16px; background: var(--panel); }
      .uc-flow { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 10px; max-width: 600px; }
      .uc-flow .uc-text { flex-basis: 100%; color: var(--muted); font-size: 14px; line-height: 1.45; }
      .uc-flow .uc-inrow { flex-basis: 100%; display: flex; align-items: center; gap: 8px; font-size: 14px; }
      .uc-flow .uc-br { flex-basis: 100%; height: 0; }
      .uc-input { height: 32px; padding: 0 9px; border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); border-radius: 5px;
        background: var(--panel); color: var(--fg); font: inherit; font-size: 14px; }
      .uc-input:focus { outline: 2px solid color-mix(in srgb, var(--accent) 45%, transparent); outline-offset: 0; border-color: var(--accent); }
      .uc-btn { height: 34px; padding: 0 16px; border-radius: 6px; font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap;
        border: 1px solid color-mix(in srgb, var(--fg) 20%, var(--line)); color: var(--fg); background: color-mix(in srgb, var(--fg) 4%, var(--panel)); }
      .uc-btn:hover { background: color-mix(in srgb, var(--fg) 9%, var(--panel)); }
      .uc-btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
      .uc-btn.ghost { background: transparent; border-color: transparent; color: var(--accent); }
      .uc-btn.ghost:hover { background: color-mix(in srgb, var(--accent) 10%, transparent); }
      .uc-btn.aslink { height: auto; padding: 2px 2px; border: 0; background: transparent; color: var(--accent); font-weight: 500;
        text-decoration: underline; text-underline-offset: 2px; }
      .uc-btn.icon { display: inline-flex; align-items: center; gap: 7px; padding: 0 12px 0 10px; }
      .uc-btn.icon svg { width: 15px; height: 15px; }
      .uc-btn[disabled], .uc-btn.dis { opacity: .45; cursor: not-allowed; }
      .uc-btn[data-clicked] { box-shadow: inset 0 2px 4px rgba(0,0,0,.25); background: color-mix(in srgb, var(--accent) 18%, var(--panel)); }
      .uc-btn.aslink[data-clicked] { box-shadow: none; background: transparent; color: color-mix(in srgb, var(--accent) 60%, #000); }
      .uc-surface { position: relative; border: 1px dashed color-mix(in srgb, var(--fg) 25%, var(--line)); border-radius: 10px;
        background-image: radial-gradient(color-mix(in srgb, var(--fg) 14%, transparent) 1px, transparent 1px); background-size: 16px 16px; }
      .uc-surface .uc-btn { position: absolute; padding: 0; }

      .uc-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 8px; border: 1px solid var(--line);
        border-radius: 8px; background: color-mix(in srgb, var(--fg) 3%, var(--panel)); max-width: 640px; }
      .uc-bar .sep { width: 1px; height: 22px; background: var(--line); }
      .uc-doc { margin-top: 12px; max-width: 600px; color: var(--muted); font-size: 14px; line-height: 1.6; }
      .uc-doc b { color: var(--fg); }
      .uc-foot { display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: center; gap: 10px; margin-top: 14px; padding-top: 12px;
        border-top: 1px solid var(--line); }

      .uc-article { max-width: 640px; font-size: 15px; line-height: 1.7; }
      .uc-article h3 { margin: 0 0 6px; font-size: 17px; }
      .uc-article p { margin: 0 0 10px; }
      .uc-link { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; cursor: pointer; }
      .uc-link:hover { text-decoration-thickness: 2px; }
      .uc-links { display: flex; flex-wrap: wrap; gap: 10px 14px; align-items: center; max-width: 620px; }
      .uc-links.col { flex-direction: column; align-items: flex-start; gap: 8px; }
      .uc-link.btnlook { display: inline-flex; align-items: center; height: 32px; padding: 0 14px; border-radius: 6px; text-decoration: none;
        font-weight: 600; font-size: 14px; color: #fff; background: var(--accent); }
      .uc-link.chip { display: inline-flex; align-items: center; height: 28px; padding: 0 12px; border-radius: 14px; text-decoration: none;
        font-size: 13.5px; color: var(--fg); border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); }

      .uc-tabs { max-width: 660px; }
      .uc-strip { display: flex; flex-wrap: wrap; gap: 2px; border-bottom: 1px solid var(--line); }
      .uc-tab { height: 36px; padding: 0 14px; border: 1px solid transparent; border-bottom: 0; border-radius: 7px 7px 0 0; margin-bottom: -1px;
        font: inherit; font-size: 14px; color: var(--muted); background: transparent; cursor: pointer; white-space: nowrap; }
      .uc-tab:hover { color: var(--fg); background: color-mix(in srgb, var(--fg) 4%, transparent); }
      .uc-tab[data-active] { color: var(--fg); font-weight: 600; background: var(--panel); border-color: var(--line); }
      .uc-tabpanel { padding: 12px 16px; border: 1px solid var(--line); border-top: 0; border-radius: 0 0 8px 8px; line-height: 1.65; min-height: 90px; font-size: 14.5px; }
      .uc-tabpanel[hidden] { display: none; }

      .uc-menuwrap { position: relative; display: inline-block; align-self: flex-start; }
      .uc-mpanel { position: absolute; z-index: 5; min-width: 150px; padding: 4px; border: 1px solid var(--line); border-radius: 7px;
        background: var(--panel); box-shadow: 0 8px 24px rgba(0,0,0,.14), 0 2px 5px rgba(0,0,0,.06); }
      .uc-mpanel.root-static { position: relative; display: inline-block; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
      .uc-mpanel[hidden] { display: none !important; }
      .uc-mrow { position: relative; }
      .uc-mrow > .uc-mpanel { left: calc(100% + 2px); top: -5px; }
      .uc-mi { display: flex; align-items: center; gap: 9px; height: 29px; padding: 0 10px; border-radius: 5px; font-size: 14px; white-space: nowrap; cursor: pointer; }
      .uc-mi svg { flex: none; width: 16px; height: 16px; color: var(--muted); }
      .uc-mi .car { margin-left: auto; padding-left: 14px; color: var(--muted); font-size: 11px; }
      .uc-mi .sc { margin-left: auto; padding-left: 18px; color: var(--muted); font-size: 12px; }
      .uc-mi[data-active], .uc-mi[data-open] { background: color-mix(in srgb, var(--accent) 13%, var(--panel)); }
      .uc-mi.dis { color: var(--muted); opacity: .55; cursor: default; }
      .uc-mi.dis[data-active] { background: transparent; }
      .uc-menubtn { display: inline-flex; align-items: center; gap: 8px; }
      .uc-menubtn + .uc-mpanel { top: calc(100% + 6px); left: 0; }

      .uc-acc { width: 600px; max-width: 100%; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
      .uc-sec + .uc-sec { border-top: 1px solid var(--line); }
      .uc-sec-h { display: flex; align-items: center; gap: 10px; height: 38px; padding: 0 14px; font-weight: 600; cursor: pointer; font-size: 14.5px;
        background: color-mix(in srgb, var(--fg) 3%, var(--panel)); white-space: nowrap; overflow: hidden; }
      .uc-sec-h:hover { background: color-mix(in srgb, var(--fg) 6%, var(--panel)); }
      .uc-sec-h svg { flex: none; width: 14px; height: 14px; color: var(--muted); transition: none; }
      .uc-sec-h[aria-expanded="true"] svg { transform: rotate(90deg); }
      .uc-sec-h[aria-expanded="true"] { color: var(--accent); }
      .uc-sec-b { padding: 8px 16px 10px 38px; line-height: 1.6; font-size: 14px; }
      .uc-sec-b[hidden] { display: none; }

      .uc-toolbar { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
      .uc-table { width: 100%; max-width: 700px; border-collapse: collapse; font-size: 14px; }
      .uc-table th { text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); font-weight: 600; padding: 5px 10px; border-bottom: 1px solid var(--line); }
      .uc-table td { padding: 0 10px; height: var(--rowh, 34px); border-bottom: 1px solid color-mix(in srgb, var(--line) 60%, transparent); white-space: nowrap; }
      .uc-backdrop { position: absolute; inset: -8px; z-index: 10; background: rgba(15, 18, 25, .32); border-radius: 8px; }
      .uc-backdrop[hidden], .uc-dialog[hidden] { display: none; }
      .uc-dialog { position: absolute; z-index: 11; width: 340px; border-radius: 9px; overflow: hidden; background: var(--panel);
        border: 1px solid var(--line); box-shadow: 0 18px 50px rgba(0,0,0,.28); }
      .uc-dlg-t { display: flex; align-items: center; height: 40px; padding: 0 8px 0 16px; font-weight: 700;
        background: color-mix(in srgb, var(--fg) 4%, var(--panel)); border-bottom: 1px solid var(--line); }
      .uc-dlg-t span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .uc-dlg-x { margin-left: auto; flex: none; width: 28px; height: 28px; border: 0; border-radius: 5px; background: transparent; color: var(--muted);
        font: inherit; font-size: 20px; line-height: 1; cursor: pointer; }
      .uc-dlg-x:hover { background: color-mix(in srgb, var(--fg) 10%, transparent); color: var(--fg); }
      .uc-dlg-b { padding: 14px 16px; line-height: 1.5; font-size: 14px; }
      .uc-dlg-f { display: flex; justify-content: flex-end; gap: 8px; padding: 0 16px 14px; }
      .uc-dlg-f .uc-btn { padding: 0 12px; }

      .uc-pie { position: relative; touch-action: none; }
      .uc-pie svg { display: block; }
      .uc-slice { fill: color-mix(in srgb, var(--accent) 78%, #000); stroke: var(--panel); stroke-width: 2; cursor: pointer; }
      .uc-slice:hover, .uc-slice[data-active] { fill: color-mix(in srgb, var(--accent) 60%, #fff); }
      .uc-slabel { fill: #fff; font-size: 17px; font-weight: 700; pointer-events: none; text-anchor: middle; dominant-baseline: central; }
      .uc-spread { fill: var(--fg); cursor: pointer; }
      .uc-spread-i { stroke: var(--panel); stroke-width: 3; stroke-linecap: round; pointer-events: none; }
      .uc-pie[data-open] .uc-spread-i { transform: rotate(45deg); }
      .uc-hint { margin-top: 8px; font-size: 13px; color: var(--muted); }

      .uc-wlist { display: grid; gap: 12px 28px; }
      .uc-widget { display: flex; align-items: center; gap: 8px; width: max-content; font-size: 14.5px; cursor: pointer; }
      .uc-widget input[type=radio], .uc-widget input[type=checkbox] { width: 17px; height: 17px; margin: 0; accent-color: var(--accent); }
      .uc-widget textarea { width: 180px; height: 36px; padding: 6px 9px; resize: none; border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line));
        border-radius: 5px; background: var(--panel); color: var(--fg); font: inherit; font-size: 14px; }

      .uc-form { width: 400px; max-width: 100%; box-sizing: border-box; }
      .uc-field { display: flex; flex-direction: column; gap: 4px; }
      .uc-field label { font-size: 13px; font-weight: 600; color: var(--muted); }
      .uc-field .uc-input { width: 250px; }

      .uc-board { display: block; border: 1px solid var(--line); border-radius: 8px; background: color-mix(in srgb, var(--fg) 2%, var(--panel)); }
      .uc-sq { fill: color-mix(in srgb, var(--fg) 22%, var(--panel)); }
      .uc-meter { display: flex; align-items: center; gap: 12px; margin-top: 8px; font-size: 13.5px; color: var(--muted); }
      .uc-meter .bar { width: 200px; height: 8px; border-radius: 4px; background: color-mix(in srgb, var(--fg) 10%, var(--panel)); overflow: hidden; }
      .uc-meter .bar i { display: block; height: 100%; background: var(--accent); }

      .uc-tools { display: flex; flex-wrap: wrap; gap: 4px; padding: 6px; border: 1px solid var(--line); border-radius: 8px;
        background: color-mix(in srgb, var(--fg) 3%, var(--panel)); max-width: 620px; }
      .uc-tool { width: 36px; height: 34px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid transparent;
        border-radius: 6px; background: transparent; color: var(--fg); cursor: pointer; }
      .uc-tool svg { width: 18px; height: 18px; }
      .uc-tool:hover, .uc-tool[data-hover] { background: color-mix(in srgb, var(--fg) 8%, var(--panel)); border-color: var(--line); }
      .uc-tool[data-clicked] { background: color-mix(in srgb, var(--accent) 18%, var(--panel)); color: var(--accent); }
      .uc-tip { position: absolute; z-index: 30; padding: 5px 9px; border-radius: 5px; font-size: 12.5px; white-space: nowrap; pointer-events: none;
        color: #fff; background: rgba(25, 28, 35, .92); box-shadow: 0 3px 10px rgba(0,0,0,.2); }
      .uc-tip[hidden] { display: none; }
      .uc-idname { border-bottom: 1px dashed color-mix(in srgb, var(--fg) 45%, transparent); cursor: help; }
      .uc-idinfo { display: inline-block; width: 14px; height: 14px; margin-left: 6px; vertical-align: -2px; color: var(--muted); }

      .uc-rows tr.dead td { color: var(--muted); text-decoration: line-through; }
      .uc-acts { display: flex; gap: 4px; justify-content: flex-end; visibility: hidden; }
      .uc-rows tr[data-hover] .uc-acts { visibility: visible; }
      .uc-rows tr[data-hover] td { background: color-mix(in srgb, var(--accent) 6%, var(--panel)); }
      .uc-rows tr.dead .uc-acts { visibility: hidden; }
      .uc-act { height: 26px; min-width: 28px; padding: 0 8px; display: inline-flex; align-items: center; justify-content: center; gap: 5px;
        border: 1px solid var(--line); border-radius: 5px; background: var(--panel); color: var(--fg); font: inherit; font-size: 12.5px; cursor: pointer; }
      .uc-act svg { width: 15px; height: 15px; }
      .uc-act.icononly { padding: 0; width: 28px; }
      .uc-badge { display: inline-block; margin-left: 8px; padding: 1px 7px; border-radius: 9px; font-size: 11.5px; text-decoration: none;
        color: var(--fg); background: color-mix(in srgb, var(--accent) 16%, var(--panel)); }

      .uc-files { display: grid; gap: 8px; align-content: start; }
      .uc-ftile { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 8px 4px; border-radius: 8px; cursor: default;
        border: 1px solid transparent; font-size: 12.5px; text-align: center; user-select: none; }
      .uc-ftile .nm, .ud-icon .nm { max-width: 100%; overflow: hidden; overflow-wrap: anywhere; display: -webkit-box; -webkit-line-clamp: 3;
        -webkit-box-orient: vertical; line-height: 1.25; }
      .uc-ftile[data-sel] { background: color-mix(in srgb, var(--accent) 14%, var(--panel)); border-color: color-mix(in srgb, var(--accent) 40%, var(--line)); }
      .uc-frow { display: grid; grid-template-columns: 22px minmax(0, 1fr) 90px; align-items: center; gap: 8px; padding: 0 10px; border-radius: 5px;
        font-size: 13.5px; cursor: default; user-select: none; }
      .uc-frow .nm { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .uc-frow .sz { color: var(--muted); font-size: 12.5px; text-align: right; }
      .uc-frow[data-sel] { background: color-mix(in srgb, var(--accent) 14%, var(--panel)); }
      .uc-ficon { width: 34px; height: 40px; }
      .uc-frow .uc-ficon { width: 18px; height: 20px; }
      .uc-cmenu { position: absolute; z-index: 25; min-width: 170px; padding: 4px; border: 1px solid var(--line); border-radius: 7px;
        background: var(--panel); box-shadow: 0 10px 28px rgba(0,0,0,.2); font-size: 13.5px; }
      .uc-cmenu[hidden] { display: none; }
      .uc-cmenu .ce { height: 27px; display: flex; align-items: center; padding: 0 12px; border-radius: 4px; cursor: default; white-space: nowrap; }
      .uc-cmenu .ce:hover { background: color-mix(in srgb, var(--accent) 13%, var(--panel)); }
      .uc-cmenu .ce.dis { opacity: .45; }
      .uc-cmenu .ce.dis:hover { background: transparent; }
      .uc-cmenu .hr { height: 1px; margin: 4px 6px; background: var(--line); }
      .uc-viewer { position: absolute; inset: 0; z-index: 20; display: flex; flex-direction: column; background: var(--panel);
        border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
      .uc-viewer[hidden] { display: none; }
      .uc-vhead { flex: none; display: flex; align-items: center; gap: 14px; height: 40px; padding: 0 12px; border-bottom: 1px solid var(--line);
        background: color-mix(in srgb, var(--fg) 3%, var(--panel)); font-weight: 600; }
      .uc-vhead .uc-back { font-weight: 500; }
      .uc-vbody { flex: 1; padding: 14px 18px; color: var(--muted); font-size: 14px; line-height: 1.7; overflow: hidden; }
      .uc-vline { height: 9px; margin: 9px 0; border-radius: 4px; background: color-mix(in srgb, var(--fg) 9%, var(--panel)); }

      .uc-toast { position: absolute; z-index: 40; bottom: 16px; display: flex; align-items: center; gap: 16px; max-width: 70%;
        padding: 10px 12px 10px 16px; border-radius: 8px; color: #fff; background: rgba(28, 31, 38, .95); font-size: 14px;
        box-shadow: 0 10px 26px rgba(0,0,0,.25); }
      .uc-toast[hidden] { display: none; }
      .uc-toast span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .uc-toast button { flex: none; height: 28px; padding: 0 10px; border: 0; border-radius: 5px; font: inherit; font-weight: 700; cursor: pointer;
        color: color-mix(in srgb, var(--accent) 55%, #fff); background: transparent; }
      .uc-toast button:hover { background: rgba(255,255,255,.1); }
      .uc-navview { position: absolute; inset: 0; z-index: 20; padding: 14px 18px; background: var(--panel); border: 1px solid var(--line);
        border-radius: 8px; overflow: hidden; }
      .uc-navview[hidden] { display: none; }
      .uc-navview h2 { margin: 10px 0 8px; font-size: 20px; }
      .uc-navview p { margin: 0; color: var(--muted); line-height: 1.6; max-width: 560px; }
      .uc-back { color: var(--accent); cursor: pointer; text-decoration: underline; text-underline-offset: 2px; font-size: 14px; }
      `;

  function fileIcon(scopeRef, kind) {
    const c = scopeRef.FILE_COLORS[kind] || '#868e96';
    if (kind === 'folder') return `<svg class="uc-ficon" viewBox="0 0 34 40"><path d="M2 9h11l3 3.5h16V34H2z" fill="${c}"/><path d="M2 14h30v20H2z" fill="${c}" opacity=".75"/></svg>`;
    const label = String(kind).slice(0, 4).toUpperCase();
    return `<svg class="uc-ficon" viewBox="0 0 34 40"><path d="M5 2h17l8 8v28H5z" fill="var(--panel)" stroke="color-mix(in srgb, var(--fg) 35%, var(--line))" stroke-width="1.4"/>`
      + `<path d="M22 2v8h8" fill="none" stroke="color-mix(in srgb, var(--fg) 35%, var(--line))" stroke-width="1.4"/>`
      + `<rect x="2" y="21" width="26" height="11" rx="2" fill="${c}"/><text x="15" y="29.2" font-size="7.5" font-weight="700" fill="#fff" text-anchor="middle" font-family="sans-serif">${label}</text></svg>`;
  }

  function ensureStyle(scopeRef, id, css) {
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = css;
    document.head.append(s);
  }

  function frame(scopeRef, ctx) {
    const { util, rng, spec } = ctx;
    const W = ctx.size.width;
    const page = util.el('div', 'uc-page', ctx.stage);
    // Page width and alignment inside the stage (R7: the target's screen position is not fixed).
    const pw = W > 980 && rng.bool(0.45) ? Math.round(Math.max(900, W * rng.float(0.78, 0.94))) : Math.round(W - 2 * rng.int(10, 20));
    const free = Math.max(0, W - pw);
    const align = rng.pick(['left', 'center', 'right']);
    const left = align === 'left' ? Math.min(free, rng.int(8, 18)) : align === 'right' ? Math.max(0, free - rng.int(8, 18)) : Math.round(free / 2);
    page.style.left = left + 'px';
    page.style.width = Math.min(pw, W - left) + 'px';
    const nav = util.el('nav', 'uc-nav', page);
    const brand = util.el('div', 'uc-brand', nav);
    util.el('span', 'uc-logo', brand);
    util.el('span', '', brand, rng.pick(scopeRef.BRANDS));
    const links = util.el('div', 'uc-navlinks', nav);
    const navItems = rng.sample(scopeRef.NAV, rng.int(3, 4));
    const on = rng.int(0, navItems.length - 1);
    navItems.forEach((n, i) => util.el('span', i === on ? 'on' : '', links, n));
    const right = util.el('div', 'uc-navright', nav);
    if (pw > 1000) {
      const search = util.el('div', 'uc-search', right);
      search.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="7" cy="7" r="4.6"/><path d="M10.5 10.5L14 14"/></svg><span>Search</span>';
    }
    const av = util.el('div', 'uc-avatar', right, rng.pick(['JD', 'AK', 'MS', 'RL', 'TP', 'NO', 'VG']));
    av.setAttribute('aria-hidden', 'true');
    const body = util.el('div', 'uc-body', page);
    if (pw >= 860 && rng.bool(0.6)) {
      const side = util.el('aside', 'uc-side', body);
      const items = rng.sample(scopeRef.SIDE, rng.int(4, 6));
      const act = rng.int(0, items.length - 1);
      items.forEach((s, i) => {
        const d = util.el('div', i === act ? 'on' : '', side);
        util.el('i', '', d);
        util.el('span', '', d, s);
      });
    }
    const main = util.el('section', 'uc-main', body);
    const title = spec.scenario === 'menu' && spec.mode === 'button' ? 'Media library'
      : (spec.scenario === 'rows' || spec.scenario === 'row-reveal') && spec.kind === 'files' ? 'Shared files'
        : spec.scenario === 'tooltip-inspect' && spec.mode === 'id' ? 'Contacts' : scopeRef.TITLES[spec.scenario];
    util.el('div', 'uc-crumb', main, `Home  ›  ${navItems[on]}  ›  ${title}`);
    const h1 = util.el('div', 'uc-h1', main, title);
    const content = util.el('div', 'uc-content', main);
    return { page, content, h1 };
  }

  function box(scopeRef, ctx, content, opts = {}) {
    const { rng } = ctx;
    content.style.alignItems = opts.left ? 'flex-start' : rng.pick(['flex-start', 'flex-start', 'center', 'flex-end']);
    content.style.justifyContent = opts.top ? 'flex-start' : rng.pick(['flex-start', 'flex-start', 'flex-start', 'center']);
    return ctx.util.el('div', 'uc-box', content);
  }

  function paragraph(scopeRef, ctx, parent, segs, block, tag = 'p') {
    const p = ctx.util.el(tag, '', parent);
    const links = [];
    segs.forEach((w, i) => {
      if (i && !/^[.,;:!?)]/.test(w.text)) p.append(' ');
      if (w.link) {
        const a = ctx.util.el('span', 'uc-link', p, w.text);
        a.dataset.key = `${block}.${i}`;
        a.dataset.role = 'link';
        links.push(a);
      } else p.append(w.text);
    });
    return links;
  }

  function recovery(scopeRef, ctx, page, area, up, kind) {
    const { util, rng, spec } = ctx;
    const F = scopeRef.fam();
    const toast = util.el('div', 'uc-toast', page);
    toast.dataset.role = 'toast';
    if (rng.bool(0.5)) toast.style.left = '18px';
    else { toast.style.left = '50%'; toast.style.transform = 'translateX(-50%)'; }
    const msg = util.el('span', '', toast);
    const undo = util.el('button', '', toast, rng.pick(['Undo', 'Undo', 'UNDO', 'Restore', 'Revert']));
    undo.type = 'button';
    toast.hidden = true;
    let nav = null;
    let back = null;
    let navTitle = null;
    let navText = null;
    if (kind === 'view') {
      nav = util.el('div', 'uc-navview', area);
      back = util.el('span', 'uc-back', nav, rng.pick(['← Back', '‹ Back to page', '← Go back', 'Back']));
      back.dataset.role = 'back';
      navTitle = util.el('h2', '', nav);
      navText = util.el('p', '', nav);
      nav.hidden = true;
    }
    const doUndo = () => up(F.helpers.undoModel(ctx.model, spec));
    undo.addEventListener('click', doUndo);
    if (back) back.addEventListener('click', doUndo);
    const sentence = (scopeRef.env.content && scopeRef.env.content.SENTENCES && scopeRef.env.content.SENTENCES.length)
      ? scopeRef.env.content.SENTENCES[Math.floor(rng.next() * scopeRef.env.content.SENTENCES.length)] : '';
    return {
      sync(m) {
        const wk = spec.scenario === 'hover' ? [] : F.helpers.wrongKeys(m, spec);
        const on = wk.length > 0;
        const text = on ? F.helpers.resultText(spec, wk[wk.length - 1]) : '';
        if (nav) {
          nav.hidden = !on;
          if (on) { navTitle.textContent = text; navText.textContent = sentence; }
        } else {
          toast.hidden = !on;
          if (on) msg.textContent = text;
        }
      },
      locate() {
        if (nav && !nav.hidden) return scopeRef.env.util.center(back);
        if (!toast.hidden) return scopeRef.env.util.center(undo);
        return null;
      },
    };
  }

  function surface(scopeRef, ctx, content, maxW, maxH) {
    const b = scopeRef.box(ctx, content);
    const s = ctx.util.el('div', 'uc-surface', b);
    const r = content.getBoundingClientRect();
    const W = Math.min(maxW, Math.floor(r.width));
    const H = Math.max(160, Math.min(maxH, Math.floor(r.height) - 4));
    s.style.width = W + 'px';
    s.style.height = H + 'px';
    return { box: s, W, H };
  }

  function lookClass(scopeRef, look) {
    return { primary: ' primary', ghost: ' ghost', link: ' aslink', icon: ' icon' }[look] || '';
  }

  function makeButton(scopeRef, ctx, parent, e) {
    if (scopeRef.ERA) return scopeRef.eraButton(ctx, parent, e.label, e.key, e);
    const b = ctx.util.el('button', 'uc-btn' + scopeRef.lookClass(e.look), parent);
    b.type = 'button';
    if (e.look === 'icon' && e.icon) b.innerHTML = scopeRef.icon(e.icon);
    else if (e.look === 'icon') b.classList.remove('icon');
    ctx.util.el('span', '', b, e.label);
    b.dataset.key = e.key;
    if (e.disabled) {
      b.classList.add('dis');
      b.setAttribute('aria-disabled', 'true');
    }
    return b;
  }

  function initialize(scopeRef, set, __has, __parts) {
    const assets = scopeRef.env.templateLib('click-control/_assets');
    set('CSS', __has('CSS') ? __parts['CSS'](undefined, scopeRef) : (CSS));
    set('BRANDS', __has('BRANDS') ? __parts['BRANDS'](undefined, scopeRef) : (['Northwind', 'Brightside', 'Tidal', 'Juniper', 'Lumen', 'Copperleaf', 'Harborline', 'Fieldnote', 'Quillpost', 'Bluebird HR']));
    set('NAV', __has('NAV') ? __parts['NAV'](undefined, scopeRef) : (['Dashboard', 'Projects', 'Reports', 'Team', 'Help', 'Billing', 'Docs', 'Inbox', 'Analytics', 'Customers']));
    set('SIDE', __has('SIDE') ? __parts['SIDE'](undefined, scopeRef) : (['Overview', 'Inbox', 'Calendar', 'Files', 'Settings', 'Members', 'Activity', 'Templates', 'Archive']));
    set('TITLES', __has('TITLES') ? __parts['TITLES'](undefined, scopeRef) : ({
        button: 'Quick actions', sequence: 'Control panel', link: 'Release notes', tab: 'Product details',
        menu: 'Directory', collapsible: 'Help center', dialog: 'Documents', pie: 'Launcher', widget: 'Form elements',
        focus: 'Contact details', hover: 'Pointer tracking', 'tooltip-inspect': 'Editor', rows: 'Team members',
        context: 'My files', open: 'Documents', 'hover-menu': 'Welcome', flyout: 'Shop', 'row-reveal': 'Team members',
      }));
    set('PAST', __has('PAST') ? __parts['PAST'](undefined, scopeRef) : ({ Edit: 'Edited', Message: 'Messaged', Archive: 'Archived', Delete: 'Deleted', Remove: 'Removed', Share: 'Shared',
        Pin: 'Pinned', Flag: 'Flagged', Rename: 'Renamed', Download: 'Downloaded', Duplicate: 'Duplicated', Preview: 'Previewed',
        'Copy link': 'Link copied' }));
    set('HOVER_FILL', __has('HOVER_FILL') ? __parts['HOVER_FILL'](undefined, scopeRef) : (assets.hoverFill()));
    set('CHEVRON', __has('CHEVRON') ? __parts['CHEVRON'](undefined, scopeRef) : ('<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5L10.5 8 6 12.5"/></svg>'));
    set('ICON_PATHS', __has('ICON_PATHS') ? __parts['ICON_PATHS'](undefined, scopeRef) : (assets.icons()));
    set('icon', __has('icon') ? __parts['icon'](undefined, scopeRef) : { icon: (name) => (name && scopeRef.ICON_PATHS[name]
        ? `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${scopeRef.ICON_PATHS[name]}</svg>`
        : '<svg viewBox="0 0 16 16"></svg>') }.icon);
    set('FILE_COLORS', __has('FILE_COLORS') ? __parts['FILE_COLORS'](undefined, scopeRef) : (assets.fileColors()));
    set('view', __has('view') ? __parts['view'](undefined, scopeRef) : (null));
    set('blankEl', __has('blankEl') ? __parts['blankEl'](undefined, scopeRef) : (null));
    set('linkPoint', __has('linkPoint') ? __parts['linkPoint'](undefined, scopeRef) : { linkPoint: (el) => {
        const rs = el.getClientRects();
        const r = rs.length ? rs[0] : el.getBoundingClientRect();
        return [r.left + r.width / 2, r.top + r.height / 2];
      } }.linkPoint);
    set('fail', __has('fail') ? __parts['fail'](undefined, scopeRef) : { fail: (t) => { throw new Error(`click-control/controls cannot locate ${JSON.stringify(t)}`); } }.fail);
    set('must', __has('must') ? __parts['must'](undefined, scopeRef) : { must: (p, t) => p || scopeRef.fail(t) }.must);
    set('fam', __has('fam') ? __parts['fam'](undefined, scopeRef) : { fam: () => scopeRef.env.taskDef }.fam);
    set('fromNotice', __has('fromNotice') ? __parts['fromNotice'](undefined, scopeRef) : { fromNotice: (ev) => !!(ev.target.closest && ev.target.closest('[data-role="notice"]')) }.fromNotice);
    set('ERA', __has('ERA') ? __parts['ERA'](undefined, scopeRef) : (null));
  }

  env.template('click-control/_base-frame', () => ({ functions: { fileIcon, ensureStyle, frame, box, paragraph, recovery, surface, lookClass, makeButton }, initialize }), { uses: ['click-control/_assets'] });
})();
