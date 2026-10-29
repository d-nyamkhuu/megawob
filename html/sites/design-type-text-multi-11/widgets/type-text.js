env.widget({
  task: 'type-text',
  site: 'design-type-text-multi-11',
  name: 'design',
  split: 'train',
  scenarios: ['multi'],
  template: 'type-text/fields',
  design: {
    layout: 'columns',
    title: null,
    titleHidden: true,
    fit: null,
    placeholderField: '',
    parts: {
      labelText: () => (f, look) => f.label + (look.optional && f.blank ? ' (optional)' : f.blank ? '' : ' *'),
      fieldDone: () => (ctx, e) => {
        e.wrap.dataset.optional = e.f.blank ? 'true' : 'false';
      },
      // Required fields first in two columns, then the optional ones, then the page's footer in the grid.
      finish: () => (ctx, card) => {
        const { spec } = ctx;
        const grid = card.querySelector('.ft-grid');
        const fields = [...grid.children];
        const required = fields.filter((x) => x.dataset.optional !== 'true');
        const optional = fields.filter((x) => x.dataset.optional === 'true');
        required.forEach((x, i) => {
          x.style.gridColumn = String(i % 2 + 1);
          x.style.gridRow = String(Math.floor(i / 2) + 1);
        });
        const lastRow = optional.length ? Math.max(3, Math.ceil(required.length / 2) + 1) : Math.floor(required.length / 2) + 1;
        optional.forEach((x, i) => {
          x.style.gridColumn = String(i % 2 + 1);
          x.style.gridRow = String(lastRow + Math.floor(i / 2));
        });
        const footer = ctx.stage.closest('.ds-content').querySelector('.ds-footer');
        if (footer) {
          grid.append(footer);
          footer.style.gridColumn = '2';
          footer.style.gridRow = String(lastRow + Math.floor(optional.length / 2));
        }
        const rows = Math.max(Math.ceil(required.length / 2), optional.length ? lastRow + Math.floor((optional.length - 1) / 2) : 0, footer && !footer.classList.contains('ds-footer-empty') ? lastRow + Math.floor(optional.length / 2) : 0);
        card.style.setProperty('--ft-rows', rows);
        card.style.setProperty('--ft-action-space', spec.save ? '7vh' : '0px');
      },
    },
  },
});
