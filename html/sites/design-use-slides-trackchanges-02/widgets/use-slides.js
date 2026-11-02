// Design on the use-slides/office template; defaults reproduce the scaffold.
env.widget({
  task: 'use-slides',
  site: 'design-use-slides-trackchanges-02',
  name: 'design',
  split: 'train',
  scenarios: ['trackchanges'],
  template: 'use-slides/office',
  design: {
    uiFont: 'Segoe UI, Arial, sans-serif', documentFont: 'Segoe UI, Arial, sans-serif',
    brand: 'Word', workspace: 'Project Plan', documentTitle: 'Project Plan',
    parts: {
      document: (base, S) => (main) => {
        const P = S.P, U = S.ctx.util;
        const editor = U.el('div', 'as-editor', main);
        const docPane = P.register(U.el('div', 'as-scroll metro-document-scroll', editor), 'pane:document');
        const { paper, body } = P.paper(docPane), paragraphEls = [];
        let offset = 0;
        S.spec.paragraphs.forEach((text, i) => {
          const { node, range } = P.paragraph(body, text, i, undefined, docPane);
          paragraphEls.push(range); S.segments.push({ node, start: offset }); offset += text.length + 2;
          if (S.spec.scenario === 'trackchanges') P.revisionLine(body, i);
        });
        P.paperFooter(paper);
        P.scrolling(docPane, 'document', paragraphEls);
        const review = U.el('section', 'metro-review-list', main);
        const cap = P.register(U.el('div', 'as-cap metro-review-cap', review), 'reviewCount');
        P.reviewFilters(review); P.changes(review);
        cap.textContent = 'Revisions';
      },
    },
  },
});
