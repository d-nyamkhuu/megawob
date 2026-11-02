// This outline design fills the available strip and omits the inspector.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-outline-11',
  name: 'design',
  split: 'train',
  scenarios: ['outline'],
  template: 'crop-image/box',
  design: {
    inspector: false,
    parts: {
      fit: (base, S) => (ctx, tools) => {
        return {
          W: Math.floor(ctx.size.width - 32),
          H: Math.floor(ctx.size.height - 26 - (tools ? 40 : 0)),
        };
      },
    },
  },
});
