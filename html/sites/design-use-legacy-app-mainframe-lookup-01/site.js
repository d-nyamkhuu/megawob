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
      // Keep the reference design single-purpose, while consuming the same seeded draws.
      rng.bool(0.35);
      const sidebar = false;
      rng.bool(0.5);
      const nav = false;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'legacy-inspector', body);
      util.el('div', 'legacy-inspector-title', inspector, 'System Status');
      util.el('div', 'legacy-inspector-rule', inspector);
      for (const line of ['Date: 03/14/1993', 'Time: 10:27:18', 'User: JSMITH', 'Terminal: T102', 'Company: FEI']) {
        util.el('div', 'legacy-inspector-line', inspector, line);
      }
      util.el('div', 'legacy-inspector-rule', inspector);
      for (const line of ['Accounts: 12,482', 'Customers: 3,917', 'Open Items: 8,205']) {
        util.el('div', 'legacy-inspector-line', inspector, line);
      }
      Object.assign(_c, { inspector, stage });
    },
  };

  env.site({
    name: 'design-use-legacy-app-mainframe-lookup-01',
    template: 'site/base',
    design: { parts },
  });
})();
