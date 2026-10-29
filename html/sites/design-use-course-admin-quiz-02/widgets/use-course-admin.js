// Design on the shared use-course-admin course workspace.
env.widget({
  task: 'use-course-admin',
  site: 'design-use-course-admin-quiz-02',
  name: 'design',
  split: 'train',
  scenarios: ['quiz'],
  template: 'use-course-admin/workspace',
  design: {
    inset: 12,
    radius: 0,
    fontSize: 14,
    parts: {
      // Build the vertical quiz layout before the template registers its controls.
      frame: (base, S) => () => {
        const { el } = S.util;
        S.root = S.P.root();
        S.surface = el('div', 'lms-surface', S.root);
        S.work = el('div', 'lms-work mac-quiz-work', S.surface);
        S.P.panes();
        S.P.toolbar();
        S.list = el('div', 'mac-question-nav', S.tools);
        S.P.footer();
      },
      panes: (base, S) => () => {
        S.source = S.util.el('aside', 'lms-source mac-quiz-brief', S.work);
        S.main = S.util.el('div', 'lms-main mac-quiz-main', S.work);
      },
      drawSource: (base, S) => () => S.P.quizSource(),
      buildQuiz: (base, S) => (model) => {
        const previous = S.lastEditor;
        base(model);
        if (previous && previous !== S.lastEditor) S.ctx.reanchor();
      },
      questionNav: (base, S) => (q, i, m) => {
        const button = S.P.button(S.list, `Q${i + 1}`, () => S.P.act({ ...S.ctx.model, active: i }),
          `lms-qnav${i === m.active ? ' current' : ''}`);
        button.title = `${q.title || 'Untitled question'} / ${q.points || '0'} pts`;
        S.editorRefs[`nav:${i}`] = button;
      },
      styles: (base, S) => () => base() + `
        .lms.quiz { color:#111; background:#e7e8e9; border-color:#aeb2b7; }
        .mac-quiz-work { flex-direction:column; gap:12px; }
        .mac-quiz-work:has(.lms-editor) { flex-direction:row; gap:0; }
        .mac-quiz-work:has(.lms-editor) .mac-quiz-brief { flex:0 0 27%; border-right:1px solid #aeb2b7; }
        .mac-quiz-work:has(.lms-editor) .mac-quiz-main { flex:1; min-height:0; }
        .mac-quiz-brief { flex:0 1 62%; min-height:64px; min-width:0; max-width:none;
          border:0; border-bottom:1px solid #aeb2b7; background:#f5f6f7; }
        .mac-quiz-main { flex:1 1 38%; min-height:120px; background:#f8f9fa; }
        .mac-question-nav { display:flex; flex:none; max-width:180px; overflow:auto; gap:4px; }
        .mac-question-nav:empty { display:none; }
        .mac-question-nav .lms-qnav { flex:none; width:auto; margin:0; padding:5px 9px; }
        .lms.quiz .lms-tools { flex-wrap:wrap; }
        .lms.quiz .lms-source h3 { font-size:20px; }
        .lms.quiz .lms-source p, .lms.quiz .lms-source ol { font-size:14px; }
        .lms.quiz .lms-empty { padding:18px; }
        .lms.quiz .lms-btn, .lms.quiz .lms-types button { color:#111; border-color:#797d82;
          border-radius:7px; background:linear-gradient(#fff,#d1d3d5);
          box-shadow:inset 1px 1px #fff,inset -1px -1px #aaa; }
        .lms.quiz .lms-btn:hover { background:linear-gradient(#fff,#dcecff); }
        .lms.quiz .lms-types button.on { border-color:#397dbf; background:#d9e8fa; }
        .lms.quiz .lms-foot { background:linear-gradient(#eee,#d5d6d8); }
      `,
    },
  },
});
