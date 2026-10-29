// Design on the shared use-spreadsheet/workbook template.
env.widget({
  task: 'use-spreadsheet',
  site: 'design-use-spreadsheet-filter-04',
  name: 'design',
  split: 'train',
  scenarios: ['filter'],
  template: 'use-spreadsheet/workbook',
  design: {
    font: 'Arial', cellFontSize: 14, largeFontSize: 15, rowHeight: 27, headerHeight: 27,
    columnWeights: [1.05, 1.35, 1.05, 1.05, .9, 1.5, 1.2, .8],
  },
});
