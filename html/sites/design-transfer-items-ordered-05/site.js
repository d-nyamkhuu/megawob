// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      document.body.classList.toggle('mac-header-note', display === 'header');
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Project Management');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const sidebar = util.el('aside', 'mac-sidebar', body);
      util.el('div', 'traffic-lights', sidebar, '');
      const paths = {
        Products:'<rect x="4" y="8" width="20" height="19" rx="2"/><path d="M9 9V6a5 5 0 0 1 10 0v3"/>',
        Orders:'<path d="M6 2h12l5 5v20H6zM18 2v6h5M10 13h9M10 18h9M10 23h6"/>',
        Customers:'<circle cx="11" cy="9" r="4"/><path d="M3 25v-3a8 8 0 0 1 16 0v3zM21 5a4 4 0 0 1 0 8m1 5a6 6 0 0 1 4 6"/>',
        Marketing:'<path d="M4 12h5l15-7v18L9 16H4zM9 16l2 10h5l-3-9"/>',
        Analytics:'<path d="M5 25v-7M12 25V11M19 25V5M26 25V2"/>',
        Catalog:'<path d="M3 14 14 3h12v12L15 26z"/><circle cx="21" cy="8" r="1.5"/>',
        Bundles:'<path d="m3 9 11-6 11 6-11 6zM3 15l11 6 11-6M3 21l11 6 11-6"/>',
        Inventory:'<path d="m14 2 11 6v13l-11 6-11-6V8zM3 8l11 6 11-6M14 14v13"/>',
        Suppliers:'<path d="M3 7h14v14H3zM17 12h5l4 5v4h-9z"/><circle cx="8" cy="22" r="2"/><circle cx="22" cy="22" r="2"/>',
        Settings:'<circle cx="14" cy="14" r="4"/><path d="m11 2-1 3-3 1-3-1-2 4 2 2v6l-2 2 2 4 3-1 3 1 1 3h6l1-3 3-1 3 1 2-4-2-2v-6l2-2-2-4-3 1-3-1-1-3z"/>'
      };
      const icon = label => `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[label]}</svg>`;
      const nav = ['Products','Orders','Customers','Marketing','Analytics','Catalog','Bundles','Inventory','Suppliers','Settings'];
      nav.forEach((label,i) => { if (i===5||i===9) util.el('div','nav-rule',sidebar); const row=util.el('div','mac-nav'+(label==='Bundles'?' current':''),sidebar); util.el('span','nav-icon',row).innerHTML=icon(label); util.el('span','mac-nav-label',row,label); });
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'ref-inspector', body);
      util.el('span','help-icon',inspector,'i');
      util.el('h2', '', inspector, 'About bundle items');
      util.el('p','',inspector,'Add products to this bundle by selecting items on the left and moving them to the right.');
      util.el('p','',inspector,'You can also double-click an item or drag it to the other list.');
      util.el('p','',inspector,'Use the Up and Down buttons to change the order of items in the bundle.');
      const dock=util.el('nav','mac-dock',body);
      for (const label of ['Products','Orders','Customers','Analytics']) { const item=util.el('div','dock-item'+(label==='Products'?' active':''),dock); util.el('span','dock-icon',item).innerHTML=icon(label); util.el('span','dock-label',item,label); }
      Object.assign(_c, { inspector, sidebar, stage });
    },
  };

  env.site({
    name: 'design-transfer-items-ordered-05',
    template: 'site/base',
    design: { parts },
  });
})();
