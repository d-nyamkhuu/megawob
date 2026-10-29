(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-flight-07',
    'brand': 'FlightFinder',
    'tokens': {
      'bg': '#ffffff',
      'panel': '#ffffff',
      'fg': '#000000',
      'accent': '#0000ee',
      'font': "'Times New Roman',Times,serif",
      'line': '#555555',
      'muted': '#222222',
    },
    'nav': ['Home', 'Flights', 'Hotels', 'Car Rental', 'My Trips', 'Help'],
    'obstruction': null,
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const brand = u.el('a', 'design-brand', header, D.brand);
      brand.href = '#';
      brand.addEventListener('click', (e) => e.preventDefault());
      const nav = u.el('nav', 'design-nav', header);
      for (const n of D.nav) {
        const a = u.el('a', '', nav, n);
        a.href = '#';
        a.addEventListener('click', (e) => e.preventDefault());
      }
      u.el('div', 'design-date', header, 'Mon, Aug 16, 2027');
      const body = u.el('div', 'design-body', shell);
      const display = ctx.display || 'header';
      let shown = display;
      if ((display === 'panel' && window.innerWidth < 1180) || (display === 'toast' && window.innerHeight < 700))
        shown = 'header';
      if (shown === 'hidden') body.classList.add('body-stage-only');
      if (shown !== 'hidden') {
        const note = u.el('section', 'task-note task-note-' + shown, body);
        note.dataset.role = 'instruction';
        if (shown === 'panel') u.el('strong', 'task-note-title', note, 'Your task');
        u.el('div', shown === 'header' ? 'food-task' : 'task-note-copy', note, ctx.instruction);
        if (shown === 'toast') note.dataset.role = 'instruction';
      }
      const stage = u.el('main', 'stage', body);
      const endR = ctx.rng.fork('chrome/end');
      const labels = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
        'Complete',
        "I'm done",
      ];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const submitChoice = labels.find((x) => labelOf(x).trim().toLowerCase() === 'submit') || 'Submit';
      const otherLabels = labels.filter((x) => labelOf(x).trim().toLowerCase() !== 'submit');
      const baseline = endR.bool(0.5);
      const endLabel = baseline ? labelOf(submitChoice) : labelOf(endR.pick(otherLabels.length ? otherLabels : labels));
      const placement = ctx.finish ? null : baseline ? 'footer' : endR.pick(['footer', 'header', 'link']);
      const footer = u.el('footer', 'design-footer', shell);
      footer.classList.toggle('end-hidden', ctx.finish || placement === 'header');
      const decoy = (parent, text, collide) => {
        const b = u.el('button', collide ? 'end-xtra pq-xtra' : 'end-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', collide ? { label: text, collide: true } : { label: text }));
        return b;
      };
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const candidates = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (candidates.length) collide = collideR.pick(candidates);
      }
      let submit = null;
      const end = (parent, link) => {
        const b = u.el(
          link ? 'a' : 'button',
          link ? 'end-control end-link' : 'end-control',
          parent,
          link ? endLabel + ' ›' : endLabel,
        );
        if (link) b.href = '#';
        else b.type = 'button';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (placement === 'header' && !ctx.finish) {
        const tools = u.el('div', 'header-actions', header);
        if (collide) decoy(tools, collide, true);
        submit = end(tools, false);
      }
      if (!ctx.finish && placement !== 'header') {
        if (collide) decoy(footer, collide, true);
        submit = end(footer, placement === 'link');
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
      let [title, copy, label] = texts[ctx.kind];
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
