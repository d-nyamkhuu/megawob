// Design on templates/site/form-text-login-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-act-in-time-stock-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/type-text-login-01',
    design: {
      C: {
        'site': 'design-act-in-time-stock-02',
        'brand': 'MY TRADING NOTEBOOK',
        'title': 'Place Order',
        'instruction': 'top',
        'rail': 'Trade|Watchlist|Notes|History|Settings',
        'menu': '',
        'briefTitle': 'Instructions',
      },
      parts: {
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, top, u } = _c;
            const endRng = ctx.rng.fork('chrome/end');
            const labels =
              ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                ? ctx.content.END_LABELS
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', 'Done'];
            const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
            const labelChoices = labels.map(labelOf);
            ((_c.placement = 'footer'),
              (_c.label = labelChoices.find((x) => x.toLowerCase() === 'submit') || labelChoices[0]));
            if (!endRng.bool(0.5)) {
              _c.placement = endRng.pick(['header', 'link']);
              _c.label = endRng.pick(labelChoices);
            }
            const collideRng = ctx.rng.fork('chrome/collide');
            _c.collision = null;
            if (!ctx.finish && collideRng.bool(0.3)) {
              const options = [...new Set(labelChoices)].filter(
                (x) => x.trim().toLowerCase() !== _c.label.trim().toLowerCase(),
              );
              if (options.length) _c.collision = collideRng.pick(options);
            }
            const topTools = u.el('div', 'ds-top-tools', top);
            if (_c.collision) {
              const d = u.el('button', 'ds-xtra', topTools, _c.collision);
              d.type = 'button';
              d.dataset.role = 'xtra';
              d.addEventListener('click', () => env.log('decoy', { label: _c.collision, collide: true }));
            }
            const endControl = (parent, link, text) => {
              const b = u.el(link ? 'a' : 'button', link ? 'ds-submitlink' : 'ds-submit', parent, text);
              if (link) {
                b.href = '#';
                b.addEventListener('click', (e) => e.preventDefault());
              } else b.type = 'button';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', _c.label);
              b.title = _c.label;
              b.addEventListener('click', (e) => {
                e.preventDefault();
                ctx.submit();
              });
              return b;
            };
            _c.headerSubmit = null;
            if (!ctx.finish && _c.placement === 'header') _c.headerSubmit = endControl(topTools, false, _c.label);
            if (C.menu) {
              const nav = u.el('nav', 'ds-menu', document.body);
              C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
            }
            Object.assign(_c, { collideRng, endControl, endRng, labelChoices, labelOf, labels, topTools });
          },
        'frame.23': (base, S) =>
          function (_c) {
            const { ctx, endControl, foot } = _c;
            if (!ctx.finish) {
              if (_c.placement === 'footer') _c.submit = endControl(foot, false, _c.label);
              else if (_c.placement === 'link') _c.submit = endControl(foot, true, _c.label + ' ›');
              else _c.submit = _c.headerSubmit;
            }
          },
        'frame.24': () => () => {},
        'frame.25': () => () => {},
        'frame.26': () => () => {},
      },
    },
  });
})();
