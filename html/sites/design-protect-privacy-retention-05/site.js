// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header);
      brand.dataset.role = 'brand';
      brand.innerHTML = '<svg width="42" height="30" viewBox="0 0 84 60"><defs><linearGradient id="nimbus-cloud" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d8edff"/><stop offset=".55" stop-color="#82bde9"/><stop offset="1" stop-color="#3589d2"/></linearGradient></defs><path d="M14 53C5 53 2 46 3 40c1-7 5-11 12-12 0-8 5-13 12-12C31 3 48 1 58 12c12-3 22 7 20 19 6 4 7 10 3 16-3 5-8 6-16 6z" fill="url(#nimbus-cloud)" stroke="#1675c8" stroke-width="1.5"/><path d="M14 52c10-11 23-13 29-25 4-8 11-13 20-14-9 10-5 19-11 26-6 7-10 10-11 13z" fill="#70b2e4" opacity=".7"/><path d="M39 53c11-6 11-20 24-25 9-4 16 2 18 8 5 14-8 18-19 17z" fill="#3d98da" opacity=".55"/></svg><span>Nimbus <i>Drive</i></span>';
      {
        const ul = util.el('div', 'ref-user', header);
        ul.innerHTML = 'Hello, Taylor Brooks <b>|</b> <a>My Account</a> <b>|</b> <a>Help</a> <b>|</b> <a>Sign Out</a>';
        const sr = util.el('div', 'ref-search', header);
        sr.innerHTML = '<span>Search your files...</span><svg width="20" height="20" viewBox="0 0 20 20"><circle cx="8" cy="8" r="6" fill="none" stroke="#111" stroke-width="2"/><path d="M12.5 12.5L18 18" stroke="#111" stroke-width="2.5"/></svg>';
        const n = util.el('nav', 'ref-nav', header);
        rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['Files', 'Photos', 'Sharing', 'Reviews', 'Polls', 'Account']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { brand, header });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        rng.sample(content.NAV_ITEMS, rng.int(4, 7));
        for (const item of []) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (!foot) return;
      const links = _c.util.el('span', 'nimbus-foot-links', foot);
      for (const [i, label] of ['About Us', 'Privacy', 'Terms', 'Contact'].entries()) {
        if (i) _c.util.el('span', 'nimbus-pipe', links, '|');
        _c.util.el('a', '', links, label);
      }
    },
  };

  env.site({
    name: 'design-protect-privacy-retention-05',
    template: 'site/base',
    design: { parts },
  });
})();
