// Site design on the shared slider template.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-log-11',
  name: 'design',
  split: 'train',
  scenarios: ['log'],
  template: 'set-slider/classic',
  design: {
    sampleLook: false, sampleLength: false, clear: true,
    thumb: 52, rail: 12, ticks: true, readout: true, native: false,
    minor: { log: true, vertical: true, cls: 'slc-tick slc-minor' },
    parts: {
      placed: () => () => {},
      limits: () => (ctx, { size, presetsH }) => ({
        maxV: Math.max(90, Math.min(440, Math.floor(size.height) - 145 - presetsH)),
        maxH: Math.max(160, Math.min(1800, Math.floor(size.width) - 114)),
      }),
      layout: () => (ctx, { vertical, n, group }) => {
        if (!vertical && n > 1) {
          group.style.setProperty('grid-template-columns', `repeat(${n}, minmax(0, 1fr))`, 'important');
          group.style.columnGap = '40px';
        }
      },
      parent: () => (ctx, { vertical, n, group }) => !vertical && n > 1 ? ctx.util.el('div', 'slc-extra-grid', group) : group,
      geometry: () => (ctx, g, s, i, { vertical, n }) => {
        if (!vertical && n > 1) g.length = (g.length - 40 * (n - 1)) / n;
      },
    },
  },
});
