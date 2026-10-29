// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx, util } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');

      // Community homepage masthead; the legacy toolbar nodes remain inert page frame.
      const masthead = util.el('header', 'community-masthead', document.body);
      util.el('span', 'community-tree community-tree-left', masthead);
      const mastcopy = util.el('div', 'community-mastcopy', masthead);
      util.el('div', 'community-title', mastcopy, 'Maple Grove Community');
      util.el('div', 'community-links', mastcopy, 'Neighbors　~　News　~　Groups　~　Local Business');
      util.el('span', 'community-tree community-tree-right', masthead);
      util.el('span', 'community-homes', masthead);
      util.el('div', 'community-motto', masthead, 'A Friendlier\nPlace Online\nSince 1996');
      const titlebar = util.el('div', 'crm-titlebar', document.body);
      util.el('span', 'crm-app-icon', titlebar, '▣');
      util.el('strong', 'crm-app-name', titlebar, 'Customer Manager');
      const winControls = util.el('div', 'crm-window-controls', titlebar);
      for (const [label, glyph] of [['Minimize', '−'], ['Maximize', '□'], ['Close', '×']]) {
        const control = util.el('span', `crm-window-control crm-${label.toLowerCase()}`, winControls, glyph);
        control.setAttribute('aria-label', label);
      }
      const menubar = util.el('nav', 'crm-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Tools', 'Reports', 'Help']) util.el('span', 'crm-menu-item', menubar, item);
      const toolbar = util.el('div', 'crm-toolbar', document.body);
      for (const [icon, label] of [['♙', 'New Contact'], ['✎', 'Edit'], ['⊗', 'Delete'], ['✉', 'Email'], ['☎', 'Call'], ['▤', 'Import'], ['▦', 'Export'], ['▣', 'Print']]) {
        const tool = util.el('div', 'crm-tool', toolbar);
        util.el('span', 'crm-tool-icon', tool, icon);
        util.el('span', 'crm-tool-label', tool, label);
      }
      Object.assign(_c, { H, W, display, mastcopy, masthead, menubar, roomy, tall, titlebar, toolbar, winControls });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const related = util.el('aside', 'community-related', body);
      util.el('div', 'community-panel-title', related, 'Customers');
      const recordList = util.el('div', 'community-record-list', related);
      const customers = ['Alice Johnson', 'Brian Lee', 'Carla Nguyen', 'David Kim', 'Emily Carter', 'Frank Wilson', 'Grace Patel', 'Henry Adams', 'Irene Chen', 'Jack Thompson', 'Karen Brooks', 'Leo Martinez', 'Maya Singh', 'Nathan Price', 'Olivia Baker'];
      customers.forEach((customer, i) => {
        const row = util.el('div', `community-record${i === 0 ? ' active' : ''}`, recordList);
        util.el('span', 'community-people', row, '♟♟');
        util.el('span', 'community-id', row, String(1001 + i));
        util.el('span', '', row, customer);
      });
      const details = util.el('div', 'community-details', related);
      util.el('div', 'community-panel-title', details, 'Customer Details');
      util.el('div', 'community-detail-copy', details, 'Customer ID:　1001\nName:　　　　 Alice Johnson\nEmail:　　　　 alice.johnson@example.com\nPlan:　　　　　Basic\nRegion:　　　　West\nSignup Month:　1996-01\nTotal Spend:　 $120.00');
      Object.assign(_c, { customers, details, recordList, related, stage });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      const dock = util.el('nav', 'community-dock', document.body);
      [['home', 'Home'], ['news', 'News'], ['group', 'Community'], ['calendar', 'Events'], ['directory', 'Directory'], ['folder', 'Customers']].forEach(([icon, text], i) => {
        const item = util.el('div', `community-dock-item${i === 5 ? ' selected' : ''}`, dock);
        util.el('span', `community-dock-icon icon-${icon}`, item);
        util.el('span', '', item, text);
      });
      Object.assign(_c, { dock, submit });
    },
  };

  env.site({
    name: 'design-protect-privacy-export-04',
    template: 'site/base',
    design: { parts },
  });
})();
