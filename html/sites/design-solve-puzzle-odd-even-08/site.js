(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-odd-even-08',
    'task': 'solve-puzzle',
    'scenario': 'odd-even',
    'style': 'riso',
    'title': 'Number Sort',
    'menu': 'HOME    PRACTICE    HELP',
    'note': 'Practice Builds Confidence',
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
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      const art = u.el('div', 'footer-art', footer),
        trees = u.el('img', '', art);
      trees.src = 'sites/' + C.site + '/assets/footer-trees.webp';
      trees.alt = '';
      u.el('div', 'footer-tagline', footer, 'A BRIGHTER\nTOMORROW\nADDS UP');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endR = ctx.rng.fork('chrome/end'),
        endLabels = ctx.content.END_LABELS.map(labelOf),
        original = endR.bool(0.5),
        placement = original ? 'footer' : endR.pick(['header', 'link']),
        endLabel = original ? 'Submit' : endR.pick(endLabels);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit end-' + placement, placement === 'header' ? center : footer, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        if (placement === 'link') footer.classList.add('end-link-dock');
        submit.addEventListener('click', ctx.submit);
      }
      const collideR = ctx.rng.fork('chrome/collide');
      if (collideR.bool(0.3)) {
        const other = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (other.length) {
          const label = collideR.pick(other),
            decoy = u.el(
              'button',
              'chrome-xtra' + (placement === 'header' && !ctx.finish ? ' xtra-footer' : ''),
              center,
              label,
            );
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
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
