// Design on the shared scroll-page/longform template.
env.widget({
  task: 'scroll-page',
  site: 'design-scroll-page-accordion-03',
  name: 'design',
  split: 'train',
  scenarios: ['accordion'],
  template: 'scroll-page/longform',
  design: {
    parts: {
      rendered: (base) => function (st) {
        base(st);
        // Both aliases name the same missing FAQ. Prefer the existing statement
        // form so a free-text refusal is not mistaken for a question.
        const judge = st.spec.judge;
        if (judge && judge.mode === 'impossible' && Array.isArray(judge.what)) {
          const statement = judge.what.findIndex((name) => !name.includes('?'));
          if (statement > 0) judge.what.unshift(judge.what.splice(statement, 1)[0]);
        }
      },
    },
  },
});
