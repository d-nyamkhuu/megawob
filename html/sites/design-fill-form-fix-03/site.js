// Design on templates/site/form-fill-receipt-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-fill-form-fix-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/fill-form-receipt-03',
    design: {
      C: {"site": "design-fill-form-fix-03", "brand": "Meadowbrook Home Page", "title": "Add Contact", "instruction": "left", "rail": "", "menu": "Home|Contacts|View|Tools|Help", "briefTitle": "Instructions"},
      parts: {
        'frame.21': () => (c) => { c.ribbon = c.u.el('div', 'ds-ribbon', c.top); },
        'frame.45': () => (c) => { c.stage = c.u.el('main', 'meadow-stage', c.main); },
        'frame.46': () => () => {},
        'frame.47': () => () => {},
        'frame.48': () => () => {},
      },
    },
  });
})();
