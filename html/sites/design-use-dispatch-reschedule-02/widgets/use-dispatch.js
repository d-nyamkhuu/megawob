// Design on the shared use-dispatch operations workspace.
env.widget({
  task: 'use-dispatch',
  site: 'design-use-dispatch-reschedule-02',
  name: 'design',
  split: 'train',
  scenarios: ['reschedule'],
  template: 'use-dispatch/workspace',
  design: {
    cardHeight: 98, cardGap: 12, laneHeaderHeight: 110, paneInset: 7,
    inset: 0, warning: '#111', font: '"Arial Narrow", "Liberation Sans Narrow", Arial, sans-serif',
    parts: {
      icon: (base, S) => (parent, name, size = 15) => {
        if (!['truck', 'grid', 'file'].includes(name)) return base(parent, name, size);
        const u = S.ctx.util;
        const truck = name === 'truck';
        const svg = u.svg('svg', {viewBox:truck ? '0 0 38 28' : '0 0 26 28', width:size, height:size, fill:'white', stroke:'currentColor', 'stroke-width':2, 'stroke-linejoin':'miter', 'aria-hidden':'true'}, parent);
        if (truck) {
          u.svg('path', {d:'M2 4h23v17H2zM25 9h7l5 7v5H25zM28 11h3l3 5h-6z'}, svg);
          u.svg('circle', {cx:9,cy:22,r:3}, svg);
          u.svg('circle', {cx:30,cy:22,r:3}, svg);
        } else {
          u.svg('path', {d:name === 'file' ? 'M4 2h12l6 6v18H4zM16 2v7h6M7 12h12M7 16h12M7 20h12M7 23h10' : 'M3 2h21v24H3zM6 6h5v5H6zM14 6h7M14 10h7M6 15h15v8H6zM10 15v8M6 19h15', fill:'none'}, svg);
        }
        return svg;
      },
      frame: (base, S) => (ctx) => {
        const compact = ctx.size.width <= 1400;
        S.D.cardHeight = compact ? 76 : 98;
        S.D.cardGap = compact ? 10 : 12;
        const app = base(ctx);
        app.style.setProperty('--mac-card-height', `${S.D.cardHeight}px`);
        app.style.setProperty('--mac-card-gap', `${S.D.cardGap}px`);
        return app;
      },
      toolbar: (base, S) => () => {
        base();
        S.app.querySelector('.ad-toolbar').hidden = true;
      },
      rail: (base, S) => () => { S.els.rail.hidden = true; },
      navigation: (base, S) => () => {
        const el = S.ctx.util.el;
        const nav = el('div', 'mac-tabs', S.els.work);
        for (const text of ['Schedule', 'Vehicles', 'Deliveries', 'Drivers', 'Map', 'Reports']) {
          const tab = el('button', text === 'Schedule' ? 'mac-tab active' : 'mac-tab', nav, text);
          tab.type = 'button';
          tab.addEventListener('click', () => env.log('decoy', { label: text }));
        }
        S.refs.dispatchRef = el('span', 'mac-dispatch-ref', nav);
        const pool = S.P.lane({id:'pool', label:'Unassigned'}, nav);
        pool.classList.add('mac-pool');
      },
      context: () => () => {},
      filters: (base, S) => () => {
        S.refs.exceptionCount = S.ctx.util.el('span', 'mac-hidden', S.app);
      },
      lanes: (base, S) => () => {
        const el = S.ctx.util.el;
        const board = el('div', 'ad-lanes mac-board', S.els.main);
        for (const lane of S.spec.lanes) S.P.lane(lane, board);
        for (const label of ['Thursday', 'Friday']) {
          const lane = el('section', 'ad-lane mac-idle-day', board);
          const head = el('div', 'ad-lane-head', lane);
          el('strong', '', head, label);
          el('div', 'ad-load', head, `Load  0 / ${S.spec.lanes[0].capacity}`);
          el('div', 'ad-bar', head);
        }
        for (const item of S.spec.items) S.P.card(item, S.refs.panes.get(S.model.assign[item.id] || 'pool'));
      },
      laneHeader: (base, S) => (lane, spec) => {
        const el = S.ctx.util.el;
        const head = el('div', 'ad-lane-head', lane);
        S.refs.heads.set(spec.id, head);
        el('strong', '', head, spec.label);
        S.refs.loads.set(spec.id, el('div', 'ad-load', head));
        const bar = el('div', 'ad-bar', head);
        S.refs.fills.set(spec.id, el('div', 'ad-fill', bar));
        return head;
      },
      cardContent: (base, S) => (item, card) => {
        const el = S.ctx.util.el;
        S.P.icon(el('div', 'mac-truck', card), 'truck', 39);
        el('strong', 'ad-id', card, item.id);
        el('span', 'mac-grip', card, '≡');
        el('div', 'ad-customer', card, item.name);
        el('span', 'ad-weight', card, `${item.weight} kg`);
        el('span', 'ad-state mac-hidden', card);
      },
      activity: (base, S) => () => {
        S.refs.issue = S.ctx.util.el('span', 'mac-hidden', S.app);
      },
      inspector: (base, S) => () => {
        const el = S.ctx.util.el;
        const side = el('div', 'mac-summary-rail', S.els.workspace);
        S.refs.inspector = side;
        const note = document.querySelector('.ref-panel, .ref-note');
        if (note) {
          side.appendChild(note);
          note.classList.add('mac-rail-note');
          S.app.classList.add('mac-with-note');
        }
        const panel = (title, icon) => {
          const p = el('section', 'mac-panel', side);
          const h = el('div', 'mac-panel-heading', p);
          S.P.icon(h, icon, icon === 'truck' ? 36 : 27); el('strong', '', h, title);
          return p;
        };
        const summary = panel('Delivery Summary', 'file');
        S.refs.summaryValues = {};
        for (const [key, label] of [['total','Total deliveries'],['assigned','Assigned'],['unassigned','Unassigned'],['weight','Total weight'],['limit','Daily load limit']]) {
          const row = el('div', `mac-summary-row ${key === 'weight' ? 'mac-summary-divider' : ''}`, summary);
          el('span', '', row, label);
          S.refs.summaryValues[key] = el('span', '', row);
        }
        const deliveries = panel('Deliveries', 'grid');
        deliveries.classList.add('mac-deliveries');
        const tablePane = el('div', 'mac-table-pane', deliveries);
        const table = el('table', 'mac-table', tablePane);
        const h = el('tr', '', el('thead', '', table));
        for (const label of ['Job','Destination','Weight']) el('th', '', h, label);
        const body = el('tbody', '', table);
        for (const item of S.spec.items) {
          const row = el('tr', '', body);
          for (const value of [item.id,item.name,`${item.weight} kg`]) el('td', '', row, value);
        }
        const scroll = el('div', 'mac-scroll-rail', deliveries);
        el('span', '', scroll, '⌃'); el('span', '', scroll, '⌄');
        const vehicles = panel('Vehicles', 'truck');
        const vt = el('table', 'mac-table', vehicles);
        const vh = el('tr', '', el('thead', '', vt));
        for (const label of ['Vehicle','Capacity','Status']) el('th', '', vh, label);
        const vb = el('tbody', '', vt);
        for (let i = 0; i < 3; i++) {
          const row = el('tr', '', vb);
          for (const value of [`V${i+1}`,`${S.spec.lanes[0].capacity} kg`,'Available']) el('td', '', row, value);
        }
      },
      detail: () => () => {},
      paintLanes: (base, S) => (model, alerts) => {
        base(model, alerts);
        for (const lane of S.spec.lanes) {
          const load = S.refs.loads.get(lane.id);
          load.textContent = `Load  ${S.spec.items.filter(it => model.assign[it.id] === lane.id).reduce((n,it) => n + it.weight, 0)} / ${lane.capacity}`;
        }
        const unassigned = S.spec.items.filter(it => !model.assign[it.id] || model.assign[it.id] === 'pool').length;
        S.refs.loads.get('pool').textContent = String(unassigned);
        S.refs.lanes.get('pool').classList.toggle('mac-pool-populated', unassigned > 0);
      },
      facts: (base, S) => (model) => {
        base(model);
        const unassigned = S.spec.items.filter(it => !model.assign[it.id] || model.assign[it.id] === 'pool').length;
        const values = S.refs.summaryValues;
        values.total.textContent = S.spec.items.length;
        values.assigned.textContent = S.spec.items.length - unassigned;
        values.unassigned.textContent = unassigned;
        values.weight.textContent = `${S.spec.items.reduce((n,it) => n + it.weight, 0)} kg`;
        values.limit.textContent = `${S.spec.lanes[0].capacity} kg`;
        S.refs.dispatchRef.textContent = S.refs.facts[2].textContent.replace('Dispatch reference:', 'Dispatch Ref:');
      },
    },
  },
});
