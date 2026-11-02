env.widget({
  task: 'use-text-editor',
  site: 'design-use-text-editor-multicursor-01',
  name: 'design',
  split: 'train',
  scenarios: ['multicursor'],
  traits: { doc: 'code' },
  template: 'use-text-editor/classic',
  design: {
    maxLineHeight: 26,
    maxFontSize: 19,
    parts: {
      appearance(base) {
        return (ctx, look) => {
          const sampled = base(ctx, look);
          return { ...sampled, minimap: true };
        };
      },
    },
  },
});
