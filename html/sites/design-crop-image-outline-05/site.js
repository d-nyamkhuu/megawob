// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-outline-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        layout: 'risograph',
        theme: 'risograph',
        title: 'Crop Match',
        menu: 'HELP       SETTINGS',
        tabs: null,
        aside: '',
        foot: '',
        accent: '#075b58',
        bg: '#f5f0df',
        surface: '#f5f0df',
        font: 'Georgia, "Times New Roman", serif',
      },
      parts: {
        'frame.3': (base, S) =>
          function (_c) {
            const { body, ctx } = _c;
            body.dataset.instruction = ctx.display;
            body.classList.toggle('finish-mode', !!ctx.finish);
          },
        'frame.14': (base, S) =>
          function (_c) {
            const { C } = S;
            const { note, u } = _c;
            u.el(
              'div',
              'note-label',
              note,
              C.theme === 'risograph' ? 'IMAGE ANNOTATION' : C.layout === 'left' ? 'Task' : '',
            );
          },
        'frame.16': (base, S) =>
          function (_c) {
            const { C } = S;
            const { note, u } = _c;
            if (C.theme === 'risograph') {
              u.el(
                'p',
                'brief-copy',
                note,
                'Drag the handles to resize the crop box and drag inside the box to move it.',
              );
              u.el('p', 'brief-copy', note, 'Make the crop box match the dashed rectangle as closely as possible.');
              u.el('hr', 'brief-rule', note);
              u.el('h2', 'brief-tips-title', note, 'Tips');
              const tips = u.el('ul', 'brief-tips', note);
              for (const t of [
                'Use the eight handles (corners and sides) to resize.',
                'Drag inside the box to move it.',
                'Aim to cover the dashed rectangle with high overlap (IoU ≥ 0.85).',
                'Keep the crop box within the image bounds.',
              ])
                u.el('li', '', tips, t);
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
            const { body, ctx, footer, head, note, u } = _c;
            const er = ctx.rng.fork('chrome/end'),
              labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endWords = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = er.bool(0.5);
            const endForm = referenceEnd ? 'footer' : er.pick(['header', 'link']);
            const endText = referenceEnd ? 'Submit' : er.pick(endWords);
            body.dataset.endForm = ctx.finish ? 'none' : endForm;
            const endTools = u.el('div', 'end-tools', head);
            _c.submit = null;
            if (!ctx.finish) {
              const parent = endForm === 'header' ? endTools : footer;
              _c.submit = u.el('button', 'submit' + (endForm === 'link' ? ' end-link' : ''), parent, endText);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endText;
              _c.submit.setAttribute('aria-label', endText);
              _c.submit.onclick = () => ctx.submit();
            }
            const cr = ctx.rng.fork('chrome/collide');
            if (cr.bool(0.3)) {
              const choices = endWords.filter((x) => x.trim().toLowerCase() !== endText.trim().toLowerCase());
              if (choices.length) {
                const label = cr.pick(choices);
                const decoy = u.el('button', 'end-xtra', endTools, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
              }
            }
            const hint = note.querySelector('.submit-hint');
            if (hint) {
              if (ctx.finish) hint.remove();
              else hint.textContent = 'When you’re satisfied, click ' + endText + '.';
            }
            Object.assign(_c, { cr, endForm, endText, endTools, endWords, er, hint, labelOf, referenceEnd });
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
