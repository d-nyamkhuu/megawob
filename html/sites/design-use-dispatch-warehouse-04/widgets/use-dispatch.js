// Design on the shared use-dispatch operations workspace.
env.widget({
  task: 'use-dispatch',
  site: 'design-use-dispatch-warehouse-04',
  name: 'design',
  split: 'train',
  scenarios: ['warehouse'],
  template: 'use-dispatch/workspace',
  design: {
    font: 'Arial, Helvetica, sans-serif', inset: 0, cardHeight: 44, cardGap: 5, paneInset: 0,
    panel: '#fff', foreground: '#000d32', line: '#9aaec7', background: '#e1e8ec', accent: '#064cb0', muted: '#657084',
    parts: {
      frame: (base, S) => (ctx) => {
        const app = base(ctx);
        const inset = ctx.size.width <= 1100 ? 5 : 9;
        Object.assign(app.style, { left: `${inset}px`, right: `${inset}px`, bottom: ctx.size.width <= 1100 ? '8px' : '20px' });
        return app;
      },
      pane: (base, S) => (parent, id, cls) => {
        const pane = base(parent, id, cls);
        if (id === 'pool') pane.style.padding = S.ctx.size.width <= 1100 ? '6px' : '8px';
        return pane;
      },
      mirror: (base, S) => () => {
        // The pool is one horizontal row: every remaining card is visible. Express
        // that visibility in the template's logical-row coordinates for the oracle.
        // Allocated panes retain their actual vertical scroll geometry.
        const view = {};
        const row = S.D.cardHeight + S.D.cardGap;
        for (const [id, pane] of S.refs.panes) {
          const count = S.spec.items.filter(item => (S.model.assign[item.id] || 'pool') === id).length;
          view[id] = { px: pane.scrollTop, h: id === 'pool' ? Math.max(pane.clientHeight - S.D.paneInset * 2, count * row) : pane.clientHeight - S.D.paneInset * 2, row };
        }
        if (JSON.stringify(view) !== JSON.stringify(S.model.view)) S.ctx.patch({ view });
      },
      lanes: (base, S) => () => {
        const { util } = S.ctx;
        const surface = util.el('div', 'wh-surface', S.els.main);
        const pool = S.P.lane({ id: 'pool', label: 'Unassigned Items' }, surface);
        pool.classList.add('wh-pool');
        const section = util.el('section', 'wh-destination-section', surface);
        util.el('h2', 'wh-section-strip', section, `Storage Bins (${S.spec.lanes.length})`);
        const grid = util.el('div', 'wh-destinations', section);
        grid.style.gridTemplateColumns = `repeat(${S.spec.lanes.length}, minmax(0, 1fr))`;
        for (const lane of S.spec.lanes) S.P.lane(lane, grid);
        for (const item of S.spec.items) S.P.card(item, S.refs.panes.get(S.model.assign[item.id] || 'pool'));
      },
      paintLanes: (base, S) => (model, alerts) => {
        base(model, alerts);
        for (const lane of S.spec.lanes) {
          const occupied = S.spec.items.some(item => model.assign[item.id] === lane.id);
          S.refs.panes.get(lane.id).style.padding = occupied ? '0 0 16px' : '0';
        }
        for (const item of S.spec.items) {
          const el = S.refs.cards.get(item.id);
          const pooled = !model.assign[item.id] || model.assign[item.id] === 'pool';
          el.classList.toggle('wh-assigned', !pooled);
          Object.assign(el.style, {
            flex: pooled ? '1 0 0' : 'none', width: pooled ? '0' : '100%',
            height: pooled ? '100%' : `${S.D.cardHeight}px`, display: pooled ? 'flex' : 'grid',
            gridTemplateColumns: pooled ? '' : 'auto minmax(0, 1fr)', columnGap: pooled ? '' : '8px',
          });
          el.querySelector('.ad-customer').style.margin = pooled ? '' : '0';
          const labels = el.querySelector('.wh-labels');
          labels.style.gridTemplateColumns = pooled ? '' : 'repeat(3, auto minmax(0, 1fr))';
          labels.style.gridColumn = pooled ? '' : '1 / -1';
        }
      },
      laneHeader: (base, S) => (lane, spec) => {
        const { util } = S.ctx;
        const head = util.el('div', spec.id === 'pool' ? 'ad-lane-head wh-section-strip' : 'ad-lane-head', lane);
        S.refs.heads.set(spec.id, head);
        const title = util.el('strong', 'wh-lane-label', head, spec.id === 'pool' ? `Unassigned Items (${S.spec.items.length})` : spec.label);
        if (spec.id === 'pool') S.refs.poolTitle = title;
        else {
          const pairs = [['Capacity:', `${spec.capacity} kg`], ['Temperature:', spec.temp === 'chilled' ? '2 – 8 °C' : spec.temp === 'frozen' ? '≤ -18 °C' : 'Ambient'], ['Hazmat Cert:', spec.haz ? 'Yes' : 'No']];
          const data = util.el('dl', 'wh-labels', head);
          for (const [label, value] of pairs) { util.el('dt', '', data, label); util.el('dd', '', data, value); }
          lane.classList.add(spec.haz ? 'wh-hazardous' : spec.temp === 'chilled' ? 'wh-chilled' : spec.temp === 'frozen' ? 'wh-frozen' : 'wh-ambient');
        }
        S.refs.loads.set(spec.id, util.el('div', 'ad-load', head));
        S.refs.fills.set(spec.id, util.el('div', 'ad-fill', head));
        return head;
      },
      empty: (base, S) => (pane, spec) => {
        const el = S.ctx.util.el('div', 'ad-empty', pane, spec.id === 'pool' ? 'All items assigned' : 'Drop items here');
        S.refs.rows.set(spec.id, el);
        return el;
      },
      cardContent: (base, S) => (item, el) => {
        const { util } = S.ctx;
        el.classList.add('wh-stock', item.haz ? 'wh-hazardous' : item.temp === 'chilled' ? 'wh-chilled' : item.temp === 'frozen' ? 'wh-frozen' : 'wh-ambient');
        util.el('div', 'ad-id', el, item.id);
        util.el('div', 'ad-customer', el, item.name);
        const data = util.el('dl', 'wh-labels', el);
        for (const [label, value] of [['Weight:', `${item.weight} kg`], ['Temp:', item.temp === 'chilled' ? '2 – 8 °C' : item.temp === 'frozen' ? '≤ -18 °C' : 'Ambient'], ['Hazmat:', item.haz ? 'Yes' : 'No']]) {
          util.el('dt', '', data, label); util.el('dd', value === 'Yes' ? 'wh-yes' : '', data, value);
        }
        util.el('span', 'ad-state', el);
        const art = util.el('div', 'wh-product-art', el);
        const name = item.name.toLowerCase();
        let picture;
        if (item.haz) picture = '<ellipse cx="60" cy="18" rx="25" ry="6" fill="#c4c8cc"/><path d="M35 18v57c0 8 50 8 50 0V18" fill="url(#metal)"/><ellipse cx="60" cy="18" rx="25" ry="6" fill="#bdc3c9"/><ellipse cx="60" cy="75" rx="25" ry="6" fill="none"/><path d="m60 31 18 20-18 20-18-20z" fill="white" stroke="red" stroke-width="3"/><path d="M59 62c-14-8-3-15-4-20 6 3 2 8 7 9 1-4 2-6 5-7 0 9 10 13-1 18z" fill="#111" stroke="none"/>';
        else if (/paper|towel|roll/.test(name)) picture = '<g fill="url(#paper)"><path d="M22 29h21v49H22zM43 23h21v55H43zM64 27h21v51H64zM82 20h15v53H82z"/><ellipse cx="32" cy="29" rx="10" ry="4"/><ellipse cx="53" cy="23" rx="11" ry="4"/><ellipse cx="74" cy="27" rx="11" ry="4"/><ellipse cx="89" cy="20" rx="8" ry="4"/></g><g fill="#797b92"><ellipse cx="32" cy="29" rx="3" ry="1"/><ellipse cx="53" cy="23" rx="3" ry="1"/><ellipse cx="74" cy="27" rx="3" ry="1"/></g>';
        else if (/can|chickpea|bean/.test(name)) picture = '<g fill="url(#metal)"><path d="M19 28v40c0 9 36 9 36 0V28z"/><ellipse cx="37" cy="28" rx="18" ry="6"/><path d="M46 43v34c0 9 37 9 37 0V43z"/><ellipse cx="64" cy="43" rx="19" ry="6"/></g><g fill="none"><ellipse cx="37" cy="28" rx="8" ry="2"/><ellipse cx="64" cy="43" rx="8" ry="2"/></g>';
        else if (/tire/.test(name)) picture = '<ellipse cx="60" cy="49" rx="31" ry="35" fill="#34343a"/><ellipse cx="60" cy="49" rx="16" ry="22" fill="#c7c9ce"/><ellipse cx="60" cy="49" rx="9" ry="15" fill="#565963"/><path d="M36 25l8 5M30 40l9 3M30 57l9-1M36 74l8-5M78 25l-6 5M87 40l-9 3M86 60l-9-3" stroke="#777" stroke-width="3"/>';
        else if (/bottle|brew/.test(name)) picture = '<g fill="#65432a"><path d="M29 16h12v15l7 10v39c0 5-28 5-28 0V41l9-10z"/><path d="M62 12h12v18l8 11v39c0 5-28 5-28 0V41l8-11z"/></g><g fill="#d7e7f0"><path d="M21 47h26v23H21zM55 47h26v23H55z"/></g><path d="M28 13h14v7H28zM61 9h14v7H61z" fill="#b8c6d0"/>';
        else if (/milk|dairy|oat|drink/.test(name)) picture = '<path d="M46 12h27l5 17 8 13v39l-25 7-23-9V40l8-14z" fill="url(#paper)"/><path d="m38 40 23 8 25-6M61 48v40M46 26l15 14 17-11" fill="none"/><path d="m39 51 22 7 24-6v19l-24 6-22-7z" fill="#1689dc"/><text x="42" y="66" fill="white" stroke="none" font-size="9" font-weight="bold">' + (/milk/.test(name) ? 'MILK' : 'DRINK') + '</text>';
        else if (/seed|lettuce|fresh|plant/.test(name)) picture = '<path d="M44 82C6 57 20 37 36 41 22 15 50 10 59 24 71 5 94 20 86 38c26-1 26 32-3 42z" fill="#80ad16"/><path d="M60 83C35 70 32 42 48 36 49 14 73 25 72 42 96 39 95 66 72 82z" fill="#95c72d"/><path d="M61 82 59 40M57 67 44 51M64 65l15-15M43 76 32 53M79 75l11-17" fill="none" stroke="#426b05"/>';
        else if (/plier|drill|caulk|tool/.test(name)) picture = '<path d="m25 32 30-15 42 13-29 18z" fill="#b7bac1"/><path d="m25 32 43 16 29-18v45L68 88 25 72z" fill="#385880"/><path d="M68 48v40M32 39v27M40 43v27M48 46v27M56 49v27" stroke="#aab7c5" stroke-width="4"/><path d="m28 55 34 13M74 56l18-8" fill="none" stroke="#172d4f" stroke-width="3"/>';
        else if (/diaper|cream|salad|pack|case|tub/.test(name)) picture = '<path d="m23 28 40-12 37 13-38 15z" fill="#eaf6ef"/><path d="m23 28 39 16v42L23 70z" fill="#e9f0e7"/><path d="m62 44 38-15v42L62 86z" fill="#b4c9dc"/><path d="m24 43 38 14 37-13v21L62 78 24 64z" fill="#71b267"/><ellipse cx="61" cy="57" rx="13" ry="12" fill="#f7fcdf"/>';
        else picture = '<path d="m14 35 45-18 48 13-42 21z" fill="#1485df"/><path d="m18 40 46 15 39-17-5 39-34 12-42-14z" fill="#0765c6"/><path d="m64 55v34M32 46l3 32M47 50l1 33M79 49l-2 35M94 42l-4 36" fill="none" stroke="#002b79" stroke-width="2"/>';
        art.innerHTML = '<svg viewBox="12 6 96 84" aria-hidden="true"><defs><linearGradient id="metal"><stop stop-color="#7b7c7c"/><stop offset=".3" stop-color="#d7d7d1"/><stop offset=".6" stop-color="#a5a6a3"/><stop offset="1" stop-color="#55575b"/></linearGradient><linearGradient id="paper"><stop stop-color="#f6f6ff"/><stop offset=".5" stop-color="white"/><stop offset="1" stop-color="#a9adbd"/></linearGradient></defs><g stroke="#25283a" stroke-width="1.7" stroke-linejoin="round">' + picture + '</g></svg>';
      },
      facts: (base, S) => (model) => {
        base(model);
        const { util } = S.ctx;
        const items = S.spec.items, lanes = S.spec.lanes;
        const pending = items.filter(item => !model.assign[item.id] || model.assign[item.id] === 'pool').length;
        for (const lane of lanes) S.refs.lanes.get(lane.id).classList.toggle('wh-occupied', items.some(item => model.assign[item.id] === lane.id));
        if (S.refs.poolTitle) S.refs.poolTitle.textContent = `Unassigned Items (${pending})`;
        const overview = document.querySelector('.wh-overview');
        if (!overview) return;
        const dispatch = overview.querySelector('.wh-dispatch');
        const dispatchTitle = dispatch.querySelector('h2');
        dispatch.replaceChildren(dispatchTitle);
        const facts = S.refs.facts.map(el => el.textContent);
        const reference = facts.find(text => /reference/i.test(text));
        const assignedWeight = items.filter(item => model.assign[item.id] && model.assign[item.id] !== 'pool').reduce((sum, item) => sum + item.weight, 0);
        for (const [label, value] of [['Dispatch ID:', reference ? reference.split(':').slice(1).join(':').trim() : 'WH-0427-18'], ['Arrival Date:', 'Apr 27, 1998'], ['Total Items:', items.length], ['Total Weight:', `${items.reduce((sum, item) => sum + item.weight, 0)} kg`], ['Unassigned:', pending], ['Assigned:', `${items.length - pending} (${assignedWeight} kg)`]]) {
          const row = util.el('div', 'wh-reference-row', dispatch); util.el('span', '', row, label); util.el('b', '', row, String(value));
        }
        overview.querySelectorAll('.wh-summary').forEach((panel, index) => {
          const source = index === 0 ? items : lanes;
          const heading = panel.querySelector('h2'); panel.replaceChildren(heading);
          const table = util.el('table', '', panel);
          const headers = util.el('tr', '', table);
          for (const label of index === 0 ? ['Type', 'Count', 'Total Weight (kg)'] : ['Temperature', 'Bins', 'Total Capacity (kg)']) util.el('th', '', headers, label);
          for (const [key, label] of [['ambient', 'Ambient'], ['chilled', 'Chilled (2–8 °C)'], ['frozen', 'Frozen (≤ -18 °C)'], ['hazardous', 'Hazardous (certified)']]) {
            const group = source.filter(item => key === 'hazardous' ? item.haz : !item.haz && item.temp === key);
            const row = util.el('tr', '', table);
            for (const value of [label, group.length, group.reduce((sum, item) => sum + (index === 0 ? item.weight : item.capacity), 0)]) util.el('td', '', row, String(value));
          }
        });
      },
    },
  },
});
