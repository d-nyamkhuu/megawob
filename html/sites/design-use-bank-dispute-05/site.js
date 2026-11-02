// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  // Left rail items (label, icon path, active).
  const RAIL = [
    ['Accounts', 'M3 6h18v12H3zM3 10h18M6 15h4', true],
    ['Pay & Transfer', 'M4 8h15l-4-4M20 16H5l4 4', false],
    ['Cards', 'M3 6h18v12H3zM3 10h18', false],
    ['Transactions', 'M8 6h13M8 12h13M8 18h13M3 6h1M3 12h1M3 18h1', false],
    ['Disputes', 'M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6zM9 12l2 2 4-4', false],
    ['Statements', 'M6 3h9l4 4v14H6zM9 12h7M9 16h7', false],
    ['Settings', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2', false],
    ['Help', 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.7M12 17h.01', false],
  ];

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const headerEdge = document.querySelector('.ref-task').getBoundingClientRect().bottom;
      const noteEdge = document.querySelector('.bank-workspace > .ref-instruction')?.getBoundingClientRect().bottom || headerEdge;
      const bottomBar = Math.max(document.querySelector('.ref-foot')?.getBoundingClientRect().height || 0,
        document.querySelector('.ref-float-dock')?.getBoundingClientRect().height || 0);
      if (kind === 'banner' || kind === 'toast') el.style.top = `${Math.max(headerEdge, noteEdge) + (kind === 'toast' ? 12 : 0)}px`;
      if (kind === 'cookie' || kind === 'chat') el.style.bottom = `${bottomBar + 14}px`;
      if (kind === 'promo') { el.style.top = `${headerEdge}px`; el.style.bottom = `${bottomBar}px`; }
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
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = 'light';
      const root = document.documentElement;
      let accent = '#ff6b25';
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
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
      if (roomy) rng.bool(0.35);
      if (W >= 1180) rng.bool(0.5);
      const sidebar = false;
      const nav = false;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) rng.pick(TITLES);
      const bankMark = (parent) => {
        const svg = util.svg('svg', {viewBox:'0 0 38 42', class:'bank-mark', 'aria-hidden':'true'}, parent);
        util.svg('path', {d:'M3 24C6 8 18 2 37 2C34 13 24 20 3 24Z', fill:'#2f9a68'}, svg);
        util.svg('path', {d:'M0 40C7 25 17 20 32 20C27 34 16 42 0 40Z', fill:'#2f9a68'}, svg);
        util.svg('path', {d:'M5 22C13 12 24 7 35 4M3 38C12 28 22 24 30 22', fill:'none', stroke:'#8fd1ae', 'stroke-width':'.8'}, svg);
      };
      const brand = util.el('div', 'ref-brand', header);
      bankMark(brand);
      util.el('span', '', brand, 'Pinecrest Bank');
      brand.dataset.role = 'brand';
      Object.assign(_c, { bankMark, brand, header });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      let headerNote = null;
      if (display === 'header') headerNote = util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      Object.assign(_c, { headerNote });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      const date = util.el('span', 'bank-date', headerTools, 'Good morning, Alex Carter');
      date.setAttribute('aria-label', 'Greeting');
      util.el('span', 'bank-tool-divider', headerTools);
      const bell = util.el('span', 'bank-bell', headerTools);
      bell.setAttribute('aria-label', 'Messages');
      const bellSvg = util.svg('svg', {viewBox:'0 0 24 28', fill:'none', stroke:'#4a5563', 'stroke-width':'1.5', 'stroke-linecap':'round', 'stroke-linejoin':'round'}, bell);
      util.svg('path', {d:'M3 9h18v12H3zM3 9l9 7 9-7'}, bellSvg);
      util.el('span', 'bank-msg', headerTools, 'Messages');
      util.el('span', 'bank-tool-divider', headerTools);
      const avatar = util.el('span', 'bank-signout', headerTools, 'Sign out');
      avatar.setAttribute('aria-label', 'Sign out');
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { avatar, bell, bellSvg, date, headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { bankMark, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const inspector = util.el('div', 'bank-inspector', body);
      const rail = util.el('nav', 'bank-rail', inspector);
      for (const [label, d, on] of RAIL) {
        const item = util.el('div', on ? 'bank-rail-item on' : 'bank-rail-item', rail);
        const ic = util.svg('svg', {viewBox:'0 0 24 24', 'aria-hidden':'true'}, item);
        util.svg('path', {d}, ic);
        util.el('span', '', item, label);
      }
      const account = util.el('aside', 'bank-account', inspector);
      util.el('div', 'bank-account-title', account, 'Platinum Checking');
      util.el('div', 'bank-account-number', account, '•••• 4821');
      const card = util.el('div', 'bank-card', account);
      const cardArt = util.svg('svg', {viewBox:'0 0 306 184', preserveAspectRatio:'none', class:'bank-card-art', 'aria-hidden':'true'}, card);
      util.svg('path', {d:'M0 113L306 26V184H0Z', fill:'#63707d', opacity:'.17'}, cardArt);
      util.svg('path', {d:'M0 155C85 121 147 128 211 133C247 137 276 128 306 115V184H0Z', fill:'#162b39', opacity:'.16'}, cardArt);
      util.svg('path', {d:'M0 169C71 144 144 141 215 151C246 154 278 152 306 139V184H0Z', fill:'#6c7781', opacity:'.08'}, cardArt);
      const cardBrand = util.el('div', 'bank-card-brand', card);
      bankMark(cardBrand);
      util.el('span', '', cardBrand, 'Rivermere Bank');
      util.el('div', 'bank-card-bottom', card, '•••• 4821');
      util.el('strong', 'bank-card-network', card, 'VISA');
      const avail = util.el('div', 'bank-balance bank-balance-primary', account);
      util.el('span', '', avail, 'Available balance');
      util.el('strong', '', avail, '$4,892.17');
      const current = util.el('div', 'bank-balance', account);
      util.el('span', '', current, 'Current balance');
      util.el('strong', '', current, '$5,120.03');
      const status = util.el('div', 'bank-status', account);
      util.el('span', 'bank-status-label', status, 'Card status');
      const statusLine = util.el('span', 'bank-status-line', status);
      util.el('span', 'bank-status-dot', statusLine);
      util.el('span', 'bank-status-value', statusLine, 'Active');
      S.frameSidebar(_c, body);
      Object.assign(_c, { account, avail, body, card, cardArt, cardBrand, current, inspector, status, statusLine });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, headerNote, util } = _c;
      const workspace = util.el('div', 'bank-workspace', body);
      const tip = util.el('div', 'bank-tip', workspace);
      util.el('span', 'bank-tip-icon', tip, 'i');
      util.el('span', '', tip, 'Need to dispute a charge?');
      if (headerNote) workspace.appendChild(headerNote);
      const stage = util.el('main', 'ref-stage', workspace);
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage, workspace });
    },
  };

  env.site({
    name: 'design-use-bank-dispute-05',
    template: 'site/base',
    design: { parts },
  });
})();
