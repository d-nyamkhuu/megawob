// Design on templates/click-control/base.js: the base site's click-control widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'click-control',
  site: 'design-click-control-rows-04',
  name: 'design',
  split: 'train',
  scenarios: ['rows'],
  template: 'click-control/base',
  design: {
    parts: {
      buildRows: (base) => (ctx, content, up) => {
        const view = base(ctx, content, up);
        const table = content.querySelector('.uc-rows');
        const actions = table.querySelector('.uc-acts');
        // Reserve the full action strip before the episode freezes its anchors.
        // Hidden buttons still have geometry; each seeded label must fit here.
        actions.style.width = 'max-content';
        const gutter = Math.ceil(actions.getBoundingClientRect().width) + 4;
        for (const row of table.rows) {
          const cell = row.lastElementChild;
          cell.style.order = '-1';
          cell.style.flex = `0 0 ${gutter}px`;
          cell.style.width = `${gutter}px`;
          cell.style.padding = '0 2px';
          cell.style.justifyContent = 'flex-start';
        }
        return view;
      },
    },
  },
});
