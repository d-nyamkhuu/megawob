// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-resize-element-textarea-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'ledger',
        'theme': 'win11',
        'title': 'Notes',
        'menu': 'Home Notebooks Tags Search',
        'foot': '',
        'accent': '#60b8ff',
        'bg': '#121820',
        'surface': '#171e28',
        'font': "'Segoe UI', Arial, sans-serif",
      },
      parts: {
        'frame.3': () => () => {},
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'win11'].includes(C.theme)) {
              const controls = u.el('div', 'window-controls', head);
              for (const label of ['−', '□', '×']) {
                const bt = u.el('button', '', controls, label);
                bt.type = 'button';
                bt.onclick = () => env.log('window-control', { label });
              }
            }
          },
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.menu) {
              const nav = u.el('nav', 'menu', head);
              for (const label of C.menu.split(' ')) u.el('span', '', nav, label);
            }
            const search = u.el('div', 'header-search', head);
            u.el('span', 'search-icon', search);
            u.el('span', '', search, 'Search');
            const account = u.el('div', 'header-account', head);
            u.el('span', 'account-icon', account);
            u.el('span', '', account, 'Alex Chen');
            u.el('span', '', account, '▾');
            Object.assign(_c, { account, search });
          },
        'frame.19': (base, S) =>
          function (_c) {
            const { content, ctx, u } = _c;
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
            const ledgerHead = u.el('div', 'ledger-head', ledger);
            const ledgerTitle = u.el('h2', '', ledgerHead);
            const chart = u.el('span', 'ledger-chart', ledgerTitle);
            for (let i = 0; i < 4; i++) u.el('i', '', chart);
            u.el('span', '', ledgerTitle, 'Ledger');
            const period = u.el('button', 'ledger-period', ledgerHead, 'This Month');
            const add = u.el('button', 'ledger-add', ledgerHead, 'Add Transaction');
            add.onclick = () => env.log('ledger-add');
            if (_c.collide && _c.collide.where === 'toolbar') decoyBtn(ledgerHead, _c.collide.label, true);
            _c.submit = null;
            if (endPlacement === 'toolbar') _c.submit = endBtn(ledgerHead, 'submit-toolbar');
            const table = u.el('table', '', ledger);
            const tr = u.el('tr', '', table);
            for (const v of ['Date', 'Description', 'Category', 'Amount', 'Status']) u.el('th', '', tr, v);
            for (const [i, values] of [
              ['Office Supplies', 'Business', '-$48.20'],
              ['Client Payment - Rivera', 'Income', '$1,250.00'],
              ['Cloud Hosting', 'Software', '-$32.00'],
              ['Travel - Train', 'Travel', '-$86.50'],
              ['Design Contract', 'Income', '$980.00'],
              ['Team Lunch', 'Meals', '-$54.30'],
              ['Domain Renewal', 'Software', '-$18.00'],
              ['Client Payment - Park', 'Income', '$640.00'],
            ].entries()) {
              const row = u.el('tr', '', table);
              for (const [j, v] of [
                'Jun ' + String(i + 1).padStart(2, '0') + ', 2025',
                ...values,
                'Posted',
              ].entries()) {
                const td = u.el('td', '', row, v);
                if (j === 4) td.className = 'posted';
                if (j === 3) td.style.color = v.startsWith('-') ? '#d90042' : '#008020';
              }
            }
            const stage = u.el('main', 'stage', content);
            Object.assign(_c, {
              add,
              chart,
              collideRng,
              decoyBtn,
              endBtn,
              endLabel,
              endLabels,
              endPlacement,
              endRng,
              ledger,
              ledgerHead,
              ledgerTitle,
              period,
              stage,
              table,
              tr,
            });
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
                if (C.theme === 'win11') {
                  const rail = u.el('div', 'notes-rail', _c.aside);
                  const icon = (row, d, color = '#d9e2f0') => {
                    const svg = u.svg(
                      'svg',
                      {
                        viewBox: '0 0 24 24',
                        fill: 'none',
                        stroke: color,
                        'stroke-width': 1.7,
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round',
                      },
                      row,
                    );
                    u.svg('path', { d }, svg);
                  };
                  const entries = [
                    ['All notes', 'M7 3.5h8l3 3V21H6V4.5q0-1 1-1ZM9 9h6M9 13h6M9 17h4', '12'],
                    ['Recent', 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 7v5l3 2', '4'],
                    ['Starred', 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z', '2'],
                    ['Archive', 'M4 7h16v13H4zM3 4h18v3H3zM9 11h6', '6'],
                    ['Deleted', 'M5 7h14l-1 14H6L5 7ZM4 4h16M9 4V2h6v2M10 10v7M14 10v7', '0'],
                  ];
                  for (const [name, path, count] of entries) {
                    const row = u.el('div', 'rail-entry', rail);
                    icon(row, path);
                    u.el('span', 'rail-name', row, name);
                    u.el('span', 'rail-count', row, count);
                  }
                  const divider = u.el('div', 'rail-divider', rail);
                  const notebooks = u.el('div', 'notebook-heading', rail);
                  u.el('span', '', notebooks, 'Notebooks');
                  u.el('span', 'notebook-plus', notebooks, '+');
                  for (const [name, path, color, count, active] of [
                    ['Product', 'M5 3h10l4 4v14H5zM15 3v5h4M8 12h8M8 16h6', '#60b8ff', '5', true],
                    ['Personal', 'M6 3h12v18H6zM9 6h6M9 18h6', '#69d64f', '3'],
                    [
                      'Ideas',
                      'M12 3a7 7 0 0 0-4 12c1 1 1 2 1 3h6c0-1 0-2 1-3A7 7 0 0 0 12 3ZM9 21h6M10 18v-2h4v2',
                      '#ffc83d',
                      '2',
                    ],
                    [
                      'Meetings',
                      'M8 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16 11a3 3 0 1 0 0-6M2 21v-2a6 6 0 0 1 12 0v2M16 15a5 5 0 0 1 6 5v1',
                      '#d9e2f0',
                      '2',
                    ],
                  ]) {
                    const row = u.el('div', 'notebook-entry' + (active ? ' active' : ''), rail);
                    icon(row, path, color);
                    u.el('span', 'rail-name', row, name);
                    u.el('span', 'rail-count', row, count);
                  }
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
