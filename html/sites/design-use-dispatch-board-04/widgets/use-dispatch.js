// Design on the shared use-dispatch operations workspace.
env.widget({
  task: 'use-dispatch',
  site: 'design-use-dispatch-board-04',
  name: 'design',
  split: 'train',
  scenarios: ['board'],
  template: 'use-dispatch/workspace',
  design: {
    inset: 0, font: 'Arial, Helvetica, sans-serif', cardHeight: 156, cardGap: 5, paneInset: 8,
    parts: {
      toolbar: (base, S) => () => { base(); S.app.querySelector('.ad-toolbar').remove(); },
      rail: (base, S) => () => { base(); S.els.rail.remove(); },
      navigation: (base, S) => () => { base(); S.els.work.querySelector('.ad-nav').remove(); },
      context: (base, S) => () => { base(); S.els.work.querySelector('.ad-context').remove(); },
      filters: (base, S) => () => { base(); S.els.work.querySelector('.ad-filters').remove(); },
      lanes: (base, S) => () => {
        const u = S.ctx.util;
        const board = u.el('div', 'fleet-board', S.els.main);
        const pool = S.P.lane({ id: 'pool', label: 'Unassigned Deliveries' }, board);
        pool.classList.add('fleet-backlog');
        u.el('h2', 'fleet-lanes-title', board, 'Driver Lanes');
        const lanes = u.el('div', 'fleet-driver-lanes', board);
        for (const lane of S.spec.lanes) S.P.lane(lane, lanes);
        for (const item of S.spec.items) S.P.card(item, S.refs.panes.get(S.model.assign[item.id] || 'pool'));
      },
      laneHeader: (base, S) => (lane, spec) => {
        const u = S.ctx.util, f = env.taskDef;
        const head = u.el('div', 'ad-lane-head', lane);
        S.refs.heads.set(spec.id, head);
        u.el('strong', 'fleet-lane-label', head, spec.label);
        if (spec.id !== 'pool') {
          const truck = u.el('div', 'fleet-truck', head);
          const svg = u.svg('svg', { viewBox: '0 0 62 34', width: 58, height: 32, 'aria-hidden': 'true' }, truck);
          u.svg('path', { d: 'M2 2h39v25H2zM44 9h9l7 10v8H44z', fill: ['#538cab', '#28824c', '#bd8425'][S.spec.lanes.indexOf(spec) % 3], stroke: '#315647', 'stroke-width': 2 }, svg);
          u.svg('path', { d: 'M47 12h5l5 8H47z', fill: '#edf7f3' }, svg);
          for (const x of [12, 49]) u.svg('circle', { cx: x, cy: 28, r: 4, fill: '#405d58', stroke: '#c0dbd0', 'stroke-width': 2 }, svg);
          u.el('div', 'fleet-vehicle', head, spec.vehicle);
          u.el('div', 'fleet-capacity', head, `Capacity: ${spec.capacity.toLocaleString('en-US')} kg`);
          u.el('div', 'fleet-shift', head, `Work window: ${f.helpers.time(spec.start)} – ${f.helpers.time(spec.end)}`);
        }
        S.refs.loads.set(spec.id, u.el('div', 'ad-load', head));
        S.refs.fills.set(spec.id, u.el('div', 'ad-fill', head));
        return head;
      },
      empty: (base, S) => (pane, lane) => {
        const empty = S.ctx.util.el('div', 'ad-empty', pane, lane.id === 'pool' ? 'All jobs allocated' : 'Drag delivery cards here');
        S.refs.rows.set(lane.id, empty);
        return empty;
      },
      mirror: (base, S) => () => {
        // Each pane is one horizontal strip, so items have no vertical row pitch.
        // Mirror that geometry rather than the template's stacked-card offsets.
        const view = {};
        for (const [id, pane] of S.refs.panes) {
          view[id] = { px: pane.scrollTop, h: pane.clientHeight, row: 0 };
        }
        if (JSON.stringify(view) !== JSON.stringify(S.ctx.model.view)) S.ctx.patch({ view });
      },
      cardContent: (base, S) => (item, card) => {
        const u = S.ctx.util;
        card.style.setProperty('--index-color', ['#8fc7ec','#9ed5ae','#f6ce76','#bc96e0','#f4a18a','#67c9ce','#c8b68a','#efa2a2'][S.spec.items.indexOf(item) % 8]);
        const top = u.el('div', 'ad-card-top', card);
        u.el('span', 'ad-grip', top, '⠿');
        u.el('span', 'ad-id', top, item.id);
        u.el('span', 'ad-state', top);
        const copy = u.el('div', 'fleet-card-copy', card);
        u.el('div', 'ad-customer', copy, item.name);
        u.el('div', 'fleet-address', copy, item.address);
        u.el('div', 'fleet-weight', copy, `${item.weight.toLocaleString('en-US')} kg`);
        u.el('div', 'fleet-volume', copy, `${item.volume == null ? '—' : item.volume} m³`);
        u.el('div', 'fleet-window', card, `${env.taskDef.helpers.time(item.start)} – ${env.taskDef.helpers.time(item.end)}`);
      },
      rendered: (base, S) => (ctx) => {
        base(ctx);
        const u = ctx.util, f = env.taskDef, s = S.spec;
        const rows = (selector, data) => {
          const tbody = document.querySelector(selector);
          tbody.replaceChildren();
          for (const row of data) { const tr = u.el('tr', '', tbody); for (const value of row) u.el('td', '', tr, String(value)); }
        };
        document.querySelector('.dispatch-deliveries h2').textContent = `Deliveries (${s.items.length})`;
        rows('.dispatch-drivers tbody', s.lanes.map(l => [l.label, l.vehicle, `${l.capacity.toLocaleString('en-US')} / ${l.volume == null ? '—' : l.volume}`, `${f.helpers.time(l.start)} – ${f.helpers.time(l.end)}`]));
        rows('.dispatch-deliveries tbody', s.items.map(it => [it.id, it.name, it.address, it.weight, it.volume == null ? '—' : it.volume, `${f.helpers.time(it.start)} – ${f.helpers.time(it.end)}`]));
      },
      facts: (base, S) => (model) => {
        base(model);
        const s = S.spec, count = s.items.filter(it => model.assign[it.id] && model.assign[it.id] !== 'pool').length;
        const weight = s.items.reduce((n, it) => n + it.weight, 0).toLocaleString('en-US') + ' kg';
        const volume = s.items.every(it => it.volume != null) ? s.items.reduce((n, it) => n + it.volume, 0) + ' m³' : '— m³';
        const values = [s.items.length, count, s.items.length - count, weight, volume];
        document.querySelectorAll('.dispatch-metrics strong').forEach((el, i) => { el.textContent = String(values[i]); });
        const overview = [null, null, s.lanes.length, ...values];
        document.querySelectorAll('.dispatch-overview-rows strong').forEach((el, i) => { if (overview[i] != null) el.textContent = String(overview[i]); });
        const reference = env.taskDef.facts(model, s).find(fact => /reference/i.test(fact.label));
        if (reference) {
          document.querySelector('.dispatch-metadata strong').textContent = reference.value;
          document.querySelector('.dispatch-overview-rows strong').textContent = reference.value;
        }
        S.refs.heads.get('pool').querySelector('strong').textContent = `Unassigned Deliveries (${s.items.length - count})`;
      },
    },
  },
});
