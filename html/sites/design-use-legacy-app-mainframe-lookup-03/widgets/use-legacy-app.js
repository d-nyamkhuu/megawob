// Design on use-legacy-app/terminal; defaults reproduce this scaffold.
env.widget({
  task: 'use-legacy-app',
  site: 'design-use-legacy-app-mainframe-lookup-03',
  name: 'design',
  split: 'train',
  scenarios: ['mainframe-lookup'],
  template: 'use-legacy-app/terminal',
  design: {
    parts: {
      field: (base) => function (parent, id, row, col, size) {
        const field = base(parent, id, row, col, size);
        if (id === 'answer') field.setAttribute('aria-label', 'Report value; enter digits and a decimal point only, without currency symbols or commas');
        return field;
      },
    },
  },
});
