// Moves the recovery bar into the action title tools when that dock is present.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-ascending-12',
  name: 'design',
  split: 'train',
  scenarios: ['ascending'],
  template: 'read-figure/scene',
  design: {
    parts: {
      recovered: (base, S) => (ctx, bar) => {
        const recoveryDock = document.querySelector('.action-title-tools');
        if (recoveryDock) recoveryDock.append(bar);
      },
    },
  },
});
