// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      _c.navDraw = _c.nav;
      _c.nav = true;
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.dataset.appTitle = 'Pinecrest Goods';
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Pinecrest Goods');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const navItems = rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of local([...navItems, ...content.NAV_ITEMS].slice(0, 5), K.nav)) {
          const labels = ['Home', 'Shop', 'Orders', 'Addresses', 'Settings'];
          const shown = labels[n.children.length] || item;
          const a = util.el('a', 'ref-navlink', n, shown);
          a.dataset.icon = ['⌂', '🛒', '▣', '▤', '⚙'][n.children.length - 1] || '•';
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-protect-privacy-autofill-04',
    template: 'site/base',
    design: { parts },
  });
})();
