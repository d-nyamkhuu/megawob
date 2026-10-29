// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-default-06',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'civic-transfer',
        'theme': 'civic-transfer',
        'title': 'Civic Data Labeling',
        'subtitle': 'A more open, accessible community',
        'aside': 'Instructions',
        'foot': 'City of Riverton　 |　 Open Data for a Stronger Community',
        'accent': '#1766c5',
        'bg': '#fff',
        'surface': '#f1f3f5',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, u } = _c;
            _c.aside = u.el('aside', 'aside', content);
            u.el('h3', '', _c.aside, C.aside || 'Instructions');
            const ol = u.el('ol', 'civic-steps', _c.aside);
            for (const text of [
              'Drag the eight handles (corners and side midpoints) to resize the box.',
              'Drag inside the box to move it around the image.',
              'The blue border shows the current crop selection.',
            ])
              u.el('li', '', ol, text);
            const reset = u.el('button', 'reset', _c.aside, 'Reset');
            reset.type = 'button';
            reset.onclick = () => env.widgetDef.clear?.();
          },
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { body, ctx, footer, head, u } = _c;
            const er = ctx.rng.fork('chrome/end'),
              cr = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endWords = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = er.bool(0.5),
              placement = referenceEnd ? 'aside' : er.pick(['header', 'footer']);
            const endLabel = referenceEnd ? 'Submit' : er.pick(endWords);
            body.classList.add('instruction-mode-' + ctx.display);
            body.classList.toggle('long-instruction', ctx.instruction.length > 150);
            _c.submit = null;
            if (!ctx.finish) {
              body.classList.add('end-in-' + placement);
              const parent = placement === 'aside' ? _c.aside : placement === 'header' ? head : footer;
              _c.submit = u.el('button', 'submit' + (placement === 'footer' ? ' submit-link' : ''), parent, endLabel);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.onclick = () => ctx.submit();
            }
            if (cr.bool(0.3)) {
              const options = [...new Set(endWords)].filter(
                (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
              );
              if (options.length) {
                const label = cr.pick(options),
                  parent = !ctx.finish && placement === 'aside' ? head : _c.aside;
                const decoy = u.el('button', 'end-xtra', parent, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
              }
            }
            body.classList.toggle('has-head-actions', !!head.querySelector('.submit,.end-xtra'));
            Object.assign(_c, { cr, endLabel, endWords, er, labelOf, placement, referenceEnd });
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
