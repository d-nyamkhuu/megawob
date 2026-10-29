// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-share-01',
  name: 'design',
  split: 'train',
  scenarios: ['share'],
  template: 'protect-privacy/classic',
  design: {
    parts: {
      documentHeader: (_base, S) => (doc) => {
        const P = S.P;
        const h = P.element('div', 'sp-doc-h mac-doc-head', doc);
        P.element('span', 'mac-file-icon', h, '▤');
        const block = P.element('div', 'mac-doc-titleblock', h);
        P.element('div', 't', block, S.spec.doc);
        P.element('div', 'mac-doc-meta', block, 'Last modified Mar 3, 1988 by Elena Ruiz');
        const b = P.key(P.element('button', 'sp-btn mac-share', h, '↥  Share…'), 'share-open');
        b.type = 'button';
      },
      documentPaper: (_base, S) => (doc) => {
        const P = S.P;
        const viewport = P.element('div', 'mac-document-viewport', doc);
        const page = P.element('div', 'sp-paper mac-document-page', viewport);
        const mast = P.element('div', 'mac-masthead', page);
        const mark = P.element('div', 'mac-wordmark', mast);
        P.element('strong', '', mark, 'HALCYON');
        P.element('span', 'mac-sunmark', mark);
        P.element('div', 'mac-attribution', mast, 'Human Resources\nHalcyon Corporation');
        P.element('div', 'mac-rule', page);
        P.element('h3', 'mac-page-title', page, S.spec.doc);
        P.element('p', 'mac-intro', page, 'This guide provides an overview of the benefits available to Halcyon employees and how to enroll. Please review the information carefully and follow the steps for completing your enrollment.');
        const headings = ['Overview', 'Eligibility', 'Medical and Dental'];
        for (let i = 0; i < 3; i++) {
          P.element('h4', 'mac-section-title', page, `${i + 1}.  ${headings[i]}`);
          P.element('p', 'mac-section-copy', page, env.content.paragraph(S.ctx.rng.fork(`p${i}`), 3));
        }
      },
    },
  },
});
