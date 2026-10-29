// This design keeps the full-stage fitted camera and the site's lime rays with inset ray markers.
env.widget({
  task: 'click-point',
  site: 'design-click-point-bisect-06',
  name: 'design',
  split: 'train',
  scenarios: ['bisect'],
  template: 'click-point/board',
  design: {
    cameraMargin: 0,
    asideReadout: false,
    rayStroke: '#c1f477',
    style: { minDash: '7 6', serif: false },
    labelAt: { A: [-Math.PI / 2, 24], B: [-Math.PI / 2, 24] },
    arrow: { half: 5, fill: '#c1f477' },
    rayMarks: { frac: 0.8 },
    parts: {
      readout: () => (point) => {
        const readout = document.querySelector('.statusbar .pill');
        if (readout) readout.textContent = point
          ? `x: ${point[0].toFixed(3)}    y: ${point[1].toFixed(3)}`
          : 'x: 0.000    y: 0.000';
      },
    },
  },
});
