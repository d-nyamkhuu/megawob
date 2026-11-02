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
      if (kind === 'cookie') util.el('div', 'ref-cookie-symbol', box, '●');
      const copy = util.el('div', 'ref-ov-copy', box);
      if (kind === 'cookie') util.el('strong', 'ref-ov-heading', copy, 'We use cookies');
      util.el('div', 'ref-ov-text', copy, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
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
      const headerBottom = document.querySelector('.ref-task').getBoundingClientRect().bottom;
      const summary = document.querySelector('.notebook-summary');
      if (kind === 'banner' || kind === 'promo' || kind === 'toast') el.style.top = `${headerBottom + 4}px`;
      if ((kind === 'cookie' || kind === 'chat') && summary) {
        el.style.bottom = `${document.documentElement.clientHeight - summary.getBoundingClientRect().top + 12}px`;
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 ? rng.bool(1) : true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.nav': (base, S) => function (_c) {
      const { content, header, local, nav, rng, util } = _c;
      const { K } = S;
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNavigation = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const navigation = ['Service Desk', 'Directory', 'Compute', 'Storage', 'Network', 'Licensing', 'Reports'];
        const paths = ['M3 5h18v4a3 3 0 0 0 0 6v4H3v-4a3 3 0 0 0 0-6V5Zm12 0v3m0 3v2m0 3v3',
          'M3 21v-7h8v7M13 21v-7h8v7M7 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm10 0a4 4 0 1 1 0 8',
          'M3 3h18v14H3zM8 21h8M12 17v4M6 13h12',
          'M3 6c0-5 18-5 18 0s-18 5-18 0Zm0 0v12c0 5 18 5 18 0V6M3 12c0 5 18 5 18 0',
          'M9 2h6v6H9zM2 16h6v6H2zM16 16h6v6h-6zM12 8v4M5 16v-4h14v4',
          'M3 3h18v18H3zM3 8h18M7 3v5', 'M4 3h16v18H4zM8 6v12M12 6v9M16 6v6'];
        for (const [i, item] of navigation.entries()) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[i]}"/></svg><span>${item}</span>`;
          a.title = sampledNavigation[i % sampledNavigation.length];
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
    },
    'frame.controls': (base, S) => function (_c) {
      const { ctx, label, util } = _c;
      const decoyBtn = (parent, text, collides) => {
        const b = util.el('button', `ref-xtra ${collides ? 'ref-pqs' : 'ref-filler'}`, parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collides ? { label: text, collide: true } : { label: text }));
      };
      const endBtn = (parent, cls, text) => {
        const b = util.el(cls === 'ref-endlink' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => { e.preventDefault(); ctx.submit(); });
        return b;
      };
      Object.assign(_c, { decoyBtn, endBtn });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      const search = util.el('div', 'notebook-search', headerTools);
      search.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></svg><span>Search tickets…</span>';
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const account = util.el('div', 'notebook-account', headerTools);
      account.innerHTML = '<svg viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r="12" fill="#c4cdd5"/><circle cx="13" cy="9" r="4" fill="#303941"/><path d="M5 21c0-9 16-9 16 0" fill="#303941"/></svg><span>Admin</span><span>⌄</span>';
      Object.assign(_c, { account, headerTools, search, submit });
    },
  };

  env.site({
    name: 'design-use-admin-console-tickets-03',
    template: 'site/base',
    design: { parts },
  });
})();
