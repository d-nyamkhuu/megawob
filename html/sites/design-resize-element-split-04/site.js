// Design on templates/site/reorder-items-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-resize-element-split-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'ledger',
        'theme': 'vista',
        'title': 'Documents',
        'menu': 'Organize Views Open Share Burn',
        'foot': '',
        'accent': '#287caf',
        'bg': '#d5e8f5',
        'surface': '#ffffff',
        'font': "'Segoe UI', Tahoma, Arial, sans-serif",
      },
      parts: {
        'frame.3': () => () => {},
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
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
        'frame.27': (base) =>
          function (_c) {
            base(_c);
            const { ctx, footer, head, u } = _c;
            const rng = ctx.rng.fork('chrome/end');
            const placement = rng.pick(['footer', 'footer', 'toolbar', 'footer-link']);
            const labels = ctx.content.END_LABELS.map((x) =>
              typeof x === 'string' ? x : x.label || x.text || x.name,
            );
            const label = rng.pick(labels);
            if (_c.submit) {
              _c.submit.textContent = label;
              _c.submit.title = label;
              _c.submit.setAttribute('aria-label', label);
              if (placement === 'toolbar') {
                _c.submit.classList.add('gem-end-toolbar');
                head.querySelector('.menu').append(_c.submit);
              } else if (placement === 'footer-link') {
                _c.submit.classList.add('gem-end-link');
              }
            }
            const action = ctx.rng.fork('chrome/site').pick(['Properties', 'Refresh', 'Options']);
            const button = u.el('button', 'xtra-end', footer, action);
            button.type = 'button';
            button.dataset.role = 'xtra';
            button.onclick = () => env.log('toolbar-action', { label: action });
          },
        'frame.30': (base) =>
          function (_c) {
            const { ctx, note, head, aside, footer } = _c;
            if (ctx.display === 'header') {
              head.classList.add('has-header-note');
              head.append(note);
            } else if (ctx.display === 'panel') {
              aside.insertBefore(note, aside.querySelector('.preview-body'));
            } else if (ctx.display === 'toast') {
              footer.append(note);
            }
            return base(_c);
          },
      },
    },
  });
})();
