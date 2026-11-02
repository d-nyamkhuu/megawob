// Design on templates/site/form-fill-receipt-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-fill-form-fix-02',
    styles: ['site.css', 'gem.css'],
    scripts: [],
    template: 'site/fill-form-receipt-03',
    design: {
      C: {
        'site': 'design-fill-form-fix-02',
        'brand': 'DocForm Lite',
        'title': 'DocForm Lite',
        'instruction': 'top',
        'rail': '',
        'menu': 'File|Edit|View|Document|Form|Tools|Help',
        'briefTitle': 'Instructions',
      },
      parts: {
        'frame.23': (base, S) =>
          function (_c) {
            const { paths, ribbon, u } = _c;
            [
              ['Open', 'import'],
              ['Scan', 'import'],
              ['Prev', 'edit'],
              ['Next', 'edit'],
              ['Copy', 'group'],
              ['Paste', 'import'],
              ['Zoom', 'help'],
            ].forEach(([label, key]) => {
              const b = u.el('button', 'ds-ribbon-item', ribbon);
              b.type = 'button';
              b.innerHTML =
                '<svg viewBox="-2 -2 32 32" width="38" height="38"><path d="' +
                paths[key] +
                '" fill="' +
                (key === 'grid' ? '#efbf3e' : '#9fc5e5') +
                '" stroke="' +
                (key === 'delete' ? '#bd514d' : '#4f7598') +
                '" stroke-width="2" stroke-linejoin="round"/></svg>';
              u.el('span', '', b, label);
            });
          },
        'frame.25': (base, S) =>
          function (_c) {
            const { items, ribbon, u } = _c;
            [
              ['File', 2],
              ['Page', 2],
              ['Edit', 2],
              ['View', 1],
            ].forEach(([label, n]) => {
              const g = u.el('div', 'ds-ribbon-group', ribbon);
              for (let i = 0; i < n; i++) g.append(items.shift());
              u.el('span', 'ds-ribbon-caption', g, label);
            });
          },
        'frame.45': () =>
          function (_c) {
            // The imported receipt frame sizes .ds-stage descendants for a
            // different window. Keep this stage on its own design's geometry.
            _c.stage = _c.u.el('main', 'gem-stage', _c.main);
          },
        'frame.46': () => () => {},
        'frame.47': () => () => {},
        'frame.48': () => () => {},
      },
    },
  });
})();
