env.widget({
  task: 'use-text-editor',
  site: 'design-use-text-editor-multicursor-04',
  name: 'design',
  split: 'train',
  scenarios: ['multicursor'],
  traits: { doc: 'code' },
  template: 'use-text-editor/classic',
  // Let the template fit every line into the stage below the XP frame.
  design: { minLineHeight: 1, minFontSize: 1 },
});
