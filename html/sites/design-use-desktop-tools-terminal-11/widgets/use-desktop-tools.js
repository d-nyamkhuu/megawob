// Design of this site on the use-desktop-tools/workspace template: a bare BeOS-style terminal window; the startup text also
// lists the workspace files and the command line keeps the focus once something is typed.
(function () {
  'use strict';
  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-terminal-11',
    name: 'design',
    split: 'train',
    scenarios: ['terminal'],
    template: 'use-desktop-tools/workspace',
    design: {},
  });
})();
