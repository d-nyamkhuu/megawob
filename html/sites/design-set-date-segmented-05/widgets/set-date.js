// Design on templates/set-date/base.js: the base site's set-date widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'set-date',
  site: 'design-set-date-segmented-05',
  name: 'design',
  split: 'train',
  scenarios: ['segmented'],
  template: 'set-date/base',
  design: {
    parts: {
      renderCard: (base, S) => function (ctx, look) {
        const result = base(ctx, look);
        const { util } = ctx;
        const card = S.card;
        const main = S.control.closest('.fd-row');
        main.classList.add('vista-date-row');
        const extras = Array.from(card.querySelectorAll('.fd-ex'));
        const subject = util.el('div', 'vista-subject fd-row', null);
        util.el('div', 'fd-label', subject, 'Subject:');
        util.el('div', 'fd-static', subject, 'Update project plan');
        card.prepend(subject);
        subject.after(main);
        for (const row of extras) card.append(row);
        const fillers = [['Priority:', 'Normal'], ['Status:', 'Not Started'], ['Category:', 'Work']];
        for (let i = extras.length; i < 3; i++) {
          const row = util.el('div', 'fd-row fd-ex', card);
          util.el('div', 'fd-label', row, fillers[i][0]);
          util.el('div', 'fd-static', row, fillers[i][1]);
        }
        const notes = util.el('div', 'vista-notes', card);
        util.el('div', 'fd-label', notes, 'Notes:');
        const box = util.el('div', 'vista-notes-box', notes);
        const scroll = util.el('div', 'vista-notes-scroll', box);
        util.el('span', '', scroll, '');
        util.el('span', '', scroll, '');
        return result;
      },
    },
  },
});
