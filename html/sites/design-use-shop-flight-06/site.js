(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-flight-06',
    'brand': 'SkyWays Travel',
    'tokens': {
      'bg': '#ffffff',
      'panel': '#ffffff',
      'fg': '#000000',
      'accent': '#c0c0c0',
      'font': "'Times New Roman',Times,serif",
      'line': '#000000',
      'muted': '#222222',
    },
    'nav': ['Home', 'Flights', 'Hotels', 'Cars', 'Help'],
    'obstruction': null,
    'notes': [
      'Search for flights using the details on the left.',
      'Review the one-way flight options.',
      'Select a flight and click “Book Selected Flight”.',
      'Enter your passenger information.',
    ],
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'doc-page instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const doc = u.el('div', 'doc', shell);
      u.el('div', 'doc-brand', doc, D.brand);
      const nav = u.el('nav', 'doc-nav', doc);
      D.nav.forEach((n, i) => {
        if (i) u.el('span', '', nav, '|');
        const a = u.el('a', '', nav, n);
        a.href = '#';
        a.addEventListener('click', (e) => {
          e.preventDefault();
          env.log('decoy', { what: n });
        });
      });
      u.el('hr', 'doc-rule', doc);
      if (ctx.display !== 'hidden') u.el('h1', 'doc-task', doc, ctx.instruction);
      const stage = u.el('main', 'stage', doc);
      const margin = u.el('aside', 'margin', shell);
      const note = u.el('section', 'task-note', margin);
      note.dataset.role = 'instruction';
      u.el('h2', '', note, 'Your Task');
      if (ctx.display !== 'hidden') u.el('p', 'food-task', note, ctx.instruction);
      u.el('hr', '', margin);
      const an = u.el('section', 'action-notes', margin);
      u.el('h2', '', an, 'Action Notes');
      const ol = u.el('ol', '', an);
      for (const t of D.notes)
        u.el('li', '', ol, ctx.finish && t === D.notes[4] ? 'Finish when your booking is complete.' : t);
      u.el('hr', 'mrule', margin);
      const footer = u.el('footer', 'design-footer', margin);
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const labels = (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
        ];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const baseline = er.bool(0.5);
        const pool = labels.map(labelOf);
        const label = baseline
          ? pool.find((x) => x.trim().toLowerCase() === 'submit') || 'Submit'
          : labelOf(er.pick(pool.filter((x) => x.trim().toLowerCase() !== 'submit')));
        const placement = baseline ? 'footer' : er.pick(['footer', 'action-link', 'header-link']);
        const mkEnd = (parent, tag, cls, text) => {
          const b = u.el(tag, cls, parent, text);
          if (tag === 'a') {
            b.href = '#';
            b.addEventListener('click', (e) => e.preventDefault());
          } else b.type = 'button';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', () => ctx.submit());
          return b;
        };
        if (placement === 'footer') submit = mkEnd(footer, 'button', 'end-control', label);
        else if (placement === 'action-link') submit = mkEnd(an, 'a', 'end-link', label + ' ›');
        else submit = mkEnd(nav, 'a', 'end-link nav-end', label + ' ›');
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const same = (x) => labelOf(x).trim().toLowerCase() === label.trim().toLowerCase();
          const opts = [...new Set(labels.map(labelOf).filter((x) => !same(x)))];
          if (opts.length) {
            const d = u.el('button', 'xtra-end', footer, labelOf(cr.pick(opts)));
            d.type = 'button';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
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
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
})();
