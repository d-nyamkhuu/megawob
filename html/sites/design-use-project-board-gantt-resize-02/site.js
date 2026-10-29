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
        if (kind === 'promo') {
          const art = util.el('div', 'release-newsletter-art', box);
          art.innerHTML =
            '<svg viewBox="0 0 180 180" aria-hidden="true"><path d="M82 18v-9m-22 20-7-9m50 9 7-9" fill="none" stroke="#2388ff" stroke-width="5" stroke-linecap="round"/><path d="m16 89 68-48 72 48v70H16z" fill="#56a3ff"/><rect x="35" y="45" width="103" height="100" rx="8" fill="#fff" stroke="#d7eaff" stroke-width="7"/><path d="M54 69h49M54 88h67M54 107h54" stroke="#c4dcee" stroke-width="6"/><path d="m16 89 70 51 70-51v70H16z" fill="#4094f9"/><path d="m16 159 70-51 70 51" fill="#65adff"/></svg>';
          util.el('h2', 'release-overlay-title', box, 'Get product updates');
        } else if (kind === 'chat') {
          const title = util.el('div', 'release-chat-title', box);
          const icon = util.el('span', 'release-chat-icon', title);
          icon.innerHTML =
            '<svg viewBox="0 0 24 24" width="25" height="25" aria-hidden="true"><path d="M4 4h16v12H10l-5 4v-4H4z" fill="white"/></svg>';
          util.el('strong', '', title, 'Chat with us');
        } else if (kind === 'cookie') {
          const icon = util.el('span', 'release-cookie-icon', box);
          icon.innerHTML =
            '<svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true"><circle cx="18" cy="18" r="16" fill="#ffc673"/><g fill="#a26b32"><circle cx="11" cy="12" r="2"/><circle cx="23" cy="10" r="2"/><circle cx="18" cy="21" r="2.5"/><circle cx="26" cy="24" r="2"/><circle cx="10" cy="26" r="1.5"/></g></svg>';
        }
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'promo' || kind === 'chat') {
          const input = util.el('input', 'release-overlay-input', box);
          input.type = kind === 'promo' ? 'email' : 'text';
          input.placeholder = kind === 'promo' ? 'Your email address' : 'Type a message…';
          input.setAttribute('aria-label', input.placeholder);
        }
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
        if (kind === 'promo') {
          util.el('small', 'release-overlay-privacy', box, 'No spam. Unsubscribe anytime.');
          const close = util.el('button', 'release-overlay-close', box, '×');
          close.type = 'button';
          close.setAttribute('aria-label', word ? word('close') : 'Close');
          close.addEventListener('click', () => ctx.dismiss('close'));
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
        // Keep the app's pale blue 2020 utility palette across episode themes.
        root.style.setProperty('--bg', '#e9eced');
        root.style.setProperty('--panel', '#f9f8f4');
        root.style.setProperty('--fg', '#111315');
        root.style.setProperty('--muted', '#566170');
        root.style.setProperty('--line', '#d5d8d8');
        root.style.setProperty('--accent', '#087fff');
        root.dataset.theme = name;
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.controls': (base, S) =>
      function (_c) {
        const { ctx, header, label, util } = _c;
        const decoyBtn = (parent, text, collides) => {
          const b = util.el('button', 'ref-xtra', parent, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () =>
            env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
          );
        };
        const endBtn = (parent, cls, text) => {
          const b = util.el(cls === 'ref-endlink' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };

        // Bottom application dock. These are inert navigation affordances, as in the reference design.
        const dockNav = util.el('nav', 'ref-dock-nav', header);
        const dockItems = [
          ['Release Plan', 'plan', true],
          ['Board', 'board', false],
          ['Roadmap', 'roadmap', false],
          ['Reports', 'reports', false],
        ];
        for (const [title, iconName, active] of dockItems) {
          const item = util.el('button', `ref-dock-item${active ? ' active' : ''}`, dockNav);
          item.type = 'button';
          item.setAttribute('aria-label', title);
          const icon = util.el('span', `ref-dock-icon icon-${iconName}`, item);
          const paths = {
            plan: '<rect x="2" y="2" width="20" height="20" rx="2" fill="currentColor"/><path d="M7 7h10M7 12h10M7 17h10" stroke="#202629" stroke-width="2"/>',
            board: '<rect x="2" y="3" width="20" height="18" rx="1"/><path d="M9 3v18M15 3v18"/>',
            roadmap:
              '<rect x="3" y="2" width="18" height="8" rx="1.5"/><rect x="3" y="14" width="18" height="8" rx="1.5"/><path d="M7 10v4M17 10v4"/>',
            reports: '<path d="M3 21h19M5 18V9M11 18V4M17 18v-6"/>',
          };
          icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">${paths[iconName]}</svg>`;
          util.el('span', 'ref-dock-label', item, title);
          item.addEventListener('click', () => env.log('decoy', { what: 'dock', label: title }));
        }
        const dockActions = util.el('div', 'ref-dock-actions', header);
        for (const [title, path] of [
          ['Search', '<circle cx="10.8" cy="10.8" r="7.2"/><path d="m16.2 16.2 5 5"/>'],
          [
            'Settings',
            '<path d="M12 2.5 14 3l.8 2.2 2 .8 2.1-1 1.5 1.5-1 2.1.8 2L22.5 11v2l-2.3.8-.8 2 1 2.1-1.5 1.5-2.1-1-2 .8L14 19.5l-2 .5-2-.5-.8-2.3-2-.8-2.1 1-1.5-1.5 1-2.1-.8-2.1L1.5 13v-2l2.3-.8.8-2.1-1-2.1L5.1 4.5l2.1 1 2-.8L10 3z"/><circle cx="12" cy="12" r="3"/>',
          ],
        ]) {
          const button = util.el('button', 'ref-dock-action', dockActions);
          button.type = 'button';
          button.setAttribute('aria-label', title);
          button.title = title;
          button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
          button.addEventListener('click', () => env.log('decoy', { what: 'dock', label: title }));
        }
        Object.assign(_c, { decoyBtn, dockActions, dockItems, dockNav, endBtn });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, headerTools, label, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', headerTools);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        Object.assign(_c, { submit });
      },
  };

  env.site({
    name: 'design-use-project-board-gantt-resize-02',
    template: 'site/base',
    design: { parts },
  });
})();
