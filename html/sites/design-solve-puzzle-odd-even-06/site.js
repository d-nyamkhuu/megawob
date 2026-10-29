(function () {
  'use strict';
  const C = {
    site: 'design-solve-puzzle-odd-even-06',
    task: 'solve-puzzle',
    scenario: 'odd-even',
    style: 'riso',
    title: 'Number Classifier',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'riso wooden instruction-' + ctx.display + (ctx.finish ? ' finish-mode' : '');
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      u.el('span', '', top, C.title);
      const wc = u.el('div', 'native-window-controls', top);
      for (const [kind, label] of [
        ['min', '−'],
        ['max', '□'],
        ['close', '×'],
      ]) {
        const b = u.el('span', 'window-control ' + kind, wc, label);
      }
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction),
        stage = u.el('section', 'stage', center),
        footer = u.el('footer', 'bottom', app);
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name),
        labels = ctx.content.END_LABELS.map(labelOf);
      const original = er.bool(0.5),
        placement = original ? 'footer' : er.pick(['toolbar', 'link']),
        label = original ? 'Submit' : er.pick(labels);
      document.body.classList.add('end-' + placement);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          'button',
          'submit' + (placement === 'link' ? ' end-link' : ''),
          placement === 'toolbar' ? top : footer,
          label,
        );
        submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.dataset.role = 'submit';
        submit.addEventListener('click', ctx.submit);
        if (cr.bool(0.3)) {
          const choices = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (choices.length) {
            const text = cr.pick(choices),
              decoy = u.el('button', 'chrome-xtra', placement === 'toolbar' ? footer : top, text);
            decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
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
