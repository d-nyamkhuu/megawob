// Design of this site on the click-control/controls template (templates/click-control/controls.js): a soft paper pie with a rim gradient and a context-menu gesture that opens it.
env.widget({
  task: 'click-control',
  site: 'design-click-control-pie-02',
  name: 'design',
  split: 'train',
  scenarios: ['pie'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    pieMin: 180,
    pieMax: 426,
    pieHSub: 24,
    pieWSub: 60,
    knobR: null,
    parts: {
      pieDefs: () => (ctx, svg, S) => {
        const { util } = ctx;
        const defs = util.svg('defs', {}, svg);
        const gradient = util.svg('linearGradient', { id: 'pie-surface', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: S * 0.8, y2: S }, defs);
        util.svg('stop', { offset: '0%', 'stop-color': '#f3f4f5' }, gradient);
        util.svg('stop', { offset: '100%', 'stop-color': '#eeece8' }, gradient);
        const rim = util.svg('linearGradient', { id: 'pie-rim', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 0, y2: S }, defs);
        util.svg('stop', { offset: '0%', 'stop-color': '#ffffff' }, rim);
        util.svg('stop', { offset: '65%', 'stop-color': '#f9f8f5' }, rim);
        util.svg('stop', { offset: '100%', 'stop-color': '#d4d0c9' }, rim);
      },
      pieInner: () => (S) => (S * 58) / 426,
      labelRadius: () => (inner, outer) => outer * 0.7,
      slicesDone: () => (ctx, g, slices, S) => {
        const c = S / 2;
        const outer = c - 6;
        ctx.util.svg('circle', { cx: c, cy: c, r: outer, fill: 'none', stroke: 'url(#pie-rim)', 'stroke-width': 1.6, 'pointer-events': 'none' }, g);
      },
      plus: (base, S) => (spread, c, size, inner) => {
        const arm = Math.min(13, inner * 0.23);
        return S.ctx.util.svg('path', { d: `M${c - arm} ${c}h${arm * 2}M${c} ${c - arm}v${arm * 2}`, class: 'uc-spread-i' }, spread);
      },
      // The canvas also supports the reference's context-menu gesture; the hub and oracle stay unchanged.
      pieBound: () => (ctx, content, up) => {
        (content.closest('.canvas') || ctx.stage).addEventListener('contextmenu', (e) => {
          e.preventDefault();
          up({ open: true });
        });
      },
    },
  },
});
