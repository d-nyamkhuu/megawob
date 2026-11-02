/* protect-privacy/classic: unchanged styles, icons and token defaults. */
'use strict';
{
  const CSS = `
  .sp-win { position: absolute; display: flex; flex-direction: column; overflow: hidden; background: var(--panel); color: var(--fg);
    border: 1px solid var(--line); border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,.05), 0 14px 36px rgba(0,0,0,.12);
    font: 13px/1.35 system-ui, -apple-system, 'Segoe UI', sans-serif; user-select: none; -webkit-user-select: none; }
  .sp-win * { box-sizing: border-box; }
  .sp-win input, .sp-win textarea { user-select: text; -webkit-user-select: text; }
  .sp-tabs { flex: none; display: flex; align-items: flex-end; gap: 6px; height: 32px; padding: 0 10px; background: color-mix(in srgb, var(--fg) 8%, var(--panel)); }
  .sp-dots { display: flex; gap: 6px; align-self: center; margin-right: 6px; }
  .sp-dots i { width: 11px; height: 11px; border-radius: 50%; background: #ff5f57; }
  .sp-dots i:nth-child(2) { background: #febc2e; } .sp-dots i:nth-child(3) { background: #28c840; }
  .sp-tab { display: flex; align-items: center; gap: 7px; height: 26px; max-width: 230px; padding: 0 12px; border-radius: 8px 8px 0 0;
    background: var(--panel); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sp-tab.off { background: transparent; color: var(--muted); }
  .sp-fav { flex: none; width: 14px; height: 14px; border-radius: 4px; background: var(--accent); color: #fff; font-size: 9px; font-weight: 700;
    display: inline-flex; align-items: center; justify-content: center; }
  .sp-bar { flex: none; position: relative; display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 10px; border-bottom: 1px solid var(--line); }
  .sp-nav { color: var(--muted); font-size: 15px; width: 18px; text-align: center; }
  .sp-omni { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; height: 28px; padding: 0 6px; border-radius: 14px;
    background: color-mix(in srgb, var(--fg) 6%, var(--panel)); font-size: 13px; white-space: nowrap; overflow: hidden; }
  .sp-lock { flex: none; width: 24px; height: 22px; border-radius: 11px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; color: var(--muted); }
  .sp-lock:hover, .sp-lock.on { background: color-mix(in srgb, var(--fg) 12%, transparent); }
  .sp-lock svg { width: 13px; height: 13px; }
  .sp-url { overflow: hidden; text-overflow: ellipsis; color: var(--muted); }
  .sp-url b { color: var(--fg); font-weight: 500; }
  .sp-pchip { flex: none; font-size: 11px; padding: 1px 7px; border-radius: 9px; background: color-mix(in srgb, var(--accent) 16%, transparent); color: var(--fg); }
  .sp-ext { flex: none; width: 22px; height: 22px; border-radius: 50%; background: color-mix(in srgb, var(--fg) 10%, transparent); }
  .sp-app { flex: 1; min-height: 0; position: relative; display: flex; overflow: hidden; background: var(--bg); }
  .sp-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 32px; padding: 0 14px; border-radius: 6px; cursor: pointer;
    border: 1px solid var(--line); background: var(--panel); color: var(--fg); font: inherit; font-weight: 550; white-space: nowrap; }
  .sp-btn:hover { background: color-mix(in srgb, var(--fg) 6%, var(--panel)); }
  .sp-btn.pri { background: var(--accent); border-color: var(--accent); color: #fff; }
  .sp-btn.pri:hover { filter: brightness(1.07); }
  .sp-btn.danger { background: #c62828; border-color: #c62828; color: #fff; }
  .sp-btn.dis { opacity: .45; cursor: default; }
  .sp-btn.sm { height: 26px; padding: 0 10px; font-size: 12px; }
  .sp-link { color: var(--accent); cursor: pointer; font-weight: 550; }
  .sp-muted { color: var(--muted); }
  .sp-in { width: 100%; height: 30px; padding: 0 9px; border: 1px solid var(--line); border-radius: 6px; background: var(--panel); color: var(--fg);
    font: inherit; outline: none; }
  textarea.sp-in { height: auto; padding: 6px 9px; resize: none; }
  .sp-in:focus { border-color: var(--accent); box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 22%, transparent); }
  .sp-in[readonly] { background: color-mix(in srgb, var(--fg) 5%, var(--panel)); color: var(--muted); }
  .sp-side { flex: none; display: flex; flex-direction: column; border-right: 1px solid var(--line); background: var(--panel); overflow: hidden; }
  .sp-side-h { flex: none; display: flex; align-items: center; gap: 8px; height: 36px; padding: 0 12px; border-bottom: 1px solid var(--line); font-weight: 650; }
  .sp-kv { display: grid; grid-template-columns: auto 1fr; gap: 3px 10px; padding: 8px 12px; font-size: 12px; align-content: start; }
  .sp-kv dt { color: var(--muted); white-space: nowrap; }
  .sp-kv dd { margin: 0; font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; font-size: 11.5px; overflow-wrap: anywhere; }
  .sp-main { flex: 1; min-width: 0; position: relative; display: flex; flex-direction: column; overflow: hidden; }
  .sp-site-h { flex: none; display: flex; align-items: center; gap: 10px; height: 44px; padding: 0 18px; background: var(--panel); border-bottom: 1px solid var(--line); }
  .sp-logo { width: 24px; height: 24px; border-radius: 6px; background: var(--accent); color: #fff; font-weight: 800; font-size: 12px;
    display: inline-flex; align-items: center; justify-content: center; }
  .sp-site-h b { font-size: 14px; }
  .sp-site-h .sp-navs { margin-left: auto; display: flex; gap: 16px; color: var(--muted); font-size: 12.5px; }
  .sp-card { background: var(--panel); border: 1px solid var(--line); border-radius: 10px; }
  .sp-h2 { font-size: 16px; font-weight: 700; margin: 0 0 4px; }
  .sp-err { color: #c62828; font-size: 12px; }
  .sp-ok { padding: 7px 10px; border-radius: 6px; background: color-mix(in srgb, #2e7d32 16%, var(--panel)); color: var(--fg); font-size: 12.5px; }
  .sp-warn { padding: 7px 10px; border-radius: 6px; background: color-mix(in srgb, #f9a825 20%, var(--panel)); color: var(--fg); font-size: 12px; }
  .sp-menu { position: absolute; z-index: 30; min-width: 170px; padding: 5px 0; background: var(--panel); border: 1px solid var(--line); border-radius: 8px;
    box-shadow: 0 8px 26px rgba(0,0,0,.2); }
  .sp-mi { display: flex; align-items: center; gap: 8px; padding: 7px 14px; cursor: pointer; white-space: nowrap; }
  .sp-mi:hover { background: color-mix(in srgb, var(--fg) 7%, transparent); }
  .sp-mi.cur::before { content: '✓'; color: var(--accent); width: 12px; }
  .sp-mi:not(.cur)::before { content: ''; width: 12px; }
  .sp-mi small { display: block; color: var(--muted); font-size: 11px; }
  .sp-sep { height: 1px; margin: 4px 0; background: var(--line); }
  .sp-rel { position: relative; }
  .sp-ico { display: inline-flex; flex: none; width: 1.1em; height: 1.1em; vertical-align: -0.18em; margin-right: .35em; }
  .sp-ico:last-child { margin-right: 0; }
  .sp-ico svg { width: 100%; height: 100%; }
  .sp-av { flex: none; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: #fff;
    font-size: 11px; font-weight: 700; }
  .sp-scrim { position: absolute; inset: 0; z-index: 20; background: rgba(0,0,0,.32); display: flex; align-items: center; justify-content: center; }
  .sp-dlg { position: relative; background: var(--panel); color: var(--fg); border-radius: 10px; box-shadow: 0 18px 50px rgba(0,0,0,.35); padding: 16px 18px; }
  .sp-toast { position: absolute; left: 50%; bottom: 12px; transform: translateX(-50%); z-index: 25; padding: 8px 14px; border-radius: 6px; background: #2b2f38; color: #fff; font-size: 12.5px; white-space: nowrap; }
  /* wrongfield */
  .sp-form { margin: 14px auto; width: min(560px, 94%); padding: 16px 20px; }
  .sp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; margin-top: 10px; }
  .sp-fld label { display: block; font-size: 12px; font-weight: 600; margin-bottom: 3px; }
  .sp-fld label i { color: #c62828; font-style: normal; }
  .sp-fld .hint { display: block; font-weight: 400; color: var(--muted); font-size: 11px; margin: -1px 0 3px; }
  .sp-fld.wide { grid-column: 1 / -1; }
  /* share */
  .sp-doc { flex: 1; display: flex; flex-direction: column; }
  .sp-doc-h { flex: none; display: flex; align-items: center; gap: 10px; height: 46px; padding: 0 14px; background: var(--panel); border-bottom: 1px solid var(--line); }
  .sp-doc-h .t { font-size: 15px; font-weight: 600; }
  .sp-doc-tools { flex: none; display: flex; gap: 14px; height: 30px; align-items: center; padding: 0 14px; background: var(--panel); border-bottom: 1px solid var(--line); color: var(--muted); font-size: 12px; }
  .sp-paper { margin: 14px auto; width: min(560px, 90%); flex: 1; min-height: 0; padding: 26px 34px; background: #fff; color: #1d2330; border-radius: 2px;
    box-shadow: 0 1px 4px rgba(0,0,0,.15); overflow: hidden; font-size: 13px; line-height: 1.6; }
  .sp-paper h3 { margin: 0 0 10px; font-size: 18px; }
  .sp-share { width: min(470px, 94%); }
  .sp-person { display: flex; align-items: center; gap: 10px; padding: 5px 0; }
  .sp-person .nm { flex: 1; min-width: 0; }
  .sp-person .nm div { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sp-person .nm small { display: block; color: var(--muted); font-size: 11.5px; }
  .sp-rolebtn { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 5px; cursor: pointer; color: var(--fg); font-size: 12.5px; }
  .sp-rolebtn:hover { background: color-mix(in srgb, var(--fg) 8%, transparent); }
  .sp-chips { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 5px; min-height: 38px; border: 1px solid var(--accent); border-radius: 6px; }
  .sp-chip { display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 4px 0 10px; border-radius: 13px; background: color-mix(in srgb, var(--fg) 9%, var(--panel)); font-size: 12px; }
  .sp-chip .x { width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; color: var(--muted); }
  .sp-chip .x:hover { background: color-mix(in srgb, var(--fg) 14%, transparent); }
  .sp-chips input { flex: 1; min-width: 120px; height: 26px; border: none; outline: none; background: transparent; color: var(--fg); font: inherit; }
  .sp-sugs { position: absolute; z-index: 31; left: 0; right: 0; top: 100%; margin-top: 2px; padding: 4px 0; background: var(--panel); border: 1px solid var(--line);
    border-radius: 8px; box-shadow: 0 8px 22px rgba(0,0,0,.2); }
  .sp-sug { display: flex; align-items: center; gap: 10px; padding: 5px 12px; cursor: pointer; }
  .sp-sug:hover { background: color-mix(in srgb, var(--fg) 7%, transparent); }
  .sp-sug small { display: block; color: var(--muted); font-size: 11.5px; }
  .sp-sec { margin-top: 12px; font-weight: 650; font-size: 13px; }
  /* overshare */
  .sp-chat { flex: 1; min-height: 0; display: flex; flex-direction: column; }
  .sp-thread { flex: 1; min-height: 0; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; gap: 7px; padding: 10px 14px; }
  .sp-msg { max-width: 82%; padding: 7px 11px; border-radius: 12px; font-size: 12.5px; line-height: 1.4; overflow-wrap: anywhere; }
  .sp-msg.them { align-self: flex-start; background: color-mix(in srgb, var(--fg) 8%, var(--panel)); border-bottom-left-radius: 3px; }
  .sp-msg.me { align-self: flex-end; background: var(--accent); color: #fff; border-bottom-right-radius: 3px; }
  .sp-msg .who { display: block; font-size: 10.5px; font-weight: 650; opacity: .75; margin-bottom: 2px; }
  .sp-compose { flex: none; display: flex; gap: 8px; align-items: flex-end; padding: 8px 12px; border-top: 1px solid var(--line); background: var(--panel); }
  .sp-mailh { flex: none; padding: 10px 16px; border-bottom: 1px solid var(--line); background: var(--panel); font-size: 12.5px; }
  .sp-mailh .subj { font-size: 15px; font-weight: 650; margin-bottom: 4px; }
  .sp-mail { padding: 8px 12px; margin: 0 0 6px; border-left: 3px solid var(--line); font-size: 12.5px; overflow-wrap: anywhere; }
  .sp-mail.me { border-left-color: var(--accent); }
  .sp-mail .who { font-size: 11px; color: var(--muted); margin-bottom: 2px; }
  /* redact */
  .sp-tools { flex: none; display: flex; align-items: center; gap: 6px; height: 44px; padding: 0 10px; background: var(--panel); border-bottom: 1px solid var(--line); }
  .sp-tool { display: inline-flex; align-items: center; gap: 5px; height: 30px; padding: 0 10px; border-radius: 6px; cursor: pointer; border: 1px solid transparent; font-weight: 550; white-space: nowrap; }
  .sp-tool:hover { background: color-mix(in srgb, var(--fg) 7%, transparent); }
  .sp-tool.on { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 14%, transparent); }
  .sp-tool .pro { font-size: 9.5px; font-weight: 800; padding: 1px 4px; border-radius: 3px; background: #f9a825; color: #222; }
  .sp-vsep { width: 1px; height: 22px; background: var(--line); margin: 0 4px; }
  .sp-pdf { flex: 1; min-height: 0; display: flex; justify-content: center; padding: 12px; background: color-mix(in srgb, var(--fg) 14%, var(--bg)); overflow: hidden; }
  .sp-page { width: min(620px, 96%); padding: 20px 28px; background: #fff; color: #1d2330; box-shadow: 0 2px 8px rgba(0,0,0,.25); font-size: 13px; line-height: 1.75; overflow: hidden; }
  .sp-page h4 { margin: 0 0 2px; font-size: 15px; }
  .sp-page .meta { color: #6b7280; font-size: 11.5px; margin-bottom: 8px; }
  .sp-tk { display: inline; padding: 1px 1px; border-radius: 2px; cursor: text; white-space: nowrap; }
  .sp-tk.mk { outline: 2px solid #e53935; background: rgba(229,57,53,.12); }
  .sp-tk.bn { background: #000; color: #000; }
  .sp-tk.hl { background: rgba(20,20,20,.86); color: rgba(255,255,255,.13); }
  .sp-banner { flex: none; padding: 7px 14px; font-size: 12.5px; background: color-mix(in srgb, #f9a825 22%, var(--panel)); border-bottom: 1px solid var(--line); }
  /* permissions */
  .sp-bubble { position: absolute; z-index: 35; left: 12px; top: 4px; width: 330px; padding: 14px 16px; background: var(--panel); color: var(--fg);
    border: 1px solid var(--line); border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,.28); }
  .sp-bubble .q { font-size: 13.5px; margin-bottom: 8px; }
  .sp-bubble .what { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .sp-bubble .row { display: flex; gap: 8px; justify-content: flex-end; }
  .sp-ss { position: absolute; z-index: 36; left: 10px; top: 4px; width: 320px; padding: 12px 14px; background: var(--panel); color: var(--fg);
    border: 1px solid var(--line); border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,.28); }
  .sp-ssrow { display: flex; align-items: center; gap: 10px; padding: 5px 0; }
  .sp-ssrow .lb { flex: 1; text-transform: capitalize; }
  .sp-seg { display: inline-flex; border: 1px solid var(--line); border-radius: 6px; overflow: hidden; }
  .sp-seg span { padding: 4px 10px; cursor: pointer; font-size: 12px; }
  .sp-seg span + span { border-left: 1px solid var(--line); }
  .sp-seg span.on { background: var(--accent); color: #fff; }
  .sp-stagepg { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 16px; }
  .sp-cam { width: min(360px, 70%); aspect-ratio: 16 / 9; border-radius: 10px; background: #202124; color: #bdc1c6; display: flex; align-items: center; justify-content: center; font-size: 13px; }
  .sp-cam.on { background: linear-gradient(135deg, #5b6b7d, #2c3440 60%, #6b5b4d); color: #fff; }
  /* autofill */
  .sp-co { flex: 1; display: flex; gap: 14px; padding: 14px; min-height: 0; }
  .sp-co .sp-card { padding: 14px 16px; }
  .sp-dd { position: absolute; z-index: 40; left: 0; top: 100%; margin-top: 2px; width: max(260px, 100%); padding: 4px 0; background: var(--panel); border: 1px solid var(--line);
    border-radius: 8px; box-shadow: 0 8px 22px rgba(0,0,0,.25); }
  .sp-dd .opt { padding: 7px 12px; cursor: pointer; }
  .sp-dd .opt:hover { background: color-mix(in srgb, var(--fg) 7%, transparent); }
  .sp-dd .opt small { display: block; color: var(--muted); font-size: 11.5px; }
  .sp-dd .foot { padding: 6px 12px 4px; border-top: 1px solid var(--line); color: var(--muted); font-size: 11.5px; }
  .sp-hp { position: absolute; left: 0; top: 0; width: 1px; height: 1px; opacity: 0; overflow: hidden; pointer-events: none; }
  /* export */
  .sp-crm { flex: 1; display: flex; min-height: 0; }
  .sp-crm-nav { flex: none; width: 150px; padding: 12px 10px; background: var(--panel); border-right: 1px solid var(--line); display: flex; flex-direction: column; gap: 4px; color: var(--muted); }
  .sp-crm-nav div { padding: 6px 8px; border-radius: 6px; }
  .sp-crm-nav div.cur { background: color-mix(in srgb, var(--accent) 14%, transparent); color: var(--fg); font-weight: 600; }
  .sp-tbl { width: 100%; border-collapse: collapse; font-size: 12px; table-layout: fixed; }
  .sp-tbl th, .sp-tbl td { text-align: left; padding: 6px 8px; border-bottom: 1px solid var(--line); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sp-tbl th { color: var(--muted); font-weight: 600; background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
  .sp-cb { display: flex; align-items: center; gap: 8px; padding: 4px 0; cursor: pointer; }
  .sp-box { flex: none; width: 16px; height: 16px; border: 1.5px solid var(--muted); border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; color: #fff; }
  .sp-box.on { background: var(--accent); border-color: var(--accent); }
  .sp-box.dis { opacity: .4; }
  .sp-radio { flex: none; width: 16px; height: 16px; border: 1.5px solid var(--muted); border-radius: 50%; }
  .sp-radio.on { border: 5px solid var(--accent); }
  .sp-badge { font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 8px; background: #f9a825; color: #222; }
  .sp-dlbar { position: absolute; left: 0; right: 0; bottom: 0; z-index: 15; display: flex; align-items: center; gap: 10px; height: 40px; padding: 0 14px;
    background: var(--panel); border-top: 1px solid var(--line); font-size: 12.5px; }
  /* visibility */
  .sp-soc { flex: 1; display: flex; gap: 14px; padding: 14px; min-height: 0; justify-content: center; }
  .sp-soc-nav { flex: none; width: 150px; display: flex; flex-direction: column; gap: 4px; color: var(--muted); }
  .sp-soc-nav div { padding: 6px 8px; border-radius: 6px; }
  .sp-soc-nav div.cur { color: var(--fg); font-weight: 650; background: color-mix(in srgb, var(--fg) 6%, transparent); }
  .sp-feed { flex: 1; max-width: 520px; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
  .sp-post { padding: 14px 16px; }
  .sp-post .text { margin: 10px 0 12px; padding: 10px 12px; border-radius: 8px; background: color-mix(in srgb, var(--fg) 4%, var(--panel)); font-size: 13.5px; }
  .sp-audbtn { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;
    background: color-mix(in srgb, var(--fg) 8%, var(--panel)); }
  .sp-audbtn.lk { cursor: default; opacity: .8; }
  .sp-prow { display: flex; align-items: center; gap: 10px; padding: 7px 0; border-bottom: 1px solid var(--line); }
  .sp-prow .lb { width: 130px; color: var(--muted); font-size: 12px; }
  .sp-prow .v { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  /* retention */
  .sp-acct { flex: 1; display: flex; min-height: 0; }
  .sp-acct-main { flex: 1; min-width: 0; padding: 12px 16px; display: flex; flex-direction: column; gap: 10px; }
  .sp-cols { display: flex; gap: 12px; min-height: 0; }
  .sp-cols > .sp-card { flex: 1; min-width: 0; padding: 12px 14px; }
  .sp-req { padding: 10px 14px; border-left: 4px solid var(--accent); }
  .sp-req .row { display: flex; gap: 8px; margin-top: 8px; }
  `;

  const LOCK = '<svg viewBox="0 0 16 16"><path fill="currentColor" d="M4.5 7V5a3.5 3.5 0 0 1 7 0v2h.5a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zm1.5 0h4V5a2 2 0 0 0-4 0z"/></svg>';
  const TUNE = '<svg viewBox="0 0 16 16"><path fill="currentColor" d="M2 4h7.2a2 2 0 0 1 3.6 0H14v1.5h-1.2a2 2 0 0 1-3.6 0H2zm0 6.5h1.2a2 2 0 0 1 3.6 0H14V12H6.8a2 2 0 0 1-3.6 0H2z"/></svg>';
  const AV_COLORS = ['#1e88e5', '#8e24aa', '#43a047', '#f4511e', '#00897b', '#6d4c41', '#3949ab', '#c0ca33'];
  const ICON = { public: '#globe', friends: '#people', close: '#star', only: '#lock' };
  const PERM_ICON = { camera: '#camera', microphone: '#mic', location: '#pin', notifications: '#bell', clipboard: '#clip', contacts: '#person' };
  // Inline icons (no emoji: the agent's browser may have no emoji font). A text that starts with '#<name> ' gets the
  // icon in front of the rest.
  const svg = (d) => `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const SVG = {
    globe: svg('<circle cx="8" cy="8" r="6.2"/><path d="M1.8 8h12.4M8 1.8c2 2.2 2 10.2 0 12.4M8 1.8c-2 2.2-2 10.2 0 12.4"/>'),
    people: svg('<circle cx="6" cy="5.5" r="2.3"/><path d="M1.8 13.5c.4-2.6 2.1-4 4.2-4s3.8 1.4 4.2 4"/><circle cx="11.3" cy="6" r="1.9"/><path d="M11 9.6c1.8 0 3 1.2 3.3 3.4"/>'),
    star: svg('<path d="M8 1.9l1.8 3.9 4.2.5-3.1 2.9.8 4.2L8 11.3l-3.7 2.1.8-4.2L2 6.3l4.2-.5z"/>'),
    lock: svg('<rect x="3.2" y="7" width="9.6" height="7" rx="1.2"/><path d="M5.2 7V5a2.8 2.8 0 0 1 5.6 0v2"/>'),
    camera: svg('<rect x="1.8" y="4.2" width="9" height="7.6" rx="1.4"/><path d="M10.8 7l3.4-2v6l-3.4-2"/>'),
    mic: svg('<rect x="5.8" y="1.8" width="4.4" height="7.6" rx="2.2"/><path d="M3.4 7.6a4.6 4.6 0 0 0 9.2 0M8 12.2v2"/>'),
    pin: svg('<path d="M8 14.4s4.6-4.4 4.6-8a4.6 4.6 0 0 0-9.2 0c0 3.6 4.6 8 4.6 8z"/><circle cx="8" cy="6.4" r="1.6"/>'),
    bell: svg('<path d="M4 11.2V7.4a4 4 0 0 1 8 0v3.8l1.2 1.2H2.8zM6.6 13.8a1.5 1.5 0 0 0 2.8 0"/>'),
    clip: svg('<rect x="3.2" y="2.8" width="9.6" height="11.6" rx="1.2"/><rect x="5.8" y="1.6" width="4.4" height="2.6" rx=".8"/>'),
    person: svg('<circle cx="8" cy="5.4" r="2.8"/><path d="M2.8 14.2c.5-3 2.6-4.6 5.2-4.6s4.7 1.6 5.2 4.6"/>'),
    doc: svg('<path d="M4 1.8h5.2L12.4 5v9.2H4z"/><path d="M9 1.8V5h3.4M6 8.4h4.4M6 11h4.4"/>'),
    link: svg('<path d="M6.8 9.2a3 3 0 0 0 4.2 0l2-2a3 3 0 0 0-4.2-4.2l-.8.8M9.2 6.8a3 3 0 0 0-4.2 0l-2 2a3 3 0 0 0 4.2 4.2l.8-.8"/>'),
    shield: svg('<path d="M8 1.8l5.2 2v4c0 3.2-2.2 5.4-5.2 6.4-3-1-5.2-3.2-5.2-6.4v-4z"/>'),
  };
  const PERM_ASK = { camera: 'Use your camera', microphone: 'Use your microphone', location: 'Know your location', notifications: 'Show notifications',
    clipboard: 'See text and images copied to the clipboard', contacts: 'See your contacts' };

  const TOKENS = {
    css: CSS,
    font: "13px/1.35 system-ui, -apple-system, 'Segoe UI', sans-serif",
    radius: '10px',
    dangerColor: '#c62828',
    warningColor: '#f9a825',
    paperBackground: '#fff',
    paperColor: '#1d2330',
    avatarColors: AV_COLORS,
    icons: SVG,
    lockIcon: LOCK,
    settingsIcon: TUNE,
    audienceIcons: ICON,
    permissionIcons: PERM_ICON,
    permissionAsks: PERM_ASK,
    inactiveTabColor: '#7a7f8a',
    otherTabs: ['Inbox (3)', 'Calendar', 'New Tab', 'Weather'],
    margin: 8,
    minWindow: 360,
    widthBreak: 900,
    widthMin: 880,
    widthMax: 1060,
    widthScale: 0.86,
    heightBreak: 540,
    heightMin: 520,
    heightMax: 640,
    heightScale: 0.9,
    sideNarrow: 230,
    sideWide: 260,
  };

  
  env.template('protect-privacy/_classic-assets', () => ({ TOKENS }));
}
