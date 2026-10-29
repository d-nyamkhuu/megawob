// Design on the shared use-dispatch operations workspace.
const routeMapPositions = [[32,65],[19,43],[35,19],[74,29],[56,8],[55,49]];
env.widget({
  task: 'use-dispatch',
  site: 'design-use-dispatch-route-order-05',
  name: 'design',
  split: 'train',
  scenarios: ['route-order'],
  template: 'use-dispatch/workspace',
  design: {
      font: 'Tahoma, Arial, sans-serif',
      panel: '#c0c0c0', foreground: '#111111', line: '#a0a0a0',
      background: '#c0c0c0', accent: '#003399', muted: '#333333',
      paneInset: 0, cardGap: 0,
    parts: {
      frame: (base, S) => (ctx) => {
        S.D.stopHeight = 48;
        S.D.cardGap = 0;
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
        const info = el('div', 'ol-plan-info', S.els.work);
        for (const [key, value] of [['Dispatch Ref:', ''], ['Vehicle:', `Truck 3 (${S.spec.routeCapacity.toLocaleString('en-US')} kg)`]]) {
          const field = el('div', 'ol-plan-field', info);
          el('strong', '', field, key);
          const val = el('span', '', field, value);
          if (key === 'Dispatch Ref:') S.refs.dispatchRef = val;
        }
        const figures = el('div', 'ol-plan-figures', info);
        S.refs.routeFigures = [];
        for (const label of ['Route Distance:', 'Total Load:', 'Remaining Capacity:']) {
          const field = el('div', '', figures);
          el('strong', '', field, label);
          S.refs.routeFigures.push(el('span', '', field));
        }
        const depots = el('div', 'ol-plan-depots', info);
        for (const label of ['Start Depot:', 'Finish Depot:']) {
          const field = el('div', '', depots);
          el('strong', '', field, label);
          el('span', '', field, 'Riverside Depot');
        }
      },
      filters: (base, S) => () => {
        S.refs.exceptionCount = S.ctx.util.el('span', 'ol-hidden', S.app);
      },
      routeList: (base, S) => (parent) => {
        const el = S.ctx.util.el;
        const left = el('div', 'ad-route-box', parent);
        const head = el('div', 'ol-sequence-head', left);
        for (const text of ['', '#', 'Type', 'Stop Name / Address', 'Distance (from previous)', 'Load (kg)', 'Arrive (est)', 'Depart (est)']) el('span', '', head, text);
        const depot = (ending) => {
          const row = el('div', 'ol-depot-row', left);
          el('span', 'ol-arrows', row);
          el('span', 'ad-stop-number ol-depot-icon', row, '⌂');
          el('span', 'ol-type', row, 'Depot');
          const location = el('div', 'ol-location', row);
          el('strong', '', location, 'Riverside Depot');
          el('span', '', location, '1000 Industrial Way, Riverside');
          el('span', 'ol-distance', row, ending ? '—' : '—');
          el('span', 'ad-weight', row, '0');
          el('span', 'ol-arrive', row, ending ? '—' : '08:00');
          el('span', 'ol-depart', row, ending ? '—' : '08:00');
        };
        depot(false);
        const pane = S.P.pane(left, 'route', 'ad-route-list');
        pane.style.flex = '1 1 0';
        pane.style.minHeight = '120px';
        for (const id of S.model.order) S.P.card(S.spec.items.find(it => it.id === id), pane);
        depot(true);
      },
      stopContent: (base, S) => (it, row) => {
        const el = S.ctx.util.el;
        const arrows = el('span', 'ol-arrows ad-grip', row);
        el('span', '', arrows, '▲');
        el('span', '', arrows, '▼');
        el('span', 'ad-stop-number', row);
        const type = el('span', 'ol-type', row);
        el('span', 'ol-parcel', type, '⬡');
        el('span', '', type, 'Customer');
        const location = el('div', 'ol-location', row);
        el('strong', '', location, `${it.id} · ${it.address}`);
        el('span', '', location, 'Customer delivery');
        el('span', 'ol-distance', row, '—');
        el('span', 'ad-weight', row, String(it.weight));
        el('span', 'ol-arrive', row, '—');
        el('span', 'ol-depart', row, '—');
      },
      matrix: (base, S) => (parent) => {
        const destination = document.querySelector('.ol-side-details') || parent;
        base(destination);
        const box = [...destination.querySelectorAll('.ad-matrix-box')].at(-1);
        box.querySelector('.ad-route-head').replaceChildren();
        S.ctx.util.el('strong', '', box.querySelector('.ad-route-head'), 'Distance Between Locations (km)');
        box.querySelector('.ad-table th').textContent = 'From \\ To';
        box.querySelector('.ad-policy')?.remove();
      },
      paintRoute: (base, S) => (model, alerts) => {
        base(model, alerts);
        model.order.forEach((id, i) => {
          S.refs.cards.get(id).querySelector('.ad-stop-number').textContent = String(i + 1);
        });
        const table = document.querySelector('.ad-table');
        const rows = table ? [...table.querySelectorAll('tbody tr')] : [];
        const names = ['Depot', ...S.spec.items.map(it => it.id)];
        const distance = (from, to) => {
          const r = rows[names.indexOf(from)];
          const c = r?.querySelectorAll('td')[names.indexOf(to)];
          return Number(c?.textContent?.trim()) || 0;
        };
        let previous = 'Depot', minute = 8 * 60;
        const time = (n) => `${String(Math.floor(n / 60)).padStart(2,'0')}:${String(n % 60).padStart(2,'0')}`;
        for (const id of model.order) {
          const card = S.refs.cards.get(id);
          const d = distance(previous, id);
          card.querySelector('.ol-distance').textContent = `${d} km`;
          minute += Math.max(10, d * 2);
          card.querySelector('.ol-arrive').textContent = time(minute);
          minute += 15;
          card.querySelector('.ol-depart').textContent = time(minute);
          previous = id;
        }
        const ending = document.querySelector('.ol-depot-row:last-child');
        if (ending) {
          const d = distance(previous, 'Depot');
          ending.querySelector('.ol-distance').textContent = `${d} km`;
          ending.querySelector('.ol-arrive').textContent = time(minute + Math.max(10, d * 2));
        }
        const side = document.querySelector('.ol-jobs-table tbody');
        if (side && side.children.length) {
          side.replaceChildren(...model.order.map(id => [...side.children].find(r => r.dataset.item === id)).filter(Boolean));
          for (const id of model.order) {
            const r = [...side.children].find(x => x.dataset.item === id);
            if (r) r.lastElementChild.textContent = S.refs.cards.get(id).querySelector('.ol-distance').textContent;
          }
        }
        const mapRoute = document.querySelector('.ol-map svg path:last-child');
        if (mapRoute) {
          const xy = id => {
            const i = S.spec.items.findIndex(it => it.id === id);
            const p = routeMapPositions[(i < 0 ? 0 : i) % routeMapPositions.length];
            return `${Math.round(p[0] * 5.5)} ${Math.round(p[1] * 4.3)}`;
          };
          mapRoute.setAttribute('d', `M270 340 ${model.order.map(id => 'L' + xy(id)).join(' ')} L270 340`);
        }
        document.querySelectorAll('.ol-map-distance').forEach((label, i) => {
          const id = model.order[i];
          label.textContent = id ? S.refs.cards.get(id).querySelector('.ol-distance').textContent : '';
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
        for (const id of S.model.order) {
          const it = S.spec.items.find(x => x.id === id);
          const row = ctx.util.el('tr', '', body);
          row.dataset.item = id;
          const name = ctx.util.el('td', '', row);
          ctx.util.el('span', 'ol-parcel', name, '⬡');
          ctx.util.el('span', '', name, `${it.id} · ${it.address}`);
          for (const value of ['Customer', it.weight.toLocaleString('en-US'), S.refs.cards.get(id).querySelector('.ol-distance').textContent]) ctx.util.el('td', '', row, value);
        }
        const points = document.querySelector('.ol-map-points');
        S.spec.items.forEach((it, i) => {
          const [x,y] = routeMapPositions[i % routeMapPositions.length];
          const point = ctx.util.el('div', 'ol-map-place', points);
          point.style.left = x + '%'; point.style.top = y + '%';
          ctx.util.el('span', 'ol-map-dot', point);
          ctx.util.el('strong', 'ol-map-label', point, it.address);
        });
        const depot = ctx.util.el('div', 'ol-map-place ol-map-depot', points);
        depot.style.left = '49%'; depot.style.top = '78%';
        ctx.util.el('span', 'ol-map-dot', depot, '⌂');
        ctx.util.el('strong', 'ol-map-label', depot, 'Riverside Depot');
        [[42,30],[63,19],[28,53],[43,72]].forEach(([x,y], i) => {
          const label = ctx.util.el('span', 'ol-map-distance', points);
          label.style.left = x + '%'; label.style.top = y + '%';
          const id = S.model.order[i];
          label.textContent = id ? S.refs.cards.get(id).querySelector('.ol-distance').textContent : '';
        });
        const mapRoute = document.querySelector('.ol-map svg path:last-child');
        if (mapRoute) {
          const xy = id => { const i = S.spec.items.findIndex(it => it.id === id); const p = routeMapPositions[(i < 0 ? 0 : i) % routeMapPositions.length]; return `${Math.round(p[0] * 5.5)} ${Math.round(p[1] * 4.3)}`; };
          mapRoute.setAttribute('d', `M270 340 ${S.model.order.map(id => 'L' + xy(id)).join(' ')} L270 340`);
        }
      },
    },
  },
});
