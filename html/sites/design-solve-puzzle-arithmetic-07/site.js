(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-arithmetic-07',
    'task': 'solve-puzzle',
    'scenario': 'arithmetic',
    'style': 'vista',
    'title': 'Practice Problems',
    'menu': 'File     Edit     View     Tools     Help',
    'note': 'Instructions',
    'layout': 'vista',
    'aside': 'Compute the value of the expression on the left.\n\nType your answer in the box.',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      const size = ctx.size || { width: innerWidth, height: innerHeight };
      let display = ctx.display;
      if (
        (display === 'panel' && (size.width < 1200 || size.height < 700)) ||
        (display === 'toast' && (size.width < 1200 || size.height < 700))
      )
        display = 'header';
      const er = ctx.rng.fork('chrome/end'),
        bank = ctx.content && ctx.content.END_LABELS,
        labels = (
          Array.isArray(bank) && bank.length
            ? bank
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"]
        ).map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)));
      let placement = 'form',
        endText = 'Submit';
      if (er.bool(0.5)) {
        placement = er.pick(['header', 'footer']);
        endText = er.pick(labels);
      }
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + display + ' end-' + placement;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      if (['vista', 'mint', 'qt', 'dark', 'electron', 'motif', 'human', 'beos', 'gtk', 'eink'].includes(C.style)) {
        const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
        u.svg(
          'rect',
          { x: 3, y: 2, width: 20, height: 22, rx: 3, fill: '#e6f3fb', stroke: '#5d7891', 'stroke-width': 1.5 },
          icon,
        );
        u.svg(
          'path',
          { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: '#365a78', 'stroke-width': 1.5 },
          icon,
        );
      }
      u.el('span', '', top, C.title);
      if (['vista', 'qt', 'dark', 'electron', 'motif', 'human', 'gtk', 'eink'].includes(C.style)) {
        const wc = u.el('div', 'native-window-controls', top);
        for (const kind of ['min', 'max', 'close']) {
          const btn = u.el('button', 'window-' + kind, wc);
          btn.type = 'button';
          const svg = u.svg(
            'svg',
            { width: kind === 'close' ? 20 : 16, height: 16, viewBox: '0 0 20 16', 'aria-hidden': 'true' },
            btn,
          );
          if (kind === 'min')
            u.svg('path', { d: 'M3 12h14', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, svg);
          else if (kind === 'max')
            u.svg(
              'rect',
              { x: 4, y: 2, width: 12, height: 12, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 },
              svg,
            );
          else
            u.svg('path', { d: 'M4 3l12 10M16 3L4 13', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, svg);
        }
      }
      if (C.menu) u.el('nav', 'menu', top, C.menu);
      const center = u.el('div', 'center', app),
        docTitle = u.el('div', 'document-title', center, 'Math Practice');
      const brief = u.el('div', 'brief', center, display === 'header' ? ctx.instruction : '');
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      const asideHead = u.el('b', '', aside, C.note),
        asideCopy = u.el('p', 'aside-copy', aside, display === 'panel' ? ctx.instruction : C.aside);
      if (display === 'hidden' || display === 'toast') {
        asideHead.hidden = true;
        asideCopy.hidden = true;
      }
      u.el('b', 'notes-title', aside, 'Notes');
      u.el('p', 'notes-copy', aside, 'Use the standard order of operations.');
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit', footer, endText);
        submit.type = 'button';
        submit.setAttribute('aria-label', endText);
        submit.title = endText;
        submit.addEventListener('click', ctx.submit);
        if (placement === 'header' || placement === 'footer') submit.classList.add('episode-' + placement);
      }
      if (!ctx.finish) {
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const choices = [...new Set(labels.filter((x) => x.trim().toLowerCase() !== endText.trim().toLowerCase()))];
          if (choices.length) {
            const coll = cr.pick(choices),
              where =
                placement === 'header' ? 'footer' : placement === 'footer' ? 'header' : cr.pick(['header', 'footer']),
              d = u.el('button', 'episode-xtra pq-' + where, app, coll);
            d.type = 'button';
            d.addEventListener('click', () => env.log('decoy', { label: coll, collide: true }));
          }
        }
      }
      if (display === 'toast') {
        const note = u.el('div', 'episode-note', document.body);
        u.el('b', '', note, C.note);
        u.el('p', '', note, ctx.instruction);
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
