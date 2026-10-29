(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-grid-04',
    'task': 'read-figure',
    'scenario': 'grid',
    'style': 'nextstep',
    'title': 'Coordinate Practice',
    'menu': '',
    'note': 'Click a point on the grid to select it.',
    'layout': 'operational-stack',
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
        top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 30, height: 30, viewBox: '0 0 30 30', class: 'title-icon' }, top);
      u.svg(
        'rect',
        { x: 3, y: 3, width: 24, height: 24, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 },
        icon,
      );
      u.svg(
        'path',
        { d: 'M8 8h14v14H8z M11 11h8v8h-8z', fill: 'none', stroke: 'currentColor', 'stroke-width': 1 },
        icon,
      );
      u.el('span', '', top, C.title);
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide'),
        labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS)
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabels = labels.map(labelOf);
      const label = endR.bool(0.5) ? 'Submit' : endR.pick(endLabels.filter((x) => x.toLowerCase() !== 'submit'));
      const placement = ctx.finish ? null : endR.pick(['footer', 'footer', 'header', 'link']);
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const pool = [...new Set(endLabels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) collide = collideR.pick(pool);
      }
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 32, height: 32, viewBox: '0 0 32 32' }, wc);
        u.svg(
          'rect',
          { x: 2, y: 2, width: 28, height: 28, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 },
          svg,
        );
        u.svg(
          'path',
          {
            d: kind === 'min' ? 'M7 20h18' : kind === 'max' ? 'M8 8h16v16H8z' : 'M8 8l16 16M24 8L8 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': 2,
          },
          svg,
        );
      }
      const center = u.el('div', 'center', app),
        brief = u.el(
          'div',
          'brief ' + (ctx.display !== 'header' ? 'is-hidden' : ''),
          center,
          ctx.display === 'header' ? ctx.instruction : '',
        );
      const stage = u.el('section', 'stage', center);
      const footer = u.el('footer', 'bottom', app),
        aside = u.el('aside', 'aside bottom-note mode-' + ctx.display, footer);
      if (ctx.display === 'panel') u.el('b', 'note-heading', aside, 'Task Inspector');
      if (ctx.display === 'panel' || ctx.display === 'toast') u.el('p', 'episode-instruction', aside, ctx.instruction);
      u.el('p', 'aside-copy', aside, C.note);
      let submit = null;
      const addDecoy = (parent, text, collides) => {
        const b = u.el('button', collides ? 'chrome-xtra pq-xtra' : 'chrome-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      const makeEnd = (parent, cls, text) => {
        const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (collide) {
        const parent = placement === 'header' ? top : footer;
        addDecoy(parent, collide, true);
      }
      if (!ctx.finish) {
        if (placement === 'footer') submit = makeEnd(footer, 'submit', label);
        else if (placement === 'header') submit = makeEnd(top, 'header-submit', label);
        else submit = makeEnd(footer, 'submit end-link', label + ' ›');
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
