// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const iconPaths = {
    Overview: 'M3 10l9-7 9 7v11h-6v-7H9v7H3z',
    Issues: 'M12 8v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
    'Pull requests': 'M6 7v10 M18 17v-5c0-4-3-6-7-6 M9 3l-3 3 3 3 M9 20a3 3 0 1 1-6 0 3 3 0 0 1 6 0 M21 20a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
    Discussions: 'M3 3h14v11H9l-4 4v-4H3z M17 8h4v12h-4l-4 3v-6',
    Actions: 'M10 7l7 5-7 5z M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
    Deployments: 'M5 3l5 5-3 3-5-5c-1 5 2 8 7 8l9 8 4-4-8-9c0-5-3-8-8-7l5 5-3 3z',
    Packages: 'M12 2l10 6v10l-10 6L2 18V8z M2 8l10 6 10-6 M12 14v10',
    Environments: 'M3 3h18v18H3z M3 8h18 M3 14h5l2 3h5l2-3h4',
    Monitors: 'M3 3h18v14H3z M8 22h8 M12 17v5 M9 10l3-4 3 4',
    Settings: 'M10 2h4l1 4 3 1 3-1 2 4-3 2v3l3 2-2 4-3-1-3 1-1 3h-4l-1-3-3-1-3 1-2-4 3-2v-3L1 10l2-4 3 1 3-1z M16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
    file: 'M5 2h10l5 5v15H5z M14 2v6h6 M9 12h7 M9 16h7',
    search: 'M16 16l6 6 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  };
  const svgIcon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${iconPaths[name]}"/></svg>`;

  const parts = {
    endLabel: (base) => (rng, content) => {
      const label = base(rng, content);
      return rng.fork('ipados/end-label').bool(0.5) ? 'Confirm' : label;
    },
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        const row = util.el('div', 'ref-ov-row', box);
        const btn = (label, how, primary) => {
          if (word && K.button[label]) label = word(K.button[label]);
          const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
          b.type = 'button';
          b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
          return b;
        };
        let dismiss;
        if (kind === 'cookie') {
          if (rng.bool(0.5)) btn('Settings', null, false);
          btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
          dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
        } else if (kind === 'promo') {
          dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
          btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
        } else if (kind === 'banner') {
          dismiss = btn('Dismiss', 'close', false);
        } else {
          dismiss = btn('×', 'close', false);
          dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
        }
        const foot = document.querySelector('.ref-foot, .ref-float-dock');
        const footHeight = foot ? foot.getBoundingClientRect().height : 0;
        if (kind === 'banner') document.body.insertBefore(el, document.querySelector('.ref-body'));
        if (kind === 'cookie' || kind === 'chat') el.style.bottom = footHeight + 5 + 'px';
        if (kind === 'promo') {
          el.style.top = document.querySelector('.ip-mainbar').getBoundingClientRect().bottom + 'px';
          el.style.bottom = footHeight + 5 + 'px';
          util.el('h2', 'gtk-promo-title', box, 'Get product updates');
          const art = util.el('div', 'gtk-promo-art', box);
          art.innerHTML =
            '<svg viewBox="0 0 120 120" fill="none" stroke="#2679bf" stroke-width="3"><path fill="#cce7ff" d="M12 52l48-30 48 30v51H12z"/><path fill="white" d="M27 17h66v58H27z"/><path d="M39 31h42M39 43h42M39 55h30M12 52l48 35 48-35M12 103l34-31m62 31L74 72"/></svg>';
          const address = util.el('input', 'gtk-promo-email', box);
          address.placeholder = 'you@acme.com';
          address.setAttribute('aria-label', 'Email address');
        }
        if (kind === 'chat') {
          util.el('h3', 'gtk-chat-title', el, 'Chat with Copilot');
          const entry = util.el('input', 'gtk-chat-entry', el);
          entry.placeholder = 'Type a message...';
          entry.setAttribute('aria-label', 'Chat message');
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.theme': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        document.body.classList.add('ip-workspace');
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
        for (const [k, v] of Object.entries({
          bg: '#e9e7e2',
          panel: '#f8f7f3',
          fg: '#171b22',
          muted: '#59616b',
          line: '#c8c5bd',
          accent: '#3979bd',
        }))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', '#3979bd');
        root.dataset.theme = name;
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        // Clearlooks desktop frame: title bar, application menu, then task tabs.
        const titlebar = util.el('div', 'gtk-titlebar', document.body);
        util.el('span', 'gtk-app-icon', titlebar, '◉');
        util.el('strong', 'gtk-window-title', titlebar, 'CodeStation - acme/webapp');
        const winControls = util.el('div', 'gtk-window-controls', titlebar);
        for (const glyph of ['−', '□', '×']) util.el('span', '', winControls, glyph);
        const menubar = util.el('nav', 'gtk-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Repository', 'Build', 'Tools', 'Help'])
          util.el('span', '', menubar, item);
        const appTabs = util.el('nav', 'gtk-app-tabs', document.body);
        const mainbar = util.el('div', 'ip-mainbar', document.body);
        const crumb = util.el('div', 'ip-breadcrumb', mainbar);
        util.el('a', '', crumb, 'acme'); util.el('span', '', crumb, '/'); util.el('b', '', crumb, 'web');
        const searchBox = util.el('label', 'ip-global-search', mainbar);
        util.el('span', '', searchBox).innerHTML = svgIcon('search');
        const searchInput = util.el('input', '', searchBox); searchInput.placeholder = 'Search...'; searchInput.setAttribute('aria-label', 'Search');
        const avatar = util.el('span', 'ip-avatar', mainbar);
        avatar.innerHTML = '<svg viewBox="0 0 56 56" aria-hidden="true"><defs><radialGradient id="ip-portrait-bg"><stop stop-color="#dce3e9"/><stop offset="1" stop-color="#a8b5c2"/></radialGradient><linearGradient id="ip-face" x2="1" y2="1"><stop stop-color="#efcebb"/><stop offset="1" stop-color="#c7967b"/></linearGradient></defs><circle cx="28" cy="28" r="28" fill="url(#ip-portrait-bg)"/><path d="M13 30C8 3 42 0 44 22l-2 22H13z" fill="#34302f"/><path d="M5 56c0-16 12-21 23-21s24 5 24 21" fill="#26333d"/><path d="M21 31h14v12c-4 5-10 4-14-1" fill="#d1a087"/><ellipse cx="28" cy="22" rx="11" ry="15" fill="url(#ip-face)"/><path d="M16 22C12 3 36 3 41 18c-10-2-12-6-15-8-1 6-4 9-10 12" fill="#3c3532"/><path d="M20 23h4m8 0h4" stroke="#5a4540" stroke-width="1.4"/><path d="M27 24l-1 6 3 1" fill="none" stroke="#b07b67"/><path d="M23 34q5 3 10-1" fill="none" stroke="#9d5b55" stroke-width="1.4"/><path d="M21 41l7 6 7-6 5 15H16z" fill="#ece7e3"/><path d="M10 56l6-17 7 3 4 14m19 0-6-17-6 3-5 14" fill="#2d3942"/></svg>';
        for (const [icon, label] of [
          ['M5 3h10l4 4v14H5z M14 3v5h5 M9 11v6m0-3h5m0 0v-3', 'Pull Requests'],
          ['M5 4h4v4H5z M5 16h4v4H5z M15 10h4v4h-4z M7 8v8m2-10h4l4 4M9 18h4l4-4', 'Pipelines'],
          ['M4 3h16v18H4z M8 7h9M8 11h9M8 15h9M8 18h9', 'Logs'],
          ['M3 5c0-4 18-4 18 0v14c0 4-18 4-18 0z M3 5c0 4 18 4 18 0M3 12c0 4 18 4 18 0', 'Database'],
          ['M6 3l12 4-5 6-2 8-3-8-5-2z', 'Feature Flags'],
        ]) {
          const tab = util.el('span', `gtk-app-tab${label === 'Pull Requests' ? ' selected' : ''}`, appTabs);
          const symbol = util.el('b', '', tab);
          symbol.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="${icon}"/></svg>`;
          util.el('span', '', tab, label);
        }
        document.body.insertBefore(titlebar, header);
        document.body.insertBefore(menubar, header);
        document.body.insertBefore(appTabs, header);
        header.classList.add('gtk-toolbar');
        S.frameBrand(_c, header);
        if (!header.querySelector('.ref-brand')) util.el('div', 'ref-brand', header, 'acme  ⌄');
        Object.assign(_c, { appTabs, header, menubar, titlebar, winControls });
      },
    'frame.nav': (base, S) =>
      function (_c) {
        const { content, display, header, local, nav, rng, util } = _c;
        const { K } = S;
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        header.classList.add(`gtk-display-${display}`);
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { appTabs, collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        appTabs.appendChild(headerTools);
        const brand = header.querySelector('.ref-brand');
        if (brand) {
          brand.textContent = 'acme  ⌄';
          const logo = util.el('span', 'ip-brand-logo', brand);
          logo.innerHTML = '<svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M10 5h9l4 4v12h-9v-4h-4z" fill="white"/><path d="M7 12h9v11H7z" stroke="white" stroke-width="2"/><path d="M18 5v6h5" stroke="#9ac4ff" stroke-width="2"/></svg>';
          brand.insertBefore(logo, brand.firstChild);
        }
        const rail = util.el('nav', 'ip-app-nav', header);
        const links = [
          ['⌂', 'Overview', ''], ['◷', 'Issues', '12'], ['⑂', 'Pull requests', '4'],
          ['▢', 'Discussions', ''], ['⊙', 'Actions', ''], ['⚒', 'Deployments', ''],
          ['⬡', 'Packages', ''], ['▤', 'Environments', ''], ['⌑', 'Monitors', ''], ['⚙', 'Settings', ''],
        ];
        for (const [icon, label, count] of links) {
          const link = util.el('a', `ip-app-link${label === 'Pull requests' ? ' current' : ''}`, rail);
          link.href = '#';
          util.el('span', 'ip-app-glyph', link).innerHTML = svgIcon(label);
          util.el('span', '', link, label);
          if (count) util.el('small', '', link, count);
          link.addEventListener('click', (event) => {
            event.preventDefault();
            if (label !== 'Pull requests') env.log('decoy', { what: 'nav', label });
          });
        }
        Object.assign(_c, { headerTools, submit });
      },
    'frame.toast': (base, S) =>
      function (_c) {
        const {
          body,
          closeLabel,
          collide,
          ctx,
          decoyBtn,
          decoys,
          display,
          endBtn,
          headerTools,
          label,
          lr,
          placement,
          rng,
          util,
          wantFooter,
          word,
        } = _c;
        let { submit } = _c;
        // The desktop's properties inspector also hosts side-form task notes.
        const inspector = util.el('aside', 'gtk-inspector', body);
        body.classList.toggle('ip-panel-mode', display === 'panel');
        const panel = body.querySelector('.ref-panel');
        if (panel) {
          inspector.appendChild(panel);
          const caption = panel.querySelector('.ref-panel-title');
          if (caption) {
            caption.textContent = 'Task';
            const symbol = util.el('span', 'ip-note-file', caption);
            symbol.innerHTML = svgIcon('file');
            caption.insertBefore(symbol, caption.firstChild);
          }
        }
        const oldSide = body.querySelector('.ref-side');
        if (oldSide) oldSide.remove();
        body.classList.remove('ref-panel-right');
        if (display === 'toast') {
          const note = util.el('div', 'ref-note', document.body);
          util.el('div', 'ref-note-text', note, ctx.instruction);
          util.el('span', 'ip-note-symbol', note).innerHTML = svgIcon('file');
          const x = util.el('button', 'ref-note-x', note, '×');
          x.type = 'button';
          x.setAttribute('aria-label', closeLabel);
          x.addEventListener('click', () => {
            note.style.visibility = 'hidden';
            env.log('note-close');
          });
          note.classList.add('ip-toast-note');
        }
        if (wantFooter) {
          const foot = util.el('footer', 'ref-foot', document.body);
          const footText = rng.pick([
            '© 2024 Example Co.',
            'All changes are saved automatically.',
            'Need help? Contact your administrator.',
            'v4.2.1 · Status: all systems normal',
          ]);
          const status = util.el(
            'span',
            'ref-foot-text',
            foot,
            word
              ? lr.pick([
                  `© 2024 Example Co. ${word('footRights')}`,
                  word('footSaved'),
                  word('footHelp'),
                  `v4.2.1 · ${word('footStatus')}`,
                ])
              : footText,
          );
          status.textContent = 'Ready';
          const tools = util.el('div', 'ref-tools', foot);
          if (decoys.length > 1) decoyBtn(tools, decoys[1]);
          if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
          if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
          body.classList.toggle('ip-footer-mode', !ctx.finish && !!tools.childElementCount);
          if (ctx.finish) {
            while (tools.firstChild) headerTools.appendChild(tools.firstChild);
            foot.remove();
          }
        }
        Object.assign(_c, { inspector, oldSide, panel, submit });
      },
    'frame.footer': (base, S) => function (_c) {},
    'frame.floating': () => function (_c) {
      if (_c.placement === 'floating') _c.submit = _c.endBtn(_c.headerTools, 'ref-submit', _c.label);
    },
    'frame.end': (base) => function (_c) {
      document.body.style.setProperty('--ip-control-space', `${_c.headerTools.getBoundingClientRect().width}px`);
      document.body.classList.toggle('ip-has-footer', _c.body.classList.contains('ip-footer-mode'));
      return base(_c);
    },
  };

  env.site({
    name: 'design-use-dev-tools-prcomment-05',
    template: 'site/base',
    design: { parts },
  });
})();
