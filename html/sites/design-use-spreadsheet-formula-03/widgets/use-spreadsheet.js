// Design on the shared use-spreadsheet/workbook template.
env.widget({
  task: 'use-spreadsheet',
  site: 'design-use-spreadsheet-formula-03',
  name: 'design',
  split: 'train',
  scenarios: ['formula'],
  template: 'use-spreadsheet/workbook',
  design: {
    font: 'Courier New',
    cellFontSize: 16,
    largeFontSize: 17,
    rowHeight: 28,
    headerHeight: 27,
    minRowHeight: 21,
    parts: {
      workspace: (base, S) => (ctx, workarea) => {
        const U = S.util, spec = S.spec, model = ctx.model;
        const panel = U.el('aside', 'as-workspace', workarea);
        const group = (title, rows) => {
          const box = U.el('section', 'risc-panel', panel);
          U.el('div', 'risc-panel-title', box, title);
          for (const [label, value] of rows) {
            const row = U.el('div', 'risc-stat', box);
            U.el('span', '', row, label); U.el('b', '', row, String(value));
          }
        };
        const cells = spec.cells || [];
        const numeric = cells.slice(1).flatMap((row) => row).filter((v) => typeof v === 'number');
        const columns = cells[0] ? cells[0].length : 7;
        const col = cells.slice(1).map((row) => row[2]).filter((v) => typeof v === 'number');
        const sum = col.reduce((a, b) => a + b, 0);
        const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const target = model.selection || [7, 6];
        const row = Number(target[0]) + 1, column = Number(target[1]) || 0;
        const address = `${String.fromCharCode(65 + column)}${row}`;
        const value = cells[target[0]] && cells[target[0]][target[1]];
        U.el('div', 'risc-side-title', panel, 'Sheet Information');
        const rowCount = (spec.n || cells.length - 1) + 1;
        const colLabel = String.fromCharCode(64 + columns);
        group('Workbook', [['Name:', spec.sheet || 'Sales'], ['Size:', `${rowCount} rows × ${columns} columns`], ['Active cell:', address], ['Cell value:', value ?? ''], ['Cell formula:', model.formulaDraft || '']]);
        group('Counts', [['Total cells:', numeric.length + cells.flat().filter((v) => typeof v === 'string' && v !== '').length + cells.flat().filter((v) => v === '').length], ['Numeric cells:', numeric.length], ['Text cells:', cells.flat().filter((v) => typeof v === 'string' && v !== '').length], ['Blank cells:', cells.flat().filter((v) => v === '').length]]);
        group('Data Range', [['Rows with data:', `${rowCount} (1–${rowCount})`], ['Columns with data:', `A–${colLabel}`]]);
        group('Value Summary (Column C)', [['Count:', col.length], ['Sum:', fmt(sum)], ['Average:', fmt(col.length ? sum / col.length : 0)], ['Minimum:', fmt(Math.min(...col))], ['Maximum:', fmt(Math.max(...col))]]);
        return panel;
      },
    },
  },
});
