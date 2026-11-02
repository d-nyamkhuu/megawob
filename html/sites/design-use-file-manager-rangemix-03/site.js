// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      document.body.classList.toggle('qt-header-note', display === 'header');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);

      // Native desktop frame: menu, command toolbar and folder summary sit above the task pane.
      const menu = util.el('nav', 'qt-menu', document.body);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Bookmarks', 'Tools', 'Help']) util.el('span', '', menu, item);
      const qtToolbar = util.el('nav', 'qt-toolbar', document.body);
      for (const [icon, label, disabled] of [
        ['⬅', 'Back', false], ['➡', 'Forward', true], ['⬆', 'Up', false],
        ['✂', 'Cut', false], ['▢', 'Copy', false], ['▤', 'Paste', true],
        ['×', 'Delete', false], ['↶', 'Undo', false], ['▦', 'Views', false],
      ]) {
        if (label === 'Cut' || label === 'Delete' || label === 'Undo' || label === 'Views') util.el('i', 'qt-separator', qtToolbar);
        const tool = util.el('div', `qt-tool${disabled ? ' qt-disabled' : ''}`, qtToolbar);
        util.el('b', '', tool, icon);
        util.el('span', '', tool, label);
      }
      const summary = util.el('section', 'qt-summary', document.body);
      util.el('div', 'qt-folder-icon', summary, '📁');
      const summaryTitle = util.el('div', 'qt-folder-copy', summary);
      util.el('strong', '', summaryTitle, 'Project Files');
      util.el('span', '', summaryTitle, 'File folder');
      util.el('i', '', summaryTitle, '/home/user/Documents/Project Files');
      const summaryStats = util.el('div', 'qt-stats', summary);
      util.el('span', '', summaryStats, 'Items:　　12 items');
      util.el('span', '', summaryStats, 'Size:　　 46.2 MB (on disk)');
      util.el('span', '', summaryStats, 'Modified:　Apr 12, 2002 10:24 AM');
      Object.assign(_c, { menu, qtToolbar, summary, summaryStats, summaryTitle });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const qtDock = util.el('nav', 'qt-dock', document.body);
      for (const [icon, label] of [['⌂', 'Places'], ['⚙', 'Applications'], ['▣', 'System']]) {
        const tab = util.el('div', 'qt-dock-tab', qtDock);
        util.el('b', '', tab, icon);
        util.el('span', '', tab, label);
      }
      Object.assign(_c, { qtDock, stage });
    },
  };

  env.site({
    name: 'design-use-file-manager-rangemix-03',
    template: 'site/base',
    design: { parts },
  });
})();
