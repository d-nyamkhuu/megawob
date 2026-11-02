// Presents the answer form as a selected-record ledger, preserving the original field controls.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-table-09',
  name: 'design',
  split: 'train',
  scenarios: ['table'],
  template: 'find-fact/table',
  design: {
    parts: {
      answers: (base, S) => (ctx, B) => {
        const { spec, util } = ctx;
        const { form } = B;
        form.querySelector('h3').textContent = /staff|person|employee|profile|people/i.test(spec.title)
          ? 'Selected Person'
          : 'Selected Record';
        const answerBody = form.querySelector('.rl-card-b');
        const answerTable = util.el('table', 'rl-table rl-answer-table', answerBody);
        const answerHead = util.el('tr', '', util.el('thead', '', answerTable));
        util.el('th', '', answerHead, 'Field');
        util.el('th', '', answerHead, 'Value');
        const answerRows = util.el('tbody', '', answerTable);
        Array.from(answerBody.querySelectorAll('.rl-field')).forEach((field) => {
          const row = util.el('tr', '', answerRows);
          const key = util.el('td', 'rl-answer-key', row);
          const value = util.el('td', '', row);
          const label = field.querySelector('label');
          if (label) key.append(label);
          else key.textContent = 'Answer';
          value.append(field);
        });
      },
    },
  },
});
