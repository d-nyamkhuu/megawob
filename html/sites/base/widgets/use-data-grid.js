/*
 * base / use-data-grid / grid: a seeded operations workspace with navigation, saved queues, notifications,
 * project context and a wide-screen activity panel. The task grid sits in the workspace with title bar with decoy actions, a toolbar
 * (quick search when the task allows typing, filter chips, Clear filters, and a bulk bar that replaces the
 * right side once rows are selected: "N selected", Clear, Mark as, Archive, Delete, plus Undo), the grid
 * (native checkbox column, header cells with sort arrow, a funnel on categorical columns, a hover-revealed ⋮
 * column menu and a 10 px resize edge on the right border), and a footer with "Showing a–b of n" and a pager
 * (Prev, numbered pages with ellipses, Next). Popovers (column menu, filter menu, Mark as menu), the delete
 * confirm dialog and the Undo toast are drawn inside the card.
 *
 * Mechanics: header press + move > 5 px drags the column (ghost + drop line; drop index = number of other
 * headers whose middle is left of the pointer); press + release without moving sorts (cycle). The edge
 * drags the width live; it is a focusable separator (ArrowLeft/Right ±10 px, Shift ±1 px) and the header is
 * focusable (Enter / Space sorts) for keyboard episodes. Pressing outside an open popover closes it.
 * multirow: no checkbox column content; a click on a row picks it (plain replaces the selection, Ctrl toggles,
 * Shift selects the range from the anchor). cellEdit: a double-click on a text / number cell (not the name or
 * key column) turns it into an input (Enter or blur commits, Escape cancels); edited cells are marked.
 * A1: crm ticket cells, header value-filter + bulk workflow, page-size buttons, and virtual row windows.
 * The aggrid widget uses pinned AG Grid Community 32.0.0 for the body (real DOM virtualization), with
 * the same locally built value-filter menu, bulk toolbar and controlled model. No enterprise features.
 * In resize episodes it shows AG Grid's own header instead, and the width comes from AG Grid's column resize
 * (the 8 px handle straddling each header's right border, onColumnResized); with spec.keys the handles are
 * also focusable separators that take ArrowLeft / ArrowRight.
 * Layout per episode: card width and alignment, density (row height from the stage height and page size),
 * zebra rows, vertical grid lines, header case. The card is the only anchor.
 */
