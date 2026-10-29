// Design of this site on click-control/controls: a larger pie with a proportional hub and warm paper/olive gradients.
env.widget({
  task: 'click-control',
  site: 'design-click-control-pie-07',
  name: 'design',
  split: 'train',
  scenarios: ['pie'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    pieMin: 160,
    pieMax: 482,
    pieHSub: 72,
    innerFrac: 76 / 482,
    knobR: null,
    parts: {
      pieDefs: () => (ctx, svg, S) => {
        const { util } = ctx;
        const defs = util.svg('defs', {}, svg);
        const paper = util.svg(
          'radialGradient',
          { id: 'atelier-sector', gradientUnits: 'userSpaceOnUse', cx: S / 2, cy: S / 2, r: S / 2 },
          defs,
        );
        util.svg('stop', { offset: '0%', 'stop-color': '#fcfaf5' }, paper);
        util.svg('stop', { offset: '78%', 'stop-color': '#f9f7f1' }, paper);
        util.svg('stop', { offset: '100%', 'stop-color': '#f0eee4' }, paper);
        const olive = util.svg('radialGradient', { id: 'atelier-knob', cx: '.4', cy: '.3', r: '.8' }, defs);
        util.svg('stop', { offset: '0%', 'stop-color': '#565832' }, olive);
        util.svg('stop', { offset: '100%', 'stop-color': '#464923' }, olive);
      },
      plus: (base, S) => (spread, c, size) => {
        const arm = (size * 21) / 482;
        return S.ctx.util.svg('path', {
          d: `M${c - arm} ${c}h${2 * arm}M${c} ${c - arm}v${2 * arm}`,
          class: 'uc-spread-i',
        }, spread);
      },
    },
  },
});
