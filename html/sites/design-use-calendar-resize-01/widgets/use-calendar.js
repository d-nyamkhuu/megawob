// Design on the shared use-calendar/workspace template.
const openLookClock = (minutes, suffix = false) => {
  const hour = Math.floor(minutes / 60) % 24;
  return `${hour % 12 || 12}:${String(minutes % 60).padStart(2, '0')}${suffix ? hour >= 12 ? ' PM' : ' AM' : ''}`;
};
env.widget({
  task: 'use-calendar',
  site: 'design-use-calendar-resize-01',
  name: 'design',
  split: 'train',
  scenarios: ['resize'],
  template: 'use-calendar/workspace',
  design: {
    axis: 0,
    sidebarAt: 0,
    narrowAt: 0,
    minuteHeight: 1.22,
    colors: ['#b9d2fb', '#c0e6c1', '#fbe7a0', '#cdb3fa'],
    parts: {
      styles: (base, S) => st => `@layer calendar-base {${base(st)}}`,
      frame: (base, S) => st => {
        const root = base(st);
        root.classList.add('ol-calendar');
        root.style.setProperty('--ol-scale', Math.min(1.08, st.ctx.size.width / 1536));
        return root;
      },
      toolbar: (base, S) => st => {
        const {u, root, s} = st;
        const top = u.el('div', 'ac-toolbar ol-views', root);
        for (const name of ['Day', 'Week', 'Month']) {
          const button = u.el('button', name === 'Week' ? 'ol-active' : '', top, name);
          button.addEventListener('click', () => S.P.openMenu(st, 'view'));
        }
        const nav = st.monthNavigation = u.el('div', 'ol-month-navigation');
        const previous = u.el('button', '', nav, '◀');
        previous.title = 'Previous week';
        previous.addEventListener('click', () => S.P.browse(st, -1));
        const today = u.el('button', 'ol-month-name', nav, `${s.month} 2027`);
        today.title = 'Return to the shared dates';
        today.addEventListener('click', () => S.P.browse(st, 0));
        const next = u.el('button', '', nav, '▶');
        next.title = 'Next week';
        next.addEventListener('click', () => S.P.browse(st, 1));
        const period = u.el('div', 'ac-period ol-range');
        st.range = period;
        return {top, today, previous, next, period};
      },
      sidebar: (base, S) => st => {
        const side = st.u.el('aside', 'ac-sidebar ol-sidebar', st.body);
        side.appendChild(st.monthNavigation);
        S.P.miniCalendar(st, side);
        side.appendChild(st.range);
        st.sideRuler = st.u.el('div', 'ol-side-ruler', side);
        for (let time = st.s.open; time < st.s.close; time += 60) {
          const row = st.u.el('div', 'ol-ruler-row', st.sideRuler);
          st.u.el('span', '', row, openLookClock(time));
          st.u.el('span', '', row, openLookClock(time + 180));
        }
      },
      miniCalendar: (base, S) => (st, side) => {
        const mini = st.u.el('div', 'ac-mini', side);
        ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach(day => st.u.el('span', '', mini, day));
        const first = (st.s.firstWeekday + 1) % 7;
        const cells = Math.ceil((first + st.s.monthDays) / 7) * 7;
        for (let i = 0; i < cells; i++) {
          const date = i - first + 1;
          const outside = date < 1 || date > st.s.monthDays;
          const value = date < 1 ? 31 + date : date > st.s.monthDays ? date - st.s.monthDays : date;
          st.u.el('span', outside ? 'ol-outside' : date === 8 ? 'today' : '', mini, String(value));
        }
      },
      workspace: (base, S) => st => {
        const main = st.u.el('div', 'ac-main', st.body);
        const context = st.u.el('div', 'ol-context', main);
        const contextTitle = st.u.el('span', '', context);
        return {main, context, contextTitle};
      },
      inspector: (base, S) => st => {
        const inspector = st.u.el('aside', 'ac-inspector ol-inspector', st.body);
        const head = st.u.el('div', 'ac-inspector-head', inspector, 'Event Details');
        st.u.el('span', 'ol-pin', head);
        return inspector;
      },
      details: (base, S) => st => {
        const {u, s} = st;
        const details = u.el('div', 'ol-details');
        const field = (label, cls, text, gadget) => {
          const row = u.el('div', `ol-field ${cls || ''}`, details);
          u.el('div', 'ol-label', row, label);
          const box = u.el('div', `ol-value ${gadget ? 'ol-' + gadget : ''}`, row);
          const value = u.el('span', '', box, text || '');
          return value;
        };
        const detailTitle = field('Title:');
        st.dateValue = field('Date:', '', '', 'dropdown');
        const startLine = field('Start time:', 'ol-short', '', 'spinner');
        const detailDuration = field('Duration:', 'ol-short', '', 'spinner');
        const endLine = field('End time:', 'ol-short ol-disabled');
        field('Time zone:', 'ol-zone', '(GMT-8:00) Pacific Time (US & Canada)', 'dropdown');
        const room = field('Location:');
        const attendees = field('Attendees:', 'ol-attendee-field', '', 'scroll');
        attendees.className = 'ol-attendees';
        s.people.forEach((name, i) => {
          const row = u.el('div', 'ol-attendee', attendees);
          u.el('span', i < s.people.length - 1 ? 'ol-checkbox ol-checked' : 'ol-checkbox', row, i < s.people.length - 1 ? '✓' : '');
          u.el('span', '', row, name);
        });
        field('Description:', 'ol-description', 'Review progress, discuss open questions and agree on next steps.', 'scroll');
        u.el('div', 'ol-form-divider', details);
        const busy = field('Show as:', '', 'Busy', 'dropdown');
        busy.className = 'ol-busy';
        field('Reminder:', 'ol-short', '15 minutes', 'dropdown');
        const code = u.el('span', 'ol-code', details);
        return {details, detailTitle, detailDuration, startLine, endLine, room, code};
      },
      timeHeader: (base, S) => st => {
        const names = base(st);
        const zones = st.u.el('div', 'ol-zones', st.main);
        names.forEach(() => {
          const day = st.u.el('div', '', zones);
          st.u.el('span', '', day, 'PST');
          st.u.el('span', '', day, 'EST');
        });
        return names;
      },
      allDay: (base, S) => st => {},
      currentTime: (base, S) => (st, grid, axis) => {
        base(st, grid, axis);
        st.refs.now.style.display = 'none';
      },
      timeEvent: (base, S) => (st, layer, event) => {
        const result = base(st, layer, event);
        if (event.id === st.s.target) result.el.style.setProperty('--tone', '#cab0f4');
        return result;
      },
      positionEvent: (base, S) => (st, el, event, id) => {
        base(st, el, event, id);
        if (el) el.querySelector('small').textContent = `${openLookClock(event.start)} – ${openLookClock(event.start + event.duration)}`;
      },
      paintDetails: (base, S) => (st, model) => {
        const result = base(st, model);
        const e = model.events[result.id];
        st.startLine.textContent = openLookClock(e.start, true);
        st.endLine.textContent = openLookClock(e.start + e.duration, true);
        st.detailDuration.textContent = `${e.duration} minutes`;
        const weekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][(e.day - 8 + 35) % 5];
        st.dateValue.textContent = `${weekday}, ${st.s.month.slice(0, 3)}. ${e.day}, 2027`;
        st.room.textContent = result.id === st.s.target ? st.s.room : st.roomNames.get(result.id);
        return result;
      },
      paintExtra: (base, S) => st => {},
      status: (base, S) => st => {},
      rendered: (base, S) => st => {
        // Move the episode's side note into the inspector, retaining its own DOM.
        const panel = document.querySelector('.ref-panel');
        if (panel) st.root.querySelector('.ol-inspector').children[0].after(panel);
      },
    },
  },
});
