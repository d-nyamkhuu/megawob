// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-single-06',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'sheet',
        'theme': 'gnome',
        'title': 'Shape Practice',
        'subtitle': '',
        'foot': '',
        'accent': '#2783ed',
        'bg': '#f5f6f8',
        'surface': '#ffffff',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.2': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx } = _c;
            const compact = document.documentElement.clientWidth < 1260,
              short = document.documentElement.clientHeight < 700;
            const display =
              (ctx.display === 'panel' && compact) || (ctx.display === 'toast' && short) ? 'header' : ctx.display;
            body.className =
              'design ' +
              C.theme +
              ' layout-' +
              C.layout +
              ' note-' +
              display +
              (display === 'toast' ? ' has-instruction-toast' : '');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endWords = ctx.content.END_LABELS.map(labelOf),
              endR = ctx.rng.fork('chrome/end');
            const referenceEnd = endR.bool(0.5),
              placement = referenceEnd ? 'footer' : endR.pick(['header', 'link']);
            const endLabel = referenceEnd ? 'Submit' : endR.pick(endWords);
            Object.assign(_c, { compact, display, endLabel, endR, endWords, labelOf, placement, referenceEnd, short });
          },
        'frame.3': () => () => {},
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, head, u } = _c;
            if (C.theme === 'gnome') {
              const bar = u.el('div', 'desktop-bar', body);
              u.el('span', 'activities', bar, 'Activities');
              u.el('span', 'desktop-app-icon', bar);
              u.el('span', 'desktop-app-name', bar, 'Shape Practice');
              u.el('div', 'desktop-clock', body, 'Mon Apr 28  10:24');
              const status = u.el('div', 'desktop-status', bar);
              for (const path of [
                'M2 8Q12 -1 22 8M5 11Q12 5 19 11M8 14Q12 10 16 14M11 17H13',
                'M2 9H6L12 4V20L6 15H2ZM16 8Q20 12 16 16M19 4Q26 12 19 20',
                'M8 5H18V22H8ZM11 2H15V5M11 9H15M11 12H15M11 15H15',
              ]) {
                const icon = u.svg(
                  'svg',
                  {
                    width: 24,
                    height: 24,
                    viewBox: '0 0 26 26',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': 2,
                    'stroke-linejoin': 'round',
                  },
                  status,
                );
                u.svg('path', { d: path }, icon);
              }
              u.el('span', '', status, '⌄');
            }
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'gnome'].includes(C.theme)) {
              const controls = u.el('div', 'window-controls', head);
              for (const [i, label] of ['−', '□', '×'].entries()) {
                const bt = u.el('button', '', controls);
                bt.type = 'button';
                bt.setAttribute('aria-label', ['Minimize', 'Maximize', 'Close'][i]);
                const icon = u.svg(
                  'svg',
                  {
                    width: 20,
                    height: 20,
                    viewBox: '0 0 20 20',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': 2.3,
                  },
                  bt,
                );
                u.svg('path', { d: ['M4 11H16', 'M4 4H16V16H4Z', 'M5 5L15 15M15 5L5 15'][i] }, icon);
                bt.onclick = () => env.log('window-control', { label });
              }
            }
          },
        'frame.17': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, note, u } = _c;
            if (C.theme === 'minimal') {
              const shape =
                (ctx.plainInstruction || ctx.instruction)
                  .match(/\b(circle|square|triangle|diamond|hexagon|star)\b/i)?.[0]
                  .toLowerCase() || 'shape';
              const color = (ctx.plainInstruction || ctx.instruction)
                .match(/\b(blue|red|green|yellow|orange|purple|pink|cyan|teal|brown|gray)\b/i)?.[0]
                .toLowerCase();
              const target = color ? color + ' ' + shape : shape;
              const steps = u.el('ol', 'steps', note);
              for (const text of [
                'Drag the ' + target + ' from its current position.',
                'Drop it inside the rectangular box.',
                'The ' + shape + ' must fit fully inside the box.',
              ])
                u.el('li', '', steps, text);
              u.el('h3', '', note, 'Notes');
              const nl = u.el('ul', 'notes-list', note);
              for (const text of [
                'Use your mouse or trackpad (pointer) to move the ' + shape + '.',
                'Do not resize the shape.',
                'The ' + shape + ' must be completely inside the box, not touching or outside the borders.',
              ])
                u.el('li', '', nl, text);
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, display, note, u } = _c;
            if (['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger'].includes(C.layout)) {
              _c.aside = u.el('aside', 'aside', content);
              if (C.tabs) {
                _c.aside.classList.add('tabs');
                for (const text of C.tabs) {
                  const bt = u.el('button', 'tab', _c.aside, text);
                  bt.type = 'button';
                  bt.onclick = () => {
                    _c.aside.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
                    bt.classList.add('active');
                  };
                }
              } else if (C.layout === 'sheet') {
                for (let i = 1; i <= 10; i++) u.el('div', 'index-number', _c.aside, String(i));
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
            note.hidden = display === 'hidden';
            note.classList.remove('instruction-panel', 'instruction-toast');
            if (display === 'panel') note.classList.add('instruction-panel');
            if (display === 'toast') note.classList.add('instruction-toast');
            if (display !== 'toast') note.querySelector('.note-close')?.remove();
          },
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, endLabel, endWords, footer, head, placement, u } = _c;
            if (C.layout === 'sheet') {
              const reset = u.el('button', 'clear', footer);
              reset.type = 'button';
              const icon = u.svg(
                'svg',
                {
                  width: 28,
                  height: 28,
                  viewBox: '0 0 28 28',
                  fill: 'none',
                  stroke: 'currentColor',
                  'stroke-width': 2.5,
                },
                reset,
              );
              u.svg('path', { d: 'M23 11A10 10 0 1 0 23 19M23 3V11H15' }, icon);
              u.el('span', '', reset, 'Reset');
              reset.onclick = () => env.widgetDef.clear?.();
            }
            const headerTools = u.el('div', 'header-tools', head);
            _c.submit = null;
            if (!ctx.finish) {
              _c.submit = u.el(
                'button',
                'submit end-' + placement,
                placement === 'header' ? headerTools : footer,
                endLabel,
              );
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.onclick = () => ctx.submit();
            }
            const collideR = ctx.rng.fork('chrome/collide');
            if (collideR.bool(0.3)) {
              const pool = [...new Set(endWords)].filter(
                (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
              );
              if (pool.length) {
                const label = collideR.pick(pool),
                  decoy = u.el('button', 'chrome-xtra', headerTools, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
              }
            }
            Object.assign(_c, { collideR, headerTools });
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
