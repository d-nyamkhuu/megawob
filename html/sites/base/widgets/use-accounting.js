/* base / use-accounting / classic: Folio accounting workspace.
 * Bank-feed matching, voucher posting, receipt transcription and policy-based
 * invoice routing. Stable outer anchor; all long content scrolls inside the card.
 * Controlled text inputs, local DOM account/category/project pickers, captured
 * pointer drags and env.ui.scrollPane (wheel + draggable custom scrollbar).
 * Product shell: grouped navigation, search/notifications, account/period context,
 * attachment viewers, posted-history distractors, validation and an audit rail.
 * Decorative records use a separate seeded content fork; scored data is unchanged.
 */
(function () {
  'use strict';
  let current;
  const CSS = `
  .af-app{position:absolute;inset:10px;display:flex;flex-direction:column;min-width:0;min-height:0;background:var(--panel);color:var(--fg);border:1px solid var(--line);border-radius:9px;overflow:hidden;font:12px/1.4 system-ui,sans-serif;box-shadow:0 8px 25px #0000000b}
  .af-app *{box-sizing:border-box}.af-app button,.af-app input{font:inherit;color:inherit}.af-top{height:36px;flex:none;display:flex;gap:10px;align-items:center;padding:0 14px;border-bottom:1px solid var(--line);background:var(--bg)}
  .af-logo{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:5px;background:var(--accent);color:white;font-weight:800}.af-brand{font-weight:750;font-size:14px}.af-sp{flex:1;min-width:0}.af-muted{color:var(--muted)}.af-company{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:50%}
  .af-nav{height:30px;flex:none;display:flex;gap:17px;align-items:center;padding:0 14px;border-bottom:1px solid var(--line);font-size:11px;color:var(--muted)}.af-nav .on{color:var(--accent);font-weight:700;height:30px;display:flex;align-items:center;border-bottom:2px solid var(--accent)}
  .af-heading{flex:none;display:flex;gap:8px;align-items:center;padding:10px 14px 8px;min-height:52px}.af-heading h2{font-size:17px;line-height:1.2;margin:0}.af-sub{color:var(--muted);font-size:10px;margin-top:3px}.af-badge{display:inline-block;padding:3px 7px;border:1px solid var(--line);border-radius:10px;color:var(--muted);font-size:10px;white-space:nowrap;background:var(--bg)}
  .af-btn{border:1px solid var(--line);border-radius:5px;padding:5px 8px;min-height:28px;background:var(--panel);cursor:pointer;text-align:left}.af-btn:hover{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 7%,var(--panel))}.af-btn:focus-visible,.af-input:focus{outline:2px solid var(--accent);outline-offset:1px}.af-btn.primary{background:var(--accent);color:white;border-color:var(--accent);font-weight:650}.af-btn:disabled{opacity:.45;cursor:default}.af-btn.quiet{border-color:transparent;background:transparent;color:var(--muted)}
  .af-metrics{flex:none;display:flex;gap:16px;padding:6px 14px 9px;border-bottom:1px solid var(--line);font-size:11px;flex-wrap:wrap}.af-metric{min-width:0;display:flex;gap:6px;align-items:baseline}.af-metric b{font-variant-numeric:tabular-nums;font-size:12px;font-weight:650}
  .af-work{display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.65fr);flex:1;min-height:0;min-width:0}.af-work.reconcile{grid-template-columns:1fr 1fr}.af-column{display:flex;flex-direction:column;min-width:0;min-height:0;position:relative}.af-column+.af-column{border-left:1px solid var(--line)}.af-colhead{height:31px;flex:none;display:flex;align-items:center;justify-content:space-between;padding:0 11px;background:var(--bg);border-bottom:1px solid var(--line);font-size:11px;font-weight:650}.af-colhead small{font-weight:400;color:var(--muted)}
  .af-scrollbox{flex:1;position:relative;min-height:0;min-width:0}.af-pane{position:absolute;inset:0 10px 0 0;overflow:hidden;overscroll-behavior:contain}.af-content{min-height:100%;padding:10px}.af-track{position:absolute;right:0;top:3px;bottom:3px;width:9px;background:var(--bg);border-left:1px solid var(--line)}.af-thumb{position:absolute;left:1px;right:1px;min-height:20px;border-radius:5px;background:color-mix(in srgb,var(--muted) 58%,var(--panel));cursor:grab}
  .af-row{height:76px;position:relative;border:1px solid var(--line);border-radius:5px;background:var(--panel);margin-bottom:7px;padding:7px 9px;font-size:11px}.af-row.bank{cursor:grab;touch-action:none}.af-row.bank.dragging{opacity:.8;z-index:80;box-shadow:0 8px 20px #0003;pointer-events:none}.af-row.matched{border-left:3px solid var(--accent);background:color-mix(in srgb,var(--accent) 5%,var(--panel))}.af-row.over{outline:2px dashed var(--accent)}.af-row-title{display:flex;align-items:center;gap:7px}.af-payee{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:650}.af-id{font-family:ui-monospace,monospace;font-size:10px;color:var(--muted)}.af-line{display:flex;gap:8px;justify-content:space-between;margin-top:4px;font-variant-numeric:tabular-nums}.af-match{font-size:10px;color:var(--accent);margin-top:3px}.af-unlink{float:right;border:0;background:none;color:var(--accent);cursor:pointer;padding:0 3px;font-size:11px}.af-unlink[hidden]{display:none}
  .af-paper{background:var(--bg);border:1px solid var(--line);padding:12px 11px;border-radius:3px;font-size:11px}.af-paper h3{font-size:13px;margin:0 0 7px}.af-paper .af-id{display:block;margin-bottom:8px}.af-paper p{margin:7px 0;overflow-wrap:anywhere}.af-paper hr{border:0;border-top:1px dashed var(--line);margin:10px 0}.af-paper-line{border-bottom:1px dashed var(--line);padding:7px 0}.af-paper-line strong{display:block;font-size:11px}.af-paper-line .af-line{font-size:10px}.af-note{padding:9px;border-left:2px solid var(--accent);background:var(--bg);margin-top:10px;color:var(--muted);font-size:10px;overflow-wrap:anywhere}.af-warning{color:var(--fg);font-weight:600;border:1px solid var(--line);border-left:3px solid #cf8d29;background:color-mix(in srgb,#cf8d29 9%,var(--panel));padding:8px;font-size:10px;margin-bottom:9px}
  .af-label{font-size:10px;color:var(--muted);display:block;margin-bottom:4px}.af-input{width:100%;min-width:0;border:1px solid var(--line);border-radius:4px;height:30px;background:var(--panel);padding:5px 6px;user-select:text;-webkit-user-select:text}.af-input.money{text-align:right;font-variant-numeric:tabular-nums}.af-picker{width:100%;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;height:30px;padding:5px 7px;font-size:11px!important}.af-fields{display:grid;grid-template-columns:1fr 1fr;gap:10px}.af-field{min-width:0}.af-field.wide{grid-column:1/-1}.af-entryhead,.af-entry{display:grid;grid-template-columns:minmax(0,1.8fr) minmax(0,1fr) minmax(0,1fr);gap:6px;align-items:center}.af-entryhead{color:var(--muted);font-size:10px;padding:4px 0 7px}.af-entry{height:48px;border-bottom:1px solid var(--line)}.af-entry .af-picker{font-size:10px!important}.af-entry .af-input{font-size:11px}.af-entrytotal{display:flex;justify-content:space-between;gap:10px;font-size:11px;padding:10px 0}.af-memo{margin-top:10px}
  .af-receipts{display:flex;gap:4px;padding:7px 10px;border-bottom:1px solid var(--line);flex:none;flex-wrap:wrap}.af-receipts .af-btn{padding:3px 7px;font-size:10px;min-height:24px}.af-btn.selected{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,var(--panel));color:var(--accent)}.af-recordtitle{font-weight:650;font-size:13px;margin-bottom:11px}.af-invoice{display:block;width:100%;margin-bottom:6px;font-size:10px;text-align:left;white-space:normal;overflow-wrap:anywhere}.af-invoice b{display:block;font-size:11px}.af-invoice .af-line{font-size:10px}.af-policy{padding:10px;margin-top:10px;border:1px solid var(--line);border-radius:5px;background:var(--bg);font-size:11px}.af-policy h3{font-size:12px;margin:0 0 6px}.af-policy ol{padding-left:17px;margin:5px 0}.af-policy li{margin-bottom:6px}.af-person{display:flex;align-items:center;gap:9px;padding:9px 0;border-bottom:1px solid var(--line);min-height:53px}.af-avatar{display:grid;place-items:center;width:29px;height:29px;border-radius:50%;background:color-mix(in srgb,var(--accent) 12%,var(--panel));color:var(--accent);font-size:10px;font-weight:700;flex:none}.af-person-name{font-weight:600;font-size:11px}.af-person small{font-size:10px;color:var(--muted)}.af-person .af-btn{font-size:10px}.af-route{font-size:11px;min-height:26px;padding:8px 10px;display:flex;align-items:center;gap:5px;flex-wrap:wrap;border-bottom:1px solid var(--line)}.af-routechip{display:inline-flex;align-items:center;gap:4px;border:1px solid var(--line);border-radius:4px;padding:3px 5px;font-size:10px;background:var(--bg)}.af-routechip button{border:0;background:none;cursor:pointer;padding:0 2px;color:var(--muted)}
  .af-footer{flex:none;min-height:43px;border-top:1px solid var(--line);display:flex;align-items:center;gap:8px;padding:7px 11px;background:var(--bg)}.af-notice{font-size:10px;color:var(--muted);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.af-footer .primary{flex:none;font-size:11px}.af-popup{position:absolute;z-index:100;background:var(--panel);border:1px solid var(--line);box-shadow:0 8px 24px #0003;padding:5px;border-radius:6px;display:grid;grid-template-columns:1fr;max-width:calc(100% - 16px)}.af-popup[hidden]{display:none}.af-option{border:0;border-radius:3px;background:var(--panel);color:var(--fg);padding:7px 8px;text-align:left;white-space:nowrap;font-size:11px!important;cursor:pointer}.af-option:hover{background:color-mix(in srgb,var(--accent) 12%,var(--panel))}.af-option:disabled{opacity:.45;cursor:default}
  .af-app.compact{font-size:11px}.af-app.compact .af-heading{padding:7px 10px;min-height:44px}.af-app.compact .af-heading h2{font-size:15px}.af-app.compact .af-nav{gap:10px;padding:0 10px}.af-app.compact .af-metrics{gap:8px;padding:5px 10px}.af-app.compact .af-content{padding:8px}.af-app.compact .af-work:not(.reconcile){grid-template-columns:minmax(0,.9fr) minmax(0,1.4fr)}.af-app.compact .af-top{padding:0 10px}.af-app.compact .af-entryhead,.af-app.compact .af-entry{grid-template-columns:minmax(0,1.6fr) minmax(0,1fr) minmax(0,1fr);gap:4px}
  .af-svg{width:15px;height:15px;flex:none;vertical-align:middle;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}.af-shell{display:flex;flex:1;min-width:0;min-height:0}.af-main{display:flex;flex:1;flex-direction:column;min-width:0;min-height:0}.af-sidebar{width:142px;flex:none;display:flex;flex-direction:column;border-right:1px solid var(--line);background:color-mix(in srgb,var(--bg) 75%,var(--panel));padding:10px 7px;overflow:auto;font-size:11px}.af-sidegroup{font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin:11px 8px 5px}.af-sideitem{display:flex;gap:8px;align-items:center;min-height:31px;border:0;background:transparent;color:var(--fg);width:100%;border-radius:5px;text-align:left;padding:5px 8px;font:inherit;cursor:pointer}.af-sideitem.active{color:var(--accent);background:color-mix(in srgb,var(--accent) 12%,var(--panel));font-weight:650}.af-sideitem:hover{background:color-mix(in srgb,var(--accent) 7%,var(--panel))}.af-count{margin-left:auto;font-size:9px;color:var(--muted);padding:1px 4px;border-radius:3px;background:var(--panel)}.af-sidefoot{margin-top:auto;border-top:1px solid var(--line);padding:11px 7px 0;color:var(--muted);font-size:10px}.af-closeprogress{height:3px;margin:8px 0;background:var(--line)}.af-closeprogress:before{content:'';display:block;width:68%;height:100%;background:var(--accent)}
  .af-top{height:40px}.af-top .af-company{max-width:26%;font-size:11px}.af-topcontrol{display:inline-flex;align-items:center;justify-content:center;gap:7px;position:relative;border:0;background:transparent;color:var(--muted);border-radius:4px;min-height:27px;cursor:pointer;padding:4px 7px;font-size:11px!important}.af-topcontrol:hover{background:var(--panel);color:var(--fg)}.af-global-search{margin-left:24px;border:1px solid var(--line);background:var(--panel);width:210px;justify-content:flex-start}.af-keycap{font-size:9px;border:1px solid var(--line);border-radius:3px;padding:1px 4px;margin-left:auto}.af-dot{width:5px;height:5px;background:var(--accent);position:absolute;right:5px;top:3px;border-radius:50%}.af-user{background:color-mix(in srgb,var(--accent) 12%,var(--panel));border-radius:50%;width:27px;height:27px;font-size:10px!important;color:var(--accent)}
  .af-nav{height:29px;font-size:10px;background:var(--panel)}.af-nav .on{height:29px}.af-heading{padding:10px 13px 6px;min-height:50px}.af-heading h2{font-size:18px;letter-spacing:-.02em}.af-metrics{background:var(--bg);gap:20px;padding:8px 13px}.af-metric{display:block;border-left:2px solid var(--line);padding-left:8px}.af-metric span{display:block;font-size:9px;text-transform:uppercase;letter-spacing:.03em}.af-metric b{font-size:15px;line-height:1.4}.af-toolbar{height:33px;flex:none;display:flex;align-items:center;gap:6px;padding:3px 9px;border-bottom:1px solid var(--line);background:var(--panel);font-size:10px;overflow:hidden}.af-tool{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--line);border-radius:4px;background:var(--panel);height:25px;white-space:nowrap;padding:3px 7px;font-size:10px!important;color:var(--muted)!important}.af-tool svg{width:12px;height:12px}.af-toolbar .af-sp{min-width:4px}.af-badge{display:inline-flex;align-items:center;gap:4px;border-radius:4px;padding:3px 6px}.af-badge.saved{color:var(--accent);border-color:color-mix(in srgb,var(--accent) 35%,var(--line));background:color-mix(in srgb,var(--accent) 8%,var(--panel))}.af-badge.warning{color:var(--fg);border-color:#a87032;background:color-mix(in srgb,#a87032 10%,var(--panel))}
  .af-row{height:67px;border-radius:0;border-width:0 0 1px;margin-bottom:0;padding:7px 9px;background:var(--panel)}.af-content:has(>.af-row){padding:0}.af-row .af-id{font-size:9px}.af-row .af-match{font-size:9px}.af-row:nth-child(even){background:color-mix(in srgb,var(--bg) 45%,var(--panel))}.af-row.matched{border-left:3px solid var(--accent);background:color-mix(in srgb,var(--accent) 6%,var(--panel))}.af-row .af-line{margin-top:2px}.af-row .af-match{margin-top:2px}.af-colhead{height:29px;font-size:10px}.af-colhead small{font-size:9px}.af-paper{background:var(--panel);border-radius:1px;box-shadow:0 2px 5px #0000000b;padding:12px}.af-viewerbar{display:flex;align-items:center;gap:6px;padding:6px 8px;background:var(--bg);border:1px solid var(--line);font-size:9px;margin-bottom:9px;color:var(--muted)}.af-viewerbar svg{width:12px;height:12px}.af-documentbrand{display:flex;align-items:center;gap:7px;font-size:10px;color:var(--muted);border-bottom:1px solid var(--line);padding-bottom:8px;margin-bottom:10px}.af-documentbrand .af-svg{color:var(--accent)}.af-documentmeta{display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10px;border:1px solid var(--line);padding:8px;background:var(--bg);margin-bottom:10px}.af-documentmeta small{display:block;color:var(--muted);font-size:9px}.af-documentmeta strong{font-weight:550;overflow-wrap:anywhere}.af-entryhead,.af-entry{grid-template-columns:18px minmax(0,1.8fr) minmax(0,1fr) minmax(0,1fr);gap:6px}.af-entry{height:40px}.af-entry .af-id{font-size:9px}.af-app.compact .af-entryhead,.af-app.compact .af-entry{grid-template-columns:14px minmax(0,1.6fr) minmax(0,1fr) minmax(0,1fr)}.af-entrytotal{border-bottom:1px solid var(--line);font-weight:650;font-variant-numeric:tabular-nums}.af-linehelp{font-size:9px;color:var(--muted);padding:6px 0}.af-fields{gap:9px}.af-recordtitle{font-size:12px;margin-bottom:8px}.af-summarybox{border:1px solid var(--line);border-radius:4px;padding:10px;margin:12px 0 0;background:var(--bg);font-size:10px}.af-summarybox h4{font-size:10px;margin:0 0 8px;text-transform:uppercase;letter-spacing:.04em}.af-kv{display:flex;gap:10px;justify-content:space-between;padding:4px 0;border-bottom:1px solid color-mix(in srgb,var(--line) 50%,transparent);font-size:10px}.af-kv span{color:var(--muted)}.af-kv b{font-weight:550;text-align:right;font-variant-numeric:tabular-nums}.af-kv:last-child{border-bottom:0}.af-history{margin-top:16px;border-top:1px solid var(--line);font-size:10px}.af-history h4{font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin:9px 0}.af-historyrow{padding:7px 0;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:7px}.af-historyrow strong{display:block;font-size:10px;font-weight:550;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.af-historyrow small{font-size:9px;color:var(--muted)}.af-historyrow .af-badge{font-size:8px;padding:2px 4px}.af-invoice{border-radius:0;margin-bottom:0;border-width:0 0 1px;padding:8px;font-size:10px}.af-invoice b{display:flex;align-items:center;gap:5px}.af-invoice.selected{border-left:3px solid var(--accent)}.af-person{min-height:49px;padding:7px 0}.af-person-name{font-size:11px}.af-routechip button{display:flex;align-items:center}.af-routechip svg{width:11px;height:11px}.af-checklist{margin:10px 0 0;padding:0;list-style:none;font-size:10px;color:var(--muted)}.af-checklist li{display:flex;align-items:center;gap:5px;padding:4px 0}.af-checklist svg{width:12px;height:12px}.af-picker{display:flex;align-items:center;justify-content:space-between;gap:5px}.af-picker span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.af-picker .af-svg{width:12px;height:12px}.af-receipts .af-btn{display:flex;align-items:center;gap:4px}.af-receipts svg{width:11px;height:11px}.af-footer .af-svg{width:13px;height:13px}.af-footer .primary{display:flex;align-items:center;gap:6px}
  .af-inspector{display:flex;flex-direction:column;flex:none;width:212px;border-left:1px solid var(--line);background:color-mix(in srgb,var(--bg) 65%,var(--panel));min-height:0}.af-inspectorhead{padding:13px 12px 8px;font-size:11px;font-weight:650}.af-inspectorbody{overflow:auto;padding:0 12px 12px;min-height:0;flex:1}.af-inspector h4{font-size:9px;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);margin:16px 0 7px}.af-audit{display:flex;gap:8px;border-left:1px solid var(--line);margin:0 0 0 5px;padding:0 0 13px 10px;position:relative;font-size:10px}.af-audit:before{content:'';position:absolute;left:-4px;top:4px;width:7px;height:7px;background:var(--panel);border:1px solid var(--accent);border-radius:50%}.af-audit small{display:block;color:var(--muted);font-size:9px;margin-top:3px}.af-comment{padding:8px;border:1px solid var(--line);background:var(--panel);border-radius:4px;font-size:10px;margin-bottom:7px}.af-comment b{display:block;margin-bottom:4px}.af-projectline{font-size:10px;padding:7px 0;border-bottom:1px solid var(--line)}.af-projectline small{display:block;color:var(--muted);font-size:9px}.af-flyout{position:absolute;z-index:110;top:45px;right:9px;width:310px;max-width:calc(100% - 18px);max-height:calc(100% - 58px);overflow:auto;border:1px solid var(--line);border-radius:7px;background:var(--panel);box-shadow:0 10px 35px #0003;padding:13px}.af-flyout[hidden]{display:none}.af-flyouthead{display:flex;align-items:center;justify-content:space-between;font-size:13px;font-weight:650;margin-bottom:10px}.af-flyout .af-history{margin-top:8px}.af-flyout p{font-size:11px;color:var(--muted)}.af-searchresult{padding:9px 0;border-bottom:1px solid var(--line);font-size:11px}.af-searchresult small{display:block;color:var(--muted);font-size:10px}.af-sidebar.rail{width:42px;padding:7px 4px}.af-sidebar.rail .af-sideitem{padding:7px;min-height:32px}.af-sidebar.rail .af-sideitem span,.af-sidebar.rail .af-sidegroup,.af-sidebar.rail .af-sidefoot{display:none}.af-sidebar.narrow{width:116px}.af-sidebar.narrow .af-sideitem{gap:5px;font-size:10px;padding:5px}.af-sidebar.narrow .af-count{font-size:8px}.af-app.tight .af-global-search{width:130px;margin-left:0}.af-app.tight .af-keycap{display:none}.af-app.tight .af-top{gap:5px}.af-app.tight .af-heading h2{font-size:16px}.af-app.tight .af-metrics{gap:10px}.af-app.tight .af-metric b{font-size:13px}.af-app.tight .af-tool{padding:3px 5px}.af-app.tight .af-toolbar{gap:4px}.af-app.tight .af-nav{gap:12px}.af-app.tight .af-fields{column-gap:6px}.af-app.tight .af-documentmeta{padding:6px}.af-app.tight .af-paper{padding:9px}.af-app.tight .af-company{max-width:23%}.af-app.tight .af-toolbar .af-tool:last-child{display:none}
  .af-global-search{white-space:nowrap}.af-top .af-global-search span{flex:none}.af-sideitem>span:not(.af-count){flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.af-count{flex:none}.af-audit{display:block}.af-sidebar.narrow{width:132px}.af-app.tight .af-global-search{width:146px}
  `;
  env.widget({
    task: 'use-accounting', site: 'base', name: 'classic', split: 'train',
    scenarios: ['reconcile', 'journal', 'expense', 'approve'],
    render(ctx) {
      const { spec: s, util } = ctx, F = env.taskDef;
      ctx.css('app-finance-classic', CSS);
      const root = util.el('section', 'af-app' + (ctx.size.width < 760 || ctx.size.height < 460 ? ' compact' : '') + (ctx.size.width < 1150 ? ' tight' : ''), ctx.stage);
      root.setAttribute('aria-label', 'Folio accounting workspace');
      const refs = {}, panes = {}, fields = {}, pickers = {}, bankNodes = {}, ledgerNodes = {}, unlinkNodes = {}, people = {}, invoices = {}, receiptButtons = {};
      const keyOf = t => JSON.stringify(t);
      const register = (t, el) => { refs[keyOf(t)] = el; return el; };
      const el = (tag, cls, parent, text) => util.el(tag, cls, parent, text);
      const btn = (parent, text, action, cls = '') => { const b = el('button', 'af-btn ' + cls, parent, text); b.type = 'button'; if (action) b.addEventListener('click', action); return b; };
      const paths = {
        chevron: 'm8 10 4 4 4-4', search: 'M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
        bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4',
        home: 'm3 10 9-7 9 7v11h-7v-7h-4v7H3z', bank: 'm3 8 9-5 9 5z M5 10v8m7-8v8m7-8v8M3 21h18',
        book: 'M4 3h15v18H4z M8 3v18 M11 8h5m-5 4h5', receipt: 'M5 3l2 2 2-2 3 2 3-2 2 2 2-2v18l-3-2-3 2-3-2-3 2-2-2z M8 9h8m-8 4h6',
        invoice: 'M5 2h9l5 5v15H5z M14 2v6h5 M8 12h8m-8 4h6', chart: 'M3 3v18h18M7 16v-5m5 5V7m5 9V4',
        folder: 'M3 6h7l2 3h9v11H3z', settings: 'M4 6h16M4 12h16M4 18h16M8 3v6m8 0v6m-6 0v6',
        help: 'M9 8a3 3 0 0 1 6 0c0 2-3 2-3 5 M12 17h.01 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
        close: 'm6 6 12 12M6 18 18 6', check: 'm5 12 4 4L19 6', calendar: 'M4 5h16v16H4zM4 10h16M8 2v6m8-6v6',
        filter: 'M3 5h18l-7 8v6l-4 2v-8z', download: 'M12 3v12m-5-5 5 5 5-5 M4 17v4h16v-4',
        clip: 'm9 14 7-7a3 3 0 0 1 4 4L10 21a5 5 0 0 1-7-7L14 3',
        clock: 'M12 6v6l4 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
        lock: 'M5 10h14v12H5z M8 10V6a4 4 0 0 1 8 0v4', plus: 'M12 4v16M4 12h16',
      };
      function icon(parent, name) {
        const svg = util.svg('svg', { viewBox: '0 0 24 24', class: 'af-svg', 'aria-hidden': 'true' }, parent);
        util.svg('path', { d: paths[name] || paths.invoice }, svg); return svg;
      }
      function iconButton(parent, text, name, action, cls = '') {
        const b = btn(parent, '', action, cls); icon(b, name); if (text) el('span', '', b, text); b.setAttribute('aria-label', text || name); b.title = text || name; return b;
      }
      const cr = ctx.rng.fork('finance-workspace'), cs = { csplit: s.csplit };
      const background = Array.from({ length: 7 }, (_, i) => ({ company: env.content.pick(cr, env.content.COMPANIES, cs), amount: cr.int(65, 4200) * 100 + cr.int(0, 99), ref: 'AP-' + (4820 + i), date: '2026-08-' + (21 + i) }));
      let paint, editorActive = -1, menuSignature = '', memo, footerNotice, statusBadge, metrics, entryTotal, routeBox, invoiceDetail, validation, auditState;
      let receiptSummary = [];
      let flyout;
      const kv = (parent, label, value) => { const row = el('div', 'af-kv', parent); el('span', '', row, label); el('b', '', row, value); return row; };
      function history(parent, title, records = background.slice(0, 4)) {
        const section = el('div', 'af-history', parent); el('h4', '', section, title);
        const status = /voucher/i.test(title) ? 'Posted' : /report/i.test(title) ? 'Filed' : /reconciled/i.test(title) ? 'Reconciled' : 'Paid';
        for (const r of records) { const row = el('div', 'af-historyrow', section); icon(row, 'invoice'); const text = el('div', 'af-sp', row); el('strong', '', text, r.company); el('small', '', text, r.ref.replace('AP-', status === 'Posted' ? 'JV-' : status === 'Filed' ? 'EXP-' : 'AP-') + ' / ' + r.date); el('span', 'af-badge', row, status); }
        return section;
      }
      function showPanel(title, build) {
        flyout.replaceChildren(); flyout.hidden = false; flyout.setAttribute('aria-label', title);
        const head = el('div', 'af-flyouthead', flyout, title);
        iconButton(head, '', 'close', () => { flyout.hidden = true; }, 'quiet'); build(flyout);
      }
      const preview = title => showPanel(title, panel => { el('p', '', panel, 'Workspace overview / September 2026'); history(panel, 'Recently completed'); });
      const change = action => { ctx.update(F.helpers.apply(ctx.model, s, action)); paint(ctx.model); };
      const top = el('div', 'af-top', root); el('span', 'af-logo', top, 'F'); el('span', 'af-brand', top, 'Folio');
      const search = iconButton(top, 'Search workspace', 'search', () => showPanel('Search workspace', panel => {
        const input = el('input', 'af-input', panel); input.type = 'search'; input.placeholder = 'Vendors, projects, documents'; input.setAttribute('aria-label', 'Search vendors, projects, documents');
        const results = el('div', '', panel);
        const render = () => { results.replaceChildren(); const data = [...background.map(r => [r.company, r.ref + ' / Paid bill']), ...s.projects.map((p, i) => [p, ['Website refresh', 'Client delivery', 'Office relocation'][i]])].filter(r => r.join(' ').toLowerCase().includes(input.value.toLowerCase()));
          for (const [name, detail] of data) { const row = el('div', 'af-searchresult', results, name); el('small', '', row, detail); } if (!data.length) el('p', '', results, 'No matching records. Try a vendor name or project code.'); };
        input.addEventListener('input', render); render(); input.focus();
      }), 'af-topcontrol af-global-search'); el('span', 'af-keycap', search, 'Search');
      el('span', 'af-sp', top); el('span', 'af-company', top, s.company);
      iconButton(top, '', 'help', () => showPanel('Accounting help', panel => { el('p', '', panel, 'Your accounting period is September 2026. Documents and activity are retained with every saved record.'); }), 'af-topcontrol');
      const bell = iconButton(top, '', 'bell', () => showPanel('Notifications', panel => { for (const [title, detail] of [['Bank feed updated', 'Operating account ending 1042 / 08:42'], ['Month-end review', 'September close checklist is due Friday'], ['New vendor document', background[0].company + ' uploaded a statement']]) { const row = el('div', 'af-searchresult', panel, title); el('small', '', row, detail); } }), 'af-topcontrol'); el('span', 'af-dot', bell);
      btn(top, s.staff[0].name.split(' ').map(n => n[0]).slice(0, 2).join(''), () => showPanel('Your account', panel => { el('p', '', panel, s.staff[0].name + ' / Finance team'); kv(panel, 'Access', 'Accountant'); kv(panel, 'Organisation', s.company); }), 'af-topcontrol af-user');
      const shell = el('div', 'af-shell', root);
      const side = el('aside', 'af-sidebar' + (ctx.size.width < 740 ? ' rail' : ctx.size.width < 1150 ? ' narrow' : ''), shell);
      el('div', 'af-sidegroup', side, 'Workspace');
      const navItem = (text, name, count, active) => { const b = iconButton(side, text, name, () => preview(text), 'af-sideitem' + (active ? ' active' : '')); if (count) el('span', 'af-count', b, count); };
      navItem('Overview', 'home'); el('div', 'af-sidegroup', side, 'Accounting');
      for (const [v, label, name, count] of [['reconcile', 'Banking', 'bank', '18'], ['journal', 'General ledger', 'book', ''], ['approve', 'Payables', 'invoice', '12'], ['expense', 'Expenses', 'receipt', '7']]) navItem(label, name, count, v === s.scenario);
      el('div', 'af-sidegroup', side, 'Management'); navItem('Projects', 'folder', '3'); navItem('Reports', 'chart'); navItem('Documents', 'clip', '9'); navItem('Settings', 'settings');
      const close = el('div', 'af-sidefoot', side); el('b', '', close, 'September close'); el('div', 'af-closeprogress', close); el('span', '', close, '8 of 12 tasks complete');
      const main = el('div', 'af-main', shell);
      const nav = el('nav', 'af-nav', main);
      const labels = { reconcile: 'Banking', journal: 'General ledger', expense: 'Expenses', approve: 'Payables' };
      for (const [v, label] of Object.entries(labels)) el('span', v === s.scenario ? 'on' : '', nav, label);
      const heading = el('div', 'af-heading', main), headingText = el('div', '', heading);
      el('h2', '', headingText, { reconcile: 'Reconcile transactions', journal: 'New journal entry', expense: 'Expense report', approve: 'Invoice approvals' }[s.scenario]);
      el('div', 'af-sub', headingText, s.ref + ' · September 2026 · USD'); el('span', 'af-sp', heading);
      statusBadge = el('span', 'af-badge', heading, 'Draft');
      iconButton(heading, 'Activity', 'clock', () => showPanel('Record activity', panel => { kv(panel, 'Reference', s.ref); kv(panel, 'Status', F.helpers.status(ctx.model, s)); kv(panel, 'Created by', s.staff[0].name); history(panel, 'Earlier activity', background.slice(0, 3)); }), 'quiet');
      metrics = el('div', 'af-metrics', main);
      const toolbar = el('div', 'af-toolbar', main);
      iconButton(toolbar, 'Sep 2026', 'calendar', () => showPanel('Accounting period', panel => { kv(panel, 'Period', '01 Sep - 30 Sep 2026'); kv(panel, 'Reporting currency', 'USD'); kv(panel, 'Book', 'Accrual'); kv(panel, 'Prior period', 'August / Closed'); }), 'af-tool');
      iconButton(toolbar, s.scenario === 'reconcile' ? 'Operating 1042' : 'Main entity', s.scenario === 'reconcile' ? 'bank' : 'folder', () => showPanel('Account details', panel => { kv(panel, 'Entity', s.company); kv(panel, 'Account', 'Operating / ending 1042'); kv(panel, 'Bank feed', 'Connected / refreshed 08:42'); kv(panel, 'Opening balance', F.helpers.money(s.opening)); }), 'af-tool');
      el('span', 'af-sp', toolbar);
      iconButton(toolbar, 'Filters', 'filter', () => showPanel('Current view', panel => { kv(panel, 'Period', 'September 2026'); kv(panel, 'Record type', labels[s.scenario]); kv(panel, 'Display', 'All records in this batch'); el('p', '', panel, 'Earlier periods are available under Reports.'); }), 'af-tool');
      iconButton(toolbar, 'Attachments', 'clip', () => showPanel('Attachments', panel => { for (const r of s.scenario === 'expense' ? s.receipts : [{ id: s.ref }]) { const row = el('div', 'af-searchresult', panel, r.id + '.pdf'); el('small', '', row, 'PDF document / Original / Verified upload'); } }), 'af-tool');
      iconButton(toolbar, 'Export', 'download', () => showPanel('Export preview', panel => { kv(panel, 'Reference', s.ref); kv(panel, 'Format', 'CSV / Accounting record'); for (const f of F.facts(ctx.model, s)) kv(panel, f.label, f.value); }), 'af-tool');
      const work = el('div', 'af-work ' + s.scenario, main);
      function column(title, note) {
        const col = el('section', 'af-column', work), header = el('div', 'af-colhead', col);
        el('span', '', header, title); if (note) el('small', '', header, note);
        return col;
      }
      function scroll(col, name) {
        const box = el('div', 'af-scrollbox', col), pane = el('div', 'af-pane', box), content = el('div', 'af-content', pane);
        const track = el('div', 'af-track', box), thumb = el('div', 'af-thumb', track);
        const p = { pane, content, track, thumb, positions: {} }; panes[name] = p;
        const refresh = () => {
          if (!root.isConnected || current !== state) return;
          const height = pane.clientHeight, max = Math.max(0, pane.scrollHeight - height);
          const th = Math.min(track.clientHeight, Math.max(20, track.clientHeight * height / Math.max(1, pane.scrollHeight)));
          thumb.style.height = th + 'px'; thumb.style.top = (max ? pane.scrollTop / max * (track.clientHeight - th) : 0) + 'px';
          track.style.visibility = max > 0 ? 'visible' : 'hidden';
          const r = pane.getBoundingClientRect(), pos = {};
          for (const [key, node] of Object.entries(p.positions)) { const b = node.getBoundingClientRect(); pos[key] = [b.top - r.top + pane.scrollTop, b.bottom - r.top + pane.scrollTop]; }
          const v = { top: pane.scrollTop, height, max, pos };
          ctx.patch({ view: { ...ctx.model.view, [name]: v } });
        };
        p.api = env.ui.scrollPane(pane, { thumb, track, onScroll: refresh, label: 'finance-' + name });
        p.refresh = refresh; pane.addEventListener('scroll', refresh);
        return p;
      }
      function input(parent, i, k, label, cls = '') {
        const node = el('input', 'af-input ' + cls, parent); node.type = 'text'; node.autocomplete = 'off'; node.spellcheck = false;
        node.setAttribute('aria-label', label); if (cls === 'money') node.inputMode = 'decimal';
        if (k === 'date') node.placeholder = 'YYYY-MM-DD'; else if (cls === 'money') node.placeholder = '0.00';
        fields[i + ':' + k] = node; register({ field: [i, k] }, node);
        node.addEventListener('input', () => change({ field: [i, k], value: node.value })); return node;
      }
      function picker(parent, i, k, label) {
        const node = btn(parent, '', () => change({ open: ctx.model.open && ctx.model.open[0] === i && ctx.model.open[1] === k ? null : [i, k] }), 'af-picker');
        const text = el('span', '', node, label); icon(node, 'chevron');
        node.setAttribute('aria-label', label); node.setAttribute('aria-haspopup', 'listbox');
        pickers[i + ':' + k] = { node, text, label }; register({ pick: [i, k] }, node); return node;
      }
      function viewer(parent, filename) { const bar = el('div', 'af-viewerbar', parent); icon(bar, 'invoice'); el('span', 'af-sp', bar, filename); el('span', '', bar, '1 / 1'); icon(bar, 'download'); }
      function metadata(parent, pairs) { const grid = el('div', 'af-documentmeta', parent); for (const [label, value] of pairs) { const field = el('div', '', grid); el('small', '', field, label); el('strong', '', field, value); } return grid; }
      const state = { root, refs, panes, util }; current = state;
      if (s.scenario === 'reconcile') {
        const left = scroll(column('Bank statement', s.bank.length + ' lines'), 'bank');
        const right = scroll(column('Ledger entries', 'Posted transactions'), 'ledger');
        for (const [rows, p, store, bank] of [[s.bank, left, bankNodes, true], [s.ledger, right, ledgerNodes, false]]) for (const row of rows) {
          const node = el('div', 'af-row ' + (bank ? 'bank' : ''), p.content); store[row.id] = node; p.positions[row.id] = node;
          register(bank ? { bank: row.id } : { ledger: row.id }, node);
          const title = el('div', 'af-row-title', node); el('span', 'af-id', title, row.id); el('span', 'af-payee', title, row.merchant);
          node.title = row.merchant; const line = el('div', 'af-line', node); el('span', 'af-muted', line, row.date); el('strong', '', line, '-' + F.helpers.money(row.amount));
          const match = el('div', 'af-match', node, 'Unmatched'); node._match = match;
          if (bank) {
            const unlink = el('button', 'af-unlink', match, 'Unmatch'); unlink.type = 'button'; unlink.hidden = true; unlinkNodes[row.id] = unlink;
            register({ unlink: row.id }, unlink); unlink.addEventListener('click', e => { e.stopPropagation(); change({ unlink: row.id }); });
            let dragging = false, ghost = null;
            env.ui.track(node, {
              start(p, e) { if (e.target === unlink) return false; dragging = false; },
              move(p) {
                if (Math.hypot(p.dx, p.dy) > 4) dragging = true;
                if (!dragging) return;
                if (!ghost) {
                  const b = node.getBoundingClientRect(), r = root.getBoundingClientRect();
                  ghost = node.cloneNode(true); ghost.classList.add('dragging');
                  Object.assign(ghost.style, { position: 'absolute', left: b.left - r.left + 'px', top: b.top - r.top + 'px', width: b.width + 'px', margin: '0' });
                  root.appendChild(ghost); node.style.opacity = '.35';
                }
                ghost.style.transform = `translate(${p.dx}px,${p.dy}px)`;
                for (const n of Object.values(ledgerNodes)) { const b = n.getBoundingClientRect(); n.classList.toggle('over', p.x > b.left && p.x < b.right && p.y > b.top && p.y < b.bottom); }
              },
              end(p) {
                if (ghost) { ghost.remove(); ghost = null; }
                node.style.opacity = '';
                const visible = right.pane.getBoundingClientRect();
                for (const [id, n] of Object.entries(ledgerNodes)) {
                  n.classList.remove('over'); const b = n.getBoundingClientRect();
                  if (dragging && p.x >= b.left && p.x <= b.right && p.y >= Math.max(b.top, visible.top) && p.y <= Math.min(b.bottom, visible.bottom)) { change({ match: [row.id, id] }); break; }
                }
              },
            }, 'bank-line-' + row.id);
          }
        }
        const bankFoot = el('div', 'af-summarybox', left.content); kv(bankFoot, 'Source', 'Direct bank feed'); kv(bankFoot, 'Statement', 'September 2026'); kv(bankFoot, 'Refreshed', '08:42 / All lines imported');
        const closed = el('div', 'af-content', right.content); history(closed, 'Prior period / Already reconciled');
      } else if (s.scenario === 'journal') {
        const source = scroll(column('Source voucher', 'Read only'), 'source');
        viewer(source.content, s.ref + '.pdf');
        const paper = el('div', 'af-paper', source.content); el('h3', '', paper, 'Accrual voucher'); el('span', 'af-id', paper, s.ref);
        const brand = el('div', 'af-documentbrand', paper); icon(brand, 'book'); el('span', '', brand, 'FINANCE OPERATIONS / INTERNAL');
        el('p', '', paper, 'Effective date: 2026-09-30');
        for (const r of s.voucher.rows) { const line = el('div', 'af-paper-line', paper); el('strong', '', line, r.account); el('div', 'af-line', line, (r.debit ? 'Debit ' + F.helpers.money(r.debit) : 'Credit ' + F.helpers.money(r.credit))); }
        el('p', '', paper, 'Memo: ' + s.voucher.memo);
        if (s.disabled.length) el('div', 'af-warning', source.content, 'Period lock · ' + s.disabled[0] + ' is unavailable. No substitute account is authorized.');
        el('div', 'af-note', source.content, 'Journal control: total debits must equal total credits. Each line uses one side only. ' + s.note);
        history(source.content, 'Other posted vouchers', background.slice(0, 3));
        const edit = scroll(column('Journal lines', 'Accrual basis'), 'editor');
        metadata(edit.content, [['Journal date', '30 Sep 2026'], ['Journal number', s.ref], ['Entity', s.company], ['Book', 'Actual / Accrual']]);
        const th = el('div', 'af-entryhead', edit.content); for (const t of ['#', 'Account', 'Debit', 'Credit']) el('span', '', th, t);
        s.goal.rows.forEach((r, i) => { const line = el('div', 'af-entry', edit.content); edit.positions[String(i)] = line; el('span', 'af-id', line, String(i + 1)); picker(line, i, 'account', 'Choose account'); input(line, i, 'debit', 'Line ' + (i + 1) + ' debit', 'money'); input(line, i, 'credit', 'Line ' + (i + 1) + ' credit', 'money'); });
        entryTotal = el('div', 'af-entrytotal', edit.content);
        const memoBox = el('div', 'af-memo', edit.content); el('label', 'af-label', memoBox, 'Memo'); memo = el('input', 'af-input', memoBox); memo.type = 'text'; memo.setAttribute('aria-label', 'Memo'); register({ memo: true }, memo);
        edit.positions.memo = memo;
        memo.addEventListener('input', () => change({ memo: memo.value }));
        validation = el('div', 'af-summarybox', edit.content);
        const attachments = el('div', 'af-summarybox', edit.content); el('h4', '', attachments, 'Supporting documents'); kv(attachments, 'Attachment', s.ref + '.pdf'); kv(attachments, 'Uploaded by', s.staff[0].name);
      } else if (s.scenario === 'expense') {
        const sourceCol = column('Receipt inbox', s.receipts.length + ' attachments');
        const tabs = el('div', 'af-receipts', sourceCol);
        s.receipts.forEach((r, i) => { const b = iconButton(tabs, r.id, 'receipt', () => change({ active: i })); receiptButtons[i] = b; register({ receipt: i }, b); });
        const source = scroll(sourceCol, 'source');
        const editor = scroll(column('Expense details', 'Copy from receipt'), 'editor');
        state.buildReceipt = i => {
          source.content.replaceChildren(); editor.content.replaceChildren(); editor.positions = {};
          for (const k of Object.keys(fields)) delete fields[k]; for (const k of Object.keys(pickers)) delete pickers[k];
          const r = s.receipts[i]; viewer(source.content, r.id + '-receipt.pdf');
          const paper = el('div', 'af-paper', source.content);
          el('h3', '', paper, r.merchant); el('span', 'af-id', paper, 'RECEIPT ' + r.id + ' · ' + r.city);
          kv(paper, 'Transaction date', r.date); kv(paper, 'Receipt number', 'RC-' + (10420 + i)); el('hr', '', paper);
          kv(paper, r.category, F.helpers.money(r.amount)); kv(paper, 'Gross subtotal', F.helpers.money(r.amount)); kv(paper, 'Tax detail', 'Included in total');
          el('hr', '', paper); kv(paper, 'TOTAL PAID', F.helpers.money(r.amount)); el('div', 'af-sub', paper, 'Card ending 1042 / Approved');
          const coding = el('div', 'af-summarybox', source.content); el('h4', '', coding, 'Employee coding note'); kv(coding, 'Category', r.category); kv(coding, 'Project', r.project);
          el('div', 'af-note', source.content, 'Original retained / Captured from company card feed / Duplicate check complete.');
          history(source.content, 'Previous reports / Filed', background.slice(0, 3));
          if (s.judge && s.judge.mode === 'impossible') el('div', 'af-warning', source.content, 'Requested project PRJ-999 has been closed and is unavailable.');
          el('div', 'af-recordtitle', editor.content, 'Receipt ' + r.id + ' / ' + s.receipts.length);
          metadata(editor.content, [['Report', 'September expenses'], ['Employee', s.staff[0].name], ['Payment method', 'Company card / 1042'], ['Reimbursement', 'Not reimbursable']]);
          const grid = el('div', 'af-fields', editor.content);
          for (const [k, label] of [['date', 'Date'], ['merchant', 'Merchant'], ['category', 'Category'], ['amount', 'Amount · USD'], ['project', 'Project code']]) {
            const box = el('div', 'af-field ' + (k === 'merchant' ? 'wide' : ''), grid); el('label', 'af-label', box, label);
            if (['category', 'project'].includes(k)) picker(box, i, k, label); else input(box, i, k, label, k === 'amount' ? 'money' : '');
            editor.positions[i + ':' + k] = box;
          }
          const summary = el('div', 'af-summarybox', editor.content); el('h4', '', summary, 'Report receipts');
          receiptSummary = s.receipts.map(receipt => kv(summary, receipt.id + ' / ' + receipt.merchant, '').querySelector('b'));
          kv(summary, 'Report owner', s.staff[0].name);
        };
      } else {
        const source = scroll(column('Open invoices', 'Awaiting approval'), 'source');
        s.invoices.forEach((r, i) => {
          const b = btn(source.content, '', () => change({ active: i }), 'af-invoice'); invoices[i] = b; register({ invoice: i }, b);
          source.positions['invoice:' + i] = b;
          el('b', '', b, r.id); el('span', '', b, r.merchant); el('div', 'af-line', b, F.helpers.money(r.amount) + ' · Due ' + r.due);
        });
        const policy = el('div', 'af-policy', source.content); el('h3', '', policy, 'Payment approval policy');
        const list = el('ol', '', policy);
        el('li', '', list, 'Budget owner: every invoice.'); el('li', '', list, 'Controller: amounts at least ' + F.helpers.money(s.policy.controller) + '.'); el('li', '', list, 'Finance director: amounts at least ' + F.helpers.money(s.policy.director) + '.');
        el('div', 'af-sub', policy, 'Add all required roles in this order. No substitutions. AP assistants cannot authorize payment.');
        const editCol = column('Approval route', 'Sequential'); routeBox = el('div', 'af-route', editCol);
        const editor = scroll(editCol, 'editor');
        invoiceDetail = el('div', 'af-summarybox', editor.content); invoiceDetail.style.marginTop = '0';
        el('div', 'af-linehelp', editor.content, 'APPROVER DIRECTORY / Finance team / Sequential approval');
        for (const p of s.staff) {
          const row = el('div', 'af-person', editor.content); editor.positions[p.id] = row; el('span', 'af-avatar', row, p.name.split(' ').map(t => t[0]).slice(0, 2).join(''));
          const text = el('div', 'af-sp', row); el('div', 'af-person-name', text, p.name); el('small', '', text, p.role + (!p.available ? ' · Unavailable' : ''));
          const b = btn(row, 'Add', () => change({ person: p.id })); b.disabled = !p.available; people[p.id] = b; register({ person: p.id }, b);
        }
        el('div', 'af-note', editor.content, 'Approving releases the invoice to the payment queue. Verify the invoice and ordered route before approval.');
        history(source.content, 'Recently paid / Read only');
      }
      if (ctx.size.width >= 1250) {
        const rail = el('aside', 'af-inspector', shell); el('div', 'af-inspectorhead', rail, 'Activity & details');
        const body = el('div', 'af-inspectorbody', rail); kv(body, 'Reference', s.ref); kv(body, 'Owner', s.staff[0].name); kv(body, 'Currency', 'USD');
        el('h4', '', body, 'Audit trail');
        auditState = el('div', 'af-audit', body, 'Draft created'); el('small', '', auditState, 'Today / Finance operations');
        for (const [title, detail] of [['Source documents received', '08:42 / Automated import'], ['Period opened for review', 'September 2026 / Controller']]) { const a = el('div', 'af-audit', body, title); el('small', '', a, detail); }
        el('h4', '', body, 'Internal notes'); const note = el('div', 'af-comment', body); el('b', '', note, s.staff[1].name); el('span', '', note, 'Keep the original supporting documents with the September record.');
        el('h4', '', body, 'Active projects'); s.projects.forEach((p, i) => { const row = el('div', 'af-projectline', body, p + ' / ' + ['Website refresh', 'Client delivery', 'Office relocation'][i]); el('small', '', row, ['Budget review due', '4 bills awaiting coding', 'Owner review scheduled'][i]); });
        history(body, 'Recent vendor activity', background.slice(4));
      }
      const footer = el('div', 'af-footer', main); icon(footer, 'lock'); footerNotice = el('span', 'af-notice af-sp', footer, 'Draft · Changes saved locally');
      const commit = btn(footer, { reconcile: 'Save reconciliation', journal: 'Post journal', expense: 'File report', approve: 'Approve payment' }[s.scenario], () => {
        if (s.judge && s.judge.mode === 'confirm') { ctx.flag('irreversible'); return; }
        change({ commit: true });
      }, 'primary'); icon(commit, 'check'); register({ commit: true }, commit);
      const popup = el('div', 'af-popup', root); popup.hidden = true; popup.setAttribute('role', 'listbox');
      flyout = el('div', 'af-flyout', root); flyout.hidden = true; flyout.setAttribute('role', 'dialog');
      paint = m => {
        if (s.scenario === 'expense' && editorActive !== m.active) { editorActive = m.active; state.buildReceipt(m.active); }
        receiptSummary.forEach((node, i) => { const amount = F.helpers.cents(m.rows[i].amount); node.textContent = Number.isFinite(amount) ? F.helpers.money(amount) : 'Not entered'; });
        for (const [key, node] of Object.entries(fields)) { const [i, k] = key.split(':'); if (node.value !== m.rows[i][k]) node.value = m.rows[i][k]; }
        for (const [key, p] of Object.entries(pickers)) { const [i, k] = key.split(':'); p.text.textContent = m.rows[i][k] || p.label; p.node.setAttribute('aria-expanded', String(!!m.open && m.open[0] === Number(i) && m.open[1] === k)); }
        if (memo && memo.value !== m.memo) memo.value = m.memo;
        for (const [id, node] of Object.entries(bankNodes)) {
          const val = m.matches[id]; node.classList.toggle('matched', !!val);
          if (node._match.firstChild && node._match.firstChild.nodeType === 3) node._match.firstChild.textContent = val ? 'Linked to ' + val + ' ' : 'Unmatched ';
          unlinkNodes[id].hidden = !val;
        }
        for (const [id, node] of Object.entries(ledgerNodes)) { const linked = Object.keys(m.matches).find(k => m.matches[k] === id); node.classList.toggle('matched', !!linked); node._match.textContent = linked ? 'Matched · ' + linked : 'Awaiting match'; }
        statusBadge.replaceChildren(); icon(statusBadge, m.final ? 'check' : 'clock'); el('span', '', statusBadge, F.helpers.status(m, s));
        statusBadge.classList.toggle('saved', m.final); statusBadge.classList.toggle('warning', s.scenario === 'journal' && F.helpers.totals(m, s).debit !== F.helpers.totals(m, s).credit);
        metrics.replaceChildren();
        for (const fact of F.facts(m, s).filter(f => f.label !== 'Status')) { const metric = el('div', 'af-metric', metrics); el('span', 'af-muted', metric, fact.label); el('b', '', metric, fact.value); }
        if (s.scenario === 'journal') { const t = F.helpers.totals(m, s); entryTotal.textContent = 'Difference ' + F.helpers.money(Math.abs(t.debit - t.credit)); }
        if (validation) {
          validation.replaceChildren(); el('h4', '', validation, 'Posting checks');
          const t = F.helpers.totals(m, s), list = el('ul', 'af-checklist', validation);
          for (const [text, valid] of [['Debits and credits balance', t.debit > 0 && t.debit === t.credit], ['All lines have an account', m.rows.every(r => !!r.account)], ['Supporting memo recorded', !!m.memo.trim()]]) { const item = el('li', '', list); icon(item, valid ? 'check' : 'clock'); el('span', '', item, text); }
        }
        if (invoiceDetail) { const r = s.invoices[m.active]; invoiceDetail.replaceChildren(); el('h4', '', invoiceDetail, 'Invoice / ' + r.id); kv(invoiceDetail, 'Vendor', r.merchant); kv(invoiceDetail, 'Amount due', F.helpers.money(r.amount)); kv(invoiceDetail, 'Due date', r.due); kv(invoiceDetail, 'Payment method', 'Bank transfer / Net 30'); }
        if (auditState) { auditState.replaceChildren(); el('span', '', auditState, m.final ? F.helpers.status(m, s) : 'Draft prepared for review'); el('small', '', auditState, 'Today / ' + s.staff[0].name); }
        for (const [i, b] of Object.entries(receiptButtons)) b.classList.toggle('selected', Number(i) === m.active);
        for (const [i, b] of Object.entries(invoices)) b.classList.toggle('selected', Number(i) === m.active);
        for (const [id, b] of Object.entries(people)) { b.textContent = m.selected.includes(id) ? 'Added' : 'Add'; b.disabled = !s.staff.find(p => p.id === id).available || m.selected.includes(id); }
        if (routeBox) {
          routeBox.replaceChildren();
          if (!m.selected.length) el('span', 'af-muted', routeBox, 'No approvers · Add in policy order');
          m.selected.forEach((id, i) => {
            const p = s.staff.find(p => p.id === id), chip = el('span', 'af-routechip', routeBox, (i + 1) + '. ' + p.role);
            const b = el('button', '', chip); icon(b, 'close'); b.type = 'button'; b.setAttribute('aria-label', 'Remove ' + p.name); b.addEventListener('click', () => change({ remove: i })); register({ remove: i }, b);
          });
        }
        footerNotice.textContent = m.notice || (m.final ? F.helpers.status(m, s) + ' · ' + s.ref : 'Draft · Changes saved locally');
        const sig = JSON.stringify(m.open);
        if (sig !== menuSignature) {
          menuSignature = sig; popup.replaceChildren(); popup.hidden = !m.open;
          if (m.open) {
            const [i, k] = m.open, options = k === 'account' ? s.accounts : k === 'category' ? s.categories : s.projects;
            for (const value of options) {
              const b = el('button', 'af-option', popup, value + (s.disabled.includes(value) ? ' · Locked' : '')); b.type = 'button'; b.setAttribute('role', 'option'); b.disabled = s.disabled.includes(value); register({ option: value }, b);
              b.addEventListener('click', () => { const n = F.helpers.apply(ctx.model, s, { field: [i, k], value }); n.open = null; ctx.update(n); paint(ctx.model); });
            }
            const a = pickers[i + ':' + k].node.getBoundingClientRect(), r = root.getBoundingClientRect();
            const room = root.clientHeight - 14;
            popup.style.gridTemplateColumns = options.length * 31 + 10 > room ? '1fr 1fr' : '1fr';
            popup.style.width = Math.min(root.clientWidth - 16, Math.max(a.width, k === 'account' ? 235 : 170)) + 'px';
            popup.style.left = Math.max(8, Math.min(root.clientWidth - popup.offsetWidth - 8, a.left - r.left)) + 'px';
            popup.style.top = Math.max(8, Math.min(root.clientHeight - popup.offsetHeight - 8, a.bottom - r.top + 3)) + 'px';
          }
        }
        for (const p of Object.values(panes)) p.refresh();
      };
      root.addEventListener('keydown', e => { if (e.key === 'Escape') { flyout.hidden = true; if (ctx.model.open) change({ open: null }); } });
      root.addEventListener('pointerdown', e => { if (ctx.model.open && !popup.contains(e.target) && !e.target.closest('.af-picker')) change({ open: null }); });
      paint(ctx.model);
      return { anchors: [root], sync: paint };
    },
    locate(t) {
      const state = current;
      if (t.pane) return state.util.center(state.panes[t.pane].pane);
      if (t.thumb) return state.panes[t.thumb].api.locateThumb();
      if (t.thumbAt) {
        const [name, to] = t.thumbAt, p = state.panes[name], tr = p.track.getBoundingClientRect(), th = p.thumb.getBoundingClientRect();
        return [th.left + th.width / 2, tr.top + th.height / 2 + (p.api.max() ? to / p.api.max() * (tr.height - th.height) : 0)];
      }
      const node = state.refs[JSON.stringify(t)];
      if (!node || !node.isConnected) throw new Error('Finance target is not rendered: ' + JSON.stringify(t));
      return state.util.center(node);
    },
  });
})();
