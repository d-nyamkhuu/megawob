(function () {
  'use strict';
  const palette = { bg: '#f5f5f5', panel: '#fff', fg: '#101d43', muted: '#4d5b7d', line: '#d8dde5' };
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
      document.body.classList.add('shop-paper', 'instruction-' + _c.display);
      document.documentElement.style.setProperty('--font', 'Arial,sans-serif');
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('span', 'mountain-mark', header, '▲');
      u.el('strong', 'design-brand', header, 'Outdoor Gear Store');
      Object.assign(_c, { shell, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note');
        const text = note.textContent;
        note.textContent = '';
        _c.util.el('span', 'note-label', note, 'Your task');
        _c.util.el('p', 'food-task', note, text);
      }
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'design-body', _c.shell);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) body.appendChild(note);
      const heroButton = u.el('button', 'hero-shop', body, 'Shop All Gear');
      heroButton.type = 'button';
      const categories = u.el('section', 'store-categories', body);
      u.el('h2', '', categories, 'Popular Categories');
      const tiles = u.el('div', 'category-tiles', categories);
      [ ['Tents', 'category-tent'], ['Backpacks', 'category-pack'] ].forEach(([label, cls]) => {
        const tile = u.el('div', 'category-tile ' + cls, tiles);
        u.el('span', '', tile, label);
      });
      const help = u.el('aside', 'help-paper', body);
      u.el('h2', '', help, 'Need help with your bag?');
      [
        ['✎', 'Change quantity', 'Use the + and − buttons to update how many you want.'],
        ['▣', 'Remove an item', 'Click Remove to take an item out of your bag.'],
        ['◧', 'Save for later', 'Move items to your saved list to buy another time.'],
      ].forEach(([icon, title, copy]) => {
        const row = u.el('div', 'help-row', help);
        u.el('b', 'help-icon', row, icon);
        const text = u.el('div', '', row);
        u.el('strong', '', text, title);
        u.el('p', '', text, copy);
      });
      u.el('hr', '', help);
      [
        ['▰', 'Free shipping', 'On orders of $50 or more.'],
        ['◌', 'Easy returns', '30-day returns, no hassle.'],
        ['♙', 'Secure checkout', 'Your information is always protected.'],
      ].forEach(([icon, title, copy]) => {
        const row = u.el('div', 'help-row service', help);
        u.el('b', 'help-icon', row, icon);
        const text = u.el('div', '', row);
        u.el('strong', '', text, title);
        u.el('p', '', text, copy);
      });
      _c.body = body;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note');
        note.querySelector('.ref-panel-title').classList.add('note-label');
        note.querySelector('.ref-panel-text').classList.add('food-task');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        const title = _c.util.el('span', 'note-label', null, 'Your task');
        note.prepend(title);
        note.querySelector('.ref-note-text').classList.add('food-task');
        _c.body.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.shell.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        texts = {
          cookie: ['Cookie preferences', 'We use cookies to improve your shopping experience.', 'Dismiss'],
          toast: ['Notification', 'Your bag is ready.', 'Dismiss'],
          chat: ['Need help?', 'Our gear specialists are here to help.', 'Close'],
          promo: ['Outdoor days start here', 'Explore the new season collection.', 'Close'],
          banner: ['Store notice', 'Free delivery on orders over $50.', 'Dismiss'],
        };
      const [title, copy, label] = texts[ctx.kind],
        el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el),
        dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-use-shop-cartedit-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#0060ff'], LOW_ACCENTS: ['#0060ff'], parts,
    },
  });
})();
