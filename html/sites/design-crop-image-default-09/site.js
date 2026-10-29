// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-default-09',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'irix',
        'theme': 'irix',
        'title': 'ImageCrop 1.0   (IRIX)',
        'menu': 'File       Edit       View       Help',
        'aside': 'Tools & Actions',
        'foot': 'IRIX 6.5                                      Mon Apr 21  10:24 AM',
        'accent': '#aaa2df',
        'bg': '#777e87',
        'surface': '#b9bdc2',
        'font': 'Arial Narrow, Arial, sans-serif',
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
              ' instruction-mode-' +
              ctx.display +
              (ctx.display === 'toast' ? ' has-instruction-toast' : '');
          },
        'frame.3': () => () => {},
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'irix'].includes(C.theme)) {
              const controls = u.el('div', 'window-controls', head);
              for (const label of ['−', '□', '×']) {
                const bt = u.el('button', '', controls, label);
                bt.type = 'button';
                bt.onclick = () => env.log('window-control', { label });
              }
            }
          },
        'frame.14': (base, S) =>
          function (_c) {
            const { C } = S;
            const { note, u } = _c;
            u.el('div', 'note-label', note, C.layout === 'left' ? 'Task' : C.layout === 'irix' ? 'Crop Task' : '');
          },
        'frame.18': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, note, u } = _c;
            if (C.theme === 'irix') {
              u.el(
                'p',
                'irix-copy',
                note,
                'The image contains several shapes. Drag the handles to resize the crop box.',
              );
              const preview = u.el('div', 'irix-preview', note);
              const art = u.el('div', 'irix-preview-art', preview);
              for (const cl of [
                'blue-circle',
                'green-triangle',
                'orange-star',
                'purple-square',
                'red-diamond',
                'yellow-circle',
                'teal-triangle',
              ])
                u.el('span', 'preview-shape ' + cl, art);
            }
            if (ctx.display === 'hidden') note.hidden = true;
            else if (ctx.display === 'toast') {
              note.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', note, '×');
              x.onclick = () => (note.style.visibility = 'hidden');
            } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, u } = _c;
            if (
              ['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger', 'irix'].includes(
                C.layout,
              )
            ) {
              _c.aside = u.el('aside', 'aside', content);
              if (C.tabs) {
                _c.aside.classList.add('tabs');
                for (const text of C.tabs) {
                  const bt = u.el('button', 'tab', _c.aside, text);
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
                } else if (C.theme === 'crop-minimal')
                  u.el('p', '', _c.aside, 'Drag the handles to resize the crop box.');
                else if (C.theme === 'irix') {
                  u.el(
                    'p',
                    'irix-description',
                    _c.aside,
                    'The image contains several shapes. Drag the handles to resize the crop box.',
                  );
                  const shelf = u.el('div', 'irix-controls', _c.aside);
                  for (const [symbol, label] of [
                    ['↖', 'Select'],
                    ['▧', 'Crop'],
                    ['⊕', 'Zoom In'],
                    ['⊖', 'Zoom Out'],
                    ['✥', 'Fit'],
                    ['↶', 'Reset'],
                  ]) {
                    const b = u.el('button', 'irix-tool', shelf);
                    b.type = 'button';
                    u.el('span', 'irix-icon', b, symbol);
                    u.el('span', '', b, label);
                    b.onclick = () => {
                      shelf.querySelectorAll('.irix-tool').forEach((x) => x.classList.remove('selected'));
                      b.classList.add('selected');
                    };
                  }
                  const cancel = u.el('button', 'irix-cancel', _c.aside, 'Cancel');
                  cancel.type = 'button';
                  cancel.onclick = () => env.widgetDef.clear?.();
                } else if (C.layout === 'palette') {
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
            const { ctx, footer, head, u } = _c;
            const er = ctx.rng.fork('chrome/end'),
              cr = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endWords = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = er.bool(0.5);
            const placement = referenceEnd ? 'shelf' : er.pick(['menu', 'status']);
            const endLabel = referenceEnd ? 'Submit' : er.pick(endWords);
            _c.submit = null;
            if (!ctx.finish) {
              const parent = placement === 'shelf' ? _c.aside : placement === 'menu' ? head : footer;
              _c.submit = u.el(placement === 'status' ? 'a' : 'button', 'submit end-' + placement, parent, endLabel);
              if (placement === 'status') _c.submit.href = '#';
              else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
            }
            if (cr.bool(0.3)) {
              const options = endWords.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
              if (options.length) {
                const label = cr.pick(options),
                  decoy = u.el(
                    'button',
                    'irix-chrome-xtra' + (!ctx.finish && placement === 'menu' ? ' beside-end' : ''),
                    head,
                    label,
                  );
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
              }
            }
            Object.assign(_c, { cr, endLabel, endWords, er, labelOf, placement, referenceEnd });
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
