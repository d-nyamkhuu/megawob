// This design uses a taller, smaller pie with a proportional hub and three-dot spread mark.
env.widget({
  task: 'click-control',
  site: 'design-click-control-pie-09',
  name: 'design',
  split: 'train',
  scenarios: ['pie'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    pieMin: 140,
    pieHSub: 12,
    innerFrac: 0.154,
    knobR: null,
    parts: {
      pieInner: () => (S) => Math.round(S * 0.154),
      plus: (base, S) => (spread, c, size) => {
        const util = S.ctx.util;
        const dot = size * 0.047;
        return util.svg('path', {
          d: `M${c - dot} ${c}h.01M${c} ${c}h.01M${c + dot} ${c}h.01`,
          class: 'uc-spread-i',
        }, spread);
      },
    },
  },
});
