// Center board design: frame the circle, ring, disc, or arc tightly in the stage.
env.widget({
  task: 'click-point',
  site: 'design-click-point-center-11',
  name: 'design',
  split: 'train',
  scenarios: ['center'],
  traits: { shapes: ['arc'] },
  template: 'click-point/board',
  design: {
    camera: true,
    cameraMargin: 10,
    placeCard: 'none',
    clear: true,
    asideReadout: true,
    arcExtra: 0,
    style: {
      grid: 'plain',
      sw: 4,
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
      framePoints: (base, S) => () => {
        const { c, r, shape, ringWidth = 0 } = S.spec;
        const outerRadius = r + (shape === 'ring' ? ringWidth / 2 : 0);
        const pts = [];
        for (const dx of [-1, 1])
          for (const dy of [-1, 1]) pts.push([c[0] + dx * outerRadius * 1.12, c[1] + dy * outerRadius * 1.12]);
        return pts;
      },
      framePad: (base, S) => () => S.spec.r * 0.025,
    },
  },
});
