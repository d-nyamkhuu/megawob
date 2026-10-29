// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-resize-element-relative-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'ledger',
        'theme': 'gtk',
        'title': 'The Daily Chronicle',
        'menu': 'Home World U.S. Business Markets Technology Science Health Opinion Lifestyle',
        'foot': '',
        'accent': '#a91f28',
        'bg': '#fbfaf7',
        'surface': '#fff',
        'font': "Georgia, 'Times New Roman', serif",
      },
      parts: {
        'frame.3': () => () => {},
        'frame.11': (base, St) =>
          function (_c) {
            const { C } = St;
            const { head, u } = _c;
            if (C.menu) {
              const nav = u.el('nav', 'menu', head);
              for (const label of [
                'File',
                'Edit',
                'Select',
                'View',
                'Image',
                'Layer',
                'Colors',
                'Tools',
                'Filters',
                'Windows',
                'Help',
              ])
                u.el('span', '', nav, label);
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
        'frame.19': (base, St) =>
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
            _c.submit = null;
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
        'frame.22': (base, St) =>
          function (_c) {
            const { C } = St;
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
            if (C.theme === 'gtk' && _c.aside) {
              const heading = _c.aside.querySelector('h3');
              heading.textContent = 'Instrument Details';
              heading.classList.add('instrument-heading');
              const quote = u.el('div', 'instrument-quote', _c.aside);
              const stock = u.el('div', 'instrument-stock', quote);
              u.el('strong', '', stock, 'AAPL');
              u.el('span', '', stock, '342.64');
              const company = u.el('div', 'instrument-company', quote);
              u.el('span', '', company, 'Apple Inc.');
              u.el('span', '', company, '−4.21 (−1.21%)');
              const graph = u.svg(
                'svg',
                {
                  class: 'instrument-chart',
                  viewBox: '0 0 360 220',
                  preserveAspectRatio: 'none',
                  'aria-label': 'Apple intraday price chart',
                },
                _c.aside,
              );
              const grid = u.svg('g', { class: 'chart-grid' }, graph);
              for (const y of [20, 60, 100, 140, 180]) u.svg('path', { d: `M0 ${y}H330` }, grid);
              for (const x of [18, 68, 118, 168, 218, 268, 318]) u.svg('path', { d: `M${x} 8V181` }, grid);
              u.svg(
                'path',
                {
                  class: 'chart-fill',
                  d: 'M0 91 L8 78 L16 99 L25 61 L34 72 L43 44 L52 56 L61 31 L70 41 L79 17 L88 28 L97 11 L106 22 L115 40 L124 34 L133 53 L142 46 L151 63 L160 56 L169 77 L178 70 L187 91 L196 84 L205 106 L214 98 L223 119 L232 112 L241 139 L250 132 L259 154 L268 146 L277 130 L286 143 L295 120 L304 135 L313 111 L322 124 L330 102 L330 181 L0 181Z',
                },
                graph,
              );
              u.svg(
                'path',
                {
                  class: 'chart-line',
                  d: 'M0 91 L8 78 L16 99 L25 61 L34 72 L43 44 L52 56 L61 31 L70 41 L79 17 L88 28 L97 11 L106 22 L115 40 L124 34 L133 53 L142 46 L151 63 L160 56 L169 77 L178 70 L187 91 L196 84 L205 106 L214 98 L223 119 L232 112 L241 139 L250 132 L259 154 L268 146 L277 130 L286 143 L295 120 L304 135 L313 111 L322 124 L330 102',
                },
                graph,
              );
              const axes = u.el('div', 'chart-axis', _c.aside);
              for (const t of ['10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm']) u.el('span', '', axes, t);
              const prices = u.el('div', 'chart-prices', _c.aside);
              for (const t of ['350', '345', '340', '335']) u.el('span', '', prices, t);
              const stats = u.el('div', 'instrument-stats', _c.aside);
              for (const [label, value] of [
                ['Open', '346.90'],
                ['Day High', '348.72'],
                ['Day Low', '338.12'],
                ['Volume', '16,432,100'],
                ['Market Cap', '316.5B'],
                ['P/E Ratio', '14.8'],
              ]) {
                const row = u.el('div', 'instrument-stat', stats);
                u.el('span', '', row, label);
                u.el('span', '', row, value);
              }
            }
          },
        'frame.23': () => () => {},
        'frame.26': (base, St) =>
          function (_c) {
            const { ctx, decoyBtn, endBtn, endPlacement, footer } = _c;
            if (_c.collide && (_c.collide.where === 'footer' || _c.collide.where === 'toolbar'))
              decoyBtn(footer, _c.collide.label, true);
            if (
              !ctx.finish &&
              (endPlacement === 'footer' || endPlacement === 'footer-link' || endPlacement === 'toolbar')
            )
              _c.submit = endBtn(footer, endPlacement === 'footer-link' ? 'submit-link' : '');
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
