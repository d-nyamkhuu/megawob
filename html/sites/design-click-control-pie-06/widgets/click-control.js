// Design of this site on click-control/controls: CAD-style pie sizing, sectors, gradients, and hub.
(function () {
  'use strict';

  let pieStart = 0;

  env.widget({
    task: 'click-control',
    site: 'design-click-control-pie-06',
    name: 'design',
    split: 'train',
    scenarios: ['pie'],
    traits: { menuOpen: ['hover', 'click'] },
    template: 'click-control/controls',
    design: {
      pieMin: 120,
      pieMax: 336,
      pieHSub: 34,
      innerFrac: 0.195,
      knobR: null,
      gapOuter: 1.6,
      gapInner: 1.6,
      parts: {
        pieSize: (base) => (r, ctx) =>
          Math.max(120, Math.min(336, Math.floor(r.height) - 34, Math.floor(r.width), Math.floor(ctx.size.width))),
        pieAreaMade: () => (ctx, area, size) => area.style.setProperty('--pie-size', size + 'px'),
        pieDefs: () => (ctx, svg) => {
          const defs = ctx.util.svg('defs', {}, svg);
          const shade = ctx.util.svg('linearGradient', { id: 'cad-sector', x1: '0', y1: '0', x2: '1', y2: '1' }, defs);
          ctx.util.svg('stop', { offset: '0', 'stop-color': '#435666' }, shade);
          ctx.util.svg('stop', { offset: '1', 'stop-color': '#354454' }, shade);
          const blue = ctx.util.svg('linearGradient', { id: 'cad-blue', x1: '0', y1: '0', x2: '1', y2: '1' }, defs);
          ctx.util.svg('stop', { offset: '0', 'stop-color': '#2966a8' }, blue);
          ctx.util.svg('stop', { offset: '1', 'stop-color': '#185398' }, blue);
        },
        slicePath: (base, state) => (args) => {
          if (args.i === 0) pieStart = args.a0 + args.w / 2 - state.D.gapOuter;
          return base(args);
        },
        slicesDone: (base, state) => (ctx, group, slices, size) => {
          if (!slices.length) return;
          const offset = size * 0.035;
          const dx = offset * Math.sin((pieStart * Math.PI) / 180);
          const dy = -offset * Math.cos((pieStart * Math.PI) / 180);
          const transform = `translate(${dx} ${dy})`;
          slices[0].setAttribute('transform', transform);
          if (group.children[1]) group.children[1].setAttribute('transform', transform);
        },
        plus: (base, state) => (spread, c, size) => {
          const arm = size * 0.085;
          return state.ctx.util.svg(
            'path',
            { d: `M${c - arm} ${c}h${arm * 2}M${c} ${c - arm}v${arm * 2}`, class: 'uc-spread-i' },
            spread,
          );
        },
      },
    },
  });
})();
