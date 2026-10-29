// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
        const { rng, util, content } = ctx;
        let name = rng.pick(Object.keys(THEMES));
        const root = document.documentElement;
        let accent = rng.pick(ACCENTS);
        const tr = rng.fork('chrome/theme');
        if (tr.bool(0.08)) {
          name = 'low';
          accent = tr.pick(LOW_ACCENTS);
        }
        for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name]))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', accent);
        // This design uses the same fixed notebook palette in every seeded episode.
        for (const [k, v] of Object.entries({
          bg: '#e8f3ef',
          panel: '#eff7f3',
          fg: '#17352d',
          muted: '#557068',
          line: '#b8d0c8',
          accent: '#176452',
        }))
          root.style.setProperty(`--${k}`, v);
        root.dataset.theme = name;
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        if (placement === 'floating') placement = 'footer';
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebarDraw = roomy && rng.bool(0.35);
        const navDraw = W >= 1180 && rng.bool(0.5);
        const sidebar = roomy || sidebarDraw;
        const nav = W >= 1180 || navDraw;
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarDraw, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, local, lr, nav, rng, util, word } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        if (display !== 'header' || nav) {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
          if (!word) brand.textContent = 'TerraGo';
          brand.dataset.role = 'brand';
        }
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          for (const item of word
            ? local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)
            : ['Explore', 'Plan', 'Discover']) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        Object.assign(_c, { header });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, local, rng, sidebar, util } = _c;
        const { K } = S;
        const body = util.el('div', 'ref-body', document.body);
        if (sidebar) {
          // Keep the cloned frame's sidebar draws in place although this design uses the space as an inspector.
          local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
          const side = util.el('aside', 'ref-side', body);
          util.el('div', 'ref-inspector-title', side, '▤　Destination details');
          const photo = util.el('div', 'ref-inspector-photo', side);
          photo.setAttribute('aria-hidden', 'true');
          const details = util.el('div', 'ref-inspector-details', side);
          for (const [key, value] of [
            ['Name', 'Limestone Bay'],
            ['Region', 'Southeast Asia'],
            ['Country', 'Malaysia'],
            ['Languages', 'Malay, English'],
            ['Currency', 'MYR (Malaysian Ringgit)'],
            ['Popular for', 'Islands, beaches, nature'],
            ['Best for', 'Outdoor activities'],
            ['Average price (per night)', 'USD 120–320'],
          ]) {
            const row = util.el('div', 'ref-inspector-row', details);
            util.el('span', 'ref-inspector-key', row, key);
            util.el('span', 'ref-inspector-value', row, value);
          }
          util.el('div', 'ref-inspector-rating', side, '★ ★ ★ ★ ☆　4.2 (318 reviews)');
          util.el(
            'div',
            'ref-inspector-copy',
            side,
            'Limestone Bay offers clear waters, white-sand beaches and dramatic limestone cliffs. A great destination for snorkeling, island hopping and exploring local culture.',
          );
        }
        Object.assign(_c, { body });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, label, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        const appDock = util.el('nav', 'ref-app-dock', document.body);
        const dockItems = [
          [
            'Home',
            '<path d="M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 19.5z"/><path d="M9 21v-7h6v7"/>',
            'active',
          ],
          ['Search', '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>', ''],
          ['Trips', '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 11h18M9 11v3h6v-3"/>', ''],
          [
            'Guides',
            '<path d="M3 5.5c3-1.5 6-1.5 9 0v15c-3-1.5-6-1.5-9 0zM12 5.5c3-1.5 6-1.5 9 0v15c-3-1.5-6-1.5-9 0z"/>',
            '',
          ],
          ['Saved', '<path d="M12 21s-9-5.4-9-12a4.7 4.7 0 0 1 9-2 4.7 4.7 0 0 1 9 2c0 6.6-9 12-9 12z"/>', ''],
          [
            'Settings',
            '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.4.8l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.4-.8l-1.7.6-1.4-2.4 1.4-1.1A7 7 0 0 1 8 13.5l-1.8-.3v-2.8l1.8-.3a8 8 0 0 1 .8-1.4L7.4 7.3l1.4-2.4 1.7.6a8 8 0 0 1 1.4-.8l.3-1.8H15l.3 1.8a8 8 0 0 1 1.4.8l1.7-.6 1.4 2.4-1.4 1.1a8 8 0 0 1 .8 1.4l1.8.3v2.8l-1.8.3a8 8 0 0 1-.8 1.4z"/>',
            'right',
          ],
          [
            'Help',
            '<circle cx="12" cy="12" r="9.5"/><path d="M9.5 9a2.6 2.6 0 1 1 4.6 1.7c-1.4 1.3-2.1 1.6-2.1 3.3M12 17.5h.01"/>',
            'right',
          ],
        ];
        for (const [title, icon, cls] of dockItems) {
          const item = util.el('a', `ref-dock-item ${cls}`.trim(), appDock);
          item.href = '#';
          item.setAttribute('aria-label', title);
          const glyph = util.el('span', 'ref-dock-icon', item);
          glyph.setAttribute('aria-hidden', 'true');
          glyph.innerHTML = `<svg viewBox="0 0 24 24" focusable="false">${icon}</svg>`;
          util.el('span', 'ref-dock-label', item, title);
          item.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'nav', label: title });
          });
        }
        Object.assign(_c, { appDock, dockItems, submit });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-complete-goals-filters-01',
    template: 'site/base',
    design: { parts },
  });
})();
