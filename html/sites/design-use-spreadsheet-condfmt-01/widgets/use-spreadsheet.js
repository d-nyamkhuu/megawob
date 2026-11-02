// Design on the shared use-spreadsheet/workbook template.
env.widget({
  task: 'use-spreadsheet',
  site: 'design-use-spreadsheet-condfmt-01',
  name: 'design',
  split: 'train',
  scenarios: ['condfmt'],
  template: 'use-spreadsheet/workbook',
  design: {
    renderer: 'classic',
    font: 'Georgia', alternateFont: 'Georgia',
    cellFontSize: 15, largeFontSize: 16,
    canvasAccent: '#6c795b', errorColor: '#a34d3f',
    colors: { red: ['#f3dfd8', '#7c352c'], green: ['#e1e7d9', '#394b32'], blue: ['#dce8f4', '#294e78'] },
    shortHeight: 300, roomyWidth: 900, wideWidth: 1600, compactWidth: 600,
    gutter: 56, headerHeight: 34, rowHeight: 31, minRowHeight: 20, scrollbarWidth: 13,
    columnWeights: [1.05, 1.0, 1.12, 1.05, 1.05, 1.05, 1.1, .01],
    parts: {
      title: (base, S) => (ctx, book) => {
        const h = S.util.el('div', 'as-title quiet-title', book);
        const heading = S.util.el('div', 'as-heading', h);
        S.util.el('b', '', heading, 'Sales Data');
        const report = S.util.el('button', 'quiet-report', h, 'Q1 Report  ⌄');
        report.type = 'button'; report.addEventListener('click', () => S.P.info('Q1 Report', 'Quarterly sales worksheet.'));
        return h;
      },
      navigation: (base, S) => (ctx, book) => {
        const nav = S.util.el('div', 'as-nav quiet-hidden', book);
        return nav;
      },
      ribbon: (base) => (ctx, book) => {
        const tools = base(ctx, book);
        tools.classList.add('quiet-toolbar');
        // The side navigation and task panel can make a wide window's sheet narrow.
        // Reserve a separate toolbar row using the stage's actual available width.
        const width = ctx.size.width ?? ctx.size.w;
        if (width < 1100) {
          tools.dataset.compact = 'true';
          Object.assign(tools.style, { left: '9px', right: '9px', flexWrap: 'wrap', height: 'auto', minHeight: '42px' });
        }
        return tools;
      },
      context: (base) => (ctx, book) => { const e = base(ctx, book); e.classList.add('quiet-hidden'); return e; },
      workarea: (base, S) => (ctx, book) => {
        const area = S.util.el('div', 'as-workarea quiet-workarea', book);
        const tools = book.querySelector('.quiet-toolbar');
        if (tools.dataset.compact === 'true') {
          const formula = book.querySelector('.as-fbar');
          Object.assign(formula.style, { left: '9px', right: '9px' });
          tools.style.top = `${formula.offsetTop + formula.offsetHeight + 1}px`;
          area.style.top = `${tools.offsetTop + tools.offsetHeight + 6}px`;
        }
        return area;
      },
      workspace: (base, S) => () => null,
      activity: (base, S) => () => null,
      bottom: (base, S) => (ctx, book) => {
        const bottom = S.util.el('div', 'as-bottom quiet-bottom', book);
        S.P.button(bottom, '', 'Sheet list', () => S.P.info('Sheets', 'Workbook sheets.'), '', 'list');
        S.P.sheetTab(bottom, 'Sales');
        S.P.button(bottom, '', 'Add sheet', () => S.P.info('New sheet', 'New worksheets are managed by workbook owners.'), '', 'plus');
        return bottom;
      },
      status: (base, S) => (ctx, book) => {
        const status = S.util.el('div', 'as-status quiet-status', book);
        S.ready = S.util.el('span', '', status, 'Ready');
        S.count = S.util.el('span', '', status);
        S.sum = S.util.el('span', '', status);
        S.records = S.util.el('span', '', status);
        S.total = S.util.el('span', 'as-total', status);
        S.P.icon(S.util.el('span', 'as-statusmark', status), 'check', 11);
        return status;
      },
    },
  },
});
