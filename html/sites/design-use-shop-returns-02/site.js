(function () {
  'use strict';
  const D = { site: 'design-use-shop-returns-02' };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.documentElement.style.setProperty('--bg', '#0e141c');
      document.documentElement.style.setProperty('--panel', '#171f29');
      document.documentElement.style.setProperty('--fg', '#f3f6fa');
      document.documentElement.style.setProperty('--accent', '#36a8ff');
      document.documentElement.style.setProperty('--line', '#2b3541');
      document.documentElement.style.setProperty('--muted', '#aab5c3');
      document.documentElement.style.setProperty('--font', 'Segoe UI, Arial, sans-serif');
      document.body.className = 'shop-window instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body),
        title = u.el('header', 'design-header', shell);
      u.el('span', 'app-mark', title, '');
      u.el('b', 'design-brand', title, 'ShopEase');
      const search = u.el('div', 'global-search', title);
      u.el('span', 'search-icon', search, '⌕');
      u.el('span', '', search, 'Search for products, brands and more');
      u.el('span', 'title-icon', title, '♧');
      u.el('span', 'title-icon user-icon', title, '◉');
      u.el('i', 'title-divider', title);
      u.el('span', 'window-action', title, '−');
      u.el('span', 'window-action', title, '□');
      u.el('span', 'window-action close-action', title, '×');
      const area = u.el('div', 'app-area', shell),
        toolbar = u.el('div', 'orders-toolbar', area);
      const heading = u.el('div', 'heading-row', toolbar);
      u.el('h1', '', heading, 'Your orders');
      const finder = u.el('div', 'order-finder', heading);
      u.el('span', '', finder, '⌕');
      u.el('span', '', finder, 'Search your orders');
      const range = u.el('div', 'date-range', heading);
      u.el('span', '', range, 'Last 12 months');
      u.el('span', '', range, '⌄');
      const tabs = u.el('nav', 'orders-tabs', toolbar);
      ['Orders', 'Returns', 'Buy again'].forEach((x, i) => {
        const t = u.el('span', i ? '' : 'active', tabs, x);
      });
      const note = u.el('div', 'task-note', area);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') u.el('span', '', note, ctx.instruction);
      const stage = u.el('main', 'stage', area),
        details = u.el('section', 'return-strip', area);
      const intro = u.el('div', 'return-intro', details);
      u.el('b', '', intro, 'Start a return');
      u.el('span', '', intro, 'Select an order and item to continue.');
      const fields = u.el('div', 'return-fields', details);
      u.el('b', 'details-title', fields, 'Return details');
      [
        ['Reason for return', 'Select a reason'],
        ['Refund method', 'Select a refund method'],
        ['Return method', 'Select a return method'],
      ].forEach(([a, b]) => {
        const f = u.el('div', 'return-field', fields);
        u.el('label', '', f, a);
        const v = u.el('div', 'field-select', f, b);
        u.el('span', '', v, '⌄');
      });
      const dock = u.el('nav', 'design-footer', shell);
      [
        ['⌂', 'Home'],
        ['⌕', 'Shop'],
        ['◇', 'Deals'],
        ['▤', 'Orders'],
        ['♡', 'Saved'],
        ['🛒', 'Cart'],
      ].forEach(([icon, label]) => {
        const item = u.el('div', 'dock-item' + (label === 'Orders' ? ' selected' : ''), dock);
        u.el('span', 'dock-icon', item, icon);
        u.el('span', '', item, label);
      });
      const save = u.el('button', 'end-control', title, 'Save');
      save.type = 'button';
      save.dataset.role = 'submit';
      save.title = 'Save';
      save.setAttribute('aria-label', 'Save');
      save.addEventListener('click', () => ctx.submit());
      if (ctx.finish) save.remove();
      if (ctx.display === 'panel') {
        note.classList.add('panel-note');
        note.textContent = '';
        u.el('b', '', note, 'Task note');
        u.el('p', '', note, ctx.instruction);
      }
      const help = u.el('aside', 'returns-help', area);
      u.el('b', 'help-heading', help, '●　Returns help');
      [
        'Most items can be returned within 30 days of delivery.',
        'Items must be in original condition with all tags and accessories.',
        'Refunds can be issued to your original payment method or a store credit.',
        'You can return items by mail or at a parcel locker (depending on the item).',
      ].forEach((t) => u.el('div', 'help-line', help, '•　' + t));
      if (ctx.display === 'toast' && ctx.instruction) {
        note.classList.add('toast-note');
      }
      return { stage, submit: ctx.finish ? null : save };
    },
    overlay(ctx) {
      const u = ctx.util;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with your return?', 'Close'],
        promo: ['News and updates', 'Discover the latest from ShopEase.', 'Close'],
        banner: ['Announcement', 'You can still browse your orders.', 'Dismiss'],
      };
      const [title, copy, label] = texts[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
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
  });
})();
