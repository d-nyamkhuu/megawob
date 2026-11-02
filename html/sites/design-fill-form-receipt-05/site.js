// Design on templates/site/form-fill-receipt-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-fill-form-receipt-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/fill-form-receipt-03',
    design: {
      C: {"site": "design-fill-form-receipt-05", "brand": "Document to Form", "title": "Document to Form", "instruction": "top", "rail": "", "menu": "File|Edit|View|Document|Form|Tools|Help", "briefTitle": "Instructions"},
      parts: {
        'frame.18': () => (_c) => {
          const { top, u } = _c;
          const ic = u.el('span', 'ds-appicon', top, '×');
          u.el('span', 'ds-brand', top, 'Document to Form');
        },
        'frame.19': () => (_c) => {
          const { top, u } = _c;
          const w = u.el('span', 'ds-wc', top);
          u.el('i', '', w, '–'); u.el('i', '', w, '□'); u.el('i', 'x', w, '×');
        },
        'frame.23': () => (_c) => {
          const { ribbon, u } = _c;
          const P = {
            open: 'M2 6h7l2 2h9v10H2zM2 18l3-8h17l-3 8',
            scan: 'M5 3h14v7H5zM2 10h20v8H2zM6 14h12',
            zin: 'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14M15 15l6 6M7 10h6M10 7v6',
            zout: 'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14M15 15l6 6M7 10h6',
            fit: 'M5 2h11l4 4v16H5zM8 14h9M8 10h9'
          };
          [['Open', 'open'], ['Scan', 'scan'], ['|'], ['Zoom In', 'zin'], ['Zoom Out', 'zout'], ['Fit Width', 'fit']].forEach(([label, key]) => {
            if (label === '|') { u.el('i', 'ds-sep', ribbon); return; }
            const b = u.el('button', 'ds-ribbon-item', ribbon);
            b.type = 'button';
            b.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26"><path d="' + P[key] + '" fill="#f4e3b8" stroke="#6b5440" stroke-width="1.5" stroke-linejoin="round"/></svg>';
            u.el('span', '', b, label);
          });
        },
        'frame.25': () => () => {},
        'frame.35': () => () => {},
        'frame.46': () => () => {},
        'frame.47': () => () => {},
        'frame.48': () => () => {},
      },
    },
  });
})();
