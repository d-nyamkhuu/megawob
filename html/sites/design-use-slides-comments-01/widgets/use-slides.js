// Design on the use-slides/office template; defaults reproduce the scaffold.
env.widget({
  task: 'use-slides',
  site: 'design-use-slides-comments-01',
  name: 'design',
  split: 'train',
  scenarios: ['comments'],
  template: 'use-slides/office',
  design: {
    uiFont: 'Arial,sans-serif',
    documentFont: 'Courier New,monospace',
    parts: {
      layout: (base, S) => (ctx) => {
        base(ctx);
        const root = S.root;
        root.querySelector('.as-filetabs')?.remove();
        root.querySelector('.as-menu')?.remove();
        root.querySelector('.as-projects')?.remove();
        const quick = root.querySelector('.as-quick'), taskTools = root.querySelector('.as-tools');
        if (quick && taskTools) { quick.append(...taskTools.childNodes); taskTools.remove(); }
      },
      document: (base, S) => (main) => {
        const P = S.P, u = S.ctx.util, spec = S.spec;
        const editor = u.el('div', 'as-editor pixel-document', main);
        const docPane = P.register(u.el('div', 'as-scroll', editor), 'pane:document');
        const { paper, body } = P.paper(docPane), ranges = [];
        let offset = 0;
        spec.paragraphs.forEach((text, i) => {
          const { node, range } = P.paragraph(body, text, i, null, docPane);
          ranges.push(range); S.segments.push({ node, start: offset }); offset += text.length + 2;
        });
        P.paperFooter(paper);
        P.scrolling(docPane, 'document', ranges);
        const side = u.el('aside', 'as-review pixel-comments', main);
        main.prepend(side);
        const cap = P.register(u.el('div', 'as-cap', side), 'reviewCount');
        cap.textContent = 'Comments';
        P.comments(side, body);
      },
      comments: (base, S) => (side, body) => {
        const P = S.P, u = S.ctx.util;
        const list = P.register(u.el('div', 'as-scroll pixel-comment-scroll', side), 'pane:comments');
        P.scrolling(list, 'comments', []);
        const empty = P.register(u.el('div', 'as-empty pixel-empty', list), 'commentEmpty');
        P.icon(empty, 'comment');
        u.el('strong', '', empty, 'No comments yet');
        u.el('span', '', empty, 'Select text in the document and click Comment to add a note.');
        S.commentList = u.el('div', 'pixel-comment-list', list);
        P.composer(side);
        S.selection = env.ui.textSelection(body, { segments: S.segments, length: S.spec.doc.length,
          value: S.ctx.model.selection, onChange: (v) => P.commit({ selection: v }), label: 'comment anchor' });
      },
      syncComments: (base, S) => (model) => {
        base(model);
        S.refs.reviewCount.textContent = 'Comments';
      },
    },
  },
});
