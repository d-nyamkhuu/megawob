(function () {
  'use strict';
  const C = { site: 'design-read-figure-spatial-01' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      let display = ctx.display || 'header';
      document.body.className = 'brutal instruction-' + display + (ctx.finish ? ' finish-mode' : '');
      const app = u.el('main', 'app', document.body);
      const center = u.el('div', 'center', app);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', center);
      const coords = u.el('div', 'board-coords', center);
      const columns = u.el('div', 'coord-columns', coords);
      'A B C D E F'.split(' ').forEach((x) => u.el('span', '', columns, x));
      const rows = u.el('div', 'coord-rows', coords);
      '1 2 3 4 5'.split(' ').forEach((x) => u.el('span', '', rows, x));
      const legend = u.el('div', 'legend-title', aside, 'Icon Legend');
      const list = u.el('div', 'legend-list', aside);
      const names = [
        'star',
        'circle',
        'square',
        'triangle',
        'diamond',
        'heart',
        'plus',
        'flag',
        'sun',
        'cloud',
        'moon',
        'lightning',
        'leaf',
        'gear',
        'home',
        'book',
        'tree',
        'cup',
        'pencil',
        'search',
        'car',
        'paw',
        'drop',
        'crown',
      ];
      const colors = [
        '#ffcf16',
        '#ff4925',
        '#098ffa',
        '#2da655',
        '#823ce4',
        '#282828',
        '#282828',
        '#ff7a21',
        '#ffcf16',
        '#b7b7b5',
        '#ffcf16',
        '#098ffa',
        '#2da655',
        '#282828',
        '#282828',
        '#f5f3ed',
        '#2da655',
        '#b7b7b5',
        '#ffcf16',
        '#098ffa',
        '#ff4925',
        '#282828',
        '#098ffa',
        '#ffcf16',
      ];
      const shapes = {
        star: [['polygon', { points: '12,1 15,8 23,9 17,14 19,22 12,18 5,22 7,14 1,9 9,8' }]],
        circle: [['circle', { cx: 12, cy: 12, r: 9 }]],
        square: [['rect', { x: 3, y: 3, width: 18, height: 18 }]],
        triangle: [['polygon', { points: '12,2 22,21 2,21' }]],
        diamond: [['polygon', { points: '12,1 23,12 12,23 1,12' }]],
        heart: [['path', { d: 'M12 22S1 15 1 8a5.5 5.5 0 0111-1 5.5 5.5 0 0111 1c0 7-11 14-11 14z' }]],
        plus: [['path', { d: 'M8 1h8v7h7v8h-7v7H8v-7H1V8h7z' }]],
        flag: [['path', { d: 'M4 23V2m1 2c7-4 10 4 16 0v11c-7 4-10-4-16 0' }]],
        sun: [
          ['circle', { cx: 12, cy: 12, r: 5 }],
          [
            'path',
            { d: 'M12 1v3m0 16v3M1 12h3m16 0h3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1m0-15.6-2.1 2.1M6.3 17.7l-2.1 2.1' },
          ],
        ],
        cloud: [['path', { d: 'M6 19h12a5 5 0 000-10 7 7 0 00-13-1A5.5 5.5 0 006 19z' }]],
        moon: [['path', { d: 'M19 17A9 9 0 017 4a9 9 0 1012 13z' }]],
        lightning: [['path', { d: 'M13 1L4 14h7l-1 9 10-14h-7z' }]],
        leaf: [['path', { d: 'M22 2C10 2 3 7 3 15a7 7 0 0013 3c4-4 6-10 6-16zM3 22l11-12' }]],
        gear: [
          ['circle', { cx: 12, cy: 12, r: 4 }],
          [
            'path',
            { d: 'M10 1h4l1 3 3 1 3-1 2 4-2 2v4l2 2-2 4-3-1-3 1-1 3h-4l-1-3-3-1-3 1-2-4 2-2v-4L1 8l2-4 3 1 3-1z' },
          ],
        ],
        home: [['path', { d: 'M1 11L12 2l11 9h-3v11h-6v-7h-4v7H4V11z' }]],
        book: [['path', { d: 'M2 4q5-3 10 1 5-4 10-1v16q-5-3-10 1-5-4-10-1zM12 5v16' }]],
        tree: [
          ['circle', { cx: 12, cy: 8, r: 7 }],
          ['path', { d: 'M9 13h6l2 5h-4v5h-3v-5H6z' }],
        ],
        cup: [['path', { d: 'M3 4h15v9a7 7 0 01-14 0zM18 7h2a3 3 0 010 6h-3' }]],
        pencil: [['path', { d: 'M3 18L17 4l4 4L7 22l-5 1zM14 7l4 4' }]],
        search: [
          ['circle', { cx: 10, cy: 10, r: 6 }],
          ['path', { d: 'M14.5 14.5L22 22' }],
        ],
        car: [
          ['path', { d: 'M2 13l2-6h13l5 6v6H2zM6 7l2-4h8l3 4' }],
          ['circle', { cx: 7, cy: 19, r: 2 }],
          ['circle', { cx: 18, cy: 19, r: 2 }],
        ],
        paw: [
          ['circle', { cx: 6, cy: 7, r: 2.5 }],
          ['circle', { cx: 12, cy: 4, r: 2.5 }],
          ['circle', { cx: 18, cy: 7, r: 2.5 }],
          ['path', { d: 'M4 17q1-5 8-5t8 5q0 5-5 4l-3-1-3 1q-5 1-5-4z' }],
        ],
        drop: [['path', { d: 'M12 1S3 12 3 16a9 9 0 0018 0c0-4-9-15-9-15z' }]],
        crown: [
          ['path', { d: 'M2 7l5 4 5-8 5 8 5-4-2 13H4z' }],
          ['circle', { cx: 2, cy: 6, r: 1.5 }],
          ['circle', { cx: 12, cy: 2, r: 1.5 }],
          ['circle', { cx: 22, cy: 6, r: 1.5 }],
        ],
      };
      names.forEach((n, i) => {
        const row = u.el('div', 'legend-row', list);
        const svg = u.svg('svg', { viewBox: '0 0 24 24', class: 'legend-svg', 'aria-hidden': 'true' }, row);
        (shapes[n] || []).forEach(([tag, a]) =>
          u.svg(
            tag,
            {
              ...a,
              fill:
                tag === 'path' &&
                [
                  'sun',
                  'leaf',
                  'gear',
                  'home',
                  'book',
                  'cup',
                  'pencil',
                  'search',
                  'car',
                  'paw',
                  'drop',
                  'crown',
                ].includes(n)
                  ? 'none'
                  : colors[i],
              stroke: '#10110e',
              'stroke-width': 1.8,
              'stroke-linejoin': 'round',
              'stroke-linecap': 'round',
            },
            svg,
          ),
        );
        u.el('span', 'legend-label', row, n);
      });
      let note = null;
      if (display === 'panel') {
        note = u.el('div', 'task-panel', aside);
        u.el('b', '', note, 'Task note');
        u.el('p', '', note, ctx.instruction);
      }
      if (display === 'header') {
        const h = u.el('div', 'task-header', app, ctx.instruction);
        app.insertBefore(h, center);
      }
      if (display === 'toast') {
        const t = u.el('div', 'task-toast', document.body, ctx.instruction);
      }
      const dock = u.el('footer', 'dock', app);
      const tabs = ['Home', 'Board', 'Stats', 'Settings'];
      tabs.forEach((name, i) => {
        const b = u.el('div', 'dock-tab' + (i === 0 ? ' active' : ''), dock);
        const icon = u.svg('svg', { viewBox: '0 0 32 32', class: 'tab-svg', 'aria-hidden': 'true' }, b);
        if (i === 0) u.svg('path', { d: 'M2 15L16 3l14 12h-4v14H18v-9h-5v9H6V15z', fill: 'currentColor' }, icon);
        if (i === 1) {
          for (let y = 3; y < 25; y += 9)
            for (let x = 3; x < 25; x += 9)
              u.svg('rect', { x, y, width: 7, height: 7, rx: 1, fill: 'currentColor' }, icon);
        }
        if (i === 2) {
          u.svg('rect', { x: 3, y: 18, width: 6, height: 11, fill: 'currentColor' }, icon);
          u.svg('rect', { x: 13, y: 11, width: 6, height: 18, fill: 'currentColor' }, icon);
          u.svg('rect', { x: 23, y: 3, width: 6, height: 26, fill: 'currentColor' }, icon);
        }
        if (i === 3)
          u.svg(
            'path',
            {
              d: 'M13 1h6l1 4 3 1 3-2 4 5-3 3v4l3 3-4 5-3-2-3 1-1 4h-6l-1-4-3-1-3 2-4-5 3-3v-4L2 9l4-5 3 2 3-1z',
              fill: 'currentColor',
            },
            icon,
          );
        u.el('span', '', b, name);
      });
      let submit = null;
      if (!ctx.finish) {
        const labels = ctx.content?.END_LABELS || ['Submit', 'Done', 'Finish'];
        const s = labels.find((x) => String(x).toLowerCase() === 'submit') || labels[0];
        const cr = ctx.rng.fork('chrome/collide');
        const options = labels.filter((x) => String(x).trim().toLowerCase() !== String(s).trim().toLowerCase());
        let controls = dock;
        if (cr.bool(0.3) && options.length) {
          dock.classList.add('has-xtra');
          controls = u.el('div', 'end-actions', dock);
          const label = String(cr.pick(options));
          const decoy = u.el('button', 'submit end-xtra', controls, label);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
        submit = u.el('button', 'submit', controls, String(s));
        submit.type = 'button';
        submit.addEventListener('click', ctx.submit);
      }
      if (display === 'panel') aside.append(note);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      u.el(
        'span',
        '',
        el,
        ctx.kind === 'cookie'
          ? 'This application uses cookies.'
          : ctx.kind === 'chat'
            ? 'Need a hand?'
            : ctx.kind === 'promo'
              ? 'Explore more of the workspace.'
              : 'An update is available.',
      );
      const b = u.el('button', '', el, '×');
      b.setAttribute('aria-label', 'Dismiss');
      b.addEventListener('click', ctx.dismiss);
      return { el, dismiss: b };
    },
  });
})();
