(function () {
  'use strict';
  const palette = { bg: '#d8e1ea', panel: '#fff', fg: '#102c55', muted: '#53677e', line: '#b8c9da' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original uses its dedicated note locations from 1201px onwards.
      _c.display = _c.ctx.display || 'header';
      if (_c.W <= 1200 && (_c.display === 'panel' || _c.display === 'toast')) _c.display = 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('trailgear', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const title = u.el('header', 'window-title', shell);
      u.el('span', 'app-mark', title, '▲');
      u.el('strong', 'design-brand', title, 'TrailGear Outdoor Store');
      u.el('span', 'window-controls', title, '−　□　×');
      const menu = u.el('nav', 'menu-bar', shell);
      for (const x of ['File', 'Edit', 'View', 'Go', 'Tools', 'Help']) u.el('span', '', menu, x);
      const toolbar = u.el('nav', 'icon-toolbar', shell);
      for (const [icon, label] of [
        ['⌂', 'Home'], ['⚲', 'Search'], ['▣', 'Categories'], ['🛒', 'View Bag'], ['▤', 'Order Status'],
      ]) {
        const b = u.el('button', 'toolbar-item', toolbar);
        b.type = 'button';
        u.el('span', 'tool-icon', b, icon);
        u.el('span', '', b, label);
      }
      const header = u.el('section', 'task-note', shell);
      if (_c.display === 'header') u.el('span', 'note-caption', header, 'Task');
      Object.assign(_c, { shell, toolbar, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('food-task');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const content = u.el('div', 'work-area', _c.shell);
      const left = u.el('aside', 'directory-panel', content);
      const tree = u.el('section', 'directory-box', left);
      u.el('h2', 'section-bar', tree, 'Backpacks');
      const rows = [
        ['⊞', 'All Products', 0], ['⊟', 'Backpacks', 1], ['└', 'Daypacks (0 - 20 L)', 2],
        ['└', 'Hiking Packs (21 - 40 L)', 2], ['└', 'Expedition Packs (41+ L)', 2], ['└', 'Hydration Packs', 2],
        ['⊞', 'Tents', 0], ['⊞', 'Sleeping Bags', 0], ['⊞', 'Camping Gear', 0], ['⊞', 'Clothing', 0], ['⊞', 'Accessories', 0],
      ];
      for (const [ico, label, level] of rows) {
        const row = u.el('div', 'tree-row depth-' + level, tree);
        u.el('span', 'tree-icon', row, ico);
        u.el('span', label.includes('Hiking') ? 'tree-selected' : '', row, label);
      }
      const brands = u.el('section', 'brand-box', left);
      u.el('h2', 'section-bar', brands, 'Shop by Brand');
      const brandList = u.el('div', 'brand-list', brands);
      for (const [name, count] of [
        ['Alpine Ridge', '12'], ['CanyonWorks', '8'], ['EverTrail', '10'], ['GranitePeak', '7'], ['Highland', '9'],
        ['NorthPath', '6'], ['OutdoorLab', '8'], ['SummitGear', '11'], ['TrailMaster', '9'], ['WilderNest', '6'],
      ]) {
        const row = u.el('div', 'brand-row', brandList);
        u.el('span', '', row, name);
        u.el('span', '', row, count);
      }
      const filters = u.el('aside', 'filter-panel', content);
      u.el('h2', 'section-bar', filters, 'Search Backpacks');
      const f = (label, value) => {
        const group = u.el('label', 'filter-group', filters);
        u.el('span', '', group, label);
        const input = u.el('input', '', group);
        input.value = value || '';
        input.setAttribute('aria-label', label);
      };
      f('Keyword', 'backpack');
      const select = (label, value) => {
        const group = u.el('div', 'filter-group', filters);
        u.el('span', '', group, label);
        const box = u.el('div', 'fake-select', group, value);
        box.setAttribute('aria-label', label);
      };
      select('Category', 'Hiking Packs (21 - 40 L)');
      for (const label of ['Price (USD)', 'Capacity (Liters)', 'Weight (Grams)', 'Warranty (Years)']) {
        const group = u.el('div', 'filter-group', filters);
        u.el('span', '', group, label);
        const pair = u.el('div', 'range-pair', group);
        u.el('span', '', pair, 'Min');
        const a = u.el('input', '', pair);
        a.setAttribute('aria-label', label + ' minimum');
        u.el('span', '', pair, 'Max');
        const b = u.el('input', '', pair);
        b.setAttribute('aria-label', label + ' maximum');
      }
      select('Brand', 'All Brands');
      for (const label of ['In Stock Only', 'On Sale Only']) {
        const l = u.el('label', 'check-line', filters);
        const c = u.el('input', '', l);
        c.type = 'checkbox';
        u.el('span', '', l, label);
      }
      const search = u.el('button', 'search-submit', filters, 'Search');
      search.type = 'button';
      Object.assign(_c, { body: content, left });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.left;
      base(_c);
      _c.body = body;
      const panel = _c.left.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('panel-note');
        panel.querySelector('.ref-panel-title').textContent = 'Order request';
        panel.querySelector('.ref-panel-text').classList.add('food-task');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('toast-note');
        const title = _c.util.el('b', '', null, 'Task request');
        note.prepend(title);
        note.prepend(note.querySelector('.ref-note-x'));
        const text = note.querySelector('.ref-note-text');
        text.classList.add('food-task');
        _c.shell.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      foot.querySelector('.ref-foot-text').textContent = '';
      _c.shell.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const texts = {
        cookie: ['Cookie notice', 'This store uses cookies to remember your preferences.', 'Dismiss'],
        toast: ['Store notice', 'Your saved items are ready to view.', 'Close'],
        chat: ['Customer service', 'How can we help with your order?', 'Close'],
        promo: ['TrailGear newsletter', 'Get updates on new outdoor gear.', 'Close'],
        banner: ['Store announcement', 'Free standard delivery on orders over $50.', 'Dismiss'],
      };
      const [title, copy, label] = texts[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const close = u.el('button', 'primary', el, label);
      close.type = 'button';
      close.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss: close };
    },
  };
  env.site({
    name: 'design-use-shop-compare-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#477db5'], LOW_ACCENTS: ['#477db5'], parts,
    },
  });
})();
