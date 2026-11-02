(function () {
  'use strict';
  const palette = { bg: '#202629', panel: '#191d1f', fg: '#e4e8ec', muted: '#aeb7c0', line: '#353c40' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'MarketTrader Pro');
      u.el('span', 'ds-window-controls', top, '−    □    ×');
      const nav = u.el('nav', 'ds-menu', document.body);
      'File|Edit|View|Tools|Help'.split('|').forEach((t) => u.el('span', '', nav, t));
      u.el('span', 'ds-stock-date', nav, 'Mon Apr 27, 2009  10:24 AM');
      const page = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', page);
      const header = _c.display === 'header' ? u.el('aside', 'ds-header-note', content) : content;
      Object.assign(_c, { top, page, content, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const quotes = u.el('aside', 'ds-quotes', _c.page);
      u.el('h2', '', quotes, 'Quotes');
      const search = u.el('div', 'ds-quote-search', quotes);
      const input = u.el('input', '', search);
      input.value = 'JCA';
      input.setAttribute('aria-label', 'Search quotes');
      const find = u.el('button', '', search, '⌕');
      find.type = 'button';
      find.addEventListener('click', () => env.log('decoy', { label: 'Search quotes' }));
      const active = u.el('section', 'ds-quote-active', quotes);
      u.el('b', '', active, 'JCA');
      u.el('strong', '', active, '$55.62');
      u.el('em', '', active, '+0.78  (+1.42%)');
      const rows = u.el('div', 'ds-quote-rows', quotes);
      [ ['AAPL', '127.14', '+0.56'], ['MSFT', '23.11', '-0.12'], ['GE', '14.87', '+0.03'], ['T', '24.01', '-0.18'] ].forEach((row) => {
        const r = u.el('div', 'ds-quote-row', rows);
        row.forEach((v, i) => u.el('span', i === 2 ? (v[0] === '-' ? 'negative' : 'positive') : '', r, v));
      });
      const body = u.el('div', 'ds-main', _c.content);
      const quick = u.el('aside', 'ds-quick-notes', document.body);
      u.el('h3', '', quick, 'Watchlist');
      u.el('ul', 'ds-quick-values', quick);
      const account = u.el('section', 'ds-account', document.body);
      u.el('h3', '', account, 'Account');
      [ ['Cash', '$12,350.00'], ['Positions', '$8,420.00'], ['Total', '$20,770.00'] ].forEach(([k, v]) => {
        const row = u.el('div', 'ds-account-row', account);
        u.el('span', '', row, k);
        u.el('b', '', row, v);
      });
      _c.body = body;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-stock-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-stock-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#46a3f2'],
      LOW_ACCENTS: ['#46a3f2'],
      parts,
    },
  });
})();
