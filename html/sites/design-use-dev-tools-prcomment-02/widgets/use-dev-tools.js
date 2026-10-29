// Reference workspace design; shared widget: templates/use-dev-tools/workspace.js.
env.widget({
  task: 'use-dev-tools',
  site: 'design-use-dev-tools-prcomment-02',
  name: 'design',
  split: 'train',
  scenarios: ['prcomment'],
  template: 'use-dev-tools/workspace',
  design: {
    inset: 8,
    bottomInset: 16,
    minHeight: 0,
  },
});
