// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  env.site({
    name: 'design-avoid-phishing-link-04',
    template: 'site/base',
    design: {
      parts: {
        'frame.body': (base) => function (state) {
          base(state);
          const toolbar = state.util.el('div', 'ref-mail-tools');
          toolbar.setAttribute('aria-hidden', 'true');
          document.body.insertBefore(toolbar, state.body);
        },
      },
    },
  });
})();
