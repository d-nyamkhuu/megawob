(function () {
  'use strict';
  const D = {
    site: 'design-use-shop-search-01',
    brand: 'GreenLeaf',
    mode: 'side-right',
    tokens: {
      bg: '#f7f6ed',
      panel: '#fffefa',
      fg: '#111111',
      accent: '#ab1b1c',
      font: 'Georgia,serif',
      line: '#bbb8ae',
      muted: '#5f6a78',
    },
    obstruction: null,
    footer: '',
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = D.mode + ' instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body),
        header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, D.brand);
      u.el('div', 'window-controls', header, '−  □  ×');
      const nav = u.el('nav', 'design-nav', header);
      for (const label of ['PLANTS', 'SEEDS', 'GARDEN SUPPLIES', 'BOOKS', 'GIFTS', 'SALE'])
        u.el('span', '', nav, label);
      const leaf = u.el('img', 'brand-leaf', header);
      leaf.src = 'sites/' + D.site + '/assets/brand-leaf.svg';
      leaf.alt = '';
      u.el('p', 'brand-tagline', header, 'Plants for a Happier Home');
      const accounts = u.el('div', 'account-links', header);
      for (const label of ['Sign In', 'My Account', 'Help']) u.el('span', '', accounts, label);
      const cart = u.el('span', 'cart-link', accounts);
      cart.innerHTML =
        '<svg viewBox="0 0 36 32" aria-hidden="true"><path d="M1 3h6l5 19h18l5-18-5 2H8M11 25h19" fill="#100e06" stroke="#100e06" stroke-width="2"/><circle cx="15" cy="29" r="2.5"/><circle cx="27" cy="29" r="2.5"/></svg>Cart (0)';
      u.el('i', 'brand-promise', header, 'Good Things Grow Here.');
      u.el('div', 'search-slot', header);
      const body = u.el('div', 'design-body', shell),
        note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        const title = u.el('h2', '', note);
        u.el('span', 'task-note-title', title, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      if (ctx.display === 'header') header.append(note);
      const stage = u.el('main', 'stage', body),
        footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          labels =
            ctx.content && Array.isArray(ctx.content.END_LABELS)
              ? ctx.content.END_LABELS
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        // Preserve the legacy end-stream draws so placement stays independent.
        const legacyLabel = er.bool(0.5) ? 'Submit' : labelOf(er.pick(labels));
        const lr = ctx.rng.fork('chrome/end-label');
        const label = lr.bool(0.5) ? 'Submit' : labelOf(lr.pick(labels)) || legacyLabel;
        let placement = er.pick(['footer', 'footer', 'footer', 'panel-link', 'footer-link']);
        if (placement === 'panel-link' && (ctx.display === 'hidden' || ctx.display === 'toast')) placement = 'footer';
        const makeEnd = (parent, cls, text, tag) => {
          const b = u.el(tag || 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (placement === 'panel-link') {
          const actions = u.el('div', 'episode-note-actions', note);
          submit = makeEnd(actions, 'episode-end-link', label, 'a');
        } else if (placement === 'footer-link') submit = makeEnd(footer, 'episode-end-link', label, 'a');
        else submit = makeEnd(footer, 'end-control', label);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const options = [
            ...new Set(labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
          ];
          if (options.length) {
            const decoy = u.el('button', 'episode-xtra', footer, labelOf(cr.pick(options)));
            decoy.type = 'button';
            decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
          }
        }
      }
      const art = u.el('div', 'leaf-caption', body);
      u.el('i', '', art, 'Plants\nInspire a\nBrighter Day.');
      u.el('p', '', art, 'Healthy Homes\nGreener Lifestyles\nHappier You');
      // Reserve the rendered header note before the widget establishes its anchors.
      if (ctx.display === 'header') body.style.marginTop = Math.ceil(note.getBoundingClientRect().height + 16) + 'px';
      if (ctx.display === 'toast') {
        note.style.width = 'calc(92% - ' + Math.ceil(footer.getBoundingClientRect().width + 24) + 'px)';
        body.style.marginBottom = Math.ceil(note.getBoundingClientRect().height + 24) + 'px';
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        named = D.obstruction,
        texts = {
          cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
          toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
          chat: ['Help', 'Need help with this workspace?', 'Close'],
          promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
          banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
        };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) [title, copy, label] = named;
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
