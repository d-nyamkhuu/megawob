// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
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
      if (kind === 'banner') {
        const header = document.querySelector('.ref-task');
        if (header) el.style.top = `${header.getBoundingClientRect().bottom + 7}px`;
      }
      if (kind === 'chat') {
        const heading = util.el('div', 'ref-chat-heading', box, 'How can we help?');
        box.prepend(heading);
        const composer = util.el('div', 'ref-chat-composer', box, 'Type a message…');
        util.el('span', '', composer, '➤');
      }
      if (kind === 'promo') {
        const art = util.el('div', 'ref-promo-art', box);
        const svg = util.svg('svg', {viewBox:'0 0 160 160', 'aria-hidden':'true'}, art);
        util.svg('circle', {cx:80,cy:85,r:67,fill:'#eff5ff'}, svg);
        util.svg('path', {d:'M28 58 126 44 138 116 40 130Z',fill:'#0060ff'}, svg);
        util.svg('path', {d:'m31 60 56 38 39-50',stroke:'white','stroke-width':3,fill:'none'}, svg);
        util.svg('path', {d:'m46 39-9-11 M65 32l-1-17 M82 29l5-15',stroke:'#0060ff','stroke-width':5,'stroke-linecap':'round'}, svg);
        const heading = util.el('h2', 'ref-promo-heading', box, 'Stay in the know');
        box.prepend(art, heading);
        const email = util.el('div', 'ref-promo-email', box, 'Enter your email address…');
        row.before(email);
        dismiss.classList.add('ref-promo-close');
        dismiss.setAttribute('aria-label', dismiss.textContent);
        dismiss.title = dismiss.textContent;
      }
      if (kind === 'cookie' || kind === 'chat') {
        const end = document.querySelector('[data-role="submit"]');
        if (end) {
          const bounds = end.getBoundingClientRect();
          if (bounds.top > window.innerHeight * .7)
            el.style.bottom = `${window.innerHeight - bounds.top + 12}px`;
        }
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.theme': (base, S) => function (_c) {
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
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      // The sampled theme draws stay intact; this design uses cobalt and chalk.
      root.style.setProperty('--bg', '#f2f5f9');
      root.style.setProperty('--panel', '#ffffff');
      root.style.setProperty('--fg', '#44517b');
      root.style.setProperty('--muted', '#7b85aa');
      root.style.setProperty('--line', '#e1e6f0');
      root.style.setProperty('--accent', '#0060ff');
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, navDraw, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        if (display !== 'header' || navDraw) rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'DATA WORKSPACE');
        brand.dataset.role = 'brand';
        util.el('div', 'ref-mast-tagline', header, 'Browse and edit account records. Changes are written to the primary database.');
        const stats = util.el('div', 'ref-mast-stats', header);
        for (const [value, caption] of [['1,248', 'TOTAL ACCOUNTS'], ['37', 'ACTIVE TODAY'], ['5', 'PENDING UPDATES'], ['0', 'ERRORS']]) {
          const metric = util.el('div', 'ref-metric', stats);
          util.el('strong', '', metric, value);
          util.el('span', '', metric, caption);
        }
        const metadata = util.el('div', 'ref-mast-meta', header);
        for (const [key, value] of [['ENVIRONMENT', 'production'], ['DATABASE', 'app_main'], ['TABLE', 'accounts'], ['LAST SYNC', 'Apr 24, 2025 10:18 UTC']]) {
          util.el('span', '', metadata, key);
          util.el('strong', '', metadata, value);
        }
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        if (navDraw) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const item of ['Code', 'Build', 'Deploy', 'Observability', 'Database', 'Feature Flags', 'Settings']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-dev-tools-dbrow-03',
    template: 'site/base',
    design: { parts },
  });
})();
