(function () {
  'use strict';
  const D = {
    site: 'design-use-shop-compare-02',
    brand: 'TrailGear Outdoor Store',
    tokens: {
      bg: '#d8e1ea',
      panel: '#fff',
      fg: '#102c55',
      accent: '#477db5',
      line: '#b8c9da',
      muted: '#53677e',
      font: 'Arial,sans-serif',
    },
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      const display = ctx.display;
      document.body.className = 'trailgear instruction-' + display;
      const shell = u.el('div', 'site-shell', document.body);
      const title = u.el('header', 'window-title', shell);
      u.el('span', 'app-mark', title, '▲');
      u.el('strong', 'design-brand', title, D.brand);
      u.el('span', 'window-controls', title, '−　□　×');
      const menu = u.el('nav', 'menu-bar', shell);
      for (const x of ['File', 'Edit', 'View', 'Go', 'Tools', 'Help']) u.el('span', '', menu, x);
      const toolbar = u.el('nav', 'icon-toolbar', shell);
      for (const [icon, label] of [
        ['⌂', 'Home'],
        ['⚲', 'Search'],
        ['▣', 'Categories'],
        ['🛒', 'View Bag'],
        ['▤', 'Order Status'],
      ]) {
        const b = u.el('button', 'toolbar-item', toolbar);
        b.type = 'button';
        u.el('span', 'tool-icon', b, icon);
        u.el('span', '', b, label);
      }
      const note = u.el('section', 'task-note', shell);
      note.dataset.role = 'instruction';
      if (display !== 'hidden') {
        u.el('span', 'note-caption', note, 'Task');
        u.el('span', 'food-task', note, ctx.instruction);
      }
      const content = u.el('div', 'work-area', shell);
      const left = u.el('aside', 'directory-panel', content);
      const tree = u.el('section', 'directory-box', left);
      u.el('h2', 'section-bar', tree, 'Backpacks');
      const rows = [
        ['⊞', 'All Products', 0],
        ['⊟', 'Backpacks', 1],
        ['└', 'Daypacks (0 - 20 L)', 2],
        ['└', 'Hiking Packs (21 - 40 L)', 2],
        ['└', 'Expedition Packs (41+ L)', 2],
        ['└', 'Hydration Packs', 2],
        ['⊞', 'Tents', 0],
        ['⊞', 'Sleeping Bags', 0],
        ['⊞', 'Camping Gear', 0],
        ['⊞', 'Clothing', 0],
        ['⊞', 'Accessories', 0],
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
        ['Alpine Ridge', '12'],
        ['CanyonWorks', '8'],
        ['EverTrail', '10'],
        ['GranitePeak', '7'],
        ['Highland', '9'],
        ['NorthPath', '6'],
        ['OutdoorLab', '8'],
        ['SummitGear', '11'],
        ['TrailMaster', '9'],
        ['WilderNest', '6'],
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
      const stage = u.el('main', 'stage', content);
      if (display === 'panel') {
        const n = u.el('div', 'panel-note', left);
        u.el('b', '', n, 'Order request');
        u.el('p', 'food-task', n, ctx.instruction);
      }
      const footer = u.el('footer', 'design-footer', shell);
      const endRng = ctx.rng.fork('chrome/end');
      const base = endRng.bool(0.5),
        place = base ? 'toolbar' : endRng.pick(['footer', 'link', 'icon']);
      const bank = ctx.content && ctx.content.END_LABELS,
        labels =
          Array.isArray(bank) && bank.length
            ? bank
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', "I'm done"];
      const textOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label = base ? 'Apply' : textOf(endRng.pick(labels));
      const collide = ctx.rng.fork('chrome/collide');
      let decoy = null;
      if (collide.bool(0.3)) {
        const opts = [...new Set(labels.map(textOf))].filter((x) => x.toLowerCase() !== label.toLowerCase());
        if (opts.length) decoy = collide.pick(opts);
      }
      const button = (parent, text, cls, submit) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        if (submit) {
          b.dataset.role = 'submit';
          b.title = text;
          b.setAttribute('aria-label', text);
          b.addEventListener('click', () => ctx.submit());
        } else {
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
        return b;
      };
      let submit = null;
      if (decoy) button(toolbar, decoy, 'toolbar-item xtra', false);
      if (!ctx.finish) {
        if (place === 'toolbar') submit = button(toolbar, label, 'apply-control', true);
        else if (place === 'footer') submit = button(footer, label, 'end-control', true);
        else if (place === 'link') submit = button(footer, label, 'end-link', true);
        else submit = button(toolbar, '✓', 'icon-end', true);
      }
      if (place === 'toolbar' && !ctx.finish) toolbar.appendChild(submit);
      if (display === 'toast') {
        const n = u.el('div', 'toast-note', shell);
        u.el('b', '', n, 'Task request');
        u.el('span', 'food-task', n, ctx.instruction);
      }
      return { stage, submit };
    },
    overlay(ctx) {
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
  });
})();
