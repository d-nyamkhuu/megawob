// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-single-09',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'magazine',
        'theme': 'magazine',
        'title': 'Spatial Practice',
        'subtitle': 'Simple tasks. Sharper thinking.',
        'menu': 'Home     │     Practice     │     Help     │     Sign Out',
        'foot': '',
        'accent': '#c81020',
        'bg': '#fbfaf7',
        'surface': '#fbfaf7',
        'font': "Georgia, 'Times New Roman', serif",
      },
      parts: {
        'frame.3': () => () => {},
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.menu) {
              const nav = u.el('nav', 'menu', head);
              for (const [i, label] of C.menu
                .split('│')
                .map((x) => x.trim())
                .filter(Boolean)
                .entries()) {
                if (i) u.el('span', 'menu-rule', nav);
                const link = u.el('a', 'menu-link', nav, label);
                link.href = '#';
                link.onclick = (e) => e.preventDefault();
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
        'frame.22': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, head, u } = _c;
            if (C.theme === 'magazine') {
              const reset = u.el('button', 'clear', footer, 'Reset');
              reset.type = 'button';
              reset.onclick = () => env.widgetDef.clear?.();
            }
            _c.submit = null;
            if (!ctx.finish) {
              const endRng = ctx.rng.fork('chrome/end'),
                labels = ctx.content && ctx.content.END_LABELS,
                bank =
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
                      ],
                labelOf = (x) => String(typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || x),
                label = labelOf(endRng.pick(bank));
              const placement = endRng.pick(['footer', 'footer', 'header', 'link']);
              const collideRng = ctx.rng.fork('chrome/collide');
              let collision = null;
              if (collideRng.bool(0.3)) {
                const pool = bank.map(labelOf),
                  options = [...new Set(pool)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
                if (options.length)
                  collision = { label: collideRng.pick(options), where: collideRng.pick(['header', 'footer']) };
              }
              const endButton = (parent, asLink) => {
                const b = u.el(asLink ? 'a' : 'button', asLink ? 'submit end-link' : 'submit', parent, label);
                if (asLink) b.href = '#';
                else b.type = 'button';
                b.dataset.role = 'submit';
                b.setAttribute('aria-label', label);
                b.title = label;
                b.onclick = (e) => {
                  e.preventDefault();
                  ctx.submit();
                };
                return b;
              };
              const decoy = (parent) => {
                if (!collision) return;
                const b = u.el('button', 'end-xtra', parent, collision.label);
                b.type = 'button';
                b.dataset.role = 'xtra';
                b.onclick = () => env.log('decoy', { label: collision.label, collide: true });
              };
              if (placement === 'header') {
                const tools = u.el('div', 'magazine-tools', head);
                decoy(tools);
                _c.submit = endButton(tools, false);
              } else {
                if (collision && collision.where === 'header') {
                  const tools = u.el('div', 'magazine-tools magazine-xtra-tools', head);
                  decoy(tools);
                }
                if (placement === 'link') {
                  _c.submit = endButton(footer, true);
                  _c.submit.textContent = label + ' ›';
                } else _c.submit = endButton(footer, false);
                if (collision && collision.where === 'footer') decoy(footer);
              }
            }
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
