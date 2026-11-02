// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-single-08',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'left',
        'theme': 'motif',
        'title': 'Shape Task',
        'subtitle': '',
        'menu': '         File         Edit         View         Tasks         Window         Help',
        'foot': '',
        'accent': '#344fb0',
        'bg': '#d2d2d2',
        'surface': '#f8f8f6',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.2': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx } = _c;
            const display = ctx.display || 'header';
            body.className = 'design ' + C.theme + ' layout-' + C.layout + ' mode-' + display;
            Object.assign(_c, { display });
          },
        'frame.3': () => () => {},
        'frame.17': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, display, note, u } = _c;
            if (C.theme === 'motif') {
              const shape =
                (ctx.plainInstruction || ctx.instruction)
                  .match(/\b(circle|square|triangle|diamond|hexagon|star)\b/i)?.[0]
                  .toLowerCase() || 'shape';
              const desc = u.el('p', 'brief-copy', note);
              desc.textContent =
                'Drag the ' +
                shape +
                ' with the mouse and drop it inside the rectangle on the right. The ' +
                shape +
                ' must fit completely within the box.';
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
            if (display === 'hidden') note.hidden = true;
            else if (display === 'toast') {
              note.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', note, '×');
              x.type = 'button';
              x.setAttribute('aria-label', 'Close');
              x.onclick = () => {
                note.hidden = true;
              };
            } else if (display === 'panel') note.classList.add('instruction-panel');
          },
        'frame.18': () => () => {},
        'frame.22': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, head, u } = _c;
            if (C.theme === 'motif') {
              const tools = u.el('div', 'platinum-tools', footer);
              u.el('strong', 'tools-label', tools, 'Tools');
              for (const [label, glyph] of [
                ['Select', '↖'],
                ['Move', '✋'],
              ]) {
                const bt = u.el('button', 'platinum-tool', tools);
                bt.type = 'button';
                u.el('span', 'tool-glyph', bt, glyph);
                u.el('span', '', bt, label);
              }
              const clear = u.el('button', 'clear', footer, 'Clear');
              clear.type = 'button';
              clear.onclick = () => env.widgetDef.clear?.();
            }
            _c.submit = null;
            _c.endPlacement = null;
            _c.endText = 'Submit';
            _c.collide = null;
            const er = ctx.rng.fork('chrome/end');
            const cr = ctx.rng.fork('chrome/collide');
            if (!ctx.finish) {
              _c.endPlacement = er.pick(['footer', 'footer', 'footer', 'header', 'link', 'icon']);
              const labels = (ctx.content.END_LABELS || []).map((x) =>
                typeof x === 'string' ? x : x.label || x.text || x.name,
              );
              const normal = labels.find((x) => String(x).trim().toLowerCase() === 'submit') || labels[0] || 'Submit';
              _c.endText = er.bool(0.5) ? String(normal) : String(er.pick(labels));
              if (cr.bool(0.3)) {
                const options = [...new Set(labels)].filter(
                  (x) => String(x).trim().toLowerCase() !== _c.endText.trim().toLowerCase(),
                );
                if (options.length) _c.collide = String(cr.pick(options));
              }
            }
            const decoy = (parent, label) => {
              const b = u.el('button', 'end-xtra', parent, label);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.onclick = () => env.log('decoy', { label, collide: true });
              return b;
            };
            if (!ctx.finish) {
              const parent = C.layout === 'three' && _c.aside ? _c.aside : footer;
              const place = _c.endPlacement === 'header' ? head : parent;
              if (_c.collide && _c.endPlacement === 'header') decoy(place, _c.collide);
              if (_c.endPlacement === 'link') {
                _c.submit = u.el('button', 'submit submit-link', parent, _c.endText + ' ›');
              } else if (_c.endPlacement === 'icon') {
                _c.submit = u.el('button', 'submit submit-icon', parent, '✓');
              } else {
                _c.submit = u.el(
                  'button',
                  'submit' + (_c.endPlacement === 'header' ? ' submit-header' : ''),
                  place,
                  _c.endText,
                );
              }
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', _c.endText);
              _c.submit.title = _c.endText;
              _c.submit.onclick = () => ctx.submit();
              if (_c.collide && _c.endPlacement !== 'header') decoy(parent, _c.collide);
            }
            Object.assign(_c, { cr, decoy, er });
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
