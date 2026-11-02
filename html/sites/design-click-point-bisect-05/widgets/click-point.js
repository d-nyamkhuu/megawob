// Design of this site on the click-point/board template (templates/click-point/board.js): the plain drawn look
// through a camera; a solid exclusion circle, ray ends capped with a dot and a stub before the arrow, and a
// coordinate readout in the frame.
env.widget({
  task: 'click-point',
  site: 'design-click-point-bisect-05',
  name: 'design',
  split: 'train',
  scenarios: ['bisect'],
  template: 'click-point/board',
  design: {
    minCircle: { class: 'cp-exclusion', stroke: '#2e2d30', 'stroke-width': 1.8, 'stroke-dasharray': '5 7', opacity: 1 },
    labelAt: { A: [-Math.PI / 3, 29], B: [-Math.PI / 3, 29] },
    parts: {
      arrowTip: (base, S) => (util, g, end, ray) => {
        const endpoint = S.P.px(end);
        util.svg('circle', { cx: S.f1(endpoint[0]), cy: S.f1(endpoint[1]), r: 6.7, fill: '#2e2d30' }, g);
        const tip = S.at(endpoint, ray.angle, 23);
        const tipBack = S.at(endpoint, ray.angle, 5);
        util.svg('line', {
          x1: S.f1(tipBack[0]), y1: S.f1(tipBack[1]), x2: S.f1(tip[0]), y2: S.f1(tip[1]), stroke: '#2e2d30', 'stroke-width': 3,
        }, g);
        return tip;
      },
      readout: () => (p) => {
        const readout = document.querySelector('.coords');
        if (readout) readout.textContent = p ? 'x:' + p[0].toFixed(2) + '  y:' + p[1].toFixed(2) : 'x:  —     y:  —';
      },
    },
  },
});
