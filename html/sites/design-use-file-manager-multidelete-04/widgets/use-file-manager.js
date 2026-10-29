// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-multidelete-04',
  name: 'design',
  split: 'train',
  scenarios: ['multidelete'],
  template: 'use-file-manager/explorer',
  design: {
    panel: '#fff', fg: '#183c67', line: '#d8e2ec', accent: '#0878d1', muted: '#657b98',
    fontSize: 16, nameFontSize: 16, detailFontSize: 15, controlFont: '14px Arial, sans-serif',
    windowRadius: 5, margin: 16, titleHeight: 0, toolbarHeight: 66, statusHeight: 48,
    treeIndent: 20, folderTone: '#4e9dd5', listHeadings: ['Name', 'Type', 'Size', 'Modified'],
    lightsChance: 0,
    parts: {
      fit(base, S) {
        return (ctx) => {
          base(ctx);
          const g = S.geo;
          S.geo = { ...g, left: 16, top: 16, winW: g.fullW, winH: g.fullH };
        };
      },
      paneSize(base, S) {
        return (ctx) => {
          base(ctx);
          const g = S.geo;
          const treeW = Math.min(280, Math.max(210, Math.round(g.winW * 0.22)));
          S.geo = { ...g, treeW, paneW: g.winW - treeW - 3 };
        };
      },
      sizes(base, S) {
        return (ctx) => {
          base(ctx);
          S.sizes = { ...S.sizes, listCols: '34px minmax(0, 1fr) 19% 14% 22%' };
        };
      },
      buildMain(_base, S) {
        return (model) => {
          const { pane, tileEls } = S.els;
          pane.replaceChildren();
          for (const k of Object.keys(tileEls)) delete tileEls[k];
          const order = env.taskDef.helpers.display(model, S.spec, model.cwd);
          const groups = S.spec.grouped ? env.taskDef.helpers.groups(model, S.spec, model.cwd) : [{ kind: 'all', label: '', ids: order }];
          if (!order.length) S.P.empty(model);
          S.P.listHead(model);
          for (const group of groups) {
            const box = S.ctx.util.el('div', 'fm-listbox', pane);
            box.dataset.kind = group.kind;
            for (const id of group.ids) {
              const row = S.P.row(model, id, box);
              row.dataset.id = id;
              row.title = S.P.itemName(model, id);
              if (env.taskDef.helpers.isFolder(id)) row.dataset.drop = `tile:${id}`;
              tileEls[id] = row;
              if (model.renaming === id) {
                const input = S.P.renameField(model, row);
                S.els.renameInput = input;
                S.P.bindRename(input);
              }
              S.P.item(S.ctx, row, id);
            }
          }
        };
      },
      row(_base, S) {
        return (model, id, box) => {
          const { util, spec, content } = S.ctx;
          const task = env.taskDef.helpers;
          const item = task.itemOf(spec, id);
          const folder = task.isFolder(id);
          const row = util.el('div', 'fm-row', box);
          row.style.gridTemplateColumns = S.sizes.listCols;
          row.style.height = S.sizes.rowH + 'px';
          util.el('span', 'fm-check', row);
          const name = util.el('div', 'nm', row);
          const icon = util.el('span', 'ic', name);
          icon.innerHTML = S.P.iconHtml(model, id, 22);
          icon.style.display = 'inline-flex';
          const label = util.el('span', 'lab', name, S.P.itemName(model, id));
          row._label = label;
          row._icon = icon;
          util.el('span', 'dim', row, folder ? 'Folder' : (task.KINDS[item.kind] || [item.kind, item.kind])[1]);
          util.el('span', 'dim', row, folder ? '—' : item.size);
          util.el('span', 'dim', row, folder ? '' : S.P.fmtDate(item.date, content));
          return row;
        };
      },
      listHead(_base, S) {
        return () => {
          const head = S.ctx.util.el('div', 'fm-lhead', S.els.pane);
          head.style.gridTemplateColumns = S.sizes.listCols;
          S.ctx.util.el('span', 'fm-check fm-check-all', head);
          for (const label of ['Name', 'Type', 'Size', 'Modified']) S.ctx.util.el('span', '', head, label);
        };
      },
    },
  },
});
