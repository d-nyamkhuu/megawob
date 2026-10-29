// Adds the calibration login note and update checkbox to the shared popup.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-popup-04',
  name: 'design',
  split: 'train',
  scenarios: ['popup'],
  template: 'act-in-time/arena',
  design: {
    loginTitle: 'Login Required',
    loginSubtitle: 'You must be logged in to access calibration tools.',
    openPending: true,
    parts: {
      loginIntro: (base) => (ctx, main, card) => {
        const taskNote = document.querySelector('.ds-header-note');
        if (taskNote) card.appendChild(taskNote);
        return base(ctx, main, card);
      },
      dialogContent: () => (ctx, box) => {
        const { util } = ctx;
        util.el('h3', '', box, 'Update Notice');
        util.el('p', '', box, 'A newer calibration database is available (v1.5). Install it now?');
        const checkline = util.el('div', 'ut-checkline', box);
        util.el('span', '', checkline, '□');
        util.el('span', '', checkline, "Don't show this again");
      },
    },
  },
});
