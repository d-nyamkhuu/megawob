(function () {
  'use strict';
  const D = { site: 'design-use-shop-checkout-01', brand: 'ShopEase' };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.documentElement.style.setProperty('--bg', '#aeb4b7');
      document.documentElement.style.setProperty('--panel', '#f5f5f5');
      document.documentElement.style.setProperty('--fg', '#17191b');
      document.documentElement.style.setProperty('--accent', '#2587d7');
      document.documentElement.style.setProperty('--line', '#c6c9cb');
      document.documentElement.style.setProperty('--muted', '#5e6266');
      document.documentElement.style.setProperty('--font', 'Arial, Helvetica, sans-serif');
      document.body.className = 'instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const title = u.el('header', 'window-title', shell);
      u.el('span', 'traffic-lights', title, '●  ●  ●');
      u.el('span', 'window-name', title, D.brand);
      u.el('span', 'window-spacer', title, '');
      const nav = u.el('nav', 'app-nav', shell);
      for (const [icon, name] of [
        ['H', 'Home'],
        ['▣', 'Shop'],
        ['◆', 'Deals'],
        ['▤', 'Orders'],
        ['A', 'Account'],
      ]) {
        const item = u.el('div', 'nav-item' + (name === 'Shop' ? ' active' : ''), nav);
        u.el('b', '', item, icon);
        item.append(' ' + name);
      }
      const topSearch = u.el('div', 'nav-search', nav, '⌕  Search ShopEase');
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      u.el('div', 'note-label', note, 'Order details');
      if (ctx.display !== 'hidden') u.el('p', 'food-task', note, ctx.instruction);
      const stage = u.el('main', 'stage', body);
      const rail = u.el('aside', 'shop-rail', body);
      const cart = u.el('section', 'rail-box cart-box', rail);
      u.el('div', 'rail-title', cart, '▣  Your Cart');
      u.el('div', 'cart-count', cart, '0 items');
      u.el('div', 'cart-empty-icon', cart, '▱');
      u.el('div', 'cart-empty', cart, 'Your cart is empty.');
      const help = u.el('section', 'rail-box help-box', rail);
      u.el('div', 'rail-title', help, '?  Need help?');
      for (const [icon, titleText, copy] of [
        ['?', 'How to place an order', 'Learn how to search, add items to your cart and checkout.'],
        ['➜', 'Shipping information', 'See delivery options and estimated delivery times.'],
        ['◆', 'Using promo codes', 'Find out how to use discount codes at checkout.'],
        ['▣', 'Returns & refunds', 'Our return policy and how to start a return.'],
      ]) {
        const row = u.el('div', 'help-row', help);
        u.el('span', 'help-icon', row, icon);
        const words = u.el('div', 'help-words', row);
        u.el('b', '', words, titleText);
        u.el('span', '', words, copy);
      }
      const footer = u.el('footer', 'design-footer', shell);
      const filler = u.el('span', 'footer-status', footer, 'Shop  ·  All products');
      const endRng = ctx.rng.fork('chrome/end');
      const baseEnd = endRng.bool(0.5);
      const labelBank = ctx.content && ctx.content.END_LABELS;
      const labels =
        Array.isArray(labelBank) && labelBank.length
          ? labelBank
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const textOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label = baseEnd ? 'Finish' : textOf(endRng.pick(labels));
      const collideRng = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (collideRng.bool(0.3)) {
        const options = [...new Set(labels.map(textOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (options.length) collision = collideRng.pick(options);
      }
      if (collision) {
        const b = u.el('button', 'xtra-button', footer, collision);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
      }
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'end-control', footer, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const texts = {
        cookie: ['Privacy preferences', 'We use cookies to improve your shopping experience.', 'Reject optional'],
        toast: ['Notification', 'Your shop is up to date.', 'Dismiss'],
        chat: ['Need help?', 'Our shop team is here to help.', 'Close'],
        promo: ['Special offer', 'Discover this week’s offers.', 'Close'],
        banner: ['Announcement', 'New products are available in the shop.', 'Dismiss'],
      };
      const [heading, copy, label] = texts[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      u.el('h2', '', el, heading);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
})();
