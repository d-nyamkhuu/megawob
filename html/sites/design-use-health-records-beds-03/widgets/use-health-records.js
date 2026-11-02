// Design on use-health-records/chart; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-health-records',
  site: 'design-use-health-records-beds-03',
  name: 'design',
  split: 'train',
  scenarios: ['beds'],
  template: 'use-health-records/chart',
  design: {
    fontFamily: '"Segoe UI", Arial, sans-serif', fontSize: '16px', rootInset: '0', rootRadius: '0', accent: '#f2a000', panel: '#ffffff', bg: '#f7fbfe', fg: '#101d39', muted: '#526783', line: '#dce7f1',
    parts: {
      top: () => () => {},
      menu: () => () => {},
      banner: () => () => {},
      tabs: () => () => {},
      rail: () => () => {},
      heading: () => () => {},
      toolbar: () => () => {},
      workflow: () => () => {},
      transfer: (base, S) => (ctx) => {
        const { el } = ctx.util, p = S.spec.patient, r = S.refs;
        const left = el('div', 'placement-left', S.main);
        r.placementLeft = left;
        el('h2', 'placement-title', left, 'Patient for Placement');
        const tray = el('div', 'ehr-transfer placement-patient', left);
        r.patient = tray;
        tray.setAttribute('aria-label', `Drag ${p.name}`);
        el('span', 'placement-grip', tray, '⠿');
        const card = el('div', 'placement-patient-content', tray);
        const head = el('div', 'placement-patient-heading', card);
        el('strong', '', head, p.name);
        el('span', 'placement-sex', head, p.sex === 'Female' ? 'F' : p.sex === 'Male' ? 'M' : 'A');
        const row = (label, value) => { const line = el('div', 'placement-patient-row', card); el('span', '', line, label); return el('span', '', line, value); };
        const [year, month, day] = p.dob.split('-').map(Number);
        const age = 2026 - year - (month > 4 || month === 4 && day > 22 ? 1 : 0);
        row('MRN', p.mrn); row('DOB', `${p.dob}  (${age} y)`); row('Sex', p.sex);
        const flags = el('div', 'placement-flags', card);
        const iso = el('span', `placement-flag isolation-${p.isolation.toLowerCase()}`, flags);
        el('i', 'placement-isolation-icon', iso, p.isolation === 'None' ? '−' : p.isolation === 'Airborne' ? '☣' : '☣');
        el('span', '', iso, p.isolation === 'None' ? 'Standard precautions' : `${p.isolation} Isolation`).dataset.compact = p.isolation === 'None' ? 'Standard' : p.isolation;
        const acuity = el('span', `placement-flag acuity-${p.acuity}`, flags);
        el('i', `placement-acuity-icon acuity-${p.acuity}`, acuity);
        el('span', '', acuity, `${['', 'Low', 'Moderate', 'High'][p.acuity] || p.acuity} Acuity`).dataset.compact = ['', 'Low', 'Moderate', 'High'][p.acuity] || p.acuity;
        r.currentLocation = row('Current Location', ctx.model.placements.patient);
        row('Service', p.service || 'Internal Medicine');
        r.placement = el('small', 'placement-sync-text', tray);
        S.P.bindTransfer(tray);
      },
      beds: (base, S) => (ctx) => {
        const { el } = ctx.util, r = S.refs, s = S.spec, p = s.patient;
        const req = el('section', 'placement-requirements', r.placementLeft);
        el('h2', 'placement-title', req, 'Placement Requirements');
        const detail = (parent, label, value) => { const line = el('div', 'placement-detail-row', parent); el('span', 'placement-label', line, label); return el('span', 'placement-value', line, value); };
        detail(req, 'Sex cohort', p.sex === 'Any' ? 'Any' : `${p.sex} only`);
        detail(req, 'Isolation', p.isolation === 'None' ? 'Standard precautions' : `${p.isolation} isolation required`).dataset.compact = p.isolation === 'None' ? 'Standard precautions' : `${p.isolation} required`;
        detail(req, 'Minimum bed capability', `${['', 'Low', 'Moderate', 'High'][p.acuity] || p.acuity} acuity`);
        detail(req, 'Service preference', p.service || 'Internal Medicine');
        detail(req, 'Required room type', p.roomType || 'Single room (no shared)').dataset.compact = p.roomType || 'Single (no shared)';
        el('h2', 'placement-title', S.pane, 'Unit Capacity – North Inpatient (N)');
        const summary = el('div', 'placement-capacity', S.pane);
        const bedIcon = el('span', 'placement-capacity-icon', summary); S.P.icon(bedIcon, 'bed');
        r.capacityValues = [];
        for (const label of ['Total Beds', 'Occupied', 'Available', 'Out of Service']) {
          const cell = el('div', 'placement-capacity-cell', summary);
          r.capacityValues.push(el('b', '', cell)); el('span', '', cell, label);
        }
        const boardHeading = el('div', 'placement-board-heading', S.pane);
        r.boardHeading = el('h2', 'placement-title', boardHeading, 'Available Beds – North Inpatient (N)');
        const filter = el('div', 'placement-filter', boardHeading);
        el('span', '', filter, 'Show');
        const show = el('button', '', filter, 'Available beds only'); show.type = 'button';
        S.P.listen(show, 'click', () => S.P.inspect('Bed availability', [['North Inpatient (N)', 'All placement beds are shown with current availability', 'Current']]));
        const grid = el('div', 'ehr-bedgrid placement-bedgrid', S.pane);
        for (const bed of s.beds) S.P.bed(grid, bed);
        const lower = el('div', 'placement-lower', S.main);
        S.P.readTable(lower, 'Pending Transports', ['ETA', 'Patient', 'From', 'To', 'Type', 'Status'], S.worklist.slice(0, 4).map((patient, i) => [patient.time, patient.name, `ED-${String(i + 2).padStart(2, '0')}`, s.beds[(i + 3) % s.beds.length].id, 'Bed transfer', i ? 'Scheduled' : 'En route']));
        const census = S.P.readTable(lower, 'Other Units – Inpatient Census', ['Unit', 'Total Beds', 'Occupied', 'Available', 'Out of Service'], []);
        const tbody = census.querySelector('tbody');
        r.unitCensus = [];
        for (const [i, unit] of ['North (N)', 'South (S)', 'East (E)', 'West (W)'].entries()) {
          const group = S.worklist.filter((_, n) => n % 3 === i - 1);
          const total = [s.beds.length, 28, 20, 22][i], unavailable = i === 3 ? 0 : 1;
          const available = i ? Math.max(1, group.filter(person => person.state !== 'Arrived').length) : s.beds.length - s.occupants.length;
          const line = S.P.tableRow(tbody, [unit, total, total - available - (i ? unavailable : 0), available, i ? unavailable : 0]);
          if (!i) r.unitCensus = [...line.children];
        }
      },
      bed: (base, S) => (grid, bed) => {
        const { el } = S.ctx.util, r = S.refs;
        const card = el('section', `ehr-bed placement-bed${bed.occupied ? ' occupied' : ''}`, grid);
        r.beds.set(bed.id, card); r.targets.set(`bed:${bed.id}`, card);
        const header = el('div', 'placement-bed-heading', card);
        el('b', '', header, bed.id); r.bedStatus.set(bed.id, el('span', 'placement-availability', header));
        const row = (label) => { const line = el('div', 'placement-detail-row', card); el('span', 'placement-label', line, label); return el('span', 'placement-value', line); };
        el('span', '', row('Sex cohort'), bed.sex === 'Any' ? 'Any cohort' : `${bed.sex} only`);
        const iso = row('Isolation');
        el('i', `placement-isolation-icon isolation-${bed.isolation.toLowerCase()}`, iso, bed.isolation === 'None' ? '−' : '☣');
        el('span', '', iso, bed.isolation === 'None' ? 'Standard only' : `${bed.isolation} only`);
        const acuity = row('Max acuity');
        el('i', `placement-acuity-icon acuity-${bed.acuity}`, acuity);
        el('span', '', acuity, ['', 'Low', 'Moderate', 'High'][bed.acuity] || bed.acuity);
        el('span', '', row('Room type'), bed.roomType || 'Single');
        const patient = row('Status'); patient.classList.add('placement-bed-patient'); patient.dataset.bedPatient = bed.id;
        return card;
      },
      tableCell: (base, S) => (parent, value) => {
        const cell = base(parent, value);
        if (value === 'Scheduled' || value === 'En route') {
          cell.textContent = '';
          S.ctx.util.el('span', `placement-transport-status${value === 'En route' ? ' en-route' : ''}`, cell, value);
        }
        return cell;
      },
      paint: (base, S) => (m) => {
        base(m);
        const r = S.refs, s = S.spec;
        if (!r.capacityValues) return;
        const occupied = s.occupants.length + (s.beds.some(bed => bed.id === m.placements.patient) ? 1 : 0);
        const values = [s.beds.length, occupied, s.beds.length - occupied, 0];
        r.capacityValues.forEach((node, i) => { node.textContent = values[i]; });
        if (r.unitCensus.length) values.forEach((value, i) => { r.unitCensus[i + 1].textContent = value; });
        r.currentLocation.textContent = m.placements.patient;
        r.boardHeading.textContent = m.notice || 'Available Beds – North Inpatient (N)';
        r.boardHeading.classList.toggle('placement-error', !!m.notice);
        r.boardHeading.title = m.notice || '';
        for (const [id, card] of r.beds) card.classList.toggle('occupied', m.placements.patient === id || s.occupants.some(p => p.bed === id));
        const inspector = document.querySelector('.ehr-inspector');
        if (inspector) {
          const p = s.patient;
          const [year, month, day] = p.dob.split('-').map(Number);
          const age = 2026 - year - (month > 4 || month === 4 && day > 22 ? 1 : 0);
          const details = [p.name, p.mrn, `${p.dob}  (${age} y)`, p.sex, p.isolation === 'None' ? 'Standard precautions' : `${p.isolation} isolation`, ['', 'Low', 'Moderate', 'High'][p.acuity] || p.acuity, m.placements.patient, p.service || 'Internal Medicine', p.allergies || 'NKDA', p.codeStatus || 'Full Code'];
          inspector.querySelectorAll('.ehr-inspector-value').forEach((node, i) => { if (node.textContent !== String(details[i])) node.textContent = details[i]; });
          const cells = inspector.querySelectorAll('.ehr-inspector-value');
          cells[4].className = `ehr-inspector-value placement-flag isolation-${p.isolation.toLowerCase()}`;
          cells[5].className = `ehr-inspector-value placement-flag acuity-${p.acuity}`;
        }
      },
    },
  },
});
