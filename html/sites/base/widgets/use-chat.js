/* base / use-chat/classic: team workspace and meeting host console. All visuals use reference
 * tokens, including modal menus and participant tiles. Native fields, synchronous wheel panes and
 * env.ui.track for room assignment. Background history, documents, project navigation and meeting chat
 * are unscored context. Icons are inline SVG. Only the fixed app frame is an anchor; locate never scrolls.
 */
(function () {
  'use strict';
  let view;
  const CSS = `
  .ch-app { position:absolute; inset:10px; display:flex; flex-direction:column; overflow:hidden; border:1px solid var(--line); border-radius:9px; background:var(--panel); color:var(--fg); font:13px/1.4 "Segoe UI",system-ui,sans-serif; box-shadow:0 6px 20px #0001; }
  .ch-app * { box-sizing:border-box; }
  .ch-app button { font:inherit; cursor:pointer; color:inherit; border:1px solid var(--line); background:var(--panel); border-radius:5px; padding:5px 9px; }
  .ch-app button:hover { background:color-mix(in srgb,var(--accent) 12%,var(--panel)); }
  .ch-app button:focus-visible, .ch-app input:focus, .ch-app textarea:focus { outline:2px solid var(--accent); outline-offset:1px; }
  .ch-app button.ch-primary { background:var(--accent); border-color:var(--accent); color:white; }
  .ch-app button.ch-on { background:color-mix(in srgb,var(--accent) 15%,var(--panel)); color:var(--accent); border-color:var(--accent); }
  .ch-top { height:41px; flex:none; display:flex; align-items:center; gap:14px; padding:0 15px; background:color-mix(in srgb,var(--accent) 12%,var(--panel)); border-bottom:1px solid var(--line); }
  .ch-brand { font-weight:800; font-size:16px; letter-spacing:-.3px; }
  .ch-search { margin:auto; width:46%; border:1px solid var(--line); border-radius:5px; padding:3px 12px; color:var(--muted); background:var(--panel); font-size:12px; }
  .ch-body { display:flex; flex:1; min-height:0; }
  .ch-nav { flex:none; padding:14px 9px; width:var(--ch-nav); background:var(--bg); border-right:1px solid var(--line); overflow:hidden; }
  .ch-workspace { font-weight:750; font-size:14px; margin:0 6px 14px; overflow-wrap:anywhere; }
  .ch-navitem { padding:6px 9px; border-radius:5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .ch-navitem.active { color:var(--accent); background:color-mix(in srgb,var(--accent) 12%,var(--bg)); font-weight:650; }
  .ch-group { color:var(--muted); margin:14px 9px 4px; font-size:11px; text-transform:uppercase; letter-spacing:.04em; }
  .ch-main { position:relative; display:flex; flex:1; flex-direction:column; min-width:0; min-height:0; overflow:hidden; }
  .ch-head { flex:none; min-height:58px; display:flex; align-items:center; gap:8px; padding:9px 15px; border-bottom:1px solid var(--line); }
  .ch-head h2 { margin:0; font-size:17px; line-height:1.3; }
  .ch-head p { margin:2px 0 0; font-size:11px; color:var(--muted); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:380px; }
  .ch-head>div:first-child { min-width:0; flex:1; }
  .ch-muted { color:var(--muted); font-size:11px; }
  .ch-conversation { display:flex; flex:1; min-height:0; }
  .ch-channel { display:flex; flex:1; flex-direction:column; min-width:0; }
  .ch-scroll { min-height:0; overflow:auto; overscroll-behavior:contain; scrollbar-width:thin; scrollbar-color:var(--line) transparent; }
  .ch-messages { flex:1; padding:0 0 8px; }
  .ch-day { display:flex; align-items:center; gap:8px; justify-content:center; margin:12px 15px 5px; color:var(--muted); font-size:11px; }
  .ch-day:before,.ch-day:after { content:''; height:1px; background:var(--line); flex:1; }
  .ch-message { display:flex; gap:9px; padding:9px 13px; }
  .ch-message:hover { background:var(--bg); }
  .ch-avatar { flex:none; width:31px; height:31px; border-radius:7px; display:flex; align-items:center; justify-content:center; background:color-mix(in srgb,var(--accent) 16%,var(--panel)); color:var(--accent); font-weight:750; }
  .ch-messagebody { min-width:0; flex:1; }
  .ch-meta { display:flex; align-items:center; gap:7px; }
  .ch-meta strong { font-size:12px; }
  .ch-text { margin:3px 0 6px; overflow-wrap:anywhere; user-select:text; }
  .ch-actions { display:flex; align-items:center; flex-wrap:wrap; gap:5px; }
  .ch-actions button { padding:2px 6px; font-size:11px; display:inline-flex; align-items:center; gap:4px; }
  .ch-actions .ch-threadlink { border-color:transparent; color:var(--accent); }
  .ch-pin { color:var(--accent); font-size:10px; margin-bottom:3px; }
  .ch-compose { flex:none; margin:7px 12px 10px; border:1px solid var(--line); border-radius:7px; overflow:hidden; }
  .ch-format { background:var(--bg); padding:3px 9px; color:var(--muted); font-size:11px; letter-spacing:3px; }
  .ch-app input,.ch-app textarea { color:var(--fg); background:var(--panel); font:inherit; user-select:text; border:1px solid var(--line); border-radius:5px; padding:7px; width:100%; }
  .ch-compose textarea { border:0; resize:none; display:block; height:49px; border-radius:0; padding:8px; }
  .ch-sendrow { display:flex; justify-content:space-between; align-items:center; gap:5px; padding:4px 7px; }
  .ch-thread { display:flex; flex-direction:column; width:44%; min-width:245px; max-width:360px; border-left:1px solid var(--line); background:var(--panel); }
  .ch-threadhead { display:flex; align-items:center; justify-content:space-between; padding:9px 12px; border-bottom:1px solid var(--line); }
  .ch-threadcontent { flex:1; padding:11px; }
  .ch-threadcontent blockquote { border-left:3px solid var(--line); margin:8px 0; padding:0 0 0 9px; overflow-wrap:anywhere; }
  .ch-own { background:var(--bg); border-radius:6px; margin:9px 0; padding:8px; overflow-wrap:anywhere; }
  .ch-status { flex:none; display:flex; align-items:center; flex-wrap:wrap; gap:6px 19px; min-height:26px; border-top:1px solid var(--line); padding:4px 12px; background:var(--bg); color:var(--muted); font-size:10px; }
  .ch-status span:last-child { margin-left:auto; }
  .ch-shade { position:absolute; inset:0; z-index:10; background:#0004; display:flex; justify-content:center; align-items:center; padding:10px; }
  .ch-modal { background:var(--panel); border:1px solid var(--line); border-radius:9px; box-shadow:0 16px 40px #0003; display:flex; flex-direction:column; width:440px; max-width:100%; max-height:100%; overflow:hidden; }
  .ch-modalhead { display:flex; justify-content:space-between; align-items:center; gap:12px; padding:11px 15px; border-bottom:1px solid var(--line); }
  .ch-modalhead h3 { margin:0; font-size:16px; }
  .ch-modalbody { padding:12px 15px; min-height:0; overflow:auto; }
  .ch-modalbody p { margin:0 0 10px; }
  .ch-modalfoot { padding:9px 15px; border-top:1px solid var(--line); display:flex; justify-content:flex-end; gap:8px; flex:none; }
  .ch-tabs { display:flex; border-bottom:1px solid var(--line); gap:10px; padding:6px 15px; }
  .ch-tabs button { border:0; border-radius:0; }
  .ch-tabs button.ch-on { border-bottom:2px solid var(--accent); }
  .ch-fieldlabel { display:block; margin:0 0 4px; font-weight:650; }
  .ch-field { margin-bottom:12px; }
  .ch-person { display:flex; align-items:center; gap:9px; padding:7px 0; border-bottom:1px solid var(--line); }
  .ch-person>div:nth-child(2) { flex:1; min-width:0; }
  .ch-person b { display:block; overflow-wrap:anywhere; }
  .ch-person button { font-size:11px; }
  .ch-emoji { display:grid; grid-template-columns:repeat(3,1fr); gap:9px; }
  .ch-emoji button { font-size:24px; display:flex; flex-direction:column; align-items:center; padding:10px 3px; }
  .ch-emoji small { font-size:10px; }
  .ch-menu { display:flex; flex-direction:column; gap:7px; }
  .ch-meeting { display:flex; flex:1; flex-direction:column; min-height:0; background:var(--bg); }
  .ch-tiles { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); grid-auto-rows:minmax(85px,1fr); gap:8px; padding:12px; flex:1; min-height:0; overflow:auto; }
  .ch-tile { position:relative; border:1px solid var(--line); border-radius:8px; background:var(--panel); display:flex; align-items:center; justify-content:center; min-height:85px; }
  .ch-tile .ch-avatar { width:44px; height:44px; font-size:17px; border-radius:50%; }
  .ch-tilelabel { position:absolute; bottom:6px; left:8px; right:8px; font-size:10px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .ch-tile.hand { border:2px solid var(--accent); }
  .ch-sharing { padding:5px 12px; background:color-mix(in srgb,var(--accent) 15%,var(--panel)); color:var(--accent); text-align:center; }
  .ch-controls { display:flex; justify-content:center; flex-wrap:wrap; gap:7px; padding:10px; border-top:1px solid var(--line); background:var(--panel); }
  .ch-controls button { display:flex; flex-direction:column; align-items:center; min-width:73px; padding:6px; font-size:11px; }
  .ch-controls i { font-size:19px; font-style:normal; }
  .ch-window { padding:14px; border:1px solid var(--line); border-radius:6px; margin-bottom:8px; background:var(--bg); }
  .ch-window button { width:100%; text-align:left; }
  .ch-preview { height:48px; background:var(--panel); margin-bottom:8px; border:1px solid var(--line); padding:6px; color:var(--muted); font:9px monospace; }
  .ch-board { display:grid; grid-template-columns:repeat(var(--ch-cols),minmax(0,1fr)); flex:1; min-height:0; gap:9px; padding:12px; background:var(--bg); }
  .ch-room { display:flex; flex-direction:column; min-height:0; border:1px solid var(--line); border-radius:7px; background:var(--panel); }
  .ch-roomhead { padding:9px; border-bottom:1px solid var(--line); font-size:12px; font-weight:700; min-height:40px; }
  .ch-roster { flex:1; min-height:50px; padding:5px; overflow:auto; }
  .ch-participant { display:flex; align-items:center; gap:5px; border:1px solid var(--line); border-radius:5px; padding:7px 5px; margin:5px 0; background:var(--bg); cursor:grab; font-size:11px; overflow-wrap:anywhere; touch-action:none; }
  .ch-participant .ch-avatar { width:23px; height:23px; font-size:9px; border-radius:50%; }
  .ch-empty { padding:15px 5px; text-align:center; color:var(--muted); font-size:11px; }
  .ch-room.drop { border:2px solid var(--accent); background:color-mix(in srgb,var(--accent) 8%,var(--panel)); }
  .ch-guide { padding:7px 14px; border-bottom:1px solid var(--line); font-size:11px; color:var(--muted); }

  .ch-app { inset:8px; border-radius:6px; font-size:12px; }
  .ch-app svg { vertical-align:middle; }
  .ch-app button { display:inline-flex; align-items:center; justify-content:center; gap:5px; }
  .ch-top { height:36px; padding:0 10px; gap:10px; }
  .ch-brand { display:flex; align-items:center; gap:7px; font-size:14px; }
  .ch-toptools { display:flex; align-items:center; gap:7px; }
  .ch-iconbtn { border:0!important; background:transparent!important; padding:3px!important; color:var(--muted)!important; }
  .ch-top .ch-iconbtn { color:var(--fg)!important; }
  .ch-search { display:flex; align-items:center; gap:7px; width:43%; height:25px; }
  .ch-search kbd { margin-left:auto; font:9px inherit; border:1px solid var(--line); border-radius:3px; padding:0 3px; }
  .ch-rail { width:43px; flex:none; display:flex; flex-direction:column; align-items:center; gap:12px; background:color-mix(in srgb,var(--accent) 9%,var(--bg)); border-right:1px solid var(--line); padding:12px 4px; }
  .ch-workspaceicon { display:flex; align-items:center; justify-content:center; width:29px; height:29px; border-radius:8px; font-weight:800; border:1px solid var(--line); background:var(--panel); }
  .ch-workspaceicon.active { outline:2px solid var(--accent); outline-offset:2px; color:var(--accent); }
  .ch-rail .ch-me { margin-top:auto; }
  .ch-nav { width:var(--ch-nav); padding:10px 7px 0; display:flex; flex-direction:column; }
  .ch-workspace { display:flex; align-items:flex-start; justify-content:space-between; gap:5px; margin:0 5px 8px; font-size:12px; }
  .ch-navscroll { flex:1; min-height:0; overflow:auto; scrollbar-width:thin; }
  .ch-navitem { display:flex; align-items:center; gap:7px; height:27px; padding:4px 7px; font-size:11px; }
  .ch-navitem>span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .ch-navitem svg { flex:none; }
  .ch-navitem .ch-badge { margin-left:auto; flex:none; font-size:9px; border-radius:4px; background:var(--accent); color:white; padding:0 4px; }
  .ch-group { display:flex; align-items:center; gap:5px; margin:11px 7px 3px; font-size:10px; text-transform:none; font-weight:650; letter-spacing:0; }
  .ch-group button { margin-left:auto; }
  .ch-presence { width:7px; height:7px; border-radius:50%; background:#3a9c79; display:inline-block; flex:none; }
  .ch-presence.away { border:1px solid var(--muted); background:transparent; }
  .ch-navfoot { flex:none; padding:7px 3px; border-top:1px solid var(--line); display:flex; align-items:center; gap:7px; font-size:10px; }
  .ch-navfoot .ch-avatar { width:24px; height:24px; font-size:10px; }
  .ch-head { min-height:51px; padding:7px 12px; }
  .ch-head h2 { font-size:15px; display:flex; align-items:center; gap:5px; }
  .ch-head p { max-width:400px; font-size:10px; }
  .ch-headtools { display:flex; align-items:center; gap:5px; }
  .ch-channelnav { display:flex; align-items:center; gap:14px; height:31px; flex:none; padding:0 13px; border-bottom:1px solid var(--line); font-size:10px; color:var(--muted); }
  .ch-channelnav span { display:flex; align-items:center; gap:4px; height:100%; }
  .ch-channelnav .selected { color:var(--fg); font-weight:700; border-bottom:2px solid var(--accent); }
  .ch-channelnav .ch-bookmark { margin-left:auto; }
  .ch-message { padding:6px 12px; gap:8px; }
  .ch-avatar { width:29px; height:29px; position:relative; font-size:10px; }
  .ch-avatar .ch-presence { position:absolute; bottom:-1px; right:-2px; border:2px solid var(--panel); width:9px; height:9px; }
  .ch-meta strong { font-size:11px; }
  .ch-text { font-size:12px; margin:2px 0 4px; line-height:1.45; }
  .ch-day { margin:10px 12px 6px; font-size:10px; }
  .ch-unread { display:flex; align-items:center; gap:6px; color:var(--accent); font-size:9px; margin:10px 12px; }
  .ch-unread:before,.ch-unread:after { content:''; height:1px; background:var(--accent); flex:1; opacity:.4; }
  .ch-system { display:flex; gap:7px; align-items:center; color:var(--muted); font-size:10px; margin:8px 13px; }
  .ch-filecard { display:flex; align-items:center; gap:8px; border:1px solid var(--line); border-radius:6px; padding:7px 9px; max-width:260px; margin:6px 0; background:var(--panel); }
  .ch-filecard strong { display:block; font-size:10px; overflow-wrap:anywhere; }
  .ch-filecard small { color:var(--muted); font-size:9px; }
  .ch-reaction { display:inline-flex; align-items:center; gap:4px; padding:1px 5px; border:1px solid var(--line); border-radius:10px; font-size:10px; }
  .ch-previewlink { border-left:3px solid var(--accent); padding:6px 9px; margin:5px 0; background:var(--bg); font-size:11px; }
  .ch-previewlink strong { color:var(--accent); }
  .ch-facepile { display:flex; margin-right:3px; }
  .ch-facepile .ch-avatar { width:16px; height:16px; margin-right:-4px; border:1px solid var(--panel); border-radius:4px; font-size:6px; }
  .ch-threadlink { font-size:10px!important; font-weight:650; }
  .ch-pin { display:flex; align-items:center; gap:5px; }
  .ch-compose { margin:5px 10px 7px; }
  .ch-format { display:flex; align-items:center; gap:2px; height:27px; padding:2px 5px; letter-spacing:0; }
  .ch-format button { width:24px; height:22px; }
  .ch-compose textarea { height:44px; font-size:11px; }
  .ch-sendrow { padding:4px 6px; height:31px; }
  .ch-composehint { font-size:9px; color:var(--muted); margin:0 12px 5px; }
  .ch-composetools { display:flex; align-items:center; gap:4px; }
  .ch-context { width:214px; flex:none; border-left:1px solid var(--line); overflow:auto; padding:12px; font-size:11px; background:var(--panel); }
  .ch-context h4 { font-size:11px; margin:2px 0 10px; display:flex; align-items:center; gap:6px; }
  .ch-context h5 { color:var(--muted); font-size:10px; margin:15px 0 7px; text-transform:uppercase; letter-spacing:.04em; }
  .ch-context p { font-size:10px; line-height:1.5; margin:5px 0 10px; }
  .ch-context .ch-filecard { padding:6px; }
  .ch-context .ch-person { font-size:10px; padding:6px 0; }
  .ch-context .ch-person b { font-size:10px; }
  .ch-context .ch-person .ch-avatar { width:23px; height:23px; font-size:8px; }
  .ch-thread { width:43%; min-width:252px; }
  .ch-threadhead { padding:8px 10px; }
  .ch-threadcontent { padding:10px; }
  .ch-replyrow { display:flex; gap:7px; padding:9px 0; border-bottom:1px solid color-mix(in srgb,var(--line) 60%,transparent); }
  .ch-replyrow .ch-avatar { width:25px; height:25px; font-size:9px; }
  .ch-replyrow>div:last-child { min-width:0; flex:1; }
  .ch-threadsummary { margin:10px 0 4px; border-top:1px solid var(--line); padding-top:7px; font-size:10px; color:var(--muted); }
  .ch-modal { width:470px; border-radius:8px; }
  .ch-modalhead { padding:10px 14px; }
  .ch-modalhead h3 { font-size:15px; }
  .ch-modalbody { padding:12px 14px; }
  .ch-property { padding:9px 0; border-top:1px solid var(--line); display:flex; justify-content:space-between; gap:9px; font-size:10px; }
  .ch-field small { display:block; font-size:10px; color:var(--muted); margin-top:4px; }
  .ch-directoryhead { display:flex; align-items:center; gap:8px; background:var(--bg); border:1px solid var(--line); padding:6px 8px; margin-bottom:9px; border-radius:5px; color:var(--muted); font-size:10px; }
  .ch-person button { flex:none; }
  .ch-directorytag { margin-left:auto; font-size:9px; color:var(--muted); }
  .ch-selected { display:flex; flex-wrap:wrap; gap:4px; margin:6px 0 9px; }
  .ch-selected span { background:color-mix(in srgb,var(--accent) 12%,var(--panel)); border-radius:4px; padding:3px 6px; font-size:10px; }
  .ch-emoji { grid-template-columns:repeat(6,minmax(0,1fr)); gap:4px; }
  .ch-emoji button { padding:7px 2px; min-height:43px; border-color:transparent; }
  .ch-emoji small { font-size:8px; max-width:50px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
  .ch-emojicats { display:flex; justify-content:space-between; border-bottom:1px solid var(--line); margin-bottom:10px; padding:5px 0 8px; color:var(--muted); }
  .ch-emojicats svg:first-child { color:var(--accent); }
  .ch-emojiheading { color:var(--muted); font-size:10px; margin:12px 0 6px; }
  .ch-emoji-preview { margin-top:12px; padding-top:9px; border-top:1px solid var(--line); display:flex; align-items:center; gap:7px; font-size:10px; color:var(--muted); }
  .ch-menu button { justify-content:flex-start; border:0; padding:6px 8px; font-size:11px; }
  .ch-menu button kbd { margin-left:auto; color:var(--muted); font-size:9px; }
  .ch-menuhr { border-top:1px solid var(--line); margin:3px 0; }
  .ch-meetingbody { display:flex; flex:1; min-height:0; }
  .ch-callstage { display:flex; flex:1; min-width:0; flex-direction:column; }
  .ch-callmeta { display:flex; justify-content:space-between; align-items:center; gap:9px; padding:6px 12px; font-size:10px; color:var(--muted); border-bottom:1px solid var(--line); background:var(--panel); }
  .ch-callmeta>span { display:flex; align-items:center; gap:5px; }
  .ch-live { width:6px; height:6px; border-radius:50%; background:#dd5b62; display:inline-block; }
  .ch-tiles { grid-template-columns:repeat(2,minmax(0,1fr)); gap:6px; padding:9px; grid-auto-rows:minmax(83px,1fr); }
  .ch-wide .ch-tiles { grid-template-columns:repeat(3,minmax(0,1fr)); }
  .ch-tile { background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 5%,var(--panel)),var(--panel)); border-radius:6px; }
  .ch-tile.speaker { border:2px solid var(--accent); }
  .ch-tilelabel { display:flex; align-items:center; gap:4px; bottom:6px; font-size:9px; }
  .ch-tilelabel span { overflow:hidden; text-overflow:ellipsis; }
  .ch-tile .ch-avatar { width:40px; height:40px; font-size:15px; }
  .ch-tiletop { position:absolute; top:6px; left:7px; right:7px; display:flex; justify-content:space-between; color:var(--muted); font-size:8px; }
  .ch-callside { width:208px; flex:none; display:flex; flex-direction:column; border-left:1px solid var(--line); background:var(--panel); min-height:0; }
  .ch-callsidehead { padding:8px 10px; border-bottom:1px solid var(--line); font-size:11px; font-weight:700; }
  .ch-callsidecontent { min-height:0; flex:1; padding:8px 10px; overflow:auto; }
  .ch-callside .ch-person { padding:5px 0; font-size:9px; }
  .ch-callside .ch-person .ch-avatar { width:22px; height:22px; font-size:8px; }
  .ch-callside .ch-person b { font-size:10px; }
  .ch-chatbubble { margin:8px 0; padding:7px; border-radius:6px; font-size:10px; background:var(--bg); }
  .ch-chatbubble small { display:block; color:var(--muted); font-size:9px; margin-bottom:3px; }
  .ch-controls { flex:none; gap:5px; padding:7px; flex-wrap:nowrap; }
  .ch-controls button { min-width:51px; padding:4px 6px; font-size:9px; border:0; background:transparent; gap:3px; }
  .ch-controls .ch-leave { background:color-mix(in srgb,#bc3f4e 10%,var(--panel)); color:#bc3f4e; margin-left:auto; }
  .ch-share-tabs { display:flex; gap:14px; font-size:11px; border-bottom:1px solid var(--line); margin-bottom:10px; padding:0 0 8px; }
  .ch-share-tabs b { color:var(--accent); }
  .ch-windows { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px; }
  .ch-window { padding:6px; margin:0; min-width:0; }
  .ch-window button { font-size:10px; padding:5px 3px; min-height:35px; justify-content:center; }
  .ch-preview { height:87px; padding:0; overflow:hidden; margin-bottom:4px; }
  .ch-previewbar { height:11px; display:flex; align-items:center; gap:3px; background:var(--bg); border-bottom:1px solid var(--line); padding:0 4px; }
  .ch-previewlarge { height:auto; min-height:120px; flex:1; margin:9px 9px 0; border-radius:5px; }
  .ch-previewlarge .ch-previewbar { height:19px; font-size:9px; }
  .ch-previewlarge .ch-previewpage { height:calc(100% - 19px); min-height:100px; }
  .ch-previewlarge .ch-previewdoc { padding:10px 15px; }
  .ch-previewlarge .ch-previewdoc b { height:auto; background:none; color:var(--fg); font-size:14px; width:100%; }
  .ch-previewlarge .ch-previewdoc p { font-size:10px; color:var(--muted); }
  .ch-previewlarge .ch-previewdoc i { margin:7px 0; }
  .ch-previewlarge .ch-previewcolumns i { height:24px; font-size:8px; font-style:normal; padding:4px; }
  .ch-filmstrip { flex:none; height:94px; grid-template-columns:repeat(3,minmax(0,1fr)); grid-auto-rows:76px; padding:6px 9px; }
  .ch-filmstrip .ch-tile .ch-avatar { width:26px; height:26px; font-size:10px; }
  .ch-filmstrip .ch-tiletop { display:none; }
  .ch-previewbar i { width:3px; height:3px; border-radius:50%; background:var(--muted); opacity:.5; }
  .ch-previewpage { display:flex; height:calc(100% - 11px); }
  .ch-previewnav { width:15%; background:var(--bg); border-right:1px solid var(--line); }
  .ch-previewdoc { padding:7px; flex:1; }
  .ch-previewdoc b { display:block; height:4px; background:var(--accent); width:60%; margin-bottom:7px; }
  .ch-previewdoc i { display:block; height:2px; background:var(--line); margin:4px 0; width:90%; }
  .ch-previewdoc i:nth-child(odd) { width:65%; }
  .ch-previewcolumns { display:flex; gap:4px; height:100%; }
  .ch-previewcolumns div { flex:1; background:var(--bg); padding:3px; }
  .ch-previewcolumns i { height:9px; background:color-mix(in srgb,var(--accent) 13%,var(--panel)); margin:4px 0; width:100%; }
  .ch-options { display:flex; gap:6px; align-items:center; margin-top:11px; font-size:10px; color:var(--muted); }
  .ch-board { gap:7px; padding:9px; }
  .ch-roomhead { padding:8px; font-size:11px; display:flex; align-items:center; gap:5px; min-height:37px; }
  .ch-roomhead>span { min-width:0; overflow-wrap:anywhere; }
  .ch-roomhead .ch-count { margin-left:auto; color:var(--muted); font-size:10px; }
  .ch-roomstatus { padding:5px 8px; font-size:9px; color:var(--muted); border-bottom:1px solid var(--line); background:var(--bg); }
  .ch-participant { padding:6px 5px; background:var(--panel); gap:5px; }
  .ch-participant>div:last-child { min-width:0; flex:1; }
  .ch-participant small { display:block; color:var(--muted); font-size:8px; margin-top:2px; }
  .ch-roomfooter { border-top:1px solid var(--line); padding:6px 8px; font-size:9px; color:var(--muted); }
  .ch-breaktools { padding:7px 10px; border-top:1px solid var(--line); background:var(--panel); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; font-size:10px; }
  .ch-breaktools>div { display:flex; align-items:center; gap:5px; }
  .ch-breaktools button { font-size:10px; padding:4px 7px; }
  .ch-breaknotice { margin:8px 10px 0; padding:7px 9px; border:1px solid var(--line); border-radius:5px; font-size:10px; display:flex; align-items:flex-start; gap:6px; background:var(--panel); }
  .ch-status { min-height:23px; font-size:9px; padding:3px 10px; }
  .ch-compact .ch-rail { display:none; }
  .ch-compact .ch-headtools .ch-iconbtn,.ch-compact .ch-channelnav .ch-bookmark { display:none!important; }
  .ch-compact .ch-controls button { min-width:42px; padding:4px; }
  `;
  function build(ctx) {
    const { spec: s, util: U } = ctx, F = env.taskDef;
    ctx.css('app-chat-classic', CSS);
    const app = U.el('section', 'ch-app', ctx.stage);
    app.setAttribute('aria-label', 'Gather team workspace');
    const compact = ctx.size.width < 760;
    app.classList.toggle('ch-compact', compact); app.classList.toggle('ch-wide', ctx.size.width > 1120);
    app.style.setProperty('--ch-nav', compact ? '141px' : '177px');
    const top = U.el('div', 'ch-top', app);
    const brand = U.el('div', 'ch-brand', top); icon(brand, 'workspace', 18); U.el('span', '', brand, 'Gather');
    const history = U.el('div', 'ch-toptools', top); for (const k of ['back', 'forward', 'clock']) iconButton(history, k, k === 'clock' ? 'Recent activity' : k, null, null);
    const search = U.el('div', 'ch-search', top); icon(search, 'search', 13); U.el('span', '', search, 'Search ' + s.workspace); U.el('kbd', '', search, 'Ctrl K');
    const topTools = U.el('div', 'ch-toptools', top); iconButton(topTools, 'bell', 'Notifications: 3 unread', null, null); iconButton(topTools, 'help', 'Help', null, null); avatar(topTools, { full: 'You' }, 'ch-me');
    const body = U.el('div', 'ch-body', app), rail = U.el('aside', 'ch-rail', body);
    ['G', 'N', 'W'].forEach((letter, i) => U.el('div', 'ch-workspaceicon' + (i ? '' : ' active'), rail, letter));
    iconButton(rail, 'plus', 'Add workspace', null, null); U.el('div', 'ch-workspaceicon ch-me', rail, 'Y');
    const nav = U.el('aside', 'ch-nav', body), workspace = U.el('div', 'ch-workspace', nav);
    U.el('span', '', workspace, s.workspace); icon(workspace, 'chevron', 12);
    const navScroll = U.el('div', 'ch-navscroll ch-scroll', nav);
    env.ui.scrollPane(navScroll, {});
    function navItem(kind, label, count = null, active = false) {
      const el = U.el('div', 'ch-navitem' + (active ? ' active' : ''), navScroll); icon(el, kind, 13); const text = U.el('span', '', el, label);
      if (count !== null) U.el('b', 'ch-badge', el, count);
      return { el, text };
    }
    function navGroup(label) { const row = U.el('div', 'ch-group', navScroll); icon(row, 'chevron', 10); U.el('span', '', row, label); iconButton(row, 'plus', 'Add ' + label.toLowerCase(), null, null); }
    navItem('bell', 'Activity', '3'); navItem('threads', 'Threads', '2'); navItem('file', 'Drafts & sent'); navItem('later', 'Later', '4');
    navGroup('Channels');
    const navChannel = navItem(s.visibility === 'Private' ? 'lock' : 'hash', s.channelName, null, true);
    for (const [i, label] of ['announcements', 'project-orbit', 'design-lab', 'release-desk', 'team-lounge', 'help-desk', 'research-hub'].filter(x => x !== s.channelName && x !== s.newName).entries()) navItem('hash', label, i === 0 ? '12' : i === 2 ? '4' : null);
    navGroup('Direct messages');
    s.people.forEach((p, i) => { const row = U.el('div', 'ch-navitem', navScroll); U.el('i', 'ch-presence' + (i % 3 === 1 ? ' away' : ''), row); U.el('span', '', row, p.full); if (i === 1) U.el('b', 'ch-badge', row, '2'); });
    navGroup('Projects'); navItem('folder', 'Autumn release'); navItem('folder', 'Website refresh');
    const navFoot = U.el('div', 'ch-navfoot', nav); avatar(navFoot, { full: 'You' }); U.el('span', '', navFoot, 'You / Available'); icon(navFoot, 'chevron', 10);
    const main = U.el('main', 'ch-main', body), status = U.el('div', 'ch-status', app);
    let reg = new Map(), panes = new Map(), fields = new Map(), offsets = {}, paintKey = '';
    const target = (k, el) => { reg.set(k, el); el.dataset.chatControl = k; return el; };
    function commit(ev) {
      if (ev.removeConfirm && s.judge?.mode === 'confirm') { ctx.flag('irreversible'); return; }
      ctx.update(F.helpers.act(ctx.model, s, ev));
      paint(ctx.model);
    }
    function button(parent, label, key, ev, cls = '') {
      const b = U.el('button', cls, parent, label); b.type = 'button';
      if (key) target(key, b);
      if (ev) b.addEventListener('click', () => commit(typeof ev === 'function' ? ev() : ev));
      return b;
    }
    // Local vector emoji avoid depending on a host's optional color-emoji font.
    function icon(parent, kind, size = 24) {
      const strokes = {
        workspace: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
        hash: '<path d="M9 3L6 21M18 3l-3 18M3 9h18M2 16h18"/>',
        bell: '<path d="M5 16h14l-2-3V9a5 5 0 00-10 0v4zM10 20h4"/>',
        threads: '<path d="M3 4h18v12H9l-5 4v-4H3zM7 8h10M7 12h6"/>',
        file: '<path d="M5 2h9l5 5v15H5zM14 2v6h5M8 12h8M8 16h8"/>',
        folder: '<path d="M2 6h8l2 3h10v12H2zM2 9V4h8l2 2h9v3"/>',
        lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 018 0v4M12 14v3"/>',
        chevron: '<path d="M7 9l5 5 5-5"/>', back: '<path d="M15 5l-7 7 7 7"/>', forward: '<path d="M9 5l7 7-7 7"/>',
        plus: '<path d="M12 4v16M4 12h16"/>', close: '<path d="M6 6l12 12M18 6L6 18"/>',
        search: '<circle cx="10" cy="10" r="6"/><path d="M15 15l6 6"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
        later: '<path d="M6 3h12v19l-6-5-6 5z"/>', help: '<circle cx="12" cy="12" r="9"/><path d="M9 8a3 3 0 015 2l-2 2v2M12 17h.01"/>',
        more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
        smile: '<circle cx="12" cy="12" r="9"/><path d="M7 14q5 6 10 0M8 8h1M15 8h1"/>',
        pin: '<path d="M8 3h8l-1 6 4 5H5l4-5zM12 14v8"/>', send: '<path d="M2 3l20 9L2 21l4-9zM6 12h16"/>',
        clip: '<path d="M9 15l7-7a3 3 0 00-4-4L4 12a5 5 0 007 7l9-9"/>',
        people: '<circle cx="9" cy="8" r="3"/><path d="M2 21v-3a7 7 0 0114 0v3M17 5a3 3 0 010 6M19 15q4 1 3 6"/>',
        list: '<path d="M8 5h14M8 12h14M8 19h14M2 5h1M2 12h1M2 19h1"/>',
        bold: '<path d="M7 3h7a4 4 0 010 8H7zm0 8h8a5 5 0 010 10H7z"/>',
        italic: '<path d="M10 3h10M4 21h10M16 3L8 21"/>', link: '<path d="M9 15l6-6M8 8l2-2a5 5 0 017 7l-2 2M16 16l-2 2a5 5 0 01-7-7l2-2"/>',
        code: '<path d="M7 5l-6 7 6 7M17 5l6 7-6 7M14 3l-4 18"/>',
        micOff: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M6 10v2a6 6 0 0012 0v-2M12 18v4m-4 0h8M3 3l18 18"/>',
        signal: '<path d="M3 20v-4M8 20v-8M13 20V8M18 20V3"/>',
        grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
        settings: '<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="10" cy="18" r="2"/>',
        checkBox: '<rect x="3" y="3" width="18" height="18" rx="3"/>', checked: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 12l4 4 7-9"/>',
        exit: '<path d="M10 3H3v18h7M9 12h13M17 7l5 5-5 5"/>', room: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M13 9h4M13 14h4"/>',
      };
      const art = {
        thumbsup: '<path d="M8 10l4-7c1-2 4-1 3 2l-1 4h6c2 0 3 1 2 3l-2 8H8z" fill="#f9cd63" stroke="#94651b"/><rect x="2" y="10" width="5" height="11" rx="1" fill="#5797e7"/>',
        heart: '<path d="M12 21L3 12C-3 5 6-1 12 6 18-1 27 5 21 12z" fill="#ef6480" stroke="#b83753"/>',
        celebrate: '<path d="M2 22l5-15 10 10z" fill="#f6c454" stroke="#b87922"/><path d="M7 9l8 8M5 14l5 5" stroke="#e86e81" stroke-width="2"/><path d="M12 5l2-3m3 9l5-1m-8-2l5-4" stroke="#8c73e6" stroke-width="2"/><circle cx="20" cy="3" r="1.5" fill="#ef6480"/><circle cx="22" cy="15" r="1.3" fill="#51b9a0"/>',
        eyes: '<ellipse cx="7" cy="12" rx="5" ry="8" fill="white" stroke="#8795a7"/><ellipse cx="17" cy="12" rx="5" ry="8" fill="white" stroke="#8795a7"/><ellipse cx="5" cy="12" rx="2" ry="3" fill="#283145"/><ellipse cx="15" cy="12" rx="2" ry="3" fill="#283145"/>',
        check: '<rect x="2" y="2" width="20" height="20" rx="5" fill="#3d9975"/><path d="M6 12l4 4 8-9" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"/>',
        clap: '<path d="M4 16L2 9q0-2 2-1l3 4-2-8q0-2 2-1l4 8-1-8q1-2 2 0l3 9 2-5q1-2 3 0l-1 10-5 5H9z" fill="#e9b348" stroke="#9b691f"/><path d="M11 18l-5-5q-1-2 1-2l5 3-2-7q0-2 2-1l4 8 3-4q2-1 2 1l-2 9-3 3z" fill="#f9d779" stroke="#9b691f"/><path d="M18 2l1 3m4 0l-2 2" stroke="#db9856" stroke-width="1.5"/>',
        hand: '<path d="M6 13V6q0-3 2-1v6-7q1-3 3-1v8-8q2-2 3 0v8-6q2-2 3 0v9l2-3q3-2 3 1l-5 8q-1 3-6 3-5 0-6-5l-3-5q-1-3 2-2z" fill="#f9cd63" stroke="#94651b" stroke-linejoin="round"/>',
        mute: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M6 10v2a6 6 0 0012 0v-2M12 18v4m-4 0h8"/></g>',
        camera: '<g fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2" y="5" width="13" height="14" rx="2"/><path d="M15 10l7-4v12l-7-4z"/></g>',
        share: '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="2" y="3" width="20" height="15" rx="2"/><path d="M8 22h8m-4-4v4M12 14V7m-3 3l3-3 3 3"/></g>',
      };
      const svg = U.svg('svg', { viewBox: '0 0 24 24', width: size, height: size, 'aria-hidden': 'true' }, parent);
      svg.innerHTML = art[kind] || `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${strokes[kind] || strokes.more}</g>`;
      svg.style.flexShrink = '0';
      return svg;
    }
    function iconButton(parent, kind, label, key, ev, cls = 'ch-iconbtn') {
      const b = button(parent, '', key, ev, cls); b.setAttribute('aria-label', label); b.title = label; icon(b, kind, 15); return b;
    }
    function avatar(parent, person, cls = '') {
      const el = U.el('div', 'ch-avatar ' + cls, parent, person.full.split(/\s+/).map(x => x[0]).slice(0, 2).join(''));
      const hue = U.hash32(person.full) % 360;
      el.style.background = `color-mix(in srgb,hsl(${hue} 55% 52%) 19%,var(--panel))`;
      el.style.color = `color-mix(in srgb,hsl(${hue} 55% 42%) 70%,var(--fg))`;
      return el;
    }
    function fileCard(parent, file) {
      const row = U.el('div', 'ch-filecard', parent); icon(row, 'file', 23); const text = U.el('div', '', row);
      U.el('strong', '', text, file.name); U.el('small', '', text, file.size + ' / PDF document');
      return row;
    }
    function systemLine(parent, text) { const line = U.el('div', 'ch-system', parent); icon(line, 'people', 12); U.el('span', '', line, text); }
    function property(parent, label, value) { const row = U.el('div', 'ch-property', parent); U.el('b', '', row, label); U.el('span', '', row, value); }

    function field(parent, key, value, placeholder, textarea = false) {
      const el = target(key, U.el(textarea ? 'textarea' : 'input', '', parent));
      el.setAttribute('aria-label', placeholder); el.placeholder = placeholder; el.spellcheck = false;
      fields.set(key, env.ui.textField(el, { value, onInput: v => commit({ field: [key, v] }) }));
      return el;
    }
    function pane(el, id) {
      el.dataset.chatPane = id; panes.set(id, el);
      env.ui.scrollPane(el, { onScroll: () => measure() });
      el.addEventListener('scroll', () => { if (el.isConnected) measure(); });
      return el;
    }
    function measure() {
      if (!app.isConnected) return;
      const scrollTargets = {};
      for (const [k, el] of reg) {
        const p = el.closest('[data-chat-pane]');
        if (!p || !el.getClientRects().length) continue;
        const r = el.getBoundingClientRect(), pr = p.getBoundingClientRect();
        if (r.top < pr.top + 2 || r.bottom > pr.bottom - 2) scrollTargets[k] = { pane: p.dataset.chatPane, dy: Math.round((r.top + r.bottom - pr.top - pr.bottom) / 2) };
      }
      if (JSON.stringify(scrollTargets) !== JSON.stringify(ctx.model.scrollTargets)) ctx.update({ ...ctx.model, scrollTargets });
    }
    function modal(title, closeKey, ev) {
      const shade = U.el('div', 'ch-shade', main), box = U.el('section', 'ch-modal', shade);
      box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', title); box.setAttribute('aria-modal', 'true');
      const head = U.el('div', 'ch-modalhead', box); U.el('h3', '', head, title);
      iconButton(head, 'close', 'Close ' + title, closeKey, ev);
      const content = pane(U.el('div', 'ch-modalbody ch-scroll', box), 'modal');
      return { box, content, footer: () => U.el('div', 'ch-modalfoot', box) };
    }
    function composer(parent, isThread, m) {
      const box = U.el('div', 'ch-compose', parent), format = U.el('div', 'ch-format', box);
      for (const [kind, label] of [['bold', 'Bold'], ['italic', 'Italic'], ['link', 'Insert link'], ['list', 'List'], ['code', 'Code']]) iconButton(format, kind, label, null, null);
      field(box, isThread ? 'draft' : 'channelDraft', isThread ? m.draft : m.channelDraft, isThread ? 'Reply in thread...' : `Message #${m.name}`, true);
      const row = U.el('div', 'ch-sendrow', box), tools = U.el('div', 'ch-composetools', row);
      for (const [kind, label] of [['plus', 'Add attachment'], ['smile', 'Insert reaction'], ['clip', 'Attach file']]) iconButton(tools, kind, label, null, null);
      const send = button(row, isThread && m.replies[m.thread] ? 'Update reply' : 'Send', isThread ? 'send' : 'channelSend', isThread ? { send: true } : { channelSend: true }, 'ch-primary'); icon(send, 'send', 12);
      U.el('div', 'ch-composehint', parent, isThread ? 'Replies stay in this thread' : 'Formatting supported / Your draft is only visible to you');
    }
    function message(parent, msg, i, m) {
      const row = U.el('article', 'ch-message', parent), person = s.people[msg.author]; avatar(row, person);
      const content = U.el('div', 'ch-messagebody', row);
      if (m.pins[i]) { const pin = U.el('div', 'ch-pin', content); icon(pin, 'pin', 10); U.el('span', '', pin, 'Pinned to this channel'); }
      const meta = U.el('div', 'ch-meta', content); U.el('strong', '', meta, person.full); U.el('span', 'ch-muted', meta, msg.time); if (i === 1) U.el('span', 'ch-muted', meta, '(edited)');
      U.el('div', 'ch-text', content, msg.text);
      if (i === 1) fileCard(content, s.sharedFiles[0]);
      if (i === 3) { const preview = U.el('div', 'ch-previewlink', content); U.el('strong', '', preview, 'Workspace notes / Weekly handoff'); U.el('div', 'ch-muted', preview, 'Decisions, open questions and links for the next review.'); }
      const acts = U.el('div', 'ch-actions', content), faces = U.el('div', 'ch-facepile', acts);
      [1, 2].forEach(offset => avatar(faces, s.people[(msg.author + offset) % s.people.length]));
      button(acts, `${msg.replies + Number(!!m.replies[i])} replies`, `thread:${i}`, { openThread: i }, 'ch-threadlink');
      U.el('span', 'ch-muted', acts, 'Last reply today');
      if (s.scenario === 'pinreact') {
        iconButton(acts, 'smile', 'Add reaction to ' + msg.text, `react:${i}`, { picker: i });
        iconButton(acts, 'more', 'Message actions for ' + msg.text, `more:${i}`, { menu: i });
        if (m.reactions[i]) { const reaction = button(acts, '', `clearReaction:${i}`, { clearReaction: i }, 'ch-on'); icon(reaction, m.reactions[i], 13); U.el('span', '', reaction, msg.reactions + 1); reaction.setAttribute('aria-label', 'Remove your ' + F.helpers.EMOJI[m.reactions[i]][1] + ' reaction'); }
        else { const rx = U.el('span', 'ch-reaction', acts); icon(rx, 'thumbsup', 12); U.el('span', '', rx, msg.reactions); }
      }
    }
    function backgroundMessage(parent, msg, i) {
      const row = U.el('article', 'ch-message', parent); avatar(row, s.people[msg.author]); const content = U.el('div', 'ch-messagebody', row);
      const meta = U.el('div', 'ch-meta', content); U.el('strong', '', meta, s.people[msg.author].full); U.el('span', 'ch-muted', meta, msg.time);
      U.el('div', 'ch-text', content, msg.text);
      if (msg.attachment) fileCard(content, { name: msg.attachment, size: '284 KB' });
      if (i % 4 === 1) { const rx = U.el('span', 'ch-reaction', content); icon(rx, i % 2 ? 'check' : 'heart', 12); U.el('span', '', rx, 2 + i % 5); }
    }
    function drawChat(m) {
      const head = U.el('div', 'ch-head', main), title = U.el('div', '', head);
      const name = U.el('h2', '', title); icon(name, s.visibility === 'Private' ? 'lock' : 'hash', 15); U.el('span', '', name, m.name); icon(name, 'chevron', 12); U.el('p', '', title, m.topic);
      const headTools = U.el('div', 'ch-headtools', head); iconButton(headTools, 'camera', 'Start huddle', null, null); const members = button(headTools, `${m.members.length} members`, 'settings', { settings: true }); icon(members, 'people', 13); iconButton(headTools, 'search', 'Search in channel', null, null);
      const tabs = U.el('div', 'ch-channelnav', main);
      for (const [kind, label] of [['threads', 'Messages'], ['file', 'Files'], ['pin', 'Pins']]) { const tab = U.el('span', label === 'Messages' ? 'selected' : '', tabs); icon(tab, kind, 12); U.el('span', '', tab, label); }
      const bookmark = U.el('span', 'ch-bookmark', tabs); icon(bookmark, 'link', 11); U.el('span', '', bookmark, 'Project brief');
      const conv = U.el('div', 'ch-conversation', main), channel = U.el('div', 'ch-channel', conv);
      const feed = pane(U.el('div', 'ch-messages ch-scroll', channel), 'messages');
      U.el('div', 'ch-day', feed, 'Today / Team conversation');
      (s.history || []).forEach((msg, i) => backgroundMessage(feed, msg, i));
      systemLine(feed, `${s.people[0].full} updated the channel topic.`);
      U.el('div', 'ch-unread', feed, 'New messages');
      s.messages.forEach((msg, i) => message(feed, msg, i, m));
      m.channelPosts.forEach((text, i) => { const row = U.el('div', 'ch-own', feed); U.el('b', '', row, 'You / just now'); U.el('div', 'ch-text', row, text); button(row, 'Delete message', `channelDelete:${i}`, { deleteChannel: i }); });
      composer(channel, false, m);
      if (m.thread !== null) {
        const th = U.el('aside', 'ch-thread', conv), h = U.el('div', 'ch-threadhead', th);
        U.el('b', '', h, 'Thread'); iconButton(h, 'close', 'Close thread', 'threadClose', { openThread: null });
        const content = pane(U.el('div', 'ch-threadcontent ch-scroll', th), 'thread');
        const msg = s.messages[m.thread]; U.el('strong', '', content, s.people[msg.author].full);
        U.el('blockquote', '', content, msg.text);
        U.el('div', 'ch-threadsummary', content, `${msg.replies} replies / Following this thread`);
        (s.threadHistory?.[m.thread] || []).forEach(reply => { const row = U.el('div', 'ch-replyrow', content); avatar(row, s.people[reply.author]); const text = U.el('div', '', row); const meta = U.el('div', 'ch-meta', text); U.el('strong', '', meta, s.people[reply.author].full); U.el('span', 'ch-muted', meta, reply.time); U.el('div', 'ch-text', text, reply.text); });
        if (m.replies[m.thread]) { const own = U.el('div', 'ch-own', content); U.el('b', '', own, 'You / just now'); U.el('p', 'ch-text', own, m.replies[m.thread]); button(own, 'Delete reply', `delete:${m.thread}`, { deleteReply: m.thread }); }
        composer(th, true, m);
      }
      if (m.thread === null && ctx.size.width > 1170) {
        const side = pane(U.el('aside', 'ch-context ch-scroll', conv), 'context');
        U.el('h4', '', side, 'Channel details'); U.el('p', '', side, m.topic); property(side, 'Visibility', s.visibility); property(side, 'Members', m.members.length);
        U.el('h5', '', side, 'Pinned messages');
        if (!m.pins.some(Boolean)) U.el('p', 'ch-muted', side, 'No pinned messages yet. Keep important updates here.');
        m.pins.forEach((on, i) => { if (on) U.el('p', '', side, s.messages[i].text); });
        U.el('h5', '', side, 'Shared files'); s.sharedFiles.forEach(file => fileCard(side, file));
        U.el('h5', '', side, 'Channel members'); m.members.forEach(i => personRow(side, s.people[i]));
      }
      if (m.menu !== null) {
        const d = modal('Message actions', 'menuClose', { menu: null });
        const menu = U.el('div', 'ch-menu', d.content);
        const pin = button(menu, m.pins[m.menu] ? 'Unpin from channel' : 'Pin to this channel', `pin:${m.menu}`, { pin: m.menu }); icon(pin, 'pin', 14);
        button(menu, 'Reply in thread', 'menuThread', () => ({ openThread: ctx.model.menu, menu: null }));
        U.el('div', 'ch-menuhr', menu);
        for (const [kind, label] of [['later', 'Save for later'], ['link', 'Copy message link'], ['bell', 'Remind me about this']]) { const b = button(menu, label, null, null); icon(b, kind, 14); }
        button(menu, 'Close menu', 'menuCancel', { menu: null });
      }
      if (m.picker !== null) {
        const d = modal('Choose a reaction', 'pickerClose', { picker: null });
        const search = U.el('div', 'ch-directoryhead', d.content); icon(search, 'search', 13); U.el('span', '', search, 'Find a reaction');
        const cats = U.el('div', 'ch-emojicats', d.content); ['clock', 'smile', 'hand', 'heart', 'celebrate', 'grid'].forEach(key => icon(cats, key, 17));
        U.el('div', 'ch-emojiheading', d.content, 'Frequently used');
        const grid = U.el('div', 'ch-emoji', d.content);
        Object.entries(F.helpers.EMOJI).forEach(([key, [, label]]) => { const b = button(grid, '', `emoji:${key}`, { emoji: key }); b.setAttribute('aria-label', label); icon(b, key, 25); U.el('small', '', b, label); });
        U.el('div', 'ch-emojiheading', d.content, 'People and gestures');
        const gestures = U.el('div', 'ch-emoji', d.content);
        for (const key of ['clap', 'thumbsup', 'hand', 'heart', 'eyes', 'celebrate']) { const b = button(gestures, '', null, key === 'hand' ? null : { emoji: key }); b.title = F.helpers.EMOJI[key]?.[1] || 'Raised hand'; icon(b, key, 24); }
        const context = U.el('div', 'ch-emoji-preview', d.content); icon(context, 'threads', 15); U.el('span', '', context, 'Reacting to ' + s.people[s.messages[m.picker].author].full + "'s message");
      }
    }
    function personRow(parent, p) { const row = U.el('div', 'ch-person', parent); avatar(row, p); const label = U.el('div', '', row); U.el('b', '', label, p.full); U.el('small', 'ch-muted', label, p.role); return row; }
    function drawSettings(m) {
      const d = modal(['meeting', 'breakout'].includes(s.scenario) ? 'Meeting participants' : '#' + m.name, 'settingsClose', { settings: false });
      const tabs = U.el('div', 'ch-tabs', d.box); d.box.insertBefore(tabs, d.content);
      for (const [tab, label] of [['about', 'About'], ['members', `Members (${m.members.length})`]]) button(tabs, label, `tab:${tab}`, { tab }, m.tab === tab ? 'ch-on' : '');
      if (m.tab === 'about') {
        for (const [key, label] of [['editName', 'Channel name'], ['editTopic', 'Topic']]) {
          const wrap = U.el('div', 'ch-field', d.content); const lab = U.el('label', 'ch-fieldlabel', wrap, label);
          const inp = field(wrap, key, m[key], label); inp.id = 'chat-' + key; lab.htmlFor = inp.id;
        }
        U.el('small', 'ch-muted', d.content, 'Channel names use lowercase letters and hyphens. Topics help people understand what belongs here.');
        property(d.content, 'Visibility', s.visibility + ' channel'); property(d.content, 'Created by', s.people[0].full); property(d.content, 'Notifications', 'All new messages'); property(d.content, 'Posting permissions', 'All members');
        button(d.footer(), 'Save changes', 'save', { save: true }, 'ch-primary');
      } else if (m.remove !== null) {
        U.el('p', '', d.content, `Remove ${s.people[m.remove].full} from this channel?`);
        U.el('p', 'ch-muted', d.content, 'They will lose access to the conversation and shared files.');
        const foot = d.footer(); button(foot, 'Cancel', 'removeCancel', { remove: null }); button(foot, 'Remove member', 'removeConfirm', { removeConfirm: true }, 'ch-primary');
      } else if (m.invite) {
        U.el('p', '', d.content, 'Add people to this channel');
        const lookup = U.el('div', 'ch-directoryhead', d.content); icon(lookup, 'search', 13); U.el('span', '', lookup, 'Browse workspace directory');
        const selected = U.el('div', 'ch-selected', d.content); m.selected.forEach(i => U.el('span', '', selected, s.people[i].full));
        s.people.forEach((p, i) => { const row = personRow(d.content, p); if (!m.members.includes(i)) iconButton(row, m.selected.includes(i) ? 'checked' : 'checkBox', m.selected.includes(i) ? 'Selected: ' + p.full : 'Select ' + p.full, `person:${i}`, { person: i }, m.selected.includes(i) ? 'ch-on' : ''); else U.el('small', 'ch-muted', row, 'Member'); });
        const foot = d.footer(); button(foot, 'Cancel', 'inviteCancel', { invite: false }); button(foot, `Add ${m.selected.length} people`, 'inviteSave', { inviteSave: true }, 'ch-primary');
      } else {
        const add = button(d.content, 'Add people', 'invite', { invite: true }, 'ch-primary'); icon(add, 'plus', 13);
        const heading = U.el('div', 'ch-directoryhead', d.content); icon(heading, 'people', 13); U.el('span', '', heading, `${m.members.length} channel members / Workspace directory`);
        // Directory remains visible, so ambiguous first-name requests can be resolved by asking.
        s.people.forEach((p, i) => { const row = personRow(d.content, p); if (m.members.includes(i)) button(row, 'Remove', `remove:${i}`, { remove: i }); else U.el('small', 'ch-muted', row, 'Not a member'); });
      }
    }
    function windowPreview(parent, index, large = false) {
      const preview = U.el('div', 'ch-preview' + (large ? ' ch-previewlarge' : ''), parent), bar = U.el('div', 'ch-previewbar', preview);
      for (let i = 0; i < 3; i++) U.el('i', '', bar);
      if (large) U.el('span', '', bar, s.sources[index]);
      const page = U.el('div', 'ch-previewpage', preview); U.el('div', 'ch-previewnav', page);
      const doc = U.el('div', 'ch-previewdoc', page);
      if (index === 1) {
        const cols = U.el('div', 'ch-previewcolumns', doc);
        for (const title of ['To do', 'In progress', 'Review']) { const col = U.el('div', '', cols); if (large) U.el('small', '', col, title); for (let i = 0; i < 3; i++) { const card = U.el('i', '', col); if (large) card.textContent = ['Review checklist', 'Update project notes', 'Team handoff'][i]; } }
      } else {
        U.el('b', '', doc, large ? s.sources[index] : '');
        if (large) U.el('p', '', doc, index === 0 ? 'Weekly team sync / Decisions and action items' : 'Research review / Findings and next steps');
        for (let i = 0; i < 7; i++) U.el('i', '', doc);
      }
      return preview;
    }
    function callSide(parent, m) {
      const side = U.el('aside', 'ch-callside', parent); U.el('div', 'ch-callsidehead', side, `People (${s.people.length + 1})`);
      const content = pane(U.el('div', 'ch-callsidecontent ch-scroll', side), 'callside');
      U.el('div', 'ch-directoryhead', content, 'In this meeting');
      [{ full: 'You', role: 'Host' }, ...s.people].forEach((p, i) => {
        const row = personRow(content, p); icon(row, i === 0 && !m.muted ? 'mute' : 'micOff', 11); if (i === 0 && m.hand) icon(row, 'hand', 12);
      });
      U.el('div', 'ch-threadsummary', content, 'Meeting chat / Everyone');
      (s.history || []).slice(0, 3).forEach(msg => { const bubble = U.el('div', 'ch-chatbubble', content); U.el('small', '', bubble, s.people[msg.author].full + ' / ' + msg.time); U.el('div', '', bubble, msg.text); });
      U.el('div', 'ch-muted', content, 'Messages are visible to everyone in the meeting.');
    }
    function drawMeeting(m) {
      const head = U.el('div', 'ch-head', main), title = U.el('div', '', head);
      U.el('h2', '', title, s.scenario === 'breakout' ? 'Breakout rooms' : 'Team sync');
      U.el('p', '', title, `${s.workspace} / Weekly project review`);
      const tools = U.el('div', 'ch-headtools', head); const manage = button(tools, 'Manage members', 'settings', { settings: true }); icon(manage, 'people', 13); iconButton(tools, 'more', 'Meeting options', null, null);
      const meeting = U.el('div', 'ch-meeting', main), meta = U.el('div', 'ch-callmeta', meeting);
      const live = U.el('span', '', meta); U.el('i', 'ch-live', live); U.el('span', '', live, 'Live / 18:42 / You are the host');
      const secure = U.el('span', '', meta); icon(secure, 'lock', 11); U.el('span', '', secure, 'Encrypted'); icon(secure, 'signal', 11); U.el('span', '', secure, 'Connection stable');
      if (s.scenario === 'breakout') { drawBreakout(meeting, m); return; }
      if (m.share !== null) { const bar = U.el('div', 'ch-sharing', meeting, `You are sharing: ${s.sources[m.share]}  `); button(bar, 'Stop sharing', 'stopShare', { stopShare: true }); }
      const callBody = U.el('div', 'ch-meetingbody', meeting), stage = U.el('div', 'ch-callstage', callBody);
      if (m.share !== null) windowPreview(stage, m.share, true);
      const tiles = U.el('div', 'ch-tiles ch-scroll' + (m.share !== null ? ' ch-filmstrip' : ''), stage); pane(tiles, 'tiles');
      [{ full: 'You', role: 'Host' }, ...s.people].forEach((p, i) => {
        const tile = U.el('div', 'ch-tile' + (i === 0 && m.hand ? ' hand' : '') + (i === 2 ? ' speaker' : ''), tiles);
        const top = U.el('div', 'ch-tiletop', tile); U.el('span', '', top, i === 0 ? 'Your camera' : i === 2 ? 'Speaking' : 'Camera off'); icon(top, 'signal', 11);
        avatar(tile, p);
        const name = U.el('div', 'ch-tilelabel', tile); icon(name, i === 0 ? m.muted ? 'micOff' : 'mute' : i === 2 ? 'mute' : 'micOff', 11); if (i === 0 && m.hand) icon(name, 'hand', 12);
        U.el('span', '', name, `${p.full}${i === 0 ? ' (Host)' : ''}`);
      });
      if (ctx.size.width > 860) callSide(callBody, m);
      const controls = U.el('div', 'ch-controls', meeting);
      for (const [key, kind, label, ev, on] of [
        ['mute', m.muted ? 'micOff' : 'mute', m.muted ? 'Unmute' : 'Mute', { toggle: 'muted' }, m.muted],
        ['camera', 'camera', m.camera ? 'Stop video' : 'Start video', { toggle: 'camera' }, !m.camera],
        ['share', 'share', 'Share screen', { sharePicker: true }, m.share !== null],
        ['hand', 'hand', m.hand ? 'Lower hand' : 'Raise hand', { toggle: 'hand' }, m.hand],
      ]) { const b = button(controls, '', key, ev, on ? 'ch-on' : ''); icon(b, kind, 20); U.el('span', '', b, label); b.setAttribute('aria-pressed', String(on)); }
      for (const [kind, label] of [['threads', 'Chat'], ['people', 'People'], ['grid', 'Rooms'], ['more', 'More']]) { const b = button(controls, '', null, null); icon(b, kind, 19); U.el('span', '', b, label); }
      const leave = button(controls, '', null, null, 'ch-leave'); icon(leave, 'exit', 19); U.el('span', '', leave, 'Leave');
      if (m.sharePicker) {
        const d = modal('Share content', 'shareClose', { sharePicker: false });
        const tabs = U.el('div', 'ch-share-tabs', d.content); U.el('span', '', tabs, 'Entire screen'); U.el('b', '', tabs, 'Window'); U.el('span', '', tabs, 'Browser tab');
        U.el('p', 'ch-muted', d.content, 'Only the selected window will be visible to other participants.');
        const windows = U.el('div', 'ch-windows', d.content);
        s.sources.forEach((name, i) => { const row = U.el('div', 'ch-window', windows); windowPreview(row, i); const b = button(row, name, `source:${i}`, { source: i }, m.source === i ? 'ch-on' : ''); b.setAttribute('aria-pressed', String(m.source === i)); });
        const audio = U.el('div', 'ch-options', d.content); icon(audio, 'checkBox', 13); U.el('span', '', audio, 'Also share system audio');
        const foot = d.footer(); button(foot, 'Cancel', 'shareCancel', { sharePicker: false }); button(foot, 'Share window', 'shareStart', { shareStart: true }, 'ch-primary');
      }
    }
    function drawBreakout(parent, m) {
      const guide = U.el('div', 'ch-breaknotice', parent); icon(guide, 'room', 15); U.el('span', '', guide, 'Session 1 / Small group discussion. Participants stay in the main meeting until rooms are opened.');
      const settings = U.el('div', 'ch-guide', parent, `${s.people.length} participants / ${s.roomNames.length} rooms / Manual assignment / 15 minute session`);
      const board = U.el('div', 'ch-board', parent); board.style.setProperty('--ch-cols', s.roomNames.length + 1);
      const rooms = new Map();
      [-1, ...s.roomNames.map((_, i) => i)].forEach(room => {
        const el = target(`room:${room}`, U.el('section', 'ch-room', board)); rooms.set(room, el);
        const header = U.el('div', 'ch-roomhead', el); icon(header, room === -1 ? 'people' : 'room', 13); U.el('span', '', header, room === -1 ? 'Unassigned' : s.roomNames[room]); U.el('b', 'ch-count', header, m.rooms.filter(x => x === room).length);
        U.el('div', 'ch-roomstatus', el, room === -1 ? 'Main meeting' : m.roomsOpen ? 'In progress' : 'Not started');
        const roster = pane(U.el('div', 'ch-roster ch-scroll', el), `room:${room}`);
        if (!m.rooms.includes(room)) U.el('div', 'ch-empty', roster, room === -1 ? 'Everyone is assigned to a room.' : 'No participants assigned yet.');
        s.people.forEach((p, i) => {
          if (m.rooms[i] !== room) return;
          const card = target(`participant:${i}`, U.el('div', 'ch-participant', roster)); avatar(card, p); const text = U.el('div', '', card); U.el('span', '', text, p.full); U.el('small', '', text, i % 3 === 0 ? 'Desktop / Video off' : 'Desktop / Audio connected');
          card.setAttribute('aria-label', 'Move ' + p.full); card.setAttribute('role', 'button');
          let drop = null;
          env.ui.track(card, {
            start() { card.style.opacity = '.55'; drop = null; },
            move(pt) {
              drop = null;
              for (const [id, r] of rooms) { const rect = r.getBoundingClientRect(); const inside = pt.x >= rect.left && pt.x <= rect.right && pt.y >= rect.top && pt.y <= rect.bottom; r.classList.toggle('drop', inside); if (inside) drop = id; }
            },
            end() { card.style.opacity = ''; for (const r of rooms.values()) r.classList.remove('drop'); if (drop !== null) commit({ assign: [i, drop] }); },
          }, 'assign ' + p.full);
        });
        U.el('div', 'ch-roomfooter', el, room === -1 ? 'Host remains in the main meeting' : 'Room capacity: 12 / Audio & video');
      });
      const tools = U.el('div', 'ch-breaktools', parent), left = U.el('div', '', tools);
      const options = button(left, 'Options', null, null); icon(options, 'settings', 12); button(left, 'Broadcast message', null, null);
      const right = U.el('div', '', tools); U.el('span', 'ch-muted', right, 'Assignments saved'); button(right, m.roomsOpen ? 'Close all rooms' : 'Open all rooms', null, { field: ['roomsOpen', !m.roomsOpen] }, 'ch-primary');
    }
    function paint(m) {
      navChannel.text.textContent = m.name;
      const { draft, channelDraft, editName, editTopic, scrollTargets, ...structure } = m;
      const key = JSON.stringify(structure);
      if (key !== paintKey) {
        for (const [id, p] of panes) offsets[id] = p.scrollTop;
        paintKey = key; reg = new Map(); panes = new Map(); fields = new Map(); main.replaceChildren();
        if (s.scenario === 'meeting' || s.scenario === 'breakout') drawMeeting(m); else drawChat(m);
        if (m.settings) drawSettings(m);
        for (const [id, p] of panes) p.scrollTop = offsets[id] ?? (id === 'messages' ? p.scrollHeight : 0);
      }
      for (const [k, f] of fields) if (f.get() !== m[k]) f.set(m[k]);
      status.replaceChildren();
      for (const fact of F.facts(m, s)) U.el('span', '', status, `${fact.label}: ${fact.value}`);
      const connection = U.el('span', '', status); U.el('i', 'ch-presence', connection); U.el('span', '', connection, ' Connected / All changes saved');
      measure();
    }
    paint(ctx.model);
    return { app, sync: paint, locate(t) { const el = t.control ? reg.get(t.control) : panes.get(t.pane); if (!el || !el.getClientRects().length) throw new Error('use-chat target missing: ' + JSON.stringify(t)); return U.center(el); } };
  }
  env.widget({ task: 'use-chat', site: 'base', name: 'classic', split: 'train',
    scenarios: ['thread', 'pinreact', 'channel', 'meeting', 'breakout'],
    render(ctx) { view = build(ctx); return { anchors: [view.app], sync: m => view.sync(m) }; },
    locate(t) { return view.locate(t); },
  });
})();
