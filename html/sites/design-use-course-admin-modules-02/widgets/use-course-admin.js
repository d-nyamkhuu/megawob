// Design on the shared use-course-admin course workspace.
env.widget({
  task: 'use-course-admin',
  site: 'design-use-course-admin-modules-02',
  name: 'design',
  split: 'train',
  scenarios: ['modules'],
  template: 'use-course-admin/workspace',
  design: {
    parts: {
      // The staff stamp, the "approved lesson sequence" line, recent activity and course resources are not drawn.
      sourceStamp: () => () => {},
      activity: () => () => {},
      resources: () => () => {},
      modulesSource: (base, S) => () => {
        const el = S.util.el;
        S.P.icon(el('h3', '', S.source, 'Teaching outline'), 'layers');
        for (const u of S.spec.units) S.P.sourceUnit(u);
      },
    },
  },
});
