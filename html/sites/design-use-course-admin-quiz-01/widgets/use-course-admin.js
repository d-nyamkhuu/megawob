// Design on the shared use-course-admin course workspace.
env.widget({
  task: 'use-course-admin',
  site: 'design-use-course-admin-quiz-01',
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
        // ctx.size includes the stage padding; keep the framed window inside it.
        const stageStyle = getComputedStyle(S.ctx.stage);
        const width = S.ctx.size.width - parseFloat(stageStyle.paddingLeft) - parseFloat(stageStyle.paddingRight);
        const height = S.ctx.size.height - parseFloat(stageStyle.paddingTop) - parseFloat(stageStyle.paddingBottom);
        Object.assign(S.root.style, { width: `${width}px`, height: `${height}px` });
        S.compactQuiz = height < 600;
        S.surface = el('div', 'lms-surface quiz-surface', S.root);
        const win = el('section', 'quiz-window', S.surface);
        const title = el('div', 'quiz-window-title', win, 'Quiz Editor');
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
          S.editorRefs.add.textContent = 'Add Question…';
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
        P.icon(el('h3', 'quiz-brief-title', S.source, 'Question Brief'), 'file');
        s.bank.forEach((q, i) => P.sourceQuestion(q, i));
      },
      sourceQuestion: (base, S) => function (q, i) {
        const el = S.ctx.util.el, a = el('article', 'quiz-brief-item', S.source);
        const title = el('div', 'quiz-question-prompt', a);
        el('b', '', title, `${i + 1}.`); el('strong', '', title, q.title);
        const row = (label, parent = a) => { const r = el('div', 'quiz-brief-row', parent); el('b', '', r, label); return r; };
        const type = row('Type:'); el('span', '', type, q.type);
        const opts = row('Options:');
        const list = el('ol', 'quiz-brief-options', opts);
        q.options.forEach((value, j) => el('li', '', list, value));
        const key = row('Answer key:'); el('span', '', key, String.fromCharCode(65 + q.correct));
        const points = row('Points:'); el('span', '', points, String(q.points));
        S.P.item(S.ctx, a, 'sourceQuestion', q);
      },
      quizHeading: (base, S) => function () {},
      emptyQuiz: (base, S) => function () {
        const el = S.ctx.util.el, box = el('div', 'lms-empty quiz-empty', S.main);
        const table = el('table', 'quiz-question-table', S.main);
        const head = el('thead', '', table), tr = el('tr', '', head);
        for (const name of ['#', 'Question', 'Type', 'Points', 'Actions']) el('th', '', tr, name);
        const body = el('tbody', '', table), empty = el('tr', '', body), cell = el('td', '', empty);
        cell.colSpan = 5;
        el('span', '', cell, 'No questions added yet.');
      },
    },
  },
});
