// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  env.site({
    name: 'design-pan-map-zoomto-03',
    template: 'site/base',
    design: {
      parts: {
        'frame.stage': (base) => (_c) => {
          base(_c);
          const legend = _c.util.el('aside', 'harbor-legend', _c.body,
            'Overview\n\n  Harborview Bay\n\n\n\n\n\nLegend\n\n  ━━━  Major road\n  ───  Minor road\n  - - -  Railway\n\n  ■  Water\n  ■  Park / green space\n  ■  Building area\n\n  - - -  District boundary');
          legend.setAttribute('aria-label', 'Map overview and legend');
        },
      },
    },
  });
})();
