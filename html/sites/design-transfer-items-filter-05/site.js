// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const ST = 'stroke="#27305a" stroke-width="2" stroke-linejoin="round"';
  const ICONS = {
    Catalog: `<path ${ST} fill="#5f86bd" d="M3 9h10l3 3h13v15H3z"/><path ${ST} fill="#8fb2de" d="M3 27l5-13h24l-5 13z"/>`,
    Orders: `<path ${ST} fill="#eef0fa" d="M7 3h13l6 6v20H7z"/><path ${ST} fill="none" d="M11 14h11M11 19h11M11 24h11"/>`,
    Customers: `<circle ${ST} cx="10" cy="9" r="4" fill="#8fb2de"/><circle ${ST} cx="22" cy="9" r="4" fill="#8fb2de"/><path ${ST} fill="#5f86bd" d="M3 28v-10q0-5 7-5t7 5v10zM16 28v-10q0-5 7-5t7 5v10z"/>`,
    Suppliers: `<path ${ST} fill="#8fb2de" d="M2 8h18v16H2zM20 13h7l4 5v6H20z"/><circle ${ST} cx="9" cy="25" r="3" fill="#27305a"/><circle ${ST} cx="25" cy="25" r="3" fill="#27305a"/>`,
    Reports: `<path ${ST} fill="#5f86bd" d="M4 18h6v11H4zM13 8h6v21h-6zM22 13h6v16h-6z"/>`,
    Administration: `<circle ${ST} cx="16" cy="16" r="9" fill="#8fb2de" stroke-dasharray="4 2"/><circle ${ST} cx="16" cy="16" r="4" fill="#b5bad4"/>`,
    Products: `<path ${ST} fill="#8fb2de" d="M16 3l11 6v13l-11 7-11-7V9z"/><path ${ST} fill="none" d="M5 9l11 6 11-6M16 15v14"/>`,
    Bundles: `<path ${ST} fill="#8fb2de" d="M10 3l7 4v8l-7 4-7-4V7zM22 13l7 4v8l-7 4-7-4v-8z"/>`,
    Categories: `<path ${ST} fill="#5f86bd" d="M3 7h10l3 3h13v17H3z"/>`,
    'Price Lists': `<path ${ST} fill="#eef0fa" d="M7 3h18v26H7z"/><path ${ST} fill="none" d="M11 10h10M11 15h10M11 20h10"/>`,
  };
  const icon = (parent, name) => {
    const i = document.createElement('i');
    i.className = 'gtk-ico';
    i.innerHTML = `<svg viewBox="0 0 32 32" width="100%" height="100%">${ICONS[name]}</svg>`;
    parent.appendChild(i);
  };
  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const appTitle = util.el('div', 'gtk-titlebar', document.body);
      document.body.insertBefore(appTitle, header);
      util.el('span', 'gtk-app-icon', appTitle, '▽');
      util.el('strong', 'gtk-title', appTitle, 'Inventory Manager');
      util.el('strong', 'gtk-title sub', appTitle, '—  Product Catalog');
      const win = util.el('div', 'gtk-window-controls', appTitle);
      for (const mark of ['_', '□', '×']) util.el('span', 'gtk-window-control', win, mark);
      const tabs = util.el('nav', 'gtk-tabs', document.body);
      document.body.insertBefore(tabs, header);
      for (const [i, item] of ['Catalog', 'Orders', 'Customers', 'Suppliers', 'Reports', 'Administration'].entries()) {
        const t = util.el('span', i === 0 ? 'gtk-tab active' : 'gtk-tab', tabs);
        icon(t, item);
        util.el('span', '', t, item);
      }
      const side = util.el('aside', 'sgi-side', document.body);
      for (const [i, item] of ['Products', 'Bundles', 'Categories', 'Price Lists'].entries()) {
        const s = util.el('div', i === 0 ? 'sgi-item active' : 'sgi-item', side);
        icon(s, item);
        util.el('span', '', s, item);
      }
      const logo = util.el('div', 'sgi-logo', side);
      logo.innerHTML = '<svg viewBox="0 0 32 32" width="34" height="34"><path stroke="#2d3358" stroke-width="2" fill="none" d="M16 2l12 7v14l-12 7-12-7V9zM16 2v28M4 9l24 14M28 9L4 23"/></svg><span>silicon graphics</span>';
      S.frameBrand(_c, header);
      Object.assign(_c, { appTitle, header, tabs, win });
    },
  };

  env.site({
    name: 'design-transfer-items-filter-05',
    template: 'site/base',
    design: { parts },
  });
})();
