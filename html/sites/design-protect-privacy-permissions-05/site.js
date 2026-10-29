// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Dialhaven Mobile Support');
      brand.dataset.role = 'brand';
      const search = util.el('div', 'dh-search', header, 'Search tickets...');
      util.el('span', 'dh-search-icon', search, '⌕');
      const menu = util.el('nav', 'dh-menu', header);
      for (const label of ['File', 'Edit', 'View', 'Tickets', 'Tools', 'Help']) util.el('span', '', menu, label);
      const tools = util.el('div', 'dh-tools', header);
      for (const [icon, label] of [['▧','New Ticket'],['↶','Reply'],['♟','Assign'],['◆','Add Tag'],['▰','Move'],['▣','Delete'],['✉','Mark Unread']]) {
        const item = util.el('span', 'dh-tool', tools);
        util.el('b', '', item, icon); util.el('span', '', item, label);
      }
      Object.assign(_c, { brand, header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util, display, ctx } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'ref-inspector', body);
      if (display === 'panel') { const note=util.el('section','dh-instruction-panel',inspector); util.el('b','',note,'Your task'); util.el('div','',note,ctx.instruction); }
      util.el('h2', '', inspector, 'Support Tickets');
      const select = util.el('div', 'dh-select', inspector, 'Open Tickets (24)'); util.el('b', '', select, '▾');
      const tickets = util.el('div', 'dh-tickets', inspector);
      const rows = [['#34821','Voice note not working','Taylor Brooks','10:14 AM'],['#34820','Data sync issue','Jordan Kim','9:47 AM'],['#34819','Cannot send photos','Casey Nguyen','Apr 17'],['#34818','Account recovery','Riley Patel','Apr 17'],['#34817','Billing question','Morgan Lee','Apr 16'],['#34816','App keeps crashing','Alex Carter','Apr 16'],['#34815','Change phone number','Jamie Park','Apr 15'],['#34814','Voicemail not working','Chris Bennett','Apr 15']];
      for (let i=0;i<rows.length;i++) { const row=util.el('div',`dh-ticket${i===0?' active':''}`,tickets); util.el('span','dh-ticket-time',row,rows[i][3]); util.el('strong','',row,rows[i][0]); util.el('div','',row,rows[i][1]); util.el('small','',row,rows[i][2]); }
      if (display === 'toast') { const note=util.el('div','dh-toast',document.body); util.el('span','',note,ctx.instruction); const close=util.el('button','',note,'×'); close.type='button'; close.addEventListener('click',()=>{note.style.visibility='hidden';}); }
      Object.assign(_c, { inspector, stage });
    },
  };

  env.site({
    name: 'design-protect-privacy-permissions-05',
    template: 'site/base',
    design: { parts },
  });
})();
