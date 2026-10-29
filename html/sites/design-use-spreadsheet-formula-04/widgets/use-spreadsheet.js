// Design on the shared use-spreadsheet/workbook template.
env.widget({
  task: 'use-spreadsheet',
  site: 'design-use-spreadsheet-formula-04',
  name: 'design',
  split: 'train',
  scenarios: ['formula'],
  template: 'use-spreadsheet/workbook',
  design: {
    font: 'Arial', cellFontSize: 16, largeFontSize: 16, gutter: 38, headerHeight: 25,
    rowHeight: 22, minRowHeight: 18, roomyWidth: 9999, wideWidth: 99999,
    columnWeights: [1, 1.22, 1.15, .7, 1, .9, .9, 1.2],
    breadcrumb: 'Documents  >  Workbooks  >  Quarterly Budget',
    parts: {
      css: (base) => () => base() + `
        .as-book { inset:0; border:0; border-radius:0; box-shadow:none; background:#c5cdd6; color:#111; }
        .as-workarea { position:absolute; inset:0 0 25px; display:flex; min-height:0; overflow:hidden; }
        .office-formula-panel { box-sizing:border-box; flex:0 0 276px; min-width:0; padding:17px 18px; overflow:auto; border-right:3px solid #929ba5; background:linear-gradient(#d4dce5,#c2ccd7); font:16px/1.3 Arial,sans-serif; }
        .office-formula-label { margin:0 0 4px; font-weight:bold; }
        .office-formula-panel .as-fbar { height:auto; padding:0; display:flex; flex-direction:column; align-items:stretch; gap:12px; border:0; }
        .office-formula-panel .as-name { order:0; box-sizing:border-box; width:100%; height:32px; padding:3px 6px; border:2px inset #c5cdd6; background:white; color:#111; font:16px Arial,sans-serif; }
        .office-formula-panel .as-formula { order:1; box-sizing:border-box; flex:none; width:100%; height:54px; padding:7px; border:2px inset #c5cdd6; background:white; color:#111; font:16px Arial,sans-serif; }
        .office-formula-panel .as-fx { display:none; }
        .office-formula-panel .office-apply { order:2; align-self:flex-start; min-width:100px; height:34px; padding:4px 14px; border:1px solid #737d88; border-radius:0; background:linear-gradient(#f8f8f8,#c5cdd6); color:#111; font:16px Arial,sans-serif; }
        .office-tips { margin-top:30px; border:1px solid #d0bd57; background:#fff7b9; color:#111; }
        .office-tips-title { display:block; padding:3px 12px; background:#00358d; color:white; font:bold 16px Arial,sans-serif; }
        .office-tips p { margin:0 14px; padding:13px 0; border-bottom:1px solid #c3b65c; font:16px/1.3 Arial,sans-serif; }
        .office-tips p:last-child { border:0; }
        .as-grid { min-width:0; background:white; }
        .as-cell { border-color:#b9c0c7; color:#111; }
        .as-cell.letter, .as-cell.rowhead { background:#d0d6dd; color:#111; }
        .as-cell.tablehead { background:#acd2fa; color:#111; font-weight:bold; }
        .as-selection { border-color:#0874f5; background:transparent; }
        .as-status { position:absolute; left:0; right:0; bottom:0; height:25px; border-top:2px solid #929ba5; background:linear-gradient(#d9dee4,#b9c1ca); color:#111; font:14px Arial,sans-serif; }
        .office-workbook-tools { margin-top:14px; font:13px Arial,sans-serif; }
        .office-workbook-tools summary { cursor:pointer; color:#00358d; }
        .office-workbook-tools .as-tools { height:110px; overflow:auto; }
        .office-workbook-tools .as-context { overflow:auto; }
      `,
      title: () => () => {},
      navigation: () => () => {},
      ribbon: (base, S) => (ctx, book) => {
        const tools = S.util.el('details', 'office-workbook-tools', book);
        S.util.el('summary', '', tools, 'Workbook tools');
        base(ctx, tools);
        S.officeWorkbookTools = tools;
      },
      context: (base, S) => (ctx) => base(ctx, S.officeWorkbookTools),
      formulaBar: (base, S) => (ctx, book) => {
        const panel = S.util.el('aside', 'office-formula-panel', book);
        S.util.el('div', 'office-formula-label', panel, 'Formula:');
        base(ctx, panel);
        const apply = S.controls.commit;
        apply.replaceChildren(document.createTextNode('Apply'));
        apply.classList.add('office-apply');
        const tips = S.util.el('section', 'office-tips', panel);
        S.util.el('strong', 'office-tips-title', tips, 'Tips');
        S.util.el('p', '', tips, 'Type a number, a formula (such as =A1+B1) or a function, then click Apply or press Enter.');
        S.util.el('p', '', tips, 'Use cell references like A1, a range like A1:A10, and operators +  -  *  /.');
        S.util.el('p', '', tips, 'Common functions: SUM(range) AVERAGE(range) MIN(range) MAX(range) COUNT(range)');
        panel.appendChild(S.officeWorkbookTools);
        S.officeFormulaPanel = panel;
      },
      workarea: (base, S) => (ctx, book) => {
        const area = S.util.el('div', 'as-workarea office-workarea', book);
        area.appendChild(S.officeFormulaPanel);
        return area;
      },
      workspace: () => () => {},
      activity: () => () => {},
      bottom: () => () => {},
    },
  },
});
