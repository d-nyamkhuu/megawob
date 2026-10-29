(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-cartedit-05',
    'brand': 'HomeGoods Direct',
    'mode': 'side-left',
    'tokens': {
      'bg': '#d6d9e1',
      'panel': '#fff',
      'fg': '#111111',
      'accent': '#0055f5',
      'font': 'Arial,sans-serif',
      'line': '#b9bbc2',
      'muted': '#5c5d64',
    },
    'nav': 'File    Edit    View    Options    Help',
    'obstruction': null,
    'footer': '',
  };
  const parts = {
    frame: () => function frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'platinum instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const menu = u.el('div', 'mac-menu', header);
      const apple = u.el('span', 'apple-mark', menu);
      apple.innerHTML = '<svg viewBox="0 0 30 30" aria-hidden="true"><path d="M16 8c1-4 3-5 5-5-1 3-3 5-5 5ZM15 10c-4-4-11-1-11 7 0 6 4 11 7 11 2 0 3-1 5-1s3 1 5 1c3 0 6-5 7-9-3-1-4-6-1-8-3-3-7-3-12-1Z" fill="#1269d6" stroke="#11172a" stroke-width="1.5"/></svg>';
      apple.setAttribute('aria-label', 'Apple');
      for (const name of ['Shop', 'File', 'Edit', 'View', 'Go', 'Favorites', 'Window', 'Help']) u.el('span', name === 'Shop' ? 'active' : '', menu, name);
      u.el('span', 'menu-right', menu, '▣   ◖))   10:24 AM');
      const bar = u.el('div', 'window-bar', header);
      u.el('div', 'bar-ridges', bar);
      u.el('strong', 'design-brand', bar, D.brand);
      const actions = u.el('div', 'title-actions', bar);
      u.el('div', 'bar-ridges', bar);
      const controls = u.el('div', 'window-controls', bar);
      for (const glyph of ['−', '□', '×']) u.el('span', '', controls, glyph);
      const body = u.el('div', 'design-body', shell);
      const rail = u.el('nav', 'side-rail', body);
      const icons = {
        Store:'<path d="M3 14 16 3l13 11M6 12v17h20V12M12 29V18h8v11"/>',
        Search:'<circle cx="14" cy="14" r="9"/><path d="m21 21 8 8"/>',
        Bag:'<path d="M6 11h20l-2 19H8L6 11ZM11 13V8a5 5 0 0 1 10 0v5"/>',
        Orders:'<path d="M6 3h20v26H6zM10 9h12M10 14h12M10 19h12M10 24h9"/>',
        Saved:'<path d="M16 28 5 17C-1 10 6 2 13 7l3 3 3-3c7-5 14 3 8 10Z"/>'
      };
      for (const name of ['Store','Search','Bag','Orders','Saved']) {
        const item = u.el('div', 'rail-item' + (name === 'Bag' ? ' selected' : ''), rail);
        const icon = u.el('span', 'rail-icon', item);
        icon.innerHTML = `<svg viewBox="0 0 32 32" aria-hidden="true">${icons[name]}</svg>`;
        u.el('span', '', item, name);
      }
      const workspace = u.el('div', 'workspace', body);
      if (ctx.display !== 'hidden') {
        const note = u.el('section', 'task-note', workspace);
        note.dataset.role = 'instruction';
        if (ctx.display === 'panel') u.el('h2', '', note, 'Task Note');
        u.el('p', '', note, ctx.instruction);
      }
      const stage = u.el('main', 'stage', workspace);
      const endRng = ctx.rng.fork('chrome/end');
      const baseEnd = endRng.bool(0.5);
      const placement = baseEnd ? 'header' : endRng.pick(['header', 'footer', 'link', 'icon']);
      const bank = ctx.content && ctx.content.END_LABELS;
      const labels =
        Array.isArray(bank) && bank.length
          ? bank
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const textOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label = baseEnd ? 'Save' : textOf(endRng.pick(labels));
      const collideRng = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (collideRng.bool(0.3)) {
        const options = [...new Set(labels.map(textOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (options.length) collision = collideRng.pick(options);
      }
      if (collision) {
        const b = u.el('button', 'chrome-button', actions, collision);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
      }
      if (ctx.rng.fork('chrome/filler').bool(0.3)) {
        for (const word of ['Go', 'Expand']) {
          const b = u.el('button', 'chrome-button', actions, word);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: word }));
        }
      }
      let submit = null;
      if (!ctx.finish) {
        const holder = placement === 'footer' ? u.el('div', 'window-footer', shell) : actions;
        submit = u.el(placement === 'link' ? 'a' : 'button', 'end-control ' + placement, holder, placement === 'icon' ? '✓' : label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', placement === 'icon' ? 'Next' : label);
        submit.title = placement === 'icon' ? 'Next' : label;
        submit.addEventListener('click', () => ctx.submit());
      }
      return { stage, submit };
    },
    overlay: () => function overlay(ctx) {
      const u = ctx.util;
      const named = D.obstruction;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) {
        [title, copy, label] = named;
      }
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
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el);
        c.style.cssText = 'display:block;padding:0 22px 14px';
        const ch = u.el('input', '', c);
        ch.type = 'checkbox';
        c.append(' Do not show again');
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };

  env.site({
    name: D.site,
    template: 'site/base',
    design: { parts },
  });
})();
