(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-shades-03',
    'task': 'read-figure',
    'scenario': 'shades',
    'style': 'pastel',
    'title': 'Pattern Practice',
    'menu': '',
    'note': '',
    'layout': 'strip',
    'subtitle': '',
    'aside':
      'Quick Notes:\n\n1. Count the blocks in each group.\n2. Add the two numbers.\n3. Type the total into the textbox.',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide'),
        endWords = (ctx.content && ctx.content.END_LABELS) || [
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
        labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      let endPlacement = 'footer',
        endLabel = 'Submit';
      if (!ctx.finish && !endR.bool(0.5)) {
        endPlacement = endR.pick(['header', 'link']);
        const other = endWords.map(labelText).filter((x) => x.trim().toLowerCase() !== 'submit');
        endLabel = other.length ? endR.pick(other) : 'Done';
      }
      let collision = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const pool = [
          ...new Set(endWords.map(labelText).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
        ];
        if (pool.length) collision = { label: collideR.pick(pool), where: collideR.pick(['header', 'footer']) };
      }
      let submit = null;
      const uel = (tag, cls, parent, text) => u.el(tag, cls, parent, text),
        app = uel('main', 'app', document.body),
        top = uel('header', 'top', app);
      if (true) {
        const icon = u.svg('svg', { width: 30, height: 30, viewBox: '0 0 30 30', class: 'title-icon' }, top);
        u.svg('rect', { x: 0, y: 0, width: 30, height: 30, rx: 6, fill: '#7c5cf0', stroke: 'none' }, icon);
        [
          [5, 5],
          [17, 5],
          [5, 17],
          [17, 17],
        ].forEach((p) => u.svg('rect', { x: p[0], y: p[1], width: 8, height: 8, rx: 2.6, fill: '#fff' }, icon));
      }
      uel('span', '', top, C.title);
      const makeEnd = (parent, cls, text) => {
        const b = uel(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const decoy = (parent, label) => {
        const b = uel('button', 'chrome-xtra', parent, label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        return b;
      };
      if (endPlacement === 'header' && !ctx.finish) submit = makeEnd(top, 'header-end', endLabel);
      if (collision && collision.where === 'header') decoy(top, collision.label);
      if (true) {
        const wc = uel('div', 'native-window-controls', top);
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
      if (C.subtitle) uel('small', '', top, C.subtitle);
      if (C.menu) uel('nav', 'menu', top, C.menu);
      const center = uel('div', 'center', app),
        brief = uel('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      if (ctx.display === 'panel')
        brief.insertBefore(uel('div', 'panel-caption', brief, 'Practice instruction'), brief.firstChild);
      if (ctx.display === 'toast') brief.classList.add('instruction-toast');
      const stage = uel('section', 'stage', center);
      const aside = uel('aside', 'aside', document.body);
      uel('b', '', aside, C.note);
      uel('p', 'aside-copy', aside, C.aside);
      if (ctx.display !== 'hidden')
        uel('div', 'sub', brief, 'Click all tiles that are shades of the requested color. Do not select other colors.');
      const footer = uel('footer', 'bottom', app);
      const rs = uel('button', 'ghost reset', footer);
      rs.type = 'button';
      const resetIcon = u.svg('svg', { width: 28, height: 28, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, rs);
      u.svg(
        'path',
        {
          d: 'M24 11A10 10 0 1 0 24 18M24 4v7h-7',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 2,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
        resetIcon,
      );
      uel('span', '', rs, 'Reset');
      rs.addEventListener('click', () => env.log('decoy', { label: 'Reset' }));
      uel('span', 'grow', footer);
      const sk = uel('button', 'ghost skip', footer, 'Skip');
      sk.type = 'button';
      sk.addEventListener('click', () => env.log('decoy', { label: 'Skip' }));
      if (collision && collision.where === 'footer') decoy(footer, collision.label);
      if (!ctx.finish && endPlacement === 'footer') submit = makeEnd(footer, 'submit', endLabel);
      if (!ctx.finish && endPlacement === 'link') submit = makeEnd(footer, 'end-link', endLabel + ' ›');
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
