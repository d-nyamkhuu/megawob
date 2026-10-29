// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // Static properties panel: filler beside the stage, it never reads the widget.
      const inspector = util.el('aside', 'ref-live-inspector', document.body);
      inspector.textContent = 'Ticket Details\n\nSelect a ticket in the queue to see its properties here.\n\nState: Open\nProject: IT operations\nSLA policy: Standard';
      Object.assign(_c, { inspector, stage });
    },
  };

  env.site({
    name: 'design-use-admin-console-tickets-02',
    template: 'site/base',
    design: { parts },
  });
})();
