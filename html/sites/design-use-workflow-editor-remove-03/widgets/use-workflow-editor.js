// Design on use-workflow-editor/editor; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-workflow-editor',
  site: 'design-use-workflow-editor-remove-03',
  name: 'design',
  split: 'train',
  scenarios: ['remove'],
  template: 'use-workflow-editor/editor',
  design: {
    parts: {
      // The step palette and summary live in the site frame; the editor shows the graph only,
      // without its workspace navigation, step inspector or execution history.
      palette: (base, S) => (ctx) => {
        base(ctx);
        S.els.palette.remove();
      },
      overview: (base, S) => (ctx) => {
        base(ctx);
        S.els.overviewTitle.closest('.af-overview').remove();
      },
      executions: (base, S) => (ctx) => {
        base(ctx);
        S.els.executions.remove();
      },
    },
  },
});
