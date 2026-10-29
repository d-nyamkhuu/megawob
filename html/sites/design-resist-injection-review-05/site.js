// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function (ctx) {
      const layer = base(ctx);
      if (ctx.kind === 'banner') {
        const header = document.querySelector('.ref-task');
        if (header) layer.el.style.setProperty('--ref-banner-top', `${Math.round(header.getBoundingClientRect().bottom)}px`);
      }
      return layer;
    },
    'frame.header': (base, S) => function (_c) {
      const { content, ctx, display, label, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) rng.pick(TITLES);
      if (nav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
      const titlebar = util.el('div', 'ref-titlebar', header);
      util.el('span', 'ref-app-icon', titlebar, '🖨️');
      const brand = util.el('div', 'ref-brand', titlebar, 'Product Reviews');
      brand.dataset.role = 'brand';
      const win = util.el('div', 'ref-window-buttons', titlebar);
      for (const mark of ['−', '□', '×']) util.el('span', 'ref-window-button', win, mark);
      const toolbar = util.el('div', 'ref-toolbar', header);
      const taskline = util.el('div', 'ref-taskline', header);
      if (display === 'header') util.el('div', 'ref-instruction', taskline, ctx.instruction);
      else util.el('div', 'ref-spacer', taskline);
      Object.assign(_c, { brand, header, n: null, taskline, titlebar, toolbar, win });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, placement, taskline, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', taskline);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
      Object.assign(_c, { body, side: null });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-resist-injection-review-05',
    template: 'site/base',
    design: { parts },
  });
})();
