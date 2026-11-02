// Keep the reference drawing behavior and coordinate frame; reserve the civic
// layout's tool column through template parts before the anchors are frozen.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-erase-04',
  name: 'design',
  split: 'train',
  scenarios: ['erase'],
  template: 'draw-shape/base',
  design: {
    parts: {
      renderBoard: (base) => (ctx, flavor) => {
        const compact = ctx.size.width < 740;
        const toolbar = compact ? 76 : 112;
        const gap = compact ? 14 : 26;
        const fitted = Object.create(ctx);
        fitted.civicSize = ctx.size;
        fitted.civicToolbar = toolbar;
        fitted.civicGap = gap;
        // The template sizes the SVG and its coordinate frame together. Reserve
        // the left tool column here instead of stretching that SVG with CSS.
        fitted.size = { width: ctx.size.width - toolbar - gap + 30, height: ctx.size.height + 76 };
        return base(fitted, flavor);
      },
      place: (base) => (wrap, ctx, rng) => {
        base(wrap, ctx, rng);
        const toolbar = ctx.civicToolbar;
        Object.assign(wrap.style, {
          left: '0px', top: '0px', display: 'grid',
          gridTemplateColumns: `${toolbar}px minmax(0, 1fr)`,
          gridTemplateRows: 'minmax(0, 1fr) auto',
          alignItems: 'start', gap: `8px ${ctx.civicGap}px`,
          width: `${ctx.civicSize.width}px`, height: `${ctx.civicSize.height}px`,
        });
        const bar = wrap.querySelector('.dw-bar');
        Object.assign(bar.style, {
          gridColumn: '1', gridRow: '1 / 3', display: 'flex',
          flexDirection: 'column', gap: '12px', padding: '0px', width: `${toolbar}px`,
        });
        for (const button of bar.querySelectorAll('.dw-btn')) {
          Object.assign(button.style, {
            width: `${toolbar}px`, height: toolbar === 76 ? '70px' : '100px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '7px',
          });
        }
        const separator = bar.querySelector('.sep');
        if (separator) Object.assign(separator.style, { width: '100%', height: '1px', margin: '0px' });
        Object.assign(wrap.querySelector('.dw-board').style, { gridColumn: '2', gridRow: '1', justifySelf: 'start' });
        Object.assign(wrap.querySelector('.dw-hint').style, { gridColumn: '2', gridRow: '2' });
      },
    },
  },
});
