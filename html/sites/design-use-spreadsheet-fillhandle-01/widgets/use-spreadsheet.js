// Design on the shared use-spreadsheet/workbook template.
env.widget({
  task: 'use-spreadsheet',
  site: 'design-use-spreadsheet-fillhandle-01',
  name: 'design',
  split: 'train',
  scenarios: ['fillhandle'],
  template: 'use-spreadsheet/workbook',
  design: {
    font: 'Arial', cellFontSize: 16, largeFontSize: 17,
    rowHeight: 32, minRowHeight: 24, headerHeight: 39, gutter: 67,
    columnWeights: [1.02, 1.16, .94, .95, .96, .96, .96, 1.56],
    parts: {
      title: (base) => base,
      navigation: (base) => base,
      ribbon: (base) => base,
      context: (base) => base,
      workspace: () => () => null,
      activity: () => () => null,
      bottom: () => () => null,
      formulaBar: (base, S) => (ctx, book) => {
        const pane = S.util.el('aside', 'as-formula-pane', book);
        const nameLabel = S.util.el('label', 'as-pane-label', pane, 'Cell');
        nameLabel.htmlFor = 'as-name-box';
        base(ctx, pane);
        const fbar = pane.querySelector('.as-fbar');
        const name = fbar.querySelector('.as-name');
        name.id = 'as-name-box';
        const commit = fbar.querySelector('[aria-label="commit"]') || fbar.querySelector('button');
        const fx = fbar.querySelector('.as-fx');
        const formula = fbar.querySelector('.as-formula');
        const formulaLabel = S.util.el('label', 'as-pane-label', pane, 'Formula');
        formulaLabel.htmlFor = formula.id || 'as-formula-box';
        formula.id = 'as-formula-box';
        pane.append(name, formulaLabel, formula);
        const actions = S.util.el('div', 'as-pane-actions', pane);
        if (commit) actions.append(commit);
        if (fx) actions.append(fx);
        const formatLabel = S.util.el('div', 'as-pane-label as-format-label', pane, 'Format');
        const format = S.util.el('div', 'as-pane-format', pane);
        const select = S.util.el('div', 'as-pane-select', format, 'General');
        S.util.el('span', '', select, '⌄');
        const row1 = S.util.el('div', 'as-pane-formatrow', format);
        for (const t of [['B', 'Bold'], ['I', 'Italic'], ['U', 'Underline'], ['A', 'Text color'], ['⌄', 'More colors']]) {
          const b = S.util.el('button', 'as-pane-tool', row1, t[0]); b.type = 'button'; b.title = t[1];
        }
        const row2 = S.util.el('div', 'as-pane-formatrow', format);
        for (const t of [['☰', 'Align left'], ['≡', 'Center'], ['☷', 'Align right'], ['▣', 'Borders'], ['⌄', 'More']]) {
          const b = S.util.el('button', 'as-pane-tool', row2, t[0]); b.type = 'button'; b.title = t[1];
        }
        const row3 = S.util.el('div', 'as-pane-formatrow', format);
        for (const t of [['$', 'Currency'], ['%', 'Percent'], [',', 'Thousands separator'], ['.0←', 'Decrease decimals'], ['.0→', 'Increase decimals']]) {
          const b = S.util.el('button', 'as-pane-tool', row3, t[0]); b.type = 'button'; b.title = t[1];
        }
        const legend = S.util.el('div', 'as-pane-legend', pane);
        for (const [cls, text] of [['cell', 'Selected cell'], ['range', 'Selected range'], ['handle', 'Fill handle']]) {
          const line = S.util.el('div', 'as-legend-line', legend);
          S.util.el('i', `as-legend-mark ${cls}`, line); S.util.el('span', '', line, text);
        }
        return pane;
      },
    },
  },
});
