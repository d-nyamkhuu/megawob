/* Byte-identical structural CSS shared by table, find-word, phone-book and similar. */
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
  `;
  env.template('find-fact/_style', () => ({ CSS }));
})();
