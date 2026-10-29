// Design of this site on the click-point/board template (templates/click-point/board.js): the plain drawn look
// through a camera; notched arrows, marks at 87% of each ray and a dark slate backdrop gradient in the defs.
env.widget({
  task: 'click-point',
  site: 'design-click-point-bisect-03',
  name: 'design',
  split: 'train',
  scenarios: ['bisect'],
  template: 'click-point/board',
  design: {
    style: { sw: 2.4, minDash: '7 7' },
    dotRadii: [8.5, 7],
    arrow: { back: 20, half: 6, notch: 14 },
    rayMarks: { frac: 0.87, early: true },
    labelAt: { A: [-Math.PI / 2 - 0.5, 27], B: [Math.PI / 2 + 0.5, 27] },
    parts: {
      backdrop: (base, S) => (util, W, H) => {
        const defs = util.svg('defs', {}, S.svg);
        const slate = util.svg('radialGradient', { id: 'cp-slate', cx: '47%', cy: '47%', r: '75%' }, defs);
        util.svg('stop', { offset: '0%', 'stop-color': '#374052' }, slate);
        util.svg('stop', { offset: '100%', 'stop-color': '#323949' }, slate);
        return base(util, W, H);
      },
    },
  },
});
