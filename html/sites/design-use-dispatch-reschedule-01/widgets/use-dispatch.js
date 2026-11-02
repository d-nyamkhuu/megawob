// Design on the shared use-dispatch operations workspace.
env.widget({
  task: 'use-dispatch',
  site: 'design-use-dispatch-reschedule-01',
  name: 'design',
  split: 'train',
  scenarios: ['reschedule'],
  template: 'use-dispatch/workspace',
  design: {
    inset: 0,
    cardHeight: 68,
    cardGap: 10,
    font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
    parts: {
      styles: () => () => {},
      frame: (base, S) => (ctx) => {
        const app = ctx.util.el('section', 'ad-app dispatch-app', ctx.stage);
        app.setAttribute('aria-label', 'Weekly dispatch plan');
        return app;
      },
      toolbar: (base, S) => () => {
        base();
        S.app.querySelector('.ad-toolbar').hidden = true;
      },
      rail: (base, S) => () => {
        const u = S.ctx.util, rail = S.els.rail;
        u.el('h2', 'delivery-title', rail, 'Deliveries');
        const search = u.el('label', 'delivery-search', rail);
        S.P.icon(search, 'search', 22);
        const input = u.el('input', '', search);
        input.type = 'search'; input.placeholder = 'Search deliveries';
        input.setAttribute('aria-label', 'Search deliveries');
        const tabs = u.el('div', 'delivery-tabs', rail);
        const list = u.el('div', 'delivery-index', rail);
        rail._index = list; rail._filter = 'All'; rail._search = input;
        ['All', 'Assigned', 'Unassigned'].forEach(label => {
          const button = u.el('button', label === 'All' ? 'active' : '', tabs, label);
          button.type = 'button';
          if (label === 'Unassigned') rail._unassignedTab = button;
          button.addEventListener('click', () => {
            rail._filter = label;
            for (const b of tabs.children) b.classList.toggle('active', b === button);
            S.P.paint(S.model);
          });
        });
        input.addEventListener('input', () => S.P.paint(S.model));
        for (const it of S.spec.items) {
          const row = u.el('div', 'delivery-record', list);
          row.dataset.item = it.id;
          const i = S.spec.items.indexOf(it);
          row.style.setProperty('--job-color', ['#ff3b18','#007aff','#00ad4d','#ffb900','#791aff','#00aaa6','#ff8000','#4035ff'][i % 8]);
          u.el('i', 'job-dot', row);
          const copy = u.el('div', 'record-copy', row);
          const title = u.el('div', 'record-title', copy);
          u.el('b', '', title, it.id); u.el('span', '', title, it.name);
          u.el('div', 'record-address', copy, it.address);
          u.el('span', 'record-weight', row, `${it.weight.toLocaleString('en-US')} kg`);
          S.P.attach(row, it);
        }
      },
      navigation: () => () => {},
      context: (base, S) => () => {
        const u = S.ctx.util;
        const head = u.el('div', 'plan-header', S.els.work);
        const title = u.el('div', 'plan-title', head);
        u.el('h1', '', title, 'Weekly Dispatch Plan');
        const reference = u.el('div', 'plan-reference', title);
        u.el('span', '', reference, 'Dispatch REF');
        u.el('b', '', reference, S.spec.ref || S.spec.reference || '');
        const counts = u.el('div', 'plan-counts', head);
        u.el('span', '', counts, `${S.spec.items.length} deliveries`);
        S.refs.unassignedCount = u.el('span', 'unassigned-count', counts);
        const chrome = document.querySelector('.ref-task');
        if (chrome) head.appendChild(chrome);
        const foot = document.querySelector('.ref-foot');
        if (foot && !foot.querySelector('[data-role="submit"]')) {
          const tools = chrome.querySelector('.ref-tools');
          for (const button of foot.querySelectorAll('.ref-xtra')) tools.appendChild(button);
          foot.hidden = true;
        }
        const instruction = head.querySelector('.ref-instruction');
        if (instruction) head.appendChild(instruction);
        const note = document.querySelector('.ref-note');
        if (note) S.els.rail.appendChild(note);
        const panel = document.querySelector('.ref-panel');
        if (panel) S.els.work.parentElement.appendChild(panel);
      },
      filters: (base, S) => () => {
        base();
        S.app.querySelector('.ad-filters').hidden = true;
      },
      cardContent: (base, S) => (it, el) => {
        const u = S.ctx.util;
        const i = S.spec.items.indexOf(it);
        el.style.setProperty('--job-color', ['#ff3b18','#007aff','#00ad4d','#ffb900','#791aff','#00aaa6','#ff8000','#4035ff'][i % 8]);
        u.el('i', 'job-dot', el);
        const copy = u.el('div', 'job-copy', el);
        const title = u.el('div', 'job-title', copy);
        u.el('b', 'ad-id', title, it.id);
        u.el('span', 'ad-customer', title, it.name);
        u.el('div', 'ad-card-note', copy, it.address);
        u.el('span', 'ad-weight', el, `${it.weight.toLocaleString('en-US')} kg`);
        u.el('span', 'job-menu', el, '⋮');
        u.el('span', 'ad-state', el);
      },
      laneHeader: (base, S) => (lane, l) => {
        const u = S.ctx.util;
        const head = u.el('div', 'ad-lane-head', lane);
        S.refs.heads.set(l.id, head);
        u.el('strong', '', head, l.label);
        const capacity = u.el('div', 'capacity-line', head);
        u.el('span', '', capacity, 'Load limit');
        u.el('span', '', capacity, l.capacity ? `${l.capacity.toLocaleString('en-US')} kg` : '—');
        S.refs.loads.set(l.id, u.el('div', 'ad-load', head));
        const bar = u.el('div', 'ad-bar', head);
        S.refs.fills.set(l.id, u.el('div', 'ad-fill', bar));
        u.el('div', 'capacity-percent', head);
        return head;
      },
      empty: (base, S) => (pane, l) => {
        const empty = S.ctx.util.el('div', 'ad-empty', pane, 'Add delivery here');
        S.refs.rows.set(l.id, empty);
        return empty;
      },
      lanes: (base, S) => () => {
        const u = S.ctx.util;
        const pool = S.P.lane({ id: 'pool', label: 'Unassigned' }, S.els.rail);
        pool.classList.add('delivery-pool');
        S.els.rail._poolLane = pool;
        // The index is also the visible recovery destination for unassigning a card.
        S.refs.lanes.set('pool', S.els.rail);
        S.refs.heads.set('pool', S.els.rail._unassignedTab);
        const lanes = u.el('div', 'ad-lanes', S.els.main);
        for (const l of S.spec.lanes) S.P.lane(l, lanes);
        for (const it of S.spec.items) S.P.card(it, S.refs.panes.get(S.model.assign[it.id] || 'pool'));
      },
      activity: (base, S) => () => {
        base(); S.refs.dock.hidden = true;
      },
      inspector: (base, S) => () => {
        base(); S.refs.inspector.hidden = true;
      },
      footer: (base, S) => () => {
        base(); S.els.footer.hidden = true;
      },
      facts: (base, S) => (m) => {
        base(m);
        const reference = S.els.footer.querySelector('.ad-reference').textContent;
        S.app.querySelector('.plan-reference b').textContent = reference.replace(/^[^:]*:\s*/, '');
        const count = S.spec.items.filter(it => !m.assign[it.id] || m.assign[it.id] === 'pool').length;
        S.refs.unassignedCount.textContent = `${count} unassigned`;
      },
      paintLanes: (base, S) => (m, alerts) => {
        base(m, alerts);
        const u = S.ctx.util;
        for (const l of S.spec.lanes) {
          const items = S.spec.items.filter(it => m.assign[it.id] === l.id);
          const load = items.reduce((n, it) => n + it.weight, 0);
          const value = S.refs.loads.get(l.id);
          value.replaceChildren();
          u.el('span', '', value, 'Assigned');
          u.el('b', '', value, `${load.toLocaleString('en-US')} kg`);
          S.refs.heads.get(l.id).querySelector('.capacity-percent').textContent = `${Math.round(100 * load / l.capacity)}% of limit`;
          const pane = S.refs.panes.get(l.id), empty = S.refs.rows.get(l.id);
          // Keep a visible empty slot beside a single scheduled delivery.
          empty.hidden = items.length > 1;
          pane.appendChild(empty);
        }
        const rail = S.els.rail, query = rail._search.value.toLowerCase();
        for (const row of rail._index.children) {
          const assigned = m.assign[row.dataset.item] && m.assign[row.dataset.item] !== 'pool';
          row.hidden = !row.textContent.toLowerCase().includes(query) ||
            (rail._filter === 'Assigned' && !assigned) || (rail._filter === 'Unassigned' && assigned);
        }
        const pool = S.els.rail._poolLane;
        pool.hidden = !S.spec.items.some(it => !m.assign[it.id] || m.assign[it.id] === 'pool');
      },
      locate: (base, S) => (target) => {
        if (target.pane === 'pool') return S.ctx.util.center(S.els.rail._unassignedTab);
        return base(target);
      },
    },
  },
});
