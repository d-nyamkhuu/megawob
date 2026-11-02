// This design uses a custom answer heading and sizes the checkbox grid to fit its column.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-number-checkboxes-09',
  name: 'design',
  split: 'train',
  scenarios: ['number-checkboxes'],
  template: 'read-figure/scene',
  design: {
    answerTitle: 'Your turn',
    pixelMax: 54,
    parts: {
      pixelSize: (base, S) => (ctx) =>
        Math.max(
          12,
          Math.min(
            S.D.pixelMax,
            Math.floor((ctx.size.height - S.D.pixelInset - (S.spec.rows - 1) * S.D.pixelGap) / S.spec.rows),
            Math.floor((ctx.size.width * 0.4 - (S.spec.cols - 1) * S.D.pixelGap) / S.spec.cols),
          ),
        ) + 'px',
    },
  },
});
