// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const winbar = util.el('div', 'vista-titlebar', header);
      util.el('strong', 'vista-title', winbar, 'Riverton College');
      const wincontrols = util.el('div', 'vista-window-controls', winbar);
      for (const glyph of ['−', '□', '×']) util.el('span', 'vista-window-control', wincontrols, glyph);
      const menubar = util.el('div', 'vista-menubar', header);
      for (const item of ['Home', 'Courses', 'Students', 'Grades', 'Resources', 'Reports']) util.el('span', 'vista-menu-item', menubar, item);
      const quickbar = util.el('div', 'vista-quickbar', header);
      for (const [icon, label] of [['▤','New Module'], ['▧','New Lesson'], ['×','Delete'], ['↑','Move Up'], ['↓','Move Down'], ['⚙','Properties']]) {
        const tool = util.el('span', 'vista-tool', quickbar);
        util.el('b', 'vista-tool-icon', tool, icon);
        util.el('span', '', tool, label);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menubar, quickbar, winbar, wincontrols });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, placement, quickbar, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', quickbar);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, submit });
    },
  };

  env.site({
    name: 'design-use-course-admin-modules-02',
    template: 'site/base',
    design: { parts },
  });
})();
