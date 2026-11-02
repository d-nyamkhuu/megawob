/* use-data-grid/_theme: structural CSS, SVG icons and default grid design tokens. */
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

  const TOKENS = {
    css: CSS,
    extraCss: '',
    font: '12px/1.4 system-ui,sans-serif',
    dangerColor: '#c92a2a',
    fallbackTone: '#868e96',
    icons: ICON,
    tones: TONES,
    statusTones: STATUS_TONES,
    brand: 'Relay',
    expandedAt: 1000,
    contextAt: 1280,
    contextHeight: 580,
    navWidth: 156,
    railWidth: 44,
    contextWidth: 188,
    cardInsetX: 18,
    cardInsetY: 54,
    cardTop: 36,
    fixedHeight: 44 + 30 + 38 + 40 + 38 + 22 + 2,
    rowMin: 18,
    rowMax: 32,
    decoys: ['Export', 'Columns', 'Share', 'Import', 'Refresh'],
    pageSizes: [5, 10, 20],
    emptyTitle: 'No records found',
    emptyText: 'Try a different search or remove a filter to see more records.',
  };

  env.template('use-data-grid/_theme', () => TOKENS);
})();
