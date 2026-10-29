(function () {
  'use strict';
  const D = {
    site: 'design-use-shop-compare-01',
    brand: 'AppShop',
    tokens: {
      bg: '#0753a0',
      panel: '#eeeeee',
      fg: '#111',
      accent: '#ffd51a',
      font: 'Arial,sans-serif',
      line: '#b7b7b7',
      muted: '#555',
    },
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'beos instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const title = u.el('header', 'design-header', shell);
      u.el('div', 'app-icon', title, '🛒');
      u.el('div', 'design-brand', title, D.brand);
      u.el('div', 'title-tab-close', title, '×');
      u.el('div', 'window-controls', title, '−　□　×');
      const nav = u.el('nav', 'design-nav', shell);
      u.el('span', '', nav, 'Shop');
      u.el('span', '', nav, 'Edit');
      u.el('span', '', nav, 'View');
      u.el('span', '', nav, 'Go');
      u.el('span', '', nav, 'Help');
      const note = u.el('section', 'task-note', shell);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        u.el('b', '', note, 'Shopping request');
        u.el('span', 'food-task', note, ctx.instruction);
      }
      const stage = u.el('main', 'stage', shell);
      const footer = u.el('footer', 'design-footer', shell);
      const r = ctx.rng.fork('chrome/end'),
        base = r.bool(0.5),
        bank = ctx.content && ctx.content.END_LABELS,
        labels = Array.isArray(bank) && bank.length ? bank : ['Done', 'Finish', 'Submit', 'Continue'],
        label = base
          ? 'Continue'
          : (() => {
              const x = r.pick(labels);
              return typeof x === 'string' ? x : x.label || x.text || x.name || 'Done';
            })(),
        placement = base ? 'header' : r.pick(['footer', 'link']);
      const collide = ctx.rng.fork('chrome/collide');
      let decoy = null;
      if (collide.bool(0.3)) {
        decoy = u.el('button', 'toolbar-xtra', footer, 'Accept');
        decoy.type = 'button';
        decoy.addEventListener('click', () => env.log('decoy', { label: 'Accept', collide: true }));
      }
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'end-control ' + (placement === 'link' ? 'text-end' : ''), footer, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
        if (placement === 'header') {
          submit.classList.add('header-end');
          title.appendChild(submit);
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        texts = {
          cookie: ['Cookie preferences', 'This app uses local preferences.', 'Dismiss'],
          toast: ['Notification', 'Your shopping view is ready.', 'Dismiss'],
          chat: ['Help', 'Need a hand comparing packs?', 'Close'],
          promo: ['Shop update', 'New outdoor gear is now available.', 'Close'],
          banner: ['Announcement', 'Seasonal collection now available.', 'Dismiss'],
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
