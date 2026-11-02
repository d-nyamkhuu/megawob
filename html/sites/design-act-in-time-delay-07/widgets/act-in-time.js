// This design keeps the task-layer element used by the original site instead of the template's process strip.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-delay-07',
  name: 'design',
  split: 'train',
  scenarios: ['delay'],
  template: 'act-in-time/arena',
  design: {
    parts: {
      beforeBuild: () => (ctx, f) => {
        ctx.util.el('div', 'xp-task-layer', f.body);
      },
    },
  },
});
