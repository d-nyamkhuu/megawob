// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.body': (base, S) => function (_c) {
      const { content, label, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      const side = util.el('aside', 'jh-sidebar', body);
      const brand = util.el('div', 'jh-brand', side);
      util.el('span', 'jh-brand-icon', brand, '▣');
      util.el('b', '', brand, 'JobHub');
      const sideItems = [
        ['⌂', 'Home'], ['⌕', 'Search'], ['▱', 'Saved', '12'], ['▤', 'Applications', '5'],
        ['◯', 'Messages', '3'], ['♙', 'Profile'], ['⚙', 'Settings'], ['ⓘ', 'Help'],
      ];
      for (const [icon, label, count] of sideItems) {
        if (label === 'Settings') util.el('div', 'jh-side-rule', side);
        const a = util.el('a', `jh-side-item${label === 'Search' ? ' active' : ''}`, side);
        a.href = '#';
        util.el('span', 'jh-side-icon', a, icon);
        util.el('span', 'jh-side-label', a, label);
        if (count) util.el('span', 'jh-side-count', a, count);
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label }); });
      }
      const navrow = util.el('div', 'jh-navrow', body);
      const tabs = util.el('nav', 'jh-tabs', navrow);
      for (const [label, active] of [['Jobs', true], ['Companies', false], ['Insights', false], ['Alerts', false]]) {
        const tab = util.el('button', `jh-tab${active ? ' active' : ''}`, tabs, label);
        tab.type = 'button';
        tab.addEventListener('click', () => env.log('decoy', { what: 'nav', label }));
      }
      const search = util.el('div', 'jh-search', navrow);
      util.el('span', 'jh-search-icon', search, '⌕');
      util.el('span', 'jh-search-placeholder', search, 'Search jobs, companies, or keywords');
      if (sidebar) {
        const links = util.el('aside', 'ref-side', side);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav)) {
          const a = util.el('a', 'ref-sidelink', links, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body, brand, navrow, search, side, sideItems, tabs });
    },
  };

  env.site({
    name: 'design-recall-info-paginate-01',
    template: 'site/base',
    design: { parts },
  });
})();
