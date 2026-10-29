(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-tictactoe-09',
    'task': 'solve-puzzle',
    'scenario': 'tictactoe',
    'style': 'gem',
    'title': 'Tic-Tac-Toe',
    'menu': 'File    Edit    Options    Help',
    'note': '',
    'layout': 'horizontal',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        system = u.el('header', 'system', app),
        sysicon = u.svg('svg', { width: 30, height: 32, viewBox: '0 0 30 32' }, system);
      u.svg(
        'rect',
        { x: 5, y: 3, width: 20, height: 25, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 },
        sysicon,
      );
      u.svg(
        'path',
        { d: 'M9 9h12M9 13h12M9 17h12M9 21h8', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 },
        sysicon,
      );
      u.el('nav', 'menu', system, C.menu);
      u.el('span', 'clock', system, 'Mon Apr 6 1987   10:24 AM');
      const top = u.el('header', 'top', app),
        icon = u.svg('svg', { width: 38, height: 38, viewBox: '0 0 38 38', class: 'title-icon' }, top);
      u.svg(
        'rect',
        { x: 4, y: 4, width: 30, height: 30, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 },
        icon,
      );
      u.svg(
        'path',
        { d: 'M10 11h18v16H10z M13 15h12M13 19h12M13 23h8', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 },
        icon,
      );
      u.el('span', 'window-title', top, C.title);
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
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction),
        stage = u.el('section', 'stage', center),
        footer = u.el('footer', 'bottom', app);
      for (const [label, cls] of [
        ['↶　Undo', 'strip-action undo-action'],
        ['▣　Hint', 'strip-action hint-action'],
      ]) {
        const button = u.el('button', cls, footer, label);
        button.type = 'button';
      }
      let submit = null;
      const endR = ctx.rng.fork('chrome/end');
      let placement = null,
        label = null;
      if (!ctx.finish) {
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS)
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
        const submitLabel = labels.map(labelOf).find((x) => x.trim().toLowerCase() === 'submit') || 'Submit';
        if (endR.bool(0.5)) {
          placement = 'footer';
          label = submitLabel;
        } else {
          placement = endR.pick(['footer', 'header', 'link']);
          label = labelOf(endR.pick(labels));
        }
      }
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const pool =
          ctx.content && Array.isArray(ctx.content.END_LABELS)
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const words = pool
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
          .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (words.length) collide = collideR.pick(words);
      }
      const decoy = (parent, text) => {
        const b = u.el('button', 'end-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      const makeEnd = (parent, cls, text) => {
        const b = u.el(placement === 'link' ? 'a' : 'button', cls, parent, text);
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
      if (collide) decoy(top, collide);
      if (placement === 'footer') submit = makeEnd(footer, 'submit', label);
      else if (placement === 'header') submit = makeEnd(top, 'end-header', label);
      else if (placement === 'link') submit = makeEnd(footer, 'end-link', label + ' ›');
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
