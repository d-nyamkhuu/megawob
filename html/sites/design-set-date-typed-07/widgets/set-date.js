// Adds the task title row and the site's exact description and auxiliary fields.
env.widget({
  task: 'set-date',
  site: 'design-set-date-typed-07',
  name: 'design',
  split: 'train',
  scenarios: ['typed'],
  template: 'set-date/calendar',
  design: {
    parts: {
      typedBefore: (base, S) => (ctx) => {
        const { util } = ctx;
        const { card } = S;
        const title = util.el('div', 'fd-titlerow', card);
        util.el('label', '', title, 'Title:');
        util.el('div', 'fd-titlebox', title);
        const context = util.el('div', 'fd-context', card);
        util.el('label', '', context, 'Description:');
        const description = util.el('div', 'fd-description', context, '');
        util.el('span', 'fd-scroll-arrow up', description, '▲');
        util.el('span', 'fd-scroll-arrow down', description, '▼');
      },
      typedAfter: (base, S) => (ctx) => {
        const { util } = ctx;
        const aux = util.el('div', 'fd-auxgrid', S.card);
        [['Priority:', 'Normal'], ['Category:', 'Planning']].forEach(([label, value]) => {
          const box = util.el('div', 'fd-dd', aux);
          util.el('label', '', box, label);
          const field = util.el('div', 'fd-static', box, value);
          util.el('i', '', field, '▼');
        });
      },
    },
  },
});
