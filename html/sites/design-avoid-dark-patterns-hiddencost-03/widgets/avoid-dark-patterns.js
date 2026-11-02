// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-hiddencost-03',
  name: 'design',
  split: 'train',
  scenarios: ['hiddencost'],
  template: 'avoid-dark-patterns/browser',
  design: {
    font: '13.5px/1.38 "Courier New", monospace',
    windowRadius: '0',
    windowShadow: 'none',
    parts: {
      paint: (base, S) => function (model) {
        const compact = S.win.classList.contains('c2');
        const result = base(model);
        // Compaction can hide the tab strip when a new task screen needs room.
        if (compact !== S.win.classList.contains('c2')) S.ctx.reanchor();
        return result;
      },
    },
  },
});
