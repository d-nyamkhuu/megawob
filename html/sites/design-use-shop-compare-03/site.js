(function () {
  'use strict';
  const D = {
    site: 'design-use-shop-compare-03',
    brand: 'TrailGear Shop',
    tokens: {
      bg: '#34402f',
      panel: '#f7f3e8',
      fg: '#201d18',
      accent: '#626b4f',
      line: '#d8d0bf',
      muted: '#756e62',
      font: 'Georgia,"Times New Roman",serif',
    },
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'trailgear instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'brand-mark', header, '△');
      u.el('div', 'design-brand', header, D.brand);
      const controls = u.el('div', 'window-controls', header);
      u.el('span', 'min', controls, '−');
      u.el('span', 'max', controls, '□');
      u.el('span', 'close', controls, '×');
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') u.el('p', 'food-task', note, ctx.instruction);
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'status-icon', footer, '⌕');
      u.el('span', 'product-count', footer, '4 products shown');
      const spacer = u.el('span', 'status-spacer', footer);
      u.el('span', 'bag-icon', footer, '🛒');
      u.el('span', 'bag-count', footer, 'Bag: 0 items');
      u.el('span', 'status-divider', footer, '│');
      u.el('span', 'bag-total', footer, 'Total: $0.00');
      const endRng = ctx.rng.fork('chrome/end'),
        baseEnd = endRng.bool(0.5),
        placement = baseEnd ? 'header' : endRng.pick(['footer', 'link']);
      const bank = ctx.content && ctx.content.END_LABELS,
        labels =
          Array.isArray(bank) && bank.length
            ? bank
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
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
        const decoy = u.el('button', 'menu-pq', header, collision);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
      }
      let submit = null;
      if (!ctx.finish) {
        const where = placement;
        submit = u.el(
          where === 'link' ? 'button' : 'button',
          where === 'footer' ? 'end-control footer-end' : where === 'link' ? 'end-control text-end' : 'end-control',
          where === 'footer' ? footer : header,
          label,
        );
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
          cookie: ['Cookie preferences', 'This shop uses a small number of essential cookies.', 'Dismiss'],
          toast: ['Shop notice', 'Your comparison is ready.', 'Dismiss'],
          chat: ['TrailGear support', 'How can we help with your pack search?', 'Close'],
          promo: ['Field notes', 'See what is new for the coming season.', 'Close'],
          banner: ['Store announcement', 'Free tracked delivery on all trail equipment.', 'Dismiss'],
        };
      const [title, copy, label] = texts[ctx.kind],
        el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
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
