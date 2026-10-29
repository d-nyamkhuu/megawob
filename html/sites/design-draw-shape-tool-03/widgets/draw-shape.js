// Keep the reference board behavior, reserving room for CalibPro's vertical toolbar.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-tool-03',
  name: 'design',
  split: 'train',
  scenarios: ['tool'],
  template: 'draw-shape/base',
  design: {
    parts: {
      renderBoard: (base) => (ctx, flavor) => {
        // The template reserves space above/below the board for its horizontal bar.
        // Our 58px toolbar and 12px gap instead need room beside the board.
        const layout = Object.create(ctx, {
          size: { value: { ...ctx.size, width: ctx.size.width - 70 } },
          industrialStageSize: { value: ctx.size },
        });
        return base(layout, flavor);
      },
      place: (base) => (wrap, ctx, rng) => {
        const placement = Object.create(ctx, {
          size: { value: ctx.industrialStageSize || ctx.size },
        });
        return base(wrap, placement, rng);
      },
      'ensureStyle@0': (base) => () => {
        base();
        if (document.getElementById('calibpro-draw-layout')) return;
        const style = document.createElement('style');
        style.id = 'calibpro-draw-layout';
        style.textContent = `
          .work-stage .dw-wrap { flex-direction: row; align-items: center; justify-content: center; gap: 12px; }
          .work-stage .dw-bar { order: -1; flex-direction: column; align-items: stretch; gap: 4px; padding: 0; }
          .work-stage .dw-bar .sep { width: 50px; height: 1px; margin: 8px 2px; order: 4; }
          .work-stage .dw-btn { width: 58px; height: 60px; justify-content: center; padding: 0; }
          .work-stage .dw-btn svg { width: 38px; height: 38px; }
          .work-stage .dw-btn[data-key="pen"] { order: 0; }
          .work-stage .dw-btn[data-key="line"] { order: 1; }
          .work-stage .dw-btn[data-key="rect"] { order: 2; }
          .work-stage .dw-btn[data-key="ellipse"] { order: 3; }
          .work-stage .dw-btn[data-key="undo"] { order: 5; }
          .work-stage .dw-hint { display: none; }
        `;
        document.head.append(style);
      },
    },
  },
});
