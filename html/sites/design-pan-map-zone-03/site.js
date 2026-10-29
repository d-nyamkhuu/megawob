// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      util.el('span', 'irix-menu', header, '☰');
      const brand = util.el('div', 'ref-brand', header, 'City Delivery Planner');
      brand.dataset.role = 'brand';
      Object.assign(_c, { header });
    },
    'frame.nav': () => function () {},
    'frame.placement': (base) => function (_c) {
      base(_c);
      if (_c.placement === 'floating') { _c.placement = 'footer'; _c.wantFooter = true; }
      if (!_c.ctx.finish && _c.rng.fork('irix/end').bool(0.55)) {
        _c.placement = 'header';
        _c.label = 'Save';
      }
    },
    'frame.tools': () => function (_c) {
      const { util, header, collide, decoyBtn, endBtn, label, placement } = _c;
      const headerTools = util.el('div', 'ref-tools', header);
      if (collide && (collide.where === 'header' || !_c.wantFooter)) decoyBtn(headerTools, collide.text, true);
      let submit = null;
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      const win = util.el('div', 'irix-window-controls', header);
      for (const [label, icon] of [['Minimize', '—'], ['Maximize', '□'], ['Close', '×']]) {
        const b = util.el('button', 'irix-window-button', win, icon);
        b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      Object.assign(_c, { body });
    },
  };

  env.site({
    name: 'design-pan-map-zone-03',
    template: 'site/base',
    design: { parts },
  });
})();
