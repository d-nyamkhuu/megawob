(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-ticket-12',
    'brand': 'TRAIN & COACH TICKETS',
    'mode': 'side-right',
    'tokens': {
      'bg': '#faf9f2',
      'panel': '#fffefa',
      'fg': '#101010',
      'accent': '#c7ff35',
      'font': 'Liberation Sans Narrow,Arial,sans-serif',
      'line': '#bebebe',
      'muted': '#5e6779',
    },
    'nav': '',
    'obstruction': null,
    'footer': 'Ready',
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
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, D.brand);
      u.el('div', 'design-sub', header, 'Same route. Different options.');
      const trip = u.el('div', 'design-trip', header);
      const tp =
        (ctx.spec && ctx.spec.tickets && ctx.spec.tickets[0] && ctx.spec.tickets[0].place) || 'Riverton → Lakeside';
      u.el('div', 'design-route', trip, tp);
      u.el('div', 'design-when', trip, 'Tue, Apr 27, 2021  |  1 adult');
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = endRng.bool(0.5);
      const placement = referenceEnd ? 'reference' : endRng.pick(['toolbar', 'link']);
      const endLabel = referenceEnd ? 'Submit' : endRng.pick(endWords.filter((x) => x !== 'Submit'));
      let submit = null;
      if (!ctx.finish) {
        const sidePanel = ctx.display !== 'hidden' && ctx.display !== 'toast';
        submit = u.el(
          'button',
          'end-control end-' + placement,
          placement === 'toolbar' ? header : sidePanel ? note : footer,
        );
        u.el('span', 'submit-caption', submit, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const options = endWords.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = collideRng.pick(options);
          const decoy = u.el('button', 'chrome-xtra', header, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      const pref = u.el('section', 'prefs-panel', note);
      u.el('h3', '', pref, 'PREFERENCES');
      u.el('p', '', pref, 'Sort by');
      const sort = u.el('button', '', pref, 'Departure time');
      sort.type = 'button';
      sort.addEventListener(
        'click',
        () => (sort.textContent = sort.textContent === 'Departure time' ? 'Price' : 'Departure time'),
      );
      u.el('p', 'prefs-sub', pref, 'Show only');
      for (const name of ['Direct services only', 'No transfers', 'Flexible with time']) {
        const l = u.el('label', '', pref);
        const c = u.el('input', '', l);
        c.type = 'checkbox';
        l.append(' ' + name);
      }
      const tc = u.el('div', 'task-ctl', note);
      u.el('span', '', tc, 'Task controls');
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
