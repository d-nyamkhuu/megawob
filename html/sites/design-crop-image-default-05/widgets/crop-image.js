// This design uses the light gray canvas, tighter vertical fit, and crop-controls Apply fallback.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-default-05',
  name: 'design',
  split: 'train',
  scenarios: ['default'],
  template: 'crop-image/box',
  design: {
    background: '#f3f3f3',
    insetY: 32,
    parts: {
      applyBar: (base) => (ctx, bar) => {
        base(ctx, bar);
        if (!document.querySelector('.aside')) {
          const controls = document.querySelector('.crop-controls');
          if (controls) controls.append(bar);
        }
      },
    },
  },
});
