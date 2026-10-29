(function () {
  'use strict';
  env.site({
    name: 'design-click-control-focus-07',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref plain';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('a', 'brand', head, 'Riverton University');
      const nav = u.el('nav', 'topnav', head);
      ['Home', 'Courses', 'Library', 'Help'].forEach((s, i) => {
        if (i) u.el('span', 'sep', nav, '|');
        u.el('a', '', nav, s);
      });
      const work = u.el('div', 'work', shell);
      const panel = u.el('section', 'panel', work);
      panel.dataset.display = ctx.display;
      const note = u.el('h1', 'instruction', panel, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('div', 'stage', panel);
      const actions = u.el('div', 'actions', panel);
      let submit = null;
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide');
      const ends =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const defaultEpisode = endR.bool(0.5);
      const current = defaultEpisode ? labelOf(ends[0]) : endR.pick(ends.map(labelOf));
      const placement = defaultEpisode ? 'actions' : endR.pick(['actions', 'header', 'footer-link']);
      const endButton = (parent, cls, label, asLink) => {
        const b = u.el(asLink ? 'a' : 'button', cls, parent, label);
        if (asLink) b.href = '#';
        else b.type = 'button';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'actions') submit = endButton(actions, 'submit', current, false);
        else if (placement === 'header') submit = endButton(nav, 'end-header', current, true);
      }
      const collidePool = [
        ...new Set(ends.map(labelOf).filter((x) => x.trim().toLowerCase() !== current.trim().toLowerCase())),
      ];
      if (!ctx.finish && collidePool.length && collideR.bool(0.3)) {
        const decoy = u.el('button', 'end-xtra', nav, collideR.pick(collidePool));
        decoy.type = 'button';
        decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
      }
      const clear = u.el('button', 'clear-form', actions, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () =>
        stage.querySelectorAll('input,textarea').forEach((input) => (input.value = '')),
      );
      const foot = u.el('footer', 'footer', shell);
      const fl = u.el('nav', 'footnav', foot);
      ['About Us', 'Contact', 'Privacy', 'Site Map'].forEach((s, i) => {
        if (i) u.el('span', 'sep', fl, '|');
        u.el('a', '', fl, s);
      });
      if (!ctx.finish && placement === 'footer-link') submit = endButton(fl, 'end-footer', current + ' ›', true);
      u.el('span', 'copy', foot, '© 1995 Riverton University');
      return { stage, submit };
    },
    overlay(ctx) {
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
