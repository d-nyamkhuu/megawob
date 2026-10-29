(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-food-06',
    'brand': 'The Daily Plate',
    'mode': 'side-right',
    'tokens': {
      'bg': '#efede6',
      'panel': '#f3f1ea',
      'fg': '#111111',
      'accent': '#111111',
      'font': "Georgia,'Times New Roman',serif",
      'line': '#111111',
      'muted': '#4a4843',
    },
    'obstruction': null,
    'footer': '',
  };
  const ICON =
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"><path d="M6 3v7M9 3v7M12 3v7M6 10c0 2 1 3 3 3v8M17 3c-2 1-3 4-3 8h3v10"/></svg>';
  const WIN =
    '<svg viewBox="0 0 120 20" width="120" height="20" fill="none" stroke="#111" stroke-width="1.6"><path d="M6 10h12"/><rect x="50" y="3" width="13" height="13"/><path d="M95 3l13 13M108 3L95 16"/></svg>';
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'side-right instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const hl = u.el('div', 'hdr-left', header);
      const ic = u.el('span', 'hdr-icon', hl);
      ic.innerHTML = ICON;
      u.el('span', 'design-brand', hl, D.brand);
      const hr = u.el('div', 'window-controls', header);
      hr.innerHTML = WIN;
      const body = u.el('div', 'design-body', shell);
      const stage = u.el('main', 'stage', body);
      const dh = u.el('div', 'doc-head', body);
      u.el('h1', '', dh, 'The Daily Plate');
      u.el('p', '', dh, 'Good food, simpler days.');
      const orderSlot = u.el('div', 'order-slot', body);
      u.el('p', 'order-caption', body, 'Items can be edited before placing your order.');
      const sb = u.el('div', 'search-box', body);
      sb.innerHTML =
        '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#111" stroke-width="2"><circle cx="10" cy="10" r="6"/><path d="M15 15l6 6"/></svg>';
      u.el('span', '', sb, 'Search menu...');
      u.el('h2', 'fav-title', body, 'More Favourites');
      const fav = u.el('div', 'fav-row', body);
      for (const [n, d, p, ink] of [
        ['Margherita', 'Classic tomato, mozzarella, basil.', '$11.00', 'margherita'],
        ['Caesar Salad', 'Romaine, croutons, parmesan.', '$9.00', 'caesar'],
        ['Garlic Bread', 'Toasted sourdough with herb butter.', '$5.00', 'bread'],
        ['Iced Tea', 'Black tea, lightly sweetened.', '$3.00', 'tea'],
      ]) {
        const c = u.el('div', 'fav-card', fav);
        const image = u.el('span', 'fav-img', c);
        image.style.backgroundImage = 'url(sites/design-use-shop-food-06/assets/ink-' + ink + '.webp)';
        const t = u.el('div', 'fav-txt', c);
        u.el('b', '', t, n);
        u.el('i', '', t, d);
        u.el('strong', '', t, p);
        u.el('span', 'fav-add', t, 'Add');
      }
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') u.el('p', 'food-task', note, ctx.instruction);
      if (ctx.display === 'header') note.classList.add('note-header');
      if (ctx.display === 'toast') note.classList.add('note-toast');
      const an = u.el('div', 'action-notes', note);
      u.el('h3', '', an, 'Action notes');
      const ol = u.el('ol', '', an);
      u.el('li', '', ol, 'Set the correct quantities and size for each item.');
      u.el('li', '', ol, 'Review the basket.');
      const l3 = u.el('li', '', ol, 'Click ');
      u.el('b', '', l3, 'Place order');
      l3.append('.');
      const l4 = u.el('li', '', ol, 'Finally, click ');
      u.el('b', '', l4, 'Submit');
      l4.append('.');
      const ns = u.el('p', 'brief-status', an);
      u.el('span', 'basket-state', ns, 'The basket is not complete yet.');
      const clr = u.el('button', 'clear-basket', an, 'Clear basket');
      clr.type = 'button';
      clr.addEventListener('click', () => env.log('decoy', { what: 'Clear basket' }));
      let submit = null;
      const endRng = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? 'none' : endRng.pick(['margin', 'margin', 'margin', 'header', 'link']);
      const endLabels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label =
        placement === 'margin' ? 'Submit' : labelOf(endRng.pick(endLabels.filter((x) => labelOf(x) !== 'Submit')));
      const sw = ctx.finish ? null : u.el('div', 'submit-wrap end-' + placement, note);
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'end-control ' + (placement === 'link' ? 'end-link' : ''),
          placement === 'header' ? dh : sw,
          placement === 'link' ? label + ' ›' : label,
        );
        submit.type = placement === 'link' ? '' : 'button';
        if (placement === 'link') submit.href = '#';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideRng.bool(0.3)) {
        const opts = endLabels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (opts.length) {
          const text = labelOf(collideRng.pick(opts));
          const decoy = u.el('button', 'pqd-xtra', an, text);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
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
  });
})();
