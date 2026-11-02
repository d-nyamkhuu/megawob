// Design on the shared use-course-admin course workspace.
env.widget({
  task: 'use-course-admin',
  site: 'design-use-course-admin-quiz-03',
  name: 'design',
  split: 'train',
  scenarios: ['quiz'],
  template: 'use-course-admin/workspace',
  design: {
    parts: {
      frame: (base, S) => () => {
        const { util, P, spec, ctx } = S;
        const el = util.el;
        const root = P.root();
        S.root = root;
        root.classList.add('aero-quiz');
        const width = Math.max(0, ctx.size.width);
        const height = Math.max(0, ctx.size.height);
        Object.assign(root.style, { inset: '0', width: `${width}px`, height: `${height}px` });
        const surface = el('div', 'lms-surface aero-surface', root);
        S.surface = surface;
        const head = el('header', 'aero-quiz-head', surface);
        Object.assign(head.style, { display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 14px', height: `${Math.min(106, Math.max(60, height * .19))}px` });
        const heading = el('div', '', head);
        Object.assign(heading.style, { flex: '0 1 42%', minWidth: '0' });
        el('h1', '', heading, 'Quiz: Unit 2 Check');
        const meta = el('div', 'aero-quiz-meta', heading);
        Object.assign(meta.style, { flexWrap: 'wrap', gap: '5px 10px', fontSize: '12px' });
        el('span', '', meta, 'Due　 Apr 17, 2026');
        el('i', '', meta);
        el('span', '', meta, 'Points　 20');
        el('i', '', meta);
        el('span', '', meta, 'Questions　 0');
        const work = el('div', 'lms-work aero-work', surface);
        S.work = work;
        const canvas = el('section', 'aero-canvas', work);
        Object.assign(canvas.style, { display: 'flex', flexDirection: 'column', minWidth: '0' });
        const main = el('div', 'lms-main aero-main', canvas);
        Object.assign(main.style, { flex: '1 1 0', height: 'auto', minHeight: '120px' });
        P.toolbar();
        const tools = S.tools;
        tools.classList.add('aero-tools');
        Object.assign(tools.style, { flex: '1 1 0', justifyContent: 'center', padding: '6px', gap: '5px' });
        head.append(tools);
        const source = el('aside', 'lms-source aero-brief', work);
        Object.assign(source.style, { flex: `0 0 ${Math.min(460, width * .36)}px`, minWidth: '0', padding: '0 12px 12px' });
        const inspector = el('aside', 'aero-inspector', work);
        Object.assign(inspector.style, { flex: `0 0 ${Math.min(302, width * .22)}px`, minWidth: '0' });
        const title = el('h3', '', inspector, 'Quiz Properties');
        S.list = el('div', 'aero-question-list', inspector);
        Object.assign(S.list.style, { display: 'flex', overflow: 'auto', maxHeight: '62px', gap: '4px' });
        const field = (label, value, multiline) => {
          const wrap = el('label', 'aero-field', inspector);
          el('span', '', wrap, label);
          const input = el(multiline ? 'textarea' : 'input', '', wrap);
          input.value = value;
        };
        field('Title', 'Unit 2 Check');
        field('Description', 'Short quiz covering primary sources and research methods from Unit 2.', true);
        field('Due Date', 'Apr 17, 2026');
        field('Total Points', '20');
        field('Attempts Allowed', '1');
        for (const [label, checked] of [['Shuffle Questions', false], ['Shuffle Answer Choices', true], ['Show Results to Students', true], ['Time Limit (minutes)', false]]) {
          const row = el('label', 'aero-check', inspector);
          const box = el('input', '', row); box.type = 'checkbox'; box.checked = checked;
          el('span', '', row, label);
        }
        field('Availability', 'Visible to students');
        S.main = main; S.source = source; S.tools = tools;
        P.footer();
      },
      questionRail: () => () => {},
      sourceStamp: () => () => {},
      activity: () => () => {},
      quizHeading: () => () => {},
      quizEditor: (base, S) => (m) => {
        base(m);
        // Leave enough overlap between the oracle's 170px scroll steps for
        // the complete text field to be visible in the compact editor pane.
        const title = S.targets.get('title');
        if (title) title.style.height = `${Math.min(66, Math.max(24, S.main.clientHeight - 174))}px`;
      },
      sourceQuestion: (base, S) => (q, i) => {
        const { util, P, source, ctx } = S;
        const article = util.el('article', '', source);
        util.el('span', 'aero-q-number', article, String(i + 1));
        util.el('b', 'aero-q-title', article, q.title);
        const detail = (label, value) => {
          const row = util.el('div', 'aero-q-detail', article);
          util.el('span', '', row, label);
          util.el('b', '', row, value);
          return row;
        };
        detail('Question Type', q.type);
        const opts = detail(`Options (${q.options.length})`, '');
        const ul = util.el('ul', '', opts);
        q.options.forEach((option, index) => util.el('li', '', ul, option));
        detail('Answer Key', q.options[q.correct] || '—');
        detail('Points', String(q.points));
        P.item(ctx, article, 'sourceQuestion', q);
      },
      emptyQuiz: (base, S) => () => {
        const { util, P } = S;
        const empty = util.el('div', 'aero-empty', S.main);
        const doc = util.el('div', 'aero-document', empty);
        util.el('span', 'aero-plus', doc, '+');
        util.el('b', '', empty, 'This quiz has no questions yet.');
        util.el('span', '', empty, 'Add a question to get started.');
      },
      quizSettings: () => () => {},
    },
  },
});
