// Design on the use-smart-home/classic console template.
env.widget({
  task: 'use-smart-home',
  site: 'design-use-smart-home-playlist-04',
  name: 'design',
  split: 'train',
  scenarios: ['playlist'],
  template: 'use-smart-home/classic',
  design: {
    frameInset: 4,
    minHeight: 150,
    rowMin: 18,
    parts: {
      // The 1994 console has no status strip or tab row under the library header: the queue gets that height.
      toolbar: () => () => {},
      statusbar: () => () => {},
    },
  },
});
