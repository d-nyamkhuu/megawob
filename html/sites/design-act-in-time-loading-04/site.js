(function () {
  'use strict';
  const palette = { bg: '#e9e7df', panel: '#f0eee7', fg: '#202124', muted: '#777b80', line: '#b8b7b2' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has dedicated note locations at every viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const u = _c.util;
      const top = u.el('header', 'gtk-title', document.body);
      u.el('span', 'gtk-cart', top, '🛒');
      u.el('strong', 'gtk-name', top, 'ShopEasy');
      const controls = u.el('div', 'gtk-window', top);
      ['−', '□', '×'].forEach((x, i) => {
        const b = u.el('button', 'gtk-winbtn' + (i === 2 ? ' close' : ''), controls, x);
        b.type = 'button';
      });
      const shell = u.el('div', 'gtk-shell', document.body);
      const side = u.el('aside', 'gtk-inspector', shell);
      const details = u.el('section', 'gtk-details', side);
      u.el('h2', '', details, 'Search Details');
      const pairs = [
        ['Query', 'pet supplies'], ['Category', 'All Categories'],
        ['Price Range', 'Any'], ['Brand', 'Any'], ['Seller', 'Any'],
      ];
      pairs.forEach(([k, v]) => {
        const row = u.el('div', 'gtk-detail-row', details);
        u.el('span', '', row, k + ':');
        u.el('span', '', row, v);
      });
      u.el('div', 'gtk-rule', side);
      const filters = u.el('section', 'gtk-filters', side);
      u.el('h2', '', filters, 'Filters');
      [['Category', 'All Categories'], ['Brand', 'Any'], ['Condition', 'Any']].forEach(([k, v]) => {
        const f = u.el('label', 'gtk-field', filters, k);
        const box = u.el('button', 'gtk-select', f, v + '　⌄');
        box.type = 'button';
      });
      const price = u.el('label', 'gtk-field', filters, 'Price Range');
      const range = u.el('div', 'gtk-range', price);
      u.el('input', '', range).type = 'text';
      u.el('span', '', range, '–');
      u.el('input', '', range).type = 'text';
      [['Free shipping only'], ['In stock only']].forEach(([x]) => {
        const l = u.el('label', 'gtk-check', filters);
        const cb = u.el('input', '', l);
        cb.type = 'checkbox';
        u.el('span', '', l, x);
      });
      const work = u.el('div', 'gtk-work', shell);
      Object.assign(_c, { top, shell, side, work, header: work });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('gtk-instruction-head');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.top.insertBefore(_c.headerTools, _c.top.querySelector('.gtk-window'));
    },
    'frame.body': () => (_c) => { _c.body = _c.shell; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.side;
      base(_c);
      _c.body = body;
      const panel = _c.side.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('gtk-instruction-panel');
        panel.querySelector('.ref-panel-title').textContent = 'Task';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.work);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('gtk-toast');
        _c.work.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('gtk-footer');
      _c.work.appendChild(foot);
      const status = _c.util.el('div', 'gtk-status', document.body);
      _c.util.el('span', 'gtk-ready', status, '●');
      _c.util.el('span', '', status, 'Ready');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'gtk-overlay gtk-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new products.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-loading-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-loading-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#668ebd'],
      LOW_ACCENTS: ['#668ebd'],
      parts,
    },
  });
})();
