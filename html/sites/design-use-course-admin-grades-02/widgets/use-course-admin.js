// Design on the shared use-course-admin course workspace.
env.widget({
  task: 'use-course-admin',
  site: 'design-use-course-admin-grades-02',
  name: 'design',
  split: 'train',
  scenarios: ['grades'],
  template: 'use-course-admin/workspace',
  design: {
    inset: 0,
    narrowAt: 1100,
    parts: {
      styles: (base, S) => () => base()
        .replace('.lms-table th { position:sticky; top:0; z-index:1;', '.lms-table th {')
        + (S.ctx.size.height < 520 ? `
          .lms-head, .lms.compact .lms-head, .lms.slim .lms-head {
            height: 34px; padding: 3px 9px;
          }
          .lms-nav { height: 24px; }
          .lms-nav span { padding: 3px 2px; }
          .lms-tools { min-height: 30px; padding: 2px 8px; }
          .lms-context { min-height: 24px; padding: 2px 8px; }
          .lms.slim .lms-context { padding: 2px 7px; }
          .lms-foot { min-height: 24px; padding: 3px 8px; }
      ` : ''),
    },
  },
});
