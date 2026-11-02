// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.nav': (base, S) => function (_c) {
      const { content, header, local, nav, rng, util } = _c;
      const { K } = S;
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav); // preserve the original draws; this app uses fixed document tabs
        for (const item of ['Documents', 'Shared With Me', 'Starred', 'Recent', 'Trash']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      if (!nav) {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of ['Documents', 'Shared With Me', 'Starred', 'Recent', 'Trash']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (true) {
        const side = util.el('aside', 'ref-side', body);
        util.el('div', 'mac-side-title', side, 'Documents');
        local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav); // retain the original frame draws
        const folders = [['All Documents','24'],['My Documents','6'],['Shared with Me','4'],['Recent','8'],['Starred','2'],['Trash','1']];
        for (const [item, count] of folders) {
          const a = util.el('a', 'ref-sidelink', side);
          util.el('span', '', a, item);
          util.el('span', 'mac-count', a, count);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
        util.el('div', 'mac-team-title', side, '♧　Teams');
        for (const [team, count] of [['HR','8'],['Finance','6'],['Operations','5'],['Marketing','4']]) {
          const a = util.el('a', 'ref-sidelink mac-team-link', side);
          util.el('span', '', a, team);
          util.el('span', 'mac-count', a, count);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: team }); });
        }
        util.el('div', 'mac-team-rule', side);
        const summary = util.el('div', 'mac-summary', side);
        util.el('strong', '', summary, 'Storage');
        util.el('div', '', summary, '18 MB of 100 MB used');
        util.el('div', 'mac-meter', summary);
      }
      Object.assign(_c, { body });
    },
    'frame.footer': (base, S) => function (_c) {
      const { util } = _c;
      base(_c);
      const dock = util.el('nav', 'mac-dock', document.body);
      for (const [icon, text] of [['▤','Documents'],['✉','Mail'],['▦','Calendar'],['♙','Contacts'],['☷','Tasks']]) {
        const item = util.el('span', 'mac-dock-item', dock);
        util.el('b', '', item, icon);
        util.el('span', '', item, text);
      }
      Object.assign(_c, { dock });
    },
  };

  env.site({
    name: 'design-protect-privacy-share-03',
    template: 'site/base',
    design: { parts },
  });
})();
