// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      // Retain the clone's original seeded navigation draws although this design has no rail.
      local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      // Decorative document index: its text and highlighted row are independent of the goal.
      const index = util.el('section', 'td-index', body);
      util.el('div', 'td-index-heading', index, 'Team Documents');
      const table = util.el('div', 'td-index-table', index);
      const head = util.el('div', 'td-index-row td-index-head', table);
      util.el('span', '', head, 'Name ▲');
      util.el('span', '', head, 'Updated');
      util.el('span', '', head, 'Shared with');
      const docs = ['Offsite agenda', 'Budget overview', 'Marketing plan', 'Team roles', 'Meeting notes'];
      const dates = ['Apr 10, 2002', 'Apr 8, 2002', 'Apr 3, 2002', 'Mar 28, 2002', 'Mar 20, 2002'];
      const counts = ['3 people', '5 people', '4 people', '6 people', '3 people'];
      docs.forEach((doc, i) => {
        const row = util.el('div', `td-index-row${i === 0 ? ' td-index-selected' : ''}`, table);
        util.el('span', 'td-index-name', row, `▤　${doc}`);
        util.el('span', '', row, dates[i]);
        util.el('span', '', row, counts[i]);
      });
      Object.assign(_c, { counts, dates, docs, head, index, stage, table });
    },
  };

  env.site({
    name: 'design-protect-privacy-share-02',
    template: 'site/base',
    design: { parts },
  });
})();
