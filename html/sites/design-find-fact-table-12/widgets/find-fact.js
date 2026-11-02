// Keeps this design's room size, task title, and record table headings.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-table-12',
  name: 'design',
  split: 'train',
  scenarios: ['table'],
  template: 'find-fact/table',
  design: {
    roomInset: [40, 32],
    recordHeader: ['Field', 'Value'],
    parts: {
      answerTitle: (base, S) => (ctx, labels) => {
        base(ctx, labels); // Preserve the original discarded single-field title draw.
        return 'Your Task';
      },
    },
  },
});
