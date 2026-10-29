// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const win = util.el('div', 'ref-windowbar', header);
      util.el('span', 'ref-window-icon', win, '◉');
      util.el('span', 'ref-window-title', win, 'Project Update.odp - Presentation');
      const winControls = util.el('div', 'ref-window-controls', win);
      for (const mark of ['−', '□', '×']) util.el('span', 'ref-window-control', winControls, mark);
      const menu = util.el('nav', 'ref-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Insert', 'Format', 'Slide', 'Tools', 'Window', 'Help']) {
        util.el('span', 'ref-menu-item', menu, item);
      }
      const appbar = util.el('div', 'ref-appbar', header);
      const appTools = [
        ['▧', 'New Slide'], ['▣', 'Duplicate'], ['▤', 'Delete'], ['T', 'Text Box'],
        ['▧', 'Picture'], ['◇', 'Shape'], ['↶', 'Undo'], ['↷', 'Redo'],
      ];
      for (const [icon, text] of appTools) {
        const tool = util.el('div', 'ref-app-tool', appbar);
        util.el('span', 'ref-app-icon', tool, icon);
        util.el('span', '', tool, text);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { appTools, appbar, header, menu, win, winControls });
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
      const bottom = util.el('nav', 'bauhaus-dock', document.body);
      const dockItems = [['▣', 'Slides'], ['▯', 'Documents'], ['▦', 'Sheets'], ['⠿', 'More']];
      for (let i = 0; i < dockItems.length; i++) {
        const [icon, text] = dockItems[i];
        const item = util.el('div', `bauhaus-dock-item${i === 0 ? ' active' : ''}`, bottom);
        util.el('span', 'bauhaus-dock-icon', item, icon);
        util.el('span', '', item, text);
      }
      const dockTools = util.el('div', 'bauhaus-dock-tools', bottom);
      for (const icon of ['⌕', '♧', '⚙']) util.el('span', 'bauhaus-dock-tool', dockTools, icon);
      Object.assign(_c, { bottom, dockItems, dockTools, submit });
    },
  };

  env.site({
    name: 'design-use-slides-align-04',
    template: 'site/base',
    design: { parts },
  });
})();
