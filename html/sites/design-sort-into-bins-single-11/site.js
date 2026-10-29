// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-single-11',
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'promo' },
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'bleed',
        'theme': 'developer',
        'title': '',
        'foot': 'Zoom:  100%     +     \u2212',
        'accent': '#5ce33f',
        'bg': '#0e141b',
        'surface': '#0d1319',
        'font': 'monospace',
        'ob': 'update',
      },
      parts: {
        'frame.2': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx } = _c;
            body.className =
              'design ' +
              C.theme +
              ' layout-' +
              C.layout +
              (ctx.display === 'toast'
                ? ' has-instruction-toast'
                : ctx.display === 'panel'
                  ? ' has-instruction-panel'
                  : '');
          },
        'frame.3': () => () => {},
        'frame.15': (base, S) =>
          function (_c) {
            const { ctx, note, u } = _c;
            const instruction = u.el('div', 'instruction', note);
            {
              const txt = String(ctx.instruction).replace(/^\s*Action item:\s*/i, '');
              const m = txt.match(
                /\b(red|green|blue|yellow|purple|orange|pink|cyan|teal|brown|gray|grey|black|white|magenta|violet)\s+(circle|square|triangle|diamond|hexagon|pentagon|star|rectangle|shape)\b/i,
              );
              if (m) {
                instruction.append(txt.slice(0, m.index));
                u.el('span', 'hl', instruction, m[0]);
                instruction.append(txt.slice(m.index + m[0].length));
              } else instruction.textContent = txt;
            }
            u.el('div', 'stats', note, 'Task 1/1 | Attempts: 0 | Time: Paused');
            Object.assign(_c, { instruction });
          },
        'frame.22': () => () => {},
        'frame.25': (base, S) =>
          function (_c) {
            const { footer, u } = _c;
            {
              const fc = u.el('div', 'footer-copy', footer, 'Zoom:');
              for (const t of ['100%', '+', '-']) {
                const b = u.el('span', 'zbtn' + (t === '100%' ? ' on' : ''), fc, t);
              }
            }
          },
        'frame.27': (base, S) =>
          function (_c) {
            const { ctx, footer, note, u } = _c;
            ((_c.endPlacement = 'footer'), (_c.endText = 'Submit'));
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              if (!er.bool(0.5)) {
                _c.endPlacement = er.pick(['header', 'footer-link']);
                const labels = ctx.content && ctx.content.END_LABELS;
                const pool =
                  Array.isArray(labels) && labels.length
                    ? labels
                    : [
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
                      ];
                _c.endText = String(er.pick(pool));
              }
              if (_c.endPlacement === 'header' && ctx.display === 'hidden') _c.endPlacement = 'footer-link';
            }
            const endControl = (parent, cls, text) => {
              const b = u.el('button', cls, parent, text);
              b.type = 'button';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', text);
              b.title = text;
              b.onclick = () => ctx.submit();
              return b;
            };
            if (!ctx.finish && _c.endPlacement === 'header')
              _c.submit = endControl(note, 'submit header-submit', _c.endText);
            if (!ctx.finish && _c.endPlacement === 'footer') _c.submit = endControl(footer, 'submit', _c.endText);
            if (!ctx.finish && _c.endPlacement === 'footer-link')
              _c.submit = endControl(footer, 'submit footer-link', _c.endText);
            {
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const labels = ctx.content && ctx.content.END_LABELS;
                const pool = (
                  Array.isArray(labels) && labels.length
                    ? labels
                    : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"]
                )
                  .map((x) => String((x && (x.label || x.text || x.name)) || x))
                  .filter((x) => x.trim().toLowerCase() !== _c.endText.trim().toLowerCase());
                if (pool.length) {
                  const d = u.el('button', 'end-xtra', footer, cr.pick(pool));
                  d.type = 'button';
                  d.dataset.role = 'xtra';
                  d.onclick = () => env.log('decoy', { label: d.textContent, collide: true });
                }
              }
            }
            Object.assign(_c, { endControl });
          },
        'overlay.6': (base, S) =>
          function (_c) {
            const { C } = S;
            const { box, u } = _c;
            if (C.ob === 'update') {
              const icon = u.svg(
                'svg',
                { class: 'update-icon', width: 48, height: 48, viewBox: '0 0 48 48', 'aria-hidden': 'true' },
                box,
              );
              u.svg('circle', { cx: 24, cy: 24, r: 24, fill: '#00e765' }, icon);
              u.svg(
                'path',
                {
                  d: 'M24 36V14M14 24L24 14L34 24',
                  fill: 'none',
                  stroke: '#07151a',
                  'stroke-width': 4,
                  'stroke-linejoin': 'miter',
                },
                icon,
              );
            }
            const o = C.ob;
            Object.assign(_c, { o });
          },
        'overlay.15': (base, S) =>
          function (_c) {
            const { box, ctx, kind, o, u } = _c;
            if (o === 'update') {
              const bx = u.el('button', 'ob-x', box, '×');
              bx.type = 'button';
              bx.setAttribute('aria-label', 'Close');
              bx.onclick = () => ctx.dismiss('close');
              const up = u.el('button', 'dismiss ob-update', box, 'Update now');
              up.type = 'button';
              up.onclick = () => ctx.dismiss('close');
            }
            if (o === 'privacy' || (kind === 'cookie' && !o)) {
              const accept = u.el('button', 'dismiss', box, 'Accept optional');
              accept.onclick = () => ctx.dismiss('accept');
            }
          },
      },
    },
  });
})();
