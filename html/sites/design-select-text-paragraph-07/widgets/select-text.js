// Design uses the original's narrower type, fixed line height, room inset, and extended fit range.
env.widget({
  task: 'select-text',
  site: 'design-select-text-paragraph-07',
  name: 'design',
  split: 'train',
  scenarios: ['paragraph'],
  traits: { pane: true, marks: true },
  template: 'select-text/paragraphs',
  design: {
    fontMax: 26,
    fontDivisor: 62,
    lineHeight: 1.38,
    minFont: 6,
    clearSelection: true,
    parts: {
      room: () => (ctx) => Math.max(1, Math.min(ctx.size.height, ctx.stage.clientHeight) - 4),
      reduceFont: () => (value) => value - (value > 10 ? 1 : 0.5),
    },
  },
});
