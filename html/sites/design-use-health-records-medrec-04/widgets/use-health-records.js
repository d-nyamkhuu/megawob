// Design on use-health-records/chart; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-health-records',
  site: 'design-use-health-records-medrec-04',
  name: 'design',
  split: 'train',
  scenarios: ['medrec'],
  template: 'use-health-records/chart',
  design: {
    parts: {
      styles: () => () => '',
      top: () => () => {},
      menu: () => () => {},
      tabs: () => () => {},
      rail: () => () => {},
      heading: () => () => {},
      toolbar: () => () => {},
      workflow: () => () => {},
      banner: (base, S) => () => {
        const u = S.ctx.util, s = S.spec;
        const header = u.el('div', 'med-patient-header', S.root);
        const patient = u.el('section', 'med-patient', header);
        const identity = u.el('div', 'med-identity', patient);
        u.el('h1', '', identity, S.unidentified ? 'No patient selected' : s.patient.name);
        const demographics = u.el('div', 'med-demographics', identity);
        for (const [label, value] of [['DOB:', s.patient.dob], ['Age:', String(2027 - Number(s.patient.dob.slice(0, 4)))], ['Sex:', s.patient.sex]]) {
          const item = u.el('div', '', demographics);
          u.el('b', '', item, label); u.el('span', '', item, value);
        }
        const mrn = u.el('div', 'med-mrn', identity);
        u.el('b', '', mrn, 'MRN:'); u.el('span', '', mrn, s.patient.mrn);
        const encounter = u.el('div', 'med-encounter', identity);
        for (const [label, value] of [['Encounter:', s.code], ['Location:', 'General Medicine'], ['Attending:', s.providers[0]]]) {
          const item = u.el('div', '', encounter);
          u.el('b', '', item, label); u.el('span', '', item, value);
        }
        const clinical = u.el('div', 'med-clinical', patient);
        for (const [label, value] of [['Allergies:', 'No known allergies'], ['Code Status:', 'Full Code']]) {
          const item = u.el('div', '', clinical);
          u.el('b', '', item, label); u.el('span', '', item, value);
        }
        u.el('div', 'med-measures', clinical, `${s.patient.isolation === 'None' ? 'Standard' : s.patient.isolation} precautions`);
        const summary = u.el('section', 'med-summary', header);
        u.el('h2', '', summary, 'Medication Reconciliation');
        for (const [key, label, value] of [['reviewed', 'Reviewed:', `0 of ${s.meds.length}`], ['unreviewed', 'Unreviewed:', s.meds.length], ['home', 'Home Medications:', s.meds.length], ['archive', 'Archived Prescriptions:', 8]]) {
          const row = u.el('div', '', summary);
          u.el('b', '', row, label);
          S.refs[`summary_${key}`] = u.el('span', '', row, String(value));
        }
      },
      medrec: (base, S) => () => {
        const u = S.ctx.util, s = S.spec;
        const section = u.el('section', 'med-home med-box', S.pane);
        u.el('h2', 'med-caption', section, 'Home Medications (from patient / external records)');
        const table = u.el('div', 'med-review-table', section);
        const head = u.el('div', 'med-columns med-column-head', table);
        for (const label of ['Medication', 'Recorded Dose', 'Unit', 'Frequency', 'Source', 'Action', 'Dose', 'Unit']) u.el('div', '', head, label);
        const rows = u.el('div', 'med-review-rows', table);
        for (const [i, med] of s.meds.entries()) S.P.medicationRow(rows, med, i);
        S.refs.preview = u.el('section', 'med-preview med-box', S.pane);
        const archive = u.el('section', 'med-archive med-box', S.pane);
        archive.title = `Home medication list collected by ${S.nurse}; archived prescriptions are read only.`;
        u.el('h2', 'med-caption', archive, 'Archived Prescriptions (not part of current reconciliation)');
        const scroll = u.el('div', 'med-archive-scroll', archive);
        const history = u.el('table', 'med-data med-history', scroll);
        const heading = u.el('tr', '', u.el('thead', '', history));
        for (const label of ['Date', 'Medication', 'Dose', 'Unit', 'Frequency', 'Prescriber', 'Notes']) u.el('th', '', heading, label);
        const body = u.el('tbody', '', history);
        for (let i = 0; i < 8; i++) {
          const med = s.meds[i % s.meds.length];
          const row = u.el('tr', '', body);
          for (const value of [`${4 + i} May 2026`, `${med.name} ${med.dose} ${med.unit}`, med.dose, med.unit, med.frequency, i % 2 ? s.providers[0] : S.reviewer, i % 3 ? 'Expired' : 'Discontinued']) u.el('td', '', row, String(value));
        }
      },
      medicationRow: (base, S) => (table, med, i) => {
        const u = S.ctx.util, row = u.el('div', 'med-columns med-review-row', table);
        u.el('strong', '', u.el('div', '', row), med.name);
        for (const value of [med.dose, med.unit, med.frequency, i % 2 ? 'Pharmacy verified' : 'Patient report']) u.el('div', '', row, String(value));
        for (const key of ['action', 'dose', 'unit']) S.P.field(`${med.id}-${key}`, row);
      },
      preview: (base, S) => (m) => {
        const u = S.ctx.util, values = m.saved || m.fields, preview = S.refs.preview;
        preview.replaceChildren();
        u.el('h2', 'med-caption', preview, `Medication Reconciliation Preview (${m.saved ? 'Saved' : 'Draft'})`);
        const table = u.el('table', 'med-data med-draft', preview);
        const head = u.el('tr', '', u.el('thead', '', table));
        for (const label of ['Medication', 'Current Dose', 'Frequency', 'Proposed Action', 'Proposed Dose', 'Status']) u.el('th', '', head, label);
        const body = u.el('tbody', '', table);
        for (const med of S.spec.meds) {
          const action = values[`${med.id}-action`] || 'Unreviewed';
          const row = u.el('tr', '', body);
          for (const value of [med.name, `${med.dose} ${med.unit}`, med.frequency, action, `${values[`${med.id}-dose`]} ${values[`${med.id}-unit`]}`, action === 'Unreviewed' ? 'Unreviewed' : 'Reviewed']) u.el('td', '', row, value);
        }
      },
      paint: (base, S) => (m) => {
        base(m);
        const reviewed = S.spec.meds.filter(med => ['Continue', 'Stop', 'Modify'].includes(m.fields[`${med.id}-action`])).length;
        S.refs.summary_reviewed.textContent = `${reviewed} of ${S.spec.meds.length}`;
        S.refs.summary_unreviewed.textContent = String(S.spec.meds.length - reviewed);
      },
    },
  },
});
