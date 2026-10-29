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
      const app = util.el('div', 'app-shell', document.body);
      const rail = util.el('aside', 'app-rail', app);
      const logo = util.el('div', 'app-logo', rail, ' ');
      logo.innerHTML = '<svg viewBox="0 0 40 48" aria-hidden="true"><path d="M5 36C5 17 17 5 36 4c1 20-8 35-27 36H5v-4Z" fill="currentColor"/><path d="M6 39c5-8 11-13 18-17-6 1-11 4-16 9" fill="#2d3942"/></svg>';
      const navItems = [
        ['<rect x="5" y="9" width="30" height="22" rx="2"/><path d="m6 11 14 11 14-11"/>', 'Campaigns'],
        ['<circle cx="20" cy="11" r="5"/><circle cx="9" cy="16" r="4"/><circle cx="31" cy="16" r="4"/><path d="M10 34c0-7 4-11 10-11s10 4 10 11v2H10zM2 34c0-6 2-9 7-10M38 34c0-6-2-9-7-10"/>', 'Subscribers'],
        ['<path d="M10 4h16l7 7v29H10z"/><path d="M26 4v8h7M15 19h13M15 25h13M15 31h10"/>', 'Templates'],
        ['<path d="M6 35h6V23H6zM17 35h6V14h-6zM28 35h6V6h-6z"/>', 'Reports'],
        ['<path d="M20 4v5M20 35v5M4 20h5M35 20h5M8.7 8.7l3.5 3.5m15.6 15.6 3.5 3.5m0-22.6-3.5 3.5m-15.6 15.6-3.5 3.5"/><circle cx="20" cy="20" r="9"/><circle cx="20" cy="20" r="3"/>', 'Settings'],
      ];
      for (const [icon, text] of navItems) {
        const item = util.el('div', text === 'Subscribers' ? 'app-nav selected' : 'app-nav', rail);
        const iconEl = util.el('span', 'app-nav-icon', item);
        iconEl.innerHTML = `<svg viewBox="0 0 40 40" aria-hidden="true">${icon}</svg>`;
        util.el('span', 'app-nav-label', item, text);
      }
      const records = util.el('main', 'app-records', app);
      const recordHead = util.el('div', 'app-record-head', records);
      util.el('div', 'app-record-title', recordHead, 'Subscribers');
      util.el('div', 'app-record-count', recordHead, '248 subscribers');
      const table = util.el('div', 'app-table', records);
      const th = util.el('div', 'app-row app-th', table);
      util.el('span', '', th, 'Name');
      util.el('span', '', th, 'Email');
      const subscriberRows = [
        ['Ava Chen', 'ava.chen@example.com'], ['Liam Brooks', 'liam.brooks@example.com'],
        ['Noah Patel', 'noah.patel@example.com'], ['Emma Davis', 'emma.davis@example.com'],
        ['Olivia Martin', 'olivia.martin@example.com'], ['William Scott', 'william.scott@example.com'],
        ['Sophia Lee', 'sophia.lee@example.com'], ['James Wright', 'james.wright@example.com'],
        ['Isabella Turner', 'isabella.turner@example.com'], ['Mason Clark', 'mason.clark@example.com'],
        ['Mia Robinson', 'mia.robinson@example.com'], ['Ethan Walker', 'ethan.walker@example.com'],
        ['Charlotte Hall', 'charlotte.hall@example.com'], ['Benjamin Young', 'benjamin.young@example.com'],
        ['Amelia King', 'amelia.king@example.com'],
      ];
      for (const row of subscriberRows) {
        const line = util.el('div', 'app-row', table);
        util.el('span', '', line, row[0]);
        util.el('span', '', line, row[1]);
      }
      Object.assign(_c, { app, collide, cr, decoys, label, logo, nav, navItems, placement, rail, recordHead, records, sidebar, subscriberRows, table, th, wantFooter });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, display, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      stage.style.justifyContent = 'center';
      stage.style.alignItems = 'center';
      if (display === 'header') stage.classList.add('has-header-note');
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-complete-goals-appearance-01',
    template: 'site/base',
    design: { parts },
  });
})();
