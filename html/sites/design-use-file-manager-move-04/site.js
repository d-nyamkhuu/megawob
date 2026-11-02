// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'explorer-titlebar', header);
      util.el('span', 'explorer-title-icon', titlebar, '▣');
      util.el('span', 'explorer-title', titlebar, 'Work');
      const windowBtns = util.el('div', 'explorer-window-btns', titlebar);
      util.el('span', '', windowBtns, '−');
      util.el('span', '', windowBtns, '□');
      util.el('span', 'close', windowBtns, '×');
      const toolbar = util.el('div', 'explorer-toolbar', header);
      for (const [ico, item] of [['◀','Back'], ['▶','Forward'], ['⬆','Up'], ['▱+','New Folder'], ['▤','Delete'], ['●','Get Info'], ['☷','View']]) {
        const b = util.el('span', 'explorer-tool', toolbar);
        util.el('i', '', b, ico); util.el('span', '', b, item);
      }
      const search = util.el('div', 'explorer-search', toolbar);
      util.el('span', '', search, '⌕');
      const viewTools = util.el('div', 'explorer-view-tools', toolbar);
      util.el('span', '', viewTools, '☷');
      util.el('span', '', viewTools, '▦');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, search, titlebar, toolbar, viewTools, windowBtns });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, placement, util, wantFooter } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        util.el('span', 'ref-foot-text', foot, 'Tip: Select files with Shift-click or Ctrl-click. Drag files to a folder in the tree to move them.');
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      if (!wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        util.el('span', 'ref-foot-text', foot, 'Tip: Select files with Shift-click or Ctrl-click. Drag files to a folder in the tree to move them.');
      }
      const dock = util.el('div', 'explorer-dock', document.body);
      for (const [icon, label] of [['▤','File Viewer'], ['⌂','Workspace'], ['▧','Mail'], ['◎','Web'], ['>_','Terminal'], ['☷','Preferences'], ['▤','Trash']]) {
        const app = util.el('div', `explorer-dock-app dock-${label.toLowerCase().replace(/\s+/g, '-')}${label === 'Trash' ? ' dock-trash' : ''}`, dock);
        util.el('span', '', app, icon); util.el('small', '', app, label);
      }
      Object.assign(_c, { dock, submit });
    },
  };

  env.site({
    name: 'design-use-file-manager-move-04',
    template: 'site/base',
    design: { parts },
  });
})();
