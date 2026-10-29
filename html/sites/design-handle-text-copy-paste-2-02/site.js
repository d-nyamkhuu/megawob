(function () {
  'use strict';
  env.site({
    name: 'design-handle-text-copy-paste-2-02',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref risc utility-header-open-canvas';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const bar = u.el('div', 'risc-iconbar', head);
      u.el('span', 'raspberry', bar, '●');
      u.el('strong', 'os-name', bar, 'RISC OS');
      [
        ['▰', 'Files'],
        ['▤', 'Edit'],
        ['✎', 'Draw'],
        ['▦', 'Calc'],
        ['▤', 'Info'],
        ['⚙', 'Prefs'],
      ].forEach(([icon, label]) => {
        const item = u.el('div', 'icon-item', bar);
        u.el('span', 'icon-glyph', item, icon);
        u.el('span', '', item, label);
      });
      u.el('span', 'clock', bar, 'Mon 3 Apr 1989　10:24');
      const close = u.el('button', 'close-gadget', bar, '×');
      close.type = 'button';
      close.addEventListener('click', () => env.log('decoy', { label: 'Close' }));
      u.el('div', 'utility-title', shell, 'Text Copy Task');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center); // Episode controls use independent streams, preserving the task's seeded draws.
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const er = ctx.rng.fork('chrome/end');
      const classic = er.bool(0.5);
      const placement = classic ? 'corner' : er.pick(['title', 'link']);
      const label = classic ? 'Submit' : er.pick(labels);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(placement === 'link' ? 'a' : 'button', 'submit end-' + placement, work, label);
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = cr.pick(options);
          const decoy = u.el(
            'button',
            'end-xtra' + (!ctx.finish && placement === 'corner' ? ' xtra-left' : ''),
            work,
            text,
          );
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
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
