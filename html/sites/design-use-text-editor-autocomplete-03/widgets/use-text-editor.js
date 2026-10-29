env.widget({
  task: 'use-text-editor',
  site: 'design-use-text-editor-autocomplete-03',
  name: 'design',
  split: 'train',
  scenarios: ['autocomplete'],
  traits: { doc: 'code' },
  template: 'use-text-editor/classic',
  design: {
    fontFamily: '"Courier New", monospace',
    parts: {
      tabs: (base) => (ctx, look) => {
        const controls = base(ctx, look);
        controls.tabs.style.display = 'none';
        return controls;
      },
      metrics: (base) => (ctx, box, controls) => {
        controls.status.style.order = '-1';
        const metrics = base(ctx, box, controls);
        // Fill the available stage without overriding the template's text measurements.
        const width = Math.floor(box.w - 12);
        const codeW = width - parseFloat(controls.gutter.style.width) - (controls.mini ? 57 : 0) - 2;
        const bodyH = Math.max(metrics.bodyH, Math.floor(box.h - 12) - controls.strip.offsetHeight - controls.status.offsetHeight - 2);
        controls.card.style.width = `${width}px`;
        controls.code.style.width = `${codeW}px`;
        controls.code.style.height = `${bodyH}px`;
        controls.body.style.height = `${bodyH}px`;
        return { ...metrics, codeW, bodyH };
      },
    },
  },
});
