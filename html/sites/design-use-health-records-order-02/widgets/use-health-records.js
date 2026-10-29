// Design on use-health-records/chart; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-health-records',
  site: 'design-use-health-records-order-02',
  name: 'design',
  split: 'train',
  scenarios: ['order'],
  template: 'use-health-records/chart',
  design: {
    fontFamily: '"Times New Roman",Times,serif',
    fontSize: '18px',
    tabs: ['Patient Summary', 'Orders', 'Medications', 'Results', 'Nursing', 'Flowsheets', 'Bed Management', 'Appointments'],
    parts: {
      frame: (base, S) => (ctx) => {
        const root = base(ctx);
        root.style.zoom = Math.min(1, ctx.size.width / 1672, ctx.size.height / (ctx.size.height < 800 ? 910 : 885));
        return root;
      },
      top: () => () => {},
      menu: () => () => {},
      rail: () => () => {},
      heading: () => () => {},
      toolbar: () => () => {},
      workflow: () => () => {},
      banner: (base, S) => () => {
        const { util: u } = S.ctx, s = S.spec;
        const band = u.el('div', 'plain-patient', S.root);
        const identity = u.el('div', 'plain-identity', band);
        u.el('h1', '', identity, s.patient.name);
        const birth = s.patient.dob.split('-').map(Number);
        const visit = s.date.match(/(\d+) ([A-Za-z]+) (\d{4})/);
        const month = visit ? ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(visit[2].slice(0, 3)) + 1 : birth[1];
        const age = visit ? Number(visit[3]) - birth[0] - Number(month < birth[1] || (month === birth[1] && Number(visit[1]) < birth[2])) : null;
        u.el('div', '', identity, `DOB: ${s.patient.dob}${age === null ? '' : `    Age: ${age}`}    Sex: ${s.patient.sex}`);
        u.el('div', '', identity, `MRN: ${s.patient.mrn}    FIN: ${s.code}`);
        u.el('div', '', identity, 'Location: Medical Unit    Room: 512A    Bed: 1');
        u.el('div', '', identity, 'Admitting Service: General Medicine');
        const clinical = u.el('div', 'plain-clinical', band);
        u.el('b', '', clinical, 'Diagnoses:');
        for (const row of ['J18.9    Pneumonia, unspecified', 'E11.9    Type 2 diabetes mellitus', 'I10       Essential hypertension']) u.el('div', '', clinical, row);
        u.el('b', 'plain-allergy', clinical, 'Allergies:');
        u.el('div', '', clinical, 'No known allergies');
        const details = u.el('div', 'plain-details', band);
        for (const [label, value] of [['Admission Date:', s.date], ['Attending Provider:', s.providers[0]], ['Primary Care Provider:', s.providers[1] || s.providers[0]], ['Code Status:', 'Full Code'], ['Diet:', 'Regular'], ['Isolation:', s.patient.isolation]]) {
          u.el('span', '', details, label); u.el('span', '', details, value);
        }
      },
      tabs: () => () => {},
      order: (base, S) => () => {
        const u = S.ctx.util;
        const composer = u.el('div', 'plain-composer', S.pane);
        S.P.orderComposer(composer);
        const lower = u.el('div', 'plain-lower', S.pane);
        const history = u.el('div', 'plain-history', lower);
        S.P.orderQueue(history);
        const right = u.el('div', 'plain-secondary', lower);
        S.P.readTable(right, 'Results and Acknowledgements', ['Date/Time', 'Description', 'Status'], [
          [S.spec.date + ' 08:12', 'Order acknowledged by pharmacy', 'Acknowledged'],
          [S.spec.date + ' 07:55', 'Order verified by pharmacist', 'Verified'],
          [S.spec.date + ' 07:30', 'Order completed', 'Completed'],
          [S.spec.date + ' 07:25', 'Order completed', 'Completed'],
        ]);
        const help = u.el('div', 'plain-help', right);
        u.el('b', '', help, 'Ordering Help');
        const list = u.el('ul', '', help);
        for (const text of ['Select a medication from the list and complete all fields: dose, unit, frequency, route and priority.', 'Review the order preview for accuracy before signing.', 'New orders will be sent to pharmacy for verification.', 'Only one medication order can be entered at a time.']) u.el('li', '', list, text);
      },
      orderComposer: (base, S) => (composer) => {
        const u = S.ctx.util, s = S.spec;
        u.el('h2', 'plain-title', composer, `New ${s.orderKind} Order`);
        const grid = u.el('div', 'plain-entry', composer);
        for (const desc of s.fields) S.P.field(desc.id, grid);
        const routing = S.P.section('Routing Details', composer);
        routing.parentElement.classList.add('plain-routing');
        for (const [label, value] of [['Ordering Clinician:', s.providers[0]], ['Destination:', 'Medical Unit (Room 512A)'], ['Encounter:', `${s.date} | North clinic`], ['Cosign Required:', 'No']]) {
          const row = u.el('div', 'plain-route-row', routing);
          u.el('span', '', row, label); u.el('span', '', row, value);
        }
        S.refs.preview = u.el('div', 'ehr-orderpreview plain-preview', composer);
      },
      field: (base, S) => (id, parent) => {
        const u = S.ctx.util, desc = S.spec.fields.find(d => d.id === id);
        const wrap = u.el('div', `ehr-field plain-field plain-${id}`, parent);
        S.refs.targets.set(id, wrap);
        const label = u.el('label', '', wrap, id === 'item' ? `${S.spec.orderKind}:` : id === 'unit' ? 'Unit:' : `${desc.label}:`);
        if (!desc.options) {
          const input = S.P.input(desc, wrap, label);
          input.placeholder = '';
          wrap.querySelectorAll('small').forEach(el => el.remove());
          return wrap;
        }
        const group = u.el('div', id === 'item' ? 'plain-list' : 'plain-select', wrap);
        group.setAttribute('aria-label', desc.label);
        let menu = group;
        if (id !== 'item') {
          const trigger = u.el('button', 'plain-select-button', group);
          trigger.type = 'button'; trigger.setAttribute('aria-label', desc.label); trigger.setAttribute('aria-expanded', 'false');
          u.el('span', 'plain-select-value', trigger);
          u.el('span', 'plain-select-arrow', trigger, '▾');
          menu = u.el('div', 'plain-options', group); menu.hidden = true;
          S.P.listen(trigger, 'click', () => {
            const open = menu.hidden;
            S.root.querySelectorAll('.plain-options').forEach(el => { el.hidden = true; el.previousElementSibling.setAttribute('aria-expanded', 'false'); });
            menu.hidden = !open; trigger.setAttribute('aria-expanded', String(open));
          });
          S.P.listen(trigger, 'keydown', e => {
            if (e.key === 'ArrowDown') { e.preventDefault(); menu.hidden = false; menu.firstElementChild.focus(); }
            if (e.key === 'Escape') { menu.hidden = true; trigger.setAttribute('aria-expanded', 'false'); }
          });
        }
        menu.setAttribute('role', 'listbox');
        for (const value of desc.options) {
          const button = S.P.choice(desc, value, menu);
          button.setAttribute('role', 'option');
          if (id !== 'item') S.P.listen(button, 'click', () => { menu.hidden = true; group.firstElementChild.setAttribute('aria-expanded', 'false'); });
        }
        return wrap;
      },
      orderQueue: (base, S) => (queue) => {
        const items = S.pastOrders.map((o, i) => [o.date, o.name, '—', '—', '—', o.state]);
        S.P.readTable(queue, 'Active and Recent Orders (Last 30 Days)', ['Date/Time', 'Medication / Test', 'Dose', 'Route', 'Frequency', 'Status'], items);
      },
      preview: (base, S) => (m) => {
        const u = S.ctx.util, preview = S.refs.preview;
        preview.replaceChildren();
        u.el('b', 'plain-preview-title', preview, m.saved ? 'Order Preview (Signed)' : 'Order Preview (Not Yet Signed)');
        const body = u.el('div', 'plain-preview-body', preview), values = m.saved || m.fields;
        const fields = u.el('div', 'plain-preview-fields', body);
        for (const d of S.spec.fields) u.el('span', '', fields, `${d.id === 'item' ? S.spec.orderKind : d.id === 'unit' ? 'Unit' : d.label}: ${values[d.id] || '___'}`);
        const route = u.el('div', 'plain-preview-routing', body);
        for (const text of [`Ordering Clinician: ${S.spec.providers[0]}`, 'Destination: Medical Unit (Room 512A)', `Encounter: ${S.spec.date} | North clinic`]) u.el('span', '', route, text);
      },
      paint: (base, S) => (m) => {
        base(m);
        for (const [id, target] of S.refs.targets) {
          const value = target.querySelector('.plain-select-value');
          if (value) value.textContent = m.fields[id] || '';
        }
      },
      locate: (base, S) => (target) => {
        if (target.choice) {
          const button = S.refs.choices.get(target.choice.join(':'));
          const menu = button && button.closest('.plain-options');
          if (menu && menu.hidden) {
            const r = menu.previousElementSibling.getBoundingClientRect();
            return [r.left + r.width / 2, r.top + r.height / 2];
          }
        }
        return base(target);
      },
      decorated: (base, S) => (ctx) => {
        base(ctx);
        const actions = S.root.querySelector('.ehr-actions');
        actions.classList.add('plain-actions');
        document.querySelector('.ref-task > .ref-tools').prepend(actions);
        const panel = document.querySelector('.ref-panel');
        if (panel) {
          const width = ctx.size.width + panel.getBoundingClientRect().width + 16;
          S.root.style.zoom = Math.min(1, width / 1672, ctx.size.height / (ctx.size.height < 800 ? 910 : 885));
          S.root.querySelector('.plain-patient').append(panel);
        }
      },
    },
  },
});
