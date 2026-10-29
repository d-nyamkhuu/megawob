// Design on use-health-records/chart; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-health-records',
  site: 'design-use-health-records-order-04',
  name: 'design',
  split: 'train',
  scenarios: ['order'],
  template: 'use-health-records/chart',
  design: {
    rootInset: '0', rootRadius: '0', fontFamily: 'Arial,sans-serif', fontSize: '15px',
    parts: {
      top: () => () => {},
      menu: () => () => {},
      tabs: () => () => {},
      rail: () => () => {},
      heading: () => () => {},
      toolbar: () => () => {},
      workflow: () => () => {},
      banner: (base, S) => () => {
        const u = S.ctx.util, p = S.spec.patient;
        const banner = u.el('div', 'ehr-banner', S.root);
        u.el('strong', 'ehr-name', banner, S.unidentified ? 'No patient selected' : p.name);
        const demo = u.el('div', 'ehr-demographics', banner);
        const age = p.age ?? (2027 - Number(p.dob.slice(0, 4)) - (p.dob.slice(5) > '10-18' ? 1 : 0));
        for (const text of [`MRN: ${p.mrn}`, `DOB: ${p.dob}`, `Age: ${age}`, `Sex: ${p.sex}`]) u.el('span', '', demo, text);
        const alerts = u.el('div', 'ehr-alerts', banner);
        u.el('span', '', alerts, 'Allergies:  NKDA');
        u.el('span', '', alerts, 'Code Status:  Full Code');
      },
      order: (base, S) => () => {
        const u = S.ctx.util;
        const composer = u.el('div', 'ehr-composer', S.pane);
        S.P.orderComposer(composer);
        S.P.orderQueue(S.pane);
        S.P.readTable(S.pane, 'Results and Acknowledgements', ['Date/Time', 'Related Order', 'Type', 'Result / Note', 'Acknowledged By'], [
          ['2027-10-16 13:10', 'Basic metabolic panel', 'Lab', 'Within normal limits', S.reviewer],
          ['2027-10-16 16:00', 'Chest X-Ray', 'Radiology', 'No acute process', S.spec.providers[0]],
          ['2027-10-16 12:05', 'CBC', 'Lab', 'WBC 7.1, Hgb 14.2, Plt 236', S.reviewer]
        ]).parentElement.classList.add('ehr-acknowledgements');
      },
      orderComposer: (base, S) => composer => {
        const u = S.ctx.util, spec = S.spec;
        const entry = S.P.section(`New ${spec.orderKind} Order`, composer);
        entry.parentElement.classList.add('ehr-entry');
        const grid = u.el('div', 'ehr-entrygrid', entry);
        for (const desc of spec.fields) S.P.field(desc.id, grid);
        const routing = S.P.section('Routing / Encounter Details', entry);
        routing.parentElement.classList.add('ehr-routing');
        const details = [
          ['Ordering Clinician:', spec.providers[0]], ['Order Date/Time:', '2027-10-18 10:26'],
          ['Encounter:', 'Inpatient – 4 East'], ['Diagnosis:', 'Not specified'],
          ['Destination:', spec.orderKind === 'Medication' ? 'Pharmacy' : 'Central laboratory']
        ];
        for (const [label, value] of details) { const cell = u.el('div', 'ehr-routingcell', routing); u.el('b', '', cell, label); u.el('span', '', cell, value); }
        const comments = u.el('div', 'ehr-routingcell', routing);
        const label = u.el('label', '', comments, 'Comments:');
        const input = u.el('textarea', '', comments); input.setAttribute('aria-label', 'Comments'); label.htmlFor = input.id = 'order-comments';
        const preview = u.el('div', 'ehr-previewbox', entry);
        const bar = u.el('div', 'ehr-previewbar', preview);
        u.el('b', 'ehr-previewtitle', bar, 'Order Preview (Not Yet Signed)');
        u.el('div', 'ehr-preview-actions', bar);
        S.refs.preview = u.el('div', 'ehr-orderpreview', preview);
      },
      field: (base, S) => (id, parent) => {
        const u = S.ctx.util, desc = S.spec.fields.find(d => d.id === id);
        const wrap = u.el('div', `ehr-field ehr-field-${id}`, parent);
        S.refs.targets.set(id, wrap);
        const label = u.el('label', '', wrap, id === 'item' ? `${S.spec.orderKind} Item` : id === 'unit' ? 'Unit' : desc.label);
        if (!desc.options) { const input = S.P.input(desc, wrap, label); input.placeholder = ''; return wrap; }
        const list = u.el('div', id === 'item' ? 'ehr-itemlist ehr-choices' : 'ehr-optionlist ehr-choices', wrap);
        list.setAttribute('role', id === 'item' ? 'listbox' : 'group'); list.setAttribute('aria-label', desc.label);
        if (id !== 'item') {
          const trigger = u.el('button', 'ehr-combobox', wrap);
          trigger.type = 'button'; trigger.setAttribute('aria-label', desc.label); trigger.setAttribute('aria-expanded', 'false');
          u.el('span', 'ehr-combovalue', trigger); u.el('span', 'ehr-comboarrow', trigger, '⌄');
          list.hidden = true;
          S.P.listen(trigger, 'click', () => {
            const open = list.hidden;
            for (const other of S.root.querySelectorAll('.ehr-optionlist')) other.hidden = true;
            for (const other of S.root.querySelectorAll('.ehr-combobox')) other.setAttribute('aria-expanded', 'false');
            list.hidden = !open; trigger.setAttribute('aria-expanded', String(open));
          });
        }
        for (const value of desc.options) {
          const button = S.P.choice(desc, value, list);
          S.P.listen(button, 'click', () => { if (id !== 'item') { list.hidden = true; wrap.querySelector('.ehr-combobox').setAttribute('aria-expanded', 'false'); } });
        }
        return wrap;
      },
      locate: (base, S) => target => {
        if (target.choice) {
          const option = S.refs.choices.get(target.choice.join(':'));
          if (option && option.parentElement.hidden) {
            const q = option.parentElement.parentElement.querySelector('.ehr-combobox').getBoundingClientRect();
            return [q.left + q.width / 2, q.top + q.height / 2];
          }
        }
        return base(target);
      },
      paint: (base, S) => m => {
        base(m);
        for (const desc of S.spec.fields) {
          const wrap = S.refs.targets.get(desc.id), value = wrap?.querySelector('.ehr-combovalue');
          if (value) value.textContent = m.fields[desc.id] || '';
        }
      },
      preview: (base, S) => m => {
        const u = S.ctx.util, values = m.saved || m.fields;
        S.refs.preview.replaceChildren();
        for (const desc of S.spec.fields) {
          const cell = u.el('div', '', S.refs.preview);
          u.el('b', '', cell, `${desc.id === 'item' ? S.spec.orderKind : desc.id === 'unit' ? 'Unit' : desc.label}:`);
          u.el('span', '', cell, values[desc.id] || '—');
        }
        S.root.querySelector('.ehr-previewtitle').textContent = m.saved ? 'Order Preview (Signed)' : 'Order Preview (Not Yet Signed)';
      },
      actions: (base, S) => ctx => {
        base(ctx);
        const slot = S.root.querySelector('.ehr-preview-actions');
        if (slot) slot.append(S.main.querySelector('.ehr-actions'));
      },
      orderQueue: (base, S) => queue => {
        S.P.readTable(queue, 'Historical Orders (Past and Current)', ['Date/Time', 'Medication / Test', 'Dose', 'Route', 'Frequency', 'Priority', 'Status'], S.pastOrders.map((o, i) => [
          `2027-10-${String(15-i).padStart(2,'0')} ${['14:20','09:15','20:10','10:05','18:45','12:30','11:10','11:10','10:50'][i]}`,
          o.name, '—', '—', 'Once', 'Routine', o.state
        ])).parentElement.classList.add('ehr-history');
      },
      sidebar: (base, S) => ctx => {
        // The base results part owns three seeded draws; keep its original viewport guard.
        const temp = ctx.util.el('div', '', S.body);
        S.P.results(temp);
        const rows = [...temp.querySelectorAll('.ehr-contextrow')].map(row => [row.querySelector('b').textContent, row.lastElementChild.textContent]);
        temp.remove();
        S.root._summaryRows = rows;
      },
      decorated: (base, S) => ctx => {
        const headerNote = document.querySelector('.ref-task > .ref-instruction');
        if (headerNote) S.root.querySelector('.ehr-banner').append(headerNote);
        const u = ctx.util, side = u.el('aside', 'ehr-context', S.body);
        const status = S.P.section('Patient Status', side); status.parentElement.classList.add('ehr-patientstatus');
        for (const [label, value] of [['Location:', '4 East  421B'], ['Admit Date:', '2027-10-17'], ['Attending:', S.spec.providers[0]], ['Service:', 'Internal Medicine']]) {
          const row = u.el('div', 'ehr-summaryrow', status); u.el('span', '', row, label); u.el('span', '', row, value);
        }
        const taskPanel = document.querySelector('.ref-panel');
        if (taskPanel) side.append(taskPanel);
        S.P.readTable(side, 'Active Orders by Type', ['',''], [['Medications','4'],['Laboratory','0'],['Radiology','0'],['Other','0']]).parentElement.classList.add('ehr-counts');
        const results = S.root._summaryRows || [['BMP','Normal'],['CBC','Normal'],['Chest X-Ray','No acute process']];
        S.P.readTable(side, 'Recent Results', ['Date','Test','Result'], results.map(([name,value]) => ['2027-10-16',name,value]));
        S.P.readTable(side, 'Nursing Observations (Latest)', ['Date/Time','Item','Value'], [['BP','118/76'],['HR','72'],['RR','16'],['Temp','36.8 °C'],['SpO2','98%'],['Pain','0 / 10']].map(([name,value]) => ['2027-10-18 08:00',name,value])).parentElement.classList.add('ehr-nursing');
        S.P.readTable(side, 'Bed Management', ['',''], [['Unit','4 East'],['Total Beds','28'],['Occupied','26'],['Available','2']]).parentElement.classList.add('ehr-bedsummary');
      },
      footer: (base, S) => () => { S.refs.nextAppointment = S.ctx.util.el('span', 'ehr-hidden', S.root); }
    }
  },
});
