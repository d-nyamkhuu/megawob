env.widget({
  task: 'use-text-editor',
  site: 'design-use-text-editor-trackchanges-01',
  name: 'design',
  split: 'train',
  scenarios: ['trackchanges'],
  traits: { doc: 'prose' },
  template: 'use-text-editor/rich',
  design: {
    marginWidth: 300,
    minPageWidth: 360,
    maxPageWidth: 1600,
    fontSizes: [22, 21, 20, 19],
    fontFamilies: ["Arial, 'Segoe UI', sans-serif", "Arial, sans-serif", "Georgia, serif"],
    lineHeight: 1.45,
  },
});
