(function () {
  'use strict';
  const NAME = 'design-use-shop-variantpick-02';
  env.site({
    name: NAME,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const root = document.documentElement;
      const colors = {
        bg: '#211b28',
        panel: '#fffefd',
        fg: '#151727',
        accent: '#f35b4c',
        line: '#dedde0',
        muted: '#70727d',
      };
      Object.entries(colors).forEach(([k, v]) => root.style.setProperty('--' + k, v));
      document.body.className = 'shop-window instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'pine-mark', header, '❧');
      u.el('div', 'design-brand', header, 'Pine & Loom  |  Shop');
      const controls = u.el('div', 'window-controls', header);
      u.el('span', '', controls, '—');
      u.el('span', '', controls, '□');
      u.el('span', '', controls, '×');
      const body = u.el('div', 'design-body', shell);
      const note = u.el('aside', 'task-note', body);
      note.dataset.role = 'instruction';
      u.el('h2', '', note, 'Shopping Tips');
      if (ctx.display !== 'hidden') u.el('p', 'shop-instruction', note, ctx.instruction);
      const tip = (icon, title, copy, cls) => {
        const row = u.el('div', 'tip-row ' + cls, note);
        u.el('span', 'tip-icon', row, icon);
        const text = u.el('div', '', row);
        u.el('b', '', text, title);
        u.el('span', '', text, copy);
      };
      tip('♧', 'Sustainable materials', 'Look for the leaf icon', 'green');
      tip('♧', 'Free shipping', 'On orders over $50', '');
      tip('⬡', 'Easy returns', '30 days, no hassle', '');
      const legend = u.el('section', 'option-legend', note);
      u.el('h3', '', legend, 'Product Options');
      [
        ['available', 'Available choice', 'Click to select'],
        ['selected', 'Selected choice', 'Currently chosen'],
        ['disabled', 'Unavailable choice', 'Not available for this product'],
      ].forEach(([cls, title, copy]) => {
        const row = u.el('div', 'legend-row', legend);
        u.el('span', 'legend-swatch ' + cls, row);
        const t = u.el('div', '', row);
        u.el('b', '', t, title);
        u.el('span', '', t, copy);
      });
      const help = u.el('section', 'help-block', note);
      u.el('h3', '', help, 'Need Help?');
      const helpRow = u.el('div', 'tip-row', help);
      u.el('span', 'tip-icon', helpRow, '☏');
      const ht = u.el('div', '', helpRow);
      u.el('b', '', ht, 'Contact support');
      u.el('span', '', ht, "We're here to help");
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      const rand = ctx.rng.fork('chrome/end');
      const labels = ctx.content?.END_LABELS;
      const textOf = (x) => (typeof x === 'string' ? x : x?.label || x?.text || x?.name || String(x));
      const label = rand.bool(0.5)
        ? 'Apply'
        : Array.isArray(labels) && labels.length
          ? textOf(rand.pick(labels))
          : 'Apply';
      const placement = rand.pick(['footer', 'footer', 'header', 'link', 'icon']);
      const collide = ctx.rng.fork('chrome/collide');
      let decoy = null;
      if (collide.bool(0.3) && Array.isArray(labels)) {
        const opts = [...new Set(labels.map(textOf))].filter((x) => x.toLowerCase() !== label.toLowerCase());
        if (opts.length) decoy = collide.pick(opts);
      }
      let submit = null;
      if (!ctx.finish) {
        if (decoy) {
          const d = u.el('button', 'xtra-control', footer, decoy);
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: decoy, collide: true }));
        }
        if (placement === 'footer' || placement === 'link') {
          submit = u.el('button', placement === 'link' ? 'end-control end-link' : 'end-control', footer, label);
        } else if (placement === 'header') submit = u.el('button', 'end-control header-end', header, label);
        else submit = u.el('button', 'end-control icon-end', header, '✓');
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
        if (rand.bool(0.3)) {
          const share = u.el('button', 'footer-share', footer, 'Share');
          share.type = 'button';
          share.addEventListener('click', () => env.log('decoy', { label: 'Share' }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const copy = {
        cookie: ['Privacy preferences', 'We use essential cookies to keep your shopping session working.', 'Accept'],
        toast: ['Saved', 'Your preferences are up to date.', 'Dismiss'],
        chat: ['Contact support', 'How can we help with your order?', 'Close'],
        promo: ['A little something extra', 'Explore the latest pieces from Pine & Loom.', 'Close'],
        banner: ['Store update', 'Free standard shipping on orders over $50.', 'Dismiss'],
      }[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', copy[0]);
      u.el('h2', '', el, copy[0]);
      u.el('div', 'overlay-copy', el, copy[1]);
      const actions = u.el('div', 'overlay-actions', el);
      const dismiss = u.el('button', 'primary', actions, copy[2]);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
})();
