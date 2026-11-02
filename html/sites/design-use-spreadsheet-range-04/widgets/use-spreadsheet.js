// Design on the shared use-spreadsheet/workbook template.
env.widget({
  task: 'use-spreadsheet',
  site: 'design-use-spreadsheet-range-04',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  template: 'use-spreadsheet/workbook',
  design: {
    canvasRowHeight: 34,
    rowHeight: 34,
    minRowHeight: 30,
    canvasHeaderHeight: 31,
    headerHeight: 31,
  },
});
