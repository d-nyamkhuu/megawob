// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const brand = util.el('div', 'ref-brand', header, 'Riverton Public Library');
      brand.dataset.role = 'brand';
      util.el('span', 'ref-brand-sub', header, 'CATALOGUE');
      Object.assign(_c, { brand, header });
    },
    'frame.body': (base, S) => function (_c) {
      base(_c);
      const index = _c.util.el('aside', 'shop-index');
      const records = _c.util.el('div', 'shop-records', index);
      records.textContent = '▣  Products\n\n  ▤  All Products              5\n  ▣  Electronics                 2\n  ⌂  Home & Living             1\n  ♧  Outdoor                      1\n  ♧  Accessories                 1\n\n  ♡  Saved Items                 0\n  ♡  Recently Viewed           0';
      for (const child of Array.from(_c.body.children)) index.appendChild(child);
      _c.body.prepend(index);
      _c.shopIndex = index;
    },
    'frame.panel': (base, S) => function (_c) {
      base(_c);
      const panel = Array.from(_c.body.children).find(child => child.classList.contains('ref-panel'));
      if (panel) _c.shopIndex.prepend(panel);
    },
  };

  env.site({
    name: 'design-recall-info-compare-04',
    template: 'site/base',
    design: { parts },
  });
})();
