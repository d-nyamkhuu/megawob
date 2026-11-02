// Design on templates/site/form-fill-receipt-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-fill-form-idcard-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/fill-form-receipt-03',
    design: {
      C: {"site": "design-fill-form-idcard-02", "brand": "FlowDesk", "title": "Add Contact", "instruction": "left", "rail": "Documents|Tasks|Models|Integrations|Settings", "menu": "Home|Contacts|View|Tools|Help", "briefTitle": "Instructions"},
      parts: {
        'frame.40': (base) => (_c) => {
          base(_c);
          const display = _c.ctx.display;
          if (display === 'header' ||
              (display === 'panel' && window.innerWidth < 1260) ||
              (display === 'toast' && window.innerHeight < 700)) _c.mode = 'top';
        },
        'frame.46': () => () => {},
        'frame.47': () => () => {},
        'frame.48': () => () => {},
        'frame.55': (base) => (_c) => {
          // Keep the existing controls and their handlers in one flow layout.
          _c.foot.append(_c.ribbon, _c.status);
          return base(_c);
        },
      },
    },
  });
})();
