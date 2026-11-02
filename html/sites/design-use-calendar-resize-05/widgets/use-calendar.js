// Design on the shared use-calendar/workspace template.
const openLookClock = (minutes, suffix = false) => {
  const hour = Math.floor(minutes / 60) % 24;
  return `${hour % 12 || 12}:${String(minutes % 60).padStart(2, '0')}${suffix ? hour >= 12 ? ' PM' : ' AM' : ''}`;
};
env.widget({
  task: 'use-calendar',
  site: 'design-use-calendar-resize-05',
  name: 'design',
  split: 'train',
  scenarios: ['resize'],
  template: 'use-calendar/workspace',
  design: {
    axis: 0,
    sidebarAt: 0,
    narrowAt: 0,
    minuteHeight: 1.12,
    colors: ['#b9dfff', '#d2f2cc', '#dec7fa', '#ffbfc1'],
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
        const previous = u.el('button', '', nav, '‹');
        previous.title = 'Previous week';
        previous.addEventListener('click', () => S.P.browse(st, -1));
        const today = u.el('button', 'ol-month-name', nav, `${s.month} 2027`);
        today.title = 'Return to the shared dates';
        today.addEventListener('click', () => S.P.browse(st, 0));
        const next = u.el('button', '', nav, '›');
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
        const lists = st.u.el('div', 'ol-side-lists', side);
        const section = (title) => {
          const box = st.u.el('section', 'ol-side-section', lists);
          const head = st.u.el('div', 'ol-side-title', box);
          st.u.el('strong', '', head, title);
          st.u.el('span', '', head, '⌄');
          return box;
        };
        const calendars = section('My Calendars');
        ['My Calendar', 'Team', 'Product', 'Personal'].forEach((name, i) => {
          const row = st.u.el('div', 'ol-side-item', calendars);
          st.u.el('span', `ol-side-check ol-check-${i}`, row, i < 3 ? '✓' : '');
          st.u.el('span', '', row, name);
        });
        const people = section('Team Members');
        st.s.people.slice(0, 5).forEach((name, i) => {
          const row = st.u.el('div', 'ol-side-item', people);
          st.u.el('span', `ol-side-dot ol-dot-${i}`, row);
          st.u.el('span', '', row, name);
        });
        const tip = st.u.el('div', 'ol-side-tip', side);
        st.u.el('span', 'ol-tip-icon', tip, '💡');
        const copy = st.u.el('div', '', tip);
        st.u.el('strong', '', copy, 'Calendar Tips');
        st.u.el('div', '', copy, 'Drag to move events, or drag the bottom edge to change duration. Use the mouse wheel to scroll time slots. Toggle calendars to view availability.');
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
        const options = st.u.el('div', 'ol-context-options', context);
        st.u.el('button', '', options, 'Week　⌄');
        st.u.el('button', '', options, 'Pacific Time (PT)　⌄');
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
        return base(st);
      },
      allDay: (base, S) => st => {},
      currentTime: (base, S) => (st, grid, axis) => {
        base(st, grid, axis);
        st.refs.now.style.display = 'none';
      },
      timeEvent: (base, S) => (st, layer, event) => {
        const result = base(st, layer, event);
        return result;
      },
      positionEvent: (base, S) => (st, el, event, id) => {
        base(st, el, event, id);
        if (el) el.querySelector('small').textContent = `${openLookClock(event.start, true)} – ${openLookClock(event.start + event.duration, true)}`;
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
        const toolbar = document.querySelector('.app-toolbar');
        const slot = toolbar && toolbar.querySelector('.app-slot-nav');
        if (slot) slot.appendChild(st.root.querySelector('.ol-views'));
        const context = st.root.querySelector('.ol-context');
        if (context) {
          context.prepend(st.range);
          const instruction = document.querySelector('.ref-instruction');
          if (instruction) {
            context.querySelector('.ol-context-options').before(instruction);
            const close = st.u.el('button', 'ol-note-close', instruction, '×');
            close.type = 'button';
            close.setAttribute('aria-label', 'Dismiss task note');
            close.addEventListener('click', () => { instruction.style.display = 'none'; });
          }
        }
        st.root.querySelectorAll('.ac-day-head b').forEach(label => {
          label.dataset.month = st.s.month.slice(0, 3);
        });
        const ruler = st.root.querySelector('.ac-rulers');
        if (ruler) ruler.querySelectorAll('*').forEach(label => {
          if (label.childElementCount) return;
          const match = /^(\d{1,2}):(\d{2})$/.exec(label.textContent.trim());
          if (match) label.textContent = openLookClock(Number(match[1]) * 60 + Number(match[2]), true);
        });
        const back = toolbar && toolbar.querySelector('.tool-back');
        const next = toolbar && toolbar.querySelector('.tool-next');
        if (back) back.addEventListener('click', () => S.P.browse(st, -1));
        if (next) next.addEventListener('click', () => S.P.browse(st, 1));
      },
    },
  },
});
