// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-compare-04',
  name: 'design',
  split: 'train',
  scenarios: ['compare'],
  template: 'use-shop/base',
  design: {
    parts: {
      'shoppingCompare': (base, S) => function (view, m) {
        const { ICON, env, productArt, trackFocus } = S;
        const { ctx, util, s, cash, pane, button, update, registerControl } = view;
        const search = util.el('div', 'compare-search', pane);
        search.innerHTML = ICON.search;
        const searchField = env.ui.textField(util.el('input', 'compare-search-input', search), {
          value: ctx.model.text || '', label: 'Search backpacks', placeholder: 'Search backpacks',
          onInput: (v) => update({ text: v }),
        });
        trackFocus(ctx, search.querySelector('input'), 'search');
        const filterLabels = [
          'Min. capacity (L)',
          'Max. weight (g)',
          'Max. price (USD)',
          'Min. warranty (years)',
        ];
        const filters = util.el('div', 'compare-filters', pane);
        const filterInputs = [];
        filterLabels.forEach((label) => {
          const field = util.el('label', 'compare-filter', filters);
          util.el('span', '', field, label);
          const input = util.el('input', '', field);
          input.type = 'number';
          input.step = 'any';
          input.value = '';
          input.setAttribute('aria-label', label);
          filterInputs.push(input);
        });
        const table = util.el('div', 'compare-list', pane);
        const heading = util.el('div', 'compare-heading', table);
        ['Product', 'Price (USD)', 'Capacity (L)', 'Weight (g)', 'Warranty (years)', ''].forEach((label) => util.el('span', '', heading, label));
        const productRows = [];
        s.products.forEach((p) => {
          const row = util.el('div', 'compare-row' + (m.selected === p.id ? ' chosen' : ''), table);
          productRows.push({ row, product: p });
          const product = util.el('div', 'compare-product', row);
          const art = util.el('div', 'compare-art', product);
          art.innerHTML = productArt(p.name, 40 + p.id * 64, 'pack');
          const words = util.el('div', 'compare-name', product);
          util.el('b', '', words, p.name);
          util.el('span', '', words, ['Versatile pack for day hikes and travel', 'Lightweight and rugged for the outdoors', 'Built for long adventures', 'Compact design for everyday use'][p.id % 4]);
          util.el('span', 'compare-value', row, cash(p.price));
          util.el('span', 'compare-value', row, String(p.capacity));
          util.el('span', 'compare-value', row, String(p.weight));
          util.el('span', 'compare-value', row, String(p.warranty));
          const actions = util.el('div', 'compare-row-actions', row);
          button(actions, 'View', `select:${p.id}`, 'compare-view');
          const add = util.el('button', 'as-btn sm primary compare-add', actions, m.picked && m.selected === p.id ? 'Added to Bag' : 'Add to Bag');
          add.type = 'button';
          add.dataset.role = 'shop-add';
          if (m.selected === p.id) registerControl('add', add);
          add.addEventListener('click', () => {
            update({ click: { shop: `select:${p.id}` } });
            update({ click: { shop: 'add' } });
          });
        });
        // Keep the search target connected to the task's existing search action.
        const searchButton = util.el('button', 'compare-search-submit', search, 'Search');
        searchButton.type = 'button';
        const applySearch = () => {
          const query = search.querySelector('input').value.trim().toLocaleLowerCase();
          const [capacity, weight, price, warranty] = filterInputs.map((input) => input.value === '' ? null : Number(input.value));
          productRows.forEach(({ row, product }) => {
            const textMatch = !query || product.name.toLocaleLowerCase().includes(query) || String(product.sku).toLocaleLowerCase().includes(query);
            const qualifies = (capacity === null || product.capacity >= capacity) && (weight === null || product.weight <= weight) &&
              (price === null || product.price <= price) && (warranty === null || product.warranty >= warranty);
            row.hidden = !(textMatch && qualifies);
          });
        };
        searchButton.addEventListener('click', applySearch);
        search.querySelector('input').addEventListener('input', applySearch);
        search.querySelector('input').addEventListener('keydown', (e) => { if (e.key === 'Enter') applySearch(); });
        filterInputs.forEach((input) => input.addEventListener('input', applySearch));
      },
    },
  },
});
