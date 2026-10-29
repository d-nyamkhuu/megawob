// Design on the shared use-spreadsheet/workbook template.
env.widget({
  task: 'use-spreadsheet',
  site: 'design-use-spreadsheet-range-05',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  template: 'use-spreadsheet/workbook',
  design: {
    font: 'Arial',
    cellFontSize: 16,
    largeFontSize: 17,
    gutter: 56,
    canvasGutter: 56,
    headerHeight: 31,
    canvasHeaderHeight: 31,
    rowHeight: 31,
    canvasRowHeight: 31,
    minRowHeight: 23,
    scrollbarWidth: 28,
    columnWeights: [1.05, 1, 1, .98, 1, .92, .92, .84],
    canvasColumnWeights: [1.05, 1, 1, .98, 1, .92, .92, .84],
    parts: {
      title: () => () => {},
      navigation: () => () => {},
      workspace: () => () => {},
      activity: () => () => {},
      bottom: (base, S) => (ctx, book) => {
        // Sheet tabs under the grid: decorative spans, so the workbook's own tab menus stay closed.
        const bottom = S.util.el('div', 'as-bottom', book);
        S.util.el('span', 'as-tab as-add', bottom, '+');
        for (const label of ['Sales', 'By Category', 'Summary']) {
          S.util.el('span', `as-tab${label === 'Sales' ? ' active' : ''}`, bottom, label);
        }
        return bottom;
      },
    },
  },
});
