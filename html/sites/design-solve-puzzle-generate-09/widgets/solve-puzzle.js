// Adds the numbered zone marker and label above the generator.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-generate-09',
  name: 'design',
  split: 'train',
  scenarios: ['generate'],
  template: 'solve-puzzle/classic',
  design: {
    parts: {
      decorated: (base, S) => (box, main) => {
        base(box, main);
        const root = S.root;
        S.ctx.util.el('span', 'zone-number', root, '02');
        S.ctx.util.el('div', 'zone-label', root, 'Generate');
      },
    },
  },
});
