// Design on templates/site/form-pick-autocomplete-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-chips-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      C: {site:'design-choose-option-chips-02',brand:'Global Connect',title:'Organization Details',instruction:'top',rail:'',menu:'Profile|Organization|Directory|Messages|Bulletin|Groups',briefTitle:'Task note'},
      parts: {
        'frame.6': (base, S) => function (_c) {
          const { C } = S;
          const { top, u } = _c;
          u.el('span','ds-homelinks',top,'⌂  Home\n      My Page\n      Members\n      Communities\n      Help');
          u.el('span','ds-brand',top,C.brand);
          u.el('span','ds-tagline',top,'People  •  Offices  •  Ideas  •  A Smaller World');
          u.el('span','ds-skyline',top,'Different Places\nBrighter\nTogether  ▥');
        },
        'frame.7': () => () => {},
        'frame.19': (base) => function (_c) {
          base(_c);
          // Keep inherited travel-form layout rules away from this widget.
          _c.stage.className = 'gc-stage';
          _c.marker.remove();
        },
        'frame.21': (base, S) => function (_c) {
          const { marker, u } = _c;
          u.el('h1','',marker,'Organization Details');
        },
        'frame.23': (base, S) => function (_c) {
          const { marker, u } = _c;
          u.el('p','',marker,'Community information and office locations.');
        },
        'frame.35': () => () => {},
        'frame.36': () => () => {},
      },
    },
  });
})();
