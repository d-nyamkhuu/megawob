// Uses the shared compact board and status with this site's New Game reset.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-tictactoe-10',
  name: 'design',
  split: 'train',
  scenarios: ['tictactoe'],
  template: 'solve-puzzle/classic',
  design: {
    resetLabel: 'New Game',
    parts: {
      status: (base, S) => () => {
        const status = document.querySelector('.turn-value');
        S.paints.push((m) => {
          status.textContent = m.result
            ? {win: 'You win!', draw: 'It is a draw.', loss: 'The computer wins.'}[m.result]
            : 'Your move (X)';
        });
      },
      resetParent: () => () => document.querySelector('.sheet-reset-row'),
      reset: (base, S) => () => {
        base();
        const row = document.querySelector('.sheet-reset-row');
        const reset = row.querySelector('.reference-reset');
        const clear = S.ctx.util.el('button', 'reference-clear', row, 'Clear');
        clear.type = 'button';
        // Clear uses the same model-restoring action as New Game.
        clear.addEventListener('click', () => reset.click());
      },
    },
  },
});
