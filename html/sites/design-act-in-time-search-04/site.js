(function () {
  'use strict';
  env.site({
    name: 'design-act-in-time-search-04',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'app-mark', top, '⬡');
      u.el('span', 'ds-brand', top, 'Inventory Manager');
      const win = u.el('div', 'window-actions', top);
      ['−', '□', '×'].forEach((t) => u.el('span', '', win, t));
      const menu = u.el('nav', 'ds-menu', document.body);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((t) => u.el('span', '', menu, t));
      let submit = null,
        placement = null,
        label = 'Submit';
      const makeSubmit = (parent, cls) => {
        const b = u.el('button', cls, parent);
        b.type = 'button';
        b.textContent = label;
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish) {
        const fallback = [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
          "I'm done",
        ];
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : fallback;
        const text = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const er = ctx.rng.fork('chrome/end');
        const original = er.bool(0.5);
        label = original ? 'Save' : text(er.pick(labels));
        placement = original ? 'shelf' : er.pick(['shelf', 'title', 'status']);
        const cr = ctx.rng.fork('chrome/collide');
        var decoy = null;
        if (cr.bool(0.3)) {
          const pool = labels.map(text).filter((x) => x.toLowerCase() !== label.toLowerCase());
          if (pool.length) decoy = cr.pick(pool);
        }
        if (placement === 'title') submit = makeSubmit(top, 'ds-submit ds-submit-title');
      }
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      const navItems = [
        ['⬡', 'Products'],
        ['🛒', 'Orders'],
        ['♟', 'Customers'],
        ['▥', 'Reports'],
        ['▰', 'Suppliers'],
        ['⚙', 'Settings'],
      ];
      navItems.forEach((it, i) => {
        const e = u.el('div', 'rail-item' + (!i ? ' active' : ''), rail);
        u.el('span', 'rail-icon', e, it[0]);
        u.el('span', '', e, it[1]);
      });
      const content = u.el('div', 'ds-content', body);
      const workspace = u.el('div', 'ds-main', content);
      const table = u.el('section', 'catalog', workspace);
      u.el('h1', 'catalog-title', table, 'Products');
      const fake = u.el('div', 'fake-table', table);
      u.el('div', 'fake-head', fake, 'Name　⌃　　　　　　　　　　　　 Price　　　　　　　　　Category');
      [
        'Camping Tent',
        'Water Bottle',
        'Hiking Backpack',
        'LED Flashlight',
        'Portable Charger',
        'Travel Pillow',
        'First Aid Kit',
        'Sunscreen Lotion',
        'Insect Repellent',
        'Cooler Box',
        'Folding Chair',
        'Binoculars',
      ].forEach((n, i) => {
        const r = u.el('div', 'fake-row', fake);
        u.el('span', '', r, n);
        u.el('span', '', r, '$' + (19 + i * 7) + '.99');
        u.el('span', '', r, i % 2 ? 'Outdoors' : 'Equipment');
      });
      const inspector = u.el('aside', 'inspector', workspace);
      u.el('h2', '', inspector, 'Details');
      u.el('div', 'empty-cube', inspector, '⬡');
      u.el('div', 'empty-caption', inspector, 'No product selected');
      ['SKU', 'Price', 'Category', 'Stock', 'Brand', 'Dimensions', 'Weight', 'Description'].forEach((n) => {
        const r = u.el('div', 'prop-row', inspector);
        u.el('span', '', r, n);
        u.el('span', '', r, '–');
      });
      const stage = u.el('main', 'ds-stage', workspace);
      stage.dataset.role = 'stage';
      const status = u.el('footer', 'ds-footer', document.body);
      u.el('span', 'product-count', status, '12 products');
      if (!ctx.finish && placement === 'shelf') submit = makeSubmit(status, 'ds-submit');
      if (!ctx.finish && placement === 'status') submit = makeSubmit(status, 'ds-submit ds-submit-status');
      if (decoy) {
        const d = u.el('button', 'ds-pq', status, decoy);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: decoy, collide: true }));
      }
      function briefing() {
        if (ctx.display === 'hidden') return;
        const note = u.el('div', 'ds-instruction ds-instruction-' + ctx.display, document.body, ctx.instruction);
        if (ctx.display === 'toast') note.classList.add('ds-toast-note');
      }
      briefing();
      return { stage, submit };
    },
    overlay(ctx) {
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
  });
})();
