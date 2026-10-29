// Keeps the swatch row within the viewport regardless of the number of choices.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-color-04',
  name: 'design',
  split: 'train',
  scenarios: ['color'],
  template: 'read-figure/scene',
  design: {
    parts: {
      widget: (base, S) => (ctx) => {
        base(ctx);
        const choices = S.scene.querySelector('.swatches');
        const gap = Math.min(0.04, 0.4 / Math.max(1, S.spec.hex.length - 1));
        choices.style.setProperty('--choice-gap', gap * 100 + '%');
        choices.style.setProperty(
          '--safe-row-overlap',
          ((-0.4 * 0.952 * (1 - gap * (S.spec.hex.length - 1))) / S.spec.hex.length) * 100 + '%',
        );
      },
    },
  },
});
