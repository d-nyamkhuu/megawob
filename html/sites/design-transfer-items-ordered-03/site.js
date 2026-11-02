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
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);

      // Atari GEM menu and icon strip. These are decorative desktop controls; task controls
      // remain in the shared widget below.
      const menu = util.el('div', 'gem-menu', header);
      for (const item of ['File', 'Edit', 'View', 'Items', 'Help']) util.el('span', '', menu, item);
      const toolbar = util.el('div', 'gem-toolbar', header);
      for (const icon of ['▯', '▱', '▤', '✂', '▧', '♜', '▦']) {
        const tool = util.el('span', 'gem-tool', toolbar, icon);
        tool.setAttribute('aria-hidden', 'true');
      }
      Object.assign(_c, { menu, toolbar });
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
      const status = util.el('div', 'gem-status', document.body);
      util.el('span', 'gem-info', status, 'ⓘ');
      util.el('span', '', status, 'Select items and use the arrow buttons, double-click or drag to move them.\nUse the Up and Down buttons to change the order in the Selected list.');
      util.el('div', 'gem-desktop-icons', document.body);
      Object.assign(_c, { detailList, details, extra, facts, inspector, project, stage, status, updated });
    },
  };

  env.site({
    name: 'design-transfer-items-ordered-03',
    template: 'site/base',
    design: { parts },
  });
})();
