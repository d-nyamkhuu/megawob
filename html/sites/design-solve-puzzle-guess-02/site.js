(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-guess-02',
    'task': 'solve-puzzle',
    'scenario': 'guess',
    'style': 'lisa',
    'title': 'Number Guess',
    'menu': 'File     Edit     Document     Special     Help',
    'note': 'How to Play',
    'layout': 'document',
    'subtitle': '',
    'aside':
      '1. Enter a whole number\n   from the allowed range.\n2. Click the Guess button.\n3. Read the hint (higher\n   or lower).\n4. You have 7 guesses total.\n\nAction Notes\n• Use the hints to narrow\n  the range.\n• The number is within the allowed range.\n• You can guess up to 7 times.',
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
      const cut = C.aside.indexOf('Action Notes');
      u.el('p', 'aside-copy', aside, cut < 0 ? C.aside : C.aside.slice(0, cut).trim());
      if (cut >= 0) {
        u.el('b', 'aside-subhead', aside, 'Action Notes');
        u.el('p', 'aside-actions', aside, C.aside.slice(cut + 12).trim());
      } // Forks leave all existing task and frame draws unchanged.
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = (
        ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map(labelOf);
      const referenceEnd = er.bool(0.5),
        placement = referenceEnd ? 'margin' : er.pick(['toolbar', 'link']);
      const label = referenceEnd ? 'Submit' : er.pick(endLabels.filter((x) => x !== 'Submit'));
      document.body.classList.add('end-' + placement);
      if (ctx.finish) document.body.classList.add('finish-mode');
      // Keep the margin control above the separate, fixed margin-notes layer.
      const footer = u.el('footer', 'bottom end-' + placement, document.body);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit' + (placement === 'link' ? ' end-link' : ''), footer, label);
        submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', ctx.submit);
      }
      if (cr.bool(0.3)) {
        const options = endLabels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const decoyLabel = cr.pick(options),
            decoy = u.el('button', 'chrome-xtra', document.body, decoyLabel);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
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
