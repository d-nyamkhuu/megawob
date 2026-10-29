/* base / use-admin-console / classic: a fictional enterprise administration console. Organization/project
 * header, grouped service rail, command bars, compact paged tables, policy notices, related inventory and
 * activity history surround the five workflows. All icons are inline SVG; colours use reference tokens.
 * Main panes scroll with the wheel. Ten-row pages and clipped target offsets are mirrored into
 * unscored model fields; locate() only reads geometry. Resource mutations remain task-owned.
 */
(function () {
  'use strict';
  let view;
  const PATHS = {
    logo: 'M3 7 12 2l9 5v10l-9 5-9-5V7Zm0 0 9 5 9-5M12 12v10',
    grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    compute: 'M4 3h16v7H4zM4 14h16v7H4zM7 6h1M7 17h1M11 6h6M11 17h6',
    users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M15 3a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-3.87M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
    shield: 'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6l-9-4Zm-4 10 3 3 5-6',
    ticket: 'M3 4h18v5a3 3 0 0 0 0 6v5H3v-5a3 3 0 0 0 0-6V4Zm12 0v4m0 3v2m0 3v4',
    quota: 'M4 20V9h4v11M10 20V4h4v16M16 20v-8h4v8M2 20h20',
    folder: 'M3 6V4h6l2 3h10v13H3V6Z',
    chevron: 'm9 5 7 7-7 7', down: 'm5 9 7 7 7-7', back: 'm15 5-7 7 7 7',
    check: 'm5 12 4 4L19 6', close: 'm6 6 12 12M6 18 18 6',
    search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
    bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
    settings: 'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM9 2h6l1 4 4 1 2 5-3 3v5l-5 2-3-3-5 1-3-5 2-4-1-5 5-1Z',
    help: 'M9 8a3 3 0 0 1 6 0c0 2-3 2-3 5M12 17h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
    clock: 'M12 6v6l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
    refresh: 'M20 7a9 9 0 1 0 1 8M20 2v6h-6',
    filter: 'M3 4h18l-7 8v7l-4 2v-9L3 4Z',
    export: 'M12 3v12m-5-5 5 5 5-5M4 15v6h16v-6',
    more: 'M5 12h.01M12 12h.01M19 12h.01',
    plus: 'M12 5v14M5 12h14', lock: 'M6 10h12v11H6zM8 10V6a4 4 0 0 1 8 0v4',
    info: 'M12 10v7M12 6h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
    warning: 'm12 3 10 18H2L12 3Zm0 6v5m0 3h.01',
    network: 'M9 2h6v6H9zM2 16h6v6H2zM16 16h6v6h-6zM12 8v4M5 16v-4h14v4',
    disk: 'M4 3h16v18H4zM7 7h10M7 17h.01M11 17h6',
    document: 'M5 2h9l5 5v15H5V2Zm9 0v6h5M8 12h8M8 16h8',
  };
  const CSS = `
  .aa-shell{position:relative;display:flex;flex:none;flex-direction:column;overflow:hidden;border:1px solid var(--line);border-radius:5px;background:var(--panel);color:var(--fg);font:12px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 4px 20px #0001}
  .aa-shell *{box-sizing:border-box}.aa-shell button,.aa-shell input{font:inherit;color:inherit}.aa-shell button{cursor:pointer}.aa-shell button:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
  .aa-icon{width:15px;height:15px;flex:none;fill:none;stroke:currentColor;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round}.aa-grow{flex:1;min-width:0}.aa-muted{color:var(--muted)}.aa-mono{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:10px}
  .aa-top{height:43px;flex:none;display:flex;align-items:center;gap:12px;padding:0 12px;border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--fg) 5%,var(--panel))}.aa-brand{font-weight:750;letter-spacing:.03em;font-size:14px}.aa-logo{color:var(--accent);width:23px;height:23px}.aa-separator{width:1px;height:20px;background:var(--line)}
  .aa-global-search{margin-left:12px;display:flex;align-items:center;gap:7px;padding:4px 9px;background:var(--panel);border:1px solid var(--line);border-radius:4px;width:260px;color:var(--muted)}.aa-global-search input{width:100%;min-width:0;outline:0;border:0;background:none;font-size:11px}.aa-global-search kbd{font-size:9px;white-space:nowrap;color:var(--muted)}
  .aa-button{display:inline-flex;align-items:center;gap:6px;justify-content:center;min-height:28px;padding:4px 9px;border:1px solid var(--line);border-radius:3px;background:var(--panel);white-space:nowrap;text-align:left}.aa-button:hover{background:var(--bg);border-color:var(--accent)}.aa-button.primary{background:var(--accent);border-color:var(--accent);color:white}.aa-button.danger{background:#b63e46;border-color:#b63e46;color:white}.aa-button.ghost{border-color:transparent;background:none}.aa-button.icon{padding:4px;width:29px;position:relative}.aa-button:disabled{opacity:.55;cursor:default}.aa-button .aa-dot{position:absolute;right:3px;top:3px;background:#c05045;border:2px solid var(--panel);width:8px;height:8px}
  .aa-frame{display:flex;min-height:0;flex:1}.aa-sidebar{flex:none;width:166px;display:flex;flex-direction:column;overflow:auto;border-right:1px solid var(--line);background:color-mix(in srgb,var(--fg) 2%,var(--panel));padding:10px 6px}.aa-side-label{padding:7px 9px 5px;font-size:9px;font-weight:650;letter-spacing:.09em;color:var(--muted);text-transform:uppercase}.aa-side-link{width:100%;display:flex;align-items:center;gap:8px;padding:6px 9px;border:0;background:none;text-align:left;border-radius:3px;font-size:11px}.aa-side-link:hover{background:var(--bg)}.aa-side-link.on{color:var(--accent);font-weight:650;background:color-mix(in srgb,var(--accent) 11%,var(--panel))}.aa-side-link small{margin-left:auto;font-size:10px;color:var(--muted)}.aa-side-footer{margin-top:auto;padding:10px 8px 4px;border-top:1px solid var(--line);font-size:10px;color:var(--muted)}.aa-side-footer b{display:block;font-weight:500;color:var(--fg)}
  .aa-narrow .aa-sidebar{width:42px;padding:7px 3px}.aa-narrow .aa-side-label,.aa-narrow .aa-side-link span,.aa-narrow .aa-side-link small,.aa-narrow .aa-side-footer{display:none}.aa-narrow .aa-side-link{padding:9px;justify-content:center}.aa-narrow .aa-global-search{width:180px}.aa-tiny .aa-global-search,.aa-tiny .aa-top .aa-tenant,.aa-tiny .aa-top .aa-separator{display:none}
  .aa-workspace{min-width:0;min-height:0;display:flex;flex-direction:column;flex:1}.aa-header{flex:none;padding:8px 13px 5px}.aa-breadcrumbs{display:flex;align-items:center;gap:5px;color:var(--muted);font-size:10px;flex-wrap:wrap}.aa-breadcrumbs .aa-icon{width:10px;height:10px}.aa-heading-row{display:flex;align-items:center;gap:8px;margin:4px 0}.aa-heading-row h2{font-size:19px;line-height:1.15;letter-spacing:-.025em;margin:0}.aa-heading-row> .aa-icon{width:20px;height:20px;color:var(--accent)}.aa-sub{font-size:10px;color:var(--muted)}
  .aa-tabs{flex:none;display:flex;gap:16px;padding:0 13px;border-bottom:1px solid var(--line)}.aa-tab{border:0;border-bottom:2px solid transparent;padding:6px 0;color:var(--muted);background:none;font-size:11px;white-space:nowrap}.aa-tab.on{border-bottom-color:var(--accent);color:var(--accent);font-weight:650}.aa-tab small{margin-left:5px;font-size:9px}
  .aa-toolbar{display:flex;align-items:center;gap:5px;flex:none;min-height:36px;padding:4px 10px;border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--bg) 60%,var(--panel))}.aa-toolbar .aa-button{font-size:10px;min-height:25px;padding:3px 7px}.aa-toolbar .aa-scope{display:flex;align-items:center;gap:6px;color:var(--muted);font-size:10px;min-width:0}.aa-toolbar .aa-scope span{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.aa-toolbar .aa-scope .aa-icon{width:12px;height:12px}
  .aa-content-row{display:flex;flex:1;min-height:0;min-width:0}.aa-main{flex:1;min-width:0;min-height:0;overflow:auto;overscroll-behavior:contain;scrollbar-width:thin;padding:12px 14px;scroll-padding:10px;background:var(--panel)}.aa-main.table{padding:0}.aa-main h3{margin:0 0 7px;font-size:14px;font-weight:650}.aa-main p{margin:5px 0 10px}.aa-context{flex:none;width:216px;padding:11px;border-left:1px solid var(--line);background:color-mix(in srgb,var(--bg) 60%,var(--panel));overflow:auto;scrollbar-width:thin}.aa-context h4{font-size:11px;margin:0 0 7px}.aa-context-section{margin-bottom:18px}.aa-context p{font-size:10px;color:var(--muted);margin:6px 0}.aa-context .aa-review{grid-template-columns:1fr;font-size:10px;gap:2px}.aa-context .aa-review dd{margin-bottom:6px}
  .aa-section{border:1px solid var(--line);border-radius:4px;margin-bottom:12px}.aa-section-head{padding:7px 10px;border-bottom:1px solid var(--line);background:var(--bg);display:flex;align-items:center;gap:6px;font-weight:600;font-size:11px}.aa-section-body{padding:10px}.aa-section-body>p{font-size:11px;color:var(--muted)}.aa-label{display:block;font-size:11px;font-weight:600;margin:4px 0 5px}.aa-picker{display:flex;width:100%;justify-content:space-between;text-align:left;min-height:31px;white-space:normal;background:var(--panel);font-size:11px}.aa-picker>span{min-width:0;overflow-wrap:anywhere}.aa-input{width:100%;height:31px;padding:5px 8px;border:1px solid var(--line);border-radius:3px;background:var(--panel);user-select:text;-webkit-user-select:text}.aa-input:focus{outline:2px solid var(--accent)}
  .aa-banner{display:flex;align-items:flex-start;gap:7px;padding:8px 9px;margin:0 0 10px;border:1px solid color-mix(in srgb,var(--accent) 35%,var(--line));border-radius:3px;background:color-mix(in srgb,var(--accent) 6%,var(--panel));font-size:10px}.aa-banner .aa-icon{color:var(--accent);width:14px;height:14px}.aa-banner.warn{border-color:color-mix(in srgb,#bf8a36 50%,var(--line));background:color-mix(in srgb,#bf8a36 8%,var(--panel))}.aa-banner.warn .aa-icon{color:#bc8b40}.aa-banner strong{font-weight:650;display:block;margin-bottom:2px}
  .aa-steps{display:flex;align-items:center;gap:3px;flex-wrap:wrap;margin-bottom:11px}.aa-step{display:flex;align-items:center;gap:5px;font-size:10px;padding:4px 5px;color:var(--muted)}.aa-step b{display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:50%;height:18px;width:18px;font-size:9px;font-weight:500}.aa-step.current{color:var(--accent);font-weight:650}.aa-step.current b{color:white;background:var(--accent);border-color:var(--accent)}.aa-step .aa-icon{width:12px;height:12px}
  .aa-readonly{display:grid;grid-template-columns:minmax(95px,.8fr) minmax(0,1.2fr);gap:6px 12px;font-size:10px}.aa-readonly>span{color:var(--muted)}.aa-readonly b{font-weight:500;display:flex;align-items:center;gap:5px;min-width:0;overflow-wrap:anywhere}.aa-readonly .aa-icon{width:11px;height:11px;color:var(--muted)}.aa-review{display:grid;grid-template-columns:135px minmax(0,1fr);gap:6px 12px;margin:7px 0;font-size:11px}.aa-review dt{color:var(--muted)}.aa-review dd{margin:0;overflow-wrap:anywhere}.aa-price{font-size:23px;font-weight:650;letter-spacing:-.04em;margin:4px 0}.aa-price small{font-size:10px;letter-spacing:0;font-weight:400;color:var(--muted)}
  .aa-status{display:inline-flex;align-items:center;gap:5px;font-size:10px;white-space:nowrap}.aa-dot{width:6px;height:6px;border-radius:50%;display:inline-block;background:#378b70;flex:none}.aa-status.warn .aa-dot{background:#b98334}.aa-status.neutral .aa-dot{background:var(--muted)}.aa-chip{font-size:9px;display:inline-flex;align-items:center;gap:4px;padding:2px 5px;border:1px solid var(--line);border-radius:3px;background:var(--bg);color:var(--muted);white-space:nowrap}.aa-chip .aa-icon{width:10px;height:10px}.aa-tag{display:inline-block;font-size:9px;padding:2px 5px;border-radius:3px;background:color-mix(in srgb,var(--accent) 9%,var(--panel));color:var(--accent)}
  .aa-table{border-collapse:collapse;table-layout:fixed;width:100%;font-size:11px}.aa-table th{position:sticky;top:0;z-index:1;background:var(--bg);color:var(--muted);padding:6px 9px;text-align:left;border-bottom:1px solid var(--line);font-size:9px;font-weight:600}.aa-table td{padding:6px 9px;border-bottom:1px solid var(--line);vertical-align:middle;overflow-wrap:anywhere}.aa-table tr:hover{background:color-mix(in srgb,var(--accent) 3%,var(--panel))}.aa-table tr.selected{background:color-mix(in srgb,var(--accent) 9%,var(--panel))}.aa-table small{font-size:9px;color:var(--muted);display:block;line-height:1.4}.aa-table .aa-button{font-size:10px;padding:3px 6px;min-height:25px}.aa-table .aa-link{padding:0;min-height:0;border:0;background:none;display:inline;text-align:left;white-space:normal;color:var(--accent);font-weight:600}.aa-table .aa-picker{width:100%;font-size:10px;min-height:27px;gap:4px}.aa-table .aa-picker .aa-icon{width:12px;height:12px}.aa-table .aa-mono{font-size:10px}.aa-table .aa-checkcell{width:29px;padding-right:0}.aa-checkmark{display:inline-flex;height:12px;width:12px;border:1px solid var(--line);border-radius:2px;background:var(--panel)}.aa-avatar{width:25px;height:25px;border-radius:50%;display:inline-flex;justify-content:center;align-items:center;flex:none;color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,var(--panel));font-size:9px;font-weight:600}.aa-user{display:flex;gap:7px;align-items:center;min-width:0}.aa-user-info{min-width:0}.aa-email{overflow-wrap:anywhere}.aa-directory .aa-usercol{width:41%}.aa-directory .aa-accesscol{width:23%}.aa-directory .aa-statuscol{width:16%}.aa-ticket-table .aa-titlecol{width:42%}.aa-ticket-table .aa-queuecol{width:28%}
  .aa-pager{flex:none;display:flex;align-items:center;gap:4px;padding:5px 10px;border-top:1px solid var(--line);font-size:10px;min-height:33px}.aa-pager .aa-button{min-height:23px;padding:2px 7px;font-size:10px}.aa-pager .current{color:var(--accent);border-color:var(--accent);background:color-mix(in srgb,var(--accent) 5%,var(--panel))}.aa-actions{display:flex;align-items:center;gap:7px;padding:7px 11px;border-top:1px solid var(--line);flex:none;min-width:0}.aa-actions>span{font-size:10px}.aa-facts{display:flex;flex:none;align-items:center;gap:6px 16px;flex-wrap:wrap;min-height:25px;padding:5px 11px;border-top:1px solid var(--line);background:var(--bg);font-size:9px}.aa-facts b{font-weight:450;color:var(--muted)}.aa-facts .aa-icon{width:11px;height:11px;color:var(--muted)}.aa-notice{flex:none;display:flex;align-items:center;gap:6px;padding:5px 11px;border-top:1px solid var(--line);background:color-mix(in srgb,var(--accent) 5%,var(--panel));font-size:10px;color:var(--accent)}.aa-notice.error{color:#c05b55;background:color-mix(in srgb,#ba4842 7%,var(--panel))}
  .aa-detail{flex:none;padding:7px 11px;border-top:1px solid var(--line);background:var(--bg)}.aa-detail-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.aa-detail-row>b{font-size:11px}.aa-detail-row .aa-picker{width:153px;min-height:28px}.aa-detail-row label{display:flex;align-items:center;gap:4px;font-size:10px}.aa-detail-row input{accent-color:var(--accent)}.aa-detail>.aa-sub{margin-top:5px}.aa-list-meta{display:flex;align-items:center;gap:7px;flex-wrap:wrap;padding:6px 9px;border-bottom:1px solid var(--line);font-size:9px;color:var(--muted);background:var(--panel)}
  .aa-mini-table{width:100%;border-collapse:collapse;font-size:10px}.aa-mini-table th{color:var(--muted);font-size:9px;font-weight:500;text-align:left;padding:4px 6px;border-bottom:1px solid var(--line)}.aa-mini-table td{padding:6px;border-bottom:1px solid var(--line)}.aa-mini-table small{display:block;color:var(--muted);font-size:9px}.aa-activity{padding:6px 0;display:flex;gap:8px;border-bottom:1px solid var(--line);font-size:10px}.aa-activity>.aa-icon{margin-top:2px;color:var(--muted);width:12px;height:12px}.aa-activity small{display:block;font-size:9px;color:var(--muted);margin-top:2px}.aa-context .aa-status{font-size:9px}.aa-context .aa-activity{font-size:10px}.aa-meter{height:5px;border-radius:2px;background:var(--line);overflow:hidden;margin:6px 0 3px}.aa-meter>i{display:block;height:100%;background:var(--accent);min-width:2px}.aa-meter-labels{display:flex;justify-content:space-between;font-size:9px;color:var(--muted)}
  .aa-folder{display:flex;align-items:center;gap:9px;width:100%;padding:9px 10px;border:0;border-bottom:1px solid var(--line);border-radius:0;min-height:45px;text-align:left;background:var(--panel)}.aa-folder:hover{background:var(--bg)}.aa-folder>.aa-icon:first-child{color:var(--accent)}.aa-folder span{flex:1}.aa-folder small{display:block;color:var(--muted);font-size:10px;margin-top:2px}.aa-folder>.aa-icon:last-child{color:var(--muted)}.aa-quota-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line);border-radius:3px;margin:10px 0}.aa-quota-stats>div{background:var(--panel);padding:9px}.aa-quota-stats b{display:block;font-size:18px;letter-spacing:-.03em}.aa-quota-stats span{font-size:9px;color:var(--muted)}
  .aa-overlay{position:absolute;inset:0;z-index:15;display:flex;justify-content:center;align-items:center;padding:10px;background:#080d1673}.aa-dialog{width:min(440px,100%);max-height:100%;overflow:auto;padding:0;background:var(--panel);border:1px solid var(--line);border-radius:5px;box-shadow:0 12px 50px #0005}.aa-dialog-head{display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid var(--line)}.aa-dialog-head h3{margin:0;font-size:14px}.aa-dialog-head>.aa-icon{color:var(--accent);width:18px;height:18px}.aa-dialog-body{padding:12px 14px}.aa-dialog p{font-size:11px;color:var(--muted);margin:5px 0 12px;overflow-wrap:anywhere}.aa-dialog .aa-actions{background:var(--bg);justify-content:flex-end;padding:9px 14px}.aa-dialog .aa-label{margin-top:10px}.aa-dialog .aa-section{margin-bottom:9px}.aa-option{width:100%;display:flex;align-items:center;gap:8px;justify-content:space-between;padding:10px;margin:0;border:0;border-bottom:1px solid var(--line);background:var(--panel);text-align:left;font-size:11px}.aa-option:hover{background:color-mix(in srgb,var(--accent) 7%,var(--panel))}.aa-option.selected{color:var(--accent);background:color-mix(in srgb,var(--accent) 4%,var(--panel))}.aa-option small{display:block;color:var(--muted);font-size:10px;margin-top:2px}.aa-option>.aa-icon{width:15px;height:15px}.aa-dialog .aa-user{margin:0 0 10px}.aa-dialog .aa-preview-row{padding:10px 0;border-bottom:1px solid var(--line);font-size:11px}.aa-dialog .aa-preview-row small{display:block;color:var(--muted);font-size:10px}
  .aa-user-info>small{display:block;font-size:10px;color:var(--muted)}.aa-table .aa-user-info>small{font-size:9px}
  .aa-short .aa-tabs{display:none}.aa-short .aa-header{padding:5px 10px}.aa-short .aa-heading-row h2{font-size:16px}.aa-short .aa-header>.aa-sub{display:none}.aa-short .aa-top{height:34px}.aa-short .aa-toolbar{min-height:30px;padding:2px 7px}.aa-short .aa-toolbar .aa-toolbar-extra{display:none}.aa-short .aa-detail{padding:5px 8px}.aa-short .aa-detail>.aa-sub{display:none}.aa-short .aa-table td{padding:4px 7px}.aa-short .aa-main{padding:9px}.aa-short .aa-main.table{padding:0}.aa-short .aa-actions{padding:5px 8px}.aa-short .aa-steps{margin-bottom:6px}.aa-short .aa-step{padding:2px 3px;font-size:9px}.aa-short .aa-sidebar{padding-top:4px}
  `;
  env.widget({ task: 'use-admin-console', site: 'base', name: 'classic', scenarios: ['vm', 'iam', 'resetuser', 'tickets', 'quota'],
    render(ctx) {
      ctx.css('app-admin-classic', CSS);
      const { spec: s, util } = ctx, f = env.taskDef, el = util.el;
      const width = Math.max(280, ctx.size.width - 20), height = Math.max(220, ctx.size.height - 20);
      const shell = el('div', 'aa-shell', ctx.stage); shell.style.width = `${width}px`; shell.style.height = `${height}px`;
      const narrow = width < 880, tiny = width < 610, short = height < 415, withContext = width >= 1140;
      if (narrow) shell.classList.add('aa-narrow'); if (tiny) shell.classList.add('aa-tiny'); if (short) shell.classList.add('aa-short');
      const paneWidth = width - (narrow ? 42 : 166) - (withContext ? 216 : 0), compact = paneWidth < 660;
      const pageSize = 10;
      ctx.update({ ...ctx.model, pageSize, page: Math.min(ctx.model.page, Math.ceil(s.users.length / pageSize) - 1), clipped: {} });
      const ui = { preview: null, scroll: 0, search: '', refreshed: false };
      let targets = {}, workspace, main, drawing = false;
      const key = t => JSON.stringify(t), put = (t, node) => { targets[key(t)] = node; return node; };
      function icon(parent, name, cls = '') {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('class', `aa-icon ${cls}`); svg.setAttribute('aria-hidden', 'true');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', PATHS[name] || PATHS.document);
        svg.append(path); parent.append(svg); return svg;
      }
      const act = (a, redraw = true) => {
        if (s.judge?.mode === 'confirm' && ['confirm', 'create', 'saveAccess', 'saveQuota', 'applyRoutes'].includes(a.nav)) { ctx.flag('irreversible'); return; }
        ui.scroll = 0; ctx.update(f.helpers.apply(ctx.model, s, a)); if (redraw) draw(ctx.model);
      };
      function button(parent, label, target, action, cls = '', glyph) {
        const b = el('button', `aa-button ${cls}`, parent); b.type = 'button';
        if (glyph) icon(b, glyph); if (label) el('span', '', b, label);
        if (target) put(target, b); if (action) b.addEventListener('click', () => act(action)); return b;
      }
      function preview(parent, label, glyph, title = label, cls = '') {
        const b = button(parent, label, null, null, cls, glyph);
        if (!label) b.setAttribute('aria-label', title); b.title = title;
        b.addEventListener('click', () => { ui.preview = title; ui.scroll = main?.scrollTop || 0; draw(ctx.model); }); return b;
      }
      function picker(parent, id, value) {
        const b = button(parent, value || 'Choose an option', { pick: id }, { pick: id }, 'aa-picker'); icon(b, 'down'); return b;
      }
      function status(parent, text, tone = '') { const x = el('span', `aa-status ${tone}`, parent); el('i', 'aa-dot', x); el('span', '', x, text); return x; }
      function banner(parent, title, text, warn = false) {
        const box = el('div', `aa-banner${warn ? ' warn' : ''}`, parent); icon(box, warn ? 'warning' : 'info');
        const content = el('div', '', box); if (title) el('strong', '', content, title); el('span', '', content, text); return box;
      }
      function section(parent, title, glyph) {
        const box = el('section', 'aa-section', parent), head = el('div', 'aa-section-head', box);
        if (glyph) icon(head, glyph); el('span', '', head, title); return el('div', 'aa-section-body', box);
      }
      function readonly(parent, pairs) {
        const grid = el('div', 'aa-readonly', parent);
        for (const [label, value] of pairs) { el('span', '', grid, label); const val = el('b', '', grid, value); if (label.includes('policy')) icon(val, 'lock'); }
      }
      function actions(parent = workspace) { return el('div', 'aa-actions', parent); }
      function miniTable(parent, labels, rows) {
        const t = el('table', 'aa-mini-table', parent), tr = el('tr', '', el('thead', '', t));
        labels.forEach(label => el('th', '', tr, label)); const body = el('tbody', '', t);
        rows.forEach(row => { const r = el('tr', '', body); row.forEach(value => el('td', '', r, value)); }); return t;
      }
      function history(parent, entries) {
        for (const [text, detail] of entries) { const row = el('div', 'aa-activity', parent); icon(row, 'clock'); const body = el('div', '', row, text); el('small', '', body, detail); }
      }
      function pager(records, m) {
        const p = el('div', 'aa-pager', workspace);
        el('span', 'aa-grow aa-muted', p, `${m.page * m.pageSize + 1}-${Math.min(records.length, m.page * m.pageSize + m.pageSize)} of ${records.length} records`);
        const pages = Math.ceil(records.length / m.pageSize);
        for (let i = 0; i < pages; i++) button(p, String(i + 1), { page: i }, { page: i }, m.page === i ? 'current' : '');
        if (pages < 6 && !tiny) el('span', 'aa-muted', p, `${m.pageSize} / page`);
      }
      function table(parent, labels, cls) {
        const t = el('table', `aa-table ${cls || ''}`, parent), tr = el('tr', '', el('thead', '', t));
        for (const [label, css] of labels) el('th', css || '', tr, label);
        return el('tbody', '', t);
      }
      function user(parent, u, target) {
        const row = el('div', 'aa-user', parent);
        el('span', 'aa-avatar', row, u.name.split(' ').map(x => x[0]).slice(0, 2).join(''));
        const info = el('div', 'aa-user-info', row);
        if (target) button(info, u.name, target, { row: u.id }, 'aa-link'); else el('b', '', info, u.name);
        el('small', 'aa-email', info, u.email); return row;
      }
      function sidebar(frame) {
        const rail = el('nav', 'aa-sidebar', frame); rail.setAttribute('aria-label', 'Administration services');
        const groups = [
          ['Workspace', [['Overview', 'grid', ''], ['Resource groups', 'folder', '12']]],
          ['Manage', [['Virtual machines', 'compute', '24', 'vm'], ['Users & access', 'users', String(s.users.length), 'iam'],
            ['User security', 'shield', '3', 'resetuser'], ['Service desk', 'ticket', String(s.tickets.length), 'tickets'], ['Limits & quotas', 'quota', '18', 'quota']]],
          ['Operations', [['Virtual networks', 'network', '7'], ['Storage volumes', 'disk', '31'], ['Activity log', 'clock', ''], ['Billing & usage', 'document', '']]],
          ['Governance', [['Policies', 'shield', '6'], ['Settings', 'settings', '']]],
        ];
        for (const [label, links] of groups) {
          el('div', 'aa-side-label', rail, label);
          for (const [name, glyph, count, scenario] of links) {
            const b = preview(rail, name, glyph, name, `aa-side-link${s.scenario === scenario ? ' on' : ''}`);
            if (count) el('small', '', b, count);
            if (s.scenario === scenario) b.setAttribute('aria-current', 'page');
          }
        }
        const foot = el('div', 'aa-side-footer', rail); status(foot, 'Service health: normal');
        el('b', '', foot, 'Plan: Enterprise Standard'); el('span', '', foot, 'Support ID NS-2048');
      }
      function topbar() {
        const top = el('div', 'aa-top', shell); icon(top, 'logo', 'aa-logo'); el('span', 'aa-brand', top, 'Northstar');
        el('i', 'aa-separator', top); preview(top, 'Production', 'folder', 'Organization & projects', 'ghost aa-tenant');
        const search = el('label', 'aa-global-search', top); icon(search, 'search');
        const input = el('input', '', search); input.type = 'search'; input.placeholder = 'Search resources and services'; input.setAttribute('aria-label', 'Search resources and services'); input.value = ui.search;
        input.addEventListener('input', () => { ui.search = input.value; });
        input.addEventListener('keydown', e => { if (e.key === 'Enter') { ui.preview = 'Search results'; draw(ctx.model); } });
        if (!narrow) el('kbd', '', search, 'Search');
        el('span', 'aa-grow', top); const bell = preview(top, '', 'bell', 'Notifications', 'icon ghost'); el('i', 'aa-dot', bell);
        preview(top, '', 'help', 'Help & support', 'icon ghost');
        el('span', 'aa-avatar', top, 'AD').title = 'Admin session / northstar.example';
      }
      function vm(m) {
        if (m.step < 7) {
          const steps = el('div', 'aa-steps', main);
          [...s.fields.map(x => x.id === 'region' ? 'Basics' : x.id[0].toUpperCase() + x.id.slice(1)), 'Review'].forEach((label, i) => {
            const item = el('span', `aa-step${m.step === i ? ' current' : ''}`, steps);
            const n = el('b', '', item); if (i < m.step) icon(n, 'check'); else n.textContent = String(i + 1); el('span', '', item, label);
          });
        }
        if (m.step < 6) {
          const field = s.fields[m.step]; const card = section(main, field.label, { region: 'compute', image: 'document', size: 'compute', disk: 'disk', network: 'network', tag: 'folder' }[field.id]);
          el('p', '', card, field.hint); el('label', 'aa-label', card, `${field.label} *`); picker(card, field.id, m.values[field.id]);
          const meta = {
            region: [['Subscription', 'Production / NS-PROD-01'], ['Resource group', 'shared-infrastructure'], ['Availability zone', 'Zone 1 (automatic)'], ['Resource naming', 'Generated on deployment']],
            image: [['Publisher', 'Northstar verified images'], ['Architecture', 'x86_64'], ['Generation', 'Gen 2 / Secure Boot'], ['Update policy', 'Automatic security patches']],
            size: [['Workload profile', 'General purpose'], ['CPU family', 'Shared compute / C2'], ['Billing model', 'On demand'], ['Reservation', 'No commitment']],
            disk: [['Storage class', 'Balanced SSD'], ['Encryption policy', 'Platform-managed keys'], ['Backup schedule', 'Daily at 02:00 UTC'], ['Delete with VM', 'Enabled']],
            network: [['Subnet', 'default / 10.42.0.0/24'], ['Public IPv4', 'Disabled'], ['Firewall policy', 'Production baseline'], ['Private DNS', 'Registration enabled']],
            tag: [['Tag policy', 'Environment tag required'], ['Owner', 'Infrastructure team'], ['Cost centre', 'IT-204'], ['Inherited tags', 'organization=northstar']],
          };
          readonly(section(main, 'Configuration defaults', 'settings'), meta[field.id]);
          banner(main, 'Managed by organization policy', m.step === 4 ? 'Public endpoints are blocked on this subscription. Private access is provided by the shared gateway.' : 'Encryption, monitoring and standard audit logging are applied automatically.');
        } else {
          if (m.created) banner(main, 'Deployment complete', 'The instance is running. Guest health and platform checks are available in Monitoring.');
          const summary = section(main, m.created ? 'Essentials' : 'Review deployment', 'compute');
          const dl = el('dl', 'aa-review', summary);
          for (const field of s.fields) { el('dt', '', dl, field.label); el('dd', '', dl, (m.created ? m.saved : m.values)[field.id]); }
          if (m.created) { el('dt', '', dl, 'Resource ID'); el('dd', 'aa-mono', dl, s.resourceId); }
          if (!m.created) banner(main, 'Deployment policy', 'This instance will be billed to Production. Network egress and snapshots are charged separately.');
          else readonly(section(main, 'Platform health', 'shield'), [['Provisioning', 'Succeeded'], ['Guest agent', 'Ready'], ['Boot diagnostics', 'Enabled'], ['Security policy', 'Baseline applied']]);
        }
        if (!withContext) {
          const box = section(main, 'Cost estimate / monthly', 'document'); const price = el('div', 'aa-price', box, f.helpers.cost(m, s)); el('small', '', price, ' USD');
          el('div', 'aa-sub', box, '730 compute hours + encrypted SSD. Taxes, snapshots and network traffic are excluded.');
        }
        related(main, 'vm');
        const bar = actions(); if (m.step > 0 && m.step < 7) button(bar, 'Back', { nav: 'back' }, { nav: 'back' }, '', 'back');
        el('span', 'aa-grow aa-muted', bar, m.created ? 'Provisioning: Succeeded' : 'Draft configuration');
        const name = m.created ? 'edit' : m.step === 6 ? 'create' : 'next';
        button(bar, m.created ? 'Edit configuration' : m.step === 6 ? 'Create virtual machine' : 'Next', { nav: name }, { nav: name }, 'primary', m.created ? 'settings' : m.step === 6 ? 'plus' : 'chevron');
      }
      function directory(m) {
        const meta = el('div', 'aa-list-meta', main); icon(meta, 'filter'); el('span', '', meta, 'Directory: northstar.example');
        el('span', 'aa-chip', meta, 'Account type: Member'); el('span', 'aa-grow', meta); el('span', '', meta, 'Sort: Object ID');
        const labels = [['', 'aa-checkcell'], ['User / principal name', 'aa-usercol']];
        if (!compact) labels.push(['Department', '']); labels.push(['Role / licence', 'aa-accesscol'], ['Status', 'aa-statuscol']);
        const body = table(main, labels, 'aa-directory');
        for (const u of s.users.slice(m.page * m.pageSize, (m.page + 1) * m.pageSize)) {
          const tr = el('tr', m.selected === u.id ? 'selected' : '', body); const cb = el('td', 'aa-checkcell', tr); el('i', 'aa-checkmark', cb);
          const td = el('td', '', tr); user(td, u, { row: u.id });
          if (!compact) el('td', 'aa-muted', tr, u.team);
          const access = el('td', '', tr); el('span', '', access, m.access[u.id].role); el('small', '', access, m.access[u.id].licence);
          const st = el('td', '', tr); status(st, m.resets[u.id] ? 'Updated' : 'Enabled');
          if (!compact) el('small', '', st, 'Directory synced');
        }
        // Related audit entries are not additional accounts to change.
        const log = el('div', '', main); log.style.padding = '10px';
        const active = m.selected && s.users.find(u => u.id === m.selected);
        history(log, active ? [[`Account ${active.id}`, `${active.team} / Member / synced from Northstar Directory`],
          ['Access review', 'Standard membership policy / reviewed 3 days ago']]
          : [['Directory sync completed', 'Source: Northstar Directory / no sync errors'], ['Access review scheduled', 'Operations pilot / quarterly review / policy AP-17']]);
        pager(s.users, m);
        if (s.scenario === 'resetuser') {
          const d = el('div', 'aa-detail', workspace), row = el('div', 'aa-detail-row', d);
          icon(row, 'shield'); el('b', '', row, active ? active.name : 'Account security'); picker(row, 'action', m.action);
          const label = el('label', '', row), check = put({ field: 'notify' }, el('input', '', label)); check.type = 'checkbox'; check.checked = m.notify;
          check.addEventListener('change', () => act({ set: ['notify', check.checked] })); el('span', '', label, 'Email notification');
          const b = button(row, 'Review reset', { nav: 'reset' }, { nav: 'reset' }, 'primary'); b.disabled = !active;
          el('div', 'aa-sub', d, active ? `${active.email} / Credential changes are recorded in the audit log.` : 'Select a user to manage password and authentication methods.');
        }
      }
      function tickets(m) {
        const meta = el('div', 'aa-list-meta', main); icon(meta, 'filter'); el('span', 'aa-chip', meta, 'State: Open'); el('span', 'aa-chip', meta, 'Project: IT operations');
        el('span', 'aa-grow', meta); el('span', '', meta, 'Sort: Ticket ID');
        const labels = [['', 'aa-checkcell'], ['Number / short description', 'aa-titlecol'], ['Category / priority', ''], ['Assignment group', 'aa-queuecol']];
        if (!compact) labels.splice(3, 0, ['SLA / state', '']);
        const body = table(main, labels, 'aa-ticket-table');
        for (const t of s.tickets.slice(m.page * m.pageSize, (m.page + 1) * m.pageSize)) {
          const tr = el('tr', '', body), cb = el('td', 'aa-checkcell', tr); el('i', 'aa-checkmark', cb);
          const title = el('td', '', tr); el('span', 'aa-mono', title, t.id); el('small', '', title, t.title);
          if (!compact) el('small', '', title, t.requester);
          const cat = el('td', '', tr, t.category); const priority = el('small', '', cat); status(priority, t.priority, t.priority === 'Urgent' ? 'warn' : 'neutral');
          if (!compact) { const sla = el('td', '', tr); status(sla, t.priority === 'Urgent' ? '42m remaining' : 'Within SLA', t.priority === 'Urgent' ? 'warn' : ''); el('small', '', sla, 'Open'); }
          picker(el('td', '', tr), `queue:${t.id}`, m.queues[t.id]);
        }
        const log = el('div', '', main); log.style.padding = '10px';
        history(log, [['Queue synchronization complete', 'All open IT operations tickets are included in this workset.'], ['Routing policy', 'Manual assignment / category-based routing / audit enabled']]);
        pager(s.tickets, m);
        if (s.judge?.mode === 'confirm') button(actions(), 'Apply routing proposals', { nav: 'applyRoutes' }, { nav: 'applyRoutes' }, 'primary');
      }
      function quota(m) {
        const crumbs = el('div', 'aa-breadcrumbs', main);
        ['Console', ...s.path.slice(0, m.depth)].forEach((label, i) => { if (i) icon(crumbs, 'chevron'); el('span', '', crumbs, label); });
        crumbs.style.marginBottom = '10px';
        if (m.depth < s.path.length) {
          const title = m.depth ? s.path[m.depth - 1] : 'Organization settings';
          el('h3', '', main, title); el('p', 'aa-sub', main, 'Production subscription / Configuration and service limits');
          const folders = [s.path[m.depth], ...['Activity log', 'Billing profiles', 'Policy assignments'].filter(x => x !== s.path[m.depth])];
          const box = el('div', 'aa-section', main);
          folders.forEach((name, i) => {
            const b = button(box, '', i === 0 ? { depth: m.depth + 1 } : null, i === 0 ? { depth: m.depth + 1 } : null, 'aa-folder', i === 0 ? 'folder' : ['clock', 'document', 'shield'][i - 1]);
            const text = el('span', '', b, name); el('small', '', text, i === 0 ? 'Service configuration, usage and regional capacity' : ['Read recent administrative operations', 'Payment details and invoice settings', 'Inherited organization controls'][i - 1]);
            icon(b, 'chevron'); if (i > 0) b.addEventListener('click', () => { ui.preview = name; draw(ctx.model); });
          });
          readonly(section(main, 'Subscription details', 'document'), [['Subscription ID', 'NS-PROD-01'], ['Billing status', 'Active / Pay as you go'], ['Directory', 'northstar.example'], ['Policy assignments', '6 inherited / 2 local']]);
        } else {
          el('h3', '', main, `${s.quotaName} / ${s.quotaRegion}`);
          el('div', 'aa-sub', main, 'Provider: Northstar.Compute / Scope: Production / Regional quota');
          const stats = el('div', 'aa-quota-stats', main);
          for (const [label, value] of [['Current usage', s.usage], ['Saved limit', m.savedLimit], ['Available headroom', Number(m.savedLimit) - s.usage]]) {
            const stat = el('div', '', stats); el('span', '', stat, label); el('b', '', stat, String(value));
          }
          const card = section(main, 'Quota configuration', 'quota');
          const label = el('label', 'aa-label', card, 'New limit'); const input = put({ field: 'limit' }, el('input', 'aa-input', card)); input.id = 'aa-quota-limit'; label.htmlFor = input.id;
          input.type = 'text'; input.inputMode = 'numeric'; input.value = m.limit; input.setAttribute('aria-describedby', 'aa-limit-hint');
          input.addEventListener('input', () => act({ set: ['limit', input.value] }, false));
          el('div', 'aa-sub', card, `Whole numbers only. Current usage of ${s.usage} must remain available.`).id = 'aa-limit-hint';
          banner(main, 'Changes take effect immediately', 'Quota increases do not reserve capacity or create resources. Existing usage is not changed.');
          miniTable(section(main, 'Other regional limits', 'quota'), ['Quota', 'Region', 'Usage', 'Limit'],
            [['Snapshot count', 'East Harbor', '24', '200'], ['Private endpoints', 'West Ridge', '12', '100'], ['Load balancers', 'North Vale', '4', '40']]);
        }
        const bar = actions(); if (m.depth) button(bar, 'Parent settings', { nav: 'up' }, { nav: 'up' }, '', 'back'); el('span', 'aa-grow', bar);
        if (m.depth === s.path.length) button(bar, 'Save limit', { nav: 'saveQuota' }, { nav: 'saveQuota' }, 'primary');
      }
      function related(parent, scenario) {
        const box = section(parent, scenario === 'vm' ? 'Other resources in this group' : 'Recent operations', 'folder');
        miniTable(box, ['Name', 'Type', 'Status'], [['gateway-prod-01', 'Gateway', 'Available'], ['metrics-collector', 'Compute', 'Running'], ['backup-vault-prod', 'Storage', 'Protected']]);
      }
      function context(parent, m) {
        const aside = el('aside', 'aa-context', parent); aside.setAttribute('aria-label', 'Resource context');
        const box = (title, glyph) => { const sec = el('section', 'aa-context-section', aside), head = el('h4', '', sec); if (glyph) { icon(head, glyph); head.style.display = 'flex'; head.style.gap = '6px'; } el('span', '', head, title); return sec; };
        if (s.scenario === 'vm') {
          const cost = box('Estimated monthly cost', 'document'); el('div', 'aa-price', cost, f.helpers.cost(m, s)); el('p', '', cost, 'USD / 730 compute hours');
          readonly(cost, [['Pricing plan', 'On demand'], ['SSD storage', `${m.values.disk} GiB`], ['Billing account', 'Production']]);
          el('p', '', cost, 'Taxes, snapshots and network traffic are not included.');
        } else if (s.scenario === 'iam') {
          const licence = box('Licence allocation', 'users'); const used = Object.values(m.access).filter(a => a.licence !== 'None').length;
          el('div', 'aa-price', licence, `${used} / 40`); el('p', '', licence, 'Seats allocated in this workspace');
          const meter = el('div', 'aa-meter', licence); el('i', '', meter).style.width = `${used / 40 * 100}%`;
          readonly(licence, [['Plan', 'Workspace Plus'], ['Assignment', 'Direct / user level'], ['Renewal', 'Monthly']]);
        } else if (s.scenario === 'resetuser') {
          const account = m.selected && s.users.find(u => u.id === m.selected), sec = box('Authentication profile', 'shield');
          if (account) { el('b', '', sec, account.name); el('p', '', sec, account.email); }
          else el('p', '', sec, 'Select an account to inspect its credential actions.');
          readonly(sec, [['Source', 'Northstar Directory'], ['MFA policy', 'Required for members'], ['Recovery channel', 'Organization managed'], ['Audit retention', '365 days']]);
        } else if (s.scenario === 'tickets') {
          const sec = box('Assignment groups', 'ticket');
          for (const queue of s.options.queue) {
            const count = Object.values(m.queues).filter(q => q === queue).length;
            const row = el('div', 'aa-activity', sec); const item = el('div', 'aa-grow', row, queue); el('small', '', item, 'IT operations / accepting work'); el('span', 'aa-tag', row, String(count));
          }
          const sla = box('Workset service levels', 'clock'); status(sla, `${s.tickets.filter(t => t.priority === 'Urgent').length} urgent tickets`, 'warn');
          el('p', '', sla, 'Priority is inherited from the requester. Routing does not change due dates.');
        } else {
          const sec = box('Quota policy', 'shield'); readonly(sec, [['Scope', 'Production subscription'], ['Provider', 'Northstar.Compute'], ['Enforcement', 'Regional'], ['Owner', 'Infrastructure team']]);
          const meter = el('div', 'aa-meter', sec); el('i', '', meter).style.width = `${Math.min(100, s.usage / Number(m.savedLimit) * 100)}%`;
          el('p', '', sec, `${s.usage} in use / ${m.savedLimit} saved limit`);
        }
        const projects = box('Other projects', 'folder');
        for (const [name, detail] of [['Customer portal', 'Staging / 14 resources'], ['Data services', 'Production / 38 resources'], ['Internal tools', 'Development / 9 resources']]) {
          const row = el('div', 'aa-activity', projects); icon(row, 'folder'); const text = el('div', '', row, name); el('small', '', text, detail);
        }
        history(box('Recent activity', 'clock'), [['Policy evaluation completed', 'Production baseline / no changes'], ['Backup schedule verified', 'shared-infrastructure / 18 min ago'], ['Directory sync', 'northstar.example / 24 min ago']]);
      }
      function modal(m) {
        if (!m.open && !m.editing && !m.dialog && !ui.preview) return;
        const overlay = el('div', 'aa-overlay', shell), dialog = el('div', 'aa-dialog', overlay);
        dialog.setAttribute('role', 'dialog'); dialog.setAttribute('aria-modal', 'true');
        const head = el('div', 'aa-dialog-head', dialog); icon(head, m.dialog ? 'shield' : m.editing ? 'users' : ui.preview ? 'document' : 'settings');
        const title = el('h3', 'aa-grow', head);
        const close = button(head, '', null, null, 'icon ghost', 'close'); close.setAttribute('aria-label', 'Close dialog');
        close.addEventListener('click', () => { if (ui.preview) { ui.preview = null; draw(ctx.model); } else if (m.open) act({ pick: m.open }); else act({ nav: 'cancel' }); });
        const body = el('div', 'aa-dialog-body', dialog);
        if (ui.preview) {
          title.textContent = ui.preview;
          if (ui.preview === 'Notifications') history(body, [['Maintenance window announced', 'Private gateway updates / next scheduled maintenance'], ['Monthly usage report is ready', 'Production subscription / billing centre'], ['Access review due', 'Operations pilot / policy AP-17']]);
          else if (ui.preview === 'Organization & projects') miniTable(body, ['Project', 'Environment', 'Status'], [['Infrastructure', 'Production', 'Active'], ['Customer portal', 'Staging', 'Active'], ['Data services', 'Production', 'Active'], ['Internal tools', 'Development', 'Active']]);
          else if (ui.preview === 'Groups' || ui.preview === 'Access reviews') {
            el('p', '', body, 'Inherited membership / organization managed. Individual role edits do not change these groups.');
            miniTable(body, ['Group', 'Membership', 'Review'], [['Infrastructure operators', 'Assigned / 16 members', 'Current'], ['All employees', 'Dynamic / 128 members', 'Current'], ['Finance approvers', 'Assigned / 9 members', 'Due in 12 days']]);
          } else if (ui.preview === 'Licences') {
            el('p', '', body, 'Subscription inventory / Production billing account');
            miniTable(body, ['Product', 'Allocated here', 'Purchased'], ['Workspace Basic', 'Workspace Plus'].map(name => [name, String(Object.values(m.access).filter(a => a.licence === name).length), '40 seats']));
          } else if (ui.preview === 'Authentication methods') {
            banner(body, 'Registration policy', 'Members must register a verified method. Password and MFA resets are managed from Accounts.');
            miniTable(body, ['Method', 'Policy', 'Registration'], [['Authenticator app', 'Enabled', 'Organization managed'], ['Security key', 'Enabled', 'Optional'], ['SMS recovery', 'Restricted', 'Recovery only']]);
          } else if (ui.preview === 'Sign-in activity') {
            miniTable(body, ['Application', 'Authentication', 'Result'], [['Admin console', 'MFA / managed device', 'Success'], ['Workspace web', 'Password + authenticator', 'Success'], ['Legacy mail client', 'Basic authentication', 'Blocked by policy']]);
          } else if (ui.preview === 'Queue overview') {
            miniTable(body, ['Assignment group', 'Tickets in workset', 'Availability'], s.options.queue.map(q => [q, String(Object.values(m.queues).filter(x => x === q).length), 'Accepting work']));
          } else if (ui.preview === 'Resolved') {
            el('p', '', body, 'Closed incidents / read only / outside the open ticket workset');
            miniTable(body, ['Number', 'Short description', 'Resolution'], [['HD-2681', 'Provision replacement headset', 'Hardware replaced'], ['HD-2687', 'Guest access expired', 'Account updated'], ['HD-2692', 'Invoice copy requested', 'Information provided']]);
          } else if (ui.preview === 'Knowledge') {
            history(body, [['Account recovery checklist', 'Identity desk / runbook KB-104'], ['Private network diagnostics', 'Network operations / runbook KB-217'], ['Standard incident categories', 'IT operations / classification guide']]);
          } else if (ui.preview === 'Monitoring' || ui.preview === 'Usage trends') {
            status(body, 'Telemetry connected');
            miniTable(body, ['Metric', 'Current', 'Observation'], ui.preview === 'Monitoring'
              ? [['CPU utilization', '2.4%', 'Within baseline'], ['Memory available', '78%', 'Within baseline'], ['Disk latency', '1.8 ms', 'Within baseline']]
              : [['Allocated resources', String(s.usage), 'Current subscription usage'], ['Regional capacity', 'Available', 'On-demand allocation'], ['Throttled requests', '0', 'Last reporting window']]);
          } else if (ui.preview === 'Tags') {
            miniTable(body, ['Key', 'Value', 'Source'], [['environment', m.values.tag, 'Resource'], ['organization', 'northstar', 'Inherited'], ['cost-centre', 'IT-204', 'Inherited']]);
          } else if (ui.preview === 'View filters' || ui.preview === 'Saved views') {
            banner(body, 'Managed workspace view', 'This view is scoped to the current workset. Organization-wide records are available in their own project contexts.');
            miniTable(body, ['Filter', 'Value', 'Source'], [['Project', 'IT operations / Production', 'Saved view'], ['Directory', 'northstar.example', 'Organization'], ['Scope', s.scenario === 'tickets' ? 'Open incidents' : 'Operations pilot', 'Workspace']]);
          } else if (ui.preview === 'Export options') {
            el('p', '', body, 'Export preview / current workspace / comma-separated values');
            readonly(body, [['Scope', s.scenario === 'tickets' ? `${s.tickets.length} open tickets` : `${s.users.length} member accounts`], ['Format', 'CSV / UTF-8'], ['Sensitive data', 'Credentials excluded'], ['Audit policy', 'Export activity is logged']]);
          }
          else if (ui.preview === 'Search results') {
            el('p', '', body, `Results for "${ui.search || 'resources'}" in Production`);
            for (const name of ['gateway-prod-01', 'shared-infrastructure', 'metrics-collector', 'backup-vault-prod'].filter(x => !ui.search || x.includes(ui.search.toLowerCase()))) {
              const row = el('div', 'aa-preview-row', body, name); el('small', '', row, 'Related inventory / managed by Infrastructure');
            }
            if (ui.search && !['gateway-prod-01', 'shared-infrastructure', 'metrics-collector', 'backup-vault-prod'].some(x => x.includes(ui.search.toLowerCase()))) banner(body, 'No matching resources', 'Try a resource name or resource group. The current task remains in its service workspace.');
          } else {
            el('p', '', body, `${ui.preview} / Production subscription / read-only overview`);
            history(body, [['Configuration is organization managed', 'Owner: Infrastructure team / Production baseline'], ['Last administrative operation', 'Status: Completed / audit retained for 365 days']]);
            miniTable(body, ['Resource', 'Scope', 'Status'], [['gateway-prod-01', 'shared-infrastructure', 'Available'], ['metrics-collector', 'observability', 'Healthy'], ['backup-vault-prod', 'storage', 'Protected']]);
          }
          const b = button(actions(dialog), 'Close', null, null); b.addEventListener('click', () => { ui.preview = null; draw(ctx.model); });
        } else if (m.open) {
          const id = m.open, field = s.fields.find(x => x.id === id);
          title.textContent = id.startsWith('queue:') ? `Assignment group / ${id.slice(6)}` : field?.label || ({ licence: 'Product licence', role: 'Directory role', action: 'Security action' })[id];
          el('p', '', body, id.startsWith('queue:') ? 'Active groups in IT operations. Changes are recorded in the ticket history.' : field?.hint || 'This assignment applies to the current user only.');
          const current = field ? m.values[id] : id.startsWith('queue:') ? m.queues[id.slice(6)] : id === 'action' ? m.action : m.draftAccess[id];
          const options = s.options[id.startsWith('queue:') ? 'queue' : id];
          for (const value of options) {
            const b = button(body, '', { option: [id, value] }, { set: [id, value] }, `aa-option${current === value ? ' selected' : ''}`);
            const text = el('span', 'aa-grow', b, value);
            const description = id === 'role' ? ({ Reader: 'Read configuration and activity. No changes allowed.', Operator: 'Manage assigned resources. Cannot grant access.', Administrator: 'Manage resources and directory access.' })[value]
              : id === 'licence' ? ({ None: 'No paid productivity services', 'Workspace Basic': 'Email and web applications', 'Workspace Plus': 'Collaboration, desktop apps and advanced security' })[value]
                : id.startsWith('queue:') ? 'Active / accepts new incidents' : id === 'disk' ? 'Encrypted SSD / platform-managed keys' : id === 'image' ? 'Verified publisher / x86_64 / Gen 2' : id === 'network' ? 'Private subnet / baseline firewall policy' : '';
            if (description) el('small', '', text, description); if (current === value) icon(b, 'check');
          }
        } else if (m.editing) {
          title.textContent = 'Manage access'; const u = s.users.find(x => x.id === m.editing); user(body, u);
          banner(body, 'Direct assignment', 'Group-based access and inherited policies remain unchanged.');
          el('label', 'aa-label', body, 'Directory role'); picker(body, 'role', m.draftAccess.role);
          el('label', 'aa-label', body, 'Product licence'); picker(body, 'licence', m.draftAccess.licence);
          el('p', '', body, 'Role and licence updates may take a few minutes to propagate to connected services.');
          const bar = actions(dialog); button(bar, 'Cancel', { nav: 'cancel' }, { nav: 'cancel' }); button(bar, 'Save changes', { nav: 'saveAccess' }, { nav: 'saveAccess' }, 'primary');
        } else {
          title.textContent = `${m.action}?`; const u = s.users.find(x => x.id === m.selected); user(body, u);
          el('p', 'aa-mono', body, `Object ID: ${u.id} / Source: Northstar Directory`);
          banner(body, 'This action cannot be undone', m.action === 'Reset MFA' ? 'Registered authentication methods will be removed. This user must register new methods at the next sign-in.' : 'The current password will stop working. A temporary credential will be issued through the secure recovery channel.', true);
          readonly(body, [['Email notification', m.notify ? 'Yes' : 'No'], ['Audit logging', 'Required / 365-day retention'], ['Requested action', m.action]]);
          const bar = actions(dialog); button(bar, 'Cancel', { nav: 'cancel' }, { nav: 'cancel' }); button(bar, m.action, { nav: 'confirm' }, { nav: 'confirm' }, 'danger');
        }
        dialog.setAttribute('aria-label', title.textContent);
        dialog.addEventListener('scroll', () => { if (!drawing && dialog.isConnected) mirrorClipped(); });
      }
      function mirrorClipped() {
        if (!main || !main.isConnected) return;
        const dialog = shell.querySelector('.aa-dialog'), clipped = {};
        for (const [id, node] of Object.entries(targets)) {
          const pane = dialog?.contains(node) ? dialog : main.contains(node) ? main : null;
          if (!pane || node === main) continue;
          const r = pane.getBoundingClientRect(), box = node.getBoundingClientRect(), y = box.top + box.height / 2;
          const sticky = pane === main ? (main.querySelector('thead')?.offsetHeight || 0) : 0;
          if (box.top < r.top + sticky + 3 || box.bottom > r.bottom - 3) clipped[id] = Math.round(y - (r.top + sticky + r.bottom) / 2);
        }
        if (JSON.stringify(ctx.model.clipped || {}) !== JSON.stringify(clipped)) ctx.update({ ...ctx.model, clipped });
      }
      function draw(m) {
        drawing = true; shell.replaceChildren(); targets = {}; topbar();
        const frame = el('div', 'aa-frame', shell); sidebar(frame); workspace = el('div', 'aa-workspace', frame);
        const head = el('header', 'aa-header', workspace), crumbs = el('div', 'aa-breadcrumbs', head);
        ['Northstar', s.scenario === 'tickets' ? 'IT operations' : 'Production', 'Administration'].forEach((label, i) => { if (i) icon(crumbs, 'chevron'); el('span', '', crumbs, label); });
        const titles = { vm: 'Virtual machines', iam: 'Users & access', resetuser: 'User security', tickets: 'Helpdesk tickets', quota: 'Limits & quotas' };
        const glyphs = { vm: 'compute', iam: 'users', resetuser: 'shield', tickets: 'ticket', quota: 'quota' };
        const row = el('div', 'aa-heading-row', head); icon(row, glyphs[s.scenario]); el('h2', '', row, titles[s.scenario]);
        const chip = el('span', 'aa-chip', row, s.scenario === 'vm' ? 'Production' : s.scenario === 'tickets' ? 'Open workset' : 'Standard policy');
        if (s.scenario === 'resetuser') icon(chip, 'lock');
        el('span', 'aa-grow', row); if (!tiny) preview(row, '', 'more', 'Page actions', 'ghost icon');
        el('div', 'aa-sub', head, ui.refreshed ? 'Resource status refreshed / connected to Northstar Directory' : s.scenario === 'vm' ? 'Compute resources / shared-infrastructure' : s.scenario === 'quota' ? 'Service usage and subscription limits' : s.scenario === 'tickets' ? 'Incidents assigned to the IT operations workspace' : 'Operations pilot / northstar.example / Member accounts');
        const tabs = el('div', 'aa-tabs', workspace);
        const tabNames = s.scenario === 'vm' ? ['Configuration', 'Monitoring', 'Activity log', 'Tags'] : s.scenario === 'iam' ? ['All users', 'Groups', 'Licences', 'Access reviews']
          : s.scenario === 'resetuser' ? ['Accounts', 'Authentication methods', 'Sign-in activity'] : s.scenario === 'tickets' ? ['Open tickets', 'Queue overview', 'Resolved', 'Knowledge'] : ['Configuration', 'Usage trends', 'Change history'];
        tabNames.forEach((name, i) => {
          const b = i ? preview(tabs, name, null, name, 'aa-tab') : button(tabs, name, null, null, 'aa-tab on');
          if (i === 0) b.setAttribute('aria-current', 'page');
        });
        const tools = el('div', 'aa-toolbar', workspace);
        preview(tools, s.scenario === 'tickets' ? 'Open incidents' : s.scenario === 'vm' ? 'shared-infrastructure' : s.scenario === 'quota' ? 'Production' : 'Operations pilot', 'folder', 'Saved views');
        preview(tools, 'Filter', 'filter', 'View filters');
        const refresh = button(tools, '', null, null, 'icon', 'refresh'); refresh.setAttribute('aria-label', 'Refresh status'); refresh.title = 'Refresh status';
        refresh.addEventListener('click', () => { ui.refreshed = true; ui.scroll = main.scrollTop; draw(ctx.model); });
        const scope = el('span', 'aa-scope aa-grow', tools); if (!compact) { icon(scope, 'lock'); el('span', '', scope, 'Organization managed'); }
        if (!tiny) preview(tools, 'Export', 'export', 'Export options', 'aa-toolbar-extra');
        const contentRow = el('div', 'aa-content-row', workspace); main = put({ pane: true }, el('div', `aa-main${['iam', 'resetuser', 'tickets'].includes(s.scenario) ? ' table' : ''}`, contentRow));
        main.addEventListener('scroll', () => { if (!drawing && main.isConnected) { ui.scroll = main.scrollTop; mirrorClipped(); } });
        if (s.judge?.mode === 'ambiguous' && !['iam', 'resetuser'].includes(s.scenario)) {
          el('h3', '', main, 'Account context'); banner(main, 'Multiple accounts match this name', 'Resource ownership uses the account email. No resource changes have been made.');
          for (const u of s.users.slice(0, 2)) { const card = section(main, u.id, 'users'); user(card, u); el('p', 'aa-sub', card, `${u.team} / Member / Directory synced`); }
        } else if (s.scenario === 'vm') vm(m); else if (['iam', 'resetuser'].includes(s.scenario)) directory(m); else if (s.scenario === 'tickets') tickets(m); else quota(m);
        if (withContext) context(contentRow, m);
        if (m.notice) { const notice = el('div', `aa-notice${m.notice.startsWith('Enter') ? ' error' : ''}`, workspace); notice.setAttribute('role', 'status'); icon(notice, m.notice.startsWith('Enter') ? 'warning' : 'check'); el('span', '', notice, m.notice); }
        const foot = el('div', 'aa-facts', workspace); icon(foot, 'shield');
        for (const fact of f.facts(m, s)) { const item = el('span', '', foot); el('b', '', item, `${fact.label}: `); el('span', fact.label.includes('reference') || fact.label === 'Resource ID' ? 'aa-mono' : '', item, fact.value); }
        main.scrollTop = ui.scroll; modal(ctx.model); drawing = false; mirrorClipped();
      }
      draw(ctx.model);
      view = { locate(target) {
        const node = target.pane ? (shell.querySelector('.aa-dialog') || main) : targets[key(target)];
        if (!node) throw new Error(`use-admin-console/classic missing target ${key(target)}`);
        const box = node.getBoundingClientRect();
        if (target.pane) return [box.left + Math.min(35, box.width / 2), box.top + box.height / 2];
        return [box.left + box.width / 2, box.top + box.height / 2];
      } };
      return { anchors: [shell], sync: draw };
    },
    locate(target) { return view.locate(target); },
  });
})();
