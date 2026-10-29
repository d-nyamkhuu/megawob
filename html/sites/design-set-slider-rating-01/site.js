// Design on templates/site/drag-slider-horizontal-11.js: only what this site changed.
(function () {
  'use strict';
  function house(parent) {
    const s = env.util.svg('svg', { viewBox: '0 0 180 120', class: 'pixel-house', 'aria-hidden': 'true' }, parent);
    const r = (x, y, w, h, fill, stroke = '#263026') =>
      env.util.svg(
        'rect',
        { x, y, width: w, height: h, fill, stroke, 'stroke-width': 2, 'shape-rendering': 'crispEdges' },
        s,
      );
    env.util.svg(
      'path',
      {
        d: 'M14 73L45 14l30 59z',
        fill: '#315b36',
        stroke: '#17251a',
        'stroke-width': 3,
        'shape-rendering': 'crispEdges',
      },
      s,
    );
    r(37, 51, 16, 43, '#285332');
    env.util.svg(
      'path',
      {
        d: 'M70 42L108 12l43 34v53H70z',
        fill: '#b7352d',
        stroke: '#20252a',
        'stroke-width': 4,
        'shape-rendering': 'crispEdges',
      },
      s,
    );
    env.util.svg(
      'path',
      {
        d: 'M61 45L107 8l53 39-7 8-46-32-39 31z',
        fill: '#254b80',
        stroke: '#19232c',
        'stroke-width': 3,
        'shape-rendering': 'crispEdges',
      },
      s,
    );
    r(125, 17, 11, 24, '#61443a');
    r(79, 57, 16, 17, '#79c9e8');
    r(112, 57, 17, 17, '#78c6e5');
    r(94, 74, 17, 25, '#634128');
    r(83, 61, 8, 3, '#e8e4c9', '#e8e4c9');
    r(116, 61, 9, 3, '#e8e4c9', '#e8e4c9');
    r(85, 57, 3, 16, '#e8e4c9', '#e8e4c9');
    r(119, 57, 3, 16, '#e8e4c9', '#e8e4c9');
    r(7, 102, 164, 5, '#eee8d8', '#77766a');
    for (let x = 14; x < 170; x += 16) r(x, 92, 4, 16, '#f1eee3', '#77766a');
  }
  function basket(parent) {
    const s = env.util.svg('svg', { viewBox: '0 0 150 115', class: 'pixel-basket', 'aria-hidden': 'true' }, parent);
    const p = (d, fill, stroke = '#403522') =>
      env.util.svg('path', { d, fill, stroke, 'stroke-width': 3, 'shape-rendering': 'crispEdges' }, s);
    p('M18 48h114l-13 53H31z', '#9a5928');
    p('M37 49q4-34 38-37 36 4 40 37', 'none', '#5d4021');
    for (let y = 61; y < 98; y += 12) p(`M25 ${y}h100v6H25z`, y % 2 ? '#c28a3b' : '#74431f', '#54361b');
    p('M37 48Q26 23 39 15q14 10 12 34z', '#5c8c32');
    p('M53 48Q49 12 64 7q13 18 2 42z', '#84ae40');
    p('M68 48Q67 4 82 6q13 16 2 42z', '#548535');
    p('M88 48Q89 13 103 9q11 16-1 39z', '#7a9f32');
    p('M32 48Q23 27 37 25q18 8 8 25z', '#bd2432');
    p('M94 48Q98 23 114 24q12 16-4 25z', '#d43a32');
    p('M65 47Q66 22 80 21q13 16 3 27z', '#e2c330');
    p('M38 47h12v6H38zM65 47h12v6H65zM97 47h12v6H97z', '#446c2a', '#446c2a');
  }
  env.site({
    name: 'design-set-slider-rating-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/set-slider-horizontal-11',
    design: {
      parts: {
        'frame.10': (base, S) =>
          function (_c) {
            const { ctx } = _c;
            document.body.className = `kitchen instruction-${ctx.display}`;
          },
        'frame.12': (base, S) =>
          function (_c) {
            const { head, u } = _c;
            house(u.el('div', 'header-house', head));
            u.el('div', 'header-tagline', head, 'A friendly community\nfor home cooks');
          },
        'frame.14': (base, S) =>
          function (_c) {
            const { brand, head, u } = _c;
            u.el('div', 'sprig left', head, '❧');
            u.el('h1', '', brand, 'The Cozy Kitchen');
            u.el('div', 'motto', brand, 'Recipes　•　Friends　•　Good Food　•　Brighter Days');
            u.el('div', 'sprig right', head, '❧');
            basket(u.el('div', 'header-basket', head));
            u.el('div', 'header-words', head, 'Good Meals\nHappier People ♥');
          },
        'frame.15': () => () => {},
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.22': (base, S) =>
          function (_c) {
            const { main, u } = _c;
            const side = u.el('aside', 'recipe-nav', main);
            u.el('h2', '', side, 'Our Recipes');
            for (const [icon, label] of [
              ['◉', 'All Recipes'],
              ['✦', 'Soups'],
              ['▰', 'Main Dishes'],
              ['✿', 'Salads'],
              ['♙', 'Desserts'],
              ['♨', 'Breads'],
              ['▣', 'Preserves'],
              ['★', 'Favorites'],
            ])
              u.el('div', label === 'Soups' ? 'nav-item active' : 'nav-item', side, `${icon}　${label}`);
            const list = u.el('section', 'recipe-list', main);
            u.el('h2', '', list, 'Soups');
            u.el('h3', 'list-head', list, 'Recipe Name');
            for (const name of [
              'Tomato Basil Soup',
              'Chicken Noodle Soup',
              'Lentil soup',
              'Minestrone',
              'Split Pea Soup',
              'Potato Leek Soup',
              'Butternut Squash Soup',
              'Cream of Mushroom',
              'Vegetable Soup',
              'Black Bean Soup',
            ])
              u.el('div', name === 'Lentil soup' ? 'recipe-item selected' : 'recipe-item', list, `◉　${name}`);
            const task = u.el('aside', 'catalog-task', main);
            Object.assign(_c, { list, side, task });
          },
        'frame.23': () => () => {},
        'frame.24': () => () => {},
        'frame.25': () => () => {},
        'frame.29': (base, S) =>
          function (_c) {
            const { main, u } = _c;
            const legend = u.el('aside', 'survey-space', main);
            u.el('h2', '', legend, 'Rating Guide');
            u.el('hr', '', legend);
            for (const [stars, label] of [
              ['★', '1 star (lowest)'],
              ['◐', '1.5 stars'],
              ['★★', '2 stars'],
              ['★★★', '3 stars'],
              ['★★★★', '4 stars'],
              ['★★★★★', '5 stars (highest)'],
            ])
              u.el('div', 'legend-row', legend, `${stars}　= ${label}`);
            u.el('div', 'legend-pic', legend, '🫙　🧄　🍅');
            Object.assign(_c, { legend });
          },
        'frame.32': () => () => {},
        'frame.34': (base, S) =>
          function (_c) {
            const { footer, u } = _c;
            const navigation = u.el('nav', 'dock-nav', footer);
            for (const [icon, label] of [
              ['⌂', 'Home'],
              ['▣', 'Recipes'],
              ['♟', 'Community'],
              ['✉', 'Messages'],
              ['▤', 'News'],
              ['✿', 'About'],
            ])
              u.el('div', label === 'Recipes' ? 'dock-item selected' : 'dock-item', navigation, `${icon}　${label}`);
            Object.assign(_c, { navigation });
          },
        'frame.35': () => () => {},
        'frame.36': () => () => {},
        'frame.37': () => () => {},
        'frame.38': () => () => {},
        'frame.39': () => () => {},
        'frame.40': () => () => {},
        'frame.41': () => () => {},
        'frame.42': () => () => {},
        'frame.44': () => () => {},
        'frame.45': () => () => {},
        'frame.47': (base, S) =>
          function (_c) {
            const { head, u } = _c;
            const actions = u.el('div', 'footer-actions', head);
            Object.assign(_c, { actions });
          },
        'frame.50': (base, S) =>
          function (_c) {
            const { task, u } = _c;
            const reset = u.el('button', 'reset', task, '×');
            Object.assign(_c, { reset });
          },
        'frame.53': (base, S) =>
          function (_c) {
            const { reset, stage } = _c;
            reset.title = 'Close';
            return { stage, submit: _c.submit };
          },
      },
    },
  });
})();
