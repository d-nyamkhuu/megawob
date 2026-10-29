(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-guess-11',
    'task': 'solve-puzzle',
    'scenario': 'guess',
    'style': 'dark',
    'title': 'Number Quest',
    'menu': '',
    'note': 'Instructions',
    'layout': 'horizontal',
    'subtitle': '',
    'aside':
      '1. Enter a number in the allowed range.\n2. Click Guess to see if the hidden number is higher or lower.\n3. You have a limited number of guesses.',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    initialOverlay: { kind: 'cookie' },
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' fluent-notebook instruction-' + ctx.display;
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
        brief = u.el(
          'div',
          'brief',
          center,
          ctx.display === 'hidden' || ctx.display === 'panel' ? '' : ctx.instruction,
        );
      brief.classList.toggle('long-note', ctx.instruction.length > 90);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, ctx.display === 'panel' ? ctx.instruction : C.aside);
      let submit = null;
      const er = ctx.rng.fork('chrome/end'),
        placement = ctx.finish ? null : er.pick(['footer', 'footer', 'footer', 'header', 'aside']),
        bank =
          ctx.content && Array.isArray(ctx.content.END_LABELS)
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'],
        labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)),
        primary = bank.find((x) => labelOf(x).trim().toLowerCase() === 'submit') || bank[0],
        alternates = bank.filter((x) => x !== primary),
        label = labelOf((placement === 'footer' && er.bool(0.8)) || !alternates.length ? primary : er.pick(alternates));
      const makeEnd = (parent, cls, text) => {
        const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'footer') {
          const footer = u.el('footer', 'bottom', app);
          submit = makeEnd(footer, 'submit', label);
        } else if (placement === 'header') submit = makeEnd(top, 'end-header', label);
        else submit = makeEnd(aside, 'end-aside', label);
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && cr.bool(0.3)) {
        const own = label.trim().toLowerCase(),
          options = [...new Set(bank.map(labelOf))].filter((x) => x.trim().toLowerCase() !== own);
        if (options.length) {
          const text = cr.pick(options),
            parent = cr.bool(0.5) ? top : aside,
            decoy = u.el('button', 'end-xtra', parent, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      if (ctx.kind === 'cookie') {
        u.el('span', 'privacy-shield', el, '◈');
        const copy = u.el('div', 'consent-copy', el);
        u.el('b', 'consent-title', copy, 'We value your privacy');
        u.el(
          'p',
          '',
          copy,
          'We use optional cookies to improve your experience, understand how the app is used, and show relevant content. You can accept all cookies or reject optional ones. Required cookies are always active.',
        );
        u.el('a', 'learn-more', copy, 'Learn more');
        const actions = u.el('div', 'consent-actions', el);
        const dismiss = u.el('button', 'reject', actions, 'Reject optional');
        dismiss.addEventListener('click', ctx.dismiss);
        u.el('button', 'manage', actions, 'Manage settings').addEventListener('click', ctx.dismiss);
        u.el('button', 'accept', actions, 'Accept all').addEventListener('click', ctx.dismiss);
        return { el, dismiss };
      }
      const messages = {
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
