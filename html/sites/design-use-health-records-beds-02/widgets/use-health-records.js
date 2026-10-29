// Design on use-health-records/chart; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-health-records',
  site: 'design-use-health-records-beds-02',
  name: 'design',
  split: 'train',
  scenarios: ['beds'],
  template: 'use-health-records/chart',
  design: {
    rootInset: '0', rootRadius: '0', fontFamily: 'Tahoma,Arial,sans-serif', fontSize: '16px',
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
        const { el } = ctx.util, p = S.spec.patient;
        const panel = el('section', 'bp-panel bp-transfer', S.main);
        el('div', 'bp-caption', panel, 'Patient for Transfer');
        const tray = el('div', 'bp-tray', panel);
        S.refs.patient = tray;
        tray.setAttribute('aria-label', `Drag ${p.name}`);
        el('span', 'bp-grip', tray, '⠿');
        const current = el('div', 'bp-current', tray);
        S.refs.currentBed = el('b', '', current, ctx.model.placements.patient);
        el('span', '', current, 'Current Bed');
        el('span', '', current, 'Emergency Dept');
        const identity = el('div', 'bp-identity', tray);
        el('strong', '', identity, p.name);
        const year = Number(p.dob.slice(0, 4));
        const age = 2014 - year - (p.dob.slice(5) > '04-22' ? 1 : 0);
        el('div', '', identity, `DOB: ${p.dob}   (Age ${age})`);
        el('div', '', identity, `Sex: ${p.sex}`);
        const info = el('div', 'bp-clinical', tray);
        el('span', '', info, 'Isolation Requirement');
        el('b', '', info, p.isolation === 'None' ? 'Standard Precautions' : `${p.isolation} Precautions`);
        el('span', '', info, 'Acuity');
        el('b', '', info, `${['', 'Basic Care', 'Monitoring', 'Acute Care', 'High Dependency', 'Intensive Care'][p.acuity] || 'Care Level'} (${p.acuity})`);
        S.P.bindTransfer(tray);
      },
      beds: (base, S) => (ctx) => {
        const { el } = ctx.util, p = S.spec.patient;
        const capacity = el('section', 'bp-panel bp-capacity', S.pane);
        el('div', 'bp-caption', capacity, 'Capacity Summary (Available Now)');
        const counts = el('div', 'bp-counts', capacity);
        for (const [name, count] of [['Medical (N)', 4], ['Surgical (S)', 3], ['Telemetry (T)', 2], ['ICU (I)', 1], ['Maternity (M)', 2], ['Isolation (Z)', 2]]) {
          const item = el('div', '', counts); el('span', '', item, name); el('b', '', item, String(count));
        }
        const requirements = el('section', 'bp-panel bp-requirements', S.pane);
        el('div', 'bp-caption', requirements, 'Placement Requirements');
        const list = el('div', 'bp-requirement-list', requirements);
        const isolation = p.isolation === 'None' ? 'Standard Precautions' : `${p.isolation} Precautions`;
        for (const [kind, symbol, title, lines] of [
          ['sex', p.sex === 'Female' ? '♀' : '♂', 'Sex Cohort', [`${p.sex} only`]],
          ['isolation', '☣', 'Isolation', [isolation, p.isolation === 'None' ? 'room' : 'room required']],
          ['acuity', '▂▅▇', 'Minimum Acuity', [`${['', 'Basic Care', 'Monitoring', 'Acute Care', 'High Dependency', 'Intensive Care'][p.acuity] || 'Care Level'} (${p.acuity})`, 'or higher']]
        ]) {
          const item = el('div', `bp-requirement bp-${kind}`, list);
          const icon = el('span', 'bp-symbol', item, kind === 'acuity' ? '' : symbol);
          if (kind === 'acuity') icon.innerHTML = '<svg viewBox="0 0 42 44" aria-hidden="true"><g fill="currentColor"><rect x="4" y="28" width="8" height="13" rx="1"/><rect x="17" y="18" width="8" height="23" rx="1"/><rect x="30" y="7" width="8" height="34" rx="1"/></g></svg>';
          const text = el('div', '', item); el('b', '', text, title);
          for (const line of lines) el('span', '', text, line);
        }
        const board = el('section', 'bp-panel bp-board', S.pane);
        const heading = el('div', 'bp-caption', board);
        el('span', '', heading, 'Available Beds');
        el('small', 'bp-match', heading, `${S.spec.beds.length} beds  |  Showing 1–${S.spec.beds.length} of ${S.spec.beds.length}`);
        el('span', 'bp-view bp-view-active', heading, '⊞');
        el('span', 'bp-view', heading, '☷');
        const grid = el('div', 'bp-grid', board);
        for (const bed of S.spec.beds) S.P.bed(grid, bed);
        const tables = el('div', 'bp-tables', S.pane);
        const beds = S.spec.beds;
        S.P.readTable(tables, 'Transport Requests', ['Time', 'From', 'To', 'Patient', 'Status'], S.worklist.slice(0, 4).map((row, i) => [
          ['09:45', '10:10', '10:30', '11:00'][i], ['ED', 'ICU', 'S-205', 'ED'][i], i === 2 ? 'Radiology' : beds[i % beds.length].id, row.name, ['En route', 'Requested', 'Requested', 'Scheduled'][i]
        ]));
        let censusBed = 101;
        S.P.readTable(tables, 'Current Unit Census – Medical (N)', ['Bed', 'Patient', 'Sex', 'Isolation', 'Acuity'], S.worklist.map((row, i) => {
          while (beds.some(b => b.id === `N-${censusBed}`)) censusBed++;
          const id = `N-${censusBed}`; censusBed += 2;
          return [id, row.name, i % 2 ? 'F' : 'M', i === 2 ? 'Contact' : 'None', String([3, 2, 3, 4, 3][i % 5])];
        }));
      },
      bed: (base, S) => (grid, bed) => {
        const { el } = S.ctx.util;
        const card = el('section', `bp-bed${bed.occupied ? ' occupied' : ''}`, grid);
        S.refs.beds.set(bed.id, card); S.refs.targets.set(`bed:${bed.id}`, card);
        const head = el('div', 'bp-bed-head', card);
        el('b', '', head, bed.id);
        const unit = { N: 'Medical (N)', S: 'Surgical (S)', T: 'Telemetry (T)', I: 'ICU (I)', M: 'Maternity (M)', Z: 'Isolation (Z)' };
        el('span', '', head, unit[bed.id[0]] || 'Medical (N)');
        const body = el('div', 'bp-bed-body', card), details = el('div', 'bp-bed-details', body);
        el('div', '', details, `${bed.sex} cohort`);
        el('div', '', details, `${bed.isolation === 'None' ? 'Standard' : bed.isolation} precautions`);
        el('div', '', details, `Max acuity: ${bed.acuity}`);
        const status = el('div', 'bp-bed-state', body), ready = el('div', 'bp-ready', status);
        const icon = el('span', 'bp-bed-icon', ready);
        icon.innerHTML = '<svg viewBox="0 0 28 24" aria-hidden="true"><path d="M2 5v16M26 8v13M2 16h24M5 10h17v5H5z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="7" cy="7" r="2" fill="currentColor"/></svg>';
        const patient = el('span', '', ready); patient.dataset.bedPatient = bed.id;
        S.refs.bedStatus.set(bed.id, el('div', 'bp-availability', status));
        return card;
      },
      paint: (base, S) => (model) => {
        base(model);
        if (S.refs.currentBed) S.refs.currentBed.textContent = model.placements.patient;
        for (const [id, card] of S.refs.beds) {
          const occupied = model.placements.patient === id || S.spec.occupants.some(o => o.bed === id);
          card.classList.toggle('occupied', occupied);
          S.refs.bedStatus.get(id).textContent = occupied ? 'Occupied' : 'Available now';
        }
      }
    }
  },
});
