// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) =>
      function (_c) {
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
        const titlebar = util.el('div', 'window-titlebar', app);
        const mark = util.el('span', 'window-mark', titlebar);
        mark.innerHTML =
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 3h2v8h8v2h-8v8h-2v-8H3v-2h8z" fill="currentColor"/></svg>';
        util.el('span', 'window-name', titlebar, 'Pine Tools');
        const windowButtons = util.el('div', 'window-controls', titlebar);
        util.el('span', '', windowButtons, '—');
        util.el('span', '', windowButtons, '□');
        util.el('span', '', windowButtons, '×');
        const rail = util.el('aside', 'app-rail', app);
        const iconSvg = {
          palette:
            '<svg viewBox="0 0 32 32"><path d="M16 3C8.8 3 3 8.7 3 15.8 3 23 8.8 29 16 29h2.2c2.1 0 3.2-2.3 1.8-3.8-.8-.9-.9-2.3-.1-3.3.5-.7 1.4-1 2.3-1H25c2.3 0 4-1.8 4-4.1C29 8.8 23.2 3 16 3Z"/><circle cx="10" cy="13" r="1.4"/><circle cx="15" cy="8.5" r="1.4"/><circle cx="21" cy="10" r="1.4"/><circle cx="9" cy="19" r="1.4"/></svg>',
          gear: '<svg viewBox="0 0 32 32"><path d="m13 3-1 3.1-2.5 1.4-3-1L3 11l1.5 2.8v2.9L3 19.5l3.5 4.4 3-1 2.5 1.4 1 3.2h6l1-3.2 2.5-1.4 3 1 3.5-4.4-1.5-2.8V13.8l1.5-2.8-3.5-4.5-3 1L20 6.1 19 3z"/><circle cx="16" cy="15.5" r="5"/></svg>',
          chart: '<svg viewBox="0 0 32 32"><path d="M4 27V17h6v10zM13 27V10h6v17zM22 27V4h6v23z"/></svg>',
          grid: '<svg viewBox="0 0 32 32"><rect x="4" y="4" width="10" height="10"/><rect x="18" y="4" width="10" height="10"/><rect x="4" y="18" width="10" height="10"/><rect x="18" y="18" width="10" height="10"/></svg>',
          home: '<svg viewBox="0 0 40 40"><path d="m4 18 16-14 16 14M9 16v19h9V24h5v11h8V16"/></svg>',
          file: '<svg viewBox="0 0 40 40"><path d="M9 4h15l9 9v23H9zM24 4v10h9M14 21h14M14 27h14"/></svg>',
          image:
            '<svg viewBox="0 0 40 40"><path d="M4 7h32v27H4zM8 29l9-10 6 6 5-5 8 9"/><circle cx="27" cy="14" r="3"/></svg>',
          sliders:
            '<svg viewBox="0 0 40 40"><path d="M5 10h30M5 20h30M5 30h30"/><circle cx="14" cy="10" r="3"/><circle cx="27" cy="20" r="3"/><circle cx="17" cy="30" r="3"/></svg>',
        };
        const navItems = [
          ['palette', 'Appearance'],
          ['gear', 'Preferences'],
          ['chart', 'Statistics'],
          ['grid', 'Resources'],
        ];
        for (const [icon, text] of navItems) {
          const item = util.el('div', text === 'Appearance' ? 'app-nav selected' : 'app-nav', rail);
          util.el('span', 'app-nav-icon', item).innerHTML = iconSvg[icon];
          util.el('span', 'app-nav-label', item, text);
        }
        const summary = util.el('section', 'side-summary', rail);
        util.el('h2', '', summary, 'Items');
        for (const [label, count] of [
          ['Color presets', '12'],
          ['Languages', '34'],
          ['Transparency levels', '11'],
        ]) {
          const row = util.el('div', 'summary-row', summary);
          util.el('span', '', row, label);
          util.el('span', '', row, count);
        }
        const status = util.el('section', 'side-status', rail);
        util.el('h2', '', status, 'Status');
        util.el('div', '', status, 'No changes yet');
        const records = util.el('main', 'app-records', app);
        const recordHead = util.el('div', 'app-record-head', records);
        util.el('div', 'app-record-title', recordHead, 'Subscribers');
        util.el('div', 'app-record-count', recordHead, '248 subscribers');
        const table = util.el('div', 'app-table', records);
        const th = util.el('div', 'app-row app-th', table);
        util.el('span', '', th, 'Name');
        util.el('span', '', th, 'Email');
        const subscriberRows = [
          ['Ava Chen', 'ava.chen@example.com'],
          ['Liam Brooks', 'liam.brooks@example.com'],
          ['Noah Patel', 'noah.patel@example.com'],
          ['Emma Davis', 'emma.davis@example.com'],
          ['Olivia Martin', 'olivia.martin@example.com'],
          ['William Scott', 'william.scott@example.com'],
          ['Sophia Lee', 'sophia.lee@example.com'],
          ['James Wright', 'james.wright@example.com'],
          ['Isabella Turner', 'isabella.turner@example.com'],
          ['Mason Clark', 'mason.clark@example.com'],
          ['Mia Robinson', 'mia.robinson@example.com'],
          ['Ethan Walker', 'ethan.walker@example.com'],
          ['Charlotte Hall', 'charlotte.hall@example.com'],
          ['Benjamin Young', 'benjamin.young@example.com'],
          ['Amelia King', 'amelia.king@example.com'],
        ];
        for (const row of subscriberRows) {
          const line = util.el('div', 'app-row', table);
          util.el('span', '', line, row[0]);
          util.el('span', '', line, row[1]);
        }
        const dock = util.el('nav', 'bottom-dock', app);
        for (const [icon, text, selected] of [
          ['home', 'Home', true],
          ['palette', 'Appearance'],
          ['file', 'Documents'],
          ['image', 'Media'],
          ['sliders', 'System'],
        ]) {
          const item = util.el('div', selected ? 'dock-item selected' : 'dock-item', dock);
          util.el('span', 'dock-icon', item).innerHTML = iconSvg[icon];
          util.el('span', '', item, text);
        }
        Object.assign(_c, {
          app,
          collide,
          cr,
          decoys,
          dock,
          iconSvg,
          label,
          mark,
          nav,
          navItems,
          placement,
          rail,
          recordHead,
          records,
          sidebar,
          status,
          subscriberRows,
          summary,
          table,
          th,
          titlebar,
          wantFooter,
          windowButtons,
        });
      },
    'frame.stage': (base, S) =>
      function (_c) {
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
    name: 'design-complete-goals-appearance-02',
    template: 'site/base',
    design: { parts },
  });
})();
