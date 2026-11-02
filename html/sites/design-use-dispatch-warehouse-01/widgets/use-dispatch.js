// Design on the shared use-dispatch operations workspace.
(function () {
  function packageIcon(S, parent, it) {
    const colors = ['#cdd3d9', '#80a453', '#ecc115', '#758fa4', '#c82c30', '#cbd4de', '#e98724', '#9e754e'];
    const color = colors[S.spec.items.indexOf(it) % colors.length];
    const svg = S.ctx.util.svg('svg', {viewBox:'0 0 44 46', width:43, height:44, 'aria-hidden':'true'}, parent);
    const poly = (points, fill, extra = {}) => S.ctx.util.svg('polygon', {points,fill,stroke:'#646667','stroke-width':.7,...extra}, svg);
    poly('3,10 22,3 41,10 41,35 23,43 3,35', color);
    poly('3,10 22,3 41,10 23,18', '#ffffff', {'fill-opacity':.4});
    poly('23,18 41,10 41,35 23,43', '#000000', {'fill-opacity':.14});
    S.ctx.util.svg('path', {d:'M3 10 23 18 41 10M23 18v25M14 6l19 8v7l-7 3v-8L8 9',fill:'none',stroke:'#fff','stroke-opacity':.45,'stroke-width':1}, svg);
    if (it.haz) {
      poly('7,19 14,14 21,26 14,34', '#f8f8f3'); poly('9,20 14,17 19,26 14,31', '#171b1b');
      const t = S.ctx.util.svg('text', {x:14,y:27,'text-anchor':'middle',fill:'white','font-size':10}, svg); t.textContent='!';
    } else S.ctx.util.svg('path', {d:'M9 18l7 3v3l-7-3z',fill:'#ffffff','fill-opacity':.45}, svg);
  }
env.widget({
  task: 'use-dispatch',
  site: 'design-use-dispatch-warehouse-01',
  name: 'design',
  split: 'train',
  scenarios: ['warehouse'],
  template: 'use-dispatch/workspace',
  design: {
      font: '"Times New Roman", Georgia, serif', panel: '#f7f5f0',
      foreground: '#17191f', line: '#d1cec8', background: '#f2f0eb',
      accent: '#48749c', muted: '#77797b', cardHeight: 50, cardGap: 6,
      paneInset: 6, laneHeaderHeight: 64,
    parts: {
      frame: (base, S) => ctx => {
        const app = base(ctx); app.classList.add('wh-app');
        S.D.cardGap = ctx.size.height < 700 ? 4 : 6;
        S.D.cardHeight = Math.max(24, Math.min(50, Math.floor((ctx.size.height * .7 - 110) / 8) - S.D.cardGap));
        app.style.setProperty('--wh-row-height', `${S.D.cardHeight}px`);
        app.style.setProperty('--wh-row-gap', `${S.D.cardGap}px`);
        app.classList.toggle('wh-dense', ctx.size.height < 760);
        return app;
      },
      toolbar: (base, S) => () => { base(); S.app.querySelector('.ad-toolbar').hidden = true; },
      rail: (base, S) => () => { S.els.rail.hidden = true; },
      navigation: () => () => {},
      context: (base, S) => () => {
        const u = S.ctx.util, r = S.refs;
        const head = u.el('div', 'wh-sheet-head', S.els.work);
        const title = u.el('div', 'wh-dispatch-title', head);
        u.el('span', '', title, 'Dispatch'); r.dispatchRef = u.el('span', '', title);
        const facts = u.el('div', 'wh-plan-facts', head);
        r.planValues = ['Assigned Load', 'Unassigned Items', 'Storage Bins'].map(label => {
          const cell = u.el('div', '', facts); u.el('span', '', cell, label); return u.el('strong', '', cell);
        });
      },
      filters: (base, S) => () => {
        S.refs.exceptionCount = S.ctx.util.el('span', 'wh-hidden', S.els.work);
      },
      lanes: (base, S) => () => {
        const u = S.ctx.util;
        const layout = u.el('div', 'wh-allocation', S.els.main);
        const pool = u.el('div', 'wh-pool-box', layout);
        S.refs.poolTitle = u.el('h2', 'wh-region-title', pool, `Items to Assign (${S.spec.items.length})`);
        S.P.lane({id: 'pool', label: 'Items to Assign'}, pool);
        const bins = u.el('div', 'wh-bins-box', layout);
        u.el('h2', 'wh-region-title', bins, `Storage Bins (${S.spec.lanes.length})`);
        const grid = u.el('div', 'wh-bin-grid', bins);
        grid.style.gridTemplateColumns = `repeat(${Math.ceil(S.spec.lanes.length / 2)},minmax(0,1fr))`;
        for (const lane of S.spec.lanes) S.P.lane(lane, grid);
        for (const it of S.spec.items) S.P.card(it, S.refs.panes.get(S.model.assign[it.id] || 'pool'));
      },
      laneHeader: (base, S) => (lane, l) => {
        const u = S.ctx.util, r = S.refs;
        lane.classList.add(l.id === 'pool' ? 'wh-pool' : 'wh-bin');
        const head = u.el('div', `ad-lane-head${l.temp === 'chilled' ? ' wh-cold' : ''}`, lane);
        r.heads.set(l.id, head);
        u.el('strong', '', head, l.label);
        if (l.id !== 'pool') {
          u.el('span', `wh-cert${l.haz ? ' wh-certified' : ''}`, head, l.haz ? 'Hazmat Cert.' : 'Standard');
          const temp = u.el('div', 'wh-bin-temp', head);
          const thermometer = u.svg('svg', {viewBox:'0 0 16 24',width:17,height:23,fill:'none',stroke:'currentColor','stroke-width':1.3}, u.el('span', 'wh-thermometer', temp));
          u.svg('path', {d:'M5 15V4a2 2 0 0 1 4 0v11a4 4 0 1 1-4 0ZM7 6v13M11 5h3M11 9h2M11 13h3'}, thermometer);
          u.svg('circle', {cx:7,cy:18,r:1.8,fill:'currentColor'}, thermometer);
          u.el('span', '', temp, l.temp === 'chilled' ? '2°C to 8°C' : '15°C to 25°C');
        }
        const load = u.el('div', 'ad-load', lane); r.loads.set(l.id, load);
        const fill = u.el('div', 'ad-fill wh-hidden', lane); r.fills.set(l.id, fill);
        return head;
      },
      empty: (base, S) => (pane, l) => {
        const empty = S.ctx.util.el('div', 'ad-empty', pane, l.id === 'pool' ? 'All items assigned' : 'Drop items here');
        S.refs.rows.set(l.id, empty); return empty;
      },
      cardContent: (base, S) => (it, el) => {
        const u = S.ctx.util;
        // Compact rows still need to contain both lines and the package icon.
        el.style.height = 'auto';
        el.style.minHeight = `${S.D.cardHeight}px`;
        el.style.overflow = 'visible';
        const icon = u.el('span', 'wh-package', el); packageIcon(S, icon, it);
        const name = u.el('div', 'wh-item-copy', el);
        u.el('strong', 'wh-item-id', name, it.id); u.el('span', 'wh-item-name', name, it.name);
        const numbers = u.el('div', 'wh-item-numbers', el);
        u.el('span', '', numbers, `${it.weight} kg`);
        u.el('span', '', numbers, it.temp === 'chilled' ? '2°C to 8°C' : '15°C to 25°C');
        u.el('span', `wh-haz${it.haz ? ' wh-hazardous' : ''}`, el, it.haz ? 'Hazmat' : 'Non-Haz');
        u.el('span', 'ad-state wh-hidden', el);
      },
      activity: (base, S) => () => {
        const u = S.ctx.util, r = S.refs;
        r.issue = u.el('span', 'wh-hidden', S.els.main);
        const records = u.el('section', 'wh-records', S.app);
        u.el('h2', '', records, `All Items (${S.spec.items.length})`);
        const scroll = u.el('div', 'wh-records-scroll', records);
        const table = u.el('table', 'wh-items-table', scroll);
        const header = u.el('tr', '', u.el('thead', '', table));
        for (const text of ['', 'Item ID ▾', 'Description', 'Weight (kg)', 'Temperature', 'Hazmat', 'Status']) u.el('th', '', header, text);
        const body = u.el('tbody', '', table); r.recordStatuses = new Map();
        for (const it of S.spec.items) {
          const row = u.el('tr', '', body); packageIcon(S, u.el('td', 'wh-table-icon', row), it);
          for (const text of [it.id, it.name, it.weight, it.temp === 'chilled' ? '2°C to 8°C' : '15°C to 25°C', it.haz ? 'Yes' : 'No']) u.el('td', '', row, String(text));
          r.recordStatuses.set(it.id, u.el('span', 'wh-status-pill', u.el('td', '', row), 'Unassigned'));
        }
      },
      inspector: (base, S) => () => { base(); S.refs.inspector.hidden = true; },
      footer: (base, S) => () => { base(); S.els.footer.hidden = true; },
      paintLanes: (base, S) => (model, alerts) => {
        base(model, alerts);
        const u = S.ctx.util;
        for (const l of S.spec.lanes) {
          const load = S.spec.items.filter(it => model.assign[it.id] === l.id).reduce((n, it) => n + it.weight, 0);
          const box = S.refs.loads.get(l.id); box.replaceChildren();
          u.el('span', '', box, 'Capacity'); u.el('span', '', box, `${l.capacity.toLocaleString('en-US')} kg`);
          u.el('span', '', box, load ? 'Available' : 'Empty'); u.el('span', '', box, `${(l.capacity - load).toLocaleString('en-US')} kg`);
        }
        for (const it of S.spec.items) {
          const status = S.refs.recordStatuses?.get(it.id);
          if (status) status.textContent = S.spec.lanes.find(l => l.id === model.assign[it.id])?.label || 'Unassigned';
        }
        const count = S.spec.items.filter(it => !model.assign[it.id] || model.assign[it.id] === 'pool').length;
        S.refs.poolTitle.textContent = `Items to Assign (${count})`;
      },
      facts: (base, S) => model => {
        base(model);
        const assigned = S.spec.items.filter(it => S.spec.lanes.some(l => l.id === model.assign[it.id]));
        const values = [
          `${assigned.reduce((n, it) => n + it.weight, 0)} / ${S.spec.lanes.reduce((n, l) => n + l.capacity, 0).toLocaleString('en-US')} kg`,
          String(S.spec.items.length - assigned.length), String(S.spec.lanes.length),
        ];
        S.refs.planValues.forEach((el, i) => { el.textContent = values[i]; });
        S.refs.dispatchRef.textContent = S.refs.facts[2].textContent.replace(/^[^:]*:\s*/, '');
      },
    },
  },
});
})();
