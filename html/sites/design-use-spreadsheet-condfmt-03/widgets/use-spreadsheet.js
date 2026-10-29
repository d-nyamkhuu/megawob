// Design on the shared use-spreadsheet/workbook template.
env.widget({
  task: 'use-spreadsheet',
  site: 'design-use-spreadsheet-condfmt-03',
  name: 'design',
  split: 'train',
  scenarios: ['condfmt'],
  template: 'use-spreadsheet/workbook',
  design: {
    font: 'Times New Roman',
    cellFontSize: 20,
    largeFontSize: 21,
    headerHeight: 30,
    rowHeight: 30,
    minRowHeight: 30,
    gutter: 78,
    columnWeights: [1.12, 1.0, 1.0, 1.04, 1.0, 0.92, 0.92, 0.92],
    parts: {
      title: (_base) => (ctx, book) => {
        const bar = ctx.util.el('div', 'as-title', book);
        ctx.util.el('b', 'as-heading', bar, 'Budget - Spreadsheet');
        return bar;
      },
      navigation: () => () => {},
      context: (base) => (ctx, book) => base(ctx, book),
      workarea: () => (ctx, book) => ctx.util.el('div', 'as-workarea', book),
      workspace: () => () => {},
      activity: () => () => {},
      bottom: () => () => {},
      rendered: (base) => (ctx, book) => {
        base(ctx, book);
        const ribbon = book.querySelector('.as-tools');
        const formulaBar = book.querySelector('.as-fbar');
        const conditional = book.querySelector('.as-formatgroup .as-btn');
        if (conditional && formulaBar) {
          const label = [...conditional.childNodes].find((node) => node.nodeType === 3 && node.textContent.trim());
          if (label) label.textContent = 'Conditional Formatting...';
          formulaBar.append(conditional);
        }
        if (ribbon) ribbon.remove();
      },
    },
  },
});
