// Design on the shared use-dispatch operations workspace.
env.widget({
  task: 'use-dispatch',
  site: 'design-use-dispatch-board-05',
  name: 'design',
  split: 'train',
  scenarios: ['board'],
  template: 'use-dispatch/workspace',
  design: {
    font: "'Segoe UI', Tahoma, Arial, sans-serif",
    background: '#dce1e5', panel: '#dce1e5', foreground: '#101c2a', line: '#adb8c1',
    accent: '#1689d1', muted: '#5c6670', inset: 0,
    cardHeight: 64, cardGap: 7, paneInset: 8, laneHeaderHeight: 48,
    parts: {
      icon: (base, S) => function(parent, name, size) {
        if (name !== 'truck' && name !== 'box') return base(parent, name, size);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', name === 'truck' ? '0 0 40 30' : '0 0 40 36');
        svg.setAttribute('width', size || 15); svg.setAttribute('height', size || 15);
        svg.setAttribute('aria-hidden', 'true');
        svg.innerHTML = name === 'truck'
          ? '<path d="M2 4h23v17H2zM25 10h8l5 7v6H25z" fill="currentColor"/><path d="M28 12v6h7l-4-6z" fill="#b5d0dd"/><circle cx="9" cy="24" r="3.5" fill="currentColor"/><circle cx="30" cy="24" r="3.5" fill="currentColor"/>'
          : '<path d="m5 9 15-7 15 7v17l-15 8-15-8z" fill="currentColor"/><path d="m5 9 15 8 15-8M20 17v17M12 6l16 8" fill="none" stroke="#e0e9ef" stroke-width="1.6"/>';
        parent.appendChild(svg); return svg;
      },
      styles: (base, S) => function(ctx) {
        const short = ctx.size.height < 480, tiny = ctx.size.height < 340;
        Object.assign(S.D, { cardHeight: tiny ? 36 : short ? 46 : 64, cardGap: short ? 5 : 7,
          paneInset: short ? 5 : 8, laneHeaderHeight: tiny ? 30 : short ? 36 : 48 });
        ctx.stage.style.setProperty('--job-h', S.D.cardHeight + 'px');
        ctx.stage.style.setProperty('--job-gap', S.D.cardGap + 'px');
        ctx.stage.style.setProperty('--pane-pad', S.D.paneInset + 'px');
        ctx.stage.style.setProperty('--lane-head', S.D.laneHeaderHeight + 'px');
        ctx.stage.classList.toggle('carbon-compact', short);
        ctx.stage.classList.toggle('carbon-tiny', tiny);
        base(ctx);
      },
      cardContent: (base, S) => function(it, el) {
        const u = S.ctx.util;
        u.el('span', 'ad-id', el, it.id);
        const box = u.el('span', 'carbon-box', el); S.P.icon(box, 'box', 21);
        u.el('span', 'ad-customer', el, it.name);
        u.el('span', 'ad-card-note', el, `${env.taskDef.helpers.time(it.start)} – ${env.taskDef.helpers.time(it.end)}`);
        u.el('span', 'ad-weight', el, `${it.weight} kg`);
        u.el('span', 'carbon-volume', el, `${(it.weight / 100).toFixed(1)} m³`);
        u.el('span', 'ad-state', el);
      },
      item: (base, S) => function(el, it) {
        base(el, it);
        const colors = [['#16a4ed','#d2eaff'],['#7ab843','#e0edd4'],['#e7b535','#fff0c6'],
          ['#ee5574','#ffdbe2'],['#8961e6','#e2daf8'],['#24ae7d','#d5eee4'],
          ['#f38639','#ffdec8'],['#1a9ee9','#d1eaff'],['#6c8295','#e3e7ec']];
        const [accent, fill] = colors[S.spec.items.indexOf(it) % colors.length];
        el.style.setProperty('--job-accent', accent); el.style.setProperty('--job-fill', fill);
      },
      laneHeader: (base, S) => function(lane, l) {
        const head = base(lane, l), u = S.ctx.util;
        lane.classList.add(l.id === 'pool' ? 'carbon-pool' : 'carbon-driver');
        const load = S.refs.loads.get(l.id), bar = S.refs.fills.get(l.id).parentElement;
        head.replaceChildren();
        if (l.id === 'pool') {
          u.el('strong', 'carbon-pool-title', head, `Unassigned Jobs (${S.spec.items.length})`);
          head.append(load, bar);
        } else {
          const name = u.el('strong', 'carbon-driver-name', head);
          S.P.icon(name, 'truck', 36); u.el('span', '', name, l.label);
          const capacity = u.el('div', 'carbon-capacity', head);
          u.el('span', '', capacity, 'Capacity');
          u.el('b', '', capacity, `${l.capacity} kg`);
          u.el('span', '', capacity, '|');
          u.el('b', '', capacity, `${(l.capacity / 100).toFixed(1)} m³`);
          const shift = u.el('div', 'carbon-shift', head);
          u.el('span', '', shift, 'Work Window');
          u.el('b', '', shift, `${env.taskDef.helpers.time(l.start)} – ${env.taskDef.helpers.time(l.end)}`);
          head.append(load, bar);
        }
        return head;
      },
      laneDecorated: (base, S) => function(lane, l) {
        base(lane, l);
        if (l.id !== 'pool') {
          const block = S.ctx.util.el('div', 'carbon-assigned', lane);
          S.ctx.util.el('span', '', block, 'Assigned Load'); block.append(S.refs.loads.get(l.id));
        }
      },
      empty: (base, S) => function(pane, l) {
        const el = base(pane, l); el.replaceChildren();
        S.ctx.util.el('span', '', el, l.id === 'pool' ? 'All jobs allocated' : 'Drag jobs here');
        return el;
      },
      paintLanes: (base, S) => function(m, alerts) {
        base(m, alerts);
        for (const [id, el] of S.refs.loads) {
          const items = S.spec.items.filter(it => (m.assign[it.id] || 'pool') === id);
          const weight = items.reduce((sum, it) => sum + it.weight, 0);
          if (id === 'pool') S.refs.heads.get(id).querySelector('strong').textContent = `Unassigned Jobs (${items.length})`;
          else el.textContent = `${weight} kg　 ${(weight / 100).toFixed(1)} m³`;
        }
      },
      facts: (base, S) => function(m) {
        base(m);
        const weight = S.spec.items.reduce((sum, it) => sum + it.weight, 0);
        const values = { 'dispatch-unassigned': S.spec.items.filter(it => (m.assign[it.id] || 'pool') === 'pool').length,
          'dispatch-weight': `${weight.toLocaleString('en-US')} kg`,
          'dispatch-volume': `${(weight / 100).toFixed(1)} m³`, 'dispatch-jobs': S.spec.items.length };
        for (const [key, value] of Object.entries(values)) {
          const el = document.querySelector(`.${key} .dispatch-metric-value`); if (el) el.textContent = value;
        }
        const ref = document.querySelector('.dispatch-ref .dispatch-metric-value');
        if (ref && S.refs.facts[2]) ref.textContent = S.refs.facts[2].textContent.replace(/^.*?:\s*/, '');
      },
    },
  },
});
