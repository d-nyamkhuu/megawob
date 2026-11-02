env.widget({
  task: 'use-text-editor',
  site: 'design-use-text-editor-multiline-03',
  name: 'design',
  split: 'train',
  scenarios: ['multiline'],
  traits: { doc: 'code' },
  template: 'use-text-editor/classic',
  // The summary band leaves less room than the classic editor's default minimum.
  // Let its existing metrics fit every line to the actual stage height.
  design: { minLineHeight: 1, minFontSize: 1 },
});
