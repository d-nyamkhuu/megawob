// This design renames the dwell metric and keeps seconds explicit in both readouts.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-chase-05',
  name: 'design',
  split: 'train',
  scenarios: ['chase'],
  template: 'act-in-time/arena',
  design: {
    insideLabel: 'Time inside circle',
    parts: {
      metricValue: (base, S) => (value, total) => `${S.P.sec1(value)} s / ${S.P.sec1(total)} s`,
      resizeBoard: (base) => (ctx, f) => {
        base(ctx, f);
        const board = f.body.querySelector('.ut-board');
        if (board) board.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      },
    },
  },
});
