// Design on templates/site/form-text-login-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-type-text-validation-fix-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/type-text-login-01',
    design: {
      C: {"site": "design-type-text-validation-fix-02", "brand": "Account Access", "title": "", "instruction": "top", "rail": "", "menu": "Home|Accounts|Settings|Help|Sign out", "briefTitle": "Instructions"},
      parts: {
        'frame.18': () => c => {
          const frame = c.u.el('section', 'vista-window', c.main);
          c.u.el('div', 'vista-window-title', frame, 'Edit Contact');
          c.stage = c.u.el('main', 'vista-stage', frame);
        },
        'frame.26': base => c => {
          base(c);
          if (c.submit) c.submit.className = c.submit.className.replace(/ds-submit/g, 'vista-submit');
        },
      },
    },
  });
})();
