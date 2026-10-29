// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const menu = util.el('div', 'lisa-menu-bar', header);
      util.el('span', 'lisa-menu-icon', menu, '✣');
      util.el('strong', 'lisa-menu-app', menu, 'Meridian Travel');
      for (const item of ['File','Edit','View','Bookings','Tools','Help']) util.el('span','lisa-menu-item',menu,item);
      util.el('span','lisa-menu-spacer',menu);
      util.el('span','lisa-menu-date',menu,'Mon Apr 16, 1984　10:24 AM');
      util.el('span','lisa-window-controls',menu,'□　▱　×');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menu });
    },
  };

  env.site({
    name: 'design-use-travel-flights-04',
    template: 'site/base',
    design: { parts },
  });
})();
