// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-single-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'windows',
        'theme': 'bitmap',
        'title': 'Shape Task',
        'subtitle': '',
        'menu': 'Desk     File     Edit     View     Options',
        'aside': 'Help',
        'foot': '',
        'accent': '#111',
        'bg': '#087b38',
        'surface': '#eee',
        'font': 'monospace',
      },
      parts: {
        'frame.2': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx } = _c;
            body.className =
              'design ' +
              C.theme +
              ' layout-' +
              C.layout +
              ' instruction-mode-' +
              ctx.display +
              (ctx.display === 'toast' ? ' has-instruction-toast' : '');
          },
        'frame.3': () => () => {},
        'frame.13': (base, S) =>
          function (_c) {
            const { shell, u } = _c;
            const content = u.el('div', 'content', shell);
            u.el('div', 'gem-titlebar', content);
            const note = u.el('section', 'task-note', content);
            Object.assign(_c, { content, note });
          },
        'frame.17': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, note, u } = _c;
            if (C.theme === 'minimal') {
              const shape =
                (ctx.plainInstruction || ctx.instruction)
                  .match(/\b(circle|square|triangle|diamond|hexagon|star)\b/i)?.[0]
                  .toLowerCase() || 'shape';
              const color = (ctx.plainInstruction || ctx.instruction)
                .match(/\b(blue|red|green|yellow|orange|purple|pink|cyan|teal|brown|gray)\b/i)?.[0]
                .toLowerCase();
              const target = color ? color + ' ' + shape : shape;
              const steps = u.el('ol', 'steps', note);
              for (const text of [
                'Drag the ' + target + ' from its current position.',
                'Drop it inside the rectangular box.',
                'The ' + shape + ' must fit fully inside the box.',
              ])
                u.el('li', '', steps, text);
              u.el('h3', '', note, 'Notes');
              const nl = u.el('ul', 'notes-list', note);
              for (const text of [
                'Use your mouse or trackpad (pointer) to move the ' + shape + '.',
                'Do not resize the shape.',
                'The ' + shape + ' must be completely inside the box, not touching or outside the borders.',
              ])
                u.el('li', '', nl, text);
            }
          },
        'frame.22': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { ctx, footer, shell, u } = _c;
            const er = ctx.rng.fork('chrome/end'),
              cr = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endWords = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = er.bool(0.5),
              placement = referenceEnd ? 'footer' : er.pick(['footer-left', 'titlebar']);
            const label = referenceEnd ? 'Submit' : er.pick(endWords);
            _c.submit = null;
            if (!ctx.finish) {
              const parent = placement === 'titlebar' ? shell : footer;
              _c.submit = u.el('button', 'submit gem-end-' + placement, parent, label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = label;
              _c.submit.setAttribute('aria-label', label);
              _c.submit.onclick = () => ctx.submit();
            }
            if (cr.bool(0.3)) {
              const pool = endWords.filter((word) => word.trim().toLowerCase() !== label.trim().toLowerCase());
              if (pool.length) {
                const word = cr.pick(pool),
                  decoy = u.el('button', 'gem-xtra', footer, word);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label: word, collide: true });
                if (placement === 'footer-left' && !ctx.finish) decoy.classList.add('gem-xtra-right');
              }
            }
            if (!footer.querySelector('button')) footer.hidden = true;
            Object.assign(_c, { cr, endWords, er, label, labelOf, placement, referenceEnd });
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
