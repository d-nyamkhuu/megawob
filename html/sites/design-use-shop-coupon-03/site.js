(function () {
  'use strict';
  const palette = { bg: '#c9cdd0', panel: '#f5f5f5', fg: '#111820', muted: '#50565c', line: '#9da2a7' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.add('os2', 'instruction-' + _c.display);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const title = u.el('div', 'title-row', header);
      u.el('span', 'app-icon', title, '▤');
      u.el('div', 'design-brand', title, 'CampusMart - Shop');
      const controls = u.el('div', 'window-controls', title);
      ['−', '□', '×'].forEach((x) => u.el('span', '', controls, x));
      u.el('nav', 'menu-row', header, 'File     Edit     View     Search     Go     Favorites     Help');
      const toolbar = u.el('nav', 'toolbar-row', header);
      const icons = [
        '<svg viewBox="0 0 32 32"><path d="M3 15 16 4l13 11M7 14v14h18V14M13 28v-9h6v9"/><path d="M5 15 16 6l11 9"/></svg>',
        '<svg viewBox="0 0 32 32"><circle cx="13" cy="13" r="9"/><path d="m20 20 9 9"/></svg>',
        '<svg viewBox="0 0 32 32"><path d="M3 9h10l3 4h13v15H3zM3 9V5h10l3 4"/></svg>',
        '<svg viewBox="0 0 32 32"><path d="M3 6h4l3 16h16l4-12H9"/><circle cx="13" cy="27" r="2"/><circle cx="24" cy="27" r="2"/><path d="M12 14h15M13 18h13"/></svg>',
        '<svg viewBox="0 0 32 32"><path d="M8 3h12l6 6v20H8zM20 3v7h6M12 15h10M12 19h10M12 23h10"/></svg>',
      ];
      ['Home', 'Search', 'Categories', 'Bag', 'Orders'].forEach((l, i) => {
        const b = u.el('div', 'tool ' + (i === 3 ? 'selected' : ''), toolbar);
        u.el('span', 'tool-icon', b).innerHTML = icons[i];
        u.el('span', '', b, l);
      });
      const sub = u.el('nav', 'tab-row', header);
      ['Welcome', 'Search', 'Products', 'Bag', 'Offers', 'Help'].forEach((x, i) =>
        u.el('div', 'notebook-tab ' + (i === 3 ? 'active' : ''), sub, x),
      );
      Object.assign(_c, { shell, header, title, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('header-task');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('title-tools');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'design-body', _c.shell);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note');
        panel.querySelector('.ref-panel-title').textContent = 'Task note';
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'stage', _c.body);
      const tips = u.el('aside', 'tips-rail', _c.body);
      u.el('h3', '', tips, '💡  Shopping Tips');
      [
        'Enter a coupon code in the box above and click Apply.',
        'Active offers are shown in green.',
        'Expired offers are listed below.',
        'You can change quantities or remove items from your bag.',
        'Shipping is calculated during checkout.',
      ].forEach((x) => {
        const row = u.el('div', 'tip-row', tips);
        u.el('span', 'bullet', row, '•');
        u.el('span', '', row, x);
      });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-toast');
        _c.shell.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.toolbar.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.toolbar.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        texts = {
          cookie: ['Privacy preferences', 'This site uses cookies to remember your settings.', 'Dismiss'],
          toast: ['Notice', 'Your shopping bag is ready.', 'Dismiss'],
          chat: ['Shopping help', 'How can we help you today?', 'Close'],
          promo: ['CampusMart offers', 'See this week’s special offers.', 'Close'],
          banner: ['CampusMart', 'Free standard shipping on qualifying orders.', 'Dismiss'],
        };
      const [title, copy, label] = texts[ctx.kind],
        el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-use-shop-coupon-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#bfc9ed'],
      LOW_ACCENTS: ['#bfc9ed'],
      parts,
    },
  });
})();
