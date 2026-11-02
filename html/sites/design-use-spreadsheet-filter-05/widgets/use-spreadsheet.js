// Design on the shared use-spreadsheet/workbook template.
env.widget({
  task: 'use-spreadsheet',
  site: 'design-use-spreadsheet-filter-05',
  name: 'design',
  split: 'train',
  scenarios: ['filter'],
  template: 'use-spreadsheet/workbook',
  design: {
    font: 'Arial',
    cellFontSize: 16,
    largeFontSize: 17,
    gutter: 52,
    headerHeight: 34,
    rowHeight: 35,
    minRowHeight: 35,
    roomyWidth: 9999,
    wideWidth: 9999,
    parts: {
      title: (base) => (...args) => base(...args),
      navigation: (base) => (...args) => base(...args),
      ribbon: (base) => (...args) => base(...args),
      context: (base) => (...args) => base(...args),
      workspace: (base) => (...args) => base(...args),
      activity: (base) => (...args) => base(...args),
      bottom: (base, S) => (ctx, book) => {
        const bottom = base(ctx, book);
        for (const tab of bottom.querySelectorAll('.as-tab')) {
          if (tab.textContent !== S.spec.sheet && tab.textContent !== 'Summary') tab.hidden = true;
        }
        const zoom = bottom.querySelector('.as-saved');
        zoom.innerHTML = '<span aria-hidden="true">−</span><span>100%</span><span aria-hidden="true">+</span>';
        return bottom;
      },
      rendered: (base, S) => (ctx, book) => { base(ctx, book); document.__invoiceDetailsModel = () => S.ctx.model; document.__invoiceDetailsRefresh?.(); },
    },
  },
});
