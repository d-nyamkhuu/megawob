// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-share-02',
  name: 'design',
  split: 'train',
  scenarios: ['share'],
  template: 'protect-privacy/classic',
  design: {
    parts: {
      documentHeader(base, S) { return (doc, m) => {
        const { P } = S;
        const dh = P.element('div', 'sp-doc-h flash-doc-head', doc);
        P.element('span', 'flash-file-icon', dh, '▤');
        const title = P.element('div', 'flash-title-meta', dh);
        P.element('div', 't', title, S.spec.doc);
        P.element('div', 'flash-meta', title, 'Updated Apr 10, 2002 by Taylor Kim　│　Shared with 3 people');
        const sp = P.element('span', '', dh); sp.style.flex = '1';
        const sb = P.key(P.element('button', 'sp-btn pri flash-share', dh, '♟　Share'), 'share-open');
        sb.style.borderRadius = '0';
      }; },
      documentPaper(base, S) { return (doc) => {
        const { P } = S;
        // Keep the template's three seeded content draws in their original order.
        for (let i = 0; i < 3; i++) env.content.paragraph(S.ctx.rng.fork(`p${i}`), 3);
        const paper = P.element('div', 'sp-paper flash-paper', doc);
        P.element('h3', '', paper, 'Company Offsite');
        P.element('h4', '', paper, 'Agenda');
        P.element('div', 'flash-event-meta', paper, 'May 14–15, 2002');
        P.element('div', 'flash-event-meta', paper, 'Pine Ridge Conference Center');
        P.element('div', 'flash-rule', paper);
        const day = P.element('div', 'flash-day', paper, 'Day 1 — May 14');
        const rows = [['9:00','Welcome and goals'],['9:30','Team updates'],['11:00','Break'],['11:15','Product roadmap'],['12:30','Lunch'],['1:30','Breakout sessions'],['3:00','Wrap up']];
        const agenda = P.element('div', 'flash-agenda', paper);
        for (const [time, label] of rows) {
          const row = P.element('div', 'flash-agenda-row', agenda);
          P.element('span', 'flash-time', row, time);
          P.element('span', '', row, label);
        }
      }; },
    },
  },
});
