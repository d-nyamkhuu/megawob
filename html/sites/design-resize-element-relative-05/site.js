// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-resize-element-relative-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'ledger',
        'theme': 'aero',
        'title': 'Dashboard',
        'menu': 'Home  Projects  Tasks  Calendar  Reports  People  Settings',
        'foot': '',
        'accent': '#4cc2ff',
        'bg': '#0e1117',
        'surface': '#181c24',
        'font': '"Segoe UI Variable","Segoe UI",system-ui,sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            const navIcons = [
              'M3 11L12 3L21 11V21H15V14H9V21H3Z',
              'M4 5H20V19H4Z M4 9H20',
              'M5 3H19V21H5Z M9 8H15 M9 12H15 M9 16H13',
              'M4 6H20V20H4Z M4 10H20 M8 3V7 M16 3V7',
              'M6 3H18V21H6Z M9 8H15 M9 12H15 M9 16H12',
              'M9 11A3.5 3.5 0 1 0 9 4A3.5 3.5 0 1 0 9 11 M3 20C3 15 15 15 15 20 M16 5A3 3 0 0 1 16 11 M18 15C20 15.5 21 17 21 20',
              'M12 9A3 3 0 1 0 12 15A3 3 0 1 0 12 9 M12 3V6 M12 18V21 M3 12H6 M18 12H21 M5.6 5.6L7.7 7.7 M16.3 16.3L18.4 18.4 M5.6 18.4L7.7 16.3 M16.3 7.7L18.4 5.6',
            ];
            const nav = u.el('nav', 'menu', head);
            C.menu.split(/\s{2,}/).forEach((label, i) => {
              const s = u.el('span', i === 0 ? 'selected' : '', nav);
              const svg = u.svg('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, s);
              u.svg('path', { d: navIcons[i] }, svg);
              u.el('em', '', s, label);
            });
            const toolbar = u.el('div', 'gem-toolbar', head);
            const bell = u.el('button', 'tb-bell', toolbar);
            bell.type = 'button';
            bell.setAttribute('aria-label', 'Notifications');
            const bsvg = u.svg('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, bell);
            u.svg('path', { d: 'M6 17V11A6 6 0 0 1 18 11V17L20 19H4Z M10 21H14' }, bsvg);
            bell.onclick = () => env.log('toolbar', { icon: 'bell' });
            u.el('span', 'tb-avatar', toolbar, 'JD');
            Object.assign(_c, { glyphs: [], toolbar });
          },
        'frame.19': (base, S) =>
          function (_c) {
            const { content, ctx, toolbar, u } = _c;
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
            if (_c.collide && _c.collide.where === 'toolbar') decoyBtn(toolbar, _c.collide.label, true);
            _c.submit = null;
            if (endPlacement === 'toolbar') _c.submit = endBtn(toolbar, 'submit-toolbar');
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
              _c.aside.classList.add('gem-index');
              _c.aside.replaceChildren();
              const act = u.el('section', 'rc-activity', _c.aside);
              const ah = u.el('h3', '', act);
              u.el('span', '', ah, 'Recent Activity');
              u.el('a', 'rc-all', ah, 'View all');
              for (const [c, t, w] of [
                ['b', 'Website redesign kickoff', '2 hours ago'],
                ['g', 'Design assets updated', '4 hours ago'],
                ['g', 'QA environment ready', 'Yesterday'],
                ['b', 'Stakeholder review completed', 'Yesterday'],
                ['o', 'New task assigned to you', '2 days ago'],
              ]) {
                const r = u.el('div', 'rc-row', act);
                u.el('i', 'dot ' + c, r);
                u.el('span', '', r, t);
                u.el('time', '', r, w);
              }
              const tips = u.el('section', 'rc-tips', _c.aside);
              const th = u.el('h3', '', tips);
              const bulb = u.svg('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, th);
              u.svg('path', { d: 'M9 18H15 M10 21H14 M12 3A6 6 0 0 0 8 13.5C9 14.5 9 15.5 9 16H15C15 15.5 15 14.5 16 13.5A6 6 0 0 0 12 3Z' }, bulb);
              u.el('span', '', th, 'Help & Tips');
              for (const [k, h, p] of [
                ['panel', 'Resize a panel', 'Drag the handle at the lower-right corner of a panel to change its size.'],
                ['kbd', 'Keyboard shortcut', 'Focus the handle and use the arrow keys to resize the panel.'],
                ['info', 'About this page', 'The dashboard shows a summary of your projects and recent activity, with a list of tasks you can work on.'],
              ]) {
                const r = u.el('div', 'rc-tip', tips);
                u.el('i', 'tip-ico ' + k, r, k === 'info' ? 'i' : '');
                const d = u.el('div', '', r);
                u.el('b', '', d, h);
                u.el('p', '', d, p);
              }
              const icons = [
                'M12 21V9 M12 10C9 7 7 6 4 7 M12 10C14 6 17 4 20 5 M12 9C12 5 11 3 10 2 M12 11C9 9 6 9 4 11 M12 11C15 8 18 8 21 9 M7 21H17',
                'M5 21V3H19V21Z M8 7H10V10H8Z M14 7H16V10H14Z M8 13H10V16H8Z M14 13H16V16H14Z',
                'M3 15L5 9H17L21 13V18H3Z M7 18A2 2 0 1 0 7 22A2 2 0 1 0 7 18 M17 18A2 2 0 1 0 17 22A2 2 0 1 0 17 18',
                'M12 3L14 8L20 7L17 12L21 16L15 16L12 22L9 16L3 16L7 12L4 7L10 8Z',
                'M7 22V14 M17 22V11 M2 14L7 5L12 14Z M12 11L17 2L22 11Z M5 22H20',
                'M3 11L12 3L21 11V21H3Z M9 21V14H15V21 M17 6V3H20V9',
                'M2 10Q6 6 10 10T18 10T26 10 M2 15Q6 11 10 15T18 15T26 15 M2 20Q6 16 10 20T18 20T26 20',
                'M2 21L9 5L14 14L18 8L23 21Z',
                'M6 21V14 M12 21V14 M18 21V14 M4 14A2 2 0 1 0 4 10A2 2 0 1 0 4 14 M12 13A2 2 0 1 0 12 9A2 2 0 1 0 12 13 M20 14A2 2 0 1 0 20 10A2 2 0 1 0 20 14 M2 21Q3 15 6 15Q9 15 10 21 M9 21Q10 14 13 14Q16 14 17 21 M14 21Q15 15 18 15Q21 15 22 21',
                'M2 8Q6 4 10 8T18 8T26 8 M2 14Q6 10 10 14T18 14T26 14 M2 20Q6 16 10 20T18 20T26 20',
                'M3 20H21 M5 16A7 7 0 0 1 19 16 M12 3V1 M4 7L2 5 M20 7L22 5 M12 10A2 2 0 1 0 12 14A2 2 0 1 0 12 10',
                'M11 21V13 M13 21V13 M5 12Q3 9 6 7Q4 3 9 4Q11 0 14 4Q19 2 18 7Q22 8 19 12Q16 15 12 13Q8 15 5 12Z',
              ];
              for (const [i, n] of [
                'beach.sti',
                'buildings.sti',
                'car.sti',
                'flowers.sti',
                'forest.sti',
                'house.sti',
                'lake.sti',
                'mountain.sti',
                'people.sti',
                'river.sti',
                'sunset.sti',
                'tree.sti',
              ].entries()) {
                const row = u.el('div', 'gem-row' + (i === 4 ? ' active' : ''));
                const icon = u.svg('svg', { class: 'gem-file-icon', viewBox: '0 0 24 24', 'aria-hidden': 'true' }, row);
                u.svg('path', { d: icons[i] }, icon);
                u.el('span', '', row, n);
                u.el('span', 'gem-size', row, [12, 28, 16, 24, 32, 20, 18, 26, 14, 22, 30, 12][i] + 'K');
                u.el('span', '', row, 'ST Image');
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
        'frame.27': (base, S) =>
          function (_c) {
            const { content, u } = _c;
            const note = content.parentElement.querySelector('.task-note');
            const ov = u.el('section', 'ov', content);
            u.el('h1', '', ov, 'Project Overview');
            u.el('p', 'ov-sub', ov, 'Q3 2024  •  Contoso');
            if (note) {
              const slot = u.el('div', 'gem-note-slot', ov);
              slot.append(note);
              // Dismissing a notification must not move the task's anchors.
              slot.style.minHeight = slot.offsetHeight + 'px';
            }
            const kp = u.el('div', 'kpis', ov);
            for (const [k, l, v, p] of [
              ['bars', 'Total Projects', '12', 'M4 20V10 M10 20V4 M16 20V13'],
              ['check', 'Active Tasks', '28', 'M8 12L11 15L16 9'],
              ['ring', 'Completed', '67%', ''],
              ['warn', 'At Risk', '3', 'M12 9V14 M12 17V17.5'],
            ]) {
              const c = u.el('div', 'kpi', kp);
              const svg = u.svg('svg', { viewBox: '0 0 24 24', class: 'k-' + k, 'aria-hidden': 'true' }, c);
              if (k === 'check') u.svg('circle', { cx: 12, cy: 12, r: 10 }, svg);
              if (k === 'ring') u.svg('circle', { cx: 12, cy: 12, r: 10 }, svg);
              if (k === 'warn') u.svg('path', { d: 'M12 3L22 20H2Z' }, svg);
              if (p) u.svg('path', { d: p }, svg);
              const d = u.el('div', '', c);
              u.el('span', '', d, l);
              u.el('b', '', d, v);
            }
          },
      },
    },
  });
})();
