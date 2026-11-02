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
        // Obstructions live within the app, leaving the episode controls unobstructed.
        const app = document.querySelector('.ch-app');
        const composer = document.querySelector('.team-compose');
        const header = document.querySelector('.ref-task');
        if ((kind === 'cookie' || kind === 'chat') && composer) {
          el.style.bottom = `${window.innerHeight - composer.getBoundingClientRect().top + 8}px`;
        }
        if ((kind === 'banner' || kind === 'toast') && header) {
          el.style.top = `${header.getBoundingClientRect().bottom + (kind === 'toast' ? 10 : 0)}px`;
        }
        if (kind === 'promo' && app) {
          const r = app.getBoundingClientRect();
          Object.assign(el.style, {
            inset: 'auto',
            left: `${r.left}px`,
            top: `${r.top}px`,
            width: `${r.width}px`,
            height: `${r.height}px`,
          });
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
        root.style.setProperty('--accent', accent);
        root.dataset.theme = name;
        // Preserve the theme sampling above; this native window has a fixed light palette.
        for (const [k, v] of Object.entries({
          bg: '#f4f7fb',
          panel: '#fff',
          fg: '#171735',
          muted: '#606381',
          line: '#e1e5ef',
          accent: '#5146ff',
        }))
          root.style.setProperty(`--${k}`, v);
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebarDraw = roomy && rng.bool(0.35);
        const navDraw = W >= 1180 && rng.bool(0.5);
        // This design uses a persistent horizontal app bar and a slim counts inspector.
        const sidebar = false;
        const nav = true;
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarDraw, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, nav, rng, util } = _c;
        const { TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        if (display !== 'header' || nav) {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header);
          brand.innerHTML =
            '<svg aria-hidden="true" viewBox="0 0 32 32" width="30" height="30"><rect x="1" y="5" width="19" height="23" rx="4" fill="#5266df"/><rect x="12" y="1" width="18" height="20" rx="4" fill="#8294f2"/><path d="M8 11h8M12 7v13" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg><span>TeamHub</span>';
          brand.dataset.role = 'brand';
        }
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          const sampledNav = rng.sample(content.NAV_ITEMS, rng.int(3, 5));
          for (const item of ['Home', 'Chat', 'Teams', 'Meetings', 'Files', 'Calendar']) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
          const search = util.el('div', 'chat-search', header, '⌕　 Search messages, people, or files');
          const bell = util.el('div', 'chat-bell', header);
          bell.innerHTML =
            '<svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg><i></i>';
          const account = util.el('div', 'chat-account', header);
          account.innerHTML = '<span>JD</span><i></i>';
          const windowControls = util.el('div', 'chat-window-controls', header);
          for (const glyph of ['−', '□', '×']) {
            const control = util.el('span', '', windowControls);
            control.setAttribute('aria-hidden', 'true');
            control.textContent = glyph;
          }
        }
        Object.assign(_c, { header });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const stats = util.el('aside', 'chat-stats', body);
        for (const [icon, value] of [
          ['♙', '18'],
          ['▤', ''],
          ['⚑', '0'],
          ['↗', '12'],
        ]) {
          const row = util.el('div', 'chat-stat', stats);
          const symbol = util.el('span', '', row);
          const paths = {
            '♙': '<circle cx="9" cy="7" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2z"/><circle cx="17" cy="8" r="2.5"/><path d="M16 14a5 5 0 0 1 5 5v1h-4"/>',
            '▤': '<path d="M5 3h11l4 4v14H5z"/><path d="M15 3v5h5M8 12h9M8 16h9"/>',
            '⚑': '<path d="m15 3 6 6-4 2-4 6-3-3-6 7 5-8-3-3 6-3z"/>',
            '↗': '<path d="m9 15 6-6M8 17l-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m2-1 2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0" transform="translate(1 0)"/>',
          };
          symbol.innerHTML = `<svg aria-hidden="true" viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[icon]}</svg>`;
          if (value) util.el('span', '', row, value);
        }
        Object.assign(_c, { stage, stats });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-chat-pinreact-01',
    template: 'site/base',
    design: { parts },
  });
})();
