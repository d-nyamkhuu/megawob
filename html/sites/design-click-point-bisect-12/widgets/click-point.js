// Design of this site on the click-point/board template (templates/click-point/board.js): the plain drawn look
// through a camera; open chevron arrows, marks at 75% of each ray, and a locate() that first reveals hidden controls.
env.widget({
  task: 'click-point',
  site: 'design-click-point-bisect-12',
  name: 'design',
  split: 'train',
  scenarios: ['bisect'],
  template: 'click-point/board',
  design: {
    style: { serif: false },
    dotRadii: [9, 8],
    arrow: { chevron: true, width: 3, round: false },
    rayMarks: { frac: 0.75 },
    labelAt: { A: [-Math.PI / 2, 30], B: [Math.PI / 2, 30] },
    parts: {
      locate: (base) => (t) => {
        if (!t || !t.point) return base(t);
        const reveal = document.querySelector('.show-controls:not(.revealed)');
        if (reveal) return env.util.center(reveal);
        return base(t);
      },
    },
  },
});
