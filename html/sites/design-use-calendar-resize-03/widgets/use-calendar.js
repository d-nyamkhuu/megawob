// Design on the shared use-calendar/workspace template.
const calendarClassicTime = minute => `${Math.floor((minute % 720) / 60) || 12}:${String(minute % 60).padStart(2, '0')}`;
const calendarClassicMonth = name => ['January','February','March','April','May','June','July','August','September','October','November','December'].indexOf(name)+1;
env.widget({
  task: 'use-calendar',
  site: 'design-use-calendar-resize-03',
  name: 'design',
  split: 'train',
  scenarios: ['resize'],
  template: 'use-calendar/workspace',
  design: {
    fontFamily: '"Trebuchet MS", Arial, sans-serif',
    colors: ['#6daeff', '#79c98c', '#ff8fbb', '#f2cb54'],
    inset: 0, axis: 100, minuteHeight: .95,
    sidebarAt: 0, narrowAt: 0,
    theme: {panel:'#ffffff', line:'#b7dcf8', accent:'#539e36', muted:'#49618c', fg:'#000b69', bg:'#f2faff'},
    parts: {
      toolbar: (base, S) => st => {
        const bar = base(st);
        for (const el of [...bar.top.children]) {
          if (![bar.today, bar.previous.parentElement, bar.period].includes(el)) el.remove();
        }
        const views = st.u.el('div', 'cal-views', bar.top);
        for (const label of ['Day', 'Week', 'Month']) {
          const b = st.u.el('button', label === 'Week' ? 'cal-view active' : 'cal-view', views, label);
          b.type = 'button';
          b.addEventListener('click', () => S.P.openMenu(st, 'view'));
        }
        bar.top.append(bar.previous.parentElement, bar.today);
        return bar;
      },
      sidebar: (base, S) => st => {
        const {u, s, body} = st;
        const side = u.el('aside', 'ac-sidebar', body);
        u.el('h1', 'cal-heading', side, 'Team Calendar');
        S.P.miniCalendar(st, side);
        S.P.sidebarHeading(st, side, 'My Calendars');
        ['My Events', 'Team Meetings', 'Project Alpha', 'Marketing', 'Holidays'].forEach((name, i) => S.P.calendarRow(st, side, name, i));
        S.P.sidebarHeading(st, side, 'Other People’s Calendars');
        s.people.forEach((name, i) => S.P.personRow(st, side, name, i));
      },
      miniCalendar: (base, S) => (st, side) => {
        const {s,u} = st;
        const head = u.el('div', 'ac-mini-head', side);
        u.el('span', '', head, '◀');
        u.el('strong', '', head, `${s.month} 2027`);
        u.el('span', '', head, '▶');
        const mini = u.el('div', 'ac-mini', side);
        ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(w => u.el('span', 'ac-muted', mini, w));
        for(let k=0; k<(s.firstWeekday+1)%7; k++) u.el('span', '', mini);
        for(let d=1; d<=s.monthDays; d++) u.el('span', d===8?'today':d>8&&d<=12?'ac-range':'', mini, String(d));
      },
      sidebarHeading: () => (st, side, text) => st.u.el('h2', 'ac-subtitle', side, text),
      calendarRow: (base, S) => (st, side, name, i) => {
        const row = st.u.el('div', 'ac-person', side);
        row.style.setProperty('--tone', i===4?'#b493f2':S.D.colors[i%4]);
        st.u.el('span', 'cal-checkbox', row, '✓');
        st.u.el('i', 'cal-swatch', row);
        st.u.el('span', '', row, name);
      },
      personRow: (base, S) => (st, side, name, i) => S.P.calendarRow(st, side, name, i),
      workspace: base => st => {
        const parts = base(st);
        parts.context.hidden = true;
        return parts;
      },
      inspector: base => st => {
        const inspector = base(st);
        inspector.querySelector('.ac-inspector-head').hidden = true;
        return inspector;
      },
      details: base => st => {
        const parts = base(st);
        const zone = st.u.el('div', 'cal-detail-timezone');
        zone.textContent = 'Universal Time (UTC)';
        parts.room.before(zone);
        return parts;
      },
      timeHeader: (base, S) => st => {
        const {s,u,main,refs} = st;
        const header = u.el('div', 'ac-head', main);
        refs.axis = S.D.axis;
        const axis = u.el('div', 'ac-axis-head', header);
        axis.style.width = `${refs.axis}px`;
        u.el('span', '', axis, 'UTC');u.el('span', '', axis, 'ET');
        const weekend = (name, date) => {
          const h = u.el('div', 'ac-day-head cal-weekend-head', header);
          u.el('span', 'ac-head-name', h, `${name} ${calendarClassicMonth(s.month)}`);u.el('b', '', h, String(date));
          return h;
        };
        refs.sunday = weekend('Sun', 7);
        const names = ['Mon','Tue','Wed','Thu','Fri'];
        refs.count = 5; refs.dayHeads = [];
        names.forEach((name, i) => {
          const h = S.P.dayHeader(st, header, name, i);
          h.querySelector('.ac-head-name span').textContent = `${name} ${calendarClassicMonth(s.month)}`;
        });
        refs.saturday = weekend('Sat', 13);
        return names;
      },
      allDay: () => () => {},
      timeGrid: base => (st, names) => {
        const out = base(st, names);
        for (const el of [out.columns, out.eventLayer]) {
          el.style.left = 'calc(100px + (100% - 100px) / 7)';
          el.style.right = 'calc((100% - 100px) / 7)';
        }
        st.u.el('div', 'cal-weekend sunday', out.grid);
        st.u.el('div', 'cal-weekend saturday', out.grid);
        return out;
      },
      rulers: (base, S) => (st, grid, axis) => {
        const {s,u,f} = st;
        const rulers = u.el('div', 'ac-rulers', grid);
        rulers.style.width = `${axis}px`;
        const visibleEnd = s.open + Math.max(s.close-s.open, (st.ctx.size.height-111)/S.D.minuteHeight);
        for(let t=s.open; t<visibleEnd; t+=60) {
          const row = u.el('div', 'ac-hour-label', rulers);
          row.style.top = `${Math.max(10,(t-s.open)*S.D.minuteHeight)}px`;
          u.el('span','',row,calendarClassicTime(t));
          u.el('span','',row,calendarClassicTime((t-300+1440)%1440));
        }
      },
      timeEvent: base => (st, layer, event) => {
        const parts = base(st, layer, event);
        parts.el.prepend(parts.el.querySelector('small'));
        parts.el.querySelector('.ac-event-location').hidden = true;
        return parts;
      },
      positionEvent: base => (st, el, event, id) => {
        base(st, el, event, id);
        if(el) el.querySelector('small').textContent = `${calendarClassicTime(event.start)} – ${calendarClassicTime(event.start+event.duration)}`;
      },
      paintDetails: (base, S) => (st, model) => {
        const result = base(st, model);
        const event = model.events[result.id];
        if(result.exists) {
          const weekday = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][(st.s.firstWeekday+event.day-1)%7];
          st.startLine.textContent = `${weekday}, ${st.f.helpers.dateLabel(st.s, event.day)}`;
          const period = t => t<720?'AM':'PM';
          st.endLine.textContent = `${calendarClassicTime(event.start)} ${period(event.start)} – ${calendarClassicTime(event.start+event.duration)} ${period(event.start+event.duration)}`;
          st.room.textContent = result.id===st.s.target ? st.s.room : st.roomNames.get(result.id);
        }
        return result;
      },
      paintExtra: (base, S) => (st, id, exists) => {
        if(!st.refs.extra || st.guestState===`${id}/${exists}`) return;
        st.guestState = `${id}/${exists}`;
        const {u,s,refs} = st;
        refs.extra.replaceChildren();
        const guests = u.el('div', 'ac-guests', refs.extra);
        u.el('h2','ac-section-heading',guests,`Attendees (${s.people.length})`);
        s.people.forEach((name,i)=>S.P.guest(st, guests, name, i, exists));
        const actions = u.el('div', 'cal-detail-actions', refs.extra);
        for(const [icon,label] of [['edit','Edit Event'],['copy','Duplicate'],['delete','Delete']]) {
          const row = u.el('div','cal-detail-action',actions);
          const svg = u.svg('svg',{viewBox:'0 0 24 24',class:`cal-action-icon ${icon}`,'aria-hidden':'true'},row);
          if(icon==='edit') {
            u.svg('path',{d:'M4 3h12v18H3V3z',fill:'#eef9ff',stroke:'#428de4'},svg);
            u.svg('path',{d:'m9 15 9-12 4 3-9 12-5 2z',fill:'#ffc94c',stroke:'#c38a1a'},svg);
            u.svg('path',{d:'m17 5 4 3M6 6h5M6 9h4M6 12h2',fill:'none',stroke:'#3e8ae0'},svg);
          } else if(icon==='copy') {
            u.svg('path',{d:'M3 3h13v15H3zM7 6h14v16H7z',fill:'#f5fcff',stroke:'#3581d1','stroke-width':1.5},svg);
            u.svg('path',{d:'M10 9h8v10h-8z',fill:'#d5eaff',stroke:'#73a3e2'},svg);
          } else {
            u.svg('path',{d:'m5 3 7 7 7-7 3 3-7 7 7 7-3 3-7-7-7 7-3-3 7-7-7-7z',fill:'#eb7078',stroke:'#c6363c'},svg);
          }
          const link = u.el('button','',row,label);
          link.type='button';
          link.addEventListener('click',()=>env.log('decoy',{label}));
        }
      },
      guest: () => (st, parent, name, i) => {
        const row = st.u.el('div', 'ac-guest', parent);
        st.u.el('i', i===st.s.people.length-1?'cal-attendee-dot pending':'cal-attendee-dot', row);
        st.u.el('span','',row,name+(i===0?' (Organizer)':''));
      },
      status: () => () => {},
      painted: () => (st, model) => {
        const offset = (model.browse||0)*7;
        st.refs.sunday.querySelector('b').textContent = String(7+offset);
        st.refs.saturday.querySelector('b').textContent = String(13+offset);
        st.refs.columns.querySelectorAll('.ac-column').forEach((col,i)=>col.classList.toggle('cal-selected-day',model.events[st.s.target].day===i+8));
      },
    },
  },
});
