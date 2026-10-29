(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-identify-07',
    'task': 'read-figure',
    'scenario': 'identify',
    'style': 'gem',
    'title': 'Shape Identifier',
    'menu': ['Desk', 'File', 'Edit', 'Options', 'Window', 'Help'],
    'tools': ['M6 3l0 22 6-6 4 9 4-2-4-9 8 0z', '', '', '', ''],
    'layout': 'gem',
  };
  env.site({
    name: C.site,
    styles: ['site.css', 'gem.css'],
    frame(ctx) {
      let display = ctx.display;
      const small = window.innerWidth < 1100 || window.innerHeight < 680;
      if (small && (display === 'panel' || display === 'toast')) display = 'header';
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + display;
      const u = ctx.util;
      const bar = u.el('nav', 'menubar', document.body);
      C.menu.forEach((m) => u.el('span', '', bar, m));
      const app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      u.el('i', 'close-box', top);
      const title = u.el('span', 'title', top);
      u.el('b', 'title-label', title, C.title);
      u.el('i', 'arrows', top, '↕');
      u.el('i', 'arrows', top, '↕');
      const tb = u.el('div', 'toolbar', app);
      [
        ['New', 'M6 2h12l6 6v20H6z M18 2v6h6'],
        ['Open', 'M3 8h9l3 3h12v15H3z'],
        ['Save', 'M4 4h20l4 4v20H4z M9 4v8h12V4 M9 28V18h14v10'],
        ['Print', 'M8 4h16v8H8z M3 12h26v12h-5v-6H8v6H3z M8 20h16v8H8z'],
        ['|', ''],
        ['Help', ''],
      ].forEach(([n, d]) => {
        if (n === '|') {
          u.el('i', 'sep', tb);
          return;
        }
        const b = u.el('div', 'tool', tb);
        const s = u.svg('svg', { width: 40, height: 40, viewBox: '0 0 32 32' }, b);
        if (n === 'Help') {
          const t = u.svg(
            'text',
            {
              x: 16,
              y: 28,
              'text-anchor': 'middle',
              'font-size': 34,
              'font-weight': 900,
              'font-family': 'monospace',
              fill: '#000',
            },
            s,
          );
          t.textContent = '?';
        } else {
          const drawings = {
            New: ['M6 2h13l7 7v22H6z M19 2v8h7', 'M10 14h12M10 17h12M10 20h12M10 23h12M10 26h9'],
            Open: ['M3 28V6l3-3h8l4 4h10v21z', 'M3 28l2-18h25l-3 18z'],
            Save: ['M3 3h24v26H3z', 'M8 3h14v10H8z M8 20h15v9H8z M17 5h3v6h-3 M11 22h9v5h-9'],
            Print: [
              'M7 3h18v12H7z M5 13h23l2 3v12H2V16z',
              'M9 1h14v11H9z M8 21h17v10H8z M5 17h22 M11 5h9 M11 8h9 M11 25h11 M11 28h11',
            ],
          };
          drawings[n].forEach((path, i) =>
            u.svg(
              'path',
              {
                d: path,
                fill: n === 'Save' ? (i ? '#eee' : '#000') : i === 0 ? '#eee' : n === 'Open' ? '#eee' : 'none',
                stroke: '#000',
                'stroke-width': i === 0 ? 1.8 : 1,
                'stroke-linejoin': 'miter',
              },
              s,
            ),
          );
        }
        u.el('span', '', b, n);
      });
      const endR = ctx.rng.fork('chrome/end'),
        labels = (ctx.content && ctx.content.END_LABELS) || [
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
        ],
        labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const labelPick = labelOf(endR.pick(labels));
      const placementPick = ctx.finish ? null : endR.pick(['footer', 'footer', 'footer', 'toolbar', 'link', 'toolbar']);
      const referenceEnd = ctx.rng.fork('chrome/reference-end').bool(0.5),
        label = referenceEnd ? 'Submit' : labelPick,
        placement = ctx.finish ? null : referenceEnd ? 'footer' : placementPick;
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const pool = [
          ...new Set(labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (pool.length) collide = labelOf(collideR.pick(pool));
      }
      const center = u.el('div', 'center', app);
      let brief = null;
      if (display === 'header') brief = u.el('div', 'brief', center, ctx.instruction);
      else if (display === 'panel') {
        const note = u.el('section', 'gem-note gem-note-panel', center);
        u.el('b', 'gem-note-title', note, 'Task');
        u.el('div', 'gem-note-text', note, ctx.instruction);
      } else if (display === 'toast') {
        const note = u.el('div', 'gem-note gem-note-toast', center);
        u.el('span', 'gem-note-mark', note, '!');
        u.el('div', 'gem-note-text', note, ctx.instruction);
      }
      const stage = u.el('section', 'stage', center);
      const decoyBtn = (parent, text, collides) => {
        const b = u.el('button', collides ? 'gem-xtra gem-pqs' : 'gem-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      const endBtn = (parent, cls, text) => {
        const b = u.el(cls === 'gem-endlink' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish && placement === 'footer') {
        submit = endBtn(footer, 'submit', label);
      } else if (!ctx.finish && placement === 'link') {
        submit = endBtn(footer, 'gem-endlink', label + ' ›');
      } else if (!ctx.finish && placement === 'toolbar') {
        submit = endBtn(tb, 'gem-toolbar-end', label);
      }
      if (collide) {
        const parent = collideR.bool(0.6) ? tb : footer;
        decoyBtn(parent, collide, true);
      }
      const aside = u.el('aside', 'aside', document.body);
      const ah = u.el('div', 'ahead', aside);
      u.el('i', 'close-box', ah);
      u.el('b', '', ah, 'Tools');
      u.el('em', '', ah, '✕');
      const col = u.el('div', 'atools', aside);
      [
        'M8 4v22l6-5 4 9 4-2-4-9h8z',
        '',
        'M3 29l3-9L23 3l5 5-17 17z M6 20l5 5 M3 29l5-2 M21 5l5 5 M8 21L24 5 M10 23L26 7',
        'M3 20L18 5h9l2 3v9L17 29H8l-5-3z M3 20h10L27 5 M13 20v8 M3 23h10 M17 29v-9L29 8',
        'M5 16l9-8 10 5v15H5z M9 12V8c0-8 13-8 13 3 M14 13c-1-7 4-8 9-3l6 7v10h-4l-2-12 M8 17l8-6 M8 21l12-9 M8 25l14-10 M12 27l10-8 M17 27l5-4',
      ].forEach((d, i) => {
        const t = u.el('div', 'atool', col);
        const s = u.svg('svg', { width: 40, height: 40, viewBox: '0 0 32 32' }, t);
        if (i === 1)
          u.svg(
            'rect',
            {
              x: 2,
              y: 4,
              width: 28,
              height: 24,
              fill: 'none',
              stroke: '#000',
              'stroke-width': 1.5,
              'stroke-dasharray': '3 2',
            },
            s,
          );
        else if (i === 3 || i === 4) {
          const defs = u.svg('defs', {}, s),
            p = u.svg('pattern', { id: 'tool-hatch-' + i, width: 2, height: 2, patternUnits: 'userSpaceOnUse' }, defs);
          u.svg('rect', { width: 2, height: 2, fill: '#ddd' }, p);
          u.svg('path', { d: 'M0 2L2 0', stroke: '#777', 'stroke-width': 0.7 }, p);
          const path = (d, fill, sw = 1.5) =>
            u.svg('path', { d, fill, stroke: '#000', 'stroke-width': sw, 'stroke-linejoin': 'round' }, s);
          if (i === 3) {
            path('M3 20L18 5h9l2 3v9L17 29H8l-5-3z', '#ddd');
            path('M3 20L18 5h9L13 20z', 'url(#tool-hatch-3)');
            path('M3 20h10v8H8l-5-3z', '#fff');
            path('M13 20L27 5l2 3-12 14v7h-4z', '#aaa');
            path('M17 22L29 8 M19 21v4', 'none', 0.8);
          } else {
            path('M4 17l9-8 11 5v14H4z', 'url(#tool-hatch-4)');
            path('M9 12V8c0-7 12-9 13 2', 'none', 2.5);
            path('M13 14c0-7 7-8 11-2l3 5 2 9h-4l-2-10-3-3-4 2z', '#111');
            path('M6 17l8-5 7 3', 'none', 1);
          }
        } else
          u.svg(
            'path',
            { d, fill: i === 0 ? '#000' : '#ddd', stroke: '#000', 'stroke-width': 1.6, 'stroke-linejoin': 'round' },
            s,
          );
      });
      u.el('div', 'palette-tab', aside);
      const tr = u.el('div', 'trash', document.body);
      const ts = u.svg('svg', { width: 48, height: 56, viewBox: '0 0 32 38' }, tr);
      u.svg(
        'path',
        {
          d: 'M4 9h24l-3 26q-9 5-18 0z M9 13l1 21 M13 14v21 M18 14v21 M23 13l-1 21',
          fill: '#eee',
          stroke: '#000',
          'stroke-width': 1.4,
        },
        ts,
      );
      u.svg('ellipse', { cx: 16, cy: 8, rx: 15, ry: 5, fill: '#ddd', stroke: '#000', 'stroke-width': 1.3 }, ts);
      u.svg(
        'path',
        {
          d: 'M2 7l4-3 5 1 3-4 5 3 5-2 5 5 M5 8l7 2 8-1 7-2 M8 5l5 2 9-2',
          fill: '#eee',
          stroke: '#000',
          'stroke-width': 1,
        },
        ts,
      );
      u.el('span', '', tr, 'Trash');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
