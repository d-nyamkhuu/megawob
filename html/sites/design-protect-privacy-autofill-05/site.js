// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base) => function (_c) {
      base(_c);
      _c.navDraw = _c.nav;
      _c.nav = true;
    },
    'frame.footer': (base) => function (_c) {
      base(_c);
      const status = document.querySelector('.ref-foot-text');
      if (status) status.textContent = 'ShopWorld · Ready';
      const foot = document.querySelector('.ref-foot');
      if (foot) _c.body.append(foot);
    },
    'frame.floating': (base) => function (_c) {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.body.append(dock);
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
        _c.pineNav = n;
        const navItems = rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of local([...navItems, ...content.NAV_ITEMS].slice(0, 4), K.nav)) {
          const labels = ['Cart', 'Delivery Address', 'Payment', 'Review'];
          const shown = labels[n.children.length] || item;
          const a = util.el('a', 'ref-navlink', n, shown);
          a.dataset.icon = ['cart', 'home', 'card', 'page'][n.children.length - 1] || 'page';
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.body': (base) => function (_c) {
      base(_c);
      const side = _c.body.querySelector('.ref-side');
      _c.body.prepend(_c.pineNav);
      if (side) _c.pineNav.append(side);
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-protect-privacy-autofill-05',
    template: 'site/base',
    design: { parts },
  });
})();
