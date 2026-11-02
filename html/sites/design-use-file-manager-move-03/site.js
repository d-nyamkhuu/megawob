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
      document.body.classList.toggle('ref-header-note', display === 'header');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
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
      util.el('span', 'explorer-nav-icon', menubar, '‹');
      util.el('span', 'explorer-nav-icon', menubar, '›');
      util.el('span', 'explorer-nav-icon', menubar, '↑');
      util.el('span', 'explorer-nav-icon explorer-refresh', menubar, '↻');
      const path = util.el('div', 'explorer-path', menubar);
      util.el('span', 'explorer-computer', path, '▣');
      util.el('span', '', path, '›');
      util.el('span', '', path, 'This PC');
      util.el('span', '', path, '›');
      util.el('strong', '', path, 'Documents');
      const search = util.el('div', 'explorer-search', menubar);
      util.el('span', '', search, '⌕');
      util.el('span', '', search, 'Search Documents');
      const toolbar = util.el('div', 'explorer-toolbar', header);
      for (const [ico, item] of [['⊕','New⌄'], ['✂',''], ['▢',''], ['▣',''], ['A',''], ['↗',''], ['▤',''], ['↕','Sort⌄'], ['☰','View⌄'], ['•••','']]) {
        const b = util.el('span', 'explorer-tool', toolbar);
        util.el('i', '', b, ico); util.el('span', '', b, item);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menubar, path, search, titlebar, toolbar, windowBtns });
    },
  };

  env.site({
    name: 'design-use-file-manager-move-03',
    template: 'site/base',
    design: { parts },
  });
})();
