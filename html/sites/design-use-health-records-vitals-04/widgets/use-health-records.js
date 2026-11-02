// Design on use-health-records/chart; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-health-records',
  site: 'design-use-health-records-vitals-04',
  name: 'design',
  split: 'train',
  scenarios: ['vitals'],
  template: 'use-health-records/chart',
  design: {
    fontFamily: '"Segoe UI",Arial,sans-serif', fontSize: '14px', rootInset: '0', rootRadius: '0',
    parts: {
      top: () => () => {},
      menu: () => () => {},
      tabs: () => () => {},
      rail: () => () => {},
      heading: () => () => {},
      toolbar: () => () => {},
      workflow: () => () => {},
      banner: (base, S) => ctx => {
        const el = ctx.util.el, p = S.spec.patient;
        const banner = el('div', 'ehr-banner medical-patient', S.root);
        el('div', 'ehr-name', banner, p.name);
        const demographics = el('div', 'medical-demographics', banner);
        for (const text of [`MRN: ${p.mrn}`, `DOB: ${p.dob}`, p.sex]) el('span', '', demographics, text);
        const care = el('div', 'medical-care', banner);
        const line = el('div', '', care);
        el('span', '', line, 'Location: Medical Unit 3B-12');
        el('span', '', line, `Attending: ${S.spec.providers[0]}`);
        el('div', '', care, 'Allergies: No known allergies');
      },
      vitals: (base, S) => ctx => {
        // Build the original controls and history first, preserving every seeded draw.
        base(ctx);
        const el = ctx.util.el;
        const sections = [...S.pane.querySelectorAll(':scope > .ehr-section')];
        const [handoff, entry, history, documentation] = sections;
        handoff.classList.add('medical-handoff');
        entry.classList.add('medical-entry');
        history.classList.add('medical-history');
        handoff.querySelector('.ehr-sectionhead span').textContent = 'Nursing Observations';
        entry.querySelector('.ehr-sectionhead span').textContent = 'New Observation';
        history.querySelector('.ehr-sectionhead span').textContent = 'Previous Observations';
        const recordedDate = handoff.querySelector('.ehr-handoff-meta').textContent.split('|')[0].trim();
        handoff.querySelector('.ehr-handoff-meta').remove();
        const table = handoff.querySelector('table');
        const units = [...new Set(S.spec.observations.map(o => o.tunit))];
        const labels = ['Date / Time', 'BP\n(mmHg)', units.length === 1 ? `Temp\n(${units[0]})` : 'Temp', 'SpO₂\n(%)', 'Pulse\n(bpm)', 'Resp\n(/min)'];
        const setHeader = (th, text) => {
          const [name, unit] = text.split('\n');
          th.textContent = name;
          if (unit) el('span', 'medical-table-unit', th, unit);
        };
        table.querySelectorAll('th').forEach((th, i) => setHeader(th, labels[i]));
        el('th', '', table.rows[0], 'Status');
        [...table.rows].slice(1).forEach((row, i) => {
          row.cells[0].textContent = `${recordedDate}\n${S.spec.observations[i].time}`;
          if (units.length === 1) row.cells[2].textContent = S.spec.observations[i].temp;
          el('td', '', row, 'Recorded');
        });
        const historyTable = history.querySelector('table');
        ['Date / Time', 'BP\n(mmHg)', 'Temp', 'SpO₂\n(%)', 'Pulse\n(bpm)', 'Resp\n(/min)'].forEach((text, i) => setHeader(historyTable.rows[0].cells[i], text));
        el('th', '', historyTable.rows[0], 'Notes');
        [...historyTable.rows].slice(1).forEach(row => {
          row.cells[0].textContent = row.cells[0].textContent.replace(' | ', '\n');
          el('td', '', row, '—');
        });
        const fields = [...entry.querySelectorAll('.ehr-field')];
        const unit = fields.find(node => node.querySelector('button')?.textContent.includes('°'));
        const temperature = fields.find(node => /Temperature/.test(node.querySelector('label').textContent) && node !== unit);
        if (unit && temperature) {
          temperature.classList.add('medical-temperature');
          unit.classList.add('medical-unit-target');
          temperature.append(unit);
        }
        const time = fields.find(node => node.querySelector('.ehr-choices') && node !== unit && node !== temperature);
        if (time) {
          time.classList.add('medical-time');
          const placeholder = el('span', 'medical-time-hint', time, 'HH:MM');
          time.insertBefore(placeholder, time.querySelector('.ehr-choices'));
        }
        fields.forEach(node => {
          const label = node.querySelector('label');
          const text = label.textContent;
          if (/Observed/.test(text)) label.textContent = 'Time';
          if (/^Blood pressure/i.test(text)) label.textContent = 'Blood Pressure (mmHg)';
          if (/^Spo2/i.test(text)) label.textContent = 'Oxygen Saturation (%)';
          if (/^Pulse/i.test(text)) label.textContent = 'Pulse (bpm)';
          if (/^Respiratory/i.test(text)) label.textContent = 'Respiratory Rate (/min)';
          const input = node.querySelector('input');
          if (input) input.placeholder = /Blood/.test(text) ? 'e.g. 120/80' : /Temperature/.test(text) ? 'e.g. 36.8' : /Spo2/i.test(text) ? 'e.g. 98' : /Pulse/.test(text) ? 'e.g. 72' : 'e.g. 16';
        });
        const notes = el('div', 'ehr-field medical-notes', entry.querySelector('.ehr-formgrid'));
        const label = el('label', '', notes, 'Additional Notes (optional)');
        const input = el('textarea', '', notes);
        input.id = 'medical-notes'; label.htmlFor = input.id;
        input.placeholder = 'e.g. patient resting, on room air';
        S.P.listen(input, 'input', () => { S.root.dataset.notes = input.value; S.P.preview(ctx.model); });
        entry.querySelector('.ehr-sectionbody').append(S.refs.preview);
        documentation.remove();
      },
      preview: (base, S) => m => {
        const el = S.ctx.util.el, values = m.saved || m.fields;
        const preview = S.refs.preview;
        preview.replaceChildren();
        el('div', 'ehr-previewlabel', preview, m.saved ? 'Saved observation' : 'Preview (unsaved)');
        const table = el('table', 'medical-preview-table', preview);
        for (const desc of S.spec.fields) {
          if (/unit/i.test(desc.label)) continue;
          const row = el('tr', '', table);
          const labels = {'Observed at':'Time', 'Blood pressure':'Blood Pressure (mmHg)', 'Spo2':'Oxygen Saturation (%)', 'SpO2':'Oxygen Saturation (%)', 'Pulse':'Pulse (bpm)', 'Respiratory rate':'Respiratory Rate (/min)'};
          el('td', '', row, labels[desc.label] || desc.label);
          let value = values[desc.id] || '—';
          if (/^Temperature$/i.test(desc.label) && value !== '—') {
            const unit = S.spec.fields.find(d => /unit/i.test(d.label));
            value += unit && values[unit.id] ? ` ${values[unit.id]}` : '';
          }
          el('td', '', row, value);
        }
        const row = el('tr', '', table);
        el('td', '', row, 'Additional Notes');
        el('td', '', row, S.root.dataset.notes || '—');
      },
      decorated: (base, S) => ctx => {
        base(ctx);
        const el = ctx.util.el;
        const guide = el('section', 'medical-guide', S.body);
        el('h3', '', guide, 'Vital Signs Reference');
        const table = el('table', '', guide), head = el('tr', '', table);
        el('th', '', head, 'Measurement'); el('th', '', head, 'Typical Adult Range');
        for (const [name, range] of [['Blood Pressure (mmHg)', '90/60 – 140/90'], ['Temperature (°C)', '36.0 – 38.0'], ['Temperature (°F)', '96.8 – 100.4'], ['Oxygen Saturation (%)', '95 – 100'], ['Pulse (bpm)', '60 – 100'], ['Respiratory Rate (/min)', '12 – 20']]) {
          const row = el('tr', '', table); el('td', '', row, name); el('td', '', row, range);
        }
        el('h3', 'medical-tips-heading', guide, 'Measurement Tips');
        const tips = el('ul', '', guide);
        for (const text of ['Measure blood pressure with the patient seated and arm supported.', 'Use the same temperature unit consistently for a given patient.', 'Confirm SpO₂ probe placement and perfusion.', 'Count pulse and respiratory rate for a full minute, if irregular.', 'Add relevant notes (e.g. activity, oxygen therapy, patient position).']) el('li', '', tips, text);
        const instruction = document.querySelector('.ref-task > .ref-instruction');
        if (instruction) S.root.querySelector('.medical-patient').insertBefore(instruction, S.root.querySelector('.medical-care'));
        const entry = S.pane.querySelector('.medical-entry');
        if (entry && S.refs.save) entry.querySelector('.ehr-sectionhead').append(S.refs.save);
        if (entry) entry.querySelector('.ehr-sectionbody').append(S.refs.notice);
      },
    },
  },
});
