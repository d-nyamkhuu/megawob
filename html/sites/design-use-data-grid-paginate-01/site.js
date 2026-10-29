// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx, util } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');

      // Motif workstation frame surrounding the task window.
      const winbar = util.el('div', 'motif-titlebar', document.body);
      util.el('span', 'motif-app-icon', winbar, '▤');
      util.el('strong', '', winbar, 'Inventory Manager');
      util.el('span', 'motif-window-buttons', winbar, '▁ □ ×');
      const menubar = util.el('nav', 'motif-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Records', 'Tools', 'Window', 'Help']) util.el('span', '', menubar, item);
      const appTools = util.el('div', 'motif-toolbar', document.body);
      for (const [icon, label] of [['▯','New'],['📂','Open'],['▤','Delete'],['▣','Print'],['⇧','Import'],['⇩','Export']]) {
        const tool = util.el('div', 'motif-tool', appTools);
        util.el('span', 'motif-tool-icon', tool, icon);
        util.el('span', '', tool, label);
      }
      Object.assign(_c, { H, W, appTools, display, menubar, roomy, tall, winbar });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const index = util.el('aside', 'motif-index', body);
      const cats = util.el('section', 'motif-index-box', index);
      util.el('h3', '', cats, 'Categories');
      for (const item of ['▣　All Products','📁　Office Supplies','📁　Computer Hardware','📁　Computer Software','📁　Electronics','📁　Furniture','📁　Maintenance','📁　Safety','📁　Storage']) util.el('div', 'motif-index-item', cats, item);
      const recent = util.el('section', 'motif-index-box motif-recent', index);
      util.el('h3', '', recent, 'Recent Items');
      for (const item of ['Laser Printer','Monitor 17”','Desk Chair','USB Drive 32GB','Paper - A4','Desk Lamp','Filing Cabinet','Keyboard','Mouse','Whiteboard']) util.el('div', 'motif-recent-item', recent, `▤　${item}`);
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, cats, index, recent });
    },
  };

  env.site({
    name: 'design-use-data-grid-paginate-01',
    template: 'site/base',
    design: { parts },
  });
})();
