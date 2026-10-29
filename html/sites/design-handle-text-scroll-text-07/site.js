(function () {
  'use strict';
  const cfg = { 'title': 'Read & Respond', 'theme': 'extranet', 'layout': 'board', 'tools': '' };
  env.site({
    name: 'design-handle-text-scroll-text-07',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      const endR = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const original = endR.bool(0.5);
      const placement = original ? 'footer' : endR.pick(['toolbar', 'link']);
      const label = original ? 'Submit' : endR.pick(endLabels.filter((x) => x !== 'Submit'));
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, cfg.title);
      u.el('div', 'sub', head, '');
      const who = u.el('div', 'who', head);
      who.textContent = 'Home   |   Help   |   Log Out';
      u.el('div', 'date', head, '');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      let display = ctx.display;
      if (
        (display === 'panel' && document.documentElement.clientWidth < 1260) ||
        (display === 'toast' && document.documentElement.clientHeight < 700)
      )
        display = 'header';
      center.dataset.display = display;
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center);
      u.el('footer', 'footer', shell);
      const clear = u.el('button', 'clear', work, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const input = stage.querySelector('.ut-input');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'submit end-' + placement,
          placement === 'link' ? head : work,
          label,
        );
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
      const collideR = ctx.rng.fork('chrome/collide');
      if (collideR.bool(0.3)) {
        const choices = endLabels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (choices.length) {
          const decoyLabel = collideR.pick(choices);
          const decoy = u.el(
            'button',
            'end-xtra' + (placement === 'toolbar' && !ctx.finish ? ' beside-end' : ''),
            work,
            decoyLabel,
          );
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
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
