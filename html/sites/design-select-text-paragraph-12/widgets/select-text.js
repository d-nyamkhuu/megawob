// Preserves this site's proportional font, stage-based fit room, and clear-selection helper.
env.widget({
  task: 'select-text',
  site: 'design-select-text-paragraph-12',
  name: 'design',
  split: 'train',
  scenarios: ['paragraph'],
  traits: { pane: true, marks: true, triple: true },
  template: 'select-text/paragraphs',
  design: {
    clearSelection: true,
    parts: {
      font: () => (ctx) => Math.min(32, ctx.size.width * 32 / 1168),
      room: () => (ctx) => ctx.stage.clientHeight - 8,
    },
  },
});
