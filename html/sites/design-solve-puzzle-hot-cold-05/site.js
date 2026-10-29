(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-hot-cold-05',
    'task': 'solve-puzzle',
    'scenario': 'hot-cold',
    'style': 'human',
    'title': 'Hot Spot Finder',
    'menu': 'File    Edit    View    Help',
    'note': 'Notes',
    'layout': 'brief-left',
    'subtitle': '',
    'aside': 'Search the area in the main window.\nA previous click is shown for reference.',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className =
        C.style + ' ' + C.layout + ' instruction-' + ctx.display + (ctx.finish ? ' finish-mode' : '');
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
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
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
      ];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabels = labels.map(labelOf);
      const label = endRng.pick([
        ...Array(10).fill('Submit'),
        ...endLabels.filter((x) => x.toLowerCase() !== 'submit'),
      ]);
      const placement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'footer', 'header', 'link']);
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const options = [...new Set(endLabels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))];
        if (options.length) collide = collideRng.pick(options);
      }
      const center = u.el('div', 'center', app);
      if (ctx.display === 'header') u.el('div', 'brief', center, ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const aside = u.el(
        'aside',
        'aside ' + (ctx.display === 'panel' ? 'aside-panel' : '') + (ctx.display === 'toast' ? ' aside-toast' : ''),
        document.body,
      );
      u.el('b', '', aside, C.note);
      if (ctx.display === 'panel' || ctx.display === 'toast') {
        u.el('p', 'aside-copy mode-instruction', aside, ctx.instruction);
        u.el('p', 'aside-copy mode-detail', aside, C.aside);
      } else u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      const decoyBtn = (parent, text, collides) => {
        const b = u.el('button', 'xtra' + (collides ? ' xtra-pq' : ''), parent, text);
        b.type = 'button';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
      };
      if (collide) {
        const target = placement === 'header' ? top : footer;
        decoyBtn(target, collide, true);
      }
      let submit = null;
      const endBtn = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', ctx.submit);
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'header') {
          submit = endBtn(top, 'submit submit-header', label);
        } else if (placement === 'link') {
          submit = endBtn(footer, 'submit-link', label + ' ›');
        } else submit = endBtn(footer, 'submit', label);
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
