// Design of this site on the click-control/controls template (templates/click-control/controls.js): memphis-style pastel gradient slices with rounded corners and cream gutters.
(function () {
  'use strict';
  const COLORS = [
    ['#c8a6fb', '#bca0f5'], ['#ff989e', '#ff808a'],
    ['#a0eac1', '#8fe0b4'], ['#ffe998', '#ffe181'],
    ['#98dbf7', '#81ccf2'], ['#fac5d9', '#f5b6d0'],
  ];
  env.widget({
    task: 'click-control',
    site: 'design-click-control-pie-11',
    name: 'design',
    split: 'train',
    scenarios: ['pie'],
    traits: { menuOpen: ['hover', 'click'] },
    template: 'click-control/controls',
    design: {
      pieMax: 464,
      innerFrac: .15,
      outerInset: 2,
      parts: {
        pieDefs: () => (ctx, svg) => {
          const { util } = ctx;
          const defs = util.svg('defs', {}, svg);
          COLORS.forEach((pair, i) => {
            const gradient = util.svg('linearGradient', { id: `memphis-sector-${i}`, x1: '0%', y1: '0%', x2: '90%', y2: '100%' }, defs);
            util.svg('stop', { offset: '0%', 'stop-color': pair[0] }, gradient);
            util.svg('stop', { offset: '100%', 'stop-color': pair[1] }, gradient);
          });
        },
        slicePath: () => ({ pt, a0, a1, outer, inner, w, S }) => {
          const halfGap = S * .018;
          const outerGap = Math.asin(halfGap / outer) * 180 / Math.PI;
          const innerGap = Math.asin(halfGap / inner) * 180 / Math.PI;
          const round = S * .012;
          const outerRound = round / outer * 180 / Math.PI;
          const innerRound = round / inner * 180 / Math.PI;
          const p0 = pt(a0 + outerGap, outer);
          const p1 = pt(a1 - outerGap, outer);
          const p2 = pt(a1 - innerGap, inner);
          const p3 = pt(a0 + innerGap, inner);
          const inset = (a, b) => {
            const f = round / Math.hypot(b[0] - a[0], b[1] - a[1]);
            return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
          };
          const arc0 = pt(a0 + outerGap + outerRound, outer);
          const arc1 = pt(a1 - outerGap - outerRound, outer);
          const arc2 = pt(a1 - innerGap - innerRound, inner);
          const arc3 = pt(a0 + innerGap + innerRound, inner);
          const big = w > 180 ? 1 : 0;
          const d = `M${arc0}A${outer} ${outer} 0 ${big} 1 ${arc1}Q${p1} ${inset(p1, p2)}L${inset(p2, p1)}Q${p2} ${arc2}A${inner} ${inner} 0 ${big} 0 ${arc3}Q${p3} ${inset(p3, p0)}L${inset(p0, p3)}Q${p0} ${arc0}Z`;
          return d;
        },
        sliceDecor: () => (ctx, g, p, d, i) => {
          p.style.fill = `url(#memphis-sector-${i % COLORS.length})`;
        },
        labelRadius: () => (inner, outer, S) => (inner + outer) / 2 + S * .025,
        knobRadius: () => (S) => S * .116,
        plus: (base, S) => (spread, c, size) => (
          S.ctx.util.svg('path', { d: `M${c - size * .043} ${c}h${size * .086}M${c} ${c - size * .043}v${size * .086}`, class: 'uc-spread-i' }, spread)
        ),
      },
    },
  });
})();
