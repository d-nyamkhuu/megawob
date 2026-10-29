// Design keeps the stage-sized font and native-selection reads from this site's original widget.
env.widget({
  task: 'select-text',
  site: 'design-select-text-phrase-05',
  name: 'design',
  split: 'train',
  scenarios: ['phrase'],
  traits: { pane: true, marks: true },
  template: 'select-text/paragraphs',
  design: {
    readPointerup: true,
    readKeyup: true,
    parts: {
      font: () => (ctx) => Math.min(32, Math.round(ctx.stage.clientWidth / 37)),
    },
  },
});
