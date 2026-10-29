// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, local, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      {
        rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Project Navigator');
        brand.dataset.role = 'brand';
      }
      {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const navLabels = ['Home', 'Release Plan', 'Teams', 'Tasks', 'Milestones', 'Reports'];
        for (const [index, item] of navLabels.entries()) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          if (index === 1) a.style.textDecoration = 'underline';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: sampledNav[index % sampledNav.length] || item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-project-board-swimlane-01',
    template: 'site/base',
    design: { parts },
  });
})();
