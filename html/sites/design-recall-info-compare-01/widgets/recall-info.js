// Design on recall-info/classic; defaults preserve the scaffolded base widget.
env.widget({
  task: 'recall-info',
  site: 'design-recall-info-compare-01',
  name: 'design',
  split: 'train',
  scenarios: ['compare'],
  template: 'recall-info/classic',
  design: {
    width: 1600,
    title: 'Riverton Public Library Catalogue',
    parts: {
      placeFrame: (base, S) => (ctx, app, W, H) => {
        base(ctx, app, W, H);
        Object.assign(app.style, {
          left: '0px', top: '0px',
          width: `${ctx.size.width}px`, height: `${ctx.size.height}px`,
        });
      },
      work: (base, S) => (ctx, app) => {
        const work = base(ctx, app);
        Object.assign(work.style, { padding: '0', gap: '0', overflow: 'hidden' });
        return work;
      },
      catalog: (base, S) => (ctx, work) => {
        const e = env.util.el;
        const head = e('div', 'ur-colhead riv-head', work);
        Object.assign(head.style, {
          height: ctx.size.width <= 1100 ? '42px' : '55px',
          display: 'grid', gridTemplateColumns: `minmax(0, 1fr) ${ctx.spec.listChoose ? '320px' : '155px'}`,
          alignItems: 'center', padding: '0 28px', boxSizing: 'border-box',
        });
        e('span', '', head, 'Title');
        e('span', '', head, 'Action');
        const body = e('div', 'ur-body riv-list', work);
        Object.assign(body.style, { flex: '1 1 0px', minHeight: '0', overflow: 'auto', boxSizing: 'border-box' });
        const list = e('div', 'ur-view', body);
        const grid = e('div', 'ur-cgrid', list);
        grid.style.setProperty('--ur-cc', '1');
        grid.style.gap = '0';
        const bar = e('div', 'ur-choice riv-choice', work);
        return { bar, body, list, grid };
      },
      choice: (base, S) => (ctx, bar, m) => {
        base(ctx, bar, m);
        bar.style.display = m.picked == null ? 'none' : 'flex';
      },
      tile: (base, S) => (ctx, grid, it, i, apply) => {
        const e = env.util.el;
        const row = e('div', 'ur-tile riv-row', grid);
        const compact = ctx.size.width <= 1300;
        const small = ctx.size.width <= 1100;
        const rowHeight = Math.min(small ? 64 : compact ? 82 : 129,
          (ctx.size.height - (small ? 42 : 55) - 38) / ctx.spec.items.length);
        Object.assign(row.style, {
          display: 'grid', gridTemplateColumns: ctx.spec.listChoose ? 'minmax(0, 1fr) 155px 155px' : 'minmax(0, 1fr) 155px',
          alignItems: 'center', gap: ctx.spec.listChoose ? '10px' : '0',
          height: `${rowHeight}px`, padding: compact ? '0 18px' : '0 28px',
          fontSize: small ? '18px' : compact ? '20px' : '30px',
        });
        e('span', 'nm', row, it.name).title = it.name;
        const v = e('button', 'ur-btn small riv-view', row, 'View');
        Object.assign(v.style, { width: small ? '96px' : compact ? '112px' : '156px', height: `${Math.min(small ? 36 : compact ? 42 : 53, rowHeight - 6)}px`, padding: '0' });
        v.type = 'button';
        v.addEventListener('click', () => apply({ open: i }));
        let c = null;
        if (ctx.spec.listChoose) {
          c = e('button', 'ur-btn small riv-view', row, ctx.spec.actLabel);
          Object.assign(c.style, { width: v.style.width, height: v.style.height, padding: '0' });
          c.type = 'button';
          c.addEventListener('click', () => apply({ pick: i }));
        }
        return { v, c };
      },
      bar: (base, S) => (ctx, app, title) => {
        ctx.rng.pick(['J. Doe', 'A. Kim', 'M. Silva', 'R. Lee', 'T. Park']);
      },
    },
  },
});
