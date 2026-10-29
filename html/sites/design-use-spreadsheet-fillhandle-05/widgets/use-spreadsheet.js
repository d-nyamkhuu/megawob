// Design on the shared use-spreadsheet/workbook template.
env.widget({
  task: 'use-spreadsheet',
  site: 'design-use-spreadsheet-fillhandle-05',
  name: 'design',
  split: 'train',
  scenarios: ['fillhandle'],
  template: 'use-spreadsheet/workbook',
  design: {
    font: 'Trebuchet MS', alternateFont: 'Trebuchet MS', cellFontSize: 18, largeFontSize: 20,
    rowHeight: 37, minRowHeight: 28, headerHeight: 36, gutter: 64,
    columnWeights: [1.18, .96, 1, 1, 1, 1.02, .95, 1.02],
    parts: {
      title: (base) => base,
      navigation: (base) => base,
      ribbon: (base) => base,
      context: (base) => base,
      workspace: () => () => null,
      activity: () => () => null,
      bottom: (base, S) => (ctx, book) => {
        const result = base(ctx, book);
        const sheetList = book.querySelector('.as-bottom > .as-btn:first-child');
        if (sheetList) {
          sheetList.classList.add('app-sheet-switch');
          sheetList.innerHTML = '<span aria-hidden="true">◀</span><span aria-hidden="true">▶</span>';
        }
        const zoom = book.querySelector('.as-bottom .as-saved');
        if (zoom) S.util.el('i', 'app-zoom-knob', zoom);
        return result;
      },
      formulaBar: (base, S) => (ctx, book) => {
        const pane = S.util.el('div', 'as-formula-pane', book);
        base(ctx, pane);
        return pane;
      },
    },
  },
});
