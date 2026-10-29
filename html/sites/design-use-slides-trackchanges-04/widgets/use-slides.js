// Design on the use-slides/office template; defaults reproduce the scaffold.
env.widget({
  task: 'use-slides',
  site: 'design-use-slides-trackchanges-04',
  name: 'design',
  split: 'train',
  scenarios: ['trackchanges'],
  template: 'use-slides/office',
  design: {
    parts: {
      changeCard(_base, S) {
        return function(reviewPane, change, i) {
          const P = S.P, ctx = S.ctx, u = ctx.util;
          const card = u.el('div', 'as-card as-change', reviewPane);
          const icon = u.el('div', 'as-change-icon', card); P.icon(icon, 'document');
          const detail = u.el('div', 'as-change-detail', card);
          u.el('div', 'as-change-text', detail, `Change: ${change.before} → ${change.after}`);
          u.el('div', 'as-change-author', detail, `By: ${change.author}`);
          P.register(u.el('div', 'as-resolution', card, 'Pending'), `resolution:${i}`);
          const actions = u.el('div', 'as-actions', card);
          for (const [action, label] of [['accept', 'Accept'], ['reject', 'Reject'], ['undo', 'Undo']]) {
            P.button(actions, label, `revision:${i}:${action}`, () => P.commit({ decisions: ctx.model.decisions.map((x, j) => i === j ? action === 'undo' ? 'pending' : action : x) }));
          }
          P.cardDecorated(card, change, i);
          return actions;
        };
      },
      document(base, S) {
        return function(main) {
          const P = S.P, ctx = S.ctx, s = S.spec;
          P.review(main, null);
          const editor = ctx.util.el('div', 'as-editor', main);
          P.ruler(editor, 11);
          const docPane = P.register(ctx.util.el('div', 'as-scroll', editor), 'pane:document');
          const { paper, body } = P.paper(docPane), paragraphEls = [];
          let offset = 0;
          s.paragraphs.forEach((text, i) => {
            const { node, range } = P.paragraph(body, text, i, null, docPane);
            paragraphEls.push(range); S.segments.push({ node, start: offset }); offset += text.length + 2;
            P.revisionLine(body, i);
          });
          P.paperFooter(paper);
          P.scrolling(docPane, 'document', paragraphEls);
          P.inspector(main);
        };
      },
    },
    uiFont: 'Arial, sans-serif',
    documentFont: 'Times New Roman, serif',
    brand: 'Office Writer',
    editorLabel: 'Office Writer - Project Plan.doc',
    documentTitle: 'Project Plan',
    reviewWidth: 315,
    compactReviewWidth: 280,
    inspectorWidth: 260,
    frameInset: 6,
    inspectorAt: 720,
    outlineAt: 0,
  },
});
