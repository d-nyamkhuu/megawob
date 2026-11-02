// Design on the use-slides/office template; defaults reproduce the scaffold.
env.widget({
  task: 'use-slides',
  site: 'design-use-slides-trackchanges-03',
  name: 'design',
  split: 'train',
  scenarios: ['trackchanges'],
  template: 'use-slides/office',
  design: {
    uiFont: 'Georgia, "Times New Roman", serif',
    documentFont: 'Georgia, "Times New Roman", serif',
    brand: 'Willow Documents',
    documentTitle: 'Project Plan',
    reviewWidth: 410,
    compactReviewWidth: 340,
    frameInset: 12,
  },
});
