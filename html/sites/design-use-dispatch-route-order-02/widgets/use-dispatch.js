// Design on the shared use-dispatch operations workspace.
env.widget({
  task: 'use-dispatch',
  site: 'design-use-dispatch-route-order-02',
  name: 'design',
  split: 'train',
  scenarios: ['route-order'],
  template: 'use-dispatch/workspace',
  design: {
    font: '"Times New Roman", Times, serif', cardGap: 0, paneInset: 0,
    parts: {
      frame: (base, S) => ctx => {
        const k = parseFloat(document.documentElement.style.getPropertyValue('--sheet-scale')) || 1;
        S.D.stopHeight = 31.5 * k;
        S.D.cardGap = 0;
        S.D.paneInset = 0;
        return base(ctx);
      },
      toolbar: () => () => {},
      rail: () => () => {},
      navigation: () => () => {},
      context: () => () => {},
      routeList: (base, S) => parent => {
        const u = S.ctx.util;
        const box = u.el('section', 'dr-sequence', parent);
        u.el('h2', 'dr-heading', box, 'Stop Sequence (drag to reorder)');
        const table = u.el('div', 'dr-stop-table', box);
        table.setAttribute('role', 'table');
        table.setAttribute('aria-label', 'Stop sequence');
        const head = u.el('div', 'dr-row dr-column-head', table);
        head.setAttribute('role', 'row');
        for (const text of ['', '#', 'Location', 'Address', 'Load (kg)', 'Action']) {
          u.el('div', 'dr-cell', head, text).setAttribute('role', 'columnheader');
        }
        const depot = (name, n) => {
          const row = u.el('div', 'dr-row dr-depot', table);
          row.setAttribute('role', 'row');
          for (const text of ['≡', String(n), name, '1000 Industrial Way', '0', '—']) {
            u.el('div', 'dr-cell', row, text).setAttribute('role', 'cell');
          }
        };
        depot('Depot (Start)', 1);
        const pane = S.P.pane(table, 'route', 'dr-stops');
        pane.setAttribute('role', 'rowgroup');
        for (const id of S.model.order) S.P.card(S.spec.items.find(it => it.id === id), pane);
        depot('Depot (Finish)', S.spec.items.length + 2);
        const figures = u.el('div', 'dr-figures', box);
        S.refs.routeFigures = {};
        for (const [key, label] of [['distance', 'Route Distance:'], ['capacity', 'Vehicle Capacity:'], ['load', 'Total Load:'], ['remaining', 'Remaining Capacity:']]) {
          const pair = u.el('div', 'dr-figure', figures);
          u.el('span', '', pair, label);
          S.refs.routeFigures[key] = u.el('span', '', pair);
        }
      },
      stopContent: (base, S) => (it, row) => {
        const u = S.ctx.util;
        row.classList.add('dr-row');
        row.setAttribute('role', 'row');
        u.el('div', 'dr-cell dr-grip', row, '≡');
        u.el('div', 'dr-cell ad-stop-number', row);
        const name = u.el('div', 'dr-cell dr-location', row, it.id);
        name.title = it.name;
        u.el('div', 'dr-cell dr-address', row, it.address);
        u.el('div', 'dr-cell dr-load', row, it.weight.toLocaleString('en-US'));
        const actions = u.el('div', 'dr-cell dr-actions', row);
        for (const [label, offset] of [['Move Up', -1], ['Move Down', 1]]) {
          const a = u.el('a', '', actions, label);
          a.href = '#';
          a.addEventListener('pointerdown', e => e.stopPropagation());
          a.addEventListener('click', e => {
            e.preventDefault(); e.stopPropagation();
            const index = S.model.order.indexOf(it.id);
            const to = Math.max(0, Math.min(S.model.order.length - 1, index + offset));
            S.P.commit(env.taskDef.helpers.move(S.model, it.id, to, S.spec));
          });
        }
      },
      matrix: (base, S) => parent => {
        base(parent);
        const matrix = parent.querySelector('.ad-matrix-box');
        matrix.querySelector('.ad-route-head').replaceChildren();
        S.ctx.util.el('h2', 'dr-heading', matrix.querySelector('.ad-route-head'), 'Distance Between Locations (kilometers)');
        matrix.querySelector('thead th').textContent = 'From / To';
      },
      paintRoute: (base, S) => (model, alerts) => {
        base(model, alerts);
        model.order.forEach((id, i) => {
          S.refs.cards.get(id).querySelector('.ad-stop-number').textContent = String(i + 2);
        });
      },
      facts: (base, S) => model => {
        base(model);
        const seq = ['depot', ...model.order, 'depot'];
        const distance = seq.slice(1).reduce((sum, id, i) => sum + S.spec.distances[seq[i]][id], 0);
        const load = S.spec.items.reduce((sum, it) => sum + it.weight, 0);
        const value = { distance: distance + ' km', load: load + ' kg', capacity: S.spec.routeCapacity + ' kg', remaining: (S.spec.routeCapacity - load) + ' kg' };
        for (const [key, el] of Object.entries(S.refs.routeFigures)) el.textContent = value[key];
        document.querySelectorAll('[data-route-fact]').forEach(el => {
          el.textContent = el.dataset.routeFact === 'stops' ? String(S.spec.items.length) : value[el.dataset.routeFact];
        });
        document.querySelector('[data-route-vehicle]').textContent = 'Truck 1 (' + S.spec.routeCapacity + ' kg max)';
      },
    },
  },
});
