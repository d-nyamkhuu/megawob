// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-copy-02',
  name: 'design',
  split: 'train',
  scenarios: ['copy'],
  template: 'use-file-manager/explorer',
  design: {
    parts: {
      paneSize(base, S) { return (ctx) => {
        base(ctx);
        // Reserve a right-hand Motif properties pane; keep the template's original sizing draw.
        S.geo = { ...S.geo, paneW: Math.round(S.geo.paneW * 0.73) };
      }; },
      body(base, S) { return (ctx) => {
        base(ctx);
        const { util, model, spec } = ctx;
        const detail = util.el('aside', 'fm-details', S.els.bodyEl);
        detail.dataset.role = 'item-summary';
        const selected = model.selected && model.selected[0];
        const item = selected && !env.taskDef.helpers.isFolder(selected) ? env.taskDef.helpers.itemOf(spec, selected) : null;
        const name = selected ? S.P.itemName(model, selected) : 'Item information';
        const folder = selected && env.taskDef.helpers.isFolder(selected);
        const icon = util.el('div', 'fm-detail-icon', detail);
        icon.innerHTML = selected ? S.P.iconHtml(model, selected, 84) : S.P.folderSvg(84);
        util.el('strong', 'fm-detail-name', detail, name);
        const line = (label, value) => {
          const row = util.el('div', 'fm-detail-line', detail);
          util.el('span', '', row, `${label}:`);
          util.el('span', '', row, value);
        };
        line('Type', selected ? folder ? 'Folder' : (env.taskDef.helpers.KINDS[item.kind] || [item.kind, item.kind])[1] : '—');
        line('Location', spec.folders.find((f) => f.id === model.cwd)?.name || '/');
        if (item) {
          line('Size', `${item.size} KB`);
          line('Modified', S.P.fmtDate(item.date, ctx.content));
        }
        S.els.details = detail;
      }; },
      toolbar(base, S) { return (ctx) => {
        base(ctx);
        const icons = [
          ['Forward', '→'], ['Cut', '✂'], ['Copy', '▤'], ['Paste', '▣'],
        ];
        for (const [label, glyph] of icons) {
          const button = ctx.util.el('button', 'fm-ib fm-motif-extra', S.els.bar);
          button.type = 'button';
          button.disabled = true;
          button.title = label;
          button.setAttribute('aria-label', label);
          ctx.util.el('span', 'fm-motif-glyph', button, glyph);
          ctx.util.el('span', '', button, label);
          S.els.bar.insertBefore(button, S.els.crumbs);
        }
      }; },
      buildMain(base, S) { return (m) => {
        const view = S.spec.view;
        S.spec.view = 'list';
        try { base(m); } finally { S.spec.view = view; }
      }; },
      row(base, S) { return (m, id, box) => {
        const t = S.ctx.util.el('div', 'fm-row', box);
        t.style.gridTemplateColumns = S.sizes.listCols;
        t.style.height = `${S.sizes.rowH}px`;
        const nm = S.ctx.util.el('div', 'nm', t);
        const ic = S.ctx.util.el('span', 'ic', nm);
        ic.innerHTML = S.P.iconHtml(m, id, Math.min(22, S.sizes.rowH - 5));
        ic.style.display = 'inline-flex';
        const lab = S.ctx.util.el('span', 'lab', nm, S.P.itemName(m, id));
        t._label = lab;
        t._icon = ic;
        const it = env.taskDef.helpers.itemOf(S.spec, id);
        S.ctx.util.el('span', 'dim', t, env.taskDef.helpers.isFolder(id) ? '—' : it.size);
        S.ctx.util.el('span', 'dim', t, env.taskDef.helpers.isFolder(id) ? 'Folder' : (env.taskDef.helpers.KINDS[it.kind] || [it.kind, it.kind])[1]);
        S.ctx.util.el('span', 'dim', t, env.taskDef.helpers.isFolder(id) ? '' : S.P.fmtDate(it.date, S.ctx.content));
        return t;
      }; },
      listHead(base, S) { return (m) => {
        const head = S.ctx.util.el('div', 'fm-lhead', S.els.pane);
        head.style.gridTemplateColumns = S.sizes.listCols;
        for (const h of ['Name', 'Size', 'Type', 'Modified']) S.ctx.util.el('span', '', head, h);
      }; },
      paintMain(base, S) { return (m) => {
        base(m);
        const detail = S.els.details;
        if (!detail) return;
        const selected = m.selected && m.selected[0];
        const item = selected && !env.taskDef.helpers.isFolder(selected) ? env.taskDef.helpers.itemOf(S.spec, selected) : null;
        const folder = selected && env.taskDef.helpers.isFolder(selected);
        const name = selected ? S.P.itemName(m, selected) : 'Item information';
        detail.querySelector('.fm-detail-name').textContent = name;
        const icon = detail.querySelector('.fm-detail-icon');
        icon.innerHTML = selected ? S.P.iconHtml(m, selected, 84) : S.P.folderSvg(84);
        const rows = detail.querySelectorAll('.fm-detail-line span:last-child');
        rows[0].textContent = selected ? folder ? 'Folder' : (env.taskDef.helpers.KINDS[item.kind] || [item.kind, item.kind])[1] : '—';
        rows[1].textContent = S.spec.folders.find((f) => f.id === S.model.cwd)?.name || '/';
        if (item && rows.length > 2) {
          rows[2].textContent = `${item.size} KB`;
          rows[3].textContent = S.P.fmtDate(item.date, S.ctx.content);
        }
      }; },
    },
  },
});
