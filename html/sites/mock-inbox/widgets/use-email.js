/*
 * mock-inbox / use-email / webmail: an organisation-hosted webmail client (frozen eval-only replica; heldout).
 * It is the reference `mail` client's state machine and DOM (every interaction goes through
 * env.familyDef.helpers.act(model, spec, action); all 16 job scenarios, undo included) under a different visual
 * grammar, layered on with the `rm-` classes below:
 *   look 'portal'   square-cornered app, a white-on-grey list with an accent bar on unread rows, flat
 *                   hairline toolbar, folder pills; look 'soft' rounded app, tinted read / unread rows.
 *   row icons       shown on hover only in some episodes (the original hoverActs choice), star and important
 *                   toggles are muted until hovered; avatars are not drawn in the list.
 * The portal frame (organisation bar, app strip, breadcrumb, footer) belongs to the site. The list pane, row
 * height and message pane are sized from ctx.size by the shared layout code; the app frame is the only anchor.
 * Traits: { search: true } (a working search box). Not covered here: the `ads` and `classic` clients.
 */
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

  /* mock-inbox look layer */
  .am-app.rm-app { border-radius: 4px; box-shadow: 0 1px 2px var(--shadow); border-color: var(--line); background: var(--panel); }
  .am-app.rm-soft { border-radius: 14px; }
  .rm-app .am-top { background: var(--portal, var(--panel)); }
  .rm-app .am-brand { font-weight: 600; letter-spacing: .01em; }
  .rm-app .am-new { border-radius: 4px; background: var(--accent); color: #fff; border-color: var(--accent); }
  .rm-app .am-new:hover { filter: brightness(1.08); background: var(--accent); }
  .rm-soft .am-new { border-radius: 18px; }
  .rm-app .am-search, .rm-app .am-search input { border-radius: 4px; }
  .rm-soft .am-search, .rm-soft .am-search input { border-radius: 18px; }
  .rm-app .am-side { background: var(--page, var(--panel)); }
  .rm-app .am-folder { border-radius: 4px; }
  .rm-soft .am-folder { border-radius: 16px; }
  .rm-app .am-folder.on { background: var(--soft); color: var(--accent); }
  .rm-app .am-lhead b { font-size: 15px; font-weight: 650; }
  .rm-app .am-row { background: var(--readbg, var(--panel)); border-bottom-color: var(--line); }
  .rm-app .am-row.unread { background: var(--unreadbg, var(--panel)); }
  .rm-app .am-row.unread::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--accent); }
  .rm-app .am-row:hover { background: var(--hover, rgba(0,0,0,.05)); box-shadow: inset 0 -1px 0 var(--line); }
  .rm-app .am-row.checked { background: var(--soft); }
  .rm-app .am-row.open { background: var(--soft); }
  .rm-app .am-row.open::before { width: 4px; }
  .rm-app .am-ico { color: color-mix(in srgb, var(--muted) 55%, transparent); }
  .rm-app .am-from { font-size: 14px; }
  .rm-app .am-tb { border-radius: 4px; }
  .rm-app .am-tb:hover { background: var(--hover, rgba(0,0,0,.05)); }
  .rm-app .am-bar { background: var(--panel); }
  .rm-app .am-btn { border-radius: 4px; }
  .rm-soft .am-btn { border-radius: 17px; }
  .rm-app .am-msg h2 { font-size: 18px; }
  html[data-theme="contrast"] .rm-app, html[data-theme="contrast"] .rm-app .am-row { border-color: #fff; }
  `;

  const svg = (body, extra = '') => `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ${extra}>${body}</svg>`;
  const I = {
    logo: svg('<rect x="2" y="4" width="16" height="12" rx="2.2"/><path d="M2.6 5l7.4 6 7.4-6"/>'),
    search: svg('<circle cx="8.6" cy="8.6" r="5.2"/><path d="M12.6 12.6l4.4 4.4"/>'),
    pen: svg('<path d="M13.5 3.5l3 3L7 16H4v-3z"/><path d="M11.5 5.5l3 3"/>'),
    inbox: svg('<path d="M2.5 11.5l2.2-6.6a1.2 1.2 0 0 1 1.1-.8h8.4a1.2 1.2 0 0 1 1.1.8l2.2 6.6v4.3a.9.9 0 0 1-.9.9H3.4a.9.9 0 0 1-.9-.9z"/><path d="M2.6 11.5h4.3l1.2 2h3.8l1.2-2h4.3"/>'),
    star: svg('<path d="M10 2.6l2.25 4.7 5.15.65-3.78 3.55.97 5.1L10 14.1l-4.6 2.5.98-5.1L2.6 7.95l5.15-.65z"/>'),
    imp: svg('<path d="M3 5.2h10.2l4 4.8-4 4.8H3l3.4-4.8z"/>'),
    sent: svg('<path d="M17.5 2.5L8.6 11.4M17.5 2.5l-5.6 15-3.3-6.1-6.1-3.3z"/>'),
    draft: svg('<path d="M4.5 2.5h7.5l3.5 3.5v11.5h-11z"/><path d="M11.8 2.6V6.2h3.6M7 10h6M7 13h4.5"/>'),
    archive: svg('<rect x="2.5" y="3.5" width="15" height="4" rx="1"/><path d="M3.8 7.5v8.2a1 1 0 0 0 1 1h10.4a1 1 0 0 0 1-1V7.5M8 11h4"/>'),
    trash: svg('<path d="M3.6 5.6h12.8M8 5.6V3.6h4v2M5.2 5.6l.9 11h7.8l.9-11M8.3 8.6v5.2M11.7 8.6v5.2"/>'),
    folder: svg('<path d="M2.5 5.5a1 1 0 0 1 1-1h4l1.6 1.8h7.4a1 1 0 0 1 1 1v8.2a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z"/>'),
    moveTo: svg('<path d="M2.5 5.5a1 1 0 0 1 1-1h4l1.6 1.8h7.4a1 1 0 0 1 1 1v8.2a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z"/><path d="M8 11.5h5M11 9.5l2 2-2 2"/>'),
    restore: svg('<path d="M4 9.5a6 6 0 1 1 1.8 4.3"/><path d="M3.6 5.2v4.5h4.5"/>'),
    unread: svg('<rect x="2.5" y="4.5" width="15" height="11" rx="1.8"/><path d="M3 5.5l7 5.5 7-5.5"/><circle cx="16" cy="4.5" r="2.4" fill="currentColor" stroke="none"/>'),
    read: svg('<path d="M2.5 8.5l7.5-5 7.5 5v7.3a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z"/><path d="M3 9l7 5 7-5"/>'),
    reply: svg('<path d="M8 4.5L3 9.5l5 5"/><path d="M3.4 9.5h8.1c3 0 5 2 5 5.3v.7"/>'),
    replyAll: svg('<path d="M10 4.5l-5 5 5 5"/><path d="M6 4.5l-5 5 5 5"/><path d="M5.4 9.5h6.1c3 0 5 2 5 5.3v.7"/>'),
    forward: svg('<path d="M12 4.5l5 5-5 5"/><path d="M16.6 9.5H8.5c-3 0-5 2-5 5.3v.7"/>'),
    back: svg('<path d="M12.5 4l-6 6 6 6"/>'),
    check: svg('<path d="M4.5 10.5l3.5 3.5 7.5-8"/>'),
    clip: svg('<path d="M14.5 9.5l-5.3 5.3a3.2 3.2 0 0 1-4.5-4.5l6-6a2.1 2.1 0 0 1 3 3l-5.8 5.8a1 1 0 0 1-1.5-1.5l5-5"/>'),
    file: svg('<path d="M5 2.5h6.5l3.5 3.5v11.5H5z"/><path d="M11.3 2.6V6.2h3.6"/>'),
    image: svg('<rect x="2.5" y="3.5" width="15" height="13" rx="1.5"/><circle cx="7" cy="8" r="1.5"/><path d="M3 15l4.5-4.5 3 3 2.5-2.5 4 4"/>'),
    spam: svg('<path d="M10 2.5l7 3v5c0 3.6-2.7 6.2-7 7.5-4.3-1.3-7-3.9-7-7.5v-5z"/><path d="M10 7v4M10 13.2v.3"/>'),
  };
  const AV = ['#e8590c', '#2b8a3e', '#1971c2', '#9c36b5', '#c2255c', '#0c8599', '#5f3dc4', '#a61e4d', '#2f9e44', '#e67700'];
  const BRANDS = ['Mailbox', 'Postal', 'Inkwell', 'Swiftmail', 'Letterbox', 'Courier', 'Quillpost', 'Pinemail', 'Harbor Mail', 'Nimbus'];
  const GROUP_BADGE = { pdf: 'PDF', doc: 'DOC', sheet: 'XLS', slides: 'PPT', image: 'IMG', zip: 'ZIP', video: 'MP4', audio: 'M4A' };
  const hashColor = (name) => {
    let h = 0;
    for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return AV[h % AV.length];
  };
  const initials = (name) => name.split(/\s+/).map((w) => w.charAt(0)).slice(0, 2).join('').toUpperCase();

  function ensureStyle() {
    if (document.getElementById('am-style')) return;
    const s = document.createElement('style');
    s.id = 'am-style';
    s.textContent = CSS;
    document.head.append(s);
  }


  function build(ctx, style) {
    const { util, rng, spec } = ctx;
    const ads = false;
    const fam = env.taskDef;
    const W = ctx.size.width;
    const H = ctx.size.height;
    const lr = rng.fork('layout');

    // ---- geometry
    const mx = 10;
    let appW = Math.min(1280, Math.floor(W - 2 * mx));
    if (appW > 780) appW = Math.max(780, Math.round(appW * lr.float(0.86, 1)));
    const rail = appW < 820 || lr.bool(0.15);
    const sideW = rail ? 58 : appW >= 1100 ? 184 : 164;
    const mainW = appW - sideW - 1;
    // ads: a banner under the top bar, sponsored rows pinned above the list, a column of ads right of the message.
    const stack = mainW < 700 || lr.bool(0.2);
    const adCol = ads && !stack && mainW >= 940;
    const adColW = adCol ? 176 : 0;
    const listW = stack ? mainW : ads ? Math.round(Math.max(400, Math.min(540, (mainW - adColW) * lr.float(0.54, 0.6))))
      : Math.round(Math.max(340, Math.min(520, mainW * lr.float(0.44, 0.52))));
    const readW = stack ? mainW : mainW - listW - adColW;
    const bannerH = ads ? 50 : 0;
    const sponsorK = ads ? (lr.bool(0.4) ? 2 : 1) : 0;
    const chromeH = 50 + 34 + 46 + 2 + bannerH;
    const rowH = Math.max(40, Math.min(lr.int(84, 104), Math.floor((H - 2 * mx - chromeH) / (spec.rows + sponsorK))));
    const appH = chromeH + (spec.rows + sponsorK) * rowH;
    const rowKind = rowH >= 76 ? 'tall' : rowH >= 56 ? 'medium' : 'compact';
    const align = lr.pick(['center', 'center', 'left', 'right']);
    const left = align === 'left' ? mx : align === 'right' ? W - mx - appW : (W - appW) / 2;
    const top = lr.bool(0.5) ? (H - appH) / 2 : Math.min(mx, (H - appH) / 2);

    // Row archive / delete icons: always shown on wide lists, else revealed on hover over the row's end.
    const hoverActs = listW < 440 || lr.bool(0.4);
    const app = util.el('div', 'am-app' + (stack ? ' am-stack' : '') + (hoverActs ? ' hover-acts' : ''), ctx.stage);
    Object.assign(app.style, { width: appW + 'px', height: appH + 'px', left: Math.round(left) + 'px', top: Math.round(top) + 'px' });

    const up = (a) => {
      ctx.update(fam.helpers.act(ctx.model, spec, a));
      paint(ctx.model);
    };
    const on = (el, a) => {
      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        up(typeof a === 'function' ? a(ev) : a);
      });
      return el;
    };
    const button = (cls, icon, label, parent, title) => {
      const b = util.el('button', cls, parent);
      b.type = 'button';
      b.innerHTML = icon || '';
      if (label) util.el('span', '', b, label);
      if (title) {
        b.title = title;
        b.setAttribute('aria-label', title);
      }
      return b;
    };
    const reg = { list: new Map(), read: new Map(), fixed: new Map(), head: new Map(), status: new Map(), modal: new Map() };

    // ---- top bar
    const topEl = util.el('div', 'am-top', app);
    const brand = util.el('div', 'am-brand', topEl);
    brand.innerHTML = I.logo;
    if (appW >= 720) util.el('span', '', brand, rng.pick(BRANDS));
    // ads: the Compose button heads the sidebar (unless it is a rail), else it sits in the top bar.
    const composeInSide = ads && !rail;
    const newBtn = on(button('am-new', I.pen, 'Compose', composeInSide ? null : topEl), { compose: true });
    reg.fixed.set('c:new', newBtn);
    const search = util.el('label', 'am-search', topEl);
    search.innerHTML = I.search;
    const sInput = util.el('input', '', search);
    sInput.type = 'text';
    sInput.placeholder = rng.pick(['Search mail', 'Search', 'Search messages', 'Search in mail']);
    sInput.spellcheck = false;
    sInput.autocomplete = 'off';
    sInput.dataset.role = 'search';
    const sField = env.ui.textField(sInput, { value: ctx.model.query || '', label: 'search', onInput: (v) => up({ query: v }) });
    const sx = on(button('am-sx', '', '×', search, 'Clear search'), { query: '' });
    sx.textContent = '×';
    reg.fixed.set('search', sInput);
    const me = util.el('div', 'am-me', topEl, initials(spec.me.name));
    me.title = `${spec.me.name} <${spec.me.addr}>`;

    // ---- body: sidebar + main
    const body = util.el('div', 'am-body', app);
    const side = util.el('nav', 'am-side' + (rail ? ' am-rail' : ''), body);
    side.style.width = sideW + 'px';
    if (composeInSide) {
      newBtn.classList.add('wide');
      side.append(newBtn);
    }
    const sideH = appH - 50 - 34 - 2 - bannerH - (composeInSide ? 44 : 0);
    const custom = spec.folders;
    let builtins = [['inbox', 'Inbox', I.inbox], ['starred', 'Starred', I.star], ['important', 'Important', I.imp],
      ['sent', 'Sent', I.sent, true], ['drafts', 'Drafts', I.draft, true], ['archive', 'Archive', I.archive],
      ...(spec.spam ? [['spam', 'Spam', I.spam]] : []), ['trash', 'Trash', I.trash]];
    const fit = (k) => Math.floor((sideH - 12 - (rail ? 14 : 24)) / k);
    let itemH = fit(builtins.length + custom.length);
    if (itemH < 26) {
      builtins = builtins.filter((b) => !b[3]);
      itemH = fit(builtins.length + custom.length);
    }
    itemH = Math.max(22, Math.min(rail ? 38 : 34, itemH));
    const folders = {};
    const addFolder = (key, label, icon, deco) => {
      const f = util.el('div', 'am-folder' + (deco ? ' deco' : ''), side);
      f.style.height = itemH + 'px';
      if (icon) f.innerHTML = icon;
      else {
        const d = util.el('span', 'am-dot', f, label.charAt(0).toUpperCase());
        d.style.background = hashColor(label);
      }
      util.el('span', 'lb', f, label);
      f.title = label;
      folders[key] = { el: f, n: util.el('span', 'n', f) };
      if (!deco) {
        on(f, { view: key });
        reg.fixed.set(`f:${key}`, f);
      }
    };
    for (const [key, label, icon, deco] of builtins) addFolder(key, label, icon, deco);
    util.el('div', 'am-flabel', side, 'Folders');
    for (const f of custom) addFolder(f, f, null, false);

    const main = util.el('div', 'am-main', body);
    const pane = util.el('section', 'am-listpane', main);
    if (!stack) pane.style.width = listW + 'px';
    const lhead = util.el('div', 'am-lhead', pane);
    const lb = util.el('div', 'am-lb', pane);
    lb.style.height = spec.rows * rowH + 'px';
    const read = util.el('section', 'am-read', main);
    const labels = readW >= 600;
    const status = util.el('div', 'am-status', app);
    const modalHost = util.el('div', '', app);

    // ---- list header: select-all + title / bulk toolbar
    const cbw = util.el('span', 'cbw', lhead);
    const all = util.el('input', '', cbw);
    all.type = 'checkbox';
    all.title = 'Select all';
    all.dataset.role = 'select-all';
    all.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const order = fam.helpers.listOrder(ctx.model, spec);
      up({ checkAll: !(order.length && order.every((i) => ctx.model.checked.includes(i))) });
    });
    reg.fixed.set('cball', all);
    const headTitle = util.el('b', '', lhead);
    const bulkBar = util.el('div', 'am-bulk', lhead);
    const bulkLabels = listW >= 620;
    const bulkOps = [['archive', I.archive, 'Archive'], ['trash', I.trash, 'Delete'], ['read', I.read, 'Mark as read'],
      ['unread', I.unread, 'Mark as unread'], ['star', I.star, 'Star']];
    for (const [k, icon, label] of bulkOps) {
      const b = on(button('am-tb' + (k === 'trash' ? ' del' : ''), icon, bulkLabels ? label.replace('Mark as ', 'Mark ') : '', bulkBar, label), { bulk: k });
      if (!bulkLabels) b.classList.add('ic');
      reg.head.set(`bulk:${k}`, b);
    }
    if (!bulkLabels) bulkBar.classList.add('am-icons');
    const cnt = util.el('span', 'cnt', bulkBar);
    const range = util.el('span', 'rg', lhead);

    // ---- inbox list (rebuilt whenever the set of rows changes)
    let list = null;
    let lbx = null;
    let rowEls = {};
    let listKey = null;

    function attBadge(e, parent) {
      if (!e.att.length) return;
      const c = util.el('span', 'am-clip', parent);
      c.innerHTML = I.clip;
      util.el('span', '', c, GROUP_BADGE[e.att[0].group] || '');
      c.title = e.att.map((a) => a.file).join(', ');
    }
    const snippet = (e) => {
      const parts = e.body.split('\n\n');
      return (parts[1] || parts[0]).replace(/\s+/g, ' ');
    };

    function buildList(m) {
      lb.replaceChildren();
      reg.list.clear();
      list = util.el('div', 'am-list', lb);
      list.dataset.role = 'listbox';
      const track = util.el('div', 'am-track', lb);
      track.dataset.role = 'scrollbar';
      const thumb = util.el('div', 'am-thumb', track);
      thumb.dataset.role = 'thumb';
      const order = fam.helpers.listOrder(m, spec);
      rowEls = {};
      for (const i of order) {
        const e = spec.emails[i];
        const row = util.el('div', `am-row ${rowKind}`, list);
        row.dataset.role = 'email';
        row.style.height = rowH + 'px';
        const gut = util.el('div', 'am-gut', row);
        const cw = util.el('span', 'cbw', gut);
        const cb = util.el('input', '', cw);
        cb.type = 'checkbox';
        cb.title = 'Select';
        cb.dataset.role = 'row-check';
        cb.addEventListener('click', (ev) => {
          ev.stopPropagation();
          up({ check: i, range: ev.shiftKey });
        });
        cw.addEventListener('click', (ev) => ev.stopPropagation());
        const st = on(util.el('span', 'am-ico star', gut), { flag: [i, 'star'] });
        st.innerHTML = I.star;
        st.title = 'Star';
        const im = on(util.el('span', 'am-ico imp', gut), { flag: [i, 'important'] });
        im.innerHTML = I.imp;
        im.title = 'Mark as important';
        const txt = util.el('div', 'am-txt', row);
        const l1 = util.el('div', 'am-l1', txt);
        util.el('span', 'am-from', l1, e.name);
        const subj = util.el('span', 'am-subj', null, e.subject);
        const snip = util.el('span', 'am-snip', null, snippet(e));
        if (rowKind === 'tall') {
          attBadge(e, l1);
          util.el('span', 'am-time', l1, e.time);
          txt.append(subj);
          subj.style.display = 'block';
          const l2 = util.el('div', 'am-l2', txt);
          if (e.att.length) {
            const chips = util.el('div', 'am-chips', l2);
            for (const a of e.att.slice(0, 2)) {
              const c = util.el('span', 'am-chip', chips);
              c.innerHTML = a.group === 'image' ? I.image : I.file;
              util.el('span', '', c, a.file);
            }
          } else l2.append(snip);
        } else if (rowKind === 'medium') {
          attBadge(e, l1);
          util.el('span', 'am-time', l1, e.time);
          const l2 = util.el('div', 'am-l2', txt);
          l2.append(subj, snip);
        } else {
          const l2 = util.el('div', 'am-l2', txt);
          l2.append(subj, snip);
          attBadge(e, l2);
          util.el('span', 'am-time', l2, e.time);
        }
        const ract = util.el('div', 'am-ract', row);
        if (m.box[i] !== 'archive' && m.box[i] !== 'trash' && m.box[i] !== 'spam') {
          const ar = on(util.el('span', 'am-ico arch', ract), { move: [[i], 'archive'] });
          ar.innerHTML = I.archive;
          ar.title = 'Archive';
          reg.list.set(`ri:${i}:archive`, ar);
        }
        if (m.box[i] !== 'trash') {
          const tr = on(util.el('span', 'am-ico trash', ract), { move: [[i], 'trash'] });
          tr.innerHTML = I.trash;
          tr.title = 'Delete';
          reg.list.set(`ri:${i}:delete`, tr);
        }
        for (const el of row.querySelectorAll('.am-ico')) el.dataset.role = 'icon';
        reg.list.set(`ri:${i}:star`, st);
        reg.list.set(`ri:${i}:important`, im);
        reg.list.set(`cb:${i}`, cb);
        rowEls[i] = { row, cb, st, im };
      }
      if (!order.length) {
        const v = m.view || 'inbox';
        util.el('div', 'am-empty-list', list, m.query ? `No messages match "${m.query}"` : `${fam.helpers.viewLabel(v)} is empty`);
      }
      lbx = env.ui.listbox(list, {
        label: 'inbox',
        options: order.map((i) => [i, rowEls[i].row]),
        onChange(values, v) { up({ open: v }); },
        onScroll(idx) {
          const s = Math.round(idx * 1000) / 1000;
          if (s !== ctx.model.scroll) {
            ctx.update({ ...ctx.model, scroll: s });
            paintRange(ctx.model);
          }
        },
        scrollbar: { track, thumb, pad: 2, minThumb: 30, onDrag: (d) => thumb.classList.toggle('dragging', d) },
      });
      track.classList.toggle('off', order.length <= spec.rows);
      lbx.set({ scroll: m.scroll || 0 });
      const s = Math.round(lbx.scrollIndex() * 1000) / 1000;
      if (s !== (m.scroll || 0) && listKey !== null) ctx.update({ ...ctx.model, scroll: s });
    }

    function paintRange(m) {
      const n = fam.helpers.listOrder(m, spec).length;
      if (!n) {
        range.textContent = '0 messages';
        return;
      }
      const a = Math.min(n, Math.floor((m.scroll || 0) + 0.5) + 1);
      const b = Math.min(n, a + spec.rows - 1);
      range.textContent = `${a}–${b} of ${n}`;
    }

    function paintList(m) {
      const order = fam.helpers.listOrder(m, spec);
      const key = JSON.stringify([m.view, m.query, order, order.map((i) => m.box[i])]);
      if (key !== listKey) {
        buildList(m);
        listKey = key;
      }
      for (const i of order) {
        const r = rowEls[i];
        r.row.classList.toggle('open', m.open === i);
        r.row.classList.toggle('unread', !!m.flags[i].unread);
        r.row.classList.toggle('checked', m.checked.includes(i));
        r.cb.checked = m.checked.includes(i);
        r.st.classList.toggle('on', !!m.flags[i].starred);
        r.im.classList.toggle('on', !!m.flags[i].important);
      }
      paintRange(m);
      // header: title or bulk toolbar
      const n = m.checked.length;
      all.checked = !!order.length && order.every((i) => m.checked.includes(i));
      all.indeterminate = n > 0 && !all.checked;
      headTitle.hidden = n > 0;
      bulkBar.hidden = n === 0;
      range.hidden = n > 0;
      headTitle.textContent = m.query ? `Search results` : fam.helpers.viewLabel(m.view || 'inbox');
      cnt.textContent = `${n} selected`;
      if (n > 0 && lhead.scrollWidth > lhead.clientWidth + 1) bulkBar.classList.add('am-icons');
      if (n > 0 && lhead.scrollWidth > lhead.clientWidth + 1) cnt.hidden = true;
      // sidebar
      const live = spec.emails.map((_, i) => i);
      const count = (f) => live.filter(f).length;
      const setN = (k, v) => { if (folders[k]) folders[k].n.textContent = v ? String(v) : ''; };
      setN('inbox', count((i) => m.box[i] === 'inbox' && m.flags[i].unread));
      setN('starred', count((i) => m.box[i] !== 'trash' && m.box[i] !== 'spam' && m.flags[i].starred));
      setN('important', count((i) => m.box[i] !== 'trash' && m.box[i] !== 'spam' && m.flags[i].important));
      setN('spam', count((i) => m.box[i] === 'spam'));
      setN('sent', m.sent.length);
      setN('drafts', m.compose ? 1 : 0);
      setN('archive', count((i) => m.box[i] === 'archive'));
      setN('trash', count((i) => m.box[i] === 'trash'));
      for (const f of spec.folders) setN(f, count((i) => m.box[i] === f));
      for (const [k, f] of Object.entries(folders)) f.el.classList.toggle('on', k === (m.view || 'inbox'));
      if (sField.get() !== (m.query || '')) sField.set(m.query || '');
      sx.hidden = !m.query;
    }

    // ---- reading pane (rebuilt when what it shows changes; toggles repaint in place)
    let readKey = null;
    let comp = null; // { fields: { k: textField } }
    let msgFlags = null;
    let menuEl = null;
    let moveBtn = null;

    function buildRead(m) {
      read.replaceChildren();
      reg.read.clear();
      comp = null;
      msgFlags = null;
      menuEl = null;
      moveBtn = null;
      const backBtn = (parent) => {
        if (!stack) return;
        const b = on(button('am-tb back', I.back, '', parent, 'Back to list'), { back: true });
        reg.read.set('back', b);
      };
      if (m.compose) {
        const c = m.compose;
        const box = util.el('div', 'am-comp', read);
        const head = util.el('div', 'am-chead', box);
        backBtn(head);
        util.el('span', '', head, c.mode === 'new' ? 'New message' : c.mode === 'reply' ? (c.cc ? 'Reply all' : 'Reply') : 'Forward');
        const x = on(button('am-x', '', '', head, 'Discard draft'), { discard: true });
        x.textContent = '×';
        const fields = {};
        const row = (k, label, ph) => {
          const r = util.el('div', 'am-crow', box);
          util.el('label', '', r, label);
          const inp = util.el('input', '', r);
          inp.type = 'text';
          inp.spellcheck = false;
          inp.autocomplete = 'off';
          inp.placeholder = ph;
          inp.dataset.role = k;
          fields[k] = env.ui.textField(inp, { value: c[k] || '', label: k, onInput: (v) => setField(k, v) });
          reg.read.set(`fld:${k}`, inp);
        };
        row('to', 'To', 'Recipients');
        row('cc', 'Cc', '');
        if (c.mode === 'new') row('subject', 'Subject', 'Subject');
        else {
          const r = util.el('div', 'am-crow', box);
          util.el('label', '', r, 'Subject');
          util.el('span', 'subj', r, c.subject);
        }
        const bodyEl = util.el('textarea', '', box);
        bodyEl.spellcheck = false;
        bodyEl.placeholder = c.mode === 'reply' ? 'Write your reply…' : 'Message';
        bodyEl.dataset.role = 'body';
        fields.body = env.ui.textField(bodyEl, { value: c.body || '', label: 'body', onInput: (v) => setField('body', v) });
        reg.read.set('fld:body', bodyEl);
        const f = util.el('div', 'am-cfoot', box);
        const send = on(button('am-btn primary', I.sent, 'Send', f), { send: true });
        const discard = on(button('am-link', '', 'Discard', f), { discard: true });
        reg.read.set('c:send', send);
        reg.read.set('c:discard', discard);
        comp = { fields };
        return;
      }
      if (m.open === null || m.open === undefined) {
        const b = util.el('div', 'am-blank', read);
        b.innerHTML = I.logo;
        util.el('div', '', b, 'Select a message to read');
        return;
      }
      const i = m.open;
      const e = spec.emails[i];
      const bar = util.el('div', 'am-bar' + (labels ? '' : ' am-icons'), read);
      backBtn(bar);
      const OPS = {
        archive: ['', I.archive, 'Archive'],
        delete: ['del', I.trash, 'Delete'],
        inbox: ['', I.restore, m.box[i] === 'trash' ? 'Restore' : m.box[i] === 'spam' ? 'Not spam' : 'Move to Inbox'],
        spam: ['', I.spam, 'Report spam'],
        move: ['', I.moveTo, 'Move to'],
        unread: ['', I.unread, 'Mark unread'],
        star: ['star', I.star, 'Star'],
        important: ['imp', I.imp, 'Important'],
      };
      for (const op of fam.helpers.toolbarOps(m, i)) {
        const [cls, icon, label] = OPS[op];
        const b = button('am-tb ' + cls, icon, label, bar, label);
        if (op === 'move') {
          moveBtn = b;
          on(b, () => ({ menu: ctx.model.menu === 'move' ? null : 'move' }));
        } else if (op === 'delete') on(b, { move: [[i], 'trash'] });
        else if (op === 'archive') on(b, { move: [[i], 'archive'] });
        else if (op === 'inbox') on(b, { move: [[i], 'inbox'] });
        else if (op === 'spam') on(b, { move: [[i], 'spam'] });
        else if (op === 'unread') on(b, { mark: [[i], true] });
        else on(b, { flag: [i, op] });
        reg.read.set(`a:${op}`, b);
        if (op === 'star') msgFlags = { ...(msgFlags || {}), st: b };
        if (op === 'important') msgFlags = { ...(msgFlags || {}), im: b };
      }
      util.el('span', 'sp', bar);
      if (labels || stack) util.el('span', 'when', bar, e.time);
      // Labels that do not fit fall back to icons with tooltips.
      if (bar.scrollWidth > bar.clientWidth + 1) {
        bar.classList.add('am-icons');
        const w = bar.querySelector('.when');
        if (w && bar.scrollWidth > bar.clientWidth + 1) w.remove();
      }
      if (moveBtn) {
        menuEl = util.el('div', 'am-menu', bar);
        menuEl.hidden = true;
        menuEl.setAttribute('role', 'menu');
        util.el('div', 'hd', menuEl, 'Move to');
        for (const f of spec.folders) {
          const it = util.el('div', 'am-mi', menuEl);
          it.innerHTML = I.folder;
          util.el('span', '', it, f);
          it.setAttribute('role', 'menuitem');
          on(it, { move: [[i], f] });
          reg.read.set(`mt:${f}`, it);
        }
      }
      const msg = util.el('div', 'am-msg', read);
      util.el('h2', '', msg, e.subject);
      const who = util.el('div', 'am-who', msg);
      const av = util.el('div', 'am-av', who, initials(e.name));
      av.style.background = hashColor(e.name);
      const wd = util.el('div', '', who);
      const nm = util.el('div', 'nm', wd, e.name);
      util.el('small', '', nm, `<${e.addr}>`);
      util.el('div', 'to', wd, e.cc.length ? `to me, cc: ${e.cc.map((p) => p.name).join(', ')}` : 'to me');
      if (e.att.length) {
        const chips = util.el('div', 'am-chips', msg);
        for (const a of e.att) {
          const c = util.el('span', 'am-chip', chips);
          c.innerHTML = a.group === 'image' ? I.image : I.file;
          util.el('span', '', c, a.file);
          util.el('small', '', c, a.size);
          c.title = a.file;
        }
      }
      util.el('div', 'am-text', msg, e.body);
      for (const s of m.sent.filter((x) => x.of === i)) {
        const note = util.el('div', 'am-note', msg);
        note.innerHTML = I.check;
        const to = String(s.to || '').trim() || '(no recipient)';
        util.el('span', '', note, s.mode === 'reply' ? `Reply sent to ${to}${s.cc && s.cc.trim() ? `, cc ${s.cc.trim()}` : ''}` : `Forwarded to ${to}`);
      }
      const acts = util.el('div', 'am-acts', read);
      reg.read.set('a:reply', on(button('am-btn', I.reply, 'Reply', acts), { reply: i }));
      reg.read.set('a:replyall', on(button('am-btn', I.replyAll, 'Reply all', acts), { reply: i, all: true }));
      reg.read.set('a:forward', on(button('am-btn', I.forward, 'Forward', acts), { forward: i }));
    }

    function setField(k, v) {
      const cur = ctx.model.compose;
      if (!cur) return;
      ctx.update(fam.helpers.act(ctx.model, spec, { field: [k, v] }));
      paintList(ctx.model);
    }

    function paintRead(m) {
      const shown = m.compose ? ['c', m.compose.mode, m.compose.of] : m.open !== null && m.open !== undefined ? ['m', m.open, m.box[m.open], m.sent.length] : ['b'];
      const key = JSON.stringify(shown);
      if (key !== readKey) {
        readKey = key;
        buildRead(m);
      } else if (comp && m.compose) {
        for (const [k, f] of Object.entries(comp.fields)) if (f.get() !== (m.compose[k] || '')) f.set(m.compose[k] || '');
      }
      if (msgFlags && m.open !== null && m.open !== undefined) {
        const f = m.flags[m.open];
        if (msgFlags.st) {
          msgFlags.st.classList.toggle('on', !!f.starred);
          msgFlags.st.querySelector('span').textContent = f.starred ? 'Starred' : 'Star';
        }
        if (msgFlags.im) msgFlags.im.classList.toggle('on', !!f.important);
      }
      if (moveBtn) moveBtn.classList.toggle('pressed', m.menu === 'move');

      if (menuEl) {
        const show = m.menu === 'move';
        if (show && menuEl.hidden) {
          menuEl.hidden = false;
          const bar = menuEl.parentElement;
          const br = bar.getBoundingClientRect();
          const r = moveBtn.getBoundingClientRect();
          const w = menuEl.getBoundingClientRect().width || 190;
          menuEl.style.left = Math.max(4, Math.min(br.width - w - 4, r.left - br.left)) + 'px';
          menuEl.style.top = (r.bottom - br.top + 4) + 'px';
        } else if (!show) menuEl.hidden = true;
      }
    }

    // ---- status bar (Undo toast or storage meter) and the confirm dialog
    const used = lr.int(12, 78);
    let statusKey = null;
    function paintStatus(m) {
      const t = m.toast;
      const key = JSON.stringify(t);
      if (key === statusKey) return;
      statusKey = key;
      status.replaceChildren();
      reg.status.clear();
      if (t) {
        const box = util.el('div', 'am-toast', status);
        const n = t.kind === 'send' ? 1 : t.of.length;
        const what = n > 1 ? `${n} conversations` : 'Conversation';
        const text = t.kind === 'send' ? 'Message sent.' : t.kind === 'trash' ? `${what} moved to Trash.`
          : t.kind === 'archive' ? `${what} archived.` : t.kind === 'inbox' ? `${what} moved to Inbox.` : t.kind === 'spam' ? `${what} reported as spam.` : `${what} moved to ${t.kind}.`;
        util.el('span', '', box, text);
        reg.status.set('t:undo', on(button('', '', 'Undo', box), { undo: true }));
        const cl = on(button('cl', '', '', box, 'Dismiss'), { toastClose: true });
        cl.textContent = '×';
        reg.status.set('t:close', cl);
      }
      const u = util.el('div', 'used', status);
      if (appW >= 700 || !t) {
        u.style.setProperty('--used', used + '%');
        util.el('i', '', u);
        util.el('span', '', u, `${(used * 0.15).toFixed(1)} GB of 15 GB used`);
      }
    }
    let modalKey = null;
    function paintModal(m) {
      const key = JSON.stringify(m.confirm);
      if (key === modalKey) return;
      modalKey = key;
      modalHost.replaceChildren();
      reg.modal.clear();
      if (!m.confirm) return;
      const back = util.el('div', 'am-modal', modalHost);
      back.addEventListener('click', (ev) => {
        if (ev.target === back) up({ confirm: false });
      });
      const dlg = util.el('div', 'am-dlg', back);
      dlg.setAttribute('role', 'dialog');
      const n = m.confirm.of.length;
      util.el('h3', '', dlg, n > 1 ? `Delete ${n} conversations?` : 'Delete this conversation?');
      util.el('p', '', dlg, n > 1 ? 'They will be moved to Trash.' : 'It will be moved to Trash.');
      const row = util.el('div', 'row', dlg);
      reg.modal.set('cf:cancel', on(button('am-btn', '', 'Cancel', row), { confirm: false }));
      reg.modal.set('cf:ok', on(button('am-btn danger', '', 'Delete', row), { confirm: true }));
    }

    function paint(m) {
      // List-then-detail: the list hides while a message or draft is shown; when it comes back, restore its
      // scroll position from the model (a hidden pane loses it).
      const detail = stack && !fam.helpers.listShown({ ...m, stack: true });
      const was = app.classList.contains('am-detail');
      app.classList.toggle('am-detail', detail);
      paintList(m);
      if (was && !detail && lbx) {
        lbx.set({ scroll: ctx.model.scroll || 0 });
        const s = Math.round(lbx.scrollIndex() * 1000) / 1000;
        if (s !== (ctx.model.scroll || 0)) ctx.update({ ...ctx.model, scroll: s });
        paintRange(ctx.model);
      }
      paintRead(m);
      paintStatus(m);
      paintModal(m);
    }

    paint(ctx.model);
    // Mirror layout facts the oracle needs (row height for wheel steps, list-then-detail layout).
    if (ctx.model.rowPx !== rowH || !!ctx.model.stack !== stack) {
      ctx.update({ ...ctx.model, rowPx: rowH, stack });
      paint(ctx.model);
    }

    const center = (el) => {
      if (!el || !el.isConnected) return null;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return null;
      return [r.left + r.width / 2, r.top + r.height / 2];
    };
    const find = (k) => {
      for (const mp of Object.values(reg)) if (mp.has(k)) return mp.get(k);
      return null;
    };
    return {
      app,
      sync: (m) => paint(m),
      outside(e) {
        if (!menuEl || !ctx.model.menu) return;
        if (menuEl.contains(e.target) || (moveBtn && moveBtn.contains(e.target))) return;
        up({ menu: null });
      },
      locate(t) {
        if (t.row !== undefined) return lbx.locateOption(t.row);
        if (t.thumb !== undefined) return lbx.locateThumb();
        if (t.scroll !== undefined) return lbx.locateThumbFor(t.scroll);
        if (t.list) return center(list);
        if (t.search) return center(sInput);
        if (t.rowIcon) return center(find(`ri:${t.rowIcon[0]}:${t.rowIcon[1]}`));
        if (t.check !== undefined) return center(find(`cb:${t.check}`));
        if (t.checkAll) return center(all);
        if (t.bulk) return center(find(`bulk:${t.bulk}`));
        if (t.folder !== undefined) {
          const el = find(`f:${t.folder}`);
          if (el) {
            // A folder scrolled out of a crowded sidebar: bring it into the nav's view first.
            const sr = side.getBoundingClientRect();
            const r = el.getBoundingClientRect();
            if (r.top < sr.top || r.bottom > sr.bottom) side.scrollTop += r.top < sr.top ? r.top - sr.top - 4 : r.bottom - sr.bottom + 4;
          }
          return center(el);
        }
        if (t.action) return center(find(`a:${t.action}`));
        if (t.moveTo) return center(find(`mt:${t.moveTo}`));
        if (t.back) return center(find('back'));
        if (t.field) return center(find(`fld:${t.field}`));
        if (t.compose) return center(find(`c:${t.compose}`));
        if (t.confirm) return center(find(`cf:${t.confirm}`));
        if (t.toast) return center(find(`t:${t.toast}`));
        return null;
      },
    };
  }

  const ALL = ['delete', 'star', 'important', 'reply', 'forward', 'star-reply', 'nl',
    'archive', 'move', 'unread', 'bulk', 'reply-all', 'compose', 'search', 'attachment', 'undo'];

  let view = null;
  let listening = false;

  env.widget({
    task: 'use-email',
    site: 'mock-inbox',
    name: 'webmail',
    split: 'heldout',
    scenarios: ALL,
    traits: { search: true },

    render(ctx) {
      ensureStyle();
      if (!listening) {
        listening = true;
        document.addEventListener('pointerdown', (e) => view && view.outside(e), true);
        document.addEventListener('keydown', (e) => view && view.key && view.key(e));
      }
      view = build(ctx, 'mail');
      view.app.classList.add('rm-app');
      if (ctx.rng.fork('rilook').bool(0.4)) view.app.classList.add('rm-soft');
      return { anchors: [view.app], sync: (m) => view.sync(m) };
    },

    locate(t) {
      const p = view && view.locate(t);
      if (!p) throw new Error(`use-email/webmail cannot locate ${JSON.stringify(t)}`);
      return p;
    },
  });
})();
