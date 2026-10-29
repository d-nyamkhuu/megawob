// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-move-02',
  name: 'design',
  split: 'train',
  scenarios: ['move'],
  template: 'use-file-manager/explorer',
  design: {
      fontSize: 16,
      nameFontSize: 16,
      detailFontSize: 15,
      windowRadius: 0,
      margin: 0,
      titleHeight: 0,
      toolbarHeight: 82,
      statusHeight: 0,
      treeIndent: 20,
      folderTone: '#5fa5f5',
      listHeadings: ['Name', 'Type', 'Size', 'Modified'],
    parts: {
      fit(base, S) {
        return (ctx) => {
          base(ctx);
          S.geo = { left: 0, top: 0, winW: ctx.size.width, winH: ctx.size.height };
        };
      },
      paneSize(base, S) {
        return (ctx) => {
          base(ctx);
          const treeW = Math.round(S.geo.winW * 0.22);
          S.geo = { treeW, paneW: S.geo.winW - treeW - 3 };
        };
      },
      body(base, S) {
        return (ctx) => {
          base(ctx);
          S.els.tree.style.padding = '14px 8px';
          S.els.pane.style.padding = '0 12px';
          S.els.pane.style.overflow = 'auto';
        };
      },
      title(base, S) {
        return (ctx) => {
          base(ctx);
          S.els.title.style.overflow = 'hidden';
          S.els.title.style.border = '0';
        };
      },
      status(base, S) {
        return (ctx) => {
          base(ctx);
          S.els.status.style.display = 'none';
        };
      },
      sizes(base, S) {
        return (ctx) => {
          base(ctx);
          S.sizes = { treeRowH: Math.min(28, Math.floor((S.geo.paneH - 28) / S.spec.folders.length)) };
        };
      },
      group(base, S) {
        return (model, group) => {
          const box = base(model, group);
          box.style.display = 'block';
          box.style.padding = '0';
          return box;
        };
      },
      buildMain(base, S) {
        return (model) => {
          const { ctx, spec, P } = S;
          const { pane, tileEls } = S.els;
          pane.replaceChildren();
          for (const key of Object.keys(tileEls)) delete tileEls[key];
          const order = env.taskDef.helpers.display(model, spec, model.cwd);
          const groups = spec.grouped ? env.taskDef.helpers.groups(model, spec, model.cwd)
            : [{ kind: 'all', label: '', ids: order }];
          // Details rows must fit the measured pane, including headings and space for Paste.
          const headings = spec.grouped ? groups.length * 26 : 0;
          S.sizes = { rowH: Math.min(54, Math.floor((S.geo.paneH - 48 - headings - 16) / Math.max(1, order.length))) };
          S.els.renameInput = null;
          if (!order.length) P.empty(model);
          P.listHead(model);
          for (const group of groups) {
            const box = P.group(model, group);
            for (const id of group.ids) {
              const item = P.row(model, id, box);
              item.dataset.id = id;
              item.title = P.itemName(model, id);
              if (env.taskDef.helpers.isFolder(id)) item.dataset.drop = `tile:${id}`;
              tileEls[id] = item;
              if (model.renaming === id) {
                const input = P.renameField(model, item);
                S.els.renameInput = input;
                P.bindRename(input);
              }
              P.item(ctx, item, id);
            }
          }
        };
      },
      row(base, S) {
        return (m, id, box) => {
          const { ctx, spec, P } = S;
          const util = ctx.util;
          const t = util.el('div', 'fm-row', box);
          t.style.gridTemplateColumns = 'minmax(0, 1fr) 21% 15% 22%';
          t.style.height = `${S.sizes.rowH}px`;
          t.style.padding = '0 12px';
          const nm = util.el('div', 'nm', t);
          nm.style.gap = '16px';
          const ic = util.el('span', 'ic', nm);
          ic.innerHTML = P.iconHtml(m, id, Math.min(34, S.sizes.rowH - 6));
          ic.style.display = 'inline-flex';
          const lab = util.el('span', 'lab', nm, P.itemName(m, id));
          t._label = lab;
          t._icon = ic;
          const it = env.taskDef.helpers.itemOf(spec, id);
          util.el('span', 'dim', t, env.taskDef.helpers.isFolder(id) ? 'Folder'
            : (env.taskDef.helpers.KINDS[it.kind] || [it.kind, it.kind])[1].replace(/^./, c => c.toUpperCase()));
          util.el('span', 'dim', t, env.taskDef.helpers.isFolder(id) ? '—' : it.size);
          util.el('span', 'dim', t, env.taskDef.helpers.isFolder(id) ? '' : P.fmtDate(it.date, ctx.content));
          return t;
        };
      },
      listHead(base, S) {
        return (model) => {
          const { ctx, P, D } = S;
          const head = ctx.util.el('div', 'fm-lhead', S.els.pane);
          head.style.gridTemplateColumns = 'minmax(0, 1fr) 21% 15% 22%';
          head.style.height = '48px';
          for (const title of D.listHeadings) ctx.util.el('span', '', head, title);
          return head;
        };
      },
    },
  },
});
