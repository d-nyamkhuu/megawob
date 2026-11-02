// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-reorder-items-list-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'mag',
        'theme': 'mag',
        'title': 'Word Ordering',
        'menu': 'Help  |  Instructions  |  Exit',
        'foot': '',
        'accent': '#b01025',
        'bg': '#faf8f2',
        'surface': '#faf8f2',
        'font': "'Liberation Serif','Times New Roman',Times,Georgia,serif",
      },
      parts: {
        'frame.3': () => () => {},
        'frame.25': (base, S) =>
          function (_c) {
            const { footer, u } = _c;
            const fc = u.el('div', 'footer-copy', footer, 'Page ');
            u.el('span', 'pg', fc, '1');
            fc.appendChild(document.createTextNode(' of 1'));
            Object.assign(_c, { fc });
          },
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, head, u } = _c;
            _c.endPlacement = null;
            _c.endLabel = 'Submit';
            _c.collide = null;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              const labels =
                ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                  ? ctx.content.END_LABELS
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
              const labelText = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
              const submitLabel = labels.find((x) => labelText(x).trim().toLowerCase() === 'submit'),
                alternatives = labels.filter((x) => labelText(x).trim().toLowerCase() !== 'submit');
              _c.endLabel = labelText(
                er.bool(0.5) && submitLabel ? submitLabel : er.pick(alternatives.length ? alternatives : labels),
              );
              const weight = _c.endLabel.split('').reduce((n, ch) => n + ch.charCodeAt(0), 0) % 4;
              _c.endPlacement = weight === 0 ? 'header' : weight === 2 ? 'link' : 'footer';
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const options = [...new Set(labels.map(labelText))].filter(
                  (x) => x.trim().toLowerCase() !== _c.endLabel.trim().toLowerCase(),
                );
                if (options.length) _c.collide = { label: cr.pick(options), where: cr.pick(['header', 'footer']) };
              }
              const makeEnd = (parent, cls, text, tag = 'button') => {
                const b = u.el(tag, cls, parent, text);
                if (tag === 'button') b.type = 'button';
                else b.href = '#';
                b.dataset.role = 'submit';
                b.title = _c.endLabel;
                b.setAttribute('aria-label', _c.endLabel);
                b.onclick = (e) => {
                  e.preventDefault();
                  ctx.submit();
                };
                return b;
              };
              const decoy = (parent) => {
                if (!_c.collide) return;
                const b = u.el('button', 'end-xtra', parent, _c.collide.label);
                b.type = 'button';
                b.dataset.role = 'xtra';
                b.onclick = () => env.log('decoy', { label: _c.collide.label, collide: true });
              };
              if (_c.endPlacement === 'header' || (_c.collide && _c.collide.where === 'header')) {
                const tools = u.el('div', 'head-actions', head);
                if (_c.collide && _c.collide.where === 'header') decoy(tools);
                if (_c.endPlacement === 'header') _c.submit = makeEnd(tools, 'head-end', _c.endLabel);
              }
              const parent = C.layout === 'three' && _c.aside ? _c.aside : footer;
              if (_c.collide && _c.collide.where === 'footer') decoy(parent);
              if (_c.endPlacement === 'footer') _c.submit = makeEnd(parent, 'submit', _c.endLabel);
              if (_c.endPlacement === 'link') _c.submit = makeEnd(parent, 'footer-endlink', _c.endLabel + ' ›', 'a');
            }
          },
      },
    },
  });
})();
