// Design on the shared use-course-admin course workspace.
env.widget({
  task: 'use-course-admin',
  site: 'design-use-course-admin-grades-05',
  name: 'design',
  split: 'train',
  scenarios: ['grades'],
  template: 'use-course-admin/workspace',
  design: {
    fontSize: 14,
    parts: {
      frame(base, S) {
        return () => {
        const el = S.util.el;
        S.root = S.P.root();
        S.root.style.setProperty('--student-width', S.spec.assignments.length <= 3 ? '24%' : '14.2%');
        S.root.style.setProperty('--source-count', S.spec.students.length);
        S.root.style.setProperty('--grade-count', S.spec.students.length + 1);
        S.surface = el('div', 'grades-sheet', S.root);
        // Retain the live controller nodes without the old utility toolbar.
        S.tools = el('div', 'grades-internal', S.surface);
        S.note = el('span', '', S.tools);
        S.context = el('div', '', S.tools);
        S.P.roster();
        S.work = el('div', 'grades-work', S.surface);
        S.P.panes();
        S.P.footer();
        };
      },
      panes(base, S) {
        return () => {
        S.source = S.util.el('section', 'grades-source', S.work);
        S.main = S.util.el('section', 'grades-main', S.work);
        };
      },
      footer(base, S) {
        return () => {
        const el = S.util.el;
        const side = el('aside', 'grades-side', S.root);
        const card = el('section', 'grades-summary', side);
        el('h3', '', card, 'Grade Summary');
        const assignments = S.spec.assignments.filter(a => S.spec.students.some(row => S.spec.locked[env.taskDef.helpers.cellKey(row.id, a.id)] === undefined));
        const qualifier = assignments.length === 1 ? ` ${assignments[0].title}` : '';
        for (const [key, label] of [['active', 'Active students'], ['finalized', 'Finalized students'], ['all', 'Total students'], ['missing', `Missing${qualifier} grades`], ['complete', `Complete${qualifier} grades`]]) {
          const row = el('div', `grades-stat ${key}`, card);
          el('span', '', row, label);
          el('strong', '', row).dataset.stat = key;
        }
        S.summary = el('span', 'grades-internal', card);
        S.statusText = el('span', 'grades-internal', card);
        };
      },
      gradeTools: () => () => {},
      sourceStamp: () => () => {},
      activity: () => () => {},
      gradesSource(base, S) {
        return () => {
        const el = S.util.el, spec = S.spec;
        const assignments = spec.assignments;
        el('h2', '', S.source, 'Score Sheet  (Marks to Record)');
        const pane = el('div', 'grades-table-pane', S.source);
        const table = el('table', 'grades-source-table', pane);
        const head = el('tr', '', el('thead', '', table));
        el('th', '', head, 'Student');
        for (const a of assignments) {
          const th = el('th', '', head);
          el('span', '', th, a.title);
          el('small', '', th, `(${a.max})`);
          if (spec.students.some(row => spec.locked[env.taskDef.helpers.cellKey(row.id, a.id)] === undefined)) el('small', 'source-schemes', th, 'Recorded / Moderated');
        }
        const totalHeading = el('th', '', head);
        el('span', '', totalHeading, 'Total');
        el('small', '', totalHeading, `(${assignments.reduce((n, a) => n + a.max, 0)})`);
        const body = el('tbody', '', table);
        for (const row of spec.students) {
          {
            const tr = el('tr', '', body);
            el('td', '', tr, row.name);
            let total = 0;
            for (const a of assignments) {
              const cellKey = env.taskDef.helpers.cellKey(row.id, a.id);
              const locked = spec.locked[cellKey];
              const value = locked !== undefined ? String(locked) : spec.records[cellKey].Recorded.join(' + ');
              const cell = el('td', '', tr);
              el('span', 'source-recorded', cell, value);
              if (locked === undefined) el('small', 'source-moderated', cell, 'Moderated: ' + spec.records[cellKey].Moderated.join(' + '));
              total += value.split('+').reduce((sum, part) => sum + (Number(part.trim()) || 0), 0);
            }
            el('td', '', tr, String(total));
            S.P.item(S.ctx, tr, 'sourceStudent', row);
          }
        }
        };
      },
      gradeTable(base, S) {
        return () => {
        S.util.el('h2', 'grades-book-title', S.main, 'Gradebook  (Enter Marks)');
        const result = base();
        const pane = S.util.el('div', 'grades-table-pane', S.main);
        pane.appendChild(result.table);
        const head = result.table.tHead.rows[0];
        const status = head.querySelector('.lms-status-col');
        head.lastElementChild.classList.add('grades-total-heading');
        status.textContent = 'Status';
        S.spec.assignments.forEach((a, i) => {
          head.children[i + 1].querySelector('small').textContent = `(${a.max})`;
        });
        S.util.el('small', 'lms-id', head.lastElementChild, `(${S.spec.assignments.reduce((total, a) => total + a.max, 0)})`);
        head.appendChild(status);
        result.caption.classList.add('grades-internal');
        return result;
        };
      },
      gradeRow(base, S) {
        return (...args) => {
        base(...args);
        const tr = args[0].lastElementChild;
        tr.querySelector('.lms-avatar').remove();
        tr.querySelector('.lms-id').remove();
        const status = tr.querySelector('.lms-status-col');
        status.firstElementChild.textContent = 'Active';
        status.firstElementChild.className = 'grades-badge active';
        tr.appendChild(status);
        const total = tr.children[tr.children.length - 2];
        const text = total.textContent;
        total.textContent = '';
        S.util.el('span', 'grades-total-value', total, text);
        };
      },
      concludedRow(base, S) {
        return (...args) => {
        // The base keeps every concluded-person and score RNG draw in order.
        base(...args);
        const tr = args[0].lastElementChild;
        tr.querySelector('.lms-id').remove();
        const status = tr.querySelector('.lms-status-col');
        status.textContent = '';
        S.util.el('span', 'grades-badge finalized', status, 'Finalized');
        tr.appendChild(status);
        const total = tr.children[tr.children.length - 2];
        const text = total.textContent;
        total.textContent = '';
        S.util.el('span', 'grades-total-value', total, text);
        };
      },
      draw(base, S) {
        return model => {
        base(model);
        for (const tr of S.main.querySelectorAll('tbody tr:not(.lms-concluded)')) {
          const total = tr.children[tr.children.length - 2];
          if (!total.querySelector('.grades-total-value')) {
            const text = total.textContent;
            total.textContent = '';
            S.util.el('span', 'grades-total-value', total, text);
          }
        }
        let missing = 0;
        for (const row of S.spec.students) {
          if (S.spec.assignments.some(a => {
            const key = env.taskDef.helpers.cellKey(row.id, a.id);
            return S.spec.locked[key] === undefined && model.marks[key] === '';
          })) missing++;
        }
        const values = { active: S.spec.students.length, finalized: S.D.concludedCount,
          all: S.spec.students.length + S.D.concludedCount, missing,
          complete: S.spec.students.length + S.D.concludedCount - missing };
        for (const [key, value] of Object.entries(values)) S.root.querySelector(`[data-stat="${key}"]`).textContent = value;
        };
      },
    },
  },
});
