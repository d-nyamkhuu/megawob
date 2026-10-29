/*
 * use-chat/workspace: team workspace, channel administration and meeting host console.
 * Scenarios: thread, pinreact, channel, meeting, breakout. No scenario presets.
 * With design: {}, each scenario reproduces design-use-chat-<scenario>-01 exactly:
 * design-use-chat-thread-01, design-use-chat-pinreact-01, design-use-chat-channel-01,
 * design-use-chat-meeting-01 and design-use-chat-breakout-01.
 * Shared ch-* structural CSS uses the site's palette; site.css can restyle these classes.
 * Only the fixed app frame is an anchor. locate never scrolls; wheel panes mirror hidden targets.
 * There are no RNG draws in the base widget. Extra randomness must use ctx.rng.fork(label).
 *
 * Tokens (defaults):
 *   panel/line/accent/muted/fg/bg: 'var(--<name>)'; CSS palette expressions.
 *   font: '"Segoe UI",system-ui,sans-serif'; workspace font family. fontSize: '12px'.
 *   inset: '8px', radius: '6px': app frame inset and rounding.
 *   railWidth: '43px', navWidth: '177px', compactNavWidth: '141px': navigation widths.
 *   contextWidth: '214px', callSideWidth: '208px': channel/meeting side panels.
 *   threadWidth: '43%', threadMinWidth: '252px': thread panel sizing.
 *   compactAt: 760, wideAt: 1120: stage-width thresholds (px) for compact/wide classes.
 *   contextAt: 1170, callSideAt: 860: show channel/meeting side panels above this stage width.
 *   appLabel: 'Gather team workspace': frame's accessible name. brand: 'Gather': topbar title.
 *   workspaceLetters: ['G', 'N', 'W']: workspace rail badges.
 *   channels: ['announcements', 'project-orbit', 'design-lab', 'release-desk', 'team-lounge',
 *     'help-desk', 'research-hub']: background channel navigation (omits current/target names).
 *   avatarSaturation: 55, avatarLightness: 52, avatarTextLightness: 42: hashed HSL avatar colors (%).
 *   avatarMix: 19, avatarTextMix: 70: avatar background/text mix percentages with panel/fg.
 *   strokes: STROKES, art: ART: complete tables of monochrome paths and colored SVG emoji markup below.
 *
 * Parts: overrides are (base, S) => replacement; all calls use P.
 * S.ctx/spec/app/main/status/navScroll/navChannel/reg/panes/fields/offsets expose live page state;
 * S.D/P expose resolved tokens/parts. Helpers use the current ctx; DOM is built only in render.
 *   navItem(kind, label, count = null, active = false) -> {el, text}: navigation row with icon and optional unread badge.
 *   navGroup(label) -> void: navigation group heading with chevron and add control.
 *   target(k, el) -> el: register a control and its data-chat-control key for oracle lookup.
 *   commit(ev) -> void: apply a task action, flag confirm-mode removal, then repaint.
 *   button(parent, label, key, ev, cls = '') -> button: native button, optional registered target and task-action click handler.
 *   icon(parent, kind, size = 24) -> svg: colored art or monochrome stroke icon; unknown icons use more.
 *   iconButton(parent, kind, label, key, ev, cls = 'ch-iconbtn') -> button: accessible icon button using P.button and P.icon.
 *   avatar(parent, person, cls = '') -> el: initials with a deterministic name-hashed HSL palette.
 *   fileCard(parent, file) -> el: document card with name, size and file icon.
 *   systemLine(parent, text) -> void: background activity line with people icon.
 *   property(parent, label, value) -> void: label/value detail row.
 *   field(parent, key, value, placeholder, textarea = false) -> input/textarea: register a native field and bind model updates through textField.
 *   pane(el, id) -> el: register a synchronous wheel pane and measure its scroll targets.
 *   measure() -> void: mirror offscreen controls and wheel distances into model.scrollTargets.
 *   modal(title, closeKey, ev) -> {box, content, footer()}: accessible dialog, close control and registered wheel pane.
 *   composer(parent, isThread, m) -> void: formatting toolbar, native draft, attachment tools and send control.
 *   message(parent, msg, i, m) -> void: scored message with author, content, thread link, pin and reaction controls.
 *   backgroundMessage(parent, msg, i) -> void: unscored history row with optional file/reaction.
 *   drawChat(m) -> void: assemble channel panels, composer, thread/context and message dialogs.
 *   personRow(parent, p) -> el: avatar, full name and role for directory/meeting lists.
 *   drawSettings(m) -> void: settings dialog and tabs; select about, remove, invite or members panel.
 *   windowPreview(parent, index, large = false) -> el: document/board preview, optionally enlarged for screen sharing.
 *   callSide(parent, m) -> void: meeting participant list and background meeting chat.
 *   drawMeeting(m) -> void: meeting frame, optional breakout board, sharing, tiles, sidebar and controls.
 *   drawBreakout(parent, m) -> void: room board, shared room map and assignment controls.
 *   paint(m) -> void: preserve scroll offsets, redraw changed structure, sync fields/status and measure.
 *   frame(ctx) -> el: fixed workspace anchor with compact/wide classes and navigation width.
 *   topbar(parent) -> void: brand, history, search and account/notification controls.
 *   rail(parent) -> void: workspace badges and add-workspace control.
 *   navigation(parent) -> {el, text}: navigation sidebar; return the active channel row.
 *   body(parent) -> el: horizontal page body.
 *   main(parent) -> el: flexible main panel.
 *   status(parent) -> el: fixed status/footer container.
 *   build(page) -> void: initialize episode state, build frame, paint and run decoration hooks.
 *   chatHeader(m) -> void: channel title, topic, members and channel tools.
 *   channelTabs() -> void: Messages/Files/Pins tabs and project bookmark.
 *   feed(channel, m) -> void: registered message pane with history, messages and own channel posts.
 *   threadPanel(conv, m) -> void: parent message, history, own reply and thread composer.
 *   contextPanel(conv, m) -> void: channel properties, pins, shared files and members.
 *   messageMenu(m) -> void: pin/thread actions and background message menu items.
 *   reactionPicker(m) -> void: reaction dialog, category icons and emoji controls.
 *   settingsAbout(d, m) -> void: channel name/topic fields, metadata and save control (d is P.modal result).
 *   settingsRemove(d, m) -> void: member removal confirmation and cancel/confirm controls.
 *   settingsInvite(d, m) -> void: directory selection rows, selected people and add controls.
 *   settingsMembers(d, m) -> void: member directory with invite/remove controls.
 *   meetingHeader(m) -> void: meeting/breakout title and member-management tools.
 *   meetingMeta(meeting) -> void: live, encryption and connection strip.
 *   meetingControls(meeting, m) -> void: mute/video/share/hand actions and background meeting controls.
 *   sharePicker(m) -> void: window-sharing dialog, previews, audio hint and share/cancel controls.
 *   tile(tiles, p, i, m) -> void: participant tile with camera, speaker, microphone and raised-hand indicators.
 *   room(board, room, rooms, m) -> void: register a room in rooms (Map), draw its roster and bind assignments.
 *   participant(roster, p, i) -> el: registered participant card with avatar, name and connection details.
 *   assignment(card, p, i, rooms) -> void: bind room drag tracking, highlighting and the task assign action.
 *   breakoutNotice(parent, m) -> void: breakout introduction and participant/room/session summary.
 *   breakoutControls(parent, m) -> void: options, broadcast and open/close rooms controls.
 *   styles() -> CSS text: structural stylesheet resolved from tokens.
 *   begin(ctx) -> void: before frame construction (default no-op).
 *   rendered(ctx) -> void: after initial align-layout/paint (default no-op).
 *   painted(m) -> void: after each sync and target measurement (default no-op).
 *   locate(t) -> [x,y]: center of a registered control/pane; throw if absent; never scroll.
 */
