// Design on templates/site/ui-click-hover-menu-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-control-context-04',
    styles: ['site.css'],
    template: 'site/click-control-hover-menu-01',
    design: {
      cfg: {
        'title': 'Project Files',
        'theme': 'lisa',
        'layout': 'files',
        'tools': ' ',
        'foot': 'Task List|Status|Notes|Actions',
        'side': 'Project Files|12 items|8 documents|4 folders|526 KB on disk',
      },
      parts: {
        'frame.6': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { title, u } = _c;
            if (
              ['qt', 'openlook', 'win92', 'clearlooks', 'industrial', 'electron', 'yosemite', 'lisa'].includes(
                cfg.theme,
              )
            ) {
              const controls = u.el('span', 'window-controls', title);
              controls.innerHTML =
                '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
            }
          },
      },
    },
  });
})();
