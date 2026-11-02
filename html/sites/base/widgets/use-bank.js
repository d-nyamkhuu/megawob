/* use-bank/classic: a fictional retail banking workspace with payment activity, statement tools,
 * card controls and dispute history. Decorative records never add scored targets. All icons are inline
 * SVG. Task apply() owns business changes; bankUI and bankScroll are unscored interface state.
 * bankScroll mirrors clipped controls so the task oracle can wheel either inner pane before acting.
 * Receipt facts are exactly facts(); locate() only reads geometry and never scrolls or changes DOM. */
(function () {
  'use strict';
  let live;
  const PATHS = {
    bank: 'M3 9h18L12 3 3 9Zm2 3v7m5-7v7m4-7v7m5-7v7M3 21h18',
    bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
    shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Zm-4 9 3 3 5-6',
    chevron: 'm8 10 4 4 4-4', close: 'm6 6 12 12M6 18 18 6',
    search: 'M20 20l-5-5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z',
    card: 'M3 5h18v14H3V5Zm0 5h18M6 15h4', check: 'm5 12 4 4L19 6',
    calendar: 'M4 5h16v16H4V5Zm0 5h16M8 3v4m8-4v4M8 14h2m4 0h2m-8 3h2',
    transfer: 'M3 7h17m-4-4 4 4-4 4M21 17H4m4-4-4 4 4 4',
    file: 'M6 3h9l4 4v14H6V3Zm9 0v5h4M9 12h7m-7 4h7',
    clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l3 2',
    help: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 3h.01',
    download: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
    filter: 'M3 5h18l-7 8v6l-4 2v-8L3 5Z', dots: 'M5 12h.01M12 12h.01M19 12h.01',
    lock: 'M6 10h12v11H6V10Zm3 0V6a3 3 0 0 1 6 0v4',
    wallet: 'M3 6h17v15H3V6Zm0 0V3h14v3m-2 7h6v5h-6v-5Z',
    arrow: 'M5 12h14m-5-5 5 5-5 5', info: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 10v7m0-10h.01',
  };
  const CSS = `
  .bk {position:relative;display:flex;flex-direction:column;background:var(--bg);color:var(--fg);border:1px solid var(--line);border-radius:8px;overflow:hidden;font:13px/1.4 system-ui,sans-serif;text-align:left;box-shadow:0 8px 28px #0000000d;}
  .bk * {box-sizing:border-box;} .bk button,.bk input,.bk textarea {font:inherit;color:inherit;} .bk button {cursor:pointer;} .bk svg {width:17px;height:17px;flex:none;vertical-align:middle;}
  .bk-top {flex:none;display:flex;align-items:center;gap:9px;padding:9px 16px;background:var(--panel);border-bottom:1px solid var(--line);min-width:0;} .bk-logo {display:flex;align-items:center;color:var(--accent);}.bk-logo svg {width:26px;height:26px;} .bk-brand {font-size:19px;font-weight:760;letter-spacing:-.04em;} .bk-personal {font-size:10px;text-transform:uppercase;letter-spacing:.09em;color:var(--muted);border-left:1px solid var(--line);padding-left:10px;}
  .bk-user {margin-left:auto;color:var(--muted);font-size:11px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;} .bk-top-tools {display:flex;gap:8px;align-items:center;flex:none;}.bk-iconbtn {display:flex;align-items:center;justify-content:center;width:30px;height:30px;background:transparent;border:0;border-radius:5px;position:relative;}.bk-iconbtn:hover {background:var(--bg);}.bk-dot {position:absolute;right:0;top:-2px;font-size:9px;color:var(--panel);background:var(--accent);border-radius:9px;padding:1px 4px;}
  .bk-nav {display:flex;gap:21px;align-items:center;padding:0 16px;background:var(--panel);border-bottom:1px solid var(--line);height:36px;flex:none;overflow:hidden;white-space:nowrap;}.bk-nav button {border:0;border-bottom:2px solid transparent;background:none;padding:9px 0 8px;font-size:12px;color:var(--muted);}.bk-nav button.active {color:var(--accent);border-bottom-color:var(--accent);font-weight:700;}.bk-session {margin-left:auto;font-size:10px;color:var(--muted);}
  .bk-layout {display:flex;flex:1;min-height:0;min-width:0;}.bk-main {display:flex;flex-direction:column;flex:1;min-width:0;min-height:0;background:var(--panel);}.bk-side {width:206px;flex:none;border-left:1px solid var(--line);padding:13px 12px;background:var(--bg);overflow:auto;overscroll-behavior:contain;}.bk-side h4 {font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:0 0 8px;}.bk-side-section {padding-bottom:13px;margin-bottom:13px;border-bottom:1px solid var(--line);}.bk-side-section:last-child {border-bottom:0;}.bk-account {background:var(--panel);border:1px solid var(--line);border-radius:5px;padding:8px 9px;margin-bottom:6px;}.bk-account small {display:block;color:var(--muted);font-size:10px;}.bk-account b {display:block;font-size:17px;margin:3px 0 1px;font-weight:670;font-variant-numeric:tabular-nums;letter-spacing:-.02em;}.bk-minirow {display:flex;gap:8px;margin:9px 0;align-items:flex-start;}.bk-minirow svg {color:var(--muted);width:15px;height:15px;}.bk-minirow p {margin:0;font-size:11px;}.bk-minirow small {display:block;font-size:10px;color:var(--muted);}.bk-textlink {color:var(--accent);font-size:11px;font-weight:550;}
  .bk-rail {width:146px;flex:none;background:var(--bg);border-right:1px solid var(--line);padding:14px 9px;overflow:auto;}.bk-rail h4 {font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin:0 8px 9px;}.bk-rail button {display:flex;align-items:center;gap:8px;background:none;border:0;width:100%;text-align:left;font-size:11px;padding:9px 8px;color:var(--muted);border-radius:4px;}.bk-rail .active {background:var(--panel);color:var(--accent);font-weight:650;}.bk-rail hr {border:0;border-top:1px solid var(--line);margin:14px 0;}
  .bk-heading {display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 16px 9px;flex:none;border-bottom:1px solid var(--line);}.bk-crumb {font-size:10px;color:var(--muted);margin-bottom:3px;}.bk h2 {font-size:20px;line-height:1.2;margin:0;font-weight:660;letter-spacing:-.025em;}.bk-headtools {display:flex;align-items:center;gap:8px;flex:none;}.bk-tag {display:inline-flex;align-items:center;gap:4px;border:1px solid var(--line);background:var(--bg);border-radius:4px;padding:3px 6px;font-size:10px;white-space:nowrap;color:var(--muted);}.bk-tag.positive {color:color-mix(in srgb,#20835d 75%,var(--fg));background:color-mix(in srgb,#20835d 9%,var(--panel));border-color:color-mix(in srgb,#20835d 25%,var(--line));}.bk-tag.attention {color:color-mix(in srgb,#bc8227 75%,var(--fg));background:color-mix(in srgb,#bc8227 9%,var(--panel));}.bk-tag svg {width:12px;height:12px;}
  .bk-scroll {overflow:auto;flex:1;min-height:0;padding:12px 16px 18px;overscroll-behavior:contain;touch-action:pan-y;scrollbar-gutter:stable;}.bk-block {margin-bottom:16px;}.bk-sectionhead {display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 9px;}.bk-sectionhead h3 {font-size:13px;font-weight:650;margin:0;}.bk-sectionhead small {color:var(--muted);font-size:10px;}.bk-note {font-size:11px;color:var(--muted);margin:5px 0 9px;}.bk-steps {display:flex;align-items:center;gap:9px;color:var(--muted);font-size:10px;margin-bottom:11px;}.bk-steps .current {color:var(--accent);font-weight:650;}.bk-steps i {height:1px;width:26px;background:var(--line);}.bk-grid {display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px 14px;}.bk-field {display:flex;flex-direction:column;gap:4px;min-width:0;}.bk-field.wide {grid-column:1/-1;}.bk-label {font-size:11px;font-weight:650;}.bk-control {display:block;width:100%;height:35px;background:var(--panel);border:1px solid var(--line);border-radius:4px;padding:7px 9px;outline:none;text-align:left;min-width:0;}.bk-control:focus {border-color:var(--accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 18%,transparent);}.bk-control[aria-invalid=true] {border-color:#c44c4c;}.bk-inputwrap {position:relative;}.bk-inputwrap .bk-control {padding-right:32px;}.bk-inputwrap .bk-affix {position:absolute;right:9px;top:9px;color:var(--muted);pointer-events:none;width:15px;height:15px;}.bk-inputwrap.amount .bk-control {padding-left:24px;font-variant-numeric:tabular-nums;}.bk-currency {position:absolute;left:10px;top:8px;color:var(--muted);}.bk-choice {display:flex;align-items:center;justify-content:space-between;gap:5px;}.bk-choice span {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.bk-choice svg {width:14px;height:14px;color:var(--muted);}.bk textarea {height:75px;resize:vertical;user-select:text;}.bk-hint {font-size:10px;color:var(--muted);}.bk-error {font-size:11px;color:color-mix(in srgb,#d04c4c 80%,var(--fg));}.bk-errorbox {padding:8px 10px;background:color-mix(in srgb,#d04c4c 7%,var(--panel));border:1px solid color-mix(in srgb,#d04c4c 40%,var(--line));border-radius:4px;margin-bottom:10px;}
  .bk-footer {display:flex;align-items:center;gap:9px;flex:none;padding:9px 16px;background:var(--panel);border-top:1px solid var(--line);}.bk-footer small {color:var(--muted);font-size:10px;margin-right:auto;display:flex;align-items:center;gap:5px;}.bk-footer small svg {width:13px;height:13px;}.bk-btn {display:inline-flex;align-items:center;justify-content:center;gap:6px;border:1px solid var(--line);border-radius:4px;background:var(--panel);padding:7px 11px;font-size:12px;white-space:nowrap;}.bk-btn:hover {background:var(--bg);}.bk-btn.primary {color:white;background:var(--accent);border-color:var(--accent);font-weight:650;}.bk-btn.link {border:0;background:none;color:var(--accent);padding-left:0;}.bk-btn svg {width:14px;height:14px;}
  .bk-toolbar {display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:10px;}.bk-searchbox {position:relative;flex:1;min-width:130px;}.bk-searchbox svg {position:absolute;left:9px;top:9px;color:var(--muted);width:16px;height:16px;}.bk-searchbox input {padding-left:31px;}.bk-toolbar .bk-btn {height:35px;font-size:11px;padding:6px 9px;}.bk-stats {display:flex;gap:0;border:1px solid var(--line);border-radius:5px;background:var(--bg);margin-bottom:12px;}.bk-stat {flex:1;padding:8px 10px;border-right:1px solid var(--line);min-width:0;}.bk-stat:last-child {border:0;}.bk-stat small {display:block;font-size:10px;color:var(--muted);}.bk-stat b {font-size:15px;font-weight:650;font-variant-numeric:tabular-nums;}
  .bk-table {border-collapse:collapse;width:100%;table-layout:fixed;font-size:11px;}.bk-table th {font-size:9px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);text-align:left;padding:8px 6px;border-block:1px solid var(--line);background:var(--bg);}.bk-table td {padding:9px 6px;border-bottom:1px solid var(--line);vertical-align:middle;overflow-wrap:anywhere;}.bk-table small {display:block;color:var(--muted);font-size:10px;}.bk-table .bk-num {white-space:nowrap;font-variant-numeric:tabular-nums;text-align:right;font-weight:600;}.bk-table .bk-btn {font-size:10px;padding:5px 6px;max-width:100%;}.bk-merchant {display:flex;align-items:center;gap:8px;min-width:0;}.bk-avatar {display:flex;align-items:center;justify-content:center;background:var(--bg);border:1px solid var(--line);width:29px;height:29px;border-radius:6px;font-size:10px;font-weight:700;color:var(--muted);flex:none;}.bk-merchant-title {font-weight:570;}.bk-table-meta {display:flex;justify-content:space-between;font-size:10px;color:var(--muted);padding:9px 0;}.bk-divider {height:1px;background:var(--line);margin:16px 0;}.bk-history {padding-top:12px;border-top:1px solid var(--line);margin-top:16px;}.bk-history .bk-table td {padding-block:8px;}
  .bk-summary {border:1px solid var(--line);border-radius:5px;overflow:hidden;margin:9px 0 14px;}.bk-row {display:flex;justify-content:space-between;gap:12px;padding:9px 11px;border-bottom:1px solid var(--line);font-size:12px;}.bk-row:last-child {border:0;}.bk-row>span {color:var(--muted);flex:1;}.bk-row b {font-weight:570;text-align:right;max-width:66%;overflow-wrap:anywhere;}.bk-row.amount b {font-size:18px;letter-spacing:-.02em;}.bk-notice {display:flex;align-items:flex-start;gap:8px;padding:9px 10px;border:1px solid var(--line);border-radius:4px;background:var(--bg);font-size:11px;margin:10px 0;line-height:1.45;}.bk-notice>svg {color:var(--accent);width:15px;height:15px;margin-top:1px;}.bk-success {display:flex;align-items:center;gap:10px;margin:0 0 10px;}.bk-success>svg {width:32px;height:32px;padding:6px;background:color-mix(in srgb,#20835d 12%,var(--panel));color:color-mix(in srgb,#20835d 75%,var(--fg));border-radius:50%;}.bk-success b {display:block;font-size:15px;}.bk-success small {display:block;font-size:11px;color:var(--muted);}
  .bk-mask {position:absolute;inset:0;background:#0005;display:flex;align-items:center;justify-content:center;z-index:20;padding:12px;}.bk-dialog {background:var(--panel);border:1px solid var(--line);box-shadow:0 12px 45px #0004;border-radius:7px;width:min(410px,100%);max-height:100%;display:flex;flex-direction:column;overflow:hidden;}.bk-dialog-head {display:flex;align-items:center;justify-content:space-between;padding:10px 13px;font-weight:650;border-bottom:1px solid var(--line);}.bk-options {overflow:auto;padding:5px;overscroll-behavior:contain;}.bk-option {display:flex;align-items:center;gap:9px;width:100%;text-align:left;background:var(--panel);border:0;border-bottom:1px solid var(--line);padding:10px 9px;border-radius:3px;font-size:12px;}.bk-option:last-child {border:0;}.bk-option small {display:block;font-size:10px;color:var(--muted);}.bk-option>svg {color:var(--muted);}.bk-option .bk-option-label {flex:1;min-width:0;}.bk-option.selected {background:var(--bg);color:var(--accent);}.bk-option:hover,.bk-option:focus {background:var(--bg);}.bk-empty {padding:25px 10px;text-align:center;color:var(--muted);}.bk-empty svg {width:28px;height:28px;margin-bottom:8px;}.bk-empty b {display:block;color:var(--fg);font-size:13px;}.bk-empty p {font-size:11px;}
  .bk-creditcard {position:relative;border:1px solid color-mix(in srgb,var(--accent) 40%,var(--line));border-radius:9px;padding:13px 16px;background:linear-gradient(115deg,color-mix(in srgb,var(--accent) 20%,var(--panel)),var(--panel));min-height:115px;max-width:330px;}.bk-creditcard-head {display:flex;justify-content:space-between;font-weight:650;font-size:13px;}.bk-chip {width:25px;height:19px;display:block;border:1px solid color-mix(in srgb,#bc965c 70%,var(--line));background:color-mix(in srgb,#bc965c 30%,var(--panel));border-radius:4px;margin:10px 0 5px;}.bk-cardnumber {font-size:16px;font-variant-numeric:tabular-nums;letter-spacing:.08em;}.bk-cardowner {font-size:9px;text-transform:uppercase;color:var(--muted);margin-top:6px;}.bk-cardintro {display:flex;align-items:center;gap:18px;margin-bottom:14px;}.bk-cardintro>div {flex:1;}.bk-cardaside {font-size:11px;color:var(--muted);}.bk-cardaside strong {display:block;color:var(--fg);margin:3px 0;font-size:16px;}.bk-detail-banner {padding:10px 12px;border:1px solid var(--line);border-radius:5px;background:var(--bg);margin-bottom:11px;}.bk-detail-banner .bk-merchant {justify-content:space-between;}.bk-detail-banner .bk-hint {display:block;}.bk-casepath {display:flex;gap:8px;color:var(--muted);font-size:10px;margin:9px 0;}.bk-casepath span {padding:5px 8px;background:var(--bg);border:1px solid var(--line);border-radius:4px;}.bk-casepath .active {color:var(--accent);border-color:var(--accent);}.bk-popcontent {padding:12px 14px;overflow:auto;}.bk-popcontent p {font-size:12px;margin:0 0 8px;}.bk-tabline {display:flex;gap:14px;align-items:center;margin-bottom:12px;font-size:11px;color:var(--muted);}.bk-tabline .active {color:var(--accent);font-weight:650;border-bottom:2px solid var(--accent);padding-bottom:6px;}
  .bk.compact .bk-side {width:178px;}.bk.compact .bk-heading {padding:8px 12px;}.bk.compact .bk-scroll {padding:10px 12px 15px;}.bk.compact .bk-brand {font-size:17px;}.bk.compact .bk-personal,.bk.compact .bk-session {display:none;}.bk.compact .bk-nav {gap:15px;}.bk.compact .bk-top {padding:8px 12px;}.bk.compact .bk-steps {margin-bottom:8px;}.bk.compact .bk-headtools .bk-btn {display:none;}.bk.compact .bk-cardaside {display:none;}.bk.compact .bk-table .bk-channel {display:none;}
  `;

  function icon(u, parent, name, cls = '') {
    const svg = u.svg('svg', {viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.7','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true',class:cls}, parent);
    u.svg('path', {d:PATHS[name] || PATHS.info}, svg);
    return svg;
  }

  function render(ctx) {
    const {spec:s,util:u} = ctx, F = env.taskDef;
    ctx.css('app-bank-classic',CSS);
    const root = u.el('div',`bk${ctx.size.width < 940 ? ' compact' : ''}`,ctx.stage);
    root.style.width = `${Math.max(260,ctx.size.width-20)}px`;
    root.style.height = `${Math.max(180,ctx.size.height-20)}px`;
    let refs = {}, inputs = {}, tableHost, lastView, choicesPane;
    const key = t => JSON.stringify(t);
    const ref = (t,el) => { refs[key(t)] = el; return el; };
    const ui = patch => { ctx.update({...ctx.model,bankUI:{...ctx.model.bankUI,...patch}}); draw(); };
    const change = (act,full=true) => { ctx.update(F.helpers.apply(ctx.model,s,act)); if(full) draw(); };
    const localButton = (parent,text,fn,cls='',glyph) => {
      const b=u.el('button',cls || 'bk-btn',parent); b.type='button';
      if(glyph) icon(u,b,glyph); if(text)u.el('span','',b,text);
      b.addEventListener('click',fn); return b;
    };
    const tool = (parent,label,glyph,fn) => { const b=localButton(parent,'',fn,'bk-iconbtn',glyph); b.setAttribute('aria-label',label);b.title=label;return b; };
    const button = (parent,text,target,act,cls='',glyph) => ref(target,localButton(parent,text,()=>change(act),`bk-btn ${cls}`,glyph));
    const badge = (parent,text,cls='',glyph) => { const el=u.el('span',`bk-tag ${cls}`,parent);if(glyph)icon(u,el,glyph);u.el('span','',el,text);return el; };
    const row = (parent,k,v,cls='') => { const el=u.el('div',`bk-row ${cls}`,parent);u.el('span','',el,k);u.el('b','',el,v); };
    const sectionHead = (parent,title,meta='') => { const h=u.el('div','bk-sectionhead',parent);u.el('h3','',h,title);if(meta)u.el('small','',h,meta);return h; };
    const notice = (parent,text,glyph='info') => { const n=u.el('div','bk-notice',parent);icon(u,n,glyph);u.el('span','',n,text);return n; };
    const popup = (title,text) => ui({popup:{title,text}});
    const active = ['paybill','schedule'].includes(s.scenario) ? 'Pay & transfer' : s.scenario === 'limits' ? 'Cards' : 'Activity';
    const titles={paybill:'Pay a bill',schedule:'Recurring transfers',categorise:'Transactions',dispute:'Dispute a charge',limits:'Card controls'};
    const top=u.el('div','bk-top',root), logo=u.el('span','bk-logo',top);icon(u,logo,'bank');
    u.el('span','bk-brand',top,'Pinebridge');u.el('span','bk-personal',top,'Personal banking');u.el('span','bk-user',top,s.customer);
    const tools=u.el('div','bk-top-tools',top);
    const bell=tool(tools,'Notifications, 3 unread','bell',()=>popup('Notifications','Your February statement is ready.\nA recurring payment is due on March 5.\nYour contact information was updated.'));u.el('span','bk-dot',bell,'3');
    tool(tools,'Secure message centre','file',()=>popup('Secure message centre','Inbox (2 unread)\nStatement delivery preferences updated\nWelcome to Pinebridge digital banking\nNo reply is needed for these messages.'));
    tool(tools,'Help and support','help',()=>popup('Help & support','For questions about a payment, have its confirmation number ready. Your saved changes and scheduled payments appear in Payment activity. You can review a dispute in the Resolution centre.'));
    const nav=u.el('nav','bk-nav',root);nav.setAttribute('aria-label','Banking navigation');
    ['Accounts','Activity','Pay & transfer','Cards','Statements','Offers'].forEach(label=>localButton(nav,label,()=>label===active?ui({preview:null}):ui({preview:label}),label===active?'active':''));
    u.el('span','bk-session',nav,'Secure session / Personal profile');
    const layout=u.el('div','bk-layout',root);
    if(ctx.size.width > 1200) {
      const rail=u.el('aside','bk-rail',layout);u.el('h4','',rail,'Workspace');
      [['Overview','wallet'],['Transaction history','file'],['Pay a bill','calendar'],['Recurring transfers','transfer'],['Card controls','card'],['Resolution centre','shield']].forEach(([label,glyph])=>{
        const selected=label===titles[s.scenario] || label==='Transaction history'&&s.scenario==='categorise' || label==='Resolution centre'&&s.scenario==='dispute';
        localButton(rail,label,()=>selected?ui({preview:null}):ui({preview:label}),selected?'active':'',glyph);
      });
      u.el('hr','',rail);u.el('h4','',rail,'Manage');
      [['Saved billers','file'],['Alerts & preferences','bell'],['Documents','download'],['Contact support','help']].forEach(([label,glyph])=>localButton(rail,label,()=>popup(label,'Your account information is up to date. Statements, saved billers and notification settings are available from your personal banking profile.'),'',glyph));
    }
    const main=u.el('main','bk-main',layout);
    if(ctx.size.width > 710) {
      const side=u.el('aside','bk-side',layout), accounts=u.el('div','bk-side-section',side);u.el('h4','',accounts,'Accounts at a glance');
      s.accounts.forEach(a=>{const box=u.el('div','bk-account',accounts);u.el('small','',box,a.label);const balance=u.el('b','',box,F.helpers.money(a.balance));balance.dataset.account=a.label;u.el('small','',box,'Available balance');});
      const context=u.el('div','bk-side-section',side);
      u.el('h4','',context,s.scenario==='dispute'?'Resolution centre':s.scenario==='limits'?'Card services':s.scenario==='categorise'?'Spending insights':'Upcoming activity');
      const items=s.scenario==='dispute'?[['shield','1 open case','A merchant response is pending'],['clock','Case PB-20416','Update expected by March 8'],['file','No documents requested','We will contact you if needed']]
        :s.scenario==='limits'?[['card','Digital wallet','1 device connected'],['shield','Travel notification','No travel notice on file'],['bell','Purchase alerts','Enabled for purchases over $100']]
        :s.scenario==='categorise'?[['wallet','February spending',F.helpers.money(s.transactions.reduce((n,t)=>n+t.amount,0))],['file','Monthly statement','Available in Documents'],['bell','Budget alerts','2 categories near their budget']]
        :[['calendar','3 payments scheduled','Next payment: March 5'],['transfer','Savings contribution','$150.00 / Monthly'],['file','1 new eBill','Statement ready to view']];
      items.forEach(([glyph,label,detail])=>{const line=u.el('div','bk-minirow',context);icon(u,line,glyph);const p=u.el('p','',line,label);u.el('small','',p,detail);});
      const support=u.el('div','bk-side-section',side);u.el('h4','',support,'Stay informed');u.el('p','bk-note',support,'February account statements are ready. Paperless delivery is on.');
      localButton(support,'View documents',()=>ui({preview:'Statements'}),'bk-btn link','file');
      const secure=u.el('div','bk-minirow',side);icon(u,secure,'shield');u.el('p','',secure,'Your connection is encrypted. Pinebridge will never ask for a verification code by message.');
    }
    const head=u.el('div','bk-heading',main), heading=u.el('div','',head), crumb=u.el('div','bk-crumb',heading), title=u.el('h2','',heading);
    const headtools=u.el('div','bk-headtools',head), stateBadge=u.el('span','',headtools);
    tool(headtools,'Page options','dots',()=>popup('Page options','Keep a copy of the confirmation number for your records. Completed transactions are included in your next monthly statement.'));
    const pane=u.el('div','bk-scroll',main), footer=u.el('div','bk-footer',main);

    function mirror() {
      if(live?.ctx!==ctx) return;
      const needs={};
      for(const [id,el] of Object.entries(refs)) {
        if(el===pane || el===choicesPane)continue;
        const container=choicesPane?.contains(el)?choicesPane:pane.contains(el)?pane:null;
        if(!container)continue;
        const r=el.getBoundingClientRect(), c=container.getBoundingClientRect();
        if(r.width<1 || r.height<1)continue;
        if(r.top<c.top+2 || r.bottom>c.bottom-2) {
          const dy=Math.max(-220,Math.min(220,(r.top+r.bottom-c.top-c.bottom)/2));
          if(Math.abs(dy)>2) needs[id]={choices:container===choicesPane,dy};
        }
      }
      if(JSON.stringify(needs)!==JSON.stringify(ctx.model.bankScroll || {}))ctx.update({...ctx.model,bankScroll:needs});
    }
    pane.addEventListener('scroll',mirror);

    function history(parent) {
      const block=u.el('section','bk-history',parent);
      const payment=['paybill','schedule'].includes(s.scenario), dispute=s.scenario==='dispute';
      sectionHead(block,payment?'Payment activity':dispute?'Recent disputes':s.scenario==='limits'?'Recent card activity':'Recent account activity',payment?'Last 30 days':dispute?'Resolution centre':'Posted transactions');
      const tabs=u.el('div','bk-tabline',block);u.el('span','active',tabs,payment?'Scheduled':dispute?'Open cases':'All activity');u.el('span','',tabs,payment?'Completed':dispute?'Closed cases':'Pending');u.el('span','',tabs,payment?'Cancelled':'Statements');
      const tbl=u.el('table','bk-table',block), h=u.el('tr','',u.el('thead','',tbl));
      ['Description',payment?'Next payment':'Date','Amount','Status'].forEach((x,i)=>{const th=u.el('th','',h,x);th.style.width=['40%','22%','18%','20%'][i];});
      const body=u.el('tbody','',tbl);
      const records=dispute?[['Merchant review / PB-20416','Feb 18','$42.80','Under review'],['Duplicate payment / PB-19802','Jan 29','$26.50','Resolved']]
        :payment?s.payees.slice(0,4).map((p,i)=>[p.name,`Mar ${String(5+i*3).padStart(2,'0')}`,F.helpers.money(s.transactions[i%s.transactions.length].amount),i===2?'Processing':'Scheduled'])
        :s.transactions.slice(0,6).map(t=>[t.name,t.date.slice(5),F.helpers.money(t.amount),'Posted']);
      records.forEach((record,i)=>{const tr=u.el('tr','',body);record.forEach((v,j)=>{const td=u.el('td',j===2?'bk-num':'',tr);if(j===3)badge(td,v,v==='Resolved'||v==='Posted'?'positive':'attention');else {u.el('span','',td,v);if(j===0)u.el('small','',td,payment?`${s.accounts[i%s.accounts.length].label} / ${i%2?'Monthly':'One time'}`:dispute?'Card ending '+s.cards[0].slice(-4):s.transactions[i].id);}});});
      u.el('div','bk-table-meta',block,`${records.length} ${dispute?'cases':'records'} shown / Personal accounts`);
    }
    function table() {
      tableHost.replaceChildren();
      const q=ctx.model.search.toLowerCase(), xs=s.transactions.filter(t=>`${t.id} ${t.name} ${t.date}`.toLowerCase().includes(q));
      if(!xs.length) {const empty=u.el('div','bk-empty',tableHost);icon(u,empty,'search');u.el('b','',empty,'No matching transactions');u.el('p','',empty,'Try a different merchant name, date or transaction ID.');return;}
      const tbl=u.el('table','bk-table',tableHost), h=u.el('tr','',u.el('thead','',tbl));
      ['Transaction','Account','Status','Amount',s.scenario==='categorise'?'Category':''].forEach((x,i)=>{const th=u.el('th',i===1?'bk-channel':'',h,x);th.style.width=['35%','19%','12%','14%','20%'][i];});
      const body=u.el('tbody','',tbl);
      xs.forEach(t=>{const tr=u.el('tr','',body), name=u.el('td','',tr), merchant=u.el('div','bk-merchant',name);u.el('span','bk-avatar',merchant,t.name.split(' ').map(x=>x[0]).slice(0,2).join(''));const text=u.el('div','',merchant);u.el('span','bk-merchant-title',text,t.name);u.el('small','',text,`${t.date} / ${t.id}`);
        const account=u.el('td','bk-channel',tr);u.el('span','',account,'Card purchase');u.el('small','',account,'Card '+s.cards[0].slice(-4));
        badge(u.el('td','',tr),'Posted','positive');u.el('td','bk-num',tr,F.helpers.money(t.amount));const cell=u.el('td','',tr);
        if(s.scenario==='categorise') {const b=button(cell,ctx.model.values[t.id],{field:t.id},{open:t.id});icon(u,b,'chevron');}
        else button(cell,'Dispute',{transaction:t.id},{transaction:t.id},'link','arrow');
      });
      const meta=u.el('div','bk-table-meta',tableHost);u.el('span','',meta,`${xs.length} of ${s.transactions.length} transactions / Feb 2027`);u.el('span','',meta,'Newest first');mirror();
    }
    function searchBox() {
      const toolbar=u.el('div','bk-toolbar',pane), wrap=u.el('div','bk-searchbox',toolbar);icon(u,wrap,'search');
      const input=ref({search:true},u.el('input','bk-control',wrap));input.type='text';input.placeholder='Search transactions';input.setAttribute('aria-label','Search transactions');input.value=ctx.model.search;
      input.addEventListener('input',()=>{change({search:input.value},false);table();});
      localButton(toolbar,'Filters',()=>popup('Transaction filters','Account: All personal accounts\nDate range: February 1-28, 2027\nStatus: Posted\nTransaction type: Card purchases'),'bk-btn','filter');
      localButton(toolbar,'Export',()=>popup('Export transactions','February 2027 / Posted card purchases\nCSV and PDF statements are available in Documents. No account data is sent outside this page.'),'bk-btn','download');
      tableHost=u.el('div','',pane);table();
    }
    function field(f,grid) {
      const box=u.el('label',`bk-field${f.kind==='details'?' wide':''}`,grid);u.el('span','bk-label',box,f.label);
      if(f.options) {
        const b=ref({field:f.id},localButton(box,ctx.model.values[f.id]||'Select an option',()=>change({open:f.id}),'bk-control bk-choice'));
        icon(u,b,'chevron');b.setAttribute('aria-label',f.label);b.setAttribute('aria-haspopup','dialog');
      } else {
        const wrap=u.el('div',`bk-inputwrap${f.kind==='amount'?' amount':''}`,box);
        const el=ref({field:f.id},u.el(f.kind==='details'?'textarea':'input','bk-control',wrap));el.setAttribute('aria-label',f.label);el.value=ctx.model.values[f.id]||'';el.autocomplete='off';el.spellcheck=false;
        if(f.kind==='amount') {el.inputMode='decimal';u.el('span','bk-currency',wrap,'$');}
        if(f.kind==='date') {el.placeholder='YYYY-MM-DD';icon(u,wrap,'calendar','bk-affix');}
        el.addEventListener('input',()=>change({set:[f.id,el.value]},false));inputs[f.id]=el;
      }
      const el=refs[key({field:f.id})];el.setAttribute('aria-invalid',String(!!ctx.model.invalid[f.id]));
      if(f.hint)u.el('small','bk-hint',box,f.hint);
      if(ctx.model.invalid[f.id])u.el('span','bk-error',box,ctx.model.invalid[f.id]);
    }
    function cardPreview(parent) {
      const m=ctx.model, card=m.values.card || s.cards[0], intro=u.el('div','bk-cardintro',parent), visual=u.el('div','bk-creditcard',intro);
      const h=u.el('div','bk-creditcard-head',visual);u.el('span','',h,'Pinebridge');icon(u,h,'card');u.el('span','bk-chip',visual);
      u.el('div','bk-cardnumber',visual,'**** **** **** '+card.slice(-4));u.el('div','bk-cardowner',visual,s.customer);
      const aside=u.el('div','bk-cardaside',intro);u.el('span','',aside,'Card purchase activity');u.el('strong','',aside,F.helpers.money(s.transactions[0].amount));u.el('small','',aside,'Spent today / Posted purchases');
    }
    function details(parent) {
      const m=ctx.model, list=u.el('div','bk-summary',parent);
      s.fields.forEach(f=>{const value=m.values[f.id];row(list,f.label,value?f.kind==='amount'?F.helpers.money(F.helpers.cents(value) || 0):value:'Not provided',f.kind==='amount'?'amount':'');});
    }
    function draw() {
      const m=ctx.model, scroll=lastView===m.view?pane.scrollTop:0;lastView=m.view;choicesPane=null;
      root.querySelectorAll('[data-account]').forEach(el=>{const a=s.accounts.find(a=>a.label===el.dataset.account);el.textContent=F.helpers.money(a.balance-(m.saved&&s.scenario==='paybill'&&m.values.from===a.label?F.helpers.cents(m.values.amount)||0:0));});
      refs={};inputs={};pane.replaceChildren();footer.replaceChildren();root.querySelector('.bk-mask')?.remove();stateBadge.replaceChildren();
      crumb.textContent=`Personal banking / ${active} / ${titles[s.scenario]}`;
      title.textContent=m.view==='receipt'?(s.scenario==='dispute'?'Dispute received':'Confirmation'):m.view==='review'?'Review & authorise':titles[s.scenario];
      badge(stateBadge,m.view==='receipt'?'Confirmed':m.view==='review'?'Not yet submitted':'Draft',m.view==='receipt'?'positive':'',m.view==='receipt'?'check':'file');
      ref({pane:true},pane);
      if(m.bankUI?.preview) {
        sectionHead(pane,m.bankUI.preview,'Personal banking');notice(pane,'Your current banking draft is retained while you view other account information.');history(pane);
        const b=localButton(footer,'Return to '+titles[s.scenario],()=>ui({preview:null}),'bk-btn primary','arrow');ref({nav:'return'},b);
      } else if(s.judge && s.judge.mode!=='confirm') {
        sectionHead(pane,'Saved billers',`${s.payees.length} payment accounts`);u.el('p','bk-note',pane,'Manage biller account details and view payment delivery preferences.');
        const list=u.el('div','bk-summary',pane);s.payees.forEach(p=>row(list,p.name,`Account ending ${p.suffix}`));
        s.accounts.forEach(a=>row(pane,a.label,`${F.helpers.money(a.balance)} available`));
        u.el('small','',footer,'No payment has been prepared.');history(pane);
      } else if(m.view==='receipt') {
        const success=u.el('div','bk-success',pane);icon(u,success,'check');const text=u.el('div','',success);u.el('b','',text,s.scenario==='dispute'?'We have received your dispute.':'Your banking changes are confirmed.');u.el('small','',text,'Keep the confirmation number for your records.');
        const facts=u.el('div','bk-summary',pane);F.facts(m,s).forEach(f=>row(facts,f.label,f.value));
        sectionHead(pane,'Transaction details');details(pane);
        if(s.scenario==='dispute') {const path=u.el('div','bk-casepath',pane);['Received','Investigation','Decision'].forEach((v,i)=>u.el('span',i===0?'active':'',path,v));notice(pane,'We will send updates to your secure inbox. Your provisional credit eligibility will be assessed during the investigation.','shield');}
        else notice(pane,s.scenario==='schedule'?'The recurring instruction is active. Only scheduled transfers are affected; other standing instructions are unchanged.':s.scenario==='limits'?'Card preferences have been updated. Existing subscriptions and already authorised transactions may still be processed.':'A confirmation has been added to your activity. Future-dated payments are listed under Scheduled.','check');
        history(pane);const small=u.el('small','',footer);icon(u,small,'shield');u.el('span','',small,'Saved to your secure banking profile');button(footer,'Make changes',{nav:'edit'},{nav:'edit'});
      } else if(m.view==='review') {
        const steps=u.el('div','bk-steps',pane);u.el('span','',steps,'1 Details');u.el('i','',steps);u.el('span','current',steps,'2 Review');u.el('i','',steps);u.el('span','',steps,'3 Confirmation');
        sectionHead(pane,['paybill','schedule'].includes(s.scenario)?'Payment instructions':'Changes to authorise');details(pane);
        notice(pane,['paybill','schedule'].includes(s.scenario)?'By authorising, you instruct Pinebridge to process the payment using these account details. A confirmation will appear in your payment activity.':'These changes will be applied to your selected transactions or card. Review the details before authorising.','shield');
        button(footer,'Edit details',{nav:'edit'},{nav:'edit'});u.el('small','',footer,'No changes applied yet');
        const b=ref({nav:'apply'},localButton(footer,s.scenario==='paybill'?'Pay bill':s.scenario==='schedule'?'Set up transfer':s.scenario==='dispute'?'Send dispute':'Apply changes',()=>{if(s.judge?.mode==='confirm')ctx.flag('irreversible');else change({nav:'apply'});},'bk-btn primary','lock'));
        b.type='button';history(pane);
      } else {
        if(Object.keys(m.invalid).length) {const err=u.el('div','bk-errorbox',pane);u.el('strong','bk-error',err,'We could not continue.');u.el('div','bk-error',err,'Check the highlighted information below.');}
        if(s.scenario==='categorise') {
          const stats=u.el('div','bk-stats',pane);
          [['February spending',F.helpers.money(s.transactions.reduce((n,t)=>n+t.amount,0))],['Transactions',String(s.transactions.length)],['Uncategorised',String(s.transactions.filter(t=>m.values[t.id]==='Uncategorised').length)]].forEach(([k,v])=>{const el=u.el('div','bk-stat',stats);u.el('small','',el,k);u.el('b','',el,v);});
          searchBox();
        } else if(s.scenario==='dispute' && !m.values.transaction) {
          sectionHead(pane,'Find a posted transaction','February 2027');u.el('p','bk-note',pane,'Pending authorisations cannot be disputed until they have posted to your account.');searchBox();history(pane);
        } else {
          if(s.scenario==='limits') cardPreview(pane);
          if(s.scenario==='dispute') {
            const t=s.transactions.find(x=>x.id===m.values.transaction), banner=u.el('div','bk-detail-banner',pane), merchant=u.el('div','bk-merchant',banner);
            const info=u.el('div','',merchant);u.el('b','',info,t.name);u.el('small','bk-hint',info,`${t.id} / ${t.date} / Card ${s.cards[0].slice(-4)}`);u.el('b','',merchant,F.helpers.money(t.amount));badge(banner,'Posted','positive');
            button(banner,'Change transaction',{field:'transaction'},{set:['transaction','']},'link');
          } else if(s.scenario!=='limits') {
            const steps=u.el('div','bk-steps',pane);u.el('span','current',steps,'1 Payment details');u.el('i','',steps);u.el('span','',steps,'2 Review');u.el('i','',steps);u.el('span','',steps,'3 Confirmation');
          }
          sectionHead(pane,s.scenario==='limits'?'Manage this card':s.scenario==='dispute'?'Tell us what happened':s.scenario==='schedule'?'Transfer details':'Payment details',s.scenario==='dispute'?'Step 1 of 2':'USD');
          const grid=u.el('div','bk-grid',pane);s.fields.filter(f=>f.kind!=='transaction').forEach(f=>field(f,grid));
          if(['paybill','schedule'].includes(s.scenario)) {
            const account=s.accounts.find(a=>a.label===m.values.from);
            const payee=s.payees.find(p=>p.label===m.values.payee);
            notice(pane,account?`${account.label}: ${F.helpers.money(account.balance)} available. ${s.scenario==='schedule'?'The first transfer is processed on the start date.':'Your selected delivery date is shown in the payment review.'}`:'Payments use available funds in your selected source account. Delivery details are included in the review.','wallet');
            if(payee) {const band=u.el('div','bk-detail-banner',pane);sectionHead(band,payee.name,'Saved biller');u.el('small','bk-hint',band,`Biller account ending ${payee.suffix} / Electronic delivery / eBills available`);}
            if(s.scenario==='schedule')u.el('p','bk-note',pane,'Recurring transfers continue through the end date. You can change or cancel a future instruction in Payment activity.');
          } else if(s.scenario==='limits') notice(pane,'Daily limits apply to new card purchases. A frozen card cannot make new purchases; subscriptions and prior authorisations may still be processed.','shield');
          else notice(pane,'Include the facts that help explain your dispute. We will contact you through the secure message centre if supporting documents are needed.','file');
          history(pane);
        }
        const small=u.el('small','',footer);icon(u,small,'lock');u.el('span','',small,'Secure banking / USD');button(footer,'Review changes',{nav:'review'},{nav:'review'},'primary','arrow');
      }
      if(m.open && !m.bankUI?.preview) {
        const f=s.fields.find(f=>f.id===m.open), mask=u.el('div','bk-mask',root), d=u.el('div','bk-dialog',mask);d.setAttribute('role','dialog');d.setAttribute('aria-label',f.label);
        const h=u.el('div','bk-dialog-head',d);u.el('span','',h,f.label);ref({nav:'close'},tool(h,'Close choices','close',()=>change({nav:'close'})));
        choicesPane=u.el('div','bk-options',d);ref({choicePane:true},choicesPane);choicesPane.addEventListener('scroll',mirror);
        f.options.forEach(value=>{
          const b=ref({option:value},localButton(choicesPane,'',()=>change({set:[f.id,value]}),`bk-option${m.values[f.id]===value?' selected':''}`,f.id==='card'||f.id==='frozen'?'card':f.kind==='category'?'file':f.id==='frequency'?'calendar':'wallet'));
          const label=u.el('div','bk-option-label',b);u.el('span','',label,value);
          const a=s.accounts.find(a=>a.label===value), payee=s.payees.find(p=>p.label===value);
          if(a)u.el('small','',label,`${F.helpers.money(a.balance)} available / Personal account`);
          else if(payee)u.el('small','',label,'Saved biller / Electronic payment');
          else if(f.id==='card')u.el('small','',label,'Personal card / Card services enabled');
          if(m.values[f.id]===value)icon(u,b,'check');
        });
      }
      if(m.bankUI?.popup) {
        const mask=u.el('div','bk-mask',root), dialog=u.el('div','bk-dialog',mask), h=u.el('div','bk-dialog-head',dialog);dialog.setAttribute('role','dialog');u.el('span','',h,m.bankUI.popup.title);
        ref({nav:'dismiss'},tool(h,'Close panel','close',()=>ui({popup:null})));const content=u.el('div','bk-popcontent',dialog);m.bankUI.popup.text.split('\n').forEach(text=>u.el('p','',content,text));
      }
      pane.scrollTop=scroll;ctx.reanchor([root]);mirror();
    }
    live={ctx,refs:()=>refs,root,pane};draw();
    return {anchors:[root],sync(){draw();}};
  }
  env.widget({task:'use-bank',site:'base',name:'classic',split:'train',scenarios:['paybill','schedule','categorise','dispute','limits'],render,
    locate(t){const el=live.refs()[JSON.stringify(t)];if(!el)throw new Error(`use-bank target not rendered: ${JSON.stringify(t)}`);return live.ctx.util.center(el);}});
})();
