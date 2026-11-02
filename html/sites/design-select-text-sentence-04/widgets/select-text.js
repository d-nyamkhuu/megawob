// Uses the precision site's stage-relative type size and spacing, plus its viewport-relative text inset.
env.widget({
  task: 'select-text',
  site: 'design-select-text-sentence-04',
  name: 'design',
  split: 'train',
  scenarios: ['sentence'],
  traits: { pane: true, marks: true, triple: true },
  template: 'select-text/paragraphs',
  design: {
    paragraphCount: true,
    roomMode: 'stage',
    parts: {
      font: () => (ctx) => Math.round(ctx.stage.clientWidth * 0.0215),
      textCreated: (base, S) => () => {
        base();
        const shell = S.ctx.stage.closest('.shell');
        const top = shell.getBoundingClientRect().top + shell.clientHeight * 0.26;
        S.textEl.style.setProperty('--precision-top', Math.max(20, top - S.ctx.stage.getBoundingClientRect().top) + 'px');
      },
      fit: (base, S) => (ctx) => {
        base(ctx);
        S.textEl.style.setProperty('--precision-gap', S.font * (ctx.spec.paragraphs.length > 3 ? 1.05 : 1.8) + 'px');
      },
    },
  },
});
