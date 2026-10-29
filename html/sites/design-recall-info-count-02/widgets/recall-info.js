// Design on recall-info/classic; defaults preserve the scaffolded base widget.
env.widget({
  task: 'recall-info',
  site: 'design-recall-info-count-02',
  name: 'design',
  split: 'train',
  scenarios: ['count'],
  template: 'recall-info/classic',
  design: {
    parts: {
      build: (base) => (ctx, work, app) => {
        // Drawing the first viewport must preserve the episode's incoming state.
        // Later refreshes, including scrollbar and wheel actions, record progress.
        let interactive = false;
        const buildCtx = Object.create(ctx, {
          patch: {
            value: (delta) => {
              const initialRows = !interactive && Object.keys(delta).length === 1 && 'reached' in delta;
              if (!initialRows) ctx.patch(delta);
            },
          },
        });
        const view = base(buildCtx, work, app);
        interactive = true;
        return view;
      },
    },
  },
});
