// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const paths = {
    mail: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 6 9 7 9-7"/>',
    document: '<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h6"/>',
    people: '<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3zM16 4a3 3 0 0 1 0 6M18 14c3 0 4 2 4 5v2"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="1"/><path d="M7 2v6M17 2v6M3 10h18M7 14h2M12 14h2M7 18h2M12 18h2"/>',
    chat: '<path d="M21 11a9 8 0 0 1-12 8l-6 3 2-6A9 8 0 1 1 21 11Z"/><path d="M7 11h1M11 11h1M15 11h1"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/>',
    star: '<path d="m12 3 3 6 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z"/>',
    trash: '<path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7"/>',
    clip: '<path d="m9 16 7-7a3 3 0 0 0-4-4L4 13a5 5 0 0 0 7 7l9-9a7 7 0 0 0-10-10L2 9"/>',
    payment: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M6 13h5M6 16h3M15 13h3"/>',
    book: '<path d="M12 5C9 2 5 3 2 4v16c4-2 7-1 10 1 3-2 6-3 10-1V4c-3-1-7-2-10 1ZM12 5v16M5 3V1h4l3 2 3-2h4v2"/>',
    search: '<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
    logo: '<rect x="8" y="1" width="8" height="8" rx="2"/><rect x="1" y="8" width="8" height="8" rx="2"/><rect x="15" y="8" width="8" height="8" rx="2"/><rect x="8" y="15" width="8" height="8" rx="2"/><path d="M8 8h8v8H8z"/>',
  };
  function icon(util, parent, name) {
    const el = util.el('span', 'wh-icon', parent);
    el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths[name] + '</svg>';
    return el;
  }

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      document.body.classList.toggle('finance-has-header-note', display === 'header');
      document.body.classList.toggle('wh-panel-note', display === 'panel');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const title = util.el('div', 'wh-titlebar', document.body);
      icon(util, title, 'logo').classList.add('wh-logo'); util.el('strong', '', title, 'WorkHub');
      util.el('span', 'wh-window-controls', title, '−　▢　×');
      const menu = util.el('nav', 'wh-menubar', document.body);
      for (const label of ['File','Edit','View','Go','Tools','Window','Help']) util.el('span', '', menu, label);
      const toolbar = util.el('div', 'wh-toolbar', document.body);
      for (const [symbol,label,active] of [['mail','Mail',false],['document','Documents',true],['people','Accounts Payable',false],['calendar','Calendar',false],['chat','Chat',false]]) {
        const item=util.el('span',active?'wh-tool active':'wh-tool',toolbar); icon(util,item,symbol); util.el('span','',item,label);
      }
      const search=util.el('div','wh-search',toolbar); icon(util,search,'search'); util.el('span','',search,'Search (Ctrl+K)');
      toolbar.appendChild(_c.headerTools);
      _c.header.querySelectorAll('.ref-brand,.ref-nav,.ref-spacer').forEach(el => el.remove());
      body.querySelectorAll('.ref-side').forEach(el => el.remove());
      const work=util.el('div','wh-workspace',body);
      const nav=util.el('aside','wh-nav',work); util.el('h3','',nav,'Documents');
      for (const [symbol,label,active,count] of [['document','All Documents',true,''],['document','Pending Review',false,'3'],['check','Completed',false,'12'],['star','Starred',false,''],['trash','Trash',false,'']]) {
        const row=util.el('div',active?'wh-navrow active':'wh-navrow',nav); icon(util,row,symbol);util.el('span','',row,label); if(count)util.el('i','',row,count);
      }
      const caseCol=util.el('aside','wh-case',work);
      util.el('b','',caseCol,'Case'); util.el('h2','',caseCol,'CASE-8149');
      for(const [k,v] of [['Type','Vendor Invoice'],['Vendor','Riverside Supply Co.'],['Date Received','Apr 22, 2024'],['Amount','$12,480.00']]) {const r=util.el('div','wh-detail',caseCol);util.el('span','',r,k);util.el('strong','',r,v);}
      const status=util.el('div','wh-detail wh-status-row',caseCol); util.el('span','',status,'Status'); util.el('strong','wh-status',status,'In Review');
      const actionSlot=util.el('div','wh-case-actions',caseCol);
      const related=util.el('section','wh-case-related',caseCol); util.el('b','',related,'Related');
      for(const [symbol,label] of [['mail','Email Thread (3)'],['clip','Attachments (2)'],['payment','Accounts Payable'],['chat','Internal Chat (1)'],['calendar','Calendar (0)']]) {
        const row=util.el('div','wh-related-row',related); icon(util,row,symbol); util.el('span','',row,label);
      }
      const stage=util.el('main','ref-stage',work); S.frameAlign(_c,stage);
      const help=util.el('aside','wh-help',work); const helpTitle=util.el('h3','',help); icon(util,helpTitle,'book'); util.el('span','',helpTitle,'Help & Tips');
      util.el('b','',help,'Review documents'); util.el('p','',help,'Check the document details, verify the amounts and dates, and review any related emails or attachments.');
      util.el('hr','',help); util.el('b','',help,'Common checks');
      const checks=util.el('ul','',help);
      for(const line of ['Make sure the vendor and invoice details match supporting documents.','Confirm the amounts and due date.','Review related emails for context.','Check for approvals or internal notes.']) util.el('li','',checks,line);
      util.el('hr','',help); util.el('b','',help,'Mark complete'); util.el('p','',help,'When you have finished reviewing, select Complete review beneath the case reference.');
      util.el('hr','',help); util.el('b','',help,'Related information');
      for(const [symbol,label] of [['mail','View the email thread for this case.'],['clip','Open any attachments.'],['payment','See the linked accounts-payable record.'],['chat','Read internal chat messages.'],['calendar','Check for calendar events or permissions.']]) {
        const row=util.el('div','wh-related-row',help); icon(util,row,symbol); util.el('span','',row,label);
      }
      Object.assign(_c,{stage,toolbar,caseCol,help});
    },
    'frame.end': (base, S) => function (_c) {
      const u = Math.min(1, Math.max(.75, _c.W / 1672));
      const noteHeight = _c.display === 'header' ? _c.header.getBoundingClientRect().height : 0;
      document.body.style.setProperty('--wh-note-height', (noteHeight ? noteHeight + 8 * u : 0) + 'px');
      const dockHeight = _c.wantFooter || _c.placement === 'floating' ? 52 * u : 0;
      document.body.style.setProperty('--wh-bottom', (dockHeight + (_c.display === 'toast' ? 112 * u : 0)) + 'px');
      const toast = document.querySelector('.ref-note');
      if (toast) toast.style.bottom = (dockHeight + 12 * u) + 'px';
      return base(_c);
    },
    overlay: (base, S) => function (ctx) {
      const result = base(ctx);
      if (ctx.kind !== 'promo') return result;
      const { util } = ctx;
      const box = result.el.querySelector('.ref-ov-box');
      const copy = box.querySelector('.ref-ov-text');
      copy.replaceChildren();
      const badge = util.el('div', 'wh-promo-badge', copy); icon(util, badge, 'mail');
      const text = util.el('div', 'wh-promo-copy', copy);
      util.el('h2', '', text, 'Stay in the loop');
      util.el('p', '', text, 'Get product updates, tips, and best practices for WorkHub, delivered to your inbox.');
      const field = util.el('input', 'wh-promo-email', box);
      field.type = 'email'; field.placeholder = 'yourname@company.com'; field.setAttribute('aria-label', 'Email address');
      box.insertBefore(field, box.querySelector('.ref-ov-row'));
      const close = util.el('button', 'wh-promo-close', box, '×');
      close.type = 'button'; close.setAttribute('aria-label', 'Close'); close.addEventListener('click', () => ctx.dismiss('close'));
      return result;
    },
  };

  env.site({
    name: 'design-avoid-phishing-session-05',
    template: 'site/base',
    design: { parts },
  });
})();
