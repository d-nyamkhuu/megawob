// Appointment design on use-health-records/chart; defaults reproduce the reference scaffold.
env.widget({
  task: 'use-health-records',
  site: 'design-use-health-records-appointment-01',
  name: 'design',
  split: 'train',
  scenarios: ['appointment'],
  template: 'use-health-records/chart',
  design: {
    accent: '#000080', panel: '#c0c0c0', bg: '#c0c0c0', fg: '#111', line: '#808080', muted: '#333',
    parts: {
      // The classic application owns its frame; retain the shared model and controls.
      styles: () => () => '',
      top: () => () => {},
      menu: () => () => {},
      tabs: () => () => {},
      rail: () => () => {},
      heading: () => () => {},
      toolbar: () => () => {},
      workflow: () => () => {},
      frame: (base, S) => (ctx) => {
        const root = base(ctx);
        root.classList.add('cgh-chart');
        root.classList.toggle('cgh-dense', ctx.size.height < 745);
        root.classList.toggle('cgh-tiny', ctx.size.height < 480 && ctx.size.width < 1300);
        root.style.setProperty('--slot-count', S.spec.slots.length);
        root.style.setProperty('--provider-count', S.spec.providers.length);
        return root;
      },
      banner: (base, S) => () => {
        const el = S.ctx.util.el, patient = S.spec.patient;
        const box = el('fieldset', 'cgh-patient', S.root);
        el('legend', '', box, 'Patient Information');
        const fields = el('div', 'cgh-patient-fields', box);
        for (const [label, value, cls] of [
          ['Name:', patient.name, 'name'], ['Date of Birth:', patient.dob, 'dob'],
          ['Medical Record #:', patient.mrn, 'mrn'], ['Gender:', patient.sex, 'sex'],
          ['Phone:', patient.phone || '(555) 284-7193', 'phone'],
        ]) {
          const pair = el('div', `cgh-patient-pair cgh-${cls}`, fields);
          el('span', '', pair, label);
          el('div', 'cgh-value', pair, S.unidentified ? '—' : value);
        }
      },
      appointment: (base, S) => (ctx) => {
        base(ctx);
        const el = ctx.util.el, pane = S.pane;
        const activity = [...pane.querySelectorAll(':scope > .ehr-section')];
        const records = el('aside', 'cgh-records', S.root);
        records.setAttribute('aria-label', 'Related patient records');
        // Existing historical activity keeps its seeded rows in the related-record pane.
        for (const [i, section] of activity.entries()) {
          section.classList.add('cgh-related', `cgh-related-${i}`);
          records.appendChild(section);
        }
        const scrollPane = activity[0]?.querySelector('.ehr-tablewrap');
        if (scrollPane) {
          const scroll = el('div', 'cgh-scroll-chrome', activity[0]);
          const up = el('button', '', scroll, '▲');
          const track = el('div', 'cgh-scroll-track', scroll);
          el('span', 'cgh-scroll-thumb', track);
          const down = el('button', '', scroll, '▼');
          up.type = down.type = 'button';
          up.setAttribute('aria-label', 'Scroll appointments up');
          down.setAttribute('aria-label', 'Scroll appointments down');
          S.P.listen(up, 'click', () => { scrollPane.scrollTop -= 56; });
          S.P.listen(down, 'click', () => { scrollPane.scrollTop += 56; });
        }
        const meds = S.spec.meds;
        S.P.readTable(records, meds.length ? 'Medications (Active)' : 'Clinical Orders',
          meds.length ? ['Name', 'Dose', 'Frequency', 'Start Date'] : ['Order', 'Status', 'Provider', 'Date'],
          meds.length ? meds.map(med => [med.name, `${med.dose || ''} ${med.unit || ''}`.trim(), med.frequency || '—', med.startDate || '—'])
            : S.pastOrders.slice(0, 4).map(order => [order.name, order.state, order.by, order.date]));
        records.lastElementChild.classList.add('cgh-related', 'cgh-related-meds');
        S.refs.cghRenderReady = true;
        S.refs.cghFieldSnapshot = JSON.stringify(S.ctx.model.fields);
      },
      readTable: (base, S) => (parent, title, headers, rows) => {
        const originalTitle = title, originalHeaders = headers, originalRows = rows;
        const initials = provider => provider.replace(/^(Dr\.\s+)(\S+)\s+/, (_, prefix, first) => `${prefix}${first[0]}. `);
        const isoDate = date => date.replace(/^(\d{2}) Oct (\d{4})$/, '$2-10-$1');
        const typeOptions = S.spec.fields.find(field => field.id === 'type')?.options
          || ['General Appointment', 'Follow Up', 'Procedure Review', 'New Patient', 'Pre-Operative'];
        if (title === 'Appointment activity | Other patients') {
          title = 'Patient Appointments';
          headers = ['Date', 'Time', 'Type', 'Provider'];
          rows = S.spec.busy.slice(0, 9).map(visit => [isoDate(S.spec.date), env.taskDef.helpers.time(visit.start), 'Follow-up', initials(visit.provider)]);
        } else if (title === 'Scheduling work queue') {
          title = 'Recent Visits';
          headers = ['Date', 'Type', 'Provider'];
          rows = S.pastOrders.slice(0, 5).map((order, i) => [isoDate(order.date), typeOptions[i % typeOptions.length], initials(S.spec.providers[i % S.spec.providers.length])]);
        }
        const content = base(parent, title, headers, rows);
        if (title !== originalTitle) {
          // Preserve the original seeded activity and requests in the same scrolling record index.
          const el = S.ctx.util.el, wrap = content.querySelector('.ehr-tablewrap');
          const table = el('table', 'ehr-data cgh-record-history', wrap);
          el('caption', '', table, originalTitle);
          const head = el('tr', '', el('thead', '', table));
          for (const label of originalHeaders) el('th', '', head, label);
          const body = el('tbody', '', table);
          for (const row of originalRows) S.P.tableRow(body, row);
        }
        return content;
      },
      miniCalendar: (base, S) => (visit) => {
        const el = S.ctx.util.el;
        const box = el('section', 'cgh-month', visit);
        const title = el('div', 'cgh-month-title', box);
        el('span', 'cgh-month-arrow', title, '◀');
        el('b', '', title, 'October 2027');
        el('span', 'cgh-month-arrow', title, '▶');
        const grid = el('div', 'cgh-month-grid', box);
        for (const day of ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']) el('span', 'cgh-weekday', grid, day);
        for (let i = 0; i < 42; i++) {
          const day = i - 4, value = day < 1 ? day + 30 : day > 31 ? day - 31 : day;
          const cell = el('span', `cgh-day${day < 1 || day > 31 ? ' cgh-other-month' : ''}${day === 18 ? ' cgh-today' : ''}`, grid, String(value));
          if (day === 18) cell.setAttribute('aria-current', 'date');
        }
      },
      visitDetails: (base, S) => (visit) => {
        const el = S.ctx.util.el;
        const details = el('section', 'cgh-details', visit);
        el('h3', 'cgh-panel-title', details, 'Visit Details');
        for (const id of ['type', 'duration', 'provider']) {
          const field = S.P.field(id, details, true);
          field.classList.add(`cgh-field-${id}`);
        }
        const summary = el('fieldset', 'cgh-selection', visit);
        S.refs.appointmentSummary = summary;
      },
      choice: (base, S) => (desc, value, parent) => {
        const button = base(desc, value, parent);
        S.refs.choices.set(`${desc.id}:${value}`, button);
        S.refs.targets.set(`choice:${desc.id}:${value}`, button);
        if (desc.id === 'duration') button.textContent = `${value} minutes`;
        return button;
      },
      calendar: (base, S) => (workspace) => {
        const el = S.ctx.util.el;
        const schedule = el('section', 'cgh-schedule', workspace);
        el('h3', 'cgh-panel-title cgh-schedule-title', schedule, 'Provider Schedule - Monday, October 18, 2027');
        const legend = el('div', 'cgh-legend', schedule);
        for (const [label, kind] of [['Available', 'free'], ['Booked', 'booked'], ['Procedure', 'procedure'], ['Meeting', 'meeting'], ['Unavailable', 'unavailable']]) {
          const item = el('span', '', legend);
          el('i', `cgh-key cgh-${kind}`, item);
          el('span', '', item, label);
        }
        const cal = el('div', 'cgh-timeslots', schedule);
        cal.style.setProperty('--row-sizes', S.spec.slots.map(t =>
          S.spec.busy.some(visit => t >= visit.start && t < visit.start + visit.duration)
            ? 'minmax(0,1.25fr)' : 'minmax(0,.75fr)').join(' '));
        el('div', 'cgh-provider-head cgh-time-head', cal, 'Time');
        for (const [i, provider] of S.spec.providers.entries()) {
          const heading = el('div', 'cgh-provider-head', cal);
          el('b', '', heading, provider);
          el('span', '', heading, ['Family Medicine', 'Internal Medicine', 'Surgery'][i % 3]);
        }
        for (const t of S.spec.slots) {
          el('div', 'cgh-time', cal, env.taskDef.helpers.time(t));
          for (const provider of S.spec.providers) S.P.slot(cal, provider, t);
        }
      },
      slot: (base, S) => (cal, provider, t) => {
        base(cal, provider, t);
        const button = cal.lastElementChild;
        S.refs.slots.set(`${provider}:${t}`, button);
        S.refs.targets.set(`slot:${provider}:${t}`, button);
        const busy = S.spec.busy.find(b => b.provider === provider && t >= b.start && t < b.start + b.duration);
        if (busy) {
          const i = S.spec.busy.indexOf(busy);
          const kind = i % 8 === 5 ? 'procedure' : i % 8 === 7 ? 'meeting' : 'booked';
          button.classList.add(`cgh-${kind}`);
          button.firstElementChild.textContent = `Patient: ${busy.name}`;
          button.lastElementChild.textContent = `${kind === 'procedure' ? 'Procedure review' : kind === 'meeting' ? 'Meeting' : 'Follow-up'} (${busy.duration} min)`;
        }
      },
      sidebar: (base, S) => (ctx) => {
        // Keep the clinical-context RNG calls, although this design shows record tables instead.
        base(ctx);
        S.body.lastElementChild.hidden = true;
      },
      paint: (base, S) => (m) => {
        base(m);
        if (!S.refs.appointmentSummary) return;
        const el = S.ctx.util.el, summary = S.refs.appointmentSummary;
        summary.replaceChildren();
        el('legend', '', summary, 'Selected Appointment');
        const grid = el('div', 'cgh-summary-grid', summary);
        const selected = m.fields.slot !== '';
        for (const [label, value] of [
          ['Date:', selected ? S.spec.date : ''], ['Time:', selected ? env.taskDef.helpers.time(Number(m.fields.slot)) : ''],
          ['Provider:', m.fields.provider || ''], ['Visit Type:', m.fields.type || ''], ['Duration:', m.fields.duration || ''],
        ]) {
          const pair = el('div', 'cgh-summary-pair', grid);
          el('span', '', pair, label);
          el('div', 'cgh-value', pair, value);
        }
        for (const button of S.refs.slots.values()) if (!button.classList.contains('selected')) button.textContent = '';
        const fieldSnapshot = JSON.stringify(m.fields);
        if (S.refs.cghRenderReady && fieldSnapshot !== S.refs.cghFieldSnapshot) S.ctx.reanchor();
        S.refs.cghFieldSnapshot = fieldSnapshot;
      },
    },
  },
});
