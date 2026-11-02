// Design on recall-info/classic; defaults preserve the scaffolded base widget.
env.widget({
  task: 'recall-info',
  site: 'design-recall-info-compare-02',
  name: 'design',
  split: 'train',
  scenarios: ['compare'],
  template: 'recall-info/classic',
  design: {
    width: 1600,
    panel: '#fbfcfe', fg: '#0a1747', muted: '#566984', line: '#9bb6d0', accent: '#4e8cd1', bg: '#dce8f4',
    parts: {
      frame(base) { return (ctx, title) => {
        const frame = base(ctx, title);
        // The catalog window supplies the app title, while base preserves its RNG draws.
        frame.app.firstElementChild.remove();
        Object.assign(frame.work.style, { padding: '12px 16px', gap: '8px', height: `${Math.max(0, ctx.size.height - 14)}px` });
        return frame;
      }; },
      catalog(base) { return (ctx, work) => {
        const bar = env.util.el('div', 'ur-choice', work);
        Object.assign(bar.style, { height: '26px', fontSize: '12px' });
        const body = env.util.el('div', 'ur-body product-body', work);
        Object.assign(body.style, { flex: '1 1 0', minHeight: '0' });
        const list = env.util.el('div', 'ur-view product-list', body);
        Object.assign(list.style, { height: '100%', minHeight: '0' });
        const grid = env.util.el('div', 'ur-cgrid product-grid', list);
        grid.style.setProperty('--ur-cc', '2');
        Object.assign(grid.style, {
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gridTemplateRows: `repeat(${Math.ceil(ctx.spec.items.length / 2)}, minmax(0, 1fr))`,
          height: '100%', gap: ctx.size.height < 450 ? '6px' : '12px',
        });
        return { bar, body, list, grid };
      }; },
      tile(base) { return (ctx, grid, it, i, apply) => {
        const rowHeight = (ctx.size.height - 84) / Math.ceil(ctx.spec.items.length / 2);
        const compact = rowHeight < 145;
        const t = env.util.el('div', `ur-tile product-card product-card-${i % 5}`, grid);
        Object.assign(t.style, {
          display: 'grid', gridTemplateColumns: '42% minmax(0, 1fr)',
          gap: '10px', padding: compact ? '4px 6px' : '12px 14px',
          height: '100%', minHeight: '0', position: 'relative',
        });
        const art = env.util.el('div', `product-art product-art-${i % 5}`, t);
        env.util.el('span', 'product-silhouette', art);
        const info = env.util.el('div', 'product-info', t);
        Object.assign(info.style, {
          minWidth: '0', display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', justifyContent: 'center', gap: compact ? '4px' : '20px',
        });
        const name = env.util.el('span', 'product-name', info, it.name);
        name.title = it.name;
        name.style.fontSize = compact ? (rowHeight < 80 ? '10px' : '12px') : 'clamp(14px, 1.4vw, 22px)';
        const v = env.util.el('button', 'ur-btn small product-view', info, 'View');
        Object.assign(v.style, { width: '100%', maxWidth: '138px', padding: compact ? '2px 4px' : '8px 18px' });
        v.type = 'button';
        v.addEventListener('click', () => apply({ open: i }));
        let c = null;
        if (ctx.spec.listChoose) {
          c = env.util.el('button', 'ur-btn small', info, ctx.spec.actLabel);
          Object.assign(c.style, { position: 'absolute', right: '4px', top: '4px', width: '24px', height: '24px', padding: '0', fontSize: '0' });
          c.classList.add('product-pick');
          c.type = 'button';
          c.addEventListener('click', () => apply({ pick: i }));
        }
        return { v, c };
      }; },
      choice(base) { return (ctx, bar, m) => {
        bar.innerHTML = '';
        bar.hidden = m.picked == null;
        bar.style.display = bar.hidden ? 'none' : 'flex';
        if (m.picked != null) {
          bar.append('Selected product: ');
          env.util.el('b', '', bar, ctx.spec.items[m.picked].name);
        }
      }; },
    },
  },
});
