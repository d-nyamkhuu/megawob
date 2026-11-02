// Adjustment rows with icons, decorative controls, sampled look, and responsive log tracks.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-log-12',
  name: 'design',
  split: 'train',
  scenarios: ['log'],
  template: 'set-slider/classic',
  design: {
    ticks: null,
    readout: null,
    native: null,
    rowClass: 'adjustment-row',
    parts: {
      label: (base) => (ctx, root, index, s, g) => {
        const label = base(ctx, root, index, s, g);
        if (!g.vertical) {
          const ico = ctx.util.svg('svg', {
            viewBox: '0 0 28 32', class: 'adjustment-icon drop-icon',
            fill: 'none', stroke: 'currentColor', 'stroke-width': 2,
          }, root);
          ctx.util.svg('path', {
            d: 'M14 2C11 8 4 15 4 20a10 10 0 0020 0C24 15 17 8 14 2zM8 20q6 10 12 0',
          }, ico);
        }
        return label;
      },
      group: (base) => (ctx, layout) => {
        const group = base(ctx, layout);
        const { util } = ctx;
        if (layout.anyLog) {
          for (const label of ['Brightness', 'Contrast']) {
            const row = util.el('div', 'decor-adjustment adjustment-row', group);
            util.el('div', 'slc-label', row, label);
            const ico = util.svg('svg', {
              viewBox: '0 0 28 28', class: 'adjustment-icon decorative-icon',
              fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8,
              'stroke-linecap': 'round',
            }, row);
            util.svg('circle', { cx: 14, cy: 14, r: label === 'Brightness' ? 6 : 10 }, ico);
            util.svg('path', {
              d: label === 'Brightness'
                ? 'M14 1v3m0 20v3M1 14h3m20 0h3M5 5l2 2m14 14 2 2M5 23l2-2M21 7l2-2'
                : 'M14 4a10 10 0 010 20z',
              fill: label === 'Contrast' ? 'currentColor' : 'none',
            }, ico);
            const track = util.el('div', 'decor-track', row);
            util.el('span', 'decor-fill', track);
            util.el('span', 'decor-thumb', track);
            util.el('div', 'slc-readout', row, '0');
          }
        }
        return group;
      },
      geometry: () => (ctx, g, s, i, { size, anyLog, vertical }) => {
        if (anyLog && !vertical) {
          g.length = Math.max(80, Math.floor(size.width - Math.min(60, size.width * .12) - Math.min(100, size.width * .205) - 24));
          g.thumb = Math.max(18, Math.min(28, size.width * .056));
          g.readout = true;
          g.ticks = true;
        }
      },
      placed: () => () => {},
    },
  },
});
