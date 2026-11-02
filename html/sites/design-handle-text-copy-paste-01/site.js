// Design on templates/site/ui-text-find-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: "design-handle-text-copy-paste-01",
    styles: ['site.css'],
    template: 'site/handle-text-find-01',
    design: {
      cfg: {"title": "Text Copy Task", "theme": "civic", "layout": "notebook", "tools": "Civic Services Portal", "rail": "Task|Notes|Resources|Help"},
      parts: {
        'frame.7': (base, S) => function (_c) {
          const { cfg } = S;
          const { head, u } = _c;
          if(cfg.tools)u.el('div','tools',head,cfg.tools);
        },
        'frame.15': (base, S) => function (_c) {
          const { cfg } = S;
          const { u, work } = _c;
          if(cfg.rail){const rail=u.el('nav','rail',work);cfg.rail.split('|').forEach((s,i)=>u.el('div',i===0?'active':'',rail,s));}
        },
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
