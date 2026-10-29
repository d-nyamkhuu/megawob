// Design on the shared use-dispatch operations workspace.
env.widget({
  task: 'use-dispatch',
  site: 'design-use-dispatch-route-order-01',
  name: 'design',
  split: 'train',
  scenarios: ['route-order'],
  template: 'use-dispatch/workspace',
  design: {
      font: '"Lucida Sans", "Lucida Grande", "Segoe UI", Arial, sans-serif',
      panel: '#f2f3f4', foreground: '#0b1936', line: '#b6bdc5',
      background: '#f2f3f4', accent: '#4a85ca', muted: '#34445b',
      paneInset: 0, cardGap: 6,
    parts: {
      frame: (base, S) => (ctx) => {
        S.D.stopHeight = Math.max(25, Math.min(46, Math.round(ctx.size.height * .055)));
        S.D.cardGap = ctx.size.height < 600 ? 4 : 6;
        const app = base(ctx);
        app.style.setProperty('--stop-height', `${S.D.stopHeight}px`);
        app.style.setProperty('--stop-gap', `${S.D.cardGap}px`);
        return app;
      },
      toolbar: () => () => {},
      navigation: () => () => {},
      rail: () => () => {},
      context: (base, S) => () => {
        const el = S.ctx.util.el;
        el('div', 'ol-plan-title', S.els.work, 'Route Plan');
        const info = el('div', 'ol-plan-info', S.els.work);
        for (const [key, value] of [['Dispatch Ref', ''], ['Date', 'Mon 10 Aug 1992'], ['Vehicle', 'Truck A'], ['Load Limit', `${S.spec.routeCapacity.toLocaleString('en-US')} kg`]]) {
          const field = el('div', 'ol-plan-field', info);
          el('strong', '', field, key);
          const val = el('span', '', field, value);
          if (key === 'Dispatch Ref') S.refs.dispatchRef = val;
        }
        const figures = el('div', 'ol-plan-figures', S.els.work);
        S.refs.routeFigures = [];
        for (const label of ['Total Distance', 'Total Load', 'Remaining Capacity']) {
          const field = el('div', '', figures);
          el('strong', '', field, label);
          S.refs.routeFigures.push(el('span', '', field));
        }
      },
      filters: (base, S) => () => {
        S.refs.exceptionCount = S.ctx.util.el('span', 'ol-hidden', S.app);
      },
      routeList: (base, S) => (parent) => {
        const el = S.ctx.util.el;
        const left = el('div', 'ad-route-box', parent);
        el('strong', 'ol-section-title', left, 'Stop Sequence');
        const head = el('div', 'ol-sequence-head', left);
        for (const text of ['', '#', 'Location', 'Job', 'Load (kg)']) el('span', '', head, text);
        const depot = (number) => {
          const row = el('div', 'ol-depot-row', left);
          el('span', 'ad-grip', row, '⠿');
          el('span', 'ad-stop-number', row, String(number));
          el('strong', 'ol-location', row, 'Depot');
          el('span', 'ol-job-id', row, '—');
          el('span', 'ad-weight', row, '0');
        };
        depot(1);
        const pane = S.P.pane(left, 'route', 'ad-route-list');
        pane.style.flex = 'none';
        pane.style.height = `${S.spec.items.length * (S.D.stopHeight + S.D.cardGap)}px`;
        for (const id of S.model.order) S.P.card(S.spec.items.find(it => it.id === id), pane);
        depot(S.spec.items.length + 2);
      },
      stopContent: (base, S) => (it, row) => {
        const el = S.ctx.util.el;
        el('span', 'ad-grip', row, '⠿');
        el('span', 'ad-stop-number', row);
        const location = el('div', 'ol-location', row);
        el('strong', '', location, it.id);
        el('span', '', location, it.address);
        el('span', 'ol-job-id', row, it.id);
        el('span', 'ad-weight', row, String(it.weight));
        const colors = ['#d5efdc', '#f8d8db', '#e5d8f6', '#fff0c8', '#f7ecd5', '#d0e5fa'];
        row.style.setProperty('--row-color', colors[S.spec.items.indexOf(it) % colors.length]);
      },
      matrix: (base, S) => (parent) => {
        base(parent);
        const box = parent.querySelector('.ad-matrix-box');
        box.querySelector('.ad-route-head').replaceChildren();
        S.ctx.util.el('strong', '', box.querySelector('.ad-route-head'), 'Distance Between Locations (km)');
        box.querySelector('.ad-table th').textContent = 'From \\ To';
        box.querySelector('.ad-policy').remove();
      },
      paintRoute: (base, S) => (model, alerts) => {
        base(model, alerts);
        model.order.forEach((id, i) => {
          S.refs.cards.get(id).querySelector('.ad-stop-number').textContent = String(i + 2);
        });
      },
      facts: (base, S) => (model) => {
        base(model);
        const values = S.refs.facts.map(el => el.textContent.split(': ').slice(1).join(': '));
        S.refs.routeFigures[0].textContent = values[0];
        S.refs.routeFigures[1].textContent = `${S.spec.items.reduce((sum, it) => sum + it.weight, 0).toLocaleString('en-US')} kg`;
        S.refs.routeFigures[2].textContent = values[1];
        S.refs.dispatchRef.textContent = values[2];
      },
      rendered: (base, S) => (ctx) => {
        base(ctx);
        const body = document.querySelector('.ol-jobs-table tbody');
        body.replaceChildren();
        for (const it of S.spec.items) {
          const row = ctx.util.el('tr', '', body);
          for (const value of [it.id, it.address, String(it.weight)]) ctx.util.el('td', '', row, value);
        }
      },
    },
  },
});
