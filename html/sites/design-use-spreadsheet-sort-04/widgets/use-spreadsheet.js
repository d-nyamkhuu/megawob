// Design on the shared use-spreadsheet/workbook template.
env.widget({
  task: 'use-spreadsheet',
  site: 'design-use-spreadsheet-sort-04',
  name: 'design',
  split: 'train',
  scenarios: ['sort'],
  template: 'use-spreadsheet/workbook',
  design: {
    font: 'Arial', alternateFont: 'Georgia', cellFontSize: 16, largeFontSize: 17,
    gutter: 46, headerHeight: 32, rowHeight: 35, minRowHeight: 24,
    columnWeights: [1.05, 1.5, .95, 1.05, 1.1, .025, .025, .025],
    roomyWidth: 1100, wideWidth: 1900, compactWidth: 760,
    breadcrumb: '', tabs: [], sheets: [],
    parts: {
      grid: (base) => (ctx, workarea) => {
        const el = base(ctx, workarea);
        el.style.position = 'absolute';
        return el;
      },
      ribbon: (base) => (ctx, book) => {
        const el = base(ctx, book);
        const labels = ['Cell', 'Font', 'Alignment', 'Cell', 'Conditional Formatting', 'Table tools', 'Editing'];
        el.querySelectorAll('.as-group').forEach((group, i) => {
          const caption = group.querySelector('small');
          if (caption) caption.textContent = labels[i] || caption.textContent;
          group.dataset.classicGroup = String(i + 1);
        });
        return el;
      },
    },
  },
});
