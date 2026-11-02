// Adds appointment details, indexed extra rows, and segmented time readouts to the shared time form.
env.widget({
  task: 'set-date',
  site: 'design-set-date-time-06',
  name: 'design',
  split: 'train',
  scenarios: ['time'],
  traits: { timeControls: ['spin'] },
  template: 'set-date/calendar',
  design: {
    parts: {
      staticRow: (base, S) => (parent, pair, util) => {
        const [label, value] = pair;
        const row = util.el('div', 'fd-row fd-extra', parent);
        util.el('div', 'fd-label', row, label + ':');
        util.el('div', 'fd-static', row, value);
        S.P.staticCreated(parent, row, label, value, util);
        return row;
      },
      timeReadout: (base, S) => (txt, value, util) => {
        txt.replaceChildren();
        const parts = value === null ? { h: '--', m: '--', ap: '--' } : S.fam.helpers.parts12(value);
        util.el('span', 'fd-time-part fd-time-hour', txt, String(parts.h));
        util.el('span', 'fd-time-colon', txt, ':');
        util.el('span', 'fd-time-part fd-time-minute', txt, String(parts.m).padStart(2, '0'));
        util.el('span', 'fd-time-part fd-time-period', txt, parts.ap);
      },
      buildTimeColumns: (base, S) => (ctx) => {
        base(ctx);
        S.control.classList.add('fd-split-control');
      },
      buildClock: (base, S) => (ctx) => {
        base(ctx);
        S.control.classList.add('fd-split-control');
      },
      built: (base, S) => (ctx) => {
        const { util } = ctx;
        const { card, control, geo, spec, pop } = S;
        const taskRow = control.closest('.fd-row');
        taskRow.classList.add('fd-task-row');
        const label = taskRow.querySelector('.fd-label');
        label.firstChild.textContent = spec.scene.label + ': ';
        const service = util.el('div', 'fd-row fd-service', card);
        util.el('div', 'fd-label', service, 'Service:');
        util.el('div', 'fd-static fd-service-value', service, 'Appointment');
        card.insertBefore(service, taskRow);
        for (const extra of card.querySelectorAll('.fd-extra')) card.insertBefore(extra, taskRow);
        let notes = card.querySelector('.fd-notes');
        if (!notes) {
          notes = util.el('div', 'fd-row fd-notes', card);
          util.el('div', 'fd-label', notes, 'Notes:');
          util.el('div', 'fd-static', notes, geo.note);
        } else {
          notes.querySelector('.fd-label').textContent = 'Notes:';
        }
        card.append(notes);
        if (pop) {
          pop.style.top = '0px';
          pop.style.left = control.offsetLeft + 'px';
        }
        base(ctx);
      },
    },
  },
});
