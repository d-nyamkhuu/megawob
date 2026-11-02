// Design on use-workflow-editor/editor; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-workflow-editor',
  site: 'design-use-workflow-editor-remove-05',
  name: 'design',
  split: 'train',
  scenarios: ['remove'],
  template: 'use-workflow-editor/editor',
  design: {
    frameInset: 0,
    frameRadius: 0,
    initialZoom: 0.85,
    parts: {
      // Expose the step type so the CSS can color steps like the flowchart in the reference.
      node: (base) => (ctx, nodeLayer, n) => {
        const card = base(ctx, nodeLayer, n);
        card.dataset.type = n.type;
        return card;
      },
    },
  },
});
