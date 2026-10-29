// Adds this site's plain parity header and Clear All reset control.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-odd-even-06',
  name: 'design',
  split: 'train',
  scenarios: ['odd-even'],
  template: 'solve-puzzle/classic',
  design: {
    resetLabel: 'Clear All',
    parts: {
      heading: (base, S) => (grid) => {
        const u = S.ctx.util;
        const head = u.el('div', 'parity-head', grid);
        ['Number', 'Odd', 'Even'].forEach((label) => u.el('span', '', head, label));
      },
    },
  },
});
