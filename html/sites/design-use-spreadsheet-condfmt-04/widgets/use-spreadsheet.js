// Design on the shared use-spreadsheet/workbook template.
env.widget({
  task: 'use-spreadsheet',
  site: 'design-use-spreadsheet-condfmt-04',
  name: 'design',
  split: 'train',
  scenarios: ['condfmt'],
  template: 'use-spreadsheet/workbook',
  design: {
    font: 'Arial',
    cellFontSize: 14,
    largeFontSize: 14,
    rowHeight: 20,
    minRowHeight: 19,
    headerHeight: 22,
    gutter: 36,
    shortHeight: 360,
    roomyWidth: 9999,
    wideWidth: 99999,
    parts: {
      ribbon: (base, S) => (ctx, book) => {
        const tools = S.util.el('div', 'as-tools as-tools-empty', book);
        S.P.clipboard(tools);
        S.P.fontTools(tools);
        S.P.numberTools(tools);
        S.P.formatTools(tools);
        tools.hidden = true;
        return tools;
      },
      formulaBar: (base, S) => (ctx, book) => {
        base(ctx, book);
        const cellLabel = S.util.el('span', 'as-cell-label', S.formula.parentElement, 'Cell:');
        S.formula.parentElement.insertBefore(cellLabel, S.nameBox);
        const button = S.P.button(S.formula.parentElement, 'Conditional Formatting…', 'condfmt', () => {
          const m = S.util.clone(ctx.model); m.dialog = true; m.menu = null;
          m.draft = m.rule ? { ...S.util.clone(m.rule), range: S.task.helpers.rangeName(m.rule.range), threshold: String(m.rule.threshold) }
            : { range: S.task.helpers.rangeName(ctx.model.selection), op: '>', threshold: '', color: 'red' };
          S.P.update(m);
        }, 'as-condfmt');
        S.P.icon(button, 'paint', 14);
      },
      navigation: (base, S) => (ctx, book) => S.util.el('div', 'as-nav as-nav-empty', book),
    },
  },
});
