// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);

      // Motif workbook frame: the generated task widget remains in the stage;
      // these elements provide the surrounding desktop frame and navigation.
      header.classList.add('motif-titlebar');
      const winIcon = util.el('span', 'motif-window-icon', header, '▤');
      winIcon.setAttribute('aria-hidden', 'true');
      const title = util.el('span', 'motif-window-title', header, 'Sales Report - MapleWorks');
      const winButtons = util.el('div', 'motif-window-buttons', header);
      for (const mark of ['−', '□', '×']) util.el('span', 'motif-win-button', winButtons, mark);
      const menu = util.el('nav', 'motif-menubar', document.body);
      for (const label of ['File', 'Edit', 'View', 'Insert', 'Format', 'Data', 'Window', 'Help']) {
        util.el('span', 'motif-menu-item', menu, label);
      }
      Object.assign(_c, { menu, title, winButtons, winIcon });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const sheetList = util.el('aside', 'motif-sheets', body);
      util.el('strong', 'motif-sheets-heading', sheetList, 'Worksheets');
      const sheetNames = ['Sales Report', 'Quarterly Summary', 'Product List', 'Region Totals'];
      for (let i = 0; i < sheetNames.length; i++) {
        const row = util.el('div', `motif-sheet-row${i === 0 ? ' selected' : ''}`, sheetList);
        util.el('span', 'motif-sheet-icon', row, '▦');
        util.el('span', '', row, sheetNames[i]);
      }
      const related = util.el('section', 'motif-related', sheetList);
      util.el('strong', 'motif-related-heading', related, 'Related Tasks');
      for (const [icon, label] of [['▧', 'Insert Worksheet'], ['▣', 'Delete Worksheet'], ['✎', 'Rename Worksheet'],
        ['▤', 'Move or Copy…'], ['⚙', 'Worksheet Properties…']]) {
        const row = util.el('div', 'motif-related-row', related);
        util.el('span', 'motif-related-icon', row, icon);
        util.el('span', '', row, label);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, related, sheetList, sheetNames });
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
      const dock = util.el('nav', 'motif-dock', document.body);
      for (const [icon, label] of [['✉', 'Mail'], ['▦', 'Calendar'], ['▤', 'WorkPad'], ['♙', 'Contacts'], ['⚒', 'Tasks'], ['▧', 'Notes']]) {
        const item = util.el('div', `motif-dock-item${label === 'WorkPad' ? ' active' : ''}`, dock);
        util.el('span', 'motif-dock-icon', item, icon);
        util.el('span', '', item, label);
      }
      Object.assign(_c, { dock, submit });
    },
  };

  env.site({
    name: 'design-use-spreadsheet-range-03',
    template: 'site/base',
    design: { parts },
  });
})();
