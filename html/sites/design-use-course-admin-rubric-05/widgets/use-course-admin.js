// Design on the shared use-course-admin course workspace.
env.widget({
  task: 'use-course-admin',
  site: 'design-use-course-admin-rubric-05',
  name: 'design',
  split: 'train',
  scenarios: ['rubric'],
  template: 'use-course-admin/workspace',
  design: {
    parts: {
      rail: () => () => {},
      header: () => () => {},
      toolbar: (base, S) => () => {
        // Keep the controller's toolbar references without the unrelated LMS frame.
        S.tools = S.util.el('div', 'lms-tools');
        S.note = S.util.el('span', '', S.tools);
      },
      context: (base, S) => () => {
        S.context = S.util.el('div', 'lms-context');
      },
      rubricIntro: (base, S) => () => {
        const el = S.util.el, student = S.spec.students.find(x => x.id === S.spec.student);
        const rank = name => ({'Not yet':0, 'Beginning':0, 'Developing':1, 'Proficient':2, 'Exemplary':3}[name] ?? 4);
        S.humanLevels = S.spec.levels.map((name, j) => j).sort((a,b) => rank(S.spec.levels[a]) - rank(S.spec.levels[b]));
        const filters = el('div', 'human-selectors', S.main);
        for (const [label, value] of [['Course:', 'English 101'], ['Student:', student.name]]) {
          const field = el('div', 'human-selector', filters);
          el('span', 'human-selector-label', field, label);
          const button = el('button', 'human-selector-value', field, value); button.type = 'button';
          el('span', 'human-selector-arrow', button, '▾');
          button.addEventListener('click', () => env.log('decoy', {label: label + ' ' + value}));
        }
        S.humanSheet = el('section', 'human-sheet', S.main);
        const intro = el('div', 'human-intro', S.humanSheet);
        el('h1', '', intro, 'Research Essay — Assessment Rubric');
        el('div', 'human-student', intro, `Student: ${student.name}`);
        const summary = S.humanSummary = el('div', 'human-summary', S.humanSheet);
        el('strong', 'human-total-label', summary, 'Total');
        const scorebox = el('div', 'human-score', summary);
        el('strong', 'human-total-value', scorebox, '0 / 20 points');
        el('span', 'human-rated', scorebox, `0 of ${S.spec.criteria.length} criteria rated`);
        const counts = el('div', 'human-counts', summary);
        for (const j of S.humanLevels) {
          const line = el('div', 'human-count', counts);
          el('span', '', line, S.spec.levels[j]); el('span', `human-count-${j}`, line, '0');
        }
      },
      rubricTable: (base, S) => () => {
        const el = S.util.el, pane = el('div', 'human-grid-scroll', S.humanSheet);
        const table = el('table', 'human-grid', pane);
        const cols = el('colgroup', '', table); el('col', 'human-criterion-col', cols);
        for (const j of S.humanLevels) el('col', '', cols);
        const head = el('tr', '', el('thead', '', table));
        el('th', 'human-criterion-head', head, 'Criterion');
        for (const [position, j] of S.humanLevels.entries()) el('th', `human-level-head human-level-${position}`, head, S.spec.levels[j]);
        return el('tbody', '', table);
      },
      criterionRow: (base, S) => (body, c, i) => {
        const el = S.util.el, row = el('tr', 'human-criterion', body);
        const label = el('th', 'human-criterion-name', row, c.title); label.scope = 'row';
        for (const j of S.humanLevels) S.P.ratingCell(row, c, i, j);
        S.P.item(S.ctx, row, 'criterionRow', c);
      },
      ratingCell: (base, S) => (parent, c, i, j) => {
        // The template still owns clicks, model updates, editorRefs and oracle targets.
        base(parent, c, i, j);
        const cell = parent.lastElementChild, button = S.editorRefs[`rating:${i}:${j}`];
        cell.className = 'human-rating-cell';
        button.replaceChildren();
        const name = S.spec.levels[j];
        S.util.el('span', 'human-radio', button).setAttribute('aria-hidden', 'true');
        button.setAttribute('aria-label', `${c.title}: ${name}`); button.title = name;
      },
      feedback: () => () => {},
      rubricSource: (base, S) => () => {
        // Retain the original submission's forked content draw, then rebuild its view.
        base();
        S.source.replaceChildren();
      },
      activity: () => () => {},
      draw: (base, S) => m => {
        base(m);
        if (S.summary && S.summary.style) S.summary.style.display = 'none';
        const max = S.spec.criteria.reduce((sum, c) => sum + c.weight * (S.spec.levels.length - 1), 0);
        const points = S.spec.criteria.reduce((sum, c, i) => sum + c.weight * Math.max(0, m.ratings[i] ?? -1), 0);
        const total = S.main.querySelector('.human-total-value'); if (total) total.textContent = `${points} / ${max} points`;
        const rated = m.ratings.filter(j => j >= 0).length, ratedEl = S.main.querySelector('.human-rated');
        if (ratedEl) ratedEl.textContent = `${rated} of ${S.spec.criteria.length} criteria rated`;
        for (let j = 0; j < S.spec.levels.length; j++) {
          const count = m.ratings.filter(v => v === j).length, node = S.main.querySelector(`.human-count-${j}`); if (node) node.textContent = String(count);
        }
      },
    },
  },
});
