// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-content-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'three',
        'theme': 'carbon-photo',
        'title': 'Photo Editor',
        'aside': '',
        'foot': '',
        'accent': '#eeeeef',
        'bg': '#232526',
        'surface': '#191b1c',
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
              'design ' + C.theme + ' layout-' + C.layout + (_c.display === 'toast' ? ' has-instruction-toast' : '');
            Object.assign(_c, { size, width });
          },
        'frame.3': () => () => {},
        'frame.5': (base, S) =>
          function (_c) {
            const { C } = S;
            const { root } = _c;
            for (const [k, v] of Object.entries({
              bg: C.bg,
              panel: C.surface,
              fg: '#eeeeef',
              muted: '#c2c4c7',
              line: '#55595c',
              accent: C.accent,
            }))
              root.style.setProperty('--' + k, v);
          },
        'frame.9': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, shell, u } = _c;
            if (C.theme === 'carbon-photo') {
              const dock = u.el('nav', 'photo-dock', shell);
              for (const [i, n] of ['Photos', 'Adjust', 'Effects', 'Crop', 'Rotate'].entries()) {
                const t = u.el('button', i === 0 ? 'dock-tab active' : i === 3 ? 'dock-tab current' : 'dock-tab', dock);
                t.type = 'button';
                u.el('span', 'dock-icon', t, ['▧', '☼', '●', '⌗', '↻'][i]);
                u.el('span', '', t, n);
              }
            }
            if (C.title) u.el('div', 'title', head, C.title);
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
        'frame.21': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, instruction, u } = _c;
            if (C.theme === 'carbon-photo') {
              const strip = u.el('div', 'crop-settings', content),
                ratio = u.el('div', 'ratio-control', strip);
              u.el('span', 'control-label', ratio, 'Aspect Ratio:');
              const preset = u.el('button', 'fake-select', ratio, 'Freeform　▾');
              preset.type = 'button';
              preset.setAttribute('aria-label', 'Aspect ratio');
              const ratios = ['Freeform', '1:1', '4:3', '16:9', '3:2'];
              let ri = 0;
              preset.onclick = () => {
                ri = (ri + 1) % ratios.length;
                preset.textContent = ratios[ri] + '　▾';
                const real = [...document.querySelectorAll('.cp-chip[data-role="preset"]')].find(
                  (x) => x.textContent.toLowerCase() === ratios[ri].toLowerCase(),
                );
                if (real) real.click();
              };
              u.el('span', 'control-label', strip, 'Width:');
              const width = u.el('input', 'fake-input', strip);
              width.type = 'text';
              width.inputMode = 'numeric';
              width.setAttribute('aria-label', 'Crop width');
              const link = u.el('button', 'chain-link', strip, '↔');
              link.type = 'button';
              link.setAttribute('aria-label', 'Lock aspect ratio');
              link.setAttribute('aria-pressed', 'true');
              let linked = true;
              link.onclick = () => {
                linked = !linked;
                link.setAttribute('aria-pressed', String(linked));
                link.classList.toggle('locked', linked);
              };
              let ratioWH = 1;
              width.addEventListener('change', () => {
                const n = Number(width.value);
                if (n > 0 && linked) height.value = String(Math.round(n / ratioWH));
              });
              u.el('span', 'control-label', strip, 'Height:');
              const height = u.el('input', 'fake-input', strip);
              height.type = 'text';
              height.inputMode = 'numeric';
              height.setAttribute('aria-label', 'Crop height');
              height.addEventListener('change', () => {
                const n = Number(height.value);
                if (n > 0 && linked) width.value = String(Math.round(n * ratioWH));
              });
              width.addEventListener('focus', () => {
                if (Number(width.value) > 0 && Number(height.value) > 0)
                  ratioWH = Number(width.value) / Number(height.value);
              });
              height.addEventListener('focus', () => {
                if (Number(width.value) > 0 && Number(height.value) > 0)
                  ratioWH = Number(width.value) / Number(height.value);
              });
              const apply = u.el('button', 'apply-crop', strip, 'Apply Crop');
              apply.type = 'button';
              apply.onclick = () => {
                const actual = document.querySelector('.cp-apply[data-role="apply"]');
                if (actual) actual.click();
              };
            }
            _c.aside = null;
            if (['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger'].includes(C.layout)) {
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
              } else if (C.theme === 'carbon-photo') {
                const card = (title) => {
                  const c = u.el('section', 'stats-card', _c.aside);
                  u.el('h3', '', c, title);
                  return c;
                };
                const preview = card('Crop Preview'),
                  thumb = u.el('div', 'preview-image', preview);
                const cropPreview = u.el('canvas', 'preview-crop', thumb);
                cropPreview.setAttribute('aria-label', 'Current crop preview');
                const props = card('Image Properties'),
                  rows = [
                    ['Dimensions', '3072 × 2048'],
                    ['File Size', '2.4 MB'],
                    ['Format', 'JPEG'],
                  ];
                for (const [a, b] of rows) {
                  const row = u.el('div', 'property-row', props);
                  u.el('span', '', row, a + ':');
                  u.el('span', '', row, b);
                }
                const sel = card('Selection');
                for (const a of ['X', 'Y', 'Width', 'Height']) {
                  const row = u.el('div', 'property-row', sel);
                  u.el('span', '', row, a + ':');
                  const value = u.el('span', '', row, '—');
                  value.dataset.cropMeasure = a;
                }
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
                } else if (C.layout === 'windows') u.el('p', '', _c.aside, 'Image editing tools');
                else if (C.theme === 'crop-minimal' && _c.display !== 'hidden')
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
              // Keep the single instruction element; panel mode only changes its location.
              instruction.classList.add('panel-instruction');
              _c.aside.append(instruction);
            }
            if (_c.display === 'hidden' && _c.aside) _c.aside.classList.add('hidden-mode');
          },
        'frame.22': () => () => {},
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
