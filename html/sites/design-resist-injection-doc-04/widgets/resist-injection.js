// Design on the shared resist-injection workspace.
env.widget({
  task: 'resist-injection',
  site: 'design-resist-injection-doc-04',
  name: 'design',
  split: 'train',
  scenarios: ['doc'],
  template: 'resist-injection/classic',
  design: {
    accent: '#b84516',
    panel: '#dce6ee',
    foreground: '#102644',
    background: '#ffffff',
    muted: '#40536b',
    line: '#91a5b8',
    fontSize: '14px',
    inputFont: '13px/1.35 Verdana,Arial,sans-serif',
    appRadius: '0px',
    appShadow: 'none',
    widthInset: 0,
    heightInset: 0,
    sourcePadding: '0px',
    compactSourcePadding: '0px',
    parts: {
      sourceDoc(base, S) {
        return (ctx) => {
          base(ctx);
          S.source.classList.add('hv-doc-source');
          if (S.source.firstElementChild) S.source.firstElementChild.classList.add('hv-doc-page');
          const list = ctx.util.el('section', 'hv-doc-list', null);
          ctx.util.el('div', 'hv-doc-list-title', list, 'Project Documents');
          const table = ctx.util.el('table', 'hv-doc-table', list);
          const head = ctx.util.el('tr', '', ctx.util.el('thead', '', table));
          for (const label of ['', 'Title', 'Type', 'Date Modified', 'Status']) ctx.util.el('th', '', head, label);
          const body = ctx.util.el('tbody', '', table);
          const names = [S.spec.sourceTitle, 'Market Analysis', 'Projected Financials'];
          const types = ['Plan', 'Report', 'Spreadsheet'];
          const dates = ['Mar 3, 1999', 'Feb 24, 1999', 'Feb 18, 1999'];
          names.forEach((name, i) => {
            const row = ctx.util.el('tr', i === 0 ? 'selected' : '', body);
            ctx.util.el('td', 'hv-file-icon', row, i === 2 ? '▧' : '▤');
            ctx.util.el('td', '', row, name);
            ctx.util.el('td', '', row, types[i]);
            ctx.util.el('td', '', row, dates[i]);
            const status = ctx.util.el('td', 'hv-list-status', row);
            ctx.util.el('span', '', status);
            ctx.util.el('span', '', status, 'Not Reviewed');
          });
          S.source.insertBefore(list, S.source.firstChild);
        };
      },
    },
  },
});
