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
      document.body.dataset.instr = display;
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.header': (base, S) => function (_c) {
      const { rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const title = rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Project Files');
      brand.dataset.role = 'brand';
      const winControls = util.el('div', 'ref-window-controls', header);
      for (const glyph of ['–', '□', '×']) {
        const control = util.el('button', '', winControls, glyph);
        control.type = 'button';
        control.setAttribute('aria-label', glyph === '–' ? 'Minimize' : glyph === '□' ? 'Maximize' : 'Close');
      }
      Object.assign(_c, { brand, header, title, winControls });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const osSide = util.el('aside', 'ref-os-sidebar', body);
      const rail = util.el('div', 'ref-os-rail', osSide);
      const items = [['▤', 'Files'], ['⌂', 'Home'], ['▭', 'Documents'], ['▨', 'Pictures'], ['♪', 'Music'], ['▶', 'Videos'], ['▰', 'Projects'], ['♻', 'Recycle Bin']];
      items.forEach(([g, l], i) => {
        const it = util.el('div', 'ref-os-ritem' + (i === 0 ? ' active' : ''), rail);
        util.el('span', 'ref-os-glyph', it, g);
        util.el('span', '', it, l);
      });
      S.frameSidebar(_c, body);
      const tips = util.el('aside', 'ref-tips', body);
      const tin = util.el('div', 'ref-tips-in', tips);
      util.el('div', 'ref-tips-h', tin, 'Tips');
      const sec = (t, rows) => {
        util.el('div', 'ref-tips-s', tin, t);
        for (const [ic, tx] of rows) {
          const r = util.el('div', 'ref-tips-r', tin);
          util.el('i', '', r, ic);
          util.el('span', '', r, tx);
        }
      };
      sec('Navigate', [['▰', 'Click folders in the tree to browse or double-click to open.'], ['←→', 'Use the back and forward buttons or the breadcrumb to move between folders.'], ['⌕', 'Use the search box to find files by name.']]);
      sec('Select files', [['◐', 'Click to select a file. Ctrl+click to select multiple files. Shift+click to select a range. Drag to draw a selection box.']]);
      sec('Organize', [['▤', 'Drag and drop files into folders. Hover over a folder to open it automatically while dragging.']]);
      sec('More', [['↶', 'Use Undo (Ctrl+Z) to revert a delete, move, or rename.']]);
      util.el('div', 'ref-tips-art', tips);
      Object.assign(_c, { body, osSide, rail, tips });
    },
  };

  env.site({
    name: 'design-use-file-manager-dblrename-05',
    template: 'site/base',
    design: { parts },
  });
})();
