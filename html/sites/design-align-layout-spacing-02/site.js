// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['Project Planner'];

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      Object.assign(_c, { sidebar: _c.roomy, nav: _c.W >= 1180 });
    },
    'frame.header': (base, S) => function (_c) {
      const { W, content, local, lr, nav, rng, util, word } = _c;
      const { K } = S;
      const header = util.el('header', 'ref-task', document.body);
      {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      }
      if (nav || W >= 1180) {
        const n = util.el('nav', 'ref-nav', header);
        const navItems = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const plannerTabs = ['Overview', 'Timeline', 'Board', 'Design'];
        for (const [i, label] of plannerTabs.entries()) {
          const a = util.el('a', 'ref-navlink', n, label);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        for (const item of ['Website Redesign', 'Mobile App', 'Marketing Site', 'Internal Tools', 'Images', 'Documents', 'Templates', 'Members', 'Activity']) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      if (!_c.wantFooter) {
        _c.util.el('footer', 'ref-foot ref-foot-empty', document.body);
      }
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-align-layout-spacing-02',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
