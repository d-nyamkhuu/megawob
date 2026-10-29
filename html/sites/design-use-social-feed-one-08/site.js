(function () {
  'use strict';
  const D = {
    site: 'design-use-social-feed-one-08',
    brand: 'Chirp',
    tokens: {
      bg: '#eef0f6',
      panel: '#ffffff',
      fg: '#1b2033',
      accent: '#3f51b5',
      font: 'Roboto,"Helvetica Neue",Arial,sans-serif',
      line: '#e4e7ef',
      muted: '#6a7388',
    },
    nav: ['Home', 'Explore', 'Notifications', 'Messages'],
    obstruction: null,
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = 'bottom instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const brand = u.el('div', 'design-brand', header);
      brand.innerHTML =
        '<svg viewBox="0 0 24 24" fill="#fff"><path d="M23 4.6a9 9 0 0 1-2.6.7 4.5 4.5 0 0 0 2-2.5 9 9 0 0 1-2.9 1.1 4.5 4.5 0 0 0-7.7 4.1A12.800 12.800 0 0 1 2.5 3.300a4.500 4.500 0 0 0 1.400 6 4.500 4.500 0 0 1-2-.6v.1a4.500 4.500 0 0 0 3.600 4.400 4.500 4.500 0 0 1-2 .1 4.500 4.500 0 0 0 4.200 3.100A9 9 0 0 1 1 18.300a12.800 12.800 0 0 0 6.900 2c8.300 0 12.800-6.900 12.800-12.800v-.6A9 9 0 0 0 23 4.600z"/></svg>';
      u.el('span', '', brand, D.brand);
      const nav = u.el('nav', 'design-nav', header);
      D.nav.forEach((n, i) => {
        const a = u.el('span', 'nav-item' + (i === 0 ? ' on' : ''), nav, n);
        if (i) a.addEventListener('click', () => env.log('decoy', { what: n }));
      });
      const me = u.el('div', 'design-me', header);
      me.innerHTML =
        '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#e8eaf6"/><circle cx="12" cy="9.500" r="3.800" fill="#3f51b5"/><path d="M4.500 19.500c1.500-3.600 4.300-5 7.500-5s6 1.400 7.500 5a10 10 0 0 1-15 0z" fill="#3f51b5"/></svg>';
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note mode-' + ctx.display, body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        const ic = u.el('span', 'task-clipboard', note);
        ic.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 12l7-7M16 4.500V8h3.500"/></svg>';
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const meta = u.el('dl', 'task-meta', body);
      meta.hidden = true;
      for (const c of ['action', 'target-author', 'post-starts-with', 'status']) u.el('dd', 'detail-' + c, meta);
      const stage = u.el('main', 'stage', body);
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const placement = er.bool(0.5) ? 'float' : er.pick(['header', 'link']);
        const bank = ctx.content && ctx.content.END_LABELS;
        const labels =
          Array.isArray(bank) && bank.length
            ? bank
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const picked = placement === 'float' ? null : er.pick(labels);
        const label =
          placement === 'float' ? 'Submit' : String((picked && (picked.label || picked.text || picked)) || picked);
        const tag = placement === 'link' ? 'a' : 'button';
        const cls =
          placement === 'float'
            ? 'end-control'
            : placement === 'header'
              ? 'end-control end-header'
              : 'end-control end-link';
        const parent = placement === 'header' ? header : shell;
        submit = u.el(tag, cls, parent, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        if (placement === 'link') submit.href = '#';
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });

        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const same = (x) =>
            String((x && (x.label || x.text || x)) || '')
              .trim()
              .toLowerCase() === label.trim().toLowerCase();
          const options = labels.filter((x) => !same(x));
          if (options.length) {
            const item = cr.pick(options),
              text = String(item.label || item.text || item);
            const decoy = u.el('button', 'end-pqs', header, text);
            decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
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
      const [title, copy, label] = texts[ctx.kind];
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
