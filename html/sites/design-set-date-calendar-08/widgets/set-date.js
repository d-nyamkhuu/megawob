// Design on templates/set-date/calendar.js.
env.widget({
  task: 'set-date',
  site: 'design-set-date-calendar-08',
  name: 'design',
  split: 'train',
  scenarios: ['calendar'],
  template: 'set-date/calendar',
  design: {
    calendarIcon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="17"/><path d="M3 10h18M8 2v6M16 2v6M7 13h2m2 0h2m2 0h2M7 16h2m2 0h2m2 0h2M7 19h2m2 0h2m2 0h2"/></svg>',
    notesLabel: 'Notes (optional)', trimWeeks: true,
    parts: {
      staticRow: (base, S) => (parent, pair, util) => {
        const { spec } = S;
        const [k, v] = pair;

        const row = util.el('div', 'fd-row fd-extra', parent);
        row.style.order = spec.scene.extra.findIndex(ex => ex[0] === k) === 0 ? '1' : '3';
        util.el('div', 'fd-label', row, k.replace(/:$/, '') + ':');
        util.el('div', 'fd-static', row, v);
      },
      calendarRow: (base, S) => (ctx, range, row) => {
        row.classList.add('fd-primary');
      },
      calendarExtras: (base, S) => (ctx, range) => {
        const { spec, control, geo, paintFns } = S;
        const { util } = ctx;
        if (!range) {
          let recordReadout;
          let birthReadout;
          const optionalDateLabel = spec.scene.label.toLowerCase().includes('birth') ? 'Date of registration' : 'Date of birth';
          const record = util.el('div', 'fd-row fd-record', geo.body);
          util.el('label', 'fd-label', record, 'Record type:');
          const recordValue = util.el('div', 'fd-static fd-record-value', record, 'Standard');
          const arrow = util.el('button', 'fd-record-arrow', recordValue, '▼');
          arrow.type = 'button';
          arrow.setAttribute('aria-label', 'Record type');
          const choices = util.el('div', 'fd-record-menu', recordValue);
          choices.hidden = true;
          for (const label of ['Standard', 'Additional']) {
            const option = util.el('button', '', choices, label);
            option.type = 'button';
            option.addEventListener('click', () => {
              recordValue.firstChild.textContent = label;
              if (recordReadout) recordReadout.textContent = label;
              choices.hidden = true;
            });
          }
          arrow.addEventListener('click', () => { choices.hidden = !choices.hidden; });
          const birth = util.el('div', 'fd-row fd-birth', geo.body);
          util.el('label', 'fd-label', birth, optionalDateLabel + ':');
          const birthValue = util.el('div', 'fd-control fd-optional', birth);
          const birthText = util.el('input', 'fd-birth-text', birthValue);
          birthText.placeholder = 'DD/MM/YYYY';
          birthText.setAttribute('aria-label', optionalDateLabel + ' (optional)');
          birthText.addEventListener('input', () => { if (birthReadout) birthReadout.textContent = birthText.value || '—'; });
          birthValue.insertAdjacentHTML('beforeend', S.D.calendarIcon);
          const notes = util.el('div', 'fd-row fd-notes', geo.body);
          util.el('label', 'fd-label', notes, 'Notes:');
          const note = util.el('textarea', 'fd-note-input', notes);
          note.setAttribute('aria-label', 'Notes');
          const feedback = document.querySelector('.ds-reservation-values');
          feedback.replaceChildren();
          for (const [key, value] of [...spec.scene.extra.slice(0, 1), ['Record type', 'Standard'], ...spec.scene.extra.slice(1), [optionalDateLabel, '—'], [spec.scene.label, '—']]) {
            const line = util.el('div', 'gm-fbr', feedback);
            util.el('span', '', line, key.replace(/:$/, '') + ':');
            const valueEl = util.el('span', '', line, value);
            if (key === 'Record type') recordReadout = valueEl;
            if (key === optionalDateLabel) birthReadout = valueEl;
            valueEl.classList.toggle('gm-long', value.length > 16);
            if (key === spec.scene.label) paintFns.push(m => {
              valueEl.textContent = m.value ? S.P.fmtLocal(m.value, geo.disp) : '—';
              valueEl.classList.toggle('gm-long', valueEl.textContent.length > 16);
            });
          }
        }
      },
      needsNotes: (base, S) => (spare) => {
        const { card } = S;
        return spare > 96 && !card.querySelector('.fd-notes');
      },
    },
  },
});
