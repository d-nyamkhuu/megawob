// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-single-10',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'stack',
        'theme': 'yosemite',
        'title': 'Shape Practice',
        'subtitle': '',
        'foot': '',
        'accent': '#1684f8',
        'bg': '#fff',
        'surface': '#fff',
        'font': 'Arial, Helvetica, sans-serif',
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
              (ctx.display === 'toast' ? ' has-instruction-toast' : '') +
              (ctx.display === 'hidden' ? ' instr-hidden' : '') +
              (ctx.display === 'panel' ? ' instr-panel' : '');
          },
        'frame.3': () => () => {},
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'yosemite'].includes(C.theme)) {
              const controls = u.el('div', 'window-controls', head);
              for (const label of ['−', '□', '×']) {
                const bt = u.el('button', '', controls, label);
                bt.type = 'button';
                bt.onclick = () => env.log('window-control', { label });
              }
            }
          },
        'frame.14': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, note, u } = _c;
            u.el('div', 'note-label', note, C.layout === 'left' || ctx.display === 'panel' ? 'Task' : '');
          },
        'frame.16': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, note, u } = _c;
            if (C.theme === 'yosemite') u.el('span', 'help-mark', note, '?');
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
        'frame.17': () => () => {},
        'frame.22': () => () => {},
        'frame.27': (base, S) =>
          function (_c) {
            const { ctx, footer, head, u } = _c;
            _c.endPlacement = null;
            _c.endWord = 'Submit';
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              if (er.bool(0.5)) {
                _c.endPlacement = 'footer';
              } else {
                _c.endPlacement = er.pick(['header', 'link']);
                const bank = ctx.content && ctx.content.END_LABELS;
                const source =
                  Array.isArray(bank) && bank.length
                    ? bank
                    : [
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
                const labels = source
                  .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
                  .filter((x) => x.trim().toLowerCase() !== 'submit');
                if (labels.length) _c.endWord = er.pick(labels);
              }
              const endParent = _c.endPlacement === 'header' ? head : footer;
              if (_c.endPlacement === 'link') {
                _c.submit = u.el('a', 'submit-link', footer, _c.endWord + ' ›');
                _c.submit.href = '#';
              } else {
                _c.submit = u.el(
                  'button',
                  _c.endPlacement === 'header' ? 'submit submit-header' : 'submit',
                  endParent,
                  _c.endWord,
                );
                _c.submit.type = 'button';
              }
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', _c.endWord);
              _c.submit.title = _c.endWord;
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
            }
            const cr = ctx.rng.fork('chrome/collide');
            if (cr.bool(0.3)) {
              const bank = ctx.content && ctx.content.END_LABELS;
              const labels =
                Array.isArray(bank) && bank.length
                  ? bank
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
              const pool = labels
                .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
                .filter((x) => x.trim().toLowerCase() !== _c.endWord.trim().toLowerCase());
              if (pool.length) {
                const label = cr.pick(pool);
                const decoy = u.el('button', 'end-xtra', footer, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
              }
            }
            Object.assign(_c, { cr });
          },
        'frame.29': (base, S) =>
          function (_c) {
            const { C } = S;
            const { footer, u } = _c;
            if (['aqua', 'collage', 'yosemite'].includes(C.theme)) {
              const reset = u.el('button', 'clear', footer, C.theme === 'aqua' ? 'Reset Panel' : 'Reset');
              reset.onclick = () => env.widgetDef.clear?.();
            }
          },
      },
    },
  });
})();
