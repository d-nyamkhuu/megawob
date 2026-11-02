// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-range-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'palette',
        'theme': 'collage',
        'title': 'Tonal Adjuster',
        'subtitle': 'Fine-tune the playback speed range for your selection.',
        'aside': 'Quick Guide',
        'foot': '',
        'accent': '#ff7d15',
        'bg': '#edf0f5',
        'surface': '#fff',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            {
              const pj = u.el('div', 'project', head, 'Project 1');
              const sv = u.svg(
                'svg',
                {
                  width: 16,
                  height: 16,
                  viewBox: '0 0 16 16',
                  fill: 'none',
                  stroke: 'currentColor',
                  'stroke-width': 1.8,
                },
                pj,
              );
              u.svg('path', { d: 'M3 6l5 5 5-5' }, sv);
            }
            if (C.menu) u.el('nav', 'menu', head, C.menu);
          },
        'frame.14': (base, S) =>
          function (_c) {
            const { note, u } = _c;
            u.el('div', 'note-label', note, '');
            u.el('div', 'note-icon', note, '!');
          },
        'frame.19': (base, S) =>
          function (_c) {
            const { content, ctx, instruction, u } = _c;
            const parts = ctx.instruction.split(/(\d+(?:\.\d+)?|\.\s+(?=[A-Z]))/);
            instruction.replaceChildren();
            for (const part of parts) {
              if (/^\d/.test(part)) u.el('span', 'instruction-value', instruction, part);
              else if (/^\.\s+$/.test(part)) {
                instruction.append(document.createTextNode('.'));
                u.el('br', '', instruction);
              } else instruction.append(document.createTextNode(part));
            }
            const stage = u.el('main', 'stage', content);
            Object.assign(_c, { parts, stage });
          },
        'frame.22': () => () => {},
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx, footer, head, instruction, note, u } = _c;
            const endRng = ctx.rng.fork('chrome/end'),
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
                "I'm done",
              ];
            ((_c.placement = 'footer'), (_c.endLabel = 'Submit'));
            if (!ctx.finish && endRng.bool(0.5)) {
              _c.placement = endRng.pick(['header', 'footer-link', 'footer-icon']);
              const picked = endRng.pick(labels);
              _c.endLabel =
                typeof picked === 'string' ? picked : picked.label || picked.text || picked.name || String(picked);
            }
            const endButton = (parent, cls, label, shown) => {
              const b = u.el('button', cls, parent, shown);
              b.type = 'button';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', label);
              b.title = label;
              b.onclick = () => ctx.submit();
              return b;
            };
            if (!ctx.finish) {
              if (_c.placement === 'footer') _c.submit = endButton(footer, 'submit', 'Submit', 'Submit');
              else if (_c.placement === 'header')
                _c.submit = endButton(head, 'palette-header-end', _c.endLabel, _c.endLabel);
              else if (_c.placement === 'footer-link')
                _c.submit = endButton(footer, 'palette-end-link', _c.endLabel + ' ›', _c.endLabel + ' ›');
              else _c.submit = endButton(footer, 'submit palette-end-icon', _c.endLabel, '✓');
            }
            if (ctx.display === 'panel' && _c.aside) {
              note.hidden = true;
              body.classList.add('palette-panel-mode');
              const panel = u.el('section', 'palette-instruction-panel', _c.aside);
              u.el('h4', '', panel, 'Your task');
              instruction.classList.add('palette-panel-copy');
              panel.appendChild(instruction);
              _c.aside.insertBefore(panel, _c.aside.querySelector('.guide'));
            }
            if (ctx.display === 'toast' && !note.hidden) note.classList.add('palette-toast-mode');
            if (!ctx.finish) {
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const norm = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
                const own = _c.endLabel.trim().toLowerCase(),
                  choices = labels
                    .map(norm)
                    .filter(
                      (x, i, a) =>
                        x.trim().toLowerCase() !== own &&
                        a.findIndex((y) => y.trim().toLowerCase() === x.trim().toLowerCase()) === i,
                    );
                if (choices.length) {
                  const label = cr.pick(choices),
                    where = cr.pick(['header', 'footer']);
                  const parent = where === 'header' ? head : footer;
                  const d = u.el('button', 'palette-xtra', parent, label);
                  d.type = 'button';
                  d.dataset.role = 'xtra';
                  d.onclick = () => env.log('decoy', { label, collide: true });
                }
              }
            }
            if (C.theme === 'eink') {
              const points = u.el('span', 'points', footer, 'Points: 0/1');
              footer.insertBefore(points, _c.submit && _c.submit.parentNode === footer ? _c.submit : null);
              const clear = u.el('button', 'clear', footer, 'Clear');
              clear.onclick = () => {
                env.widgetDef.clear?.();
              };
            }
            if (['aqua', 'collage'].includes(C.theme)) {
              const reset = u.el('button', 'clear', footer, C.theme === 'aqua' ? 'Reset Panel' : 'Reset');
              reset.onclick = () => env.widgetDef.clear?.();
              if (_c.submit && _c.submit.parentNode === footer) footer.insertBefore(reset, _c.submit);
            }
            Object.assign(_c, { endButton, endRng, labels });
          },
        'frame.28': () => () => {},
        'frame.29': () => () => {},
      },
    },
  });
})();
