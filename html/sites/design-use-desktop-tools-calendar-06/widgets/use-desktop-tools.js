// Calendar design with the seeded overview and a persistent event form with time readouts and notes.
(function () {
  'use strict';

  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-calendar-06',
    name: 'design',
    split: 'train',
    scenarios: ['calendar'],
    template: 'use-desktop-tools/workspace',
    design: {
      calTime12: false,
      calNavText: false,
      parts: {
        calStart: (base, S) => (C) => {
          const { util, spec } = C;
          const mini = document.querySelector('.mc-grid');
          const dayParts = spec.day.match(/^(\w+),?\s+(\w+)\s+(\d+)/);
          if (!mini || !dayParts) return;
          const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const monthLengths = {
            January: 31, February: 28, March: 31, April: 30, May: 31, June: 30,
            July: 31, August: 31, September: 30, October: 31, November: 30, December: 31,
          };
          const selected = Number(dayParts[3]);
          const offset = (weekdays.indexOf(dayParts[1]) - ((selected - 1) % 7) + 7) % 7;
          mini.classList.toggle('six-weeks', offset + monthLengths[dayParts[2]] > 35);
          document.querySelector('.mc-date').textContent = spec.day;
          document.querySelector('.mc-head b').textContent = dayParts[2];
          mini.replaceChildren();
          for (const d of ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']) util.el('b', '', mini, d);
          for (let i = 0; i < offset; i++) util.el('i', '', mini, '');
          for (let d = 1; d <= monthLengths[dayParts[2]]; d++) {
            util.el('i', d === selected ? 'sel' : '', mini, String(d));
          }
        },
        calRows: () => (_C, avail) => {
          const rowH = Math.max(16, Math.min(24, Math.floor(avail / 20)));
          return { rowH, rows: Math.floor(avail / rowH) };
        },
        calPlace: (base) => (C, el, event) => {
          base(C, el, event);
          el.classList.toggle('short', event.dur === 1);
        },
        calSide: () => (C) => {
          const { util, side } = C;
          C.agenda = document.querySelector('.band-ev p');
          C.hint = util.el('div', 'at-hint', side,
            'Drag across the time slots to add an event. Scroll the day to see more hours.');
          C.form = util.el('div', 'at-form', side);
          util.el('h4', '', C.form, 'Create New Event');
          util.el('label', 'lbl', C.form, 'Title');
          C.name = util.el('input', '', C.form);
          C.name.type = 'text';
          C.name.placeholder = '';

          const timing = util.el('div', 'at-timing', C.form);
          const startBox = util.el('div', '', timing);
          util.el('label', 'lbl', startBox, 'Start time');
          C.x = {};
          C.x.startValue = util.el('div', 'when', startBox);
          C.x.startValue.setAttribute('aria-label', 'Start time — select by dragging the calendar');
          C.x.startValue.title = 'Drag across the calendar to choose start time and duration.';
          const durationBox = util.el('div', '', timing);
          util.el('label', 'lbl', durationBox, 'Duration');
          C.x.durationValue = util.el('div', 'when', durationBox);
          C.x.durationValue.setAttribute('aria-label', 'Duration — select by dragging the calendar');
          C.x.durationValue.title = 'Drag across the calendar to choose start time and duration.';

          const notesLabel = util.el('label', 'lbl notes-label', C.form, 'Notes ');
          util.el('span', '', notesLabel, '(optional)');
          const notes = util.el('textarea', 'at-notes', C.form);
          notes.setAttribute('aria-label', 'Notes (optional)');
          C.row = util.el('div', 'row', C.form);
          C.create = util.el('button', 'at-btn pri', C.row, 'Create event');
          C.create.type = 'button';
          C.cancel = util.el('button', 'at-btn', C.row, 'Clear');
          C.cancel.type = 'button';
        },
        calPaintEvent: (base) => (C, m, ...rest) => {
          base(C, m, ...rest);
          const event = m.event;
          if (event) {
            C.x.startValue.textContent = C.tl(event.start);
            C.x.durationValue.textContent = `${event.dur * 30} minutes`;
          } else {
            C.x.startValue.textContent = '';
            C.x.durationValue.textContent = '';
          }
        },
        calPaintForm: (base) => (C, m) => {
          base(C, m);
          C.form.hidden = false;
          C.name.disabled = !m.form;
          C.create.disabled = !m.form;
          C.cancel.disabled = !m.form;
          C.hint.hidden = true;
        },
        calPaintAgenda: () => (C, m) => {
          const { util, spec } = C;
          C.agenda.replaceChildren();
          const items = spec.events.map((event) => ({ ...event }))
            .concat(m.event && m.event.saved ? [{ ...m.event, name: m.event.name || '(no title)' }] : []);
          items.sort((a, b) => a.start - b.start);
          if (!items.length) C.agenda.textContent = 'No events scheduled.';
          for (const event of items) {
            const row = util.el('div', '', C.agenda);
            util.el('span', '', row, C.tl(event.start));
            util.el('span', '', row, event.name);
          }
        },
      },
    },
  });
})();
