// Adds the page's number-range readout and uses its wider responsive tile geometry.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-ascending-07',
  name: 'design',
  split: 'train',
  scenarios: ['ascending'],
  template: 'read-figure/scene',
  design: {
    parts: {
      numberGeometry: (base, S) => (ctx, board, button, cell, index) => {
        const s = S.spec;
        const cw = board.clientWidth / s.gw;
        const ch = board.clientHeight / s.gh;
        const W = Math.min(ctx.size.width * 0.084, 138, cw - 12);
        const H = Math.min(ctx.size.width * 0.042, 68, ch - 10);
        button.style.cssText = `left:${6 + cell.c * cw + cell.jx * (cw - W - 12)}px;top:${5 + cell.r * ch + cell.jy * (ch - H - 10)}px;width:${W}px;height:${H}px`;
      },
      widget: (base, S) => (ctx) => {
        base(ctx);
        const s = S.spec;
        const range = document.querySelector('.overview-range');
        const sorted = s.values.slice().sort((a, b) => a - b);
        if (range) {
          range.textContent = sorted.every((v, i) => v === sorted[0] + i)
            ? `${sorted[0]} through ${sorted[sorted.length - 1]} (all numbers are present below).`
            : `${s.values.length} numbers (all numbers are present below).`;
        }
      },
    },
  },
});
