// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-content-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'three',
        'theme': 'fluent-photos',
        'title': 'Photos',
        'aside': 'Crop & rotate',
        'foot': '',
        'accent': '#0078d4',
        'bg': '#fafafa',
        'surface': '#fff',
        'font': "'Segoe UI', Arial, sans-serif",
        ribbon: true,
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
              fg: C.theme === 'developer' ? '#eff4ff' : '#161616',
              muted: C.theme === 'developer' ? '#8b9aaf' : '#606060',
              line: C.theme === 'developer' ? '#283544' : '#e2e2e2',
              accent: C.accent,
            }))
              root.style.setProperty('--' + k, v);
          },
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (
              ['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'fluent-photos'].includes(C.theme)
            ) {
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
            const { C } = S;
            const { head, shell, u } = _c;
            if (C.ribbon) {
              const old = head.querySelector('.ribbon');
              if (old) old.remove();
              const bar = u.el('nav', 'fluent-bar', head);
              const tabs = u.el('div', 'fluent-tabs', bar);
              for (const [i, [glyph, label]] of [
                ['▧', 'Gallery'],
                ['✎', 'Edit'],
                ['♧', 'Filters'],
                ['☷', 'Adjust'],
                ['⌑', 'Crop'],
              ].entries()) {
                const b = u.el('button', 'fluent-tab' + (i === 1 ? ' active' : ''), tabs);
                b.type = 'button';
                u.el('span', 'fluent-glyph', b, glyph);
                u.el('span', '', b, label);
                b.onclick = () => {
                  tabs.querySelectorAll('.fluent-tab').forEach((x) => x.classList.remove('active'));
                  b.classList.add('active');
                };
              }
              const tools = u.el('div', 'fluent-actions', bar);
              for (const glyph of ['↶', '↷', '⋯']) {
                const b = u.el('button', 'fluent-action', tools, glyph);
                b.type = 'button';
                b.onclick = () => env.log('decoy', { label: glyph });
              }
            }
            const content = u.el('div', 'content', shell),
              note = u.el('section', 'task-note', content);
            Object.assign(_c, { content, note });
          },
        'frame.18': (base, S) =>
          function (_c) {
            const { head, note, u } = _c;
            if (_c.display === 'hidden' || _c.display === 'panel') note.hidden = true;
            else if (_c.display === 'toast') {
              note.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', note, '×');
              x.onclick = () => (note.style.visibility = 'hidden');
            }
            if (_c.display === 'header' && !note.hidden) head.appendChild(note);
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, note, u } = _c;
            _c.aside = u.el('aside', 'aside', content);
            u.el('h3', '', _c.aside, C.aside);
            if (_c.aside && C.theme === 'fluent-photos') {
              const row = (title, cls = '') => {
                const r = u.el('div', 'inspector-row ' + cls, _c.aside);
                u.el('div', 'inspector-label', r, title);
                return r;
              };
              const aspect = row('Aspect ratio');
              const select = u.el('button', 'inspector-select', aspect);
              select.type = 'button';
              u.el('span', '', select, '▣');
              u.el('span', '', select, 'Freeform');
              u.el('span', 'select-chevron', select, '⌄');
              const rotate = row('Rotate', 'rotate-row');
              const range = u.el('div', 'fake-range', rotate);
              u.el('span', 'range-blue', range);
              u.el('span', 'range-knob', range);
              u.el('span', 'rotate-value', rotate, '0°');
              const actions = u.el('div', 'inspector-actions', _c.aside);
              for (const icon of ['↶', '↻', '◁▷', '↕']) {
                const b = u.el('button', 'inspector-icon', actions, icon);
                b.type = 'button';
              }
              const meta = row('Image size');
              u.el('div', 'image-size', meta, '3024 × 4032 px');
            }
            if (_c.display === 'panel' && _c.aside) {
              _c.aside.classList.add('panel-mode');
              // Keep the kit's instruction as the only goal-bearing element.
              note.hidden = false;
              note.classList.add('instruction-panel');
              _c.aside.appendChild(note);
            }
            if (_c.display === 'toast' && _c.aside) _c.aside.appendChild(_c.note);
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
                _c.label = 'OK';
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
              _c.label = 'OK';
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
