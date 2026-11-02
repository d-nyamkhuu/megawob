// Adds record headers, a compact grid font, and the original long-table fitting behavior.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-table-03',
  name: 'design',
  split: 'train',
  scenarios: ['table'],
  answerReply: true,
  template: 'find-fact/table',
  design: {
    recordHeader: ['Field', 'Value'],
    parts: {
      table: (base, S) => (ctx, t, body) => {
        const { spec } = ctx;
        if (spec.kind === 'grid') {
          const longValues = spec.rows.some((row) => row.some((value) => String(value).length > 11));
          t.style.setProperty('--rl-table-fs', Math.min(longValues ? 2.7 : 3.1, 20 / spec.rows.length) + 'vh');
        }
        return base(ctx, t, body);
      },
      answerForm: (base, S) => (ctx, parent, labels, model, onEdit) => {
        const fields = base(ctx, parent, labels, model, onEdit);
        const form = parent.lastElementChild;
        form.dataset.fields = String(fields.length);
        const note = document.querySelector('.ds-header-note');
        if (note) form.insertBefore(note, form.firstChild);
        return fields;
      },
      fit: (base, S) => (ctx, B) => {
        base(ctx, B);
        const { spec } = ctx;
        const { tc, t, body } = B;
        const availableHeight = tc.getBoundingClientRect().bottom - t.getBoundingClientRect().top
          - parseFloat(getComputedStyle(tc).paddingBottom);
        t.style.height = Math.min(t.getBoundingClientRect().height, availableHeight) + 'px';
        if (spec.kind === 'grid' && (t.getBoundingClientRect().width > body.clientWidth + 1
          || t.getBoundingClientRect().height > availableHeight + 1)) {
          t.classList.add('wrap');
          const weights = spec.columns.map((column, i) => 3 + Math.max(9, String(column).length * 1.45,
            ...spec.rows.map((row) => String(row[i]).length)));
          const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
          const cols = ctx.util.el('colgroup', '', t);
          weights.forEach((weight) => { ctx.util.el('col', '', cols).style.width = (100 * weight / totalWeight) + '%'; });
          t.insertBefore(cols, t.firstChild);
          const initialFont = parseFloat(getComputedStyle(t.querySelector('td')).fontSize);
          for (let font = initialFont; font >= 12; font -= 0.5) {
            t.style.setProperty('--rl-table-fs', font + 'px');
            if (t.getBoundingClientRect().height <= availableHeight + 1) break;
          }
        }
      },
    },
  },
});
