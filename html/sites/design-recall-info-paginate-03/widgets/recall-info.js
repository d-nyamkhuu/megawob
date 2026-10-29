// Design on recall-info/classic; defaults preserve the scaffolded base widget.
env.widget({
  task: 'recall-info',
  site: 'design-recall-info-paginate-03',
  name: 'design',
  split: 'train',
  scenarios: ['paginate'],
  template: 'recall-info/classic',
  design: {
    title: 'Product Catalog',
    width: 920,
    frameRadius: '0px',
    fontSize: '16px',
    inputRadius: '0px',
    panel: '#ffffff', fg: '#111111', line: '#808080', accent: '#000080', muted: '#555555', bg: '#c0c0c0',
    columns: 'minmax(0,1.2fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) 124px',
    parts: {
      // Keep the template's random draws and handlers; size the catalog within its stage.
      bar: (base, S) => (ctx) => { ctx.rng.pick(S.D.users); },
      work: (base) => (ctx, app) => {
        const work = base(ctx, app);
        Object.assign(work.style, { padding: '0', gap: '0' });
        return work;
      },
      placeFrame: (base, S) => (ctx, app, W, H) => {
        base(ctx, app, W, H);
        const box = S.P.usable(ctx);
        Object.assign(app.style, { left: `${box.x + 12}px`, top: `${box.y + 12}px`,
          width: `${Math.max(0, box.w - 24)}px`, height: `${Math.max(0, box.h - 24)}px` });
      },
      heading: (base) => (ctx, work) => {
        const head = ctx.util.el('div', 'catalog-heading', work);
        Object.assign(head.style, { flex: 'none', padding: '6px 12px', borderBottom: '1px solid #808080' });
        ctx.util.el('h2', 'ur-h', head, 'Search Results');
        return ctx.util.el('span', 'ur-sub', head);
      },
      table: (base) => (ctx, work) => {
        const sel = ctx.util.el('div', 'ur-sel', work);
        Object.assign(sel.style, { order: '3', height: '24px', border: '0', fontSize: '11px' });
        const tbl = ctx.util.el('div', 'ur-tbl', work);
        Object.assign(tbl.style, { display: 'flex', flexDirection: 'column', flex: '1 1 0', minHeight: '0', margin: '0 12px' });
        return { sel, tbl };
      },
      row: (base) => (ctx, tbl, k, pick) => {
        const slot = base(ctx, tbl, k, pick);
        const small = ctx.size.width < 650 || (ctx.size.height - 170) / ctx.spec.perPage < 105;
        Object.assign(slot.r.style, { flex: '1 1 0', minHeight: '0', height: 'auto', padding: small ? '5px 8px' : '10px 14px',
          gridTemplateColumns: `minmax(0,1fr) minmax(0,1fr) minmax(0,1.1fr) ${small ? 76 : 124}px`,
          gridTemplateRows: 'minmax(0,1fr) minmax(0,1.5fr)', gap: small ? '3px 6px' : '6px 12px', fontSize: small ? '12px' : '18px' });
        Object.assign(slot.name.style, { gridColumn: '1 / 4', gridRow: '1', fontWeight: 'bold', fontSize: small ? '14px' : '20px',
          whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip', minWidth: '0' });
        const cells = [slot.num, slot.rate, slot.cat.parentElement];
        const labels = [ctx.spec.numCol, ctx.spec.cols[2], ctx.spec.catCol];
        cells.forEach((cell, i) => {
          const field = ctx.util.el('div', 'catalog-value', slot.r);
          Object.assign(field.style, { gridColumn: String(i + 1), gridRow: '2', minWidth: '0', alignSelf: 'center', overflowWrap: 'anywhere' });
          ctx.util.el('div', 'catalog-label', field, `${labels[i]}:`);
          field.append(cell);
          cell.style.whiteSpace = 'normal';
        });
        Object.assign(slot.cat.style, { padding: '0', fontSize: 'inherit' });
        Object.assign(slot.b.style, { gridColumn: '4', gridRow: '1 / 3', width: '100%', minWidth: '0',
          height: small ? '30px' : '42px', padding: '3px', alignSelf: 'center', fontSize: small ? '12px' : '18px' });
        return slot;
      },
      pager: (base) => (ctx, work, apply) => {
        const result = base(ctx, work, apply);
        const pager = result.pb.prev.parentElement;
        Object.assign(pager.style, { order: '-1', minWidth: '0', height: ctx.size.height < 560 ? '48px' : '64px',
          padding: '0 12px', justifyContent: 'space-between', gap: '6px' });
        work.firstElementChild.style.order = '-2';
        for (const button of [result.pb.prev, ...result.pb.nums, result.pb.next]) {
          Object.assign(button.style, { minWidth: '0', flex: '1 1 0', padding: '5px 3px',
            maxWidth: result.pb.nums.length ? '60px' : '176px', fontSize: ctx.size.width < 650 ? '12px' : '18px' });
        }
        if (result.pageText) Object.assign(result.pageText.style, { flex: '1', textAlign: 'center', fontWeight: 'bold' });
        return result;
      },
    },
  },
});
