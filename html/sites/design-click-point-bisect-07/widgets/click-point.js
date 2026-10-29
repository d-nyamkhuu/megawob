// Bisect board design: use the shared camera, plain angle drawing, labels, Clear control, and answer readout.
env.widget({
  task: 'click-point',
  site: 'design-click-point-bisect-07',
  name: 'design',
  split: 'train',
  scenarios: ['bisect'],
  template: 'click-point/board',
  design: {
    dotRadii: [9, 7.5],
    arrow: { back: 22, half: 9, notch: 14 },
    parts: {
      bisectLabels: (base, S) => (util, g) => {
        const { spec, style, P } = S;
        const [r0, r1] = spec.rays;
        P.label(util, g, P.rayMark(r0), r0.angle, 'A', 28);
        P.label(util, g, P.rayMark(r1), r1.angle, 'B', 28);
        P.label(util, g, spec.v, spec.bisector + Math.PI + style.labelTurn, 'V', 30);
      },
    },
  },
});
