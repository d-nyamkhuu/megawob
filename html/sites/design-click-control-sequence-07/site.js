(function () {
  'use strict';
  env.site({
    name: 'design-click-control-sequence-07',
    styles: ['site2.css'],
    frame(ctx) {
      const u = ctx.util,
        rng = ctx.rng;
      document.body.className = 'ref minimal';
      const win = u.el('main', 'win', document.body);
      win.classList.toggle('finish', ctx.finish);
      const head = u.el('header', 'head', win);
      const brand = u.el('div', 'brand', head);
      u.el('i', '', brand);
      u.el('span', '', brand, 'Task Center');
      const nav = u.el('nav', 'nav', head);
      ['Home', 'Tasks', 'Settings'].forEach((s, i) => u.el('span', i === 1 ? 'on' : '', nav, s));
      const body = u.el('div', 'body', win);
      let display = ctx.display || 'header';
      if ((display === 'panel' && innerWidth < 1180) || (display === 'toast' && innerHeight < 700)) display = 'header';
      const note = u.el('div', 'instruction', body, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display !== 'header';
      u.el('div', 'label', body, 'Action Buttons');
      const center = u.el('section', 'center', body);
      const stage = u.el('div', 'stage', center);
      const endR = rng.fork('chrome/end'),
        collR = rng.fork('chrome/collide');
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
      const label = endR.bool(0.5) ? 'Submit' : String(endR.pick(labels));
      const placement = endR.pick(['footer', 'footer', 'footer', 'header', 'link', 'icon']);
      const collisionPool = labels.filter((x) => String(x).trim().toLowerCase() !== label.trim().toLowerCase());
      const collide = collR.bool(0.3) && collisionPool.length ? String(collR.pick(collisionPool)) : null;
      const notes = u.el('aside', 'notes', document.body);
      const nh = u.el('div', 'nh', notes);
      nh.innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M5 1h13l3 3v18H3V3q0-2 2-2Z M7 7h10 M7 11h10 M7 15h7 M7 18h5"/></svg><span>' +
        (display === 'panel' ? 'Task' : 'Notes') +
        '</span><svg class="x" viewBox="0 0 24 24"><path d="m2 2 20 20M22 2 2 22"/></svg>';
      if (display === 'panel') u.el('p', 'panel-instruction', notes, ctx.instruction);
      [
        'Read the instruction carefully.',
        'Identify the correct sequence.',
        ctx.finish ? 'Click the buttons on the left.' : 'Click the buttons on the left, then press ' + label + '.',
      ].forEach((s) => u.el('p', '', notes, s));
      notes.hidden = false;
      if (display === 'toast') u.el('div', 'toast-note', document.body, ctx.instruction);
      const decoyBtn = (parent, text, collides) => {
        const b = u.el('button', 'chrome-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
      };
      if (collide) decoyBtn(placement === 'header' ? head : notes, collide, true);
      let submit = null;
      const foot = u.el('footer', 'foot', win);
      if (!ctx.finish) {
        const link = placement === 'link';
        submit = u.el(
          link ? 'a' : 'button',
          placement === 'header'
            ? 'header-end'
            : link
              ? 'end-link'
              : placement === 'icon'
                ? 'submit end-icon'
                : 'submit',
          placement === 'header' ? head : foot,
          placement === 'icon' ? '✓' : label,
        );
        if (submit.tagName === 'BUTTON') submit.type = 'button';
        else submit.href = '#';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
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
