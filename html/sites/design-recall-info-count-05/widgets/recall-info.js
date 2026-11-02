// Design on recall-info/classic; defaults preserve the scaffolded base widget.
env.widget({
  task: 'recall-info',
  site: 'design-recall-info-count-05',
  name: 'design',
  split: 'train',
  scenarios: ['count'],
  template: 'recall-info/classic',
  design: {
    width: 1140,
    maxHeight: 500,
    minHeight: 350,
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
    columns: { tickets: '5% 12% 54% 12% 17%', orders: '6% 16% 42% 20% 16%', files: '6% 31% 23% 18% 22%' },
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
        // The 1994 sheet has no summary band above the widget.
        return box;
      },
      heading: () => (ctx) => ctx.util.el('span', 'ur-sub', null, 'Tickets'),
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
        const side = el('aside', 'ticket-status', app.parentNode);
        el('h2', '', side, 'Ticket Status');
        for (const [label, value] of [['Open', '38'], ['In Progress', '7'], ['On Hold', '4'], ['Closed', '11']]) {
          const row = el('div', 'status-row', side);
          el('span', '', row, label);
          el('span', '', row, value);
        }
        el('hr', 'status-rule', side);
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
