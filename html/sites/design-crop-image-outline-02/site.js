// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-outline-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'windows',
        'theme': 'motif',
        'title': '',
        'menu':
          'Workspace     File     Edit     Windows     Options                                      Mon Apr 22   10:14 AM',
        'tabs': null,
        'aside': 'Preview',
        'foot': '',
        'accent': '#111',
        'bg': '#536a8c',
        'surface': '#c7c5bc',
        'font': 'Arial, Helvetica, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.7': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, u } = _c;
            const shell = u.el('div', 'shell', body);
            if (C.theme === 'motif') {
              const icons = u.el('div', 'desktop-icons', shell);
              for (const [name, kind] of [
                ['Terminal', 'terminal'],
                ['Home', 'home'],
                ['Files', 'files'],
                ['Trash', 'trash'],
              ]) {
                const item = u.el('div', 'desktop-icon ' + kind, icons);
                u.el('span', 'desktop-glyph', item);
                u.el('span', 'desktop-label', item, name);
              }
            }
            const head = u.el('header', 'head', shell);
            Object.assign(_c, { head, shell });
          },
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.menu) {
              const menu = u.el('nav', 'menu', head, C.menu);
              if (C.theme === 'motif') {
                menu.textContent = '';
                u.el('span', 'workspace-menu', menu, 'Workspace');
                u.el('span', 'application-menus', menu, 'File     Edit     Windows     Options');
                u.el('span', 'desktop-clock', menu, 'Mon Apr 22   10:14 AM');
              }
            }
          },
        'frame.13': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, shell, u } = _c;
            const content = u.el('div', 'content', shell);
            if (C.theme === 'motif') {
              const windowHead = u.el('div', 'crop-window-head', content),
                title = u.el('div', 'crop-window-title', windowHead);
              for (const label of ['−', 'Image Crop Tool', '−']) {
                const item = u.el(label === 'Image Crop Tool' ? 'strong' : 'button', '', title, label);
                if (item.tagName === 'BUTTON') {
                  item.type = 'button';
                  item.onclick = () => env.log('window-control', { label });
                }
              }
              const menu = u.el('nav', 'crop-window-menu', windowHead);
              for (const label of ['File', 'Edit', 'View', 'Tools', 'Help']) {
                const b = u.el('button', '', menu, label);
                b.type = 'button';
                b.onclick = () => env.log('decoy', { label });
              }
            }
            const note = u.el(
              'section',
              'task-note' + (ctx.instruction.length > 90 ? ' long-instruction' : ''),
              content,
            );
            Object.assign(_c, { content, note });
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, u } = _c;
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
              } else if (C.layout === 'windows') {
                u.el('h3', 'preview-title', _c.aside, 'Preview');
                u.el('div', 'preview-image', _c.aside);
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
                } else if (C.theme === 'crop-minimal')
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
        'frame.25': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, shell, u } = _c;
            footer.hidden = ctx.finish;
            u.el('div', 'footer-copy', footer, C.foot || '');
            const endRng = ctx.rng.fork('chrome/end'),
              collideRng = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endWords = ctx.content.END_LABELS.map(labelOf);
            const classic = endRng.bool(0.5),
              placement = classic ? 'footer' : endRng.pick(['toolbar', 'status']);
            const endText = classic ? endWords.find((x) => x === 'Submit') || endWords[0] : endRng.pick(endWords);
            shell.dataset.endPlacement = placement;
            _c.submit = null;
            if (!ctx.finish) {
              const parent = C.layout === 'three' && _c.aside ? _c.aside : footer;
              _c.submit = u.el(placement === 'status' ? 'a' : 'button', 'submit end-' + placement, parent, endText);
              if (placement === 'status') _c.submit.href = '#';
              else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endText;
              _c.submit.setAttribute('aria-label', endText);
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
            }
            if (collideRng.bool(0.3)) {
              const choices = endWords.filter((x) => x.trim().toLowerCase() !== endText.trim().toLowerCase());
              const label = collideRng.pick(choices),
                decoy = u.el('button', 'end-xtra', shell, label);
              decoy.type = 'button';
              decoy.dataset.role = 'xtra';
              decoy.onclick = () => env.log('decoy', { label, collide: true });
            }
            if (C.theme === 'motif') {
              const status = u.el('div', 'crop-window-status', shell);
              u.el('span', '', status, 'Drag the handles to resize. Drag inside to move the crop box.');
              u.el('span', 'image-size', status, '800 × 600');
            }
            Object.assign(_c, { classic, collideRng, endRng, endText, endWords, labelOf, placement });
          },
        'frame.26': () => () => {},
        'frame.27': () => () => {},
      },
    },
  });
})();
