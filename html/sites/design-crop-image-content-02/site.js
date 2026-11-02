// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-content-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'newspaper',
        'theme': 'newspaper',
        'title': 'Riverton Daily News',
        'subtitle': 'Tuesday, March 15, 2011',
        'aside': 'Photos',
        'foot': '',
        'accent': '#a92222',
        'bg': '#fbfaf7',
        'surface': '#fff',
        'font': "Georgia, 'Times New Roman', serif",
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
            if (_c.display === 'hidden' || _c.display === 'panel') note.hidden = true;
            else if (_c.display === 'toast') {
              note.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', note, '×');
              x.onclick = () => (note.style.visibility = 'hidden');
            }
          },
        'frame.21': () =>
          function (_c) {
            const { content, instruction, stage, u } = _c;
            const bar = u.el('div', 'crop-window-title', stage);
            u.el('strong', '', bar, 'Crop Photo');
            const close = u.el('button', 'window-close', bar, '×');
            close.type = 'button';
            close.setAttribute('aria-label', 'Close');
            close.onclick = () => env.log('window-control', { label: 'close' });
            _c.aside = u.el('aside', 'aside', content);
            u.el('h3', '', _c.aside, 'Photos');
            const rows = [
              ['Mar 15, 2011', 'Harbor market signs', 'market'],
              ['Mar 14, 2011', 'City parade', 'parade'],
              ['Mar 12, 2011', 'Riverside construction', 'build'],
              ['Mar 10, 2011', 'Local teacher', 'teacher'],
              ['Mar 8, 2011', 'Spring flowers', 'flowers'],
              ['Mar 6, 2011', 'Downtown skyline', 'skyline'],
              ['Mar 3, 2011', 'High school basketball', 'basketball'],
              ['Mar 1, 2011', 'Winter weather', 'winter'],
            ];
            for (const [date, title, kind] of rows) {
              const row = u.el('div', 'photo-row', _c.aside);
              u.el('div', 'photo-thumb thumb-' + kind, row);
              const copy = u.el('div', 'photo-copy', row);
              u.el('div', 'photo-date', copy, date);
              u.el('div', 'photo-title', copy, title);
            }
            if (_c.display === 'panel') {
              _c.aside.classList.add('panel-mode');
              // Relocate the existing kit instruction element; never copy its goal text.
              instruction.classList.add('panel-instruction');
              _c.aside.append(instruction);
            }
            if (_c.display === 'hidden') _c.aside.classList.add('hidden-mode');
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
