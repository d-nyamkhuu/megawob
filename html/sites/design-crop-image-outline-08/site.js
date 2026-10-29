// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-outline-08',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'qt',
        'theme': 'qt',
        'title': 'Image Crop Tool',
        'menu': 'File     Edit     View     Help',
        'tabs': [],
        'aside': '',
        'foot': '',
        'accent': '#075bd7',
        'bg': '#c5c5c5',
        'surface': '#ededed',
        'font': 'Arial, Helvetica, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.5': (base, S) =>
          function (_c) {
            const { C } = S;
            const { root } = _c;
            for (const [k, v] of Object.entries({
              bg: C.bg,
              panel: C.surface,
              fg: '#111820',
              muted: '#343b44',
              line: '#9da3a9',
              accent: C.accent,
            }))
              root.style.setProperty('--' + k, v);
          },
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'qt'].includes(C.theme)) {
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
            const { note, u } = _c;
            u.el('div', 'note-label', note, C.layout === 'left' || C.layout === 'qt' ? 'Task' : '');
          },
        'frame.16': (base, S) =>
          function (_c) {
            const { C } = S;
            const { note, u } = _c;
            if (C.theme === 'qt') {
              u.el('p', 'qt-help', note, 'Drag the handles to resize the crop box. Drag inside the box to move it.');
              u.el('strong', 'qt-legend-title', note, 'Target:');
              const targetKey = u.el('div', 'qt-legend', note);
              u.el('i', 'qt-dash', targetKey);
              u.el('span', '', targetKey, 'Dashed rectangle (target area)');
              u.el('strong', 'qt-legend-title', note, 'Current crop box:');
              const cropKey = u.el('div', 'qt-legend', note);
              u.el('i', 'qt-crop-sample', cropKey);
              u.el('span', '', cropKey, 'Resizable crop box (8 handles)');
            }
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
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, u } = _c;
            if (['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger'].includes(C.layout)) {
              _c.aside = u.el('aside', 'aside', content);
              if (C.tabs) {
                _c.aside.classList.add('tabs');
                for (const text of C.tabs) {
                  const bt = u.el('button', 'tab', _c.aside);
                  u.el('span', 'tab-label', bt, text);
                  bt.type = 'button';
                  bt.onclick = () => {
                    _c.aside.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
                    bt.classList.add('active');
                  };
                }
              } else if (C.layout === 'sheet') {
                for (let i = 1; i <= 20; i++) u.el('div', 'index-number', _c.aside, String(i));
              } else if (C.layout === 'offset') {
                for (const text of ['Select', 'Zoom In', 'Zoom Out', 'Pan']) u.el('button', 'map-tool', _c.aside, text);
              } else {
                u.el('h3', '', _c.aside, C.aside || 'Instructions');
                if (C.aside === 'Your Answer') {
                  u.el('p', '', _c.aside, 'No point selected yet.');
                  u.el('hr', '', _c.aside);
                  u.el('p', '', _c.aside, 'X:    —');
                  u.el('p', '', _c.aside, 'Y:    —');
                } else if (C.aside === 'Progress') {
                  u.el('p', '', _c.aside, 'Problem 1 of 5');
                  u.el('progress', '', _c.aside).value = 0.2;
                  u.el('h3', '', _c.aside, 'Tips');
                  u.el('p', '', _c.aside, 'Click outside the dotted circle.');
                } else if (C.layout === 'windows') u.el('p', '', _c.aside, ctx.instruction);
                else if (C.theme === 'crop-minimal')
                  u.el('p', '', _c.aside, 'Drag the handles to resize the crop box.');
                else if (C.layout === 'palette') {
                  const ol = u.el('ol', 'guide', _c.aside);
                  for (const t of [
                    'Drag each handle to the target value.',
                    'Keep the lower value on the left and the higher value on the right.',
                    'Do not click on the track.',
                  ])
                    u.el('li', '', ol, t);
                }
              }
            }
          },
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { ctx, footer, head, u } = _c;
            const er = ctx.rng.fork('chrome/end'),
              endBank =
                ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                  ? ctx.content.END_LABELS
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"],
              endLabel = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)),
              keepOriginal = er.bool(0.5),
              altEnd = endBank.filter((x) => endLabel(x).trim().toLowerCase() !== 'submit'),
              endText = keepOriginal ? 'Submit' : endLabel(er.pick(altEnd.length ? altEnd : endBank)),
              placement = keepOriginal ? 'footer' : er.pick(['menu', 'link']);
            _c.submit = null;
            if (!ctx.finish) {
              const menu = head.querySelector('.menu'),
                where = placement === 'menu' ? menu : footer;
              _c.submit = u.el(
                placement === 'link' ? 'a' : 'button',
                placement === 'link' ? 'submit qt-link' : placement === 'menu' ? 'submit qt-menu-submit' : 'submit',
                where,
                endText,
              );
              if (placement === 'link') _c.submit.href = '#';
              else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endText;
              _c.submit.setAttribute('aria-label', endText);
              _c.submit.onclick = (e) => {
                if (e) e.preventDefault();
                ctx.submit();
              };
            }
            const cr = ctx.rng.fork('chrome/collide');
            if (cr.bool(0.3)) {
              const options = endBank
                .map(endLabel)
                .filter((x) => x.trim().toLowerCase() !== endText.trim().toLowerCase());
              if (options.length) {
                const dec = u.el('button', 'qt-pq', head.querySelector('.menu'), endLabel(cr.pick(options)));
                dec.type = 'button';
                dec.dataset.role = 'xtra';
                dec.onclick = () => env.log('decoy', { label: dec.textContent, collide: true });
              }
            }
            Object.assign(_c, { altEnd, cr, endBank, endLabel, endText, er, keepOriginal, placement });
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
