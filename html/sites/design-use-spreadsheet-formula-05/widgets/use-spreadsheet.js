// Design on the shared use-spreadsheet/workbook template.
env.widget({
  task: 'use-spreadsheet',
  site: 'design-use-spreadsheet-formula-05',
  name: 'design',
  split: 'train',
  scenarios: ['formula'],
  template: 'use-spreadsheet/workbook',
  design: {
    parts: {
      activity: (base, S) => (ctx, workarea) => {
        const panel = ctx.util.el('aside', 'as-activity metro-inspector', workarea);
        const [row, col] = ctx.model.selection;
        const address = `${String.fromCharCode(65 + col)}${row}`;
        const raw = ctx.model.cells[row]?.[col];
        ctx.util.el('div', 'metro-inspector-title', panel, 'Cell Properties');
        const group = (title, rows) => {
          ctx.util.el('h3', 'metro-section-title', panel, title);
          for (const [label, value] of rows) {
            const row = ctx.util.el('div', 'metro-prop-row', panel);
            ctx.util.el('span', '', row, label);
            const field = ctx.util.el('div', 'metro-prop-field', row, value);
          }
        };
        group('General', [['Address', address], ['Value', typeof raw === 'number' ? String(raw) : ''], ['Formula', typeof raw === 'string' && raw.startsWith('=') ? raw : ''], ['Data Type', 'General']]);
        group('Formatting', [['Number Format', 'General'], ['Decimal Places', '2'], ['☑  Use 1000 Separator (,)', ''], ['□  Show Negative Numbers in Red', '']]);
        group('Alignment', [['Horizontal', 'General'], ['Vertical', 'Bottom'], ['□  Wrap Text', '']]);
        group('Fill and Border', [['Fill Color', ''], ['Border', 'No Border']]);
        return panel;
      },
    },
  },
});
