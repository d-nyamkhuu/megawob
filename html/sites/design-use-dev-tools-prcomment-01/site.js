// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
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
          el.style.top = document.querySelector('.ref-task').getBoundingClientRect().bottom + 'px';
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
          util.el('h3', 'gtk-chat-title', el, 'Ask a question');
          const entry = util.el('input', 'gtk-chat-entry', el);
          entry.placeholder = 'Type a message...';
          entry.setAttribute('aria-label', 'Chat message');
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
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
        const panel = body.querySelector('.ref-panel');
        if (panel) inspector.appendChild(panel);
        const oldSide = body.querySelector('.ref-side');
        if (oldSide) oldSide.remove();
        body.classList.remove('ref-panel-right');
        if (display === 'toast') {
          const note = util.el('div', 'ref-note', document.body);
          util.el('div', 'ref-note-text', note, ctx.instruction);
          const x = util.el('button', 'ref-note-x', note, '×');
          x.type = 'button';
          x.setAttribute('aria-label', closeLabel);
          x.addEventListener('click', () => {
            note.style.visibility = 'hidden';
            env.log('note-close');
          });
          inspector.appendChild(note);
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
          if (ctx.finish) {
            while (tools.firstChild) headerTools.appendChild(tools.firstChild);
            foot.remove();
          }
        }
        Object.assign(_c, { inspector, oldSide, panel, submit });
      },
    'frame.footer': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-dev-tools-prcomment-01',
    template: 'site/base',
    design: { parts },
  });
})();
