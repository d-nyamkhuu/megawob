// This design adds the clinic form's typed-field help, extra rows, and required-label styling.
env.widget({
  task: 'set-date',
  site: 'design-set-date-typed-02',
  name: 'design',
  split: 'train',
  scenarios: ['typed'],
  template: 'set-date/calendar',
  design: {
    typedContext: null,
    typedAux: null,
    typedReminder: false,
    parts: {
      fieldLabel: (base, S) => (label) => label + ':',
      staticCreated: (base, S) => (parent, row, label) => {
        row.classList.add('fd-extra');
        row.querySelector('.fd-label').textContent = (label === 'Patient' ? 'Patient Name' : label) + ':';
      },
      buildTyped: (base, S) => (ctx) => {
        const { spec } = S;
        const shown = spec.maskShown || spec.mask;
        S.P.buildText(ctx, spec.mask, shown, `(${shown})`);
        S.P.typedAfter(ctx);
      },
      typedAfter: (base, S) => (ctx) => {
        const { util } = ctx;
        const card = S.card;
        const arrows = '<svg viewBox="0 0 14 24" width="100%" height="100%"><path d="M7 4L12 9H2z M7 20L2 15h10z" fill="#000" stroke="#000" stroke-width="1"/><path d="M1 12h12" stroke="#000" stroke-width="1"/></svg>';
        [
          ['Appointment time', '9:00 AM', 'fd-r-time'],
          ['Reason for visit', 'General Checkup', 'fd-r-reason'],
        ].forEach(([label, value, cls]) => {
          const row = util.el('div', `fd-row ${cls}`, card);
          util.el('div', 'fd-label', row, label + ':');
          const field = util.el('div', 'fd-static', row);
          util.el('span', '', field, value);
          util.el('span', 'fd-arrows', field).innerHTML = arrows;
        });
        const row = util.el('div', 'fd-row fd-r-notes', card);
        util.el('div', 'fd-label', row, 'Notes (optional):');
        const field = util.el('div', 'fd-static fd-textarea', row);
        util.el('span', 'fd-scroll', field).innerHTML = '<i class="u"></i><i class="t"></i><i class="d"></i>';
      },
    },
  },
});
