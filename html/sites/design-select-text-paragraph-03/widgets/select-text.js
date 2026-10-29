// Uses the paragraph template with this site's font scale and paragraph spacing.
env.widget({
  task: 'select-text',
  site: 'design-select-text-paragraph-03',
  name: 'design',
  split: 'train',
  scenarios: ['paragraph'],
  traits: { pane: true, marks: true },
  template: 'select-text/paragraphs',
  design: {
    fontDivisor: 36,
    parts: {
      text: (base, S) => (ctx) => {
        base(ctx);
        S.textEl.style.setProperty('--paragraph-space', ctx.spec.paragraphs.length <= 3 ? '1.7em' : '1.1em');
      },
    },
  },
});
