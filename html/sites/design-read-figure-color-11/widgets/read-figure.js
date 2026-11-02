// Retains this site's sample caption punctuation and responsive choice-count styling.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-color-11',
  name: 'design',
  split: 'train',
  scenarios: ['color'],
  template: 'read-figure/scene',
  design: {
    sampleLabel: 'Sample Color:',
    parts: {
      colorReady: (base, S) => (ctx, sample, choices) => {
        base(ctx, sample, choices);
        S.scene.style.setProperty('--choice-count', S.spec.hex.length);
      },
    },
  },
});
