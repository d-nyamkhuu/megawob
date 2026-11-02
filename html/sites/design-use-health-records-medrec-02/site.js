// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      stage.style.setProperty('position', 'absolute', 'important');
      stage.style.setProperty('left', '28%', 'important');
      stage.style.setProperty('top', '100px', 'important');
      stage.style.setProperty('width', '71%', 'important');
      stage.style.setProperty('height', 'calc(100% - 112px)', 'important');
      stage.style.setProperty('min-width', '0', 'important');
      stage.style.setProperty('right', 'auto', 'important');
      stage.style.setProperty('bottom', 'auto', 'important');
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-use-health-records-medrec-02',
    template: 'site/base',
    design: { parts },
  });
})();
