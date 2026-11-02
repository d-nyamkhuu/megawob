// This design adds source context and places the end control with the final answer field.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-table-11',
  name: 'design',
  split: 'train',
  scenarios: ['table'],
  answerReply: true,
  template: 'find-fact/table',
  design: {
    parts: {
      source: (base, S) => (ctx, tc) => {
        const subtitle = document.createElement('span');
        subtitle.className = 'rl-subtitle';
        subtitle.textContent = 'Key records and details';
        tc.firstElementChild.appendChild(subtitle);
      },
      answers: (base, S) => (ctx, B) => {
        const { form } = B;
        form.firstElementChild.textContent = 'Your Answer';
        const end = document.querySelector('.ds-end-form');
        const rows = form.querySelectorAll('.rl-field');
        const actionHost = rows[rows.length - 1] || form.querySelector('.rl-card-b');
        if (end && actionHost) actionHost.appendChild(end);
      },
    },
  },
});
