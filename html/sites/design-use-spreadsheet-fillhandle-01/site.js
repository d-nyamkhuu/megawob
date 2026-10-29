// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, ctx, display, label, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      // Preserve the original seeded frame draws while presenting this design's workbook tabs.
      if (display !== 'header' || nav) rng.pick(TITLES);
      if (nav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
      const tabs = util.el('nav', 'ref-nav', header);
      for (const [i, item] of ['Workbook', 'Data', 'Reports', 'Settings'].entries()) {
        const a = util.el('a', `ref-navlink${i === 0 ? ' is-active' : ''}`, tabs, item);
        a.dataset.role = 'nav';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      const topRight = util.el('div', 'ref-topright', tabs);
      util.el('span', 'ref-search-icon', topRight, '⌕');
      util.el('span', 'ref-avatar', topRight, 'JD');
      const hero = util.el('section', 'ref-hero', header);
      const titleBlock = util.el('div', 'ref-hero-title', hero);
      util.el('div', 'ref-title', titleBlock, 'Q2 Budget');
      util.el('div', 'ref-subtitle', titleBlock, 'Marketing');
      const stats = util.el('div', 'ref-stats', hero);
      for (const [label, value, cls] of [['Total Budget', '$120,000', ''], ['Total Forecast', '$112,450', ''], ['Variance', '$7,550', 'positive']]) {
        const stat = util.el('div', `ref-stat ${cls}`, stats);
        util.el('div', 'ref-stat-label', stat, label);
        util.el('div', 'ref-stat-value', stat, value);
      }
      const bars = util.el('div', 'ref-bars', hero);
      for (const [month, height, active] of [['Jan', 52, 0], ['Feb', 68, 0], ['Mar', 78, 0], ['Apr', 58, 0], ['May', 78, 0], ['Jun', 90, 1]]) {
        const bar = util.el('div', `ref-bar${active ? ' is-active' : ''}`, bars);
        bar.style.height = `${height}%`;
        util.el('small', 'ref-bar-label', bars, month);
      }
      if (display === 'header') util.el('div', 'ref-instruction', hero, ctx.instruction);
      Object.assign(_c, { bars, header, hero, stats, tabs, titleBlock, topRight });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, hero, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', hero);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-spreadsheet-fillhandle-01',
    template: 'site/base',
    design: { parts },
  });
})();
