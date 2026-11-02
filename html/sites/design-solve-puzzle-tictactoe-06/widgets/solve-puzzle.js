env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-tictactoe-06',
  name: 'design',
  split: 'train',
  scenarios: ['tictactoe'],
  template: 'solve-puzzle/classic',
  design: {
    parts: {
      grid: (base, S) => () => {
        const u = S.ctx.util,
          scene = S.scene;
        const layout = u.el('div', 'ttt-layout', scene),
          boardPanel = u.el('section', 'ttt-panel board-panel', layout);
        u.el('div', 'panel-heading', boardPanel, 'Tic-Tac-Toe Board');
        return u.el('div', 'ttt', boardPanel);
      },
      status: (base, S) => () => {
        const u = S.ctx.util,
          scene = S.scene,
          paints = S.paints;
        const layout = scene.querySelector('.ttt-layout');
        const side = u.el('div', 'ttt-side', layout),
          statusPanel = u.el('section', 'ttt-panel status-panel', side);
        u.el('div', 'panel-heading', statusPanel, 'Game Status');
        const readout = u.el('div', 'status-readout', statusPanel);
        const turn = u.el('div', '', readout),
          xc = u.el('div', '', readout),
          oc = u.el('div', '', readout),
          state = u.el('div', '', readout);
        const actionPanel = u.el('section', 'ttt-panel action-panel', side);
        u.el('div', 'panel-heading', actionPanel, 'Action Controls');
        u.el('div', 'action-hint', actionPanel, 'Select a cell and make your move as X.');
        const actions = u.el('div', 'ttt-actions', actionPanel),
          names = [
            'Top-Left',
            'Top-Center',
            'Top-Right',
            'Middle-Left',
            'Middle-Center',
            'Middle-Right',
            'Bottom-Left',
            'Bottom-Center',
            'Bottom-Right',
          ];
        names.forEach((label, i) =>
          S.P.button(
            actions,
            label,
            { actionCell: i },
            () => {
              S.P.play(i);
            },
            'action-cell',
          ),
        );
        const actionFoot = u.el('div', 'action-foot', actionPanel),
          clear = u.el('button', 'clear-move', actionFoot, 'Clear Move');
        clear.type = 'button';
        clear.disabled = true;
        if (env.submitEl) {
          actionFoot.append(env.submitEl);
          env.submitEl.classList.add('in-scene');
        }
        paints.push((m) => {
          turn.textContent = 'Turn:   X  (you)';
          xc.textContent = 'X count:  ' + m.board.filter((x) => x === 'X').length;
          oc.textContent = 'O count:  ' + m.board.filter((x) => x === 'O').length;
          state.textContent =
            'Status:  ' +
            (m.result ? { win: 'You win', draw: 'Draw', loss: 'Computer wins' }[m.result] : 'In progress');
        });
      },
    },
  },
});
