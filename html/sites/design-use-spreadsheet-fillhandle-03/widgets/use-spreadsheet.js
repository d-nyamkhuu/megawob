// Design on the shared use-spreadsheet/workbook template.
env.widget({
  task: 'use-spreadsheet',
  site: 'design-use-spreadsheet-fillhandle-03',
  name: 'design',
  split: 'train',
  scenarios: ['fillhandle'],
  template: 'use-spreadsheet/workbook',
  design: {
    renderer: 'classic',
    font: 'Courier New',
    cellFontSize: 15,
    largeFontSize: 16,
    canvasAccent: '#0780ff',
    gutter: 36,
    headerHeight: 27,
    rowHeight: 32,
    minRowHeight: 22,
    scrollbarWidth: 15,
    columnWeights: [1.45, 1.1, .9, 1.05, 1.15, .8, .95, .8],
    tabs: [],
    sheets: [],
  },
});
