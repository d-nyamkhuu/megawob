// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'pixel-titlebar', header);
      util.el('span', 'pixel-app-icon', titlebar, '📁');
      util.el('span', 'pixel-app-title', titlebar, 'My Drive');
      const win = util.el('span', 'pixel-window-controls', titlebar);
      for (const glyph of ['–', '□', '×']) util.el('i', '', win, glyph);
      const menubar = util.el('nav', 'pixel-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Favorites', 'Tools', 'Help']) util.el('span', '', menubar, item);
      const toolbar = util.el('div', 'pixel-toolbar', header);
      for (const [icon, label] of [['⬅', 'Back'], ['➜', 'Forward'], ['⬆', 'Up'], ['✂', 'Cut'], ['▣', 'Copy'], ['▤', 'Paste'], ['✕', 'Delete'], ['↶', 'Undo'], ['▤', 'Views']]) {
        const t = util.el('div', 'pixel-tool', toolbar);
        util.el('b', '', t, icon); util.el('span', '', t, label);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menubar, titlebar, toolbar, win });
    },
    'frame.tools': (base, S) => function (_c) {
      base(_c);
      _c.titlebar.insertBefore(_c.headerTools, _c.win);
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const rail = util.el('div', 'pixel-help-rail', body);
      const panel = body.querySelector('.ref-panel');
      if (panel) rail.appendChild(panel);
      const tips = util.el('aside', 'pixel-tips', rail);
      util.el('h3', '', tips, '💡  Tips');
      util.el('p', '', tips, 'Double-click a file to open it. Right-click for more options. Use Ctrl or Shift to select multiple files. Drag and drop files to move them to another folder. Hover over a folder in the tree while dragging to open it. You can undo a delete using Edit  >  Undo.');
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage, tips });
    },
  };

  env.site({
    name: 'design-use-file-manager-rangemix-04',
    template: 'site/base',
    design: { parts },
  });
})();
