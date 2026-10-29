// Design on templates/site/drag-slider-horizontal-11.js: only what this site changed.
(function () {
  'use strict';
  function outlineIcon(parent, name, cls) {
    const paths = {
      file: 'M6 2h8l5 5v15H6z M14 2v6h5',
      folder: 'M2 6h8l2 9H2z M2 6V4h7l2 2 M2 6h18v13H2z',
      image: 'M3 4h18v16H3z M5 17l5-5 3 3 3-4 4 6 M8 8h.1',
      trash: 'M4 6h16 M9 6V3h6v3 M6 6l1 15h10l1-15 M10 10v8 M14 10v8',
      tag: 'M3 12l9-9h8v8l-9 9z M16 7h.1',
      book: 'M3 4c4-2 7-1 9 1v16c-2-2-5-3-9-1z M21 4c-4-2-7-1-9 1v16c2-2 5-3 9-1z',
      heart: 'M12 21S3 15 3 9a5 5 0 019-3 5 5 0 019 3c0 6-9 12-9 12z',
      clock: 'M12 22a10 10 0 110-20 10 10 0 010 20z M12 6v6l4 2',
      people:
        'M16 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1 M9.5 11a4 4 0 110-8 4 4 0 010 8z M16 4a4 4 0 010 7 M17 15h1a4 4 0 014 4v1',
      gear: 'M12 8a4 4 0 100 8 4 4 0 000-8z M19 13a7 7 0 000-2l2-1-2-4-2 1a7 7 0 00-2-1l-.3-2h-5L9 6a7 7 0 00-2 1L5 6l-2 4 2 1a7 7 0 000 2l-2 1 2 4 2-1a7 7 0 002 1l.7 2h5l.3-2a7 7 0 002-1l2 1 2-4z',
    };
    const svg = env.util.svg('svg', { viewBox: '0 0 24 24', class: cls, 'aria-hidden': 'true' }, parent);
    env.util.svg(
      'path',
      {
        d: paths[name],
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': 1.8,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      },
      svg,
    );
    return svg;
  }
  function brandMark(parent) {
    const svg = env.util.svg('svg', { viewBox: '0 0 40 40', class: 'brand-mark', 'aria-hidden': 'true' }, parent);
    env.util.svg(
      'path',
      {
        d: 'M20 35C19 25 20 16 21 5M20 25C14 21 10 17 8 11M20 30c6-5 10-10 12-17M20 18c-4-4-5-7-5-11M21 22c5-4 8-8 9-12',
        fill: 'none',
        stroke: '#56613a',
        'stroke-width': 2,
        'stroke-linecap': 'round',
      },
      svg,
    );
    for (const d of [
      'M8 11c-1-5 1-7 5-6 1 4-1 6-5 6z',
      'M15 7c-2-4 0-6 4-6 1 4-1 6-4 6z',
      'M32 13c4-4 7-3 7 1-3 3-6 3-7-1z',
      'M10 21c-5 0-7-3-5-6 4 0 6 2 5 6z',
      'M29 22c4-3 7-2 7 2-4 2-6 1-7-2z',
    ])
      env.util.svg('path', { d, fill: '#56613a' }, svg);
  }
  env.site({
    name: 'design-set-slider-stops-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/set-slider-horizontal-11',
    design: {
      parts: {
        'frame.12': (base, S) =>
          function (_c) {
            const { head, u } = _c;
            const titlebar = u.el('div', 'titlebar', head);
            brandMark(titlebar);
            u.el('h1', '', titlebar, 'Hearth & Hollow');
            const win = u.el('div', 'window-controls', titlebar);
            u.el('span', '', win, '—');
            u.el('span', '', win, '□');
            u.el('span', '', win, '×');
            const menubar = u.el('nav', 'menu-bar', head);
            ['File', 'Edit', 'View', 'Collections', 'Tools', 'Help'].forEach((x) => u.el('span', '', menubar, x));
            const toolbar = u.el('nav', 'toolbar', head);
            for (const [icon, text] of [
              ['file', 'New'],
              ['folder', 'Open'],
              ['image', 'Add'],
              ['trash', 'Delete'],
              ['tag', 'Tags'],
            ]) {
              const b = u.el('button', 'tool-button', toolbar);
              outlineIcon(b, icon, 'tool-icon');
              u.el('span', '', b, text);
            }
            Object.assign(_c, { menubar, titlebar, toolbar, win });
          },
        'frame.13': () => () => {},
        'frame.14': () => () => {},
        'frame.15': () => () => {},
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.23': (base, S) =>
          function (_c) {
            const { ctx, task, u } = _c;
            const nav = u.el('nav', 'side-nav', task);
            for (const [icon, text, selected] of [
              ['book', 'Library', true],
              ['folder', 'Collections'],
              ['heart', 'Favorites'],
              ['clock', 'Recent'],
              ['people', 'Shared'],
              ['gear', 'Settings'],
            ]) {
              const row = u.el('div', 'side-entry' + (selected ? ' selected' : ''), nav);
              outlineIcon(row, icon, 'nav-icon');
              u.el('span', '', row, text);
            }
            u.el('hr', '', task);
            u.el('div', 'catalog-label', task, 'Catalog');
            const counts = [
              ['All Items', '128'],
              ['Decor', '34'],
              ['Furniture', '28'],
              ['Lighting', '18'],
              ['Textiles', '22'],
              ['Tableware', '16'],
              ['Art', '10'],
            ];
            const list = u.el('div', 'catalog-counts', task);
            counts.forEach(([a, b]) => {
              const row = u.el('div', 'count-row', list);
              u.el('span', '', row, a);
              u.el('span', '', row, b);
            });
            const instruction = u.el('div', 'instruction', task, ctx.instruction);
            Object.assign(_c, { counts, instruction, list, nav });
          },
        'frame.24': () => () => {},
        'frame.25': () => () => {},
        'frame.26': () => () => {},
        'frame.32': (base, S) =>
          function (_c) {
            const { main, u } = _c;
            u.el('div', 'workspace-decor', main);
            u.el(
              'div',
              'workspace-captions',
              main,
              'Riverside Sofa　　　Oakridge Coffee Table　　　Fern Armchair　　　Linden Console',
            );
            u.el('aside', 'survey-space', main);
          },
      },
    },
  });
})();
