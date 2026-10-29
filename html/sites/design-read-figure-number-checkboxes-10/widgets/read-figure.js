env.widget({
  task: 'read-figure',
  site: 'design-read-figure-number-checkboxes-10',
  name: 'design',
  split: 'train',
  scenarios: ['number-checkboxes'],
  template: 'read-figure/scene',
  design: {
    resetLabel: 'Clear All',
    parts: {
      pixelTitles: (base, S) => (ctx) => [
        `Example (${ctx.spec.cols} × ${ctx.spec.pattern.length})`,
        `Your Answer (${ctx.spec.cols} × ${ctx.spec.pattern.length})`,
      ],
    },
  },
});
