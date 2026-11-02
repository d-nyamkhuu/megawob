// Uses wider tile spacing and responsive scaling on the ascending board.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-ascending-08',
  name: 'design',
  split: 'train',
  scenarios: ['ascending'],
  template: 'read-figure/scene',
  design: {
    parts: {
      numberGeometry: (base, S) => (ctx, b, e, p, i) => {
        const s = S.spec;
        const scale = ctx.size.width < 650 ? 1.15 : 1.42;
        const cw = (b.clientWidth - 12) / s.gw;
        const ch = (b.clientHeight - 10) / s.gh;
        const T = Math.min(62, (cw - 12) / scale, (ch - 10) / scale);
        e.style.cssText = `left:${6 + p.c * cw + p.jx * Math.max(0, cw - T * scale - 8)}px;top:${5 + p.r * ch + p.jy * Math.max(0, ch - T * scale - 8)}px;width:${T}px;height:${T}px;transform:scale(${scale});transform-origin:top left`;
      },
    },
  },
});
