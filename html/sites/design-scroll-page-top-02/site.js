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
          root.style.setProperty(
            `--${k}`,
            { bg: '#fff', panel: '#fff', fg: '#111', muted: '#333', line: '#111' }[k] || v,
          );
        root.style.setProperty('--accent', accent);
        root.dataset.theme = name;
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
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
        const menu = util.el('div', 'mac-menu', document.body);
        util.el('span', 'mac-apple', menu, '●');
        for (const item of ['File', 'Edit', 'View', 'Go', 'Bookmarks', 'Options', 'Window', 'Help'])
          util.el('span', 'mac-menu-item', menu, item);
        util.el('span', 'mac-clock', menu, '10:24 AM');
        util.el('span', 'mac-menu-help', menu, '?');
        util.el('span', 'mac-menu-monitor', menu, '▣');
        Object.assign(_c, { collide, cr, decoys, label, menu, nav, placement, sidebar, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { display, util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const mast = util.el('div', 'sv-masthead', header);
        mast.innerHTML =
          '<svg class="sv-flower" viewBox="0 0 100 36" aria-hidden="true"><path fill="#478329" d="M2 32h96v4H2zM8 27h5v5H8zm15-4h5v9h-5zm22 2h5v7h-5zm28-4h5v11h-5zm16 4h5v7h-5z"/><path fill="#f3d74c" d="M12 19h5v5h-5zm26-6h5v5h-5zm36 4h5v5h-5z"/><path fill="#e95762" d="M7 14h5v5H7zm13-6h5v5h-5zm23 2h5v5h-5zm17 6h5v5h-5zm21-7h5v5h-5z"/></svg><svg class="sv-house" viewBox="0 0 64 64" aria-hidden="true"><path fill="#111" d="M3 28 31 4l29 23v33H7V30z"/><path fill="#bd2930" d="M8 27 31 8l24 19H44L30 17 16 29z"/><path fill="#fff" d="M12 29 31 14l21 17v25H12z"/><path fill="#111" d="M26 38h12v18H26zM16 33h8v8h-8zm25 0h8v8h-8z"/><path fill="#63a8dc" d="M17 34h6v6h-6zm26 0h6v6h-6z"/><path fill="#e9c74b" d="M30 42h4v4h-4z"/></svg><div class="sv-mast-copy"><div>SunnyVale Online</div><small>~ A Friendly Place on the Internet ~</small></div><svg class="sv-tree" viewBox="0 0 36 64" aria-hidden="true"><path fill="#111" d="M15 29 5 34l9-13-8 2L17 9l-5-2L21 1l10 7-5 2 10 14-8-2 7 13-10-5v30h-8V35z"/><path fill="#25723a" d="m18 27-8 4 7-11-6 1L20 8l-2-1 4-2 4 3-2 1 8 11-6-1 7 11-9-4v33h-6z"/><path fill="#68a847" d="m20 18-5 1 7-9 7 10-6-2v9h-3z"/></svg><svg class="sv-flower sv-flower-right" viewBox="0 0 100 36" aria-hidden="true"><path fill="#478329" d="M2 32h96v4H2zM8 27h5v5H8zm15-4h5v9h-5zm22 2h5v7h-5zm28-4h5v11h-5zm16 4h5v7h-5z"/><path fill="#f3d74c" d="M12 19h5v5h-5zm26-6h5v5h-5zm36 4h5v5h-5z"/><path fill="#e95762" d="M7 14h5v5H7zm13-6h5v5h-5zm23 2h5v5h-5zm17 6h5v5h-5zm21-7h5v5h-5z"/></svg>';
        if (display === 'header') header.classList.add('mac-note-header');
        S.frameBrand(_c, header);
        Object.assign(_c, { header, mast });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        const appTools = util.el('div', 'mac-app-tools', document.body);
        for (const [icon, label] of [
          ['⌂', 'Home'],
          ['▤', 'Help Topics'],
          ['♧', 'Index'],
          ['⚲', 'Search'],
        ]) {
          const tool = util.el('div', 'mac-app-tool', appTools);
          util.el('span', 'mac-app-icon', tool, icon);
          util.el('span', '', tool, label);
        }
        Object.assign(_c, { appTools, headerTools, submit });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const topicIndex = util.el('aside', 'mac-topic-index', body);
        util.el('div', 'mac-index-heading', topicIndex, 'Help Topics');
        for (const item of [
          'Home',
          'News',
          'Our Community',
          'Personal Pages',
          'Photo Gallery',
          'Message Board',
          'Help & Support',
          'Site Map',
        ]) {
          const row = util.el('div', `mac-topic${item === 'Help & Support' ? ' selected' : ''}`, topicIndex);
          const icon = util.el(
            'span',
            `mac-doc-icon icon-${['Home', 'News', 'Our Community', 'Personal Pages', 'Photo Gallery', 'Message Board', 'Help & Support', 'Site Map'].indexOf(item)}`,
            row,
          );
          const art = [
            '<path fill="#111" d="M2 8 10 1l8 7v10H3z"/><path fill="#d33" d="m3 8 7-6 7 6h-4l-3-3-4 3z"/><path fill="#fff" d="M5 9h10v7H5z"/><path fill="#111" d="M9 12h3v4H9z"/>',
            '<path fill="#111" d="M2 1h16v18H2z"/><path fill="#fff" d="M5 4h10v2H5zm0 4h10v2H5zm0 4h7v2H5z"/><path fill="#d99d32" d="M14 12h2v5h-2z"/>',
            '<circle fill="#e34b36" cx="6" cy="6" r="4"/><circle fill="#f2c443" cx="14" cy="6" r="4"/><circle fill="#3476bc" cx="10" cy="4" r="4"/><path fill="#277443" d="M1 17q0-7 5-7t5 7zm6 1q0-8 6-8t6 8z"/>',
            '<path fill="#111" d="M3 1h13l3 3v15H3z"/><path fill="#fff" d="M5 3h9v3H5zm0 5h11v2H5zm0 4h11v2H5zm0 4h8v2H5z"/><path fill="#d77a30" d="M6 8h2v2H6zm0 4h2v2H6z"/>',
            '<path fill="#111" d="M2 5h4l2-3h6l2 3h3v12H2z"/><path fill="#555" d="M4 7h13v8H4z"/><circle fill="#39a4d8" stroke="#111" stroke-width="2" cx="10" cy="11" r="3"/>',
            '<path fill="#111" d="M2 3h16v12H9l-5 4v-4H2z"/><circle fill="#fff" cx="6" cy="9" r="1.5"/><circle fill="#fff" cx="10" cy="9" r="1.5"/><circle fill="#fff" cx="14" cy="9" r="1.5"/>',
            '<path fill="#111" d="M4 1h12l4 4v10l-4 4H4l-4-4V5z"/><path fill="#f2b83b" d="M5 3h10l3 3v8l-3 3H5l-3-3V6z"/><path fill="#111" d="M8 6h4v2H9v2h3v5H7v-2h3v-1H7V8h1z"/>',
            '<path fill="#111" d="M10 0 13 6l7 1-5 5 1 8-6-4-7 4 2-8-5-5 7-1z"/><path fill="#f3cf35" d="m10 3 2 5 5 1-4 4 1 4-4-3-4 3 1-5-3-3 5-1z"/>',
          ][
            [
              'Home',
              'News',
              'Our Community',
              'Personal Pages',
              'Photo Gallery',
              'Message Board',
              'Help & Support',
              'Site Map',
            ].indexOf(item)
          ];
          icon.innerHTML = `<svg viewBox="0 0 20 20" aria-hidden="true">${art}</svg>`;
          util.el('span', '', row, item);
        }
        if (true) {
          const side = util.el('aside', 'ref-side', body);
          for (const item of [
            'Members . . . . . . 12,418',
            'Personal Pages . . . 3,906',
            'Photos . . . . . . 18,230',
            'Messages . . . . . 27,441',
            'Online Now . . . . . 142',
          ]) {
            const a = util.el('a', 'ref-sidelink', side, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'sidebar', label: item });
            });
          }
          const promo = util.el('div', 'ref-stat-promo', side);
          promo.innerHTML =
            '<svg viewBox="0 0 64 64" aria-hidden="true"><path fill="#111" d="M20 1h24v4h8v8h5v8h4v24h-4v8h-5v6h-8v4H20v-4h-8v-6H7v-8H3V21h4v-8h5V5h8z"/><path fill="#0872d0" d="M22 5h20v4h8v8h5v8h4v14h-4v8h-8v8H22v-4h-8v-8h-5V23h5v-8h8z"/><path fill="#39b54a" d="m16 16 7 1 4 6-5 4-1 7-7-2-2-8zm28-6 8 5-2 7-8 1-2-6zm-6 22 8-2 6 5-3 9-7 3-5-6zM17 43l8-3 7 4-1 8-7 3-7-5z"/><path fill="#f0d942" d="m31 17 4 2-2 4-4-1zM44 39l3 2-2 3-3-1z"/></svg><span>A Smaller<br>Brighter<br>Internet<br>Together</span>';
        }
        Object.assign(_c, { body, topicIndex });
      },
  };

  env.site({
    name: 'design-scroll-page-top-02',
    template: 'site/base',
    design: { parts },
  });
})();
