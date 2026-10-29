// Design on the shared use-spreadsheet/workbook template.
env.widget({
  task: 'use-spreadsheet',
  site: 'design-use-spreadsheet-sort-03',
  name: 'design',
  split: 'train',
  scenarios: ['sort'],
  template: 'use-spreadsheet/workbook',
  design: {
    font: 'Arial',
    cellFontSize: 16,
    largeFontSize: 18,
    headerHeight: 29,
    rowHeight: 30,
    minRowHeight: 20,
  },
});
