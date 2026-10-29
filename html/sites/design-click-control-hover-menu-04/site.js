(function () {
  'use strict';
  env.site({
    name: 'design-click-control-hover-menu-04',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref aqua';
      const shell = u.el('main', 'shell', document.body);
      const frame = u.el('div', 'app-window', shell);
      const titlebar = u.el('header', 'titlebar', frame);
      u.el('span', 'traffic', titlebar, '');
      u.el('strong', 'window-title', titlebar, 'Acme Solutions');
      u.el('span', 'window-pill', titlebar, '');
      const mast = u.el('header', 'masthead', frame);
      u.el('span', 'globe', mast, '◉');
      const brand = u.el('div', 'brand', mast);
      u.el('strong', '', brand, 'Acme Solutions');
      u.el('small', '', brand, 'Products for a Connected World');
      u.el('div', 'searchbox', mast, '⌕　Search Products');
      const work = u.el('div', 'work', frame);
      const center = u.el('section', 'center', work);
      const panel = u.el('section', 'task-window', center);
      const taskhead = u.el('header', 'taskhead', panel);
      u.el('strong', '', taskhead, 'Products');
      u.el('span', 'mini-pill', taskhead, '');
      const note = u.el('div', 'instruction', taskhead, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('div', 'stage', panel);
      const aside = u.el('aside', 'inspector', work);
      u.el('h2', '', aside, 'Product Details');
      if (ctx.display === 'panel' || ctx.display === 'toast') aside.append(note);
      const prod = u.el('div', 'product', aside);
      u.el('span', 'product-icon', prod, '▤✎');
      const pd = u.el('div', '', prod);
      u.el('strong', '', pd, 'Acme Office');
      u.el('span', '', pd, 'Productivity Suite');
      u.el('span', '', pd, 'Version 3.2');
      const details = u.el('div', 'details', aside);
      [
        ['Category:', 'Productivity'],
        ['Release Date:', 'Jan 12, 2001'],
        ['Size:', '120 MB'],
        ['Language:', 'English'],
        ['Developer:', 'Acme Solutions'],
        [
          'Description:',
          'A complete set of office productivity tools, including word processing, spreadsheets, and presentations.',
        ],
      ].forEach(([a, b]) => {
        const row = u.el('div', 'detail-row', details);
        u.el('span', '', row, a);
        u.el('span', '', row, b);
      });
      const related = u.el('section', 'related', aside);
      u.el('h3', '', related, 'Related Resources');
      [
        ['▤', 'Product Website'],
        ['▣', 'User Guide (PDF)'],
        ['◉', 'Support Center'],
      ].forEach(([i, t]) => {
        const row = u.el('div', 'resource', related);
        u.el('span', '', row, i);
        u.el('a', '', row, t);
      });
      let submit = null;
      const endRng = ctx.rng.fork('chrome/end');
      const endBank =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const endText = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const label = endRng.bool(0.5) ? 'Save' : endText(endRng.pick(endBank.filter((x) => endText(x) !== 'Save')));
      const placement = endRng.pick(['header', 'footer', 'link']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideRng.bool(0.3)) {
        const choices = [
          ...new Set(endBank.map(endText).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (choices.length) collide = collideRng.pick(choices);
      }
      if (!ctx.finish) {
        if (placement === 'header') {
          submit = u.el('button', 'submit', taskhead, label);
          submit.type = 'button';
          submit.addEventListener('click', ctx.submit);
        } else {
          const foot = u.el('footer', 'taskfoot', panel);
          if (placement === 'link') {
            submit = u.el('a', 'submit-link', foot, label);
            submit.href = 'javascript:void(0)';
          } else submit = u.el('button', 'submit', foot, label);
          if (placement === 'link') submit.addEventListener('click', ctx.submit);
          else {
            submit.type = 'button';
            submit.addEventListener('click', ctx.submit);
          }
        }
        if (collide) {
          const b = u.el('button', 'xtra-task', taskhead, collide);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
        }
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
