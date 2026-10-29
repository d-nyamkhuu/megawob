// Reference workspace design; shared widget: templates/use-dev-tools/workspace.js.
env.widget({
  task: 'use-dev-tools',
  site: 'design-use-dev-tools-rerun-02',
  name: 'design',
  split: 'train',
  scenarios: ['rerun'],
  template: 'use-dev-tools/workspace',
  design: {
    inset: 4, bottomInset: 8, font: 'Arial,sans-serif', radius: 1,
    parts: {
      // Let the graph scroll with the jobs instead of consuming the list's height.
      list: (base, S) => function (ctx, main) {
        const list = base(ctx, main);
        const graph = main.querySelector(':scope > .dv-graph');
        if (graph) list.pane.prepend(graph);
        return list;
      },
    },
  },
});
