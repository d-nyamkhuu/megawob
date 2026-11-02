// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'explorer-titlebar', header);
      util.el('span', 'explorer-title-icon', titlebar, '📁');
      util.el('span', 'explorer-title', titlebar, 'Documents');
      const windowBtns = util.el('div', 'explorer-window-btns', titlebar);
      util.el('span', '', windowBtns, '−');
      util.el('span', '', windowBtns, '□');
      util.el('span', 'close', windowBtns, '×');
      const menubar = util.el('nav', 'explorer-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', '', menubar, item);
      const toolbar = util.el('div', 'explorer-toolbar', header);
      for (const [ico, item] of [['▤','Organize⌄'], ['▣','Open'], ['👥','Share with⌄'], ['▤','Print'], ['◉','Burn'], ['📁','New folder']]) {
        const b = util.el('span', 'explorer-tool', toolbar);
        util.el('i', '', b, ico); util.el('span', '', b, item);
      }
      const folderHead = util.el('div', 'explorer-folder-head', header);
      util.el('div', 'explorer-big-folder', folderHead, '📁');
      const folderInfo = util.el('div', 'explorer-folder-info', folderHead);
      util.el('div', 'explorer-folder-name', folderInfo, 'Documents');
      util.el('div', '', folderInfo, 'File folder');
      util.el('div', '', folderInfo, 'Date modified:  Apr 12, 2024 10:15 AM');
      S.frameBrand(_c, header);
      Object.assign(_c, { folderHead, folderInfo, header, menubar, titlebar, toolbar, windowBtns });
    },
  };

  env.site({
    name: 'design-use-file-manager-move-01',
    template: 'site/base',
    design: { parts },
  });
})();
