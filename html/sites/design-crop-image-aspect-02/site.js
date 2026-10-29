// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-aspect-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'windows',
        'theme': 'bitmap',
        'title': 'Image Editor',
        'menu': '◆     File     Edit     View     Image     Selection     Filters     Window     Help',
        'ribbon': true,
        'aside': 'Image Properties',
        'foot': '',
        'accent': '#111',
        'bg': '#d0d0d0',
        'surface': '#fff',
        'font': 'Arial, sans-serif',
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
              'design ' + C.theme + ' layout-' + C.layout + (_c.display === 'toast' ? ' has-instruction-toast' : _c.display === 'header' ? ' has-instruction-header' : '');
            Object.assign(_c, { size, width });
          },
        'frame.3': () => () => {},
        'frame.13': (base, S) =>
          function (_c) {
            const { C } = S;
            const { shell, u } = _c;
            if (C.theme === 'bitmap' && C.ribbon) {
              const rib = shell.querySelector('.ribbon');
              if (rib) {
                rib.replaceChildren();
                const gr = u.el('div', 'tool-group bitmap-tools', rib);
                const paths = [
                  ['Selection', 'M5 5H27V27H5ZM9 9V23H23V9Z'],
                  [
                    'Hand',
                    'M12 27L5 17Q3 13 7 12L12 17V5Q12 2 15 2Q18 2 18 5V14V7Q18 4 21 4Q24 4 24 7V15V10Q24 7 27 7Q30 7 30 10V21Q30 29 22 30H17Q14 30 12 27Z',
                  ],
                  ['Crop', 'M8 4V24H28M4 8H24V28M11 21L24 8M19 8H24V13'],
                  ['Line', 'M5 27L27 5M4 24L8 28M24 4L28 8'],
                  ['Text', 'M5 6H27M16 6V27M11 27H21'],
                  ['Zoom', 'M22 22L30 30M25 14A11 11 0 1 1 3 14A11 11 0 1 1 25 14M8 14H20M14 8V20'],
                ];
                for (const [label, path] of paths) {
                  const b = u.el('button', 'tool', gr);
                  b.type = 'button';
                  b.title = label;
                  b.setAttribute('aria-label', label);
                  u.svg(
                    'svg',
                    {
                      width: 34,
                      height: 34,
                      viewBox: '0 0 32 32',
                      fill: 'none',
                      stroke: 'currentColor',
                      'stroke-width': 2.2,
                      'stroke-linecap': 'square',
                      'stroke-linejoin': 'miter',
                    },
                    b,
                  );
                  u.svg('path', { d: path }, b.firstChild);
                  if (label === 'Selection') b.firstChild.firstChild.setAttribute('stroke-dasharray', '3 2');
                  b.onclick = () => {
                    gr.querySelectorAll('.tool').forEach((x) => x.classList.remove('selected'));
                    b.classList.add('selected');
                  };
                }
              }
              const menu = shell.querySelector('.menu');
              if (menu) {
                menu.firstChild.textContent = menu.firstChild.textContent.replace('◆', '');
                const mark = u.svg(
                  'svg',
                  { width: 24, height: 26, viewBox: '0 0 24 26', fill: '#111', class: 'mac-mark' },
                  menu,
                );
                u.svg(
                  'path',
                  {
                    d: 'M12 6C9 2 11 0 15 0C15 3 14 5 12 6ZM7 7C2 7 1 12 3 18C5 24 8 26 12 23C15 26 19 24 21 18C23 12 21 7 17 7C15 7 13 8 12 8C10 8 9 7 7 7Z',
                  },
                  mark,
                );
                menu.insertBefore(mark, menu.firstChild);
              }
            }
            const content = u.el('div', 'content', shell),
              note = u.el('section', 'task-note', content);
            Object.assign(_c, { content, note });
          },
        'frame.18': (base, S) =>
          function (_c) {
            const { note, u } = _c;
            if (_c.display === 'hidden') note.hidden = true;
            else if (_c.display === 'toast') {
              note.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', note, '×');
              x.onclick = () => (note.style.visibility = 'hidden');
            }
          },
        'frame.22': () =>
          function (_c) {
            const { content, note, u } = _c;
            const aside = _c.aside = u.el('aside', 'aside', content);
            u.el('h3', '', aside, 'Image Properties');
            for (const [k, v] of [
              ['File Name', 'shapes.png'],
              ['Dimensions', '768 × 1,024'],
              ['Color Mode', 'RGB'],
              ['File Size', '317 KB'],
            ]) {
              const p = u.el('p', 'property-row', aside);
              u.el('span', '', p, k + ':');
              u.el('span', '', p, v);
            }
            u.el('hr', '', aside);
            u.el('h3', 'section-title', aside, '▾  Crop Selection');
            // The widget fills these with the current selection, never the requested crop.
            for (const k of ['X', 'Y', 'Width', 'Height']) {
              const p = u.el('p', 'property-row', aside);
              u.el('span', '', p, k + ':');
              u.el('span', '', p, '—');
            }
            u.el('hr', '', aside);
            u.el('p', 'property-row', aside, 'Aspect Ratio:     —');
            u.el('hr', '', aside);
            u.el('h3', 'section-title', aside, '▾  Image Adjustments');
            for (const k of ['Brightness', 'Contrast', 'Saturation']) {
              const p = u.el('p', 'property-row adjustment', aside);
              u.el('span', '', p, k + ':');
              u.el('span', 'range', p, '━━━━┫━━━━');
              u.el('span', '', p, '0');
            }
            if (_c.display === 'panel') {
              aside.classList.add('panel-mode');
              note.classList.add('instruction-panel');
              // Move the official instruction element instead of creating another copy.
              aside.append(note);
            }
            if (_c.display === 'hidden') aside.classList.add('hidden-mode');
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
