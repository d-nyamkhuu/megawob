// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-resize-element-aspect-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'ledger',
        'theme': 'aero',
        'title': 'Photo Studio',
        'menu': 'Crop & Resize       Filters       Adjust       Effects       Annotate',
        'foot': '',
        'accent': '#0878d1',
        'bg': '#f4f5f7',
        'surface': '#fff',
        'font': "'Segoe UI', Arial, sans-serif",
      },
      parts: {
        'frame.3': () => () => {},
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.menu) {
              const nav = u.el('nav', 'menu', head);
              for (const label of ['Crop & Resize', 'Filters', 'Adjust', 'Effects', 'Annotate'])
                u.el('span', label === 'Crop & Resize' ? 'selected' : '', nav, label);
            }
            const search = u.el('div', 'header-search', head);
            u.el('span', 'search-icon', search);
            u.el('span', '', search, 'Search photos');
            const account = u.el('div', 'header-account', head);
            Object.assign(_c, { account, search });
          },
        'frame.19': (base, S) =>
          function (_c) {
            const { content, ctx, head, u } = _c;
            const endRng = ctx.rng.fork('chrome/end'),
              endLabels = (ctx.content && ctx.content.END_LABELS) || [
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
            const endPlacement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'toolbar', 'footer-link']);
            const endLabel = endRng.pick(endLabels);
            const collideRng = ctx.rng.fork('chrome/collide');
            _c.collide = null;
            if (!ctx.finish && collideRng.bool(0.3)) {
              const choices = [
                ...new Set(
                  endLabels.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x))),
                ),
              ].filter((x) => x.trim().toLowerCase() !== String(endLabel).trim().toLowerCase());
              if (choices.length)
                _c.collide = { label: collideRng.pick(choices), where: collideRng.pick(['toolbar', 'footer']) };
            }
            const decoyBtn = (parent, label, colliding) => {
              const b = u.el('button', 'xtra-end', parent, label);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.onclick = () => env.log('decoy', colliding ? { label, collide: true } : { label });
              return b;
            };
            const endBtn = (parent, cls) => {
              const b = u.el('button', 'submit ' + cls, parent, endLabel);
              b.type = 'button';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', endLabel);
              b.title = endLabel;
              b.onclick = () => ctx.submit();
              return b;
            };
            const ledger = u.el('section', 'resize-ledger', content);
            ledger.hidden = true;
            _c.submit = null;
            if (_c.collide && _c.collide.where === 'toolbar') decoyBtn(head, _c.collide.label, true);
            if (endPlacement === 'toolbar') _c.submit = endBtn(head, 'submit-toolbar');
            const stage = u.el('main', 'stage', content);
            Object.assign(_c, {
              collideRng,
              decoyBtn,
              endBtn,
              endLabel,
              endLabels,
              endPlacement,
              endRng,
              ledger,
              stage,
            });
          },
        'frame.18': (base, S) =>
          function (_c) {
            base(_c);
            // Reserve space for the note before the task is measured.
            if (_c.ctx.display === 'header' || _c.ctx.display === 'hidden') _c.head.append(_c.note);
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
                const previewHead = u.el('h3', '', _c.aside);
                const miniFile = u.svg(
                  'svg',
                  { class: 'mini-file', viewBox: '0 0 24 28', fill: 'none', stroke: '#d8f4ff', 'stroke-width': 1.5 },
                  previewHead,
                );
                u.svg('path', { d: 'M3 2H14L21 9V26H3ZM14 2V10H21M7 15H17M7 18H17M7 21H14' }, miniFile);
                u.el('span', '', previewHead, 'Document Preview');
                u.el('span', 'preview-controls', previewHead, '−　□　×');
                const previewBody = u.el('div', 'preview-body', _c.aside);
                const file = u.svg(
                  'svg',
                  { class: 'file-icon', viewBox: '0 0 50 60', fill: 'none', stroke: '#7194bc', 'stroke-width': 3.5 },
                  previewBody,
                );
                u.svg('path', { d: 'M7 3H31L45 17V56H7ZM31 3V18H45M15 29H37M15 36H37M15 43H31' }, file);
                const details = u.el('div', 'preview-details', previewBody);
                u.el('strong', '', details, 'Project Plan.pdf');
                u.el('p', '', details, '2.4 MB • Modified Jun 6, 2025');
                u.el('button', '', previewBody, 'Open');
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
            if (_c.aside) {
              _c.aside.innerHTML = '';
              u.el('h2', 'photos-title', _c.aside, 'Photos');
              const entries = [
                ['Mountain Lake', 'Oct 14, 2023', '520 × 293', 'lake'],
                ['Forest Trail', 'Sep 28, 2023', '600 × 338', 'forest'],
                ['City Skyline', 'Aug 3, 2023', '600 × 338', 'city'],
                ['Desert Dunes', 'Jul 19, 2023', '600 × 338', 'desert'],
                ['Coastal Cliffs', 'Jun 11, 2023', '600 × 338', 'coast'],
                ['Autumn Road', 'Oct 2, 2023', '600 × 338', 'autumn'],
                ['Snowy Peaks', 'Dec 5, 2023', '600 × 338', 'snow'],
              ];
              const list = u.el('div', 'photo-list', _c.aside);
              for (const [i, [name, date, size, kind]] of entries.entries()) {
                const row = u.el('div', 'photo-row' + (i === 0 ? ' active' : ''), list);
                u.el('span', 'photo-thumb ' + kind, row);
                const info = u.el('span', 'photo-info', row);
                u.el('span', 'photo-name', info, name);
                u.el('span', 'photo-meta', info, date + '　' + size);
                u.el('span', 'photo-more', row, '•••');
              }
            }
            _c.aside.insertBefore(_c.search, _c.aside.querySelector('.photo-list'));
            if (ctx.display === 'panel' || ctx.display === 'toast') _c.aside.prepend(_c.note);
          },
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { ctx, decoyBtn, endBtn, endPlacement, footer } = _c;
            if (_c.collide && _c.collide.where === 'footer') decoyBtn(footer, _c.collide.label, true);
            if (!ctx.finish && (endPlacement === 'footer' || endPlacement === 'footer-link'))
              _c.submit = endBtn(footer, endPlacement === 'footer-link' ? 'submit-link' : '');
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
