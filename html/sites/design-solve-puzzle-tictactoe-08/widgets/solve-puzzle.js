// Keeps the compact board and status line, with this site's Reset Game control.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-tictactoe-08',
  name: 'design',
  split: 'train',
  scenarios: ['tictactoe'],
  template: 'solve-puzzle/classic',
  design: {
    resetLabel: 'Reset Game',
    parts: {
      grid: (base, S) => () => S.ctx.util.el('div', 'ttt', S.scene),
      status: (base, S) => () => {
        const status = S.ctx.util.el('div', '', S.root);
        S.paints.push((m) => {
          status.textContent = m.result
            ? { win: 'You win!', draw: 'It is a draw.', loss: 'The computer wins.' }[m.result]
            : 'Your turn (X). Click a square to make your move.';
        });
      },
    },
  },
});
