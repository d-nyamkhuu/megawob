// This design keeps the workstation form's indexed extra rows and its custom calendar icon.
env.widget({
  task: 'set-date',
  site: 'design-set-date-calendar-04',
  name: 'design',
  split: 'train',
  scenarios: ['calendar'],
  template: 'set-date/calendar',
  design: {
    calendarIcon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="17" rx="1" fill="#eef0f5"/><path d="M3 10h18M8 2v6M16 2v6"/><path d="M6 13h2v2H6zM11 13h2v2h-2zM16 13h2v2h-2zM6 17h2v2H6zM11 17h2v2h-2zM16 17h2v2h-2z" fill="currentColor" stroke="none"/></svg>',
    fieldClass: 'ds-main-field',
    parts: {
      fieldLabel: (base, S) => (label) => label.replace(/:$/, '') + ': ',
      bodyStart: (base, S) => (ctx, extras) => {
        const { util } = ctx;
        const { card } = S;
        const decor = (name, cls, value, arrow) => {
          const row = util.el('div', 'ds-decor ' + cls, card);
          util.el('span', 'ds-decor-label', row, name);
          const field = util.el('div', 'ds-decor-value', row, value);
          if (arrow) util.el('span', 'ds-decor-arrow', field, arrow);
          return field;
        };
        decor('Task name:', 'ds-taskname', '', false);
        const due = decor('Due date:', 'ds-due', 'MM/DD/YYYY', false);
        due.insertAdjacentHTML('beforeend', S.D.calendarIcon);
        decor('Priority:', 'ds-priority', 'Normal', '▼');
        decor('Status:', 'ds-status', 'Not Started', '▼');
        const notes = decor('Notes:', 'ds-notes', '', false);
        const scroll = util.el('div', 'ds-scroll', notes);
        util.el('span', '', scroll, '▲');
        util.el('span', '', scroll, '▼');
        decor('', 'ds-empty-select', '', '▼');
      },
      staticCreated: (base, S) => (parent, row, label, value, util) => {
        row.classList.add('ds-extra');
        row.style.setProperty('--extra-index', parent.querySelectorAll('.ds-extra').length - 1);
        row.querySelector('.fd-label').textContent = label.replace(/:$/, '') + ':';
      },
    },
  },
});
