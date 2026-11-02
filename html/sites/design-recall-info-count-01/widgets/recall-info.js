// Design on recall-info/classic; defaults preserve the scaffolded base widget.
env.widget({
  task: 'recall-info',
  site: 'design-recall-info-count-01',
  name: 'design',
  split: 'train',
  scenarios: ['count'],
  template: 'recall-info/classic',
  design: {
    width: 1140,
    maxHeight: 670,
    minHeight: 500,
    rowHeight: 35,
    fontSize: '18px',
    frameRadius: '2px',
    inputRadius: '0px',
    panel: '#fffbea',
    fg: '#061d3c',
    line: '#86add0',
    accent: '#346fa8',
    muted: '#1d568f',
    bg: '#cbe3fa',
    title: 'Tickets',
    columns: { tickets: '7% 15% 36% 16% 26%', orders: '7% 15% 36% 16% 26%', files: '7% 15% 36% 16% 26%' },
    parts: {
      styles: (base) => (ctx) => {
        base(ctx);
        const compact = ctx.size.height < 580;
        // Install geometry before the template measures its pane and text field.
        ctx.css('flash-widget-layout', `
          .ur-app { border:0; border-radius:2px; box-shadow:none; background:transparent; }
          .ur-work, .ur-work.tight { gap:12px; padding:0; background:transparent; }
          .ur-colhead { height:40px; padding:0 16px; letter-spacing:0; text-transform:none; }
          .ur-grid { column-gap:0; }
          .ur-pane { right:30px; }
          .ur-track { width:30px; }
          .ur-row { padding:0 16px; }
          .ur-ans { position:relative; flex-wrap:nowrap; min-height:${compact ? 120 : 166}px;
            box-sizing:border-box; padding:${compact ? 50 : 65}px 32px 24px; gap:24px; }
          .ur-ans::before { content:"Your Answer"; position:absolute; inset:0 0 auto;
            box-sizing:border-box; height:${compact ? 38 : 46}px; padding:7px 28px;
            background:linear-gradient(100deg,#78afe2,#9bc7ee); color:#061d3c;
            font-size:${compact ? 20 : 25}px; font-weight:bold; }
          .ur-ans .ur-label, .ur-ans .ur-readout { display:none; }
          .ur-ans .ur-input { flex:0 1 60%; width:650px; height:${compact ? 44 : 66}px; }
          .ur-ans .ur-btn { height:${compact ? 44 : 54}px; padding:0 32px; font-size:19px; }
        `);
      },
      usable: (base) => (ctx) => {
        const box = base(ctx);
        // The summary band owns this space; keep the frame within the remainder.
        const band = Math.round(ctx.size.height * 0.165);
        return { ...box, y: box.y + band, h: Math.max(0, box.h - band) };
      },
      heading: () => (ctx) => ctx.util.el('span', 'ur-sub', null),
      build: (base) => (ctx, work, app) => {
        // Measuring the initially visible rows is not a user scroll. Keep the
        // task's start state, then record every subsequent scroll normally.
        let mounting = true;
        const listContext = Object.create(ctx);
        listContext.patch = (patch) => {
          if (!mounting) ctx.patch(patch);
        };
        const view = base(listContext, work, app);
        mounting = false;
        return view;
      },
      rendered: (base) => (ctx, app, work, view) => {
        const el = ctx.util.el;
        const summary = el('section', 'flash-summary', app.parentNode);
        const metrics = [['▤', 'Total Tickets', '48', 'blue'], ['◷', 'Open', '34', 'blue'], ['✓', 'Resolved', '12', 'green'], ['!', 'On Hold', '2', 'orange']];
        for (const [icon, title, value, color] of metrics) {
          const metric = el('div', `flash-metric ${color}`, summary);
          el('span', 'flash-metric-icon', metric, icon);
          const label = el('div', 'flash-metric-label', metric);
          el('b', '', label, title);
          el('strong', '', label, value);
        }
        app.parentNode.insertBefore(summary, app);
        return base(ctx, app, work, view);
      },
      bar: (base, S) => (ctx, app, title) => {
        // The frame supplies the title; preserve the template's random draw.
        ctx.rng.pick(S.D.users);
      },
    },
  },
});
