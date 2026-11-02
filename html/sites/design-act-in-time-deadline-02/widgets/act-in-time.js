// Design on templates/act-in-time/base.js: the base site's act-in-time widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-deadline-02',
  name: 'design',
  split: 'train',
  scenarios: ['deadline'],
  template: 'act-in-time/base',
  design: {
    parts: {
      buildDeadline: (base) => function (ctx, frame) {
        const view = base(ctx, frame);
        const row = frame.body.querySelector('.ut-row, .ut-chips2');
        // Keep live choices beside the countdown, clear of its labels and bar.
        Object.assign(row.style, {
          position: 'absolute', left: '52%', right: '4.5%', top: '70%',
          flexWrap: 'wrap',
        });
        return view;
      },
    },
  },
});
