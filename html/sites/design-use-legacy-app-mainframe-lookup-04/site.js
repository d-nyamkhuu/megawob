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
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const topnav = util.el('nav', 'legacy-topnav', header);
      util.el('div', 'legacy-wordmark', topnav, 'ACME');
      util.el('span', 'legacy-nav-divider', topnav, '│');
      const navLabels = ['Customers', 'Orders', 'Billing', 'Reports', 'Administration'];
      navLabels.forEach((item, i) => {
        const link = util.el('span', `legacy-nav-item${i === 0 ? ' active' : ''}`, topnav, item);
        link.dataset.role = 'nav';
      });
      util.el('div', 'legacy-nav-date', topnav, 'Mon, Apr 18, 2016');
      util.el('span', 'legacy-nav-user', topnav, 'J. Carter  ▼');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, navLabels, topnav });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      stage.addEventListener('input', () => stage.classList.add('legacy-interacted'), true);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'legacy-inspector', body);
      util.el('div', 'legacy-inspector-title', inspector, 'Help');
      util.el('div', 'legacy-inspector-rule', inspector);
      for (const line of ['Enter the number of the inquiry you want to run and press Enter.']) {
        util.el('div', 'legacy-inspector-line', inspector, line);
      }
      util.el('div', 'legacy-inspector-rule', inspector);
      util.el('div', 'legacy-inspector-title', inspector, 'Keys');
      for (const line of ['Enter   Run inquiry', 'F7       Previous menu', 'F8       Next menu', 'F12     Main menu']) {
        util.el('div', 'legacy-inspector-line', inspector, line);
      }
      Object.assign(_c, { inspector, stage });
    },
  };

  env.site({
    name: 'design-use-legacy-app-mainframe-lookup-04',
    template: 'site/base',
    design: { parts },
  });
})();
