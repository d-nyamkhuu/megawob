// Design of this site on click-control/controls: larger pie sizing, a scaled hub, and brushed metal bevel details.
env.widget({
  task: 'click-control',
  site: 'design-click-control-pie-03',
  name: 'design',
  split: 'train',
  scenarios: ['pie'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    pieMin: 100,
    pieMax: 364,
    pieHSub: 34,
    parts: {
      pieInner: () => (size) => Math.min(44, size * 0.125),
      pieDefs: () => (ctx, svg) => {
        const defs = ctx.util.svg('defs', {}, svg);
        const face = ctx.util.svg('linearGradient', { id: 'motif-pie-face', x1: '0', y1: '0', x2: '1', y2: '1' }, defs);
        ctx.util.svg('stop', { offset: '0', 'stop-color': '#b7b5af' }, face);
        ctx.util.svg('stop', { offset: '1', 'stop-color': '#c2c0ba' }, face);
        const hub = ctx.util.svg('linearGradient', { id: 'motif-pie-hub', x1: '0', y1: '0', x2: '1', y2: '1' }, defs);
        ctx.util.svg('stop', { offset: '0', 'stop-color': '#aeaca6' }, hub);
        ctx.util.svg('stop', { offset: '1', 'stop-color': '#94928c' }, hub);
      },
      sliceLabel: () => (ctx, g, tx, path, label, i, x, y, size) => {
        tx.style.fontSize = Math.min(31, size * 0.085) + 'px';
      },
      slicesDone: () => (ctx, g, slices) => {
        slices.forEach((p) => ctx.util.svg('path', {
          d: p.getAttribute('d'),
          class: 'motif-slice-bevel',
          transform: 'translate(-1.4 -1.4)',
          'pointer-events': 'none',
        }, g));
      },
      knobRadius: () => (size, inner) => inner - 1,
      hubBefore: () => (ctx, spread, c, size, inner) => {
        ctx.util.svg('circle', { cx: c, cy: c, r: inner + 1.5, class: 'motif-hub-bevel', 'pointer-events': 'none' }, spread);
      },
    },
  },
});
