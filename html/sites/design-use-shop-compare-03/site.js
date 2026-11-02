(function () {
  'use strict';
  const palette = { bg: '#34402f', panel: '#f7f3e8', fg: '#201d18', muted: '#756e62', line: '#d8d0bf' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.add('trailgear', 'instruction-' + _c.display);
      document.documentElement.style.setProperty('--font', 'Georgia,"Times New Roman",serif');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const toolbar = u.el('header', 'design-header', shell);
      u.el('div', 'brand-mark', toolbar, '△');
      u.el('div', 'design-brand', toolbar, 'TrailGear Shop');
      const controls = u.el('div', 'window-controls', toolbar);
      u.el('span', 'min', controls, '−');
      u.el('span', 'max', controls, '□');
      u.el('span', 'close', controls, '×');
      const body = u.el('div', 'design-body', shell);
      const header = u.el('section', 'task-note', body);
      header.hidden = _c.display === 'hidden';
      Object.assign(_c, { shell, toolbar, body, header });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'design-footer', _c.shell);
      u.el('span', 'status-icon', footer, '⌕');
      u.el('span', 'product-count', footer, '4 products shown');
      u.el('span', 'status-spacer', footer);
      u.el('span', 'bag-icon', footer, '🛒');
      u.el('span', 'bag-count', footer, 'Bag: 0 items');
      u.el('span', 'status-divider', footer, '│');
      u.el('span', 'bag-total', footer, 'Total: $0.00');
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      Object.assign(_c, { footer, foot });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        texts = {
          cookie: ['Cookie preferences', 'This shop uses a small number of essential cookies.', 'Dismiss'],
          toast: ['Shop notice', 'Your comparison is ready.', 'Dismiss'],
          chat: ['TrailGear support', 'How can we help with your pack search?', 'Close'],
          promo: ['Field notes', 'See what is new for the coming season.', 'Close'],
          banner: ['Store announcement', 'Free tracked delivery on all trail equipment.', 'Dismiss'],
        };
      const [title, copy, label] = texts[ctx.kind],
        el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-use-shop-compare-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-shop-compare-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#626b4f'],
      LOW_ACCENTS: ['#626b4f'],
      parts,
    },
  });
})();
