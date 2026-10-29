// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-sort-02',
  name: 'design',
  split: 'train',
  scenarios: ['sort'],
  template: 'use-data-grid/grid',
  design: {
    parts: {
      toolbar(base, S) {
        return function () {
          base();
          if (S.input) return;
          const search = S.util.el('label', 'to-search to-search-live', S.head);
          search.innerHTML = S.D.icons.search;
          const input = S.util.el('input', '', search);
          input.type = 'search';
          input.placeholder = 'Search orders…';
          input.setAttribute('aria-label', 'Search orders');
          input.value = S.ctx.model.query || '';
          input.addEventListener('input', () => S.P.act(S.fam.helpers.setQuery(S.ctx.model, input.value), false));
          S.input = input;
        };
      },
    },
  },
});
