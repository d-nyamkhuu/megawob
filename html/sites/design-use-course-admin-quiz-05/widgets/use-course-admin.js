// Design on the shared use-course-admin course workspace.
env.widget({
  task: 'use-course-admin',
  site: 'design-use-course-admin-quiz-05',
  name: 'design',
  split: 'train',
  scenarios: ['quiz'],
  template: 'use-course-admin/workspace',
  design: {
    inset: 0,
    radius: 0,
    font: 'Arial, Helvetica, sans-serif',
    fontSize: 16,
    sourceWidth: 46,
    sourceMin: 260,
    sourceMax: 900,
    parts: {
      frame: (base, S) => function () {
        const P = S.P, el = S.ctx.util.el;
        S.root = P.root();
        S.root.classList.add('quiz-root');
        // ctx.size includes the stage padding; keep the framed window inside it.
        const stageStyle = getComputedStyle(S.ctx.stage);
        const width = S.ctx.size.width - parseFloat(stageStyle.paddingLeft) - parseFloat(stageStyle.paddingRight);
        const height = S.ctx.size.height - parseFloat(stageStyle.paddingTop) - parseFloat(stageStyle.paddingBottom);
        Object.assign(S.root.style, { width: `${width}px`, height: `${height}px` });
        S.root.classList.toggle('quiz-condensed', height < 740);
        S.root.classList.toggle('quiz-tight', height < 640);
        S.compactQuiz = height < 600;
        S.surface = el('div', 'lms-surface quiz-surface', S.root);
        const row = el('div', 'ref-row', S.surface);
        const side = el('aside', 'qb-side', row);
        el('div', 'qb-side-title', side, 'Data Science 101');
        const sv = (d) => `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#111" stroke-width="2.1" stroke-linejoin="round" stroke-linecap="round">${d}</svg>`;
        const doc = '<path d="M5 2h10l5 5v15H5z"/><path d="M14 2v6h6M8.5 11h7M8.5 14.5h7M8.5 18h4"/>';
        const icons = {
          Home: '<path d="M3 11l9-8 9 8M5 10v11h5v-6h4v6h5V10"/>', Modules: doc, Quizzes: doc, Assignments: doc,
          Gradebook: '<path d="M2 22V13h5v9zM9.5 22V8h5v14zM17 22V2h5v20z"/>',
          People: '<circle cx="12" cy="7" r="3.3"/><path d="M5 21v-3c0-3 3-5 7-5s7 2 7 5v3zM5 4a3 3 0 000 6M19 4a3 3 0 010 6M4 13c-2 1-3 3-3 6h2M20 13c2 1 3 3 3 6h-2"/>',
          Settings: '<path d="M9 2h6l.7 3 2 .9 2.8-1 2.5 4.3-2.2 2v2l2.2 2-2.5 4.3-2.8-1-2 .9-.7 3H9l-.7-3-2-.9-2.8 1L1 15.2l2.2-2v-2L1 9.2l2.5-4.3 2.8 1 2-.9z"/><circle cx="12" cy="12" r="4"/>',
        };
        ['Home', 'Modules', 'Quizzes', 'Assignments', 'Gradebook', 'People', 'Settings'].forEach(name => { const it = el('div', name === 'Quizzes' ? 'qb-side-item on' : 'qb-side-item', side); it.innerHTML = sv(icons[name]); el('span', '', it, name); });
        const win = el('section', 'quiz-window', row);
        const title = el('div', 'quiz-window-title', win, 'Quiz Builder');
        el('div', 'ref-sub', win, 'Correlation and Prediction');
        const insp = el('aside', 'ref-inspector', row);
        const field = (label, value) => { const f = el('div', 'ref-field', insp); el('div', 'ref-label', f, label); el('div', 'ref-input ref-in-' + label.toLowerCase().replace(/ /g, ''), f, value); };
        el('div', 'ref-insp-title', insp, 'Quiz Details');
        field('Title', 'Correlation and Prediction');
        field('Course', 'Data Science 101');
        field('Points', '2');
        field('Due date', 'Apr 26, 2019');
        el('div', 'ref-hr', insp);
        el('div', 'ref-label', insp, 'Settings');
        [['Shuffle questions', true], ['Shuffle answer choices', false], ['Show one question at a time', false], ['Allow multiple attempts', false]].forEach(([label, on]) => { const c = el('div', 'ref-check', insp); el('i', on ? 'on' : '', c); el('span', '', c, label); });
        el('div', 'ref-hr', insp);
        field('Notes', 'This quiz covers correlation and making predictions from data.');
        if (S.compactQuiz) Object.assign(title.style, { height: '30px', padding: '2px 17px' });
        S.work = el('div', 'lms-work quiz-work', win);
        if (S.compactQuiz) S.work.style.padding = '7px';
        P.panes();
        P.footer();
      },
      panes: (base, S) => function () {
        const el = S.ctx.util.el, work = S.work;
        S.source = el('aside', 'lms-source quiz-brief', work);
        const right = el('section', 'quiz-right', work);
        const title = el('div', 'quiz-right-title', right, 'Quiz Questions');
        if (S.compactQuiz) Object.assign(title.style, { height: '32px', padding: '1px 13px' });
        S.tools = el('div', 'lms-tools quiz-tools', right);
        S.list = el('div', 'lms-question-list', S.tools);
        // Question navigation must never grow vertically and consume the editor.
        Object.assign(S.list.style, { display: 'flex', gap: '4px', width: 'auto', flex: 'none', minWidth: '0', overflow: 'auto', padding: '0' });
        if (S.compactQuiz) Object.assign(S.tools.style, { minHeight: '44px', padding: '5px 8px', flexWrap: 'nowrap' });
        S.note = el('span', 'lms-muted quiz-hidden-note', S.tools);
        S.main = el('div', 'lms-main quiz-main', right);
      },
      footer: (base, S) => function () {
        const el = S.ctx.util.el, foot = el('footer', 'lms-foot quiz-summary', S.surface);
        const title = el('div', 'quiz-summary-title', foot, 'Quiz Summary');
        S.summary = el('div', 'quiz-summary-counts', foot);
        S.statusText = el('span', 'saved', foot);
        if (S.compactQuiz) {
          Object.assign(foot.style, { minHeight: '64px', marginTop: '12px', padding: '0' });
          Object.assign(title.style, { height: '30px', padding: '1px 16px' });
          Object.assign(S.summary.style, { minHeight: '32px', padding: '4px 12px', gap: '8px', fontSize: '14px', flexWrap: 'wrap', whiteSpace: 'normal' });
        }
      },
      draw: (base, S) => function (m) {
        base(m);
        const el = S.ctx.util.el, items = m.questions || [];
        const remove = S.ctx.stage.querySelector('.quiz-tools .lms-btn:not(.primary)');
        if (remove) remove.style.display = items.length ? '' : 'none';
        const counts = [
          ['Questions', items.length],
          ['Total Points', items.reduce((sum, q) => sum + (Number(q.points) || 0), 0)],
          ['Multiple Choice', items.filter(q => /multiple/i.test(q.type)).length],
          ['True/False', items.filter(q => /true|false/i.test(q.type)).length],
          ['Short Answer', items.filter(q => /short/i.test(q.type)).length],
        ];
        S.summary.replaceChildren();
        counts.forEach(([label, value], i) => {
          if (i) el('span', 'quiz-summary-sep', S.summary, '|');
          el('span', 'quiz-summary-item', S.summary, `${label}:  ${value}`);
        });
      },
      quizToolbar: (base, S) => function () {
        base();
        if (S.editorRefs.add) {
          S.editorRefs.add.textContent = 'Add question';
          if (S.compactQuiz) Object.assign(S.editorRefs.add.style, { minWidth: '0', height: '32px', flex: '1 1 auto' });
        }
      },
      questionNav: (base, S) => function (q, i, m) {
        base(q, i, m);
        const button = S.list.lastElementChild;
        Object.assign(button.style, { width: '42px', minWidth: '42px', flex: 'none', margin: '0' });
      },
      sourceStamp: (base, S) => function () {},
      drawSource: (base, S) => function () { S.P.sourceStamp(); S.P.quizSource(); },
      quizSource: (base, S) => function () {
        const P = S.P, el = S.ctx.util.el, s = S.spec;
        el('h3', 'quiz-brief-title', S.source, 'Questions for this quiz');
        const table = el('table', 'quiz-brief-table', S.source), hr = el('tr', '', el('thead', '', table));
        ['#', 'Question', 'Type', 'Options / Choices', 'Answer Key', 'Points'].forEach(n => el('th', '', hr, n));
        S.briefBody = el('tbody', '', table);
        s.bank.forEach((q, i) => P.sourceQuestion(q, i));
      },
      sourceQuestion: (base, S) => function (q, i) {
        const el = S.ctx.util.el, a = el('tr', 'quiz-brief-item', S.briefBody);
        el('td', '', a, String(i + 1));
        el('td', '', a, q.title);
        el('td', '', a, q.type);
        const list = el('ul', 'quiz-brief-options', el('td', '', a));
        q.options.forEach((value) => el('li', '', list, value));
        el('td', '', a, String(q.options[q.correct] != null ? q.options[q.correct] : String.fromCharCode(65 + q.correct)));
        el('td', '', a, String(q.points));
        S.P.item(S.ctx, a, 'sourceQuestion', q);
      },
      quizHeading: (base, S) => function () {},
      emptyQuiz: (base, S) => function () {
        const el = S.ctx.util.el;
        const box = el('div', 'quiz-question-table quiz-empty-state', S.main);
        const icon = el('div', 'quiz-empty-file', box);
        icon.innerHTML = '<svg viewBox="0 0 28 36" fill="none" stroke="#111" stroke-width="2.6" stroke-linejoin="round"><path d="M2 2h16l8 8v24H2z"/><path d="M18 2v8h8"/></svg>';
        el('span', '', box, 'No questions added yet.');
        el('span', '', box, 'Use the button below to add a question to this quiz.');
      },
    },
  },
});
