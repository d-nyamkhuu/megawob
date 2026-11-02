// Design on templates/site/form-text-login-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-set-date-typed-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/type-text-login-01',
    design: {
      C: {
        'site': 'design-set-date-typed-01',
        'brand': 'Task Manager',
        'title': 'Project Task',
        'instruction': 'left',
        'rail': '',
        'menu': 'Project Task',
        'briefTitle': 'Instructions',
      },
      parts: {
        'frame.5': (base, S) =>
          function (_c) {
            const { ctx, u } = _c;
            const endRng = ctx.rng.fork('chrome/end');
            const collideRng = ctx.rng.fork('chrome/collide');
            const labels =
              ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                ? ctx.content.END_LABELS
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
            const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
            const label = labelOf(endRng.pick(labels));
            const placement = endRng.pick(['footer', 'footer', 'header', 'link']);
            const collide = collideRng.bool(0.3)
              ? labelOf(
                  collideRng.pick(labels.filter((x) => labelOf(x).trim().toLowerCase() !== label.trim().toLowerCase())),
                )
              : null;
            const top = u.el('header', 'ds-top', document.body);
            Object.assign(_c, { collide, collideRng, endRng, label, labelOf, labels, placement, top });
          },
        'frame.23': (base, S) =>
          function (_c) {
            const { collide, ctx, foot, label, placement, top, u } = _c;
            const endButton = (parent, cls, text) => {
              const b = u.el(cls === 'ds-submit-link' ? 'a' : 'button', cls, parent, text);
              if (b.tagName === 'BUTTON') b.type = 'button';
              else b.href = '#';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', label);
              b.title = label;
              b.addEventListener('click', (e) => {
                e.preventDefault();
                ctx.submit();
              });
              return b;
            };
            if (collide) {
              const d = u.el('button', 'ds-pq', foot, collide);
              d.type = 'button';
              d.dataset.role = 'xtra';
              d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
            }
            if (!ctx.finish) {
              if (placement === 'header') {
                _c.submit = endButton(top, 'ds-submit ds-submit-header', label);
              } else if (placement === 'link') {
                _c.submit = endButton(foot, 'ds-submit-link', label + ' ›');
              } else {
                _c.submit = endButton(foot, 'ds-submit', label);
              }
            }
            Object.assign(_c, { endButton });
          },
        'frame.24': () => () => {},
        'frame.25': () => () => {},
        'frame.26': () => () => {},
      },
    },
  });
})();
