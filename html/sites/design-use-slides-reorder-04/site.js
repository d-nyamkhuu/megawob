// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const tabs = util.el('div', 'slides-tabs', header);
      for (const item of ['Home', 'Insert', 'Design', 'Transitions', 'Animations', 'Slide Show', 'Review', 'View']) {
        util.el('span', item === 'Home' ? 'slides-tab active' : 'slides-tab', tabs, item);
      }
      const ribbon = util.el('div', 'slides-ribbon', header);
      const groups = [
        ['✂  Cut', '▣  Copy', '▧  Paste'], ['✦  New Slide', '▤  Layout', '↻  Reset', '▣  Section'],
        ['Helvetica  ▾', '28  ▾', 'B   I   U   A', 'Aa  ▾'], ['☷  •••  ¶', '≡  ≋  ☷', '⇥  ⇵'],
        ['□  ◯  △  ／', 'Arrange', 'Quick Styles'], ['Shape Fill  ▾', 'Shape Outline  ▾', 'Shape Effects  ▾'],
      ];
      for (const items of groups) {
        const group = util.el('div', 'slides-ribbon-group', ribbon);
        for (const item of items) util.el('span', 'slides-ribbon-item', group, item);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { groups, header, ribbon, tabs });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const tips = util.el('aside', 'slides-tips', body);
      util.el('div', 'slides-tips-title', tips, '💡  Tips');
      util.el('strong', '', tips, 'Reorder slides');
      util.el('p', '', tips, 'Drag a slide in the thumbnail strip to change the order.');
      util.el('p', '', tips, 'Use your mouse or trackpad to drag, or use the keyboard shortcuts.');
      util.el('hr', '', tips);
      util.el('strong', '', tips, 'Other ways to organise slides');
      util.el('ul', '', tips).innerHTML = '<li>Cut and paste</li><li>Use the Slide Sorter view</li><li>Right-click for more options</li>';
      Object.assign(_c, { stage, tips });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      const appDock = util.el('nav', 'slides-dock', document.body);
      for (const [icon, item, active] of [['▱', 'Documents'], ['▣', 'Presentations'], ['▦', 'Spreadsheets'], ['♟', 'Shared']]) {
        const a = util.el('div', active ? 'slides-dock-item active' : 'slides-dock-item', appDock);
        util.el('span', 'slides-dock-icon', a, icon);
        util.el('span', '', a, item);
      }
      Object.assign(_c, { appDock, submit });
    },
  };

  env.site({
    name: 'design-use-slides-reorder-04',
    template: 'site/base',
    design: { parts },
  });
})();
