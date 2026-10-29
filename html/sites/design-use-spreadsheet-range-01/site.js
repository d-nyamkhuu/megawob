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
      const title = util.el('span', 'motif-window-title', header, 'WorkPad - Quarterly Sales');
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
      util.el('strong', 'motif-sheets-heading', sheetList, 'Sheets');
      const sheetNames = ['Quarterly Sales', 'Product Catalog', 'Regional Offices', 'Sales People', 'Customers',
        'Order History', 'Returns', 'Marketing Spend', 'Website Traffic', 'Support Tickets', 'Pricing',
        'Forecast 1991', 'Budget', 'Expense Reports', 'Vendors', 'Inventory', 'Shipping Log', 'Project Plan',
        'Meeting Notes', 'Contacts'];
      for (let i = 0; i < sheetNames.length; i++) {
        const row = util.el('div', `motif-sheet-row${i === 0 ? ' selected' : ''}`, sheetList);
        util.el('span', 'motif-sheet-icon', row, '▦');
        util.el('span', '', row, sheetNames[i]);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, sheetList, sheetNames });
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
    name: 'design-use-spreadsheet-range-01',
    template: 'site/base',
    design: { parts },
  });
})();
