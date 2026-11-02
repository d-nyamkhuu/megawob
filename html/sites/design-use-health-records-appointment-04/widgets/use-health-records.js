// Appointment design on use-health-records/chart; defaults reproduce the reference scaffold.
env.widget({
  task: 'use-health-records',
  site: 'design-use-health-records-appointment-04',
  name: 'design',
  split: 'train',
  scenarios: ['appointment'],
  template: 'use-health-records/chart',
  design: {
    accent: '#d51d22', panel: '#faf9f6', bg: '#f5f3ed', fg: '#171717', line: '#d8d5cf', muted: '#55524d', rootInset: '0px', fontSize: '14px', contextMinWidth: 0,
    parts: {
      top: (base, S) => (ctx) => {
        ctx.util.el('div', 'rh-window-title', S.root, 'Schedule Appointment');
      },
      menu: () => () => {},
      tabs: () => () => {},
      heading: () => () => {},
      toolbar: () => () => {},
      workflow: () => () => {},
      rail: () => () => {},
      sidebar: (base, S) => (ctx) => {
        // Preserve the clinical context draws from the original, wider stage.
        if (Number(ctx.stage.dataset.originalWidth) >= 1180) base(ctx);
      },
      banner: (base, S) => (ctx) => {
        if (S.unidentified) { base(ctx); return; }
        const u = ctx.util, p = S.spec.patient;
        const banner = u.el('div', 'ehr-banner rh-patient', S.root);
        const avatar = u.el('div', 'rh-avatar', banner);
        avatar.innerHTML = '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="32" fill="#e7e7e7"/><circle cx="32" cy="24" r="13" fill="#888"/><path d="M8 56c4-20 44-20 48 0a32 32 0 0 1-48 0" fill="#888"/></svg>';
        const identity = u.el('div', 'rh-identity', banner);
        u.el('strong', 'ehr-name', identity, p.name);
        const demo = u.el('div', 'rh-demographics', identity);
        for (const text of [`Born: ${p.dob}`, `MRN: ${p.mrn}`, p.sex]) u.el('span', '', demo, text);
        const contact = u.el('div', 'rh-contact', banner);
        u.el('div', '', contact, 'Phone: 555-0134');
        u.el('div', '', contact, `Email: ${p.name.toLowerCase().replace(/\s+/g, '.')}@example.com`);
        u.el('div', '', contact, 'Address: 742 Pine St, Bristol, TR 36000');
        const medical = u.el('div', 'rh-medical', banner);
        for (const [label, value] of [['Allergies:', 'No known allergies'], ['Primary Care:', 'Dr. Anita Kapoor'], ['Insurance:', 'Riverside Health Plan']]) {
          u.el('span', '', medical, label); u.el('span', '', medical, value);
        }
      },
      appointment: (base, S) => (ctx) => {
        const u = ctx.util, s = S.spec, P = S.P;
        const workspace = u.el('div', 'ehr-appt', S.pane);
        const band = u.el('div', 'rh-controls-band', workspace);
        P.miniCalendar(band); P.visitDetails(band);
        P.calendar(workspace);
        const tables = u.el('div', 'rh-activity', S.pane);
        const date = s.date.replace(/^(\d{2}) Oct (\d{4})$/, '$2-10-$1');
        const upcoming = s.busy.slice(0, 5).map((b, i) => [date, `${String(Math.floor(b.start / 60)).padStart(2, '0')}:${String(b.start % 60).padStart(2, '0')}`, b.name, i % 2 ? 'Annual review' : 'Follow-up', b.provider]);
        P.readTable(tables, 'Upcoming Appointments (Next 7 Days)', ['Date', 'Time', 'Patient', 'Visit Type', 'Provider'], upcoming);
        P.readTable(tables, 'Recent Appointments', ['Date', 'Time', 'Patient', 'Visit Type', 'Provider'], S.worklist.slice(0, 5).map((p, i) => ['2027-10-' + (15 - Math.floor(i / 2)), p.time, p.name, ['Follow-up', 'Annual review', 'New patient'][i % 3], s.providers[i % s.providers.length]]));
      },
      miniCalendar: (base, S) => (parent) => {
        const u = S.ctx.util, box = u.el('div', 'rh-month', parent);
        const head = u.el('div', 'rh-month-title', box);
        u.el('span', 'rh-month-arrow', head, '‹'); u.el('b', '', head, 'October 2027'); u.el('span', 'rh-month-arrow', head, '›');
        const grid = u.el('div', 'ehr-calmini', box);
        for (const d of ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']) u.el('span', 'rh-weekday', grid, d);
        for (const d of [26, 27, 28, 29, 30]) u.el('span', 'rh-other-month', grid, d);
        for (let d = 1; d <= 30; d++) u.el('span', d === 18 ? 'selected' : '', grid, String(d));
      },
      visitDetails: (base, S) => (parent) => {
        const u = S.ctx.util, grid = u.el('div', 'rh-visit-fields', parent);
        for (const id of ['provider', 'type', 'duration']) S.P.field(id, grid);
        const summary = u.el('div', 'rh-summary', parent);
        u.el('b', '', summary, 'Selected Time');
        S.refs.appointmentSummary = u.el('div', 'rh-summary-values', summary);
        S.refs.targets.set('slot', S.refs.appointmentSummary);
      },
      choice: (base, S) => (desc, value, parent) => {
        const button = base(desc, value, parent);
        if (desc.id === 'duration') parent.lastElementChild.textContent = `${value} minutes`;
        return button;
      },
      calendar: (base, S) => (workspace) => {
        base(workspace);
        const schedules = workspace.lastElementChild;
        schedules.classList.add('rh-schedules');
        const legend = schedules.querySelector('.ehr-callegend');
        legend.replaceChildren();
        for (const [label, cls] of [['Available', 'available'], ['Booked visit', 'booked'], ['Lunch / Break', 'break'], ['Unavailable', 'unavailable']]) {
          const item = S.ctx.util.el('span', '', legend);
          S.ctx.util.el('i', cls, item); S.ctx.util.el('span', '', item, label);
        }
        schedules.appendChild(legend);
      },
      slot: (base, S) => (cal, provider, t) => {
        base(cal, provider, t);
        const busy = S.spec.busy.find(b => b.provider === provider && t >= b.start && t < b.start + b.duration);
        if (busy) cal.lastElementChild.textContent = t === busy.start ? `Patient: ${busy.name}` : 'Follow-up';
      },
      paint: (base, S) => (m) => {
        base(m);
        if (!S.refs.appointmentSummary) return;
        const fields = m.fields, summary = S.refs.appointmentSummary, u = S.ctx.util;
        summary.replaceChildren();
        const time = fields.slot ? `${String(Math.floor(Number(fields.slot) / 60)).padStart(2, '0')}:${String(Number(fields.slot) % 60).padStart(2, '0')}` : '–';
        for (const [label, value] of [['Date:', fields.slot ? S.spec.date : '–'], ['Time:', time], ['Provider:', fields.provider || '–'], ['Visit type:', fields.type || '–'], ['Duration:', fields.duration ? `${fields.duration} minutes` : '–']]) {
          u.el('span', '', summary, label); u.el('span', '', summary, value);
        }
      },
      decorated: (base, S) => (ctx) => {
        base(ctx);
        S.root.classList.toggle('rh-reduced', ctx.size.height < 830 && ctx.size.height > 650);
        const labels = document.querySelectorAll('.rh-provider-name');
        labels.forEach((label, i) => { label.textContent = S.spec.providers[i % S.spec.providers.length]; });
        const title = S.root.querySelector('.rh-window-title');
        const taskHeader = document.querySelector('.ref-task');
        if (taskHeader && !taskHeader.classList.contains('rh-has-instruction')) title.appendChild(taskHeader);
        const actions = S.root.querySelector('.ehr-actions');
        if (actions) title.appendChild(actions);
      },
    },
  },
});
