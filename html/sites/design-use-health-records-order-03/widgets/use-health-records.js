// Design on use-health-records/chart; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-health-records',
  site: 'design-use-health-records-order-03',
  name: 'design',
  split: 'train',
  scenarios: ['order'],
  template: 'use-health-records/chart',
  design: {
    accent: '#1676e6', line: '#bfd2e7', fontSize: '15px', rootInset: '0', railWidth: '194px',
    parts: {
      top: () => () => {},
      menu: () => () => {},
      banner: (base, S) => () => {
        const p = S.spec.patient;
        const identity = document.querySelector('.ref-patient-identity');
        if (identity) {
          identity.children[0].textContent = p.name;
          identity.children[1].textContent = `DOB: ${p.dob}`;
          identity.children[2].textContent = `Age: ${2027 - Number(p.dob.slice(0, 4))}`;
          identity.children[3].textContent = `Sex: ${p.sex}`;
          identity.children[4].textContent = `MRN: ${p.mrn}`;
          for (const node of Array.from(identity.children).slice(1)) {
            const text = node.textContent, split = text.indexOf(':') + 1;
            node.replaceChildren();
            S.ctx.util.el('b', '', node, text.slice(0, split));
            node.appendChild(document.createTextNode(text.slice(split)));
          }
        }
        const encounter = document.querySelector('.ref-encounter-info');
        if (encounter) {
          encounter.children[0].textContent = `Encounter: ${S.spec.code}`;
          encounter.children[2].textContent = `Visit Date: ${S.spec.date || '18 Oct 2027'}`;
          encounter.children[3].textContent = `PCP: ${S.spec.providers[0]}`;
          for (const index of [0, 2]) {
            const node = encounter.children[index], text = node.textContent, split = text.indexOf(':') + 1;
            node.replaceChildren();
            S.ctx.util.el('b', '', node, text.slice(0, split));
            node.appendChild(document.createTextNode(text.slice(split)));
          }
        }
      },
      tabs: () => () => {},
      heading: () => () => {},
      toolbar: () => () => {},
      workflow: () => () => {},
      rail: (base, S) => () => {
        const u = S.ctx.util, rail = u.el('aside', 'aqua-chart-rail', S.body);
        for (const [text, icon] of [['Chart Summary','chart'],['Demographics','user'],['Encounters','calendar'],['Orders','lab'],['Results','chart'],['Medications','med'],['Allergies','warn'],['Problem List','heart'],['Immunizations','check'],['Flowsheets','chart'],['Documents','folder']]) {
          const row = u.el('div', `aqua-rail-link${text === 'Orders' ? ' selected' : ''}`, rail);
          S.P.icon(row, icon); u.el('span', '', row, text);
        }
      },
      order: (base, S) => () => {
        const u = S.ctx.util;
        const layout = u.el('div', 'ehr-orderlayout aqua-orderlayout', S.pane);
        const composer = u.el('div', 'aqua-composer', layout);
        const tabs = u.el('div', 'aqua-order-tabs', composer);
        for (const label of ['New Order', 'Medication Reconciliation', 'Sign & Hold', 'Order Sets']) u.el('span', label === 'New Order' ? 'selected' : '', tabs, label);
        S.P.orderComposer(composer);
        const queue = u.el('div', 'aqua-history', layout);
        S.P.orderQueue(queue);
        S.P.readTable(queue, 'Results & Acknowledgements', ['Date', 'Result / Acknowledgement', 'By'], S.pastOrders.map(o => [o.date, `${o.name} – results available`, o.by]));
        const inspector = u.el('aside', 'aqua-inspector', S.body);
        u.el('div', 'aqua-inspector-title', inspector, 'Patient Details');
        const section = (title, rows) => {
          const box = u.el('section', 'aqua-detail-section', inspector);
          u.el('h4', '', box, `▾  ${title}`);
          for (const [label, value] of rows) {
            const row = u.el('div', 'aqua-detail-row', box);
            if (label) u.el('span', '', row, label);
            u.el('span', '', row, value);
          }
          return box;
        };
        const p = S.spec.patient;
        section('Identification', [['Name:',p.name],['DOB:',p.dob],['Age:',String(2027 - Number(p.dob.slice(0, 4)))],['Sex:',p.sex],['MRN:',p.mrn]]);
        const taskPanel = document.querySelector('.ref-panel');
        if (taskPanel) inspector.appendChild(taskPanel);
        section('Contact', [['Phone:','(206) 555-0187'],['Address:','742 Pine St\nSeattle, WA 98101']]);
        section('Allergies', [['','No known allergies']]);
        section('Active Problems', [['','Hypertension'],['','Hyperlipidemia']]);
        const meds = section('Current Medications', []);
        const list = u.el('div', 'aqua-med-list', meds);
        const currentMeds = S.spec.meds.length ? S.spec.meds : [
          {name:'Lisinopril 10 mg tablet', frequency:'Once daily'},
          {name:'Atorvastatin 20 mg tablet', frequency:'Once daily'},
          {name:'Aspirin 81 mg tablet', frequency:'Once daily'},
        ];
        for (const med of currentMeds) u.el('div', '', list, `${med.name}\n${med.dose || ''} ${med.unit || ''} ${med.frequency || ''}`.trim());
      },
      orderComposer: (base, S) => composer => {
        const u = S.ctx.util, s = S.spec;
        const body = S.P.section(`${s.orderKind} Order`, composer);
        body.parentElement.classList.add('aqua-entry-section');
        const grid = u.el('div', 'ehr-formgrid aqua-order-fields', body);
        for (const desc of s.fields) {
          const field = S.P.field(desc.id, grid, desc.id === 'item');
          field.classList.add(`aqua-field-${desc.id}`);
          if (desc.id === 'item') field.querySelector('label').textContent = 'Item:';
          const input = field.querySelector('input');
          if (input) input.placeholder = '';
        }
        const routing = S.P.section('Order Routing', composer);
        routing.parentElement.classList.add('aqua-routing-section');
        for (const [label, value] of [['Ordering Clinician:',s.providers[0]],['Destination:',s.orderKind === 'Medication' ? 'Outpatient Pharmacy' : 'Central laboratory'],['Encounter:',`${s.code}  (Outpatient, ${s.date || '18 Oct 2027'})`]]) {
          const row = u.el('div', 'aqua-routing-row', routing);
          u.el('span', '', row, label); u.el('div', 'aqua-routing-value', row, value);
        }
        const preview = S.P.section('Draft Order Preview', composer);
        preview.parentElement.classList.add('aqua-preview-section');
        S.refs.preview = u.el('div', 'ehr-orderpreview', preview);
      },
      orderQueue: (base, S) => queue => S.P.readTable(queue, 'Previous Orders (Last 9)', ['Date','Order','Status'], S.pastOrders.map(o => [o.date,o.name,o.state])),
      field: (base, S) => (id, parent, wide = false) => {
        const desc = S.spec.fields.find(d => d.id === id);
        if (id === 'item' || !desc.options) return base(id, parent, wide);
        const u = S.ctx.util;
        const wrap = u.el('div', 'ehr-field aqua-select-field', parent);
        u.el('label', '', wrap, id === 'unit' ? 'Unit:' : `${desc.label}:`);
        S.refs.targets.set(id, wrap);
        const well = u.el('div', 'aqua-select', wrap);
        const trigger = u.el('button', 'aqua-select-trigger', well);
        trigger.type = 'button';
        trigger.setAttribute('aria-label', desc.label);
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');
        const menu = u.el('div', 'aqua-select-menu', well);
        menu.setAttribute('role', 'listbox');
        menu.setAttribute('aria-label', desc.label);
        menu.hidden = true;
        const close = () => { menu.hidden = true; trigger.setAttribute('aria-expanded', 'false'); };
        const open = () => {
          for (const select of S.refs.aquaSelects.values()) select.close();
          menu.hidden = false; trigger.setAttribute('aria-expanded', 'true');
        };
        if (!S.refs.aquaSelects) S.refs.aquaSelects = new Map();
        S.refs.aquaSelects.set(id, {trigger, menu, close});
        S.P.listen(trigger, 'click', () => menu.hidden ? open() : close());
        S.P.listen(trigger, 'keydown', e => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open(); menu.firstElementChild.focus(); }
          if (e.key === 'Escape') close();
        });
        for (const value of desc.options) {
          const option = S.P.choice(desc, value, menu);
          option.setAttribute('role', 'option');
          S.P.listen(option, 'click', close);
          S.P.listen(option, 'keydown', e => {
            if (e.key === 'Escape') { close(); trigger.focus(); }
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
              e.preventDefault();
              const next = e.key === 'ArrowDown' ? option.nextElementSibling || menu.firstElementChild : option.previousElementSibling || menu.lastElementChild;
              next.focus();
            }
          });
        }
        S.P.listen(S.root, 'pointerdown', e => { if (!well.contains(e.target)) close(); });
        return wrap;
      },
      paint: (base, S) => m => {
        base(m);
        if (S.refs.aquaSelects) for (const [id, select] of S.refs.aquaSelects) {
          select.trigger.textContent = m.fields[id] || '';
          select.trigger.setAttribute('aria-label', `${S.spec.fields.find(d => d.id === id).label}: ${m.fields[id] || 'Choose'}`);
        }
      },
      locate: (base, S) => target => {
        const select = target.choice && S.refs.aquaSelects?.get(target.choice[0]);
        if (select && select.menu.hidden) {
          const box = select.trigger.getBoundingClientRect();
          return [box.left + box.width / 2, box.top + box.height / 2];
        }
        return base(target);
      },
      preview: (base, S) => m => {
        const values = m.saved || m.fields;
        const lines = S.spec.fields.filter(d => d.id !== 'unit').map(d => `${d.id === 'item' ? 'Item' : d.label}:  ${values[d.id] || '—'}${d.id === 'dose' || d.id === 'quantity' ? `    Unit:  ${values.unit || '—'}` : ''}`);
        lines.push('', `Ordering Clinician:  ${S.spec.providers[0]}`, `Destination:  ${S.spec.orderKind === 'Medication' ? 'Outpatient Pharmacy' : 'Central laboratory'}`, `Encounter:  ${S.spec.code}  (Outpatient, ${S.spec.date || '18 Oct 2027'})`);
        S.refs.preview.textContent = lines.join('\n');
        S.refs.preview.parentElement.previousElementSibling.textContent = m.saved ? 'Saved Order Preview' : 'Draft Order Preview';
      },
      sidebar: (base, S) => ctx => {
        // Retain the base sidebar's guarded results draws, then replace its presentation.
        base(ctx);
        S.body.querySelector('.ehr-context').remove();
      },
      actions: (base, S) => ctx => {
        base(ctx);
        const strip = document.querySelector('.ref-title-strip');
        strip.insertBefore(S.main.querySelector('.ehr-actions'), strip.querySelector('.ref-header-tools'));
      },
      footer: (base, S) => ctx => { base(ctx); S.root.querySelector('.ehr-foot').hidden = true; },
    },
  },
});
