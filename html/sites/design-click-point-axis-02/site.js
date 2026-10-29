// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-point-axis-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'three',
        'theme': 'community',
        'title': 'Riverside Community Pages',
        'subtitle': 'Our Town　~　Our People　~　Our Place',
        'ribbon': false,
        'foot': '',
        'accent': '#18264d',
        'bg': '#f4f0e6',
        'surface': '#f9f7f0',
        'font': 'Georgia, serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.12': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.ribbon) {
              const rib = u.el('div', 'ribbon', head);
            }
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
              } else if (C.theme === 'community') {
                const card = u.el('section', 'count-card', _c.aside);
                const bar = u.el('h3', 'count-title', card, 'Yearly Counts');
                const tree = u.el('span', 'pixel-tree', bar, '♣');
                const table = u.el('table', 'counts-table', card);
                const thead = u.el('thead', '', table),
                  tr = u.el('tr', '', thead);
                u.el('th', '', tr, 'Year');
                u.el('th', '', tr, 'Trees Planted');
                const tbody = u.el('tbody', '', table);
                for (const [year, count] of [
                  [2010, 3],
                  [2011, 5],
                  [2012, 4],
                  [2013, 6],
                  [2014, 8],
                  [2015, 7],
                  [2016, 9],
                ]) {
                  const row = u.el('tr', '', tbody);
                  u.el('td', '', row, String(year));
                  u.el('td', '', row, String(count));
                }
                const summary = u.el('section', 'summary-card', _c.aside);
                const sh = u.el('h3', 'count-title', summary, 'Summary');
                u.el('span', 'pixel-tree', sh, '♣');
                const dl = u.el('dl', 'summary-list', summary);
                for (const [k, v] of [
                  ['Total Years', '7'],
                  ['Total Trees', '42'],
                  ['Average per Year', '6'],
                  ['Highest Count', '9'],
                  ['Lowest Count', '3'],
                ]) {
                  u.el('dt', '', dl, k);
                  u.el('dd', '', dl, v);
                }
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
            const { ctx, footer, head, u } = _c;
            const endR = ctx.rng.fork('chrome/end');
            const finishMode = !!ctx.finish;
            const endMode = finishMode ? 'none' : endR.bool(0.5) ? 'footer' : endR.pick(['toolbar', 'link']);
            const endBank =
              ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                ? ctx.content.END_LABELS
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
            const asLabel = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
            const endLabel = endMode === 'footer' ? 'Submit' : asLabel(endR.pick(endBank));
            const submitInto = (parent, tag, cls, text) => {
              const b = u.el(tag, cls, parent, text);
              if (tag === 'button') b.type = 'button';
              else b.href = '#';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', endLabel);
              b.title = endLabel;
              b.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
              return b;
            };
            const toolbarHead = head;
            if (endMode === 'footer') {
              _c.submit = submitInto(footer, 'button', 'submit', 'Submit');
            } else if (endMode === 'link') {
              _c.submit = submitInto(footer, 'a', 'end-link', endLabel + ' ›');
              _c.submit.style.cssText =
                'margin-left:auto;color:#111;text-decoration:underline;font:20px Georgia,serif;padding:10px 14px;white-space:nowrap';
            } else if (endMode === 'toolbar') {
              _c.submit = submitInto(toolbarHead, 'button', 'toolbar-end', endLabel);
            }
            const collideR = ctx.rng.fork('chrome/collide');
            if (collideR.bool(0.3)) {
              const collidePool = [
                ...new Set(
                  endBank.map(asLabel).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()),
                ),
              ];
              if (collidePool.length) {
                const decoy = u.el('button', 'chrome-xtra', footer, collideR.pick(collidePool));
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.style.cssText =
                  'height:42px;padding:5px 10px;border:1px dashed #555;background:#f2f1ed;color:#111;font:16px Georgia,serif';
                decoy.onclick = () => env.log('decoy', { label: decoy.textContent, collide: true });
              }
            }
            if (C.theme === 'eink') {
              const points = u.el('span', 'points', footer, 'Points: 0/1');
              footer.insertBefore(points, _c.submit && _c.submit.parentNode === footer ? _c.submit : null);
              const clear = u.el('button', 'clear', footer, 'Clear');
              clear.onclick = () => {
                env.widgetDef.clear?.();
              };
            }
            Object.assign(_c, {
              asLabel,
              collideR,
              endBank,
              endLabel,
              endMode,
              endR,
              finishMode,
              submitInto,
              toolbarHead,
            });
          },
        'frame.28': () => () => {},
      },
    },
  });
})();
