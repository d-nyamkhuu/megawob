// Design on the shared use-course-admin course workspace.
env.widget({
  task: 'use-course-admin',
  site: 'design-use-course-admin-rubric-01',
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
      context: (base, S) => () => { S.context = S.util.el('div', 'lms-context'); },
      rubricIntro: (base, S) => () => {
        const el = S.util.el, student = S.spec.students.find(x => x.id === S.spec.student);
        const intro = el('div', 'np-intro', S.main);
        const title = el('div', 'np-student', intro);
        el('h1', '', title, student.name);
        const subtitle = el('div', 'np-subtitle', title);
        el('span', '', subtitle, 'Research Essay');
        el('span', 'np-divider', subtitle, '|');
        el('span', '', subtitle, 'Rubric');
        const total = el('div', 'np-total', intro);
        el('span', '', total, 'Total');
        el('strong', 'np-total-value', total, '0 / 100');
      },
      rubricTable: (base, S) => () => S.util.el('div', 'np-criteria', S.main),
      criterionRow: (base, S) => (body, c, i) => {
        const el = S.util.el, row = el('section', 'np-criterion', body);
        const heading = el('div', 'np-criterion-heading', row);
        el('h2', '', heading, c.title);
        const allWeights = S.spec.criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
        el('span', 'np-weight', heading, `${Math.round(c.weight / allWeights * 100)}% of total`);
        const choices = el('div', 'np-choices', row);
        const order = ['Exemplary', 'Proficient', 'Developing', 'Beginning'];
        const rank = name => order.includes(name) ? order.indexOf(name) : order.length;
        const indices = S.spec.levels.map((name, j) => j).sort((a, b) => rank(S.spec.levels[a]) - rank(S.spec.levels[b]));
        for (const j of indices) S.P.ratingCell(choices, c, i, j);
        S.P.item(S.ctx, row, 'criterionRow', c);
      },
      ratingCell: (base, S) => (parent, c, i, j) => {
        // The template still owns clicks, model updates, editorRefs and oracle targets.
        base(parent, c, i, j);
        const cell = parent.lastElementChild, button = S.editorRefs[`rating:${i}:${j}`];
        cell.className = 'np-option';
        button.replaceChildren();
        const name = S.spec.levels[j];
        const descriptions = {
          'Visual communication': ['Compelling and polished visual presentation.', 'Clear and effective visuals.', 'Some relevant visuals, with minor issues.', 'Limited or unclear visuals.'],
          'Source attribution': ['Consistently and correctly cites all sources.', 'Cites most sources correctly.', 'Cites some sources, with errors.', 'Little or no source attribution.'],
          'Clarity of argument': ['Argument is focused, insightful, and compelling.', 'Clear and coherent argument.', 'Somewhat clear argument.', 'Unclear or weak argument.'],
          'Use of evidence': ['Integrates relevant and convincing evidence.', 'Uses relevant evidence.', 'Some evidence, with limited analysis.', 'Minimal or no evidence used.'],
          'Original insight': ['Demonstrates a unique and insightful perspective.', 'Shows some original insight.', 'Limited original insight.', 'Little or no original insight.'],
          'Organization': ['Ideas are carefully structured and connected.', 'Clear and logical organization.', 'Some organization, with gaps.', 'Limited or unclear organization.'],
        };
        const index = name === 'Not yet' ? 3 : ['Exemplary', 'Proficient', 'Developing', 'Beginning'].indexOf(name);
        S.util.el('span', 'np-radio', button).setAttribute('aria-hidden', 'true');
        const copy = S.util.el('span', 'np-choice-copy', button);
        S.util.el('strong', 'np-level', copy, name);
        S.util.el('span', 'np-description', copy, (descriptions[c.title] || descriptions.Organization)[index] || name);
      },
      feedback: () => () => {},
      rubricSource: (base, S) => () => {
        // Retain the original submission's forked content draw, then rebuild its view.
        base();
        S.source.replaceChildren();
        const el = S.util.el, heading = el('div', 'np-roster-heading', S.source);
        el('h2', '', heading, 'Students');
        const assessment = el('div', 'np-assessment', heading, 'Research Essay');
        el('span', '', assessment, '/ 100');
        const table = el('table', 'np-roster', S.source);
        const head = el('tr', '', el('thead', '', table));
        el('th', '', head, 'Name'); el('th', '', head, 'Score');
        const body = el('tbody', '', table);
        for (const student of S.spec.students) {
          const selected = student.id === S.spec.student;
          const row = el('tr', selected ? 'np-current' : '', body);
          el('td', '', row, student.name);
          el('td', selected ? 'np-student-score' : '', row, '–');
        }
      },
      activity: () => () => {},
      draw: (base, S) => m => {
        base(m);
        const max = S.spec.criteria.reduce((sum, c) => sum + c.weight * (S.spec.levels.length - 1), 0);
        const points = S.spec.criteria.reduce((sum, c, i) => sum + c.weight * Math.max(0, m.ratings[i] ?? -1), 0);
        const score = Math.round(points / max * 100);
        S.main.querySelector('.np-total-value').textContent = `${score} / 100`;
        const cell = S.source.querySelector('.np-student-score');
        if (cell) cell.textContent = m.ratings.some(j => j >= 0) ? String(score) : '–';
      },
    },
  },
});
