(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-identify-08',
    'task': 'read-figure',
    'scenario': 'identify',
    'style': 'maple',
    'title': '',
    'menu': '',
    'note': 'Shape Identification',
    'layout': 'brief-left',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css', 'maple.css'],
    frame(ctx) {
      document.body.className = 'maple instruction-' + ctx.display;
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide'),
        labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name),
        endLabels = ctx.content.END_LABELS.map(labelOf),
        referenceEnd = !endRng.bool(0.5),
        endPlacement = referenceEnd ? 'footer' : endRng.pick(['heading', 'margin']),
        endLabel = referenceEnd ? 'Submit' : endRng.pick(endLabels);
      const u = ctx.util,
        top = u.el('header', 'top', document.body);
      const emblem = u.svg('svg', { class: 'library-emblem', viewBox: '0 0 170 92', 'aria-hidden': 'true' }, top);
      const ink = '#54251a';
      u.svg('path', { d: 'M3 88H168M12 85H160', fill: 'none', stroke: ink, 'stroke-width': 1.5 }, emblem);
      const books = [
        [18, 63, 10, 23, -12],
        [29, 29, 12, 56, 7],
        [44, 15, 13, 70, 3],
        [61, 30, 13, 55, 6],
        [76, 8, 25, 77, 0],
        [105, 26, 15, 59, -8],
        [124, 38, 13, 47, -12],
        [140, 43, 15, 42, -13],
      ];
      books.forEach(([x, y, w, h, a], i) => {
        const g = u.svg(
          'g',
          { transform: `rotate(${a} ${x + w / 2} 85)`, stroke: ink, 'stroke-width': 1.2, fill: 'none' },
          emblem,
        );
        u.svg('path', { d: `M${x + 1} 84V${y + 3}l${Math.max(3, w * 0.28)} -1V84Z`, fill: ink, stroke: 'none' }, g);
        for (let band = y + 7; band < 82; band += 7)
          u.svg('path', { d: `M${x + 1} ${band}h${Math.max(3, w * 0.28)}`, 'stroke-width': 0.8, stroke: '#faf7ef' }, g);
        u.svg(
          'path',
          {
            d: `M${x} 85V${y + 2}Q${x + w / 2} ${y - 2} ${x + w} ${y + 2}V85ZM${x + 3} 84V${y + 4}M${x + w - 3} ${y + 4}V84M${x} ${y + 8}H${x + w}M${x} ${y + 13}H${x + w}M${x} 77H${x + w}M${x} 81H${x + w}`,
          },
          g,
        );
        for (let yy = y + 18; yy < 74; yy += 4)
          u.svg(
            'path',
            {
              d: `M${x + 4} ${yy}h${Math.max(3, w - 8)}m-${Math.max(3, w - 8)} 1h${Math.max(2, w - 10)}`,
              'stroke-width': 0.7,
            },
            g,
          );
        if (i === 4) u.svg('path', { d: 'M101 10l18 5v70h-18M104 18h11M104 22h11M104 27h11M104 74h11' }, g);
      });
      const brand = u.el('div', 'brand', top);
      u.el('div', 'mast', brand, 'Maplewood University Library');
      u.el('div', 'sub', brand, 'CATALOG · RESEARCH · KNOWLEDGE  SINCE 1896');
      const motto = u.el('div', 'motto', top, 'Books Build Brighter Minds');
      const leaf = u.svg('svg', { viewBox: '0 0 36 44', class: 'maple-leaf', 'aria-hidden': 'true' }, motto);
      u.svg(
        'path',
        {
          d: 'M18 42Q16 29 18 17M18 20C11 15 12 6 17 2C22 8 23 14 18 20ZM17 29C9 28 5 21 5 15C13 17 17 22 17 29ZM19 28C18 19 25 14 31 13C31 21 25 26 19 28ZM17 35C8 36 3 31 2 26C10 25 14 28 17 35ZM19 35C23 28 29 28 34 29C30 35 25 38 19 35ZM17 7L18 20M8 20l9 9M28 17l-9 11M6 29l11 6M30 31l-11 4',
          fill: 'none',
          stroke: '#54251a',
          'stroke-width': 1.5,
        },
        leaf,
      );
      const nav = u.el('nav', 'menu', document.body);
      ['Search Catalog', 'Journal Titles', 'Research Guides', 'Special Collections', 'Ask a Librarian'].forEach((t) =>
        u.el('span', '', nav, t),
      );
      const app = u.el('main', 'app', document.body);
      if (false) {
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
      const heading = u.el('h1', 'doc-title', app, 'Figure Identification');
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      if (ctx.display !== 'hidden') {
        const note = u.el('section', 'instruction-note', aside);
        u.el('h3', '', note, ctx.display === 'toast' ? 'Library notice' : 'Instructions');
        u.el('p', '', note, ctx.instruction);
      }
      u.el('h3', '', aside, 'Actions');
      const ul = u.el('ul', '', aside);
      u.el('li', '', ul, 'Click one of the shape names.');
      if (!ctx.finish) u.el('li', '', ul, 'Then click ' + endLabel + '.');
      u.el('h3', '', aside, 'Need Help?');
      u.el('p', '', aside, 'Look closely at the figure and choose the name that matches its shape.');
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        const parent = endPlacement === 'heading' ? heading : endPlacement === 'margin' ? aside : footer;
        submit = u.el('button', 'submit end-' + endPlacement, parent, endLabel);
        submit.type = 'button';
        submit.addEventListener('click', ctx.submit);
      }
      if (ctx.finish || endPlacement !== 'footer') footer.hidden = true;
      const otherLabels = endLabels.filter((label) => label !== endLabel);
      if (collideRng.bool(0.3) && otherLabels.length) {
        const label = collideRng.pick(otherLabels),
          decoy = u.el('button', 'xtra', aside, label);
        decoy.type = 'button';
        decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
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
