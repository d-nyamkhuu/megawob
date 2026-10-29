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
      const winIcon = util.el('span', 'motif-window-icon', header, '◆');
      winIcon.setAttribute('aria-hidden', 'true');
      const title = util.el('span', 'motif-window-title', header, 'WorkBook');
      const menu = util.el('nav', 'motif-menubar', document.body);
      for (const label of ['Home', 'Insert', 'Format', 'Data', 'Tools', 'View', 'Help']) {
        util.el('span', 'motif-menu-item', menu, label);
      }
      Object.assign(_c, { menu, title, winIcon });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const props = util.el('aside', 'motif-properties', body);
      util.el('div', 'motif-prop-tab active', props, 'Properties');
      util.el('div', 'motif-prop-tab second', props, 'Sheets');
      const propContent = util.el('div', 'motif-prop-content', props);
      util.el('h3', '', propContent, 'Sheet Properties');
      for (const [label, value] of [['Name:', 'Sales Q1'], ['Color:', '◻  None'], ['Gridlines:', '☑  Show gridlines'], ['Row headers:', '☑  Show row headers'], ['Column headers:', '☑  Show column headers']]) {
        const row = util.el('div', 'motif-prop-row', propContent); util.el('span', '', row, label); util.el('b', '', row, value);
      }
      util.el('hr', '', propContent);
      util.el('h3', '', propContent, 'Cell Formatting');
      for (const [label, value] of [['Font:', 'Arial'], ['Size:', '10'], ['Style:', 'B   I   U'], ['Text color:', '■  Automatic'], ['Fill color:', '□  Automatic'], ['Alignment:', '☰   ☷   ☰'], ['Wrap text:', '□'], ['Merge cells:', '□']]) {
        const row = util.el('div', 'motif-prop-row', propContent); util.el('span', '', row, label); util.el('b', '', row, value);
      }
      util.el('hr', '', propContent);
      util.el('h3', '', propContent, 'Number Format');
      util.el('div', 'motif-format-list', propContent, 'General\nNumber\nCurrency\nDate\nPercentage\nFraction\nScientific\nText\nCustom');
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
      Object.assign(_c, { body, propContent, props, sheetList, sheetNames });
    },
  };

  env.site({
    name: 'design-use-spreadsheet-range-02',
    template: 'site/base',
    design: { parts },
  });
})();
