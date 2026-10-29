// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.stage': (base, S) => function (_c) {
      const body = _c.body;
      const workspace = _c.util.el('div', 'xp-workspace', body);
      _c.util.el('div', 'xp-banner', workspace, '✈  SkyWay Travel');
      _c.body = workspace;
      base(_c);
      _c.body = body;
    },
    'frame.header': (base, S) => function (_c) {
      const { rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const menu = util.el('div', 'xp-menu', document.body, 'File　 Edit　 View　 Tools　 Help');
      const tabs = util.el('div', 'xp-tabs', document.body);
      for (const [icon, text] of [['⌂','Home'],['✈','Flights'],['▰','Hotels'],['🚘','Cars'],['▧','Manage Booking'],['🌐','My Trips']]) {
        const tab = util.el('div', text === 'Manage Booking' ? 'xp-tab active' : 'xp-tab', tabs);
        util.el('span', 'xp-tab-icon', tab, icon);
        util.el('span', '', tab, text);
      }
      if (true) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'SkyWay Travel');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header, menu, tabs });
    },
  };

  env.site({
    name: 'design-use-travel-change-03',
    template: 'site/base',
    design: { parts },
  });
})();
