// This design adds the appointment and patient details around the shared typed date field.
env.widget({
  task: 'set-date',
  site: 'design-set-date-typed-05',
  name: 'design',
  split: 'train',
  scenarios: ['typed'],
  template: 'set-date/calendar',
  design: {
    title: 'Appointment Details',
    typedContext: ['Reason for visit', ''],
    typedAux: null,
    typedReminder: false,
    parts: {
      textCreated: (base, S) => (ctx, row, help, shown) => {
        row.classList.add('fd-date-row');
        help.textContent = `(${shown})`;
        S.control.placeholder = '';
      },
      typedAfter: (base, S) => (ctx) => {
        const { util } = ctx;
        const { card, P, spec } = S;
        const aux = util.el('div', 'fd-auxgrid', card);
        [
          ['Department', 'General Medicine'],
          ['Appointment time', '09:00 AM'],
          ['Provider', 'Dr. Singh'],
        ].forEach(([label, value], i) => {
          const box = util.el('div', `fd-aux fd-aux-${i}`, aux);
          util.el('label', '', box, label);
          util.el('div', 'fd-static fd-dropdown', box, value);
        });

        const reminder = util.el('label', 'fd-reminder', card);
        const check = util.el('input', '', reminder);
        check.type = 'checkbox';
        reminder.append(' Add a reminder');

        const patient = util.el('section', 'fd-patient', card);
        util.el('div', 'fd-patient-title', card, 'Patient Information');
        const fullName = spec.scene.extra.find(([label]) => /patient|name/i.test(label));
        const nameParts = (fullName ? fullName[1] : 'Jordan Miller').split(' ');
        const id = String(nameParts.join('').split('').reduce(
          (n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7,
        )).slice(-5).padStart(5, '0');
        [
          ['Patient ID', `PT-${id}`],
          ['First Name', nameParts.slice(0, -1).join(' ') || nameParts[0]],
          ['Last Name', nameParts.length > 1 ? nameParts.at(-1) : ''],
          ['Date of Birth', '04/15/1990'],
          ['Phone', '(312) 555-0198'],
        ].forEach((pair, i) => {
          P.staticRow(patient, pair, util);
          patient.lastElementChild.classList.add(`fd-patient-row-${i}`);
          if (i === 3) util.el('span', 'fd-patient-hint', patient.lastElementChild, '(MM/DD/YYYY)');
        });

        const source = util.el('div', 'fd-source', card);
        for (const row of [...card.children]) {
          if (row.classList.contains('fd-row') && !row.classList.contains('fd-date-row')) source.append(row);
        }
        util.el('div', 'fd-appointment-frame', card);
        const notes = util.el('section', 'fd-notes-panel', card);
        util.el('div', 'fd-notes-title', notes, 'Notes');
        util.el('div', 'fd-notes-copy', notes, 'Add any relevant notes about the appointment.');
      },
    },
  },
});
