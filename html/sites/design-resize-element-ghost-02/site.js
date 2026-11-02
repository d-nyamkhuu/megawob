// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-resize-element-ghost-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'ledger',
        'theme': 'aero',
        'title': 'ClearWork',
        'menu': 'Home       Ledger       Files       Contacts       Tools',
        'foot': 'ClearWork',
        'accent': '#54a636',
        'bg': '#eefaff',
        'surface': '#fff',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.2': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx, u } = _c;
            body.className = 'design cad layout-cad' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
            {
              const shell = u.el('div', 'shell', body);
              const tb = u.el('div', 'cad-title', shell);
              const lg = u.svg(
                'svg',
                { width: 18, height: 18, viewBox: '0 0 18 18', fill: 'none', stroke: '#7fd4ff', 'stroke-width': 1.6 },
                tb,
              );
              u.svg('circle', { cx: 9, cy: 9, r: 7 }, lg);
              u.svg('path', { d: 'M9 5V13M5 9H13' }, lg);
              u.el('span', 'cad-name', tb, 'DraftPro 2014 - [Office_Building_Plan.dwg]');
              const wc = u.el('span', 'cad-winctl', tb, '—      ☐      ✕');
              const mn = u.el('div', 'cad-menu', shell);
              for (const m of [
                'File',
                'Edit',
                'View',
                'Insert',
                'Format',
                'Tools',
                'Draw',
                'Dimension',
                'Modify',
                'Window',
                'Help',
              ])
                u.el('span', '', mn, m);
              const tl = u.el('div', 'cad-tools', shell);
              const ico = [
                'M4 2H12L16 6V18H4Z',
                'M2 7H8L10 5H17V9H19L16 17H1Z',
                'M3 3H15L17 5V17H3ZM6 3V8H13V3',
                'M8 3L2 9L8 13V10Q15 8 17 16Q18 6 8 7Z',
                'M12 3L18 9L12 13V10Q5 8 3 16Q2 6 12 7Z',
                'M9 9m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0M14 14L19 19M6 9H12M9 6V12',
                'M9 9m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0M14 14L19 19M6 9H12M9 6V12',
                'M9 9m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0M14 14L19 19M6 9H12',
                'M6 18L2 11Q1 9 3 10L6 13V4Q7 1 8 4V10V2Q10 0 11 3V10V4Q13 2 14 5V11V8Q17 6 17 10V15L14 18Z',
                'M3 3H7M3 3V7M13 3H17V7M3 13V17H7M13 17H17V13M7 7H13V13H7Z',
                'M3 16L16 4M3 16H15M2 15H4V18H2ZM15 3H17V5H15Z',
                'M3 3H17V17H3ZM7 7H13V13H7M9 5V7M9 13V15',
                'M3 3H17V17H3M6 6H14M10 6V15',
                'M4 17L15 6L17 8L6 17ZM4 17L3 19L6 18',
                'M4 3H16V17H4ZM8 6V14L13 10Z',
              ];
              ico.forEach((d, i) => {
                if (i === 3 || i === 5 || i === 8 || i === 10 || i === 14) u.el('i', 'sep', tl);
                const s = u.svg(
                  'svg',
                  {
                    class: 'ti ti-' + i,
                    width: 22,
                    height: 22,
                    viewBox: '0 0 20 20',
                    fill:
                      i === 0
                        ? '#d9e6ed'
                        : i === 1
                          ? '#ffc548'
                          : i === 2
                            ? '#438cd3'
                            : i === 3 || i === 4 || i === 8
                              ? '#c5d6e4'
                              : 'none',
                    stroke: i === 1 ? '#ffdc76' : '#cfe6f5',
                    'stroke-width': i === 3 || i === 4 || i === 8 ? 1 : 1.6,
                  },
                  tl,
                );
                u.svg('path', { d }, s);
                if (i === 0) u.svg('path', { d: 'M12 2V6H16', fill: 'none' }, s);
                if (i === 1) u.svg('path', { d: 'M1 17L4 9H19', fill: 'none', stroke: '#ffe387' }, s);
                if (i === 2) u.svg('path', { d: 'M6 12H14V17H6Z', fill: '#dfebf5', stroke: 'none' }, s);
              });
              for (const [t, w] of [
                ['ByLayer', 126],
                ['◦ ByLayer', 138],
                ['— — —', 130],
                ['0.25 mm', 110],
              ]) {
                const dd = u.el('span', 'dd', tl, t);
                dd.style.width = w + 'px';
              }
              const main = u.el('div', 'cad-main', shell);
              const stage = u.el('main', 'stage', main);
              stage.dataset.role = 'stage';
              const bg = u.svg(
                'svg',
                {
                  class: 'cad-plan',
                  viewBox: '0 120 1300 735',
                  preserveAspectRatio: 'xMinYMin meet',
                  fill: 'none',
                  stroke: '#59c4f2',
                  'stroke-width': 3,
                },
                main,
              );
              main.insertBefore(bg, stage);
              // Architectural double-line walls, with genuine gaps for doors and windows.
              const walls = [
                'M162 296H722V735H505V725H712V308H174V725H435V735H162Z',
                'M169 296V735M717 296V735M162 302H722M162 730H435M505 730H722',
                'M508 308V523H492V528H525V308M514 308V523',
                'M174 522H432V528H174M580 522H712V528H580',
                'M580 528V542H634M585 528V536H638',
                'M590 588V606H560V725M584 588V600H554V725',
              ];
              for (const d of walls) u.svg('path', { d, stroke: '#94ddf7', 'stroke-width': 2.1 }, bg);
              for (const [x, w] of [
                [285, 64],
                [404, 68],
                [571, 64],
              ])
                u.svg(
                  'rect',
                  { x, y: 295, width: w, height: 14, fill: '#001d30', stroke: '#96def6', 'stroke-width': 1.2 },
                  bg,
                );
              for (const [x, w] of [
                [174, 110],
                [350, 53],
                [474, 96],
                [637, 75],
              ]) {
                u.svg(
                  'path',
                  { d: `M${x} 297H${x + w}M${x} 306H${x + w}`, stroke: '#c5ecf6', 'stroke-width': 1.2 },
                  bg,
                );
                u.svg('path', { d: `M${x} 301H${x + w}`, stroke: '#68c7e8', 'stroke-width': 1 }, bg);
              }
              for (const [y, h] of [
                [390, 72],
                [551, 73],
              ])
                u.svg(
                  'rect',
                  { x: 161, y, width: 14, height: h, fill: '#001d30', stroke: '#a5e2f5', 'stroke-width': 1.3 },
                  bg,
                );
              u.svg(
                'path',
                {
                  d: 'M713 531V604H723V531M165 308V389M165 463V549M165 625V725',
                  stroke: '#c0e7f5',
                  'stroke-width': 1.2,
                },
                bg,
              );
              for (const d of [
                'M432 522A57 57 0 0 1 490 470V522H487V470',
                'M525 470A57 57 0 0 1 580 522M525 470V522H528V470',
                'M590 588A48 48 0 0 0 637 542M590 542H637',
                'M435 725A68 68 0 0 1 505 664M505 664V725H501V664',
              ])
                u.svg('path', { d, stroke: '#a5e4fa', 'stroke-width': 1.2 }, bg);
              for (const d of [
                'M162 250H722M162 239V296M722 239V296M162 250L175 246M162 250L175 254M722 250L709 246M722 250L709 254',
                'M100 302V733M83 302H149M83 733H149M100 302L96 315M100 302L104 315M100 733L96 720M100 733L104 720',
                'M64 181V244M39 213H91M64 181L61 194M64 181L67 194',
                'M37 781V830H86M37 781L34 793M37 781L40 793M86 830L77 826M86 830L77 834',
              ])
                u.svg('path', { d, 'stroke-width': 1.3, stroke: '#a7e4fa' }, bg);
              for (const [x, y, t] of [
                [330, 408, 'CONFERENCE'],
                [613, 408, 'OFFICE'],
                [326, 621, 'RECEPTION'],
                [641, 660, 'STORAGE'],
                [448, 240, '12.000'],
                [64, 174, 'N'],
                [37, 773, 'Y'],
                [100, 837, 'X'],
              ]) {
                const e = u.svg(
                  'text',
                  {
                    x,
                    y,
                    'text-anchor': 'middle',
                    fill: '#97ddfa',
                    stroke: 'none',
                    'font-size': 19,
                    'font-family': 'monospace',
                  },
                  bg,
                );
                e.textContent = t;
              }
              const dim = u.svg(
                'text',
                {
                  x: 90,
                  y: 526,
                  transform: 'rotate(-90 90 526)',
                  'text-anchor': 'middle',
                  fill: '#97ddfa',
                  stroke: 'none',
                  'font-size': 19,
                  'font-family': 'monospace',
                },
                bg,
              );
              dim.textContent = '8.500';
              for (const [x, y, t] of [
                [326, 429, '101'],
                [613, 429, '102'],
                [326, 642, '100'],
                [641, 682, '103'],
              ]) {
                u.svg(
                  'rect',
                  { x: x - 28, y: y - 13, width: 56, height: 28, 'stroke-width': 1.3, stroke: '#a5e4fa' },
                  bg,
                );
                const e = u.svg(
                  'text',
                  {
                    x,
                    y: y + 7,
                    'text-anchor': 'middle',
                    fill: '#a1def5',
                    stroke: 'none',
                    'font-size': 19,
                    'font-family': 'monospace',
                  },
                  bg,
                );
                e.textContent = t;
              }
              const side = u.el('aside', 'cad-side', main);
              const note = u.el('section', 'task-note', side);
              u.el('div', 'note-label', note, '');
              u.el('div', 'instruction', note, ctx.instruction);
              if (ctx.display === 'hidden') note.hidden = true;
              else if (ctx.display === 'toast') {
                note.classList.add('instruction-toast');
                const x = u.el('button', 'note-close', note, '×');
                x.onclick = () => (note.style.visibility = 'hidden');
              } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
              u.el('h4', '', side, 'Action notes:');
              const ol = u.el('ol', '', side);
              for (const t of [
                'Drag the bottom-right corner handle to resize the panel.',
                'Match the panel to the dashed outline size (±7 px).',
                'Keep the panel title and content visible.',
              ])
                u.el('li', '', ol, t);
              const endRng = ctx.rng.fork('chrome/end'),
                collideRng = ctx.rng.fork('chrome/collide');
              const endLabels = (ctx.content && ctx.content.END_LABELS) || [
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
              const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              const commonLabel = endLabels.map(labelOf).find((x) => x.trim().toLowerCase() === 'submit') || 'Submit';
              let placement = null,
                label = commonLabel;
              if (!ctx.finish) {
                placement = endRng.pick(['side', 'side', 'toolbar', 'status']);
                label = endRng.bool(0.5) ? commonLabel : labelOf(endRng.pick(endLabels));
              }
              const makeEnd = (parent, cls) => {
                const b = u.el('button', 'submit ' + cls, parent, label);
                b.type = 'button';
                b.dataset.role = 'submit';
                b.setAttribute('aria-label', label);
                b.title = label;
                b.onclick = () => ctx.submit();
                return b;
              };
              let submit = null;
              if (placement === 'side') submit = makeEnd(side, '');
              else if (placement === 'toolbar') submit = makeEnd(tl, 'cad-end-toolbar');
              let collide = null;
              if (!ctx.finish && collideRng.bool(0.3)) {
                const options = [...new Set(endLabels.map(labelOf))].filter(
                  (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
                );
                if (options.length) collide = labelOf(collideRng.pick(options));
              }
              if (collide) {
                const d = u.el('button', 'cad-xtra', side, collide);
                d.type = 'button';
                d.dataset.role = 'xtra';
                d.onclick = () => env.log('decoy', { label: collide, collide: true });
              }
              const tabs = u.el('div', 'cad-tabs', shell);
              for (const [t, a] of [
                ['Model', 1],
                ['Layout1', 0],
                ['Layout2', 0],
                ['+', 0],
              ])
                u.el('span', a ? 'on' : '', tabs, t);
              const st = u.el('div', 'cad-status', shell);
              u.el('span', 'cad-coordinates', st, 'X: 3.142    Y: 6.781    Z: 0.000');
              if (placement === 'status') submit = makeEnd(st, 'cad-end-status');
              const sw = u.el('span', 'cad-sw', st);
              for (const t of ['SNAP', 'GRID', 'ORTHO', 'POLAR', 'OSNAP', '▦']) u.el('b', '', sw, t);
              return { stage, submit };
            }
            body.className =
              'design ' + C.theme + ' layout-' + C.layout + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
          },
        'frame.3': () => () => {},
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.menu) {
              const nav = u.el('nav', 'menu', head);
              for (const label of ['Home', 'Ledger', 'Files', 'Contacts', 'Tools'])
                u.el('span', label === 'Ledger' ? 'selected' : '', nav, label);
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
            const { content, u } = _c;
            const ledger = u.el('section', 'resize-ledger', content);
            const ledgerHead = u.el('div', 'ledger-head', ledger);
            const ledgerTitle = u.el('h2', '', ledgerHead);
            const chart = u.el('span', 'ledger-chart', ledgerTitle);
            for (let i = 0; i < 4; i++) u.el('i', '', chart);
            u.el('span', '', ledgerTitle, 'Ledger');
            const period = u.el('button', 'ledger-period', ledgerHead, 'This Month');
            const add = u.el('button', 'ledger-add', ledgerHead, 'Add Transaction');
            add.onclick = () => env.log('ledger-add');
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
            Object.assign(_c, { add, chart, ledger, ledgerHead, ledgerTitle, period, stage, table, tr });
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
          },
        'frame.23': () => () => {},
      },
    },
  });
})();
