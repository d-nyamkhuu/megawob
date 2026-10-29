env.widget({
  task: 'use-text-editor',
  site: 'design-use-text-editor-cursor-02',
  name: 'design',
  split: 'train',
  scenarios: ['cursor'],
  traits: { doc: 'code' },
  template: 'use-text-editor/classic',
  // The companion document leaves a shorter stage than the full-page editor.
  // Let the template's ctx.size calculation fit every base and target line.
  design: { minLineHeight: 1, minFontSize: 1 },
});
