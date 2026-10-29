// This design places its metrics in the footer and ignores synthetic pointer motion.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-chase-08',
  name: 'design',
  split: 'train',
  scenarios: ['chase'],
  template: 'act-in-time/arena',
  design: {
    sideTarget: '.ds-footer',
    sidePlacement: 'prepend',
    motionOnly: true,
    parts: {
      resizeBoard: (base) => (ctx, f) => {
        base(ctx, f);
        const board = f.body.querySelector('.ut-board');
        if (board) board.style.setProperty('--ut-aspect', ctx.spec.A);
      },
    },
  },
});
