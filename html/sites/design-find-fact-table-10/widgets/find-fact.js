// This design changes the title used by table episodes with multiple answer fields.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-table-10',
  name: 'design',
  split: 'train',
  scenarios: ['table'],
  template: 'find-fact/table',
  design: {
    multipleTitle: 'Enter Matching Values',
  },
});
