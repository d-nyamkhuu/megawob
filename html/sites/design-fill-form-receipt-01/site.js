(function () {
  'use strict';
  const palette = { bg: '#f1f2f3', panel: '#f8f8f8', fg: '#202938', muted: '#68727d', line: '#cbd0d5' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, '▧  Expense Manager');
      const controls = u.el('span', 'ds-window-controls', top);
      u.el('span', '', controls, '−');
      u.el('span', '', controls, '□');
      u.el('span', '', controls, '×');
      _c.header = top;
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'ds-menu', document.body);
      'File|Edit|View|Tools|Help'.split('|').forEach((x) => u.el('span', '', nav, x));
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      [ ['▤', 'Expenses'], ['▥', 'Reports'], ['▧', 'Receipts'], ['⚙', 'Settings'] ].forEach(([i, t], n) => {
        const x = u.el('div', 'ds-rail-item' + (!n ? ' active' : ''), rail);
        u.el('b', '', x, i);
        u.el('span', '', x, t);
      });
      _c.contentPane = u.el('div', 'ds-content', body);
      _c.header = _c.contentPane;
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.toolbar = _c.util.el('div', 'ds-toolbar', _c.contentPane);
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      _c.toolbar.hidden = !_c.headerTools.children.length;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const main = u.el('div', 'ds-main', _c.contentPane);
      _c.contentPane.insertBefore(main, _c.toolbar);
      _c.summary = u.el('aside', 'ds-summary', main);
      _c.body = main;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.summary;
      base(_c);
      _c.body = body;
      const panel = _c.summary.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-brief');
      const u = _c.util;
      u.el('h2', '', _c.summary, 'Documents');
      [ ['Total Receipts', '12'], ['Processed', '3'], ['Remaining', '9'] ].forEach(([a, b]) => {
        const row = u.el('div', 'ds-stat', _c.summary);
        u.el('span', '', row, a);
        u.el('b', '', row, b);
      });
      u.el('h3', '', _c.summary, 'Categories');
      [ ['Meals & Entertainment', '6'], ['Travel', '3'], ['Office Supplies', '2'], ['Other', '1'] ].forEach(([a, b]) => {
        const row = u.el('div', 'ds-category', _c.summary);
        u.el('span', '', row, a);
        u.el('span', '', row, b);
      });
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
      _c.body.insertBefore(_c.stage, _c.summary);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.contentPane.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.contentPane.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const text = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, text[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-fill-form-receipt-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { receipt: palette }, LOW_THEME: palette,
      ACCENTS: ['#e98416'], LOW_ACCENTS: ['#e98416'], parts,
    },
  });
})();
