// Design on the use-slides/office template; defaults reproduce the scaffold.
env.widget({
  task: 'use-slides',
  site: 'design-use-slides-comments-03',
  name: 'design',
  split: 'train',
  scenarios: ['comments'],
  template: 'use-slides/office',
  design: {
    uiFont: 'Arial, Helvetica, sans-serif',
    documentFont: 'Arial, Helvetica, sans-serif',
    frameInset: 0,
    reviewWidth: 286,
    compactReviewWidth: 250,
    inspectorAt: 0,
    outlineAt: 9999,
    parts: {
      layout: (base) => (ctx) => base(ctx),
    },
  },
});
