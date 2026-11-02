(function () {
  'use strict';
  const palette = { bg: '#f4f5f7', panel: '#ffffff', fg: '#171a20', muted: '#687386', line: '#d7dce4' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', shell);
      const top = u.el('header', 'ds-top', content);
      u.el('div', 'ds-lights', top, '');
      const tabs = u.el('nav', 'ds-menu', top);
      ['Overview', 'Transactions', 'Budgets', 'Reports'].forEach((t, i) =>
        u.el('div', 'ds-tab' + (i === 2 ? ' active' : '') + (i === 1 ? ' quiet' : ''), tabs, t),
      );
      u.el('div', 'ds-search', top, '⌕　Search');
      const rail = u.el('aside', 'ds-rail', shell);
      u.el('h2', '', rail, 'Budgets');
      [
        ['◷', 'All Budgets', '8'],
        ['♧', 'Marketing', '3'],
        ['⬡', 'Product', '2'],
        ['⚙', 'Operations', '2'],
        ['♧', 'People', '1'],
      ].forEach((x, i) => {
        const r = u.el('div', 'ds-navrow' + (i === 1 ? ' selected' : ''), rail);
        u.el('span', 'ds-navicon', r, x[0]);
        u.el('span', '', r, x[1]);
        u.el('span', 'ds-count', r, x[2]);
      });
      Object.assign(_c, { shell, contentEl: content, top, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const main = u.el('div', 'ds-main', _c.contentEl);
      const inspector = u.el('aside', 'ds-inspector', main);
      u.el('h1', '', inspector, 'Marketing Campaign');
      u.el('div', 'ds-category', inspector, '●　Marketing');
      [
        ['Amount (USD)', '$25,000'],
        ['Period', 'Monthly'],
        ['Category', '♧ Marketing'],
        ['Budget Month', '—'],
        ['Notes', 'Q4 campaign across digital and events.'],
      ].forEach((x) => {
        const r = u.el('div', 'ds-inspector-row', inspector);
        u.el('span', '', r, x[0]);
        u.el('b', '', r, x[1]);
      });
      u.el('h3', '', inspector, 'Spending');
      u.el('div', 'ds-progress', inspector);
      u.el('div', 'ds-spent', inspector, '$8,420 of $25,000 (37%)');
      [
        ['Remaining', '$16,580'],
        ['Days left in month', '12'],
      ].forEach((x) => {
        const r = u.el('div', 'ds-inspector-row', inspector);
        u.el('span', '', r, x[0]);
        u.el('b', '', r, x[1]);
      });
      u.el('h3', 'ds-history-head', inspector, 'History');
      const hist = u.el('table', 'ds-history', inspector);
      const head = u.el('thead', '', hist);
      const hr = u.el('tr', '', head);
      ['Date　⌃', 'Description', 'Amount'].forEach((x) => u.el('th', '', hr, x));
      const rows = u.el('tbody', '', hist);
      [
        ['Oct 3, 2026', 'Ad creative', '-$2,400'],
        ['Oct 12, 2026', 'Social media', '-$1,020'],
      ].forEach((data) => {
        const tr = u.el('tr', '', rows);
        data.forEach((x) => u.el('td', '', tr, x));
      });
      _c.body = main;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.contentEl.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      const foot = _c.util.el('footer', 'ds-footer', _c.contentEl);
      base(_c);
      const controls = document.body.querySelector('.ref-foot');
      if (controls) foot.appendChild(controls);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
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
    name: 'design-set-date-month-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-month-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#087cff'],
      LOW_ACCENTS: ['#087cff'],
      parts,
    },
  });
})();
