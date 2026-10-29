/* use-email/_base-style.js: the reference client's unchanged stylesheet. */
(function () {
  'use strict';
  const CSS = `
      .am-app { position: absolute; display: flex; flex-direction: column; overflow: hidden; background: var(--panel); color: var(--fg);
        border: 1px solid var(--line); border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 12px 32px rgba(0,0,0,.07); }
      .am-app [hidden] { display: none !important; }
      .am-top { flex: none; display: flex; align-items: center; gap: 14px; height: 50px; padding: 0 14px; box-sizing: border-box;
        border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
      .am-brand { flex: none; display: flex; align-items: center; gap: 9px; font-weight: 700; font-size: 16px; }
      .am-brand svg { width: 24px; height: 24px; color: var(--accent); }
      .am-new { flex: none; display: inline-flex; align-items: center; gap: 7px; height: 34px; padding: 0 14px; border-radius: 17px; font: inherit;
        font-size: 14px; font-weight: 650; color: var(--fg); background: color-mix(in srgb, var(--accent) 16%, var(--panel));
        border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--line)); cursor: pointer; }
      .am-new:hover { background: color-mix(in srgb, var(--accent) 24%, var(--panel)); }
      .am-new svg { width: 16px; height: 16px; }
      .am-search { position: relative; flex: 1; min-width: 120px; max-width: 480px; display: flex; align-items: center; height: 34px;
        border-radius: 8px; background: color-mix(in srgb, var(--fg) 6%, var(--panel)); }
      .am-search > svg { position: absolute; left: 10px; width: 15px; height: 15px; color: var(--muted); pointer-events: none; }
      .am-search input { flex: 1; min-width: 0; height: 100%; padding: 0 30px 0 32px; border: 1px solid transparent; border-radius: 8px; font: inherit;
        font-size: 14px; color: var(--fg); background: transparent; outline: none; user-select: text; -webkit-user-select: text; }
      .am-search input:focus { border-color: var(--accent); background: var(--panel); }
      .am-search input::placeholder { color: var(--muted); }
      .am-sx { position: absolute; right: 4px; width: 26px; height: 26px; border: 0; border-radius: 6px; background: transparent; color: var(--muted);
        font: inherit; font-size: 17px; line-height: 1; cursor: pointer; }
      .am-sx:hover { color: var(--fg); background: color-mix(in srgb, var(--fg) 9%, transparent); }
      .am-me { flex: none; margin-left: auto; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
        color: #fff; font-size: 12.5px; font-weight: 700; background: color-mix(in srgb, var(--accent) 70%, #333); }
      .am-body { flex: 1; display: flex; min-height: 0; }

      .am-side { flex: none; box-sizing: border-box; padding: 6px 6px; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin;
        border-right: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 2%, var(--panel)); }
      .am-folder { display: flex; align-items: center; gap: 10px; padding: 0 10px; border-radius: 7px; font-size: 14px; color: var(--muted); cursor: pointer; }
      .am-folder.deco { cursor: default; }
      .am-folder:not(.deco):hover { background: color-mix(in srgb, var(--fg) 6%, transparent); color: var(--fg); }
      .am-folder svg { flex: none; width: 16px; height: 16px; }
      .am-folder .lb { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .am-folder .n { flex: none; font-size: 12px; font-variant-numeric: tabular-nums; }
      .am-folder.on { color: var(--fg); font-weight: 650; background: color-mix(in srgb, var(--accent) 13%, transparent); }
      .am-folder.on svg { color: var(--accent); }
      .am-flabel { padding: 6px 10px 2px; font-size: 11.5px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: var(--muted); }
      .am-dot { flex: none; width: 16px; height: 16px; border-radius: 4px; display: flex; align-items: center; justify-content: center;
        font-size: 10px; font-weight: 800; color: #fff; }
      .am-rail .am-folder { justify-content: center; padding: 0; position: relative; }
      .am-rail .am-folder .lb { display: none; }
      .am-rail .am-folder .n { position: absolute; right: 2px; top: 1px; font-size: 10px; }
      .am-rail .am-flabel { height: 1px; padding: 0; margin: 6px 8px; background: var(--line); font-size: 0; }

      .am-main { flex: 1; min-width: 0; display: flex; }
      .am-listpane { flex: none; display: flex; flex-direction: column; border-right: 1px solid var(--line); min-width: 0; }
      .am-stack .am-listpane { flex: 1; border-right: 0; }
      .am-stack .am-read { display: none; }
      .am-stack.am-detail .am-listpane { display: none; }
      .am-stack.am-detail .am-read { display: flex; }
      .am-lhead { flex: none; display: flex; align-items: center; gap: 8px; height: 46px; padding: 0 12px 0 12px; box-sizing: border-box;
        border-bottom: 1px solid var(--line); min-width: 0; overflow: hidden; }
      .am-lhead input[type=checkbox], .am-row input[type=checkbox] { flex: none; width: 16px; height: 16px; margin: 0; accent-color: var(--accent); cursor: pointer; }
      .am-lhead .cbw { flex: none; display: flex; align-items: center; justify-content: center; width: 26px; height: 30px; }
      .am-lhead b { font-size: 17px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .am-lhead .rg { margin-left: auto; flex: none; font-size: 12.5px; color: var(--muted); font-variant-numeric: tabular-nums; }
      .am-bulk { display: flex; align-items: center; gap: 2px; min-width: 0; }
      .am-bulk .cnt { margin-left: 6px; font-size: 12.5px; color: var(--muted); white-space: nowrap; }
      .am-lb { flex: none; display: flex; }
      .am-list { flex: 1; min-width: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: none; }
      .am-list::-webkit-scrollbar { display: none; }
      .am-track { position: relative; flex: none; width: 12px; border-left: 1px solid var(--line); cursor: pointer; touch-action: none;
        background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
      .am-track.off { display: none; }
      .am-thumb { position: absolute; left: 2px; right: 2px; border-radius: 5px; cursor: grab; touch-action: none;
        background: color-mix(in srgb, var(--fg) 28%, var(--panel)); }
      .am-thumb:hover, .am-thumb.dragging { background: color-mix(in srgb, var(--fg) 46%, var(--panel)); }

      .am-row { position: relative; display: flex; align-items: center; box-sizing: border-box; cursor: pointer;
        border-bottom: 1px solid color-mix(in srgb, var(--line) 70%, transparent); }
      .am-row:hover { background: color-mix(in srgb, var(--fg) 4%, var(--panel)); }
      .am-row.checked { background: color-mix(in srgb, var(--accent) 7%, var(--panel)); }
      .am-row.open { background: color-mix(in srgb, var(--accent) 12%, var(--panel)); }
      .am-row.open::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--accent); }
      .am-gut { flex: none; display: flex; align-items: center; gap: 0; padding-left: 8px; }
      .am-gut .cbw { display: flex; align-items: center; justify-content: center; width: 24px; height: 28px; }
      .am-ico { flex: none; display: flex; align-items: center; justify-content: center; width: 24px; height: 25px; border-radius: 5px;
        color: color-mix(in srgb, var(--muted) 80%, transparent); cursor: pointer; }
      .am-ico:hover { background: color-mix(in srgb, var(--fg) 9%, transparent); color: var(--fg); }
      .am-ico svg { width: 16px; height: 16px; }
      .am-ico.star.on { color: #f0b400; }
      .am-ico.star.on svg path { fill: #f5c518; stroke: #d39e00; }
      .am-ico.imp.on { color: #e8a200; }
      .am-ico.imp.on svg path { fill: #f6b93b; stroke: #c98700; }
      .am-txt { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; gap: 2px; padding: 0 4px 0 4px; }
      .am-l1, .am-l2 { display: flex; align-items: center; gap: 7px; min-width: 0; }
      .am-from { flex: 1; min-width: 0; font-size: 14.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .am-row.unread .am-from, .am-row.unread .am-subj { font-weight: 700; }
      .am-time { flex: none; font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
      .am-row.unread .am-time { color: var(--accent); font-weight: 650; }
      .am-clip { flex: none; display: inline-flex; align-items: center; gap: 2px; font-size: 10.5px; font-weight: 700; color: var(--muted);
        letter-spacing: .02em; }
      .am-clip svg { width: 13px; height: 13px; }
      .am-subj { min-width: 0; font-size: 13.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .am-snip { flex: 1; min-width: 0; font-size: 13px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .am-chips { display: flex; gap: 6px; min-width: 0; overflow: hidden; }
      .am-chip { flex: none; max-width: 190px; display: inline-flex; align-items: center; gap: 5px; height: 22px; padding: 0 8px; border-radius: 11px;
        font-size: 12px; border: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 3%, var(--panel)); white-space: nowrap; overflow: hidden; }
      .am-chip span { overflow: hidden; text-overflow: ellipsis; }
      .am-chip svg { flex: none; width: 13px; height: 13px; }
      .am-ract { flex: none; display: flex; align-items: center; gap: 1px; padding-right: 6px; }
      .am-app.hover-acts .am-ract { position: absolute; right: 0; top: 0; bottom: 0; padding: 0 8px 0 10px; opacity: 0;
        background: color-mix(in srgb, var(--fg) 4%, var(--panel)); }
      .am-app.hover-acts .am-row.open .am-ract { background: color-mix(in srgb, var(--accent) 12%, var(--panel)); }
      .am-app.hover-acts .am-row:hover .am-ract { opacity: 1; }
      .am-row.medium .am-subj { flex: none; max-width: 55%; }
      .am-row.compact .am-txt { flex-direction: row; align-items: center; gap: 8px; }
      .am-row.compact .am-l1 { flex: none; width: 28%; max-width: 150px; }
      .am-row.compact .am-from { font-size: 14px; }
      .am-row.compact .am-l2 { flex: 1; }
      .am-row.compact .am-subj { flex: none; max-width: 55%; }
      .am-empty-list { padding: 30px 16px; text-align: center; color: var(--muted); font-size: 14px; }

      .am-read { flex: 1; min-width: 0; display: flex; flex-direction: column; position: relative; }
      .am-blank { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: var(--muted); font-size: 14.5px; }
      .am-blank svg { width: 54px; height: 54px; opacity: .45; }
      .am-bar { flex: none; position: relative; display: flex; align-items: center; gap: 3px; height: 46px; padding: 0 10px; box-sizing: border-box; border-bottom: 1px solid var(--line); }
      .am-tb { flex: none; display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 32px; min-width: 32px; padding: 0 9px; border-radius: 7px; font: inherit; font-size: 13.5px;
        color: var(--fg); background: transparent; border: 1px solid transparent; cursor: pointer; white-space: nowrap; box-sizing: border-box; }
      .am-tb:hover { background: color-mix(in srgb, var(--fg) 7%, var(--panel)); border-color: var(--line); }
      .am-tb svg { flex: none; width: 17px; height: 17px; }
      .am-icons .am-tb { padding: 0; width: 32px; }
      .am-icons .am-tb span { display: none; }
      .am-tb.star.on svg path { fill: #f5c518; stroke: #d39e00; }
      .am-tb.imp.on svg path { fill: #f6b93b; stroke: #c98700; }
      .am-tb.del:hover { color: #d63939; }
      .am-tb.pressed { background: color-mix(in srgb, var(--accent) 14%, var(--panel)); border-color: color-mix(in srgb, var(--accent) 40%, var(--line)); }
      .am-bar .sp { flex: 1; }
      .am-bar .when { flex: none; font-size: 12.5px; color: var(--muted); white-space: nowrap; }
      .am-menu { position: absolute; z-index: 5; min-width: 170px; padding: 6px; border-radius: 9px; background: var(--panel);
        border: 1px solid var(--line); box-shadow: 0 10px 28px rgba(0,0,0,.18); }
      .am-menu .hd { padding: 4px 10px 6px; font-size: 12px; color: var(--muted); }
      .am-mi { display: flex; align-items: center; gap: 9px; height: 32px; padding: 0 10px; border-radius: 6px; font-size: 14px; cursor: pointer; white-space: nowrap; }
      .am-mi:hover { background: color-mix(in srgb, var(--accent) 12%, var(--panel)); }
      .am-mi svg { width: 15px; height: 15px; color: var(--muted); }
      .am-msg { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 14px 22px 4px; }
      .am-msg h2 { margin: 0 0 12px; font-size: 20px; font-weight: 700; line-height: 1.25; }
      .am-who { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; min-width: 0; }
      .am-av { flex: none; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
        color: #fff; font-weight: 700; font-size: 15px; }
      .am-who > div:last-child { min-width: 0; }
      .am-who .nm { font-weight: 700; font-size: 14.5px; }
      .am-who .nm small { font-weight: 400; font-size: 12.5px; color: var(--muted); margin-left: 6px; }
      .am-who .to { font-size: 12.5px; color: var(--muted); }
      .am-msg .am-chips { flex-wrap: wrap; margin-bottom: 12px; }
      .am-msg .am-chip { height: 30px; border-radius: 7px; max-width: 260px; }
      .am-msg .am-chip small { color: var(--muted); }
      .am-text { font-size: 14.5px; line-height: 1.6; max-width: 640px; white-space: pre-line; }
      .am-note { display: flex; align-items: center; gap: 8px; width: fit-content; margin-top: 10px; padding: 7px 12px; border-radius: 7px; font-size: 13px;
        color: color-mix(in srgb, #0b8a5b 85%, var(--fg)); background: color-mix(in srgb, #0b8a5b 12%, var(--panel)); }
      .am-note svg { flex: none; width: 16px; height: 16px; }
      .am-acts { flex: none; display: flex; flex-wrap: wrap; gap: 8px; padding: 10px 18px 14px; }
      .am-btn { display: inline-flex; align-items: center; gap: 7px; height: 34px; padding: 0 14px; border-radius: 17px; font: inherit; font-size: 13.5px; font-weight: 600;
        color: var(--fg); background: var(--panel); border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); cursor: pointer; white-space: nowrap; }
      .am-btn:hover { background: color-mix(in srgb, var(--fg) 6%, var(--panel)); }
      .am-btn svg { width: 16px; height: 16px; }
      .am-btn.primary { color: #fff; background: var(--accent); border-color: var(--accent); }
      .am-btn.primary:hover { background: color-mix(in srgb, var(--accent) 85%, #000); }
      .am-btn.danger { color: #fff; background: #d63939; border-color: #d63939; }

      .am-comp { flex: 1; min-height: 0; display: flex; flex-direction: column; margin: 10px; border: 1px solid var(--line); border-radius: 9px; overflow: hidden;
        box-shadow: 0 6px 18px rgba(0,0,0,.08); }
      .am-chead { flex: none; display: flex; align-items: center; height: 38px; padding: 0 6px 0 14px; font-weight: 700; font-size: 14px;
        background: color-mix(in srgb, var(--fg) 6%, var(--panel)); }
      .am-x { margin-left: auto; width: 30px; height: 30px; border: 0; border-radius: 6px; background: transparent; color: var(--muted);
        font: inherit; font-size: 20px; line-height: 1; cursor: pointer; }
      .am-x:hover { background: color-mix(in srgb, var(--fg) 10%, transparent); color: var(--fg); }
      .am-crow { flex: none; display: flex; align-items: center; gap: 8px; min-height: 38px; padding: 0 12px; border-bottom: 1px solid var(--line); font-size: 14px; }
      .am-crow label { flex: none; width: 54px; color: var(--muted); }
      .am-crow input { flex: 1; min-width: 0; height: 28px; padding: 0 8px; border: 1px solid transparent; border-radius: 5px; font: inherit; font-size: 14px;
        color: var(--fg); background: transparent; outline: none; user-select: text; -webkit-user-select: text; }
      .am-crow input:focus { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 5%, var(--panel)); }
      .am-crow input::placeholder { color: color-mix(in srgb, var(--muted) 70%, transparent); }
      .am-crow .subj { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .am-comp textarea { flex: 1; min-height: 40px; margin: 0; padding: 10px 14px; border: 0; resize: none; outline: none; font: inherit; font-size: 14px;
        line-height: 1.5; color: var(--fg); background: var(--panel); user-select: text; -webkit-user-select: text; }
      .am-comp textarea:focus { box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--accent) 35%, transparent); }
      .am-cfoot { flex: none; display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-top: 1px solid var(--line); }
      .am-link { font: inherit; font-size: 13.5px; color: var(--muted); background: transparent; border: 0; padding: 6px 8px; border-radius: 6px; cursor: pointer; }
      .am-link:hover { color: var(--fg); background: color-mix(in srgb, var(--fg) 7%, transparent); }

      .am-status { flex: none; display: flex; align-items: center; gap: 10px; height: 34px; padding: 0 12px; box-sizing: border-box;
        border-top: 1px solid var(--line); font-size: 12px; color: var(--muted); background: color-mix(in srgb, var(--fg) 2%, var(--panel)); }
      .am-status .used { display: flex; align-items: center; gap: 8px; margin-left: auto; white-space: nowrap; }
      .am-status i { flex: none; width: 64px; height: 5px; border-radius: 3px; background: color-mix(in srgb, var(--fg) 10%, var(--panel)); overflow: hidden; }
      .am-status i::before { content: ''; display: block; height: 100%; width: var(--used, 30%); background: var(--accent); }
      .am-toast { display: flex; align-items: center; gap: 4px; height: 26px; padding: 0 4px 0 12px; border-radius: 6px; min-width: 0;
        color: #f4f4f4; background: #2b2d31; font-size: 13px; }
      .am-toast span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .am-toast button { flex: none; height: 22px; padding: 0 8px; border: 0; border-radius: 4px; font: inherit; font-size: 13px; font-weight: 700;
        color: #8ab4f8; background: transparent; cursor: pointer; }
      .am-toast button:hover { background: rgba(255,255,255,.1); }
      .am-toast button.cl { color: #bbb; font-weight: 400; font-size: 16px; padding: 0 6px; }

      .am-modal { position: absolute; inset: 0; z-index: 10; display: flex; align-items: center; justify-content: center; background: rgba(20,22,26,.38); }
      .am-dlg { width: min(380px, 86%); padding: 20px 22px 16px; border-radius: 12px; background: var(--panel); color: var(--fg);
        box-shadow: 0 18px 50px rgba(0,0,0,.3); }
      .am-dlg h3 { margin: 0 0 8px; font-size: 17px; }
      .am-dlg p { margin: 0 0 18px; font-size: 14px; color: var(--muted); }
      .am-dlg .row { display: flex; justify-content: flex-end; gap: 10px; }

      .am-new.wide { display: flex; justify-content: center; width: 100%; margin: 2px 0 8px; height: 36px; box-sizing: border-box; }
      .am-adbar { flex: none; display: flex; align-items: center; gap: 14px; padding: 0 14px; box-sizing: border-box; border-bottom: 1px solid var(--line);
        background: color-mix(in srgb, var(--accent) 6%, var(--panel)); cursor: pointer; }
      .am-adbar .tag, .am-sp .tag, .am-adcard .tag { flex: none; padding: 1px 5px; border-radius: 3px; font-size: 10px; font-weight: 800; letter-spacing: .04em;
        color: #fff; background: #8a8f98; text-transform: uppercase; }
      .am-adbar .art { flex: none; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 15px; }
      .am-adbar .tx { flex: 1; min-width: 0; font-size: 13.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .am-adbar .tx b { margin-right: 6px; }
      .am-adbar .cta, .am-adcard .cta { flex: none; height: 28px; padding: 0 14px; border-radius: 4px; border: 0; font: inherit; font-size: 13px; font-weight: 700; color: #fff; cursor: pointer; }
      .am-sp { flex: none; display: flex; align-items: center; gap: 10px; padding: 0 12px 0 14px; box-sizing: border-box; cursor: pointer;
        border-bottom: 1px solid color-mix(in srgb, var(--line) 70%, transparent); background: color-mix(in srgb, #f0b400 9%, var(--panel)); }
      .am-sp .tx { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
      .am-sp .t1 { display: flex; align-items: center; gap: 7px; font-size: 14px; font-weight: 650; min-width: 0; }
      .am-sp .t1 span:first-child { flex: none; max-width: 40%; }
      .am-sp .t1 span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .am-sp .t2 { font-size: 13px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .am-sp .go { flex: none; font-size: 12.5px; font-weight: 700; color: var(--accent); }
      .am-adcol { flex: none; width: 176px; box-sizing: border-box; display: flex; flex-direction: column; gap: 10px; padding: 10px; overflow: hidden;
        border-left: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
      .am-adcard { flex: none; display: flex; flex-direction: column; gap: 6px; padding: 10px; border-radius: 8px; border: 1px solid var(--line); background: var(--panel); cursor: pointer; }
      .am-adcard .art { height: 52px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 22px; }
      .am-adcard b { font-size: 13.5px; }
      .am-adcard p { margin: 0; font-size: 12px; line-height: 1.35; color: var(--muted); }
      .am-adcard .cta { align-self: stretch; height: 30px; }

      /* classic: an Outlook-2003-like client (menu bar, toolbar, folder tree | list over a reading pane) */
      .cl-app { position: absolute; display: flex; flex-direction: column; overflow: hidden; box-sizing: border-box;
        font: 12px/1.3 Tahoma, Verdana, 'DejaVu Sans', sans-serif; color: var(--fg); background: var(--cl-face);
        --cl-face: color-mix(in srgb, #8a9bb8 20%, var(--panel)); --cl-edge: color-mix(in srgb, #3a4a6e 45%, var(--line));
        --cl-sel: #316ac5; --cl-white: color-mix(in srgb, var(--panel) 94%, #fff);
        border: 1px solid #0a246a; box-shadow: 0 2px 8px rgba(0,0,0,.25); }
      .cl-app [hidden] { display: none !important; }
      .cl-title { flex: none; display: flex; align-items: center; gap: 6px; height: 24px; padding: 0 3px 0 6px; box-sizing: border-box; color: #fff; font-weight: 700;
        background: linear-gradient(90deg, #0a246a, #3a6ea5 70%, #a6caf0); }
      .cl-title svg { width: 15px; height: 15px; }
      .cl-title .sp { flex: 1; }
      .cl-title i { flex: none; width: 18px; height: 16px; border-radius: 3px; border: 1px solid #fff8; background: linear-gradient(#5b8dd9, #2a56a8); }
      .cl-title i:last-child { background: linear-gradient(#e0795d, #b83a1c); }
      .cl-menu { flex: none; display: flex; align-items: center; height: 22px; padding: 0 4px; box-sizing: border-box; border-bottom: 1px solid var(--cl-edge); }
      .cl-menu span { padding: 2px 8px; cursor: default; }
      .cl-menu span:hover { background: color-mix(in srgb, var(--cl-sel) 25%, transparent); }
      .cl-menu label { margin-left: auto; display: flex; align-items: center; gap: 4px; }
      .cl-menu input { width: 190px; height: 17px; padding: 0 4px; box-sizing: border-box; font: inherit; color: var(--fg); background: var(--cl-white);
        border: 1px solid var(--cl-edge); outline: none; user-select: text; -webkit-user-select: text; }
      .cl-menu input:focus { border-color: var(--cl-sel); }
      .cl-tools { flex: none; position: relative; display: flex; align-items: center; gap: 1px; height: 36px; padding: 0 4px; box-sizing: border-box;
        border-bottom: 1px solid var(--cl-edge); overflow: hidden; }
      .cl-tb { flex: none; display: inline-flex; align-items: center; gap: 4px; height: 28px; padding: 0 6px; font: inherit; color: var(--fg); background: transparent;
        border: 1px solid transparent; cursor: pointer; white-space: nowrap; box-sizing: border-box; }
      .cl-tb:hover:not(.dis) { border-color: var(--cl-edge); background: color-mix(in srgb, var(--panel) 70%, #cfe0ff); }
      .cl-tb.pressed { border-color: var(--cl-edge); background: color-mix(in srgb, var(--cl-sel) 25%, var(--panel)); }
      .cl-tb svg { flex: none; width: 17px; height: 17px; }
      .cl-tb.dis { opacity: .42; cursor: default; }
      .cl-tb.del svg { color: #c0392b; }
      .cl-tb.star svg path { fill: #f5c518; stroke: #b8860b; }
      .cl-tools.ic .cl-tb span { display: none; }
      .cl-tools .sep { flex: none; width: 1px; height: 22px; margin: 0 4px; background: var(--cl-edge); }
      .cl-body { flex: 1; min-height: 0; display: flex; gap: 3px; padding: 3px; }
      .cl-tree { flex: none; box-sizing: border-box; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; padding: 2px 0; background: var(--cl-white); border: 1px solid var(--cl-edge); }
      .cl-th { padding: 3px 6px; font-weight: 700; color: #fff; background: linear-gradient(90deg, #4b6fb5, #7d9fd6); }
      .cl-fo { display: flex; align-items: center; gap: 5px; height: 20px; padding-right: 4px; white-space: nowrap; cursor: pointer; }
      .cl-fo.deco { cursor: default; }
      .cl-fo svg { flex: none; width: 14px; height: 14px; color: #b8860b; }
      .cl-fo .lb { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
      .cl-fo b { flex: none; font-weight: 700; color: #1c3f94; }
      .cl-fo.on { color: #fff; background: var(--cl-sel); }
      .cl-fo.on b { color: #fff; }
      .cl-fo.on svg { color: #fff; }
      .cl-fo.bold .lb { font-weight: 700; }
      .cl-right { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
      .cl-listbox { flex: none; display: flex; flex-direction: column; background: var(--cl-white); border: 1px solid var(--cl-edge); }
      .cl-col { flex: none; display: flex; align-items: center; height: 20px; box-sizing: border-box; font-weight: 400; border-bottom: 1px solid var(--cl-edge);
        background: linear-gradient(var(--cl-white), color-mix(in srgb, #8a9bb8 28%, var(--panel))); }
      .cl-col span { padding: 0 6px; border-right: 1px solid var(--cl-edge); height: 100%; display: flex; align-items: center; box-sizing: border-box; overflow: hidden; }
      .cl-lb { flex: none; display: flex; }
      .cl-list { flex: 1; min-width: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: none; }
      .cl-list::-webkit-scrollbar { display: none; }
      .cl-track { position: relative; flex: none; width: 16px; cursor: pointer; touch-action: none; border-left: 1px solid var(--cl-edge);
        background: repeating-conic-gradient(color-mix(in srgb, #8a9bb8 22%, var(--panel)) 0 25%, var(--cl-white) 0 50%) 0 0 / 2px 2px; }
      .cl-track.off { display: none; }
      .cl-thumb { position: absolute; left: 0; right: 0; cursor: grab; touch-action: none; box-sizing: border-box; border: 1px solid #5a7bbd;
        background: linear-gradient(90deg, #dbe6fb, #a9c1ee); }
      .cl-row { display: flex; align-items: center; box-sizing: border-box; cursor: default; white-space: nowrap; border-bottom: 1px solid color-mix(in srgb, var(--cl-edge) 25%, transparent); }
      .cl-row > * { flex: none; overflow: hidden; text-overflow: ellipsis; padding: 0 6px; box-sizing: border-box; }
      .cl-row .ft { width: 22px; padding: 0; display: flex; align-items: center; justify-content: center; }
      .cl-row .ft svg { width: 13px; height: 13px; color: color-mix(in srgb, var(--muted) 70%, transparent); }
      .cl-row .ft:hover svg { color: var(--fg); }
      .cl-row .ft.on svg { color: #d04a1c; }
      .cl-row .ft.on svg path { fill: #f5c518; stroke: #b8860b; }
      .cl-row .rd { width: 20px; padding: 0; display: flex; align-items: center; justify-content: center; }
      .cl-row .rd svg { width: 13px; height: 13px; }
      .cl-row .at { width: 18px; padding: 0; display: flex; align-items: center; justify-content: center; }
      .cl-row .at svg { width: 12px; height: 12px; }
      .cl-row .fr { width: 26%; }
      .cl-row .sj { flex: 1; min-width: 0; }
      .cl-row .tm { width: 92px; }
      .cl-row.unread { font-weight: 700; }
      .cl-row.checked { background: color-mix(in srgb, var(--cl-sel) 24%, var(--cl-white)); outline: 1px dotted var(--cl-sel); outline-offset: -1px; }
      .cl-row.open { color: #fff; background: var(--cl-sel); }
      .cl-row.open .ft svg, .cl-row.open .rd svg, .cl-row.open .at svg { color: #fff; }
      .cl-empty { padding: 14px; text-align: center; color: var(--muted); }
      .cl-read { flex: 1; min-height: 0; display: flex; flex-direction: column; background: var(--cl-white); border: 1px solid var(--cl-edge); position: relative; }
      .cl-blank { flex: 1; display: flex; align-items: center; justify-content: center; color: var(--muted); }
      .cl-head { flex: none; padding: 5px 8px 6px; background: color-mix(in srgb, #8a9bb8 16%, var(--cl-white)); border-bottom: 1px solid var(--cl-edge); }
      .cl-head h2 { margin: 0 0 3px; font-size: 13.5px; }
      .cl-head div { display: flex; gap: 6px; min-width: 0; }
      .cl-head div b { flex: none; width: 36px; color: var(--muted); font-weight: 400; }
      .cl-head div span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .cl-head .tmr { margin-left: auto; flex: none; color: var(--muted); }
      .cl-chips { display: flex; gap: 6px; flex-wrap: wrap; }
      .cl-chip { display: inline-flex; align-items: center; gap: 4px; padding: 1px 6px; border: 1px solid var(--cl-edge); background: var(--cl-white); }
      .cl-chip svg { width: 12px; height: 12px; }
      .cl-text { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 8px 10px; font-size: 13px; line-height: 1.5; white-space: pre-line; user-select: text; }
      .cl-note { margin-top: 8px; padding: 3px 8px; width: fit-content; color: #1b5e20; background: #e8f5e9; border: 1px solid #a5d6a7; }
      .cl-menu-pop { position: absolute; z-index: 6; min-width: 150px; padding: 2px; background: var(--cl-white); border: 1px solid var(--cl-edge); box-shadow: 2px 2px 4px rgba(0,0,0,.3); }
      .cl-mi { display: flex; align-items: center; gap: 6px; height: 21px; padding: 0 14px 0 6px; cursor: pointer; white-space: nowrap; }
      .cl-mi:hover { color: #fff; background: var(--cl-sel); }
      .cl-mi svg { width: 13px; height: 13px; }
      .cl-comp { flex: 1; min-height: 0; display: flex; flex-direction: column; }
      .cl-cbar { flex: none; display: flex; align-items: center; gap: 4px; height: 26px; padding: 0 4px; border-bottom: 1px solid var(--cl-edge); background: var(--cl-face); }
      .cl-btn { height: 20px; padding: 0 10px; font: inherit; color: var(--fg); cursor: pointer; background: linear-gradient(var(--cl-white), var(--cl-face)); border: 1px solid var(--cl-edge); border-radius: 3px; }
      .cl-btn:hover { border-color: var(--cl-sel); }
      .cl-crow { flex: none; display: flex; align-items: center; gap: 6px; height: 24px; padding: 0 6px; border-bottom: 1px solid color-mix(in srgb, var(--cl-edge) 40%, transparent); }
      .cl-crow label { flex: none; width: 46px; color: var(--muted); }
      .cl-crow input { flex: 1; min-width: 0; height: 18px; font: inherit; color: var(--fg); background: var(--cl-white); border: 1px solid var(--cl-edge); padding: 0 4px; outline: none;
        user-select: text; -webkit-user-select: text; }
      .cl-crow input:focus, .cl-comp textarea:focus { border-color: var(--cl-sel); }
      .cl-crow .subj { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .cl-comp textarea { flex: 1; min-height: 40px; margin: 0; padding: 6px 8px; resize: none; border: 1px solid transparent; outline: none; font: 13px/1.45 Tahoma, Verdana, 'DejaVu Sans', sans-serif;
        color: var(--fg); background: var(--cl-white); user-select: text; -webkit-user-select: text; }
      .cl-status { flex: none; display: flex; align-items: center; gap: 12px; height: 22px; padding: 0 6px; box-sizing: border-box; border-top: 1px solid var(--cl-edge); }
      .cl-status .r { margin-left: auto; color: var(--muted); }
      .cl-toast { display: flex; align-items: center; gap: 8px; min-width: 0; padding: 0 8px; height: 18px; background: #ffffe1; color: #222; border: 1px solid #333; }
      .cl-toast button { padding: 0; font: inherit; color: #0a3fb5; background: transparent; border: 0; text-decoration: underline; cursor: pointer; }
      .cl-toast button.cx { text-decoration: none; color: #444; }
      .cl-modal { position: absolute; inset: 0; z-index: 10; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,.2); }
      .cl-dlg { width: 320px; max-width: 90%; background: var(--cl-face); border: 1px solid #0a246a; box-shadow: 3px 3px 10px rgba(0,0,0,.4); }
      .cl-dlg .tt { padding: 3px 8px; color: #fff; font-weight: 700; background: linear-gradient(90deg, #0a246a, #3a6ea5); }
      .cl-dlg p { margin: 0; padding: 16px 14px; }
      .cl-dlg .row { display: flex; justify-content: center; gap: 8px; padding: 0 0 12px; }
      .cl-dlg .cl-btn { width: 74px; height: 23px; }
      `;
  env.template('use-email/_base-style', () => ({ CSS }));
})();