(function () {
  'use strict';

  const workspaceCSS = (D) => `
  .ch-app { position:absolute; inset:10px; display:flex; flex-direction:column; overflow:hidden; border:1px solid ${D.line}; border-radius:9px; background:${D.panel}; color:${D.fg}; font:13px/1.4 ${D.font}; box-shadow:0 6px 20px #0001; }
  .ch-app * { box-sizing:border-box; }
  .ch-app button { font:inherit; cursor:pointer; color:inherit; border:1px solid ${D.line}; background:${D.panel}; border-radius:5px; padding:5px 9px; }
  .ch-app button:hover { background:color-mix(in srgb,${D.accent} 12%,${D.panel}); }
  .ch-app button:focus-visible, .ch-app input:focus, .ch-app textarea:focus { outline:2px solid ${D.accent}; outline-offset:1px; }
  .ch-app button.ch-primary { background:${D.accent}; border-color:${D.accent}; color:white; }
  .ch-app button.ch-on { background:color-mix(in srgb,${D.accent} 15%,${D.panel}); color:${D.accent}; border-color:${D.accent}; }
  .ch-top { height:41px; flex:none; display:flex; align-items:center; gap:14px; padding:0 15px; background:color-mix(in srgb,${D.accent} 12%,${D.panel}); border-bottom:1px solid ${D.line}; }
  .ch-brand { font-weight:800; font-size:16px; letter-spacing:-.3px; }
  .ch-search { margin:auto; width:46%; border:1px solid ${D.line}; border-radius:5px; padding:3px 12px; color:${D.muted}; background:${D.panel}; font-size:12px; }
  .ch-body { display:flex; flex:1; min-height:0; }
  .ch-nav { flex:none; padding:14px 9px; width:var(--ch-nav); background:${D.bg}; border-right:1px solid ${D.line}; overflow:hidden; }
  .ch-workspace { font-weight:750; font-size:14px; margin:0 6px 14px; overflow-wrap:anywhere; }
  .ch-navitem { padding:6px 9px; border-radius:5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .ch-navitem.active { color:${D.accent}; background:color-mix(in srgb,${D.accent} 12%,${D.bg}); font-weight:650; }
  .ch-group { color:${D.muted}; margin:14px 9px 4px; font-size:11px; text-transform:uppercase; letter-spacing:.04em; }
  .ch-main { position:relative; display:flex; flex:1; flex-direction:column; min-width:0; min-height:0; overflow:hidden; }
  .ch-head { flex:none; min-height:58px; display:flex; align-items:center; gap:8px; padding:9px 15px; border-bottom:1px solid ${D.line}; }
  .ch-head h2 { margin:0; font-size:17px; line-height:1.3; }
  .ch-head p { margin:2px 0 0; font-size:11px; color:${D.muted}; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:380px; }
  .ch-head>div:first-child { min-width:0; flex:1; }
  .ch-muted { color:${D.muted}; font-size:11px; }
  .ch-conversation { display:flex; flex:1; min-height:0; }
  .ch-channel { display:flex; flex:1; flex-direction:column; min-width:0; }
  .ch-scroll { min-height:0; overflow:auto; overscroll-behavior:contain; scrollbar-width:thin; scrollbar-color:${D.line} transparent; }
  .ch-messages { flex:1; padding:0 0 8px; }
  .ch-day { display:flex; align-items:center; gap:8px; justify-content:center; margin:12px 15px 5px; color:${D.muted}; font-size:11px; }
  .ch-day:before,.ch-day:after { content:''; height:1px; background:${D.line}; flex:1; }
  .ch-message { display:flex; gap:9px; padding:9px 13px; }
  .ch-message:hover { background:${D.bg}; }
  .ch-avatar { flex:none; width:31px; height:31px; border-radius:7px; display:flex; align-items:center; justify-content:center; background:color-mix(in srgb,${D.accent} 16%,${D.panel}); color:${D.accent}; font-weight:750; }
  .ch-messagebody { min-width:0; flex:1; }
  .ch-meta { display:flex; align-items:center; gap:7px; }
  .ch-meta strong { font-size:12px; }
  .ch-text { margin:3px 0 6px; overflow-wrap:anywhere; user-select:text; }
  .ch-actions { display:flex; align-items:center; flex-wrap:wrap; gap:5px; }
  .ch-actions button { padding:2px 6px; font-size:11px; display:inline-flex; align-items:center; gap:4px; }
  .ch-actions .ch-threadlink { border-color:transparent; color:${D.accent}; }
  .ch-pin { color:${D.accent}; font-size:10px; margin-bottom:3px; }
  .ch-compose { flex:none; margin:7px 12px 10px; border:1px solid ${D.line}; border-radius:7px; overflow:hidden; }
  .ch-format { background:${D.bg}; padding:3px 9px; color:${D.muted}; font-size:11px; letter-spacing:3px; }
  .ch-app input,.ch-app textarea { color:${D.fg}; background:${D.panel}; font:inherit; user-select:text; border:1px solid ${D.line}; border-radius:5px; padding:7px; width:100%; }
  .ch-compose textarea { border:0; resize:none; display:block; height:49px; border-radius:0; padding:8px; }
  .ch-sendrow { display:flex; justify-content:space-between; align-items:center; gap:5px; padding:4px 7px; }
  .ch-thread { display:flex; flex-direction:column; width:44%; min-width:245px; max-width:360px; border-left:1px solid ${D.line}; background:${D.panel}; }
  .ch-threadhead { display:flex; align-items:center; justify-content:space-between; padding:9px 12px; border-bottom:1px solid ${D.line}; }
  .ch-threadcontent { flex:1; padding:11px; }
  .ch-threadcontent blockquote { border-left:3px solid ${D.line}; margin:8px 0; padding:0 0 0 9px; overflow-wrap:anywhere; }
  .ch-own { background:${D.bg}; border-radius:6px; margin:9px 0; padding:8px; overflow-wrap:anywhere; }
  .ch-status { flex:none; display:flex; align-items:center; flex-wrap:wrap; gap:6px 19px; min-height:26px; border-top:1px solid ${D.line}; padding:4px 12px; background:${D.bg}; color:${D.muted}; font-size:10px; }
  .ch-status span:last-child { margin-left:auto; }
  .ch-shade { position:absolute; inset:0; z-index:10; background:#0004; display:flex; justify-content:center; align-items:center; padding:10px; }
  .ch-modal { background:${D.panel}; border:1px solid ${D.line}; border-radius:9px; box-shadow:0 16px 40px #0003; display:flex; flex-direction:column; width:440px; max-width:100%; max-height:100%; overflow:hidden; }
  .ch-modalhead { display:flex; justify-content:space-between; align-items:center; gap:12px; padding:11px 15px; border-bottom:1px solid ${D.line}; }
  .ch-modalhead h3 { margin:0; font-size:16px; }
  .ch-modalbody { padding:12px 15px; min-height:0; overflow:auto; }
  .ch-modalbody p { margin:0 0 10px; }
  .ch-modalfoot { padding:9px 15px; border-top:1px solid ${D.line}; display:flex; justify-content:flex-end; gap:8px; flex:none; }
  .ch-tabs { display:flex; border-bottom:1px solid ${D.line}; gap:10px; padding:6px 15px; }
  .ch-tabs button { border:0; border-radius:0; }
  .ch-tabs button.ch-on { border-bottom:2px solid ${D.accent}; }
  .ch-fieldlabel { display:block; margin:0 0 4px; font-weight:650; }
  .ch-field { margin-bottom:12px; }
  .ch-person { display:flex; align-items:center; gap:9px; padding:7px 0; border-bottom:1px solid ${D.line}; }
  .ch-person>div:nth-child(2) { flex:1; min-width:0; }
  .ch-person b { display:block; overflow-wrap:anywhere; }
  .ch-person button { font-size:11px; }
  .ch-emoji { display:grid; grid-template-columns:repeat(3,1fr); gap:9px; }
  .ch-emoji button { font-size:24px; display:flex; flex-direction:column; align-items:center; padding:10px 3px; }
  .ch-emoji small { font-size:10px; }
  .ch-menu { display:flex; flex-direction:column; gap:7px; }
  .ch-meeting { display:flex; flex:1; flex-direction:column; min-height:0; background:${D.bg}; }
  .ch-tiles { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); grid-auto-rows:minmax(85px,1fr); gap:8px; padding:12px; flex:1; min-height:0; overflow:auto; }
  .ch-tile { position:relative; border:1px solid ${D.line}; border-radius:8px; background:${D.panel}; display:flex; align-items:center; justify-content:center; min-height:85px; }
  .ch-tile .ch-avatar { width:44px; height:44px; font-size:17px; border-radius:50%; }
  .ch-tilelabel { position:absolute; bottom:6px; left:8px; right:8px; font-size:10px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .ch-tile.hand { border:2px solid ${D.accent}; }
  .ch-sharing { padding:5px 12px; background:color-mix(in srgb,${D.accent} 15%,${D.panel}); color:${D.accent}; text-align:center; }
  .ch-controls { display:flex; justify-content:center; flex-wrap:wrap; gap:7px; padding:10px; border-top:1px solid ${D.line}; background:${D.panel}; }
  .ch-controls button { display:flex; flex-direction:column; align-items:center; min-width:73px; padding:6px; font-size:11px; }
  .ch-controls i { font-size:19px; font-style:normal; }
  .ch-window { padding:14px; border:1px solid ${D.line}; border-radius:6px; margin-bottom:8px; background:${D.bg}; }
  .ch-window button { width:100%; text-align:left; }
  .ch-preview { height:48px; background:${D.panel}; margin-bottom:8px; border:1px solid ${D.line}; padding:6px; color:${D.muted}; font:9px monospace; }
  .ch-board { display:grid; grid-template-columns:repeat(var(--ch-cols),minmax(0,1fr)); flex:1; min-height:0; gap:9px; padding:12px; background:${D.bg}; }
  .ch-room { display:flex; flex-direction:column; min-height:0; border:1px solid ${D.line}; border-radius:7px; background:${D.panel}; }
  .ch-roomhead { padding:9px; border-bottom:1px solid ${D.line}; font-size:12px; font-weight:700; min-height:40px; }
  .ch-roster { flex:1; min-height:50px; padding:5px; overflow:auto; }
  .ch-participant { display:flex; align-items:center; gap:5px; border:1px solid ${D.line}; border-radius:5px; padding:7px 5px; margin:5px 0; background:${D.bg}; cursor:grab; font-size:11px; overflow-wrap:anywhere; touch-action:none; }
  .ch-participant .ch-avatar { width:23px; height:23px; font-size:9px; border-radius:50%; }
  .ch-empty { padding:15px 5px; text-align:center; color:${D.muted}; font-size:11px; }
  .ch-room.drop { border:2px solid ${D.accent}; background:color-mix(in srgb,${D.accent} 8%,${D.panel}); }
  .ch-guide { padding:7px 14px; border-bottom:1px solid ${D.line}; font-size:11px; color:${D.muted}; }

  .ch-app { inset:${D.inset}; border-radius:${D.radius}; font-size:${D.fontSize}; }
  .ch-app svg { vertical-align:middle; }
  .ch-app button { display:inline-flex; align-items:center; justify-content:center; gap:5px; }
  .ch-top { height:36px; padding:0 10px; gap:10px; }
  .ch-brand { display:flex; align-items:center; gap:7px; font-size:14px; }
  .ch-toptools { display:flex; align-items:center; gap:7px; }
  .ch-iconbtn { border:0!important; background:transparent!important; padding:3px!important; color:${D.muted}!important; }
  .ch-top .ch-iconbtn { color:${D.fg}!important; }
  .ch-search { display:flex; align-items:center; gap:7px; width:43%; height:25px; }
  .ch-search kbd { margin-left:auto; font:9px inherit; border:1px solid ${D.line}; border-radius:3px; padding:0 3px; }
  .ch-rail { width:${D.railWidth}; flex:none; display:flex; flex-direction:column; align-items:center; gap:12px; background:color-mix(in srgb,${D.accent} 9%,${D.bg}); border-right:1px solid ${D.line}; padding:12px 4px; }
  .ch-workspaceicon { display:flex; align-items:center; justify-content:center; width:29px; height:29px; border-radius:8px; font-weight:800; border:1px solid ${D.line}; background:${D.panel}; }
  .ch-workspaceicon.active { outline:2px solid ${D.accent}; outline-offset:2px; color:${D.accent}; }
  .ch-rail .ch-me { margin-top:auto; }
  .ch-nav { width:var(--ch-nav); padding:10px 7px 0; display:flex; flex-direction:column; }
  .ch-workspace { display:flex; align-items:flex-start; justify-content:space-between; gap:5px; margin:0 5px 8px; font-size:12px; }
  .ch-navscroll { flex:1; min-height:0; overflow:auto; scrollbar-width:thin; }
  .ch-navitem { display:flex; align-items:center; gap:7px; height:27px; padding:4px 7px; font-size:11px; }
  .ch-navitem>span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .ch-navitem svg { flex:none; }
  .ch-navitem .ch-badge { margin-left:auto; flex:none; font-size:9px; border-radius:4px; background:${D.accent}; color:white; padding:0 4px; }
  .ch-group { display:flex; align-items:center; gap:5px; margin:11px 7px 3px; font-size:10px; text-transform:none; font-weight:650; letter-spacing:0; }
  .ch-group button { margin-left:auto; }
  .ch-presence { width:7px; height:7px; border-radius:50%; background:#3a9c79; display:inline-block; flex:none; }
  .ch-presence.away { border:1px solid ${D.muted}; background:transparent; }
  .ch-navfoot { flex:none; padding:7px 3px; border-top:1px solid ${D.line}; display:flex; align-items:center; gap:7px; font-size:10px; }
  .ch-navfoot .ch-avatar { width:24px; height:24px; font-size:10px; }
  .ch-head { min-height:51px; padding:7px 12px; }
  .ch-head h2 { font-size:15px; display:flex; align-items:center; gap:5px; }
  .ch-head p { max-width:400px; font-size:10px; }
  .ch-headtools { display:flex; align-items:center; gap:5px; }
  .ch-channelnav { display:flex; align-items:center; gap:14px; height:31px; flex:none; padding:0 13px; border-bottom:1px solid ${D.line}; font-size:10px; color:${D.muted}; }
  .ch-channelnav span { display:flex; align-items:center; gap:4px; height:100%; }
  .ch-channelnav .selected { color:${D.fg}; font-weight:700; border-bottom:2px solid ${D.accent}; }
  .ch-channelnav .ch-bookmark { margin-left:auto; }
`;

  const detailCSS = (D) => `  .ch-message { padding:6px 12px; gap:8px; }
  .ch-avatar { width:29px; height:29px; position:relative; font-size:10px; }
  .ch-avatar .ch-presence { position:absolute; bottom:-1px; right:-2px; border:2px solid ${D.panel}; width:9px; height:9px; }
  .ch-meta strong { font-size:11px; }
  .ch-text { font-size:12px; margin:2px 0 4px; line-height:1.45; }
  .ch-day { margin:10px 12px 6px; font-size:10px; }
  .ch-unread { display:flex; align-items:center; gap:6px; color:${D.accent}; font-size:9px; margin:10px 12px; }
  .ch-unread:before,.ch-unread:after { content:''; height:1px; background:${D.accent}; flex:1; opacity:.4; }
  .ch-system { display:flex; gap:7px; align-items:center; color:${D.muted}; font-size:10px; margin:8px 13px; }
  .ch-filecard { display:flex; align-items:center; gap:8px; border:1px solid ${D.line}; border-radius:6px; padding:7px 9px; max-width:260px; margin:6px 0; background:${D.panel}; }
  .ch-filecard strong { display:block; font-size:10px; overflow-wrap:anywhere; }
  .ch-filecard small { color:${D.muted}; font-size:9px; }
  .ch-reaction { display:inline-flex; align-items:center; gap:4px; padding:1px 5px; border:1px solid ${D.line}; border-radius:10px; font-size:10px; }
  .ch-previewlink { border-left:3px solid ${D.accent}; padding:6px 9px; margin:5px 0; background:${D.bg}; font-size:11px; }
  .ch-previewlink strong { color:${D.accent}; }
  .ch-facepile { display:flex; margin-right:3px; }
  .ch-facepile .ch-avatar { width:16px; height:16px; margin-right:-4px; border:1px solid ${D.panel}; border-radius:4px; font-size:6px; }
  .ch-threadlink { font-size:10px!important; font-weight:650; }
  .ch-pin { display:flex; align-items:center; gap:5px; }
  .ch-compose { margin:5px 10px 7px; }
  .ch-format { display:flex; align-items:center; gap:2px; height:27px; padding:2px 5px; letter-spacing:0; }
  .ch-format button { width:24px; height:22px; }
  .ch-compose textarea { height:44px; font-size:11px; }
  .ch-sendrow { padding:4px 6px; height:31px; }
  .ch-composehint { font-size:9px; color:${D.muted}; margin:0 12px 5px; }
  .ch-composetools { display:flex; align-items:center; gap:4px; }
  .ch-context { width:${D.contextWidth}; flex:none; border-left:1px solid ${D.line}; overflow:auto; padding:12px; font-size:11px; background:${D.panel}; }
  .ch-context h4 { font-size:11px; margin:2px 0 10px; display:flex; align-items:center; gap:6px; }
  .ch-context h5 { color:${D.muted}; font-size:10px; margin:15px 0 7px; text-transform:uppercase; letter-spacing:.04em; }
  .ch-context p { font-size:10px; line-height:1.5; margin:5px 0 10px; }
  .ch-context .ch-filecard { padding:6px; }
  .ch-context .ch-person { font-size:10px; padding:6px 0; }
  .ch-context .ch-person b { font-size:10px; }
  .ch-context .ch-person .ch-avatar { width:23px; height:23px; font-size:8px; }
  .ch-thread { width:${D.threadWidth}; min-width:${D.threadMinWidth}; }
  .ch-threadhead { padding:8px 10px; }
  .ch-threadcontent { padding:10px; }
  .ch-replyrow { display:flex; gap:7px; padding:9px 0; border-bottom:1px solid color-mix(in srgb,${D.line} 60%,transparent); }
  .ch-replyrow .ch-avatar { width:25px; height:25px; font-size:9px; }
  .ch-replyrow>div:last-child { min-width:0; flex:1; }
  .ch-threadsummary { margin:10px 0 4px; border-top:1px solid ${D.line}; padding-top:7px; font-size:10px; color:${D.muted}; }
  .ch-modal { width:470px; border-radius:8px; }
  .ch-modalhead { padding:10px 14px; }
  .ch-modalhead h3 { font-size:15px; }
  .ch-modalbody { padding:12px 14px; }
  .ch-property { padding:9px 0; border-top:1px solid ${D.line}; display:flex; justify-content:space-between; gap:9px; font-size:10px; }
  .ch-field small { display:block; font-size:10px; color:${D.muted}; margin-top:4px; }
  .ch-directoryhead { display:flex; align-items:center; gap:8px; background:${D.bg}; border:1px solid ${D.line}; padding:6px 8px; margin-bottom:9px; border-radius:5px; color:${D.muted}; font-size:10px; }
  .ch-person button { flex:none; }
  .ch-directorytag { margin-left:auto; font-size:9px; color:${D.muted}; }
  .ch-selected { display:flex; flex-wrap:wrap; gap:4px; margin:6px 0 9px; }
  .ch-selected span { background:color-mix(in srgb,${D.accent} 12%,${D.panel}); border-radius:4px; padding:3px 6px; font-size:10px; }
  .ch-emoji { grid-template-columns:repeat(6,minmax(0,1fr)); gap:4px; }
  .ch-emoji button { padding:7px 2px; min-height:43px; border-color:transparent; }
  .ch-emoji small { font-size:8px; max-width:50px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
  .ch-emojicats { display:flex; justify-content:space-between; border-bottom:1px solid ${D.line}; margin-bottom:10px; padding:5px 0 8px; color:${D.muted}; }
  .ch-emojicats svg:first-child { color:${D.accent}; }
  .ch-emojiheading { color:${D.muted}; font-size:10px; margin:12px 0 6px; }
  .ch-emoji-preview { margin-top:12px; padding-top:9px; border-top:1px solid ${D.line}; display:flex; align-items:center; gap:7px; font-size:10px; color:${D.muted}; }
  .ch-menu button { justify-content:flex-start; border:0; padding:6px 8px; font-size:11px; }
  .ch-menu button kbd { margin-left:auto; color:${D.muted}; font-size:9px; }
  .ch-menuhr { border-top:1px solid ${D.line}; margin:3px 0; }
  .ch-meetingbody { display:flex; flex:1; min-height:0; }
  .ch-callstage { display:flex; flex:1; min-width:0; flex-direction:column; }
  .ch-callmeta { display:flex; justify-content:space-between; align-items:center; gap:9px; padding:6px 12px; font-size:10px; color:${D.muted}; border-bottom:1px solid ${D.line}; background:${D.panel}; }
  .ch-callmeta>span { display:flex; align-items:center; gap:5px; }
  .ch-live { width:6px; height:6px; border-radius:50%; background:#dd5b62; display:inline-block; }
  .ch-tiles { grid-template-columns:repeat(2,minmax(0,1fr)); gap:6px; padding:9px; grid-auto-rows:minmax(83px,1fr); }
  .ch-wide .ch-tiles { grid-template-columns:repeat(3,minmax(0,1fr)); }
  .ch-tile { background:linear-gradient(135deg,color-mix(in srgb,${D.accent} 5%,${D.panel}),${D.panel}); border-radius:6px; }
  .ch-tile.speaker { border:2px solid ${D.accent}; }
  .ch-tilelabel { display:flex; align-items:center; gap:4px; bottom:6px; font-size:9px; }
  .ch-tilelabel span { overflow:hidden; text-overflow:ellipsis; }
  .ch-tile .ch-avatar { width:40px; height:40px; font-size:15px; }
  .ch-tiletop { position:absolute; top:6px; left:7px; right:7px; display:flex; justify-content:space-between; color:${D.muted}; font-size:8px; }
  .ch-callside { width:${D.callSideWidth}; flex:none; display:flex; flex-direction:column; border-left:1px solid ${D.line}; background:${D.panel}; min-height:0; }
  .ch-callsidehead { padding:8px 10px; border-bottom:1px solid ${D.line}; font-size:11px; font-weight:700; }
  .ch-callsidecontent { min-height:0; flex:1; padding:8px 10px; overflow:auto; }
  .ch-callside .ch-person { padding:5px 0; font-size:9px; }
  .ch-callside .ch-person .ch-avatar { width:22px; height:22px; font-size:8px; }
  .ch-callside .ch-person b { font-size:10px; }
  .ch-chatbubble { margin:8px 0; padding:7px; border-radius:6px; font-size:10px; background:${D.bg}; }
  .ch-chatbubble small { display:block; color:${D.muted}; font-size:9px; margin-bottom:3px; }
  .ch-controls { flex:none; gap:5px; padding:7px; flex-wrap:nowrap; }
  .ch-controls button { min-width:51px; padding:4px 6px; font-size:9px; border:0; background:transparent; gap:3px; }
  .ch-controls .ch-leave { background:color-mix(in srgb,#bc3f4e 10%,${D.panel}); color:#bc3f4e; margin-left:auto; }
  .ch-share-tabs { display:flex; gap:14px; font-size:11px; border-bottom:1px solid ${D.line}; margin-bottom:10px; padding:0 0 8px; }
  .ch-share-tabs b { color:${D.accent}; }
  .ch-windows { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px; }
  .ch-window { padding:6px; margin:0; min-width:0; }
  .ch-window button { font-size:10px; padding:5px 3px; min-height:35px; justify-content:center; }
  .ch-preview { height:87px; padding:0; overflow:hidden; margin-bottom:4px; }
  .ch-previewbar { height:11px; display:flex; align-items:center; gap:3px; background:${D.bg}; border-bottom:1px solid ${D.line}; padding:0 4px; }
  .ch-previewlarge { height:auto; min-height:120px; flex:1; margin:9px 9px 0; border-radius:5px; }
  .ch-previewlarge .ch-previewbar { height:19px; font-size:9px; }
  .ch-previewlarge .ch-previewpage { height:calc(100% - 19px); min-height:100px; }
  .ch-previewlarge .ch-previewdoc { padding:10px 15px; }
  .ch-previewlarge .ch-previewdoc b { height:auto; background:none; color:${D.fg}; font-size:14px; width:100%; }
  .ch-previewlarge .ch-previewdoc p { font-size:10px; color:${D.muted}; }
  .ch-previewlarge .ch-previewdoc i { margin:7px 0; }
  .ch-previewlarge .ch-previewcolumns i { height:24px; font-size:8px; font-style:normal; padding:4px; }
  .ch-filmstrip { flex:none; height:94px; grid-template-columns:repeat(3,minmax(0,1fr)); grid-auto-rows:76px; padding:6px 9px; }
  .ch-filmstrip .ch-tile .ch-avatar { width:26px; height:26px; font-size:10px; }
  .ch-filmstrip .ch-tiletop { display:none; }
  .ch-previewbar i { width:3px; height:3px; border-radius:50%; background:${D.muted}; opacity:.5; }
  .ch-previewpage { display:flex; height:calc(100% - 11px); }
  .ch-previewnav { width:15%; background:${D.bg}; border-right:1px solid ${D.line}; }
  .ch-previewdoc { padding:7px; flex:1; }
  .ch-previewdoc b { display:block; height:4px; background:${D.accent}; width:60%; margin-bottom:7px; }
  .ch-previewdoc i { display:block; height:2px; background:${D.line}; margin:4px 0; width:90%; }
  .ch-previewdoc i:nth-child(odd) { width:65%; }
  .ch-previewcolumns { display:flex; gap:4px; height:100%; }
  .ch-previewcolumns div { flex:1; background:${D.bg}; padding:3px; }
  .ch-previewcolumns i { height:9px; background:color-mix(in srgb,${D.accent} 13%,${D.panel}); margin:4px 0; width:100%; }
  .ch-options { display:flex; gap:6px; align-items:center; margin-top:11px; font-size:10px; color:${D.muted}; }
  .ch-board { gap:7px; padding:9px; }
  .ch-roomhead { padding:8px; font-size:11px; display:flex; align-items:center; gap:5px; min-height:37px; }
  .ch-roomhead>span { min-width:0; overflow-wrap:anywhere; }
  .ch-roomhead .ch-count { margin-left:auto; color:${D.muted}; font-size:10px; }
  .ch-roomstatus { padding:5px 8px; font-size:9px; color:${D.muted}; border-bottom:1px solid ${D.line}; background:${D.bg}; }
  .ch-participant { padding:6px 5px; background:${D.panel}; gap:5px; }
  .ch-participant>div:last-child { min-width:0; flex:1; }
  .ch-participant small { display:block; color:${D.muted}; font-size:8px; margin-top:2px; }
  .ch-roomfooter { border-top:1px solid ${D.line}; padding:6px 8px; font-size:9px; color:${D.muted}; }
  .ch-breaktools { padding:7px 10px; border-top:1px solid ${D.line}; background:${D.panel}; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; font-size:10px; }
  .ch-breaktools>div { display:flex; align-items:center; gap:5px; }
  .ch-breaktools button { font-size:10px; padding:4px 7px; }
  .ch-breaknotice { margin:8px 10px 0; padding:7px 9px; border:1px solid ${D.line}; border-radius:5px; font-size:10px; display:flex; align-items:flex-start; gap:6px; background:${D.panel}; }
  .ch-status { min-height:23px; font-size:9px; padding:3px 10px; }
  .ch-compact .ch-rail { display:none; }
  .ch-compact .ch-headtools .ch-iconbtn,.ch-compact .ch-channelnav .ch-bookmark { display:none!important; }
  .ch-compact .ch-controls button { min-width:42px; padding:4px; }
  `;

  const CSS = (D) => workspaceCSS(D) + detailCSS(D);

  const STROKES = {
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
  const ART = {
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

  const TOKENS = {
    panel: 'var(--panel)', line: 'var(--line)', accent: 'var(--accent)',
    muted: 'var(--muted)', fg: 'var(--fg)', bg: 'var(--bg)',
    font: '"Segoe UI",system-ui,sans-serif', fontSize: '12px', inset: '8px', radius: '6px',
    railWidth: '43px', navWidth: '177px', compactNavWidth: '141px',
    contextWidth: '214px', callSideWidth: '208px', threadWidth: '43%', threadMinWidth: '252px',
    compactAt: 760, wideAt: 1120, contextAt: 1170, callSideAt: 860,
    appLabel: 'Gather team workspace', brand: 'Gather', workspaceLetters: ['G', 'N', 'W'],
    channels: ['announcements', 'project-orbit', 'design-lab', 'release-desk', 'team-lounge', 'help-desk', 'research-hub'],
    avatarSaturation: 55, avatarLightness: 52, avatarTextLightness: 42, avatarMix: 19, avatarTextMix: 70,
    strokes: STROKES, art: ART,
  };

  function controlParts(BASE, state) {
    BASE.navItem = (kind, label, count = null, active = false) => {
      const el = state.U.el('div', 'ch-navitem' + (active ? ' active' : ''), state.navScroll); state.P.icon(el, kind, 13); const text = state.U.el('span', '', el, label);
      if (count !== null) state.U.el('b', 'ch-badge', el, count);
      return { el, text };
    };
    BASE.navGroup = (label) => { const row = state.U.el('div', 'ch-group', state.navScroll); state.P.icon(row, 'chevron', 10); state.U.el('span', '', row, label); state.P.iconButton(row, 'plus', 'Add ' + label.toLowerCase(), null, null); };
    BASE.target = (k, el) => { state.reg.set(k, el); el.dataset.chatControl = k; return el; };
    BASE.commit = (ev) => {
      if (ev.removeConfirm && state.s.judge?.mode === 'confirm') { state.ctx.flag('irreversible'); return; }
      state.ctx.update(state.F.helpers.act(state.ctx.model, state.s, ev));
      state.P.paint(state.ctx.model);
    };
    BASE.button = (parent, label, key, ev, cls = '') => {
      const b = state.U.el('button', cls, parent, label); b.type = 'button';
      if (key) state.P.target(key, b);
      if (ev) b.addEventListener('click', () => state.P.commit(typeof ev === 'function' ? ev() : ev));
      return b;
    };
    BASE.icon = (parent, kind, size = 24) => {
      const svg = state.U.svg('svg', { viewBox: '0 0 24 24', width: size, height: size, 'aria-hidden': 'true' }, parent);
      svg.innerHTML = state.D.art[kind] || `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${state.D.strokes[kind] || state.D.strokes.more}</g>`;
      svg.style.flexShrink = '0';
      return svg;
    };
    BASE.iconButton = (parent, kind, label, key, ev, cls = 'ch-iconbtn') => {
      const b = state.P.button(parent, '', key, ev, cls); b.setAttribute('aria-label', label); b.title = label; state.P.icon(b, kind, 15); return b;
    };
    BASE.avatar = (parent, person, cls = '') => {
      const el = state.U.el('div', 'ch-avatar ' + cls, parent, person.full.split(/\s+/).map(x => x[0]).slice(0, 2).join(''));
      const hue = state.U.hash32(person.full) % 360;
      el.style.background = `color-mix(in srgb,hsl(${hue} ${state.D.avatarSaturation}% ${state.D.avatarLightness}%) ${state.D.avatarMix}%,${state.D.panel})`;
      el.style.color = `color-mix(in srgb,hsl(${hue} ${state.D.avatarSaturation}% ${state.D.avatarTextLightness}%) ${state.D.avatarTextMix}%,${state.D.fg})`;
      return el;
    };
    BASE.fileCard = (parent, file) => {
      const row = state.U.el('div', 'ch-filecard', parent); state.P.icon(row, 'file', 23); const text = state.U.el('div', '', row);
      state.U.el('strong', '', text, file.name); state.U.el('small', '', text, file.size + ' / PDF document');
      return row;
    };
    BASE.systemLine = (parent, text) => { const line = state.U.el('div', 'ch-system', parent); state.P.icon(line, 'people', 12); state.U.el('span', '', line, text); };
    BASE.property = (parent, label, value) => { const row = state.U.el('div', 'ch-property', parent); state.U.el('b', '', row, label); state.U.el('span', '', row, value); };
    BASE.field = (parent, key, value, placeholder, textarea = false) => {
      const el = state.P.target(key, state.U.el(textarea ? 'textarea' : 'input', '', parent));
      el.setAttribute('aria-label', placeholder); el.placeholder = placeholder; el.spellcheck = false;
      state.fields.set(key, env.ui.textField(el, { value, onInput: v => state.P.commit({ field: [key, v] }) }));
      return el;
    };
    BASE.pane = (el, id) => {
      el.dataset.chatPane = id; state.panes.set(id, el);
      env.ui.scrollPane(el, { onScroll: () => state.P.measure() });
      el.addEventListener('scroll', () => { if (el.isConnected) state.P.measure(); });
      return el;
    };
    BASE.measure = () => {
      if (!state.app.isConnected) return;
      const scrollTargets = {};
      for (const [k, el] of state.reg) {
        const p = el.closest('[data-chat-pane]');
        if (!p || !el.getClientRects().length) continue;
        const r = el.getBoundingClientRect(), pr = p.getBoundingClientRect();
        if (r.top < pr.top + 2 || r.bottom > pr.bottom - 2) scrollTargets[k] = { pane: p.dataset.chatPane, dy: Math.round((r.top + r.bottom - pr.top - pr.bottom) / 2) };
      }
      if (JSON.stringify(scrollTargets) !== JSON.stringify(state.ctx.model.scrollTargets)) state.ctx.update({ ...state.ctx.model, scrollTargets });
    };
    BASE.modal = (title, closeKey, ev) => {
      const shade = state.U.el('div', 'ch-shade', state.main), box = state.U.el('section', 'ch-modal', shade);
      box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', title); box.setAttribute('aria-modal', 'true');
      const head = state.U.el('div', 'ch-modalhead', box); state.U.el('h3', '', head, title);
      state.P.iconButton(head, 'close', 'Close ' + title, closeKey, ev);
      const content = state.P.pane(state.U.el('div', 'ch-modalbody ch-scroll', box), 'modal');
      return { box, content, footer: () => state.U.el('div', 'ch-modalfoot', box) };
    };
  }

  function messageParts(BASE, state) {
    BASE.composer = (parent, isThread, m) => {
      const box = state.U.el('div', 'ch-compose', parent), format = state.U.el('div', 'ch-format', box);
      for (const [kind, label] of [['bold', 'Bold'], ['italic', 'Italic'], ['link', 'Insert link'], ['list', 'List'], ['code', 'Code']]) state.P.iconButton(format, kind, label, null, null);
      state.P.field(box, isThread ? 'draft' : 'channelDraft', isThread ? m.draft : m.channelDraft, isThread ? 'Reply in thread...' : `Message #${m.name}`, true);
      const row = state.U.el('div', 'ch-sendrow', box), tools = state.U.el('div', 'ch-composetools', row);
      for (const [kind, label] of [['plus', 'Add attachment'], ['smile', 'Insert reaction'], ['clip', 'Attach file']]) state.P.iconButton(tools, kind, label, null, null);
      const send = state.P.button(row, isThread && m.replies[m.thread] ? 'Update reply' : 'Send', isThread ? 'send' : 'channelSend', isThread ? { send: true } : { channelSend: true }, 'ch-primary'); state.P.icon(send, 'send', 12);
      state.U.el('div', 'ch-composehint', parent, isThread ? 'Replies stay in this thread' : 'Formatting supported / Your draft is only visible to you');
    };
    BASE.message = (parent, msg, i, m) => {
      const row = state.U.el('article', 'ch-message', parent), person = state.s.people[msg.author]; state.P.avatar(row, person);
      const content = state.U.el('div', 'ch-messagebody', row);
      if (m.pins[i]) { const pin = state.U.el('div', 'ch-pin', content); state.P.icon(pin, 'pin', 10); state.U.el('span', '', pin, 'Pinned to this channel'); }
      const meta = state.U.el('div', 'ch-meta', content); state.U.el('strong', '', meta, person.full); state.U.el('span', 'ch-muted', meta, msg.time); if (i === 1) state.U.el('span', 'ch-muted', meta, '(edited)');
      state.U.el('div', 'ch-text', content, msg.text);
      if (i === 1) state.P.fileCard(content, state.s.sharedFiles[0]);
      if (i === 3) { const preview = state.U.el('div', 'ch-previewlink', content); state.U.el('strong', '', preview, 'Workspace notes / Weekly handoff'); state.U.el('div', 'ch-muted', preview, 'Decisions, open questions and links for the next review.'); }
      const acts = state.U.el('div', 'ch-actions', content), faces = state.U.el('div', 'ch-facepile', acts);
      [1, 2].forEach(offset => state.P.avatar(faces, state.s.people[(msg.author + offset) % state.s.people.length]));
      state.P.button(acts, `${msg.replies + Number(!!m.replies[i])} replies`, `thread:${i}`, { openThread: i }, 'ch-threadlink');
      state.U.el('span', 'ch-muted', acts, 'Last reply today');
      if (state.s.scenario === 'pinreact') {
        state.P.iconButton(acts, 'smile', 'Add reaction to ' + msg.text, `react:${i}`, { picker: i });
        state.P.iconButton(acts, 'more', 'Message actions for ' + msg.text, `more:${i}`, { menu: i });
        if (m.reactions[i]) { const reaction = state.P.button(acts, '', `clearReaction:${i}`, { clearReaction: i }, 'ch-on'); state.P.icon(reaction, m.reactions[i], 13); state.U.el('span', '', reaction, msg.reactions + 1); reaction.setAttribute('aria-label', 'Remove your ' + state.F.helpers.EMOJI[m.reactions[i]][1] + ' reaction'); }
        else { const rx = state.U.el('span', 'ch-reaction', acts); state.P.icon(rx, 'thumbsup', 12); state.U.el('span', '', rx, msg.reactions); }
      }
    };
    BASE.backgroundMessage = (parent, msg, i) => {
      const row = state.U.el('article', 'ch-message', parent); state.P.avatar(row, state.s.people[msg.author]); const content = state.U.el('div', 'ch-messagebody', row);
      const meta = state.U.el('div', 'ch-meta', content); state.U.el('strong', '', meta, state.s.people[msg.author].full); state.U.el('span', 'ch-muted', meta, msg.time);
      state.U.el('div', 'ch-text', content, msg.text);
      if (msg.attachment) state.P.fileCard(content, { name: msg.attachment, size: '284 KB' });
      if (i % 4 === 1) { const rx = state.U.el('span', 'ch-reaction', content); state.P.icon(rx, i % 2 ? 'check' : 'heart', 12); state.U.el('span', '', rx, 2 + i % 5); }
    };
    BASE.drawChat = (m) => {
      state.P.chatHeader(m);
      state.P.channelTabs();
      const conv = state.U.el('div', 'ch-conversation', state.main), channel = state.U.el('div', 'ch-channel', conv);
      state.P.feed(channel, m);
      state.P.composer(channel, false, m);
      if (m.thread !== null) {
        state.P.threadPanel(conv, m);
      }
      if (m.thread === null && state.ctx.size.width > state.D.contextAt) {
        state.P.contextPanel(conv, m);
      }
      if (m.menu !== null) {
        state.P.messageMenu(m);
      }
      if (m.picker !== null) {
        state.P.reactionPicker(m);
      }
    };
    BASE.personRow = (parent, p) => { const row = state.U.el('div', 'ch-person', parent); state.P.avatar(row, p); const label = state.U.el('div', '', row); state.U.el('b', '', label, p.full); state.U.el('small', 'ch-muted', label, p.role); return row; };
    BASE.drawSettings = (m) => {
      const d = state.P.modal(['meeting', 'breakout'].includes(state.s.scenario) ? 'Meeting participants' : '#' + m.name, 'settingsClose', { settings: false });
      const tabs = state.U.el('div', 'ch-tabs', d.box); d.box.insertBefore(tabs, d.content);
      for (const [tab, label] of [['about', 'About'], ['members', `Members (${m.members.length})`]]) state.P.button(tabs, label, `tab:${tab}`, { tab }, m.tab === tab ? 'ch-on' : '');
      if (m.tab === 'about') {
        state.P.settingsAbout(d, m);
      } else if (m.remove !== null) {
        state.P.settingsRemove(d, m);
      } else if (m.invite) {
        state.P.settingsInvite(d, m);
      } else {
        state.P.settingsMembers(d, m);
      }
    };
  }

  function meetingParts(BASE, state) {
    BASE.windowPreview = (parent, index, large = false) => {
      const preview = state.U.el('div', 'ch-preview' + (large ? ' ch-previewlarge' : ''), parent), bar = state.U.el('div', 'ch-previewbar', preview);
      for (let i = 0; i < 3; i++) state.U.el('i', '', bar);
      if (large) state.U.el('span', '', bar, state.s.sources[index]);
      const page = state.U.el('div', 'ch-previewpage', preview); state.U.el('div', 'ch-previewnav', page);
      const doc = state.U.el('div', 'ch-previewdoc', page);
      if (index === 1) {
        const cols = state.U.el('div', 'ch-previewcolumns', doc);
        for (const title of ['To do', 'In progress', 'Review']) { const col = state.U.el('div', '', cols); if (large) state.U.el('small', '', col, title); for (let i = 0; i < 3; i++) { const card = state.U.el('i', '', col); if (large) card.textContent = ['Review checklist', 'Update project notes', 'Team handoff'][i]; } }
      } else {
        state.U.el('b', '', doc, large ? state.s.sources[index] : '');
        if (large) state.U.el('p', '', doc, index === 0 ? 'Weekly team sync / Decisions and action items' : 'Research review / Findings and next steps');
        for (let i = 0; i < 7; i++) state.U.el('i', '', doc);
      }
      return preview;
    };
    BASE.callSide = (parent, m) => {
      const side = state.U.el('aside', 'ch-callside', parent); state.U.el('div', 'ch-callsidehead', side, `People (${state.s.people.length + 1})`);
      const content = state.P.pane(state.U.el('div', 'ch-callsidecontent ch-scroll', side), 'callside');
      state.U.el('div', 'ch-directoryhead', content, 'In this meeting');
      [{ full: 'You', role: 'Host' }, ...state.s.people].forEach((p, i) => {
        const row = state.P.personRow(content, p); state.P.icon(row, i === 0 && !m.muted ? 'mute' : 'micOff', 11); if (i === 0 && m.hand) state.P.icon(row, 'hand', 12);
      });
      state.U.el('div', 'ch-threadsummary', content, 'Meeting chat / Everyone');
      (state.s.history || []).slice(0, 3).forEach(msg => { const bubble = state.U.el('div', 'ch-chatbubble', content); state.U.el('small', '', bubble, state.s.people[msg.author].full + ' / ' + msg.time); state.U.el('div', '', bubble, msg.text); });
      state.U.el('div', 'ch-muted', content, 'Messages are visible to everyone in the meeting.');
    };
    BASE.drawMeeting = (m) => {
      state.P.meetingHeader(m);
      const meeting = state.U.el('div', 'ch-meeting', state.main);
      state.P.meetingMeta(meeting);
      if (state.s.scenario === 'breakout') { state.P.drawBreakout(meeting, m); return; }
      if (m.share !== null) { const bar = state.U.el('div', 'ch-sharing', meeting, `You are sharing: ${state.s.sources[m.share]}  `); state.P.button(bar, 'Stop sharing', 'stopShare', { stopShare: true }); }
      const callBody = state.U.el('div', 'ch-meetingbody', meeting), stage = state.U.el('div', 'ch-callstage', callBody);
      if (m.share !== null) state.P.windowPreview(stage, m.share, true);
      const tiles = state.U.el('div', 'ch-tiles ch-scroll' + (m.share !== null ? ' ch-filmstrip' : ''), stage); state.P.pane(tiles, 'tiles');
      [{ full: 'You', role: 'Host' }, ...state.s.people].forEach((p, i) => {
        state.P.tile(tiles, p, i, m);
      });
      if (state.ctx.size.width > state.D.callSideAt) state.P.callSide(callBody, m);
      state.P.meetingControls(meeting, m);
      if (m.sharePicker) {
        state.P.sharePicker(m);
      }
    };
    BASE.drawBreakout = (parent, m) => {
      state.P.breakoutNotice(parent, m);
      const board = state.U.el('div', 'ch-board', parent); board.style.setProperty('--ch-cols', state.s.roomNames.length + 1);
      const rooms = new Map();
      [-1, ...state.s.roomNames.map((_, i) => i)].forEach(room => {
        state.P.room(board, room, rooms, m);
      });
      state.P.breakoutControls(parent, m);
    };
  }

  function frameParts(BASE, state) {
    BASE.paint = (m) => {
      state.navChannel.text.textContent = m.name;
      const { draft, channelDraft, editName, editTopic, scrollTargets, ...structure } = m;
      const key = JSON.stringify(structure);
      if (key !== state.paintKey) {
        for (const [id, p] of state.panes) state.offsets[id] = p.scrollTop;
        state.paintKey = key; state.reg = new Map(); state.panes = new Map(); state.fields = new Map(); state.main.replaceChildren();
        if (state.s.scenario === 'meeting' || state.s.scenario === 'breakout') state.P.drawMeeting(m); else state.P.drawChat(m);
        if (m.settings) state.P.drawSettings(m);
        for (const [id, p] of state.panes) p.scrollTop = state.offsets[id] ?? (id === 'messages' ? p.scrollHeight : 0);
      }
      for (const [k, f] of state.fields) if (f.get() !== m[k]) f.set(m[k]);
      state.status.replaceChildren();
      for (const fact of state.F.facts(m, state.s)) state.U.el('span', '', state.status, `${fact.label}: ${fact.value}`);
      const connection = state.U.el('span', '', state.status); state.U.el('i', 'ch-presence', connection); state.U.el('span', '', connection, ' Connected / All changes saved');
      state.P.measure();
      state.P.painted(m);
    };
    BASE.frame = (ctx) => {
      const el = state.U.el('section', 'ch-app', ctx.stage);
      el.setAttribute('aria-label', state.D.appLabel);
      const compact = ctx.size.width < state.D.compactAt;
      el.classList.toggle('ch-compact', compact); el.classList.toggle('ch-wide', ctx.size.width > state.D.wideAt);
      el.style.setProperty('--ch-nav', compact ? state.D.compactNavWidth : state.D.navWidth);
      return el;
    };
    BASE.topbar = (parent) => {
      const top = state.U.el('div', 'ch-top', parent);
      const brand = state.U.el('div', 'ch-brand', top); state.P.icon(brand, 'workspace', 18); state.U.el('span', '', brand, state.D.brand);
      const history = state.U.el('div', 'ch-toptools', top); for (const k of ['back', 'forward', 'clock']) state.P.iconButton(history, k, k === 'clock' ? 'Recent activity' : k, null, null);
      const search = state.U.el('div', 'ch-search', top); state.P.icon(search, 'search', 13); state.U.el('span', '', search, 'Search ' + state.s.workspace); state.U.el('kbd', '', search, 'Ctrl K');
      const topTools = state.U.el('div', 'ch-toptools', top); state.P.iconButton(topTools, 'bell', 'Notifications: 3 unread', null, null); state.P.iconButton(topTools, 'help', 'Help', null, null); state.P.avatar(topTools, { full: 'You' }, 'ch-me');
    };
    BASE.rail = (parent) => {
      const rail = state.U.el('aside', 'ch-rail', parent);
      state.D.workspaceLetters.forEach((letter, i) => state.U.el('div', 'ch-workspaceicon' + (i ? '' : ' active'), rail, letter));
      state.P.iconButton(rail, 'plus', 'Add workspace', null, null); state.U.el('div', 'ch-workspaceicon ch-me', rail, 'Y');
    };
    BASE.navigation = (parent) => {
      const nav = state.U.el('aside', 'ch-nav', parent), workspace = state.U.el('div', 'ch-workspace', nav);
      state.U.el('span', '', workspace, state.s.workspace); state.P.icon(workspace, 'chevron', 12);
      state.navScroll = state.U.el('div', 'ch-navscroll ch-scroll', nav);
      env.ui.scrollPane(state.navScroll, {});
      state.P.navItem('bell', 'Activity', '3'); state.P.navItem('threads', 'Threads', '2'); state.P.navItem('file', 'Drafts & sent'); state.P.navItem('later', 'Later', '4');
      state.P.navGroup('Channels');
      const channel = state.P.navItem(state.s.visibility === 'Private' ? 'lock' : 'hash', state.s.channelName, null, true);
      for (const [i, label] of state.D.channels.filter(x => x !== state.s.channelName && x !== state.s.newName).entries()) state.P.navItem('hash', label, i === 0 ? '12' : i === 2 ? '4' : null);
      state.P.navGroup('Direct messages');
      state.s.people.forEach((p, i) => { const row = state.U.el('div', 'ch-navitem', state.navScroll); state.U.el('i', 'ch-presence' + (i % 3 === 1 ? ' away' : ''), row); state.U.el('span', '', row, p.full); if (i === 1) state.U.el('b', 'ch-badge', row, '2'); });
      state.P.navGroup('Projects'); state.P.navItem('folder', 'Autumn release'); state.P.navItem('folder', 'Website refresh');
      const navFoot = state.U.el('div', 'ch-navfoot', nav); state.P.avatar(navFoot, { full: 'You' }); state.U.el('span', '', navFoot, 'You / Available'); state.P.icon(navFoot, 'chevron', 10);
      return channel;
    };
    BASE.body = (parent) => { return state.U.el('div', 'ch-body', parent); };
    BASE.main = (parent) => { return state.U.el('main', 'ch-main', parent); };
    BASE.status = (parent) => { return state.U.el('div', 'ch-status', parent); };
    BASE.build = (page) => {
      state.ctx = page; state.s = state.ctx.spec; state.U = state.ctx.util; state.F = env.taskDef;
      state.ctx.css('app-chat-classic', state.P.styles());
      state.P.begin(state.ctx);
      state.app = state.P.frame(state.ctx);
      state.P.topbar(state.app);
      const body = state.P.body(state.app);
      state.P.rail(body);
      state.navChannel = state.P.navigation(body);
      state.main = state.P.main(body); state.status = state.P.status(state.app);
      state.reg = new Map(); state.panes = new Map(); state.fields = new Map(); state.offsets = {}; state.paintKey = '';
      state.P.paint(state.ctx.model);
      state.P.rendered(state.ctx);
    };
  }

  function channelParts(BASE, state) {
    BASE.chatHeader = (m) => {
      const head = state.U.el('div', 'ch-head', state.main), title = state.U.el('div', '', head);
      const name = state.U.el('h2', '', title); state.P.icon(name, state.s.visibility === 'Private' ? 'lock' : 'hash', 15); state.U.el('span', '', name, m.name); state.P.icon(name, 'chevron', 12); state.U.el('p', '', title, m.topic);
      const headTools = state.U.el('div', 'ch-headtools', head); state.P.iconButton(headTools, 'camera', 'Start huddle', null, null); const members = state.P.button(headTools, `${m.members.length} members`, 'settings', { settings: true }); state.P.icon(members, 'people', 13); state.P.iconButton(headTools, 'search', 'Search in channel', null, null);
    };
    BASE.channelTabs = () => {
      const tabs = state.U.el('div', 'ch-channelnav', state.main);
      for (const [kind, label] of [['threads', 'Messages'], ['file', 'Files'], ['pin', 'Pins']]) { const tab = state.U.el('span', label === 'Messages' ? 'selected' : '', tabs); state.P.icon(tab, kind, 12); state.U.el('span', '', tab, label); }
      const bookmark = state.U.el('span', 'ch-bookmark', tabs); state.P.icon(bookmark, 'link', 11); state.U.el('span', '', bookmark, 'Project brief');
    };
    BASE.feed = (channel, m) => {
      const feed = state.P.pane(state.U.el('div', 'ch-messages ch-scroll', channel), 'messages');
      state.U.el('div', 'ch-day', feed, 'Today / Team conversation');
      (state.s.history || []).forEach((msg, i) => state.P.backgroundMessage(feed, msg, i));
      state.P.systemLine(feed, `${state.s.people[0].full} updated the channel topic.`);
      state.U.el('div', 'ch-unread', feed, 'New messages');
      state.s.messages.forEach((msg, i) => state.P.message(feed, msg, i, m));
      m.channelPosts.forEach((text, i) => { const row = state.U.el('div', 'ch-own', feed); state.U.el('b', '', row, 'You / just now'); state.U.el('div', 'ch-text', row, text); state.P.button(row, 'Delete message', `channelDelete:${i}`, { deleteChannel: i }); });
    };
    BASE.threadPanel = (conv, m) => {
      const th = state.U.el('aside', 'ch-thread', conv), h = state.U.el('div', 'ch-threadhead', th);
      state.U.el('b', '', h, 'Thread'); state.P.iconButton(h, 'close', 'Close thread', 'threadClose', { openThread: null });
      const content = state.P.pane(state.U.el('div', 'ch-threadcontent ch-scroll', th), 'thread');
      const msg = state.s.messages[m.thread]; state.U.el('strong', '', content, state.s.people[msg.author].full);
      state.U.el('blockquote', '', content, msg.text);
      state.U.el('div', 'ch-threadsummary', content, `${msg.replies} replies / Following this thread`);
      (state.s.threadHistory?.[m.thread] || []).forEach(reply => { const row = state.U.el('div', 'ch-replyrow', content); state.P.avatar(row, state.s.people[reply.author]); const text = state.U.el('div', '', row); const meta = state.U.el('div', 'ch-meta', text); state.U.el('strong', '', meta, state.s.people[reply.author].full); state.U.el('span', 'ch-muted', meta, reply.time); state.U.el('div', 'ch-text', text, reply.text); });
      if (m.replies[m.thread]) { const own = state.U.el('div', 'ch-own', content); state.U.el('b', '', own, 'You / just now'); state.U.el('p', 'ch-text', own, m.replies[m.thread]); state.P.button(own, 'Delete reply', `delete:${m.thread}`, { deleteReply: m.thread }); }
      state.P.composer(th, true, m);
    };
    BASE.contextPanel = (conv, m) => {
      const side = state.P.pane(state.U.el('aside', 'ch-context ch-scroll', conv), 'context');
      state.U.el('h4', '', side, 'Channel details'); state.U.el('p', '', side, m.topic); state.P.property(side, 'Visibility', state.s.visibility); state.P.property(side, 'Members', m.members.length);
      state.U.el('h5', '', side, 'Pinned messages');
      if (!m.pins.some(Boolean)) state.U.el('p', 'ch-muted', side, 'No pinned messages yet. Keep important updates here.');
      m.pins.forEach((on, i) => { if (on) state.U.el('p', '', side, state.s.messages[i].text); });
      state.U.el('h5', '', side, 'Shared files'); state.s.sharedFiles.forEach(file => state.P.fileCard(side, file));
      state.U.el('h5', '', side, 'Channel members'); m.members.forEach(i => state.P.personRow(side, state.s.people[i]));
    };
    BASE.messageMenu = (m) => {
      const d = state.P.modal('Message actions', 'menuClose', { menu: null });
      const menu = state.U.el('div', 'ch-menu', d.content);
      const pin = state.P.button(menu, m.pins[m.menu] ? 'Unpin from channel' : 'Pin to this channel', `pin:${m.menu}`, { pin: m.menu }); state.P.icon(pin, 'pin', 14);
      state.P.button(menu, 'Reply in thread', 'menuThread', () => ({ openThread: state.ctx.model.menu, menu: null }));
      state.U.el('div', 'ch-menuhr', menu);
      for (const [kind, label] of [['later', 'Save for later'], ['link', 'Copy message link'], ['bell', 'Remind me about this']]) { const b = state.P.button(menu, label, null, null); state.P.icon(b, kind, 14); }
      state.P.button(menu, 'Close menu', 'menuCancel', { menu: null });
    };
    BASE.reactionPicker = (m) => {
      const d = state.P.modal('Choose a reaction', 'pickerClose', { picker: null });
      const search = state.U.el('div', 'ch-directoryhead', d.content); state.P.icon(search, 'search', 13); state.U.el('span', '', search, 'Find a reaction');
      const cats = state.U.el('div', 'ch-emojicats', d.content); ['clock', 'smile', 'hand', 'heart', 'celebrate', 'grid'].forEach(key => state.P.icon(cats, key, 17));
      state.U.el('div', 'ch-emojiheading', d.content, 'Frequently used');
      const grid = state.U.el('div', 'ch-emoji', d.content);
      Object.entries(state.F.helpers.EMOJI).forEach(([key, [, label]]) => { const b = state.P.button(grid, '', `emoji:${key}`, { emoji: key }); b.setAttribute('aria-label', label); state.P.icon(b, key, 25); state.U.el('small', '', b, label); });
      state.U.el('div', 'ch-emojiheading', d.content, 'People and gestures');
      const gestures = state.U.el('div', 'ch-emoji', d.content);
      for (const key of ['clap', 'thumbsup', 'hand', 'heart', 'eyes', 'celebrate']) { const b = state.P.button(gestures, '', null, key === 'hand' ? null : { emoji: key }); b.title = state.F.helpers.EMOJI[key]?.[1] || 'Raised hand'; state.P.icon(b, key, 24); }
      const context = state.U.el('div', 'ch-emoji-preview', d.content); state.P.icon(context, 'threads', 15); state.U.el('span', '', context, 'Reacting to ' + state.s.people[state.s.messages[m.picker].author].full + "'s message");
    };
  }

  function settingsParts(BASE, state) {
    BASE.settingsAbout = (d, m) => {
      for (const [key, label] of [['editName', 'Channel name'], ['editTopic', 'Topic']]) {
        const wrap = state.U.el('div', 'ch-field', d.content); const lab = state.U.el('label', 'ch-fieldlabel', wrap, label);
        const inp = state.P.field(wrap, key, m[key], label); inp.id = 'chat-' + key; lab.htmlFor = inp.id;
      }
      state.U.el('small', 'ch-muted', d.content, 'Channel names use lowercase letters and hyphens. Topics help people understand what belongs here.');
      state.P.property(d.content, 'Visibility', state.s.visibility + ' channel'); state.P.property(d.content, 'Created by', state.s.people[0].full); state.P.property(d.content, 'Notifications', 'All new messages'); state.P.property(d.content, 'Posting permissions', 'All members');
      state.P.button(d.footer(), 'Save changes', 'save', { save: true }, 'ch-primary');
    };
    BASE.settingsRemove = (d, m) => {
      state.U.el('p', '', d.content, `Remove ${state.s.people[m.remove].full} from this channel?`);
      state.U.el('p', 'ch-muted', d.content, 'They will lose access to the conversation and shared files.');
      const foot = d.footer(); state.P.button(foot, 'Cancel', 'removeCancel', { remove: null }); state.P.button(foot, 'Remove member', 'removeConfirm', { removeConfirm: true }, 'ch-primary');
    };
    BASE.settingsInvite = (d, m) => {
      state.U.el('p', '', d.content, 'Add people to this channel');
      const lookup = state.U.el('div', 'ch-directoryhead', d.content); state.P.icon(lookup, 'search', 13); state.U.el('span', '', lookup, 'Browse workspace directory');
      const selected = state.U.el('div', 'ch-selected', d.content); m.selected.forEach(i => state.U.el('span', '', selected, state.s.people[i].full));
      state.s.people.forEach((p, i) => { const row = state.P.personRow(d.content, p); if (!m.members.includes(i)) state.P.iconButton(row, m.selected.includes(i) ? 'checked' : 'checkBox', m.selected.includes(i) ? 'Selected: ' + p.full : 'Select ' + p.full, `person:${i}`, { person: i }, m.selected.includes(i) ? 'ch-on' : ''); else state.U.el('small', 'ch-muted', row, 'Member'); });
      const foot = d.footer(); state.P.button(foot, 'Cancel', 'inviteCancel', { invite: false }); state.P.button(foot, `Add ${m.selected.length} people`, 'inviteSave', { inviteSave: true }, 'ch-primary');
    };
    BASE.settingsMembers = (d, m) => {
      const add = state.P.button(d.content, 'Add people', 'invite', { invite: true }, 'ch-primary'); state.P.icon(add, 'plus', 13);
      const heading = state.U.el('div', 'ch-directoryhead', d.content); state.P.icon(heading, 'people', 13); state.U.el('span', '', heading, `${m.members.length} channel members / Workspace directory`);
      // Directory remains visible, so ambiguous first-name requests can be resolved by asking.
      state.s.people.forEach((p, i) => { const row = state.P.personRow(d.content, p); if (m.members.includes(i)) state.P.button(row, 'Remove', `remove:${i}`, { remove: i }); else state.U.el('small', 'ch-muted', row, 'Not a member'); });
    };
  }

  function meetingControlParts(BASE, state) {
    BASE.meetingHeader = (m) => {
      const head = state.U.el('div', 'ch-head', state.main), title = state.U.el('div', '', head);
      state.U.el('h2', '', title, state.s.scenario === 'breakout' ? 'Breakout rooms' : 'Team sync');
      state.U.el('p', '', title, `${state.s.workspace} / Weekly project review`);
      const tools = state.U.el('div', 'ch-headtools', head); const manage = state.P.button(tools, 'Manage members', 'settings', { settings: true }); state.P.icon(manage, 'people', 13); state.P.iconButton(tools, 'more', 'Meeting options', null, null);
    };
    BASE.meetingMeta = (meeting) => {
      const meta = state.U.el('div', 'ch-callmeta', meeting);
      const live = state.U.el('span', '', meta); state.U.el('i', 'ch-live', live); state.U.el('span', '', live, 'Live / 18:42 / You are the host');
      const secure = state.U.el('span', '', meta); state.P.icon(secure, 'lock', 11); state.U.el('span', '', secure, 'Encrypted'); state.P.icon(secure, 'signal', 11); state.U.el('span', '', secure, 'Connection stable');
    };
    BASE.meetingControls = (meeting, m) => {
      const controls = state.U.el('div', 'ch-controls', meeting);
      for (const [key, kind, label, ev, on] of [
        ['mute', m.muted ? 'micOff' : 'mute', m.muted ? 'Unmute' : 'Mute', { toggle: 'muted' }, m.muted],
        ['camera', 'camera', m.camera ? 'Stop video' : 'Start video', { toggle: 'camera' }, !m.camera],
        ['share', 'share', 'Share screen', { sharePicker: true }, m.share !== null],
        ['hand', 'hand', m.hand ? 'Lower hand' : 'Raise hand', { toggle: 'hand' }, m.hand],
      ]) { const b = state.P.button(controls, '', key, ev, on ? 'ch-on' : ''); state.P.icon(b, kind, 20); state.U.el('span', '', b, label); b.setAttribute('aria-pressed', String(on)); }
      for (const [kind, label] of [['threads', 'Chat'], ['people', 'People'], ['grid', 'Rooms'], ['more', 'More']]) { const b = state.P.button(controls, '', null, null); state.P.icon(b, kind, 19); state.U.el('span', '', b, label); }
      const leave = state.P.button(controls, '', null, null, 'ch-leave'); state.P.icon(leave, 'exit', 19); state.U.el('span', '', leave, 'Leave');
    };
    BASE.sharePicker = (m) => {
      const d = state.P.modal('Share content', 'shareClose', { sharePicker: false });
      const tabs = state.U.el('div', 'ch-share-tabs', d.content); state.U.el('span', '', tabs, 'Entire screen'); state.U.el('b', '', tabs, 'Window'); state.U.el('span', '', tabs, 'Browser tab');
      state.U.el('p', 'ch-muted', d.content, 'Only the selected window will be visible to other participants.');
      const windows = state.U.el('div', 'ch-windows', d.content);
      state.s.sources.forEach((name, i) => { const row = state.U.el('div', 'ch-window', windows); state.P.windowPreview(row, i); const b = state.P.button(row, name, `source:${i}`, { source: i }, m.source === i ? 'ch-on' : ''); b.setAttribute('aria-pressed', String(m.source === i)); });
      const audio = state.U.el('div', 'ch-options', d.content); state.P.icon(audio, 'checkBox', 13); state.U.el('span', '', audio, 'Also share system audio');
      const foot = d.footer(); state.P.button(foot, 'Cancel', 'shareCancel', { sharePicker: false }); state.P.button(foot, 'Share window', 'shareStart', { shareStart: true }, 'ch-primary');
    };
    BASE.tile = (tiles, p, i, m) => {
      const tile = state.U.el('div', 'ch-tile' + (i === 0 && m.hand ? ' hand' : '') + (i === 2 ? ' speaker' : ''), tiles);
      const top = state.U.el('div', 'ch-tiletop', tile); state.U.el('span', '', top, i === 0 ? 'Your camera' : i === 2 ? 'Speaking' : 'Camera off'); state.P.icon(top, 'signal', 11);
      state.P.avatar(tile, p);
      const name = state.U.el('div', 'ch-tilelabel', tile); state.P.icon(name, i === 0 ? m.muted ? 'micOff' : 'mute' : i === 2 ? 'mute' : 'micOff', 11); if (i === 0 && m.hand) state.P.icon(name, 'hand', 12);
      state.U.el('span', '', name, `${p.full}${i === 0 ? ' (Host)' : ''}`);
    };
    BASE.room = (board, room, rooms, m) => {
      const el = state.P.target(`room:${room}`, state.U.el('section', 'ch-room', board)); rooms.set(room, el);
      const header = state.U.el('div', 'ch-roomhead', el); state.P.icon(header, room === -1 ? 'people' : 'room', 13); state.U.el('span', '', header, room === -1 ? 'Unassigned' : state.s.roomNames[room]); state.U.el('b', 'ch-count', header, m.rooms.filter(x => x === room).length);
      state.U.el('div', 'ch-roomstatus', el, room === -1 ? 'Main meeting' : m.roomsOpen ? 'In progress' : 'Not started');
      const roster = state.P.pane(state.U.el('div', 'ch-roster ch-scroll', el), `room:${room}`);
      if (!m.rooms.includes(room)) state.U.el('div', 'ch-empty', roster, room === -1 ? 'Everyone is assigned to a room.' : 'No participants assigned yet.');
      state.s.people.forEach((p, i) => {
        if (m.rooms[i] !== room) return;
        const card = state.P.participant(roster, p, i);
        state.P.assignment(card, p, i, rooms);
      });
      state.U.el('div', 'ch-roomfooter', el, room === -1 ? 'Host remains in the main meeting' : 'Room capacity: 12 / Audio & video');
    };
    BASE.participant = (roster, p, i) => {
      const card = state.P.target(`participant:${i}`, state.U.el('div', 'ch-participant', roster)); state.P.avatar(card, p); const text = state.U.el('div', '', card); state.U.el('span', '', text, p.full); state.U.el('small', '', text, i % 3 === 0 ? 'Desktop / Video off' : 'Desktop / Audio connected');
      return card;
    };
    BASE.assignment = (card, p, i, rooms) => {
      card.setAttribute('aria-label', 'Move ' + p.full); card.setAttribute('role', 'button');
      let drop = null;
      env.ui.track(card, {
        start() { card.style.opacity = '.55'; drop = null; },
        move(pt) {
          drop = null;
          for (const [id, r] of rooms) { const rect = r.getBoundingClientRect(); const inside = pt.x >= rect.left && pt.x <= rect.right && pt.y >= rect.top && pt.y <= rect.bottom; r.classList.toggle('drop', inside); if (inside) drop = id; }
        },
        end() { card.style.opacity = ''; for (const r of rooms.values()) r.classList.remove('drop'); if (drop !== null) state.P.commit({ assign: [i, drop] }); },
      }, 'assign ' + p.full);
    };
    BASE.breakoutNotice = (parent, m) => {
      const guide = state.U.el('div', 'ch-breaknotice', parent); state.P.icon(guide, 'room', 15); state.U.el('span', '', guide, 'Session 1 / Small group discussion. Participants stay in the main meeting until rooms are opened.');
      const settings = state.U.el('div', 'ch-guide', parent, `${state.s.people.length} participants / ${state.s.roomNames.length} rooms / Manual assignment / 15 minute session`);
    };
    BASE.breakoutControls = (parent, m) => {
      const tools = state.U.el('div', 'ch-breaktools', parent), left = state.U.el('div', '', tools);
      const options = state.P.button(left, 'Options', null, null); state.P.icon(options, 'settings', 12); state.P.button(left, 'Broadcast message', null, null);
      const right = state.U.el('div', '', tools); state.U.el('span', 'ch-muted', right, 'Assignments saved'); state.P.button(right, m.roomsOpen ? 'Close all rooms' : 'Open all rooms', null, { field: ['roomsOpen', !m.roomsOpen] }, 'ch-primary');
    };
    BASE.styles = () => { return CSS(state.D); };
    BASE.begin = (ctx) => {};
    BASE.rendered = (ctx) => {};
    BASE.painted = (m) => {};
    BASE.locate = (t) => { const el = t.control ? state.reg.get(t.control) : state.panes.get(t.pane); if (!el || !el.getClientRects().length) throw new Error('use-chat target missing: ' + JSON.stringify(t)); return state.U.center(el); };
  }

  env.template('use-chat/workspace', (design, def) => {
    // Internal state stays live across paints and resets; designs keep their existing read-only scope.
    const state = {};
    const BASE = {};
    const S = {
      get ctx() { return state.ctx; },
      get spec() { return state.s; },
      get app() { return state.app; },
      get main() { return state.main; },
      get status() { return state.status; },
      get navScroll() { return state.navScroll; },
      get navChannel() { return state.navChannel; },
      get reg() { return state.reg; },
      get panes() { return state.panes; },
      get fields() { return state.fields; },
      get offsets() { return state.offsets; },
      get D() { return state.D; },
      get P() { return state.P; },
    };
    controlParts(BASE, state);
    messageParts(BASE, state);
    meetingParts(BASE, state);
    frameParts(BASE, state);
    channelParts(BASE, state);
    settingsParts(BASE, state);
    meetingControlParts(BASE, state);
    ({ D: state.D, P: state.P } = env.templateDesign('use-chat/workspace', design, def, { tokens: TOKENS, base: BASE, state: S }));
    return {
      render(ctx) {
        state.P.build(ctx);
        return { anchors: [state.app], sync: m => state.P.paint(m) };
      },
      locate(t) { return state.P.locate(t); },
    };
  });
})();
