// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-collect-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'homepage',
        'theme': 'community',
        'title': 'Maple Grove Online',
        'subtitle': 'Our Little Corner of the Internet',
        'menu': 'Home    |    Friends    |    Photos    |    Activities    |    Guestbook',
        'foot': 'Friendship\nMakes a Brighter\nTomorrow',
        'accent': '#11153f',
        'bg': '#f3e9d9',
        'surface': '#fffdf3',
        'font': "Georgia, 'Times New Roman', serif",
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
              ' display-' +
              ctx.display +
              (ctx.display === 'toast' ? ' has-instruction-toast' : '');
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
        'frame.13': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, head, shell, u } = _c;
            if (C.theme === 'community') {
              const draw = (parent, cls, viewBox, parts) => {
                const host = u.el('span', cls, parent);
                host.setAttribute('aria-hidden', 'true');
                const svg = u.svg('svg', { viewBox, focusable: 'false' }, host);
                for (const [tag, attrs] of parts) u.svg(tag, attrs, svg);
                return host;
              };
              draw(head, 'community-house', '0 0 150 110', [
                [
                  'polygon',
                  {
                    points: '4,96 18,76 29,86 42,71 57,87 70,77 86,94 100,82 116,98',
                    fill: '#168b3c',
                    stroke: '#101321',
                    'stroke-width': 4,
                    'stroke-linejoin': 'miter',
                  },
                ],
                [
                  'rect',
                  { x: 27, y: 38, width: 83, height: 58, fill: '#eee9d9', stroke: '#111423', 'stroke-width': 4 },
                ],
                ['rect', { x: 25, y: 7, width: 17, height: 22, fill: '#da1d2c', stroke: '#111423', 'stroke-width': 4 }],
                [
                  'polygon',
                  {
                    points: '7,43 44,8 54,8 54,14 90,14 90,8 101,8 139,44 129,55 75,31 17,57',
                    fill: '#e7192d',
                    stroke: '#111423',
                    'stroke-width': 4,
                    'stroke-linejoin': 'miter',
                  },
                ],
                [
                  'path',
                  {
                    d: 'M18 34H35M27 24H43M50 21H69M76 22H91M105 31H120M37 47V57M66 38V50M96 39V51',
                    fill: 'none',
                    stroke: '#111423',
                    'stroke-width': 4,
                  },
                ],
                [
                  'rect',
                  { x: 39, y: 56, width: 19, height: 24, fill: '#f7cf36', stroke: '#111423', 'stroke-width': 4 },
                ],
                ['path', { d: 'M48 57V79M40 68H57', stroke: '#111423', 'stroke-width': 3 }],
                [
                  'rect',
                  { x: 77, y: 55, width: 19, height: 25, fill: '#f7cf36', stroke: '#111423', 'stroke-width': 4 },
                ],
                ['path', { d: 'M86 56V79M78 67H95', stroke: '#111423', 'stroke-width': 3 }],
                [
                  'rect',
                  { x: 64, y: 69, width: 13, height: 27, fill: '#6a4b32', stroke: '#111423', 'stroke-width': 3 },
                ],
              ]);
            }
            const content = u.el('div', 'content', shell),
              note = u.el('section', 'task-note', content);
            u.el(
              'div',
              'note-label',
              note,
              C.layout === 'left' ? 'Task' : ctx.display === 'panel' ? 'Community notice' : '',
            );
            Object.assign(_c, { content, note });
          },
        'frame.14': () => () => {},
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
        'frame.22': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, head, u } = _c;
            if (C.theme === 'community') {
              const draw = (parent, cls, viewBox, parts) => {
                const host = u.el('span', cls, parent);
                host.setAttribute('aria-hidden', 'true');
                const svg = u.svg('svg', { viewBox, focusable: 'false' }, host);
                for (const [tag, attrs] of parts) u.svg(tag, attrs, svg);
                return host;
              };
              draw(footer, 'community-flower', '0 0 100 100', [
                [
                  'path',
                  {
                    d: 'M49 94Q46 62 33 34M52 94Q52 58 60 22M54 94Q61 69 77 48',
                    fill: 'none',
                    stroke: '#176b36',
                    'stroke-width': 7,
                    'stroke-linecap': 'square',
                  },
                ],
                [
                  'path',
                  {
                    d: 'M45 77Q19 74 18 57Q39 59 49 72M53 80Q78 74 84 58Q65 60 54 75M44 59Q24 51 27 39Q43 45 49 56M59 65Q76 55 74 44Q62 48 57 60',
                    fill: '#258444',
                    stroke: '#101a21',
                    'stroke-width': 3,
                    'stroke-linejoin': 'miter',
                  },
                ],
                [
                  'path',
                  {
                    d: 'M23 67L39 71M64 70L78 62M31 47L43 54M62 58L70 49',
                    fill: 'none',
                    stroke: '#77b64f',
                    'stroke-width': 2,
                  },
                ],
                [
                  'path',
                  {
                    d: 'M24 27Q20 14 31 10Q41 7 46 18Q50 5 61 10Q71 15 63 28Q75 20 82 30Q88 40 72 46Q59 52 49 41Q39 53 26 44Q15 37 24 27Z',
                    fill: '#8d2fac',
                    stroke: '#101321',
                    'stroke-width': 3,
                  },
                ],
                ['circle', { cx: 47, cy: 29, r: 6, fill: '#f3d331', stroke: '#111423', 'stroke-width': 2 }],
                ['circle', { cx: 71, cy: 34, r: 5, fill: '#f3d331', stroke: '#111423', 'stroke-width': 2 }],
              ]);
              draw(footer, 'community-cat', '0 0 90 100', [
                [
                  'path',
                  {
                    d: 'M15 94V76Q8 66 13 52L20 39 23 13 40 25 54 25 70 12 74 40 83 53 82 83 73 94 62 94 59 76 48 76 45 94 34 94 31 76 22 76Z',
                    fill: '#bec1bf',
                    stroke: '#11131a',
                    'stroke-width': 4,
                    'stroke-linejoin': 'miter',
                  },
                ],
                [
                  'path',
                  { d: 'M23 40L25 17 39 30M56 29L70 16 72 40', fill: '#888f91', stroke: '#11131a', 'stroke-width': 3 },
                ],
                [
                  'path',
                  {
                    d: 'M23 44H37L43 49H53L59 44H70V59L64 67 54 71 48 67 41 71 30 66 24 58Z',
                    fill: '#f1eee4',
                    stroke: '#11131a',
                    'stroke-width': 2,
                  },
                ],
                ['circle', { cx: 34, cy: 49, r: 3, fill: '#11131a' }],
                ['circle', { cx: 61, cy: 49, r: 3, fill: '#11131a' }],
                [
                  'path',
                  {
                    d: 'M44 57L48 60 52 57M48 60V64M48 64L43 67M48 64L53 67',
                    fill: 'none',
                    stroke: '#11131a',
                    'stroke-width': 2,
                  },
                ],
                ['path', { d: 'M16 83H34M57 83H77', fill: 'none', stroke: '#11131a', 'stroke-width': 4 }],
                [
                  'path',
                  {
                    d: 'M18 63Q5 62 7 75L18 79M24 73L31 80M57 73L64 80M68 57L78 55M68 62L79 64M28 51L39 55M56 55L67 51',
                    fill: 'none',
                    stroke: '#555d60',
                    'stroke-width': 2,
                  },
                ],
                [
                  'path',
                  { d: 'M29 78H40V91H32ZM51 78H62V91H54Z', fill: '#f0eee6', stroke: '#11131a', 'stroke-width': 2 },
                ],
              ]);
            }
            const endR = ctx.rng.fork('chrome/end'),
              endBank = ctx.content && ctx.content.END_LABELS;
            const endLabels =
              Array.isArray(endBank) && endBank.length
                ? endBank
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
            const endText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
            const standard = !ctx.finish && endR.bool(0.62);
            const label = standard
              ? endLabels.map(endText).find((x) => x.trim().toLowerCase() === 'submit') || 'Submit'
              : endText(endR.pick(endLabels));
            const placement = ctx.finish ? null : standard ? 'footer' : endR.pick(['footer', 'header', 'link', 'icon']);
            _c.submit = null;
            const submitBtn = (parent, kind, text) => {
              const node = u.el(kind === 'link' ? 'a' : 'button', 'submit community-submit-' + kind, parent, text);
              node.type = kind === 'link' ? undefined : 'button';
              if (kind === 'link') node.href = '#';
              node.dataset.role = 'submit';
              node.setAttribute('aria-label', label);
              node.title = label;
              node.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
              return node;
            };
            const collideR = ctx.rng.fork('chrome/collide');
            _c.collide = null;
            if (collideR.bool(0.3)) {
              const pool = endLabels.map(endText).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
              if (pool.length) _c.collide = collideR.pick(pool);
            }
            const decoyBtn = (parent, text) => {
              const b = u.el('button', 'community-xtra', parent, text);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.onclick = () => env.log('decoy', { label: text, collide: true });
              return b;
            };
            if (placement === 'footer') _c.submit = submitBtn(footer, 'button', label);
            else if (placement === 'header') _c.submit = submitBtn(head, 'header', label);
            else if (placement === 'link') _c.submit = submitBtn(footer, 'link', label + ' ›');
            else if (placement === 'icon') _c.submit = submitBtn(footer, 'icon', '✓');
            if (_c.collide) decoyBtn(placement === 'header' ? head : footer, _c.collide);
            if (C.theme === 'lisa') {
              const cl = u.el('button', 'clear', footer, 'Clear');
              cl.type = 'button';
              cl.onclick = () => {
                env.widgetDef.clear?.();
              };
              if (_c.submit) footer.insertBefore(cl, _c.submit);
            }
            Object.assign(_c, {
              collideR,
              decoyBtn,
              endBank,
              endLabels,
              endR,
              endText,
              label,
              placement,
              standard,
              submitBtn,
            });
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
