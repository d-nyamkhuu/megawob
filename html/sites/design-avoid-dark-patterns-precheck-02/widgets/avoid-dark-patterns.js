// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-precheck-02',
  name: 'design',
  split: 'train',
  scenarios: ['precheck'],
  template: 'avoid-dark-patterns/browser',
  design: {
    parts: {
      // The native window already supplies its title and application frame.
      // Build the decorative tabs first to preserve all seeded draws and labels.
      tabs: (base, S) => (ctx) => {
        base(ctx);
        S.tabTitle.parentElement.parentElement.remove();
      },
      header: () => () => null,
    },
  },
});
