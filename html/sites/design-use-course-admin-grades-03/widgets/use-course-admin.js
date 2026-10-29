// Design on the shared use-course-admin course workspace.
env.widget({
  task: 'use-course-admin',
  site: 'design-use-course-admin-grades-03',
  name: 'design',
  split: 'train',
  scenarios: ['grades'],
  template: 'use-course-admin/workspace',
  design: {
    parts: {
      // Not drawn: course heading, tabs, toolbar, context bar and footer. The toolbar, context and footer keep
      // their nodes off the page so the grid logic can still write its note and summary.
      header: () => () => {},
      toolbar: (base, S) => () => {
        const el = S.util.el;
        S.tools = el('div', 'lms-tools');
        S.note = el('span', 'lms-muted', S.tools);
      },
      context: (base, S) => () => { S.context = S.util.el('div', 'lms-context'); },
      footer: (base, S) => () => {
        const el = S.util.el, foot = el('footer', 'lms-foot');
        S.summary = el('span', '', foot);
        S.statusText = el('span', '', el('span', 'saved', foot));
      },
      gradeTable: (base, S) => () => {
        S.util.el('h2', 'gem-grade-title', S.main, 'Gradebook');
        return base();
      },
      // Static totals for the active students, from the finalized scores in the spec.
      buildGrades: (base, S) => () => {
        base();
        const el = S.util.el, s = S.spec, f = env.taskDef;
        const box = el('section', 'gem-totals', S.main);
        el('h2', '', box, 'Totals (Active Students)');
        const table = el('table', '', box), head = el('tr', '', el('thead', '', table)), body = el('tbody', '', table);
        el('th', '', head);
        const columns = s.assignments.map(a => s.students
          .map(row => s.locked[f.helpers.cellKey(row.id, a.id)]).filter(v => v !== undefined).map(Number));
        for (const a of s.assignments) el('th', '', head, a.title);
        for (const [label, calc] of [
          ['Count', v => v.length],
          ['Average', v => v.length ? (v.reduce((x, y) => x + y, 0) / v.length).toFixed(1) : '\u2014'],
          ['High', v => v.length ? Math.max(...v) : '\u2014'],
          ['Low', v => v.length ? Math.min(...v) : '\u2014'],
        ]) {
          const tr = el('tr', '', body);
          el('th', '', tr, label);
          for (const v of columns) el('td', '', tr, String(calc(v)));
        }
      },
    },
  },
});
