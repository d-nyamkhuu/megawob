// Full-stage fitted board, plain backdrop, black endpoints, and fixed endpoint labels.
env.widget({
  task: 'click-point',
  site: 'design-click-point-midpoint-01',
  name: 'design',
  split: 'train',
  scenarios: ['midpoint'],
  traits: { aspect: 1.4 },
  template: 'click-point/board',
  design: {
    camera: true,
    cameraMargin: 10,
    frameFill: [1, 1],
    framePad: 0.09,
    placeCard: 'none',
    gridPlain: false,
    asideReadout: true,
    dot: null,
    labelAt: { A: [-2.25, 40], B: [-0.85, 40] },
    style: {
      grid: 'plain',
      sw: 2,
      point: 'dot',
      guide: true,
      angleMark: false,
      rayEnd: 'arrow',
      minDash: '2 5',
      minFill: false,
      fill: 'var(--fg)',
      edges: false,
      dashOutline: false,
      serif: false,
    },
    parts: {
      midSegment: (base, S) => (util, g) => {
        if (S.style.guide) {
          S.P.line(util, g, S.spec.a, S.spec.b, {
            stroke: 'var(--muted)',
            'stroke-width': 1.5,
            'stroke-dasharray': '6 6',
            opacity: 0.8,
          });
        }
      },
    },
  },
});
