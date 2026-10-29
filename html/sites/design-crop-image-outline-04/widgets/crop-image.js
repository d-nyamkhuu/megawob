// This outline design stretches the image to the stage and adds target measurements.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-outline-04',
  name: 'design',
  split: 'train',
  scenarios: ['outline'],
  template: 'crop-image/box',
  design: {
    fitMode: 'stretch',
    inspectorTitle: 'Crop Box',
    parts: {
      inspected: (base, S) => (ctx) => {
        const { util } = ctx;
        const targetFields = util.el('section', 'crop-target-fields', document.querySelector('.shell'));
        util.el('h3', '', targetFields, 'Target (dashed outline)');
        for (const [key, value] of [
          ['X', Math.round(ctx.spec.target.l * S.W)],
          ['Y', Math.round(ctx.spec.target.t * S.H)],
          ['Width', Math.round((ctx.spec.target.r - ctx.spec.target.l) * S.W)],
          ['Height', Math.round((ctx.spec.target.b - ctx.spec.target.t) * S.H)],
        ]) {
          const label = util.el('label', 'crop-measurement', targetFields, key);
          util.el('output', '', label, String(value));
          util.el('span', '', label, 'px');
        }
      },
    },
  },
});
