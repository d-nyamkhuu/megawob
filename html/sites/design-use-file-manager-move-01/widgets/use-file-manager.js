// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-move-01',
  name: 'design',
  split: 'train',
  scenarios: ['move'],
  template: 'use-file-manager/explorer',
  design: {
    parts: {
      tileSize(base, S) {
        return (model, groups) => {
          const sizes = base(model, groups);
          // This design displays one file per row, so fit that row count to the pane.
          const rows = Math.max(1, groups.reduce((n, group) => n + group.ids.length, 0));
          const headings = S.spec.grouped ? groups.length * 26 : 0;
          const tileH = Math.min(36, Math.floor((S.els.pane.clientHeight - 40 - headings) / rows));
          return { ...sizes, tileH };
        };
      },
      tile(base, S) {
        return (model, id, height, iconSize, lines, box) => {
          const tile = base(model, id, height, iconSize, lines, box);
          const task = env.taskDef.helpers;
          const item = task.itemOf(S.spec, id);
          const add = (cls, text) => {
            const cell = S.ctx.util.el('span', cls, tile, text);
            cell.style.minWidth = '0';
            cell.style.overflow = 'hidden';
            cell.style.textOverflow = 'ellipsis';
            cell.style.whiteSpace = 'nowrap';
          };
          add('fm-detail-date', task.isFolder(id) ? '—' : S.P.fmtDate(item.date, S.ctx.content));
          add('fm-detail-type', task.isFolder(id) ? 'File folder' : (task.KINDS[item.kind] || [item.kind, item.kind])[1]);
          add('fm-detail-size', task.isFolder(id) ? '' : item.size);
          return tile;
        };
      },
    },
  },
});
