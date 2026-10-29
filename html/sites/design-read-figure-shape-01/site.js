(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-shape-01',
    'task': 'read-figure',
    'scenario': 'shape',
    'style': 'swiss',
    'title': 'Task 01',
    'menu': 'Play    Instructions    Settings    Help',
    'note': 'Task Guide',
    'layout': 'stagger',
    'subtitle': '',
    'aside': '02\n\nWhat to do\n\n1. Look at the shapes and letters.\n2. Read the task.\n3. Click on it.',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      if (['mint', 'qt', 'dark', 'electron', 'motif', 'human', 'beos', 'gtk', 'eink'].includes(C.style)) {
        const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
        u.svg(
          'rect',
          {
            x: 3,
            y: 2,
            width: 20,
            height: 22,
            rx: C.style === 'mint' ? 0 : 3,
            fill:
              C.style === 'mint'
                ? 'none'
                : C.style === 'dark'
                  ? '#8266ce'
                  : C.style === 'electron'
                    ? '#ee8520'
                    : '#d7e2e8',
            stroke: 'currentColor',
            'stroke-width': 1.5,
          },
          icon,
        );
        u.svg(
          'path',
          { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 },
          icon,
        );
      }
      u.el('span', '', top, C.title);
      if (['qt', 'dark', 'electron', 'motif', 'human', 'gtk', 'eink'].includes(C.style)) {
        const wc = u.el('div', 'native-window-controls', top);
        for (const kind of ['min', 'max', 'close']) {
          const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
          u.svg(
            'path',
            {
              d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
              fill: 'none',
              stroke: 'currentColor',
              'stroke-width': 1.5,
            },
            svg,
          );
        }
      }
      if (C.subtitle) u.el('small', '', top, C.subtitle);
      if (C.menu) u.el('nav', 'menu', top, C.menu);
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      const asideCopy = u.el('p', 'aside-copy', aside, ctx.display === 'panel' ? ctx.instruction : C.aside);
      if (ctx.display === 'panel') aside.classList.add('episode-instruction');
      if (ctx.display === 'hidden') aside.classList.add('episode-hidden');
      if (ctx.display === 'toast') brief.classList.add('episode-toast');
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        const endRng = ctx.rng.fork('chrome/end'),
          labels = ctx.content.END_LABELS || [
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
          labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)),
          baseLabel = labels.find((x) => labelText(x).trim().toLowerCase() === 'submit') || 'Submit',
          alternatives = labels.filter((x) => labelText(x).trim().toLowerCase() !== 'submit');
        let label, placement;
        if (endRng.bool(0.5)) {
          label = labelText(baseLabel);
          placement = 'button';
        } else {
          label = labelText(endRng.pick(alternatives.length ? alternatives : labels));
          placement = endRng.pick(['link', 'icon']);
        }
        if (placement === 'link') {
          submit = u.el('a', 'submit-link', footer, label + ' ›');
          submit.href = '#';
          submit.setAttribute('aria-label', label);
          submit.title = label;
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        } else {
          const visual = placement === 'icon' ? '✓' : label;
          submit = u.el('button', 'submit' + (placement === 'icon' ? ' submit-icon' : ''), footer, visual);
          submit.type = 'button';
          if (placement === 'icon') {
            submit.setAttribute('aria-label', label);
            submit.title = label;
          }
          submit.addEventListener('click', ctx.submit);
        }
        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const own = label.toLowerCase(),
            options = labels.map(labelText).filter((x) => x.trim().toLowerCase() !== own);
          if (options.length) {
            const decoyLabel = labelText(collideRng.pick(options)),
              decoy = u.el('button', 'submit episode-xtra', footer, decoyLabel);
            decoy.type = 'button';
            decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
          }
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
