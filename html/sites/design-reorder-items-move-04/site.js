// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-reorder-items-move-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'windows',
        'theme': 'plain',
        'title': 'Document Organizer',
        'aside': 'Document Details',
        'foot': '',
        'accent': '#081b9b',
        'bg': '#ffffff',
        'surface': '#ffffff',
        'font': "'Times New Roman', Times, serif",
      },
      parts: {
        'frame.3': () => () => {},
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, u } = _c;
            if (['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger'].includes(C.layout)) {
              _c.aside = u.el('aside', 'aside', content);
              if (C.tabs) {
                _c.aside.classList.add('tabs');
                for (const text of C.tabs) {
                  const bt = u.el('button', 'tab', _c.aside, text);
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
                if (C.aside === 'Document Details') {
                  const view = u.el('div', 'file-view', _c.aside);
                  u.el('div', 'file-icon word', view, 'W');
                  u.el('div', 'file-title', view, 'Project_Plan.docx');
                  u.el('hr', '', view);
                  const facts = u.el('div', 'facts', view);
                  for (const [k, v] of [
                    ['Type', 'Microsoft Word Document'],
                    ['Size', '24 KB'],
                    ['Modified', 'Aug 1, 2021  10:14 AM'],
                    ['Created', 'Jul 28, 2021  2:36 PM'],
                    ['Author', 'Alex Carter'],
                  ]) {
                    const r = u.el('div', 'fact-row', facts);
                    u.el('span', '', r, k + ':');
                    u.el('span', '', r, v);
                  }
                  u.el('hr', '', view);
                  u.el('div', 'description-label', view, 'Description:');
                  u.el('div', 'description-box', view, 'Project plan and initial scope.');
                } else if (C.aside === 'Your Answer') {
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
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, u } = _c;
            if (!ctx.finish) {
              const endRng = ctx.rng.fork('chrome/end'),
                bank = ctx.content && ctx.content.END_LABELS,
                labels =
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
                      ],
                labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              let label = 'Submit',
                placement = 'footer';
              if (!endRng.bool(0.5)) {
                const alternatives = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== 'submit');
                if (alternatives.length) label = endRng.pick(alternatives);
                placement = endRng.pick(['link', 'icon']);
              }
              const parent = C.layout === 'three' && _c.aside ? _c.aside : footer;
              _c.submit = u.el(
                'button',
                'submit' + (placement === 'link' ? ' end-link' : placement === 'icon' ? ' end-icon' : ''),
                parent,
              );
              u.el('span', 'submit-label', _c.submit, placement === 'icon' ? '✓' : label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', label);
              _c.submit.title = label;
              _c.submit.onclick = () => ctx.submit();
              if (placement === 'link') _c.submit.append(' ›');
              const collideRng = ctx.rng.fork('chrome/collide');
              if (collideRng.bool(0.3)) {
                const other = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
                if (other.length) {
                  const decoy = u.el('button', 'end-pq', footer, collideRng.pick(other));
                  decoy.type = 'button';
                  decoy.dataset.role = 'xtra';
                  decoy.onclick = () => env.log('decoy', { label: decoy.textContent, collide: true });
                  footer.insertBefore(decoy, _c.submit);
                }
              }
            }
          },
      },
    },
  });
})();
