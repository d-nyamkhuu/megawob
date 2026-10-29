// Design of this site on bins/boxes: keep its shorter board and central collect target.
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-collect-03',
  name: 'design',
  split: 'train',
  scenarios: ['collect'],
  traits: { containers: [{ x: 0.23, y: 0.34, w: 0.52, h: 0.52 }] },
  template: 'sort-into-bins/boxes',
  design: {
    parts: {
      fit: (base, S) => (ctx) => {
        const H = Math.floor(Math.min(ctx.size.height - 42, (ctx.size.width - 12) / S.spec.aspect));
        return { H, W: Math.round(H * S.spec.aspect) };
      },
    },
  },
});
