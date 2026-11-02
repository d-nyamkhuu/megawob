(function () {
  'use strict';
  const palette = { bg: '#00605e', panel: '#eee8d5', fg: '#15130e', muted: '#625d50', line: '#77766e' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
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
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('div', 'ds-logo', top);
      u.el('span', 'ds-globe', logo, '');
      const brand = u.el('div', 'ds-brand', top);
      u.el('div', 'ds-title', brand, 'Sunrise Software');
      u.el('div', 'ds-subtitle', brand, 'CUSTOMER MANAGER');
      const vista = u.el('div', 'ds-vista', top);
      u.el('div', '', vista, 'PEOPLE');
      u.el('div', '', vista, 'PRODUCTS');
      u.el('div', '', vista, 'SUPPORT');
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      [
        ['♟', 'Customers'], ['◉', 'Products'], ['▤', 'Orders'],
        ['◖', 'Support'], ['▥', 'Reports'], ['⚙', 'Settings'],
      ].forEach((x, i) => {
        const a = u.el('div', 'ds-navitem' + (i === 0 ? ' active' : ''), rail);
        u.el('span', 'ds-navicon', a, x[0]);
        u.el('span', '', a, x[1]);
      });
      const content = u.el('div', 'ds-content', body);
      const board = u.el('section', 'ds-board', content);
      u.el('h1', 'ds-board-title', board, 'Customers');
      const filter = u.el('div', 'ds-filter', board);
      u.el('span', '', filter, 'Show:');
      u.el('span', 'ds-select', filter, 'All Customers　　▾');
      const table = u.el('div', 'ds-table', board);
      const head = u.el('div', 'ds-row ds-row-head', table);
      ['Last Name', 'First Name', 'City'].forEach((x) => u.el('span', '', head, x));
      [
        ['Baker', 'Susan', 'Denver'], ['Carter', 'Michael', 'Seattle'],
        ['Chang', 'Kevin', 'San Jose'], ['Davis', 'Amy', 'Portland'],
        ['Garcia', 'Robert', 'Austin'], ['Hall', 'Patricia', 'Chicago'],
        ['Kim', 'Daniel', 'Boston'], ['Lopez', 'Maria', 'Phoenix'],
        ['Mitchell', 'James', 'Columbus'], ['Nguyen', 'Linda', 'San Diego'],
        ['Parker', 'William', 'Denver'], ['Reed', 'Karen', 'Raleigh'],
        ['Scott', 'Steven', 'Atlanta'], ['Turner', 'Angela', 'Miami'],
        ['Walker', 'Brian', 'Las Vegas'],
      ].forEach((r, i) => {
        const row = u.el('div', 'ds-row' + (i === 10 ? ' selected' : ''), table);
        r.forEach((x) => u.el('span', '', row, x));
      });
      const stageWrap = u.el('section', 'ds-window' + (_c.display === 'header' ? ' ds-window-note' : ''), content);
      stageWrap.classList.toggle('ds-window-bottom-space', _c.placement === 'footer' || _c.placement === 'link');
      const winbar = u.el('div', 'ds-window-title', stageWrap);
      u.el('strong', '', winbar, 'Edit Customer Information');
      u.el('span', 'ds-window-controls', winbar, '−　□　×');
      Object.assign(_c, { body, contentPane: content, board, filter, stageWrap, winbar, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.winbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.board;
      base(_c);
      _c.body = body;
      const panel = _c.board.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        _c.board.insertBefore(panel, _c.filter);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'sunrise-stage', _c.stageWrap);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        _c.contentPane.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.contentPane.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.classList.add('ds-status');
      text.textContent = 'Customer records';
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
    name: 'design-type-text-complete-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-type-text-complete-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#164c91'],
      LOW_ACCENTS: ['#164c91'],
      parts,
    },
  });
})();
