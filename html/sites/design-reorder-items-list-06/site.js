// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-reorder-items-list-06',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'left',
        'theme': 'memphis',
        'title': 'List Sorter',
        'foot': '',
        'accent': '#ff867b',
        'bg': '#fbf5e8',
        'surface': '#fbf5e8',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.9': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            {
              const hb = u.el('div', 'metro-burger', head);
              for (let i = 0; i < 3; i++) u.el('i', '', hb);
            }
            if (C.title) u.el('div', 'title', head, C.title);
            {
              const wc = u.el('div', 'metro-wc', head);
              u.el('span', 'wc-min', wc);
              u.el('span', 'wc-max', wc);
              u.el('span', 'wc-close', wc);
            }
            if (C.subtitle) u.el('div', 'subtitle', head, C.subtitle);
          },
        'frame.10': () => () => {},
        'frame.16': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, instruction, note, u } = _c;
            if (ctx.instruction.length > 50) instruction.classList.add('long-instruction');
            if (C.theme === 'memphis') {
              u.el('h1', 'brief-title', note, C.title);
              note.prepend(note.lastChild);
              u.el(
                'p',
                'brief-copy',
                note,
                'Drag and drop the months on the right to arrange them from January to December.',
              );
            }
          },
        'frame.27': (base, S) =>
          function (_c) {
            const { ctx, footer, head, u } = _c;
            _c.endPlacement = null;
            _c.endText = 'Submit';
            _c.collide = null;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              _c.endPlacement = er.pick(['footer', 'footer', 'footer-link', 'header']);
              const labels =
                ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                  ? ctx.content.END_LABELS
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
              const labelText = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
              const alternatives = labels.filter((x) => labelText(x).trim().toLowerCase() !== 'submit');
              _c.endText = er.bool(0.5) || !alternatives.length ? 'Submit' : labelText(er.pick(alternatives));
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const options = [...new Set(labels.map(labelText))].filter(
                  (x) => x.trim().toLowerCase() !== _c.endText.trim().toLowerCase(),
                );
                if (options.length) _c.collide = cr.pick(options);
              }
              const parent = _c.endPlacement === 'header' ? head : footer;
              if (_c.endPlacement === 'footer-link') {
                _c.submit = u.el('a', 'metro-end-link', footer, _c.endText + ' ›');
                _c.submit.href = '#';
              } else {
                _c.submit = u.el(
                  'button',
                  _c.endPlacement === 'header' ? 'metro-end-top' : 'submit',
                  parent,
                  _c.endText,
                );
                _c.submit.type = 'button';
              }
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', _c.endText);
              _c.submit.title = _c.endText;
              _c.submit.onclick = (e) => {
                if (e) e.preventDefault();
                ctx.submit();
              };
            }
          },
        'frame.30': (base, S) =>
          function (_c) {
            const { footer, head, stage, u } = _c;
            {
              const mk = (label, cls) => {
                const b = u.el('button', cls, footer, label);
                b.type = 'button';
                b.onclick = () => env.widgetDef.clear?.();
                return b;
              };
              const ca = mk('Clear All', 'metro-btn clear-all');
              const rs = mk('Reset', 'metro-btn reset');
              footer.insertBefore(ca, footer.firstChild);
              if (_c.submit && _c.endPlacement !== 'header') footer.insertBefore(rs, _c.submit);
            }
            if (_c.collide) {
              const parent = _c.endPlacement === 'header' ? footer : head;
              const d = u.el(
                'button',
                parent === head ? 'metro-xtra metro-xtra-top' : 'metro-xtra',
                parent,
                _c.collide,
              );
              d.type = 'button';
              d.dataset.role = 'xtra';
              d.onclick = () => env.log('decoy', { label: _c.collide, collide: true });
              if (
                parent === footer &&
                _c.submit &&
                _c.submit.parentElement === footer &&
                _c.endPlacement !== 'footer-link'
              )
                footer.insertBefore(d, _c.submit);
            }
            return { stage, submit: _c.submit };
          },
      },
    },
  });
})();
