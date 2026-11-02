// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, ctx, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      // Preserve the original seeded frame draws while presenting this design's workbook tabs.
      if (display !== 'header' || nav) rng.pick(TITLES);
      if (nav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
      const tabs = util.el('nav', 'ref-nav', header);
      util.el('span', 'ref-window-menu', tabs, '☰');
      util.el('strong', 'ref-window-title', tabs, 'Budget Plan.xlsx — Workbook');
      const windowControls = util.el('div', 'ref-window-controls', tabs);
      for (const icon of ['−', '□', '×']) util.el('span', '', windowControls, icon);
      const menu = util.el('nav', 'ref-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Insert', 'Format', 'Data', 'Tools', 'Help']) {
        const a = util.el('a', 'ref-menulink', menu, item);
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'menu', label: item }); });
      }
      const hero = util.el('section', 'ref-hero', header);
      const icons = util.el('div', 'ref-icon-toolbar', hero);
      for (const [icon, title] of [['▯','New'], ['▱','Open'], ['▤','Print'], ['↶','Undo'], ['↷','Redo'], ['⌕','Find']]) {
        const b = util.el('button', 'ref-tool-icon', icons, icon); b.type = 'button'; b.title = title;
      }
      util.el('span', 'ref-tool-sep', icons);
      for (const [text, width] of [['Inter  ⌄', 138], ['11  ⌄', 64]]) {
        const b = util.el('button', 'ref-tool-icon ref-tool-picker', icons, text);
        b.type = 'button'; b.style.width = `${width}px`; b.title = text;
      }
      for (const [icon, title] of [['B','Bold'], ['I','Italic'], ['U','Underline'], ['≡','Align'], ['▦','Borders'], ['Σ','Sum'], ['↧','Sort'], ['▥','Chart']]) {
        const b = util.el('button', 'ref-tool-icon', icons, icon); b.type = 'button'; b.title = title;
      }
      if (display === 'header') util.el('div', 'ref-instruction', hero, ctx.instruction);
      Object.assign(_c, { header, hero, icons, menu, tabs, windowControls });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, hero, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', hero);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-spreadsheet-fillhandle-02',
    template: 'site/base',
    design: { parts },
  });
})();
