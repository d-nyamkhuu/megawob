// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-vertical-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'notebook',
        'theme': 'human',
        'title': 'Project Settings',
        'menu': 'File    Edit    View    Help',
        'tabs': ['Task', 'Notes', 'Preferences', 'Files', 'About'],
        'foot': '',
        'accent': '#dc8b35',
        'bg': '#a28b6b',
        'surface': '#f5f0e4',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.2': (base, St) =>
          function (_c) {
            const { C } = St;
            const { body, ctx } = _c;
            body.className =
              'design ' +
              C.theme +
              ' layout-' +
              C.layout +
              (ctx.display === 'toast' ? ' has-instruction-toast' : '') +
              ' instruction-' +
              ctx.display;
          },
        'frame.3': () => () => {},
        'frame.22': () => () => {},
        'frame.24': (base, St) =>
          function (_c) {
            const { C } = St;
            const { shell, u } = _c;
            if (_c.aside && C.tabs) {
              const paths = [
                'M18 3L20 8L24 10L29 8L33 14L29 18V23L33 27L29 33L24 31L20 33L18 38H11L9 33L5 31L1 33L-3 27L1 23V18L-3 14L1 8L5 10L9 8L11 3Z',
                'M8 3H23L32 12V36H8ZM23 3V13H32M13 19H26M13 25H26M13 31H26',
                'M3 9H35M3 21H35M3 33H35',
                'M3 12V6Q3 3 6 3H15L21 10H34Q37 10 37 13V35H3ZM3 15H37',
                '',
              ];
              _c.aside.querySelectorAll('.tab').forEach((bt, i) => {
                const svg = u.svg(
                  'svg',
                  {
                    viewBox: i === 0 ? '-5 0 42 42' : '0 0 42 42',
                    class: 'tab-icon',
                    fill: i === 0 || i === 4 ? 'currentColor' : 'none',
                    stroke: 'currentColor',
                    'stroke-width': 3,
                    'stroke-linejoin': 'round',
                  },
                  bt,
                );
                if (i === 4) {
                  u.svg('circle', { cx: 20, cy: 21, r: 18 }, svg);
                  const t = u.svg(
                    'text',
                    {
                      x: 20,
                      y: 31,
                      'text-anchor': 'middle',
                      fill: '#eee8db',
                      stroke: 'none',
                      'font-size': 30,
                      'font-family': 'Arial',
                    },
                    svg,
                  );
                  t.textContent = '?';
                } else {
                  u.svg('path', { d: paths[i] }, svg);
                  if (i === 0) u.svg('circle', { cx: 15, cy: 20, r: 7, fill: '#efbd7e', stroke: 'none' }, svg);
                  if (i === 2)
                    for (const [x, y] of [
                      [10, 9],
                      [10, 21],
                      [22, 33],
                    ])
                      u.svg(
                        'rect',
                        { x: x - 2, y: y - 3, width: 4, height: 6, rx: 2, fill: '#b5ad9b', 'stroke-width': 3 },
                        svg,
                      );
                }
              });
            }
            const footer = u.el('footer', 'footer', shell);
            Object.assign(_c, { footer });
          },
        'frame.27': (base, St) =>
          function (_c) {
            const { ctx, footer, head, u } = _c;
            const endR = ctx.rng.fork('chrome/end'),
              endPool = (ctx.content && ctx.content.END_LABELS) || [
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
              endLabel = endR.pick(endPool),
              endText =
                typeof endLabel === 'string'
                  ? endLabel
                  : endLabel.label || endLabel.text || endLabel.name || String(endLabel),
              endPlacement = ctx.finish ? null : endR.pick(['footer', 'footer', 'footer', 'header', 'link', 'icon']);
            if (!ctx.finish) {
              const parent = endPlacement === 'header' ? head : footer,
                cls =
                  'submit' +
                  (endPlacement === 'link' ? ' end-link' : '') +
                  (endPlacement === 'icon' ? ' end-icon' : '');
              _c.submit = u.el(
                endPlacement === 'link' ? 'a' : 'button',
                cls,
                parent,
                endPlacement === 'icon' ? '✓' : endPlacement === 'link' ? endText + ' ›' : endText,
              );
              if (endPlacement === 'link') _c.submit.href = '#';
              else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', endText);
              _c.submit.title = endText;
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
            }
            const decoyBtn = (parent, label, collide) => {
              const b = u.el('button', 'chrome-xtra', parent, label);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.onclick = () => env.log('decoy', collide ? { label, collide: true } : { label });
            };
            const collideR = ctx.rng.fork('chrome/collide');
            if (!ctx.finish && collideR.bool(0.3)) {
              const options = [
                ...new Set(
                  endPool
                    .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
                    .filter((x) => x.trim().toLowerCase() !== endText.trim().toLowerCase()),
                ),
              ];
              if (options.length) decoyBtn(endPlacement === 'header' ? footer : head, collideR.pick(options), true);
            }
            Object.assign(_c, { collideR, decoyBtn, endLabel, endPlacement, endPool, endR, endText });
          },
        'frame.30': (base, St) =>
          function (_c) {
            const { content, ctx, stage, u } = _c;
            {
              const panel = u.el('div', 'info-panel', content);
              const rows = [
                ['Slider help:', 'Drag the handle', 1],
                ['Current value:', '', 0],
                ['Allowed range:', '', 0],
              ];
              const vals = [];
              for (const [k, v, b] of rows) {
                const r = u.el('div', 'info-row', panel);
                u.el('div', 'info-k', r, k);
                const x = u.el('div', 'info-v' + (b ? ' strong' : ''), r, v);
                vals.push(x);
              }
              vals[1].dataset.info = 'current';
              vals[2].dataset.info = 'range';
            }
            return { stage, submit: _c.submit };
          },
      },
    },
  });
})();
