// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const { ACCENTS, LOW_ACCENTS, THEMES } = S;
        const { rng, util, content } = ctx;
        let name = rng.pick(Object.keys(THEMES));
        const root = document.documentElement;
        let accent = rng.pick(ACCENTS);
        const tr = rng.fork('chrome/theme');
        if (tr.bool(0.08)) {
          name = 'low';
          accent = tr.pick(LOW_ACCENTS);
        }
        // Keep the reference's white help article palette while consuming the clone's original theme draws.
        for (const [k, v] of Object.entries({
          bg: '#ffffff',
          panel: '#f3f8fc',
          fg: '#17345a',
          muted: '#60758c',
          line: '#c6d8e8',
        }))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', '#075fc5');
        root.dataset.theme = 'light';
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.layout': (base, S) =>
      function (_c) {
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
        document.body.classList.toggle('ref-header-note', display === 'header');
        document.body.classList.toggle('ref-panel-note', display === 'panel');
        Object.assign(_c, { H, W, display, roomy, tall });
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
        const windowbar = util.el('div', 'vista-windowbar', document.body);
        const auroraMark = util.el('span', 'vista-ie-icon', windowbar);
        auroraMark.innerHTML =
          '<svg viewBox="0 0 48 36" aria-hidden="true"><path fill="#633bd2" d="M1 30 15 5l13 25H1Z"/><path fill="#8050e8" d="m16 30 13-22 18 22H16Z"/><path fill="#0875c6" d="m24 30 6-11 7 11H24Z"/></svg>';
        util.el('span', 'vista-window-title', windowbar, 'Aurora');
        const winControls = util.el('div', 'vista-window-controls', windowbar);
        for (const glyph of ['−', '□', '×']) util.el('span', 'vista-window-control', winControls, glyph);
        Object.assign(_c, {
          auroraMark,
          collide,
          cr,
          decoys,
          label,
          nav,
          placement,
          sidebar,
          wantFooter,
          winControls,
          windowbar,
        });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, local, nav, rng, util } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, 'Aurora');
          brand.dataset.role = 'brand';
          util.el('span', 'vista-brand-divider', header);
          util.el('div', 'vista-section-title', header, 'Help Center');
        }
        if (nav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        {
          const n = util.el('nav', 'ref-nav', header);
          const icons = {
            'Home':
              '<svg viewBox="0 0 24 24"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1z"/></svg>',
            'Help Center':
              '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.7 9a2.4 2.4 0 1 1 4.2 1.6c-1.2 1.1-1.9 1.4-1.9 3M12 17.5h.01"/></svg>',
            'Messages':
              '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
            'Projects': '<svg viewBox="0 0 24 24"><path d="M3 6h7l2 2h9v11H3z"/><path d="M3 9h18"/></svg>',
            'Settings':
              '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.1h-2.6v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6v-2.6h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1L9 6.6l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.1h2.6v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1V14h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
          };
          for (const item of ['Home', 'Help Center', 'Messages', 'Projects', 'Settings']) {
            const a = util.el('a', 'ref-navlink', n);
            const icon = util.el('span', 'ref-nav-icon', a);
            icon.innerHTML = icons[item];
            util.el('span', 'ref-nav-label', a, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        Object.assign(_c, { header });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);
        const search = util.el('div', 'vista-search', header);
        util.el('span', 'vista-search-label', search, 'Search Help Center');
        util.el('span', 'vista-search-icon', search, '⌕');
        Object.assign(_c, { search });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const appSide = util.el('aside', 'ref-app-sidebar', body);
        const appLogo = util.el('div', 'ref-app-logo', appSide);
        appLogo.innerHTML =
          '<svg viewBox="0 0 48 36" aria-hidden="true"><path fill="#633bd2" d="M1 31 15 5l13 26H1Z"/><path fill="#8050e8" d="m17 31 13-23 18 23H17Z"/><path fill="#0875c6" d="m24 31 6-11 7 11H24Z"/></svg>';
        util.el('strong', 'ref-app-name', appSide, 'Aurora');
        const appLinks = util.el('div', 'ref-app-links', appSide);
        const sideIcons = {
          'Dashboard':
            '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
          'Files':
            '<svg viewBox="0 0 24 24"><path d="M6 3h8l5 5v13H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v6h5"/></svg>',
          'Shared':
            '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3 20v-1a6 6 0 0 1 12 0v1z"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14a4 4 0 0 1 4 4v2h-4"/></svg>',
          'Help Center':
            '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4.4 1.6c-1.2 1.1-1.9 1.4-1.9 3M12 17.5h.01"/></svg>',
          'Trash': '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7m3 3v7m6-7v7"/></svg>',
        };
        for (const item of ['Dashboard', 'Files', 'Shared', 'Help Center', 'Trash']) {
          const a = util.el('a', `ref-app-link${item === 'Help Center' ? ' active' : ''}`, appLinks);
          const icon = util.el('span', 'ref-app-link-icon', a);
          icon.innerHTML = sideIcons[item];
          util.el('span', '', a, item);
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'sidebar', label: item });
          });
        }
        const storage = util.el('div', 'ref-app-storage', appSide);
        util.el('div', 'ref-storage-title', storage, '☁  Storage');
        util.el('div', 'ref-storage-meter', storage);
        util.el('div', 'ref-storage-copy', storage, '12.4 GB of 50 GB used');
        S.frameSidebar(_c, body);
        Object.assign(_c, { appLinks, appLogo, appSide, body, sideIcons, storage });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-scroll-page-nested-03',
    template: 'site/base',
    design: { parts },
  });
})();
