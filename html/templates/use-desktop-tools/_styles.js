/* use-desktop-tools/_styles: shared template code; no DOM work until a builder runs. */
(function () {
  'use strict';
  const workspaceCSS = `
  .at-win { position: absolute; display: flex; flex-direction: column; overflow: hidden;
    background: var(--panel); border: 1px solid var(--line); border-radius: 10px;
    box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 12px 32px rgba(0,0,0,.08); }
  .at-title { flex: none; position: relative; display: flex; align-items: center; gap: 12px; height: 38px; padding: 0 14px;
    background: color-mix(in srgb, var(--fg) 5%, var(--panel)); border-bottom: 1px solid var(--line); }
  .at-dots { display: flex; gap: 7px; }
  .at-dots i { width: 12px; height: 12px; border-radius: 50%; background: #ff5f57; }
  .at-dots i:nth-child(2) { background: #febc2e; }
  .at-dots i:nth-child(3) { background: #28c840; }
  .at-title b { position: absolute; left: 0; right: 0; text-align: center; font-size: 13px; font-weight: 600; color: var(--muted); pointer-events: none; }
  .at-appmenu { position: relative; z-index: 2; height: 26px; padding: 0 10px; border: 1px solid transparent; border-radius: 6px; background: transparent;
    color: var(--fg); font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; }
  .at-appmenu:hover, .at-appmenu[data-open] { background: color-mix(in srgb, var(--fg) 8%, transparent); }
  .at-menu { position: absolute; z-index: 40; min-width: 200px; padding: 5px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel);
    box-shadow: 0 10px 28px rgba(0,0,0,.2); font-size: 13.5px; }
  .at-menu[hidden] { display: none; }
  .at-mi { display: flex; align-items: center; gap: 18px; justify-content: space-between; padding: 6px 10px; border-radius: 5px; cursor: default; white-space: nowrap; }
  .at-mi:hover { background: color-mix(in srgb, var(--accent) 14%, transparent); }
  .at-mi kbd { font: inherit; font-size: 12px; color: var(--muted); }
  .at-mi[data-off] { color: var(--muted); opacity: .6; }
  .at-mi[data-off]:hover { background: none; }
  .at-msep { height: 1px; margin: 4px 6px; background: var(--line); }
  .at-body { flex: 1; display: flex; min-height: 0; }
  .at-rail { flex: none; width: 50px; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 10px 0;
    background: color-mix(in srgb, var(--fg) 4%, var(--panel)); border-right: 1px solid var(--line); }
  .at-rail span { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 9px; color: var(--muted); }
  .at-rail span.on { color: var(--accent); background: color-mix(in srgb, var(--accent) 14%, transparent); }
  .at-rail span.end { margin-top: auto; cursor: pointer; }
  .at-rail span.end:hover { color: var(--fg); background: color-mix(in srgb, var(--fg) 7%, transparent); }
  .at-rail svg { width: 20px; height: 20px; }
  .at-main { flex: 1; min-width: 0; display: flex; position: relative; }

  /* tree */
  .at-explorer { flex: none; display: flex; flex-direction: column; border-right: 1px solid var(--line); min-height: 0;
    background: color-mix(in srgb, var(--fg) 2%, var(--panel)); }
  .at-pane-h { flex: none; display: flex; align-items: center; gap: 8px; height: 38px; padding: 0 14px; font-size: 11.5px; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase; color: var(--muted); border-bottom: 1px solid var(--line); white-space: nowrap; overflow: hidden; }
  .at-tree { flex: 1; min-height: 0; padding: 6px 6px 18px; overflow-y: auto; outline: none; user-select: none; -webkit-user-select: none;
    scrollbar-width: thin; }
  .at-row { display: flex; align-items: center; gap: 6px; height: var(--rowh, 26px); padding-right: 10px; border-radius: 6px;
    font-size: var(--rowf, 14px); white-space: nowrap; cursor: pointer; }
  .at-row:hover { background: color-mix(in srgb, var(--fg) 6%, transparent); }
  .at-row[data-sel] { background: color-mix(in srgb, var(--accent) 16%, transparent); font-weight: 600; }
  .at-tree:focus .at-row[data-sel] { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 55%, transparent); }
  .at-row[data-lifted] { opacity: .45; }
  .at-row[data-drop] { background: color-mix(in srgb, var(--accent) 26%, transparent); box-shadow: inset 0 0 0 2px var(--accent); }
  .at-row .chev { flex: none; width: 14px; height: 14px; color: var(--muted); }
  .at-row[data-open] .chev { transform: rotate(90deg); }
  .at-row .ico { flex: none; width: 17px; height: 17px; }
  .at-row .sp { flex: none; width: 14px; }
  .at-row .nm { overflow: hidden; text-overflow: ellipsis; }
  .at-row input { flex: 1; min-width: 60px; height: calc(var(--rowh, 26px) - 4px); padding: 0 6px; border: 1px solid var(--accent); border-radius: 4px;
    background: var(--panel); color: var(--fg); font: inherit; font-weight: 400; outline: 2px solid color-mix(in srgb, var(--accent) 30%, transparent); }
  .at-row.at-loading { color: var(--muted); font-style: italic; cursor: default; }
  .at-row.at-loading:hover { background: none; }
  .at-spin { flex: none; width: 15px; height: 15px; }
  .at-preview { flex: 1; min-width: 0; display: flex; flex-direction: column; }
  .at-crumbs { flex: none; display: flex; align-items: center; gap: 6px; height: 38px; padding: 0 18px; font-size: 13px; color: var(--muted);
    border-bottom: 1px solid var(--line); white-space: nowrap; overflow: hidden; }
  .at-crumbs b { color: var(--fg); font-weight: 600; overflow: hidden; text-overflow: ellipsis; }
  .at-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 0 24px;
    color: var(--muted); font-size: 14px; text-align: center; line-height: 1.5; }
  .at-empty svg { width: 50px; height: 50px; opacity: .45; }
  .at-card { margin: 22px; padding: 18px 20px; border: 1px solid var(--line); border-radius: 10px; display: flex; gap: 16px; align-items: flex-start; min-width: 0; }
  .at-card > svg { flex: none; width: 44px; height: 44px; }
  .at-card > div { min-width: 0; }
  .at-card h3 { margin: 2px 0 6px; font-size: 16px; overflow-wrap: anywhere; }
  .at-card p { margin: 0; color: var(--muted); font-size: 13px; line-height: 1.6; overflow-wrap: anywhere; }
  .at-back { align-self: flex-start; margin: 16px 22px 0; height: 30px; padding: 0 12px; border: 1px solid var(--line); border-radius: 6px;
    background: var(--panel); color: var(--fg); font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; }
  .at-back:hover { background: color-mix(in srgb, var(--fg) 6%, var(--panel)); }
  .at-tips { margin: 0 22px; padding: 12px 14px; border-radius: 8px; background: color-mix(in srgb, var(--accent) 8%, transparent);
    color: var(--muted); font-size: 13px; line-height: 1.5; }
  .at-ghost { position: absolute; z-index: 30; pointer-events: none; display: flex; align-items: center; gap: 6px; padding: 4px 10px;
    border-radius: 6px; background: var(--panel); border: 1px solid var(--accent); box-shadow: 0 6px 18px rgba(0,0,0,.18); font-size: 13px; white-space: nowrap; opacity: .85; }
  .at-ghost[hidden] { display: none; }
  .at-ghost .ico { width: 16px; height: 16px; flex: none; }
  .at-toast { position: absolute; z-index: 25; left: 14px; bottom: 14px; display: flex; align-items: center; gap: 14px; max-width: calc(100% - 28px);
    padding: 9px 12px 9px 14px; border-radius: 8px; background: #2b2f38; color: #f1f3f7; font-size: 13.5px; box-shadow: 0 8px 24px rgba(0,0,0,.25); }
  .at-toast[hidden] { display: none; }
  .at-toast span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .at-toast button { flex: none; border: 0; background: none; color: #8ab4ff; font: inherit; font-weight: 700; cursor: pointer; padding: 4px 6px; }

  /* terminal */
  .at-term { flex: 1; min-width: 0; display: flex; flex-direction: column; margin: 12px; border-radius: 9px; overflow: hidden;
    background: #14161b; color: #d6dae2; border: 1px solid #2a2e37; }
  .at-term-tabs { flex: none; display: flex; align-items: center; gap: 2px; height: 32px; padding: 0 10px; background: #1c1f26; border-bottom: 1px solid #2a2e37;
    font: 12.5px ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; color: #8b93a3; }
  .at-term-tabs span { padding: 6px 12px; border-radius: 6px 6px 0 0; }
  .at-term-tabs span.on { color: #e6e9ef; background: #14161b; }
  .at-tscroll { flex: 1; min-height: 0; overflow-y: auto; padding: 10px 14px; cursor: text;
    font: 14px/1.5 ui-monospace, "SFMono-Regular", Menlo, Consolas, "DejaVu Sans Mono", monospace; scrollbar-width: thin; scrollbar-color: #3a3f4b transparent; }
  .at-tl { white-space: pre-wrap; word-break: break-all; min-height: 1.5em; }
  .at-tl.out { color: #b5bccb; }
  .at-tl.err { color: #ff8a80; }
  .at-tl.dim { color: #7c8596; }
  .at-tl.ok { color: #9be9a8; }
  .at-ps { color: #7ee787; }
  .at-pc { color: #79c0ff; }
  .at-prompt { display: flex; align-items: baseline; }
  .at-prompt input { flex: 1; min-width: 40px; padding: 0; margin: 0 0 0 .6em; border: 0; outline: 0; background: transparent;
    color: #f0f3f8; font: inherit; caret-color: #f0f3f8; }

  /* editor */
  .at-ed { flex: 1; min-width: 0; display: flex; flex-direction: column; }
  .at-tb { flex: none; position: relative; z-index: 3; display: flex; flex-wrap: wrap; align-items: center; gap: 3px; min-height: 46px; padding: 6px 10px;
    border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 2%, var(--panel)); }
  .at-tb .sep { width: 1px; height: 22px; margin: 0 5px; background: var(--line); }
  .at-tool { position: relative; min-width: 32px; height: 32px; padding: 0 7px; display: inline-flex; align-items: center; justify-content: center; gap: 5px;
    border: 1px solid transparent; border-radius: 6px; background: transparent; color: var(--fg); font: inherit; font-size: 15px; cursor: pointer; }
  .at-tool:hover { background: color-mix(in srgb, var(--fg) 7%, transparent); }
  .at-tool[data-on] { background: color-mix(in srgb, var(--accent) 16%, transparent); color: var(--accent); }
  .at-tool[data-off] { opacity: .38; }
  .at-tool.deco { color: var(--muted); font-size: 13px; }
  .at-tool.wide { justify-content: space-between; min-width: 96px; border-color: var(--line); background: var(--panel); font-size: 13px; }
  .at-tool svg { width: 16px; height: 16px; }
  .at-tool .A { display: flex; flex-direction: column; align-items: center; font-weight: 700; line-height: 1; font-size: 15px; }
  .at-tool .A i { display: block; width: 16px; height: 4px; margin-top: 3px; border-radius: 1px; }
  .at-pop { position: absolute; z-index: 6; padding: 8px; border: 1px solid var(--line); border-radius: 9px; background: var(--panel);
    box-shadow: 0 10px 28px rgba(0,0,0,.18); }
  .at-pop[hidden] { display: none; }
  .at-pop .grid { display: grid; grid-template-columns: repeat(6, 26px); gap: 6px; }
  .at-sw { width: 26px; height: 26px; border-radius: 6px; cursor: pointer; border: 1px solid rgba(0,0,0,.12); }
  .at-sw:hover { outline: 2px solid var(--fg); outline-offset: 1px; }
  .at-sw.def { grid-column: span 6; width: auto; height: 28px; display: flex; align-items: center; justify-content: center; gap: 8px;
    border-color: var(--line); background: var(--panel); font-size: 12.5px; color: var(--muted); }
  .at-sw.def::before { content: ''; width: 14px; height: 14px; border-radius: 3px; background: var(--fg); }
  .at-szo { padding: 4px 14px; border-radius: 5px; cursor: pointer; white-space: nowrap; }
  .at-szo:hover { background: color-mix(in srgb, var(--accent) 14%, transparent); }
  .at-szo[data-on] { color: var(--accent); font-weight: 700; }
  .at-pagearea { flex: 1; min-height: 0; padding: 18px 22px; overflow: auto; background: color-mix(in srgb, var(--fg) 4%, var(--bg)); display: flex; justify-content: center; align-items: flex-start; }
  .at-sheet { width: 100%; max-width: 760px; padding: 22px 32px 26px; background: var(--panel); border: 1px solid var(--line);
    border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 8px 24px rgba(0,0,0,.06); }
  .at-sheet h2 { margin: 0 0 4px; font-size: 13px; font-weight: 600; color: var(--muted); letter-spacing: .02em; }
  .at-sheet hr { border: 0; border-top: 1px solid var(--line); margin: 8px 0 14px; }
  .at-doc { font-family: Georgia, "Times New Roman", serif; line-height: 1.6; color: var(--fg); user-select: text; -webkit-user-select: text; cursor: text; }
  .at-p { position: relative; margin: 0 0 .55em; }
  .at-p[data-list] { padding-left: 1.7em; margin-bottom: .2em; }
  .at-p .mk { position: absolute; left: .2em; top: 0; color: var(--muted); user-select: none; }
  .at-doc span.b { font-weight: 700; }
  .at-doc span.i { font-style: italic; }
  .at-doc span.u { text-decoration: underline; text-decoration-thickness: 1.5px; text-underline-offset: 3px; }
  .at-doc span.s-small { font-size: .8em; }
  .at-doc span.s-large { font-size: 1.35em; }
  .at-doc span.s-huge { font-size: 1.75em; }
  .at-doc ::selection { background: color-mix(in srgb, var(--accent) 30%, transparent); }
  .at-status { flex: none; display: flex; gap: 18px; height: 26px; align-items: center; padding: 0 16px; font-size: 12px; color: var(--muted);
    border-top: 1px solid var(--line); }

  /* calendar + week */
  .at-cal { flex: 1; min-width: 0; display: flex; flex-direction: column; padding: 0 0 12px 0; position: relative; }
  .at-cal-h { flex: none; display: flex; align-items: center; gap: 10px; height: 50px; padding: 0 16px; }
  .at-cal-h .nav { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--line); display: flex; align-items: center; justify-content: center; color: var(--muted); }
  .at-cal-h .today { padding: 4px 12px; border: 1px solid var(--line); border-radius: 6px; font-size: 13px; font-weight: 600; }
  .at-cal-h h3 { margin: 0 0 0 6px; font-size: 17px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .at-cal-h .chip { margin-left: auto; padding: 4px 12px; border-radius: 14px; font-size: 12.5px; font-weight: 600; color: var(--accent);
    background: color-mix(in srgb, var(--accent) 13%, transparent); }
  .at-cal-wrap { flex: 1; min-height: 0; position: relative; margin: 0 12px 0 16px; }
  .at-cal-frame { position: absolute; left: 0; right: 0; top: 0; display: flex; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
  .at-cal-scroll { flex: 1; min-width: 0; overflow-y: auto; scrollbar-width: none; }
  .at-cal-scroll::-webkit-scrollbar { display: none; }
  .at-cal-grid { position: relative; display: flex; }
  .at-gut { flex: none; width: 60px; position: relative; border-right: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 2%, var(--panel)); }
  .at-gut span { position: absolute; right: 8px; margin-top: 3px; font-size: 11px; line-height: 1.2; color: var(--muted); }
  .at-col { flex: 1; min-width: 0; position: relative; cursor: crosshair; touch-action: none; }
  .at-wcols .at-col { cursor: default; border-left: 1px solid color-mix(in srgb, var(--line) 70%, transparent); }
  .at-wcols .at-col:first-child { border-left: 0; }
  .at-hh { position: absolute; left: 0; right: 0; border-top: 1px solid color-mix(in srgb, var(--line) 85%, transparent); pointer-events: none; }
  .at-hh.half { border-top-style: dashed; border-top-color: color-mix(in srgb, var(--line) 55%, transparent); }
  .at-ev { position: absolute; left: 6px; right: 34%; padding: 2px 8px; border-radius: 6px; overflow: hidden; pointer-events: none;
    font-size: 12px; line-height: 1.3; border-left: 4px solid; }
  .at-ev b { display: block; font-size: 12.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .at-ev.t0, .at-wev.t0 { --tone: #3b74e0; } .at-ev.t1, .at-wev.t1 { --tone: #2f9e44; } .at-ev.t2, .at-wev.t2 { --tone: #e08a00; } .at-ev.t3, .at-wev.t3 { --tone: #9c36b5; }
  .at-ev[class*=" t"], .at-wev { background: color-mix(in srgb, var(--tone) 17%, var(--panel)); border-color: var(--tone);
    color: color-mix(in srgb, var(--tone) 45%, var(--fg)); }
  .at-ev.user { left: 30%; right: 8px; background: color-mix(in srgb, var(--accent) 22%, var(--panel)); border-color: var(--accent); color: var(--fg);
    box-shadow: 0 2px 8px rgba(0,0,0,.12); }
  .at-ev.user.draft { background: color-mix(in srgb, var(--accent) 12%, var(--panel)); border-style: dashed; border-width: 1px 1px 1px 4px; }
  .at-wev { position: absolute; left: 3px; right: 3px; padding: 1px 6px; border-radius: 5px; overflow: hidden; font-size: 11.5px; line-height: 1.25;
    border-left: 3px solid; cursor: grab; touch-action: none; user-select: none; }
  .at-wev b { display: block; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .at-wev span { white-space: nowrap; }
  .at-wev[data-dragging] { opacity: .35; }
  .at-whandle { position: absolute; left: 0; right: 0; bottom: 0; height: 6px; cursor: ns-resize; }
  .at-whandle::after { content: ''; position: absolute; left: 50%; bottom: 1px; width: 16px; height: 2px; margin-left: -8px; border-radius: 1px; background: color-mix(in srgb, var(--tone) 60%, transparent); }
  .at-wghost { position: absolute; z-index: 5; border: 2px dashed var(--accent); border-radius: 5px; background: color-mix(in srgb, var(--accent) 12%, transparent); pointer-events: none; }
  .at-wghost[hidden] { display: none; }
  .at-wdays { display: flex; border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 2%, var(--panel)); }
  .at-wdays div { flex: 1; min-width: 0; padding: 5px 0; text-align: center; font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; }
  .at-wdays div b { display: block; font-size: 15px; color: var(--fg); }
  .at-wdays .g { flex: none; width: 60px; border-right: 1px solid var(--line); }
  .at-wdays .s { flex: none; width: 14px; }
  .at-wframe { position: absolute; left: 0; right: 0; top: 0; display: flex; flex-direction: column; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
  .at-wrow { display: flex; }
  .at-sb { flex: none; width: 14px; position: relative; border-left: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 3%, var(--panel)); touch-action: none; }
  .at-sb i { position: absolute; left: 2px; right: 2px; border-radius: 5px; background: color-mix(in srgb, var(--fg) 30%, var(--panel)); cursor: grab; }
  .at-side { flex: none; display: flex; flex-direction: column; gap: 12px; padding: 16px; border-left: 1px solid var(--line); min-width: 0;
    background: color-mix(in srgb, var(--fg) 2%, var(--panel)); overflow: hidden; }
  .at-side h4 { margin: 0; font-size: 12px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--muted); }
  .at-agenda div { display: flex; gap: 10px; padding: 6px 0; font-size: 13px; border-bottom: 1px solid color-mix(in srgb, var(--line) 60%, transparent); }
  .at-agenda div span:first-child { flex: none; width: 60px; color: var(--muted); }
  .at-agenda div span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .at-hint { font-size: 13px; color: var(--muted); line-height: 1.5; }
  .at-form { display: flex; flex-direction: column; gap: 10px; padding: 14px; border: 1px solid var(--line); border-radius: 10px; background: var(--panel);
    box-shadow: 0 6px 18px rgba(0,0,0,.08); }
  .at-form[hidden] { display: none; }
  .at-form input { height: 34px; padding: 0 10px; border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); border-radius: 6px;
    background: var(--panel); color: var(--fg); font: inherit; font-size: 14px; min-width: 0; }
  .at-form input:focus { outline: 2px solid color-mix(in srgb, var(--accent) 40%, transparent); border-color: var(--accent); }
  .at-form .when { font-size: 13px; color: var(--muted); }
  .at-form .row { display: flex; justify-content: flex-end; gap: 8px; }
  .at-btn { height: 32px; padding: 0 14px; border-radius: 6px; border: 1px solid var(--line); background: var(--panel); color: var(--fg);
    font: inherit; font-size: 13.5px; font-weight: 600; cursor: pointer; white-space: nowrap; }
  .at-btn.pri { background: var(--accent); border-color: var(--accent); color: #fff; }
  .at-btn[data-off] { opacity: .45; cursor: default; }
  `;
  const referenceCSS = `
      .at-win { position: absolute; display: flex; flex-direction: column; overflow: hidden;
        background: var(--panel); border: 1px solid var(--line); border-radius: 10px;
        box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 12px 32px rgba(0,0,0,.08); }
      .at-title { flex: none; position: relative; display: flex; align-items: center; gap: 12px; height: 38px; padding: 0 14px;
        background: color-mix(in srgb, var(--fg) 5%, var(--panel)); border-bottom: 1px solid var(--line); }
      .at-dots { display: flex; gap: 7px; }
      .at-dots i { width: 12px; height: 12px; border-radius: 50%; background: #ff5f57; }
      .at-dots i:nth-child(2) { background: #febc2e; }
      .at-dots i:nth-child(3) { background: #28c840; }
      .at-title b { position: absolute; left: 0; right: 0; text-align: center; font-size: 13px; font-weight: 600; color: var(--muted); pointer-events: none; }
      .at-appmenu { position: relative; z-index: 2; height: 26px; padding: 0 10px; border: 1px solid transparent; border-radius: 6px; background: transparent;
        color: var(--fg); font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; }
      .at-appmenu:hover, .at-appmenu[data-open] { background: color-mix(in srgb, var(--fg) 8%, transparent); }
      .at-menu { position: absolute; z-index: 40; min-width: 200px; padding: 5px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel);
        box-shadow: 0 10px 28px rgba(0,0,0,.2); font-size: 13.5px; }
      .at-menu[hidden] { display: none; }
      .at-mi { display: flex; align-items: center; gap: 18px; justify-content: space-between; padding: 6px 10px; border-radius: 5px; cursor: default; white-space: nowrap; }
      .at-mi:hover { background: color-mix(in srgb, var(--accent) 14%, transparent); }
      .at-mi kbd { font: inherit; font-size: 12px; color: var(--muted); }
      .at-mi[data-off] { color: var(--muted); opacity: .6; }
      .at-mi[data-off]:hover { background: none; }
      .at-msep { height: 1px; margin: 4px 6px; background: var(--line); }
      .at-body { flex: 1; display: flex; min-height: 0; }
      .at-rail { flex: none; width: 50px; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 10px 0;
        background: color-mix(in srgb, var(--fg) 4%, var(--panel)); border-right: 1px solid var(--line); }
      .at-rail span { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 9px; color: var(--muted); }
      .at-rail span.on { color: var(--accent); background: color-mix(in srgb, var(--accent) 14%, transparent); }
      .at-rail span.end { margin-top: auto; cursor: pointer; }
      .at-rail span.end:hover { color: var(--fg); background: color-mix(in srgb, var(--fg) 7%, transparent); }
      .at-rail svg { width: 20px; height: 20px; }
      .at-main { flex: 1; min-width: 0; display: flex; position: relative; }

      /* tree */
      .at-explorer { flex: none; display: flex; flex-direction: column; border-right: 1px solid var(--line); min-height: 0;
        background: color-mix(in srgb, var(--fg) 2%, var(--panel)); }
      .at-pane-h { flex: none; display: flex; align-items: center; gap: 8px; height: 38px; padding: 0 14px; font-size: 11.5px; font-weight: 700;
        letter-spacing: .08em; text-transform: uppercase; color: var(--muted); border-bottom: 1px solid var(--line); white-space: nowrap; overflow: hidden; }
      .at-tree { flex: 1; min-height: 0; padding: 6px 6px 18px; overflow-y: auto; outline: none; user-select: none; -webkit-user-select: none;
        scrollbar-width: thin; }
      .at-row { display: flex; align-items: center; gap: 6px; height: var(--rowh, 26px); padding-right: 10px; border-radius: 6px;
        font-size: var(--rowf, 14px); white-space: nowrap; cursor: pointer; }
      .at-row:hover { background: color-mix(in srgb, var(--fg) 6%, transparent); }
      .at-row[data-sel] { background: color-mix(in srgb, var(--accent) 16%, transparent); font-weight: 600; }
      .at-tree:focus .at-row[data-sel] { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 55%, transparent); }
      .at-row[data-lifted] { opacity: .45; }
      .at-row[data-drop] { background: color-mix(in srgb, var(--accent) 26%, transparent); box-shadow: inset 0 0 0 2px var(--accent); }
      .at-row .chev { flex: none; width: 14px; height: 14px; color: var(--muted); }
      .at-row[data-open] .chev { transform: rotate(90deg); }
      .at-row .ico { flex: none; width: 17px; height: 17px; }
      .at-row .sp { flex: none; width: 14px; }
      .at-row .nm { overflow: hidden; text-overflow: ellipsis; }
      .at-row input { flex: 1; min-width: 60px; height: calc(var(--rowh, 26px) - 4px); padding: 0 6px; border: 1px solid var(--accent); border-radius: 4px;
        background: var(--panel); color: var(--fg); font: inherit; font-weight: 400; outline: 2px solid color-mix(in srgb, var(--accent) 30%, transparent); }
      .at-row.at-loading { color: var(--muted); font-style: italic; cursor: default; }
      .at-row.at-loading:hover { background: none; }
      .at-spin { flex: none; width: 15px; height: 15px; }
      .at-preview { flex: 1; min-width: 0; display: flex; flex-direction: column; }
      .at-crumbs { flex: none; display: flex; align-items: center; gap: 6px; height: 38px; padding: 0 18px; font-size: 13px; color: var(--muted);
        border-bottom: 1px solid var(--line); white-space: nowrap; overflow: hidden; }
      .at-crumbs b { color: var(--fg); font-weight: 600; overflow: hidden; text-overflow: ellipsis; }
      .at-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 0 24px;
        color: var(--muted); font-size: 14px; text-align: center; line-height: 1.5; }
      .at-empty svg { width: 50px; height: 50px; opacity: .45; }
      .at-card { margin: 22px; padding: 18px 20px; border: 1px solid var(--line); border-radius: 10px; display: flex; gap: 16px; align-items: flex-start; min-width: 0; }
      .at-card > svg { flex: none; width: 44px; height: 44px; }
      .at-card > div { min-width: 0; }
      .at-card h3 { margin: 2px 0 6px; font-size: 16px; overflow-wrap: anywhere; }
      .at-card p { margin: 0; color: var(--muted); font-size: 13px; line-height: 1.6; overflow-wrap: anywhere; }
      .at-back { align-self: flex-start; margin: 16px 22px 0; height: 30px; padding: 0 12px; border: 1px solid var(--line); border-radius: 6px;
        background: var(--panel); color: var(--fg); font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; }
      .at-back:hover { background: color-mix(in srgb, var(--fg) 6%, var(--panel)); }
      .at-tips { margin: 0 22px; padding: 12px 14px; border-radius: 8px; background: color-mix(in srgb, var(--accent) 8%, transparent);
        color: var(--muted); font-size: 13px; line-height: 1.5; }
      .at-ghost { position: absolute; z-index: 30; pointer-events: none; display: flex; align-items: center; gap: 6px; padding: 4px 10px;
        border-radius: 6px; background: var(--panel); border: 1px solid var(--accent); box-shadow: 0 6px 18px rgba(0,0,0,.18); font-size: 13px; white-space: nowrap; opacity: .85; }
      .at-ghost[hidden] { display: none; }
      .at-ghost .ico { width: 16px; height: 16px; flex: none; }
      .at-toast { position: absolute; z-index: 25; left: 14px; bottom: 14px; display: flex; align-items: center; gap: 14px; max-width: calc(100% - 28px);
        padding: 9px 12px 9px 14px; border-radius: 8px; background: #2b2f38; color: #f1f3f7; font-size: 13.5px; box-shadow: 0 8px 24px rgba(0,0,0,.25); }
      .at-toast[hidden] { display: none; }
      .at-toast span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .at-toast button { flex: none; border: 0; background: none; color: #8ab4ff; font: inherit; font-weight: 700; cursor: pointer; padding: 4px 6px; }

      /* terminal */
      .at-term { flex: 1; min-width: 0; display: flex; flex-direction: column; margin: 12px; border-radius: 9px; overflow: hidden;
        background: #14161b; color: #d6dae2; border: 1px solid #2a2e37; }
      .at-term-tabs { flex: none; display: flex; align-items: center; gap: 2px; height: 32px; padding: 0 10px; background: #1c1f26; border-bottom: 1px solid #2a2e37;
        font: 12.5px ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; color: #8b93a3; }
      .at-term-tabs span { padding: 6px 12px; border-radius: 6px 6px 0 0; }
      .at-term-tabs span.on { color: #e6e9ef; background: #14161b; }
      .at-tscroll { flex: 1; min-height: 0; overflow-y: auto; padding: 10px 14px; cursor: text;
        font: 14px/1.5 ui-monospace, "SFMono-Regular", Menlo, Consolas, "DejaVu Sans Mono", monospace; scrollbar-width: thin; scrollbar-color: #3a3f4b transparent; }
      .at-tl { white-space: pre-wrap; word-break: break-all; min-height: 1.5em; }
      .at-tl.out { color: #b5bccb; }
      .at-tl.err { color: #ff8a80; }
      .at-tl.dim { color: #7c8596; }
      .at-tl.ok { color: #9be9a8; }
      .at-ps { color: #7ee787; }
      .at-pc { color: #79c0ff; }
      .at-prompt { display: flex; align-items: baseline; }
      .at-prompt input { flex: 1; min-width: 40px; padding: 0; margin: 0 0 0 .6em; border: 0; outline: 0; background: transparent;
        color: #f0f3f8; font: inherit; caret-color: #f0f3f8; }

      /* editor */
      .at-ed { flex: 1; min-width: 0; display: flex; flex-direction: column; }
      .at-tb { flex: none; position: relative; z-index: 3; display: flex; flex-wrap: wrap; align-items: center; gap: 3px; min-height: 46px; padding: 6px 10px;
        border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 2%, var(--panel)); }
      .at-tb .sep { width: 1px; height: 22px; margin: 0 5px; background: var(--line); }
      .at-tool { position: relative; min-width: 32px; height: 32px; padding: 0 7px; display: inline-flex; align-items: center; justify-content: center; gap: 5px;
        border: 1px solid transparent; border-radius: 6px; background: transparent; color: var(--fg); font: inherit; font-size: 15px; cursor: pointer; }
      .at-tool:hover { background: color-mix(in srgb, var(--fg) 7%, transparent); }
      .at-tool[data-on] { background: color-mix(in srgb, var(--accent) 16%, transparent); color: var(--accent); }
      .at-tool[data-off] { opacity: .38; }
      .at-tool.deco { color: var(--muted); font-size: 13px; }
      .at-tool.wide { justify-content: space-between; min-width: 96px; border-color: var(--line); background: var(--panel); font-size: 13px; }
      .at-tool svg { width: 16px; height: 16px; }
      .at-tool .A { display: flex; flex-direction: column; align-items: center; font-weight: 700; line-height: 1; font-size: 15px; }
      .at-tool .A i { display: block; width: 16px; height: 4px; margin-top: 3px; border-radius: 1px; }
      .at-pop { position: absolute; z-index: 6; padding: 8px; border: 1px solid var(--line); border-radius: 9px; background: var(--panel);
        box-shadow: 0 10px 28px rgba(0,0,0,.18); }
      .at-pop[hidden] { display: none; }
      .at-pop .grid { display: grid; grid-template-columns: repeat(6, 26px); gap: 6px; }
      .at-sw { width: 26px; height: 26px; border-radius: 6px; cursor: pointer; border: 1px solid rgba(0,0,0,.12); }
      .at-sw:hover { outline: 2px solid var(--fg); outline-offset: 1px; }
      .at-sw.def { grid-column: span 6; width: auto; height: 28px; display: flex; align-items: center; justify-content: center; gap: 8px;
        border-color: var(--line); background: var(--panel); font-size: 12.5px; color: var(--muted); }
      .at-sw.def::before { content: ''; width: 14px; height: 14px; border-radius: 3px; background: var(--fg); }
      .at-szo { padding: 4px 14px; border-radius: 5px; cursor: pointer; white-space: nowrap; }
      .at-szo:hover { background: color-mix(in srgb, var(--accent) 14%, transparent); }
      .at-szo[data-on] { color: var(--accent); font-weight: 700; }
      .at-pagearea { flex: 1; min-height: 0; padding: 18px 22px; overflow: auto; background: color-mix(in srgb, var(--fg) 4%, var(--bg)); display: flex; justify-content: center; align-items: flex-start; }
      .at-sheet { width: 100%; max-width: 760px; padding: 22px 32px 26px; background: var(--panel); border: 1px solid var(--line);
        border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 8px 24px rgba(0,0,0,.06); }
      .at-sheet h2 { margin: 0 0 4px; font-size: 13px; font-weight: 600; color: var(--muted); letter-spacing: .02em; }
      .at-sheet hr { border: 0; border-top: 1px solid var(--line); margin: 8px 0 14px; }
      .at-doc { font-family: Georgia, "Times New Roman", serif; line-height: 1.6; color: var(--fg); user-select: text; -webkit-user-select: text; cursor: text; }
      .at-p { position: relative; margin: 0 0 .55em; }
      .at-p[data-list] { padding-left: 1.7em; margin-bottom: .2em; }
      .at-p .mk { position: absolute; left: .2em; top: 0; color: var(--muted); user-select: none; }
      .at-doc span.b { font-weight: 700; }
      .at-doc span.i { font-style: italic; }
      .at-doc span.u { text-decoration: underline; text-decoration-thickness: 1.5px; text-underline-offset: 3px; }
      .at-doc span.s-small { font-size: .8em; }
      .at-doc span.s-large { font-size: 1.35em; }
      .at-doc span.s-huge { font-size: 1.75em; }
      .at-doc ::selection { background: color-mix(in srgb, var(--accent) 30%, transparent); }
      .at-status { flex: none; display: flex; gap: 18px; height: 26px; align-items: center; padding: 0 16px; font-size: 12px; color: var(--muted);
        border-top: 1px solid var(--line); }

      /* calendar + week */
      .at-cal { flex: 1; min-width: 0; display: flex; flex-direction: column; padding: 0 0 12px 0; position: relative; }
      .at-cal-h { flex: none; display: flex; align-items: center; gap: 10px; height: 50px; padding: 0 16px; }
      .at-cal-h .nav { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--line); display: flex; align-items: center; justify-content: center; color: var(--muted); }
      .at-cal-h .today { padding: 4px 12px; border: 1px solid var(--line); border-radius: 6px; font-size: 13px; font-weight: 600; }
      .at-cal-h h3 { margin: 0 0 0 6px; font-size: 17px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .at-cal-h .chip { margin-left: auto; padding: 4px 12px; border-radius: 14px; font-size: 12.5px; font-weight: 600; color: var(--accent);
        background: color-mix(in srgb, var(--accent) 13%, transparent); }
      .at-cal-wrap { flex: 1; min-height: 0; position: relative; margin: 0 12px 0 16px; }
      .at-cal-frame { position: absolute; left: 0; right: 0; top: 0; display: flex; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
      .at-cal-scroll { flex: 1; min-width: 0; overflow-y: auto; scrollbar-width: none; }
      .at-cal-scroll::-webkit-scrollbar { display: none; }
      .at-cal-grid { position: relative; display: flex; }
      .at-gut { flex: none; width: 60px; position: relative; border-right: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 2%, var(--panel)); }
      .at-gut span { position: absolute; right: 8px; margin-top: 3px; font-size: 11px; line-height: 1.2; color: var(--muted); }
      .at-col { flex: 1; min-width: 0; position: relative; cursor: crosshair; touch-action: none; }
      .at-wcols .at-col { cursor: default; border-left: 1px solid color-mix(in srgb, var(--line) 70%, transparent); }
      .at-wcols .at-col:first-child { border-left: 0; }
      .at-hh { position: absolute; left: 0; right: 0; border-top: 1px solid color-mix(in srgb, var(--line) 85%, transparent); pointer-events: none; }
      .at-hh.half { border-top-style: dashed; border-top-color: color-mix(in srgb, var(--line) 55%, transparent); }
      .at-ev { position: absolute; left: 6px; right: 34%; padding: 2px 8px; border-radius: 6px; overflow: hidden; pointer-events: none;
        font-size: 12px; line-height: 1.3; border-left: 4px solid; }
      .at-ev b { display: block; font-size: 12.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .at-ev.t0, .at-wev.t0 { --tone: #3b74e0; } .at-ev.t1, .at-wev.t1 { --tone: #2f9e44; } .at-ev.t2, .at-wev.t2 { --tone: #e08a00; } .at-ev.t3, .at-wev.t3 { --tone: #9c36b5; }
      .at-ev[class*=" t"], .at-wev { background: color-mix(in srgb, var(--tone) 17%, var(--panel)); border-color: var(--tone);
        color: color-mix(in srgb, var(--tone) 45%, var(--fg)); }
      .at-ev.user { left: 30%; right: 8px; background: color-mix(in srgb, var(--accent) 22%, var(--panel)); border-color: var(--accent); color: var(--fg);
        box-shadow: 0 2px 8px rgba(0,0,0,.12); }
      .at-ev.user.draft { background: color-mix(in srgb, var(--accent) 12%, var(--panel)); border-style: dashed; border-width: 1px 1px 1px 4px; }
      .at-wev { position: absolute; left: 3px; right: 3px; padding: 1px 6px; border-radius: 5px; overflow: hidden; font-size: 11.5px; line-height: 1.25;
        border-left: 3px solid; cursor: grab; touch-action: none; user-select: none; }
      .at-wev b { display: block; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .at-wev span { white-space: nowrap; }
      .at-wev[data-dragging] { opacity: .35; }
      .at-whandle { position: absolute; left: 0; right: 0; bottom: 0; height: 6px; cursor: ns-resize; }
      .at-whandle::after { content: ''; position: absolute; left: 50%; bottom: 1px; width: 16px; height: 2px; margin-left: -8px; border-radius: 1px; background: color-mix(in srgb, var(--tone) 60%, transparent); }
      .at-wghost { position: absolute; z-index: 5; border: 2px dashed var(--accent); border-radius: 5px; background: color-mix(in srgb, var(--accent) 12%, transparent); pointer-events: none; }
      .at-wghost[hidden] { display: none; }
      .at-wdays { display: flex; border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 2%, var(--panel)); }
      .at-wdays div { flex: 1; min-width: 0; padding: 5px 0; text-align: center; font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; }
      .at-wdays div b { display: block; font-size: 15px; color: var(--fg); }
      .at-wdays .g { flex: none; width: 60px; border-right: 1px solid var(--line); }
      .at-wdays .s { flex: none; width: 14px; }
      .at-wframe { position: absolute; left: 0; right: 0; top: 0; display: flex; flex-direction: column; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
      .at-wrow { display: flex; }
      .at-sb { flex: none; width: 14px; position: relative; border-left: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 3%, var(--panel)); touch-action: none; }
      .at-sb i { position: absolute; left: 2px; right: 2px; border-radius: 5px; background: color-mix(in srgb, var(--fg) 30%, var(--panel)); cursor: grab; }
      .at-side { flex: none; display: flex; flex-direction: column; gap: 12px; padding: 16px; border-left: 1px solid var(--line); min-width: 0;
        background: color-mix(in srgb, var(--fg) 2%, var(--panel)); overflow: hidden; }
      .at-side h4 { margin: 0; font-size: 12px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--muted); }
      .at-agenda div { display: flex; gap: 10px; padding: 6px 0; font-size: 13px; border-bottom: 1px solid color-mix(in srgb, var(--line) 60%, transparent); }
      .at-agenda div span:first-child { flex: none; width: 60px; color: var(--muted); }
      .at-agenda div span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .at-hint { font-size: 13px; color: var(--muted); line-height: 1.5; }
      .at-form { display: flex; flex-direction: column; gap: 10px; padding: 14px; border: 1px solid var(--line); border-radius: 10px; background: var(--panel);
        box-shadow: 0 6px 18px rgba(0,0,0,.08); }
      .at-form[hidden] { display: none; }
      .at-form input { height: 34px; padding: 0 10px; border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); border-radius: 6px;
        background: var(--panel); color: var(--fg); font: inherit; font-size: 14px; min-width: 0; }
      .at-form input:focus { outline: 2px solid color-mix(in srgb, var(--accent) 40%, transparent); border-color: var(--accent); }
      .at-form .when { font-size: 13px; color: var(--muted); }
      .at-form { position: relative; }
      .at-selrow { display: flex; gap: 8px; }
      .at-sel { position: relative; flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--muted); }
      .at-selbtn { display: flex; align-items: center; justify-content: space-between; height: 34px; padding: 0 10px; border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line));
        border-radius: 6px; background: var(--panel); color: var(--fg); font: inherit; font-size: 14px; cursor: pointer; text-align: left; }
      .at-selbtn::after { content: ''; width: 7px; height: 7px; margin-left: 8px; border: solid var(--muted); border-width: 0 2px 2px 0; transform: translateY(-2px) rotate(45deg); }
      .at-sellist { position: absolute; z-index: 30; left: 0; right: 0; top: 100%; max-height: 150px; overflow-y: auto; padding: 4px; border: 1px solid var(--line);
        border-radius: 8px; background: var(--panel); box-shadow: 0 10px 28px rgba(0,0,0,.2); }
      .at-sellist[hidden] { display: none; }
      .at-sellist button { display: block; width: 100%; padding: 5px 8px; border: 0; border-radius: 5px; background: none; color: var(--fg); font: inherit; font-size: 13.5px; text-align: left; cursor: pointer; }
      .at-sellist button:hover, .at-sellist button[data-on] { background: color-mix(in srgb, var(--accent) 16%, transparent); }
      .at-form .row { display: flex; justify-content: flex-end; gap: 8px; }
      .at-btn { height: 32px; padding: 0 14px; border-radius: 6px; border: 1px solid var(--line); background: var(--panel); color: var(--fg);
        font: inherit; font-size: 13.5px; font-weight: 600; cursor: pointer; white-space: nowrap; }
      .at-btn.pri { background: var(--accent); border-color: var(--accent); color: #fff; }
      .at-btn[data-off] { opacity: .45; cursor: default; }

      /* prefs */
      .at-home { flex: 1; min-width: 0; padding: 22px 26px; overflow: hidden; }
      .at-home h2 { margin: 0 0 4px; font-size: 20px; }
      .at-home p { margin: 0 0 16px; color: var(--muted); font-size: 13.5px; }
      .at-recent div { display: flex; gap: 12px; align-items: center; padding: 8px 4px; border-bottom: 1px solid color-mix(in srgb, var(--line) 60%, transparent); font-size: 13.5px; }
      .at-recent div span:last-child { margin-left: auto; color: var(--muted); font-size: 12.5px; white-space: nowrap; }
      .at-recent svg { width: 18px; height: 18px; flex: none; }
      .at-modal { position: absolute; inset: 0; z-index: 20; display: flex; align-items: center; justify-content: center;
        background: color-mix(in srgb, #000 32%, transparent); }
      .at-modal[hidden] { display: none; }
      .at-dlg { display: flex; flex-direction: column; overflow: hidden; border-radius: 12px; background: var(--panel); border: 1px solid var(--line);
        box-shadow: 0 24px 60px rgba(0,0,0,.35); position: relative; }
      .at-dlg-h { flex: none; display: flex; align-items: center; height: 48px; padding: 0 10px 0 20px; border-bottom: 1px solid var(--line); }
      .at-dlg-h h3 { margin: 0; font-size: 16px; }
      .at-x { margin-left: auto; width: 32px; height: 32px; border: 0; border-radius: 6px; background: none; color: var(--muted); font-size: 20px; cursor: pointer; }
      .at-x:hover { background: color-mix(in srgb, var(--fg) 8%, transparent); color: var(--fg); }
      .at-dlg-b { flex: 1; min-height: 0; display: flex; position: relative; }
      .at-dlg-b.top { flex-direction: column; }
      .at-tabs { flex: none; display: flex; gap: 2px; }
      .at-dlg-b.top .at-tabs { padding: 8px 14px 0; border-bottom: 1px solid var(--line); overflow: hidden; }
      .at-dlg-b.side .at-tabs { flex-direction: column; width: 168px; padding: 10px 8px; border-right: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 2%, var(--panel)); }
      .at-tab { padding: 8px 12px; border: 0; background: none; color: var(--muted); font: inherit; font-size: 13.5px; font-weight: 600; cursor: pointer; text-align: left; white-space: nowrap; border-radius: 6px; }
      .at-dlg-b.top .at-tab { border-radius: 6px 6px 0 0; border-bottom: 2px solid transparent; }
      .at-tab:hover { color: var(--fg); }
      .at-tab[data-on] { color: var(--accent); }
      .at-dlg-b.top .at-tab[data-on] { border-bottom-color: var(--accent); }
      .at-dlg-b.side .at-tab[data-on] { background: color-mix(in srgb, var(--accent) 13%, transparent); }
      .at-panes { flex: 1; min-height: 0; min-width: 0; position: relative; }
      .at-pane { position: absolute; inset: 0; overflow-y: auto; padding: 4px 20px; scrollbar-width: thin; }
      .at-pane[hidden] { display: none; }
      .at-set { display: flex; align-items: center; gap: 16px; padding: 10px 0; border-bottom: 1px solid color-mix(in srgb, var(--line) 60%, transparent); }
      .at-set:last-child { border-bottom: 0; }
      .at-set .lbl { flex: 1; min-width: 0; }
      .at-set .lbl b { display: block; font-size: 14px; font-weight: 600; }
      .at-set .lbl small { display: block; margin-top: 2px; font-size: 12.5px; color: var(--muted); line-height: 1.35; }
      .at-dlg.compact .at-set { padding: 6px 0; }
      .at-dlg.compact .at-set .lbl small { display: none; }
      .at-switch { flex: none; position: relative; width: 42px; height: 24px; border: 0; border-radius: 12px; background: color-mix(in srgb, var(--fg) 22%, var(--panel)); cursor: pointer; }
      .at-switch::after { content: ''; position: absolute; left: 3px; top: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.3); }
      .at-switch[data-on] { background: var(--accent); }
      .at-switch[data-on]::after { left: 21px; }
      .at-check { flex: none; width: 22px; height: 22px; border: 2px solid color-mix(in srgb, var(--fg) 35%, var(--line)); border-radius: 5px; background: var(--panel); cursor: pointer;
        display: flex; align-items: center; justify-content: center; color: #fff; padding: 0; }
      .at-check[data-on] { background: var(--accent); border-color: var(--accent); }
      .at-check svg { width: 14px; height: 14px; }
      .at-seg { flex: none; display: flex; border: 1px solid var(--line); border-radius: 7px; overflow: hidden; }
      .at-seg button { border: 0; border-left: 1px solid var(--line); background: var(--panel); color: var(--fg); font: inherit; font-size: 12.5px; padding: 6px 10px; cursor: pointer; white-space: nowrap; }
      .at-seg button:first-child { border-left: 0; }
      .at-seg button[data-on] { background: color-mix(in srgb, var(--accent) 16%, var(--panel)); color: var(--accent); font-weight: 700; }
      .at-dd { flex: none; display: flex; align-items: center; justify-content: space-between; gap: 10px; min-width: 132px; max-width: 46%; height: 32px; padding: 0 10px;
        border: 1px solid var(--line); border-radius: 6px; background: var(--panel); color: var(--fg); font: inherit; font-size: 13px; cursor: pointer; }
      .at-dd span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .at-dd svg { width: 14px; height: 14px; flex: none; }
      .at-ddl { position: absolute; z-index: 30; padding: 4px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); box-shadow: 0 10px 28px rgba(0,0,0,.2);
        max-height: 230px; overflow-y: auto; font-size: 13px; }
      .at-ddl[hidden] { display: none; }
      .at-ddl div { padding: 6px 12px; border-radius: 5px; cursor: pointer; white-space: nowrap; }
      .at-ddl div:hover { background: color-mix(in srgb, var(--accent) 14%, transparent); }
      .at-ddl div[data-on] { font-weight: 700; color: var(--accent); }
      .at-num { flex: none; display: flex; align-items: center; gap: 4px; }
      .at-num button { width: 28px; height: 30px; border: 1px solid var(--line); border-radius: 6px; background: var(--panel); color: var(--fg); font: inherit; font-size: 16px; cursor: pointer; }
      .at-num input { width: 64px; height: 30px; padding: 0 6px; border: 1px solid var(--line); border-radius: 6px; background: var(--panel); color: var(--fg); font: inherit; font-size: 13.5px; text-align: right; }
      .at-num small { color: var(--muted); font-size: 12px; min-width: 0; white-space: nowrap; }
      .at-dlg-f { flex: none; display: flex; align-items: center; gap: 8px; height: 54px; padding: 0 16px; border-top: 1px solid var(--line); }
      .at-dlg-f .ghost { border: 0; background: none; color: var(--muted); font: inherit; font-size: 13px; cursor: pointer; padding: 6px; }
      .at-dlg-f .sp { flex: 1; }
      `;
  const shellCSS = "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:#f4d83a;color:#000;border:2px outset #fbe779}.design-brand{font-size:23px}.design-nav{color:#161616}.task-note{background:#c7c9d0;color:#101639;font-size:21px}.task-note p{background:#eee9b3;border:1px solid #decc67;padding:16px}.task-note h2{font-size:27px}.at-title{background:#f4d83a;color:#000}.at-term-tabs{background:#c7c9d0;color:#111}.at-tscroll{background:#000;color:#eee}.end-control{background:#c7c9d0;color:#101639;border:2px outset #ddd;border-radius:0}.reference-overlay{background:#c7c9d0;border:3px ridge #ddd;border-radius:0}.reference-overlay h2{background:#bfc0c8;color:#101639}";
  env.template('use-desktop-tools/_styles', () => ({ workspaceCSS, referenceCSS, shellCSS }));
})();
