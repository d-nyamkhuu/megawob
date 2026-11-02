(function () {
  'use strict';
  const palette = { bg: '#24384f', panel: '#202629', fg: '#e2e6eb', muted: '#aeb5bc', line: '#495158' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The existing frame has dedicated space for each note mode, even at small sizes.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const win = u.el('div', 'cb-window', document.body);
      const title = u.el('header', 'cb-titlebar', win);
      u.el('span', 'cb-appicon', title, '▦');
      u.el('span', 'cb-title', title, 'ClearBooks Pro - Orders');
      const controls = u.el('span', 'cb-win-controls', title);
      ['−', '□', '×'].forEach((x, i) => u.el('span', 'cb-win-btn cb-w' + i, controls, x));
      const menu = u.el('nav', 'cb-menubar', win);
      ['File', 'Edit', 'View', 'Records', 'Tools', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const toolbar = u.el('div', 'cb-toolbar', win);
      [ ['▤', 'New Order'], ['✎', 'Edit'], ['✖', 'Delete'], ['▤', 'Print'], ['✉', 'Send by Email'] ].forEach((it, i) => {
        const b = u.el('div', 'cb-tool' + ([2, 3].includes(i) ? ' cb-tool-sep' : ''), toolbar);
        u.el('b', '', b, it[0]);
        u.el('span', '', b, it[1]);
        if (i === 3) u.el('small', '', b, '▾');
      });
      const search = u.el('div', 'cb-search', toolbar);
      u.el('b', '', search, '⌕');
      u.el('span', '', search, 'Search orders');
      const content = u.el('div', 'cb-content', win);
      Object.assign(_c, { win, toolbar, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const summary = u.el('section', 'cb-summary', _c.content);
      u.el('div', 'cb-docicon', summary, '▤');
      const details = u.el('div', 'cb-summary-main', summary);
      const heading = u.el('div', 'cb-record-heading', details);
      u.el('strong', '', heading, 'Order');
      u.el('span', '', heading, 'OR-10426');
      const facts = u.el('div', 'cb-facts', details);
      [ ['Customer', 'Riverside Supplies'], ['Contact', 'Daniel Carter'], ['Billing address', 'Unit 4, Riverside Business Park'], ['', 'Bristol   BS1 6PL'] ].forEach((a) => {
        const r = u.el('div', 'cb-fact', facts);
        u.el('span', '', r, a[0]);
        u.el('b', '', r, a[1]);
      });
      const dates = u.el('div', 'cb-datefacts', summary);
      [ ['Order date', '14 Apr 2009'], ['Status', 'Completed'], ['Payment terms', '30 days'], ['Due date', '14 May 2009'] ].forEach((a) => {
        const r = u.el('div', 'cb-fact', dates);
        u.el('span', '', r, a[0]);
        u.el('b', '', r, a[1]);
      });
      const totals = u.el('div', 'cb-totals', summary);
      [ ['Total (GBP)', '1,250.00'], ['VAT', '250.00'], ['Order total', '1,250.00'] ].forEach((a, i) => {
        const r = u.el('div', 'cb-total' + (i === 2 ? ' cb-grand' : ''), totals);
        u.el('span', '', r, a[0]);
        u.el('b', '', r, a[1]);
      });
      const main = u.el('div', 'cb-workspace', _c.content);
      const related = u.el('section', 'cb-related' + (_c.display === 'panel' ? ' with-task-note' : ''), main);
      u.el('h3', '', related, 'Related payments');
      Object.assign(_c, { body: main, related });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.related;
      base(_c);
      _c.body = body;
      const note = _c.related.querySelector('.ref-panel-title');
      if (note) note.textContent = 'Task note';
      const u = _c.util;
      const table = u.el('div', 'cb-table', _c.related);
      const head = u.el('div', 'cb-row cb-row-head', table);
      ['Date', 'Payment reference', 'Amount (GBP)', 'Method'].forEach((t) => u.el('span', '', head, t));
      [ ['20 Mar 2009', 'PAY-001983', '250.00', 'Bank Transfer'], ['28 Mar 2009', 'PAY-001997', '500.00', 'Bank Transfer'], ['06 Apr 2009', 'PAY-002011', '250.00', 'Cheque'] ].forEach((row) => {
        const r = u.el('div', 'cb-row', table);
        row.forEach((t) => u.el('span', '', r, t));
      });
      for (let i = 0; i < 9; i++) {
        const r = u.el('div', 'cb-row cb-empty', table);
        for (let j = 0; j < 4; j++) u.el('span', '', r, '');
      }
      u.el('div', 'cb-scrollbar', _c.related);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage cb-stage', _c.body);
      _c.body.insertBefore(_c.stage, _c.related);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.content.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const dock = u.el('footer', 'ds-footer cb-dock', _c.win);
      const nav = u.el('div', 'cb-dock-nav', dock);
      [ ['◴', 'Dashboard'], ['♟♟', 'Customers'], ['▤', 'Orders'], ['▧', 'Invoices'], ['◉', 'Payments'], ['⬡', 'Products'], ['▥', 'Reports'] ].forEach((it, i) => {
        const x = u.el('div', 'cb-dock-item' + (i === 2 ? ' active' : ''), nav);
        u.el('b', '', x, it[0]);
        u.el('span', '', x, it[1]);
      });
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      dock.appendChild(foot);
      _c.dock = dock;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.dock.appendChild(dock);
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
    name: 'design-type-text-copy-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-type-text-copy-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#4b83c5'],
      LOW_ACCENTS: ['#4b83c5'],
      parts,
    },
  });
})();
