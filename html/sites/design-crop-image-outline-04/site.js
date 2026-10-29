// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-outline-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'stack',
        'theme': 'human',
        'title': 'Image Cropper',
        'menu': 'File     Edit     View     Help',
        'tabs': null,
        'aside': 'CROP CONTROLS',
        'foot': '',
        'accent': '#e87518',
        'bg': '#514538',
        'surface': '#e8dfd0',
        'font': "Arial, 'Liberation Sans', sans-serif",
      },
      parts: {
        'frame.2': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx } = _c;
            _c.display = ctx.display || 'header';
            if (
              (_c.display === 'panel' && (window.innerWidth < 1120 || window.innerHeight < 700)) ||
              (_c.display === 'toast' && (window.innerWidth < 1120 || window.innerHeight < 700))
            )
              _c.display = 'header';
            body.className = 'design ' + C.theme + ' layout-' + C.layout + ' display-' + _c.display;
          },
        'frame.3': () => () => {},
        'frame.17': (base, S) =>
          function (_c) {
            const { C } = S;
            const { note, u } = _c;
            if (C.theme === 'minimal') {
              const steps = u.el('ol', 'steps', note);
              for (const text of [
                'Drag the shape from its current position.',
                'Drop it inside the rectangular box.',
                'The shape must fit fully inside the box.',
              ])
                u.el('li', '', steps, text);
            }
            if (_c.display === 'hidden') note.classList.add('is-hidden');
            else if (_c.display === 'toast') {
              note.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', note, '×');
              x.type = 'button';
              x.onclick = () => (note.style.visibility = 'hidden');
            } else if (_c.display === 'panel') note.classList.add('instruction-panel');
          },
        'frame.18': () => () => {},
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
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, head, u } = _c;
            const endR = ctx.rng.fork('chrome/end'),
              endPlacement = ctx.finish ? null : endR.pick(['dock', 'dock', 'menu', 'title']),
              labels = (ctx.content && ctx.content.END_LABELS) || [
                'Submit',
                'Done',
                'Finish',
                'Continue',
                'Save',
                'OK',
                'Confirm',
                'Apply',
                'Complete',
              ];
            const pickedLabel = endR.bool(0.5) ? 'Submit' : endR.pick(labels);
            const endLabel = String((pickedLabel && (pickedLabel.label || pickedLabel.text)) || pickedLabel);
            const collideR = ctx.rng.fork('chrome/collide');
            _c.collide = null;
            if (!ctx.finish && collideR.bool(0.3)) {
              const choices = [...new Set(labels.map((x) => String((x && (x.label || x.text)) || x)))].filter(
                (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
              );
              if (choices.length) _c.collide = collideR.pick(choices);
            }
            const decoyBtn = (parent, label) => {
              const b = u.el('button', 'dock-button pqd-xtra', parent, label);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.onclick = () => env.log('decoy', { label, collide: true });
              return b;
            };
            if (!ctx.finish) {
              const parent = C.layout === 'three' && _c.aside ? _c.aside : footer;
              const reset = u.el('button', 'dock-button', parent, 'Reset');
              reset.type = 'button';
              reset.title = 'Restore the starting crop';
              reset.onclick = () => document.querySelector('.crop-reset')?.click();
              const help = u.el('button', 'dock-button help-button', parent, 'Help');
              help.type = 'button';
              help.title = 'Image Cropper help';
              const icon = u.svg(
                'svg',
                {
                  width: 28,
                  height: 28,
                  viewBox: '0 0 28 28',
                  fill: 'none',
                  stroke: 'currentColor',
                  'stroke-width': 1.8,
                },
                help,
              );
              u.svg('circle', { cx: 14, cy: 14, r: 10 }, icon);
              u.svg('path', { d: 'M7 7l4 4m10-4l-4 4M7 21l4-4m10 4l-4-4M14 10v8m-4-4h8' }, icon);
              help.prepend(icon);
              if (endPlacement === 'dock') {
                _c.submit = u.el('button', 'submit', parent, endLabel);
              } else if (endPlacement === 'menu') {
                _c.submit = u.el('button', 'submit human-end menu-end', head, endLabel);
              } else {
                _c.submit = u.el('button', 'submit human-end title-end', head, endLabel);
              }
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.onclick = () => ctx.submit();
              if (_c.collide) decoyBtn(endPlacement === 'dock' ? head.querySelector('.menu') : footer, _c.collide);
            }
            Object.assign(_c, { collideR, decoyBtn, endLabel, endPlacement, endR, labels, pickedLabel });
          },
      },
    },
  });
})();
