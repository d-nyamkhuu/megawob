// Keeps each Unicode source box's width hint based on its longest line.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-unicode-04',
  name: 'design',
  split: 'train',
  scenarios: ['unicode'],
  template: 'handle-text/editor',
  design: {
    parts: {
      sourceContainer: (base, S) => (ctx, src, b) => {
        src.style.setProperty(
          '--n',
          String(Math.max(1, ...String(b.text).split('\n').map((line) => line.length))),
        );
      },
    },
  },
});
