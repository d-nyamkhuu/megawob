(function () {
  'use strict';
  env.site({
    name: 'design-click-control-pie-07',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref lux';
      const index = u.el('nav', 'lx-index', document.body);
      for (let i = 1; i <= 10; i++) u.el('div', i === 1 ? 'on' : '', index, String(i));
      const shell = u.el('main', 'lx-shell', document.body);
      const head = u.el('header', 'lx-head', shell);
      const brand = u.el('div', 'lx-brand', head);
      u.el('span', 'lx-name', brand, 'Atelier');
      u.el('span', 'lx-sub', brand, 'Focused Work');
      const nav = u.el('div', 'lx-nav', head);
      ['Docs', 'Tools', 'Help'].forEach((t) => u.el('span', '', nav, t));
      u.el('span', 'lx-avatar', nav, 'JD');
      const sheet = u.el('section', 'lx-sheet', shell);
      u.el('div', 'lx-label', sheet, 'Task');
      let display = ctx.display;
      if (
        (display === 'panel' && document.body.clientWidth < 1100) ||
        (display === 'toast' && document.body.clientHeight < 680)
      )
        display = 'header';
      const note = u.el('div', 'instruction lx-instruction', sheet, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage lx-stage', sheet);
      const foot = u.el('footer', 'lx-foot', shell);
      const reset = u.el('button', 'lx-reset', foot, 'Reset');
      reset.type = 'button';
      reset.addEventListener('click', () => env.log('decoy', { label: 'Reset' }));
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const labels = ctx.content && ctx.content.END_LABELS;
        const label = er.bool(0.5)
          ? 'Submit'
          : String(
              er.pick(
                labels && labels.length ? labels : ['Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'],
              ),
            );
        const place = er.pick(['footer', 'footer', 'footer', 'header', 'link', 'icon']);
        const cr = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (cr.bool(0.3)) {
          const pool = (
            labels && labels.length
              ? labels
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
          ).map((x) => String(x));
          const options = [...new Set(pool)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) collide = cr.pick(options);
        }
        const decoy = (parent, text, collides) => {
          const b = u.el('button', 'lx-xtra', parent, text);
          b.type = 'button';
          b.addEventListener('click', () =>
            env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
          );
        };
        const headerTools = u.el('div', 'lx-tools', head);
        if (collide && place !== 'footer') decoy(headerTools, collide, true);
        const end = (parent, cls, text) => {
          const b = u.el(cls === 'lx-endlink' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.title = label;
          b.setAttribute('aria-label', label);
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (place === 'footer') submit = end(foot, 'submit lx-submit', label);
        else if (place === 'header') submit = end(headerTools, 'submit lx-submit', label);
        else if (place === 'link') submit = end(foot, 'lx-endlink', label + ' ›');
        else submit = end(headerTools, 'submit lx-submit lx-icon', '✓');
        if (collide && place === 'footer') decoy(headerTools, collide, true);
      }
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
