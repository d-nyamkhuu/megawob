// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, local, rng, util } = _c;
      const { K } = S;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'w95-titlebar', header);
      util.el('span', 'w95-appicon', titlebar, '▦');
      const brand = util.el('div', 'ref-brand', titlebar, 'Release Plan');
      brand.dataset.role = 'brand';
      const win = util.el('div', 'w95-window-buttons', titlebar);
      for (const t of ['_', '□', '×']) util.el('span', '', win, t);
      const menu = util.el('div', 'w95-menu', header);
      for (const t of ['File', 'Edit', 'View', 'Insert', 'Tools', 'Help']) util.el('span', '', menu, t);
      const toolbar = util.el('div', 'w95-toolbar', header);
      for (const t of ['▧', '📂', '▤', '✂', '▣', '▦', '▥']) util.el('span', '', toolbar, t);
      {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const item of ['Board', 'Timeline', 'Calendar', 'Reports']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { brand, header, menu, titlebar, toolbar, win });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const quarter = util.el('button', 'ref-quarter', headerTools);
      quarter.type = 'button';
      quarter.setAttribute('aria-label', 'Release quarter: Q3 2026');
      util.el('span', '', quarter, 'Q3 2026 Release');
      util.el('span', 'ref-quarter-chevron', quarter, '⌄');
      quarter.addEventListener('click', () => env.log('decoy', { what: 'release-quarter' }));
      Object.assign(_c, { headerTools, quarter, submit });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const guide = util.el('aside', 'ref-legend', body);
      const legend = util.el('section', 'ref-guide-section', guide);
      util.el('h2', '', legend, 'Legend');
      for (const [mark, text] of [['◆', 'Milestone (single date)'], ['▰', 'Weekend (non-working day)'], ['→', 'Dependency (finish → start)']]) {
        const row = util.el('div', 'ref-guide-row', legend);
        util.el('span', 'ref-guide-mark', row, mark);
        util.el('span', '', row, text);
      }
      const tips = util.el('section', 'ref-guide-section', guide);
      util.el('h2', '', tips, 'Tips');
      for (const text of ['Drag a milestone left or right to change its date.', 'Dependencies keep milestones in order (finish to start).', 'Weekends are shaded for reference.', 'Other items on the board are not affected when you move a milestone.']) {
        util.el('div', 'ref-guide-tip', tips, text);
      }
      const teams = util.el('section', 'ref-guide-section ref-guide-teams', guide);
      util.el('h2', '', teams, 'Teams');
      for (const [color, text, count] of [['#1681ef','Design','1 item'],['#0aa565','Engineering','2 items'],['#8050df','Marketing','1 item'],['#f45b12','Data Platform','1 item'],['#e8b500','Growth','1 item'],['#12b8c0','Platform','2 items']]) {
        const row = util.el('div', 'ref-guide-team', teams);
        const dot = util.el('i', '', row); dot.style.background = color;
        util.el('span', '', row, text); util.el('span', 'ref-guide-count', row, count);
      }
      const dock = util.el('nav', 'w95-dock', document.body);
      for (const [icon, text] of [['▦', 'Timeline'], ['▧', 'Board'], ['♟', 'Teams'], ['▥', 'Reports'], ['⚒', 'Settings']]) {
        const item = util.el('span', 'w95-dock-item', dock);
        util.el('b', '', item, icon);
        util.el('span', '', item, text);
      }
      Object.assign(_c, { dock, guide, legend, stage, teams, tips });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-project-board-milestone-04',
    template: 'site/base',
    design: { parts },
  });
})();
