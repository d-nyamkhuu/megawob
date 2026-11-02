// Design on the shared use-spreadsheet/workbook template.
env.widget({
  task: 'use-spreadsheet',
  site: 'design-use-spreadsheet-sort-02',
  name: 'design',
  split: 'train',
  scenarios: ['sort'],
  template: 'use-spreadsheet/workbook',
  design: {
    font: 'Arial', cellFontSize: 14, rowHeight: 33, headerHeight: 37,
    gutter: 48, columnWeights: [1.2, 1.25, 1.25, 1, 1, 1.15, .7, .7],
    colors: { red: ['#fce3e3', '#852828'], green: ['#daf1e2', '#195a36'], blue: ['#dfebff', '#214d8c'] },
    parts: {
      rendered(base, S) {
        return (ctx, book) => {
          base(ctx, book);
          const q = (sel) => book.querySelector(sel);
          const title = q('.as-title'), nav = q('.as-nav'), ribbon = q('.as-tools');
          const context = q('.as-context'), workarea = q('.as-workarea');
          const grid = q('.as-grid'), formula = q('.as-fbar'), bottom = q('.as-bottom'), status = q('.as-status');
          [title, nav, ribbon, context, bottom].forEach((e) => { if (e) e.hidden = true; });
          const workspace = q('.as-workspace'), activity = q('.as-activity');
          if (workspace) workspace.hidden = true;
          if (activity) activity.hidden = true;
          const upper = S.util.el('div', 'risograph-sheet-upper', book);
          const right = S.util.el('aside', 'risograph-sheet-inspector', upper);
          const area = S.util.el('div', 'risograph-sheet-gridarea', upper);
          area.append(workarea, status);
          const fbox = S.util.el('section', 'risograph-formula', right);
          S.util.el('h3', '', fbox, 'Formula'); fbox.append(formula);
          const tools = S.util.el('section', 'risograph-sheet-controls', right);
          S.util.el('h3', '', tools, 'Worksheet Controls');
          const labels = [['▦', 'Insert'], ['▤', 'Delete'], ['A↧', 'Sort'], ['▽', 'Filter'], ['✎', 'Format'], ['•••', 'More']];
          const gridTools = S.util.el('div', 'risograph-control-grid', tools);
          labels.forEach(([icon, label]) => {
            const b = S.util.el('button', '', gridTools); b.type = 'button';
            S.util.el('strong', '', b, icon); S.util.el('span', '', b, label);
            if (label === 'Sort' || label === 'Filter') b.addEventListener('click', () =>
              S.P.update({ ...ctx.model, menu: { col: ctx.model.selection[1] } }));
          });
          const formatting = S.util.el('section', 'risograph-formatting', right);
          S.util.el('h3', '', formatting, 'Formatting');
          S.util.el('label', '', formatting, 'Font');
          const fontrow = S.util.el('div', 'risograph-format-row', formatting);
          S.util.el('div', '', fontrow, 'Arial'); S.util.el('div', '', fontrow, '11⌄');
          S.util.el('div', 'risograph-format-icons', formatting, 'B　 I　 U　 A⌄');
          S.util.el('div', 'risograph-format-icons', formatting, '☰　☷　☰　▤');
          const details = S.util.el('section', 'risograph-row-details', book);
          S.util.el('h2', '', details, 'Row Details');
          const fields = S.util.el('div', 'risograph-detail-fields', details);
          const row = ctx.spec.cells[1] || [];
          ['Item', 'Category', 'Supplier', 'Unit Price', 'In Stock', 'Total Value'].forEach((label, i) => {
            const f = S.util.el('label', '', fields, label);
            const input = S.util.el('input', '', f, String(row[i] == null ? '' : row[i]));
            input.value = String(row[i] == null ? '' : row[i]); input.readOnly = true;
          });
          book.classList.add('risograph-workbook');
          S.P.draw(ctx.model);
        };
      },
    },
  },
});
