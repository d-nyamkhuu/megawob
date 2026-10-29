// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-aspect-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'three',
        'theme': 'neo-crop',
        'title': '',
        'aside': 'Images',
        'foot': '',
        'accent': '#ffd900',
        'bg': '#f4f2eb',
        'surface': '#fff',
        'font': "'Courier New', monospace",
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
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, note, u } = _c;
            _c.aside = u.el('aside', 'aside', content);
            u.el('h3', '', _c.aside, C.aside);
            // Reuse the frame's sole instruction element for panel mode.
            if (_c.display === 'panel') {
              _c.aside.classList.add('panel-mode');
              note.classList.add('instruction-panel');
              _c.aside.append(note);
            }
            const files = [
              ['shapes.jpg', '4000 × 3000', '2.1 MB'],
              ['mountain.jpg', '4000 × 2667', '3.4 MB'],
              ['dog.jpg', '3000 × 2000', '1.8 MB'],
              ['beach.jpg', '3840 × 2560', '2.9 MB'],
              ['city.jpg', '4096 × 2731', '3.6 MB'],
            ];
            for (let i = 0; i < files.length; i++) {
              const row = u.el('div', 'media-item' + (i === 0 ? ' selected' : ''), _c.aside);
              u.el('div', 'media-thumb thumb-' + i, row);
              const detail = u.el('div', 'media-detail', row);
              u.el('strong', '', detail, files[i][0]);
              u.el('span', '', detail, files[i][1]);
              u.el('span', '', detail, files[i][2]);
            }
            if (_c.display === 'hidden') _c.aside.classList.add('hidden-mode');
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
        'frame.30': (base, S) =>
          function (_c) {
            const { C } = S;
            const { footer, stage, u } = _c;
            if (C.theme === 'neo-crop') {
              footer.classList.add('app-dock');
              const entries = [
                ['Library', 'M4 4h16v16H4z M7 17l4-5 3 3 2-2 4 4 M9 9h.1'],
                ['Edit', 'M4 7h16 M4 12h16 M4 17h16 M9 5v4 M16 10v4 M7 15v4'],
                ['Projects', 'M12 3 21 8 12 13 3 8z M3 12l9 5 9-5 M3 16l9 5 9-5'],
                ['Assets', 'M20 11 11 20 3 12V4h8z M7 8h.1'],
                [
                  'Settings',
                  'M12 3v3 M12 18v3 M3 12h3 M18 12h3 M5.6 5.6l2.1 2.1 M16.3 16.3l2.1 2.1 M18.4 5.6l-2.1 2.1 M7.7 16.3l-2.1 2.1 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
                ],
              ];
              for (const [i, [name, path]] of entries.entries()) {
                const item = u.el('div', 'dock-item' + (i === 0 ? ' active' : ''), footer);
                const icon = u.svg('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, item);
                u.svg('path', { d: path }, icon);
                u.el('span', '', item, name);
              }
            }
            return { stage, submit: _c.submit };
          },
      },
    },
  });
})();
