// Design on the shared use-spreadsheet/workbook template.
env.widget({
  task: 'use-spreadsheet',
  site: 'design-use-spreadsheet-fillhandle-04',
  name: 'design',
  split: 'train',
  scenarios: ['fillhandle'],
  template: 'use-spreadsheet/workbook',
  design: {
    font: 'Tahoma',
    alternateFont: 'Tahoma',
    cellFontSize: 13,
    largeFontSize: 14,
    gutter: 49,
    headerHeight: 22,
    rowHeight: 18,
    minRowHeight: 17,
    scrollbarWidth: 15,
    roomyWidth: 9999,
    wideWidth: 9999,
    columnWeights: [1.03, 1.2, 1.12, 1.08, 1.02, 1.38, .82, .82],
  },
});
