(function () {
  'use strict';
  const cfg = {
    'title': 'Riverton City Services',
    'nav': ['Services', 'Residents', 'Business', 'About'],
    'heading': 'Community Feedback',
    'sub': 'Tell us what matters most to you. All fields are optional.',
    'obstacle': 'Welcome!',
    'copy': 'This short tour will show you around the interface.',
    'dismiss': 'Skip tour',
  };
  const LOGO =
    '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 1 1 16v5h62v-5Z" fill="#fff"/><path d="M7 23h9v28H7zm20 0h9v28h-9zm20 0h9v28h-9zM4 53h56v5H4zM1 59h62v5H1z" fill="#fff"/></svg>';
  const SEARCH =
    '<svg viewBox="0 0 24 24" fill="none" stroke="#10264d" stroke-width="2.6" stroke-linecap="round"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/></svg>';
  env.site({
    name: 'design-click-control-widget-10',
    styles: ['site.css', 'civic.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref civic';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const brand = u.el('div', 'brand', head);
      const logo = u.el('span', 'logo', brand);
      logo.innerHTML = LOGO;
      u.el('span', 'brand-name', brand, cfg.title);
      const nav = u.el('nav', 'topnav', head);
      cfg.nav.forEach((s) => u.el('span', '', nav, s));
      const search = u.el('div', 'search', head);
      const si = u.el('span', 'search-icon', search);
      si.innerHTML = SEARCH;
      u.el('span', '', search, 'Search our site');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      let display = ctx.display || 'header';
      if ((display === 'panel' || display === 'toast') && ctx.size && ctx.size.width < 1260) display = 'header';
      const note = u.el('h1', 'instruction', center, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'panel') note.classList.add('instruction-panel');
      if (display === 'toast') note.classList.add('instruction-toast');
      const intro = u.el('div', 'intro', center);
      u.el('h2', '', intro, cfg.heading);
      u.el('p', '', intro, cfg.sub);
      const stage = u.el('div', 'stage', center);
      const foot = u.el('footer', 'footer', shell);
      const clear = u.el('button', 'ghostbtn clear', foot, 'Clear form');
      clear.type = 'button';
      clear.addEventListener('click', () => env.log('decoy', { label: 'Clear form' }));
      const right = u.el('div', 'foot-right', foot);
      const cancel = u.el('button', 'ghostbtn cancel', right, 'Cancel');
      cancel.type = 'button';
      cancel.addEventListener('click', () => env.log('decoy', { label: 'Cancel' }));
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide');
      const ends = (ctx.content && ctx.content.END_LABELS) || [
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
      const labelOf = (x) => String(typeof x === 'string' ? x : x.label || x.text || x.name || x);
      const label = endR.bool(0.5) ? 'Submit' : labelOf(endR.pick(ends));
      const placement = endR.pick(['footer', 'footer', 'footer', 'header', 'link', 'icon']);
      let submit = null;
      const addDecoy = (parent, text) => {
        const b = u.el('button', 'ghostbtn civic-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      if (!ctx.finish) {
        let collide = null;
        if (collideR.bool(0.3)) {
          const pool = ends.map(labelOf);
          const options = [...new Set(pool)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) collide = collideR.pick(options);
        }
        if (placement === 'header') {
          if (collide) addDecoy(head, collide);
          submit = u.el('button', 'submit civic-head-submit', head, placement === 'icon' ? '✓' : label);
          submit.type = 'button';
          submit.title = label;
          submit.setAttribute('aria-label', label);
          submit.addEventListener('click', ctx.submit);
        } else if (placement === 'link') {
          if (collide) addDecoy(right, collide);
          submit = u.el('a', 'civic-endlink', right, label + ' ›');
          submit.href = '#';
          submit.title = label;
          submit.setAttribute('aria-label', label);
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        } else if (placement === 'icon') {
          if (collide) addDecoy(right, collide);
          submit = u.el('button', 'submit civic-icon-submit', right, '✓');
          submit.type = 'button';
          submit.title = label;
          submit.setAttribute('aria-label', label);
          submit.addEventListener('click', ctx.submit);
        } else {
          if (collide) addDecoy(right, collide);
          submit = u.el('button', 'submit', right, label);
          submit.type = 'button';
          submit.title = label;
          submit.setAttribute('aria-label', label);
          submit.addEventListener('click', ctx.submit);
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      if (ctx.kind === 'chat') {
        const el = ctx.util.el('section', 'perturb chat tour-overlay', document.body);
        ctx.util.el('h2', '', el, cfg.obstacle);
        ctx.util.el('p', '', el, cfg.copy);
        const dismiss = ctx.util.el('button', 'dismiss-design', el, cfg.dismiss);
        dismiss.type = 'button';
        dismiss.addEventListener('click', ctx.dismiss);
        const next = ctx.util.el('button', 'next-design', el, 'Next');
        next.type = 'button';
        next.addEventListener('click', ctx.dismiss);
        const x = ctx.util.el('button', 'x-design', el, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close tour');
        x.addEventListener('click', ctx.dismiss);
        return { el, dismiss };
      }
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
