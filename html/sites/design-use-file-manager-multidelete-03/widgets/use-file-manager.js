// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-multidelete-03',
  name: 'design',
  split: 'train',
  scenarios: ['multidelete'],
  template: 'use-file-manager/explorer',
  design: {
    fontSize: 15,
    nameFontSize: 15,
    detailFontSize: 14,
    windowRadius: 0,
    margin: 0,
    titleHeight: 0,
    toolbarHeight: 108,
    statusHeight: 34,
    tileGap: 0,
    treeIndent: 16,
    folderTone: '#e6b82e',
    listHeadings: ['Name', 'Date modified', 'Type', 'Size'],
    parts: {
      fit(base, S) {
        return (ctx) => {
          base(ctx);
          S.geo = {
            left: 0,
            top: 0,
            winW: Math.floor(ctx.size.width * 0.77),
            winH: ctx.size.height,
          };
        };
      },
      item(base) {
        return (ctx, tile, id) => {
          base(ctx, tile, id);
          const fam = env.taskDef.helpers;
          const folder = fam.isFolder(id);
          const item = fam.itemOf(ctx.spec, id);
          let date = '';
          if (item.date) {
            try { date = ctx.content.formatDate(item.date, 'en-US', 'medium'); }
            catch (e) { date = String(item.date); }
          }
          const kind = folder ? 'File folder' : ((fam.KINDS[item.kind] || [item.kind, item.kind])[1]
            .replace(/^./, (c) => c.toUpperCase()));
          const meta = (cls, value) => ctx.util.el('span', `fm-meta ${cls}`, tile, value);
          meta('date', date);
          meta('type', kind);
          meta('size', folder ? '' : item.size);
        };
      },
    },
  },
});
