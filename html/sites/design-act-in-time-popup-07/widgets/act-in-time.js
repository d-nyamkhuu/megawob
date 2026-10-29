// Keeps popup-07's pending notice visible and its reminder content while omitting geometric decoration.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-popup-07',
  name: 'design',
  split: 'train',
  scenarios: ['popup'],
  template: 'act-in-time/arena',
  design: {
    geometric: false,
    pendingVisible: true,
    parts: {
      dialogContent: () => (ctx, box) => {
        const { util } = ctx;
        util.el('h3', '', box, 'Reminder');
        util.el('span', 'ds-warning', box, '!');
        util.el('p', '', box, 'System maintenance is scheduled for tonight at 10:00 PM.');
        util.el('p', 'ds-warning-copy', box, 'You may experience brief disruptions.');
      },
    },
  },
});
