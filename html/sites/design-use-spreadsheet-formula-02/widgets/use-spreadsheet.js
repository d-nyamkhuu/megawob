// Design on the shared use-spreadsheet/workbook template.
env.widget({
  task: 'use-spreadsheet',
  site: 'design-use-spreadsheet-formula-02',
  name: 'design',
  split: 'train',
  scenarios: ['formula'],
  template: 'use-spreadsheet/workbook',
  design: {
    font: 'Segoe UI',
    cellFontSize: 11,
    rowHeight: 19,
    minRowHeight: 16,
    roomyWidth: 700,
    wideWidth: 1800,
    compactWidth: 500,
    columnWeights: [1.05, 1.35, 1.25, 1.15, .9, 1, 1.05, 1.2],
  },
});
