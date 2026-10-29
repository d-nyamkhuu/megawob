// This design uses a shorter sample caption and wider, responsive swatches.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-color-12',
  name: 'design',
  split: 'train',
  scenarios: ['color'],
  template: 'read-figure/scene',
  design: {
    sampleLabel: 'Sample',
    parts: {
      swatchSize: (base, S) => (ctx) => {
        const s = S.spec;
        S.scene.style.setProperty(
          '--swatch-size',
          Math.max(
            24,
            Math.min(
              150,
              ctx.size.width * 0.137,
              (ctx.size.width - (s.hex.length - 1) * 15) / s.hex.length,
              (ctx.size.height - 120) / 2,
            ),
          ) + 'px',
        );
        S.scene.style.setProperty(
          '--sample-size',
          Math.max(30, Math.min(165, (ctx.size.height - 160) / 2)) + 'px',
        );
      },
      colorReady: (base, S) => (ctx, sample, choices) => {
        base(ctx, sample, choices);
        choices.style.setProperty('--swatch-count', S.spec.hex.length);
      },
    },
  },
});
