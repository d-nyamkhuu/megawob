// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, roomy, tall } = _c;
      // This compact frame has room for its status bar at every viewport.
      Object.assign(_c, { W: 0, roomy: false, tall: true });
      base(_c);
      Object.assign(_c, { W, roomy, tall });
    },
    'frame.footer': (base) => function (_c) {
      base(_c);
      const status = document.querySelector('.ref-foot-text');
      if (status) status.textContent = 'Ready';
    },
    'frame.floating': (base, S) => function (_c) {
      base(_c);
      const { header, util } = _c;
      document.body.classList.add('macintosh');
      const menu = util.el('div', 'mac-menu', document.body);
      util.el('span', 'mac-menu-label', menu, '   File     Edit     View     Special');
      util.el('span', 'mac-menu-clock', menu, '?     ▣     10:24 AM');
      document.body.prepend(menu);
      header.classList.add('mac-titlebar');
      const brand = header.querySelector('.ref-brand');
      if (brand) brand.textContent = 'Collection Manager';
      Object.assign(_c, { brand });
    },
  };

  env.site({
    name: 'design-transfer-items-multi-04',
    template: 'site/base',
    design: { parts },
  });
})();
