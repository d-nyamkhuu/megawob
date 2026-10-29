// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  const S0 = (b) =>
    '<svg viewBox="0 0 32 32" width="30" height="30" fill="none" stroke="#3a3f80" stroke-width="2" stroke-linejoin="round">' +
    b +
    '</svg>';
  const ICO = {
    open: S0('<path d="M3 9h9l2 3h14v14H3z" fill="#e8cf7a"/><path d="M3 26l4-10h24l-4 10z" fill="#f4e19a"/>'),
    crop: S0('<rect x="6" y="6" width="20" height="20" stroke-dasharray="3 2"/><path d="M2 10h4M26 22h4M10 2v4M22 26v4"/>'),
    rotate: S0('<path d="M25 16a9 9 0 1 1-4-7.5"/><path d="M22 3v7h-7" fill="#3a3f80"/>'),
    flip: S0('<path d="M15 4v24M13 8L4 26h9zM19 8l9 18h-9z" fill="#aab0ec"/>'),
    zin: S0('<circle cx="14" cy="14" r="9" fill="#dfe3f8"/><path d="M21 21l8 8M10 14h8M14 10v8"/>'),
    zout: S0('<circle cx="14" cy="14" r="9" fill="#dfe3f8"/><path d="M21 21l8 8M10 14h8"/>'),
    fit: S0('<rect x="4" y="5" width="24" height="22" fill="#aab0ec"/><rect x="8" y="9" width="16" height="14" fill="#fff"/>'),
    select: S0('<path d="M8 3l16 14h-8l5 10-4 2-5-10-6 5z" fill="#3a3f80"/>'),
    adjust: S0('<circle cx="16" cy="16" r="6" fill="#aab0ec"/><path d="M16 2v5M16 25v5M2 16h5M25 16h5M6 6l3 3M23 23l3 3M26 6l-3 3M9 23l-3 3"/>'),
    filters: S0('<rect x="4" y="8" width="16" height="20" fill="#7d86d8"/><rect x="12" y="4" width="16" height="20" fill="#cfd4f4"/>'),
    eye: S0('<path d="M2 16c5-9 23-9 28 0-5 9-23 9-28 0z" fill="#fff"/><circle cx="16" cy="16" r="5" fill="#3a3f80"/>'),
  };
  env.site({
    name: 'design-crop-image-content-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'three',
        'theme': 'carbon-photo',
        'title': 'Image Studio',
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
              const menu = u.el('div', 'menubar', dock);
              for (const n of ['File', 'Edit', 'View', 'Image', 'Tools', 'Window', 'Help']) {
                const m = u.el('span', 'menu-item', menu);
                u.el('u', '', m, n[0]);
                m.append(n.slice(1));
              }
              const tb = u.el('div', 'toolbar', dock);
              const icons = [ICO.open, ICO.crop, ICO.rotate, ICO.flip, '', ICO.zin, ICO.zout, ICO.fit];
              for (const [i, n] of ['Open', 'Crop', 'Rotate', 'Flip', '', 'Zoom In', 'Zoom Out', 'Fit'].entries()) {
                if (!n) {
                  u.el('span', 'tb-sep', tb);
                  continue;
                }
                const t = u.el('button', i === 1 ? 'tb-btn current' : 'tb-btn', tb);
                t.type = 'button';
                u.el('span', 'tb-icon', t).innerHTML = icons[i];
                u.el('span', '', t, n);
              }
            }
            if (C.title) u.el('div', 'title', head, C.title);
            const wc = u.el('div', 'irix-wc', head);
            for (const g of ['▁', '▢', '✕']) u.el('span', '', wc, g);
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
            const { content, note, u } = _c;
            if (C.theme === 'carbon-photo') {
              const strip = u.el('div', 'crop-settings', content),
                ratio = u.el('div', 'ratio-control', strip);
              u.el('span', 'control-label', ratio, 'Aspect:');
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
              u.el('span', 'control-label', strip, 'W:');
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
              u.el('span', 'control-label', strip, 'H:');
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
              u.el('span', 'control-label', strip, 'px');
              width.value = '320';
              height.value = '112';
              const apply = u.el('button', 'apply-crop', strip, 'Apply crop');
              apply.type = 'button';
              apply.onclick = () => {
                const actual = document.querySelector('.cp-apply[data-role="apply"]');
                if (actual) actual.click();
              };
              const zi = u.el('span', 'zoom-ico', strip);
              zi.innerHTML = ICO.zout + ICO.zin;
              u.el('span', 'zoom-pct', strip, '100%　▾');
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
                const tools = card('Image Tools');
                for (const [i, n] of ['Select', 'Crop', 'Rotate', 'Adjust', 'Filters', 'Red Eye'].entries()) {
                  const row = u.el('div', i === 1 ? 'tool-row current' : 'tool-row', tools);
                  u.el('span', 'tool-ico', row).innerHTML = [ICO.select, ICO.crop, ICO.rotate, ICO.adjust, ICO.filters, ICO.eye][i];
                  u.el('span', '', row, n);
                }
                const help = card('Help & Tips');
                help.classList.add('help-card');
                const hb = u.el('div', 'help-box', help);
                for (const pos of ['0 0', '50% 0', '100% 0', '0 50%', '100% 50%', '0 100%', '50% 100%', '100% 100%']) {
                  const h = u.el('i', 'help-h', hb);
                  const [x, y] = pos.split(' ');
                  h.style.left = x;
                  h.style.top = y;
                }
                u.el('p', '', help, 'Drag the handles to resize the crop box.');
                u.el('p', '', help, 'Drag inside the box to move it.');
                u.el('p', '', help, 'You can also draw a new selection on the image.');
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
                } else if (C.layout === 'windows') u.el('p', '', _c.aside, 'Drag the handles to resize the crop box.');
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
              // Reuse the canonical instruction element rather than copying goal text.
              note.hidden = false;
              note.classList.add('panel-instruction');
              _c.aside.append(note);
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
