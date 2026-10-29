// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebarDraw = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      const sidebar = false;
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, local, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const title = rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'City Health Centre  -  Appointment Booking');
      brand.dataset.role = 'brand';
      brand.setAttribute('aria-label', word ? word(lr.pick(K.brand)) : title);
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const navItems = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const tabNames = ['Appointments', 'Patients', 'Services', 'Staff', 'Reports'];
        for (const i of [0, 1, 2, 3, 4]) {
          const item = navItems[i] || content.NAV_ITEMS[i];
          const a = util.el('a', 'ref-navlink', n, tabNames[i] || item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { brand, header, title });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const pagehead = util.el('div', 'ref-pagehead', header);
      util.el('div', 'ref-page-title', pagehead, 'New Appointment');
      const stats = util.el('aside', 'ref-stats', pagehead);
      util.el('div', 'ref-stats-title', stats, "Today's Appointments");
      for (const [key, value] of [['Scheduled:', '12'], ['Completed:', '7'], ['Remaining:', '5']]) {
        const row = util.el('div', 'ref-stats-row', stats);
        util.el('span', '', row, key);
        util.el('span', '', row, value);
      }
      Object.assign(_c, { pagehead, stats });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-recall-info-code-01',
    template: 'site/base',
    design: { parts },
  });
})();
