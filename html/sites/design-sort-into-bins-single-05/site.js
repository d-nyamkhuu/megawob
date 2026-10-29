// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-single-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'risograph',
        'theme': 'risograph',
        'title': '',
        'subtitle': '',
        'foot': '',
        'accent': '#12605c',
        'bg': '#fbf5e8',
        'surface': '#fff9ed',
        'font': "Georgia, 'Times New Roman', serif",
      },
      parts: {
        'frame.3': () => () => {},
        'frame.14': (base, S) =>
          function (_c) {
            const { note, u } = _c;
            u.el('div', 'note-label', note, '');
          },
        'frame.16': (base, S) =>
          function (_c) {
            const { body, ctx, note } = _c;
            if (ctx.display === 'hidden') {
              note.hidden = true;
              body.classList.add('instruction-hidden');
            } else if (ctx.display === 'toast') {
              note.hidden = true;
              body.classList.add('instruction-toast-mode');
            } else if (ctx.display === 'panel') {
              note.hidden = true;
              body.classList.add('instruction-panel-mode');
            }
          },
        'frame.17': () => () => {},
        'frame.18': () => () => {},
        'frame.22': (base, S) =>
          function (_c) {
            const { content, ctx, instruction, u } = _c;
            _c.aside = u.el('aside', 'aside', content);
            u.el('h2', '', _c.aside, 'Instructions');
            u.el(
              'p',
              'aside-copy',
              _c.aside,
              'Drag shapes to reposition them. Release the pointer to leave a shape in place.',
            );
            // Relocate the frame's sole instruction element; never paraphrase the goal.
            if (ctx.display === 'panel' || ctx.display === 'toast') {
              instruction.classList.add('aside-instruction');
              if (ctx.display === 'toast') instruction.classList.add('aside-toast');
              _c.aside.append(instruction);
            }
          },
        'frame.23': () => () => {},
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, u } = _c;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end'),
                placement = er.pick(['bottom', 'bottom', 'center', 'link']);
              const bank =
                Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                  ? ctx.content.END_LABELS
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
              let label = 'Submit';
              if (placement !== 'bottom') {
                const pick = er.pick(bank);
                label = typeof pick === 'string' ? pick : pick.label || pick.text || pick.name || String(pick);
              }
              const parent = (C.layout === 'three' || C.layout === 'risograph') && _c.aside ? _c.aside : footer;
              _c.submit = u.el(placement === 'link' ? 'a' : 'button', 'submit submit-' + placement, parent, label);
              if (_c.submit.tagName === 'BUTTON') _c.submit.type = 'button';
              else _c.submit.href = '#';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', label);
              _c.submit.title = label;
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
              if (C.layout === 'risograph') {
                const cr = ctx.rng.fork('chrome/collide');
                if (cr.bool(0.3)) {
                  const labels = bank.map((x) =>
                    typeof x === 'string' ? x : x.label || x.text || x.name || String(x),
                  );
                  const alternatives = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
                  if (alternatives.length) {
                    const d = u.el('button', 'xtra-end', _c.aside, cr.pick(alternatives));
                    d.type = 'button';
                    d.dataset.role = 'xtra';
                    d.onclick = () => env.log('decoy', { label: d.textContent, collide: true });
                  }
                }
              }
            }
          },
      },
    },
  });
})();
