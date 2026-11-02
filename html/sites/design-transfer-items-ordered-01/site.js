// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Project Management');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const project = util.el('section', 'ref-project', body);
      util.el('h1', 'ref-project-title', project, 'Website Redesign');
      const facts = util.el('div', 'ref-project-facts', project);
      for (const [key, value] of [['Project ID', 'PRJ-1042'], ['Start date', 'Mar 4, 2013'],
        ['Due date', 'May 31, 2013'], ['Status', 'In progress'], ['Priority', 'High'], ['Owner', 'Daniel Carter']]) {
        const row = util.el('div', 'ref-fact', facts);
        util.el('span', '', row, key);
        util.el('strong', '', row, value);
      }
      const inspector = util.el('aside', 'ref-inspector', body);
      util.el('h2', '', inspector, 'Project details');
      const details = [
        ['Name', 'Website Redesign'],
        ['Description', 'Redesign the corporate website with a modern look and improved usability.'],
        ['Start date', 'Mar 4, 2013'], ['Due date', 'May 31, 2013'],
        ['Status', 'In progress'], ['Priority', 'High'], ['Owner', 'Daniel Carter'],
      ];
      const detailList = util.el('div', 'ref-detail-list', inspector);
      for (const [key, value] of details) {
        const row = util.el('div', 'ref-detail', detailList);
        util.el('span', '', row, key);
        util.el('strong', '', row, value);
      }
      const extra = util.el('div', 'ref-detail-extra', inspector);
      util.el('span', '', extra, 'Team members');
      util.el('strong', '', extra, '3 people');
      const updated = util.el('div', 'ref-detail-extra', inspector);
      util.el('span', '', updated, 'Last updated');
      util.el('strong', '', updated, 'Apr 12, 2013\nby Daniel Carter');
      Object.assign(_c, { detailList, details, extra, facts, inspector, project, stage, updated });
    },
  };

  env.site({
    name: 'design-transfer-items-ordered-01',
    template: 'site/base',
    design: { parts },
  });
})();
