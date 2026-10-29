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
      const bankHead = util.el('div', 'bank-titlebar', header);
      const mark = util.el('div', 'bank-mark', bankHead);
      const mountain = util.svg('svg', { viewBox: '0 0 46 28', 'aria-hidden': 'true' }, mark);
      util.svg('path', { d: 'M1 27 15 5Q18 0 21 5l14 22Z', fill: '#0670c7' }, mountain);
      util.svg('path', { d: 'M12 27 26 4q3-5 6 0l14 23Z', fill: '#2998e9' }, mountain);
      util.svg('path', { d: 'm2 27 13-8 9 5 10-9 12 12Z', fill: '#00549c' }, mountain);
      util.svg('path', { d: 'm15 5 6 10-5-2-6 3Z', fill: '#39a1ef' }, mountain);
      util.el('div', 'bank-wordmark', bankHead, 'Riverton Bank');
      const search = util.el('div', 'bank-search', bankHead);
      const searchIcon = util.svg('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'aria-hidden': 'true' }, search);
      util.svg('path', { d: 'M21 21l-6-6M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z' }, searchIcon);
      util.el('span', '', search, 'Search transactions, payees, or help...');
      const avatar = util.el('div', 'bank-avatar', bankHead, 'JS');
      S.frameBrand(_c, header);
      Object.assign(_c, { avatar, bankHead, header, mark, mountain, search, searchIcon });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { bankHead, ctx, display, header, search, util } = _c;
      if (display === 'header') {
        const note = util.el('div', 'ref-instruction', bankHead, ctx.instruction);
        bankHead.insertBefore(note, search);
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
        ['⌂', 'Home'], ['⇄', 'Transfer'], ['▤', 'Pay Bills'], ['▣', 'Cards'],
        ['◷', 'Recurring'], ['◕', 'Spending'], ['▥', 'Reports'], ['⚙', 'Settings'],
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
        util.svg('path', {d: toolbarPaths[text]}, glyph);
        util.el('span', 'bank-tool-label', item, text);
      }
      Object.assign(_c, { headerTools, menu, submit, toolbar, toolbarItems, toolbarPaths });
    },
  };

  env.site({
    name: 'design-use-bank-limits-01',
    template: 'site/base',
    design: { parts },
  });
})();
