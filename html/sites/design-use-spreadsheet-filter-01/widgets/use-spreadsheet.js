// Design on the shared use-spreadsheet/workbook template.
env.widget({
  task: 'use-spreadsheet',
  site: 'design-use-spreadsheet-filter-01',
  name: 'design',
  split: 'train',
  scenarios: ['filter'],
  template: 'use-spreadsheet/workbook',
  design: {
    font: 'Arial',
    cellFontSize: 16,
    largeFontSize: 17,
    gutter: 52,
    headerHeight: 29,
    rowHeight: 29,
    minRowHeight: 24,
    roomyWidth: 9999,
    wideWidth: 9999,
    parts: {
      title: (base) => (...args) => base(...args),
      navigation: (base) => (...args) => base(...args),
      ribbon: (base) => (...args) => base(...args),
      context: (base) => (...args) => base(...args),
      workspace: (base) => (...args) => base(...args),
      activity: (base) => (...args) => base(...args),
      bottom: (base) => (...args) => base(...args),
    },
  },
});
