// Matches the outline medoid geometry and preserves safe radii for reversed ellipse bounds.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-outline-03',
  name: 'design',
  split: 'train',
  scenarios: ['outline'],
  traits: { aspect: 1.605, placement: 'center', startBox: { x: 0.158, y: 0.126, w: 0.688, h: 0.686 } },
  template: 'crop-image/box',
  design: {
    parts: {
      fit: (base, S) => (ctx, tools) => {
        const availW = Math.floor(ctx.size.width - 4);
        const availH = Math.floor(ctx.size.height - 4 - 53 - (tools ? 40 : 0));
        const W = Math.floor(Math.min(availW, availH * ctx.spec.aspect));
        return { W, H: Math.floor(W / ctx.spec.aspect) };
      },
      ellipse: (base, S) => (g, x, y, w, h) =>
        g.ellipse((x + w / 2) * S.W, (y + h / 2) * S.H,
          Math.abs((w * S.W) / 2), Math.abs((h * S.H) / 2), 0, 0, 2 * Math.PI),
    },
  },
});
