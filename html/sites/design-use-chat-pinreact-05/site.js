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
        const nav = false;
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarDraw, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { nav, util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const brand = util.el('div', 'ref-brand', header);
        brand.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" width="25" height="25"><path fill="white" d="M3 4h18v13H9l-5 4v-4H3z"/><path fill="#0078d7" d="M7 8h11v1.5H7zm0 3h8v1.5H7z"/></svg><span>TeamChat</span><i>|</i><span>Field Ops</span>';
        brand.dataset.role = 'brand';
        const windowControls = util.el('div', 'chat-window-controls', header);
        for (const glyph of ['−', '□', '×']) {
          const control = util.el('span', '', windowControls);
          control.setAttribute('aria-hidden', 'true'); control.textContent = glyph;
        }
        Object.assign(_c, { header });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const stats = util.el('aside', 'chat-stats', body);
        for (const [icon, value] of [['♙', '12 members'], ['▤', 'Shared files'], ['↗', 'Pinned messages　1']]) {
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
        const sections = [
          ['Upcoming meeting', '▣', 'Field Ops Sync', 'Today, 11:00 AM – 11:30 AM'],
          ['Help & tips', '☻', 'Add a reaction', 'Click the smiley face on any message to add a reaction.'],
          ['', '⚒', 'Pin a message', 'Open the more actions menu (…) on a message and choose Pin message.'],
          ['', '↶', 'Reply to a thread', 'Use the reply icon to start a threaded conversation.'],
        ];
        sections.forEach(([heading, icon, title, copy], i) => {
          if (heading) util.el('h3', 'chat-section-title', stats, heading);
          const card = util.el('div', 'chat-tip tip-' + i, stats);
          util.el('span', 'chat-tip-icon', card, icon);
          const words = util.el('div', 'chat-tip-copy', card);
          util.el('strong', '', words, title); util.el('p', '', words, copy);
          if (i === 0) util.el('button', 'chat-join', card, 'Join');
        });
        Object.assign(_c, { stage, stats });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-chat-pinreact-05',
    template: 'site/base',
    design: { parts },
  });
})();
