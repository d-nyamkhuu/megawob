// Design of this site on the click-point/board template (templates/click-point/board.js): a blue-ink look on a
// board that fills the stage with no grid; big black points and a solid grey exclusion circle; the hint sits
// under the board in the stage, and the frame's progress line says whether the point is placed.
env.widget({
  task: 'click-point',
  site: 'design-click-point-right-angle-05',
  name: 'design',
  split: 'train',
  scenarios: ['right-angle'],
  template: 'click-point/board',
  design: {
    alwaysC: false,
    labelAt: null,
    alwaysLabels: false,
    style: {
      grid: 'dots', gridStep: 36, sw: 3.5, point: 'dot', guide: false, minDash: '8 8', minFill: false, serif: false,
      labelTurn: 0.5, fill: '#0033ff',
    },
    fitMargin: [8, 8],
    fillBoard: true,
    placeCard: 'draw',
    hint: 'stage',
    dot: { r: 10, fill: 'var(--fg)' },
    hollowDot: { r: 9, fill: 'var(--panel)', stroke: 'var(--fg)', 'stroke-width': 2.5 },
    minCircle: { stroke: '#8790aa', 'stroke-width': 2 },
    parts: {
      // The construction grid is painted across the complete workbench: the board has no backdrop at all.
      drawGrid: () => () => {},
      readout: () => (p) => {
        const progress = document.querySelector('.prog');
        if (progress) {
          progress.querySelector('span').textContent = p ? 'Placed' : 'Not placed';
          progress.querySelector('i').style.background = p ? '#0033ff' : '#aeb6c8';
        }
      },
    },
  },
});
