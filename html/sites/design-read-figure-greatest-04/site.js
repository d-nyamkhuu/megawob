(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-greatest-04',
    'task': 'read-figure',
    'scenario': 'greatest',
    'style': 'directory',
    'title': 'MindLab',
    'menu': 'Practice     Tasks     Progress',
    'note': 'Instructions',
    'layout': 'stagger',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      let placement = null,
        label = 'Submit';
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        placement = er.pick(['footer', 'footer', 'footer', 'header', 'margin']);
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
        ];
        label = er.bool(0.5) ? 'Submit' : String(er.pick(labels));
      }
      document.body.className =
        C.style + ' ' + C.layout + ' instruction-' + ctx.display + (placement ? ' end-' + placement : ' finish-mode');
      if (C.site === 'design-read-figure-greatest-04') {
        const icon = u.svg('svg', { width: 84, height: 42, viewBox: '0 0 84 42', class: 'title-icon' }, top);
        u.svg('circle', { cx: 19, cy: 21, r: 17, fill: '#e32636' }, icon);
        u.svg('rect', { x: 44, y: 4, width: 38, height: 34, fill: '#080b0c' }, icon);
      } else if (['mint', 'qt', 'dark', 'electron', 'motif', 'human', 'beos', 'gtk', 'eink'].includes(C.style)) {
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
      let submit = null;
      if (placement === 'header') submit = makeEnd(top, 'submit header-submit');
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      if (ctx.display === 'toast') brief.classList.add('episode-toast');
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      if (C.site === 'design-read-figure-greatest-04') {
        u.el('h2', '', aside, 'Instructions');
        if (ctx.display === 'panel') u.el('div', 'episode-panel-note', aside, ctx.instruction);
        const steps = u.el('ol', 'margin-steps', aside);
        ['Look at the numbers on the cards.', 'Click the card with the greatest number.'].forEach(
          (x) => u.el('li', '', steps, x),
        );
        u.el('h2', 'notes-heading', aside, 'Notes');
        const notes = u.el('ul', 'margin-notes', aside);
        ['Numbers may be positive or negative.', 'Select one card only.', 'The card is not selected yet.'].forEach(
          (x) => u.el('li', '', notes, x),
        );
      } else {
        u.el('b', '', aside, C.note);
        u.el('p', 'aside-copy', aside, C.aside);
      }
      if (placement === 'margin') submit = makeEnd(aside, 'submit margin-submit');
      const footer = u.el('footer', 'bottom', app);
      if (!ctx.finish && placement === 'footer') submit = makeEnd(footer, 'submit');
      const cr = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && cr.bool(0.3)) {
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
        ];
        const collides = Array.from(ends, String).filter((x) => x.toLowerCase() !== label.toLowerCase());
        if (collides.length) {
          const d = u.el('button', 'end-xtra', top, cr.pick(collides));
          d.type = 'button';
          d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
        }
      }
      return { stage, submit };
      function makeEnd(parent, cls) {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.addEventListener('click', ctx.submit);
        return b;
      }
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
