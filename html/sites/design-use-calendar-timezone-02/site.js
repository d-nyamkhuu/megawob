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
        if (kind === 'banner') {
          const title = document.querySelector('.zen-window-title');
          if (title) {
            const box = title.getBoundingClientRect();
            Object.assign(el.style, {
              top: `${box.bottom}px`,
              left: `${box.left}px`,
              right: `${window.innerWidth - box.right}px`,
            });
          }
        }
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
        // This design is the fixed enterprise Lightning palette; keep draws above stable.
        name = 'dark';
        accent = '#ff817f';
        for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name]))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', accent);
        root.dataset.theme = name;
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
        document.body.dataset.display = display;
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        let sidebar = roomy && rng.bool(0.35);
        let nav = W >= 1180 && rng.bool(0.5);
        sidebar = true;
        nav = false;
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const brand = util.el('div', 'ref-brand', header, 'ZenTeam');
        brand.dataset.role = 'brand';
        brand.textContent = '';
        const logo = util.svg('svg', { viewBox: '0 0 34 34', 'aria-hidden': 'true', class: 'zen-logo' }, brand);
        util.svg('rect', { x: 5, y: 1, width: 28, height: 32, rx: 6, fill: '#7664f3' }, logo);
        util.svg('rect', { x: 1, y: 7, width: 15, height: 20, rx: 3, fill: '#6c64f5' }, logo);
        util.svg('path', { d: 'M6 12h8v4h-2v8H8v-8H6z', fill: '#fff' }, logo);
        util.svg('rect', { x: 15, y: 8, width: 12, height: 8, rx: 3, fill: '#fff' }, logo);
        util.svg('rect', { x: 17, y: 18, width: 10, height: 8, rx: 3, fill: '#fff' }, logo);
        util.el('span', '', brand, 'ZenTeam');
        const account = util.el('div', 'zen-account', header);
        const bell = util.svg('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, account);
        util.svg('path', { d: 'M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3M10 21h4' }, bell);
        util.el('i', 'zen-notification-dot', account);
        util.el('span', 'zen-account-avatar', account, 'ZT');
        util.el('span', '', account, '⌄');
        Object.assign(_c, { account, bell, brand, header, logo });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, local, rng, sidebar, util } = _c;
        const { K } = S;
        const body = util.el('div', 'ref-body', document.body);
        if (sidebar) {
          const side = util.el('aside', 'ref-side', body);
          for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav)) {
            const a = util.el('a', 'ref-sidelink', side, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'sidebar', label: item });
            });
          }
          const paths = [
            'M3 11 12 3l9 8M5 10v11h5v-7h4v7h5V10',
            'M4 5h16v16H4zM4 10h16M8 2v6M16 2v6',
            'M7 4h10l3 4v13H4V8zM8 12l3 3 5-6',
            'M3 4h18v14H9l-5 4v-4H3zM7 8h10M7 12h7',
            'M8 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M2 22v-4a6 6 0 0 1 12 0v4M17 4a4 4 0 0 1 0 8M18 15a5 5 0 0 1 4 5',
            'M5 2h10l5 5v15H5zM14 2v7h6',
            'M3 4h18v17H3zM7 8h10M7 12h5M7 16h8',
            'M3 3h18v18H3zM7 17v-5M12 17V7M17 17v-8',
          ];
          const links = [...side.children];
          const labels = ['Home', 'Calendar', 'Tasks', 'Messages', 'People', 'Files', 'Projects', 'Reports'];
          labels.forEach((text, i) => {
            const a = links[i] || util.el('a', 'ref-sidelink', side);
            a.textContent = '';
            a.title = text;
            const svg = util.svg('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, a);
            util.svg('path', { d: paths[i] }, svg);
            util.el('span', '', a, text);
            if (!links[i]) a.addEventListener('click', () => env.log('decoy', { what: 'sidebar', label: text }));
          });
          const settings = util.el('a', 'ref-sidelink zen-settings', side);
          const gear = util.svg('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, settings);
          util.svg(
            'path',
            {
              d: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M9 3l-1 3-3 1-2 3 2 2-1 3 2 3 3-1 3 3 3-1 1-3 3-1 2-3-2-2 1-3-2-3-3 1-3-3z',
            },
            gear,
          );
          util.el('span', '', settings, 'Settings');
        }
        const calendarSide = util.el('aside', 'zen-calendar-side', body);
        util.el('h1', '', calendarSide, 'Calendar');
        const newEvent = util.el('button', 'zen-new-event', calendarSide, '＋  New event');
        newEvent.addEventListener('click', () => env.log('decoy', { label: 'New event' }));
        const groups = [
          [
            'Calendars',
            [
              ['Team', '#f18a91'],
              ['My calendar', '#9bc4ff'],
              ['Product', '#a7d3bd'],
              ['Engineering', '#f2d98b'],
              ['Design', '#c299eb'],
              ['Marketing', '#79c9ce'],
            ],
          ],
          [
            'My calendars',
            [
              ['Personal', null],
              ['Birthdays', null],
            ],
          ],
          [
            'Other calendars',
            [
              ['Holidays', '#ff8c52'],
              ['Company events', '#609eff'],
            ],
          ],
        ];
        for (const [heading, items] of groups) {
          const group = util.el('section', 'zen-calendar-group', calendarSide);
          util.el('h2', '', group, heading);
          for (const [text, color] of items) {
            const row = util.el('div', 'zen-calendar-row', group);
            const check = util.el('i', '', row, color ? '✓' : '');
            if (color) check.style.background = color;
            util.el('span', '', row, text);
          }
        }
        const upcoming = util.el('section', 'zen-upcoming', calendarSide);
        util.el('h2', '', upcoming, 'Upcoming this week');
        util.el('div', 'zen-upcoming-events', upcoming);
        Object.assign(_c, { body, calendarSide, groups, newEvent, upcoming });
      },
  };

  env.site({
    name: 'design-use-calendar-timezone-02',
    template: 'site/base',
    design: { parts },
  });
})();
