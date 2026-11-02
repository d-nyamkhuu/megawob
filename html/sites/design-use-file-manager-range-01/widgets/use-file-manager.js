// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-range-01',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  template: 'use-file-manager/explorer',
  design: {
    parts: {
      toolbar(base, S) {
        return function (ctx) {
          base(ctx);
          const { util } = ctx;
          const { bar, crumbs, backBtn, upBtn, undoBtn, trashBtn } = S.els;
          const crumbRow = util.el('div', 'fm-ref-crumb-row', bar);
          const actionRow = util.el('div', 'fm-ref-actions', bar);
          const sampledDecoys = [...bar.querySelectorAll('[data-role="xtra"]')];
          actionRow.replaceChildren();
          crumbRow.append(backBtn, upBtn, crumbs);
          const actions = [
            ['＋', 'New'], ['↥', 'Upload'], ['▢', 'Copy'], ['✂', 'Cut'], ['▤', 'Paste'],
            ['▣', 'Delete'], ['✎', 'Rename'], ['•••', 'More'],
          ];
          for (const [icon, label] of actions) {
            if (label === 'Delete') {
              trashBtn.innerHTML = `<span class="fm-ref-action-icon">${icon}</span><span>${label}</span>`;
              trashBtn.classList.add('fm-ref-action');
              actionRow.append(trashBtn);
              continue;
            }
            const b = util.el('button', 'fm-ib fm-ref-action', actionRow);
            b.type = 'button';
            b.innerHTML = `<span class="fm-ref-action-icon">${icon}</span><span>${label}</span>`;
            b.dataset.role = 'xtra';
            b.addEventListener('click', () => ctx.log('decoy', { label }));
          }
          for (const b of sampledDecoys) actionRow.append(b);
          actionRow.append(undoBtn);
        };
      },
      sizes(base, S) {
        return function (ctx) {
          base(ctx);
          const { paneH } = S.geo;
          const task = env.taskDef.helpers;
          const empty = { names: {}, parent: {}, deleted: [] };
          const count = Math.max(1, ...S.spec.folders.map(folder =>
            task.childrenOf(empty, S.spec, folder.id).length));
          S.sizes = {
            ...S.sizes,
            rowH: Math.max(20, Math.min(48, Math.floor((paneH - 50) / count))),
            listCols: `minmax(0, 2fr) minmax(0, 1.3fr) minmax(52px, .8fr) minmax(0, 1.5fr)`,
          };
        };
      },
      buildMain(base, S) {
        return function (m) {
          const { ctx, P, spec } = S;
          const { pane, tileEls } = S.els;
          pane.replaceChildren();
          for (const k of Object.keys(tileEls)) delete tileEls[k];
          const task = env.taskDef.helpers;
          const order = task.display(m, spec, m.cwd);
          const groups = spec.grouped ? task.groups(m, spec, m.cwd) : [{ kind: 'all', label: '', ids: order }];
          if (!order.length) P.empty(m);
          P.listHead(m);
          for (const group of groups) {
            const box = P.group(m, group);
            box.classList.add('fm-ref-list');
            for (const id of group.ids) {
              const isFolder = task.isFolder(id);
              const row = P.row(m, id, box);
              row.dataset.id = id;
              row.title = P.itemName(m, id);
              if (isFolder) row.dataset.drop = `tile:${id}`;
              tileEls[id] = row;
              if (m.renaming === id) {
                const input = P.renameField(m, row);
                S.els.renameInput = input;
                P.bindRename(input);
              }
              P.item(ctx, row, id);
            }
          }
        };
      },
      listHead(base, S) {
        return function () {
          const { ctx } = S;
          const { pane } = S.els;
          const head = ctx.util.el('div', 'fm-lhead fm-ref-head', pane);
          head.style.gridTemplateColumns = S.sizes.listCols;
          for (const label of ['Name', 'Type', 'Size', 'Date modified']) ctx.util.el('span', '', head, label);
          return head;
        };
      },
      row(base, S) {
        return function (m, id, box) {
          const { ctx, P, sizes } = S;
          const fam = env.taskDef.helpers;
          const row = ctx.util.el('div', 'fm-row', box);
          row.style.gridTemplateColumns = sizes.listCols;
          row.style.height = `${sizes.rowH}px`;
          const name = ctx.util.el('div', 'nm', row);
          const icon = ctx.util.el('span', 'ic', name);
          icon.innerHTML = P.iconHtml(m, id, Math.min(24, sizes.rowH - 8));
          icon.style.display = 'inline-flex';
          const label = ctx.util.el('span', 'lab', name, P.itemName(m, id));
          row._label = label;
          row._icon = icon;
          const item = fam.itemOf(S.spec, id);
          ctx.util.el('span', 'dim', row, fam.isFolder(id)
            ? 'File folder' : (fam.KINDS[item.kind] || [item.kind, item.kind])[1]);
          ctx.util.el('span', 'dim', row, fam.isFolder(id) ? '—' : item.size);
          ctx.util.el('span', 'dim', row, fam.isFolder(id) ? '—' : P.fmtDate(item.date, ctx.content));
          return row;
        };
      },
    },
  },
});
