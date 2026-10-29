// This design keeps the reminder copy, title row, date example, and newspaper form actions.
env.widget({
  task: 'set-date',
  site: 'design-set-date-typed-10',
  name: 'design',
  split: 'train',
  scenarios: ['typed'],
  template: 'set-date/calendar',
  design: {
    title: 'Create Reminder',
    typedAux: [['Priority', 'Normal'], ['Category', 'Work']],
    parts: {
      heading: (base, S) => (ctx) => {
        const { util } = ctx;
        const { card } = S;
        util.el('div', 'fd-tag', card, 'Keep track of what matters.');
        util.el('div', 'fd-rule', card);
        const row = util.el('div', 'fd-row fd-titlerow', card);
        util.el('div', 'fd-label', row, 'Title');
        util.el('div', 'fd-static fd-titleval', row, 'Renew newspaper subscription');
      },
      typedBefore: (base, S) => (ctx) => {
        const { util } = ctx;
        const context = util.el('div', 'fd-context', S.card);
        util.el('label', '', context, 'Details');
        const description = util.el('div', 'fd-description', context);
        description.append('Set a reminder to renew my subscription');
        util.el('br', '', description);
        description.append('for next year.');
      },
      textCreated: (base, S) => (ctx, row, help, shown) => {
        ctx.util.el('div', 'fd-example', help,
          'e.g. ' + shown.replace('DD', '29').replace('MM', '07').replace('YYYY', '2027'));
      },
      typedAfter: (base, S) => (ctx) => {
        base(ctx);
        const { util } = ctx;
        util.el('a', 'fd-cancel', S.card, 'Cancel');
        const clear = util.el('button', 'fd-clear', S.card, 'Clear');
        clear.type = 'button';
        clear.addEventListener('click', () => {
          ctx.update({ text: '' });
          S.P.paint();
        });
      },
    },
  },
});
