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
      if (kind === 'promo' || kind === 'chat') util.el('div', 'swing-overlay-title', box, kind === 'promo' ? 'Stay in the know' : 'Need help?');
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
      // The Swing design keeps one quiet palette across every episode theme draw.
      root.style.setProperty('--bg', '#faf9f5');
      root.style.setProperty('--panel', '#fffefa');
      root.style.setProperty('--fg', '#343328');
      root.style.setProperty('--muted', '#77735f');
      root.style.setProperty('--line', '#d8d2c3');
      root.style.setProperty('--accent', '#a98229');
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      document.body.dataset.instruction = display;
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'swing-titlebar', header);
      util.el('div', 'swing-company', titlebar, 'Acme Manufacturing');
      util.el('div', 'swing-appname', titlebar, 'Operations Management System');
      util.el('div', 'swing-meta', titlebar, 'User: jcarter　 |　 Plant: 100　 |　 Apr 24, 2008　10:22 AM');
      const appnav = util.el('nav', 'swing-nav', header);
      for (const [i, item] of ['Home', 'Production', 'Inventory', 'Maintenance', 'Master Data', 'Reports', 'Administration'].entries()) {
        const a = util.el('a', `swing-navlink${i === 3 ? ' active' : ''}`, appnav, item);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { appnav, header, titlebar });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, titlebar, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const headerNote = header.querySelector('.ref-instruction');
      if (headerNote) { headerNote.classList.add('swing-instruction'); titlebar.appendChild(headerNote); }
      Object.assign(_c, { headerNote });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const tips = util.el('aside', 'swing-tips', document.body);
      util.el('span', 'swing-tip-mark', tips, 'i');
      const tipContent = util.el('div', 'swing-tip-content', tips);
      util.el('strong', 'swing-tip-heading', tipContent, 'Field tips');
      const tipRow = util.el('div', 'swing-tip-row', tipContent);
      const tip = (label, text) => {
        const item = util.el('div', 'swing-tip', tipRow);
        util.el('strong', '', item, label);
        util.el('span', '', item, text);
      };
      tip('Cost center', 'Enter a 4-digit cost center code.');
      tip('Routing note', 'Add internal instructions (max 50 characters).');
      tip('Retry limit', 'Number of automatic retries (0–99).');
      Object.assign(_c, { stage, tip, tipContent, tipRow, tips });
    },
  };

  env.site({
    name: 'design-use-legacy-app-swing-03',
    template: 'site/base',
    design: { parts },
  });
})();
