// Design on templates/site/ui-click-hover-menu-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: "design-click-control-hover-menu-01",
    styles: ['site.css'],
    template: 'site/click-control-hover-menu-01',
    design: {
      parts: {
        'frame.37': (base) => function (c) {
          // Keep episode controls and instructions in the frame's flow before
          // the task is mounted, clear of the hover menu and its dropdowns.
          const buttons = c.head.querySelectorAll('.submit, .xtra-task');
          const toolbarNote = !c.note.hidden && c.ctx.display !== 'panel';
          if (buttons.length || toolbarNote) {
            const toolbar = c.u.el('header', 'portal-end-toolbar', c.shell);
            c.shell.insertBefore(toolbar, c.shell.firstChild);
            if (toolbarNote) toolbar.appendChild(c.note);
            for (const button of buttons) toolbar.appendChild(button);
          }
          return base(c);
        },
      },
    },
  });
})();
