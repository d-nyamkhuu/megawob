// Design on templates/site/form-fill-receipt-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-fill-form-idcard-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/fill-form-receipt-03',
    design: {
      C: {"site": "design-fill-form-idcard-05", "brand": "Document Manager", "title": "Document to Form", "instruction": "top", "rail": "", "menu": "File|Edit|View|Tools|Help", "briefTitle": "Instructions"},
      parts: {
        'frame.19': () => (_c) => {
          const w = _c.u.el('span', 'ds-wc', _c.top);
          ['–', '▢', '✕'].forEach((t, i) => _c.u.el('b', i === 2 ? 'x' : '', w, t));
        },
        'frame.23': () => () => {},
        'frame.25': () => () => {},
        'frame.32': () => (_c) => {
          const { status, u } = _c;
          const dock = u.el('div', 'ds-dock', status);
          [['Records', 'M3 8h8l2 3h12v13H3z'], ['Scan', 'M4 6h18v12H4zM2 22h22'], ['Document to Form', 'M6 2h11l5 5v18H6zM10 12h8M10 16h8'], ['Search', 'M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16M17 17l8 8'], ['Settings', 'M13 8a5 5 0 1 0 0 10 5 5 0 0 0 0-10M13 1v4M13 21v4M1 13h4M21 13h4']].forEach(([t, p], i) => {
            const it = u.el('span', 'ds-dock-item' + (i === 0 ? ' on' : ''), dock);
            it.innerHTML = '<svg viewBox="0 0 27 27" width="30" height="30"><path d="' + p + '" fill="' + (i === 0 ? '#e4b45a' : 'none') + '" stroke="#f3e6cf" stroke-width="2" stroke-linejoin="round"/></svg>';
            u.el('span', '', it, t);
          });
        },
        'frame.35': () => () => {},
        'frame.37': () => (_c) => {
          const { body, u } = _c;
          const rail = u.el('aside', 'ds-rail', body);
          u.el('h3', 'ds-rail-h', rail, 'Identity Records');
          const list = u.el('div', 'ds-rail-list', rail);
          [['Wilson, Emma J.', '06-14'], ['Chen, Michael', '06-14'], ['Patel, Rina', '06-13'], ['Garcia, Luis', '06-12'], ['O’Connor, Sarah', '06-12'], ['Khan, Amir', '06-11'], ['Nguyen, Lan', '06-11'], ['Brown, Daniel', '06-10'], ['Lee, Sophia', '06-10'], ['Martinez, Carlos', '06-09'], ['Davis, Olivia', '06-09'], ['Singh, Arjun', '06-08']].forEach(([n, d], i) => {
            const row = u.el('div', 'ds-rec' + (i === 0 ? ' on' : ''), list);
            u.el('i', '', row);
            const t = u.el('div', '', row);
            u.el('b', '', t, n);
            u.el('span', '', t, '2011-' + d);
          });
        },
        'frame.44': () => (_c) => {
          if (_c.mode === 'left' || _c.mode === 'right') {
            const note = _c.briefing(_c.main, 'ds-brief');
            note.style.order = '2';
          }
        },
        'frame.46': () => () => {},
        'frame.47': () => () => {},
        'frame.48': () => () => {},
        'overlay.2': (base) => (_c) => {
          base(_c);
          if (_c.ctx.kind === 'banner') {
            const note = document.querySelector('.ds-header-note') || document.querySelector('.ds-menu');
            _c.el.style.setProperty('--announcement-top', (note.getBoundingClientRect().bottom + 4) + 'px');
          }
        },
      },
    },
  });
})();
