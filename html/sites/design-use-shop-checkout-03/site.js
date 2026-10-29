(function () {
  'use strict';
  const D = { site: 'design-use-shop-checkout-03' };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      const vars = {
        bg: '#f4f7fb',
        panel: '#fff',
        fg: '#101b32',
        accent: '#0877f9',
        line: '#d9e1eb',
        muted: '#697991',
        font: 'Arial, sans-serif',
      };
      for (const [k, v] of Object.entries(vars)) root.style.setProperty('--' + k, v);
      document.body.className = 'shop-app instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const traffic = u.el('div', 'traffic-strip', shell);
      u.el('i', 'traffic red', traffic);
      u.el('i', 'traffic yellow', traffic);
      u.el('i', 'traffic green', traffic);
      const rail = u.el('aside', 'shop-rail', shell);
      u.el('div', 'shop-logo', rail, '▣');
      u.el('strong', 'shop-brand', rail, 'ShopEasy');
      const nav = u.el('nav', 'shop-nav', rail);
      for (const [icon, label, active] of [
        ['⌂', 'Home'],
        ['◇', 'Shop'],
        ['⚙', 'Deals'],
        ['▣', 'Orders'],
        ['♙', 'Account'],
      ]) {
        const a = u.el('div', 'rail-item' + (active ? ' selected' : ''), nav);
        u.el('span', 'rail-icon', a, icon);
        u.el('span', '', a, label);
      }
      const workspace = u.el('div', 'shop-workspace', shell);
      const toolbar = u.el('header', 'shop-toolbar', workspace);
      const search = u.el('div', 'search-box', toolbar);
      u.el('span', 'search-icon', search, '⌕');
      u.el('span', 'search-placeholder', search, 'Search products, brands, and more');
      const cart = u.el('div', 'cart-summary', toolbar);
      u.el('span', 'cart-icon', cart, '🛒');
      const carttext = u.el('div', '', cart);
      u.el('b', '', carttext, 'Cart');
      u.el('small', '', carttext, '0 items  ·  $0.00');
      u.el('span', 'cart-chevron', cart, '›');
      const note = u.el('section', 'task-note', workspace);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        u.el('p', 'task-copy', note, ctx.instruction);
      }
      if (ctx.display === 'panel') rail.appendChild(note);
      const stage = u.el('main', 'stage', workspace);
      const r = ctx.rng.fork('chrome/end'),
        labels = (ctx.content && ctx.content.END_LABELS) || ['Submit', 'Done', 'Finish', 'Continue'];
      const label = r.bool(0.5) ? 'Finish' : String(r.pick(labels));
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'end-control', toolbar, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = labels.filter((text) => String(text).trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = String(cr.pick(options));
          const extra = u.el('button', 'toolbar-action', toolbar, text);
          extra.type = 'button';
          extra.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        map = {
          cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Accept'],
          toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
          chat: ['Help', 'Need help finding something?', 'Close'],
          promo: ['Special offer', 'See what’s new at ShopEasy.', 'Close'],
          banner: ['Announcement', 'Free delivery on orders over $35.', 'Dismiss'],
        };
      const [t, c, b] = map[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      u.el('h2', '', el, t);
      u.el('div', 'overlay-copy', el, c);
      const button = u.el('button', 'primary', el, b);
      button.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss: button };
    },
  });
})();
