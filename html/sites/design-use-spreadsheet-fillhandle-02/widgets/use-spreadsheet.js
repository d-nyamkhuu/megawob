// Design on the shared use-spreadsheet/workbook template.
env.widget({
  task: 'use-spreadsheet',
  site: 'design-use-spreadsheet-fillhandle-02',
  name: 'design',
  split: 'train',
  scenarios: ['fillhandle'],
  template: 'use-spreadsheet/workbook',
  design: {
    font: 'Arial',
    cellFontSize: 16,
    largeFontSize: 16,
    gutter: 48,
    headerHeight: 31,
    rowHeight: 33,
    minRowHeight: 28,
    scrollbarWidth: 14,
    columnWeights: [1.2, 1.0, 1.0, 1.0, 1.0, 1.0, 1.2, 1.65],
    parts: {
      workspace: (base, S) => () => null,
      activity: (base, S) => (ctx, workarea) => {
        const U = ctx.util;
        const panel = U.el('aside', 'as-activity as-inspector', workarea);
        const section = (title) => {
          const block = U.el('section', 'as-inspector-section', panel);
          U.el('h3', '', block, title);
          return block;
        };
        const format = section('Format');
        const select = (label, value) => {
          const row = U.el('div', 'as-inspector-row', format);
          U.el('span', '', row, label);
          const control = U.el('button', 'as-inspector-select', row, value + '  ⌄');
          control.type = 'button';
        };
        select('Format', 'Number');
        select('Decimal places', '0');
        const check = (parent, text, checked) => {
          const row = U.el('div', 'as-inspector-check', parent);
          const box = U.el('span', checked ? 'checked' : '', row);
          U.el('span', '', row, text);
          return box;
        };
        check(format, 'Use 1000 separator (,)', true);
        const align = section('Alignment');
        for (const [title, choices] of [['Horizontal', ['☰', '☷', '☰']], ['Vertical', ['↥', '↕', '↧']]]) {
          const row = U.el('div', 'as-inspector-row', align);
          U.el('span', '', row, title);
          const buttons = U.el('div', 'as-inspector-buttons', row);
          choices.forEach((v, i) => U.el('span', i === 0 ? 'active' : '', buttons, v));
        }
        check(align, 'Wrap text', true);
        check(align, 'Merge cells', false);
        const style = section('Cell Style');
        const colors = U.el('div', 'as-inspector-colors', style);
        for (const [label, color] of [['Fill color', '#ffffff'], ['Text color', '#111111']]) {
          const item = U.el('div', '', colors);
          U.el('span', '', item, label);
          const swatch = U.el('i', '', item); swatch.style.background = color;
        }
        const data = section('Data');
        check(data, 'Locked', false);
        check(data, 'Visible', true);
        return panel;
      },
    },
  },
});
