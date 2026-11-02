// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { label, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const rail = util.el('aside', 'pine-rail', document.body);
      util.el('div', 'pine-mark', rail, '♠');
      util.el('div', 'pine-name', rail, 'Pine & Rowan');
      const railItems = [['⌂', 'Home'], ['⌕', 'Products'], ['▤', 'Orders'], ['◆', 'Saved'], ['⚙', 'Settings']];
      railItems.forEach(([icon, label], i) => {
        const item = util.el('div', `pine-link${i === 1 ? ' active' : ''}`, rail);
        util.el('span', 'pine-icon', item, icon);
        util.el('span', '', item, label);
      });
      const brand = util.el('div', 'ref-brand', header, 'Pine & Rowan');
      brand.dataset.role = 'brand';
      util.el('span', 'ref-brand-sub', header, 'OUTDOOR GOODS');
      Object.assign(_c, { brand, header, rail, railItems });
    },
  };

  env.site({
    name: 'design-recall-info-compare-03',
    template: 'site/base',
    design: { parts },
  });
})();
