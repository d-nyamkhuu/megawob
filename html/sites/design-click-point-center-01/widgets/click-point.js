// Design of this site on the click-point/board template (templates/click-point/board.js): the plain drawn look
// through a camera that frames the figure in a blank canvas; the answer box in the frame follows the marker.
env.widget({
  task: 'click-point',
  site: 'design-click-point-center-01',
  name: 'design',
  split: 'train',
  scenarios: ['center'],
  template: 'click-point/board',
  design: {
    clear: true,
    camera: true,
    cameraMargin: 2,
    placeCard: 'none',
    plainLook: true,
    style: { sw: 3, serif: false },
    alwaysLabels: true,
    parts: {
      // Keep the undistorted figure in the reference's generous blank canvas.
      frame: (base, S) => (W, H) => {
        base(W, H);
        S.scale = Math.min(W * 0.245, H * 0.595) / (2 * S.spec.r);
        S.origin = [S.spec.c[0] - (W * 0.4967) / S.scale, S.spec.c[1] - (H * 0.4718) / S.scale];
      },
      readout: () => (p) => {
        const answer = document.querySelector('.answer-body');
        if (answer) {
          answer.querySelector('.answer-state').textContent = p ? 'Point selected.' : 'No point selected yet.';
          answer.querySelectorAll('.coordinate-value').forEach((value, i) => {
            value.textContent = p ? p[i].toFixed(3) : '—';
          });
        }
      },
    },
  },
});
