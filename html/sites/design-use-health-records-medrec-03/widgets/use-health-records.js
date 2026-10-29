// Design on use-health-records/chart; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-health-records',
  site: 'design-use-health-records-medrec-03',
  name: 'design',
  split: 'train',
  scenarios: ['medrec'],
  template: 'use-health-records/chart',
  design: {
    rootRadius: '6px',
    panel: '#ffffff',
    bg: '#f7f9fb',
    fg: '#111827',
    line: '#d8e0e9',
    muted: '#59677c',
    parts: {
      styles: (base) => (ctx) => base(ctx) + `
        /* Stack the actions above dose controls before anchors are recorded. */
        .ehr-root .ehr-medrow {
          grid-template-columns: minmax(100px,175px) 150px minmax(110px,1fr);
          grid-template-rows: 22px 27px 27px;
          gap: 4px 7px;
          align-items: center;
          min-height: 100px;
          padding: 5px 10px;
          border: 1px solid #d8e0e9;
          border-radius: 6px;
          background: #fff;
        }
        .ehr-medrow .med-identity { grid-column: 1; grid-row: 1 / 4; min-width: 0; }
        .ehr-medrow .med-action { grid-column: 2 / 4; grid-row: 2; }
        .ehr-medrow .med-dose { grid-column: 2; grid-row: 3; }
        .ehr-medrow .med-unit { grid-column: 3; grid-row: 3; }
        .ehr-root .ehr-medrow input { width: 100%; border-radius: 5px; }
        .ehr-root .ehr-medrow button { border-radius: 5px; }
        .ehr-context { width: 32%; }
        .med-patient-line { display: grid; grid-template-columns: 75px minmax(0,1fr); gap: 8px; padding: 7px 0; }
        .med-patient-label { color: #59677c; }
      `,
      medicationRow: (base) => (table, med, i) => {
        base(table, med, i);
        const row = table.lastElementChild;
        ['med-identity', 'med-action', 'med-dose', 'med-unit'].forEach((name, j) => {
          row.children[j].classList.add(name);
        });
      },
      // These read-only chart decorations were already omitted by this design.
      rail: () => () => {},
      tabs: () => () => {},
      trend: () => () => {},
      inbox: () => () => {},
      careNotes: () => () => {},
      snapshot: (_base, S) => (sidebar) => {
        const { util } = S.ctx;
        const patient = S.spec.patient;
        const details = S.P.section('Patient Details', sidebar);
        for (const [label, value] of [
          ['Name', patient.name], ['DOB', patient.dob],
          ['Sex', patient.sex], ['MRN', patient.mrn],
          ['Allergies', 'No known allergies'],
        ]) {
          const row = util.el('div', 'med-patient-line', details);
          util.el('span', 'med-patient-label', row, label);
          util.el('span', '', row, value);
        }
      },
      results: (base) => (sidebar) => {
        base(sidebar);
        sidebar.lastElementChild.firstElementChild.firstElementChild.textContent = 'Clinical Information';
      },
    },
  },
});
