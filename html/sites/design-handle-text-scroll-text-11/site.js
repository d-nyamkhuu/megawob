(function () {
  'use strict';
  env.site({
    name: 'design-handle-text-scroll-text-11',
    initialOverlay: { kind: 'banner' },
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref academic';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, 'Riverton University Library');
      const nav = u.el('nav', 'tools', head);
      ['Home', 'Catalog', 'Digital Collections', 'Research Guides', 'Help'].forEach((s, i) => {
        if (i) u.el('span', 'nav-sep', nav, '|');
        const link = u.el('a', 'nav-link', nav, s);
        link.addEventListener('click', () => env.log('decoy', { label: s, what: 'navigation' }));
      });
      u.el('div', 'motto', head, 'A richer mind<br>for a brighter tomorrow.').innerHTML =
        'A richer mind<br>for a brighter tomorrow.';
      const work = u.el('main', 'work', shell);
      const center = u.el('section', 'center', work);
      u.el('h2', 'doc-title', center, 'Document: The Small Things');
      u.el('p', 'doc-sub', center, 'Read the text below and complete the task.');
      const note = u.el('div', 'instruction', shell, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      shell.dataset.instruction = ctx.display;
      shell.dataset.finish = String(ctx.finish);
      const stage = u.el('div', 'stage', center);
      const foot = u.el('footer', 'footer', shell);
      foot.appendChild(note);
      const endRng = ctx.rng.fork('chrome/end');
      const placement = endRng.pick(['form', 'form', 'toolbar', 'link']);
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const label = placement === 'form' ? 'Submit' : endRng.pick(labels);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'submit end-' + placement,
          placement === 'toolbar' ? nav : foot,
          label,
        );
        if (submit.tagName === 'BUTTON') submit.type = 'button';
        else submit.href = '#';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.dataset.role = 'submit';
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const others = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (others.length) {
          const decoyLabel = collideRng.pick(others);
          const decoy = u.el('button', 'xtra-end', nav, decoyLabel);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      if (ctx.initial) {
        const el = u.el('aside', 'perturb banner survey-drawer', document.body);
        const sh = u.el('div', 'survey-head', el);
        u.el('strong', '', sh, 'We value your feedback!');
        const close = u.el('button', 'survey-close', sh, 'Close survey');
        close.type = 'button';
        close.addEventListener('click', ctx.dismiss);
        u.el('p', 'survey-intro', el, 'Please take a quick survey (1 minute).');
        u.el('div', 'survey-question', el, '1. How satisfied are you with the library website?');
        ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied'].forEach((s) => {
          const r = u.el('div', 'survey-choice', el);
          r.innerHTML = '<i></i> ' + s;
        });
        u.el('div', 'survey-question', el, '2. What is your main reason for visiting today?');
        const sel = u.el('div', 'survey-select', el, 'Select an option...');
        u.el('b', '', sel, '▾');
        u.el('div', 'survey-question', el, '3. Additional comments (optional):');
        u.el('div', 'survey-textarea', el);
        return { el, dismiss: close };
      }
      const el = u.el('section', 'perturb ' + ctx.kind, document.body);
      u.el(
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
      u.el(
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
      const dismiss = u.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
