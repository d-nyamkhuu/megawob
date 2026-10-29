// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['Project Files'];

  const parts = {
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      // This design uses the GNOME Files navigation rail on every episode. Keep the
      // reference frame's conditional random draw intact even though the rail is fixed.
      if (sidebar) local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
      const side = util.el('aside', 'ref-side gnome-rail', body);
      const railItems = ['Recent', 'Starred', 'Home', 'Documents', 'Downloads', 'Pictures', 'Videos', 'Trash', 'Other Locations'];
      for (const item of railItems) {
        const a = util.el('a', 'ref-sidelink', side, item);
        a.dataset.role = 'nav';
        if (item === 'Home') a.classList.add('is-current');
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
      }
      Object.assign(_c, { body, railItems, side });
    },
  };

  env.site({
    name: 'design-use-file-manager-copy-03',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
