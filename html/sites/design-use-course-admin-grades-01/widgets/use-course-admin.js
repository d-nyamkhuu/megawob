// Design on the shared use-course-admin course workspace.
env.widget({
  task: 'use-course-admin',
  site: 'design-use-course-admin-grades-01',
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
        const instruction = document.querySelector('.ref-panel');
        if (instruction) side.appendChild(instruction);
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
        const editable = spec.assignments.filter(a => spec.students.some(row => spec.locked[env.taskDef.helpers.cellKey(row.id, a.id)] === undefined));
        el('h2', '', S.source, 'Grading Sheet' + (editable.length === 1 ? ` — ${editable[0].title}` : ''));
        el('p', 'grades-meta', S.source, editable.length === 1 ? `Max score: ${editable[0].max}` : 'Approved marks · points');
        const table = el('table', 'grades-source-table', S.source);
        const head = el('tr', '', el('thead', '', table));
        for (const text of ['Student', 'Recorded Mark', 'Moderated Mark', 'Note']) el('th', '', head, text);
        const body = el('tbody', '', table);
        for (const row of spec.students) {
          for (const a of editable) {
            const key = env.taskDef.helpers.cellKey(row.id, a.id);
            const locked = spec.locked[key];
            const tr = el('tr', '', body);
            const who = el('td', '', tr, row.name);
            if (editable.length > 1) el('small', '', who, a.title);
            for (const scheme of ['Recorded', 'Moderated']) el('td', '', tr, locked !== undefined ? String(locked) : spec.records[key][scheme].join(' + '));
            el('td', 'grades-source-note', tr, locked !== undefined ? 'Finalized' : '—');
            S.P.item(S.ctx, tr, 'sourceStudent', row);
          }
        }
        };
      },
      gradeTable(base, S) {
        return () => {
        S.util.el('h2', 'grades-book-title', S.main, 'Gradebook');
        const result = base();
        const head = result.table.tHead.rows[0];
        const status = head.querySelector('.lms-status-col');
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
        };
      },
      draw(base, S) {
        return model => {
        base(model);
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
