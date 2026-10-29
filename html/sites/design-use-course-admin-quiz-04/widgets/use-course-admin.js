// Design on the shared use-course-admin course workspace.
env.widget({
  task: 'use-course-admin',
  site: 'design-use-course-admin-quiz-04',
  name: 'design',
  split: 'train',
  scenarios: ['quiz'],
  template: 'use-course-admin/workspace',
  design: {
    // Question brief on the left (39%), the quiz on the right.
    sourceWidth: 39,
    sourceMin: 280,
    sourceMax: 100000,
    parts: {
      panes: (base, S) => () => {
        const el = S.util.el;
        S.source = el('aside', 'lms-source', S.work);
        S.main = el('div', 'lms-main', S.work);
      },
      // Not drawn: the activity feed, quiz settings, the Actions menu, the context bar (Section A picker, term, status) and the quiz title.
      activity: () => () => {},
      quizSettings: () => () => {},
      toolbar: (base, S) => () => {
        const el = S.util.el;
        S.tools = el('div', 'lms-tools', S.surface);
        el('strong', '', S.tools, S.D.names[S.spec.scenario]);
        S.note = el('span', 'lms-muted', S.tools);
      },
      context: () => () => {},
      quizHeading: (base, S) => () => {
        const el = S.util.el;
        const banner = el('div', 'lms-pane-heading', S.main), heading = el('div', '', banner);
        el('small', '', heading, 'Graded quiz / Assignment group: Assessments');
        el('span', 'lms-tag warn', banner, 'Draft');
      },
    },
  },
});
