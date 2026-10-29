// Design of this site on click-control/controls: a wider, taller pie with a beveled face and oversized center control.
env.widget({
  task: 'click-control',
  site: 'design-click-control-pie-04',
  name: 'design',
  split: 'train',
  scenarios: ['pie'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    outerInset: 6,
    gapOuter: 0.65,
    pieMin: 220,
    pieMax: 10000,
    pieHMul: 0.68,
    pieHSub: 0,
    pieWMul: 0.426,
    pieWSub: 0,
    knobR: null,
    parts: {
      pieInner: () => (size, center) => Math.round(center * 0.42),
      pieDefs: () => (ctx, svg) => {
        const defs = ctx.util.svg('defs', {}, svg);
        const grad = ctx.util.svg('linearGradient', { id: 'sector-face', x1: '0', y1: '0', x2: '1', y2: '1' }, defs);
        ctx.util.svg('stop', { offset: '0', 'stop-color': '#a6a6b6' }, grad);
        ctx.util.svg('stop', { offset: '1', 'stop-color': '#777987' }, grad);
      },
      sliceDecor: () => (ctx, group, path, d) => {
        ctx.util.svg('path', { d, class: 'uc-sector-bevel', transform: 'translate(-1 -1)' }, group);
      },
      plus: () => (spread, center, size, inner) => (
        env.util.svg('path', { d: `M${center - 15} ${center}h30M${center} ${center - 15}v30`, class: 'uc-spread-i' }, spread)
      ),
    },
  },
});
