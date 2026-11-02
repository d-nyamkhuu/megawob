// This design uses a fixed figure frame and dark outlines for shape figures.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-identify-11',
  name: 'design',
  split: 'train',
  scenarios: ['identify'],
  template: 'read-figure/scene',
  design: {
    parts: {
      identifySize: () => () => ({ W: 346, H: 294 }),
      identified: (base, S) => (ctx, svg) => {
        if (S.spec.figure.kind === 'shape')
          svg.querySelectorAll('polygon,circle,rect').forEach((el) => {
            el.setAttribute('stroke', '#10151e');
            el.setAttribute('stroke-width', '2.7');
          });
      },
    },
  },
});
