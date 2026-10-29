// Design on templates/site/drag-slider-horizontal-11.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-rating-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/set-slider-horizontal-11',
    design: {
      parts: {
        'frame.10': (base, S) =>
          function (_c) {
            const { ctx, u } = _c;
            document.body.className = `catalog-app instruction-${ctx.display}`;
            const head = u.el('header', 'catalog-header', document.body);
            u.el('h1', '', head, 'Art Class Catalog');
            const headerNote = u.el('div', 'header-note', head, ctx.instruction);
            if (ctx.display !== 'header') headerNote.hidden = true;
            Object.assign(_c, { head, headerNote });
          },
        'frame.11': () => () => {},
        'frame.12': () => () => {},
        'frame.13': () => () => {},
        'frame.14': () => () => {},
        'frame.15': () => () => {},
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.23': (base, S) =>
          function (_c) {
            const { task, u } = _c;
            u.el('h2', '', task, 'Classes');
            const list = u.el('div', 'class-list', task);
            const records = [
              ['Landscape Photography', 'Sat, Apr 12, 2014', 'landscape'],
              ['Intro to watercolors', 'Tue, Apr 15, 2014', 'watercolor'],
              ['Sculpture Basics', 'Sat, Apr 19, 2014', 'sculpture'],
              ['Modern Art History', 'Tue, Apr 22, 2014', 'modern'],
              ['Drawing for Beginners', 'Sat, Apr 26, 2014', 'drawing'],
              ['Acrylic Painting', 'Tue, Apr 29, 2014', 'acrylic'],
              ['Ceramics Workshop', 'Sat, May 3, 2014', 'ceramics'],
              ['Figure Drawing', 'Tue, May 6, 2014', 'figure'],
            ];
            records.forEach(([name, date, art], i) => {
              const row = u.el('div', `class-row ${i === 1 ? 'selected' : ''}`, list);
              const thumb = u.el('div', `class-thumb ${art}`, row);
              if (art === 'watercolor') {
                const img = u.el('img', '', thumb);
                img.src = 'sites/design-set-slider-rating-03/assets/riverside-cover.webp';
                img.alt = '';
              }
              const copy = u.el('div', 'class-copy', row);
              u.el('div', 'class-name', copy, name);
              u.el('div', 'class-date', copy, date);
            });
            Object.assign(_c, { list, records });
          },
        'frame.24': () => () => {},
        'frame.25': () => () => {},
        'frame.29': () => () => {},
        'frame.32': (base, S) =>
          function (_c) {
            const { ctx, placement, stage, u } = _c;
            const cover = u.el('img', 'detail-cover', stage);
            cover.src = 'sites/design-set-slider-rating-03/assets/riverside-cover.webp';
            cover.alt = 'Watercolor paints';
            u.el('div', 'detail-date', stage, 'Tue, Apr 15, 2014');
            u.el('div', 'detail-location', stage, 'Riverside Community Center');
            const footer = u.el('footer', 'catalog-footer', document.body);
            footer.dataset.placement = placement;
            footer.dataset.finish = String(!!ctx.finish);
            Object.assign(_c, { cover, footer });
          },
        'frame.33': () => () => {},
        'frame.34': () => () => {},
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
        'frame.50': (base, S) =>
          function (_c) {
            const { actions, u } = _c;
            const reset = u.el('button', 'reset', actions, 'Confirm');
            Object.assign(_c, { reset });
          },
        'frame.52': (base, S) =>
          function (_c) {
            const { reset } = _c;
            reset.dataset.role = 'xtra';
            reset.onclick = () => env.log('decoy', { label: 'Confirm', collide: false });
          },
      },
    },
  });
})();
