// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-outline-09',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'notebook',
        'theme': 'modernist',
        'title': 'PhotoCrop',
        'subtitle': 'Simple Tools. Clear Results.',
        'menu': 'My Photos     │     Help     │     Sign Out',
        'tabs': ['Crop', 'Adjust', 'Effects', 'Stickers', 'Settings'],
        'aside': 'CROP CONTROLS',
        'foot': 'Landscape.jpg     │     1280 × 720',
        'accent': '#48b527',
        'bg': '#78c9fa',
        'surface': '#ffffff',
        'font': 'Segoe UI, Arial, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, u } = _c;
            if (['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger'].includes(C.layout)) {
              _c.aside = u.el('aside', 'aside', content);
              if (C.tabs) {
                _c.aside.classList.add('tabs');
                for (const text of C.tabs) {
                  const bt = u.el('button', 'tab', _c.aside);
                  u.el('span', 'tab-label', bt, text);
                  bt.type = 'button';
                  bt.onclick = () => {
                    _c.aside.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
                    bt.classList.add('active');
                  };
                }
              } else if (C.layout === 'sheet') {
                for (let i = 1; i <= 20; i++) u.el('div', 'index-number', _c.aside, String(i));
              } else if (C.layout === 'offset') {
                for (const text of ['Select', 'Zoom In', 'Zoom Out', 'Pan']) u.el('button', 'map-tool', _c.aside, text);
              } else {
                u.el('h3', '', _c.aside, C.aside || 'Instructions');
                if (C.aside === 'Your Answer') {
                  u.el('p', '', _c.aside, 'No point selected yet.');
                  u.el('hr', '', _c.aside);
                  u.el('p', '', _c.aside, 'X:    —');
                  u.el('p', '', _c.aside, 'Y:    —');
                } else if (C.aside === 'Progress') {
                  u.el('p', '', _c.aside, 'Problem 1 of 5');
                  u.el('progress', '', _c.aside).value = 0.2;
                  u.el('h3', '', _c.aside, 'Tips');
                  u.el('p', '', _c.aside, 'Click outside the dotted circle.');
                } else if (C.layout === 'windows') u.el('p', '', _c.aside, ctx.instruction);
                else if (C.theme === 'crop-minimal')
                  u.el('p', '', _c.aside, 'Drag the handles to resize the crop box.');
                else if (C.layout === 'palette') {
                  const ol = u.el('ol', 'guide', _c.aside);
                  for (const t of [
                    'Drag each handle to the target value.',
                    'Keep the lower value on the left and the higher value on the right.',
                    'Do not click on the track.',
                  ])
                    u.el('li', '', ol, t);
                }
              }
            }
            if (_c.aside?.classList.contains('tabs'))
              for (const [i, bt] of [..._c.aside.querySelectorAll('.tab')].entries()) {
                const icon = u.svg(
                  'svg',
                  { class: 'rail-icon', width: 48, height: 48, viewBox: '0 0 48 48', fill: 'none' },
                  bt,
                );
                bt.prepend(icon);
                const defs = u.svg('defs', {}, icon),
                  grad = u.svg('linearGradient', { id: 'rail-gloss-' + i, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
                u.svg('stop', { offset: 0, 'stop-color': '#ffffff' }, grad);
                u.svg('stop', { offset: 1, 'stop-color': '#9fb4bd' }, grad);
                if (i === 0 || i === 3) {
                  u.svg(
                    'rect',
                    {
                      x: 3,
                      y: 4,
                      width: 42,
                      height: 40,
                      rx: 3,
                      fill: 'url(#rail-gloss-' + i + ')',
                      stroke: '#7c8e97',
                      'stroke-width': 1.5,
                    },
                    icon,
                  );
                  u.svg('rect', { x: 7, y: 8, width: 34, height: 31, rx: 1, fill: '#72c6ed' }, icon);
                  u.svg('circle', { cx: 15, cy: 15, r: 4, fill: '#fff3a0' }, icon);
                  u.svg('path', { d: 'M7 32L17 22L25 29L33 16L41 25V39H7Z', fill: '#4b9b24' }, icon);
                  u.svg('path', { d: 'M7 35L18 28L27 35L35 27L41 32V39H7Z', fill: '#72b62b' }, icon);
                } else if (i === 1) {
                  u.svg(
                    'path',
                    {
                      d: 'M24 2V8M24 40V46M2 24H8M40 24H46M8 8L12 12M36 36L40 40M8 40L12 36M36 12L40 8',
                      stroke: '#fbc637',
                      'stroke-width': 3,
                      'stroke-linecap': 'round',
                    },
                    icon,
                  );
                  const sun = u.svg('radialGradient', { id: 'rail-sun' }, defs);
                  u.svg('stop', { offset: 0, 'stop-color': '#fff59c' }, sun);
                  u.svg('stop', { offset: 1, 'stop-color': '#ffc62f' }, sun);
                  u.svg(
                    'circle',
                    { cx: 24, cy: 24, r: 12, fill: 'url(#rail-sun)', stroke: '#e0a221', 'stroke-width': 1.5 },
                    icon,
                  );
                } else if (i === 2) {
                  u.svg(
                    'path',
                    { d: 'M17 28L39 4Q46 0 43 8L23 34Z', fill: '#b48654', stroke: '#755532', 'stroke-width': 1.5 },
                    icon,
                  );
                  u.svg(
                    'path',
                    {
                      d: 'M17 27Q25 29 24 35Q22 45 4 44Q11 40 10 35Q11 30 17 27Z',
                      fill: '#9078bb',
                      stroke: '#5a5078',
                      'stroke-width': 1.5,
                    },
                    icon,
                  );
                } else {
                  u.svg(
                    'path',
                    {
                      d: 'M20 3H28L30 9L35 11L41 8L46 15L42 20V27L46 33L41 40L35 37L30 40L28 46H20L18 40L12 37L7 40L2 33L6 27V20L2 15L7 8L12 11L18 9Z',
                      fill: 'url(#rail-gloss-' + i + ')',
                      stroke: '#7c929f',
                      'stroke-width': 1.5,
                    },
                    icon,
                  );
                  u.svg(
                    'circle',
                    { cx: 24, cy: 24, r: 9, fill: '#a0d6f6', stroke: '#80949e', 'stroke-width': 3 },
                    icon,
                  );
                }
              }
          },
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { ctx, footer, head, shell, u } = _c;
            const endR = ctx.rng.fork('chrome/end'),
              collideR = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endWords = (
              ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
            ).map(labelOf);
            const referenceEnd = endR.bool(0.5),
              placement = referenceEnd ? 'footer' : endR.pick(['header', 'link']);
            const endText = referenceEnd ? 'Submit' : endR.pick(endWords);
            _c.submit = null;
            if (!ctx.finish) {
              const parent = placement === 'header' ? head : footer;
              _c.submit = u.el(placement === 'link' ? 'a' : 'button', 'submit end-' + placement, parent, endText);
              if (placement === 'link') _c.submit.href = '#';
              else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endText;
              _c.submit.setAttribute('aria-label', endText);
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
              shell.classList.add('end-placement-' + placement);
            }
            if (collideR.bool(0.3)) {
              const words = [...new Set(endWords)].filter(
                (x) => x.trim().toLowerCase() !== endText.trim().toLowerCase(),
              );
              if (words.length) {
                const label = collideR.pick(words),
                  decoy = u.el('button', 'chrome-xtra', footer, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
              }
            }
            Object.assign(_c, { collideR, endR, endText, endWords, labelOf, placement, referenceEnd });
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
