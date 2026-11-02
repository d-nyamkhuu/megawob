// This design formats the current problem label with typographic operators.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-algebra-05',
  name: 'design',
  split: 'train',
  scenarios: ['algebra'],
  template: 'solve-puzzle/classic',
  design: {
    parts: {
      begin: (base, S) => () => {
        const s = S.spec;
        const currentProblem = document.querySelector('.problem-row.current span:last-child');
        if (currentProblem && s.expr)
          currentProblem.textContent = s.expr.replace(/\*/g, '×').replace(/\//g, '÷').replace(/-/g, '−');
      },
    },
  },
});
