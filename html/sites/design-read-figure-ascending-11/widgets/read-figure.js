// Uses the site's wider, centered tile layout for ascending number grids.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-ascending-11',
  name: 'design',
  split: 'train',
  scenarios: ['ascending'],
  template: 'read-figure/scene',
  design: {
    parts: {
      numberGeometry: (base, S) => (ctx, board, button, cell, index) => {
        const s = S.spec;
        const cols = Math.min(5, s.values.length);
        const rows = Math.ceil(s.values.length / cols);
        const cw = (ctx.size.width - 20) / cols;
        const ch = (ctx.size.height - 55) / rows;
        const width = Math.min(120, cw * 0.74);
        const height = Math.min(94, ch * 0.78);
        button.style.cssText = `left:${10 + (index % cols) * cw + (cw - width) / 2}px;top:${Math.floor(index / cols) * ch + (ch - height) / 2}px;width:${width}px;height:${height}px`;
      },
    },
  },
});
