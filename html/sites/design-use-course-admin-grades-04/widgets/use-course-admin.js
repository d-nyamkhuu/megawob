// Design on the shared use-course-admin course workspace.
env.widget({
  task: 'use-course-admin',
  site: 'design-use-course-admin-grades-04',
  name: 'design',
  split: 'train',
  scenarios: ['grades'],
  template: 'use-course-admin/workspace',
  design: {
    fontSize: 17,
    inset: 0,
    parts: {
      frame: (base, S) => () => {
        const el = S.util.el;
        S.root = S.P.root();
        S.root.classList.add('aqua-workspace');
        S.surface = el('div', 'aqua-surface', S.root);
        S.tools = el('div', 'aqua-internal', S.surface);
        S.note = el('span', '', S.tools);
        S.context = el('div', 'aqua-internal', S.surface);
        S.P.roster();
        S.work = el('div', 'aqua-work', S.surface);
        S.P.panes();
        S.P.footer();
      },
      panes: (base, S) => () => {
        const el = S.util.el;
        const left = el('div', 'aqua-left', S.work);
        const sheet = el('section', 'aqua-pane aqua-sheet', left);
        const assignments = S.spec.assignments.filter(a => S.spec.students.some(row => S.spec.locked[env.taskDef.helpers.cellKey(row.id, a.id)] === undefined));
        const title = assignments.length === 1 ? ` — ${assignments[0].title}` : '';
        el('div', 'aqua-pane-title', sheet, `Grading Sheet${title}`);
        S.source = el('div', 'aqua-sheet-scroll', sheet);
        const book = el('section', 'aqua-pane aqua-book', left);
        el('div', 'aqua-pane-title', book, 'Gradebook');
        S.main = el('div', 'aqua-book-scroll', book);
        const inspector = el('aside', 'aqua-inspector aqua-pane', S.work);
        el('div', 'aqua-pane-title', inspector, 'Assignment Details');
        const content = el('div', 'aqua-inspector-content', inspector);
        const a = assignments[0] || S.spec.assignments[0];
        el('h2', 'aqua-assignment-title', content, a.title);
        const details = el('dl', 'aqua-details', content);
        for (const [key, value] of [['Type:', 'Exam'], ['Due Date:', 'Oct 14, 2001'], ['Points:', a.max]]) {
          el('dt', '', details, key); el('dd', '', details, String(value));
        }
        const description = el('section', 'aqua-description', content);
        el('b', '', description, 'Description:');
        el('div', 'aqua-description-well', description, 'Covers Chapters 1–4. Closed book. In-class exam.');
        const stats = el('section', 'aqua-inspector-box', content);
        el('div', 'aqua-pane-title', stats, 'Grade Statistics');
        const values = el('dl', 'aqua-stat-values', stats);
        const scores = S.spec.students.map(row => S.spec.records[env.taskDef.helpers.cellKey(row.id, a.id)]).filter(Boolean);
        const sum = numbers => numbers.reduce((n, v) => n + Number(v), 0);
        const recorded = scores.map(r => sum(r.Recorded)), moderated = scores.map(r => sum(r.Moderated));
        const mean = numbers => numbers.length ? sum(numbers) / numbers.length : 0;
        const difference = mean(moderated) - mean(recorded);
        for (const [key, value] of [['Recorded Mean:', mean(recorded).toFixed(1)], ['Moderated Mean:', mean(moderated).toFixed(1)], ['Mean Difference:', `${difference >= 0 ? '+' : ''}${difference.toFixed(1)}`], ['Highest (Moderated):', moderated.length ? Math.max(...moderated) : '—'], ['Lowest (Moderated):', moderated.length ? Math.min(...moderated) : '—']]) {
          el('dt', '', values, key); el('dd', '', values, String(value));
        }
        const status = el('section', 'aqua-inspector-box aqua-status-box', content);
        el('div', 'aqua-pane-title', status, 'Status');
        const statusValues = el('dl', 'aqua-stat-values', status);
        for (const [key, value] of [['Graded:', `${S.spec.students.length} of ${S.spec.students.length}`], ['Posted to Gradebook:', ''], ['Finalized:', '']]) {
          el('dt', '', statusValues, key); const node = el('dd', '', statusValues, value);
          if (key === 'Posted to Gradebook:') S.editorRefs.posted = node;
          if (key === 'Finalized:') S.editorRefs.finalized = node;
        }
      },
      footer: (base, S) => () => {
        const foot = S.util.el('div', 'aqua-internal', S.surface);
        S.summary = S.util.el('span', '', foot);
        S.statusText = S.util.el('span', '', foot);
      },
      drawSource: (base, S) => () => { S.P.gradesSource(); },
      gradesSource: (base, S) => () => {
        const el = S.util.el;
        const assignments = S.spec.assignments.filter(a => S.spec.students.some(row => S.spec.locked[env.taskDef.helpers.cellKey(row.id, a.id)] === undefined));
        for (const a of assignments) {
          if (assignments.length > 1) el('div', 'aqua-source-assignment', S.source, a.title);
          const table = el('table', 'aqua-score-table', S.source);
          const head = el('tr', '', el('thead', '', table));
          for (const label of ['Student', `Recorded ( / ${a.max} )`, `Moderated ( / ${a.max} )`, 'Difference']) el('th', '', head, label);
          const body = el('tbody', '', table);
          for (const row of S.spec.students) {
            const key = env.taskDef.helpers.cellKey(row.id, a.id), record = S.spec.records[key];
            const locked = S.spec.locked[key];
            const recorded = record ? record.Recorded.join(' + ') : String(locked ?? '—');
            const moderated = record ? record.Moderated.join(' + ') : String(locked ?? '—');
            const difference = record ? record.Moderated.reduce((n, v) => n + Number(v), 0) - record.Recorded.reduce((n, v) => n + Number(v), 0) : 0;
            const tr = el('tr', '', body);
            el('td', '', tr, row.name);
            el('td', '', tr, recorded); el('td', '', tr, moderated);
            el('td', difference > 0 ? 'positive' : difference < 0 ? 'negative' : '', tr, `${difference > 0 ? '+' : ''}${difference}`);
            S.P.item(S.ctx, tr, 'sourceStudent', row);
          }
        }
      },
      gradeTools: () => () => {},
      gradeTable: (base, S) => () => {
        const el = S.util.el, table = el('table', 'lms-table aqua-grade-table', S.main);
        const caption = el('caption', 'aqua-internal', table);
        const head = el('tr', '', el('thead', '', table));
        el('th', '', head, 'Student');
        for (const a of S.spec.assignments) {
          const th = el('th', '', head, a.title); el('small', '', th, `/ ${a.max}`);
        }
        const total = el('th', 'aqua-total', head, 'Total');
        el('small', '', total, `/ ${S.spec.assignments.reduce((n, a) => n + a.max, 0)}`);
        el('th', 'aqua-status', head, 'Status');
        return { table, body: el('tbody', '', table), caption };
      },
      draw: (base, S) => (...args) => {
        base(...args);
        if (S.editorRefs.posted) {
          const posted = S.spec.students.filter(row => S.spec.assignments.every(a => {
            const key = env.taskDef.helpers.cellKey(row.id, a.id);
            return S.spec.locked[key] !== undefined || S.ctx.model.marks[key] !== '';
          })).length;
          S.editorRefs.posted.textContent = `${posted} of ${S.spec.students.length}`;
          S.editorRefs.finalized.textContent = `${S.spec.students.filter(row => S.spec.assignments.every(a => S.spec.locked[env.taskDef.helpers.cellKey(row.id, a.id)] !== undefined)).length} of ${S.spec.students.length}`;
        }
      },
    },
  },
});
