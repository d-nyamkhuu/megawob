// Design of this site on the click-point/board template (templates/click-point/board.js): a plain look at a
// wide board (height up to the stage), blue hollow point A, black ink B, labels always shown below the points,
// and the frame's delete control enabled only while a point is placed.
env.widget({
  task: 'click-point',
  site: 'design-click-point-right-angle-08',
  name: 'design',
  split: 'train',
  scenarios: ['right-angle'],
  traits: { aspect: 1.9 },
  template: 'click-point/board',
  design: {
    alwaysC: false,
    style: {
      grid: 'plain', sw: 3, point: 'dot', guide: false, minDash: '13 8', minFill: false, serif: false, labelTurn: 0.9,
    },
    hollowA: 'always',
    hollowDot: { r: 7, fill: '#0a1ee0', stroke: '#0a1ee0', 'stroke-width': 1 },
    dotRadii: [8.5, 7.5],
    minCircle: { stroke: 'var(--fg)', 'stroke-width': 1.7 },
    labelAt: { A: [Math.PI / 2, 28], B: [Math.PI / 2, 28] },
    parts: {
      boardHeight: (base, S) => (fit) => Math.min(fit, S.ctx.size.height),
      readout: () => (p) => {
        const deleteButton = document.querySelector('.xp-del');
        if (deleteButton) deleteButton.disabled = !p;
      },
    },
  },
});
