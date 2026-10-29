(function () {
  'use strict';
  const C = {
    site: 'design-solve-puzzle-guess-09',
    task: 'solve-puzzle',
    scenario: 'guess',
    style: 'dark',
    title: 'Number Guessing Game',
    menu: 'Game Options Help',
    note: '',
    layout: 'horizontal',
    subtitle: '',
    aside: '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      const W = (ctx.size && ctx.size.width) || 1280,
        H = (ctx.size && ctx.size.height) || 720;
      let display = ctx.display || 'header';
      if ((display === 'panel' && W < 1260) || (display === 'toast' && H < 700)) display = 'header';
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app),
        icon = u.svg('svg', { width: 32, height: 32, viewBox: '0 0 32 32', class: 'title-icon' }, top);
      u.svg('circle', { cx: 16, cy: 16, r: 14, fill: '#fff4c8', stroke: '#154eae', 'stroke-width': 2 }, icon);
      u.svg('text', { x: 3, y: 14, fill: '#154eae', 'font-size': 11, 'font-weight': 700 }, icon).textContent = '1 2';
      u.svg('text', { x: 11, y: 26, fill: '#154eae', 'font-size': 11, 'font-weight': 700 }, icon).textContent = '43';
      u.el('span', '', top, C.title);
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg(
          'path',
          {
            d: kind === 'min' ? 'M3 13h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': 2,
          },
          svg,
        );
      }
      const menu = u.el('nav', 'menu', top);
      ['Game', 'Options', 'Help'].forEach((x) => u.el('span', '', menu, x));
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center),
        overview = u.el('div', 'overview-heading', brief, 'Overview');
      const copy = u.el('div', 'overview-copy', brief);
      u.el('span', 'overview-star', copy, '★');
      u.el('div', 'instruction-copy', copy, display === 'hidden' ? '' : ctx.instruction);
      const stats = u.el('div', 'overview-stats', copy);
      u.el('div', 'info-icon', stats, 'i');
      u.el('div', '', stats, 'Number range:');
      u.el('b', 'range-value', stats, '');
      u.el('div', '', stats, 'Total guesses:');
      u.el('b', 'budget-value', stats, '');
      u.el('div', '', stats, 'Guesses used:');
      u.el('b', 'used-value', stats, '0');
      u.el('div', '', stats, 'Guesses remaining:');
      u.el('b', 'remaining-value', stats, '');
      const stage = u.el('section', 'stage', center),
        aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          keepDefault = er.bool(0.5),
          labels = (
            (ctx.content && ctx.content.END_LABELS) || [
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
            ]
          ).map((x) => String(typeof x === 'string' ? x : x.label || x.text || x.name || x)),
          label = keepDefault ? 'Submit' : String(er.pick(labels)),
          placement = keepDefault ? 'footer' : er.pick(['footer', 'menu', 'overview']);
        const cr = ctx.rng.fork('chrome/collide');
        let collision = null;
        if (cr.bool(0.3)) {
          const choices = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (choices.length) collision = cr.pick(choices);
        }
        const end = (parent, cls, text) => {
          const b = u.el('button', cls, parent, text);
          b.type = 'button';
          b.title = label;
          b.setAttribute('aria-label', label);
          b.addEventListener('click', ctx.submit);
          return b;
        };
        if (collision) {
          const d = u.el('button', 'xp-end-xtra', menu, collision);
          d.type = 'button';
          d.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
        }
        if (placement === 'footer') submit = end(footer, 'submit xp-end-footer', label);
        // The overview is absent when instructions are hidden; keep its end control visible.
        else if (placement === 'menu' || display === 'hidden') submit = end(menu, 'submit xp-end-menu', label);
        else submit = end(overview, 'submit xp-end-overview', label);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
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
