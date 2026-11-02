/* Constant reference styles; CSS and DB_CSS remain overridable units in reference.js. */
(function () {
  'use strict';
  const CSS = `
      .rl-app { position: absolute; display: flex; flex-direction: column; overflow: hidden;
        background: var(--panel); border: 1px solid var(--line); border-radius: 12px;
        box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 12px 32px rgba(0,0,0,.06); }
      .rl-bar { flex: none; display: flex; align-items: center; gap: 18px; height: 46px; padding: 0 18px;
        border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
      .rl-brand { display: flex; align-items: center; gap: 9px; font-weight: 700; font-size: 15px; }
      .rl-mark { width: 22px; height: 22px; border-radius: 5px; background: var(--accent); position: relative; }
      .rl-mark::after { content: ''; position: absolute; left: 5px; right: 5px; top: 6px; height: 10px;
        border-top: 2px solid rgba(255,255,255,.9); border-bottom: 2px solid rgba(255,255,255,.9); }
      .rl-tabs { display: flex; gap: 4px; height: 100%; }
      .rl-tabs span { display: flex; align-items: center; padding: 0 12px; font-size: 14px; color: var(--muted);
        border-bottom: 2px solid transparent; }
      .rl-tabs span.on { color: var(--fg); font-weight: 600; border-bottom-color: var(--accent); }
      .rl-user { margin-left: auto; display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--muted); white-space: nowrap; }
      .rl-user i { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
        font-style: normal; font-weight: 700; font-size: 11.5px; color: #fff; background: color-mix(in srgb, var(--accent) 65%, #333); }
      .rl-work { flex: 1; min-height: 0; display: flex; flex-wrap: wrap; align-content: flex-start; align-items: flex-start;
        gap: 16px 20px; padding: 16px 20px; }
      .rl-card { border: 1px solid var(--line); border-radius: 9px; background: var(--panel); }
      .rl-card > h3 { margin: 0; padding: 10px 14px; font-size: 14.5px; font-weight: 700; border-bottom: 1px solid var(--line);
        display: flex; align-items: center; gap: 10px; white-space: nowrap; }
      .rl-card > h3 small { font-weight: 500; color: var(--muted); font-size: 12.5px; }
      .rl-card-b { padding: 12px 14px; }

      .rl-table { border-collapse: collapse; font-size: 14.5px; }
      .rl-table th { text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; color: var(--muted);
        font-weight: 600; padding: 9px 12px; border-bottom: 1px solid var(--line); white-space: nowrap;
        background: color-mix(in srgb, var(--fg) 2.5%, var(--panel)); }
      .rl-table td { padding: var(--rl-pad, 8px) 12px; border-bottom: 1px solid color-mix(in srgb, var(--line) 65%, transparent); white-space: nowrap; }
      .rl-table tr:last-child td { border-bottom: 0; }
      .rl-table.striped tbody tr:nth-child(even) td { background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
      .rl-table td.key { font-weight: 600; }
      .rl-table.kv td.key { color: var(--muted); font-weight: 500; min-width: 120px; }
      .rl-table.kv td { font-size: 15px; padding: 9px 16px; }
      .rl-table td.num, .rl-table th.num { text-align: right; font-variant-numeric: tabular-nums; }
      .rl-table.compact th { padding: 7px 8px; font-size: 11px; }
      .rl-table.compact td { padding: 5px 8px; font-size: 13px; }
      .rl-table.kv.compact td { padding: 5px 12px; font-size: 13.5px; }
      .rl-table.tight th { padding: 5px 7px; font-size: 10.5px; }
      .rl-table.tight td { padding: 3px 7px; font-size: 12.5px; }
      .rl-form.narrow { flex-basis: 220px; }
      .rl-form.narrow.inline .rl-field { flex-direction: column; align-items: stretch; gap: 4px; }
      .rl-form.narrow.inline .rl-field label { width: auto; text-align: left; }

      .rl-form { flex: 0 1 300px; min-width: 220px; }
      .rl-field { display: flex; flex-direction: column; gap: 6px; }
      .rl-field + .rl-field { margin-top: 12px; }
      .rl-field label { font-size: 13.5px; font-weight: 600; }
      .rl-form.inline .rl-field { flex-direction: row; align-items: center; gap: 10px; }
      .rl-form.inline .rl-field label { flex: none; width: 110px; text-align: right; }
      .rl-input { width: 100%; height: 36px; padding: 0 11px; margin: 0; border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line));
        border-radius: 6px; background: color-mix(in srgb, var(--panel) 70%, var(--bg)); color: var(--fg); font: inherit; font-size: 15px;
        outline: none; user-select: text; -webkit-user-select: text; caret-color: var(--accent); min-width: 0; box-sizing: border-box; }
      .rl-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent); }
      .rl-input::placeholder { color: var(--muted); opacity: .75; }
      .rl-note { margin-top: 10px; font-size: 12.5px; color: var(--muted); }

      .rl-read { max-width: 640px; }
      .rl-read .rl-card-b { padding: 14px 20px; }
      .rl-read p { margin: 0; font-family: Georgia, "Times New Roman", "Liberation Serif", serif; font-size: var(--rl-fs, 17px); line-height: 1.7; }
      .rl-read p + p { margin-top: 10px; }

      .rl-book { display: flex; flex-direction: column; }
      .rl-book .rl-card-b { display: flex; flex-direction: column; gap: 10px; }
      .rl-search { position: relative; }
      .rl-search svg { position: absolute; left: 11px; top: 10px; color: var(--muted); pointer-events: none; }
      .rl-search .rl-input { padding-left: 34px; }
      .rl-results { position: relative; overflow: hidden; }
      .rl-cards { display: flex; gap: 12px; }
      .rl-contact { width: 280px; padding: 12px 14px; border: 1px solid var(--line); border-radius: 8px;
        background: color-mix(in srgb, var(--fg) 1.5%, var(--panel)); box-sizing: border-box; }
      .rl-contact h4 { margin: 0 0 8px; font-size: 16px; display: flex; align-items: center; gap: 10px; }
      .rl-av { flex: none; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
        font-size: 12px; font-weight: 700; color: #fff; }
      .rl-prop { display: flex; gap: 8px; font-size: 13.5px; line-height: 1.5; padding: 2px 0; min-width: 0; }
      .rl-prop > span:first-child { flex: none; width: 60px; color: var(--muted); }
      .rl-prop > span:last-child { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .rl-link { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; cursor: pointer; white-space: nowrap; }
      .rl-link:hover { text-decoration-thickness: 2px; }
      .rl-link[data-clicked] { color: color-mix(in srgb, var(--accent) 55%, var(--fg)); background: color-mix(in srgb, var(--accent) 14%, transparent); border-radius: 3px; }
      .rl-rows td { overflow: hidden; text-overflow: ellipsis; max-width: 220px; }
      .rl-rows td.name { font-weight: 600; }
      .rl-empty { padding: 18px 4px; color: var(--muted); font-size: 14px; }
      .rl-count { font-size: 12.5px; color: var(--muted); white-space: nowrap; }
      .rl-pager { display: flex; align-items: center; gap: 5px; white-space: nowrap; flex-wrap: nowrap; }
      .rl-pg { min-width: 32px; height: 32px; padding: 0 9px; border-radius: 6px; font: inherit; font-size: 13.5px; cursor: pointer;
        border: 1px solid color-mix(in srgb, var(--fg) 18%, var(--line)); background: var(--panel); color: var(--fg); }
      .rl-pg:hover { background: color-mix(in srgb, var(--fg) 6%, var(--panel)); }
      .rl-pg.on { background: var(--accent); border-color: var(--accent); color: #fff; font-weight: 600; }
      .rl-pg:disabled { opacity: .4; cursor: default; }
      .rl-pg.gone { visibility: hidden; }
      .rl-pinfo { padding: 0 8px; font-size: 13.5px; color: var(--muted); }
      .rl-status { display: flex; align-items: center; gap: 10px; height: 34px; padding: 0 10px; border-radius: 7px; font-size: 13.5px;
        background: color-mix(in srgb, var(--fg) 3%, var(--panel)); color: var(--muted); white-space: nowrap; overflow: hidden; }
      .rl-status.bad { background: color-mix(in srgb, #e03131 10%, var(--panel)); color: var(--fg); }
      .rl-status.ok { background: color-mix(in srgb, #2f9e44 12%, var(--panel)); color: var(--fg); }
      .rl-undo { margin-left: auto; height: 26px; padding: 0 12px; border-radius: 5px; font: inherit; font-size: 13px; font-weight: 650; cursor: pointer;
        border: 1px solid color-mix(in srgb, var(--fg) 25%, var(--line)); background: var(--panel); color: var(--fg); }

      .rl-hint { margin: 0 2px 10px; max-width: 360px; font-size: 13px; color: var(--muted); }
      .rl-words { display: grid; gap: 4px 28px; }
      .rl-cb { display: flex; align-items: center; gap: 10px; height: 34px; padding: 0 10px; border-radius: 6px; font-size: 16px; cursor: pointer; }
      .rl-cb input { width: 18px; height: 18px; margin: 0; accent-color: var(--accent); cursor: pointer; }
      .rl-words.tiles .rl-cb { border: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 2%, var(--panel)); height: 38px; padding: 0 14px; }
      .rl-cb.on { background: color-mix(in srgb, var(--accent) 12%, var(--panel)); }

      .rl-grid { display: flex; flex-direction: column; }
      .rl-tools { display: flex; align-items: center; gap: 12px; padding: 8px 12px; border-bottom: 1px solid var(--line); }
      .rl-tools .rl-search { flex: 0 1 300px; }
      .rl-gpane { position: relative; overflow-x: auto; overflow-y: hidden; scrollbar-width: none; overscroll-behavior: contain; }
      .rl-gpane::-webkit-scrollbar { display: none; }
      .rl-gpane .rl-table { table-layout: fixed; }
      .rl-gpane .rl-table td, .rl-gpane .rl-table th { overflow: hidden; text-overflow: ellipsis; height: var(--rl-rh); box-sizing: border-box; padding-top: 0; padding-bottom: 0; }
      .rl-gpane .rl-table.frozen th:first-child, .rl-gpane .rl-table.frozen td:first-child { position: sticky; left: 0; z-index: 1;
        background: var(--panel); box-shadow: 1px 0 0 var(--line); }
      .rl-th { cursor: pointer; user-select: none; }
      .rl-th:hover { color: var(--fg); }
      .rl-th .ar { display: inline-block; width: 12px; margin-left: 4px; opacity: .35; }
      .rl-th.sorted { color: var(--accent); }
      .rl-th.sorted .ar { opacity: 1; }
      .rl-hbar { position: relative; height: 12px; margin: 4px 10px 2px; border-radius: 6px; background: color-mix(in srgb, var(--fg) 6%, var(--panel)); cursor: pointer; touch-action: none; }
      .rl-hthumb { position: absolute; top: 2px; bottom: 2px; border-radius: 4px; background: color-mix(in srgb, var(--fg) 32%, var(--panel)); cursor: grab; touch-action: none; }
      .rl-hthumb.dragging { background: color-mix(in srgb, var(--fg) 52%, var(--panel)); }
      .rl-gfoot { display: flex; align-items: center; gap: 14px; padding: 8px 12px; border-top: 1px solid var(--line); flex-wrap: nowrap; }
      .rl-gfoot .rl-ans { margin-left: auto; display: flex; align-items: center; gap: 8px; white-space: nowrap; }
      .rl-gfoot .rl-ans label { font-size: 13.5px; font-weight: 600; }
      .rl-gfoot .rl-ans .rl-input { width: 190px; }

      .rl-strip { flex: 1 1 100%; display: flex; align-items: center; gap: 10px; padding: 8px 12px; border: 1px solid var(--line); border-radius: 9px; }
      .rl-strip label { font-size: 13.5px; font-weight: 600; white-space: nowrap; }
      .rl-strip .rl-input { max-width: 300px; }

      .rl-chart svg { display: block; overflow: visible; }
      .rl-chart text { fill: var(--muted); font-size: 12px; font-family: inherit; }
      .rl-chart .grid { stroke: color-mix(in srgb, var(--fg) 12%, transparent); stroke-width: 1; }
      .rl-chart .minor { stroke: color-mix(in srgb, var(--fg) 6%, transparent); stroke-dasharray: 3 3; }
      .rl-chart .axis { stroke: color-mix(in srgb, var(--fg) 45%, var(--line)); stroke-width: 1.2; }
      .rl-chart .bar { fill: color-mix(in srgb, var(--accent) 78%, var(--panel)); }
      .rl-chart .hit:hover + .bar, .rl-chart .bar.hov { fill: var(--accent); }
      .rl-chart .line { fill: none; stroke: var(--accent); stroke-width: 2.4; }
      .rl-chart .pt { fill: var(--panel); stroke: var(--accent); stroke-width: 2.4; }
      .rl-chart .pt.hov { fill: var(--accent); }
      .rl-chart text.val { fill: var(--fg); font-weight: 650; }
      .rl-chart .hit { fill: transparent; cursor: crosshair; }
      .rl-tip { position: absolute; pointer-events: none; padding: 6px 10px; border-radius: 6px; font-size: 13px; font-weight: 600; white-space: nowrap;
        background: color-mix(in srgb, var(--fg) 88%, var(--panel)); color: var(--panel); box-shadow: 0 4px 12px rgba(0,0,0,.2); }

      /* vertical scrolling of a datagrid body under a sticky header row ('vs'), with a custom scrollbar */
      .rl-gwrap { display: flex; align-items: flex-start; gap: 4px; padding-right: 6px; }
      .rl-gpane.vs { overflow-y: auto; flex: none; }
      .rl-gpane.vs thead th { position: sticky; top: 0; z-index: 2; box-shadow: inset 0 -1px 0 var(--line); }
      .rl-gpane.vs .rl-table.frozen thead th:first-child { z-index: 3; }
      .rl-gpane.vs .rl-table td:first-child { box-shadow: 1px 0 0 var(--line); }
      .rl-vbar { position: relative; flex: none; width: 12px; border-radius: 6px; background: color-mix(in srgb, var(--fg) 6%, var(--panel)); cursor: pointer; touch-action: none; }
      .rl-vthumb { position: absolute; left: 2px; right: 2px; border-radius: 4px; background: color-mix(in srgb, var(--fg) 32%, var(--panel)); cursor: grab; touch-action: none; }
      .rl-vthumb.dragging { background: color-mix(in srgb, var(--fg) 52%, var(--panel)); }
      .rl-sbrow { display: flex; align-items: center; margin: 4px 10px 2px; }
      .rl-sbarrow { flex: none; box-sizing: border-box; width: 16px; height: 16px; padding: 0; font-size: 8px; line-height: 1; cursor: pointer; }

      /* look 'portal': an early-web portal: bevelled window, fieldsets, <table border=1>, text-link pager */
      .rl-app[data-look=portal] { --rl-hi: color-mix(in srgb, #fff 75%, var(--panel)); --rl-lo: color-mix(in srgb, #000 55%, var(--panel));
        --rl-face: color-mix(in srgb, var(--fg) 9%, var(--panel)); border-radius: 0; box-shadow: none; border: 2px solid;
        border-color: var(--rl-hi) var(--rl-lo) var(--rl-lo) var(--rl-hi); font-family: Arial, "Liberation Sans", Helvetica, sans-serif; background: var(--rl-face); }
      .rl-app[data-look=portal] .rl-bar { height: 26px; padding: 0 6px; gap: 10px; border: 0; color: #fff; background: linear-gradient(90deg, #000080, #1084d0); }
      .rl-app[data-look=portal] .rl-brand { font-size: 13px; gap: 6px; }
      .rl-app[data-look=portal] .rl-mark { width: 14px; height: 14px; border-radius: 0; background: #ffd400; }
      .rl-app[data-look=portal] .rl-mark::after { display: none; }
      .rl-app[data-look=portal] .rl-tabs span { color: #fff; font-size: 12px; padding: 0 8px; border: 0; }
      .rl-app[data-look=portal] .rl-tabs span.on { background: rgba(255,255,255,.22); font-weight: 700; }
      .rl-app[data-look=portal] .rl-user { color: #fff; font-size: 12px; }
      .rl-app[data-look=portal] .rl-user i { border-radius: 0; width: 18px; height: 18px; font-size: 9px; background: #000080; }
      .rl-app[data-look=portal] .rl-work { padding: 12px 14px; gap: 12px 16px; }
      .rl-app[data-look=portal] fieldset.rl-card { box-sizing: border-box; min-width: 0; margin: 0; padding: 0; border: 2px groove var(--rl-hi); border-radius: 0; background: transparent; }
      .rl-app[data-look=portal] fieldset.rl-card legend { padding: 0 5px; margin-left: 8px; font-size: 13px; font-weight: 700; }
      .rl-app[data-look=portal] fieldset.rl-card legend small { font-weight: 400; color: var(--muted); }
      .rl-app[data-look=portal] .rl-card-b { padding: 8px 10px; }
      .rl-app[data-look=portal] .rl-table { border: 1px solid var(--rl-lo); background: var(--panel); font-size: 13px; }
      .rl-app[data-look=portal] .rl-table th { text-transform: none; letter-spacing: 0; font-size: 13px; font-weight: 700; color: var(--fg);
        padding: 4px 8px; background: var(--rl-face); border: 1px solid var(--rl-lo); }
      .rl-app[data-look=portal] .rl-table th u { text-decoration: underline; }
      .rl-app[data-look=portal] .rl-table td { padding: 3px 8px; font-size: 13px; border: 1px solid var(--rl-lo); }
      .rl-app[data-look=portal] .rl-table tr:last-child td { border-bottom: 1px solid var(--rl-lo); }
      .rl-app[data-look=portal] .rl-table.kv td { font-size: 13px; padding: 4px 10px; }
      .rl-app[data-look=portal] .rl-table.compact td, .rl-app[data-look=portal] .rl-table.tight td { padding: 2px 6px; font-size: 12px; }
      .rl-app[data-look=portal] .rl-table.compact th, .rl-app[data-look=portal] .rl-table.tight th { padding: 2px 6px; font-size: 12px; }
      .rl-app[data-look=portal] .rl-gpane .rl-table td, .rl-app[data-look=portal] .rl-gpane .rl-table th { padding-top: 0; padding-bottom: 0; }
      .rl-app[data-look=portal] .rl-input { height: 24px; border-radius: 0; font-size: 13px; padding: 0 5px; background: var(--panel);
        border: 2px solid; border-color: var(--rl-lo) var(--rl-hi) var(--rl-hi) var(--rl-lo); box-shadow: none; }
      .rl-app[data-look=portal] .rl-input:focus { box-shadow: none; outline: 1px dotted var(--fg); outline-offset: -4px; }
      .rl-app[data-look=portal] .rl-search svg { display: none; }
      .rl-app[data-look=portal] .rl-search .rl-input { padding-left: 5px; }
      .rl-app[data-look=portal] .rl-field label, .rl-app[data-look=portal] .rl-gfoot .rl-ans label { font-size: 13px; }
      .rl-app[data-look=portal] .rl-gfoot, .rl-app[data-look=portal] .rl-tools { border-color: var(--rl-lo); }
      .rl-app[data-look=portal] .rl-pager { gap: 8px; font-size: 13px; }
      .rl-app[data-look=portal] a.rl-pg { min-width: 0; height: auto; padding: 0; border: 0; background: none; border-radius: 0; color: var(--accent);
        text-decoration: underline; font-size: 13px; cursor: pointer; }
      .rl-app[data-look=portal] a.rl-pg.on { color: var(--fg); font-weight: 700; text-decoration: none; background: none; }
      .rl-app[data-look=portal] a.rl-pg.off { color: var(--muted); text-decoration: none; cursor: default; }
      .rl-app[data-look=portal] .rl-undo, .rl-app[data-look=portal] .rl-sbarrow { border-radius: 0; background: var(--rl-face); color: var(--fg);
        border: 2px solid; border-color: var(--rl-hi) var(--rl-lo) var(--rl-lo) var(--rl-hi); }
      .rl-app[data-look=portal] .rl-sbrow .rl-hbar { margin: 0; height: 16px; border-radius: 0; background: repeating-conic-gradient(var(--rl-face) 0 25%, var(--panel) 0 50%) 0 0 / 2px 2px; }
      .rl-app[data-look=portal] .rl-hthumb, .rl-app[data-look=portal] .rl-vthumb { top: 0; bottom: 0; border-radius: 0; background: var(--rl-face);
        border: 2px solid; border-color: var(--rl-hi) var(--rl-lo) var(--rl-lo) var(--rl-hi); box-sizing: border-box; }
      .rl-app[data-look=portal] .rl-vthumb { left: 0; right: 0; top: auto; bottom: auto; }
      .rl-app[data-look=portal] .rl-vbar { border-radius: 0; width: 16px; background: repeating-conic-gradient(var(--rl-face) 0 25%, var(--panel) 0 50%) 0 0 / 2px 2px; }
      .rl-app[data-look=portal] .rl-status { border-radius: 0; background: transparent; padding: 0 2px; }
      .rl-app[data-look=portal] .rl-contact { border-radius: 0; border: 1px solid var(--rl-lo); background: var(--panel); }
      .rl-app[data-look=portal] .rl-av { border-radius: 0; }
      .rl-app[data-look=portal] .rl-read p { font-family: "Times New Roman", "Liberation Serif", serif; }
      .rl-app[data-look=portal] .rl-strip { border-radius: 0; border: 2px groove var(--rl-hi); }
      .rl-app[data-look=portal] .rl-cb input { border-radius: 0; }

      /* look 'dense': an enterprise data grid: small type, ruled cells, tight rows, a flat toolbar-style frame */
      .rl-app[data-look=dense] { border-radius: 3px; box-shadow: none; font-size: 12px; }
      .rl-app[data-look=dense] .rl-bar { height: 34px; padding: 0 10px; gap: 14px; background: color-mix(in srgb, var(--accent) 14%, var(--panel)); }
      .rl-app[data-look=dense] .rl-brand { font-size: 13px; gap: 6px; }
      .rl-app[data-look=dense] .rl-mark { width: 16px; height: 16px; border-radius: 2px; }
      .rl-app[data-look=dense] .rl-mark::after { left: 3px; right: 3px; top: 4px; height: 6px; }
      .rl-app[data-look=dense] .rl-tabs span { font-size: 12px; padding: 0 9px; }
      .rl-app[data-look=dense] .rl-user { font-size: 11.5px; }
      .rl-app[data-look=dense] .rl-user i { width: 20px; height: 20px; font-size: 9px; border-radius: 3px; }
      .rl-app[data-look=dense] .rl-work { padding: 8px 10px; gap: 8px 10px; }
      .rl-app[data-look=dense] .rl-card { border-radius: 2px; }
      .rl-app[data-look=dense] .rl-card > h3 { padding: 5px 9px; font-size: 11.5px; text-transform: uppercase; letter-spacing: .05em;
        background: color-mix(in srgb, var(--fg) 5%, var(--panel)); }
      .rl-app[data-look=dense] .rl-card > h3 small { font-size: 11px; }
      .rl-app[data-look=dense] .rl-table { font-size: 12px; }
      .rl-app[data-look=dense] .rl-table th { font-size: 11px; padding: 3px 8px; border: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 7%, var(--panel)); }
      .rl-app[data-look=dense] .rl-table td { padding: 2px 8px; font-size: 12px; border: 1px solid var(--line); }
      .rl-app[data-look=dense] .rl-table tr:last-child td { border-bottom: 1px solid var(--line); }
      .rl-app[data-look=dense] .rl-table.kv td { font-size: 12px; padding: 4px 10px; }
      .rl-app[data-look=dense] .rl-gpane .rl-table td, .rl-app[data-look=dense] .rl-gpane .rl-table th { padding-top: 0; padding-bottom: 0; }
      .rl-app[data-look=dense] .rl-input { height: 24px; border-radius: 2px; font-size: 12px; padding: 0 7px; }
      .rl-app[data-look=dense] .rl-search svg { top: 5px; width: 13px; height: 13px; }
      .rl-app[data-look=dense] .rl-search .rl-input { padding-left: 26px; }
      .rl-app[data-look=dense] .rl-pg { min-width: 24px; height: 22px; padding: 0 6px; border-radius: 2px; font-size: 12px; }
      .rl-app[data-look=dense] .rl-tools, .rl-app[data-look=dense] .rl-gfoot { padding: 5px 8px; gap: 10px; }
      .rl-app[data-look=dense] .rl-count { font-size: 11.5px; }
      .rl-app[data-look=dense] .rl-field label, .rl-app[data-look=dense] .rl-gfoot .rl-ans label { font-size: 12px; }
      .rl-app[data-look=dense] .rl-gfoot .rl-ans .rl-input { width: 150px; }
      .rl-app[data-look=dense] .rl-hbar { height: 10px; margin: 3px 8px 2px; }

      /* look 'cards': a mobile-style list: elevated app bar, rounded tiles for rows, sort chips */
      .rl-app[data-look=cards] { border-radius: 18px; }
      .rl-app[data-look=cards] .rl-bar { height: 52px; border: 0; background: var(--accent); color: #fff; box-shadow: 0 2px 6px rgba(0,0,0,.22); }
      .rl-app[data-look=cards] .rl-brand { font-size: 17px; }
      .rl-app[data-look=cards] .rl-mark { background: rgba(255,255,255,.9); border-radius: 50%; }
      .rl-app[data-look=cards] .rl-mark::after { border-color: var(--accent); }
      .rl-app[data-look=cards] .rl-tabs span { color: rgba(255,255,255,.78); }
      .rl-app[data-look=cards] .rl-tabs span.on { color: #fff; border-bottom-color: #fff; }
      .rl-app[data-look=cards] .rl-user { color: rgba(255,255,255,.85); }
      .rl-app[data-look=cards] .rl-user i { background: rgba(255,255,255,.25); }
      .rl-app[data-look=cards] .rl-card { border: 0; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,.16), 0 4px 12px rgba(0,0,0,.07); overflow: hidden; }
      .rl-app[data-look=cards] .rl-card > h3 { border-bottom: 0; font-size: 16px; padding: 14px 18px 6px; }
      .rl-app[data-look=cards] .rl-input { border-radius: 10px; }
      .rl-app[data-look=cards] .rl-pg { border-radius: 16px; min-width: 34px; height: 34px; }
      .rl-tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(var(--rl-tw, 210px), 1fr)); gap: 12px; padding: 10px 14px 14px; }
      .rl-tiles.kv { grid-template-columns: minmax(0, 440px); }
      .rl-tile { padding: 10px 14px; border-radius: 14px; background: color-mix(in srgb, var(--fg) 3%, var(--panel));
        box-shadow: 0 1px 2px rgba(0,0,0,.14); min-width: 0; }
      .rl-tile h4 { margin: 0 0 4px; font-size: 15px; overflow-wrap: anywhere; }
      .rl-tl { display: flex; justify-content: space-between; gap: 10px; font-size: 13px; line-height: 1.6; }
      .rl-tl .k { flex: none; color: var(--muted); }
      .rl-tl .v { min-width: 0; font-weight: 550; text-align: right; overflow-wrap: anywhere; }
      .rl-tiles.kv .rl-tl { font-size: 14.5px; line-height: 1.9; }
      .rl-tiles.compact { gap: 8px; padding: 8px 10px 10px; --rl-tw: 180px; }
      .rl-tiles.compact .rl-tile { padding: 7px 11px; }
      .rl-tiles.compact .rl-tl { font-size: 12.5px; line-height: 1.45; }
      .rl-tiles.tight { gap: 6px; padding: 6px 8px 8px; --rl-tw: 150px; }
      .rl-tiles.tight .rl-tile { padding: 5px 9px; }
      .rl-tiles.tight .rl-tile h4 { font-size: 13.5px; margin-bottom: 2px; }
      .rl-tiles.tight .rl-tl { font-size: 12px; line-height: 1.35; }
      .rl-chip { display: inline-flex; align-items: center; height: 30px; padding: 0 12px; border-radius: 15px; font: inherit; font-size: 13px;
        border: 1px solid color-mix(in srgb, var(--fg) 20%, var(--line)); background: var(--panel); color: var(--fg); cursor: pointer; }
      .rl-chip.sorted { background: color-mix(in srgb, var(--accent) 16%, var(--panel)); border-color: var(--accent); color: var(--fg); }
      .rl-tools:has(.rl-chip) { flex-wrap: wrap; row-gap: 6px; }
      .rl-info { display: inline-flex; width: 26px; height: 26px; align-items: center; justify-content: center; border-radius: 50%;
        color: var(--muted); cursor: help; }
      .rl-info:hover, .rl-info.on { color: var(--accent); background: color-mix(in srgb, var(--accent) 12%, transparent); }
      .rl-info svg { width: 17px; height: 17px; }
      .rl-ttip { position: absolute; z-index: 5; pointer-events: none; padding: 8px 11px; border-radius: 7px; font-size: 13px; line-height: 1.5;
        white-space: nowrap; color: #fff; background: color-mix(in srgb, var(--fg) 88%, #000); box-shadow: 0 6px 18px rgba(0,0,0,.2); }
      .rl-ttip b { font-weight: 600; opacity: .75; margin-right: 6px; }
      .rl-app[data-look=portal] .rl-ttip { border-radius: 0; color: #000; background: #ffffe1; border: 1px solid #000; box-shadow: none; }
      .rl-notes { margin: 0; padding-left: 20px; font-size: 15px; line-height: 1.9; }
      .rl-abbr { border-bottom: 1.5px dotted currentColor; cursor: help; font-weight: 600; }
      .rl-abbr:hover, .rl-abbr.on { color: var(--accent); }

      /* locate / count: a document viewer with a floating find bar */
      .rl-doc { display: flex; flex-direction: column; flex: none; min-width: 0; box-sizing: border-box; }
      .rl-doc > .rl-card-b { flex: 1; min-height: 0; display: flex; flex-direction: column; }
      .rl-tbtn { display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 12px; border-radius: 6px; font: inherit; font-size: 13.5px;
        cursor: pointer; border: 1px solid color-mix(in srgb, var(--fg) 18%, var(--line)); background: var(--panel); color: var(--fg); white-space: nowrap; }
      .rl-tbtn:hover { background: color-mix(in srgb, var(--fg) 6%, var(--panel)); }
      .rl-tbtn svg { color: var(--muted); }
      .rl-dwrap { position: relative; flex: 1; min-height: 0; display: flex; gap: 4px; padding-right: 6px; }
      .rl-dwrap .rl-vbar { align-self: stretch; margin: 8px 0; }
      .rl-dpane { flex: 1; min-width: 0; overflow: hidden; padding: 14px 22px 18px; }
      .rl-sec + .rl-sec { margin-top: 16px; }
      .rl-sech { display: flex; align-items: center; gap: 8px; margin: 0 0 6px; padding: 0; font: inherit; font-size: 16px; font-weight: 700;
        color: var(--fg); background: none; border: 0; text-align: left; }
      button.rl-sech { box-sizing: border-box; width: calc(100% + 8px); margin-left: -8px; padding: 5px 8px; border-radius: 6px; cursor: pointer; }
      button.rl-sech:hover { background: color-mix(in srgb, var(--fg) 5%, var(--panel)); }
      .rl-chev { flex: none; width: 12px; color: var(--muted); }
      .rl-secb p { margin: 0; font-size: var(--rl-fs, 15px); line-height: 1.65; }
      .rl-secb p + p { margin-top: 8px; }
      .rl-hl { background: #ffe066; color: #111; border-radius: 2px; }
      .rl-hl.cur { background: #ff922b; }
      .rl-findbar { position: absolute; top: 8px; right: 26px; z-index: 3; display: flex; align-items: center; gap: 3px; padding: 5px 7px;
        border: 1px solid var(--line); border-radius: 8px; background: var(--panel); box-shadow: 0 6px 18px rgba(0,0,0,.16); }
      .rl-findbar .rl-search { width: 190px; }
      .rl-findbar .rl-search svg { top: 7px; }
      .rl-findbar .rl-input { height: 30px; font-size: 14px; }
      .rl-fcount { min-width: 62px; padding: 0 4px; font-size: 12.5px; color: var(--muted); white-space: nowrap; text-align: center; }
      .rl-fbtn { min-width: 28px; height: 28px; padding: 0 6px; border-radius: 5px; font: inherit; font-size: 12.5px; font-weight: 650; cursor: pointer;
        border: 1px solid transparent; background: none; color: var(--fg); }
      .rl-fbtn:hover { background: color-mix(in srgb, var(--fg) 7%, var(--panel)); }
      .rl-fbtn.on { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 16%, var(--panel)); color: var(--accent); }
      .rl-fbtn.whole { text-decoration: underline; text-underline-offset: 3px; }
      .rl-doc .rl-gfoot .rl-ans .rl-input { width: 200px; }
      .rl-app[data-look=portal] .rl-tbtn, .rl-app[data-look=portal] .rl-fbtn { height: 24px; border-radius: 0; font-size: 12px; color: var(--fg);
        background: var(--rl-face); border: 2px solid; border-color: var(--rl-hi) var(--rl-lo) var(--rl-lo) var(--rl-hi); }
      .rl-app[data-look=portal] .rl-fbtn.on { background: var(--panel); border-color: var(--rl-lo) var(--rl-hi) var(--rl-hi) var(--rl-lo); }
      .rl-app[data-look=portal] .rl-findbar { border-radius: 0; box-shadow: 2px 2px 0 rgba(0,0,0,.35); background: var(--rl-face);
        border: 2px solid; border-color: var(--rl-hi) var(--rl-lo) var(--rl-lo) var(--rl-hi); }
      .rl-app[data-look=portal] .rl-findbar .rl-input { height: 22px; }
      .rl-app[data-look=portal] .rl-dpane { background: var(--panel); }
      .rl-app[data-look=portal] .rl-secb p { font-family: "Times New Roman", "Liberation Serif", serif; }
      .rl-app[data-look=portal] button.rl-sech { border-radius: 0; text-decoration: underline; }
      .rl-app[data-look=portal] .rl-hl.cur { background: #000080; color: #fff; }
      `;
  const DB_CSS = `
      .db-app { position: absolute; display: flex; flex-direction: column; overflow: hidden; background: var(--bg);
        border: 1px solid var(--line); border-radius: 12px; }
      .db-bar { flex: none; display: flex; align-items: center; gap: 16px; height: 44px; padding: 0 16px; background: var(--panel);
        border-bottom: 1px solid var(--line); font-size: 14px; }
      .db-brand { display: flex; align-items: center; gap: 8px; font-weight: 700; }
      .db-brand i { width: 20px; height: 20px; border-radius: 5px; background: var(--accent); }
      .db-nav { display: flex; gap: 14px; color: var(--muted); white-space: nowrap; overflow: hidden; }
      .db-nav span.on { color: var(--fg); font-weight: 600; }
      .db-chip { margin-left: auto; padding: 5px 11px; border: 1px solid var(--line); border-radius: 15px; color: var(--muted); font-size: 12.5px; white-space: nowrap; }
      .db-canvas { display: block; flex: none; cursor: default; }
      .db-ans { position: absolute; display: flex; align-items: center; gap: 9px; padding: 8px 12px; background: var(--panel);
        border: 1px solid var(--line); border-radius: 9px; box-shadow: 0 4px 14px rgba(0,0,0,.08); }
      .db-ans label { font-size: 13.5px; font-weight: 600; white-space: nowrap; }
      .db-ans input { width: 200px; height: 32px; padding: 0 10px; border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line));
        border-radius: 6px; font: inherit; font-size: 14px; color: var(--fg); background: var(--panel); }
      .db-ans input:focus { outline: 2px solid color-mix(in srgb, var(--accent) 45%, transparent); border-color: var(--accent); }
      `;
  env.template('find-fact/_base-style', () => ({ CSS, DB_CSS }));
})();
