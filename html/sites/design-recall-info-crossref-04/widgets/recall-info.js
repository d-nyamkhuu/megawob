// Design on recall-info/classic; defaults preserve the scaffolded base widget.
env.widget({
  task: 'recall-info',
  site: 'design-recall-info-crossref-04',
  name: 'design',
  split: 'train',
  scenarios: ['crossref'],
  template: 'recall-info/classic',
  design: {
    parts: {
      // The window frame already supplies the title; preserve the seeded draw.
      bar: (base, S) => (ctx) => { ctx.rng.pick(S.D.users); },
      // Keep the form reachable when the window frame leaves a short stage.
      work: (base) => (...args) => {
        const work = base(...args);
        work.style.overflow = 'auto';
        return work;
      },
    },
  },
});
