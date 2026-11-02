// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-reorder-items-list-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'left',
        'theme': 'memphis',
        'title': 'Organize the Months',
        'foot': '',
        'accent': '#ff867b',
        'bg': '#fbf5e8',
        'surface': '#fbf5e8',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, shell, u } = _c;
            if (C.theme === 'memphis') {
              if (ctx.display === 'header') u.el('div', 'workspace-instruction', shell, ctx.instruction);
              const decor = u.svg(
                'svg',
                { class: 'memphis-art', viewBox: '0 0 1672 941', preserveAspectRatio: 'none', 'aria-hidden': 'true' },
                shell,
              );
              const defs = u.svg('defs', {}, decor);
              const coral = u.svg('linearGradient', { id: 'memphis-coral', x1: '0', y1: '0', x2: '1', y2: '1' }, defs);
              u.svg('stop', { offset: '0', 'stop-color': '#ff8479' }, coral);
              u.svg('stop', { offset: '1', 'stop-color': '#ff9083' }, coral);
              const lilac = u.svg('linearGradient', { id: 'memphis-lilac', x1: '0', y1: '0', x2: '1', y2: '1' }, defs);
              u.svg('stop', { offset: '0', 'stop-color': '#bba5fb' }, lilac);
              u.svg('stop', { offset: '1', 'stop-color': '#b79ef6' }, lilac);
              u.svg('path', { d: 'M39 52H119', stroke: '#b9a1f7', 'stroke-width': 11 }, decor);
              u.svg('path', { d: 'M0 685L160 620L74 839L0 758Z', fill: 'url(#memphis-coral)' }, decor);
              u.svg('circle', { cx: 308, cy: 791, r: 79, fill: 'url(#memphis-lilac)' }, decor);
              u.svg('circle', { cx: 1488, cy: -46, r: 118, fill: 'url(#memphis-lilac)' }, decor);
              for (let row = 0; row < 4; row++)
                for (let col = 0; col < 4; col++)
                  u.svg('circle', { cx: 1588 + col * 21, cy: 54 + row * 20, r: 2.8, fill: '#10103b' }, decor);
              const dots = u.svg('g', { transform: 'rotate(29 127 830)', fill: '#b79ff8' }, decor);
              for (let row = 0; row < 6; row++)
                for (let col = 0; col < 3; col++)
                  u.svg('circle', { cx: 102 + col * 24, cy: 767 + row * 25, r: 4.2 }, dots);
              u.svg(
                'path',
                {
                  d: 'M1491 127Q1526 103 1528 135T1561 155T1582 174T1614 185T1633 214',
                  fill: 'none',
                  stroke: 'url(#memphis-coral)',
                  'stroke-width': 14,
                  'stroke-linecap': 'round',
                },
                decor,
              );
              u.svg(
                'path',
                {
                  d: 'M1295 76L1318 63M1298 97L1325 100M1291 116L1310 134',
                  fill: 'none',
                  stroke: '#ff867b',
                  'stroke-width': 9,
                  'stroke-linecap': 'round',
                },
                decor,
              );
            }
          },
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, u } = _c;
            _c.endDecoy = null;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              const choice = er.int(0, 9);
              const baseline = choice < 5;
              const placement = choice < 5 ? 'footer' : choice < 7 ? 'header' : 'link';
              const labels =
                ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                  ? ctx.content.END_LABELS
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
              const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              const submitLabel = labels.map(labelOf).find((x) => x.trim().toLowerCase() === 'submit') || 'Submit';
              const alternatives = labels.filter((x) => labelOf(x).trim().toLowerCase() !== 'submit');
              const endLabel = baseline ? submitLabel : labelOf(er.pick(alternatives.length ? alternatives : labels));
              const parent = C.layout === 'three' && _c.aside ? _c.aside : footer;
              if (placement === 'header' && parent === footer) footer.classList.add('top-submit');
              _c.submit = u.el(
                'button',
                'submit' + (placement === 'header' ? ' submit-top' : placement === 'link' ? ' submit-link' : ''),
                parent,
                placement === 'link' ? endLabel + ' ›' : endLabel,
              );
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.title = endLabel;
              _c.submit.onclick = () => ctx.submit();
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const candidates = labels
                  .map(labelOf)
                  .filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
                if (candidates.length) {
                  _c.endDecoy = u.el('button', 'end-xtra', footer, cr.pick(candidates));
                  _c.endDecoy.type = 'button';
                  _c.endDecoy.dataset.role = 'xtra';
                  _c.endDecoy.onclick = () => env.log('decoy', { label: _c.endDecoy.textContent, collide: true });
                  footer.classList.add('has-xtra');
                }
              }
            }
          },
      },
    },
  });
})();
