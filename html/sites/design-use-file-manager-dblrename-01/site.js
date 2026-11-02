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
      const brand = util.el('div', 'ref-brand', header, 'Design - Icon View - Workplace Shell');
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
      const tabs = util.el('div', 'ref-os-tabs', osSide);
      util.el('strong', 'ref-os-tab active', tabs, 'Folder View');
      util.el('span', 'ref-os-tab', tabs, 'File Details');
      const group = (title, entries) => {
        const box = util.el('section', 'ref-os-box', osSide);
        util.el('strong', 'ref-os-box-title', box, title);
        for (const [icon, label] of entries) {
          const row = util.el('div', 'ref-os-row', box);
          util.el('span', 'ref-os-icon', row, icon);
          util.el('span', '', row, label);
        }
      };
      group('Folder Tasks', [['📁', 'Create a new folder'], ['▤', 'Copy the selected items'], ['✂', 'Move the selected items'], ['✖', 'Delete the selected items'], ['↶', 'Undo the last action']]);
      group('Other Places', [['▣', 'Desktop'], ['📁', 'My Documents'], ['📁', 'Pictures'], ['📁', 'Projects']]);
      const details = util.el('section', 'ref-os-box ref-os-details', osSide);
      util.el('strong', 'ref-os-box-title', details, 'Details');
      util.el('div', 'ref-os-detail-name', details, '📁   Design');
      util.el('div', 'ref-os-detail', details, '      File Folder');
      util.el('div', 'ref-os-detail', details, '      12 items');
      util.el('div', 'ref-os-detail', details, '      Size: 8.4 MB');
      util.el('div', 'ref-os-detail', details, '      Modified: Apr 28, 2021  10:24 AM');
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, details, group, osSide, tabs });
    },
  };

  env.site({
    name: 'design-use-file-manager-dblrename-01',
    template: 'site/base',
    design: { parts },
  });
})();
