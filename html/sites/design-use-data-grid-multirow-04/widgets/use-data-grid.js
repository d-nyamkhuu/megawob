// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-multirow-04',
  name: 'design',
  split: 'train',
  scenarios: ['multirow'],
  template: 'use-data-grid/grid',
  design: {
    brand: 'Northwind Inventory Manager', font: '16px/1.35 "Segoe UI",Arial,sans-serif',
    expandedAt: 10000, contextAt: 10000, navWidth: 0, railWidth: 0, contextWidth: 0,
    cardInsetX: 36, cardInsetY: 0, cardTop: 0, fixedHeight: 172, rowMin: 12, rowMax: 38,
    extraCss: `
      .to-workspace { inset:0; border:0; border-radius:0; --panel:#fff; --fg:#17243a; --muted:#536985; --line:#d4e0e9; --accent:#0878cf; }
      .to-workspace .to-appbar, .to-workspace .to-nav, .to-workspace .to-context,
      .to-workspace .to-stream, .to-workspace .to-facts, .to-workspace .to-tabs,
      .to-card > .to-head { display:none; }
      .to-card { border:0; border-radius:0; box-shadow:none; }
      .to-tools { height:var(--inventory-tools); padding:4px 0; flex-wrap:wrap; align-content:center; gap:4px 6px; background:#fff; }
      .to-tools .to-selinfo { min-width:78px; font-size:14px; font-weight:400; }
      .to-tools .to-search { width:170px; margin-left:auto; }
      .to-tools .to-btn { height:30px; padding:0 6px; font-size:13px; }
      .to-tools .sp { display:none; }
      .inventory-toolbar-separator { height:26px; border-left:1px solid #d4e0e9; }
      .to-tools .inventory-search { order:20; }
      .to-tools .inventory-filter { order:21; }
      .to-hrow { height:40px; }
      .to-h { font-size:16px; border-right:1px solid #dbe3ea; }
      .to-c { font-size:16px; border-right:1px solid #dbe3ea; }
      .to-pill { background:transparent!important; color:#26364d!important; padding:0; border:0; }
      .to-foot { height:var(--inventory-foot); background:#f4f7f9; }
      .to-foot .info { font-size:13px; }
      .to-pg.cur { background:#0878cf; border-color:#0878cf; color:#fff; }
      .to-card.compact .to-c { font-size:11px; padding:0 5px; }
      .to-card.compact .to-h { font-size:12px; }
    `,
    parts: {
      fit(base, S) { return function () {
        base();
        const height = S.ctx.size.height;
        S.cardW = Math.max(1, S.ctx.size.width - 36);
        S.cardH = height;
        S.left = 18;
        const toolsHeight = S.cardW < 1050 ? 76 : 54;
        const footHeight = height < 400 ? 46 : 78;
        S.FIXED = toolsHeight + 40 + footHeight + 4;
        S.rowH = Math.max(8, Math.min(38, Math.floor((height - S.FIXED) / S.spec.pageSize)));
        S.shell.style.setProperty('--inventory-tools', `${toolsHeight}px`);
        S.shell.style.setProperty('--inventory-foot', `${footHeight}px`);
      }; },
      heading(base, S) { return function () {
        base();
        // Match every column to the available stage width, including panel mode.
        S.scale = Math.min(1.5, (S.cardW - 46) / S.nominal);
        S.card.classList.toggle('compact', S.rowH < 24);
      }; },
      toolbar(base, S) { return function () {
        base();
        const { tools, selBar, selInfo, fam, spec, ctx, D, util } = S;
        const old = tools.querySelector(':scope > .to-selinfo');
        if (old) old.remove();
        // Keep the template's live selection count and action handlers, while
        // presenting them in the Metro bulk-action row.
        tools.insertBefore(selInfo, tools.firstChild);
        selInfo.className = 'to-selinfo';
        const sep = util.el('i', 'inventory-toolbar-separator', tools);
        const status = S.markBtn, remove = S.delBtn, undo = S.undoBtn;
        status.textContent = 'Set Stock Status'; status.dataset.key = 'status';
        remove.textContent = 'Delete';
        const category = util.el('button', 'to-btn', tools, 'Change Category  ▾');
        category.type = 'button'; category.addEventListener('click', () => S.showUtility('Change Category', ['Choose a category for the selected products.']));
        const exp = util.el('button', 'to-btn inventory-export', tools, 'Export');
        exp.type = 'button'; exp.addEventListener('click', () => S.showUtility('Export', ['Inventory export is ready.']));
        selBar.remove();
        for (const b of [status, category, S.archBtn, remove, exp, S.clearSelBtn, undo]) tools.appendChild(b);
        const search = util.el('label', 'to-search inventory-search', tools);
        search.innerHTML = D.icons.search;
        const input = util.el('input', '', search);
        input.type = 'text'; input.placeholder = 'Search products…';
        input.addEventListener('input', () => S.P.act(fam.helpers.setQuery(ctx.model, input.value), false));
        const filter = util.el('button', 'to-btn inventory-filter', tools, 'All Categories  ▾');
        filter.type = 'button';
        const cat = spec.cols.find(c => c.type === 'cat');
        if (cat) filter.addEventListener('click', () => S.P.act(fam.helpers.openMenu(ctx.model, spec, cat.id, 'filter')));
        S.inventorySearch = input;
      }; },
      drawTools(base, S) { return function (model) {
        base(model);
        if (S.inventorySearch && S.inventorySearch.value !== (model.query || '')) S.inventorySearch.value = model.query || '';
        S.selInfo.textContent = `${model.selected.length} selected`;
        S.selInfo.style.display = '';
        S.undoBtn.hidden = !model.history.length;
      }; },
    },
  },
});
