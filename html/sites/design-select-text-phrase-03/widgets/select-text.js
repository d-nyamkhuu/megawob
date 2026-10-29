// Design on templates/select-text/paragraphs.js.
env.widget({
  task: 'select-text',
  site: 'design-select-text-phrase-03',
  name: 'design',
  split: 'train',
  scenarios: ['phrase'],
  traits: { pane: true, marks: true },
  template: 'select-text/paragraphs',
  design: {
    fontMax: 24, clearSelection: true, readKeyup: true, dragEndpoints: 'pointer',
    parts: {
      room: (base, S) => (ctx) => {
        const stageStyle = getComputedStyle(ctx.stage);
        const headingSpace = S.card.getBoundingClientRect().top - ctx.stage.getBoundingClientRect().top - parseFloat(stageStyle.paddingTop);
        return Math.min(ctx.size.height, ctx.stage.clientHeight) - parseFloat(stageStyle.paddingTop) - parseFloat(stageStyle.paddingBottom) - headingSpace;
      },
      afterFit: () => (ctx) => {
        const preview = document.querySelector('.fl-preview-text');
        if (preview) {
          preview.replaceChildren();
          for (const paragraph of ctx.spec.paragraphs) ctx.util.el('p', '', preview, paragraph);
        }
      },
    },
  },
});
