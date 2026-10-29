/* fill-form/_assets: constant styles and artwork. CSS text is preserved byte for byte. */
(function () {
  'use strict';
  const ICONS = {
        file:'M6 3h8l4 4v14H6z M14 3v5h4 M9 12h6 M9 16h6',
        inbox:'M4 4h16v15H4z M4 13h5l2 3h2l2-3h5',
        stack:'M4 7l8-4 8 4-8 4z M4 12l8 4 8-4 M4 17l8 4 8-4',
        search:'M16 16l5 5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
        bell:'M6 8a6 6 0 0 1 12 0v7l2 3H4l2-3z M10 21h4',
        history:'M4 5v5h5 M4 10a8 8 0 1 1 1 8 M12 7v6l4 2',
        check:'M5 12l4 4L19 6', close:'M6 6l12 12 M18 6L6 18',
        minus:'M5 12h14', plus:'M5 12h14 M12 5v14',
        fit:'M8 3H3v5 M16 3h5v5 M3 16v5h5 M21 16v5h-5 M7 7h10v10H7z',
        hand:'M8 13V6a2 2 0 0 1 4 0v6 M12 8a2 2 0 0 1 4 0v5 M16 10a2 2 0 0 1 4 0v7c0 4-3 5-6 5h-2c-3 0-4-2-6-5l-3-4a2 2 0 0 1 3-2l2 2',
        chevron:'M9 5l7 7-7 7', down:'M5 9l7 7 7-7',
        more:'M5 11v2 M12 11v2 M19 11v2',
        info:'M12 11v6 M12 7v1 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
        flag:'M5 22V3h14l-3 5 3 5H5', lock:'M6 10h12v11H6z M8 10V6a4 4 0 0 1 8 0v4',
        folder:'M3 6h7l2 3h9v12H3z', grid:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
      };

  const WORKSPACE_CSS = `
      .ff-icon { display:inline-flex; flex:none; align-items:center; justify-content:center; width:16px; height:16px; vertical-align:middle; }
      .ff-icon svg { display:block; width:100%; height:100%; }
      .ff-workspace { position:relative; display:flex; flex-direction:column; flex:none; color:var(--fg); background:var(--panel);
        border:1px solid var(--line); border-radius:6px; overflow:visible; font:12px/1.4 system-ui,sans-serif; box-shadow:0 2px 8px #0001; }
      .ff-workspace button { font:inherit; color:inherit; cursor:pointer; }
      .ff-workspace .ff-tool { display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:5px 7px; min-height:28px;
        border:1px solid transparent; border-radius:4px; background:transparent; color:var(--muted); white-space:nowrap; }
      .ff-workspace .ff-tool:hover { color:var(--fg); background:var(--bg); border-color:var(--line); }
      .ff-workspace .ff-tool[aria-pressed=true] { color:var(--accent); background:color-mix(in srgb,var(--accent) 10%,var(--panel)); }
      .ff-appbar { display:flex; align-items:center; gap:16px; min-height:42px; flex:none; padding:0 12px; border-bottom:1px solid var(--line); }
      .ff-product { display:flex; align-items:center; gap:7px; font-size:15px; font-weight:750; letter-spacing:-.3px; white-space:nowrap; }
      .ff-product .ff-icon { color:var(--accent); width:21px; height:21px; }
      .ff-appnav { display:flex; align-items:stretch; align-self:stretch; gap:12px; }
      .ff-appnav button { border:0; border-bottom:2px solid transparent; padding:0 3px; background:transparent; color:var(--muted); }
      .ff-appnav button.active { border-bottom-color:var(--accent); color:var(--fg); font-weight:650; }
      .ff-app-tools { display:flex; align-items:center; gap:3px; margin-left:auto; }
      .ff-avatar { display:grid; place-items:center; width:25px; height:25px; background:color-mix(in srgb,var(--accent) 14%,var(--panel)); color:var(--accent); border-radius:50%; font-weight:650; font-size:10px; }
      .ff-contextbar { display:flex; align-items:center; gap:8px; padding:0 12px; min-height:34px; flex:none; background:var(--bg); border-bottom:1px solid var(--line); color:var(--muted); font-size:11px; }
      .ff-contextbar .ff-icon { width:12px; height:12px; } .ff-contextbar strong { color:var(--fg); font-weight:600; }
      .ff-contextbar .ff-chip { margin-left:auto; }
      .ff-chip { display:inline-flex; align-items:center; gap:5px; color:var(--accent); background:color-mix(in srgb,var(--accent) 9%,var(--panel)); border:1px solid color-mix(in srgb,var(--accent) 20%,var(--line)); border-radius:4px; padding:2px 6px; font-size:10px; white-space:nowrap; }
      .ff-workbody { display:flex; flex:1; min-height:0; min-width:0; }
      .ff-workcenter { display:flex; justify-content:center; align-items:center; position:relative; flex:1; min-height:0; min-width:0; background:var(--bg); }
      .ff-workspace.long .ff-workcenter { align-items:flex-start; } .ff-workspace.long .ff-workbody { flex:none; }
      .ff-queue { flex:none; width:40px; display:flex; flex-direction:column; gap:5px; border-right:1px solid var(--line); background:var(--panel); padding:10px 4px; }
      .ff-queue .ff-tool { position:relative; width:30px; height:32px; padding:5px; }
      .ff-queue .ff-queue-label,.ff-queue-list,.ff-queue-summary { display:none; }
      .ff-queue-rule { height:1px; background:var(--line); margin:4px; }
      .ff-queue-dot { position:absolute; width:5px; height:5px; border-radius:50%; background:#ce8535; right:5px; top:4px; }
      .ff-workspace:is(.wide,.compact) .ff-queue { width:164px; padding:10px 8px; }
      .ff-workspace:is(.wide,.compact) .ff-queue .ff-tool { width:100%; justify-content:flex-start; gap:7px; padding:5px 8px; }
      .ff-workspace:is(.wide,.compact) .ff-queue-label { display:inline; font-size:11px; }
      .ff-workspace:is(.wide,.compact) .ff-queue-list { display:block; padding-top:6px; }
      .ff-workspace:is(.wide,.compact) .ff-queue-summary { display:block; margin:0 5px; font-size:9px; color:var(--muted); text-transform:uppercase; letter-spacing:.6px; }
      .ff-workspace.compact .ff-queue { width:128px; }
      .ff-workspace.compact .ff-queue-record:nth-child(n+5) { display:none; }
      .ff-workspace.compact .ff-queue-label { font-size:10px; }
      .ff-workspace.compact .ff-queue .ff-tool { padding:5px 4px; gap:5px; }
      .ff-queue { overflow:hidden; }
      .ff-queue-record { display:block; padding:9px 7px; border:0; border-bottom:1px solid var(--line); background:transparent; width:100%; text-align:left; }
      .ff-queue-record.active { border-left:2px solid var(--accent); background:color-mix(in srgb,var(--accent) 7%,var(--panel)); }
      .ff-queue-record strong { display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:11px; font-weight:600; }
      .ff-queue-record small { display:block; font-size:10px; color:var(--muted); margin-top:3px; }
      .ff-inspector { width:174px; flex:none; border-left:1px solid var(--line); padding:12px 11px; background:var(--panel); overflow:hidden; }
      .ff-inspector h4 { margin:0 0 12px; font-size:11px; } .ff-inspector dl { margin:0; }
      .ff-inspector dt { color:var(--muted); font-size:10px; margin-top:10px; } .ff-inspector dd { margin:2px 0 0; font-size:11px; }
      .ff-activity { border-top:1px solid var(--line); margin-top:16px; padding-top:12px; }
      .ff-activity p { border-left:1px solid var(--line); padding:0 0 10px 9px; margin:0; font-size:10px; } .ff-activity small { display:block; color:var(--muted); margin-top:2px; }
      .ff-work-status { display:flex; justify-content:space-between; align-items:center; gap:8px; flex:none; min-height:25px; padding:3px 12px;
        border-top:1px solid var(--line); background:var(--panel); font-size:10px; color:var(--muted); }
      .ff-popover { position:absolute; z-index:120; right:12px; top:41px; width:280px; max-height:300px; overflow:auto; padding:14px;
        background:var(--panel); border:1px solid var(--line); border-radius:6px; box-shadow:0 12px 36px #0003; color:var(--fg); }
      .ff-popover[hidden] { display:none; } .ff-popover h3 { font-size:13px; margin:0 0 12px; padding-right:25px; }
      .ff-popover .ff-pop-close { position:absolute; right:7px; top:6px; } .ff-popover p { font-size:12px; margin:9px 0; }
      .ff-popover small { color:var(--muted); font-size:10px; }
      .ff-record-bar { display:flex; align-items:center; justify-content:space-between; gap:10px; color:var(--muted); font-size:.72em; border-bottom:1px solid var(--line); margin:0 0 .8em; padding:0 0 .65em; }
      .ff-record-bar .ff-chip { font-size:1em; } .ff-form { box-shadow:none; border-radius:4px; }
      .ff-grid .ff-section { grid-column:1 / -1; display:flex; align-items:center; gap:8px; margin-top:3px; padding:5px 0; border-bottom:1px solid var(--line); color:var(--muted); font-size:10px; font-weight:650; letter-spacing:.5px; text-transform:uppercase; }
      .ff-field-caption { color:var(--muted); font-size:10px; margin-top:4px; }
      .ff-scan-workarea { display:flex; flex:1; min-height:0; min-width:0; width:100%; height:100%; }
      .ff-scan .ff-workcenter { align-items:stretch; }
      .ff-scan .ff-scan-main { height:100%; width:100%; }
      .ff-scan .ff-scan-entry-head { padding:10px 13px 8px; }
      .ff-scan .ff-scan-entry-head h2 { font-size:15px; }
      .ff-scan .ff-scan-entry-head p { font-size:10px; margin:4px 0 0; }
      .ff-scan .ff-scan-fields { padding:8px 13px 24px; }
      .ff-scan .ff-scan-fields .ff-grid { gap:9px; }
      .ff-scan .ff-scan-fields .ff-input { height:30px; font-size:13px; border-radius:3px; }
      .ff-scan .ff-scan-fields .ff-label { font-size:11px; }
      .ff-scan .ff-scan-toolbar { height:37px; padding:0 8px; gap:3px; }
      .ff-scan .ff-scan-toolbar .ff-tool { min-height:25px; padding:3px 5px; border:1px solid var(--line); background:var(--panel); }
      .ff-scan .ff-scan-toolbar .ff-tool .ff-icon { width:14px; height:14px; }
      .ff-scan-filebar { display:flex; align-items:center; gap:6px; padding:6px 9px; border-bottom:1px solid var(--line); min-height:30px; background:var(--panel); font-size:10px; color:var(--muted); }
      .ff-scan-filebar .ff-icon { width:13px; height:13px; } .ff-scan-filebar .ff-chip { margin-left:auto; }
      .ff-page-strip { width:36px; flex:none; display:flex; flex-direction:column; align-items:center; gap:8px; padding:9px 3px; background:var(--panel); border-right:1px solid var(--line); }
      .ff-page-strip canvas { width:24px!important; height:34px!important; border:1px solid var(--accent); box-shadow:none; cursor:pointer; }
      .ff-page-strip small { font-size:9px; color:var(--muted); }
      .ff-page-strip .ff-tool { padding:3px; min-height:24px; }
      .ff-scan .ff-scan-entry-foot { height:27px; font-size:10px; }
      .ff-scan .ff-scan-source-foot { font-size:10px; padding:4px 8px; }
      `;

  const CSS = `
      .ff-root { position: relative; display: flex; align-items: center; justify-content: center; gap: 2.2em; }
      .ff-root.doc-right { flex-direction: row-reverse; }
      .ff-docpane { flex: none; display: flex; justify-content: center; align-items: center; }
      .ff-formpane { flex: 1 1 auto; min-width: 0; max-width: 46em; }

      /* ---------- page modes: tabs (document and form stacked in one grid cell), image, long */
      .ff-root.tabs { flex-direction: column; align-items: stretch; justify-content: flex-start; gap: 0; }
      .ff-tabs { display: flex; gap: .3em; padding: 0 .5em; border-bottom: 1px solid var(--line); }
      .ff-tab {
        font: inherit; font-size: .95em; padding: .55em 1.15em; margin-bottom: -1px; cursor: pointer;
        border: 1px solid transparent; border-bottom: 0; border-radius: .5em .5em 0 0; background: transparent; color: var(--muted);
      }
      .ff-tab[aria-selected="true"] { background: var(--panel); color: var(--fg); border-color: var(--line); font-weight: 600; }
      .ff-tabs.pills { border-bottom: 0; gap: .5em; padding: 0 0 .2em; }
      .ff-tabs.pills .ff-tab { margin: 0; border: 1px solid var(--line); border-radius: 2em; }
      .ff-tabs.pills .ff-tab[aria-selected="true"] { background: var(--accent); border-color: var(--accent); color: #fff; }
      .ff-panels { display: grid; padding-top: 1em; }
      .ff-panel { grid-area: 1 / 1; display: flex; justify-content: center; align-items: flex-start; min-width: 0; max-width: none; }
      .ff-panel.off { visibility: hidden; pointer-events: none; }
      .ff-forminner { max-width: 100%; }
      .ff-root.long { align-items: flex-start; padding: 1em 0 2em; }
      .ff-docimg { display: block; max-width: 100%; box-shadow: 0 2px 4px rgba(0,0,0,.18), 0 10px 24px rgba(0,0,0,.14); }

      /* ---------- form */
      .ff-form {
        background: var(--panel); border: 1px solid var(--line); border-radius: .7em;
        box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 8px 22px rgba(0,0,0,.05); padding: 1.05em 1.4em 1.25em;
      }
      .ff-form h2 { margin: 0 0 .15em; font-size: 1.22em; font-weight: 700; }
      .ff-form .ff-sub { margin: 0 0 .9em; font-size: .82em; color: var(--muted); }
      .ff-grid { display: grid; grid-template-columns: 1fr; gap: .72em 1.2em; }
      .ff-grid.two { grid-template-columns: 1fr 1fr; }
      .ff-grid.two .ff-wide { grid-column: 1 / -1; }
      .ff-field { position: relative; min-width: 0; }
      .ff-label { display: block; margin-bottom: .28em; font-size: .86em; font-weight: 600; color: var(--fg); }
      .ff-inwrap { position: relative; }
      .ff-input {
        display: block; width: 100%; height: 2.3em; padding: 0 2.1em 0 .7em; font: inherit; font-size: .95em;
        color: var(--fg); background: color-mix(in srgb, var(--panel) 92%, var(--bg)); border: 1px solid var(--line);
        border-radius: .4em; outline: none; user-select: text; -webkit-user-select: text;
      }
      .ff-input::placeholder { color: color-mix(in srgb, var(--muted) 75%, transparent); }
      .ff-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent); }
      .ff-clear {
        position: absolute; right: .35em; top: 50%; width: 1.5em; height: 1.5em; margin-top: -.75em; display: none;
        align-items: center; justify-content: center; border-radius: 50%; cursor: pointer; font-size: .9em; line-height: 1;
        color: var(--muted); background: color-mix(in srgb, var(--muted) 16%, transparent);
      }
      .ff-inwrap.filled .ff-clear { display: flex; }
      .ff-clear:hover { color: var(--fg); background: color-mix(in srgb, var(--muted) 30%, transparent); }
      .ff-dd { position: relative; }
      .ff-dd.open { z-index: 60; }
      .ff-ddbtn {
        display: flex; align-items: center; gap: .5em; height: 2.3em; padding: 0 .7em; font-size: .95em; cursor: pointer;
        background: color-mix(in srgb, var(--panel) 92%, var(--bg)); border: 1px solid var(--line); border-radius: .4em;
      }
      .ff-dd.open .ff-ddbtn { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent); }
      .ff-ddval { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .ff-ddval.empty { color: color-mix(in srgb, var(--muted) 75%, transparent); }
      .ff-chev { flex: none; width: 1em; height: 1em; margin-top: -.25em; border:0; transform:none; }
      .ff-dd.open .ff-chev { transform: rotate(180deg); margin-top: .25em; }
      .ff-list {
        position: absolute; left: 0; right: 0; top: calc(100% + 4px); display: none; padding: .3em;
        background: var(--panel); border: 1px solid var(--line); border-radius: .45em;
        box-shadow: 0 10px 28px rgba(0,0,0,.18);
      }
      .ff-dd.up .ff-list { top: auto; bottom: calc(100% + 4px); }
      .ff-dd.open .ff-list { display: block; }
      .ff-opt { padding: .38em .6em; border-radius: .3em; font-size: .93em; cursor: pointer; white-space: nowrap; }
      .ff-opt:hover { background: color-mix(in srgb, var(--accent) 14%, transparent); }
      .ff-opt.sel { font-weight: 700; color: var(--accent); }
      .ff-radios { display: flex; flex-wrap: wrap; gap: .3em 1.1em; padding-top: .1em; }
      .ff-choice { display: inline-flex; align-items: center; gap: .4em; font-size: .93em; cursor: pointer; }
      .ff-choice input { width: 1.1em; height: 1.1em; margin: 0; accent-color: var(--accent); cursor: pointer; }
      .ff-check { padding-top: .2em; font-weight: 600; }

      /* ---------- documents (paper colors are the document's own, not the site theme) */
      .ff-paper { color: #22252b; box-shadow: 0 1px 2px rgba(0,0,0,.12), 0 10px 26px rgba(0,0,0,.12); }
      .ff-doclabel { font-size: .74em; letter-spacing: .07em; text-transform: uppercase; color: #6b7079; }

      .ff-card { width: 100%; border-radius: .9em; overflow: hidden; background: var(--ff-paper); }
      .ff-band { padding: .7em 1.1em; color: #fff; background: var(--ff-ink); display: flex; justify-content: space-between; align-items: baseline; gap: 1em; }
      .ff-band b { font-size: 1.02em; letter-spacing: .1em; }
      .ff-band span { font-size: .78em; opacity: .85; }
      .ff-cardbody { display: flex; gap: 1.1em; padding: 1em 1.1em .8em; }
      .ff-photo { flex: none; width: 5.6em; height: 7em; border-radius: .4em; background: color-mix(in srgb, var(--ff-ink) 14%, #eef0f3); display: flex; align-items: flex-end; justify-content: center; overflow: hidden; }
      .ff-photo svg { width: 82%; }
      .ff-idgrid { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: .55em 1em; align-content: start; min-width: 0; }
      .ff-idgrid .ff-row.wide { grid-column: 1 / -1; }
      .ff-row .ff-v { font-weight: 600; white-space: pre-line; overflow-wrap: anywhere; }
      .ff-idfoot { display: flex; gap: 1.6em; padding: .5em 1.1em .75em; border-top: 1px dashed #c9ccd2; font-size: .85em; }
      .ff-contact { padding: 1.2em 1.3em 1em; }
      .ff-chead { display: flex; align-items: center; gap: .9em; margin-bottom: .9em; }
      .ff-avatar { flex: none; width: 3.2em; height: 3.2em; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.05em; color: #fff; background: var(--ff-ink); }
      .ff-cname { font-size: 1.3em; font-weight: 700; line-height: 1.2; }
      .ff-csub { color: #5d626b; font-size: .92em; }
      .ff-ctable { display: grid; grid-template-columns: max-content 1fr; gap: .45em 1.1em; align-items: baseline; }
      .ff-ctable .ff-doclabel { text-transform: none; letter-spacing: 0; font-size: .86em; }
      .ff-profile { padding: 0; }
      .ff-phead { padding: .8em 1.2em; border-bottom: 2px solid var(--ff-ink); display: flex; justify-content: space-between; align-items: baseline; }
      .ff-phead b { font-size: 1.1em; color: var(--ff-ink); }
      .ff-ptable { width: 100%; border-collapse: collapse; }
      .ff-ptable td { padding: .45em 1.2em; border-bottom: 1px solid #e4e6ea; vertical-align: top; }
      .ff-ptable td:first-child { width: 38%; color: #5d626b; }
      .ff-ptable td:last-child { font-weight: 600; white-space: pre-line; }
      .ff-ptable tr:nth-child(even) td { background: rgba(0,0,0,.025); }

      .ff-mail { width: 100%; border-radius: .7em; overflow: hidden; background: var(--panel); color: var(--fg); border: 1px solid var(--line); box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 10px 26px rgba(0,0,0,.08); }
      .ff-mailbar { display: flex; gap: .5em; padding: .55em .9em; border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--panel) 85%, var(--bg)); }
      .ff-mailbar span { font-size: .8em; padding: .2em .7em; border: 1px solid var(--line); border-radius: 1em; color: var(--muted); }
      .ff-mailsubj { padding: .75em 1.1em .2em; font-size: 1.15em; font-weight: 700; }
      .ff-mailfrom { display: flex; align-items: center; gap: .7em; padding: .5em 1.1em .7em; border-bottom: 1px solid var(--line); }
      .ff-mailfrom .ff-avatar { width: 2.4em; height: 2.4em; font-size: .9em; }
      .ff-mailfrom .who { flex: 1; min-width: 0; font-size: .92em; }
      .ff-mailfrom .who small { display: block; color: var(--muted); font-size: .9em; }
      .ff-mailfrom .when { font-size: .8em; color: var(--muted); white-space: nowrap; }
      .ff-mailbody { padding: .8em 1.1em 1em; font-size: .95em; line-height: 1.45; }
      .ff-mailbody p { margin: 0 0 .65em; }
      .ff-mailbody .sig { white-space: pre-line; margin: 0; color: color-mix(in srgb, var(--fg) 80%, var(--muted)); }
      .ff-plainmail { width: 100%; padding: 1em 1.2em; background: var(--ff-paper); font-family: "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace; font-size: .86em; line-height: 1.45; border-radius: .3em; }
      .ff-plainmail .hdr { margin: 0; white-space: pre-wrap; color: #4a4f57; }
      .ff-plainmail hr { border: 0; border-top: 1px solid #c9ccd2; margin: .6em 0 .7em; }
      .ff-plainmail p { margin: 0 0 .7em; white-space: pre-wrap; }

      .ff-invoice { position: relative; width: 100%; padding: 1.2em 1.4em 1.1em; background: var(--ff-paper); font-size: .92em; border-radius: .2em; }
      .ff-invhead { display: flex; justify-content: space-between; gap: 1em; margin-bottom: .9em; }
      .ff-vname { font-size: 1.25em; font-weight: 700; color: var(--ff-ink); }
      .ff-vaddr { font-size: .85em; color: #5d626b; white-space: pre-line; }
      .ff-invtitle { font-size: 1.35em; font-weight: 300; letter-spacing: .08em; text-align: right; color: var(--ff-ink); }
      .ff-meta { border-collapse: collapse; margin-left: auto; font-size: .9em; }
      .ff-meta td { padding: .08em 0 .08em .9em; text-align: right; }
      .ff-meta td:first-child { color: #6b7079; }
      .ff-billto { margin-bottom: .8em; font-size: .9em; white-space: pre-line; }
      .ff-items { width: 100%; border-collapse: collapse; font-size: .9em; }
      .ff-items th { text-align: left; padding: .35em .4em; border-bottom: 2px solid var(--ff-ink); font-size: .85em; color: #4a4f57; }
      .ff-items td { padding: .32em .4em; border-bottom: 1px solid #e4e6ea; }
      .ff-items .num { text-align: right; white-space: nowrap; }
      .ff-totals { margin: .55em 0 0 auto; border-collapse: collapse; font-size: .92em; }
      .ff-totals td { padding: .15em .4em; text-align: right; }
      .ff-totals td:first-child { color: #5d626b; padding-right: 1.2em; }
      .ff-totals tr.strong td { font-weight: 700; font-size: 1.08em; color: #1d2026; border-top: 2px solid var(--ff-ink); padding-top: .3em; }
      .ff-notes { margin-top: .8em; font-size: .85em; color: #4a4f57; }
      .ff-stamp { position: absolute; right: 2.2em; top: 42%; padding: .15em .5em; border: 3px solid #c92a2a; color: #c92a2a; border-radius: .25em; font-weight: 800; font-size: 1.6em; letter-spacing: .15em; transform: rotate(-14deg); opacity: .78; }

      .ff-receipt {
        width: 22em; max-width: 100%; padding: 1.1em 1.2em 1.6em; background: var(--ff-paper);
        font-family: "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace; font-size: .86em; line-height: 1.35;
        -webkit-mask: linear-gradient(135deg, transparent 6px, #000 0) bottom left / 12px 12px repeat-x, linear-gradient(225deg, transparent 6px, #000 0) bottom left / 12px 12px repeat-x, linear-gradient(#000, #000) top / 100% calc(100% - 10px) no-repeat;
      }
      .ff-receipt .c { text-align: center; }
      .ff-receipt .vn { font-weight: 700; font-size: 1.12em; text-transform: uppercase; }
      .ff-receipt .sep { border-top: 1px dashed #8a8f98; margin: .5em 0; }
      .ff-receipt .ln { display: flex; justify-content: space-between; gap: 1em; }
      .ff-receipt .ln span:first-child { min-width: 0; overflow-wrap: anywhere; }
      .ff-receipt .ln span:last-child { white-space: nowrap; }
      .ff-receipt .sub { padding-left: 1.2em; color: #4a4f57; }
      .ff-receipt .big { font-weight: 700; font-size: 1.1em; }
      `;

  const PAPERS = ['#ffffff', '#fffdf6', '#fbfbf8', '#f8f9fb', '#fffaf0'];

  const INVOICE_FONTS = ['"Liberation Sans", Arial, Helvetica, sans-serif', 'Georgia, "Liberation Serif", "Times New Roman", serif',
        '"DejaVu Sans", Verdana, sans-serif', 'system-ui, sans-serif'];

  const PERSON_SVG = '<svg viewBox="0 0 60 64"><circle cx="30" cy="22" r="13" fill="rgba(0,0,0,.28)"/>' +
        '<path d="M4 64 C6 44 18 38 30 38 C42 38 54 44 56 64 Z" fill="rgba(0,0,0,.28)"/></svg>';

  const DOC_FONTS = {
        sans: '"DejaVu Sans", "Liberation Sans", Arial, sans-serif',
        serif: '"DejaVu Serif", "Liberation Serif", Georgia, serif',
        mono: '"DejaVu Sans Mono", "Liberation Mono", "Courier New", monospace',
      };

  const SCAN_CSS = `
      .ff-scan { flex:none; display:flex; flex-direction:column; overflow:hidden; border:1px solid var(--line);
        border-radius:9px; background:var(--panel); color:var(--fg); box-shadow:0 6px 24px #0001; font-size:14px; }
      .ff-scan-head { display:flex; align-items:center; gap:12px; height:48px; flex:none; padding:0 16px; border-bottom:1px solid var(--line); }
      .ff-scan-head strong { font-size:15px; } .ff-scan-head small { color:var(--muted); margin-left:auto; }
      .ff-scan-badge { font-size:11px; padding:3px 8px; border-radius:4px; color:var(--accent);
        background:color-mix(in srgb,var(--accent) 10%,var(--panel)); white-space:nowrap; }
      .ff-scan-main { display:grid; grid-template-columns:minmax(0,1.15fr) minmax(0,1fr); flex:1; min-height:0; }
      .ff-scan-view { display:flex; flex-direction:column; min-width:0; min-height:0; border-right:1px solid var(--line); }
      .ff-scan-toolbar { height:42px; display:flex; align-items:center; gap:5px; padding:0 10px; flex:none; background:var(--bg); border-bottom:1px solid var(--line); }
      .ff-scan-filename { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:12px; color:var(--muted); }
      .ff-scan button { cursor:pointer; font:inherit; color:var(--fg); background:var(--panel); border:1px solid var(--line); border-radius:4px; min-height:26px; padding:2px 8px; }
      .ff-scan button:hover { border-color:var(--accent); } .ff-scan-zoom { font-size:11px; width:36px; text-align:center; font-variant-numeric:tabular-nums; }
      .ff-scan-well { flex:1; min-height:0; position:relative; display:flex; background:color-mix(in srgb,var(--muted) 22%,var(--bg)); }
      .ff-scan-scroll { position:relative; flex:1; min-width:0; overflow:auto; overscroll-behavior:contain; scrollbar-width:thin; }
      .ff-scan-sheet { width:max-content; padding:14px; }
      .ff-scan canvas { display:block; max-width:none; cursor:grab; box-shadow:0 3px 12px #0004; }
      .ff-scan-rail { position:relative; width:12px; flex:none; background:color-mix(in srgb,var(--muted) 13%,var(--bg)); }
      .ff-scan-thumb { position:absolute; left:2px; width:8px; min-height:24px; border-radius:4px; background:var(--muted); cursor:ns-resize; }
      .ff-scan-source-foot { padding:5px 10px; font-size:11px; color:var(--muted); background:var(--bg); border-top:1px solid var(--line); }
      .ff-scan-entry { display:flex; flex-direction:column; min-width:0; min-height:0; }
      .ff-scan-entry-head { flex:none; padding:12px 14px 10px; border-bottom:1px solid var(--line); }
      .ff-scan-entry-head h2 { margin:0 0 4px; font-size:17px; } .ff-scan-entry-head p { margin:0; font-size:11px; color:var(--muted); }
      .ff-scan-fields { flex:1; min-height:0; overflow:auto; padding:12px 14px 28px; overscroll-behavior:contain; scrollbar-width:thin; }
      .ff-scan-fields .ff-grid { gap:11px; } .ff-scan-fields .ff-input { height:32px; font-size:14px; }
      .ff-scan-fields .ff-label { font-size:12px; } .ff-scan-fields .ff-radios { flex-wrap:wrap; }
      .ff-scan-fields .ff-choice { font-size:12px; } .ff-scan-fields .ff-list { max-height:160px; overflow:auto; }
      .ff-scan-fields .ff-opt { font-size:12px; }
      .ff-scan-entry-foot { height:32px; display:flex; align-items:center; justify-content:space-between; padding:0 14px; flex:none;
        color:var(--muted); font-size:11px; border-top:1px solid var(--line); background:var(--bg); }
      .ff-scan-foot { display:flex; justify-content:space-between; gap:8px; padding:7px 14px; font-size:11px; color:var(--muted); border-top:1px solid var(--line); }
      `;

  const CSS2 = `
      .ff-err { min-height: 1.2em; margin-top: .15em; font-size: .76em; color: #c62828; }
      .ff-input.bad { border-color: #c62828; }
      .ff-btn {
        font: inherit; font-size: .93em; font-weight: 600; padding: .55em 1.25em; cursor: pointer; border-radius: .45em;
        color: var(--fg); background: var(--panel); border: 1px solid var(--line);
      }
      .ff-btn.primary { color: #fff; background: var(--accent); border-color: var(--accent); }
      .ff-btn.hide { visibility: hidden; pointer-events: none; }

      /* ---------- wizard */
      .ff-wiz .ff-steps { display: flex; flex-wrap: wrap; align-items: center; margin: .1em 0 1em; padding: 0; list-style: none; }
      .ff-wiz .ff-stp { display: flex; align-items: center; gap: .45em; font-size: .8em; color: var(--muted); white-space: nowrap; }
      .ff-wiz .ff-stp + .ff-stp::before { content: ''; width: 1.6em; height: 2px; margin: 0 .5em; background: var(--line); }
      .ff-wiz .ff-stp i {
        display: inline-flex; align-items: center; justify-content: center; width: 1.7em; height: 1.7em; border-radius: 50%;
        font-style: normal; font-weight: 700; border: 1px solid var(--line);
      }
      .ff-wiz .ff-stp.on { color: var(--fg); }
      .ff-wiz .ff-stp.on i { color: #fff; background: var(--accent); border-color: var(--accent); }
      .ff-wiz .ff-stp.done i { background: color-mix(in srgb, var(--accent) 22%, transparent); border-color: transparent; }
      .ff-wiz .ff-prog { margin: .1em 0 .9em; }
      .ff-wiz .ff-prog small { display: block; margin-bottom: .35em; font-size: .78em; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-height: 1.3em; }
      .ff-wiz .ff-prog div { height: .45em; border-radius: .3em; background: color-mix(in srgb, var(--line) 80%, transparent); overflow: hidden; }
      .ff-wiz .ff-prog b { display: block; height: 100%; background: var(--accent); }
      .ff-wizpanels { display: grid; }
      .ff-wizpanel { grid-area: 1 / 1; visibility: hidden; pointer-events: none; }
      .ff-wizpanel.on { visibility: visible; pointer-events: auto; }
      .ff-wizpanel h3 { margin: 0 0 .6em; font-size: 1.02em; }
      .ff-wizfoot { display: flex; justify-content: space-between; gap: 1em; margin-top: .7em; }
      .ff-review { width: 100%; table-layout: fixed; border-collapse: collapse; font-size: .9em; }
      .ff-review td { padding: .28em .4em; border-bottom: 1px solid var(--line); vertical-align: top; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .ff-review td:first-child { width: 42%; color: var(--muted); }
      .ff-review tr.grp td { padding-top: .7em; font-weight: 700; color: var(--fg); border-bottom: 2px solid var(--line); }
      .ff-review a { float: right; font-weight: 500; color: var(--accent); cursor: pointer; text-decoration: underline; }
      .ff-review .none { color: var(--muted); font-style: italic; }

      /* ---------- PDF viewer */
      .ff-pdf { flex: none; display: flex; flex-direction: column; overflow: hidden; border-radius: .5em; background: #525659; box-shadow: 0 4px 18px rgba(0,0,0,.25); }
      .ff-pdfbar {
        flex: none; display: flex; align-items: center; gap: .8em; padding: .45em .8em; font-size: .8em; color: #f1f3f4; background: #323639;
      }
      .ff-pdfbar .name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .ff-pdfbar .pg { padding: .1em .55em; border-radius: .3em; background: #202124; }
      .ff-pdfbar .zm { display: flex; align-items: center; gap: .5em; }
      .ff-pdfbar .zm b { display: inline-block; width: 1.5em; text-align: center; border-radius: .25em; background: #202124; }
      .ff-pdfbody { flex: 1; min-height: 0; display: flex; }
      .ff-pdfpane { flex: 1; min-width: 0; overflow: hidden; position: relative; }
      .ff-pdfdoc { padding: 1.1em 0; display: flex; flex-direction: column; align-items: center; gap: .9em; }
      .ff-pdfpage { position: relative; flex: none; box-sizing: border-box; background: #fff; color: #22252b; box-shadow: 0 2px 8px rgba(0,0,0,.45); overflow: hidden; }
      .ff-pdfpage .ff-paper { box-shadow: none; }
      .ff-pdfpage .ff-docimg { box-shadow: none; }
      .ff-pdfpage.pad { padding: 1.4em 1.5em; }
      .ff-pdfpage h4 { margin: 0 0 .5em; font-size: 1.5em; font-weight: 300; letter-spacing: .06em; color: var(--ff-ink); }
      .ff-pdfpage p { margin: 0 0 .7em; font-size: .9em; line-height: 1.45; color: #3b3f46; }
      .ff-pdfpage .meta { font-size: .8em; color: #6b7079; line-height: 1.7; }
      .ff-pdfpage .code { height: 3.2em; margin-top: 1.4em; width: 62%; background: repeating-linear-gradient(90deg, #22252b 0 2px, #fff 2px 5px, #22252b 5px 6px, #fff 6px 10px); }
      .ff-pdfpage .rule { height: 3px; margin: .8em 0 1.1em; background: var(--ff-ink); }
      .ff-pdfscroll { flex: none; position: relative; width: .95em; margin: .5em .35em .5em .1em; border-radius: .5em; background: rgba(255,255,255,.12); }
      .ff-pdfthumb { position: absolute; left: .1em; right: .1em; border-radius: .4em; background: #9aa0a6; cursor: grab; }
      .ff-pdfthumb:hover, .ff-pdfthumb.on { background: #dadce0; }

      /* ---------- ERP */
      .ff-erp { display: flex; flex-direction: column; align-items: stretch; justify-content: flex-start; gap: 0; border: 1px solid var(--line); background: var(--panel); border-radius: .25em; overflow: hidden; }
      .ff-erp-title { display: flex; align-items: center; gap: 1.2em; padding: .35em .8em; color: #fff; background: var(--ff-ink); font-size: .85em; }
      .ff-erp-title b { letter-spacing: .06em; }
      .ff-erp-title span { opacity: .8; }
      .ff-erp-title .r { margin-left: auto; }
      .ff-erp-rib { display: flex; flex-wrap: wrap; gap: .3em; padding: .3em .6em; border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--panel) 88%, var(--bg)); }
      .ff-erp-rib span { padding: .22em .75em; font-size: .85em; border: 1px solid var(--line); border-radius: .2em; background: var(--panel); color: var(--muted); }
      .ff-erp-main { display: flex; align-items: flex-start; gap: .8em; padding: .8em; }
      .ff-erp-main.doc-right { flex-direction: row-reverse; }
      .ff-erp-doc { flex: none; min-width: 0; }
      .ff-erp-doc > .hd, .ff-erp-fp > .hd { margin-bottom: .35em; font-size: .78em; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
      .ff-erp-fp { flex: 1; min-width: 0; }
      .ff-erp-tabs { display: flex; flex-wrap: wrap; gap: 0; border-bottom: 1px solid var(--line); }
      .ff-erp-tabs .ff-tab { margin-bottom: -1px; border-radius: .2em .2em 0 0; padding: .4em .9em; font-size: .88em; border-color: transparent; }
      .ff-erp-tabs .ff-tab[aria-selected="true"] { border-color: var(--line); background: var(--panel); color: var(--fg); font-weight: 700; box-shadow: inset 0 2px 0 var(--accent); }
      .ff-erp-panes { display: grid; padding-top: .7em; }
      .ff-erp-pane { grid-area: 1 / 1; min-width: 0; }
      .ff-erp-pane.off { visibility: hidden; pointer-events: none; }
      .ff-erp .ff-form { padding: .6em .8em .8em; border-radius: .2em; box-shadow: none; background: transparent; border: 0; }
      .ff-erp .ff-form h2 { font-size: .98em; margin: 0 0 .5em; padding-bottom: .3em; border-bottom: 1px solid var(--line); text-transform: uppercase; letter-spacing: .04em; color: var(--muted); }
      .ff-erp .ff-grid.three { grid-template-columns: repeat(3, 1fr); gap: .5em 1em; }
      .ff-erp .ff-grid.three .ff-wide { grid-column: auto; }
      .ff-erp .ff-label { margin-bottom: .15em; font-size: .78em; font-weight: 600; color: var(--muted); }
      .ff-erp .ff-input, .ff-erp .ff-ddbtn { height: 1.95em; border-radius: .15em; font-size: .9em; }
      .ff-erp .ff-choice { font-size: .85em; }
      .ff-erp .ff-docimg { max-width: 100%; }
      .ff-erp-dec table { width: 100%; border-collapse: collapse; font-size: .88em; }
      .ff-erp-dec th { text-align: left; padding: .3em .5em; font-size: .8em; color: var(--muted); border-bottom: 2px solid var(--line); }
      .ff-erp-dec td { padding: .3em .5em; border-bottom: 1px solid var(--line); }
      .ff-erp-dec .empty { margin-top: .8em; font-size: .85em; color: var(--muted); }
      .ff-erp-status { display: flex; gap: 1.6em; padding: .25em .8em; font-size: .78em; color: var(--muted); border-top: 1px solid var(--line); background: color-mix(in srgb, var(--panel) 88%, var(--bg)); }
      `;

  const NEXT_LABELS = ['Next', 'Continue', 'Next step'];

  const PDF_TITLES = ['Scanned document', 'Document scan', 'Incoming document', 'Archive copy'];

  const ERP_APPS = ['Atlas ERP', 'Corelink', 'OpenBooks', 'Meridian Suite', 'NovaSys'];

  const ERP_RIB = ['Save', 'New', 'Delete', 'Refresh', 'Print', 'Export', 'Help'];

  const ERP_CHANGES = ['Record created', 'Status updated', 'Approved', 'Exported to ledger', 'Locked for editing', 'Comment added', 'Attachment added'];

  const ERP_USERS = ['sysadmin', 'jmiller', 'k.novak', 'batch01', 'mwong', 'tsilva'];

  const DOCUMENT_CSS = `
  .ff-root { position: relative; display: flex; align-items: center; justify-content: center; gap: 2.2em; }
  .ff-root.doc-right { flex-direction: row-reverse; }
  .ff-docpane { flex: none; display: flex; justify-content: center; align-items: center; }
  .ff-formpane { flex: 1 1 auto; min-width: 0; max-width: 46em; }

  /* ---------- page modes: tabs (document and form stacked in one grid cell), image, long */
  .ff-root.tabs { flex-direction: column; align-items: stretch; justify-content: flex-start; gap: 0; }
  .ff-tabs { display: flex; gap: .3em; padding: 0 .5em; border-bottom: 1px solid var(--line); }
  .ff-tab {
    font: inherit; font-size: .95em; padding: .55em 1.15em; margin-bottom: -1px; cursor: pointer;
    border: 1px solid transparent; border-bottom: 0; border-radius: .5em .5em 0 0; background: transparent; color: var(--muted);
  }
  .ff-tab[aria-selected="true"] { background: var(--panel); color: var(--fg); border-color: var(--line); font-weight: 600; }
  .ff-tabs.pills { border-bottom: 0; gap: .5em; padding: 0 0 .2em; }
  .ff-tabs.pills .ff-tab { margin: 0; border: 1px solid var(--line); border-radius: 2em; }
  .ff-tabs.pills .ff-tab[aria-selected="true"] { background: var(--accent); border-color: var(--accent); color: #fff; }
  .ff-panels { display: grid; padding-top: 1em; }
  .ff-panel { grid-area: 1 / 1; display: flex; justify-content: center; align-items: flex-start; min-width: 0; max-width: none; }
  .ff-panel.off { visibility: hidden; pointer-events: none; }
  .ff-forminner { max-width: 100%; }
  .ff-root.long { align-items: flex-start; padding: 1em 0 2em; }
  .ff-docimg { display: block; max-width: 100%; box-shadow: 0 2px 4px rgba(0,0,0,.18), 0 10px 24px rgba(0,0,0,.14); }

  /* ---------- form */
  .ff-form {
    background: var(--panel); border: 1px solid var(--line); border-radius: .7em;
    box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 8px 22px rgba(0,0,0,.05); padding: 1.05em 1.4em 1.25em;
  }
  .ff-form h2 { margin: 0 0 .15em; font-size: 1.22em; font-weight: 700; }
  .ff-form .ff-sub { margin: 0 0 .9em; font-size: .82em; color: var(--muted); }
  .ff-grid { display: grid; grid-template-columns: 1fr; gap: .72em 1.2em; }
  .ff-grid.two { grid-template-columns: 1fr 1fr; }
  .ff-grid.two .ff-wide { grid-column: 1 / -1; }
  .ff-field { position: relative; min-width: 0; }
  .ff-label { display: block; margin-bottom: .28em; font-size: .86em; font-weight: 600; color: var(--fg); }
  .ff-inwrap { position: relative; }
  .ff-input {
    display: block; width: 100%; height: 2.3em; padding: 0 2.1em 0 .7em; font: inherit; font-size: .95em;
    color: var(--fg); background: color-mix(in srgb, var(--panel) 92%, var(--bg)); border: 1px solid var(--line);
    border-radius: .4em; outline: none; user-select: text; -webkit-user-select: text;
  }
  .ff-input::placeholder { color: color-mix(in srgb, var(--muted) 75%, transparent); }
  .ff-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent); }
  .ff-clear {
    position: absolute; right: .35em; top: 50%; width: 1.5em; height: 1.5em; margin-top: -.75em; display: none;
    align-items: center; justify-content: center; border-radius: 50%; cursor: pointer; font-size: .9em; line-height: 1;
    color: var(--muted); background: color-mix(in srgb, var(--muted) 16%, transparent);
  }
  .ff-inwrap.filled .ff-clear { display: flex; }
  .ff-clear:hover { color: var(--fg); background: color-mix(in srgb, var(--muted) 30%, transparent); }
  .ff-dd { position: relative; }
  .ff-dd.open { z-index: 60; }
  .ff-ddbtn {
    display: flex; align-items: center; gap: .5em; height: 2.3em; padding: 0 .7em; font-size: .95em; cursor: pointer;
    background: color-mix(in srgb, var(--panel) 92%, var(--bg)); border: 1px solid var(--line); border-radius: .4em;
  }
  .ff-dd.open .ff-ddbtn { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent); }
  .ff-ddval { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ff-ddval.empty { color: color-mix(in srgb, var(--muted) 75%, transparent); }
  .ff-chev { flex: none; width: .55em; height: .55em; margin-top: -.25em; border-right: 2px solid var(--muted); border-bottom: 2px solid var(--muted); transform: rotate(45deg); }
  .ff-dd.open .ff-chev { transform: rotate(225deg); margin-top: .25em; }
  .ff-list {
    position: absolute; left: 0; right: 0; top: calc(100% + 4px); display: none; padding: .3em;
    background: var(--panel); border: 1px solid var(--line); border-radius: .45em;
    box-shadow: 0 10px 28px rgba(0,0,0,.18);
  }
  .ff-dd.up .ff-list { top: auto; bottom: calc(100% + 4px); }
  .ff-dd.open .ff-list { display: block; }
  .ff-opt { padding: .38em .6em; border-radius: .3em; font-size: .93em; cursor: pointer; white-space: nowrap; }
  .ff-opt:hover { background: color-mix(in srgb, var(--accent) 14%, transparent); }
  .ff-opt.sel { font-weight: 700; color: var(--accent); }
  .ff-radios { display: flex; flex-wrap: wrap; gap: .3em 1.1em; padding-top: .1em; }
  .ff-choice { display: inline-flex; align-items: center; gap: .4em; font-size: .93em; cursor: pointer; }
  .ff-choice input { width: 1.1em; height: 1.1em; margin: 0; accent-color: var(--accent); cursor: pointer; }
  .ff-check { padding-top: .2em; font-weight: 600; }

  /* ---------- documents (paper colors are the document's own, not the site theme) */
  .ff-paper { color: #22252b; box-shadow: 0 1px 2px rgba(0,0,0,.12), 0 10px 26px rgba(0,0,0,.12); }
  .ff-doclabel { font-size: .74em; letter-spacing: .07em; text-transform: uppercase; color: #6b7079; }

  .ff-card { width: 100%; border-radius: .9em; overflow: hidden; background: var(--ff-paper); }
  .ff-band { padding: .7em 1.1em; color: #fff; background: var(--ff-ink); display: flex; justify-content: space-between; align-items: baseline; gap: 1em; }
  .ff-band b { font-size: 1.02em; letter-spacing: .1em; }
  .ff-band span { font-size: .78em; opacity: .85; }
  .ff-cardbody { display: flex; gap: 1.1em; padding: 1em 1.1em .8em; }
  .ff-photo { flex: none; width: 5.6em; height: 7em; border-radius: .4em; background: color-mix(in srgb, var(--ff-ink) 14%, #eef0f3); display: flex; align-items: flex-end; justify-content: center; overflow: hidden; }
  .ff-photo svg { width: 82%; }
  .ff-idgrid { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: .55em 1em; align-content: start; min-width: 0; }
  .ff-idgrid .ff-row.wide { grid-column: 1 / -1; }
  .ff-row .ff-v { font-weight: 600; white-space: pre-line; overflow-wrap: anywhere; }
  .ff-idfoot { display: flex; gap: 1.6em; padding: .5em 1.1em .75em; border-top: 1px dashed #c9ccd2; font-size: .85em; }
  .ff-contact { padding: 1.2em 1.3em 1em; }
  .ff-chead { display: flex; align-items: center; gap: .9em; margin-bottom: .9em; }
  .ff-avatar { flex: none; width: 3.2em; height: 3.2em; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.05em; color: #fff; background: var(--ff-ink); }
  .ff-cname { font-size: 1.3em; font-weight: 700; line-height: 1.2; }
  .ff-csub { color: #5d626b; font-size: .92em; }
  .ff-ctable { display: grid; grid-template-columns: max-content 1fr; gap: .45em 1.1em; align-items: baseline; }
  .ff-ctable .ff-doclabel { text-transform: none; letter-spacing: 0; font-size: .86em; }
  .ff-profile { padding: 0; }
  .ff-phead { padding: .8em 1.2em; border-bottom: 2px solid var(--ff-ink); display: flex; justify-content: space-between; align-items: baseline; }
  .ff-phead b { font-size: 1.1em; color: var(--ff-ink); }
  .ff-ptable { width: 100%; border-collapse: collapse; }
  .ff-ptable td { padding: .45em 1.2em; border-bottom: 1px solid #e4e6ea; vertical-align: top; }
  .ff-ptable td:first-child { width: 38%; color: #5d626b; }
  .ff-ptable td:last-child { font-weight: 600; white-space: pre-line; }
  .ff-ptable tr:nth-child(even) td { background: rgba(0,0,0,.025); }

  .ff-mail { width: 100%; border-radius: .7em; overflow: hidden; background: var(--panel); color: var(--fg); border: 1px solid var(--line); box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 10px 26px rgba(0,0,0,.08); }
  .ff-mailbar { display: flex; gap: .5em; padding: .55em .9em; border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--panel) 85%, var(--bg)); }
  .ff-mailbar span { font-size: .8em; padding: .2em .7em; border: 1px solid var(--line); border-radius: 1em; color: var(--muted); }
  .ff-mailsubj { padding: .75em 1.1em .2em; font-size: 1.15em; font-weight: 700; }
  .ff-mailfrom { display: flex; align-items: center; gap: .7em; padding: .5em 1.1em .7em; border-bottom: 1px solid var(--line); }
  .ff-mailfrom .ff-avatar { width: 2.4em; height: 2.4em; font-size: .9em; }
  .ff-mailfrom .who { flex: 1; min-width: 0; font-size: .92em; }
  .ff-mailfrom .who small { display: block; color: var(--muted); font-size: .9em; }
  .ff-mailfrom .when { font-size: .8em; color: var(--muted); white-space: nowrap; }
  .ff-mailbody { padding: .8em 1.1em 1em; font-size: .95em; line-height: 1.45; }
  .ff-mailbody p { margin: 0 0 .65em; }
  .ff-mailbody .sig { white-space: pre-line; margin: 0; color: color-mix(in srgb, var(--fg) 80%, var(--muted)); }
  .ff-plainmail { width: 100%; padding: 1em 1.2em; background: var(--ff-paper); font-family: "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace; font-size: .86em; line-height: 1.45; border-radius: .3em; }
  .ff-plainmail .hdr { margin: 0; white-space: pre-wrap; color: #4a4f57; }
  .ff-plainmail hr { border: 0; border-top: 1px solid #c9ccd2; margin: .6em 0 .7em; }
  .ff-plainmail p { margin: 0 0 .7em; white-space: pre-wrap; }

  .ff-invoice { position: relative; width: 100%; padding: 1.2em 1.4em 1.1em; background: var(--ff-paper); font-size: .92em; border-radius: .2em; }
  .ff-invhead { display: flex; justify-content: space-between; gap: 1em; margin-bottom: .9em; }
  .ff-vname { font-size: 1.25em; font-weight: 700; color: var(--ff-ink); }
  .ff-vaddr { font-size: .85em; color: #5d626b; white-space: pre-line; }
  .ff-invtitle { font-size: 1.35em; font-weight: 300; letter-spacing: .08em; text-align: right; color: var(--ff-ink); }
  .ff-meta { border-collapse: collapse; margin-left: auto; font-size: .9em; }
  .ff-meta td { padding: .08em 0 .08em .9em; text-align: right; }
  .ff-meta td:first-child { color: #6b7079; }
  .ff-billto { margin-bottom: .8em; font-size: .9em; white-space: pre-line; }
  .ff-items { width: 100%; border-collapse: collapse; font-size: .9em; }
  .ff-items th { text-align: left; padding: .35em .4em; border-bottom: 2px solid var(--ff-ink); font-size: .85em; color: #4a4f57; }
  .ff-items td { padding: .32em .4em; border-bottom: 1px solid #e4e6ea; }
  .ff-items .num { text-align: right; white-space: nowrap; }
  .ff-totals { margin: .55em 0 0 auto; border-collapse: collapse; font-size: .92em; }
  .ff-totals td { padding: .15em .4em; text-align: right; }
  .ff-totals td:first-child { color: #5d626b; padding-right: 1.2em; }
  .ff-totals tr.strong td { font-weight: 700; font-size: 1.08em; color: #1d2026; border-top: 2px solid var(--ff-ink); padding-top: .3em; }
  .ff-notes { margin-top: .8em; font-size: .85em; color: #4a4f57; }
  .ff-stamp { position: absolute; right: 2.2em; top: 42%; padding: .15em .5em; border: 3px solid #c92a2a; color: #c92a2a; border-radius: .25em; font-weight: 800; font-size: 1.6em; letter-spacing: .15em; transform: rotate(-14deg); opacity: .78; }

  .ff-receipt {
    width: 22em; max-width: 100%; padding: 1.1em 1.2em 1.6em; background: var(--ff-paper);
    font-family: "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace; font-size: .86em; line-height: 1.35;
    -webkit-mask: linear-gradient(135deg, transparent 6px, #000 0) bottom left / 12px 12px repeat-x, linear-gradient(225deg, transparent 6px, #000 0) bottom left / 12px 12px repeat-x, linear-gradient(#000, #000) top / 100% calc(100% - 10px) no-repeat;
  }
  .ff-receipt .c { text-align: center; }
  .ff-receipt .vn { font-weight: 700; font-size: 1.12em; text-transform: uppercase; }
  .ff-receipt .sep { border-top: 1px dashed #8a8f98; margin: .5em 0; }
  .ff-receipt .ln { display: flex; justify-content: space-between; gap: 1em; }
  .ff-receipt .ln span:first-child { min-width: 0; overflow-wrap: anywhere; }
  .ff-receipt .ln span:last-child { white-space: nowrap; }
  .ff-receipt .sub { padding-left: 1.2em; color: #4a4f57; }
  .ff-receipt .big { font-weight: 700; font-size: 1.1em; }
  `;

  env.template('fill-form/_assets', () => ({ ICONS, WORKSPACE_CSS, CSS, PAPERS, INVOICE_FONTS, PERSON_SVG, DOC_FONTS, SCAN_CSS, CSS2, NEXT_LABELS, PDF_TITLES, ERP_APPS, ERP_RIB, ERP_CHANGES, ERP_USERS, DOCUMENT_CSS }));
})();
