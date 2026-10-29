// Design on the shared use-dispatch operations workspace.
env.widget({
  task: 'use-dispatch',
  site: 'design-use-dispatch-reschedule-05',
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
        u.el('h2', 'delivery-title', rail, `Deliveries (${S.spec.items.length})`);
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
          row.style.setProperty('--job-color', ['#2385ec','#23a543','#f57d1f','#6a36c8','#d5203e','#17afb3','#f9d00e','#e8457a','#7a8593'][i % 9]);
          u.el('i', 'job-dot', row, it.id);
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
        u.el('h1', '', title, 'Weekly Schedule');
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
        // Details inspector beside the weekly sub-window (static: shows the first delivery).
        const first = S.spec.items[0];
        const inspector = u.el('aside', 'delivery-inspector', S.els.work.parentElement);
        u.el('h3', '', inspector, 'Delivery Details');
        const body = u.el('div', 'inspector-body', inspector);
        const who = u.el('div', 'inspector-who', body);
        u.el('i', 'job-dot', who, first.id);
        u.el('strong', '', who, first.name);
        const facts = u.el('dl', 'inspector-facts', body);
        const who_dot = who.querySelector('.job-dot'), who_name = who.querySelector('strong');
        const dds = {};
        for (const k of ['Address', 'Distance', 'Load', 'Requested day', 'Service type', 'Notes']) {
          u.el('dt', '', facts, k); dds[k] = u.el('dd', '', facts);
        }
        const notes = ['Medical supplies. Dock at rear', 'Call on arrival', 'Fragile goods. Use side door', 'Signature required'];
        const show = (it) => {
          const i = S.spec.items.indexOf(it);
          who_dot.textContent = it.id; who_name.textContent = it.name;
          who_dot.parentElement.style.setProperty('--job-color', ['#2385ec','#23a543','#f57d1f','#6a36c8','#d5203e','#17afb3','#f9d00e','#e8457a','#7a8593'][i % 9]);
          const km = /(\d+)\s*km/.exec(it.address || '');
          dds.Address.textContent = it.address;
          dds.Distance.textContent = km ? `${km[1]} km` : `${8 + (i * 5) % 14} km`;
          dds.Load.textContent = `${it.weight.toLocaleString('en-US')} kg`;
          dds['Requested day'].textContent = String(it.requested || it.requestedDay || it.day || it.target || 'Weekday');
          dds['Service type'].textContent = i % 3 === 2 ? 'Express' : 'Standard';
          dds.Notes.textContent = notes[i % notes.length];
        };
        show(first);
        S.app.addEventListener('click', (e) => {
          const t = e.target.closest && e.target.closest('[data-item]');
          const it = t && S.spec.items.find(x => x.id === t.dataset.item);
          if (it) show(it);
        });
        const map = u.el('div', 'inspector-map', inspector);
        map.innerHTML =
          '<svg viewBox="0 0 300 230" preserveAspectRatio="none" aria-hidden="true"><rect width="300" height="230" fill="#eef0ec"/><path fill="#dde8d3" d="M190 0h110v90l-60-40z"/><path fill="#dde8d3" d="M0 150l70 80H0z"/><path fill="#86bfe6" d="M0 40l300 170v20l-20 0L0 70z"/><g stroke="#fff" stroke-width="5" fill="none"><path d="M60 0l90 120"/><path d="M0 120l130-30 120 20"/><path d="M200 0l-20 110 60 120"/><path d="M0 200l100-40"/></g><path fill="#2385ec" d="M150 40a14 14 0 0 1 14 14c0 11-14 28-14 28S136 65 136 54a14 14 0 0 1 14-14z"/><circle cx="150" cy="54" r="5" fill="#fff"/></svg>';
        if (panel) S.els.work.parentElement.appendChild(panel);
      },
      filters: (base, S) => () => {
        base();
        S.app.querySelector('.ad-filters').hidden = true;
      },
      cardContent: (base, S) => (it, el) => {
        const u = S.ctx.util;
        const i = S.spec.items.indexOf(it);
        el.style.setProperty('--job-color', ['#2385ec','#23a543','#f57d1f','#6a36c8','#d5203e','#17afb3','#f9d00e','#e8457a','#7a8593'][i % 9]);
        u.el('i', 'job-dot', el, it.id);
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
