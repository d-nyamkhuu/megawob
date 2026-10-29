// Design on the shared use-course-admin course workspace.
env.widget({
  task: 'use-course-admin',
  site: 'design-use-course-admin-rubric-02',
  name: 'design',
  split: 'train',
  scenarios: ['rubric'],
  template: 'use-course-admin/workspace',
  design: {
    parts: {
      frame: (base, S) => () => {
        const el = S.util.el;
        S.root = el('section', 'lh-workspace', S.ctx.stage);
        S.surface = S.root;
        S.tools = el('div', 'lh-internal', S.root);
        S.note = el('span', '', S.tools);
        S.P.roster();
        S.work = S.root;
        S.main = el('div', 'lh-main', S.work);
        S.source = el('aside', 'lh-internal', S.work);
        const meta = el('footer', 'lh-internal', S.root);
        S.summary = el('span', '', meta);
        S.statusText = el('span', '', meta);
      },
      rubricIntro: (base, S) => () => {
        const el = S.util.el, s = S.spec;
        const student = s.students.find(x => x.id === s.student);
        const overview = el('div', 'lh-overview', S.main);
        const strip = el('div', 'lh-student-strip', overview);
        const who = el('div', 'lh-student', strip);
        el('span', 'lh-avatar', who, S.P.initials(student.name));
        el('strong', '', who, student.name);
        el('span', 'lh-chevron', who, '⌄');
        const assignment = el('div', 'lh-assignment', strip);
        const assignmentName = el('div', '', assignment);
        el('b', '', assignmentName, 'Essay 2:');
        el('span', '', assignmentName, ' Rhetoric and Society');
        el('div', 'lh-due', assignment, 'Due Apr 12, 2024');
        const score = el('div', 'lh-total', strip);
        el('span', '', score, 'Rubric Total');
        el('strong', 'lh-total-value', score, '0');
        const help = el('div', 'lh-help-banner', overview);
        el('span', 'lh-help-icon', help, 'i');
        el('span', '', help, 'Select a performance level for each criterion. The rubric total is calculated from the criteria weights and selected levels.');
        const panel = document.querySelector('.ref-body > .ref-panel');
        if (panel) {
          overview.classList.add('has-panel');
        }
      },
      rubricTable: (base, S) => () => {
        const el = S.util.el, s = S.spec;
        const table = el('div', 'lh-matrix', S.main);
        table.setAttribute('role', 'table');
        table.style.setProperty('--criteria', s.criteria.length);
        const head = el('div', 'lh-matrix-head', table);
        head.setAttribute('role', 'row');
        el('div', 'lh-level-heading', head, 'Performance Level');
        for (const c of s.criteria) {
          const cell = el('div', 'lh-criterion-heading', head);
          el('strong', '', cell, c.title);
          el('span', '', cell, `${(s.levels.length - 1) * c.weight} pts`);
        }
        const body = el('div', 'lh-matrix-body', table);
        for (let j = s.levels.length - 1; j >= 0; j--) {
          const row = el('div', 'lh-level-row', body);
          row.dataset.level = j;
          row.setAttribute('role', 'row');
          const label = el('div', 'lh-level-label', row);
          el('strong', '', label, s.levels[j]);
          el('span', '', label, `${j} ${j === 1 ? 'pt' : 'pts'}`);
        }
        return body;
      },
      criterionRow: (base, S) => (body, c, i) => {
        for (let j = 0; j < S.spec.levels.length; j++) {
          S.P.ratingCell(body.querySelector(`[data-level="${j}"]`), c, i, j);
        }
        S.P.item(S.ctx, body, 'criterionRow', c);
      },
      ratingCell: (base, S) => (row, c, i, j) => {
        // The template owns the action, rating target and model synchronization.
        base(row, c, i, j);
        const b = S.editorRefs[`rating:${i}:${j}`];
        const cell = b.parentElement;
        cell.className = 'lh-rating-cell';
        cell.setAttribute('role', 'cell');
        const descriptions = {
          'Clarity of argument': ['Unclear or weak argument with an indistinct thesis.', 'Somewhat clear argument with a thesis that could be more developed.', 'Clear and coherent argument with a well-defined thesis.', 'Insightful, compelling argument with a clear and sophisticated thesis.'],
          'Use of evidence': ['Limited or irrelevant evidence, with little integration.', 'Uses some relevant evidence, but integration is uneven.', 'Uses relevant, credible evidence with effective integration.', 'Uses a wide range of relevant, credible evidence with excellent integration.'],
          'Organization': ['Lacks clear organization and logical progression.', 'Generally organized, but with some gaps in structure.', 'Well-organized structure with clear progression of ideas.', 'Exceptionally well-organized and cohesive structure.'],
          'Visual communication': ['Minimal or ineffective visual elements.', 'Some effective visual elements, but not consistently used.', 'Effective visual elements that support the argument.', 'Highly effective visual elements that enhance the argument.'],
          'Original insight': ['Little to no original insight.', 'Shows some attempt at original insight, but limited in depth.', 'Demonstrates thoughtful insight into the topic.', 'Demonstrates original and nuanced insight into the topic.'],
          'Source attribution': ['Sources are missing or inconsistently credited.', 'Some sources are credited, but citations have gaps.', 'Sources are credited consistently and accurately.', 'All sources are carefully and accurately credited.'],
        };
        b.replaceChildren();
        S.util.el('span', 'lh-radio', b);
        S.util.el('span', 'lh-rating-description', b, (descriptions[c.title] || descriptions['Use of evidence'])[j]);
      },
      feedback: () => () => {},
      draw: (base, S) => m => {
        base(m);
        const total = S.spec.criteria.reduce((sum, c, i) => sum + (Number.isInteger(m.ratings[i]) && m.ratings[i] >= 0 ? m.ratings[i] * c.weight : 0), 0);
        const max = S.spec.criteria.reduce((sum, c) => sum + (S.spec.levels.length - 1) * c.weight, 0);
        S.main.querySelector('.lh-total-value').textContent = `${total} / ${max}`;
      },
    },
  },
});
