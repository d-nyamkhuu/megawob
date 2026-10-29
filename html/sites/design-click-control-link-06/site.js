(function () {
  'use strict';
  env.site({
    name: 'design-click-control-link-06',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref cedar';
      const roomy = document.documentElement.clientWidth >= 1260,
        tall = document.documentElement.clientHeight >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const brand = u.el('div', 'brand', head);
      brand.innerHTML =
        '<svg viewBox="0 0 64 44"><path fill="currentColor" stroke="none" d="M7 5Q20-1 31 7V37Q19 29 7 33Z M34 7Q46-1 57 5V33Q45 29 34 37Z"/><path d="M3 8v30q16-5 28 3h3q12-8 27-3V8 M38 10q7-3 15-2 M38 16q7-3 15-2 M38 22q7-3 15-2 M38 28q7-3 15-2"/><path stroke="#7b2437" d="M38 10q7-3 15-2 M38 16q7-3 15-2 M38 22q7-3 15-2 M38 28q7-3 15-2"/></svg>';
      u.el('span', '', brand, 'Cedar Notes');
      const nav = u.el('nav', 'topnav', head);
      ['Library', 'Collections', 'Help'].forEach((s) => u.el('span', '', nav, s));
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const note = u.el('div', 'instruction', center);
      const ico = u.el('span', 'cn-ico', note);
      ico.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 2v17l4.5-4 3 7 3-1.3-3-6.6H19Z"/></svg>';
      u.el('span', 'cn-text', note, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden' || display === 'panel';
      if (display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center);
      if (display === 'panel') {
        const panel = u.el('aside', 'instruction-panel', work);
        u.el('strong', '', panel, 'Reading note');
        u.el('div', '', panel, ctx.instruction);
      }
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const placement = er.pick(['corner', 'corner', 'corner', 'header', 'inline']);
        const bank = ctx.content && ctx.content.END_LABELS;
        const labels =
          bank && bank.length
            ? bank
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const isDefault = er.bool(0.5);
        const picked = isDefault
          ? 'Submit'
          : er.pick(
              labels.filter(
                (x) =>
                  (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)).trim().toLowerCase() !==
                  'submit',
              ),
            );
        const label =
          typeof picked === 'string' ? picked : picked.label || picked.text || picked.name || String(picked);
        const box = u.el('div', 'submitbox', placement === 'header' ? head : work);
        box.classList.add('submit-' + placement);
        const isLink = placement === 'inline';
        submit = u.el(isLink ? 'a' : 'button', 'submit', box, isLink ? label + ' ›' : label);
        if (isLink) submit.href = '#';
        else submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = labels
            .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
            .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const text = cr.pick(pool);
            const decoy = u.el('button', 'chrome-xtra', head, text);
            decoy.type = 'button';
            decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
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
