// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { content, ctx, local, lr, rng, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = false;
      const nav = false;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, header, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      document.body.classList.add('macintosh');
      const menu = util.el('div', 'mac-menu', document.body);
      util.el('span', 'mac-menu-label', menu, '   File     Edit     View     Special');
      util.el('span', 'mac-menu-clock', menu, '?     ▣     10:24 AM');
      document.body.prepend(menu);
      header.classList.add('mac-titlebar');
      const brand = header.querySelector('.ref-brand');
      if (brand) brand.textContent = 'Collection Manager';
      Object.assign(_c, { brand, submit });
    },
  };

  env.site({
    name: 'design-transfer-items-multi-04',
    template: 'site/base',
    design: { parts },
  });
})();
