// Reference workspace design; shared widget: templates/use-dev-tools/workspace.js.
env.widget({
  task: 'use-dev-tools',
  site: 'design-use-dev-tools-rerun-04',
  name: 'design',
  split: 'train',
  scenarios: ['rerun'],
  template: 'use-dev-tools/workspace',
  // The frame already reserves space for the episode-end dock. Use the
  // workspace's bottom margin for rows instead of reserving that space twice.
  design: { bottomInset: 12 },
});
