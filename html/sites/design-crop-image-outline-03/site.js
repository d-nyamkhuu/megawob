// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-outline-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'notebook',
        'theme': 'modernist',
        'title': 'PhotoCrop',
        'subtitle': 'simple tools for your images',
        'menu': 'Crop                  Adjust                  Save',
        'tabs': null,
        'aside': '',
        'foot': '',
        'accent': '#18a9ed',
        'bg': '#19549b',
        'surface': '#f8f5ed',
        'font': 'Arial, Helvetica, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.menu) {
              const nav = u.el('nav', 'menu', head);
              if (C.title === 'PhotoCrop') {
                for (const [i, label] of ['Crop', 'Adjust', 'Save'].entries()) {
                  const tab = u.el('button', 'menu-tab' + (i === 0 ? ' selected' : ''), nav, label);
                  tab.type = 'button';
                  tab.onclick = () => {
                    nav.querySelectorAll('.menu-tab').forEach((x) => x.classList.remove('selected'));
                    tab.classList.add('selected');
                  };
                }
              } else nav.textContent = C.menu;
            }
          },
        'frame.16': (base, S) =>
          function (_c) {
            const { C } = S;
            const { note, u } = _c;
            if (C.title === 'PhotoCrop') {
              const guide = u.el('section', 'flash-section', note);
              u.el('h2', '', guide, 'Instructions');
              const ol = u.el('ol', '', guide);
              for (const t of [
                'Drag the crop box to move it.',
                'Drag the handles to resize it.',
                'Match it to the dashed outline as closely as possible.',
              ])
                u.el('li', '', ol, t);
              const notes = u.el('section', 'flash-section', note);
              u.el('h2', '', notes, 'Notes');
              const ul = u.el('ul', '', notes);
              for (const t of [
                'The crop box has 8 handles (corners and sides).',
                'Keep the entire crop box within the image.',
                'Aim for IoU ≥ 0.85.',
              ])
                u.el('li', '', ul, t);
            }
            if (C.theme === 'memphis') {
              u.el('h1', 'brief-title', note, C.title);
              note.prepend(note.lastChild);
              u.el(
                'p',
                'brief-copy',
                note,
                'Drag and drop the months on the right to arrange them from January to December.',
              );
            }
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
                for (let i = 1; i <= 20; i++) u.el('div', 'index-number', _c.aside, String(i));
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
            const endRng = ctx.rng.fork('chrome/end'),
              collideRng = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = endRng.bool(0.5),
              placement = referenceEnd ? 'footer' : endRng.pick(['header', 'link']);
            const endLabel = referenceEnd ? 'Submit' : endRng.pick(endLabels);
            shell.dataset.endPlacement = ctx.finish ? 'none' : placement;
            _c.submit = null;
            if (!ctx.finish) {
              const parent = placement === 'header' ? head : footer;
              _c.submit = u.el('button', 'submit' + (placement === 'link' ? ' flash-end-link' : ''), parent, endLabel);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.onclick = () => ctx.submit();
            }
            if (collideRng.bool(0.3)) {
              const options = [...new Set(endLabels)].filter(
                (label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
              );
              if (options.length) {
                const label = collideRng.pick(options),
                  parent = placement === 'header' && !ctx.finish ? footer : head;
                const decoy = u.el('button', 'flash-xtra', parent, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
              }
            }
            Object.assign(_c, { collideRng, endLabel, endLabels, endRng, labelOf, placement, referenceEnd });
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