(function () {
  'use strict';

  const CSS = `
  .to-facts { height:22px;flex:none;padding:2px 12px;font-size:11px;color:var(--muted);border-top:1px solid var(--line);white-space:nowrap; }
  .to-ag .ag-theme-quartz { --ag-background-color:var(--panel);--ag-foreground-color:var(--fg);--ag-border-color:var(--line);--ag-row-border-color:var(--line);--ag-selected-row-background-color:color-mix(in srgb,var(--accent) 12%,var(--panel));--ag-font-size:12px;--ag-font-family:inherit;--ag-wrapper-border-radius:0; }
  .to-ag .ag-root-wrapper {border:0;} .to-ag .ag-cell {padding:0 10px;}
  .to-agcell {height:100%;display:flex;align-items:center;overflow:hidden;} .to-agcell span {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .to-agcheck {height:100%;display:flex;align-items:center;justify-content:center;} .to-agcheck input {accent-color:var(--accent);}
  .to-agselected {background:color-mix(in srgb,var(--accent) 12%,var(--panel))!important;}
  .to-card { position: absolute; display: flex; flex-direction: column; overflow: hidden; background: var(--panel); color: var(--fg);
    border: 1px solid var(--line); border-radius: 10px; box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 10px 30px rgba(0,0,0,.07);
    user-select: none; -webkit-user-select: none; font-size: 13.5px; }
  .to-head { flex: none; display: flex; align-items: center; gap: 10px; height: 48px; padding: 0 16px; border-bottom: 1px solid var(--line); }
  .to-head h2 { margin: 0; font-size: 16px; font-weight: 700; white-space: nowrap; }
  .to-chip { padding: 2px 9px; border-radius: 11px; font-size: 12px; font-weight: 600; color: var(--muted); background: color-mix(in srgb, var(--fg) 7%, transparent); }
  .to-head .sp { flex: 1; }
  .to-btn { display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 11px; border: 1px solid var(--line); border-radius: 6px;
    background: var(--panel); color: var(--fg); font: inherit; font-size: 13px; cursor: pointer; white-space: nowrap; }
  .to-btn:hover { background: color-mix(in srgb, var(--fg) 5%, var(--panel)); }
  .to-btn.pri { background: var(--accent); border-color: var(--accent); color: #fff; }
  .to-btn.danger { color: #c92a2a; border-color: color-mix(in srgb, #c92a2a 40%, var(--line)); }
  .to-btn.ghost { border-color: transparent; background: transparent; color: var(--muted); }
  .to-btn[disabled] { opacity: .45; cursor: default; }
  .to-tools { flex: none; display: flex; align-items: center; gap: 8px; height: 46px; padding: 0 12px; border-bottom: 1px solid var(--line);
    background: color-mix(in srgb, var(--fg) 2%, var(--panel)); min-width: 0; }
  .to-search { display: flex; align-items: center; gap: 6px; width: 210px; flex: none; height: 30px; padding: 0 9px; border: 1px solid var(--line); border-radius: 6px; background: var(--panel); }
  .to-search svg { flex: none; width: 15px; height: 15px; color: var(--muted); }
  .to-search input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; color: var(--fg); font: inherit; font-size: 13px; user-select: text; }
  .to-fchip { display: inline-flex; align-items: center; gap: 4px; height: 24px; padding: 0 4px 0 9px; border-radius: 12px; font-size: 12px; white-space: nowrap;
    color: var(--accent); background: color-mix(in srgb, var(--accent) 12%, transparent); max-width: 190px; overflow: hidden; }
  .to-fchip b { font-weight: 600; overflow: hidden; text-overflow: ellipsis; }
  .to-fchip i { font-style: normal; width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; cursor: pointer; }
  .to-fchip i:hover { background: color-mix(in srgb, var(--accent) 20%, transparent); }
  .to-link { color: var(--accent); font-size: 12.5px; font-weight: 600; cursor: pointer; white-space: nowrap; }
  .to-tools .sp { flex: 1; min-width: 4px; }
  .to-selinfo { font-size: 13px; font-weight: 650; white-space: nowrap; }
  .to-grid { flex: none; position: relative; overflow: hidden; }
  .to-hrow, .to-row { display: flex; align-items: stretch; }
  .to-hrow { height: 40px; border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
  .to-cb { flex: none; width: 40px; display: flex; align-items: center; justify-content: center; }
  .to-cb input { width: 15px; height: 15px; margin: 0; accent-color: var(--accent); cursor: pointer; }
  .to-h { flex: none; position: relative; display: flex; align-items: center; gap: 4px; padding: 0 6px 0 10px; font-weight: 650; font-size: 12.5px;
    color: var(--muted); cursor: pointer; outline: none; min-width: 0; }
  .to-card.upper .to-h { text-transform: uppercase; letter-spacing: .04em; font-size: 11.5px; }
  .to-h:focus-visible, .to-h.focused { box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--accent) 55%, transparent); }
  .to-h .lbl { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .to-h.sorted { color: var(--fg); }
  .to-h .arrow { flex: none; font-size: 10px; color: var(--accent); }
  .to-h .ib { flex: none; width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; border-radius: 4px; color: var(--muted); cursor: pointer; }
  .to-h .ib:hover { background: color-mix(in srgb, var(--fg) 9%, transparent); color: var(--fg); }
  .to-h .ib svg { width: 13px; height: 13px; }
  .to-h .ib.on { color: var(--accent); background: color-mix(in srgb, var(--accent) 14%, transparent); }
  .to-h .gap { flex: 1; min-width: 0; }
  .to-h .dots { opacity: 0; background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
  .to-h:hover .dots, .to-h .dots.on { opacity: 1; }
  .to-card.showdots .to-h .dots { opacity: 1; }
  .to-card.dense .to-h { display: block; padding: 3px 8px; }
  .to-card.dense .to-h .lbl { display: block; line-height: 16px; }
  .to-card.dense .to-h.sorted .lbl { padding-right: 10px; }
  .to-card.dense .to-h .gap { display: none; }
  .to-card.dense .to-h .arrow { position: absolute; top: 3px; right: 8px; }
  .to-card.dense .to-h .ib { position: absolute; bottom: 2px; right: 28px; width: 16px; height: 16px; }
  .to-card.dense .to-h .dots { right: 8px; }
  .to-edge { position: absolute; top: 0; bottom: 0; right: -5px; width: 10px; z-index: 3; cursor: col-resize; outline: none; }
  .to-edge::after { content: ''; position: absolute; top: 9px; bottom: 9px; left: 4px; width: 2px; border-radius: 1px; background: var(--line); }
  .to-edge:hover::after, .to-edge:focus::after, .to-edge.live::after { background: var(--accent); top: 0; bottom: 0; }
  .to-body { position: relative; }
  .to-row { border-bottom: 1px solid color-mix(in srgb, var(--line) 75%, transparent); }
  .to-card.zebra .to-row:nth-child(even) { background: color-mix(in srgb, var(--fg) 2.5%, transparent); }
  .to-row.sel { background: color-mix(in srgb, var(--accent) 10%, transparent) !important; }
  .to-c { flex: none; display: flex; align-items: center; padding: 0 10px; min-width: 0; overflow: hidden; white-space: nowrap; }
  .to-c span { overflow: hidden; text-overflow: ellipsis; }
  .to-card.lines .to-c, .to-card.lines .to-h { border-left: 1px solid color-mix(in srgb, var(--line) 70%, transparent); }
  .to-c.r { justify-content: flex-end; font-variant-numeric: tabular-nums; }
  .to-c.mono span { font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; font-size: 12.5px; }
  .to-pill { padding: 2px 8px; border-radius: 10px; font-size: 12px; font-weight: 600; }
  .to-pill.changed { outline: 2px solid color-mix(in srgb, var(--accent) 45%, transparent); }
  .to-fill { flex: 1; }
  .to-empty { padding: 26px; text-align: center; color: var(--muted); }
  .to-foot { flex: none; display: flex; align-items: center; gap: 10px; height: 46px; padding: 0 12px; border-top: 1px solid var(--line); margin-top: auto; }
  .to-foot .info { color: var(--muted); font-size: 12.5px; white-space: nowrap; }
  .to-pager { display: flex; align-items: center; gap: 4px; }
  .to-pg { min-width: 30px; height: 28px; padding: 0 8px; border: 1px solid transparent; border-radius: 6px; background: transparent; color: var(--fg);
    font: inherit; font-size: 13px; cursor: pointer; }
  .to-pg:hover { background: color-mix(in srgb, var(--fg) 6%, transparent); }
  .to-pg.cur { border-color: var(--accent); color: var(--accent); font-weight: 700; }
  .to-pg[disabled] { opacity: .4; cursor: default; }
  .to-pg.dots { cursor: default; color: var(--muted); }
  .to-pop { position: absolute; z-index: 20; min-width: 180px; padding: 6px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel);
    box-shadow: 0 10px 28px rgba(0,0,0,.18); font-size: 13px; }
  .to-mi { display: flex; align-items: center; gap: 8px; height: 30px; padding: 0 10px; border-radius: 5px; cursor: pointer; white-space: nowrap; }
  .to-mi:hover { background: color-mix(in srgb, var(--accent) 10%, transparent); }
  .to-mi.dis { color: var(--muted); cursor: default; }
  .to-mi.dis:hover { background: transparent; }
  .to-sep { height: 1px; margin: 5px 4px; background: var(--line); }
  .to-pop h4 { margin: 4px 8px 6px; font-size: 12px; font-weight: 650; color: var(--muted); }
  .to-opt { display: flex; align-items: center; gap: 8px; height: 28px; padding: 0 8px; border-radius: 5px; cursor: pointer; white-space: nowrap; }
  .to-opt:hover { background: color-mix(in srgb, var(--fg) 5%, transparent); }
  .to-opt input { margin: 0; accent-color: var(--accent); pointer-events: none; }
  .to-pop .btns { display: flex; justify-content: flex-end; gap: 6px; padding: 8px 4px 2px; border-top: 1px solid var(--line); margin-top: 6px; }
  .to-ghost { position: absolute; z-index: 30; padding: 8px 12px; border-radius: 6px; background: var(--panel); border: 1px solid var(--accent);
    box-shadow: 0 8px 20px rgba(0,0,0,.18); font-weight: 650; font-size: 12.5px; pointer-events: none; opacity: .92; }
  .to-dropline { position: absolute; z-index: 29; width: 3px; border-radius: 2px; background: var(--accent); pointer-events: none; }
  .to-toast { position: absolute; z-index: 18; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 12px; padding: 9px 10px 9px 16px;
    border-radius: 8px; background: #23262e; color: #f1f3f7; box-shadow: 0 8px 24px rgba(0,0,0,.25); font-size: 13px; white-space: nowrap; }
  .to-toast .u { color: #8fb8ff; font-weight: 700; cursor: pointer; padding: 3px 6px; border-radius: 4px; }
  .to-toast .x { color: #aab; cursor: pointer; padding: 0 4px; }
  .to-edit { width: 100%; height: calc(100% - 4px); min-width: 0; box-sizing: border-box; font: inherit; color: var(--fg); background: var(--panel);
    border: 2px solid var(--accent); border-radius: 3px; padding: 0 5px; outline: none; user-select: text; -webkit-user-select: text; }
  .to-c.edited span { font-style: italic; text-decoration: underline dotted; }
  .to-card.rowpick .to-row { cursor: pointer; }
  .to-scrim { position: absolute; inset: 0; z-index: 25; background: rgba(10,12,18,.32); display: flex; align-items: center; justify-content: center; }
  .to-dialog { width: 340px; padding: 18px 20px 14px; border-radius: 10px; background: var(--panel); box-shadow: 0 16px 40px rgba(0,0,0,.3); }
  .to-dialog h3 { margin: 0 0 6px; font-size: 16px; }
  .to-dialog p { margin: 0 0 16px; color: var(--muted); line-height: 1.45; }
  .to-dialog .btns { display: flex; justify-content: flex-end; gap: 8px; }

  .to-workspace {position:absolute;inset:8px;background:var(--panel);border:1px solid var(--line);border-radius:6px;overflow:hidden;color:var(--fg);font:12px/1.4 system-ui,sans-serif;}
  .to-btn[hidden],.to-nav[hidden] {display:none;}
  .to-icon {display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;flex:none;pointer-events:none;}
  .to-icon svg {width:100%;height:100%;}
  .to-appbar {height:36px;display:flex;align-items:center;gap:12px;padding:0 12px;border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--fg) 3%,var(--panel));}
  .to-brand {display:flex;align-items:center;gap:7px;font-size:13px;font-weight:750;letter-spacing:-.3px;}
  .to-brand .to-icon {color:var(--accent);}
  .to-appbar .to-global {margin-left:auto;width:210px;justify-content:flex-start;color:var(--muted);font-size:11px;height:25px;background:var(--panel);}
  .to-appbar button {height:25px;font-size:11px;}
  .to-avatar {display:inline-flex;align-items:center;justify-content:center;flex:none;width:21px;height:21px;border-radius:50%;background:color-mix(in srgb,var(--accent) 13%,var(--panel));color:var(--fg);font-size:9px;font-weight:650;}
  .to-nav {position:absolute;left:0;top:36px;bottom:0;width:44px;border-right:1px solid var(--line);background:color-mix(in srgb,var(--fg) 2%,var(--panel));padding:9px 5px;overflow:hidden;}
  .to-nav.expanded {width:156px;padding:9px 8px;}
  .to-nav button {width:100%;border:0;display:flex;align-items:center;gap:9px;background:transparent;color:var(--muted);font:inherit;text-align:left;border-radius:4px;height:28px;padding:0 8px;white-space:nowrap;cursor:pointer;}
  .to-nav button:hover {background:color-mix(in srgb,var(--fg) 5%,transparent);}
  .to-nav button.active {background:color-mix(in srgb,var(--accent) 12%,transparent);color:var(--accent);font-weight:650;}
  .to-nav small {display:block;font-size:9px;font-weight:650;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:12px 7px 4px;}
  .to-nav .nav-label {min-width:0;overflow:hidden;text-overflow:ellipsis;}
  .to-nav .nav-count {flex:none;margin-left:auto;color:var(--muted);font-size:10px;}
  .to-nav:not(.expanded) .nav-label,.to-nav:not(.expanded) small,.to-nav:not(.expanded) .nav-count,.to-nav:not(.expanded) .to-project {display:none;}
  .to-nav .to-project {height:25px;font-size:11px;padding-left:8px;}
  .to-card {border-radius:0;border:0;box-shadow:none;font-size:12px;}
  .to-head {height:44px;padding:0 12px;gap:8px;}
  .to-head h2 {font-size:15px;font-weight:650;letter-spacing:-.25px;}
  .to-head .to-object {display:flex;align-items:center;gap:7px;min-width:0;}
  .to-object .to-icon {color:var(--accent);width:20px;height:20px;}
  .to-head .to-btn {height:27px;padding:0 8px;font-size:11px;}
  .to-chip {font-size:10px;padding:1px 6px;}
  .to-tabs {display:flex;align-items:center;gap:18px;height:30px;flex:none;padding:0 12px;border-bottom:1px solid var(--line);font-size:11px;}
  .to-tabs button {display:flex;align-items:center;gap:5px;border:0;background:none;color:var(--muted);height:30px;font:inherit;padding:0;cursor:pointer;}
  .to-tabs .active {color:var(--accent);border-bottom:2px solid var(--accent);font-weight:650;}
  .to-tabs .scope {margin-left:auto;color:var(--muted);font-size:10px;white-space:nowrap;}
  .to-tools {height:38px;gap:6px;background:var(--panel);}
  .to-tools .to-btn {height:26px;font-size:11px;padding:0 8px;}
  .to-search {width:185px;height:27px;}
  .to-search input {font-size:11px;}
  .to-selinfo {font-size:11px;}
  .to-link {font-size:11px;}
  .to-hrow {background:color-mix(in srgb,var(--fg) 3%,var(--panel));}
  .to-h .arrow svg {width:12px;height:12px;}
  .to-h {font-size:11px;font-weight:600;}
  .to-card.upper .to-h {font-size:10px;letter-spacing:.025em;}
  .to-c {padding:0 9px;gap:6px;font-size:11.5px;}
  .to-c.mono span {font-size:10.5px;color:var(--muted);}
  .to-row:hover {background:color-mix(in srgb,var(--accent) 4%,var(--panel));}
  .to-pill {font-size:10px;font-weight:600;padding:2px 6px;border-radius:4px;color:color-mix(in srgb,var(--status-tone,#1971c2) 60%,var(--fg))!important;}
  .to-ag .ag-theme-quartz {--ag-font-size:11.5px;--ag-odd-row-background-color:var(--panel);--ag-row-hover-color:color-mix(in srgb,var(--accent) 4%,var(--panel));}
  .to-agcell {gap:6px;}
  .to-priority {display:inline-flex;align-items:center;gap:5px;}
  .to-priority .to-icon {width:12px;height:12px;color:var(--muted);}
  .to-priority.urgent .to-icon {color:#e17054;}
  .to-priority.high .to-icon {color:#d79a30;}
  .to-foot {height:38px;font-size:11px;gap:6px;}
  .to-foot .info {font-size:10px;}
  .to-pg {height:25px;min-width:25px;font-size:11px;padding:0 6px;display:inline-flex;align-items:center;justify-content:center;gap:3px;}
  .to-pg .to-icon {width:12px;height:12px;}
  .to-facts {font-size:9.5px;background:color-mix(in srgb,var(--fg) 2%,var(--panel));display:flex;align-items:center;gap:5px;}
  .to-stream {flex:1;min-height:0;overflow:hidden;padding:14px 12px 0;border-top:1px solid var(--line);background:color-mix(in srgb,var(--fg) 1%,var(--panel));}
  .to-stream h4 {margin:0 0 9px;color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.04em;}
  .to-stream-row {display:flex;align-items:center;gap:8px;font-size:11px;line-height:25px;color:var(--muted);}
  .to-stream-row span:last-child {margin-left:auto;font-size:10px;white-space:nowrap;}
  .to-context {position:absolute;right:0;top:36px;bottom:0;width:188px;border-left:1px solid var(--line);padding:14px 12px;background:color-mix(in srgb,var(--fg) 1%,var(--panel));font-size:11px;}
  .to-context h4 {font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin:0 0 12px;}
  .to-context strong {display:block;font-size:13px;margin-bottom:4px;}
  .to-context p {color:var(--muted);line-height:1.6;margin:0 0 18px;}
  .to-context .to-feed {padding:10px 0;border-top:1px solid var(--line);}
  .to-context .to-feed small {display:block;color:var(--muted);margin-top:3px;}
  .to-utility {position:absolute;z-index:45;right:10px;top:42px;width:278px;padding:15px;background:var(--panel);border:1px solid var(--line);border-radius:6px;box-shadow:0 12px 32px #0003;}
  .to-utility h3 {margin:0 28px 12px 0;font-size:13px;}
  .to-utility p {margin:0;padding:10px 0;color:var(--muted);font-size:11px;border-top:1px solid var(--line);}
  .to-utility .to-close {position:absolute;right:8px;top:8px;padding:3px;border:0;background:none;color:var(--fg);cursor:pointer;}
  .to-empty {padding:24px 12px;text-align:center;font-size:12px;}
  .to-empty .to-icon {display:flex;width:25px;height:25px;margin:0 auto 7px;color:var(--muted);}
  .to-empty p {font-size:11px;margin:5px 0 10px;}
  .to-empty button {margin:auto;}
  `;

  const ICON = {
    search: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="8.5" cy="8.5" r="5.5"/><path d="M13 13l4 4" stroke-linecap="round"/></svg>',
    funnel: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 4h14l-5.5 6.5V16l-3 1.5v-7z"/></svg>',
    dots: '<svg viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="4.5" r="1.7"/><circle cx="10" cy="10" r="1.7"/><circle cx="10" cy="15.5" r="1.7"/></svg>',
  };
  const paths = {
    app: '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="13" y="3" width="6" height="6" rx="1"/><rect x="3" y="13" width="6" height="6" rx="1"/><rect x="13" y="13" width="6" height="6" rx="1"/>',
    records: '<rect x="3" y="4" width="16" height="15" rx="2"/><path d="M3 9h16M8 9v10"/>',
    users: '<circle cx="9" cy="7" r="3"/><path d="M3 19v-2a6 6 0 0 1 12 0v2M15 4a3 3 0 0 1 0 6m3 9v-2a6 6 0 0 0-2-4"/>',
    chart: '<path d="M4 3v16h16M8 15v-4m5 4V7m5 8V4"/>',
    clock: '<circle cx="11" cy="11" r="8"/><path d="M11 6v5l3 2"/>',
    bell: '<path d="M5 9a6 6 0 0 1 12 0c0 7 2 7 2 8H3c0-1 2-1 2-8m6 12a2 2 0 0 0 2-2H9a2 2 0 0 0 2 2"/>',
    settings: '<path d="M4 6h14M4 16h14"/><circle cx="8" cy="6" r="2"/><circle cx="14" cy="16" r="2"/>',
    down: '<path d="m6 8 5 5 5-5"/>', up: '<path d="m6 14 5-5 5 5"/>',
    left: '<path d="m13 5-6 6 6 6"/>', right: '<path d="m8 5 6 6-6 6"/>',
    close: '<path d="m6 6 10 10M16 6 6 16"/>', plus: '<path d="M11 4v14M4 11h14"/>',
    undo: '<path d="M8 5 3 10l5 5M3 10h10a6 6 0 0 1 6 6"/>',
    archive: '<rect x="3" y="3" width="16" height="4" rx="1"/><path d="M5 7v12h12V7M8 11h6"/>',
    trash: '<path d="M3 6h16M8 6V3h6v3M5 6l1 13h10l1-13M9 9v7m4-7v7"/>',
    export: '<path d="M11 3v12m-4-4 4 4 4-4M4 15v4h14v-4"/>',
    check: '<path d="m4 11 4 4 10-10"/>',
    folder: '<path d="M3 6V4h6l2 3h8v12H3z"/>',
    mail: '<rect x="3" y="5" width="16" height="13" rx="2"/><path d="m3 6 8 6 8-6"/>',
    flag: '<path d="M5 20V3m0 1h13l-3 4 3 4H5"/>',
  };
  for (const [key, path] of Object.entries(paths)) ICON[key] = `<svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
  const icon = (node, key, before = true) => {
    const holder = document.createElement('span'); holder.className = 'to-icon'; holder.innerHTML = ICON[key];
    before ? node.prepend(holder) : node.append(holder); return holder;
  };
  const TONES = ['#2b8a3e', '#1971c2', '#e67700', '#c92a2a', '#7048e8', '#0c8599', '#868e96'];
  const STATUS_TONES = {
    'Active': '#2b8a3e', 'Delivered': '#2b8a3e', 'Paid': '#2b8a3e', 'In stock': '#2b8a3e',
    'Pending': '#b87812', 'On hold': '#b87812', 'On leave': '#b87812', 'Probation': '#b87812',
    'Low stock': '#b87812', 'Backordered': '#b87812', 'Waiting': '#b87812',
    'Processing': '#1971c2', 'Shipped': '#1971c2', 'Remote': '#1971c2', 'Reserved': '#1971c2',
    'Sent': '#1971c2', 'Open': '#1971c2', 'In progress': '#1971c2', 'Contractor': '#7954b8',
    'Cancelled': '#808795', 'Refunded': '#808795', 'Discontinued': '#808795', 'Draft': '#808795',
    'Void': '#808795', 'Closed': '#808795', 'Overdue': '#c92a2a', 'Disputed': '#c92a2a',
  };

  let view = null;
  let previousGrid = null;
  const vendorBase = new URL('sites/base/vendor/ag-grid-community-32.0.0/', location.href).href;
  function agStyles() {
    for (const file of ['ag-grid.css', 'ag-theme-quartz.css']) {
      if (document.getElementById('to-' + file)) continue;
      const link = document.createElement('link');
      link.id = 'to-' + file; link.rel = 'stylesheet'; link.href = vendorBase + file;
      document.head.append(link);
    }
  }
  function ensureStyle() {
    if (document.getElementById('to-style')) return;
    const s = document.createElement('style');
    s.id = 'to-style';
    s.textContent = CSS;
    document.head.append(s);
  }

  // A point inside el that is not covered by something else (floating buttons, toasts).
  function pointOn(el) {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!(r.width > 0 && r.height > 0)) return null;
    const fx = [0.5, 0.3, 0.7, 0.15, 0.85];
    const fy = [0.5, 0.3, 0.7];
    for (const y of fy) {
      for (const x of fx) {
        const p = [r.left + r.width * x, r.top + r.height * y];
        const hit = document.elementFromPoint(p[0], p[1]);
        if (hit && (hit === el || el.contains(hit))) return p;
      }
    }
    return [r.left + r.width / 2, r.top + r.height / 2];
  }

  const gridWidget = {
    task: 'use-data-grid',
    site: 'base',
    name: 'grid',
    split: 'train',
    scenarios: ['sort', 'filter', 'paginate', 'select', 'bulk', 'resize', 'reorder', 'multirow', 'cellEdit', 'crm', 'colfilter', 'virtual'],

    render(ctx, ag = false) {
      if (previousGrid) { previousGrid.destroy(); previousGrid = null; }
      ensureStyle();
      if (ag) agStyles();
      const { util, spec, rng } = ctx;
      const fam = env.taskDef;
      const virtual = spec.scenario === 'virtual';
      const inline = ['cellEdit', 'crm', 'virtual'].includes(spec.scenario);
      const admin = ['crm', 'colfilter', 'virtual'].includes(spec.scenario);
      const sizeOf = m => fam.helpers.pageSizeOf(m, spec);
      const el = (tag, cls, parent, text) => util.el(tag, cls, parent, text);
      const W = ctx.size.width;
      const H = ctx.size.height;

      const wr = rng.fork('workspace');
      const company = env.content.pick(wr, env.content.COMPANIES, { csplit: spec.csplit });
      const workspaceName = typeof company === 'string' ? company : company.name;
      const actor = env.content.personName(wr, { csplit: spec.csplit }).full;
      const expanded = W >= 1000;
      const contextual = W >= 1280 && H >= 580;
      const navW = spec.scenario === 'resize' && W < 850 ? 0 : expanded ? 156 : 44;
      const contextW = contextual ? 188 : 0;
      const shell = el('section', 'to-workspace', ctx.stage);
      shell.setAttribute('aria-label', 'Operations workspace');
      const appbar = el('div', 'to-appbar', shell);
      const brand = el('span', 'to-brand', appbar, 'Relay'); icon(brand, 'app');
      const org = el('button', 'to-btn ghost', appbar, workspaceName); icon(org, 'down', false);
      const globalSearch = el('button', 'to-btn to-global', appbar, 'Search workspace'); icon(globalSearch, 'search');
      const notifications = el('button', 'to-btn ghost', appbar, '3'); icon(notifications, 'bell'); notifications.title = 'Notifications';
      const user = el('span', 'to-avatar', appbar, actor.split(' ').map(x => x[0]).slice(0,2).join('')); user.title = actor;
      let utility = null;
      function showUtility(title, lines) {
        if (utility) utility.remove();
        utility = el('aside', 'to-utility', shell);
        el('h3', '', utility, title);
        const close = el('button', 'to-close', utility); icon(close, 'close'); close.setAttribute('aria-label', 'Close panel');
        close.addEventListener('click', () => { utility.remove(); utility = null; });
        for (const line of lines) el('p', '', utility, line);
        ctx.log('workspace-panel', { title });
      }
      org.addEventListener('click', () => showUtility('Workspaces', [workspaceName + ' / Operations', 'Regional service team / Member', 'Customer onboarding / Read only']));
      globalSearch.addEventListener('click', () => showUtility('Recent items', ['Quarterly account review', 'Regional service report', 'New hire access checklist']));
      notifications.addEventListener('click', () => showUtility('Notifications', [actor + ' mentioned you in the team handover.', 'Weekly export is ready to download.', 'The customer onboarding view was shared with your team.']));
      const nav = el('nav', 'to-nav' + (expanded ? ' expanded' : ''), shell);
      if (!navW) nav.hidden = true;
      nav.setAttribute('aria-label', 'Workspace navigation');
      const navItem = (label, image, count, current = false, project = false) => {
        const b = el('button', (current ? 'active' : '') + (project ? ' to-project' : ''), nav);
        b.type = 'button'; b.title = label; icon(b, image); el('span', 'nav-label', b, label);
        if (count !== null) el('span', 'nav-count', b, String(count));
        b.addEventListener('click', () => showUtility(label, [label + ' / Team workspace', 'Shared with the operations team', 'Last updated by ' + actor]));
      };
      navItem('Overview', 'app', null);
      navItem('Records', 'records', null, true);
      navItem('Customers', 'users', null);
      navItem('Reports', 'chart', null);
      navItem('Activity', 'clock', null);
      el('small', '', nav, 'Saved views');
      navItem('Pinned records', 'records', spec.rows.length, false, true);
      navItem('All records', 'records', wr.int(840, 1920), false, true);
      navItem('My queue', 'mail', wr.int(18, 43), false, true);
      navItem('Needs review', 'flag', wr.int(7, 16), false, true);
      navItem('Recently updated', 'clock', wr.int(48, 93), false, true);
      if (H >= 500) {
        el('small', '', nav, 'Projects');
        navItem('Onboarding', 'folder', null, false, true);
        navItem('Renewals', 'folder', null, false, true);
        navItem('Regional accounts', 'folder', null, false, true);
      }
      navItem('Settings', 'settings', null);
      if (contextual) {
        const context = el('aside', 'to-context', shell);
        el('h4', '', context, 'Workspace overview');
        el('strong', '', context, 'Operations team');
        el('p', '', context, 'Shared records and saved views for account operations.');
        el('h4', '', context, 'Recent activity');
        for (const [what, when] of [['Weekly export completed', '12 minutes ago'], ['Regional accounts shared', '38 minutes ago'], ['View settings updated', '1 hour ago']]) {
          const f = el('div', 'to-feed', context, what); el('small', '', f, when);
        }
        el('p', '', context, 'Team handover at 16:00. Check pending reviews before the end of your shift.');
      }
      const cardW = W - 18 - navW - contextW;
      const cardH = H - 54;
      const left = navW;
      const top = 36;
      const FIXED = 44 + 30 + 38 + 40 + 38 + 22 + 2;
      const rowH = Math.max(18, Math.min(32, Math.floor((cardH - FIXED - 4) / spec.pageSize)));
      const card = el('div', 'to-card', shell);
      Object.assign(card.style, { left: left + 'px', top: top + 'px', width: cardW + 'px', height: cardH + 'px' });
      card.classList.add('zebra', 'showdots');
      if (ag) card.classList.add('lines');
      if (wr.bool(0.25)) card.classList.add('upper');
      if (cardW < 1000 || spec.ood) card.classList.add('dense');
      const nominal = spec.cols.reduce((a, c) => a + c.w, 0);
      const scale = spec.scenario === 'resize' ? 1 : Math.max(0.55, Math.min(1.5, Math.floor(((cardW - 46) / nominal) * 100) / 100));
      const px = w => Math.round(w * scale);
      const toneOf = {};
      const statusOpts = fam.helpers.statusOptions(spec);
      statusOpts.forEach((s, i) => { toneOf[s] = STATUS_TONES[s] || TONES[i % TONES.length]; });

      // ---- head
      const head = el('div', 'to-head', card);
      const object = el('div', 'to-object', head); icon(object, 'records');
      const title = el('h2', '', object, spec.title);
      title.dataset.role = 'title';
      const count = el('span', 'to-chip', head, '');
      el('div', 'sp', head);
      const decoys = rng.sample(['Export', 'Columns', 'Share', 'Import', 'Refresh'], cardW > 700 ? 2 : 1);
      for (const d of decoys) {
        const b = el('button', 'to-btn', head, d);
        b.type = 'button';
        b.dataset.role = 'xtra';
        icon(b, d === 'Export' || d === 'Import' ? 'export' : d === 'Columns' || d === 'Refresh' ? 'settings' : 'users');
        b.addEventListener('click', () => showUtility(d, [d === 'Export' ? 'Scheduled export delayed: delivery destination unavailable. Records remain available here.' : 'Team workspace / ' + spec.title, 'Access: Operations team', 'Managed by ' + actor]));
      }
      const nb = el('button', 'to-btn pri', head, `New ${spec.entity}`);
      icon(nb, 'plus');
      nb.type = 'button';
      nb.dataset.role = 'xtra';
      nb.addEventListener('click', () => showUtility(`New ${spec.entity}`, ['Record creation is managed by the intake team.', 'Use the team intake workspace for new requests.']));

      const tabs = el('div', 'to-tabs', card);
      const currentView = el('button', 'active', tabs, 'Pinned records'); icon(currentView, 'records');
      const views = el('button', '', tabs, 'Shared views'); icon(views, 'down', false);
      views.addEventListener('click', () => showUtility('Shared views', ['Needs review / Operations team', 'Regional accounts / Account services', 'Recently updated / All members']));
      const activityTab = el('button', '', tabs, 'Activity');
      activityTab.addEventListener('click', () => showUtility('Record activity', ['Latest changes are saved to the workspace.', 'Weekly export completed 12 minutes ago.', actor + ' updated the view configuration.']));
      el('span', 'scope', tabs, 'Team workspace / ' + spec.entities);

      // ---- toolbar
      const tools = el('div', 'to-tools', card);
      let input = null;
      if (fam.helpers.searchable(spec)) {
        const sb = el('label', 'to-search', tools);
        sb.innerHTML = ICON.search;
        input = el('input', '', sb);
        input.type = 'text';
        input.placeholder = `Search ${spec.entities}…`;
        input.value = ctx.model.query || '';
        input.addEventListener('input', () => act(fam.helpers.setQuery(ctx.model, input.value), false));
      } else {
        const lab = el('span', 'to-selinfo', tools, '');
        lab.style.color = 'var(--muted)';
        lab.style.fontWeight = '500';
        lab.textContent = 'View: Pinned records';
      }
      const chips = el('div', '', tools);
      chips.style.cssText = 'display:flex;gap:6px;min-width:0;overflow:hidden';
      const clearAll = el('span', 'to-link', tools, 'Clear filters');
      clearAll.addEventListener('click', () => act(fam.helpers.clearFilters(ctx.model)));
      el('div', 'sp', tools);
      const selBar = el('div', '', tools);
      selBar.style.cssText = 'display:flex;align-items:center;gap:6px;flex:none';
      const selInfo = el('span', 'to-selinfo', selBar, '');
      const clearSelBtn = el('span', 'to-link', selBar, 'Clear');
      clearSelBtn.addEventListener('click', () => act(fam.helpers.clearSel(ctx.model)));
      const mk = (label, cls, key) => {
        const b = el('button', `to-btn ${cls}`, selBar, label);
        b.type = 'button';
        b.dataset.key = key;
        return b;
      };
      const markBtn = mk('Mark as', '', 'status');
      const archBtn = mk('Archive', '', 'archive');
      const delBtn = mk('Delete', 'danger', 'delete');
      icon(markBtn, 'down', false); icon(archBtn, 'archive'); icon(delBtn, 'trash');
      markBtn.addEventListener('click', () => act(fam.helpers.openMark(ctx.model)));
      archBtn.addEventListener('click', () => act(fam.helpers.askBulk(ctx.model, spec, 'archive', null)));
      delBtn.addEventListener('click', () => act(fam.helpers.askBulk(ctx.model, spec, 'delete', null)));
      const undoBtn = el('button', 'to-btn ghost', tools, 'Undo');
      icon(undoBtn, 'undo');
      undoBtn.type = 'button';
      undoBtn.addEventListener('click', () => act(fam.helpers.undo(ctx.model, spec)));

      // ---- grid
      const grid = el('div', 'to-grid', card);
      if (admin || ag) { card.classList.add('dense', 'showdots'); }
      if (ag) card.classList.add('to-ag');
      const hrow = el('div', 'to-hrow', grid);
      const hcb = el('div', 'to-cb', hrow);
      const allBox = el('input', '', hcb);
      allBox.type = 'checkbox';
      const rowpick = spec.scenario === 'multirow' && !(spec.judge && spec.judge.mode === 'confirm');
      if (rowpick) { allBox.style.visibility = 'hidden'; card.classList.add('rowpick'); }
      allBox.setAttribute('aria-label', 'Select all rows on this page');
      allBox.addEventListener('click', () => act(fam.helpers.toggleAll(ctx.model, spec)));
      const hcells = {};
      const parts = {};
      for (const c of spec.cols) {
        const h = el('div', 'to-h', hrow);
        h.tabIndex = 0;
        h.setAttribute('role', 'columnheader');
        h.dataset.col = c.id;
        const lbl = el('span', 'lbl', h, c.label);
        const arrow = el('span', 'arrow', h, '');
        el('span', 'gap', h);
        let funnel = null;
        if (c.type === 'cat') {
          funnel = el('span', 'ib', h);
          funnel.innerHTML = ICON.funnel;
          funnel.title = `Filter ${c.label}`;
          funnel.addEventListener('pointerdown', (e) => e.stopPropagation());
          funnel.addEventListener('click', () => act(fam.helpers.openMenu(ctx.model, spec, c.id, 'filter')));
        }
        const dots = el('span', 'ib dots', h);
        dots.innerHTML = ICON.dots;
        dots.title = 'Column options';
        dots.addEventListener('pointerdown', (e) => e.stopPropagation());
        dots.addEventListener('click', () => act(fam.helpers.openMenu(ctx.model, spec, c.id, 'col')));
        const edge = el('div', 'to-edge', h);
        edge.tabIndex = 0;
        edge.setAttribute('role', 'separator');
        edge.setAttribute('aria-orientation', 'vertical');
        edge.setAttribute('aria-label', `Resize ${c.label}`);
        hcells[c.id] = h;
        parts[c.id] = { lbl, arrow, funnel, dots, edge };
        bindHeader(h, c.id);
        bindEdge(edge, c.id);
      }
      const hfill = el('div', 'to-fill', hrow);
      const agHead = ag && spec.scenario === 'resize'; // AG Grid's own header and column resize
      if (agHead) hrow.style.display = 'none';
      const body = el('div', 'to-body', grid);
      let gridApi = null;
      let agHost = null;
      let drawing = false;
      const paneHeight = Math.min(rowH * spec.pageSize, Math.max(100, cardH - FIXED));
      if (virtual && !ag) {
        body.style.cssText = `height:${paneHeight}px;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain`;
        const scrollWindow = () => {
          if (!body.isConnected || drawing) return;
          const top = Math.min(Math.max(0, spec.rows.length - 6), Math.floor(body.scrollTop / rowH));
          if (top === ctx.model.virtualTop) return;
          ctx.update({ ...ctx.model, virtualTop: top, windowSize: 6 });
          drawRows(ctx.model);
        };
        body.addEventListener('scroll', scrollWindow);
        body.addEventListener('wheel', e => {
          e.preventDefault(); body.scrollTop += e.deltaY; scrollWindow();
        }, { passive: false });
      }

      function mirrorScreenRows() {
        if (spec.scenario !== 'paginate' || !body.isConnected) return;
        const viewport = (agHost && agHost.querySelector('.ag-body-viewport')) || body;
        const box = viewport.getBoundingClientRect();
        const rows = [...body.querySelectorAll(ag ? '.ag-row' : '.to-row')].filter(r => {
          const b = r.getBoundingClientRect(); return b.top >= box.top - 1 && b.bottom <= box.bottom + 1;
        }).map(r => ag ? r.getAttribute('row-id') : r.dataset.id);
        if (JSON.stringify(rows) !== JSON.stringify(ctx.model.screenRows)) ctx.update({ ...ctx.model, screenRows: rows });
      }
      if (spec.scenario === 'paginate' && !ag) {
        body.addEventListener('scroll', mirrorScreenRows);
        body.addEventListener('wheel', e => { e.preventDefault(); body.scrollTop += e.deltaY; mirrorScreenRows(); }, { passive: false });
      }

      const stream = el('div', 'to-stream', card);
      stream.hidden = cardH - FIXED - rowH * spec.pageSize < 95;
      el('h4', '', stream, 'Team updates');
      for (const [text, time] of [['Weekly records export completed', '12 min ago'], [actor + ' updated a shared view', '38 min ago'], ['Regional accounts review scheduled', '1 hour ago']]) {
        const line = el('div', 'to-stream-row', stream); icon(line, 'clock'); el('span', '', line, text); el('span', '', line, time);
      }

      // ---- footer
      const foot = el('div', 'to-foot', card);
      const info = el('span', 'info', foot, '');
      const pagerWrap = el('div', 'to-pager', foot);
      if (rng.bool(0.5)) { foot.style.justifyContent = 'space-between'; } else { info.style.order = '2'; info.style.marginLeft = 'auto'; }
      const rpp = el('span', 'info', foot, `Rows per page: ${spec.pageSize}`);
      const sizes = {};
      if (spec.scenario === 'paginate') {
        rpp.textContent = 'Rows:';
        rpp.style.display = 'flex'; rpp.style.alignItems = 'center';
        for (const n of [5, 10, 20]) {
          const b = el('button', 'to-pg', rpp, String(n)); b.type = 'button'; sizes[n] = b;
          b.addEventListener('click', () => act(fam.helpers.setPageSize(ctx.model, spec, n)));
        }
      }
      const facts = el('div', 'to-facts', card);
      rpp.style.order = '3';
      if (cardW < 760 && spec.scenario !== 'paginate') rpp.hidden = true;

      // ---- overlays inside the card
      const layer = el('div', '', card);
      let pop = null;
      let toast = null;
      let scrim = null;
      const popItems = {};

      function act(m, redraw = true) {
        if (spec.judge && spec.judge.mode === 'confirm' && m.history.length > ctx.model.history.length) { ctx.flag('irreversible'); return; }
        ctx.update(m);
        if (redraw) draw(ctx.model);
        else drawLite(ctx.model);
      }

      // Pressing outside an open popover closes it (the press itself still reaches its target).
      card.addEventListener('pointerdown', (e) => {
        const m = ctx.model;
        if (!(m.menu || m.markMenu)) return;
        if (pop && pop.contains(e.target)) return;
        if (e.target.closest && e.target.closest('.ib, [data-key="status"]')) return;
        // Light redraw only: the element under the pointer must survive so its click still lands.
        ctx.update(fam.helpers.closeMenus(m));
        drawHeader(ctx.model);
        drawPop(ctx.model);
      }, true);

      function bindHeader(h, col) {
        h.addEventListener('focus', () => focusIs({ kind: 'header', col }));
        h.addEventListener('blur', () => focusIs(null, { kind: 'header', col }));
        h.addEventListener('keydown', (e) => {
          if (e.target !== h) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            act(fam.helpers.headerClick(ctx.model, spec, col));
          }
        });
        h.addEventListener('pointerdown', (e) => {
          if (e.button !== 0) return;
          const x0 = e.clientX;
          const y0 = e.clientY;
          let moved = false;
          let ghost = null;
          let line = null;
          const cardR = () => card.getBoundingClientRect();
          const slotAt = (x) => {
            const others = ctx.model.order.filter((c) => c !== col);
            let k = 0;
            for (const o of others) {
              const r = hcells[o].getBoundingClientRect();
              if (r.left + r.width / 2 < x) k++;
            }
            return { k, others };
          };
          const move = (ev) => {
            if (!moved && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 6) return;
            if (!moved) {
              moved = true;
              ghost = el('div', 'to-ghost', card, spec.cols.find((c) => c.id === col).label);
              line = el('div', 'to-dropline', card);
              h.style.opacity = '.45';
              ctx.log('grab', { what: 'column', col });
            }
            const cr = cardR();
            const hr = h.getBoundingClientRect();
            ghost.style.left = ev.clientX - cr.left + 8 + 'px';
            ghost.style.top = hr.top - cr.top + 4 + 'px';
            const { k, others } = slotAt(ev.clientX);
            let x;
            if (!others.length) x = hr.left;
            else if (k === 0) x = hcells[others[0]].getBoundingClientRect().left;
            else x = hcells[others[k - 1]].getBoundingClientRect().right;
            line.style.left = x - cr.left - 1 + 'px';
            line.style.top = hr.top - cr.top + 'px';
            line.style.height = Math.min(cr.bottom, grid.getBoundingClientRect().bottom) - hr.top + 'px';
          };
          const up = (ev) => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
            h.style.opacity = '';
            if (ghost) ghost.remove();
            if (line) line.remove();
            if (moved) {
              const { k } = slotAt(ev.clientX);
              ctx.log('release', { what: 'column', col, k });
              act(fam.helpers.moveCol(ctx.model, col, k));
            } else {
              act(fam.helpers.headerClick(ctx.model, spec, col));
            }
          };
          window.addEventListener('pointermove', move);
          window.addEventListener('pointerup', up);
        });
      }

      function bindEdge(edge, col, keysOnly = false) {
        edge.addEventListener('focus', () => focusIs({ kind: 'edge', col }));
        edge.addEventListener('blur', () => focusIs(null, { kind: 'edge', col }));
        edge.addEventListener('keydown', (e) => {
          if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
          e.preventDefault();
          e.stopPropagation(); // AG Grid's header navigation would move focus off the handle
          const d = (e.key === 'ArrowRight' ? 1 : -1) * (e.shiftKey ? 1 : 10);
          act(fam.helpers.nudgeWidth(ctx.model, col, d));
        });
        if (keysOnly) { edge.tabIndex = 0; return; }
        edge.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          if (e.button !== 0) return;
          const x0 = e.clientX;
          const w0 = ctx.model.widths[col];
          edge.classList.add('live');
          ctx.log('grab', { what: 'edge', col });
          const move = (ev) => act(fam.helpers.setWidth(ctx.model, col, w0 + (ev.clientX - x0) / scale), false);
          const up = (ev) => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
            edge.classList.remove('live');
            ctx.log('release', { what: 'edge', col });
            if (ev.clientX !== x0) act(fam.helpers.setWidth(ctx.model, col, w0 + (ev.clientX - x0) / scale), false);
          };
          window.addEventListener('pointermove', move);
          window.addEventListener('pointerup', up);
        });
        edge.addEventListener('click', (e) => e.stopPropagation());
      }

      function focusIs(f, leaving) {
        const cur = ctx.model.focus;
        if (!f && !(cur && leaving && cur.kind === leaving.kind && cur.col === leaving.col)) return;
        if (JSON.stringify(cur) === JSON.stringify(f)) return;
        ctx.update(fam.helpers.setFocus(ctx.model, f));
        for (const [id, h] of Object.entries(hcells)) h.classList.toggle('focused', !!(f && f.kind === 'header' && f.col === id));
      }

      // ---- drawing
      const fmtShow = (a, b, n) => (n ? `Showing ${a}–${b} of ${n}` : 'No matching rows');

      function drawHeader(m) {
        // Reorder header cells in place (focus survives), then widths and states.
        const now = [...hrow.children].filter((x) => x.dataset.col).map((x) => x.dataset.col);
        if (now.join() !== m.order.join()) for (const id of m.order) hrow.insertBefore(hcells[id], hfill);
        for (const c of spec.cols) {
          const h = hcells[c.id];
          const p = parts[c.id];
          h.style.width = px(m.widths[c.id]) + 'px';
          h.title = c.label;
          const s = m.sort && m.sort.col === c.id ? m.sort.dir : null;
          h.classList.toggle('sorted', !!s);
          h.setAttribute('aria-sort', s === 'asc' ? 'ascending' : s === 'desc' ? 'descending' : 'none');
          p.arrow.innerHTML = s ? ICON[s === 'asc' ? 'up' : 'down'] : ''; p.arrow.style.width = '12px'; p.arrow.style.height = '12px';
          if (p.funnel) p.funnel.classList.toggle('on', !!m.filters[c.id] || !!(m.menu && m.menu.kind === 'filter' && m.menu.col === c.id));
          p.dots.classList.toggle('on', !!(m.menu && m.menu.kind === 'col' && m.menu.col === c.id));
        }
      }

      // cellEdit: the in-place field (the model keeps the draft; Enter / blur commit, Escape cancels).
      function cellField(cell, editing) {
        const inp = el('input', 'to-edit', cell);
        inp.type = 'text';
        inp.value = editing.draft;
        inp.setAttribute('aria-label', 'Edit cell');
        let done = false;
        const finish = (commit) => {
          if (done) return;
          done = true;
          act(commit ? fam.helpers.commitEdit(ctx.model, spec) : fam.helpers.cancelEdit(ctx.model));
        };
        inp.addEventListener('input', () => ctx.update(fam.helpers.setDraftCell(ctx.model, inp.value)));
        inp.addEventListener('keydown', (e) => {
          if (ag) e.stopPropagation();
          if (e.key === 'Enter') { e.preventDefault(); finish(true); } else if (e.key === 'Escape') { e.preventDefault(); finish(false); }
        });
        inp.addEventListener('blur', () => finish(true));
        editInput = inp;
        inp.focus();
        inp.select();
      }

      function decorate(cell, row, id, m) {
        const nameId = { tickets: 'contact', orders: 'customer', people: 'name', inventory: 'product', invoices: 'client' }[spec.domain];
        if (id === nameId && rowH >= 24) {
          const text = String(fam.helpers.valueOf(m, spec, row, id));
          const avatar = el('b', 'to-avatar', cell, text.split(' ').map(x => x[0]).slice(0,2).join(''));
          cell.prepend(avatar);
        }
        if (id === 'priority') { cell.classList.add('to-priority', String(row.c[id]).toLowerCase()); icon(cell, 'flag'); }
      }

      function drawRows(m) {
        if (ag) { drawAg(m); return; }
        drawing = true;
        const scrollTop = body.scrollTop;
        body.replaceChildren();
        if (virtual) el('div', '', body).style.height = (m.virtualTop || 0) * rowH + 'px';
        const rows = fam.helpers.pageRows(m, spec);
        const sel = new Set(m.selected);
        for (const r of rows) {
          const row = el('div', 'to-row', body);
          row.style.height = rowH + 'px';
          row.dataset.id = r.id;
          if (sel.has(r.id)) row.classList.add('sel');
          const cb = el('div', 'to-cb', row);
          if (rowpick) {
            row.addEventListener('click', (e) => act(fam.helpers.rowClick(ctx.model, spec, r.id, { ctrl: e.ctrlKey || e.metaKey, shift: e.shiftKey })));
          } else {
            const box = el('input', '', cb);
            box.type = 'checkbox';
            box.checked = sel.has(r.id);
            box.dataset.id = r.id;
            box.addEventListener('click', (e) => act(fam.helpers.toggleRow(ctx.model, spec, r.id, e.shiftKey)));
          }
          if (!rowpick && (spec.scenario === 'bulk' || spec.scenario === 'colfilter')) row.addEventListener('click', e => { if (!e.target.closest('input')) act(fam.helpers.rowClick(ctx.model, spec, r.id, { ctrl: e.ctrlKey || e.metaKey, shift: e.shiftKey })); });
          for (const id of m.order) {
            const c = spec.cols.find((x) => x.id === id);
            const cell = el('div', 'to-c', row);
            cell.style.width = px(m.widths[id]) + 'px';
            const text = fam.helpers.cellText(spec, r, id, m);
            cell.dataset.col = id;
            if (m.edits && m.edits[r.id] && m.edits[r.id][id] !== undefined) cell.classList.add('edited');
            if (inline) cell.addEventListener('dblclick', () => act(fam.helpers.startEdit(ctx.model, spec, r.id, id)));
            if (m.editing && m.editing.row === r.id && m.editing.col === id) { cellField(cell, m.editing); continue; }
            if (c.type === 'num' || c.type === 'money') cell.classList.add('r');
            if (c.type === 'id') cell.classList.add('mono');
            if (id === spec.statusCol) {
              const pill = el('span', 'to-pill', cell, text);
              const tone = toneOf[text] || '#868e96';
              pill.style.setProperty('--status-tone', tone);
              pill.style.color = tone;
              pill.style.background = `color-mix(in srgb, ${tone} 13%, transparent)`;
              if (m.status[r.id] !== undefined) pill.classList.add('changed');
            } else { const textEl = el('span', '', cell, text); textEl.title = text; }
            decorate(cell, r, id, m);
          }
          el('div', 'to-fill', row);
        }
        if (!rows.length) {
          const empty = el('div', 'to-empty', body); icon(empty, 'search');
          el('strong', '', empty, 'No records found');
          el('p', '', empty, 'Try a different search or remove a filter to see more records.');
          const reset = el('button', 'to-btn', empty, 'Clear filters'); reset.addEventListener('click', () => act(fam.helpers.clearFilters(ctx.model)));
        }
        if (virtual) {
          el('div', '', body).style.height = Math.max(0, spec.rows.length - (m.virtualTop || 0) - rows.length) * rowH + 'px';
          body.scrollTop = Math.floor(scrollTop / rowH) === (m.virtualTop || 0) ? scrollTop : (m.virtualTop || 0) * rowH;
        }
        else { body.style.maxHeight = paneHeight + 'px'; body.style.overflowY = 'auto'; }
        grid.style.height = 40 + paneHeight + 2 + 'px';
        drawing = false;
        mirrorScreenRows();
      }

      function drawAg(m) {
        drawing = true;
        const initial = !gridApi;
        if (!gridApi) {
          body.style.height = paneHeight + 'px';
          agHost = el('div', 'ag-theme-quartz', body);
          agHost.style.cssText = `height:${paneHeight + (agHead ? 40 : 0)}px;width:100%`;
          const defs = [{ colId: '_select', width: 40, minWidth: 40, maxWidth: 40, cellRenderer: p => {
            const wrap = document.createElement('div'); wrap.className = 'to-agcheck';
            if (rowpick) return wrap;
            const b = document.createElement('input'); b.type = 'checkbox'; b.checked = ctx.model.selected.includes(p.data.id);
            b.setAttribute('aria-label', 'Select ' + p.data.c[spec.cols[0].id]);
            b.addEventListener('click', e => { e.stopPropagation(); act(fam.helpers.toggleRow(ctx.model, spec, p.data.id, e.shiftKey)); });
            wrap.append(b); return wrap;
          } }, ...m.order.map(id => ({ colId: id, field: id, width: px(m.widths[id]), minWidth: 40,
            headerName: spec.cols.find(c => c.id === id).label, resizable: agHead,
            cellRenderer: p => {
              const cell = document.createElement('div'); cell.className = 'to-agcell';
              const current = ctx.model;
              const editing = current.editing;
              if (editing && editing.row === p.data.id && editing.col === id) cellField(cell, editing);
              else {
                const span = document.createElement('span'); span.textContent = fam.helpers.cellText(spec, p.data, id, current);
                span.title = span.textContent;
                if (id === spec.statusCol) { span.className = 'to-pill'; const tone = toneOf[span.textContent] || '#868e96'; span.style.setProperty('--status-tone', tone); span.style.color = tone; span.style.background = `color-mix(in srgb, ${tone} 13%, transparent)`; }
                cell.append(span); decorate(cell, p.data, id, current);
              }
              if (inline) cell.addEventListener('dblclick', () => act(fam.helpers.startEdit(ctx.model, spec, p.data.id, id)));
              return cell;
            } }))];
          gridApi = agGrid.createGrid(agHost, {
            columnDefs: defs, rowData: [], getRowId: p => p.data.id, headerHeight: agHead ? 40 : 0, rowHeight: rowH,
            defaultColDef: { sortable: false, resizable: false, suppressMovable: true, suppressKeyboardEvent: p => !!p.event.target.closest('.to-edit') },
            overlayNoRowsTemplate: '<div class="to-empty"><strong>No records found</strong><p>Try a different search or remove a filter to see more records.</p></div>',
            animateRows: false, suppressAnimationFrame: true, suppressAsyncEvents: true,
            suppressScrollOnNewData: true, rowBuffer: 0, suppressCellFocus: true,
            suppressRowClickSelection: true, suppressColumnVirtualisation: true,
            getRowClass: p => ctx.model.selected.includes(p.data.id) ? 'to-agselected' : '',
            onColumnResized: e => {
              if (!agHead || drawing || !e.column || !String(e.source).startsWith('ui')) return;
              const col = e.column.getColId();
              const next = fam.helpers.setWidth(ctx.model, col, e.column.getActualWidth() / scale);
              if (!e.finished) { ctx.update(next); drawTools(ctx.model); return; }
              ctx.log('release', { what: 'edge', col });
              act(next, false);
            },
            onCellClicked: p => {
              if (p.column.getColId() === '_select' || inline) return;
              act(fam.helpers.rowClick(ctx.model, spec, p.data.id, { ctrl: p.event.ctrlKey || p.event.metaKey, shift: p.event.shiftKey }));
            },
            onBodyScroll: e => {
              if (spec.scenario === 'paginate') { if (!drawing) mirrorScreenRows(); return; }
              if (!virtual || drawing || !agHost.isConnected) return;
              const top = Math.max(0, Math.min(spec.rows.length - 6, Math.floor(e.top / rowH)));
              if (top !== ctx.model.virtualTop) {
                ctx.update({ ...ctx.model, virtualTop: top, windowSize: 6 });
                drawFoot(ctx.model);
              }
            },
          });
          previousGrid = gridApi;
        }
        drawing = true;
        const rows = virtual ? fam.helpers.visibleRows(m, spec) : fam.helpers.pageRows(m, spec);
        // Clone row objects: replacing rowData forces controlled renderers to reflect edits and selection.
        gridApi.setGridOption('rowData', rows.map(r => ({ ...r, stamp: JSON.stringify([m.selected, m.edits, m.status, m.editing]) })));
        gridApi.refreshCells({ force: true });
        if (virtual && initial) gridApi.ensureIndexVisible(m.virtualTop || 0, 'top');
        if (agHead) syncAgHead(m);
        if (m.editing) {
          const field = agHost.querySelector('.to-edit');
          if (field) { editInput = field; field.focus(); }
        }
        grid.style.height = 40 + paneHeight + 2 + 'px';
        drawing = false;
        mirrorScreenRows();
      }

      // Model widths onto AG Grid's columns (start states, keyboard nudges, clamping), and the handles as
      // focusable separators in keyboard episodes.
      function syncAgHead(m) {
        const fix = m.order.filter(id => gridApi.getColumn(id).getActualWidth() !== px(m.widths[id]))
          .map(id => ({ key: id, newWidth: px(m.widths[id]) }));
        if (fix.length) gridApi.setColumnWidths(fix, true, 'api');
        for (const id of m.order) {
          const handle = agHandle(id);
          if (!handle || handle.dataset.bound) continue;
          handle.dataset.bound = '1';
          handle.setAttribute('role', 'separator');
          handle.setAttribute('aria-orientation', 'vertical');
          handle.setAttribute('aria-label', `Resize ${spec.cols.find(c => c.id === id).label}`);
          if (spec.keys) bindEdge(handle, id, true);
          handle.addEventListener('mousedown', () => { if (!drawing) ctx.log('grab', { what: 'edge', col: id }); });
        }
      }
      const agHandle = id => agHost && agHost.querySelector(`.ag-header-cell[col-id="${id}"] .ag-header-cell-resize`);

      function drawTools(m) {
        facts.textContent = fam.facts(m, spec).map(f => `${f.label}: ${f.value}`).join('  ·  ');
        const saved = el('span', '', facts, m.editing ? 'Editing record' : 'All changes saved');
        saved.style.cssText = 'margin-left:auto;display:flex;align-items:center;gap:4px;white-space:nowrap';
        icon(saved, m.editing ? 'clock' : 'check');
        if (input && input.value !== (m.query || '')) input.value = m.query || '';
        chips.replaceChildren();
        for (const [col, vals] of Object.entries(m.filters)) {
          const c = spec.cols.find((x) => x.id === col);
          const ch = el('span', 'to-fchip', chips);
          ch.title = `${c.label}: ${vals.join(', ')}`;
          el('span', '', ch, `${c.label}:`);
          el('b', '', ch, vals.length ? vals.join(', ') : '(none)');
          const x = el('i', '', ch); icon(x, 'close');
          x.addEventListener('click', () => act(fam.helpers.clearFilter(ctx.model, col)));
        }
        clearAll.hidden = !(Object.keys(m.filters).length || m.query);
        const n = m.selected.length;
        selBar.style.display = n ? 'flex' : 'none';
        const viewLabel = tools.querySelector(':scope > .to-selinfo');
        if (viewLabel) viewLabel.style.display = n && cardW < 900 ? 'none' : '';
        chips.style.maxWidth = n && cardW < 900 ? '145px' : '';
        if (input) input.parentElement.style.display = n && cardW < 900 ? 'none' : 'flex';
        selInfo.textContent = `${n} selected`;
        undoBtn.hidden = !m.history.length;
        const vis = fam.helpers.visibleRows(m, spec).length;
        count.textContent = `${vis}${vis !== spec.rows.length ? ` of ${spec.rows.filter((r) => !m.removed[r.id]).length}` : ''}`;
        const rows = fam.helpers.pageRows(m, spec).map((r) => r.id);
        const on = rows.filter((id) => m.selected.includes(id)).length;
        allBox.checked = rows.length > 0 && on === rows.length;
        allBox.indeterminate = on > 0 && on < rows.length;
      }

      let editInput = null;
      const pgButtons = {};
      function drawFoot(m) {
        const n = fam.helpers.visibleRows(m, spec).length;
        const pages = fam.helpers.pageCount(m, spec);
        const p = Math.min(m.page, pages - 1);
        info.textContent = virtual ? `Showing ${(m.virtualTop || 0) + 1}–${Math.min(n, (m.virtualTop || 0) + 6)} of ${n}` : fmtShow(p * sizeOf(m) + 1, Math.min(n, (p + 1) * sizeOf(m)), n);
        for (const [n, b] of Object.entries(sizes)) b.classList.toggle('cur', Number(n) === sizeOf(m));
        pagerWrap.replaceChildren();
        for (const k of Object.keys(pgButtons)) delete pgButtons[k];
        const btn = (label, key, disabled, cls = '') => {
          const b = el('button', `to-pg ${cls}`, pagerWrap, label);
          b.type = 'button';
          if (key === 'prev' || key === 'next') icon(b, key === 'prev' ? 'left' : 'right', key === 'prev');
          b.disabled = !!disabled;
          pgButtons[key] = b;
          return b;
        };
        if (virtual) return;
        btn('Prev', 'prev', p === 0).addEventListener('click', () => act(fam.helpers.gotoPage(ctx.model, spec, ctx.model.page - 1)));
        fam.helpers.pagerItems(p, pages).forEach((it, i) => {
          if (it === '…') { el('span', 'to-pg dots', pagerWrap, '…'); return; }
          const b = btn(String(it + 1), `p${it}`, false, it === p ? 'cur' : '');
          b.addEventListener('click', () => act(fam.helpers.gotoPage(ctx.model, spec, it)));
          void i;
        });
        btn('Next', 'next', p >= pages - 1).addEventListener('click', () => act(fam.helpers.gotoPage(ctx.model, spec, ctx.model.page + 1)));
      }

      function place(box, anchorEl, alignRight) {
        const cr = card.getBoundingClientRect();
        const ar = anchorEl.getBoundingClientRect();
        const bw = box.offsetWidth;
        const bh = box.offsetHeight;
        let x = (alignRight ? ar.right - bw : ar.left) - cr.left;
        x = Math.max(6, Math.min(cardW - bw - 6, x));
        let y = ar.bottom - cr.top + 4;
        if (y + bh > cardH - 4) y = Math.max(4, ar.top - cr.top - bh - 4);
        box.style.left = x + 'px';
        box.style.top = y + 'px';
      }

      function drawPop(m) {
        if (pop) pop.remove();
        pop = null;
        for (const k of Object.keys(popItems)) delete popItems[k];
        const item = (parent, key, label, fn, cls = 'to-mi') => {
          const it = el('div', cls, parent, label);
          popItems[key] = it;
          if (['asc', 'desc', 'clear'].includes(key)) icon(it, key === 'asc' ? 'up' : key === 'desc' ? 'down' : 'close');
          if (fn) it.addEventListener('click', fn);
          return it;
        };
        if (m.menu && m.menu.kind === 'col') {
          pop = el('div', 'to-pop', layer);
          const col = m.menu.col;
          item(pop, 'asc', 'Sort ascending', () => act(fam.helpers.setSort(ctx.model, col, 'asc')));
          item(pop, 'desc', 'Sort descending', () => act(fam.helpers.setSort(ctx.model, col, 'desc')));
          item(pop, 'clear', 'Clear sort', () => act(fam.helpers.setSort(ctx.model, col, null)));
          el('div', 'to-sep', pop);
          item(pop, 'pin', 'Pin column', null, 'to-mi dis');
          item(pop, 'hide', 'Hide column', null, 'to-mi dis');
          place(pop, parts[col].dots, true);
        } else if (m.menu && m.menu.kind === 'filter') {
          pop = el('div', 'to-pop', layer);
          const col = m.menu.col;
          const c = spec.cols.find((x) => x.id === col);
          el('h4', '', pop, `Filter by ${c.label}`);
          const all = fam.helpers.distinct(spec, col, m);
          const d = new Set(m.menu.draft);
          const opt = (key, label, checked, fn) => {
            const o = el('div', 'to-opt', pop);
            const b = el('input', '', o);
            b.type = 'checkbox';
            b.checked = checked;
            if (key === 'all') b.indeterminate = d.size > 0 && d.size < all.length;
            el('span', '', o, label);
            o.addEventListener('click', fn);
            popItems[key] = o;
          };
          opt('all', '(Select all)', d.size === all.length, () => act(fam.helpers.draftAll(ctx.model, spec)));
          for (const v of all) opt(`v:${v}`, v, d.has(v), () => act(fam.helpers.toggleDraft(ctx.model, v)));
          const btns = el('div', 'btns', pop);
          const clr = el('button', 'to-btn', btns, 'Clear');
          clr.type = 'button';
          clr.addEventListener('click', () => act(fam.helpers.clearFilter(ctx.model, col)));
          const ap = el('button', 'to-btn pri', btns, 'Apply');
          ap.type = 'button';
          ap.addEventListener('click', () => act(fam.helpers.applyFilter(ctx.model, spec)));
          popItems.apply = ap;
          place(pop, parts[col].funnel || parts[col].dots, false);
        } else if (m.markMenu) {
          pop = el('div', 'to-pop', layer);
          el('h4', '', pop, 'Set status to');
          for (const s of statusOpts) {
            const it = item(pop, `s:${s}`, '', () => act(fam.helpers.runBulk(ctx.model, spec, 'status', s)));
            const dot = el('span', '', it);
            dot.style.cssText = `width:8px;height:8px;border-radius:50%;background:${toneOf[s]}`;
            el('span', '', it, s);
          }
          place(pop, markBtn, false);
        }
      }

      function drawToastDialog(m) {
        if (toast) toast.remove();
        toast = null;
        if (m.toast && m.history.length) {
          const last = m.history[m.history.length - 1];
          const n = last.ids.length;
          const what = n === 1 ? spec.entity : spec.entities;
          const verb = last.action === 'status' ? `marked ${last.value}` : last.action === 'archive' ? 'archived' : 'deleted';
          toast = el('div', 'to-toast', layer);
          el('span', '', toast, `${n} ${what} ${verb}`);
          const u = el('span', 'u', toast, 'Undo');
          u.addEventListener('click', () => act(fam.helpers.undo(ctx.model, spec)));
          const x = el('span', 'x', toast); icon(x, 'close');
          x.addEventListener('click', () => act(fam.helpers.dismissToast(ctx.model)));
          toast.style.bottom = 46 + 10 + 'px';
        }
        if (scrim) scrim.remove();
        scrim = null;
        if (m.confirm) {
          scrim = el('div', 'to-scrim', layer);
          const dlg = el('div', 'to-dialog', scrim);
          const n = m.selected.length;
          el('h3', '', dlg, `Delete ${n} ${n === 1 ? spec.entity : spec.entities}?`);
          el('p', '', dlg, 'The selected rows will be removed from this list. You can undo this from the toolbar.');
          const btns = el('div', 'btns', dlg);
          const cancel = el('button', 'to-btn', btns, 'Cancel');
          cancel.type = 'button';
          cancel.addEventListener('click', () => act(fam.helpers.cancelConfirm(ctx.model)));
          const ok = el('button', 'to-btn pri', btns, 'Delete');
          ok.type = 'button';
          ok.style.background = '#c92a2a';
          ok.style.borderColor = '#c92a2a';
          ok.addEventListener('click', () => act(fam.helpers.runBulk(ctx.model, spec, 'delete', null)));
          popItems.cancel = cancel;
          popItems.ok = ok;
        }
      }

      function draw(m) {
        drawHeader(m);
        drawRows(m);
        drawTools(m);
        drawFoot(m);
        drawPop(m);
        drawToastDialog(m);
      }
      // While typing or dragging an edge: no popover / pager rebuild needed beyond rows and header.
      function drawLite(m) {
        drawHeader(m);
        drawRows(m);
        drawTools(m);
        drawFoot(m);
      }

      draw(ctx.model);

      const fail = (t) => { throw new Error(`use-data-grid/grid cannot locate ${JSON.stringify(t)}`); };
      view = {
        locate(t) {
          const m = ctx.model;
          if (t.header) return pointOn(parts[t.header].lbl) || pointOn(hcells[t.header]);
          if (t.menuBtn) return pointOn(parts[t.menuBtn].dots);
          if (t.funnel) return pointOn(parts[t.funnel].funnel);
          if (agHead && t.edge) return pointOn(agHandle(t.edge));
          if (agHead && t.edgeAt) {
            const [col, w] = t.edgeAt;
            const r = agHandle(col).getBoundingClientRect();
            return [r.left + r.width / 2 + px(w) - gridApi.getColumn(col).getActualWidth(), r.top + r.height / 2];
          }
          if (t.edge) {
            const r = parts[t.edge].edge.getBoundingClientRect();
            return [r.left + r.width / 2, r.top + r.height / 2];
          }
          if (t.edgeAt) {
            const [col, w] = t.edgeAt;
            const hr = hcells[col].getBoundingClientRect();
            const er = parts[col].edge.getBoundingClientRect();
            return [hr.left + w * scale, er.top + er.height / 2];
          }
          if (t.slot !== undefined) {
            const others = m.order.filter((c) => c !== t.col).map((c) => hcells[c].getBoundingClientRect());
            const hr = hcells[t.col].getBoundingClientRect();
            const y = hr.top + hr.height / 2;
            if (!others.length) return [hr.left + hr.width / 2, y];
            if (t.slot <= 0) return [others[0].left + 4, y];
            if (t.slot >= others.length) return [others[others.length - 1].right - 4, y];
            return [(others[t.slot - 1].right + others[t.slot].left) / 2, y];
          }
          if (t.menuItem) return pointOn(popItems[t.menuItem]);
          if (t.filterOpt !== undefined) return pointOn(popItems[`v:${t.filterOpt}`]);
          if (t.filterAll) return pointOn(popItems.all);
          if (t.filterApply) return pointOn(popItems.apply);
          if (t.search) return pointOn(input);
          if (t.clearFilters) return pointOn(clearAll);
          if (t.viewport) return pointOn(ag ? agHost.querySelector('.ag-body-viewport') : body);
          if (t.pageSize) return pointOn(sizes[t.pageSize]);
          if (ag && t.row) return pointOn(agHost.querySelector(`[row-id="${t.row}"] input[type=checkbox]`));
          if (ag && t.rowBody) return pointOn(agHost.querySelector(`[row-id="${t.rowBody}"] [col-id="${m.order[0]}"]`));
          if (ag && t.cell) return pointOn(agHost.querySelector(`[row-id="${t.cell[0]}"] [col-id="${t.cell[1]}"]`));
          if (t.row) return pointOn(body.querySelector(`input[data-id="${t.row}"]`));
          if (t.rowBody) return pointOn(body.querySelector(`.to-row[data-id="${t.rowBody}"] .to-c`));
          if (t.cell) return pointOn(body.querySelector(`.to-row[data-id="${t.cell[0]}"] .to-c[data-col="${t.cell[1]}"]`));
          if (t.cellInput) return pointOn(editInput && editInput.isConnected ? editInput : null);
          if (t.all) return pointOn(allBox);
          if (t.clearSel) return pointOn(clearSelBtn);
          if (t.page !== undefined) return pointOn(pgButtons[`p${t.page}`]);
          if (t.pager) return pointOn(pgButtons[t.pager]);
          if (t.bulk) return pointOn({ status: markBtn, archive: archBtn, delete: delBtn }[t.bulk]);
          if (t.statusOpt) return pointOn(popItems[`s:${t.statusOpt}`]);
          if (t.confirm) return pointOn(popItems[t.confirm]);
          if (t.undo) return pointOn(undoBtn.hidden ? null : undoBtn) || pointOn(toast && toast.querySelector('.u'));
          if (t.blank) return pointOn(title);
          return null;
        },
      };

      return { anchors: [card], sync: (m) => draw(m) };
    },

    locate(t) {
      return (view && view.locate(t)) || (() => { throw new Error(`use-data-grid/grid cannot locate ${JSON.stringify(t)}`); })();
    },
  };
  env.widget(gridWidget);
  env.widget({ ...gridWidget, name: 'aggrid', scenarios: ['crm', 'bulk', 'colfilter', 'virtual', 'paginate', 'multirow', 'cellEdit', 'resize'],
    uses: [['../vendor/ag-grid-community-32.0.0/ag-grid-community.min']],
    render(ctx) { return gridWidget.render(ctx, true); },
  });
})();
