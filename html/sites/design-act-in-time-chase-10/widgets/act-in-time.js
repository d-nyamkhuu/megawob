// Uses this site's elapsed-time wording while sharing the chase widget implementation.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-chase-10',
  name: 'design',
  split: 'train',
  scenarios: ['chase'],
  template: 'act-in-time/arena',
  design: {
    elapsedLabel: 'Elapsed time',
    parts: {
      metricValue: (base, S) => (value, total) => `${S.P.sec1(value)} / ${S.P.sec1(total)} seconds`,
    },
  },
});
