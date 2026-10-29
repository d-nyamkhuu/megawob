// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const lineIcon = (util, parent, name, cls = '') => {
    const paths = {
      card:'M3 5h18v14H3ZM3 10h18M6 15h4',
      transfer:'M3 7h17m-4-4 4 4-4 4M21 17H4m4-4-4 4 4 4',
      bill:'M5 2h9l5 5v15H5ZM14 2v6h5M8 12h8m-8 4h8',
      statement:'M5 2h14v20H5ZM8 7h8m-8 5h8m-8 5h6',
      cart:'M2 3h3l3 12h11l3-9H6M9 20h1m7 0h1',
      dining:'M4 2v7h6V2M7 2v20M18 2c-5 2-5 9 0 10v10M18 2v10',
      car:'M4 10 6 4h12l2 6M3 10h18v9H3ZM6 19v3m12-3v3M6 14h2m8 0h2',
      more:'M5 12h.01M12 12h.01M19 12h.01',
      lock:'M5 10h14v12H5ZM8 10V6a4 4 0 0 1 8 0v4M12 14v4',
      bell:'M4 18h16l-3-4V8a5 5 0 0 0-10 0v6ZM10 21h4M12 1v2',
      shield:'M12 2 21 6v6c0 6-9 10-9 10S3 18 3 12V6ZM7 12l3 3 7-7',
      gear:'M9 3h6l1 3 3 1 2 4-2 3v4l-4 3-3-1-3 1-4-3v-4l-2-3 2-4 3-1ZM16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0',
    };
    const svg=util.svg('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':name==='more'?'3':'1.7','stroke-linecap':'round','stroke-linejoin':'round',class:cls,'aria-hidden':'true'},parent);
    util.svg('path',{d:paths[name]||paths.card},svg);
    return svg;
  };

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      if (!_c.ctx.finish && _c.ctx.rng.fork('bank/end-placement').bool(0.5)) {
        _c.placement = 'footer';
        _c.wantFooter = true;
        _c.label = _c.word ? _c.label : 'Continue';
        if (_c.collide && _c.collide.text === _c.label) _c.collide.text = 'All set';
      }
    },
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      document.body.dataset.bankOverlay = kind;
      el.dataset.role = 'overlay';
      const dock = document.querySelector('.ref-foot, .ref-float-dock');
      const bottom = dock ? window.innerHeight - dock.getBoundingClientRect().top : 0;
      if (kind === 'cookie' || kind === 'chat') el.style.bottom = `${bottom + 16}px`;
      if (kind === 'banner') el.style.top = `${document.querySelector('.bank-toolbar').getBoundingClientRect().bottom}px`;
      if (kind === 'promo') {
        el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom}px`;
        el.style.bottom = `${bottom}px`;
      }
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      if (kind === 'cookie') {
        const icon = util.svg('svg', { viewBox: '0 0 32 32', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', class: 'bank-cookie-icon', 'aria-hidden': 'true' }, box);
        util.svg('path', { d: 'M27 16a6 6 0 0 1-7-8 5 5 0 0 1-6-4A12 12 0 1 0 28 18Z' }, icon);
        for (const [cx, cy] of [[11,12],[9,21],[18,23],[18,16],[23,25]]) util.svg('circle', { cx, cy, r: '1.4', fill: 'currentColor', stroke: 'none' }, icon);
      }
      if (kind === 'promo') {
        util.el('div', 'bank-promo-art', box, '✉');
        util.el('h3', 'bank-promo-title', box, 'Stay in the know');
      }
      const message = util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      if (kind === 'cookie') {
        const heading = util.el('strong', 'bank-cookie-title', message, 'We use cookies');
        message.prepend(heading);
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
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const controls = util.el('div', 'bank-window-controls', document.body);
      for (const glyph of ['—', '□', '×']) util.el('span', '', controls, glyph);
      const bankHead = util.el('div', 'bank-titlebar', header);
      const mark = util.el('div', 'bank-mark', bankHead);
      const mountain = util.svg('svg', { viewBox: '0 0 40 40', fill:'none', stroke:'currentColor', 'stroke-width':'2', 'aria-hidden': 'true' }, mark);
      util.svg('path', { d:'M3 12 20 4l17 8H3ZM6 16h28M6 34h28M3 38h34M9 17v15m7-15v15m8-15v15m7-15v15' }, mountain);
      util.el('div', 'bank-wordmark', bankHead, 'Rivermere Bank');
      const search = util.el('div', 'bank-search', bankHead);
      const searchIcon = util.svg('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'aria-hidden': 'true' }, search);
      util.svg('path', { d: 'M21 21l-6-6M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z' }, searchIcon);
      util.el('span', '', search, 'Search');
      const avatar = util.el('div', 'bank-avatar', bankHead, 'JS');
      S.frameBrand(_c, header);
      Object.assign(_c, { avatar, bankHead, header, mark, mountain, search, searchIcon });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { bankHead, ctx, display, header, search, util } = _c;
      document.body.dataset.bankDisplay = display;
      document.body.dataset.bankOverlay = '';
      if (display === 'header') {
        util.el('div', 'ref-instruction bank-header-note', header, ctx.instruction);
      }
      else util.el('div', 'ref-spacer', header);
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const menu = util.el('nav', 'bank-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Accounts', 'Payments', 'Cards', 'Tools', 'Help']) {
        util.el('span', 'bank-menu-item', menu, item);
      }
      const toolbar = util.el('nav', 'bank-toolbar', document.body);
      const toolbarItems = [
        ['⌂', 'Home'], ['▤', 'Accounts'], ['⇄', 'Transfer & Pay'], ['▣', 'Cards'],
        ['◷', 'Transactions'], ['◕', 'Support'],
      ];
      const toolbarPaths = {
        Home: 'M3 11 12 3l9 8M6 10v11h5v-7h3v7h5V10',
        Transfer: 'M3 7h17m-4-4 4 4-4 4M21 17H4m4-4-4 4 4 4',
        'Pay Bills': 'M6 3h9l4 4v14H6Zm9 0v5h4M9 12h7m-7 4h7',
        Cards: 'M3 5h18v14H3ZM3 10h18M6 15h4',
        Recurring: 'M4 6v5h5M4 11a8 8 0 1 1 1 7M12 6v6l4 2',
        Spending: 'M11 3a9 9 0 1 0 10 10H11ZM14 2v8h8a9 9 0 0 0-8-8Z',
        Reports: 'M3 21h18M6 17V5h3v12m3 0V9h3v8m3 0v-5h3v5',
        Settings: 'M10 3h4l1 3 3-1 2 3-2 3 2 3-2 3-3-1-1 3h-4l-1-3-3 1-2-3 2-3-2-3 2-3 3 1Zm6 9a4 4 0 1 0-8 0 4 4 0 0 0 8 0',
      };
      for (const [icon, text] of toolbarItems) {
        const item = util.el('div', `bank-tool${text === 'Cards' ? ' selected' : ''}`, toolbar);
        const glyph = util.svg('svg', {viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'bank-tool-icon'}, item);
        util.svg('path', {d: toolbarPaths[text] || 'M4 5h16v14H4z'}, glyph);
        util.el('span', 'bank-tool-label', item, text);
      }
      const rail = util.el('aside', 'bank-rail', document.body);
      util.el('h2', '', rail, 'Good morning, Jordan');
      const accounts = util.el('section', 'bank-rail-card', rail);
      util.el('h3', '', accounts, 'Accounts');
      util.el('span', 'bank-accounts-all', accounts, 'View all');
      for (const [name, value] of [['Checking', '$4,892.17'], ['Savings', '$12,340.00'], ['Credit Card', '$1,208.36']]) {
        const row = util.el('div', 'bank-account', accounts);
        util.el('span', '', row, name); util.el('strong', '', row, value); util.el('b', '', row, '›');
      }
      const quick = util.el('section', 'bank-rail-card bank-quick', rail);
      util.el('h3', '', quick, 'Quick actions');
      for (const [icon, label] of [['card','Make a payment'],['transfer','Transfer money'],['bill','Pay a bill'],['statement','View statements']]) {
        const row = util.el('div', 'bank-quick-row', quick);
        lineIcon(util, row, icon, 'bank-side-icon'); util.el('span', '', row, label);
      }
      const summary = util.el('aside', 'bank-summary', document.body);
      const activity = util.el('section', 'bank-summary-card', summary);
      util.el('h3', '', activity, 'Card activity'); util.el('small', '', activity, '(last 30 days)');
      util.el('strong', 'bank-count', activity, '28'); util.el('div', 'bank-transactions-label', activity, 'Transactions');
      for (const [icon, label, count] of [['cart','Retail','12'],['dining','Dining','7'],['car','Travel','4'],['more','Other','5']]) {
        const row = util.el('div', 'bank-stat-row', activity); lineIcon(util, row, icon, 'bank-side-icon'); util.el('span', '', row, label); util.el('strong', '', row, count);
      }
      const security = util.el('section', 'bank-summary-card bank-security', summary);
      util.el('h3', '', security, 'Security tools');
      for (const [icon, label] of [['lock','Card controls'],['bell','Manage alerts'],['shield','Report a lost or stolen card'],['gear','Update PIN']]) {
        const row = util.el('div', 'bank-stat-row', security); lineIcon(util, row, icon, 'bank-side-icon'); util.el('span', '', row, label); util.el('strong', '', row, '›');
      }
      Object.assign(_c, { headerTools, menu, submit, toolbar, toolbarItems, toolbarPaths, rail, summary });
    },
  };

  env.site({
    name: 'design-use-bank-limits-05',
    template: 'site/base',
    design: { parts },
  });
})();
