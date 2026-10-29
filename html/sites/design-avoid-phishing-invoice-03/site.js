// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      document.body.dataset.invoiceInstruction = display;
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const titlebar = util.el('div', 'invoice-titlebar', document.body);
      util.el('strong', 'invoice-heading', titlebar, 'ACCOUNTS PAYABLE');
      util.el('span', 'invoice-clock', titlebar, 'Mon, Apr 28, 2025　　10:14 AM');
      const stats = util.el('div', 'invoice-stats', document.body);
      for (const [name, value, note] of [['INVOICES','12','Pending review'],['ON HOLD','3','Requires attention'],['APPROVED','28','Awaiting payment'],['VENDORS','142','Active vendor records']]) {
        const cell = util.el('section', 'invoice-stat', stats);
        util.el('div', 'invoice-stat-label', cell, name);
        util.el('strong', 'invoice-stat-value', cell, value);
        util.el('span', 'invoice-stat-note', cell, note);
      }
      const menu = util.el('nav', 'invoice-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Records', 'Tools', 'Help']) util.el('span', '', menu, item);
      const toolbar = util.el('div', 'invoice-toolbar', document.body);
      for (const [icon, label] of [['▤','New'],['📁','Open'],['↩','Reply'],['➜','Forward'],['✖','Delete'],['▣','Print'],['⌁','Attach'],['⟳','Refresh']]) {
        const tool = util.el('span', 'invoice-tool', toolbar);
        util.el('b', '', tool, icon); util.el('span', '', tool, label);
      }
      Object.assign(_c, { collide, cr, decoys, label, menu, nav, placement, sidebar, stats, titlebar, toolbar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        rng.pick(TITLES); // preserve the sibling site's seeded frame draw
      }
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      S.frameSidebar(_c, body);
      Object.assign(_c, { body });
    },
  };

  env.site({
    name: 'design-avoid-phishing-invoice-03',
    template: 'site/base',
    design: { parts },
  });
})();
