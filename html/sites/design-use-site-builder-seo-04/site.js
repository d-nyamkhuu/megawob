// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const title = rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Skyline CMS');
      brand.dataset.tagline = '';
      brand.dataset.role = 'brand';
      if (nav || true) {
        const n = util.el('nav', 'ref-nav', header);
        const navItems = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const cmsNav = ['Content', 'Media', 'Campaigns', 'Social', 'Analytics', 'Settings'];
        for (const [i, item] of cmsNav.entries()) {
          const a = util.el('a', `ref-navlink ref-nav-${i}`, n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      const globalSearch = util.el('input', 'ref-global-search', header);
      globalSearch.type = 'text';
      globalSearch.placeholder = '⌕   Search content…';
      globalSearch.readOnly = true;
      Object.assign(_c, { brand, globalSearch, header, title });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const records = util.el('aside', 'ref-records', body);
      util.el('h2', 'ref-records-title', records, 'Pages (12)');
      const search = util.el('input', 'ref-records-search', records);
      search.type = 'text';
      search.placeholder = '⌕   Search pages…';
      search.readOnly = true;
      const rows = util.el('div', 'ref-record-rows', records);
      const pages = [
        ['Weekend in Riverton', '/weekend-in-riverton', 'Draft'], ['Summer Events', '/events', 'Published'],
        ['Riverton Food Guide', '/food-guide', 'Published'], ['Outdoor Adventures', '/outdoor-adventures', 'Draft'],
        ['Plan Your Visit', '/plan-your-visit', 'Published'], ['Arts and Culture', '/arts-and-culture', 'Published'],
        ['Sustainable Travel', '/sustainable-travel', 'Draft'], ['Getting Around', '/getting-around', 'Published'],
      ];
      pages.forEach(([title, slug, status], i) => {
        const row = util.el('div', `ref-record${i === 0 ? ' ref-record-selected' : ''}`, rows);
        const thumb = util.el('div', `ref-record-thumb ref-thumb-${i}`, row);
        const copy = util.el('div', 'ref-record-copy', row);
        util.el('strong', '', copy, title);
        util.el('span', 'ref-record-slug', copy, slug);
        util.el('span', `ref-record-status${status === 'Published' ? ' is-published' : ''}`, copy, status);
        util.el('span', 'ref-record-more', row, '•••');
      });
      Object.assign(_c, { pages, records, rows, search, stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-site-builder-seo-04',
    template: 'site/base',
    design: { parts },
  });
})();
