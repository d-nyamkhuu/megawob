// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
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
      util.el('span', 'invoice-appicon', titlebar, '▣');
      util.el('strong', '', titlebar, 'Riverton & Co. — Accounting');
      const win = util.el('div', 'invoice-window-controls', titlebar);
      for (const mark of ['−', '□', '×']) util.el('span', '', win, mark);
      const menu = util.el('nav', 'invoice-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Records', 'Tools', 'Help']) util.el('span', '', menu, item);
      const toolbar = util.el('div', 'invoice-toolbar', document.body);
      for (const [icon, label] of [['▤','New'],['📁','Open'],['↩','Reply'],['➜','Forward'],['✖','Delete'],['▣','Print'],['⌁','Attach'],['⟳','Refresh']]) {
        const tool = util.el('span', 'invoice-tool', toolbar);
        util.el('b', '', tool, icon); util.el('span', '', tool, label);
      }
      Object.assign(_c, { collide, cr, decoys, label, menu, nav, placement, sidebar, titlebar, toolbar, wantFooter, win });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const records = util.el('aside', 'invoice-records', body);
      util.el('div', 'invoice-record-filter', records, 'All Invoices　⌄');
      util.el('div', 'invoice-record-heading', records, 'Ref');
      // Decorative index entries must not identify or highlight the goal's invoice.
      for (let n = 9406; n <= 9415; n++) {
        const row = util.el('div', 'invoice-record', records);
        util.el('span', '', row, '▤'); util.el('span', '', row, `CASE-${n}`);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, records });
    },
  };

  env.site({
    name: 'design-avoid-phishing-invoice-01',
    template: 'site/base',
    design: { parts },
  });
})();
