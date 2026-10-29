// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-resize-element-column-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'ledger',
        'theme': 'aero',
        'title': 'Employees',
        'subtitle': '',
        'menu': 'Employees       Reports       Calendar       Documents       Settings',
        'foot':
          'Tip: Drag a column border left or right to change the column width.  The ruler shows each column’s width in pixels.',
        'accent': '#d9000d',
        'bg': '#faf7f0',
        'surface': '#fff',
        'font': "Arial, 'Segoe UI', sans-serif",
      },
      parts: {
        'frame.3': () => () => {},
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            const toolbar = u.el('div', 'employee-toolbar', head);
            const title = head.querySelector('.title');
            if (title) toolbar.appendChild(title);
            if (C.menu) {
              const nav = u.el('nav', 'menu', head);
              const icons = [
                ['M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M2 22v-4c0-3 3-5 7-5s7 2 7 5v4Z', 'M17 4a4 4 0 0 1 0 8M18 14c3 0 5 2 5 5v3h-5'],
                ['M4 14h4v10H4ZM11 4h4v20h-4ZM18 9h4v15h-4Z'],
                ['M3 7h22v19H3ZM3 7V4h22v3M8 1v6M20 1v6'],
                ['M2 7h10l3 3h11v15H2Z'],
                ['M11 2h6l1 4 4 2 4-1 3 5-3 3v4l3 3-3 5-4-1-4 2-1 4h-6l-1-4-4-2-4 1-3-5 3-3v-4l-3-3 3-5 4 1 4-2Z', 'M14 11a6 6 0 1 0 0 12 6 6 0 0 0 0-12'],
              ];
              for (const [i, label] of C.menu.trim().split(/\s{2,}/).entries()) {
                const item = u.el('div', 'dock-item' + (i === 0 ? ' selected' : ''), nav);
                const svg = u.svg('svg', {viewBox: i === 4 ? '-2 0 34 34' : '0 0 28 28', fill: i < 2 ? 'currentColor' : 'none', stroke: 'currentColor', 'stroke-width': i < 2 ? 0 : 2.4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round'}, item);
                for (const d of icons[i]) u.svg('path', {d}, svg);
                u.el('b', 'dock-label', item, label);
              }
            }
            const search = u.el('div', 'header-search', toolbar);
            const searchSvg = u.svg('svg', {viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':2}, search);
            u.svg('path', {d:'M16 16l5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0'}, searchSvg);
            u.el('span', '', search, 'Search employees...');
            const actions = u.el('div', 'header-actions', toolbar);
            for (const [i, name] of ['Filter','Table view','More options'].entries()) {
              const button = u.el('button', 'header-action', actions);
              button.type = 'button'; button.title = name; button.setAttribute('aria-label', name);
              const svg = u.svg('svg', {viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':2,'stroke-linejoin':'round'}, button);
              if (i === 0) u.svg('path', {d:'M3 4h18l-7 8v9l-4-3v-6Z'}, svg);
              if (i === 1) u.svg('path', {d:'M3 3h18v18H3ZM3 9h18M3 15h18M9 3v18M15 3v18'}, svg);
              if (i === 2) for (const cy of [4,12,20]) u.svg('circle', {cx:12,cy,r:1.5,fill:'currentColor'}, svg);
            }
            const endActions = u.el('div', 'end-actions', toolbar);
            Object.assign(_c, { toolbar, search, endActions });
          },
        'frame.19': (base, S) =>
          function (_c) {
            const { content, ctx, head, u, endActions } = _c;
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
            let endLabel = endRng.pick(endLabels);
            const favored = endLabels.find((label) => String(label).toLowerCase() === 'confirm');
            if (ctx.rng.fork('employee/end-label').bool(0.5) && favored) endLabel = favored;
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
            if (_c.collide && _c.collide.where === 'toolbar') decoyBtn(endActions, _c.collide.label, true);
            _c.submit = null;
            if (endPlacement === 'toolbar') _c.submit = endBtn(endActions, 'submit-toolbar');
            const stage = u.el('main', 'stage', content);
            Object.assign(_c, {
              collideRng,
              decoyBtn,
              endBtn,
              endLabel,
              endLabels,
              endPlacement,
              endRng,
              stage,
            });
          },
        'frame.21': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, stage, head, u } = _c;
            if (env.widgetDef && !env.widgetDef.render.employeeRuler) {
              const render = employeeColumnRenderer(env.widgetDef.render);
              render.employeeRuler = true;
              env.widgetDef.render = render;
            }
            const shell = content.closest('.shell');
            const pageWidth = shell.parentElement.getBoundingClientRect().width;
            const mode = (pageWidth <= 1100 && ['panel','toast'].includes(ctx.display)) ? 'header' : ctx.display;
            shell.dataset.instruction = mode;
            const note = content.querySelector('.task-note');
            if (note && mode === 'header') head.appendChild(note);
            _c.aside = null;
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
              } else if (C.layout === 'ledger') {
                _c.aside.classList.add('overview');
                u.el('h2', '', _c.aside, 'Employee Overview');
                for (const [number, label] of [['10', 'Total Employees'], ['5', 'Departments'], ['3', 'Locations'], ['10', 'Active Employees']]) {
                  const item = u.el('div', 'stat', _c.aside);
                  u.el('strong', '', item, number);
                  u.el('span', '', item, label);
                }
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
        'frame.22': () => () => {},
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { ctx, decoyBtn, endBtn, endPlacement, footer } = _c;
            if (_c.collide && _c.collide.where === 'footer') decoyBtn(footer, _c.collide.label, true);
            if (!ctx.finish && (endPlacement === 'footer' || endPlacement === 'footer-link'))
              _c.submit = endBtn(footer, endPlacement === 'footer-link' ? 'submit-link' : '');
          },
        'frame.27': () => function (_c) {
          const root = _c.head.closest('.design');
          if (root) root.style.setProperty('--employee-header-bottom', _c.head.getBoundingClientRect().bottom + 'px');
        },
      },
    },
  });
})();
