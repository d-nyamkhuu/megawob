// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-aspect-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'croprail',
        'theme': 'crop-minimal',
        'title': '',
        'aside': 'Image Info',
        'foot': '',
        'accent': '#2575d9',
        'bg': '#c9d9eb',
        'surface': '#eef3f9',
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
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, shell, u } = _c;
            const rail = u.el('nav', 'app-rail', shell);
            u.el('div', 'brand-mark', rail, '▣');
            u.el('strong', 'brand-name', rail, 'PhotoStudio');
            for (const [icon, label] of [
              ['▰', 'Library'],
              ['◩', 'Edit'],
              ['✦', 'Effects'],
              ['T', 'Text'],
              ['↗', 'Export'],
            ]) {
              const item = u.el('div', 'rail-item' + (label === 'Edit' ? ' active' : ''), rail);
              u.el('b', 'rail-icon', item, icon);
              u.el('span', '', item, label);
            }
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk'].includes(C.theme)) {
              const controls = u.el('div', 'window-controls', head);
              for (const label of ['−', '□', '×']) {
                const bt = u.el('button', '', controls, label);
                bt.type = 'button';
                bt.onclick = () => env.log('window-control', { label });
              }
            }
            Object.assign(_c, { rail });
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
            const aside = (_c.aside = u.el('aside', 'aside', content));
            u.el('h3', '', aside, C.aside);
            for (const [label, value] of [
              ['File Name:', 'shapes.png'],
              ['Dimensions:', '1024 × 768'],
              ['File Size:', '87 KB'],
              ['Type:', 'PNG Image'],
            ]) {
              const p = u.el('p', 'info-line', aside);
              u.el('span', '', p, label);
              u.el('strong', '', p, value);
            }
            u.el('hr', '', aside);
            u.el('h3', 'elements-title', aside, 'Elements');
            for (const [icon, name] of [
              ['▲', 'Triangles'],
              ['●', 'Circles'],
              ['■', 'Squares'],
              ['★', 'Stars'],
            ]) {
              const row = u.el('div', 'element-count', aside);
              u.el('i', 'count-icon', row, icon);
              u.el('span', '', row, name);
              u.el('b', '', row, '1');
            }
            if (_c.display === 'panel') {
              aside.classList.add('panel-mode');
              // Relocate the sole instruction element instead of copying its goal text.
              instruction.classList.add('panel-instruction');
              aside.append(instruction);
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
