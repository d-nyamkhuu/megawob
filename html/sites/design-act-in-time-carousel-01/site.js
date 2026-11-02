(function () {
  'use strict';
  const palette = { bg: '#d5d8df', panel: '#e4e6eb', fg: '#111522', muted: '#596071', line: '#7f8591' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('platinum');
      const win = u.el('div', 'mac-window', document.body);
      const top = u.el('header', 'mac-titlebar', win);
      u.el('span', 'mac-appicon', top, '✿');
      u.el('strong', 'mac-title', top, 'Garden Shop');
      const controls = u.el('div', 'mac-window-controls', top);
      ['−', '□', '×'].forEach((x) => u.el('button', '', controls, x));
      Object.assign(_c, { win, header: top, windowControls: controls });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      _c.header.appendChild(_c.windowControls);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.windowControls;
      base(_c);
      _c.header = header;
      _c.windowControls.prepend(_c.headerTools);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'mac-content', _c.win);
      const side = u.el('aside', 'mac-sidebar', shell);
      u.el('div', 'mac-sidebar-title', side, 'Featured Items');
      const list = u.el('div', 'mac-list', side);
      const products = [
        ['✿', 'Daisy Planter', '$14.99'],
        ['▰', 'Terracotta Pots', '$12.99'],
        ['♟', 'Solar Garden Light', '$24.99'],
        ['♬', 'Wind Chimes', '$19.99'],
        ['♧', 'Hanging Planter, Macrame', '$28.99'],
        ['♜', 'Watering Can', '$16.99'],
        ['◆', 'Garden Trowel', '$9.99'],
        ['▧', 'Herb Seed Set', '$11.99'],
        ['♟', 'Butterfly Feeder', '$18.99'],
        ['▤', 'Outdoor Bench', '$129.00'],
      ];
      products.forEach((p, i) => {
        const row = u.el('div', 'mac-row' + (!i ? ' selected' : ''), list);
        u.el('span', 'mac-thumb', row, p[0]);
        const text = u.el('span', 'mac-row-copy', row);
        u.el('span', '', text, p[1]);
        u.el('small', '', text, p[2]);
      });
      const right = u.el('main', 'mac-right', shell);
      Object.assign(_c, { body: shell, right });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.right;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'ds-stage', _c.right);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.win.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('mac-footer');
      _c.win.appendChild(foot);
      const status = foot.querySelector('.ref-foot-text');
      status.classList.add('mac-footer-status');
      status.textContent = 'Garden Shop  •  Featured collection';
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
      const texts = {
        cookie: 'Garden Shop uses cookies to remember your preferences.',
        toast: 'Your preferences have been saved.',
        chat: 'Welcome to Garden Shop. How may we help?',
        promo: 'Discover the new Spring collection.',
        banner: 'The Garden Shop is open daily.',
      };
      u.el('div', '', el, texts[ctx.kind] || 'Welcome to Garden Shop.');
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-carousel-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-carousel-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2769d8'],
      LOW_ACCENTS: ['#2769d8'],
      parts,
    },
  });
})();
