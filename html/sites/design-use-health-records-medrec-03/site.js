// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.stage': (base) => function (c) {
      // Keep the template's seeded alignment draws and its bounded stage.
      base(c);
      c.stage.style.justifyContent = 'flex-start';
      c.stage.style.alignItems = 'stretch';
    },
  };

  env.site({
    name: 'design-use-health-records-medrec-03',
    template: 'site/base',
    design: { parts },
  });
})();
