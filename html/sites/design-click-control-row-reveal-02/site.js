// Design on templates/site/ui-click-hover-menu-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: "design-click-control-row-reveal-02",
    styles: ['site.css'],
    template: 'site/click-control-hover-menu-01',
    design: {
      cfg: {"title": "The Daily Chronicle", "theme": "news", "layout": "dock", "tools": "File    Edit    View    Documents    Tools    Help", "foot": "Task List|Status|Notes|Actions"},
      parts: {
        'frame.22': (base, S) => function (_c) {
          const { center, ctx, note } = _c;
          if (ctx.display === 'panel') center.appendChild(note);
        },
      },
    },
  });
})();
