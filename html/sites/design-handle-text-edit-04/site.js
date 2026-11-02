// Design on templates/site/ui-text-find-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-handle-text-edit-04',
    styles: ['site.css'],
    template: 'site/handle-text-find-01',
    design: {
      cfg: {
        'title': 'Memo Manager',
        'theme': 'irix',
        'layout': 'workstation',
        'tools': 'File      Edit      View      Message      Tools      Window      Help',
        'rail': '',
      },
      parts: {
        'frame.6': (base, St) =>
          function (_c) {
            const { cfg } = St;
            const { head, title, u } = _c;
            u.el('span', 'app-mark', title, '✥');
            if (
              ['qt', 'openlook', 'win92', 'clearlooks', 'industrial', 'electron', 'yosemite', 'irix'].includes(
                cfg.theme,
              )
            ) {
              const controls = u.el('span', 'window-controls', title);
              controls.innerHTML =
                '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
            }
            if (cfg.tools) u.el('div', 'tools', head, cfg.tools);
          },
        'frame.7': () => () => {},
        'frame.10': (base, St) =>
          function (_c) {
            const { cfg } = St;
            const { shell, tools, u } = _c;
            if (tools) tools.classList.add('menu-row');
            const shelf = u.el('div', 'tool-shelf', shell);
            [
              ['New', 'M0 2h13l8 8v20H0z M13 2v8h8 M5 15h11 M5 20h11'],
              ['Open', 'M1 9h8l3-4h12v18H1z M1 10h23l-3 13H1z'],
              ['Reply', 'M2 3h14l7 7v18H2z M16 3v8h7 M6 16h11 M6 21h8'],
              ['Forward', 'M3 3h13l6 6v19H3z M16 3v7h6 M8 17h11 M15 13l5 4-5 4'],
              ['Delete', 'M5 7h16l-1 20H6z M3 7h20 M9 4h8 M10 11v12 M16 11v12'],
              ['Print', 'M6 2h13v7H6z M4 11h17v10H4z M7 17h11v10H7z M18 13h1'],
              [
                'Address Book',
                'M4 2h18v26H4z M1 6h3 M1 12h3 M1 18h3 M1 24h3 M9 10a3 3 0 1 0 6 0a3 3 0 1 0-6 0 M8 20c0-4 8-4 8 0',
              ],
            ].forEach(([n, path]) => {
              const b = u.el('div', 'tool-item', shelf);
              const ic = u.el('span', 'tool-icon', b);
              ic.innerHTML = '<svg viewBox="0 0 28 30"><path d="' + path + '"/></svg>';
              u.el('span', '', b, n);
            });
            const work = u.el('div', 'work', shell);
            const records = u.el('aside', 'records', work);
            u.el('div', 'records-title', records, 'Memos');
            const columns = u.el('div', 'memo-columns', records);
            ['From', 'Subject', 'Date'].forEach((x) => u.el('span', '', columns, x));
            const rows = [
              ['A. Chen', 'Project update', 'Apr 12 10:14'],
              ['R. Patel', 'Site visit', 'Apr 11 16:03'],
              ['L. Martinez', 'Budget figures', 'Apr 11 09:27'],
              ['K. Tanaka', 'Design review', 'Apr 10 15:18'],
              ["M. O'Neil", 'Schedule change', 'Apr 10 11:42'],
              ['S. Gupta', 'User testing', 'Apr 09 14:26'],
              ['D. Kim', 'Release plan', 'Apr 09 10:11'],
              ['T. Wilson', 'Documentation', 'Apr 08 17:20'],
              ['P. Singh', 'Hardware order', 'Apr 08 13:05'],
              ['C. Rossi', 'Meeting notes', 'Apr 07 16:48'],
              ['J. Park', 'Status report', 'Apr 07 11:32'],
              ['E. Clark', 'Travel arrangements', 'Apr 06 15:21'],
              ['H. Zhao', 'Customer feedback', 'Apr 06 09:14'],
              ['B. Ahmed', 'Next steps', 'Apr 05 17:03'],
              ['N. Wright', 'Prototype build', 'Apr 05 12:26'],
              ['G. Hall', 'QA results', 'Apr 04 16:11'],
              ['V. Nguyen', 'Marketing input', 'Apr 04 09:38'],
              ['L. Brown', 'Vendor update', 'Apr 03 15:09'],
              ['S. Lee', 'Training plan', 'Apr 03 11:48'],
              ['D. Garcia', 'Facilities request', 'Apr 02 14:13'],
            ];
            rows.forEach((r, i) => {
              const row = u.el('div', i === 0 ? 'memo-row selected' : 'memo-row', records);
              r.forEach((x) => u.el('span', '', row, x));
            });
            if (cfg.rail) {
              const rail = u.el('nav', 'rail', work);
              cfg.rail.split('|').forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
            }
            Object.assign(_c, { columns, records, rows, shelf, work });
          },
        'frame.11': () => () => {},
        'frame.12': () => () => {},
        'frame.13': () => () => {},
        'frame.14': () => () => {},
        'frame.15': () => () => {},
        'frame.25': () => () => {},
        'frame.26': () => () => {},
        'frame.27': () => () => {},
        'frame.28': () => () => {},
        'frame.29': () => () => {},
        'frame.30': () => () => {},
        'frame.31': () => () => {},
        'frame.32': () => () => {},
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
        'frame.43': () => () => {},
      },
    },
  });
})();
