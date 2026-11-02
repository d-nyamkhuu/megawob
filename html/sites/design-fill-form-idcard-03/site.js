// Design on templates/site/form-fill-receipt-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-fill-form-idcard-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/fill-form-receipt-03',
    design: {
      C: {
        'site': 'design-fill-form-idcard-03',
        'brand': 'Document to Form',
        'title': 'Document to Form',
        'instruction': 'left',
        'rail': '',
        'menu': 'File|Edit|View|Document|Form|Records|Tools|Help',
        'briefTitle': 'Instructions',
      },
      parts: {
        'frame.9': (base, S) =>
          function (_c) {
            const { labelOf, labels } = _c;
            const preferred =
              labels.find((x) => labelOf(x).trim().toLowerCase() === 'confirm') ||
              labels.find((x) => labelOf(x).trim().toLowerCase() === 'submit') ||
              labels[0];
            Object.assign(_c, { preferred });
          },
        'frame.13': (base, S) =>
          function (_c) {
            const { ctx, er, original } = _c;
            const placement = ctx.finish
              ? null
              : original
                ? 'toolbar'
                : er.pick(['toolbar', 'toolbar', 'status', 'status', 'icon']);
            Object.assign(_c, { placement });
          },
        'frame.23': (base, S) =>
          function (_c) {
            const { paths, ribbon, u } = _c;
            [
              ['Open', 'import'],
              ['Scan', 'person'],
              ['Zoom In', 'group'],
              ['Zoom Out', 'delete'],
              ['Fit Width', 'grid'],
              ['Rotate Left', 'gear'],
              ['Rotate Right', 'export'],
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
              ['Document', 2],
              ['Zoom', 3],
              ['Rotate', 2],
            ].forEach(([label, n]) => {
              const g = u.el('div', 'ds-ribbon-group', ribbon);
              for (let i = 0; i < n; i++) g.append(items.shift());
              u.el('span', 'ds-ribbon-caption', g, label);
            });
          },
        'frame.30': (base, S) =>
          function (_c) {
            const { decoy, makeEnd, placement, ribbon } = _c;
            if (placement === 'icon') _c.submit = makeEnd(ribbon, 'ds-ribbon-end ds-icon-end', '✓');
            if (_c.collide && _c.collide.where === 'toolbar') decoy(ribbon, _c.collide.label);
          },
        'frame.40': (base, S) =>
          function (_c) {
            const { ctx, natural } = _c;
            _c.mode =
              ctx.display === 'hidden'
                ? 'hidden'
                : ctx.display === 'toast'
                  ? 'toast'
                  : ctx.display === 'panel'
                    ? 'left'
                    : natural;
            if (_c.mode === 'left' && window.innerWidth < 1260) _c.mode = 'top';
          },
        'frame.42': (base, S) =>
          function (_c) {
            const { briefing, content } = _c;
            if (_c.mode === 'top') briefing(content, 'ds-header-note');
          },
        'frame.44': (base, S) =>
          function (_c) {
            const { briefing, main } = _c;
            if (_c.mode === 'left' || _c.mode === 'right') {
              const b = briefing(main, 'ds-brief');
              if (_c.mode === 'right') b.style.order = '2';
            }
          },
        'frame.46': (base, S) =>
          function (_c) {
            const { briefing, content, main } = _c;
            if (_c.mode === 'toast') {
              const note = briefing(content, 'ds-toast');
              content.insertBefore(note, main);
            }
          },
        'frame.47': () => () => {},
        'frame.48': () => () => {},
        'frame.49': () => () => {},
      },
    },
  });
})();
