(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-odd-even-05',
    'task': 'solve-puzzle',
    'scenario': 'odd-even',
    'style': 'riso',
    'title': 'Number Practice',
    'menu': 'My Work',
    'note': 'A few notes:',
    'layout': 'horizontal',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide'),
        labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name),
        endWords = ctx.content.END_LABELS.map(labelOf),
        referenceEnd = er.bool(0.5),
        endForm = referenceEnd ? 'reference' : er.pick(['toolbar', 'link']),
        endLabel = referenceEnd ? 'Submit' : er.pick(endWords.filter((x) => x !== 'Submit'));
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
      const mountain = u.el('img', 'mountain-art', top);
      mountain.src = 'sites/' + C.site + '/assets/mountain-sun.webp';
      mountain.alt = '';
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      const notes = u.el('div', 'aside-copy', aside);
      [
        'Choose Odd if the number is not divisible by 2.',
        'Choose Even if the number is divisible by 2.',
        'Select one option for every number.',
        ctx.finish ? 'Finish when every number has an answer.' : 'Then use ' + endLabel + ' to finish.',
      ].forEach((t) => u.el('p', 'note-item', notes, t));
      u.el('div', 'aside-quote', aside, 'Small steps\nbuild big progress.');
      if (ctx.display === 'hidden') brief.remove();
      else if (ctx.display === 'panel' || ctx.display === 'toast') {
        aside.insertBefore(brief, notes);
        brief.classList.add('margin-instruction');
      }
      const footer = u.el('footer', 'bottom', app);
      const art = u.el('div', 'footer-art', footer),
        trees = u.el('img', '', art);
      trees.src = 'sites/' + C.site + '/assets/footer-trees.webp';
      trees.alt = '';
      u.el('div', 'footer-tagline', footer, 'A BRIGHTER\nTOMORROW\nADDS UP');
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(endForm === 'link' ? 'a' : 'button', 'submit end-' + endForm, app, endLabel);
        if (endForm === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (cr.bool(0.3)) {
        const options = endWords.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = cr.pick(options),
            decoy = u.el('button', 'end-xtra', app, label);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
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
