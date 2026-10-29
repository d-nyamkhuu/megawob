env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-odd-even-03',
  name: 'design',
  split: 'train',
  scenarios: ['odd-even'],
  template: 'solve-puzzle/classic',
  design: {
    numberClass: 'parity-number',
    choiceClass: 'parity-choice',
    parts: {
      heading: (base, S) => (grid) => {
        const u = S.ctx.util;
        const head = u.el('div', 'parity-head', grid);
        ['Number', 'Odd', 'Even'].forEach((label) => u.el('strong', '', head, label));
      },
    },
  },
});
