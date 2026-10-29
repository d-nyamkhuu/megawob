// Design on templates/set-date/calendar.js: add the adoption form frame and stage-specific row hooks.
env.widget({
  task: 'set-date',
  site: 'design-set-date-calendar-05',
  name: 'design',
  split: 'train',
  scenarios: ['calendar'],
  template: 'set-date/calendar',
  design: {
    notesLabel: 'Notes (optional)',
    parts: {
      heading: (base, S) => (ctx, extras) => {
        const { card } = S;
        const { util } = ctx;
        util.el('div', 'fd-band fd-details-band', card, 'Your details');
        util.el('div', 'fd-band fd-pet-band', card, 'Pet and adoption details');
        const filler = (cls, label, placeholder, area) => {
          const row = util.el('div', 'fd-row ' + cls, card);
          util.el('label', 'fd-label', row, label);
          const input = util.el(area ? 'textarea' : 'input', 'fd-filler', row);
          input.placeholder = placeholder;
          input.setAttribute('aria-label', label);
          input.readOnly = true;
        };
        filler('fd-email', 'Email address', 'Email address', false);
        filler('fd-phone', 'Phone number', 'Phone number', false);
        const contact = String((extras[1] || extras[0] || ['', 'Applicant'])[1]);
        card.querySelector('.fd-email input').value = contact.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '') + '@example.com';
        card.querySelector('.fd-phone input').value = '07123 456789';
        filler('fd-reason', 'Why do you want to adopt?', 'Tell us a little about why you would like to adopt...', true);
        filler('fd-additional', 'Additional information (optional)', 'Any other information...', true);
      },
      staticRow: (base, S) => (parent, pair, util) => {
        const index = parent.querySelectorAll('.fd-extra').length;
        const row = base(parent, pair, util);
        row.classList.add('fd-extra', 'fd-extra-' + index);
        return row;
      },
      calendarRow: (base, S) => (ctx, range, row, help) => {
        base(ctx, range, row, help);
        row.classList.add('fd-date-row');
      },
      sizePop: (base, S) => (width, height) => {
        const { control, card, pop } = S;
        const a = control.getBoundingClientRect();
        const b = card.getBoundingClientRect();
        const top = a.top - b.top + a.height + 3;
        Object.assign(pop.style, {
          left: a.left - b.left + 'px',
          top: top + 'px',
          width: width + 'px',
          height: height + 'px',
        });
        return top + height + 18;
      },
      popRoom: (base, S) => (size) => {
        const { control, card } = S;
        return size.height - 24 - (control.getBoundingClientRect().bottom - card.getBoundingClientRect().top + 6) - 18;
      },
    },
  },
});
