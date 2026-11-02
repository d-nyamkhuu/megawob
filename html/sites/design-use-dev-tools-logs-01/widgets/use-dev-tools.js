// Reference workspace design; shared widget: templates/use-dev-tools/workspace.js.
env.widget({
  task: 'use-dev-tools',
  site: 'design-use-dev-tools-logs-01',
  name: 'design',
  split: 'train',
  scenarios: ['logs'],
  template: 'use-dev-tools/workspace',
  design: {
    parts: {
      // This design drops the template's workspace top bar and scenario tab strip.
      top: () => () => {},
      tabs: () => () => {},
      detail: (base) => (ctx, content) => {
        const made = base(ctx, content);
        const title = env.util.el('div', 'logs-detail-title', null, '▤  Event Details');
        made.detail.prepend(title);
        return made;
      },
    },
  },
});
