// Design on the change-settings/preferences template; defaults reproduce the reference scaffold.
env.widget({
  task: 'change-settings',
  site: 'design-change-settings-toggle-01',
  name: 'design',
  split: 'train',
  scenarios: ['toggle'],
  template: 'change-settings/preferences',
  design: {
    rowHeight: 54,
    parts: {
      width: (base) => (ctx) => {
        base(ctx); // Retain the template's seeded width draw.
        const available = ctx.stage.getBoundingClientRect().width || ctx.size.width;
        const desired = available > 1100 ? Math.min(990, available * .59) - 20 : available - 32;
        return Math.max(480, Math.min(ctx.size.width, desired));
      },
      wrap: (base) => (ctx) => {
        const wrap = base(ctx);
        Object.assign(wrap.style, {
          position: 'relative', zIndex: '2', flex: 'none',
          alignSelf: 'flex-start', margin: '0', padding: '0',
        });
        return wrap;
      },
      card: (base, S) => (ctx, wrap) => {
        const card = base(ctx, wrap);
        card.style.paddingTop = '36px';
        if (!S.geo.long) {
          const stageStyle = getComputedStyle(ctx.stage);
          const inset = parseFloat(stageStyle.paddingTop) + parseFloat(stageStyle.paddingBottom);
          card.style.height = Math.min(856, ctx.size.height - inset - 6) + 'px';
        }
        return card;
      },
      panel: (base, S) => (ctx, body) => {
        const panel = base(ctx, body);
        if (!S.geo.long) panel.style.overflow = 'auto';
        return panel;
      },
      place: (base, S) => (ctx) => {
        base(ctx);
        S.els.wrap.style.marginTop = '0';
      },
      paint: (base, S) => {
        let previousPanel, previousShape;
        return (model) => {
          const shape = JSON.stringify([
            model.tab, model.query,
            env.taskDef.helpers.visibleIds(model, S.spec),
          ]);
          base(model);
          if (previousPanel === S.els.panel && previousShape !== shape) S.ctx.reanchor();
          previousPanel = S.els.panel;
          previousShape = shape;
        };
      },
    },
  },
});
