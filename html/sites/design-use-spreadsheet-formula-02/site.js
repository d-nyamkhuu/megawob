// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  env.site({
    name: 'design-use-spreadsheet-formula-02',
    template: 'site/base',
    design: {
      parts: {
      'frame.footer': (base) => (_c) => {
        base(_c);
        const status = document.querySelector('.ref-foot-text');
        if (status) status.textContent = 'Ready';
      },
      },
    },
  });
})();
