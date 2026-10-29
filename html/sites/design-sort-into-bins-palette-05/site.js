// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-palette-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'm3',
        'theme': 'm3',
        'title': '',
        'menu': '',
        'foot': '',
        'accent': '#111',
        'bg': '#c9cdd0',
        'surface': '#fff',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.2': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx } = _c;
            body.className =
              'design ' +
              C.theme +
              ' layout-' +
              C.layout +
              (ctx.display === 'toast' ? ' has-instruction-toast' : '') +
              (ctx.display === 'panel' ? ' has-instruction-panel' : '');
          },
        'frame.3': () => () => {},
        'frame.9': (base, S) =>
          function (_c) {
            const { head, u } = _c;
            const logo = u.svg('svg', { class: 'm3-logo', viewBox: '0 0 40 40' }, head);
            u.svg('rect', { x: 2, y: 2, width: 24, height: 24, rx: 9, fill: '#2f6fe4' }, logo);
            u.svg('rect', { x: 14, y: 14, width: 24, height: 24, rx: 10, fill: '#7da8f2', 'fill-opacity': 0.8 }, logo);
            const nav = u.el('nav', 'm3-nav', head);
            const icons = {
              Play: 'M12 3 2 12h3v9h5v-6h4v6h5v-9h3z',
              Practice: 'M4 20V10h4v10zm6 0V4h4v16zm6 0v-7h4v7z',
              Challenges: 'M7 3h10v2h4v3a4 4 0 0 1-4 4h-.3A5 5 0 0 1 13 14.9V17h3v2H8v-2h3v-2.1A5 5 0 0 1 7.3 12H7a4 4 0 0 1-4-4V5h4zM5 7v1a2 2 0 0 0 2 2V7zm14 0h-2v3a2 2 0 0 0 2-2z',
              Progress: 'M3 17l6-6 4 4 8-8 1.5 1.5L13 18l-4-4-4.5 4.5z',
            };
            for (const t of ['Play', 'Practice', 'Challenges', 'Progress']) {
              const a = u.el('span', 'm3-tab' + (t === 'Play' ? ' on' : ''), nav);
              const s = u.svg('svg', { viewBox: '0 0 24 24' }, a);
              u.svg('path', { d: icons[t] }, s);
              u.el('span', '', a, t);
            }
            const right = u.el('div', 'm3-right', head);
            const s1 = u.svg('svg', { viewBox: '0 0 24 24' }, right);
            u.svg('path', { d: 'M16 16l5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z' }, s1);
            const s2 = u.svg('svg', { viewBox: '0 0 24 24' }, right);
            u.svg('path', { d: 'M6 17V10a6 6 0 0 1 12 0v7l2 2H4l2-2ZM10 22h4M12 2V1' }, s2);
            u.el('span', 'm3-avatar', right, 'A');
            const C = { title: '' };
            if (C.title) {
              const title = u.el('div', 'title', head);
              u.el('span', 'title-text', title, C.title);
              if (C.theme === 'lisa') {
                const zoom = u.svg(
                  'svg',
                  { class: 'zoom-icon', viewBox: '0 0 24 24', fill: 'none', stroke: '#111', 'stroke-width': 2 },
                  title,
                );
                u.svg('path', { d: 'M3 3H21V21H3ZM8 8H17V14H12V18H8Z' }, zoom);
              }
            }
          },
        'frame.11': (base, S) =>
          function (_c) {
            const C = {};
            const { head, u } = _c;
            if (C.menu) {
              const menu = u.el('nav', 'menu', head, C.menu);
              if (C.theme === 'lisa') {
                const apple = u.svg('svg', { class: 'apple-icon', viewBox: '0 0 30 36', fill: '#080808' }, menu);
                u.svg(
                  'path',
                  {
                    d: 'M18 8C18 4 21 1 25 1C25 5 22 8 18 8ZM15 11C10 7 4 10 3 16C1 23 5 32 10 34C12 35 14 32 17 33C21 36 23 33 26 28C20 25 20 18 27 15C24 9 20 8 15 11Z',
                  },
                  apple,
                );
                const doc = u.svg(
                  'svg',
                  { class: 'document-icon', viewBox: '0 0 28 34', fill: 'none', stroke: '#111', 'stroke-width': 1.8 },
                  menu,
                );
                u.svg(
                  'path',
                  { d: 'M3 2H20L25 7V31H3ZM20 2V8H25M7 7H15V11H7ZM7 15H21V27H7ZM10 18H18M10 21H20M10 24H17' },
                  doc,
                );
              }
            }
          },
        'frame.16': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, instruction, note, u } = _c;
            if (C.theme === 'lisa')
              instruction.style.setProperty('--instruction-scale', Math.min(1, 90 / ctx.instruction.length));
            if (C.theme === 'memphis') {
              u.el('h1', 'brief-title', note, C.title);
              note.prepend(note.lastChild);
              u.el(
                'p',
                'brief-copy',
                note,
                'Drag and drop the months on the right to arrange them from January to December.',
              );
            }
          },
        'frame.19': (base, S) =>
          function (_c) {
            const { content, ctx, u } = _c;
            const endR = ctx.rng.fork('chrome/end'),
              keepDefault = endR.bool(0.5),
              endPlacement = keepDefault ? 'header' : endR.pick(['footer', 'link']);
            const rawEnds = ctx.content && ctx.content.END_LABELS;
            const endBank =
              Array.isArray(rawEnds) && rawEnds.length
                ? rawEnds
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
            const endText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
            const endLabel = keepDefault ? 'Save' : endText(endR.pick(endBank));
            const collideR = ctx.rng.fork('chrome/collide');
            _c.collision = null;
            if (!ctx.finish && collideR.bool(0.3)) {
              const options = [...new Set(endBank.map(endText))].filter(
                (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
              );
              if (options.length)
                _c.collision = { label: collideR.pick(options), where: collideR.pick(['header', 'footer']) };
            }
            const stage = u.el('main', 'stage', content);
            Object.assign(_c, {
              collideR,
              endBank,
              endLabel,
              endPlacement,
              endR,
              endText,
              keepDefault,
              rawEnds,
              stage,
            });
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { content, ctx, note, u } = _c;
            const C = {};
            const asideM = u.el('aside', 'aside', content);
            _c.aside = asideM;
            if (ctx.display === 'panel') asideM.append(note);
            u.el('h3', 'm3-h', asideM, 'Shapes in this activity');
            const legend = u.el('div', 'm3-legend', asideM);
            const cols = { Circle: '#e94335', Diamond: '#2f7bf0', Triangle: '#2e9c4a', Square: '#fbc518' };
            const shp = {
              Circle: { c: [12, 12, 10] },
              Diamond: { p: '12,1 23,12 12,23 1,12' },
              Triangle: { p: '12,2 23,22 1,22' },
              Square: { r: 1 },
            };
            for (const n of Object.keys(cols)) {
              const row = u.el('div', 'm3-lrow', legend);
              const sv = u.svg('svg', { viewBox: '0 0 24 24', class: 'm3-lsvg' }, row);
              const d = shp[n];
              if (d.c) u.svg('circle', { cx: 12, cy: 12, r: 11, fill: cols[n] }, sv);
              else if (d.p) u.svg('polygon', { points: d.p, fill: cols[n], stroke: cols[n], 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, sv);
              else u.svg('rect', { x: 2, y: 2, width: 20, height: 20, rx: 1.5, fill: cols[n] }, sv);
              u.el('span', '', row, n);
            }
            u.el('hr', 'm3-hr', asideM);
            u.el('h3', 'm3-h', asideM, 'Tips');
            const tips = [
              ['#dfe6fb', 'M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2zm-2 18h4v2h-4z', 'Drag a shape from the palette and drop it inside the frame.'],
              ['#e4e0f8', 'M4 4h6v6H4zM4 14h6v6H4zM14 14h6v6h-6zM17 2.5l4 4-4 4-4-4z', 'You can place and move shapes anytime.'],
              ['#d5ecdc', 'M5 2l14 11-6 1 3 6-3 1.5-3-6-5 4z', 'Make sure each shape is fully inside the frame.'],
            ];
            for (const [bg, path, text] of tips) {
              const row = u.el('div', 'm3-tip', asideM);
              const ic = u.el('span', 'm3-tipic', row);
              ic.style.background = bg;
              const sv = u.svg('svg', { viewBox: '0 0 24 24' }, ic);
              u.svg('path', { d: path }, sv);
              u.el('span', '', row, text);
            }
            if (false) {
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
                for (const [icon, label] of [
                  ['▰', 'Shapes'],
                  ['▧', 'Pictures'],
                  ['▦', 'Backgrounds'],
                  ['A', 'Text'],
                ]) {
                  const item = u.el('div', 'rail-item', _c.aside);
                  u.el('span', 'rail-icon', item, icon);
                  u.el('span', '', item, label);
                }
              } else if (C.layout === 'offset') {
                for (const text of ['Select', 'Zoom In', 'Zoom Out', 'Pan']) u.el('button', 'map-tool', _c.aside, text);
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
            }
            if (false) {
              const shell = null;
              const stats = u.el('aside', 'stats-panel', shell);
              u.el('h3', '', stats, 'Items');
              for (const [glyph, color] of [
                ['★', '#ffcc00'],
                ['●', '#e51b23'],
                ['■', '#2164df'],
                ['▲', '#229447'],
                ['◆', '#8d35b9'],
                ['⬟', '#ff7900'],
                ['⬭', '#62b7f2'],
                ['⬢', '#f5c400'],
              ]) {
                const row = u.el('div', 'stat-row', stats);
                u.el('span', 'stat-shape', row, glyph).style.color = color;
                u.el('span', 'stat-count', row, '0');
              }
              u.el('div', 'stat-total', stats, 'Total　　 0');
            }
          },
        'frame.23': () => () => {},
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, endLabel, endPlacement, footer, head, note, u } = _c;
            const decoyBtn = (parent, label) => {
              const b = u.el('button', 'xtra-end', parent, label);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.onclick = () => env.log('decoy', { label, collide: true });
              return b;
            };
            const endBtn = (parent, cls, tag, label) => {
              const b = u.el(tag, cls, parent, label);
              if (tag === 'a') b.href = '#';
              else b.type = 'button';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', label);
              b.title = label;
              b.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
              return b;
            };
            _c.headActions = null;
            if (!ctx.finish && (endPlacement === 'header' || (_c.collision && _c.collision.where === 'header'))) {
              content.classList.add('has-header-actions');
              _c.headActions = u.el('div', 'lisa-task-actions', head);
              head.insertBefore(_c.headActions, head.querySelector('.m3-right'));
              if (endPlacement === 'header')
                _c.submit = endBtn(_c.headActions, 'submit submit-header', 'button', endLabel);
              if (_c.collision && _c.collision.where === 'header') decoyBtn(_c.headActions, _c.collision.label);
            }
            if (ctx.display === 'header') {
              note.classList.add('m3-header-note');
              head.insertBefore(note, _c.headActions || head.querySelector('.m3-right'));
            }
            if (ctx.display === 'toast') {
              footer.prepend(note);
              note.querySelector('.note-close').setAttribute('aria-label', 'Dismiss task note');
            }
            if (C.theme === 'lisa') {
              const cl = u.el('button', 'clear', footer, 'Clear');
              cl.type = 'button';
              cl.onclick = () => {
                env.widgetDef.clear?.();
              };
            }
            if (!ctx.finish) {
              if (_c.collision && _c.collision.where === 'footer') decoyBtn(footer, _c.collision.label);
              if (endPlacement === 'footer') _c.submit = endBtn(footer, 'submit', 'button', endLabel);
              else if (endPlacement === 'link') _c.submit = endBtn(footer, 'submit submit-link', 'a', endLabel + ' ›');
            }
            Object.assign(_c, { decoyBtn, endBtn });
          },
      },
    },
  });
})();
