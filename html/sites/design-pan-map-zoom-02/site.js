// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
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
      Object.assign(_c, { collide, cr, decoys, desktopMenu, desktopRail, label, nav, placement, sidebar, wantFooter });
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
