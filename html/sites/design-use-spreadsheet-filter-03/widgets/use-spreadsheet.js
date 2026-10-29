// Design on the shared use-spreadsheet/workbook template.
env.widget({
  task: 'use-spreadsheet',
  site: 'design-use-spreadsheet-filter-03',
  name: 'design',
  split: 'train',
  scenarios: ['filter'],
  template: 'use-spreadsheet/workbook',
  design: {
    font: 'Arial',
    cellFontSize: 16,
    largeFontSize: 17,
    gutter: 52,
    headerHeight: 31,
    rowHeight: 31,
    minRowHeight: 31,
    roomyWidth: 9999,
    wideWidth: 9999,
    parts: {
      title: (base) => (...args) => base(...args),
      navigation: (base) => (...args) => base(...args),
      ribbon: (base) => (...args) => base(...args),
      context: (base) => (...args) => base(...args),
      workspace: (base) => (...args) => base(...args),
      activity: (base) => (...args) => base(...args),
      bottom: (base) => (ctx, book) => {
        const result = base(ctx, book);
        const tabs = ctx.util.el('div', 'kde-sheet-tabs', book);
        ctx.util.el('span', 'kde-sheet-plus', tabs, '+');
        ctx.util.el('span', 'kde-sheet-tab active', tabs, 'Projects');
        ctx.util.el('span', 'kde-sheet-tab', tabs, 'Milestones');
        ctx.util.el('span', 'kde-sheet-tab', tabs, 'Resources');
        return result;
      },
    },
  },
});
