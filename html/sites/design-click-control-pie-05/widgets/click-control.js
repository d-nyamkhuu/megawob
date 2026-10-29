// Design of this site on click-control/controls: a wide pie with a proportional hub and labels.
env.widget({
  task: 'click-control',
  site: 'design-click-control-pie-05',
  name: 'design',
  split: 'train',
  scenarios: ['pie'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    pieMax: 444,
    pieWMul: 0.266,
    innerFrac: 0.152,
    knobR: null,
    parts: {
      labelRadius: () => (inner, outer) => outer * 0.68,
      plus: (base, state) => (spread, c, size, inner) => {
        const arm = inner * 0.23;
        return state.ctx.util.svg(
          'path',
          { d: `M${c - arm} ${c}h${2 * arm}M${c} ${c - arm}v${2 * arm}`, class: 'uc-spread-i' },
          spread,
        );
      },
    },
  },
});
