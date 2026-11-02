// Adds goal-independent palette metadata to the shared widget.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-color-09',
  name: 'design',
  split: 'train',
  scenarios: ['color'],
  template: 'read-figure/scene',
  design: {
    parts: {
      begin: (base, S) => (ctx) => {
        base(ctx);
        document.querySelector('.kv span:last-child').textContent = String(S.spec.hex.length);
      },
      widget: (base, S) => (ctx) => {
        base(ctx);
        const sample = S.scene.querySelector('.sample');
        const detail = S.ctx.util.el('div', 'sample-detail', sample);
        S.ctx.util.el('strong', '', detail, 'Palette');
        S.ctx.util.el('div', 'sample-hex', detail, S.spec.hex.length + ' colors');
        S.ctx.util.el('div', 'sample-rgb', detail, 'RGB color space');
      },
    },
  },
});
