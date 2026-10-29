// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-single-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'left',
        'theme': 'minimal',
        'title': 'Task',
        'subtitle': 'Notes',
        'foot': 'Use your mouse or trackpad (pointer) to move the shape.',
        'accent': '#ff810d',
        'bg': '#fcfaf7',
        'surface': '#fff',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
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
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, shell, u } = _c;
            _c.endLabel = 'Submit';
            _c.endPlacement = 'footer';
            _c.collide = null;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              const labels =
                ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                  ? ctx.content.END_LABELS
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
              const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              _c.endLabel = labels.map(labelText).find((x) => x.trim().toLowerCase() === 'submit') || 'Submit';
              if (!er.bool(0.5)) {
                _c.endLabel = er.pick(labels.map(labelText).filter((x) => x.trim().toLowerCase() !== 'submit'));
                _c.endPlacement = er.pick(['stage-top-right', 'footer-link']);
              }
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const own = _c.endLabel.trim().toLowerCase(),
                  choices = [...new Set(labels.map(labelText))].filter((x) => x.trim().toLowerCase() !== own);
                if (choices.length) _c.collide = cr.pick(choices);
              }
              const parent = C.layout === 'three' && _c.aside ? _c.aside : footer;
              if (_c.collide) {
                const decoy = u.el('button', 'xtra-end', footer, _c.collide);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.style.cssText =
                  'min-width:0;padding:8px 12px;font-size:15px;font-weight:600;color:var(--muted);background:transparent;border:1px solid var(--line);border-radius:5px';
                decoy.onclick = () => env.log('decoy', { label: _c.collide, collide: true });
              }
              shell.dataset.endPlacement = _c.endPlacement;
              const destination = _c.endPlacement === 'footer' ? parent : shell;
              _c.submit = u.el('button', 'submit', destination, _c.endLabel);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = _c.endLabel;
              _c.submit.setAttribute('aria-label', _c.endLabel);
              _c.submit.style.whiteSpace = 'nowrap';
              _c.submit.style.width = 'max-content';
              _c.submit.style.minWidth = '208px';
              _c.submit.onclick = () => ctx.submit();
            }
          },
      },
    },
  });
})();
