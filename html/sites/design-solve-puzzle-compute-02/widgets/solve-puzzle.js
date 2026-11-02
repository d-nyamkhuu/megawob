// Design on templates/solve-puzzle/base.js, with compact offer spacing when the stage is short.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-compute-02',
  name: 'design',
  split: 'train',
  scenarios: ['compute'],
  template: 'solve-puzzle/base',
  design: {
    parts: {
      buildCompute: (base, S) => (ctx, body, avail) => {
        base(ctx, body, avail);
        if (ctx.spec.mode !== 'pick') return;
        const grid = S.st.main;
        const rows = new Set(Array.from(grid.children, card => card.offsetTop)).size;
        const excess = Math.ceil(grid.getBoundingClientRect().height - (ctx.size.height - 8));
        if (excess > 0 && rows > 1) {
          const gap = parseFloat(getComputedStyle(grid).rowGap);
          grid.style.rowGap = `${Math.max(0, gap - Math.ceil(excess / (rows - 1)))}px`;
        }
      },
    },
  },
});
