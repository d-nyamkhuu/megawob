(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-search-05',
    'brand': 'Maple Grove Marketplace',
    'tokens': {
      'bg': '#d9d2c3',
      'panel': '#f2f0ea',
      'fg': '#101923',
      'accent': '#1a1ab8',
      'font': "'Times New Roman',Times,serif",
      'line': '#8d9bb5',
      'muted': '#444',
    },
  };
  const END_FALLBACK = [
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
  const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'mg instruction-' + ctx.display;
      const endR = ctx.rng.fork('chrome/end');
      const labels = (
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : END_FALLBACK
      ).map(labelOf);
      let placement = 'search',
        label = 'Submit';
      if (!ctx.finish && !endR.bool(0.5)) {
        placement = endR.pick(['footer', 'link']);
        label = endR.pick(labels);
      }
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collide = collideR.pick(options);
      }
      const win = u.el('div', 'win', document.body);
      u.el('div', 'win-title', win);
      const mast = u.el('header', 'mast', win);
      const left = u.el('div', 'mast-l', mast);
      u.el('div', 'house', left);
      const ll = u.el('div', 'mast-links', left);
      for (const t of ['Home', 'Shop', 'Community', 'Messages', 'Guestbook']) u.el('a', '', ll, t);
      const mid = u.el('div', 'mast-m', mast);
      u.el('span', 'tree', mid);
      const mt = u.el('div', 'mast-t', mid);
      u.el('h1', '', mt, D.brand);
      u.el('div', 'tag', mt, 'A Friendly Place to Shop Online');
      const divider = u.el('div', 'rule', mt);
      u.el('i', 'rule-end', divider);
      u.el('span', 'tree', mid);
      const right = u.el('div', 'mast-r', mast);
      const rl = u.el('div', 'mast-links r', right);
      for (const t of ['My Account', 'Help', 'Sign Out']) u.el('a', '', rl, t);
      u.el('div', 'basket', right);
      const nav = u.el('nav', 'cats', win);
      ['Books', 'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Toys', 'More'].forEach((t, i) => {
        if (i) u.el('span', 'sep', nav, '|');
        u.el('a', '', nav, t);
      });
      const note = u.el('section', 'task-note task-note-' + ctx.display, win);
      note.dataset.role = 'instruction';
      if (ctx.display === 'panel') u.el('h2', 'note-title', note, 'Task Note');
      if (ctx.display !== 'hidden') u.el('p', 'food-task', note, ctx.instruction);
      u.el('div', 'res-head', win, 'Search Results');
      const stage = u.el('main', 'stage', win);
      let submit = null;
      if (!ctx.finish && placement === 'search') {
        submit = u.el('button', 'end-control', win, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', () => ctx.submit());
      }
      const foot = u.el('footer', 'foot', win);
      const fl = u.el('div', 'foot-l', foot);
      ['About Us', 'Shipping', 'Returns', 'Privacy', 'Contact'].forEach((t, i) => {
        if (i) u.el('span', 'sep', fl, '|');
        u.el('a', '', fl, t);
      });
      const fr = u.el('div', 'foot-r', foot);
      u.el('span', 'copyright', fr, 'Maple Grove Marketplace   © 1996');
      if (!ctx.finish && placement !== 'search') {
        if (placement === 'footer') {
          submit = u.el('button', 'episode-end-control', fr, label);
          submit.type = 'button';
          submit.dataset.role = 'submit';
        } else {
          submit = u.el('a', 'episode-end-link', fr, label);
          submit.href = '#';
          submit.dataset.role = 'submit';
        }
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (collide) {
        const decoy = u.el('button', 'episode-xtra', fr, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      const pal = u.el('aside', 'palette', document.body);
      const pt = u.el('div', 'pal-title', pal);
      u.el('i', '', pt);
      u.el('span', '', pt, 'Quick Notes');
      const minimize = u.el('button', 'pal-control', pt, '_');
      minimize.type = 'button';
      minimize.setAttribute('aria-label', 'Minimize notes');
      const close = u.el('button', 'pal-control', pt, '×');
      close.type = 'button';
      close.setAttribute('aria-label', 'Close notes');
      const pb = u.el('pre', 'pal-body', pal, 'Shopping list:\n- running shoes\n- water bottle\n- backpack');
      minimize.addEventListener('click', () => {
        pb.hidden = !pb.hidden;
        pal.classList.toggle('minimized', pb.hidden);
      });
      close.addEventListener('click', () => {
        pal.hidden = true;
      });
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
})();
