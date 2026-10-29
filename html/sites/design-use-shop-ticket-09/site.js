(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-ticket-09',
    'brand': 'Travel Finder – Train Tickets',
    'tokens': {
      'bg': '#d4d8de',
      'panel': '#e4e7ec',
      'fg': '#0c1420',
      'accent': '#2c5aa8',
      'font': "Arial,'Liberation Sans',sans-serif",
      'line': '#9aa3af',
      'muted': '#586270',
    },
    'menus': ['File', 'Edit', 'View', 'Tools', 'Help'],
    'obstruction': null,
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'qt-board instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const tb = u.el('div', 'qt-title', header);
      const icon = u.el('span', 'qt-icon', tb);
      icon.innerHTML =
        '<svg viewBox="0 0 24 24"><rect x="1" y="1" width="22" height="22" fill="#236493" stroke="#99c9e4"/><path d="M5 19V8l3-3 3 3v11M15 19V7l3-3 3 3v12M4 12h8M14 11h8" fill="none" stroke="#fff" stroke-width="2"/><path d="M6 20l3-5M17 20l3-5" stroke="#a8dfed" stroke-width="2"/></svg>';
      u.el('span', 'design-brand', tb, D.brand);
      const wc = u.el('span', 'window-controls', tb);
      for (const g of ['_', '□', '✕']) u.el('i', '', wc, g);
      const nav = u.el('nav', 'design-nav', header);
      for (const m of D.menus) {
        const s = u.el('span', '', nav);
        s.innerHTML = '<u>' + m[0] + '</u>' + m.slice(1);
      }
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note display-' + ctx.display, body);
      note.dataset.role = 'instruction';
      u.el('h2', '', note, 'Task');
      if (ctx.display !== 'hidden') u.el('p', 'food-task', note, ctx.instruction);
      u.el('p', 'brief-help', note, '');
      const ns = u.el('p', 'brief-status', note);
      u.el('span', 'basket-state', ns, '');
      const tool = u.el('div', 'qt-tool', body);
      for (const [l, v, k] of [
        ['From:', '', 'dd'],
        ['To:', '', 'dd'],
        ['Date:', 'All dates', 'cal'],
        ['Passengers:', '1', 'sp'],
      ]) {
        u.el('span', 'tl', tool, l);
        const f = u.el('span', 'tf ' + k, tool);
        const value = u.el('span', 'field-value', f, v);
        f.dataset.field = l.slice(0, -1).toLowerCase();
        if (k === 'sp') {
          const arrows = u.el('i', 'spin-arrows', f);
          u.el('b', '', arrows, '▴');
          u.el('b', '', arrows, '▾');
        } else {
          const arrow = u.el('i', '', f, k === 'dd' ? '▾' : '');
          if (k === 'cal')
            arrow.innerHTML =
              '<svg viewBox="0 0 24 24" fill="none" stroke="#174b83" stroke-width="1.6"><rect x="3" y="4" width="18" height="17" fill="white"/><path d="M3 9h18M7 2v5M17 2v5M7 12h2m3 0h2m3 0h2M7 16h2m3 0h2m3 0h2"/></svg>';
        }
      }
      const sb = u.el('button', 'qt-search', tool, 'Search');
      sb.type = 'button';
      sb.addEventListener('click', () => env.log('decoy', { what: 'Search' }));
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, 'Options found.');
      for (const [label, cls] of [
        ['View Details', 'view-details'],
        ['Buy Ticket', 'buy-ticket'],
      ]) {
        const b = u.el('button', cls, footer, label);
        b.type = 'button';
        if (cls === 'view-details') b.addEventListener('click', () => env.log('decoy', { what: label }));
      }
      let submit = null;
      if (!ctx.finish) {
        const endRng = ctx.rng.fork('chrome/end');
        const content = ctx.content && ctx.content.END_LABELS;
        const bank =
          Array.isArray(content) && content.length
            ? content
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const label = endRng.bool(0.5)
          ? 'Submit'
          : typeof endRng.pick(bank) === 'string'
            ? endRng.pick(bank)
            : 'Submit';
        const placement = endRng.pick(['footer', 'footer', 'footer', 'title', 'menu']);
        const collideRng = ctx.rng.fork('chrome/collide');
        let collision = null;
        if (collideRng.bool(0.3)) {
          const pool = bank
            .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
            .filter((x) => x.toLowerCase() !== label.toLowerCase());
          if (pool.length) collision = collideRng.pick(pool);
        }
        const makeEnd = (parent, cls, text) => {
          const b = u.el('button', cls, parent, text);
          b.type = 'button';
          b.dataset.role = 'submit';
          b.title = label;
          b.setAttribute('aria-label', label);
          b.addEventListener('click', () => ctx.submit());
          return b;
        };
        if (placement === 'footer') {
          submit = makeEnd(footer, 'end-control', label);
        } else if (placement === 'title') {
          submit = makeEnd(tb, 'qt-end-title', label);
        } else {
          submit = makeEnd(nav, 'qt-end-menu', label);
        }
        if (collision) {
          const parent = placement === 'footer' ? nav : footer;
          const d = u.el('button', 'qt-end-xtra', parent, collision);
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
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
