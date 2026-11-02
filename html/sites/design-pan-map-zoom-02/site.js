// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      const { util, placement, wantFooter } = _c;
      document.body.classList.toggle('gem-has-actions', wantFooter || placement === 'floating');
      const desktopMenu = util.el('div', 'gem-menubar', document.body);
      for (const item of ['Desk', 'File', 'Edit', 'View', 'Map', 'Places', 'Tools', 'Window', 'Help']) {
        util.el('span', '', desktopMenu, item);
      }
      util.el('span', 'gem-clock', desktopMenu, 'Mon  10 Mar 1986  14:27');
      const desktopRail = util.el('aside', 'gem-desktop', document.body);
      for (const [icon, label] of [['▣', 'Disk A'], ['▣', 'Disk B'], ['▤', 'Hard Disk'], ['▥', 'Wastebasket']]) {
        const d = util.el('div', 'gem-deskicon', desktopRail);
        util.el('b', '', d, icon);
        util.el('span', '', d, label);
      }
      Object.assign(_c, { desktopMenu, desktopRail });
    },
    'frame.footer': (base) => function (_c) {
      base(_c);
      const status = document.querySelector('.ref-foot-text');
      if (status) status.textContent = 'Rivermere Map · Ready';
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const tabs = util.el('nav', 'gem-tabs', document.body);
      for (const [i, item] of ['Map', 'Places', 'Transport', 'Services', 'Layers'].entries()) {
        const tab = util.el('span', i === 0 ? 'gem-tab is-active' : 'gem-tab', tabs, item);
      }
      const summary = util.el('section', 'gem-summary', document.body);
      const city = util.el('div', 'gem-city', summary);
      util.el('div', 'gem-skyline', city, '▥ ▥ ▥   ▲   ▥ ▥ ▥');
      const facts = util.el('div', 'gem-facts', city);
      util.el('strong', '', facts, 'Rivermere');
      util.el('span', '', facts, 'Population　118,400');
      util.el('span', '', facts, 'Area　　　62 km²');
      util.el('span', '', facts, 'Established　1849');
      util.el('div', 'gem-description', summary,
        'Rivermere is a coastal city with a working harbour, riverside neighbourhoods and green parks. The city centre links to outlying districts by rail and bus, with markets, schools, a general hospital and a growing university quarter.');
      util.el('div', 'gem-insetmap', summary, '⌁   ◇  ·  ·\n  · ▫ ▫ ·\n·   ▫   ◇');
      Object.assign(_c, { city, facts, summary, tabs });
    },
  };

  env.site({
    name: 'design-pan-map-zoom-02',
    template: 'site/base',
    design: { parts },
  });
})();
