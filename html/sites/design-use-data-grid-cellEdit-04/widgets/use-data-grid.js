// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-cellEdit-04',
  name: 'design',
  split: 'train',
  scenarios: ['cellEdit'],
  template: 'use-data-grid/grid',
  design: {
    parts: {
      toolbar(base, S) {
        return () => {
          base();
          const search = S.util.el('div', 'native-grid-search', S.tools, '⌕  Search by title, author or SKU…');
          search.setAttribute('aria-hidden', 'true');
          const categories = S.util.el('button', 'native-grid-filter', S.tools, 'All Categories  ﹀');
          categories.type = 'button';
          const suppliers = S.util.el('button', 'native-grid-filter', S.tools, 'All Suppliers  ﹀');
          suppliers.type = 'button';
          const category = S.spec.cols.find((c) => c.type === 'cat');
          if (category) categories.addEventListener('click', () => S.P.act(S.fam.helpers.openMenu(S.ctx.model, S.spec, category.id, 'filter')));
          else categories.addEventListener('click', () => env.log('decoy', { label: 'All Categories' }));
          const supplier = S.spec.cols.find((c) => /supplier/i.test(c.label));
          if (supplier) suppliers.addEventListener('click', () => S.P.act(S.fam.helpers.openMenu(S.ctx.model, S.spec, supplier.id, 'filter')));
          else suppliers.addEventListener('click', () => env.log('decoy', { label: 'All Suppliers' }));
        };
      },
      heading(base, S) {
        return () => {
          base();
          S.title.textContent = 'Inventory';
          S.object.style.order = '-10';
          S.count.style.order = '-9';
          const buttons = [...S.head.querySelectorAll('button')];
          if (buttons.length >= 3) {
            buttons[0].lastChild.textContent = 'Edit';
            buttons[1].lastChild.textContent = 'Delete';
            buttons[2].lastChild.textContent = 'Add';
            buttons[0].style.order = '2';
            buttons[1].style.order = '3';
            buttons[2].style.order = '1';
          }
          const more = S.util.el('button', 'to-btn', S.head, 'More');
          more.type = 'button';
          more.style.order = '4';
          more.addEventListener('click', () => env.log('decoy', { label: 'More' }));
        };
      },
    },
  },
});
