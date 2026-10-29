(function () {
  'use strict';
  const D = {
    site: 'design-use-shop-cartedit-02',
    brand: 'Outdoor Gear Store',
    tokens: {
      bg: '#f5f5f5',
      panel: '#fff',
      fg: '#101d43',
      accent: '#0060ff',
      line: '#d8dde5',
      muted: '#4d5b7d',
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
      document.body.className = 'shop-paper instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body),
        header = u.el('header', 'design-header', shell);
      u.el('span', 'mountain-mark', header, '▲');
      u.el('strong', 'design-brand', header, D.brand);
      const body = u.el('div', 'design-body', shell),
        stage = u.el('main', 'stage', body);
      const heroButton = u.el('button', 'hero-shop', body, 'Shop All Gear');
      heroButton.type = 'button';
      const categories = u.el('section', 'store-categories', body);
      u.el('h2', '', categories, 'Popular Categories');
      const tiles = u.el('div', 'category-tiles', categories);
      [
        ['Tents', 'category-tent'],
        ['Backpacks', 'category-pack'],
      ].forEach(([label, cls]) => {
        const tile = u.el('div', 'category-tile ' + cls, tiles);
        u.el('span', '', tile, label);
      });
      const help = u.el('aside', 'help-paper', body);
      u.el('h2', '', help, 'Need help with your bag?');
      const items = [
        ['✎', 'Change quantity', 'Use the + and − buttons to update how many you want.'],
        ['▣', 'Remove an item', 'Click Remove to take an item out of your bag.'],
        ['◧', 'Save for later', 'Move items to your saved list to buy another time.'],
      ];
      items.forEach(([icon, title, copy]) => {
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
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        u.el('span', 'note-label', note, 'Your task');
        u.el('p', 'food-task', note, ctx.instruction);
      }
      const footer = u.el('footer', 'design-footer', shell);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collision = null;
      const labels = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
      ];
      if (collideRng.bool(0.3)) {
        const list = labels
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name))
          .filter((x) => String(x).toLowerCase() !== 'confirm');
        if (list.length) collision = collideRng.pick(list);
      }
      if (collision) {
        const b = u.el('button', 'menu-pq', footer, collision);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
      }
      const endRng = ctx.rng.fork('chrome/end'),
        label = endRng.pick(['Confirm', 'Confirm', 'All set', 'Go']);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'end-control', footer, label === 'All set' ? '✓' : label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
      }
      return { stage, submit };
    },
    overlay(ctx) {
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
  });
})();
