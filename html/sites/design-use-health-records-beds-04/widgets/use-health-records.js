// Design on use-health-records/chart; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-health-records',
  site: 'design-use-health-records-beds-04',
  name: 'design',
  split: 'train',
  scenarios: ['beds'],
  template: 'use-health-records/chart',
  design: {
    parts: {
      frame: (base, S) => (ctx) => {
        const root = base(ctx);
        root.classList.add('motif-chart');
        return root;
      },
      banner: (base, S) => (ctx) => {
        if (S.unidentified) return base(ctx);
        const u = ctx.util, p = S.spec.patient;
        const box = u.el('fieldset', 'motif-identity', S.root);
        u.el('legend', '', box, 'Patient for Transfer');
        const cols = u.el('div', 'motif-identity-columns', box);
        const id = u.el('div', '', cols);
        u.el('strong', 'motif-name', id, p.name);
        const details = u.el('div', 'motif-pairs', id);
        for (const [label, value] of [['MRN:', p.mrn], ['DOB:', p.dob], ['Sex:', p.sex]]) {
          u.el('span', '', details, label); u.el('span', '', details, value);
        }
        const admission = u.el('div', 'motif-pairs', cols);
        for (const [label, value] of [['From:', 'Emergency Department (ED)'], ['Current Bed:', ctx.model.placements.patient], ['Admitting Service:', 'Internal Medicine'], ['Attending:', S.spec.providers[0]]]) {
          u.el('span', '', admission, label); u.el('span', label === 'Current Bed:' ? 'motif-identity-current' : '', admission, value);
        }
        const needs = u.el('div', 'motif-pairs', cols);
        for (const [label, value] of [['Isolation:', p.isolation === 'None' ? 'Standard' : p.isolation], ['Acuity:', ['','Low','Moderate','High'][p.acuity] || p.acuity], ['Reason:', 'Medical admission']]) {
          u.el('span', '', needs, label); u.el('span', label === 'Reason:' ? '' : 'motif-alert', needs, value);
        }
      },
      transfer: (base, S) => (ctx) => {
        base(ctx);
        const u = ctx.util, p = S.spec.patient, tray = S.refs.patient;
        const box = u.el('fieldset', 'motif-transfer-box', S.main);
        u.el('legend', '', box, 'Transfer Patient (drag to a bed)');
        box.append(tray);
        const placement = S.refs.placement;
        tray.replaceChildren();
        const info = u.el('div', 'motif-transfer-person', tray);
        u.el('strong', 'motif-name', info, p.name);
        const metadata = u.el('div', 'motif-transfer-metadata', info);
        u.el('span', '', metadata, `MRN:  ${p.mrn}`);
        u.el('span', '', metadata, `DOB:  ${p.dob}`);
        u.el('div', '', info, p.sex);
        const current = u.el('div', 'motif-transfer-current', tray);
        u.el('span', '', current, 'Current Bed');
        u.el('strong', 'motif-current-bed', current, ctx.model.placements.patient);
        u.el('span', '', current, 'Emergency Department');
        placement.hidden = true; current.append(placement);
        for (const [label, value] of [['Isolation', p.isolation === 'None' ? 'Standard' : p.isolation], ['Acuity', ['','Low','Moderate','High'][p.acuity] || p.acuity]]) {
          const col = u.el('div', 'motif-transfer-need', tray);
          u.el('span', '', col, label); u.el('b', 'motif-alert', col, value);
        }
      },
      beds: (base, S) => (ctx) => {
        base(ctx);
        const u = ctx.util, pane = S.pane, p = S.spec.patient, beds = S.spec.beds;
        const field = (title, cls) => { const el = u.el('fieldset', cls, pane); u.el('legend', '', el, title); return el; };
        const census = pane.querySelector('.ehr-census');
        const summary = field('Unit Capacity Summary – North Inpatient Unit (N)', 'motif-capacity');
        const count = S.refs.census;
        census.replaceChildren();
        u.el('span', '', census, `Total Beds: ${beds.length}`); census.append(count);
        u.el('span', '', census, 'Blocked: 0');
        for (const sex of ['Male', 'Female']) {
          const cohort = beds.filter(b => b.sex === sex);
          const count = u.el('span', '', census, `${sex} Beds: ${cohort.length} (${cohort.filter(b => !b.occupied).length} available)`);
          count.dataset.cohort = sex;
        }
        summary.append(census);
        const requirements = field('Placement Requirements (must be met)', 'motif-requirements');
        const row = u.el('div', 'motif-requirement-row', requirements);
        for (const [label, value, cls] of [['Sex Cohort:', p.sex, 'motif-cohort'], ['Isolation:', p.isolation === 'None' ? 'Standard' : p.isolation, 'motif-alert'], ['Acuity:', `${['','Low','Moderate','High'][p.acuity] || p.acuity} (requires same or higher)`, 'motif-alert']]) {
          u.el('span', '', row, label); u.el('span', cls, row, value);
        }
        const grid = pane.querySelector('.ehr-bedgrid');
        const board = field('Available Beds – North Inpatient Unit (N)', 'motif-bed-board'); board.append(grid);
        const tables = u.el('div', 'motif-tables', pane);
        for (const [i, section] of [...pane.querySelectorAll(':scope > .ehr-section')].entries()) {
          section.querySelector('.ehr-sectionhead span').textContent = i ? 'Other Units – Available Beds' : 'Transport Requests';
          const content = section.querySelector('.ehr-sectionbody'), wrap = section.querySelector('.ehr-tablewrap');
          const history = wrap.querySelector('table');
          const summary = u.el('table', 'ehr-data motif-summary-table', wrap);
          wrap.prepend(summary);
          const headings = i ? ['Unit', 'Total', 'Available', 'Male Avail', 'Female Avail'] : ['Time', 'From', 'To', 'Patient', 'Status'];
          const head = u.el('tr', '', u.el('thead', '', summary));
          for (const text of headings) u.el('th', '', head, text);
          const rows = u.el('tbody', '', summary);
          if (i) {
            for (const [code, label] of [['N','North'], ['S','South'], ['E','East'], ['W','West']]) {
              const row = u.el('tr', code === 'N' ? 'motif-unit-selected' : '', rows);
              row.dataset.unitCode = code;
              u.el('td', '', row, `${label} (${code})`);
              for (let col = 0; col < 4; col++) u.el('td', '', row, '0');
            }
          } else {
            for (const [index, patient] of S.worklist.slice(0, 6).entries()) {
              const row = u.el('tr', '', rows);
              for (const value of [patient.time, ['ED','ED','OR','ICU'][index % 4], beds[index % beds.length].id, patient.name, index < 2 ? 'Pending' : 'Scheduled']) u.el('td', '', row, value);
            }
          }
          history.classList.add('motif-historical-table');
          const rail = u.el('div', 'motif-scrollbar', content);
          u.el('span', 'motif-scroll-up', rail, '▲');
          u.el('span', 'motif-scroll-thumb', rail);
          u.el('span', 'motif-scroll-down', rail, '▼');
          tables.append(section);
        }
        pane.querySelector(':scope > .ehr-note')?.remove();
      },
      bed: (base, S) => (grid, bed) => {
        const card = base(grid, bed), u = S.ctx.util;
        const status = S.refs.bedStatus.get(bed.id), patient = card.querySelector('[data-bed-patient]');
        card.replaceChildren();
        card.classList.toggle('motif-restricted', bed.sex !== 'Any' && bed.sex !== S.spec.patient.sex || ['Airborne', 'Protective'].includes(bed.isolation));
        const head = u.el('header', 'motif-bed-head', card);
        u.el('b', '', head, bed.id);
        head.append(status, patient);
        status.classList.add('motif-bed-status');
        const details = u.el('div', 'motif-bed-details', card);
        for (const [label, value] of [['Sex Cohort:', bed.sex], ['Precautions:', bed.isolation === 'None' ? 'Standard' : bed.isolation], ['Max Acuity:', ['','Low','Moderate','High'][bed.acuity] || bed.acuity], ['Available:', bed.occupied ? 'No' : 'Yes']]) {
          u.el('span', '', details, label); u.el('span', '', details, value);
        }
        return card;
      },
      paint: (base, S) => (model) => {
        base(model);
        const current = S.root.querySelector('.motif-current-bed');
        if (current) current.textContent = model.placements.patient;
        const headerCurrent = S.root.querySelector('.motif-identity-current');
        if (headerCurrent) headerCurrent.textContent = model.placements.patient;
        for (const [id, card] of S.refs.beds) {
          const occupied = model.placements.patient === id || S.spec.occupants.some(o => o.bed === id);
          card.classList.toggle('occupied', occupied);
          const available = card.querySelector('.motif-bed-details > :last-child');
          if (available) available.textContent = occupied ? 'No' : 'Yes';
        }
        for (const count of S.root.querySelectorAll('[data-cohort]')) {
          const beds = S.spec.beds.filter(b => b.sex === count.dataset.cohort);
          count.textContent = `${count.dataset.cohort} Beds: ${beds.length} (${beds.filter(b => !b.occupied && model.placements.patient !== b.id).length} available)`;
        }
        for (const row of S.root.querySelectorAll('[data-unit-code]')) {
          const beds = S.spec.beds.filter(b => b.id.startsWith(row.dataset.unitCode + '-'));
          const available = beds.filter(b => !b.occupied && model.placements.patient !== b.id);
          const values = [beds.length, available.length, available.filter(b => b.sex === 'Male' || b.sex === 'Any').length, available.filter(b => b.sex === 'Female' || b.sex === 'Any').length];
          values.forEach((value, i) => { row.children[i + 1].textContent = value; });
        }
        S.root.classList.toggle('motif-has-notice', !!model.notice);
      },
    },
  },
});
