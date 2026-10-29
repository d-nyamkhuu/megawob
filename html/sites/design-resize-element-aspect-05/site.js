// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-resize-element-aspect-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'ledger',
        'theme': 'w2k',
        'title': 'Project Tracker',
        'menu': 'File Edit View Project Tools Help',
        'foot': 'Ready',
        'accent': '#4b78a8',
        'bg': '#e8e6e1',
        'surface': '#f5f4f0',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.menu) {
              const nav = u.el('nav', 'menu', head);
              for (const label of ['File', 'Edit', 'View', 'Project', 'Tools', 'Help'])
                u.el('span', '', nav, label);
            }
            const search = u.el('div', 'header-search', head);
            const account = u.el('div', 'header-account', head);
            const tb = u.el('div', 'w2k-tb', head);
            for (const k of 'a b | c d | e f g | h i | j'.split(' ')) {
              if (k === '|') u.el('i', 'sep', tb);
              else u.el('span', 'ico ico-' + k, tb);
            }
            Object.assign(_c, { account, search, tb });
          },
        'frame.18': (base, S) =>
          function (_c) {
            base(_c);
            const { ctx, shell, head, note } = _c;
            if (ctx.display === 'header') head.after(note);
            if (ctx.display === 'toast') shell.append(note);
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
            const endPlacement = ctx.finish ? null : endRng.pick(['toolbar', 'toolbar', 'footer', 'footer-link']);
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
            u.el('span', '', ledgerTitle, 'Project List');
            const period = u.el('button', 'ledger-period', ledgerHead, 'This Month');
            const add = u.el('button', 'ledger-add', ledgerHead, 'Add');
            add.onclick = () => env.log('ledger-add');
            const tbar = _c.tb || ledgerHead;
            if (_c.collide && _c.collide.where === 'toolbar') decoyBtn(tbar, _c.collide.label, true);
            _c.submit = null;
            if (endPlacement === 'toolbar') _c.submit = endBtn(tbar, 'submit-toolbar');
            const wrap = u.el('div', 'lst-wrap', ledger);
            const table = u.el('table', '', wrap);
            const tr = u.el('tr', '', table);
            for (const v of ['Name', 'Status', 'Start Date', 'End Date', 'Owner', '% Complete']) u.el('th', '', tr, v);
            for (const v of [
              ['Website Redesign', 'On Track', 'Mar 01, 2003', 'Jun 30, 2003', 'A. Chen', '70%'],
              ['Customer Portal', 'At Risk', 'Feb 15, 2003', 'Jul 15, 2003', 'B. Patel', '45%'],
              ['Inventory System', 'On Track', 'Mar 20, 2003', 'Aug 01, 2003', 'C. Rivera', '60%'],
              ['Mobile Client', 'Delayed', 'Apr 01, 2003', 'Sep 30, 2003', 'D. Kim', '20%'],
              ['HR System', 'On Track', 'Jan 10, 2003', 'Jun 15, 2003', 'E. Martin', '80%'],
              ['Finance Upgrade', 'At Risk', 'Feb 01, 2003', 'Aug 20, 2003', 'F. Davis', '50%'],
              ['Data Warehouse', 'On Track', 'Mar 05, 2003', 'Sep 10, 2003', 'G. Wilson', '65%'],
              ['Support Center', 'Delayed', 'Apr 12, 2003', 'Oct 01, 2003', 'H. Clark', '30%'],
              ['Training Portal', 'On Track', 'May 01, 2003', 'Nov 15, 2003', 'I. Lopez', '10%'],
            ]) {
              const row = u.el('tr', '', table);
              for (const [j, t] of v.entries()) {
                const td = u.el('td', '', row);
                if (j === 0) u.el('span', 'pi', td);
                td.append(t);
              }
            }
            const rail = u.el('div', 'toolbox', content);
            for (const t of ['Projects', 'Tasks', 'Resources', 'Reports', 'Settings']) {
              const b = u.el('div', 'rail-item' + (t === 'Projects' ? ' on' : ''), rail);
              u.el('span', 'ri ri-' + t.toLowerCase(), b);
              u.el('span', '', b, t);
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
          },
        'frame.23': (base, S) =>
          function (_c) {
            if (_c.ctx.display === 'panel') _c.aside.prepend(_c.note);
          },
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
