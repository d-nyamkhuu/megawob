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
      const windowBar = util.el('div', 'carbon-windowbar', document.body);
      util.el('span', 'carbon-appmark', windowBar, '◉');
      util.el('span', 'carbon-windowtitle', windowBar, 'Acme Logistics - Orders');
      const winControls = util.el('div', 'carbon-window-controls', windowBar);
      util.el('span', 'carbon-win-min', winControls, '−');
      util.el('span', 'carbon-win-max', winControls, '□');
      util.el('span', 'carbon-win-close', winControls, '×');
      const menu = util.el('nav', 'carbon-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', '', menu, item);
      Object.assign(_c, { collide, cr, decoys, label, menu, nav, placement, sidebar, wantFooter, winControls, windowBar });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'carbon-inspector', body);
      util.el('div', 'carbon-inspector-title', inspector, 'Order Details');
      const details = util.el('div', 'carbon-inspector-fields', inspector);
      for (const label of ['Order #', 'Date', 'Customer', 'Ship To', 'Status', 'Total']) {
        const row = util.el('div', 'carbon-inspector-field', details);
        util.el('span', '', row, label);
        util.el('span', '', row, '—');
      }
      const shipping = util.el('section', 'carbon-inspector-section', inspector);
      util.el('div', 'carbon-inspector-label', shipping, 'Shipping Address');
      util.el('div', 'carbon-inspector-dash', shipping, '—');
      const items = util.el('section', 'carbon-inspector-section', inspector);
      util.el('div', 'carbon-inspector-label', items, 'Items (0)');
      util.el('div', 'carbon-inspector-empty', items, 'No order selected');
      const notes = util.el('section', 'carbon-inspector-section', inspector);
      util.el('div', 'carbon-inspector-label', notes, 'Notes');
      util.el('div', 'carbon-inspector-empty', notes, 'No order selected');
      Object.assign(_c, { details, inspector, items, notes, shipping, stage });
    },
  };

  env.site({
    name: 'design-use-data-grid-bulk-04',
    template: 'site/base',
    design: { parts },
  });
})();
