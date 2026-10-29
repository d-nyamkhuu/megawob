(function () {
  'use strict';
  env.site({
    name: 'design-handle-text-unicode-04',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref memphis';
      const shell = u.el('main', 'shell', document.body);
      const work = u.el('div', 'work', shell);
      const briefing = u.el('aside', 'briefing', work);
      u.el('h1', 'quick-title', briefing, 'Quick Task');
      const note = u.el('div', 'instruction', briefing, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'panel') note.classList.add('episode-panel');
      if (ctx.display === 'toast') note.classList.add('episode-toast');
      u.el('i', 'coral-rule', briefing);
      u.el('div', 'squiggle', briefing, '〜');
      const center = u.el('section', 'center', work);
      const stage = u.el('div', 'stage', center);
      const footer = u.el('footer', 'footer', shell);
      const tip = (cls, svg, html) => {
        const item = u.el('section', 'tip ' + cls, footer);
        const icon = u.el('div', 'tip-icon', item);
        icon.innerHTML = svg;
        const copy = u.el('div', 'tip-copy', item);
        copy.innerHTML = html;
      };
      tip(
        'keyboard',
        '<svg viewBox="0 0 64 44" aria-hidden="true"><rect x="3" y="3" width="58" height="38" rx="4"/><path d="M10 11h5v5h-5zm10 0h5v5h-5zm10 0h5v5h-5zm10 0h5v5h-5zm10 0h4v5h-4zM10 21h5v5h-5zm10 0h5v5h-5zm10 0h5v5h-5zm10 0h5v5h-5zm10 0h4v5h-4zM12 31h39"/></svg>',
        'Type or paste<br>the text',
      );
      tip(
        'mouse',
        '<svg viewBox="0 0 48 64" aria-hidden="true"><path d="M24 3C12 3 5 12 5 25v14c0 13 7 22 19 22s19-9 19-22V25C43 12 36 3 24 3Z"/><path d="M24 4v22"/><path class="coral-stroke" d="m42 7 4-7m2 14 8-3"/></svg>',
        'You can also use<br>your mouse',
      );
      tip(
        'wheel',
        '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M26 3C14 3 8 12 8 25v14c0 13 6 22 18 22s18-9 18-22V25C44 12 38 3 26 3Z"/><path d="M26 4v22M52 18l7 7 7-7M52 47l7-7 7 7"/></svg>',
        'Use the scroll wheel<br>if needed',
      );
      const action = u.el('div', 'action-cell episode-action', footer);
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        let labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS)
            ? ctx.content.END_LABELS.slice()
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        labels = labels.map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)));
        if (!labels.length) labels = ['Submit', 'Done', 'Finish'];
        const common = labels.find((x) => x.trim().toLowerCase() === 'submit') || labels[0];
        const alternatives = labels.filter((x) => x.trim().toLowerCase() !== common.trim().toLowerCase());
        const label = er.bool(0.5)
          ? common
          : alternatives.length
            ? alternatives[er.int(0, alternatives.length - 1)]
            : common;
        const placement = er.pick(['button', 'button', 'link', 'icon']);
        const cr = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (cr.bool(0.3)) {
          const choices = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (choices.length) collide = choices[cr.int(0, choices.length - 1)];
        }
        if (collide) {
          const decoy = u.el('button', 'memphis-pq', action, collide);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
        }
        const cls =
          placement === 'link' ? 'memphis-end-link' : placement === 'icon' ? 'memphis-end-icon' : 'memphis-submit';
        const text = placement === 'icon' ? '✓' : placement === 'link' ? String(label) + ' ›' : String(label);
        submit = u.el(placement === 'link' ? 'a' : 'button', cls, action, text);
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        if (placement === 'icon') {
          submit.setAttribute('aria-label', String(label));
          submit.title = String(label);
        }
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
