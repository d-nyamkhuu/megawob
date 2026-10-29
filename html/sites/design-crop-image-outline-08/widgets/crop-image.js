// This design uses the outline preset's stage fit and crop inspector.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-outline-08',
  name: 'design',
  split: 'train',
  scenarios: ['outline'],
  template: 'crop-image/box',
  design: {
    fitMode: 'stretch',
    resetLabel: 'Reset Crop',
    viewTitle: 'View',
    viewLabels: ['Show target rectangle'],
    targetLabel: 'Show target rectangle',
    parts: {
      inspectorTools: (base, S) => (ctx, inspector) => {
        const { util } = ctx;
        const moveTool = util.el('button', 'crop-tool crop-select', inspector, 'Select / Move');
        moveTool.type = 'button';
        moveTool.classList.add('active');
        const resizeTool = util.el('button', 'crop-tool crop-resize', inspector, 'Resize');
        resizeTool.type = 'button';
      },
      reset: (base, S) => (ctx, inspector) => {
        const restore = base(ctx, inspector);
        const zoom = ctx.util.el('div', 'crop-zoom');
        ctx.util.el('span', '', zoom, '100%');
        restore.after(zoom);
        return restore;
      },
    },
  },
});
