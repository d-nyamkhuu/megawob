// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-outline-07',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'sheet',
        'theme': 'gem',
        'title': 'Crop Tool',
        'menu':
          'Desk     File     Edit     Image     Options                                         Mon 27 Jan 1986   10:24',
        'tabs': null,
        'aside': 'CROP CONTROLS',
        'foot': '',
        'accent': '#111',
        'bg': '#2d873f',
        'surface': '#d8d8d8',
        'font': 'Courier New, monospace',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.7': (base, S) =>
          function (_c) {
            const { body, u } = _c;
            const desktop = u.el('div', 'desktop-icons', body);
            for (const [glyph, label] of [
              ['A', 'A:'],
              ['B', 'B:'],
              ['▤', 'Trash'],
            ]) {
              const item = u.el('div', 'desktop-item', desktop);
              u.el('span', 'desktop-glyph', item, glyph);
              u.el('span', 'desktop-label', item, label);
            }
            const shell = u.el('div', 'shell', body),
              head = u.el('header', 'head', shell);
            Object.assign(_c, { desktop, head, shell });
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, u } = _c;
            if (['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger'].includes(C.layout)) {
              _c.aside = u.el('aside', 'aside', content);
              if (C.tabs) {
                _c.aside.classList.add('tabs');
                for (const text of C.tabs) {
                  const bt = u.el('button', 'tab', _c.aside);
                  u.el('span', 'tab-label', bt, text);
                  bt.type = 'button';
                  bt.onclick = () => {
                    _c.aside.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
                    bt.classList.add('active');
                  };
                }
              } else if (C.layout === 'sheet') {
                for (let i = 1; i <= 10; i++) u.el('div', 'index-number', _c.aside, String(i).padStart(2, '0'));
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
          },
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { ctx, footer, head, shell, u } = _c;
            const er = ctx.rng.fork('chrome/end'),
              cr = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const classic = er.bool(0.5),
              placement = classic ? 'footer' : er.pick(['header', 'header-link']);
            const endLabel = classic ? 'Submit' : er.pick(endLabels.filter((label) => label !== 'Submit'));
            shell.dataset.end = ctx.finish ? 'finish' : placement;
            _c.submit = null;
            if (!ctx.finish) {
              const parent = placement === 'footer' ? footer : head;
              _c.submit = u.el('button', 'submit' + (placement === 'header-link' ? ' end-link' : ''), parent, endLabel);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.onclick = () => ctx.submit();
            }
            if (cr.bool(0.3)) {
              const options = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
              const label = cr.pick(options);
              const decoy = u.el('button', 'end-xtra', head, label);
              decoy.type = 'button';
              decoy.dataset.role = 'xtra';
              decoy.onclick = () => env.log('decoy', { label, collide: true });
            }
            Object.assign(_c, { classic, cr, endLabel, endLabels, er, labelOf, placement });
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
