// Design on templates/site/form-text-login-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-type-text-complete-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/type-text-login-01',
    design: {
      C: {"site":"design-type-text-complete-04","brand":"Patient Records","instruction":"top","rail":"Patient List|Add Patient|Search|Import|Help","menu":"Patients|Appointments|Records|Reports|Settings","briefTitle":"Help"},
      parts: {
        'frame.7': (base, S) => function (_c) {
          const { top, u } = _c;
          u.el('span','ds-window-controls',top,'−　□　×');
        },
        'frame.13': (base, S) => function (_c) {
          base(_c);
          // A second sidebar leaves too little room for the form at training sizes.
          if (_c.mode === 'left' && window.innerWidth < 1400) _c.mode = 'top';
        },
        'frame.18': (base, S) => function (_c) {
          // Avoid the inherited login widget's fixed field sizes and hidden labels.
          _c.stage = _c.u.el('main', 'patient-stage', _c.main);
        },
        'frame.24': (base, S) => function (_c) {
          _c.label = 'OK';
        },
      },
    },
  });
})();
