// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-marquee-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'kde',
        'theme': 'kde',
        'title': 'shapes.png — Gwenview',
        'aside': 'Images',
        'foot': '',
        'accent': '#008be8',
        'bg': '#eff3f6',
        'surface': '#f8fafb',
        'font': "Arial, 'Segoe UI', sans-serif",
        'menu': 'File     Edit     View     Go     Plugins     Settings     Help',
      },
      parts: {
        'frame.2': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx } = _c;
            _c.display = ctx.display || 'header';
            const size = ctx.size || {},
              width = size.width || size.w || document.documentElement.clientWidth;
            if ((_c.display === 'panel' || _c.display === 'toast') && width < 1260) _c.display = 'header';
            body.className =
              'design ' + C.theme + ' layout-' + C.layout + (_c.display === 'toast' ? ' has-instruction-toast' : '');
            Object.assign(_c, { size, width });
          },
        'frame.3': () => () => {},
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'kde'].includes(C.theme)) {
              const controls = u.el('div', 'window-controls', head);
              for (const label of ['−', '□', '×']) {
                const bt = u.el('button', '', controls, label);
                bt.type = 'button';
                bt.onclick = () => env.log('window-control', { label });
              }
            }
          },
        'frame.13': (base, S) =>
          function (_c) {
            const { shell, u } = _c;
            const rail = u.el('nav', 'kde-rail', shell);
            for (const [i, label] of ['Browse', 'View', 'Edit', 'Annotate', 'Crop', 'More'].entries()) {
              const item = u.el('button', 'rail-item' + (label === 'Crop' ? ' active' : ''), rail);
              item.type = 'button';
              const paths = [
                'M3 12L12 3L21 12M6 10V21H10V15H14V21H18V10',
                'M3 4H21V20H3ZM6 16L10 11L13 14L16 9L19 16',
                'M4 18L18 4L21 7L7 21H4Z',
                'M3 12Q12 2 21 12Q12 22 3 12Z',
                'M7 3V7H3V9H7V21H9V9H21V7H9V3ZM11 11V21H21V11H19V19H13V13H21V11Z',
                'M5 12H7M11 12H13M17 12H19',
              ];
              const svg = u.svg(
                'svg',
                {
                  width: 30,
                  height: 30,
                  viewBox: '0 0 24 24',
                  fill: 'none',
                  stroke: 'currentColor',
                  'stroke-width': 1.8,
                  'stroke-linecap': 'round',
                  'stroke-linejoin': 'round',
                },
                item,
              );
              u.svg('path', { d: paths[i] }, svg);
              u.el('span', '', item, label);
            }
            const content = u.el('div', 'content', shell),
              note = u.el('section', 'task-note', content);
            Object.assign(_c, { content, note, rail });
          },
        'frame.18': (base, S) =>
          function (_c) {
            const { note, u } = _c;
            if (_c.display === 'hidden' || _c.display === 'panel') note.hidden = true;
            else if (_c.display === 'toast') {
              note.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', note, '×');
              x.onclick = () => (note.style.visibility = 'hidden');
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, instruction, u } = _c;
            if (
              ['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger', 'kde'].includes(C.layout)
            ) {
              _c.aside = u.el('aside', 'aside', content);
              if (C.layout === 'kde') {
                u.el('h3', 'browser-heading', _c.aside, 'Images');
                u.el('div', 'fake-search', _c.aside, '⌕　 Search...　　⌕');
                const list = u.el('div', 'image-list', _c.aside);
                for (const [i, row] of [
                  'mountains.jpg',
                  'forest.jpg',
                  'beach.jpg',
                  'city.jpg',
                  'flowers.jpg',
                  'shapes.png',
                  'lake.jpg',
                  'desert.jpg',
                ].entries()) {
                  const card = u.el('div', 'image-row' + (row === 'shapes.png' ? ' selected' : ''), list);
                  const thumb = u.el('div', 'thumb thumb-' + i, card);
                  if (row === 'shapes.png') {
                    for (const c of ['blue', 'red', 'green', 'gold']) u.el('i', c, thumb);
                  }
                  const meta = u.el('div', 'image-meta', card);
                  u.el('strong', '', meta, row);
                  u.el('span', '', meta, row === 'shapes.png' ? '1536 × 1024' : '1920 × 1080');
                  u.el('span', '', meta, 'Mar ' + (i < 2 ? '3' : i < 4 ? '4' : i < 6 ? '5' : '6') + ', 2018');
                }
              } else if (C.tabs) {
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
                } else if (C.theme === 'crop-minimal' && _c.display !== 'hidden')
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
            if (_c.display === 'panel' && _c.aside) {
              _c.aside.classList.add('panel-mode');
              // Keep one instruction element across display modes, with no sidebar copy.
              instruction.classList.add('completion-note', 'panel-instruction');
              _c.aside.append(instruction);
            }
            if (_c.display === 'hidden' && _c.aside) _c.aside.classList.add('hidden-mode');
          },
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { ctx, footer, shell, u } = _c;
            const endRng = ctx.rng.fork('chrome/end'),
              labelBank = ctx.content && ctx.content.END_LABELS;
            const endLabels = (
              Array.isArray(labelBank) && labelBank.length
                ? labelBank
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
            ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
            ((_c.placement = null), (_c.label = null));
            if (!ctx.finish) {
              const common = [endRng.bool(0.5), endRng.bool(0.5), endRng.bool(0.5)].filter(Boolean).length >= 2;
              if (common) {
                _c.placement = 'aside';
                _c.label = 'Submit';
              } else {
                _c.placement = endRng.pick(['footer', 'link']);
                const alternatives = endLabels.filter((x) => String(x).trim().toLowerCase() !== 'submit');
                _c.label = endRng.pick(alternatives.length ? alternatives : endLabels);
              }
            }
            const collideRng = ctx.rng.fork('chrome/collide');
            _c.collide = null;
            if (!ctx.finish && collideRng.bool(0.3)) {
              const options = [
                ...new Set(
                  endLabels.filter((x) => String(x).trim().toLowerCase() !== String(_c.label).trim().toLowerCase()),
                ),
              ];
              if (options.length) _c.collide = collideRng.pick(options);
            }
            _c.submit = null;
            const makeSubmit = (parent, cls, text) => {
              const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
              if (b.tagName === 'BUTTON') b.type = 'button';
              else b.href = '#';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', _c.label);
              b.title = _c.label;
              b.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
              return b;
            };
            if (_c.placement === 'aside' && _c.aside) _c.submit = makeSubmit(shell, 'submit placed-aside', _c.label);
            else if (_c.placement === 'footer') _c.submit = makeSubmit(shell, 'submit placed-footer', _c.label);
            else if (_c.placement === 'link') _c.submit = makeSubmit(shell, 'end-link', _c.label + ' ›');
            if (!ctx.finish && _c.aside && (!_c.submit || !_c.submit.isConnected || _c.submit.closest('[hidden]'))) {
              if (_c.submit) _c.submit.remove();
              _c.placement = 'aside';
              _c.label = 'Submit';
              _c.submit = makeSubmit(shell, 'submit placed-aside', _c.label);
            }
            if (_c.collide) {
              const parent = _c.aside || footer;
              const b = u.el('button', 'end-xtra', parent, _c.collide);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.onclick = () => env.log('decoy', { label: _c.collide, collide: true });
            }
            footer.hidden = true;
            Object.assign(_c, { collideRng, endLabels, endRng, labelBank, makeSubmit });
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
