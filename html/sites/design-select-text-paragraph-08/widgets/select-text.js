// Keeps this site's compact paragraph spacing and stage-padded document fit.
env.widget({
  task: 'select-text',
  site: 'design-select-text-paragraph-08',
  name: 'design',
  split: 'train',
  scenarios: ['paragraph'],
  traits: { pane: true, marks: true },
  template: 'select-text/paragraphs',
  design: {
    parts: {
      textCreated: (base, S) => (ctx) => {
        base(ctx);
        S.textEl.style.setProperty('--hl-paragraph-gap', (4.5 / Math.max(3, ctx.spec.paragraphs.length)) + 'em');
      },
      room: () => (ctx) => Math.max(80,
        ctx.stage.clientHeight - parseFloat(getComputedStyle(ctx.stage).paddingBottom) - 8),
    },
  },
});
