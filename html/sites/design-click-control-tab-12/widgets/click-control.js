// This design replaces each tab panel with its project task ledger and task details.
env.widget({
  task: 'click-control',
  site: 'design-click-control-tab-12',
  name: 'design',
  split: 'train',
  scenarios: ['tab'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      tabButton: () => () => {},
      tabPanel: () => (ctx, p, t, i, links) => {
        const { util } = ctx;
        const tasks = util.el('section', 'os2-tasks', p);
        util.el('h2', '', tasks, 'Project Tasks');
        const sheet = util.el('div', 'os2-sheet', tasks);
        const table = util.el('table', 'ledger-rows', sheet);
        table.innerHTML = '<tr><th>Task</th><th>Status</th><th>Due Date</th></tr>';
        const rows = t.words.concat(
          ['Team sync', 'Launch', 'Review notes', 'Milestones', 'Archive', 'Prepare deck', 'Finalize plan']
            .slice(0, Math.max(0, 7 - t.words.length))
            .map((text) => ({ text, link: false })),
        );
        rows.forEach((word, j) => {
          const row = util.el('tr', j === 0 ? 'os2-selected' : '', table);
          const cell = util.el('td', '', row);
          util.el('span', 'os2-check', cell);
          if (word.link) {
            const a = util.el('span', 'uc-link', cell, word.text);
            a.dataset.key = i + '.' + j;
            a.dataset.role = 'link';
            links.push(a);
          } else util.el('span', 'os2-task-text', cell, word.text);
          util.el('td', '', row, j === 0 ? 'In Progress' : 'Not Started');
          util.el('td', '', row, 'Apr ' + (12 + j * 2) + ', 1994');
        });
        const detail = util.el('section', 'os2-details', p);
        util.el('h2', '', detail, 'Task Details');
        const field = (label, text, cls) => {
          const line = util.el('div', 'os2-field', detail);
          util.el('span', 'os2-field-label', line, label);
          return util.el('div', 'os2-field-value ' + (cls || ''), line, text);
        };
        field('Title:', t.words[0] ? t.words[0].text : 'Project plan');
        field('Status:', 'In Progress', 'os2-drop');
        field('Due Date:', 'Apr 12, 1994', 'os2-date');
        const memo = util.el('div', 'os2-memo', detail, 'Create initial design brief for review.');
        util.el('div', 'os2-scroll', memo).innerHTML = '<span>▴</span><span>▾</span>';
        field('Priority:', 'Normal', 'os2-drop os2-priority');
        const notify = util.el('div', 'os2-notify', detail);
        util.el('span', 'os2-check', notify);
        util.el('span', '', notify, 'Notify team');
      },
    },
  },
});
