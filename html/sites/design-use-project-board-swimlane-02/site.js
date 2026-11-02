// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', `ref-task${display === 'header' ? ' ref-task-note' : ''}`, document.body);
      header.setAttribute('role', 'banner');
      {
        rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Release Planner');
        brand.dataset.role = 'brand';
      }
      {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const navLabels = ['Home', 'Release Plan', 'Teams', 'Tasks', 'Milestones', 'Reports'];
        for (const [index, item] of navLabels.entries()) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          if (index === 1) a.style.textDecoration = 'underline';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: sampledNav[index % sampledNav.length] || item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      // IRIX-style item inspector, visible beside the board even when nothing is selected.
      const inspector = util.el('aside', 'irix-inspector', body);
      util.el('div', 'irix-inspector-title', inspector, 'Item Details');
      util.el('div', 'irix-inspector-empty', inspector, 'No item selected');
      const fields = util.el('div', 'irix-inspector-fields', inspector);
      for (const field of ['Team', 'Status', 'Start date', 'Duration', 'End date']) {
        const row = util.el('div', 'irix-inspector-row', fields);
        util.el('span', '', row, field);
        util.el('span', '', row, '—');
      }
      const dependencies = util.el('div', 'irix-inspector-row irix-dependencies', fields);
      util.el('span', '', dependencies, 'Dependencies');
      util.el('span', '', dependencies, '—');
      util.el('div', 'irix-notes-label', fields, 'Notes');
      util.el('div', 'irix-notes-box', fields, '—');
      S.frameAlign(_c, stage);
      Object.assign(_c, { dependencies, fields, inspector, stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-project-board-swimlane-02',
    template: 'site/base',
    design: { parts },
  });
})();
