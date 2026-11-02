(function () {
  'use strict';
  const ROWS = [
    ['1', '2024-11-01', 'Office Supplies', 'Office', '-$48.20', 'Posted'],
    ['2', '2024-11-02', 'Client Payment', 'Income', '$1,250.00', 'Posted'],
    ['3', '2024-11-03', 'Cloud Hosting', 'Tech', '-$89.99', 'Posted'],
    ['4', '2024-11-04', 'Travel Expense', 'Travel', '-$320.00', 'Pending'],
    ['5', '2024-11-05', 'Software License', 'Tech', '-$120.00', 'Posted'],
    ['6', '2024-11-06', 'Marketing Ads', 'Marketing', '-$215.40', 'Posted'],
    ['7', '2024-11-07', 'Consulting Fee', 'Income', '$980.00', 'Posted'],
    ['8', '2024-11-08', 'Team Lunch', 'Meals', '-$67.35', 'Pending'],
  ];
  const HEAD = ['#', 'Date', 'Description', 'Category', 'Amount', 'Status'];
  const FILTERS = [['Date range', 'Last 30 days'], ['Category', 'All'], ['Status', 'All']];
  function styleNote(el, display) {
    if (!el) return;
    el.classList.add('instruction');
    el.dataset.display = display;
    const text = el.querySelector('.ref-panel-text, .ref-note-text') || el;
    if (text.textContent.length > 48) el.classList.add('long-instruction');
    if (display === 'toast') el.classList.add('instruction-toast');
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'neo');
      const shell = u.el('main', 'shell', document.body);
      const ledger = u.el('section', 'panel ledger', shell);
      const lh = u.el('div', 'panel-head', ledger);
      u.el('span', '', lh, 'LEDGER (Transactions)');
      u.el('small', '', lh, '8 items');
      const tbl = u.el('table', '', u.el('div', 'panel-body', ledger));
      const hr = u.el('tr', '', u.el('thead', '', tbl));
      HEAD.forEach((h, i) => u.el('th', i === 4 ? 'num' : '', hr, h));
      const tb = u.el('tbody', '', tbl);
      ROWS.forEach((r) => {
        const tr = u.el('tr', '', tb);
        r.forEach((c, i) => u.el('td', i === 4 ? 'num' : '', tr, c));
      });
      const filters = u.el('section', 'panel filters', shell);
      const filterHead = u.el('div', 'panel-head', filters);
      u.el('span', '', filterHead, 'FILTERS');
      const fb = u.el('div', 'filter-body', filters);
      FILTERS.forEach((f) => {
        const g = u.el('div', 'fgroup', fb);
        u.el('label', '', g, f[0]);
        const s = u.el('div', 'fake-select', g);
        u.el('span', '', s, f[1]);
        u.el('i', '', s);
      });
      const actions = u.el('section', 'panel actions', shell);
      u.el('div', 'panel-head', actions, 'ACTIONS');
      const ab = u.el('div', 'actions-body', actions);
      const stage = u.el('div', 'stage', ab);
      const row = u.el('div', 'submit-row', ab);
      const prev = u.el('section', 'panel preview', shell);
      u.el('div', 'panel-head', prev, 'PREVIEW');
      const pb = u.el('div', 'preview-body', prev);
      u.el('p', '', pb, 'No transaction selected.\nSelect a row from the ledger\nto see details here.');
      pb.insertAdjacentHTML('beforeend', '<svg aria-hidden="true" viewBox="0 0 80 96"><path d="M9 3h47l20 20v64q0 6-6 6H9q-6 0-6-6V9q0-6 6-6Z"/><path d="M56 3v20h20" fill="#808080"/><path d="M21 38h38M21 52h38M21 66h25" fill="none"/></svg>');
      Object.assign(_c, { shell, header: shell, stage, row, filterHead });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      styleNote(_c.header.querySelector('.ref-instruction'), _c.display);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.row;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.shell; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      styleNote(_c.shell.querySelector('.ref-panel'), _c.display);
    },
    'frame.stage': () => () => {},
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.shell.appendChild(note);
        styleNote(note, _c.display);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.filterHead.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.row.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  const palette = { bg: '#ffe351', panel: '#faf6e8', fg: '#0a0a0a', muted: '#808080', line: '#0a0a0a' };
  env.site({
    name: 'design-click-control-sequence-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#7fd69a'], LOW_ACCENTS: ['#7fd69a'], parts,
    },
  });
})();
