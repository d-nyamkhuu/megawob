(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-greatest-06',
    'task': 'read-figure',
    'scenario': 'greatest',
    'style': 'directory',
    'title': 'Number Challenge',
    'menu': '',
    'note': 'Task',
    'layout': 'stagger',
    'subtitle': '',
    'aside': 'Look at all the numbers. Each card shows a single value. Choose the greatest one.',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      u.el('span', '', top, C.title);
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'panel' ? ctx.instruction : '');
      const stage = u.el('section', 'stage', center);
      if (ctx.display === 'header') u.el('div', 'header-instruction', stage, ctx.instruction);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      if (ctx.display === 'toast') u.el('div', 'instruction-note', document.body, ctx.instruction);
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          labels = (ctx.content && ctx.content.END_LABELS) || [
            'Submit',
            'Done',
            'Finish',
            'Continue',
            'Save',
            'OK',
            'Confirm',
            'Apply',
            'Complete',
            "I'm done",
          ];
        let placement = 'footer',
          label = 'Submit';
        if (!er.bool(0.5)) {
          placement = er.pick(['footer-mid', 'footer-mid', 'link', 'icon']);
          label = er.pick(labels);
          if (typeof label !== 'string') label = label.label || label.text || label.name || String(label);
        }
        const cls = 'submit submit-' + placement;
        if (placement === 'link') {
          submit = u.el('a', cls, footer, label + ' ›');
          submit.href = '#';
        } else submit = u.el('button', cls, footer, placement === 'icon' ? '✓' : label);
        submit.type = placement === 'link' ? undefined : 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const labels = (ctx.content && ctx.content.END_LABELS) || [
            'Submit',
            'Done',
            'Finish',
            'Continue',
            'Save',
            'OK',
            'Confirm',
            'Apply',
            'Complete',
            "I'm done",
          ],
          own =
            submit &&
            (submit.getAttribute('aria-label') || submit.textContent).replace(/\s*›$/, '').trim().toLowerCase(),
          pool = labels
            .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
            .filter((x) => x.trim().toLowerCase() !== own);
        if (pool.length) {
          const text = cr.pick(pool),
            d = u.el(
              'button',
              'chrome-xtra chrome-xtra-' +
                (submit && (submit.classList.contains('submit-footer') || submit.classList.contains('submit-link'))
                  ? 'left'
                  : 'right'),
              footer,
              text,
            );
          d.type = 'button';
          d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
