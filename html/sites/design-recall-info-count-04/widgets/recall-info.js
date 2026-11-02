// Design on recall-info/classic; defaults preserve the scaffolded base widget.
env.widget({
  task: 'recall-info',
  site: 'design-recall-info-count-04',
  name: 'design',
  split: 'train',
  scenarios: ['count'],
  template: 'recall-info/classic',
  design: {
    width: 10000,
    maxHeight: 10000,
    rowHeight: 46,
    parts: {
      build: (base) => (ctx, work, app) => {
        // Measuring the initial viewport is setup, not scrolling progress.
        // Keep the template's patch path active for every later interaction.
        let ready = false;
        const viewCtx = Object.create(ctx, {
          patch: {
            value: (change) => {
              if (ready) ctx.patch(change);
            },
          },
        });
        const view = base(viewCtx, work, app);
        ready = true;
        return view;
      },
      work: (base) => (ctx, app) => {
        const work = base(ctx, app);
        const el = env.util.el;
        const rows = ctx.spec.rows || [];
        const cols = ctx.spec.cols || [];
        const side = el('section', 'fluent-record-pane', work);
        el('h2', 'fluent-pane-title', side, ctx.spec.title || 'Orders');
        const search = el('div', 'fluent-search', side);
        el('span', '', search, '⌕');
        el('span', 'fluent-search-text', search, `Search ${String(ctx.spec.title || 'records').toLowerCase()}...`);
        const table = el('div', 'fluent-record-table', side);
        const grid = `36px repeat(${Math.max(1, cols.length - 1)}, minmax(0, 1fr))`;
        const head = el('div', 'fluent-record-head', table);
        head.style.gridTemplateColumns = grid;
        ['', ...cols.slice(1)].forEach((label, i) => el('span', '', head, i === 0 ? '#' : label));
        const list = el('div', 'fluent-record-list', table);
        rows.forEach((row, i) => {
          const line = el('div', `fluent-record-row${i === 3 ? ' selected' : ''}`, list);
          line.style.gridTemplateColumns = grid;
          el('span', 'fluent-record-number', line, String(i + 1));
          row.slice(1).forEach((value) => el('span', '', line, String(value)));
        });
        const detail = el('section', 'fluent-record-detail', side);
        const selected = rows[Math.min(3, Math.max(0, rows.length - 1))] || [];
        el('h3', 'fluent-detail-title', detail, `${ctx.spec.title || 'Record'} #${selected[0] || ''}`);
        const fields = el('div', 'fluent-detail-fields', detail);
        cols.slice(1).forEach((label, i) => {
          const field = el('div', 'fluent-detail-field', fields);
          el('span', 'fluent-detail-label', field, label);
          el('span', 'fluent-detail-value', field, String(selected[i + 1] ?? '—'));
        });
        return work;
      },
    },
  },
});
