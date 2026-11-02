// Design on the shared use-spreadsheet/workbook template.
env.widget({
  task: 'use-spreadsheet',
  site: 'design-use-spreadsheet-range-03',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  template: 'use-spreadsheet/workbook',
  design: {
    font: 'Tahoma',
    alternateFont: 'Tahoma',
    cellFontSize: 16,
    largeFontSize: 17,
    rowHeight: 27,
    minRowHeight: 24,
    headerHeight: 27,
    columnWeights: [1.15, 1.83, 1.17, 1.1, 1.22, 1.24, .99, 1.35],
    roomyWidth: 9999,
    wideWidth: 9999,
    parts: {
      title: (base, S) => (ctx, book) => {
        const u = S.util;
        const banner = u.el('div', 'as-title as-report', book);
        const mark = u.el('div', 'as-report-mark', banner);
        for (let i = 0; i < 3; i++) u.el('i', '', mark);
        const title = u.el('div', 'as-report-heading', banner);
        u.el('b', '', title, 'Sales Report');
        u.el('span', '', title, 'Northwind Traders');
        const summary = u.el('div', 'as-report-summary', banner);
        u.el('b', '', summary, 'Summary');
        for (const [label, value] of [['Total Records:', '36'], ['Total Sales:', '$286,840'], ['Average Sale:', '$7,968']]) {
          const row = u.el('div', '', summary);
          u.el('span', '', row, label);
          u.el('strong', '', row, value);
        }
        return banner;
      },
      navigation: (base, S) => (ctx, book) => {
        const nav = S.util.el('div', 'as-nav as-xp-tabs', book);
        for (const [label, active] of [['Home', false], ['Workbook', true], ['Charts', false], ['Data', false], ['Review', false]]) {
          const tab = S.util.el('span', active ? 'active' : '', nav, label);
          tab.setAttribute('aria-current', active ? 'page' : 'false');
        }
        return nav;
      },
      workspace: (base) => () => null,
      activity: (base) => () => null,
    },
  },
});
