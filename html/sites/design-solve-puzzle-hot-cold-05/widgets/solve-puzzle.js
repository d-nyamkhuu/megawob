// This design matches the shared hot-cold template defaults.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-hot-cold-05',
  name: 'design',
  split: 'train',
  scenarios: ['hot-cold'],
  template: 'solve-puzzle/hot-cold',
  design: {
    parts: {
      status: (_base, S) => (model) => {
        if (S.st && S.st.status) S.st.status.innerHTML = `<i>Clicks:</i><span>${model.probes.length}</span>`;
      },
    },
  },
});
