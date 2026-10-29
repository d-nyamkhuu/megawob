(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-arithmetic-02',
    'task': 'solve-puzzle',
    'scenario': 'arithmetic',
    'style': 'gnome',
    'title': 'Math Practice',
    'menu': 'File     Edit     View     Help',
    'note': 'Instructions',
    'layout': 'twin-pane',
    'subtitle': '',
    'aside':
      '1.   Look at the arithmetic expression\n      on the left.\n2.   Type your answer in the box.',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      if (['mint', 'qt', 'dark', 'electron', 'motif', 'human', 'beos', 'gtk', 'eink', 'gnome'].includes(C.style)) {
        const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
        u.svg('circle', { cx: 13, cy: 13, r: 11, fill: '#d9c9b2', stroke: '#776754', 'stroke-width': 1.4 }, icon);
        u.svg(
          'path',
          { d: 'M7 13h12M10 8l6 10M16 8l-6 10', fill: 'none', stroke: '#665846', 'stroke-width': 1.3 },
          icon,
        );
      }
      u.el('span', '', top, C.title);
      if (['qt', 'dark', 'electron', 'motif', 'human', 'gtk', 'eink', 'gnome'].includes(C.style)) {
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
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el(
        'p',
        'aside-copy',
        aside,
        ctx.display === 'panel' ? ctx.instruction : ctx.display === 'header' ? C.aside : '',
      );
      const footer = u.el('footer', 'bottom', app);
      const ends = (ctx.content && ctx.content.END_LABELS) || [
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
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const er = ctx.rng.fork('chrome/end'),
        common = er.bool(0.5),
        label = common ? 'Submit' : labelOf(er.pick(ends)),
        place = common ? 'form' : er.pick(['header', 'shelf']);
      let submit = null;
      const mk = (parent, cls, text, isSubmit) => {
        const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          if (isSubmit) ctx.submit();
          else env.log('decoy', { label: text, collide: ends.map(labelOf).includes(text) });
        });
        return b;
      };
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const options = [
          ...new Set(ends.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (options.length) collide = labelOf(collideR.pick(options));
      }
      const toolbar = u.el('div', 'chrome-tools', top);
      if (collide) mk(toolbar, 'chrome-xtra', collide, false);
      if (!ctx.finish && place === 'header') submit = mk(toolbar, 'submit chrome-end chrome-place-header', label, true);
      if (ctx.display === 'toast' && ctx.display !== 'hidden') {
        const toast = u.el('div', 'gnome-note', app, ctx.instruction);
        toast.setAttribute('aria-label', 'Task instructions');
      }
      if (!ctx.finish && place === 'form') submit = mk(footer, 'submit chrome-end chrome-place-form', label, true);
      else if (!ctx.finish && place === 'shelf')
        submit = mk(footer, 'submit chrome-end chrome-place-shelf', label, true);
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
