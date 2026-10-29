(function () {
  'use strict';
  env.site({
    name: 'design-click-control-menu-06',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref plain94';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const brand = u.el('div', 'brand', head);
      u.el('div', 'brand-name', brand, 'Acme Office');
      u.el('div', 'brand-sub', brand, 'Document Manager');
      const nav = u.el('nav', 'topnav', head);
      ['Home', 'Documents', 'Menu', 'About'].forEach((t, i) => {
        if (i) u.el('span', 'sep', nav, '|');
        const a = u.el('a', '', nav, t);
        a.addEventListener('click', () => env.log('decoy', { label: t, what: 'nav' }));
      });
      const note = u.el('div', 'instruction', shell, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const work = u.el('div', 'work', shell);
      const stage = u.el('div', 'stage', work);
      if (ctx.display === 'panel') {
        work.classList.add('with-panel');
        work.append(note);
      }
      const foot = u.el('footer', 'footer', shell);
      ['Open', 'Delete', 'Rename'].forEach((t) => {
        const b = u.el('button', 'plainbtn', foot, t);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: t }));
      });
      u.el('span', 'spacer', foot);
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const er = ctx.rng.fork('chrome/end');
      const usual = er.bool(0.5);
      const placement = usual ? 'footer' : er.pick(['header', 'link']);
      const label = usual ? 'Submit' : er.pick(labels);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          placement === 'link' ? 'submit endlink' : 'submit plainbtn',
          placement === 'header' ? head : foot,
          label,
        );
        if (placement === 'header') head.classList.add('with-end');
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
        const options = labels.filter((t) => t.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = cr.pick(options);
          const decoy = u.el('button', 'plainbtn end-xtra', foot, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          foot.insertBefore(decoy, foot.querySelector('.spacer'));
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
