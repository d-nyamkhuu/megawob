// Design on templates/site/form-pick-autocomplete-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-grouped-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      C: {site:'design-choose-option-grouped-01',brand:'Featured Products',title:'Featured Products',instruction:'top',rail:'',menu:'',briefTitle:'Instructions'},
      parts: {
        'frame.20': (base, S) => function (_c) {
          const { marker, u } = _c;
          u.el('h1','',marker,'Featured Products');
          const summary=u.el('div','ds-summary',marker);
          u.el('div','ds-stat ds-products',summary,'24|TOTAL PRODUCTS');
          u.el('div','ds-stat ds-categories',summary,'6|CATEGORIES');
          Object.assign(_c, { summary });
        },
        'frame.21': () => () => {},
        'frame.22': () => () => {},
        'frame.23': () => () => {},
      },
    },
  });
})();
