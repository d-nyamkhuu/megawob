// Design on use-health-records/chart; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-health-records',
  site: 'design-use-health-records-beds-01',
  name: 'design',
  split: 'train',
  scenarios: ['beds'],
  template: 'use-health-records/chart',
  design: {
    fontFamily: '"Trebuchet MS",Arial,sans-serif', fontSize: '14px', rootInset: '0px',
    parts: {
      heading: (base, S) => () => {
        S.ctx.util.el('div', 'riverside-title', S.main, 'Bed Management');
      },
      transfer: (base, S) => (ctx) => {
        base(ctx);
        const u = ctx.util, p = S.spec.patient, tray = S.refs.patient;
        const placement = S.refs.placement;
        tray.replaceChildren();
        tray.classList.add('riverside-transfer');
        u.el('div', 'riverside-grip', tray, '⠿\n⠿\n⠿');
        const info = u.el('div', 'riverside-patient-info', tray);
        const identity = u.el('div', 'riverside-identity', info);
        u.el('strong', '', identity, p.name);
        u.el('span', '', identity, `MRN: ${p.mrn}`);
        const demo = u.el('div', 'riverside-demographics', info);
        u.el('span', '', demo, `DOB:  ${p.dob}`);
        u.el('span', '', demo, `Sex:  ${p.sex}`);
        u.el('div', 'riverside-location', info);
        const flags = u.el('div', 'riverside-flags', info);
        const isolation = u.el('div', 'riverside-isolation', flags);
        u.el('div', '', isolation, 'Isolation requirement');
        const precaution = u.el('span', 'riverside-precaution', isolation);
        const glove = u.svg('svg', {viewBox:'0 0 32 32', class:'riverside-glove', 'aria-hidden':'true'}, precaution);
        u.svg('path', {d:'M11 29 5 20 3 14Q3 11 5 12L9 17 6 6Q6 3 8 5L12 14 11 3Q12 0 14 3L16 13 18 2Q20 1 20 4L20 15 24 6Q27 4 26 8L23 21 18 29Z', fill:'#6da5c5', stroke:'#558bab', 'stroke-width':'0.7'}, glove);
        u.el('span', '', precaution, `${p.isolation === 'None' ? 'Standard' : p.isolation} Precautions`);
        const acuity = u.el('div', 'riverside-acuity', flags);
        u.el('div', '', acuity, 'Acuity');
        const level = u.el('span', 'riverside-level', acuity);
        const bars = u.el('i', 'riverside-bars', level);
        for (let i = 0; i < 3; i++) u.el('i', '', bars);
        u.el('span', '', level, ['', 'Low', 'Moderate', 'High'][p.acuity] || p.acuity);
        placement.hidden = true;
        tray.appendChild(placement);
      },
      beds: (base, S) => (ctx) => {
        const u = ctx.util, s = S.spec;
        const panel = (parent, title, cls) => {
          const box = u.el('section', `riverside-panel ${cls || ''}`, parent);
          u.el('div', 'riverside-panel-title', box, title);
          return u.el('div', 'riverside-panel-body', box);
        };
        const rows = (parent, values) => {
          for (const [label, value] of values) {
            const row = u.el('div', 'riverside-detail', parent);
            u.el('span', '', row, label);u.el('span', '', row, value);
          }
        };
        const table = (parent, headers, data, cls) => {
          const t = u.el('table', `riverside-table ${cls || ''}`, parent);
          const h = u.el('tr', '', u.el('thead', '', t));
          for (const text of headers) u.el('th', '', h, text);
          const body = u.el('tbody', '', t);
          for (const cells of data) {
            const tr = u.el('tr', '', body);
            for (const text of cells) u.el('td', '', tr, String(text));
          }
          return t;
        };
        const top = u.el('div', 'riverside-upper', S.pane);
        const left = u.el('div', 'riverside-left', top);
        panel(left, 'Patient for Transfer', 'riverside-transfer-panel').appendChild(S.refs.patient);
        const req = panel(left, 'Placement Requirements', 'riverside-requirements');
        rows(req, [
          ['Sex cohort:', `${s.patient.sex} or Any`],
          ['Isolation:', s.patient.isolation === 'None' ? 'Standard precautions' : `${s.patient.isolation} Precautions required`],
          ['Acuity:', `Must support ${['', 'Low', 'Moderate', 'High'][s.patient.acuity] || s.patient.acuity} or higher`],
          ['Service:', 'Medical or Surgical'], ['Room type:', 'Private'],
        ]);
        const right = u.el('div', 'riverside-right', top);
        const capacity = panel(right, 'Unit Capacity – North Tower (N)', 'riverside-capacity');
        const view = u.el('div', 'riverside-view', capacity.parentElement.firstChild);
        u.el('span', '', view, 'View:');u.el('span', 'riverside-view-field', view, 'North Tower (N)　⌄');
        u.el('div', 'riverside-updated', capacity, 'Last updated: Apr 24, 2005 10:18');
        const capTable = table(capacity, ['Total Beds', 'Occupied', 'Available', 'Female Available', 'Male Available', 'Isolation Rooms (avail)'], [['', '', '', '', '', '']], 'riverside-capacity-table');
        S.refs.riversideCapacity = [...capTable.querySelectorAll('td')];
        const board = panel(right, 'Available Beds – North Tower (N)', 'riverside-bed-panel');
        const grid = u.el('div', 'riverside-bedgrid', board);
        for (const bed of s.beds) S.P.bed(grid, bed);
        const bottom = u.el('div', 'riverside-bottom', S.pane);
        const transport = panel(bottom, 'Transport Requests', 'riverside-transport');
        table(transport, ['Time', 'Patient', 'From', 'To', 'Type', 'Status'], S.worklist.slice(0, 4).map((p, i) => [
          `${9 + Math.floor(i / 2)}:${i % 2 ? '45' : '20'}`, p.name, `W-${201 + i}`, s.beds[i % s.beds.length].id, 'Bed Transfer', i % 2 ? 'In Progress' : 'Requested',
        ]));
        const census = panel(bottom, 'Other Units – Bed Availability', 'riverside-units');
        const unitTable = table(census, ['Unit', 'Total', 'Occupied', 'Available', 'Isolation (avail)'], [
          ['North Tower (N)', '', '', '', ''], ['South Tower (S)', 24, 20, 4, '3 (1)'],
          ['East Wing (E)', 18, 15, 3, '2 (1)'], ['West Wing (W)', 18, 16, 2, '2 (0)'],
        ]);
        S.refs.riversideUnit = [...unitTable.querySelector('tbody tr').children];
      },
      bed: (base, S) => (grid, bed) => {
        const u = S.ctx.util, refs = S.refs;
        const card = u.el('section', `riverside-bed${bed.occupied ? ' occupied' : ''}`, grid);
        refs.beds.set(bed.id, card);refs.targets.set(`bed:${bed.id}`, card);
        const head = u.el('div', 'riverside-bed-head', card);
        u.el('b', '', head, bed.id);
        const state = u.el('span', 'riverside-bed-state', head);
        refs.bedStatus.set(bed.id, u.el('span', 'riverside-live-status', state));
        const patient = u.el('span', 'riverside-bed-patient', state);patient.dataset.bedPatient = bed.id;
        const body = u.el('div', 'riverside-bed-body', card);
        for (const [label, value] of [
          ['Sex cohort:', bed.sex === 'Any' ? 'Any' : `${bed.sex} only`],
          ['Precautions:', bed.isolation],
          ['Max acuity:', ['', 'Low', 'Moderate', 'High'][bed.acuity] || bed.acuity],
          ['Room type:', bed.roomType || 'Private'],
        ]) {
          const row = u.el('div', 'riverside-detail', body);
          u.el('span', '', row, label);u.el('span', '', row, value);
        }
        return card;
      },
      paint: (base, S) => (m) => {
        base(m);
        const s = S.spec;
        const location = S.refs.patient?.querySelector('.riverside-location');
        if (location) {
          location.replaceChildren();
          S.ctx.util.el('span', '', location, `Current location:  ${m.placements.patient}`);
          if (!s.beds.some(b => b.id === m.placements.patient)) S.ctx.util.el('span', 'riverside-department', location, ' (Emergency Department)');
        }
        if (!S.refs.riversideCapacity) return;
        const occupied = s.occupants.length + (s.beds.some(b => b.id === m.placements.patient) ? 1 : 0);
        const ready = s.beds.filter(b => !b.occupied && b.id !== m.placements.patient);
        const isolation = s.beds.filter(b => b.isolation !== 'None');
        const isoReady = ready.filter(b => b.isolation !== 'None').length;
        const values = [s.beds.length, occupied, s.beds.length - occupied, ready.filter(b => b.sex === 'Female' || b.sex === 'Any').length, ready.filter(b => b.sex === 'Male' || b.sex === 'Any').length, `${isolation.length} (${isoReady})`];
        S.refs.riversideCapacity.forEach((el, i) => {el.textContent = values[i];});
        [s.beds.length, occupied, s.beds.length - occupied, `${isolation.length} (${isoReady})`].forEach((value, i) => {S.refs.riversideUnit[i + 1].textContent = value;});
        for (const [id, card] of S.refs.beds) card.classList.toggle('occupied', m.placements.patient === id || s.occupants.some(o => o.bed === id));
      },
      rendered: (base, S) => (ctx) => {
        base(ctx);
        const row = document.querySelector('.ehr-patient-row.selected');
        if (row) {row.children[0].textContent = S.spec.patient.name;row.children[1].textContent = S.spec.patient.mrn;}
      },
    },
  },
});
