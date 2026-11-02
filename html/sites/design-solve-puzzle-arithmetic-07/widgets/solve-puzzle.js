// This arithmetic design wraps the equation and answer in a problem card and adds Clear.
(function () {
  'use strict';
  let card, actions;
  env.widget({
    task: 'solve-puzzle',
    site: 'design-solve-puzzle-arithmetic-07',
    name: 'design',
    split: 'train',
    scenarios: ['arithmetic'],
    template: 'solve-puzzle/classic',
    design: {
      parts: {
        equation: (base, S) => () => {
          card = S.ctx.util.el('div', 'problem-card', S.scene);
          return S.ctx.util.el('div', 'equation', card, S.P.expression());
        },
        answer: (base, S) => () => {
          const field = S.P.input(card, 'answer', S.D.answerLabel ?? '');
          S.P.answerActions(field);
          return field;
        },
        answerActions: (base, S) => () => {
          actions = S.ctx.util.el('div', 'task-actions', S.scene);
          const clear = S.ctx.util.el('button', 'clear-answer', actions, 'Clear');
          clear.type = 'button';
          clear.addEventListener('click', () => S.P.set({ answer: '' }));
        },
        submitParent: (base) => () => actions,
      },
    },
  });
})();
