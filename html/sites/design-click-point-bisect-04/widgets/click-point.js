// Preserve this site's thicker plain rays, larger arrowheads, and labels below the vertex and ray marks.
env.widget({
  task: 'click-point',
  site: 'design-click-point-bisect-04',
  name: 'design',
  split: 'train',
  scenarios: ['bisect'],
  template: 'click-point/board',
  design: {
    plainLook: true,
    style: { sw: 4, minDash: '6 6', serif: false },
    dotRadii: [8.5, 8],
    arrow: { back: 18, half: 8 },
    parts: {
      drawBisect: (base, S) => (util, g) => {
        const { spec, style, scale, P } = S;
        P.minCircle(util, g, spec.v);
        P.bisectAngle(util, g);
        for (const ray of spec.rays) P.bisectRay(util, g, ray);
        P.point(util, g, spec.v);
        for (const ray of spec.rays) {
          const p = S.at(spec.v, ray.angle, Math.max(0, ray.len - 48 / scale));
          P.point(util, g, p);
          P.label(util, g, p, Math.PI / 2, ray === spec.rays[0] ? 'A' : 'B', 30);
        }
        P.label(util, g, spec.v, Math.PI / 2, 'V', 30);
      },
    },
  },
});
