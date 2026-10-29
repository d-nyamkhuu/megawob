env.widget({
  task: 'use-text-editor',
  site: 'design-use-text-editor-autocomplete-01',
  name: 'design',
  split: 'train',
  scenarios: ['autocomplete'],
  traits: { doc: 'code' },
  template: 'use-text-editor/classic',
  design: {
    // Prefer the full stage width; the template clamps this to the available room.
    minWidth: 1672,
    parts: {
      metrics: (base) => (ctx, box, controls) => {
        // Keep the status strip in flow above the code, before geometry is measured.
        controls.card.insertBefore(controls.status, controls.strip);
        const metrics = base(ctx, box, controls);
        const chromeHeight = controls.tabs.offsetHeight + controls.strip.offsetHeight + controls.status.offsetHeight + 2;
        metrics.bodyH = Math.max(metrics.bodyH, box.h - 12 - chromeHeight);
        controls.body.style.height = `${metrics.bodyH}px`;
        controls.code.style.height = `${metrics.bodyH}px`;
        return metrics;
      },
    },
  },
});
