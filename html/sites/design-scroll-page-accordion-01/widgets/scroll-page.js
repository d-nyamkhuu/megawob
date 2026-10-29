// Design on the shared scroll-page/longform template.
env.widget({
  task: 'scroll-page',
  site: 'design-scroll-page-accordion-01',
  name: 'design',
  split: 'train',
  scenarios: ['accordion'],
  template: 'scroll-page/longform',
  design: {
    parts: {
      rendered: (base) => (st) => {
        base(st);
        const judge = st.spec.judge;
        if (!judge || judge.mode !== 'impossible' || !Array.isArray(judge.what)) return;
        // Prefer the existing prose alias for refusals: a FAQ's question mark
        // otherwise makes the free-reply grader interpret the refusal as a question.
        // Keep every accepted name, including the exact question, unchanged.
        const preferred = judge.what.findIndex((name) => !String(name).includes('?'));
        if (preferred > 0) judge.what.unshift(judge.what.splice(preferred, 1)[0]);
      },
    },
  },
});
