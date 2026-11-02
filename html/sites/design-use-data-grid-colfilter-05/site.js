// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('next-titlebar');
      const menu = util.el('button', 'next-menu', header, '☰');
      menu.type = 'button'; menu.setAttribute('aria-label', 'Application menu');
      util.el('div', 'next-window-title', header, 'Ticket Tracker');
      const controls = util.el('div', 'next-window-controls', header);
      for (const glyph of ['−', '↗', '×']) util.el('span', 'next-window-control', controls, glyph);
      const brand = S.frameBrand(_c, header);
      if (brand) brand.hidden = true;
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      body.classList.add('next-window-body');
      const inherited = S.frameSidebar(_c, body);
      if (inherited) inherited.remove();
      const panel = util.el('aside', 'next-customers', body);
      util.el('div', 'next-pane-title', panel, 'Customers');
      const search = util.el('div', 'next-customer-search', panel);
      util.el('span', '', search, '⌕');
      util.el('span', '', search, 'Search customers');
      const names = ['Acme Corporation','Beta Industries','Carter & Co.','Delta Systems','Eastern Bank','Fleet Logistics','Global Media','Helix Instruments','Initech','Jupiter Retail','Kramer & Sons','Lakeside University','Metro Health','Nexus Computing','Orbit Systems','Pioneer Goods','Quantum Co.','Riverside Motors','Summit Energy','Transit Authority'];
      const counts = [12,8,4,10,6,9,7,5,11,3,8,6,4,9,5,7,4,6,8,3];
      const list = util.el('div', 'next-customer-list', panel);
      const heading = util.el('div', 'next-customer-head', list);
      util.el('span', '', heading, 'Name'); util.el('span', '', heading, 'Tickets');
      names.forEach((name, i) => {
        const row = util.el('div', `next-customer-row${i === 0 ? ' active' : ''}`, list);
        util.el('span', '', row, name); util.el('span', '', row, String(counts[i]));
      });
      Object.assign(_c, { body });
    },
  };

  env.site({
    name: 'design-use-data-grid-colfilter-05',
    template: 'site/base',
    design: { parts },
  });
})();
