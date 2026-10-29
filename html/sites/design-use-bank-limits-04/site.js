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
      if (kind === 'banner') {
        el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom}px`;
      }
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
      const { ACCENTS, LOW_ACCENTS, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      // Keep the legacy draws above stable, while this design uses its fixed bank palette.
      for (const [k, v] of Object.entries({ bg: '#eaf1f6', panel: '#fff', fg: '#10234b', muted: '#687d9f', line: '#d8e2ec' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#0875df');
      root.dataset.theme = 'bank';
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const bankHead = util.el('div', 'bank-titlebar', header);
      util.el('div', 'bank-mark', bankHead);
      util.el('div', 'bank-wordmark', bankHead, 'Rivermark Bank');
      const bankAccount = util.el('div', 'bank-account', bankHead);
      const lineIcon = (parent, path, cls = '') => {
        const svg = util.svg('svg', {viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':'1.8', 'stroke-linecap':'round', 'stroke-linejoin':'round', class:cls, 'aria-hidden':'true'}, parent);
        util.svg('path', {d:path}, svg);
        return svg;
      };
      lineIcon(bankAccount, 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4', 'bank-bell');
      util.el('span', 'bank-divider', bankAccount, '');
      util.el('span', 'bank-avatar', bankAccount, 'JS');
      util.el('span', 'bank-customer', bankAccount, 'Jordan Smith　⌄');
      S.frameBrand(_c, header);
      Object.assign(_c, { bankAccount, bankHead, header, lineIcon });
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
      for (const [icon, text] of toolbarItems) {
        const item = util.el('div', `bank-tool${text === 'Cards' ? ' selected' : ''}`, toolbar);
        util.el('span', 'bank-tool-icon', item, icon);
        util.el('span', 'bank-tool-label', item, text);
      }
      Object.assign(_c, { headerTools, menu, submit, toolbar, toolbarItems });
    },
    'frame.body': (base, S) => function (_c) {
      const { lineIcon, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const summary = util.el('aside', 'bank-summary', body);
      const paths = {
        '▤':'M3 5h18v15H3zM3 10h18M6 14h5M6 17h3',
        '♧':'M5 7 3 5v5l-2 3 3 3 2 5h3l1-3h5l1 3h3l1-6 3-2v-3h-3a8 8 0 0 0-5-5l-1-3-4 3H7zM16 9h.01',
        '🛒':'M2 3h3l3 13h12l3-10H6M9 21h.01M19 21h.01M9 12h11',
        '▱':'m3 10 3-6h12l3 6v8H3zM3 10h18M6 18v3M18 18v3M6 14h2M16 14h2',
        '♨':'M4 4h13v7c0 5-2 8-6 8s-6-3-6-8zM17 6h3a3 3 0 0 1 0 6h-3M2 21h18',
        '▣':'M4 3h10v18H4zM6 5h6v6H6zM2 21h14M14 7h3l3 3v8h-3v-5l-3-2',
        '♙':'M5 10h14v12H5zM8 10V6a4 4 0 0 1 8 0v4M12 15v3',
        '❄':'M12 1v22M2 6l20 12M2 18 22 6M8 3l4 4 4-4M8 21l4-4 4 4M2 10l5-1-1-5M22 14l-5 1 1 5M6 20l1-5-5-1M18 4l-1 5 5 1',
        '⚠':'M12 2 1 22h22zM12 8v7M12 18h.01',
      };
      const summaryCard = (title, rows) => {
        const card = util.el('section', 'bank-summary-card', summary);
        const cap = util.el('div', 'bank-summary-cap', card);
        util.el('strong', '', cap, title);
        util.el('a', '', cap, 'View all');
        const list = util.el('div', 'bank-summary-list', card);
        for (const [index, [icon, primary, secondary, amount]] of rows.entries()) {
          const row = util.el('div', 'bank-summary-row', list);
          const symbol = util.el('span', 'bank-summary-icon', row);
          const bag = 'M5 7h14l2 15H3zM8 9V5a4 4 0 0 1 8 0v4';
          lineIcon(symbol, title === 'Recent Transactions' && index === 3 ? bag : paths[icon]);
          const copy = util.el('span', 'bank-summary-copy', row);
          util.el('span', '', copy, primary);
          if (secondary) util.el('small', '', copy, secondary);
          if (amount) {
            const values = util.el('span', 'bank-summary-amount', row, amount);
            if (title === 'Recent Transactions') util.el('small', '', values, ['Groceries','Transport','Dining','Shopping','Auto'][index]);
          }
          if (title === 'Accounts') lineIcon(row, 'm9 5 7 7-7 7', 'bank-account-chevron');
        }
      };
      summaryCard('Accounts', [['▤','Checking','•••• 2841','$4,892.17'],['♧','Savings','•••• 7062','$12,430.55'],['▤','Everyday Debit','•••• 8426','$1,206.18'],['▤','Credit Card','•••• 3159','$873.21']]);
      summaryCard('Recent Transactions', [['🛒','Whole Foods Market','Apr 12, 2016','$56.24'],['▱','Uber','Apr 11, 2016','$12.80'],['♨','Starbucks','Apr 10, 2016','$4.75'],['♧','Amazon','Apr 9, 2016','$89.99'],['▣','Shell','Apr 8, 2016','$34.20']]);
      summaryCard('Card Security', [['♙','Cards active','','3'],['❄','Cards frozen','','0'],['⚠','Disputes in progress','','1']]);
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, paths, summary, summaryCard });
    },
  };

  env.site({
    name: 'design-use-bank-limits-04',
    template: 'site/base',
    design: { parts },
  });
})();
