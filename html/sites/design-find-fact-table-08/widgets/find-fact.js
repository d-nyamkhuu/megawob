// Renames the table cards and moves Clear All into the answer card.
(function () {
  let answerFields;
  env.widget({
    task: 'find-fact',
    site: 'design-find-fact-table-08',
    name: 'design',
    split: 'train',
    scenarios: ['table'],
    answerReply: true,
    template: 'find-fact/table',
    design: {
      parts: {
        answerForm: (base, S) => (ctx, parent, labels, model, onEdit) => {
          answerFields = base(ctx, parent, labels, model, onEdit);
          return answerFields;
        },
        build: (base, S) => (ctx, work, up, room) => {
          const view = base(ctx, work, up, room);
          const tableCard = work.firstElementChild;
          const form = work.lastElementChild;
          tableCard.querySelector('h3').textContent = 'Key Information';
          form.querySelector('h3').textContent = 'Your Answers';
          const actions = document.querySelector('.ds-actions');
          if (actions) {
            const clear = ctx.util.el('button', 'ds-clear', null, 'Clear All');
            clear.type = 'button';
            clear.addEventListener('click', () => {
              const answers = ctx.model.answers.map(() => '');
              up({ answers });
              answerFields.forEach((field) => field.set(''));
            });
            actions.prepend(clear);
            form.append(actions);
          }
          return view;
        },
      },
    },
  });
})();
