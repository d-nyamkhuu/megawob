// Design on the shared use-dispatch operations workspace.
env.widget({
  task: 'use-dispatch',
  site: 'design-use-dispatch-board-03',
  name: 'design',
  split: 'train',
  scenarios: ['board'],
  template: 'use-dispatch/workspace',
  design: {
      font: 'Arial, sans-serif', panel: '#c0c0c0', foreground: '#111',
      background: '#c0c0c0', line: '#888', muted: '#111', accent: '#000080',
      inset: 0, cardHeight: 74, cardGap: 6, paneInset: 5,
      laneHeaderHeight: 256,
    parts: {
      icon: (base, S) => (parent, name, size = 15) => {
        if (name !== 'truck') return base(parent, name, size);
        const svg = S.ctx.util.svg('svg', {viewBox:'0 0 48 30', width:size, height:size, fill:'currentColor', 'aria-hidden':'true'}, parent);
        S.ctx.util.svg('path', {d:'M1 4h30v19H1zM31 12h9l7 8v4H31z',stroke:'white','stroke-width':1},svg);
        S.ctx.util.svg('path', {d:'M34 14h5l4 5h-9z',fill:'white'},svg);
        for (const x of [10,38]) S.ctx.util.svg('circle',{cx:x,cy:24,r:4,stroke:'white','stroke-width':1},svg);
        return svg;
      },
      frame: (base, S) => (ctx) => {
        S.D.cardHeight = ctx.size.height >= 900 ? 74 : ctx.size.height >= 800 ? 66 : 58;
        return base(ctx);
      },
      toolbar: (base, S) => () => { base(); S.app.querySelector('.ad-toolbar').remove(); },
      rail: (base, S) => () => { base(); S.els.rail.remove(); },
      navigation: () => () => {},
      context: (base, S) => () => {
        const u = S.ctx.util;
        const row = u.el('div', 'win-dispatch-meta', S.els.work);
        u.el('strong', '', row, 'Dispatch Date:');
        u.el('span', 'win-value', row, 'Tue, Apr 14, 1992');
        const ref = u.el('div', 'win-dispatch-reference', row);
        u.el('strong', '', ref, 'Dispatch Ref:');
        const value = u.el('span', 'win-value', ref);
        S.refs.dispatchReference = value;
      },
      filters: (base, S) => () => { base(); S.els.work.querySelector('.ad-filters').remove(); },
      activity: (base, S) => () => { base(); S.refs.dock.remove(); },
      inspector: (base, S) => () => { base(); S.refs.inspector.hidden = true; },
      footer: (base, S) => () => { base(); S.els.footer.hidden = true; },
      cardContent: (base, S) => (it, el) => {
        const u = S.ctx.util, f = env.taskDef;
        const index = S.spec.items.indexOf(it);
        const colors = ['#ff7373','#ffe35b','#42b8ff','#9ee87c','#ffab63','#b387ed','#48cfdf','#e7c56f'];
        el.style.setProperty('--job-color', colors[index % colors.length]);
        const top = u.el('div', 'win-card-top', el);
        u.el('strong', 'win-job-id', top, it.id);
        u.el('span', 'win-weight', top, `${it.weight} kg`);
        u.el('div', 'win-customer', el, it.name);
        u.el('div', 'win-address', el, it.address);
        u.el('span', 'win-time', el, `${f.helpers.time(it.start)} – ${f.helpers.time(it.end)}`);
        u.el('span', 'ad-state', el).hidden = true;
      },
      laneHeader: (base, S) => (lane, l) => {
        const u = S.ctx.util, f = env.taskDef, pool = l.id === 'pool';
        lane.classList.add(pool ? 'win-pool' : 'win-driver');
        const head = u.el('div', 'ad-lane-head', lane);
        S.refs.heads.set(l.id, head);
        const title = u.el('div', 'win-lane-title', head);
        if (pool) {
          S.refs.poolTitle = u.el('strong', '', title, 'Unassigned Deliveries');
        } else {
          const index = S.spec.lanes.indexOf(l);
          lane.style.setProperty('--driver-color', ['#f9cccc','#c6e3fb','#d3efca'][index % 3]);
          lane.style.setProperty('--truck-color', ['#d90000','#0000d5','#087900'][index % 3]);
          const truck = S.P.icon(title, 'truck', 43); truck.classList.add('win-truck');
          u.el('strong', '', title, l.label);
          const data = u.el('div', 'win-truck-data', head);
          for (const [label, value] of [['Truck',l.vehicle],['Capacity',`${l.capacity.toLocaleString('en-US')} kg`],['Work window',`${f.helpers.time(l.start)} – ${f.helpers.time(l.end)}`]]) {
            u.el('span', '', data, label); u.el('span', '', data, value);
          }
        }
        S.refs.loads.set(l.id, u.el('div', 'ad-load', head));
        S.refs.fills.set(l.id, u.el('div', 'ad-fill', head));
        if (!pool) {
          const stops = u.el('div', 'win-stops-head', head);
          u.el('strong', 'win-stop-count', stops, 'Stops (0)');
          u.el('strong', '', stops, 'kg');
        }
        return head;
      },
      empty: (base, S) => (pane, l) => {
        const empty = S.ctx.util.el('div', 'ad-empty', pane);
        S.refs.rows.set(l.id, empty);
        return empty;
      },
      laneDecorated: (base, S) => (lane, l) => {
        if (l.id === 'pool') {
          const bar = S.ctx.util.el('div', 'win-scrollbar', lane);
          const up = S.ctx.util.el('button', '', bar, '▲');
          const track = S.ctx.util.el('div', 'win-scroll-track', bar);
          S.ctx.util.el('div', 'win-scroll-thumb', track);
          const down = S.ctx.util.el('button', '', bar, '▼');
          up.type = down.type = 'button';
          up.setAttribute('aria-label','Scroll deliveries up');
          down.setAttribute('aria-label','Scroll deliveries down');
          up.addEventListener('click', () => { S.refs.panes.get('pool').scrollTop -= S.D.cardHeight + S.D.cardGap; S.P.mirror(); });
          down.addEventListener('click', () => { S.refs.panes.get('pool').scrollTop += S.D.cardHeight + S.D.cardGap; S.P.mirror(); });
          return;
        }
        const numbers = S.ctx.util.el('div', 'win-stop-numbers', lane);
        for (let i = 1; i <= 8; i++) S.ctx.util.el('div', '', numbers, String(i));
      },
      item: (base, S) => (el, it) => {
        base(el, it);
        el.addEventListener('click', () => {
          const box = document.querySelector('.dispatch-detail-copy');
          if (!box) return;
          box.replaceChildren();
          const u = S.ctx.util;
          u.el('strong', '', box, `${it.id} · ${it.name}`);
          u.el('p', '', box, it.address);
          u.el('div', '', box, `${it.weight} kg · ${env.taskDef.helpers.time(it.start)} – ${env.taskDef.helpers.time(it.end)}`);
        });
      },
      paintLanes: (base, S) => (model, alerts) => {
        base(model, alerts);
        const u = S.ctx.util;
        const count = S.spec.items.filter(it => !model.assign[it.id] || model.assign[it.id] === 'pool').length;
        S.refs.poolTitle.textContent = `Unassigned Deliveries (${count})`;
        for (const l of S.spec.lanes) {
          const items = S.spec.items.filter(it => model.assign[it.id] === l.id);
          const load = items.reduce((sum, it) => sum + it.weight, 0);
          const box = S.refs.loads.get(l.id); box.replaceChildren();
          for (const [label,value] of [['Assigned load', load],['Remaining',l.capacity-load]]) {
            u.el('span','',box,label); u.el('strong','',box,`${value.toLocaleString('en-US')} kg`);
          }
          S.refs.heads.get(l.id).querySelector('.win-stop-count').textContent = `Stops (${items.length})`;
        }
      },
      facts: (base, S) => (model) => {
        base(model);
        S.refs.dispatchReference.textContent = S.refs.facts[2].textContent.replace(/^.*?:\s*/, '');
      },
    },
  },
});
