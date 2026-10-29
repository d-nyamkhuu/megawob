// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-palette-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'sheet',
        'theme': 'lisa',
        'title': 'Shape Builder',
        'menu': 'File    Edit    View    Arrange    Objects    Window    Help',
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
            const { C } = S;
            const { head, u } = _c;
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
            const { C } = S;
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
              endPlacement = keepDefault ? 'footer' : endR.pick(['header', 'link']);
            const rawEnds = ctx.content && ctx.content.END_LABELS;
            const endBank =
              Array.isArray(rawEnds) && rawEnds.length
                ? rawEnds
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
            const endText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
            const endLabel = keepDefault ? 'Submit' : endText(endR.pick(endBank));
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
            const { C } = S;
            const { content, ctx, shell, u } = _c;
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
            if (C.layout === 'sheet') {
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
            const { content, ctx, endLabel, endPlacement, footer, note, u } = _c;
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
              _c.headActions = u.el('div', 'lisa-task-actions', content);
              if (endPlacement === 'header')
                _c.submit = endBtn(_c.headActions, 'submit submit-header', 'button', endLabel);
              if (_c.collision && _c.collision.where === 'header') decoyBtn(_c.headActions, _c.collision.label);
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
